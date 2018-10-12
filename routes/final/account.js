#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * The routing paths for the route `/account`.
 */

const API = require('../../classes/api/api')
const ErrorPage = require('../../classes/server/errorPage')
const express = require('express')
const action = require('./accountActions')
const settings = require('./accountSettings')

const router = express.Router()

/*
 * If not logged in redirect to login/register else route to account profile page
 */
router.get('/', (req, res, next) => {
  if (API.checkIfLoggedIn(req.session.authorized)) {
    res.redirect(`/account/page/${req.session.account_id}`)
  } else {
    res.redirect('/account/action/login_register')
  }
})

/*
 * Display account profile page [id is never undefined!]
 */
router.get('/page/:id', (req, res, next) => {
  // TODO: Render account profile page (create template)
  API.getAccount(req.params.id)
    .then(result => res.json(result))
    .catch(err => {
      res.locals.customLinks = ErrorPage.createErrorLinks()
      next(err)
    })
})

router.use('/action', action)
router.use('/settings', settings)

module.exports = router
