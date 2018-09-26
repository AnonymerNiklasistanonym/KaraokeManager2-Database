#!/usr/bin/env bash

# setup server parameter
./createSelfSignedCertificateHttps.sh
./createDhStrongParameter.sh

# setup finished notification
echo "If everything worked out this far run the app with:"
echo "    'npm install',"
echo "    'npm start'"
