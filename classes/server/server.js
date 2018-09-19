#!/usr/bin/env node
'use strict'

const path = require('path')
// server
const express = require('express')
const compression = require('compression')
const handlebars = require('express-handlebars')
const http = require('http')
const bodyParser = require('body-parser')

const https = require('https')
const helmet = require('helmet')
const { readFileSync } = require('fs')
const ServerHelper = require('./server_helper').ServerHelper
const serverSecurityDirectory = path.join(__dirname, '..', '..', 'https')
const serverSecurityDirectorySSL = path.join(serverSecurityDirectory, 'ssl')
const serverSecurityDirectoryDH = path.join(serverSecurityDirectory, 'dh')
const sslKey = readFileSync(path.join(serverSecurityDirectorySSL, 'localhost.key'), 'utf8')
const sslCert = readFileSync(path.join(serverSecurityDirectorySSL, 'localhost.crt'), 'utf8')
const dhParam = readFileSync(path.join(serverSecurityDirectoryDH, 'dh-strong.pem'), 'utf8')

// server > externalized router
const birds = require('../../routes/birds')
const sockets = require('../../routes/sockets')

// create http/https express server
const app = express()
const serverHttp = http.createServer(app).on('error', ServerHelper.serverErrorListener)
const serverHttps = https.createServer({ key: sslKey, cert: sslCert, dhparam: dhParam }, app).on('error', ServerHelper.serverErrorListener)

// handlebars engine setup
const hbs = handlebars.create({
  // Specify helpers which are only registered on this instance.
  helpers: {
    foo: () => 'FOO!',
    bar: () => 'BAR!'
  },
  // specify file extensions
  extname: '.handlebars',
  // specify the default render layout
  defaultLayout: 'main',
  // specify the directories for view layouts and partials
  layoutsDir: path.join(__dirname, '../../views/layouts'),
  partialsDir: path.join(__dirname, '../../views/partials')
})
app.engine('handlebars', hbs.engine) // add handlebars engine
app.set('view engine', 'handlebars') // use handlebars as view engine
app.set('view cache', true) // cache views for better performance
app.use(compression()) // compress responses before sending them to the client
app.use(helmet()) // use Diffie-Hellman connection buildup
app.all('/*', ServerHelper.requestLogger) // request logger for all paths
app.use(bodyParser.json()) // request argument parser (for post requests)

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.send('hello world')
})

// GET method route
app.get('/get', (req, res) => {
  res.send('GET request')
})

// POST method route
app.post('/post', (req, res) => {
  res.send('POST request')
})

// Rout middleware functions
app.all('/secret', (req, res, next) => {
  console.log('Accessing the secret section ...')
  next() // pass control to the next handler
})

// GET 'a file'
app.get('/random.text', (req, res) => {
  res.send('random.text')
})

/*
   * Route parameters
   */

// http://localhost:3000/users/34/books/8989
app.get('/users/:userId/books/:bookId', (req, res) => {
  res.send(req.params)
})
// http://localhost:3000/plantae/Prunus.persica
app.get('/plantae/:genus.:species', (req, res) => {
  res.send(req.params)
})
/* // http://localhost:3000/user/42
  app.get('/user/:userId(\d+)', (req, res) => {
    res.send(req.params)
  }) */

/*
   * Route handlers
   */
app.get('/example/b', (req, res, next) => {
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

app.get('/example/c', [cb0, cb1, cb2])

/*
   * Response types
   */
app.get('/type/download', (req, res) => {
  res.download('./data/README.md', 'custom _file_name.md', (err) => {
    if (err) {
      console.error(err)
    }
  }) // Prompt a file to be downloaded
})
app.get('/type/end', (req, res) => {
  res.end() // End the response process
})
app.get('/type/json', (req, res) => {
  // res.setHeader('x-no-compression')
  res.json({ json: 'object'.repeat(9999), first: { second: true } }) // Send a JSON response
})
app.get('/type/redirect', (req, res) => {
  res.redirect('/type/json') // Redirect a request
})
app.get('/type/send', (req, res) => {
  res.send() // Send a response of various types
})
app.get('/type/render', (req, res) => {
  res.locals = {
    some_value: 'foo bar',
    list: ['cat', 'dog']
  }

  res.render('home', {
    showTitle: true,
    array: ['first value', 'second value', 'third value'],

    // Override `foo` helper only for this rendering.
    helpers: {
      foo: function () { return 'foo.' }
    }
  }) // Render a view template
})
app.get('/type/status', (req, res) => {
  res.sendStatus(200) // Set the response status code and send its string representation as the response body
})

// Post interface
app.post('/type/status', (req, res) => {
  console.log(req.body)
  res.sendStatus(200)
})

/*
   * Make a whole directory downloadable
   */
// http://localhost:3000/database/tables.json
app.use(express.static('./data'))

/*
   * Use externalized router
   */
app.use('/birds', birds)
app.use('/sockets', sockets)

module.exports = { ServerHttp: serverHttp, ServerHttps: serverHttps }
