const bcrypt = require('bcryptjs');

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

function createUserService({ userRepository }) {
  return {
    me: async (userId) => publicUser(await userRepository.findById(userId)),
    updateProfile: async (userId, payload) => {
      const user = await userRepository.updateById(userId, {
        name: payload.name,
        phone: payload.phone,
        city: payload.city
      });
      return publicUser(user);
    },
    changePassword: async (userId, payload) => {
      if (!payload.newPassword || payload.newPassword.length < 6) {
        const error = new Error('New password must be at least 6 characters.');
        error.status = 400;
        throw error;
      }

      const passwordHash = await bcrypt.hash(payload.newPassword, 10);
      await userRepository.updateById(userId, { password_hash: passwordHash });
      return { message: 'Password updated successfully.' };
    },
    updateNotifications: async (userId, payload) => {
      const user = await userRepository.updateById(userId, {
        email_notifications: Boolean(payload.emailNotifications),
        push_notifications: Boolean(payload.pushNotifications)
      });
      return publicUser(user);
    }
  };
}

module.exports = createUserService;
