#!/usr/bin/env node
'use strict'

/*
 * Description:
 * This file contains custom parser for parsing the database table values JSON file
 */

// get parsing helper inheritance class
const { DatabaseTableValuesParsingClass } = require('./database_table_values_parse_json')

/**
 * Parse database table values JSON file to sqlite 'insert' query string array
 *
 * @class SQLiteParserTableValues
 * @extends {DatabaseTableValuesParsingClass}
 * @author AnonymerNiklasistanonym <https://github.com/AnonymerNiklasistanonym>
 */
class SQLiteParserTableValues extends DatabaseTableValuesParsingClass {
  constructor () {
    super()
    console.log('Implement later')
  }
  do (jsonObject) {
    return ['implement', 'later']
  }
}

/**
 * Parse database table JSON file to markdown documentation string
 *
 * @class DocumentationParserTableValues
 * @extends {DatabaseTableValuesParsingClass}
 */
class DocumentationParserTableValues extends DatabaseTableValuesParsingClass {
  constructor () {
    super()
    console.log('Implement later')
  }
  do (jsonObject) {
    return 'implement later'
  }
}

module.exports = { DocumentationParserTableValues, SQLiteParserTableValues }
