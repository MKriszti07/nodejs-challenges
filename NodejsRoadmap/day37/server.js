const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express5');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const express = require('express');
const http = require('http');
const cors = require('cors');
const { resolvers } = require('./resolves');
const { typeDefs } = require('./schema');

const app = express();
const httpServer = http.createServer(app);

async function startServer() {
    // Set up Apollo Server
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
    await server.start();

    app.use(
      cors(),
      express.json(),
      expressMiddleware(server),
    );

    await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:4000`);
};

startServer().catch((err) => {
  console.error('Error starting server:', err);
});


