exports.up = async function up(knex) {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name', 120).notNullable();
    table.string('email', 160).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.string('phone', 40);
    table.string('city', 100);
    table.boolean('email_notifications').defaultTo(true);
    table.boolean('push_notifications').defaultTo(false);
    table.timestamps(true, true);
  });

  await knex.schema.createTable('songs', (table) => {
    table.increments('id').primary();
    table.string('title', 160).notNullable();
    table.string('artist', 160).notNullable();
    table.string('album', 160);
    table.string('genre', 80);
    table.integer('duration_seconds').notNullable().defaultTo(0);
    table.string('cover_url', 500);
    table.string('audio_url', 500);
    table.timestamps(true, true);
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('songs');
  await knex.schema.dropTableIfExists('users');
};
