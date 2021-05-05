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
    createdAt: String!
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
    token: String
  }

  type UpdatedUser {
    id: ID!
    fullname: String!
    role: String!
    createdAt: String
    email: String!
  }

  """
  Get Log Input
  Used to identify which log to get
  """
  input getLogInput {
    logId: ID!
  }

  """
  Register Input
  """
  input RegisterInput {
    fullname: String!
    password: String!
    confirmpassword: String!
    email: String!
    role: String!
  }

  """
  Login Input
  """
  input LoginInput {
    email: String!
    password: String!
  }

  """
  Create Log Input
  """
  input CreateLogInput {
    body: String!
    phoneNumber: String!
  }

  """
  Update User Data Type
  """
  input UpdateUserInput {
    id: ID!
    fullname: String!
    password: String!
    role: String!
    email: String!
  }

  """
  Query
  """
  type Query {
    getLogs: [Log]
    getLog(input: getLogInput!): Log
    getCurrentUserLogs: [Log]
    getUsers: [User]
    getCurrentUser: UpdatedUser
  }

  """
  Mutations
  """
  type Mutation {
    register(input: RegisterInput): User!
    login(input: LoginInput): User!
    createLog(input: CreateLogInput!): Log!
    updateUser(input: UpdateUserInput!): UpdatedUser!
  }
`;

module.exports = typeDefs;
