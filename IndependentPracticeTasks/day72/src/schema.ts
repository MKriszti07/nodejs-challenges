import { createSchema } from 'graphql-yoga';

type Book = { id: string; title: string; author: string };

const BOOKS: Book[] = [
    { id: '1', title: 'Node Patterns', author: 'Mario' },
    { id: '2', title: 'GraphQL in Action', author: 'Samer' },
    { id: '3', title: 'You do not Know JS', author: 'Kyle' },
    { id: '4', title: 'Designing Data-Intensive Apps', author: 'Martin' },
];

function busyWait(ms: number) {
    const start = Date.now();
    while (Date.now() - start < ms) {
        // intentional CPU burn for demo
    }
}

export const schema = createSchema({
    typeDefs: /* GraphQL */ `
        type Book {
            id: ID!
            title: String!
            author: String!
        }

        type Query {
            book(id: ID!): Book
            searchBooks(q: String!, limit: Int! = 5): [Book!]!
            heavyStats(iteration: Int! = 50000): String!
        }
    `,
    resolvers: {
        Query: {
            book: (_parent, args: { id: string }) => {
                return BOOKS.find(b => b.id === args.id) ?? null;
            },

            searchBooks: (_parent, args: { q: string; limit: number }) => {
                const { q, limit } = args;
                const needle = q.toLowerCase();

                // simulate some work proportional to limit
                busyWait(Math.min(40, Math.max(0, limit)) * 2);

                return BOOKS
                    .filter(b => b.title.toLowerCase().includes(needle) || b.author.toLowerCase().includes(needle))
                    .slice(0, Math.max(0, Math.min(50, limit)));
            },

            heavyStats: (_parent, args: { iterations: number }) => {
                // simulate heavy computation
                const it = Math.max(0, Math.min(2_000_000, args.iterations));
                busyWait(Math.min(250, Math.floor(it / 10_000)));

                return `Computed heavyStats with iterations=${it}`;
            }
        }
    }
});