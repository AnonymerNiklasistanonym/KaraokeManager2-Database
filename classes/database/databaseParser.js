#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * Parser for complex Database post/get requests
 */

/**
 * Static class to parse a database create table query
 */
class DatabaseParserCreateTable {
  /**
   * Parse table header
   * @param {string} name Table name
   * @param {import("./databaseTypes").TableOption} option Table creation option
   * @returns {string} Table header
   */
  static parseTableHeader (name, option) {
    if (option) {
      switch (option) {
        case 'createIfNotAlreadyExisting':
          return `CREATE TABLE IF NOT EXISTS \`${name}\``
        case 'createEvenIfAlreadyExisting':
          return `DROP TABLE IF EXISTS \`${name}\`; CREATE TABLE \`${name}\``
        default:
          throw Error('Unknown table header option: ' + option)
      }
    } else {
      return `CREATE TABLE \`${name}\``
    }
  }
  /**
   * Parse primary table property key
   * @param {import("./databaseTypes").IKey} primaryKey Primary property key
   * @returns {import("./databaseTypes").IParsedKey} Parsed key object
   */
  static parsePrimaryKey (primaryKey) {
    return this.parseKey({ ...primaryKey, options: { unique: true, notNull: true, primary: true } })
  }
  /**
   * Parse not null table property key
   * @param {import("./databaseTypes").IKey} notNullKey Not null property key
   * @returns {import("./databaseTypes").IParsedKey} Parsed key object
   */
  static parseNotNullKey (notNullKey) {
    return this.parseKey({ ...notNullKey, options: { notNull: true } })
  }
  /**
   * Parse table property key
   * @param {import("./databaseTypes").IKey} key Property key
   * @returns {import("./databaseTypes").IParsedKey} Parsed key object
   */
  static parseKey (key) {
    // Get name and type
    const query = [`\`${key.name}\``, this.parseKeyType(key.type)]
    // Check if there are additional options before default value
    if (key.hasOwnProperty('options')) {
      query.push(...this.parseKeyOptionsBeforeDefault(key.options))
    }
    // Check if there is a default value
    if (key.hasOwnProperty('default')) {
      query.push('DEFAULT ' + this.parseKeyDefault(key.type, key.default))
    }
    // Check if there are additional options after default value
    if (key.hasOwnProperty('options')) {
      query.push(...this.parseKeyOptionsAfterDefault(key.options))
    }
    // Check if there are additional references
    if (key.hasOwnProperty('reference')) {
      return {
        query: query.join(' '),
        reference: `FOREIGN KEY (\`${key.name}\`) REFERENCES \`${key.reference.table}\` (\`${key.reference.property}\`)`
      }
    } else {
      return { query: query.join(' '), reference: undefined }
    }
  }
  /**
   * @param {import("./databaseTypes").KeyType} keyType
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
   * @param {import("./databaseTypes").IKeyOptions} keyOptions
   * @returns {string[]}
   */
  static parseKeyOptionsBeforeDefault (keyOptions) {
    const options = []
    if (keyOptions.hasOwnProperty('notNull') && keyOptions.notNull) {
      options.push('NOT NULL')
    }

    return options
  }
  /**
   * @param {import("./databaseTypes").IKeyOptions} keyOptions
   * @returns {string[]}
   */
  static parseKeyOptionsAfterDefault (keyOptions) {
    // tslint:disable-next-line:cyclomatic-complexity
    const options = []
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
   * @param {import("./databaseTypes").KeyType} keyType
   * @param {(string|number|boolean)} keyDefaultValue
   * @returns {string}
   */
  static parseKeyDefault (keyType, keyDefaultValue) {
    // tslint:disable-next-line:cyclomatic-complexity
    switch (keyType) {
      case 'date':
        return keyDefaultValue === 'now' ? '(datetime(CURRENT_TIMESTAMP, \'localtime\'))' : '' + keyDefaultValue
      case 'boolean':
        if (typeof (keyDefaultValue) === typeof (true)) {
          return keyDefaultValue ? '1' : '0'
        } else {
          throw Error(`Boolean value is not boolean: "${keyDefaultValue}" (${keyDefaultValue.constructor.name})`)
        }
      case 'integer':
        // @ts-ignore
        if (typeof (keyDefaultValue) === typeof (1) && Number.isInteger(keyDefaultValue)) {
          // @ts-ignore
          return '' + Math.round(keyDefaultValue)
        } else {
          throw Error(`Integer value is not an even number: "${keyDefaultValue}" (${keyDefaultValue.constructor.name})`)
        }
      case 'text':
        return `'${keyDefaultValue}'`
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
   * @param {import("./databaseTypes").IKey} primaryKey Primary key object
   * @param {import("./databaseTypes").IKey[]} notNullKeys Not null key objects
   * @param {import("./databaseTypes").IKey[]} nullKeys Null key objects
   * @param {import("./databaseTypes").TableOption} option Table creation option
   * @returns {string} Query
   */
  static createTableQuery (name, primaryKey, notNullKeys = [], nullKeys = [], option) {
    // Parse all keys
    const primaryKeyParsed = DatabaseParserCreateTable.parsePrimaryKey(primaryKey)
    const otherKeysParsed = notNullKeys
      .map(a => DatabaseParserCreateTable.parseNotNullKey(a))
      .concat(nullKeys.map(a => DatabaseParserCreateTable.parseKey(a)))
    // Concat all 'normal' queries
    const queries = [primaryKeyParsed.query, ...otherKeysParsed.map(a => a.query)]
    // Concat all 'reference' queries and filter the null entries
    const references = [primaryKeyParsed.reference, ...otherKeysParsed.map(a => a.reference)]
      .filter(a => a !== undefined)
    // Parse the table header
    const tableHeader = DatabaseParserCreateTable.parseTableHeader(name, option)
    // Bring everything together

    return `${tableHeader} (${[...queries, ...references].join(', ')});`
  }
}

module.exports = DatabaseParser
