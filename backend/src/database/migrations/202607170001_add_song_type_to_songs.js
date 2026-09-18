exports.up = async function up(knex) {
  const hasColumn = await knex.schema.hasColumn('songs', 'song_type');
  if (!hasColumn) {
    await knex.schema.table('songs', (table) => {
      table.string('song_type', 80).notNullable().defaultTo('Original').after('genre');
    });
  }
};

exports.down = async function down(knex) {
  const hasColumn = await knex.schema.hasColumn('songs', 'song_type');
  if (hasColumn) {
    await knex.schema.table('songs', (table) => {
      table.dropColumn('song_type');
    });
  }
};
