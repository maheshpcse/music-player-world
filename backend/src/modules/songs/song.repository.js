function createSongRepository(knex) {
  return {
    list: ({ search, genre }) => {
      const query = knex('songs').select('*').orderBy('title', 'asc');

      if (search) {
        query.where((builder) => {
          builder.where('title', 'like', `%${search}%`).orWhere('artist', 'like', `%${search}%`);
        });
      }

      if (genre && genre !== 'All') {
        query.andWhere({ genre });
      }

      return query;
    },
    findById: (id) => knex('songs').where({ id }).first(),
    findByAudioUrl: (audioUrl) => knex('songs').where({ audio_url: audioUrl }).first(),
    create: async (song) => {
      const [id] = await knex('songs').insert(song);
      return knex('songs').where({ id }).first();
    },
    updateById: async (id, song) => {
      await knex('songs').where({ id }).update(song);
      return knex('songs').where({ id }).first();
    },
    deleteById: (id) => knex('songs').where({ id }).del()
  };
}

module.exports = createSongRepository;
