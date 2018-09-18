#!/usr/bin/env node
'use strict'

/*
 * This file contains:
 * Basic methods to access/talk to the database
 */

const sqlite3 = require('sqlite3')

/**
 * Static class that help to access/interact/talk to the database
 */
class DatabaseAccess {
  /**
   * Returns database path
   * @returns {string} - The path of the database
   */
  static get databasePath () {
    return './retiDatabase.db'
  }

  /**
     *  Checks if the database can be accessed
     * @param {function(Error)} callback - Optional callback function with Error object
     * @param {string} purpose - (Debugging) purpose of connection
     */
  static checkIfDatabaseCanBeAccessed (callback = console.log, purpose = 'test if database can be accessed') {
    // check if the database file can be found
    if (require('fs').existsSync(this.databasePath)) {
      // check if the database can be opened/accessed
      const db = this.openSqliteDbRo(purpose)
      if (db === undefined) {
        callback(Error('Database could not be accessed!'))
      } else {
        db.close((err) => {
          if (err) {
            console.log('$ ' + err.message + ' (' + purpose + ')')
            callback(err)
          } else {
            console.log('$ Database connection closed (' + purpose + ')')
            callback(null)
          }
        })
      }
    } else {
      callback(Error('Database file not found!'))
    }
  }

  /**
     * Connect to the database to read and write
     * @param {string} purpose - (Debugging) purpose of connection
     * @returns {sqlite3.Database} - The sqlite database
     */
  static openSqliteDbRw (purpose = 'not specified') {
    return new sqlite3.Database(this.databasePath, sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
        console.error('$ ' + err.message + ' (' + purpose + ')')
      } else {
        console.log('$ Database connection opened "rw" (' + purpose + ')')
      }
    })
  }

  /**
     * Connect to the database to read only
     * @param {string} purpose - (Debugging) purpose of connection
     * @returns {sqlite3.Database} - The sqlite database
     */
  static openSqliteDbRo (purpose = 'not specified') {
    return new sqlite3.Database(this.databasePath, sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        console.error('$ ' + err.message + ' (' + purpose + ')')
      } else {
        console.log('$ Database connection opened "ro" (' + purpose + ')')
      }
    })
  }

  /**
     * Get data from the database with a given query (because async a callback is needed!)
     * @param {string} query - 'GET' query for the database
     * @param {string} purpose - (Debugging) purpose of connection
     * @param {(function(Error, [{}])|function(Error))} callback - Optional callback function with Error object and if successfully as second parameter the requested data
     */
  static makeSqlRequestGet (query, purpose = 'not specified', callback = console.log) {
    // create empty list for objects that we want
    let requestedList = []

    // open/connect to the database
    let db = this.openSqliteDbRo(purpose)

    let errorMsg

    // debug the request
    console.log('$ Database request "GET" ' + purpose + ':')

    // check if the database connection was successfully
    if (db !== undefined && db !== null) {
      // serialize() method puts the execution mode into serialized mode. It means that only one statement can execute at a time. Other statements will wait in a queue until all the previous statements are executed
      db.serialize(() => {
        // queries scheduled here are now serialized

        db.each(query, (err, row) => {
          if (err) {
            if (errorMsg === undefined) {
              errorMsg = err.message
            } else {
              errorMsg += ', ' + err.message
            }
            console.error(err.message)
          } else {
            // add the matching row from the database to the (empty) list
            requestedList.push(row)
          }
        })
      })
    } else {
      console.error('$ Database connection was never established! (' + purpose + ')')
      callback(Error('Database connection was never established!'))
    }
  }

  /**
     * Edit the database and get true/false as parameter in the callback function
     * @param {string} query - Query for the database
     * @param {[]} properties - The data for the query
     * @param {string} purpose - Optional database (debug) name
     * @param {function(Error)} callback - Optional callback function with Error
     */
  static makeSqlRequestEdit (query, properties, purpose = 'not specified', callback = console.log) {
    // open/connect to main database
    let db = this.openSqliteDbRw(purpose)

    let errorMsg

    // make the request...
    console.log('$ Database request "EDIT/POST"  (' + purpose + '):')
    // ...if the main database exists
    if (db !== undefined || db !== null) {
      db.serialize(() => {
        db.run(query, properties, (runResult, err) => {
          // if there is an error return false in the callback function
          if (err) {
            if (errorMsg === undefined) {
              errorMsg = err.message
            } else {
              errorMsg += ', ' + err.message
            }
            console.error(err.message)
          } else {
            // else log the change/action in the console
            console.log(`$ (${purpose}) in row ${runResult.changes}`)
          }
        })
      })
    } else {
      console.error('$ Database connection was never established! (' + purpose + ')')
      callback(Error('Database connection was never established!'))
    }
  }

  /**
     * Get data from the database with a given query (because async a callback is needed!)
     * @param {string} query - 'GET' query for the database
     * @param {string} purpose - (Debugging) purpose of connection
     * @param {function(Error, [{}])} callback - Optional callback function with Error object and if successfull as second parameter the requested data
     */
  static makeSqlRequestGetRw (query, purpose = 'not specified', callback = console.log) {
    // create empty list for objects that we want
    let requestedList = []

    // open/connect to the database
    let db = this.openSqliteDbRw(purpose)

    let errorMsg

    // debug the request
    console.log('$ Database request "GET/EDIT" ' + purpose + ':')

    // check if the database connection was successfully
    if (db !== undefined && db !== null) {
      // serialize() method puts the execution mode into serialized mode. It means that only one statement can execute at a time. Other statements will wait in a queue until all the previous statements are executed
      db.serialize(() => {
        // queries scheduled here are now serialized

        db.each(query, (err, row) => {
          if (err) {
            if (errorMsg === undefined) {
              errorMsg = err.message
            } else {
              errorMsg += ', ' + err.message
            }
            console.error(err.message)
          } else {
            // add the matching row from the database to the (empty) list
            requestedList.push(row)
          }
        })
      })
    } else {
      console.error('$ Database connection was never established! (' + purpose + ')')
      callback(Error('Database connection was never established!'))
    }
  }
}

// export the static class to another script
module.exports = { DatabaseAccess: DatabaseAccess }
