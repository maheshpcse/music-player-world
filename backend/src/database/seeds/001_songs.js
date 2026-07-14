exports.seed = async function seed(knex) {
  await knex('songs').del();
  await knex('songs').insert([
    {
      title: 'Midnight Tape',
      artist: 'Luna Drive',
      album: 'Neon Rooms',
      genre: 'Synth',
      duration_seconds: 218,
      cover_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80',
      audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    },
    {
      title: 'Paper Planes',
      artist: 'The Echo Lane',
      album: 'Open Windows',
      genre: 'Indie',
      duration_seconds: 184,
      cover_url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80',
      audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    },
    {
      title: 'Velvet Signal',
      artist: 'Nora Keys',
      album: 'Blue Frames',
      genre: 'Jazz',
      duration_seconds: 242,
      cover_url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80',
      audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
    }
  ]);
};
