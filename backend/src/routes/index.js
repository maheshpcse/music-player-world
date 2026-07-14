const express = require('express');
const createApiFactory = require('../factories/apiFactory');
const { authenticate } = require('../middleware/authenticate');

const router = express.Router();
const api = createApiFactory();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'music-player-api' });
});

router.post('/auth/signup', api.authController.signup);
router.post('/auth/login', api.authController.login);
router.post('/auth/forgot-password/verify-email', api.authController.verifyForgotPasswordEmail);
router.post('/auth/forgot-password/reset', api.authController.resetForgotPassword);

router.get('/songs', api.songController.list);
router.get('/songs/:id', api.songController.findById);

router.get('/me', authenticate, api.userController.me);
router.put('/me/profile', authenticate, api.userController.updateProfile);
router.put('/me/password', authenticate, api.userController.changePassword);
router.put('/me/notifications', authenticate, api.userController.updateNotifications);

module.exports = router;
