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
    },
    create: async (req, res, next) => {
      try {
        res.status(201).json(await songService.create(req.body));
      } catch (error) {
        next(error);
      }
    },
    update: async (req, res, next) => {
      try {
        res.json(await songService.update(req.params.id, req.body));
      } catch (error) {
        next(error);
      }
    },
    delete: async (req, res, next) => {
      try {
        res.json(await songService.delete(req.params.id));
      } catch (error) {
        next(error);
      }
    },
    upload: async (req, res, next) => {
      try {
        res.status(201).json(await songService.createFromUpload({ body: req.body, file: req.file }));
      } catch (error) {
        next(error);
      }
    },
    syncLocal: async (req, res, next) => {
      try {
        res.json({ songs: await songService.syncLocalFiles(req.localSongFiles || []) });
      } catch (error) {
        next(error);
      }
    }
  };
}

module.exports = createSongController;
