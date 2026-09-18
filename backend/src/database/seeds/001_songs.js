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
    },
    {
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      genre: 'Pop',
      duration_seconds: 200,
      cover_url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80',
      audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
    },
    {
      title: 'Shape of You',
      artist: 'Ed Sheeran',
      album: 'Divide',
      genre: 'Pop',
      duration_seconds: 233,
      cover_url: 'https://images.unsplash.com/photo-1499415479124-43c32433a620?auto=format&fit=crop&w=800&q=80',
      audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
    },
    {
      title: 'Levitating',
      artist: 'Dua Lipa',
      album: 'Future Nostalgia',
      genre: 'Dance',
      duration_seconds: 203,
      cover_url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80',
      audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
    },
    {
      title: 'Someone Like You',
      artist: 'Adele',
      album: '21',
      genre: 'Soul',
      duration_seconds: 285,
      cover_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3'
    },
    {
      title: 'Uptown Funk',
      artist: 'Mark Ronson ft. Bruno Mars',
      album: 'Uptown Special',
      genre: 'Funk',
      duration_seconds: 270,
      cover_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
      audio_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
    }
  ]);
};
