#!/usr/bin/env node
'use strict'

/*
 * Description:
 * This file contains a parser of the database table JSON file with an class that can be inherited for customized parsing of the JSON file
 */

// Convert callbacks to promises
const promisify = require('util').promisify
// Read files asynchronously
const readFile = require('fs').readFile

// Convert normal async ready file with callback to promise
const readFilePromise = promisify(readFile)

/**
 * Parse JSON file to JSON object and the to something else with an additional parser class
 *
 * @class DatabaseTablesJsonParser
 * @author AnonymerNiklasistanonym <https://github.com/AnonymerNiklasistanonym>
 */
class DatabaseTablesJsonParser {
  /**
   * @readonly
   * @static
   * @returns {string} Path of JSON file which contains the database tables
   * @memberof DatabaseTablesJsonParser
   */
  static get JSON_FILE_DATABASE_TABLES_PATH () {
    return 'data/tables.json'
  }
  /**
   *Parse JSON file to JSON object
   *
   * @static
   * @returns {Promise} Promise that resolves with the parsed JSON object
   * @memberof DatabaseTablesJsonParser
   */
  static parseDatabaseTables () {
    return new Promise((resolve, reject) => {
      readFilePromise(this.JSON_FILE_DATABASE_TABLES_PATH)
        .then(file => resolve(JSON.parse(file.toString())))
        .catch(err => reject(err))
    })
  }
  /**
   * Get SQLite queries to create all necessary tables
   *
   * @static
   * @param {DatabaseTablesParsingClass} parseClass Class that implements parsing methods
   * @returns {Promise} Promise that resolves with the complete parsed result
   * @memberof DatabaseTablesJsonParser
   */
  static parseDatabaseTablesWithClass (parseClass) {
    return new Promise((resolve, reject) => this.parseDatabaseTables()
      .then(jsonArrayObject => {
        // if parsing to JSON object was successful initialize custom parsing
        parseClass.parseEverythingBegin()
        // iterate over all tables of the JSON object
        jsonArrayObject.forEach(tableObject => {
          // check if name, description and primary key of table exist
          if (!tableObject.hasOwnProperty('name') || tableObject.name === '') {
            throw new Error('No table name found!')
          }
          if (!tableObject.hasOwnProperty('description') || tableObject.description === '') {
            throw new Error('No table description found! (' + tableObject.name + ')')
          }
          if (!tableObject.hasOwnProperty('primary_key')) {
            throw new Error('No primary key found! (table = ' + tableObject.name + ')')
          }
          // initialize custom parse of table object with name and description
          parseClass.parseTableBegin(tableObject.name, tableObject.description)
          // parse the primary key
          parseClass.parseTableGetPrimaryKey(this.parseDatabaseTableProperty(parseClass, tableObject.primary_key, true))
          // parse not null keys if there are any
          if (tableObject.hasOwnProperty('not_null_keys')) {
            tableObject.not_null_keys.forEach(tableNotNullProperty => {
              parseClass.parseTableGetNotNullKey(this.parseDatabaseTableProperty(parseClass, tableNotNullProperty, false, true))
              parseClass.parseTableGetNotNullKeyReference(tableNotNullProperty.hasOwnProperty('reference') ? this.parseDatabaseTablePropertyReference(parseClass, tableNotNullProperty.name, tableNotNullProperty.reference) : undefined)
            })
          }
          // parse null keys if there are any
          if (tableObject.hasOwnProperty('null_keys')) {
            tableObject.null_keys.forEach(tableNullProperty => {
              parseClass.parseTableGetNullKey(this.parseDatabaseTableProperty(parseClass, tableNullProperty))
              parseClass.parseTableGetNullKeyReference(tableNullProperty.hasOwnProperty('reference') ? this.parseDatabaseTablePropertyReference(parseClass, tableNullProperty.name, tableNullProperty.reference) : undefined)
            })
          }
          // parse table before continuing with new table or finishing with all tables
          parseClass.resolveTable()
        })
        // parse the last time everything and return the result to the promise
        resolve(parseClass.resolveEverything())
      })
      .catch(err => reject(err)))
  }
  /**
   * Parse a JSON object table property
   *
   * @static
   * @param {DatabaseTablesParsingClass} parseClass Class that implements parsing methods
   * @param {{name: string, description:string, type: string, unique: boolean, default: string}} tableProperty Property object
   * @param {boolean} [isPrimaryKey=false] Property is primary key
   * @param {boolean} [isNotNull=false] Property can not be null
   * @returns {*} Custom parsed table property determined by the given parse class
   * @memberof DatabaseTablesJsonParser
   */
  static parseDatabaseTableProperty (parseClass, tableProperty, isPrimaryKey = false, isNotNull = false) {
    // check if property has a name and description
    if (!tableProperty.hasOwnProperty('name') || tableProperty.name === '') {
      throw new Error('No property name found!')
    }
    if (!tableProperty.hasOwnProperty('description') || tableProperty.description === '') {
      throw new Error('No property description found! (' + tableProperty.name + ')')
    }
    // parse table property begin with name and description
    parseClass.parseTablePropertyName(tableProperty.name, tableProperty.description)
    // parse table property type
    switch (tableProperty.type) {
      case 'integer':
        parseClass.parseTablePropertyType('integer')
        break
      case 'text':
        parseClass.parseTablePropertyType('text')
        break
      case 'boolean':
        parseClass.parseTablePropertyType('boolean')
        break
      case 'date':
        parseClass.parseTablePropertyType('date')
        break
      default:
        throw new Error('Undefined property type found (' + tableProperty.name + ' >> ' + tableProperty.type + ')')
    }
    // check if table property is a primary key
    if (isPrimaryKey) {
      parseClass.parseTablePropertyIsPrimaryKey()
    }
    // check if property is a not null key and/or unique
    parseClass.parseTablePropertyIsNotNullUniqueKey(isNotNull, tableProperty.hasOwnProperty('unique') && tableProperty.unique)
    // check if property has a default value
    if (tableProperty.hasOwnProperty('default')) {
      parseClass.parseTablePropertyDefault(tableProperty.default, tableProperty.type)
    }
    // return parsed table property
    return parseClass.parseTablePropertyReturn()
  }
  /**
   * Parse a JSON object table property reference
   *
   * @static
   * @param {DatabaseTablesParsingClass} parseClass Class that implements parsing methods
   * @param {string} tablePropertyName property of reference name
   * @param {{table: string, property: string}} tablePropertyReference reference object
   * @returns {*} Custom parsed table property reference determined by the given parse class
   * @memberof DatabaseTablesJsonParser
   */
  static parseDatabaseTablePropertyReference (parseClass, tablePropertyName, tablePropertyReference) {
    return parseClass.parseTablePropertyReference(tablePropertyName, tablePropertyReference.table, tablePropertyReference.property)
  }
}

/**
 * Custom parser class that should be inherited by a custom parser
 *
 * @class DatabaseTablesParsingClass
 */
class DatabaseTablesParsingClass {
  constructor () {
    this.databaseProperties = []
    this.databaseReferences = []
  }
  parseEverythingBegin () {
    throw new Error('Method needs to be implemented')
  }
  parseTableBegin (tableName, tableDescription) {
    this.databaseProperties = []
    this.databaseReferences = []
  }
  parseTablePropertyName (tablePropertyName, tablePropertyDescription) {
    throw new Error('Method needs to be implemented')
  }
  parseTablePropertyType (tablePropertyType) {
    throw new Error('Method needs to be implemented')
  }
  parseTablePropertyIsPrimaryKey () {
    throw new Error('Method needs to be implemented')
  }
  parseTablePropertyIsNotNullUniqueKey (notNull, unique) {
    throw new Error('Method needs to be implemented')
  }
  parseTablePropertyDefault (defaultValue, propertyValue) {
    throw new Error('Method needs to be implemented')
  }
  parseTablePropertyReturn () {
    throw new Error('Method needs to be implemented')
  }
  parseTableGetPrimaryKey (primaryKeyQuery) {
    this.databaseProperties.push(primaryKeyQuery)
  }
  parseTableGetNotNullKey (notNullKeyQuery) {
    this.databaseProperties.push(notNullKeyQuery)
  }
  parseTableGetNullKey (nullKeyQuery) {
    this.databaseProperties.push(nullKeyQuery)
  }
  parseTableGetNotNullKeyReference (notNullKeyQueryReference) {
    this.databaseReferences.push(notNullKeyQueryReference)
  }
  parseTableGetNullKeyReference (nullKeyQueryReference) {
    this.databaseReferences.push(nullKeyQueryReference)
  }
  parseTablePropertyReference (tableName, referenceTable, referenceProperty) {
    throw new Error('Method needs to be implemented')
  }
  resolveTable () {
    throw new Error('Method needs to be implemented')
  }
  resolveEverything () {
    throw new Error('Method needs to be implemented')
  }
}

module.exports = {DatabaseTablesJsonParser, DatabaseTablesParsingClass}
