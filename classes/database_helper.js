#!/usr/bin/env node
'use strict'

/*
 * Description:
 * This class helps interacting with the database
 */

// get parser and parsing helper inheritance classes
const {DatabaseTableJsonParser} = require('./database_table_parse_json')
const {DocumentationParser, SQLiteParser} = require('./database_table_parse_json_custom_parser')

// Convert callbacks to promises
const promisify = require('util').promisify
// Write files asynchronously
const writeFile = require('fs').writeFile

// Convert normal async ready file with callback to promise
const writeFilePromise = promisify(writeFile)

class DatabaseHelper {
  static parseToSQLiteQueries () {
    return DatabaseTableJsonParser.parseDatabaseTableWithClass(new SQLiteParser())
  }
  static createMarkdownDocumentation () {
    DatabaseTableJsonParser.parseDatabaseTableWithClass(new DocumentationParser())
      .then(returnValue => {
        writeFilePromise(DocumentationParser.MD_FILE_DOCUMENTATION_TABLES, returnValue)
          .then(console.log("Documentation exported to file ('" + DocumentationParser.MD_FILE_DOCUMENTATION_TABLES + "')"))
          .catch(err => console.error(err))
      })
      .catch(err => console.error(err))
  }
}

module.exports = DatabaseHelper
