#!/usr/bin/env bash

###########################################################
# Setup dh strong parameter for a more secure connection  #
#                                                         #
# Run on Windows via WSL: Open the console (ubuntu),      #
# enter 'cd /mnt/c/Users/Documents/...', run this file    #
###########################################################

# Variables/File names
dhDirectory="./dh"
dhStrongParameter="dh-strong.pem"

# Create directory
mkdir -p $dhDirectory
cd $dhDirectory

# Create strong DH parameter
# [if you are on a raspberry pi change the number to something smaller]
openssl dhparam -out $dhStrongParameter 1024
