#!/usr/bin/env node
'use strict'

/*
 * Description:
 * This file contains custom parser for parsing the database table JSON file
 */

// get parsing helper inheritance class
const {DatabaseTableParsingClass} = require('./database_table_parse_json')

/**
 * Parse database table JSON file to sqlite create table query string array
 *
 * @class SQLiteParser
 * @extends {DatabaseTableParsingClass}
 */
class SQLiteParser extends DatabaseTableParsingClass {
  constructor () {
    super()
    this.sqliteQuery = ''
    this.sqliteQueries = []
    this.sqliteQueryProperty = ''
  }
  parseEverythingBegin () {
    this.sqliteQueries = []
  }
  parseTableBegin (tableName, tableDescription) {
    super.parseTableBegin(tableName, tableDescription)
    this.sqliteQuery = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' ('
  }
  parseTablePropertyName (tablePropertyName, tablePropertyDescription) {
    this.sqliteQueryProperty = tablePropertyName
  }
  parseTablePropertyType (tablePropertyType) {
    switch (tablePropertyType) {
      case 'integer':
        this.sqliteQueryProperty += ' integer'
        break
      case 'text':
        this.sqliteQueryProperty += ' text'
        break
      case 'boolean':
        this.sqliteQueryProperty += ' integer'
        break
      case 'date':
        this.sqliteQueryProperty += ' DATETIME'
        break
    }
  }
  parseTablePropertyIsPrimaryKey () {
    this.sqliteQueryProperty += ' PRIMARY KEY NOT NULL UNIQUE'
  }
  parseTablePropertyIsNotNullUniqueKey (notNull, unique) {
    if (notNull) {
      this.sqliteQueryProperty += ' NOT NULL'
    }
    if (unique) {
      this.sqliteQueryProperty += ' UNIQUE'
    }
  }
  parseTablePropertyDefault (defaultValue, propertyValue) {
    if (propertyValue === 'boolean') {
      this.sqliteQueryProperty += defaultValue ? ' DEFAULT (1)' : ' DEFAULT (0)'
    } else if (propertyValue === 'date' && defaultValue === 'now') {
      this.sqliteQueryProperty += " DEFAULT (datetime(CURRENT_TIMESTAMP, 'localtime'))"
    } else {
      this.sqliteQueryProperty += ' DEFAULT (' + defaultValue + ')'
    }
  }
  parseTablePropertyReturn () {
    return this.sqliteQueryProperty
  }
  parseTablePropertyReference (tableName, referenceTable, referenceProperty) {
    return 'FOREIGN KEY (' + tableName + ')' + ' REFERENCES ' + referenceTable + ' (' + referenceProperty + ')'
  }
  resolveTable () {
    // add non null/undefined references to sqliteQueryProperties
    for (let reference of this.databaseReferences) {
      reference && this.databaseProperties.push(reference)
    }
    // add properties to sql query
    this.sqliteQuery += this.databaseProperties.join(', ') + ');'
    // add query to query array
    this.sqliteQueries.push(this.sqliteQuery)
  }
  resolveEverything () {
    return this.sqliteQueries
  }
}

/**
 * Parse database table JSON file to markdown documentation string
 *
 * @class DocumentationParser
 * @extends {DatabaseTableParsingClass}
 */
class DocumentationParser extends DatabaseTableParsingClass {
  /**
   * Get path of database structure documentation file
   */
  static get MD_FILE_DOCUMENTATION_TABLES () {
    return 'documentation_database_structure.md'
  }

  constructor () {
    super()
    this.markdownTableProperty = ''
    this.markdownDocumentation = ''
    this.markdownTables = []
    this.markdownTablesToc = []
    this.markdownTable = ''
    this.markdownTablePropertyDescription = ''
  }
  parseEverythingBegin () {
    this.markdownDocumentation = '# Database documentation\n\n' +
      'This automated created document shows how the database is currently structured for a better overview.\n\n' + 'Content:\n'
    this.markdownTables = []
    this.markdownTablesToc = ['- [Tables](#tables)']
  }
  parseTableBegin (tableName, tableDescription) {
    super.parseTableBegin()
    this.markdownTable = '### ' + tableName + '\n' + tableDescription + '\n\n'
    this.markdownTablesToc.push('   - [' + tableName + '](#' + tableName + ')')
  }
  parseTablePropertyName (tablePropertyName, tablePropertyDescription) {
    this.markdownTableProperty = '- ' + tablePropertyName
    this.markdownTablePropertyDescription = tablePropertyDescription
  }
  parseTablePropertyType (tablePropertyType) {
    switch (tablePropertyType) {
      case 'integer':
        this.markdownTableProperty += ' (`integer`)'
        break
      case 'text':
        this.markdownTableProperty += ' (`text`)'
        break
      case 'boolean':
        this.markdownTableProperty += ' (`boolean/integer`)'
        break
      case 'date':
        this.markdownTableProperty += ' (`date/DATETIME`)'
        break
    }
  }
  parseTablePropertyIsPrimaryKey () {
    this.markdownTableProperty += ' [**PRIMARY KEY**, *NOT NULL*, *UNIQUE*]'
  }
  parseTablePropertyIsNotNullUniqueKey (notNull, unique) {
    if (notNull && unique) {
      this.markdownTableProperty += ' [*NOT NULL*, *UNIQUE*]'
    } else if (notNull) {
      this.markdownTableProperty += ' [*NOT NULL*]'
    } else if (unique) {
      this.markdownTableProperty += ' [*UNIQUE*]'
    }
  }
  parseTablePropertyDefault (defaultValue, propertyValue) {
    this.markdownTableProperty += ' >> **Default:** ' + defaultValue
    if (propertyValue === 'boolean') {
      this.markdownTableProperty += defaultValue ? ' (`1`)' : ' (`0`)'
    } else if (propertyValue === 'date' && defaultValue === 'now') {
      this.markdownTableProperty += " (`datetime(CURRENT_TIMESTAMP, 'localtime')`)"
    }
  }
  parseTablePropertyReturn () {
    return this.markdownTableProperty + '<br>*' + this.markdownTablePropertyDescription + '*'
  }
  parseTablePropertyReference (tableName, referenceTable, referenceProperty) {
    return '\n   - reference to [`' + referenceTable + '.' + referenceProperty + '`](#' + referenceTable + ')'
  }
  resolveTable () {
    // add non null/undefined references to sqliteQueryProperties
    for (let index = 0; index < this.databaseReferences.length; index++) {
      if (this.databaseReferences[index]) {
        // take the +1 property, because of primary key that is not counted
        this.databaseProperties[index + 1] = this.databaseProperties[index + 1] + this.databaseReferences[index]
      }
    }
    // add properties to sql query
    this.markdownTable += this.databaseProperties.join('\n') + '\n'
    // add query to query array
    this.markdownTables.push(this.markdownTable)
  }
  resolveEverything () {
    return this.markdownDocumentation + this.markdownTablesToc.join('\n') + '\n\n\n## Tables\n\n' + this.markdownTables.join('\n')
  }
}

module.exports = {DocumentationParser, SQLiteParser}
