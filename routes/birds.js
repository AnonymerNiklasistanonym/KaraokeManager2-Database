#!/usr/bin/env node
'use strict'

/*
 * This file contains:
 * The bird external test route of the server
 */

const router = require('express').Router()

// define the home page route
router.get('/', (req, res) => res.send('Birds home page'))
// define the about route
router.get('/about', (req, res) => res.send('About birds'))

router.get('/blub', (req, res) => res.render('audioVideo', { layout: 'materialize' }))

module.exports = router
