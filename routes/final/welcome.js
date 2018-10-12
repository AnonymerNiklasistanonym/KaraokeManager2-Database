#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * The routing paths for the route `/welcome`.
 */

const API = require('../../classes/api/api')
const Configuration = require('../../classes/configuration/configuration')
const express = require('express')
const router = express.Router()

/*
 * Show features/options of this web app if logged in else redirect to login/register
 */
router.get('/', (req, res, next) => {
  Configuration.generateNavBarContent(req.session.authorized)
    .then(navBar => {
      res.locals = {
        ...res.locals,
        ...Configuration.generalContent,
        ...Configuration.welcomeContent,
        ...Configuration.fabContent,
        navBar
      }
      res.render('welcome', { layout: 'materialize', title: 'Welcome :)' })
    })
    .catch(next)
})

module.exports = router
