const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    city: user.city,
    emailNotifications: Boolean(user.email_notifications),
    pushNotifications: Boolean(user.push_notifications)
  };
}

function createAuthService({ userRepository }) {
  return {
    signup: async ({ name, email, password }) => {
      if (!name || !email || !password) {
        const error = new Error('Name, email, and password are required.');
        error.status = 400;
        throw error;
      }

      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) {
        const error = new Error('An account already exists for this email.');
        error.status = 409;
        throw error;
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await userRepository.create({ name, email, passwordHash });
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'development_secret', {
        expiresIn: '1d'
      });

      return { user: publicUser(user), token };
    },
    login: async ({ email, password }) => {
      const user = await userRepository.findByEmail(email);
      const passwordMatches = user ? await bcrypt.compare(password || '', user.password_hash) : false;

      if (!user || !passwordMatches) {
        const error = new Error('Invalid email or password.');
        error.status = 401;
        throw error;
      }

      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'development_secret', {
        expiresIn: '1d'
      });

      return { user: publicUser(user), token };
    },
    verifyForgotPasswordEmail: async ({ email }) => {
      if (!email) {
        const error = new Error('Email address is required.');
        error.status = 400;
        throw error;
      }

      const user = await userRepository.findByEmail(email);
      if (!user) {
        const error = new Error('No account was found for this email address.');
        error.status = 404;
        throw error;
      }

      return {
        message: 'Email verified. Please create a new password.',
        email: user.email
      };
    },
    resetForgotPassword: async ({ email, newPassword, confirmPassword }) => {
      if (!email || !newPassword || !confirmPassword) {
        const error = new Error('Email, new password, and confirm password are required.');
        error.status = 400;
        throw error;
      }

      if (newPassword !== confirmPassword) {
        const error = new Error('New password and confirm password must match.');
        error.status = 400;
        throw error;
      }

      if (newPassword.length < 6) {
        const error = new Error('New password must be at least 6 characters.');
        error.status = 400;
        throw error;
      }

      const user = await userRepository.findByEmail(email);
      if (!user) {
        const error = new Error('No account was found for this email address.');
        error.status = 404;
        throw error;
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);
      await userRepository.updateById(user.id, { password_hash: passwordHash });

      return { message: 'Password reset successfully. You can now login.' };
    }
  };
}

module.exports = createAuthService;
