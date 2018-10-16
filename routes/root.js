#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * The root route of the server
 */

const ErrorPage = require('../classes/server/errorPage')
const express = require('express')
const router = express.Router()

const waveform = require('./waveform')
const sockets = require('./sockets')
const videoAudio = require('./videoAudio')
const upload = require('./upload')

const account = require('./final/account')
const welcome = require('./final/welcome')
const playlist = require('./final/playlist')

/*
 * Show features/options of this web app if logged in else redirect to login/register
 */
router.get('/', (req, res, next) => {
  console.log('redirect to to /playlist')
  res.redirect('/playlist')
})

// GET method route
router.get('/get', (req, res) => res.send('GET request'))

// POST method route
router.post('/post', (req, res) => res.send('POST request'))

// Rout middleware functions
router.all('/secret', (req, res, next) => {
  console.log('Accessing the secret section ...')
  next() // Pass control to the next handler
})

// GET 'a file'
router.get('/random.text', (req, res) => res.send('random.text content'))

/*
 * Route parameters
 */

// Example: /users/34/books/8989
router.get('/users/:userId/books/:bookId', (req, res) => res.send(req.params))
// Example: /plantae/Prunus.persica
router.get('/plantae/:genus.:species', (req, res) => res.send(req.params))

/*
 * Route handlers
 */
router.get('/example/b', (req, res, next) => {
  console.log('the response will be sent by the next function ...')
  next()
}, (req, res) => {
  res.send('Hello from B!')
})

const cb0 = (req, res, next) => {
  console.log('CB0')
  next()
}

const cb1 = (req, res, next) => {
  console.log('CB1')
  next()
}

const cb2 = (req, res) => {
  res.send('Hello from C!')
}

router.get('/example/c', [cb0, cb1, cb2])

/*
 * Response types
 */
router.get('/type/download', (req, res) => {
  res.download('./data/README.md', 'custom_file_name.md', err => {
    if (err) {
      console.error(err)
    }
  }) // Prompt a file to be downloaded
})
router.get('/type/end', (req, res) => {
  res.end() // End the response process
})
router.get('/type/json', (req, res) => {
  res.json({
    first: {
      second: true
    },
    json: 'object'.repeat(99999)
  }) // Send a JSON response
})
router.get('/type/redirect', (req, res) => {
  res.redirect('/type/json') // Redirect a request
})
router.get('/type/send', (req, res) => {
  res.send() // Send a response of various types
})
router.get('/type/render', (req, res) => {
  res.locals = {
    list: ['cat', 'dog'],
    some_value: 'foo bar'
  }

  res.render('home', {
    array: ['first value', 'second value', 'third value'],
    // Override `foo` helper only for this rendering.
    helpers: { foo: () => 'foo.' },
    showTitle: true
  }) // Render a view template
})
router.get('/type/status', (req, res) => {
  res.sendStatus(200) // Set the response status code and send its string representation as the response body
})

router.get('/type/fail', (req, res, next) => {
  res.locals.customLinks = ErrorPage.createErrorLinks([
    { link: '/account/action/login_register', text: 'Go to login/register' }
  ])
  const err = Error('FAIL')
  err.status = 500
  next(err)
})

// Post interface
router.post('/type/status', (req, res) => {
  res.sendStatus(200)
})

/*
 * Other routes
 */
router.use('/waveform', waveform)
router.use('/sockets', sockets)
router.use('/videoAudio', videoAudio)
router.use('/upload', upload)

router.use('/account', account)
router.use('/welcome', welcome)
router.use('/playlist', playlist)

module.exports = router
