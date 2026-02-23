const data = require('./data');

// 3) Define resolvers
const resolvers = {
    Query: {
        hello: () => 'Hello from GraphQL API!',
        books: () => data.books,
        book: (_, args) => {
            return data.books.find((b) => b.id === args.id);
        },
    },
    Mutation: {
        addBook: (_, args) => {
            const newBook = {
                id: String(data.books.length + 1),
                title: args.title,
                author: args.author,
            };
            data.books.push(newBook);
            return newBook;
        },
    },
};

module.exports = { resolvers };