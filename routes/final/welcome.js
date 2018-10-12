#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * The routing paths for the route `/welcome`.
 */

const API = require('../../classes/api/api')
const express = require('express')
const router = express.Router()

/*
 * Show features/options of this web app if logged in else redirect to login/register
 */
router.get('/', (req, res, next) => {
  if (API.checkIfLoggedIn(req.session.authorized)) {
    // TODO: Render welcome page (modify template that explains features/options)
    res.render('loginRegister', { layout: 'materialize' })
  } else {
    res.redirect('/account/action/login_register')
  }
})

module.exports = router
