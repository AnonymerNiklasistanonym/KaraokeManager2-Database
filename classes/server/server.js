#!/usr/bin/env node
'use strict'

// other
const { join } = require('path')
const { readFileSync } = require('fs')
const fs = require('fs')

// server > base servers
const http = require('http')
const https = require('http2')
const spdy = require('spdy')
// server > express and plugins
const express = require('express')
const bodyParserJson = require('body-parser').json
const compression = require('compression')
const handlebarsCreate = require('express-handlebars').create
const minifyHTML = require('express-minify-html')
const session = require('express-session')
const morgan = require('morgan')
const rfs = require('rotating-file-stream')
const helmet = require('helmet')
// server > server helper static class
const ServerHelper = require('./server_helper')
// server > externalized router
const root = require('../../routes/root')

/*
 * Create express server (http/https)
 */

// load certs/keys
const serverSecurityDirectoryDH = join(__dirname, '..', '..', 'dh')
const http2serverSecurityDirectory = join(__dirname, '..', '..', 'http2')
const dhParam = readFileSync(join(serverSecurityDirectoryDH, 'dh-strong.pem'), 'utf8')
const http2sslKey = readFileSync(join(http2serverSecurityDirectory, 'server.key'), 'utf8')
const http2sslCert = readFileSync(join(http2serverSecurityDirectory, 'server.crt'), 'utf8')
const http2options = { key: http2sslKey, cert: http2sslCert, hd: dhParam }

// create express server instances
const app = express()
const serverHttp = http.createServer(app).on('error', ServerHelper.serverErrorListener)
const serverHttps = spdy.createServer(http2options, app).on('error', ServerHelper.serverErrorListener)

/*
 * Customize express server 'plugins'
 */

// handlebars engine setup
const hbs = handlebarsCreate({
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
  layoutsDir: join(__dirname, '../../views/layouts'),
  partialsDir: join(__dirname, '../../views/partials')
})
app.engine('handlebars', hbs.engine) // add handlebars engine
app.set('view engine', 'handlebars') // use handlebars as view engine
app.set('view cache', true) // cache views for much better performance

app.set('json spaces', 0) // no spaces for minimized JSON requests

// minify html data
app.use(minifyHTML({ override: true }))

// compress responses before sending them to the client
app.use(compression())

// use more secure Diffie-Hellman connection buildup
app.use(helmet())

// request argument parser (for requests)
app.use(bodyParserJson())

// session handler
app.set('trust proxy', 1)
const sess = {
  secret: 'cookie secret',
  name: 'cookie name',
  cookie: { secure: true },
  resave: true,
  saveUninitialized: true
}

// @ts-ignore
app.use(session(sess))

// log directory
const logDirectory = join(__dirname, '../../log')
// ensure log directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory)
}
// create a rotating write stream
// @ts-ignore
const accessLogStream = rfs('access.log', {
  interval: '1d', // create daily a new access log file
  path: logDirectory
})
// log only 4xx and 5xx responses to console
app.use(morgan('dev', { skip: (req, res) => res.statusCode < 400 }))
// log all responses to a log file
app.use(morgan('combined', { stream: accessLogStream }))

// use a logger for all paths/connections
// app.all('/*', ServerHelper.requestLogger)

/*
 * Server routes
 */

// route to external file
app.use('/', root)

// Make a whole directory downloadable (http://localhost:3000/database/tables.json)
app.use(express.static('./public'))
app.use('/wavesurfer', express.static('./node_modules/wavesurfer.js/dist/'))
app.use('/materialize', express.static('./node_modules/materialize-css/dist/'))
app.use('/material-icons', express.static('./node_modules/material-icons/dist/'))
app.use('/material-icons', express.static('./node_modules/material-icons/'))

ServerHelper.printAllServerRoutes(app)

module.exports = { ServerHttp: serverHttp, ServerHttps: serverHttps }
