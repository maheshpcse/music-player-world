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
    findById: (id) => knex('songs').where({ id }).first()
  };
}

module.exports = createSongRepository;
