require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express5');

const { makeExecutableSchema } = require('@graphql-tools/schema');
const { useServer } = require('graphql-ws/use/ws');
const { WebSocketServer } = require('ws');
const { PubSub } = require('graphql-subscriptions');

// In-memory data
let books = [
    { id: '1', title: 'The Pragmatic Programmer', author: 'Andy Hunt' },
    { id: '2', title: 'Clean Code', author: 'Robert C. Martin' },
];
let currentId = 3;

// PubSub instance for subscriptions
const pubsub = new PubSub();
const BOOK_ADDED_TOPIC = 'BOOK_ADDED';

// GraphQL schema with Subscription
const typeDefs = `#graphql
  type Book {
    id: ID!
    title: String!
    author: String!
  }

  type Query {
    books: [Book!]!
  }

  type Mutation {
    addBook(title: String!, author: String!): Book!
  }

  type Subscription {
    bookAdded: Book!
  }
`;

// Resolvers
const resolvers = {
    Query: {
        books: () => books,
    },
    Mutation: {
        addBook: async (_, { title, author }) => {
            const newBook = {
                id: String(currentId++),
                title,
                author,
            };
            books.push(newBook);

            // Publish event for subscribers
            await pubsub.publish(BOOK_ADDED_TOPIC, {
                bookAdded: newBook,
            });

            return newBook;
        },
    },
    Subscription: {
        bookAdded: {
            // Async iterator that yields whenever we publish on this topic
            subscribe: () => pubsub.asyncIterableIterator([BOOK_ADDED_TOPIC]),
        },
    },
};

async function start() {
    // Create executable schema
    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const app = express();
    const httpServer = http.createServer(app);

    // Create WebSocket server for subscriptions on same HTTP server
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql',
    });

    // Use graphql-ws to handle subscriptions
    const serverCleanup = useServer({ schema }, wsServer);
    // useServer({ schema }, wsServer);

    // Create Apollo Server
    const server = new ApolloServer({
        schema,
        plugins: [
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });

    await server.start();

    app.use(
        '/graphql',
        cors(),
        express.json(),
        expressMiddleware(server)
    );

    const PORT = process.env.PORT || 4000;

    httpServer.listen(PORT, () => {
        console.log(`🚀 Query/Mutation endpoint: http://localhost:${PORT}/graphql`);
        console.log(`🚀 Subscriptions endpoint (graphql-ws): ws://localhost:${PORT}/graphql`);
    });
}

start().catch((err) => {
    console.error('Server start error:', err);
});

//Test in Google Chrome
//http://localhost:3000/graphql

//1 tab
// subscription OnBookAdded {
//   bookAdded {
//     id
//     title
//     author
//   }
// }

//2 tab
// mutation {
//   addBook(title: "Refactoring", author: "Martin Fowler") {
//     id
//     title
//     author
//   }
// }