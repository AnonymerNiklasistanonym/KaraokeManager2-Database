#!/usr/bin/env node
'use strict'

/*
 * This file contains:
 * Basic methods to access the database
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
    return './database.db'
  }
  /**
   * Get a database object
   * @returns {Promise<sqlite3.Database>} sqlite database object
   */
  static getSqlite3Database (readOnly = true) {
    return new Promise((resolve, reject) => {
      const db = new sqlite3.Database(this.databasePath,
        (readOnly ? sqlite3.OPEN_READONLY : sqlite3.OPEN_READWRITE) | sqlite3.OPEN_CREATE,
        err => {
          if (err) {
            reject(err)
          } else {
            // Enable WAL-MODE (Write-Ahead Logging) for concurrent access: https://sqlite.org/wal.html
            db.run('PRAGMA journal_mode = WAL;', err2 => err2 ? reject(err2) : resolve(db))
          }
        })
    })
  }
}

// export the static class to another script
module.exports = DatabaseAccess
