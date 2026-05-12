import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import gql from 'graphql-tag';

const products = [
  { id: '101', name: 'Mechanical Keyboard', price: 99.99, sellerId: '1' },
  { id: '102', name: 'Gaming Mouse', price: 59.5, sellerId: '2' },
  { id: '103', name: '4K Monitor', price: 399.0, sellerId: '1' }
];

const typeDefs = gql`
    extend schema
        @link(url: "https://specs.apollo.dev/federation/v2.3", import: ["@key"])

    type Product @key(fields: "id") {
        id: ID!
        name: String!
        price: Float!
        seller: User!
    }

    type Query {
        products: [Product!]!
        product(id: ID!): Product
    }

    type User @key(fields: "id") {
        id: ID!
    }
`;

const resolvers = {
    Query: {
        products: () => products,
        product: (_, { id }) => products.find((product) => product.id === id) ?? null
    },
    Product: {
        seller(product) {
            return { __typename: 'User', id: product.sellerId };
        }
    }
};

const server = new ApolloServer({
    schema: buildSubgraphSchema([{ typeDefs, resolvers }])
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4002 }
});

console.log(`Products subgraph ready at ${url}`);