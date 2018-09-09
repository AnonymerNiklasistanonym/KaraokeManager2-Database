#!/usr/bin/env node
'use strict'

/*
 * This file contains:
 * Api functions to interact with anything as fast, short and easy as possible
 */

/**
 * Class that contains all methods to easily and fast get all necessary/important stuff.
 *
 * @author AnonymerNiklasistanonym <https://github.com/AnonymerNiklasistanonym>
 */
class API {
  /**
   * Get 'Create table' SQLite queries
   *
   * @readonly
   * @static
   * @returns {Promise<boolean>} Which resolves with an string array of SQLite queries
   * @example
   * DatabaseHelper.setupSQLiteTablesQueries
   *   .then(stringArray => console.log(stringArray))
   * // outputs ['', '', ...]
   * @author AnonymerNiklasistanonym <https://github.com/AnonymerNiklasistanonym>
   */
  static get setupSQLiteTablesQueries () {
    return new Promise((resolve, reject) => true ? resolve(true) : reject(false))
  }
}

module.exports = API
