// 2) Define GraphQL schema (type definitions)
const typeDefs = `#graphql
  type Book {
    id: ID!
    title: String!
    author: String!
  }

  type Query {
    hello: String!
    books: [Book!]!
    book(id: ID!): Book
  }

  type Mutation {
    addBook(title: String!, author: String!): Book!
  }
`;

module.exports = { typeDefs };