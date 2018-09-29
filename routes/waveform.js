#!/usr/bin/env node
'use strict'

/*
 * This file contains:
 * The waveform external test route of the server
 */

const express = require('express')
const router = express.Router()

// define the home page route
// define the home page route
router.get('/', (req, res) => {
  res.locals = {
    waveformContainer: 'waveform_container',
    waveformFilePath: '/test/music/test.mp3',
    waveformPlayPause: true,
    waveformPlayOnStart: false
  }

  res.render('waveform') // Render a view template
})

router.get('/autoplay', (req, res) => {
  res.locals = {
    waveformContainer: 'waveform_container',
    waveformFilePath: '/test/music/test.mp3',
    waveformPlayPause: false,
    waveformPlayOnStart: true
  }

  res.render('waveform') // Render a view template
})

module.exports = router
