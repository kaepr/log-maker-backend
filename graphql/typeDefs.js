const { gql } = require("apollo-server-express");

const typeDefs = gql`
  """
  Log Type
  Has a user field too to handle referring to who created it
  """
  type Log {
    id: ID!
    body: String!
    phoneNumber: String!
    user: String!
  }

  """
  User Type
  Needs to have role to handle authorization
  Returns token on creation
  """
  type User {
    id: ID!
    fullname: String!
    email: String!
    role: String!
    createdAt: String!
    token: String!
  }

  """
  Query
  """
  type Query {
    getLogs: [Log]
  }

  """
  Register Input Type
  """
  input RegisterInput {
    fullname: String!
    password: String!
    confirmpassword: String!
    email: String!
    role: String!
  }

  """
  Login Type
  """
  input LoginInput {
    email: String!
    password: String!
  }

  """
  Mutations
  """
  type Mutation {
    register(input: RegisterInput): User!
    login(input: LoginInput): User!
  }
`;

module.exports = typeDefs;
