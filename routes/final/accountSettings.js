#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * The routing paths for the route `/account/settings`.
 */

const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  // If not logged in redirect to error message page
  // Else render all the settings
  res.sendStatus(200)
})

router.post('/configure/:id', (req, res, next) => {
  // If not logged in redirect to error message page
  // Else try to change/set setting
  // If setting could not be changed redirect to settings page with error message
  res.sendStatus(200)
})

module.exports = router
