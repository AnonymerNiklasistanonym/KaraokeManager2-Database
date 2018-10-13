#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * The routing paths for the route `/account/action`.
 */

const API = require('../../classes/api/api')
const ErrorPage = require('../../classes/server/errorPage')
const Configuration = require('../../classes/configuration/configuration')
const express = require('express')
const router = express.Router()

/*
 * Redirect if already logged in else render login/register page
 */
router.get('/login_register', (req, res, next) => {
  if (API.checkIfLoggedIn(req.session.authorized)) {
    res.locals.customLinks = ErrorPage.createErrorLinks()
    next(Error('You are already logged in!'))
  } else {
    res.locals = {
      ...res.locals,
      ...Configuration.generalContentClean,
      ...Configuration.loginRegisterContent
    }
    res.render('loginRegister', {
      layout: 'materialize',
      title: 'Login/Register'
    })
  }
})

/*
 * Redirect if already logged in else try to log in the user
 */
router.post('/login', (req, res, next) => {
  if (API.checkIfLoggedIn(req.session.authorized)) {
    res.locals.customLinks = ErrorPage.createErrorLinks()
    next(Error('You are already logged in!'))
  } else {
    API.login(req.body.account_id, req.body.account_password)
      .then(registeredId => {
        req.session.authorized = registeredId
        req.session.account_id = req.body.account_id
        res.redirect('/')
      })
      .catch(next)
  }
})

/*
 * Redirect if already logged in else try to register the user
 */
router.post('/register', (req, res, next) => {
  if (API.checkIfLoggedIn(req.session.authorized)) {
    res.locals.customLinks = ErrorPage.createErrorLinks()
    next(Error('You are already logged in!'))
  } else {
    API.register(req.body.account_id, req.body.account_password)
      .then(registeredId => {
        req.session.authorized = registeredId
        req.session.account_id = req.body.account_id
        res.redirect('/welcome')
      })
      .catch(err => {
        res.locals.customLinks = ErrorPage.createErrorLinks([
          { link: '/account/action/login_register', text: 'Login/Register' }
        ], true)
        next(err)
      })
  }
})

/*
 * Redirect if not logged in else try to log out the user
 */
router.get('/logout', (req, res, next) => {
  if (!API.checkIfLoggedIn(req.session.authorized)) {
    res.locals.customLinks = ErrorPage.createErrorLinks([
      { link: '/account/action/login_register', text: 'Login' }
    ], true)
    next(Error('You are not logged in!'))
  } else {
    API.logout(req.session.authorized)
    req.session.authorized = undefined
    res.redirect('/')
  }
})

module.exports = router
