const logsResolvers = require("./logs");
const usersResolvers = require("./users");

module.exports = {
  Query: {
    ...logsResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...logsResolvers.Mutation,
  },
};
