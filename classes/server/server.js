#!/usr/bin/env node
'use strict'

// other
const { join } = require('path')
const { readFileSync } = require('fs')

// server > base servers
const http = require('http')
const https = require('https')
// server > express and plugins
const express = require('express')
const bodyParserJson = require('body-parser').json
const compression = require('compression')
const handlebarsCreate = require('express-handlebars').create
const helmet = require('helmet')
// server > server helper static class
const ServerHelper = require('./server_helper')
// server > externalized router
const root = require('../../routes/root')

/*
 * Create express server (http/https)
 */

// load certs/keys
const serverSecurityDirectory = join(__dirname, '..', '..', 'https')
const serverSecurityDirectorySSL = join(serverSecurityDirectory, 'ssl')
const serverSecurityDirectoryDH = join(serverSecurityDirectory, 'dh')
const sslKey = readFileSync(join(serverSecurityDirectorySSL, 'localhost.key'), 'utf8')
const sslCert = readFileSync(join(serverSecurityDirectorySSL, 'localhost.crt'), 'utf8')
const dhParam = readFileSync(join(serverSecurityDirectoryDH, 'dh-strong.pem'), 'utf8')
const options = { key: sslKey, cert: sslCert, dhparam: dhParam }

// create express server instances
const app = express()
const serverHttp = http.createServer(app).on('error', ServerHelper.serverErrorListener)
const serverHttps = https.createServer(options, app).on('error', ServerHelper.serverErrorListener)

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

// compress responses before sending them to the client
app.use(compression())

// use more secure Diffie-Hellman connection buildup
app.use(helmet())

// request argument parser (for requests)
app.use(bodyParserJson())

// use a logger for all paths/connections
app.all('/*', ServerHelper.requestLogger)

/*
 * Server routes
 */

// route to external file
app.use('/', root)

// Make a whole directory downloadable (http://localhost:3000/database/tables.json)
app.use(express.static('./data'))

module.exports = { ServerHttp: serverHttp, ServerHttps: serverHttps }
