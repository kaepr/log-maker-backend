const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const connectDB = require("./database/db");

require("dotenv").config();

// TODO Remove logs after properly testing

const PORT = process.env.PORT || 5000;

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    req,
  }),
});

const app = express();

// Connect Database
connectDB();

server.applyMiddleware({ app });

app.listen({ port: PORT }, () =>
  console.log(`Running on http://localhost:${PORT}` + server.graphqlPath)
);
