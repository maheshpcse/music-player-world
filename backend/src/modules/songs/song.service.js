const path = require('path');
const fs = require('fs/promises');

const publicBaseUrl = process.env.API_PUBLIC_URL || `http://localhost:${process.env.PORT || 5000}`;

function toPublicUrl(url) {
  if (!url || /^https?:\/\//i.test(url)) {
    return url;
  }
  return `${publicBaseUrl}${url.startsWith('/') ? url : `/${url}`}`;
}

function toStoredUrl(url) {
  if (!url) {
    return url;
  }

  if (url.startsWith(`${publicBaseUrl}${localUploadPrefix}`)) {
    return url.replace(publicBaseUrl, '');
  }

  return url;
}

function mapSong(song) {
  return {
    id: song.id,
    title: song.title,
    artist: song.artist,
    album: song.album,
    genre: song.genre,
    songType: song.song_type,
    durationSeconds: song.duration_seconds,
    coverUrl: toPublicUrl(song.cover_url),
    audioUrl: toPublicUrl(song.audio_url)
  };
}

const AUDIO_EXTENSIONS = new Set(['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.webm']);
const localUploadPrefix = '/uploads/songs/';
const localUploadDir = path.join(__dirname, '../../../uploads/songs');

function toTitle(fileName) {
  return path
    .basename(fileName, path.extname(fileName))
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function toSongPayload(input) {
  return {
    title: input.title,
    artist: input.artist,
    album: input.album || '',
    genre: input.genre || 'Local',
    song_type: input.songType || input.song_type || 'Original',
    duration_seconds: Number(input.durationSeconds || input.duration_seconds || 0),
    cover_url: toStoredUrl(input.coverUrl || input.cover_url || ''),
    audio_url: toStoredUrl(input.audioUrl || input.audio_url)
  };
}

function createSongService({ songRepository }) {
  async function removeLocalAudioFile(audioUrl) {
    const storedAudioUrl = toStoredUrl(audioUrl);
    if (!storedAudioUrl || !storedAudioUrl.startsWith(localUploadPrefix)) {
      return;
    }

    const fileName = path.basename(storedAudioUrl);
    const filePath = path.join(localUploadDir, fileName);
    const resolvedDir = path.resolve(localUploadDir);
    const resolvedFile = path.resolve(filePath);
    if (!resolvedFile.startsWith(resolvedDir)) {
      return;
    }

    try {
      await fs.unlink(resolvedFile);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  return {
    list: async (filters) => {
      const songs = await songRepository.list(filters);
      return songs.map(mapSong);
    },
    findById: async (id) => {
      const song = await songRepository.findById(id);
      if (!song) {
        const error = new Error('Song not found.');
        error.status = 404;
        throw error;
      }
      return mapSong(song);
    },
    create: async (input) => {
      const song = await songRepository.create(toSongPayload(input));
      return mapSong(song);
    },
    update: async (id, input) => {
      const existing = await songRepository.findById(id);
      if (!existing) {
        const error = new Error('Song not found.');
        error.status = 404;
        throw error;
      }

      const song = await songRepository.updateById(id, toSongPayload({
        ...existing,
        ...input,
        audioUrl: input.audioUrl || input.audio_url || existing.audio_url,
        coverUrl: input.coverUrl || input.cover_url || existing.cover_url,
        songType: input.songType || input.song_type || existing.song_type,
        durationSeconds: input.durationSeconds ?? input.duration_seconds ?? existing.duration_seconds
      }));
      return mapSong(song);
    },
    delete: async (id) => {
      const existing = await songRepository.findById(id);
      if (!existing) {
        const error = new Error('Song not found.');
        error.status = 404;
        throw error;
      }

      await removeLocalAudioFile(existing.audio_url);
      await songRepository.deleteById(id);
      return { message: 'Song deleted successfully.' };
    },
    createFromUpload: async ({ body, file }) => {
      if (!file) {
        const error = new Error('Audio file is required.');
        error.status = 400;
        throw error;
      }

      const song = await songRepository.create(toSongPayload({
        ...body,
        title: body.title || toTitle(file.originalname),
        artist: body.artist || 'Unknown Artist',
        audioUrl: `/uploads/songs/${file.filename}`
      }));

      return mapSong(song);
    },
    syncLocalFiles: async (files) => {
      const createdSongs = [];

      for (const fileName of files) {
        if (!AUDIO_EXTENSIONS.has(path.extname(fileName).toLowerCase())) {
          continue;
        }

        const audioUrl = `/uploads/songs/${fileName}`;
        const existing = await songRepository.findByAudioUrl(audioUrl);
        if (existing) {
          continue;
        }

        const song = await songRepository.create(toSongPayload({
          title: toTitle(fileName),
          artist: 'Local Library',
          album: 'Local Uploads',
          genre: 'Local',
          songType: 'Original',
          audioUrl
        }));
        createdSongs.push(mapSong(song));
      }

      return createdSongs;
    }
  };
}

module.exports = createSongService;
