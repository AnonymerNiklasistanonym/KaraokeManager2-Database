#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * The routing paths for the route `/account/action`.
 */

const express = require('express')
const router = express.Router()

router.get('/login_register', (req, res, next) => {
  // If logged in find out the account id and redirect to user account
  // If not logged in render login/register template
  res.sendStatus(200)
})

router.post('/login', (req, res, next) => {
  // If logged in show error message
  // If not logged in try to login
  // If login was not successful redirect back to the login_register page and display there an error message (snackbar?)
  res.sendStatus(200)
})

router.post('/register', (req, res, next) => {
  // If logged in show error message
  // If account id already exists redirect back to the login_register page and display there an error message (snackbar?)
  // If account id is unused try to create account
  // If creation of account was not successful redirect back to the login_register page and display there an error message (snackbar?)
  // If creation of account was successful redirect back to a welcome screen that lists the features
  res.sendStatus(200)
})

router.post('/logout', (req, res, next) => {
  // If logged in try to log out
  // If not logged in redirect to error message page
  // If logout was not successful redirect to error message page
  // If logout was successful redirect to home page
  res.sendStatus(200)
})

module.exports = router
