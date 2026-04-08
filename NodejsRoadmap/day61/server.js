require("dotenv").config();

const express = require("express");
const crypto = require("crypto");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express5");
const { GraphQLError } = require("graphql");

const { badRequest, unauthorized, forbidden, notFound } = require("./error");

const typeDefs = /* GraphQL */ `
  type Query {
    me: String!
    user(id: ID!): String!
    crash: String!
  }

  type Mutation {
    echo(message: String!): String!
  }
`;

const resolvers = {
  Query: {
    me: (_, __, ctx) => {
      if (!ctx.user) throw unauthorized();
      return `Hello ${ctx.user}`;
    },

    user: (_, { id }, ctx) => {
      // Demonstrate validation error
      if (!/^\d+$/.test(String(id))) {
        throw badRequest("id must be numeric", "VALIDATION_ERROR", {
          field: "id",
        });
      }

      // Demonstrate not found
      if (String(id) !== "1") throw notFound(`User ${id} not found`);
      return "user-1";
    },

    crash: () => {
      // Demonstrate unexpected error
      throw new Error("Database connection failed (simulated)");
    },
  },

  Mutation: {
    echo: (_, { message }) => {
      if (message.length > 50) {
        throw badRequest(
          "message too long (max 50 chars)",
          "VALIDATION_ERROR",
          {
            field: "message",
            max: 50,
          },
        );
      }
      return message;
    },
  },
};

function isSafeError(err) {
  // Errors we created intentionally (GraphQLError with extensions.code)
  return err instanceof GraphQLError && !!err.extensions?.code;
}

async function start() {
  const app = express();

  const apollo = new ApolloServer({
    typeDefs,
    resolvers,

    // Centralized error shaping
    formatError: (formattedError, error) => {
      // formattedError is what Apollo would return by default
      // error is the original GraphQLError instance (wrapped)

      const requestId = error?.extensions?.requestId;

      // In production, mask unexpected errors
      if (process.env.NODE_ENV === "production") {
        if (!isSafeError(error)) {
          return {
            message: "Internal Server Error",
            locations: formattedError.locations,
            path: formattedError.path,
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
              requestId,
            },
          };
        }
      }

      // Keep safe errors as-is (plus requestId if present)
      return {
        ...formattedError,
        extensions: {
          ...formattedError.extensions,
          requestId,
        },
      };
    },
  });

  await apollo.start();

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(apollo, {
      context: async ({ req }) => {
        // Simple auth for practice:
        // Authorization: Bearer alice
        const auth = req.headers.authorization || "";
        const match = auth.match(/^Bearer\s+(.+)$/i);
        const user = match ? match[1] : null;

        const requestId = req.header["x-request-id"] || crypto.randomUUID();

        // We can attach requestId to GraphQL errors via extensions in resolvers if desired.
        return { user, requestId };
      },
    }),
  );

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`GraphQL endpoint: http://localhost:${port}/graphql`);
    console.log(`Try Authorization: Bearer alice`);
  });
}

start().catch((e) => {
    console.error(e);
    process.exit(1);
});

//query { me }
//query { user(id: "abc") }
//query { user(id: "2") }
//query { crash }