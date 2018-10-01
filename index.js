#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * Main method of app/program
 * - setup server
 *    - create tables
 *    - create default data (admin account)
 * - start server
 *    - server websites/files
 *    - interactive
 */

const {
  DatabaseTablesJsonParser,
  DatabaseTableValuesJsonParser
} = require('./classes/database/setup/databaseSetupParser')
const { DatabaseQueriesErrorHelper } = require('./classes/database/databaseQueries')
const DatabaseApi = require('./classes/database/databaseApi')

/**
 * Express http/https socket-io server
 */
const { serverHttp, serverHttps } = require('./classes/server/socketServer')

// Start server
const httpPort = 8080
const httpsPort = 8443

serverHttp.listen(httpPort, () => { console.log(`Example app listening on -> http://localhost:${httpPort}`) })
serverHttps.listen(httpsPort, () => { console.log(`Example app listening on -> https://localhost:${httpsPort}`) })

// Create tables (if not existing)
const createdSetupTables = new Promise((resolve, reject) => DatabaseTablesJsonParser.setupTables
  .then(dbTablesJson => {
    Promise.all(dbTablesJson
      .map(dbTableJson => DatabaseApi.createTable(
        dbTableJson.name, dbTableJson.primary_key, dbTableJson.not_null_keys, dbTableJson.null_keys,
        'createIfNotAlreadyExisting')))
      .then(resolve)
      .catch(reject)
  })
  .catch(reject))

// Create default values (if not existing)
const createdSetupValues = new Promise((resolve, reject) => createdSetupTables
  .then(() =>
    DatabaseTableValuesJsonParser.setupTableValues
      .then(dbTableValuesJson => {
        Promise.all(dbTableValuesJson.accounts
          .map(sqliteQuery => DatabaseApi.createAccount(sqliteQuery.name, sqliteQuery.password)))
          .then(resolve)
          .catch(reject)
      })
      .catch(reject))
  .catch(reject))

createdSetupValues
  .then(() => {
    console.log('Table setup completed')
    DatabaseApi.createAccount('admin', 'root')
      .then(a => { console.log('admin', 'RunResult:', JSON.stringify(a)) })
      .catch(err => {
        if (err.errno === DatabaseQueriesErrorHelper.errorCodes.SQLITE_CONSTRAINT) {
          console.log(`SQLITE_CONSTRAINT error detected: "${err.message}"`)
        }
      })
    DatabaseApi.createAccount('niklas', 'niklas')
      .then(a => { console.log('niklas', 'RunResult:', JSON.stringify(a)) })
      .catch(err => {
        if (err.errno === DatabaseQueriesErrorHelper.errorCodes.SQLITE_CONSTRAINT) {
          console.log(`SQLITE_CONSTRAINT error detected: ${err.message}`)
        }
      })
  })
  .catch(console.error)
