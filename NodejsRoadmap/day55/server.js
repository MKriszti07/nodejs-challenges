const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express5");
const crypto = require("crypto");

const prisma = require("./prisma/prismaClient");

const typeDefs = /* GraphQL */ `
    type User {
        id: Int!
        email: String!
        name: String
        createdAt: String!
        posts: [Post!]!
    }

    type Post {
        id: Int!
        title: String!
        content: String
        published: Boolean!
        createdAt: String!
        author: User!
    }

    type Query {
        users: [User!]!
        user(id: Int!): User
        posts(publishedOnly: Boolean = false): [Post!]!    
    }

    type Mutation {
        createUser(email: String!, name: String): User!
      createPost(authorId: Int!, title: String!, content: String, published: Boolean = false): Post!
        publishPost(id: Int!): Post!
    }
`;

const resolvers = {
  Query: {
    users: (_, __, ctx) => ctx.prisma.user.findMany(),
    user: (_, { id }, ctx) => ctx.prisma.user.findUnique({ where: { id } }),
    posts: (_, { publishedOnly }, ctx) =>
      ctx.prisma.post.findMany({
        where: publishedOnly ? { published: true } : undefined,
      }),
  },

  Mutation: {
    createUser: (_, { email, name }, ctx) =>
      ctx.prisma.user.create({ data: { email, name } }),

    createPost: (_, { authorId, title, content, published }, ctx) =>
      ctx.prisma.post.create({
        data: { authorId, title, content, published },
      }),

    publishPost: (_, { id }, ctx) =>
      ctx.prisma.post.update({
        where: { id },
        data: { published: true },
      }),
  },

  User: {
    posts: (parent, _, ctx) =>
      ctx.prisma.post.findMany({ where: { authorId: parent.id } }),
  },

  Post: {
    author: (parent, _, ctx) =>
      ctx.prisma.user.findUnique({ where: { id: parent.authorId } }),
  },
};

async function start() {
  const app = express();

  const apollo = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apollo.start();

  //GraphQL endpoint
  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(apollo, {
      context: async ({ req }) => ({
        prisma,
        req,
        requestId: crypto.randomUUID(),
      }),
    }),
  );

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`GraphQL endpoint: http://localhost:${port}/graphql`);
    console.log(`DB: "file:./prisma/dev.db"`);
  });
}

start().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});


// query {
//   users {
//     id
//     email
//     posts { id title published }
//   }
// }