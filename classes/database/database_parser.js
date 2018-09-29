#!/usr/bin/env node
'use strict'

/*
 * This file contains:
 * Parser for complex Database post/get requests
 */

/**
 * Type definition for a Key object
 * @typedef {{name: string, type: KeyType, default?: KeyDefault, reference?: KeyReference, options?: KeyOptions}} Key
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
 * @typedef {{unique?: boolean, notNull?: boolean, primary?: boolean, autoincrement?: boolean}} KeyOptions
 */
/**
 * Type definition for a ParsedKey object
 * @typedef {{query: string, reference: string}} ParsedKey
 */
/**
 * Type definition for a TableOptions object
 * @typedef {('createIfNotAlreadyExisting'|'createEvenIfAlreadyExisting')} TableOption
 */

/**
 * Static class to parse a database create table query
 */
class DatabaseParserCreateTable {
  /**
   * Parse table header
   * @param {TableOption} option Table creation option
   * @returns {string} Table header
   */
  static parseTableHeader (name, option = null) {
    if (option) {
      switch (option) {
        case 'createIfNotAlreadyExisting':
          return 'CREATE TABLE IF NOT EXISTS `' + name + '`'
        case 'createEvenIfAlreadyExisting':
          return 'DROP TABLE IF EXISTS `' + name + '`; CREATE TABLE `' + name + '`'
        default:
          throw Error('Unknown table header option: ' + option)
      }
    } else {
      return 'CREATE TABLE `' + name + '`'
    }
  }
  /**
   * Parse primary table property key
   * @param {Key} primaryKey Primary property key
   * @returns {ParsedKey} Parsed key object
   */
  static parsePrimaryKey (primaryKey) {
    return this.parseKey(Object.assign(primaryKey, { options: { unique: true, notNull: true, primary: true } }))
  }
  /**
   * Parse not null table property key
   * @param {Key} notNullKey Not null property key
   * @returns {ParsedKey} Parsed key object
   */
  static parseNotNullKey (notNullKey) {
    return this.parseKey(Object.assign(notNullKey, { options: { notNull: true } }))
  }
  /**
   * Parse table property key
   * @param {Key} key Property key
   * @returns {ParsedKey} Parsed key object
   */
  static parseKey (key) {
    // get name and type
    let query = ['`' + key.name + '`', this.parseKeyType(key.type)]
    // check if there are additional options before default value
    if (key.hasOwnProperty('options')) {
      query.push(...this.parseKeyOptionsBeforeDefault(key.options))
    }
    // check if there is a default value
    if (key.hasOwnProperty('default')) {
      query.push('DEFAULT ' + this.parseKeyDefault(key.type, key.default) + '')
    }
    // check if there are additional options after default value
    if (key.hasOwnProperty('options')) {
      query.push(...this.parseKeyOptionsAfterDefault(key.options))
    }
    // check if there are additional references
    if (key.hasOwnProperty('reference')) {
      return { query: query.join(' '), reference: 'FOREIGN KEY (`' + key.name + '`) REFERENCES `' + key.reference.table + '` (`' + key.reference.property + '`)' }
    } else {
      return { query: query.join(' '), reference: null }
    }
  }
  /**
   * @param {KeyType} keyType
   * @returns {('INTEGER'|'TEXT'|'INTEGER'|'DATETIME')}
   */
  static parseKeyType (keyType) {
    switch (keyType) {
      case 'integer':
        return 'INTEGER'
      case 'text':
        return 'TEXT'
      case 'boolean':
        return 'INTEGER'
      case 'date':
        return 'DATETIME'
      default:
        throw Error('Unknown key type: ' + keyType)
    }
  }
  /**
   * @param {KeyOptions} keyOptions
   * @returns {string[]}
   */
  static parseKeyOptionsBeforeDefault (keyOptions) {
    let options = []
    if (keyOptions.hasOwnProperty('notNull') && keyOptions.notNull) {
      options.push('NOT NULL')
    }
    return options
  }
  /**
   * @param {KeyOptions} keyOptions
   * @returns {string[]}
   */
  static parseKeyOptionsAfterDefault (keyOptions) {
    let options = []
    if (keyOptions.hasOwnProperty('primary') && keyOptions.primary) {
      options.push('PRIMARY KEY')
    }
    if (keyOptions.hasOwnProperty('autoincrement') && keyOptions.autoincrement) {
      options.push('AUTOINCREMENT')
    }
    if (keyOptions.hasOwnProperty('unique') && keyOptions.unique) {
      options.push('UNIQUE')
    }
    return options
  }
  /**
   * Parse default value of key
   * @param {KeyType} keyType
   * @param {(string|number|boolean)} keyDefaultValue
   * @returns {string}
   */
  static parseKeyDefault (keyType, keyDefaultValue) {
    // jshint maxcomplexity:7
    switch (keyType) {
      case 'date':
        return keyDefaultValue === 'now' ? "(datetime(CURRENT_TIMESTAMP, 'localtime'))" : '' + keyDefaultValue
      case 'boolean':
        if (typeof (keyDefaultValue) === typeof (true)) {
          return keyDefaultValue ? '1' : '0'
        } else {
          throw Error('Boolean value is not boolean: "' + keyDefaultValue + '" (' + keyDefaultValue.constructor.name + ')')
        }
      case 'integer':
        // @ts-ignore
        if (typeof (keyDefaultValue) === typeof (1) && Number.isInteger(keyDefaultValue)) {
          // @ts-ignore
          return '' + Math.round(keyDefaultValue)
        } else {
          throw Error('Integer value is not an even number: "' + keyDefaultValue + '" (' + keyDefaultValue.constructor.name + ')')
        }
      case 'text':
        return "'" + keyDefaultValue + "'"
      default:
        throw Error('Unknown key type: ' + keyType)
    }
  }
}

/**
 * Static class that help to access/interact/talk to the database
 */
class DatabaseParser {
  /**
   * Create a database 'create table' query
   * @param {string} name Table name
   * @param {Key} primaryKey Primary key object
   * @param {Key[]} notNullKeys Not null key objects
   * @param {Key[]} nullKeys Null key objects
   * @param {TableOption} option Table creation option
   * @returns {string} Query
   */
  static createTableQuery (name, primaryKey, notNullKeys = [], nullKeys = [], option = null) {
    // parse all keys
    const primaryKeyParsed = DatabaseParserCreateTable.parsePrimaryKey(primaryKey)
    const otherKeysParsed = notNullKeys.map(a => DatabaseParserCreateTable.parseNotNullKey(a)).concat(nullKeys.map(a => DatabaseParserCreateTable.parseKey(a)))
    // concat all 'normal' queries
    const queries = [primaryKeyParsed.query, ...otherKeysParsed.map(a => a.query)]
    // concat all 'reference' queries and filter the null entries
    const references = [primaryKeyParsed.reference, ...otherKeysParsed.map(a => a.reference)].filter(a => a !== null)
    // parse the table header
    const tableHeader = DatabaseParserCreateTable.parseTableHeader(name, option)
    // bring everything together
    return tableHeader + ' (' + [...queries, ...references].join(', ') + ');'
  }
}

// export the static class to another script
module.exports = DatabaseParser
