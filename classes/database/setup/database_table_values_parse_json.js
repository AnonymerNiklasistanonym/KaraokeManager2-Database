#!/usr/bin/env node
'use strict'

/*
 * Description:
 * This file contains a parser of the database table value JSON file with an class that can be inherited for customized parsing of the JSON file
 */

// Convert callbacks to promises
const promisify = require('util').promisify
// Read files asynchronously
const readFile = require('fs').readFile

// Convert normal async ready file with callback to promise
const readFilePromise = promisify(readFile)

/**
 * Parse JSON file to JSON object and then to something else with an additional parser class
 *
 * @class DatabaseTableValuesJsonParser
 * @author AnonymerNiklasistanonym <https://github.com/AnonymerNiklasistanonym>
 */
class DatabaseTableValuesJsonParser {
  /**
   * @readonly
   * @static
   * @returns {string} Path of JSON file which contains the database table values
   * @memberof DatabaseTableValuesJsonParser
   */
  static get JSON_FILE_DATABASE_TABLE_VALUES_PATH () {
    return 'data/database/default_values.json'
  }
  /**
   *Parse JSON file to JSON object
   *
   * @static
   * @returns {Promise} Promise that resolves with the parsed JSON object
   * @memberof DatabaseTableValuesJsonParser
   */
  static parseDatabaseTableValues () {
    return new Promise((resolve, reject) => {
      readFilePromise(this.JSON_FILE_DATABASE_TABLE_VALUES_PATH)
        .then(file => resolve(JSON.parse(file.toString())))
        .catch(err => reject(err))
    })
  }
  /**
   * Get SQLite queries to create all necessary tables
   *
   * @static
   * @param {DatabaseTableValuesParsingClass} parseClass Class that implements parsing methods
   * @returns {Promise} Promise that resolves with the complete parsed result
   * @memberof DatabaseTableValuesJsonParser
   */
  static parseDatabaseTableValuesWithClass (parseClass) {
    return new Promise((resolve, reject) => this.parseDatabaseTableValues()
      .then(jsonObject => resolve(parseClass.do(jsonObject)))
      .catch(err => reject(err)))
  }
}

/**
 * Additional parsing class to parse the database table value JSON file that implements all methods needed for the DatabaseTableValuesJsonParser class
 *
 * @class DatabaseTableValuesParsingClass
 */
class DatabaseTableValuesParsingClass {
  constructor () {
    console.log('Implement later')
  }
  do (jsonObject) {
    throw new Error('Method needs to be implemented')
  }
}

module.exports = { DatabaseTableValuesJsonParser, DatabaseTableValuesParsingClass }
