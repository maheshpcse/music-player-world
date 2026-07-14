function createUserController({ userService }) {
  return {
    me: async (req, res, next) => {
      try {
        res.json(await userService.me(req.user.id));
      } catch (error) {
        next(error);
      }
    },
    updateProfile: async (req, res, next) => {
      try {
        res.json(await userService.updateProfile(req.user.id, req.body));
      } catch (error) {
        next(error);
      }
    },
    changePassword: async (req, res, next) => {
      try {
        res.json(await userService.changePassword(req.user.id, req.body));
      } catch (error) {
        next(error);
      }
    },
    updateNotifications: async (req, res, next) => {
      try {
        res.json(await userService.updateNotifications(req.user.id, req.body));
      } catch (error) {
        next(error);
      }
    }
  };
}

module.exports = createUserController;
