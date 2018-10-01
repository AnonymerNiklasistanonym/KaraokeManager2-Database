#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * The waveform external test route of the server
 */

const express = require('express')
const router = express.Router()

// Define the home page route
router.get('/', (req, res) => {
  res.locals = {
    waveformContainer: 'waveform_container',
    waveformFilePath: '/test/music/test.mp3',
    waveformPlayOnStart: false,
    waveformPlayPause: true
  }

  res.render('waveform') // Render a view template
})

router.get('/autoplay', (req, res) => {
  res.locals = {
    waveformContainer: 'waveform_container',
    waveformFilePath: '/test/music/test.mp3',
    waveformPlayOnStart: true,
    waveformPlayPause: false
  }

  res.render('waveform') // Render a view template
})

module.exports = router
