#!/usr/bin/env node
'use strict'

// database
const DatabaseHelper = require('./classes/database/setup/database_helper').DatabaseHelper
const DatabaseQueries = require('./classes/database/database_queries')

/**
 * Express http/https socket-io server
 */
const { serverHttp, serverHttps } = require('./classes/server/socket_server')

// start server
const httpPort = 8080
const httpsPort = 8443

serverHttp.listen(httpPort, () => console.log('Example app listening on -> http://localhost:' + httpPort))
serverHttps.listen(httpsPort, () => console.log('Example app listening on -> https://localhost:' + httpsPort))

// create tables (if not existing)
const createdSetupTables = new Promise((resolve, reject) =>
  DatabaseHelper.setupSQLiteTablesQueries.then(sqlQueries => {
    const promises = []
    sqlQueries.forEach(sqliteQuery => promises.push(DatabaseQueries.postRequest(sqliteQuery)))
    Promise.all(promises).then(resolve).catch(reject)
  }).catch(reject))

// create default values (if not existing)
const createdSetupValues = new Promise((resolve, reject) =>
  createdSetupTables.then(() =>
    DatabaseHelper.setupSQLiteTableValuesQueries.then(sqlQueries => {
      const promises = []
      sqlQueries.forEach(sqliteQuery => promises.push(DatabaseQueries.postRequest(sqliteQuery)))
      Promise.all(promises).then(resolve).catch(reject)
    }).catch(reject)).catch(reject))

createdSetupValues.then(() => console.log('Table setup completed')).catch(console.error)
