const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const connectDB = require("./database/db");

require("dotenv").config();

const PORT = process.env.PORT || 5000;

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();

// Connect Database
connectDB();

server.applyMiddleware({ app });

app.listen({ port: PORT }, () =>
  console.log(`Now browse to http://localhost:${PORT}` + server.graphqlPath)
);
