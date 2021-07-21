module.exports = function asyncMiddlewhere(handler) {
  async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (ex) {
      next(ex);
    }
  };
};
