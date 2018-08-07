#!/usr/bin/env node
'use strict'

/*
 * Description:
 * This class helps interacting with the database
 */

// get parser and parsing helper inheritance classes
const {DatabaseTablesJsonParser} = require('./database_tables_parse_json')
const {DocumentationParserTables, SQLiteParserTables} = require('./database_tables_parse_json_custom_parser')
const {DatabaseTableValuesJsonParser} = require('./database_table_values_parse_json')
const {DocumentationParserTableValues, SQLiteParserTableValues} = require('./database_table_values_parse_json_custom_parser')

/**
 *Class that make it easy to interact with the database
 *
 * @class DatabaseHelper
 */
class DatabaseHelper {
  /**
   * Get 'Create table' SQLite queries
   *
   * @readonly
   * @static
   * @returns {Promise} Which resolves with an string array of SQLite queries
   * @memberof DatabaseHelper
   * @example
   * DatabaseHelper.setupSQLiteTablesQueries
   *   .then(stringArray => console.log(stringArray))
   * // outputs ['', '', ...]
   */
  static get setupSQLiteTablesQueries () {
    return DatabaseTablesJsonParser.parseDatabaseTablesWithClass(new SQLiteParserTables())
  }
  /**
   * Get database table structure in markdown format
   *
   * @readonly
   * @static
   * @returns {Promise} Which resolves with a string in markdown format
   * @memberof DatabaseHelper
   */
  static get markdownDocumentationTables () {
    return DatabaseTablesJsonParser.parseDatabaseTablesWithClass(new DocumentationParserTables())
  }
  static get setupSQLiteTableValuesQueries () {
    return DatabaseTableValuesJsonParser.parseDatabaseTableValuesWithClass(new SQLiteParserTableValues())
  }
  static get markdownDocumentationTableValues () {
    return DatabaseTablesJsonParser.parseDatabaseTablesWithClass(new DocumentationParserTableValues())
  }
}

module.exports = DatabaseHelper
