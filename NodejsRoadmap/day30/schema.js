const typeDefs = `
  # User type definition
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
  }

  # Post type definition
  type Post {
    id: ID!
    title: String!
    content: String!
    authorId: ID!
    author: User!
  }

  # Query type - Read operations
  type Query {
    # Get all users
    users: [User!]!
    
    # Get a single user by ID
    user(id: ID!): User
    
    # Get all posts
    posts: [Post!]!
    
    # Get a single post by ID
    post(id: ID!): Post
    
    # Get posts by a specific author
    postsByAuthor(authorId: ID!): [Post!]!
  }

  # Mutation type - Write operations
  type Mutation {
    # Create a new user
    createUser(name: String!, email: String!, age: Int): User!
    
    # Update an existing user
    updateUser(id: ID!, name: String, email: String, age: Int): User
    
    # Delete a user
    deleteUser(id: ID!): User
    
    # Create a new post
    createPost(title: String!, content: String!, authorId: ID!): Post!
    
    # Update an existing post
    updatePost(id: ID!, title: String, content: String): Post
    
    # Delete a post
    deletePost(id: ID!): Post
  }
`;

module.exports = typeDefs;