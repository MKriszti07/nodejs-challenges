function getUserFromAuthHeader(req) {
  // For practice:
  // Authorization: Bearer alice
  const auth = req.headers.authorization || '';
  const m = auth.match(/^Bearer\s+(.+)$/i);
  return m ? { username: m[1] } : null;
}

module.exports = { getUserFromAuthHeader };