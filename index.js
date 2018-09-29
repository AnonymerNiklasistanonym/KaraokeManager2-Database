#!/usr/bin/env node
'use strict'

// database
const { DatabaseTablesJsonParser, DatabaseTableValuesJsonParser } = require('./classes/database/database_data_setup_parser')
const { DatabaseQueriesErrorHelper } = require('./classes/database/database_queries')
const DatabaseApi = require('./classes/database/database_api')

/**
 * Express http/https socket-io server
 */
const { serverHttp, serverHttps } = require('./classes/server/socket_server')

// start server
const httpPort = 8080
const httpsPort = 8443

serverHttp.listen(httpPort, () => { console.log('Example app listening on -> http://localhost:' + httpPort) })
serverHttps.listen(httpsPort, () => { console.log('Example app listening on -> https://localhost:' + httpsPort) })

// create tables (if not existing)
const createdSetupTables = new Promise((resolve, reject) => DatabaseTablesJsonParser.setupTables
  .then(dbTablesJson => {
    const promises = []
    dbTablesJson.forEach(dbTableJson => promises.push(DatabaseApi.createTable(
      dbTableJson.name, dbTableJson.primary_key, dbTableJson.not_null_keys, dbTableJson.null_keys, 'createIfNotAlreadyExisting')))
    Promise.all(promises)
      .then(resolve)
      .catch(reject)
  })
  .catch(reject))

// create default values (if not existing)
const createdSetupValues = new Promise((resolve, reject) => createdSetupTables
  .then(() =>
    DatabaseTableValuesJsonParser.setupTableValues
      .then(dbTableValuesJson => {
        const promises = []
        dbTableValuesJson.accounts.forEach(sqliteQuery => promises.push(DatabaseApi.createAccount(sqliteQuery.name, sqliteQuery.password)))
        Promise.all(promises)
          .then(resolve)
          .catch(reject)
      })
      .catch(reject))
  .catch(reject))

createdSetupValues
  .then(() => {
    console.log('Table setup completed')
    DatabaseApi.createAccount('admin', 'root')
      .then((a) => { console.log('admin', 'RunResult:', JSON.stringify(a)) })
      .catch(err => {
        if (err.errno === DatabaseQueriesErrorHelper.errorCodes.SQLITE_CONSTRAINT) {
          console.log('SQLITE_CONSTRAINT error detected: "' + err.message + '"')
        }
      })
    DatabaseApi.createAccount('niklas', 'niklas')
      .then((a) => { console.log('niklas', 'RunResult:', JSON.stringify(a)) })
      .catch(err => {
        if (err.errno === DatabaseQueriesErrorHelper.errorCodes.SQLITE_CONSTRAINT) {
          console.log('SQLITE_CONSTRAINT error detected: ' + err.message)
        }
      })
  })
  .catch(console.error)
