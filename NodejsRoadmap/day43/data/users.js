// Simple in-memory "user store"
const users = [
  {
    id: 1,
    email: 'user@example.com',
    password: 'password123', // just for demo; never keep plain text in real apps
    name: 'Demo User',
  },
];

function findUserByEmail(email) {
    return users.find((u) => u.email === email);
}

module.exports = { users, findUserByEmail };