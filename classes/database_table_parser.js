#!/usr/bin/env node

/*
 * Description:
 * This class parses the json file to a database
 */

// Convert callbacks to promises
const promisify = require('util').promisify
// Read files
const readFile = require('fs').readFile

// Convert normal async ready file with callback to promise
const readFilePromise = promisify(readFile)

class DatabaseTableParser {
  /**
   * Get path of JSON file which contains the database tables
   */
  static get JSON_FILE_DATABASE_TABLES_PATH () {
    return 'data/tables.json'
  }
  /**
   * Parse json of database tables
   */
  static parseDatabaseTable () {
    return new Promise((resolve, reject) => {
      readFilePromise(this.JSON_FILE_DATABASE_TABLES_PATH)
        .then(file => resolve(JSON.parse(file)))
        .catch(err => reject(err))
    })
  }
  static parseDatabaseTableProperty (parseClass, tableProperty, isPrimaryKey = false, isNotNull = false) {
    // check if property has a name and description
    if (!tableProperty.hasOwnProperty('name') || tableProperty.name === '') {
      throw new Error('No property name found!')
    }
    if (!tableProperty.hasOwnProperty('description') || tableProperty.description === '') {
      throw new Error('No property description found! (' + tableProperty.name + ')')
    }

    parseClass.parseTablePropertyName(tableProperty.name, tableProperty.description)

    // convert property type to correct sqlite type
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
    // check if property is a primary key
    if (isPrimaryKey) {
      parseClass.parseTablePropertyIsPrimaryKey()
    }

    // check if property is a not null key and/or unique
    parseClass.parseTablePropertyIsNotNullUniqueKey(isNotNull, (tableProperty.hasOwnProperty('unique') && tableProperty.unique))

    // check if property has a default value
    if (tableProperty.hasOwnProperty('default')) {
      parseClass.parseTablePropertyDefault(tableProperty.type)
    }

    return parseClass.parseTablePropertyReturn()
  }
  /**
   * Get SQLite queries to create all necessary tables
   */
  static parseDatabaseTableWithClass (parseClass) {
    return new Promise((resolve, reject) => {
      this.parseDatabaseTable()
        .then(jsonArrayObject => {
          parseClass.parseEverythingBegin()

          // iterate over all tables
          for (let key in jsonArrayObject) {
            const TABLE_OBJECT = jsonArrayObject[key]

            if (!TABLE_OBJECT.hasOwnProperty('name') || TABLE_OBJECT.name === '') {
              throw new Error('No table name found!')
            }
            if (!TABLE_OBJECT.hasOwnProperty('description') || TABLE_OBJECT.description === '') {
              throw new Error('No table description found! (' + TABLE_OBJECT.name + ')')
            }

            parseClass.parseTableBegin(TABLE_OBJECT.name, TABLE_OBJECT.description)

            // add primary key property
            if (!TABLE_OBJECT.hasOwnProperty('primary_key')) {
              throw new Error('No primary key found! (table = ' + TABLE_OBJECT.name + ')')
            }

            parseClass.parseTableGetPrimaryKey(this.parseDatabaseTableProperty(parseClass, TABLE_OBJECT.primary_key, true))

            if (TABLE_OBJECT.hasOwnProperty('not_null_keys')) {
              for (let notNullProperty in TABLE_OBJECT.not_null_keys) {
                parseClass.parseTableGetNotNullKey(this.parseDatabaseTableProperty(parseClass, TABLE_OBJECT.not_null_keys[notNullProperty], false, true))
                parseClass.parseTableGetNotNullKeyReference(this.parseDatabaseTablePropertyReference(parseClass, TABLE_OBJECT.not_null_keys[notNullProperty]))
              }
            }
            if (TABLE_OBJECT.hasOwnProperty('null_keys')) {
              for (let nullProperty in TABLE_OBJECT.null_keys) {
                parseClass.parseTableGetNullKey(this.parseDatabaseTableProperty(parseClass, TABLE_OBJECT.null_keys[nullProperty]))
                parseClass.parseTableGetNullKeyReference(this.parseDatabaseTablePropertyReference(parseClass, TABLE_OBJECT.null_keys[nullProperty]))
              }
            }

            parseClass.resolveTable()
          }

          resolve(parseClass.resolveEverything())
        })
        .catch(err => reject(err))
    })
  }

  static parseDatabaseTablePropertyReference (parseClass, tableProperty) {
    if (tableProperty.hasOwnProperty('reference')) {
      return parseClass.parseTablePropertyReference(tableProperty.name, tableProperty.reference.table, tableProperty.reference.property)
    } else {
      return undefined
    }
  }
}

module.exports = DatabaseTableParser
