#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * The routing paths for the route `/welcome`.
 */

const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  console.log(req.sessionID)
  // Render the features of this website and what an account is able to do
  res.render('loginRegister', {
    layout: 'materialize'
  })
})

module.exports = router
