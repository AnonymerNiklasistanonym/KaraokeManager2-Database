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
    musicChips: [{
      chipUrl: '#',
      picturePath: '/test/music/test.jpeg',
      pictureTag: true,
      title: 'Twenty One Pilots'
    }, {
      chipUrl: '#',
      title: 'Cool songs'
    }, {
      chipUrl: '#',
      title: 'Duett'
    }, {
      chipUrl: '#',
      title: 'Rap'
    }, {
      chipUrl: '#',
      title: '2010'
    }],
    musicDescription: 'This is a description of the music file with cool information...',
    musicFileCoverPath: '/test/music/test.jpeg',
    musicFilePath: '/test/music/test.mp3',
    musicTitle: 'TestTitle',
    musicUrl: '#'
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
