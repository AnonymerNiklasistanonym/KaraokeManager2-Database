#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * Description:
 * This file parses the setup data like
 * - accounts (root account)
 */

// Read files asynchronously
const fs = require('fs').promises

/**
 * Parse JSON file to JSON object and the to something else with an additional parser class
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
   * @returns {Promise<import('../databaseTypes').IJsonDataTables>} The parsed JSON object
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
   * @returns {Promise<import('../databaseTypes').IJsonDataTableDefaultValues>} The parsed JSON object
   */
  static get setupTableValues () {
    return new Promise((resolve, reject) =>
      fs.readFile(this.JSON_FILE_DATABASE_TABLE_VALUES_PATH)
        .then(file => resolve(JSON.parse(file.toString())))
        .catch(reject))
  }
}

module.exports = { DatabaseTablesJsonParser, DatabaseTableValuesJsonParser }
