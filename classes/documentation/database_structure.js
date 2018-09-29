#!/usr/bin/env node
'use strict'

/*
 * This file contains:
 * The main documentation code. This means in here is everything listed that will be documented.
 */
const path = require('path')

// Get database structure to md class
const DatabaseHelper = require('../../classes/database/setup/database_helper').DatabaseHelper
// Get documentation helper
const DocumentationHelper = require('./documentation_helper').DocumentationHelper
// Write files asynchronously
const { readFile } = require('fs').promises

/**
 * Type definition for a DatabaseStructureDocumentationInformation object
 * @typedef {{filePath: string[]}} DatabaseStructureDocumentationInformation
 */

/**
 * Documentation of the database structure
 */
class DocumentDatabaseStructure {
  static get JSON_FILE_DATABASE_STRUCTURE_PATH () {
    return path.join(DocumentationHelper.dataDirectoryPath, 'database_structure.json')
  }
  /**
   * Get database structure information object
   * @returns {Promise<DatabaseStructureDocumentationInformation>} a
   */
  static getDocumentationInformation () {
    return new Promise((resolve, reject) => readFile(this.JSON_FILE_DATABASE_STRUCTURE_PATH)
      .then(file => resolve(JSON.parse(file.toString())))
      .catch(err => reject(err)))
  }
  static get documentationFilePath () {
    return new Promise((resolve, reject) => this.getDocumentationInformation()
      .then(documentationInformation => resolve(documentationInformation.filePath.join('/')))
      .catch(reject))
  }
  /**
   * Convenience method that will be executed on `npm run doc`
   * @returns {Promise<string>} Message that contains export info
   */
  static createDocumentation () {
    return new Promise((resolve, reject) => DocumentationHelper.createDocumentationDirectory()
      .then(() => {
        this.createMarkdownDocumentationTables()
          .then(resolve)
          .catch(reject)
      })
      .catch(reject))
  }
  /**
     * Create a Markdown document which contains the information of all database tables
     * @returns {Promise}
     */
  static createMarkdownDocumentationTables () {
    return new Promise((resolve, reject) => this.documentationFilePath
      .then(documentationFilePath => DatabaseHelper.markdownDocumentationTables
        .then(returnValue => DocumentationHelper.writeDocumentationFile(documentationFilePath, returnValue)
          .then(resolve)
          .catch(reject))
        .catch(reject))
      .catch(reject))
  }
}

module.exports = { DocumentDatabaseStructure: DocumentDatabaseStructure }
