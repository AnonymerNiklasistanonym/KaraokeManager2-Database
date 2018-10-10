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

const { DatabaseQueriesErrorHelper } = require('./classes/database/databaseQueries')
const DatabaseApi = require('./classes/database/databaseApi')
const DatabaseSetup = require('./classes/database/setup/databaseSetup')

/**
 * Express http/https socket-io server
 */
const { serverHttp, serverHttps } = require('./classes/server/socketServer')

// Start server
const httpPort = 8080
const httpsPort = 8443

serverHttp.listen(httpPort, () => { console.log(`Example app listening on -> http://localhost:${httpPort}`) })
serverHttps.listen(httpsPort, () => { console.log(`Example app listening on -> https://localhost:${httpsPort}`) })

DatabaseSetup.createEverything()
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
    DatabaseApi.getAccount('niklas')
      .then(a => { console.log('niklas', 'getAccount:', JSON.stringify(a)) })
      .catch(console.error)
    DatabaseApi.getAccountExists('not_existing')
      .then(a => { console.log('not_existing', 'getAccountExists:', JSON.stringify(a)) })
      .catch(console.error)
    DatabaseApi.getAccountExists('niklas')
      .then(a => { console.log('niklas', 'getAccountExists:', JSON.stringify(a)) })
      .catch(console.error)
    DatabaseApi.authorizeAccount('niklas', 'niklas')
      .then(a => { console.log('niklas', 'authorizeAccount:', a) })
      .catch(console.error)
    DatabaseApi.authorizeAccount('niklas', 'niklas_wrong_password')
      .then(a => { console.log('niklas', 'authorizeAccount: [wrong password]', a) })
      .catch(console.error)
    DatabaseApi.authorizeAccount('admin', 'niklas')
      .then(a => { console.log('admin', 'authorizeAccount: [wrong password]', a) })
      .catch(console.error)
    DatabaseApi.getSongs()
      .then(a => { console.log('getSongs', a) })
      .catch(console.error)
    DatabaseApi.getSongs(1)
      .then(a => { console.log('getSongs [page: 1]', a) })
      .catch(console.error)
    DatabaseApi.getSongs(0, 2, 'Levitate')
      .then(a => { console.log('getSongs [page: 0, "Levitate"]', a) })
      .catch(console.error)
    DatabaseApi.getArtists('Linkin Park')
      .then(a => { console.log('getArtists', 'Linkin Park', a) })
      .catch(console.error)
    DatabaseApi.getArtists('Linkin Park')
      .then(a => a.forEach(b => DatabaseApi.getArtist(b)
        .then(result => { console.log(`artist["${b}"]`, result) })
        .catch(console.error)))
      .catch(console.error)
    DatabaseApi.getArtists('Linkin Park')
      .then(a => a.forEach(b => DatabaseApi.deleteArtist(b)
        .then(result => { console.log(`delete artist["${b}"]`, result) })
        .catch(console.error)))
      .catch(console.error)
  })
  .catch(console.error)
