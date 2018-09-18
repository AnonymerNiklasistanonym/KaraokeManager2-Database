#!/usr/bin/env bash

# After the following tutorial:
# https://www.sitepoint.com/how-to-use-ssltls-with-node-js/
# Current version is after the following tutorial:
# https://medium.freecodecamp.org/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec
# (Can be executed on Windows via WSL)


# Create ssl certs (Passphrase: test)
mkdir -p "./https/"
mkdir -p "./https/ssl-cert/"
#openssl req -x509 -newkey rsa:4096 -keyout "./https/ssl-cert/key.pem" -out "./https/ssl-cert/cert.pem" -days 365

openssl genrsa -des3 -out "./https/rootCA.key" 2048
openssl req -x509 -new -nodes -key "./https/rootCA.key" -sha256 -days 1024 -out "./https/rootCA.pem"

touch "./https/server.csr.cnf"
echo '[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn

[dn]
C=US
ST=RandomState
L=RandomCity
O=RandomOrganization
OU=RandomOrganizationUnit
emailAddress=hello@example.com
CN = localhost' > "./https/server.csr.cnf"

touch "./https/v3.ext"
echo 'authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost' > "./https/v3.ext"

openssl req -new -sha256 -nodes -out "./https/ssl-cert/server.csr" -newkey rsa:2048 -keyout "./https/ssl-cert/server.key" -config "./https/server.csr.cnf"
openssl x509 -req -in "./https/ssl-cert/server.csr" -CA "./https/rootCA.pem" -CAkey "./https/rootCA.key" -CAcreateserial -out "./https/ssl-cert/server.crt" -days 500 -sha256 -extfile "./https/v3.ext"

# Create Diffie-Hellman code
openssl dhparam -out "./https/ssl-cert/dh-strong.pem" 2048
