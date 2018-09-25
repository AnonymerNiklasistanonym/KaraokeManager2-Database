#!/usr/bin/env node
'use strict'

/*
 * This file contains:
 * The waveform external test route of the server
 */

const router = require('express').Router()

// define the home page route
router.get('/', (req, res) => res.render('audioVideo'))

module.exports = router
