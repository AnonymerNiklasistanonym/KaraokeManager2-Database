#!/usr/bin/env bash

###########################################################
# Setup https/http2 credentials for a secure connection   #
#                                                         #
# Source: https://webapplog.com/http2-node/               #
#                                                         #
# Run on Windows via WSL: Open the console (ubuntu),      #
# enter 'cd /mnt/c/Users/Documents/...', run this file    #
###########################################################

# Variables/File names
http2directory="./http2"
rsaPrivateKey="server.key"
certificate="server.csr"
requestedCertificate="server.crt"
rsaCustomPassword="rsa_password_encryption"

# Create directory for credentials (run in project directory)
mkdir -p $http2directory
cd $http2directory

# Password protected RSA key
tempKey="server.pass.key"
openssl genrsa -des3 -passout pass:$rsaCustomPassword -out $tempKey 4096
# Create server RSA key
openssl rsa -passin pass:$rsaCustomPassword -in $tempKey -out $rsaPrivateKey
rm $tempKey
# Create server csr from RSA server key
echo "> Enter no password, just press enter in the upcoming dialog for all entries!"
openssl req -new -key $rsaPrivateKey -out $certificate
# Create real server certificate from RSA server key and csr
openssl x509 -req -sha256 -days 365 -in $certificate -signkey $rsaPrivateKey -out $requestedCertificate
