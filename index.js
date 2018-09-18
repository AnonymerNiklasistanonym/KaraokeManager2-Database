#!/usr/bin/env node
'use strict'

// database
const sqlite3 = require('sqlite3')
const DatabaseHelper = require('./classes/database/setup/database_helper').DatabaseHelper

/**
 * Express http socket-io server
 */
const serverHttp = require('./classes/server/socket_server').ServerHttp
/**
 * Express https socket-io server
 */
const serverHttps = require('./classes/server/socket_server').ServerHttps

// start server
serverHttp.listen(8080, () => console.log('Example app listening on port 8080!'))
serverHttps.listen(8443, () => console.log('Example app listening on port 8443!'))

// create/open connection to database
let db = new sqlite3.Database('./karaokemanager2_database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  err => {
    if (err) {
      console.error(err.message)
    }
    console.log('Connected to the database.')
  })

// create tables (if not existing)
let createdSetupTables = new Promise((resolve, reject) => {
  DatabaseHelper.setupSQLiteTablesQueries
    .then(sqlQueries => {
      db.serialize(() => {
        sqlQueries.forEach(sqliteQuery => {
          db.run(sqliteQuery, err => {
            if (err) console.error(err.message)
          })
        })
      })
      resolve()
    })
    .catch(err => reject(err))
})

// create default values (if not existing)
let createdSetupValues = new Promise((resolve, reject) => {
  createdSetupTables.then(() => {
    DatabaseHelper.setupSQLiteTableValuesQueries
      .then(sqlQueries => {
        db.serialize(() => {
          sqlQueries.forEach(sqliteQuery => {
            db.run(sqliteQuery, err => {
              if (err) console.error(err.message)
            })
          })
        })
        resolve()
      })
      .catch(err => reject(err))
  }).catch(err => reject(err))
})

createdSetupValues
  .then(() => {
    // close database
    db.close(err => {
      if (err) {
        console.error(err.message)
      }
      console.log('Close the database connection.')
    })
  })
  .catch(err => console.error(err))
