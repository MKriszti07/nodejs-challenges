import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import gql from 'graphql-tag';

const users = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com' }
];

const typeDefs = gql`
    type User @key(fields: "id") {
        id: ID!
        name: String!
        email: String!
    }

    type Query {
        users: [User!]!
        user(id: ID!): User
    }
`;

const resolvers = {
    Query: {
        users: () => users,
        user: (_, { id }) => users.find((user) => user.id === id) ?? null
    },
    User: {
        __resolveReference(reference) {
            return users.find((user) => user.id === reference.id) ?? null;
        }
    }
};

const server = new ApolloServer({
    schema: buildSubgraphSchema([{ typeDefs, resolvers }])
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4001 }
});

console.log(`Users subgraph ready at ${url}`);