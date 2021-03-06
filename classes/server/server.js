#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * The server setup/build script
 */

// Other
const path = require('path')
const fs = require('fs')

// Server > base servers
const http = require('http')
const spdy = require('spdy')
// Server > express and plugins
const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const handlebarsCreate = require('express-handlebars').create
const minifyHTML = require('express-minify-html')
const session = require('express-session')
const morgan = require('morgan')
const rfs = require('rotating-file-stream')
const helmet = require('helmet')
// Server > server helper static class
const ServerHelper = require('./serverHelper')
// Server > externalized router
const root = require('../../routes/root')

const Configuration = require('../../classes/configuration/configuration')
const ErrorPage = require('./errorPage')

/*
 * Create express server (http/https)
 */

// Load certs/keys
const serverSecurityDirectoryDH = path.join(__dirname, '..', '..', 'dh')
const http2serverSecurityDirectory = path.join(__dirname, '..', '..', 'http2')
const dhParam = fs.readFileSync(path.join(serverSecurityDirectoryDH, 'dh-strong.pem'), 'utf8')
const http2sslKey = fs.readFileSync(path.join(http2serverSecurityDirectory, 'server.key'), 'utf8')
const http2sslCert = fs.readFileSync(path.join(http2serverSecurityDirectory, 'server.crt'), 'utf8')
const http2options = { key: http2sslKey, cert: http2sslCert, hd: dhParam }

// Create express server instances
const app = express()
const serverHttp = http.createServer(app)
  .on('error', ServerHelper.serverErrorListener)
const serverHttps = spdy.createServer(http2options, app)
  .on('error', ServerHelper.serverErrorListener)

/*
 * Customize express server 'plugins'
 */

// Handlebars engine setup
const hbs = handlebarsCreate({
  // Specify the default render layout
  defaultLayout: 'main',
  // Specify file extensions
  extname: '.handlebars',
  // Specify helpers which are only registered on this instance.
  helpers: {
    bar: () => 'BAR!',
    foo: () => 'FOO!'
  },
  // Specify the directories for view layouts and partials
  layoutsDir: path.join(__dirname, '../../views/layouts'),
  partialsDir: path.join(__dirname, '../../views/partials')
})
app.engine('handlebars', hbs.engine) // Add handlebars engine
app.set('view engine', 'handlebars') // Use handlebars as view engine
app.set('view cache', true) // Cache views for much better performance

app.set('json spaces', 0) // No spaces for minimized JSON requests

// Minify html data
app.use(minifyHTML({ override: true }))

// Compress responses before sending them to the client
app.use(compression())

// Use more secure Diffie-Hellman connection buildup
app.use(helmet())

// Request argument parser (for requests)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Session handler
app.set('trust proxy', 1)
app.use(session({
  cookie: {
    // Age of cookie in ms
    maxAge: 1000 * 60 * 30,
    // Setting secure: true only creates persistent data on https
    secure: false
  },
  name: 'cookie name',
  resave: true,
  saveUninitialized: true,
  secret: 'cookie secret'
}))

// Log directory
const logDirectory = path.join(__dirname, '../../log')
// Ensure log directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory)
}
// Create a rotating write stream
// @ts-ignore
const accessLogStream = rfs('access.log', {
  interval: '1d', // Create daily a new access log file
  path: logDirectory
})
// Log only 4xx and 5xx responses to console
// @ts-ignore
app.use(morgan('dev', { skip: (req, res) => res.statusCode < 400 }))
// Log all responses to a log file
app.use(morgan('combined', { stream: accessLogStream }))

// Use a logger for all paths/connections
// `app.all('/*', ServerHelper.requestLogger)`

/*
 * Server routes
 */

// Route to external file
app.use('/', root)

// Make a whole directory downloadable (http://localhost:3000/database/tables.json)
app.use(express.static('./public'))
app.use('/wavesurfer', express.static('./node_modules/wavesurfer.js/dist/'))
app.use('/materialize', express.static('./node_modules/materialize-css/dist/'))
app.use('/material-icons', express.static('./node_modules/material-icons/dist/'))
app.use('/material-icons', express.static('./node_modules/material-icons/'))
app.use('/dropzone', express.static('./node_modules/dropzone/dist/min/'))

/*
 * Error catcher
 */

// Catch every 404 and forward to the error handler
app.use((req, res, next) => {
  res.locals.customLinks = ErrorPage.createErrorLinks()
  const err = Error('Not Found')
  // @ts-ignore
  err.status = 404
  next(err)
})

// All errors will end in here
// @ts-ignore
app.use((err, req, res, next) => {
  // Error status code to display/send
  const errorStatus = err.status === undefined ? 500 : err.status
  // Error message to display
  res.locals.customError = {
    message: err.message,
    stack: err.stack,
    status: errorStatus
  }
  // Links to other pages
  res.locals.customLinks = ErrorPage.getCustomLinks(res.locals.customLinks)
  // Dev
  res.locals.displayError = req.app.get('env') === 'development'
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.locals.customBody = ErrorPage.getCustomBody(req.body)
  res.locals = {
    ...res.locals,
    ...Configuration.generalContentClean
  }

  // **Send status** and render page
  res.status(errorStatus)
    .render('error', {
      layout: 'materialize',
      title: `${errorStatus} - ${err.message}`
    })
})

module.exports = { serverHttp, serverHttps, app }
