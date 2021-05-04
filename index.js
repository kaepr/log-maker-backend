const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const connectDB = require("./database/db");

require("dotenv").config();

const Log = require("./models/Log");
const User = require("./models/User");

const PORT = process.env.PORT || 5000;

const typeDefs = gql`
  type Log {
    id: ID!
    body: String!
    phoneNumber: String!
    user: String!
  }

  type Query {
    getLogs: [Log]
  }
`;

const resolvers = {
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

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();

// Connect Database
connectDB();

server.applyMiddleware({ app });

app.listen({ port: PORT }, () =>
  console.log(`Now browse to http://localhost:${PORT}` + server.graphqlPath)
);
