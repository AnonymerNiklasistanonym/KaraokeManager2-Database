#!/usr/bin/env node
'use strict'

/*
 * This file contains:
 * The socket.io test route of the server
 */

const router = require('express').Router()

// define the home page route
router.get('/', (req, res) => res.render('socket_test', { text: 'Socket test' }))

module.exports = router
