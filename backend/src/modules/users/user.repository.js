function normalizeUser(row) {
  return row || null;
}

function createUserRepository(knex) {
  return {
    create: async ({ name, email, passwordHash }) => {
      const [id] = await knex('users').insert({
        name,
        email,
        password_hash: passwordHash
      });
      return normalizeUser(await knex('users').where({ id }).first());
    },
    findByEmail: async (email) => normalizeUser(await knex('users').where({ email }).first()),
    findById: async (id) => normalizeUser(await knex('users').where({ id }).first()),
    updateById: async (id, data) => {
      await knex('users').where({ id }).update(data);
      return normalizeUser(await knex('users').where({ id }).first());
    }
  };
}

module.exports = createUserRepository;
