#!/usr/bin/env node
'use strict'

/*
 * This file contains:
 * The socket.io test route of the server
 */

const express = require('express')
const router = express.Router()

// define the home page route
router.get('/', (req, res) => res.render('socket_test',
  {
    socketAddress: req.protocol + '://localhost:' + (req.protocol === 'https' ? '8443' : '8080'),
    text: 'Socket test'
  }))

module.exports = router
