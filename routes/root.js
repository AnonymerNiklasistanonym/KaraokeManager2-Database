#!/usr/bin/env node
'use strict'

/*
 * This file contains:
 * The root route of the server
 */

const router = require('express').Router()
const birds = require('./birds')
const waveform = require('./waveform')
const sockets = require('./sockets')

// respond with "hello world" when a GET request is made to the homepage
router.get('/', (req, res) => res.send('hello world'))

// GET method route
router.get('/get', (req, res) => res.send('GET request'))

// POST method route
router.post('/post', (req, res) => res.send('POST request'))

// Rout middleware functions
router.all('/secret', (req, res, next) => {
  console.log('Accessing the secret section ...')
  next() // pass control to the next handler
})

// GET 'a file'
router.get('/random.text', (req, res) => res.send('random.text content'))

/*
 * Route parameters
 */

// http://localhost:3000/users/34/books/8989
router.get('/users/:userId/books/:bookId', (req, res) => res.send(req.params))
// http://localhost:3000/plantae/Prunus.persica
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
  res.download('./data/README.md', 'custom_file_name.md', (err) => {
    if (err) {
      console.error(err)
    }
  }) // Prompt a file to be downloaded
})
router.get('/type/end', (req, res) => {
  res.end() // End the response process
})
router.get('/type/json', (req, res) => {
  // res.setHeader('x-no-compression')
  res.json({
    json: 'object'.repeat(99999),
    first: {
      second: true
    }
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
    some_value: 'foo bar',
    list: ['cat', 'dog']
  }

  res.render('home', {
    showTitle: true,
    array: ['first value', 'second value', 'third value'],

    // Override `foo` helper only for this rendering.
    helpers: { foo: () => 'foo.' }
  }) // Render a view template
})
router.get('/type/status', (req, res) => {
  res.sendStatus(200) // Set the response status code and send its string representation as the response body
})

// Post interface
router.post('/type/status', (req, res) => {
  console.log(req.body)
  res.sendStatus(200)
})

/*
 * Other routes
 */
router.use('/birds', birds)
router.use('/waveform', waveform)
router.use('/sockets', sockets)

module.exports = router
