#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * The routing paths for the route `/account/settings`.
 */

const API = require('../../classes/api/api')
const express = require('express')

const router = express.Router()

/*
 * If not logged in redirect to login/register else show settings page
 */
router.get('/', (req, res, next) => {
  if (API.checkIfLoggedIn(req.session.authorized)) {
    // TODO: Render account settings (create template)
    res.sendStatus(200)
  } else {
    res.redirect('/account/action/login_register')
  }
})

/*
 * If not logged in redirect to login/register else handle settings configuration
 */
router.post('/configure/:event', (req, res, next) => {
  if (API.checkIfLoggedIn(req.session.authorized)) {
    // TODO: Handle account settings configuration
    res.sendStatus(200)
  } else {
    res.redirect('/account/action/login_register')
  }
})

module.exports = router
