function createAuthController({ authService }) {
  return {
    signup: async (req, res, next) => {
      try {
        const result = await authService.signup(req.body);
        res.status(201).json(result);
      } catch (error) {
        next(error);
      }
    },
    login: async (req, res, next) => {
      try {
        const result = await authService.login(req.body);
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
    verifyForgotPasswordEmail: async (req, res, next) => {
      try {
        const result = await authService.verifyForgotPasswordEmail(req.body);
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
    resetForgotPassword: async (req, res, next) => {
      try {
        const result = await authService.resetForgotPassword(req.body);
        res.json(result);
      } catch (error) {
        next(error);
      }
    }
  };
}

module.exports = createAuthController;
