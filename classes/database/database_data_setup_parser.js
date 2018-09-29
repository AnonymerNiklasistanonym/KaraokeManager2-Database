#!/usr/bin/env node
'use strict'

/*
 * Description:
 * This file contains a parser of the database table JSON file with an class that can be inherited for customized parsing of the JSON file
 */

// Read files asynchronously
const fs = require('fs').promises

/**
 * Type definition for a Key object
 * @typedef {{name: string, description?: string, type: KeyType, default?: KeyDefault, reference?: KeyReference, options?: KeyOptions}} Key
 */
/**
 * Type definition for a KeyType object
 * @typedef {('integer'|'text'|'boolean'|'date')} KeyType
 */
/**
 * Type definition for a KeyType object
 * @typedef {{table: string, property: string}} KeyReference
 */
/**
 * Type definition for a KeyType object
 * @typedef {(number|boolean|string|'now')} KeyDefault
 */
/**
 * Type definition for a KeyOptions object
 * @typedef {{unique?: boolean, notNull?: boolean, primary?: boolean}} KeyOptions
 */

/**
 * Parse JSON file to JSON object and the to something else with an additional parser class
 *
 * @class DatabaseTablesJsonParser
 * @author AnonymerNiklasistanonym <https://github.com/AnonymerNiklasistanonym>
 */
class DatabaseTablesJsonParser {
  /**
   * Get the path of the JSON file which contains the database tables
   * @returns {'data/database/tables.json'} Json file path
   */
  static get JSON_FILE_DATABASE_TABLES_PATH () {
    return 'data/database/tables.json'
  }
  /**
   * Parse JSON file to JSON object
   * @returns {Promise<{name: string, description?: string, primary_key: Key, not_null_keys: Key[], null_keys: Key[]}[]>} Promise that resolves with the parsed JSON object
   */
  static get setupTables () {
    return new Promise((resolve, reject) =>
      fs.readFile(this.JSON_FILE_DATABASE_TABLES_PATH)
        .then(file => resolve(JSON.parse(file.toString())))
        .catch(reject))
  }
}

/**
 * Parse JSON file to JSON object and then to something else with an additional parser class
 *
 * @class DatabaseTableValuesJsonParser
 * @author AnonymerNiklasistanonym <https://github.com/AnonymerNiklasistanonym>
 */
class DatabaseTableValuesJsonParser {
  /**
   * Get the path of the JSON file which contains the database table values
   * @returns {'data/database/default_values.json'} Json file path
   */
  static get JSON_FILE_DATABASE_TABLE_VALUES_PATH () {
    return 'data/database/default_values.json'
  }
  /**
   * Parse JSON file to JSON object
   * @returns {Promise<{accounts:{name: string, password: string}[]}>} Promise that resolves with the parsed JSON object
   */
  static get setupTableValues () {
    return new Promise((resolve, reject) =>
      fs.readFile(this.JSON_FILE_DATABASE_TABLE_VALUES_PATH)
        .then(file => resolve(JSON.parse(file.toString())))
        .catch(reject))
  }
}

module.exports = { DatabaseTablesJsonParser, DatabaseTableValuesJsonParser }
