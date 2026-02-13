// Mock database
let users = [
  { id: '1', name: 'John Doe', email: 'john@example.com', age: 30 },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', age: 25 },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', age: 35 }
];

let posts = [
  { id: '1', title: 'GraphQL Introduction', content: 'GraphQL is amazing!', authorId: '1' },
  { id: '2', title: 'Apollo Server Guide', content: 'Learn Apollo Server...', authorId: '1' },
  { id: '3', title: 'Node.js Best Practices', content: 'Follow these tips...', authorId: '2' }
];

module.exports = { users, posts };