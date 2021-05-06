const Log = require("../../models/Log");
const { checkAuth } = require("../../utils/authHelper");
const { UserInputError } = require("apollo-server-express");
const { formatYupError, logSchema } = require("../../validators");

module.exports = {
  Query: {
    async getLogs() {
      try {
        return await Log.find().sort({ createdAt: -1 });
      } catch (err) {
        throw new Error(err);
      }
    },

    async getCurrentUserLogs(_, __, context, info) {
      try {
        const user = await checkAuth(context);
        const logs = await Log.find({ user: user.id }).sort({ createdAt: -1 });

        return logs;
      } catch (err) {
        throw new Error(err);
      }
    },

    async getLog(_, { input: { logId } }, context, info) {
      try {
        const user = await checkAuth(context);
        const log = await Log.findById(logId);

        if (!log) {
          throw new Error("Given post id does not exist");
        }

        if (String(log.user) !== user.id) {
          throw new Error("Invalid User");
        }

        if (!log) {
          throw new Error("Log not found");
        }

        return log;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  Mutation: {
    async createLog(_, { input }, context, info) {
      try {
        await logSchema.validate(input, { abortEarly: false });
      } catch (err) {
        let errors = formatYupError(err);
        throw new UserInputError("Errors", {
          errors: errors,
        });
      }

      const user = await checkAuth(context);

      const { body, phoneNumber } = input;

      const newLog = new Log({
        body,
        phoneNumber,
        user: user.id,
        createdAt: new Date().toISOString(),
      });

      const log = await newLog.save();
      return log;
    },
  },
};
