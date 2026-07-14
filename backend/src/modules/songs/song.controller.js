function createSongController({ songService }) {
  return {
    list: async (req, res, next) => {
      try {
        res.json(await songService.list(req.query));
      } catch (error) {
        next(error);
      }
    },
    findById: async (req, res, next) => {
      try {
        res.json(await songService.findById(req.params.id));
      } catch (error) {
        next(error);
      }
    }
  };
}

module.exports = createSongController;
