require('dotenv').config();

const connection = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'music_player'
};

module.exports = {
  development: {
    client: 'mysql2',
    connection,
    migrations: {
      directory: './src/database/migrations'
    },
    seeds: {
      directory: './src/database/seeds'
    },
    pool: {
      min: 2,
      max: 10
    }
  },
  production: {
    client: 'mysql2',
    connection,
    migrations: {
      directory: './src/database/migrations'
    },
    pool: {
      min: 2,
      max: 20
    }
  }
};
