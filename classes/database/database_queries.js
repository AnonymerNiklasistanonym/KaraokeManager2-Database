#!/usr/bin/env node
'use strict'

/*
 * This file contains:
 * Basic methods to make get and post requests to the database
 */

const DatabaseAccess = require('./database_access')

/**
 * Static class that help to access/interact/talk to the database
 */
class DatabaseQueries {
  /**
   * Get something from the database
   * @param {string} query Query for the database
   * @returns {Promise<*[]>} Request list
   */
  static getEachRequest (query, parameters = []) {
    return new Promise((resolve, reject) =>
      DatabaseAccess.getSqlite3Database(true).then(database => {
        // create empty list to collect objects that we want
        let requestedList = []
        // check if the database connection was successfully and then run the query
        if (database === undefined || database === null) {
          reject(Error('Database connection was never established!'))
        } else {
          database.each(query, parameters,
            (err, row) => err ? reject(err) : requestedList.push(row),
            (err, count) => err ? reject(err) : resolve(requestedList))
        }
      }).catch(reject))
  }
  /**
   * Edit something in database
   * @param {string} query Query for the database
   * @param {*[]} parameters Query data (for better security)
   * @returns {Promise<{lastID: number, changes: number}>} Post result
   */
  static postRequest (query, parameters = []) {
    return new Promise((resolve, reject) =>
      DatabaseAccess.getSqlite3Database(false).then(database => {
        // check if the database connection was successfully and then run the query
        if (database === undefined || database === null) {
          reject(Error('Database connection was never established!'))
        } else {
          // No ES6 style function because of otherwise this would be the class and not the RunResult
          database.run(query, parameters, function (err) {
            if (err) {
              reject(err)
            } else {
              resolve(this)
            }
          })
        }
      }).catch(reject))
  }
}

// export the static class to another script
module.exports = DatabaseQueries
