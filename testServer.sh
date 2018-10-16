#!/usr/bin/env bash

echo "If everything works ther should be 4 OK's"

# Test http server requests
curl -X GET http://localhost:8080/type/status
curl -X POST http://localhost:8080/type/status -H "Content-Type: application/json; charset=UTF-8" -d '{"username":"http","password":"xyz"}'

# Test https server requests
curl -k -X GET https://localhost:8443/type/status
curl -k -X POST https://localhost:8443/type/status -H "Content-Type: application/json; charset=UTF-8" -d '{"username":"https","password":"xyz"}'

# Other
curl -X GET http://localhost:8080/
curl -X GET http://localhost:8080/playlist
curl -X GET http://localhost:8080/account/action/login_register
curl -X POST http://localhost:8080/account/action/login
curl -X POST http://localhost:8080/account/action/register
curl -X GET http://localhost:8080/account/action/logout
