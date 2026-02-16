const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const typeDefs = require('./schema');
const resolvers = require('./resolves');

// Create Apollo Server instance
const server = new ApolloServer({
    typeDefs,
    resolvers,
    // Custom error formatting (optional)
    formatError: (formattedError, error) => {
        console.error(error);
        return {
            message: formattedError.message,
            locations: formattedError.locations,
            path: formattedError.path,
        };
    },
});

// Start the server
const startServer = async () => {
    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
        // Context function (useful for authentication)
        context: async ({ req }) => {
            // You can add authentication logic here
            return { req };
        },
    });

    console.log(`🚀 GraphQL Server ready at ${url}`);
    console.log(`📝 Use Apollo Studio to explore: ${url}`);
};

startServer().catch((error) => {
    console.error('Failed to start server:', error);
});