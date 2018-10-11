#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * The routing paths for the route `/account`.
 */

const express = require('express')
const action = require('./accountActions')
const settings = require('./accountSettings')
const router = express.Router()

router.get('/', (req, res, next) => {
  // If logged in find out the account id and redirect to user account
  // If not logged in redirect to login page
  res.sendStatus(200)
})

router.get('/page/:id', (req, res, next) => {
  console.log(req.params.id)
  // If the id exists render profile page
  // If not show error message
  res.sendStatus(200)
})

router.use('/action', action)
router.use('/settings', settings)

module.exports = router
