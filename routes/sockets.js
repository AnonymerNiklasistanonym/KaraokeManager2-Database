#!/usr/bin/env node
'use strict'

const express = require('express')
const router = express.Router()

// define the home page route
router.get('/', (req, res) => res.render('socket_test', { text: 'Socket test' }))

module.exports = router
