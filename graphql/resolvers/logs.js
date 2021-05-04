const Log = require("../../models/Log");

module.exports = {
  Query: {
    async getLogs() {
      try {
        return await Log.find();
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
