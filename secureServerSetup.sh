#!/usr/bin/env bash

###################################################################################################
###################################################################################################
# Setup for a more secure server (https, key exchange/handshake)                                  #
#                                                                                                 #
# How to run on Windows by activating WSL                                                         #
# Enter in console ubuntu -> cd to wanted directory [cd /mnt/c/Users] -> run this file            #
###################################################################################################
###################################################################################################

serverSecurityDirectory="./https"
mkdir -p $serverSecurityDirectory

# 1. Create ssl certs
###################################################################################################
# https://letsencrypt.org/docs/certificates-for-localhost/
# https/ssl-cert/localhost.key is the key and https/ssl-cert/localhost.crt is the certificate that
# can also be installed
serverSecurityDirectorySSL="${serverSecurityDirectory}/ssl"
mkdir -p $serverSecurityDirectorySSL

serverSecurityConfCertSSL="${serverSecurityDirectorySSL}/config.cnf"
serverSecurityCertSSL="${serverSecurityDirectorySSL}/localhost.crt"
serverSecurityKeySSL="${serverSecurityDirectorySSL}/localhost.key"

echo '[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth' > $serverSecurityConfCertSSL
openssl req -x509 \
  -out $serverSecurityCertSSL \
  -keyout $serverSecurityKeySSL \
  -newkey rsa:2048 -nodes -sha256 \
  -subj '/CN=localhost' -extensions EXT -config $serverSecurityConfCertSSL
rm $serverSecurityConfCertSSL


# 2. Create Diffie–Hellman key exchange parameter
###################################################################################################
serverSecurityDirectoryDH="${serverSecurityDirectory}/dh"
mkdir -p $serverSecurityDirectoryDH

serverSecurityStrongParameterDH="${serverSecurityDirectoryDH}/dh-strong.pem"

openssl dhparam -out $serverSecurityStrongParameterDH 2048
