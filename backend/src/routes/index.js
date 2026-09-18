const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const createApiFactory = require('../factories/apiFactory');
const { authenticate } = require('../middleware/authenticate');

const router = express.Router();
const api = createApiFactory();
const songUploadDir = path.join(__dirname, '../../uploads/songs');
const audioExtensions = new Set(['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.webm']);

fs.mkdirSync(songUploadDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, songUploadDir),
    filename: (_req, file, cb) => {
      const extension = path.extname(file.originalname).toLowerCase();
      const baseName = path.basename(file.originalname, extension).replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');
      cb(null, `${Date.now()}-${baseName || 'song'}${extension}`);
    }
  }),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    if (file.mimetype.startsWith('audio/') || audioExtensions.has(extension)) {
      cb(null, true);
      return;
    }
    cb(new Error('Only audio files are allowed.'));
  }
});

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'music-player-api' });
});

router.post('/auth/signup', api.authController.signup);
router.post('/auth/login', api.authController.login);
router.post('/auth/forgot-password/verify-email', api.authController.verifyForgotPasswordEmail);
router.post('/auth/forgot-password/reset', api.authController.resetForgotPassword);

router.get('/songs', api.songController.list);
router.post('/songs', authenticate, api.songController.create);
router.post('/songs/upload', authenticate, upload.single('audio'), api.songController.upload);
router.post('/songs/sync-local', authenticate, (req, _res, next) => {
  fs.readdir(songUploadDir, (error, files) => {
    if (error) {
      next(error);
      return;
    }
    req.localSongFiles = files;
    next();
  });
}, api.songController.syncLocal);
router.get('/songs/:id', api.songController.findById);
router.put('/songs/:id', authenticate, api.songController.update);
router.delete('/songs/:id', authenticate, api.songController.delete);

router.get('/me', authenticate, api.userController.me);
router.put('/me/profile', authenticate, api.userController.updateProfile);
router.put('/me/password', authenticate, api.userController.changePassword);
router.put('/me/notifications', authenticate, api.userController.updateNotifications);

module.exports = router;
