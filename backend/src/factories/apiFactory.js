const createAuthController = require('../modules/auth/auth.controller');
const createAuthService = require('../modules/auth/auth.service');
const createUserRepository = require('../modules/users/user.repository');
const createUserController = require('../modules/users/user.controller');
const createUserService = require('../modules/users/user.service');
const createSongRepository = require('../modules/songs/song.repository');
const createSongController = require('../modules/songs/song.controller');
const createSongService = require('../modules/songs/song.service');
const knex = require('../database/knex');

function createApiFactory() {
  const userRepository = createUserRepository(knex);
  const songRepository = createSongRepository(knex);

  const authService = createAuthService({ userRepository });
  const userService = createUserService({ userRepository });
  const songService = createSongService({ songRepository });

  return {
    authController: createAuthController({ authService }),
    userController: createUserController({ userService }),
    songController: createSongController({ songService })
  };
}

module.exports = createApiFactory;
