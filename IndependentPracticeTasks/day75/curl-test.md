# Test with curl

## Create user

curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com"}'

## Get all users

curl http://localhost:3000/users

## Get one user

curl http://localhost:3000/users/<USER_ID>

## Invalid request

curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Bad","email":"invalid-email"}'