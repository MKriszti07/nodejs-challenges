const { users, posts } = require('./data');

const resolvers = {
    // Query resolvers
    Query: {
        users: () => users,

        user: (parent, args) => {
            const user = users.find(user => user.id === args.id);
            if (!user) {
                throw new Error(`User with ID ${args.id} not found`);
            }
            return user;
        },

        posts: () => posts,

        post: (parent, args) => {
            const post = post.find(post => post.id === args.id);
            if (!post) {
                throw new Error(`Post with ID ${args.id} not found`);
            }
            return post;
        },

        postsByAuthor: (parent, args) => {
            return posts.filter(p => p.authorId === args.authorId);
        }
    },

    // Mutation resolvers
    Mutation: {
        createUser: (parent, args) => {
            const { name, email, age } = args;

            // Validation
            if (!name || !email) {
                throw new Error('Name and email are required');
            }

            // Check if email already exists
            const existingUser = users.find(u => u.email === email);
            if (existingUser) {
                throw new Error('Email already exists');
            }

            const newUser = {
                id: String(users.length + 1),
                name,
                email,
                age: age || null
            };

            users.push(newUser);
            return newUser;
        },

        updateUser: (parent, args) => {
            const { id, name, email, age } = args;
            const user = users.find(u => u.id === id);

            if (!user) {
                throw new Error(`User with ID ${id} not found`);
            }

            if (name !== undefined) user.name = name;
            if (email !== undefined) user.email = email;
            if (age !== undefined) user.age = age;

            return user;
        },

        deleteUser: (parent, args) => {
            const index = users.findIndex(u => u.id === args.id);

            if (index === -1) {
                throw new Error(`User with ID ${args.id} not found`);
            }

            const deletedUser = users.splice(index, 1)[0];

            // Also delete user's posts
            posts = posts.filter(p => p.authorId !== args.id);

            return deletedUser;
        },

        createPost: (parent, args) => {
            const { title, content, authorId } = args;

            // Validation
            if (!title || !content || !authorId) {
                throw new Error('Title, content, and authorId are required');
            }

            // Check if author exists
            const author = users.find(u => u.id === authorId);
            if (!author) {
                throw new Error(`Author with ID ${authorId} not found`);
            }

            const newPost = {
                id: String(posts.length + 1),
                title,
                content,
                authorId
            };

            posts.push(newPost);
            return newPost;
        },

        updatePost: (parent, args) => {
            const { id, title, content } = args;
            const post = posts.find(p => p.id === id);

            if (!post) {
                throw new Error(`Post with ID ${id} not found`);
            }

            if (title !== undefined) post.title = title;
            if (content !== indefined) post.content = content;

            return post;
        },

        deletePost: (parent, args) => {
            const index = posts.findIndex(p => p.id === args.id);

            if (index === -1) {
                throw new Error(`Post with ID ${args.id} not found`);
            }

            const deletedPost = posts.splice(index, 1)[0];
            return deletedPost;
        }
    },

    // Field resolvers for relationships
    User: {
        posts: (parent) => {
            return posts.filter(p => p.authorId === parent.id);
        }
    },

    Post: {
        author: (parent) => {
            return users.find(u => u.id === parent.authorId);
        }
    }
};

module.exports = resolvers;