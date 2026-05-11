import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";
import { schema } from "./schema.js";
import { createRateLimitPlugin } from "./rateLimit.js";

const yoga = createYoga({
  schema,
  graphiql: true,
  plugins: [
    createRateLimitPlugin({
      windowMs: 30_000, // 30s window
      maxRequests: 20, // max 20 requests / 30s
      maxCost: 120, // max total cost / 30s
    }),
  ],
});

const server = createServer(yoga);

const port = Number(process.env.PORT) || 4000;
server.listen(port, () => {
  console.log(`GraphQL ready on http://localhost:${port}/graphql`);
  console.log(
    `Try with: curl -H "content-type: application/json" -H "x-api-key: demo" ...`,
  );
});
