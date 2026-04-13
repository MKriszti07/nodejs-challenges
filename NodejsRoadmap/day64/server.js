require("dotenv").config();

const express = require("express");
const crypto = require("crypto");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express5");
const { GraphQLError } = require("graphql");

const { getUserFromAuthHeader } = require("./auth");
const {
  withMiddlewares,
  requireAuth,
  timing,
  logResolver,
} = require("./middleware");

const typeDefs = /* GraphQL */ `
  type Query {
    ping: String!
    secret: String!
    metrics: [Metric!]!
    logs: [LogEntry!]!
  }

  type Metric {
    field: String!
    ms: Int!
  }

  type LogEntry {
    field: String!
    args: String!
  }
`;

const baseResolvers = {
  Query: {
    ping: () => "pong",

    secret: (_, __, ctx) => `Top secret for ${ctx.user.username}`,

    metrics: (_, __, ctx) => ctx.metrics,

    logs: (_, __, ctx) =>
      ctx.logs.map((x) => ({ field: x.field, args: JSON.stringify(x.args) })),
  },
};

// Apply middleware per-resolver
const resolvers = {
  Query: {
    ping: withMiddlewares(baseResolvers.Query.ping, [timing, logResolver]),

    secret: withMiddlewares(baseResolvers.Query.secret, [
      timing,
      logResolver,
      requireAuth,
    ]),

    metrics: withMiddlewares(baseResolvers.Query.metrics, [requireAuth]),

    logs: withMiddlewares(baseResolvers.Query.logs, [requireAuth]),
  },
};

async function start() {
  const app = express();

  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (formattedError, error) => {
      // Convert our custom errors to GraphQLError with extensions
      if (error?.originalError?.code === "UNAUTHORIZED") {
        return new GraphQLError("Unauthorized", {
          extensions: { code: "UNAUTHORIZED", http: { status: 401 } },
        });
      }
      return formattedError;
    },
  });

  await apollo.start();

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(apollo, {
      context: async ({ req }) => {
        const requestId = req.headers["x-request-id"] || crypto.randomUUID();
        const user = getUserFromAuthHeader(req);

        return {
          requestId,
          user,
          metrics: [],
          logs: [],
        };
      },
    }),
  );

  const port = process.nextTick.PORT || 3000;
  app.listen(port, () => {
    console.log(`GraphQL: http://localhost:${port}/graphql`);
    console.log(`Try: query { ping }`);
    console.log(`Try: query { secret } (with Authorization: Bearer alice)`);
  });
}

start().catch((e) => {
    console.error(e);
    process.exit(1);
});

//query { ping }
//query { secret }

// query {
// metrics {
// field
// ms
// }
// logs {
// field
// args
// }
// }