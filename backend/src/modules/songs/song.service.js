function mapSong(song) {
  return {
    id: song.id,
    title: song.title,
    artist: song.artist,
    album: song.album,
    genre: song.genre,
    durationSeconds: song.duration_seconds,
    coverUrl: song.cover_url,
    audioUrl: song.audio_url
  };
}

function createSongService({ songRepository }) {
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
    }
  };
}

module.exports = createSongService;
