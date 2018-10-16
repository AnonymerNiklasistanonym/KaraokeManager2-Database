#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * Basic methods to make get and post requests to the database
 */

const sqlite3 = require('sqlite3')

/**
 * Static class that help to access/interact/talk to the database
 */
class DatabaseAccess {
  /**
   * Returns database file path
   * @returns {'./database.db'} File path
   */
  static get databasePath () {
    return './database.db'
  }
  /**
   * Get an accessible database object
   * @returns {Promise<import('sqlite3').Database>} sqlite database object
   */
  static getSqlite3Database (readOnly = true) {
    return new Promise((resolve, reject) => {
      // tslint:disable-next-line:no-bitwise
      const sqliteNumber = (readOnly ? sqlite3.OPEN_READONLY : sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE)
      const db = new sqlite3.Database(this.databasePath, sqliteNumber, err => {
        if (err) {
          reject(err)
        } else {
          // Enable WAL-MODE (Write-Ahead Logging) for concurrent access: https://sqlite.org/wal.html
          db.run('PRAGMA journal_mode = WAL;', err2 => {
            if (err2) {
              reject(err2)
            } else {
              resolve(db)
            }
          })
        }
      })
    })
  }
}

/**
 * Static class that helps to identify errors
 */
class DatabaseQueriesErrorHelper {
  /**
   * Get sqlite3 database error codes
   * @example if (err.errno === DatabaseQueriesErrorHelper.errorCodes.SQLITE_CONSTRAINT) {
   *   console.error('SQLITE_CONSTRAINT error detected: "' + err.message + '"')
   * }
   */
  static get errorCodes () {
    return Object.freeze({
      /**
       * Happens when a constraint in the database table structure prevents an action
       * like an insert of an entry because of a unique key that is already there and
       * thus the new entry cannot be saved
       */
      SQLITE_CONSTRAINT: 19,
      /**
       * Can be nearly anything like:
       * - Table already exists
       */
      SQLITE_ERROR: 1
    })
  }
}

/**
 * Static class that help to make post/get requests to the database
 */
class DatabaseQueries {
  /**
   * Method wrapper to get the database and check if a connection could be established
   * @param {boolean} readOnly
   * @returns {Promise<import('sqlite3').Database>}
   */
  static databaseWrapper (readOnly = true) {
    return new Promise((resolve, reject) => DatabaseAccess.getSqlite3Database(readOnly)
      .then(database => {
        // Check if the database connection was successfully and then run the query
        if (database === undefined || database === null) {
          reject(Error('Database connection was never established!'))
        } else {
          resolve(database)
        }
      })
      .catch(reject))
  }
  /**
   * Get something from the database
   * @param {string} query Query for the database
   * @param {*[]} parameters Parameter for safe query
   * @returns {Promise<*>} Request list
   */
  static getEachRequest (query, parameters = []) {
    return new Promise((resolve, reject) => this.databaseWrapper(true)
      .then(database => {
        // Create empty list to collect objects that we want
        // @ts-ignore
        let requestedElement
        // Make request for one element
        database.each(query, parameters,
          (err, row) => {
            if (err) {
              // -> console.error(query, parameters)
              reject(err)
            } else {
              requestedElement = row
            }
          },
          // @ts-ignore
          (err, count) => {
            if (err) {
              // -> console.error(query, parameters)
              reject(err)
            } else {
              resolve(requestedElement)
              /*
              if (requestedElement === undefined) {
                // -> console.error(query, parameters)
                reject(Error('No entry found!'))
              } else {
                resolve(requestedElement)
              }
              */
            }
          })
      })
      .catch(reject))
  }
  /**
   * Get something from the database
   * @param {string} query Query for the database
   * @param {*[]} parameters Parameter for safe query
   * @returns {Promise<*[]>} Request list
   */
  static getAllRequest (query, parameters = []) {
    return new Promise((resolve, reject) => this.databaseWrapper(true)
      .then(database => database.all(query, parameters,
        // @ts-ignore
        (err, rows) => {
          if (err) {
            // -> console.error(query, parameters)
            reject(err)
          } else {
            resolve(rows)
          }
        }))
      .catch(reject))
  }
  /**
   * Edit something in database
   * @param {string} query Query for the database
   * @param {*[]} parameters Query data (for better security)
   * @returns {Promise<import('databaseQueriesTypes').IPostRequestResult>} Post result
   */
  static postRequest (query, parameters = []) {
    // -> console.log(query, parameters)
    return new Promise((resolve, reject) => this.databaseWrapper(false)
      .then(database => database.run(query, parameters, function (err) {
        // No ES6 style function because of otherwise this would be the class and not the RunResult
        err ? reject(err) : resolve(this)
      })
      )
      .catch(reject))
  }
  /**
   * Create `INSERT INTO` query
   * @param {string} tableName Table name
   * @param {string[]} columns Columns
   * @returns {string} Query
   */
  static createInsertQuery (tableName, columns) {
    return `INSERT INTO ${tableName}(${columns.join(',')}) ` +
      `VALUES(${columns.map(() => '?')
        .join(',')});`
  }
  /**
   * Create `EXISTS` query
   * @param {string} tableName Table name
   * @param {string} column Column
   * @returns {string} Query
   */
  static createExistsQuery (tableName, column = 'id') {
    return `SELECT EXISTS(SELECT 1 FROM ${tableName} WHERE ${column}=?) AS exists_value;`
  }
  /**
   * Create `INSERT INTO` query
   * @param {string} tableName Table name
   * @param {string[]} columns Columns
   * TODO:
   * @param {{otherTableName:string,otherColumn:string,thisColumn:string}[]} [innerJoins] InnerJoins
   * TODO:
   * @param {string} [whereColumn] Where column, value is '?'
   * @returns {string} Query
   */
  static createSelectQuery (tableName, columns, innerJoins, whereColumn) {
    let innerJoinsStr = ''
    let whereStr = ''

    if (innerJoins !== undefined) {
      innerJoinsStr = innerJoins
        .map(a => `INNER JOIN ${a.otherTableName} ON ${a.otherColumn}=${a.thisColumn}`)
        .join(' ')
    }
    if (whereColumn !== undefined) {
      whereStr = `WHERE ${whereColumn}=?`
    }

    return `SELECT ${columns.join(',')} FROM ${tableName} ${innerJoinsStr} ${whereStr};`
  }
  /**
   * Get if some column value exists in some table
   * @param {string} tableName Table name
   * @param {string} column Column
   * @param {(number|string)} value Column value
   * @returns {Promise<boolean>} Exists
   */
  static getExists (tableName, column, value) {
    return new Promise((resolve, reject) => {
      DatabaseQueries.getEachRequest(DatabaseQueries.createExistsQuery(tableName, column), [value])
        .then(result => { resolve(result.exists_value === 1) })
        .catch(reject)
    })
  }
  /**
   * Create `DELETE` query
   * @param {string} tableName Table name
   * @param {string} whereColumn Column
   * @returns {string} Query
   */
  static createDeleteQuery (tableName, whereColumn = 'id') {
    return `DELETE FROM ${tableName} WHERE ${whereColumn}=?;`
  }
}

module.exports = { DatabaseAccess, DatabaseQueries, DatabaseQueriesErrorHelper }
