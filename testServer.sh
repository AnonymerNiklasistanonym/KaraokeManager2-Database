# Test server requests
curl -X GET http://localhost:8080/type/status
curl -X POST http://localhost:8080/type/status \
  -H "Content-Type: application/json; charset=UTF-8" -d '{"username":"xyz","password":"xyz"}'
