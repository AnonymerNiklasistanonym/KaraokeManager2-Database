#!/usr/bin/env node
'use strict'

/*
 * This file contains:
 * The main documentation code. This means in here is everything listed that will be documented.
 */
const path = require('path')

// Get database structure to md class
const DatabaseHelper = require('../../classes/database/setup/database_helper').DatabaseHelper
// Convert callbacks to promises
const promisify = require('util').promisify
// Write files asynchronously
const writeFile = require('fs').writeFile
// Write files asynchronously with Promise
const writeFilePromise = promisify(writeFile)

/**
 * Documentation of the database structure
 */
class DocumentDatabaseStructure {
  static get rootDirectory () {
    return path.join(__dirname, '..', '..')
  }
  static get documentationDirectory () {
    return path.join(this.rootDirectory, 'documentation')
  }
  static get documentationFile () {
    return path.join(this.documentationDirectory, 'databaseStructure.md')
  }
  /**
   * Convenience method that will be executed on `npm run doc`
   * @returns {Promise<string>} Message that contains export info
   */
  static createDocumentation () {
    return this.createMarkdownDocumentationTables()
  }
  /**
     * Create a Markdown document which contains the information of all database tables
     * @returns {Promise<string>}
     */
  static createMarkdownDocumentationTables () {
    return new Promise((resolve, reject) => {
      DatabaseHelper.markdownDocumentationTables
        .then(returnValue => {
          writeFilePromise(this.documentationFile, returnValue)
            .then(() => resolve('Database structure documentation exported to "' + this.documentationFile + '"'))
            .catch(err => reject(err))
        })
        .catch(err => reject(err))
    })
  }
}

module.exports = { DocumentDatabaseStructure: DocumentDatabaseStructure }
