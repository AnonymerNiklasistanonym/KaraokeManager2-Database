#!/usr/bin/env node
'use strict'

/*
 * This file contains:
 * The main documentation code. This means in here is everything listed that will be documented.
 */
const path = require('path')
const { readFile, mkdir, writeFile, stat } = require('fs').promises

/**
 * Type definition for a DocumentationGeneralOptions object
 * @typedef {{directoryPath: string[], infoText: string}} DocumentationGeneralOptions
 */

/**
 * Documentation helper methods
 */
class DocumentationHelper {
  /**
   * @returns {Promise<string>} info text
   */
  static getInfoText () {
    return new Promise((resolve, reject) => this.documentationDirectoryObject
      .then(jsonObject => resolve(jsonObject.infoText))
      .catch(reject))
  }
  /**
   * @returns {string} Root directory path
   */
  static get rootDirectoryPath () {
    return path.join(__dirname, '..', '..')
  }
  /**
   * @returns {string} Data directory path
   */
  static get dataDirectoryPath () {
    return path.join(this.rootDirectoryPath, 'data', 'documentation')
  }
  /**
   * @returns {string} Documentation general options file object path
   */
  static get documentationGeneralOptionsObjectPath () {
    return path.join(this.dataDirectoryPath, 'general_options.json')
  }
  /**
   * Get documentation directory file object
   * @returns {Promise<DocumentationGeneralOptions>} Promise that contains the documentation directory file object
   */
  static get documentationDirectoryObject () {
    return new Promise((resolve, reject) => readFile(this.documentationGeneralOptionsObjectPath)
      .then(file => resolve(JSON.parse(file.toString())))
      .catch(err => reject(err)))
  }
  /**
   * Get documentation directory path
   * @returns {Promise<string>} Promise that contains the documentation directory path
   */
  static get documentationDirectoryPath () {
    return new Promise((resolve, reject) => this.documentationDirectoryObject
      .then(jsonObject => resolve(path.join(this.rootDirectoryPath, jsonObject.directoryPath.join('/'))))
      .catch(reject))
  }
  /**
   * Create documentation output directory if it doesn't already exists
   * @returns {Promise<string>} Message
   */
  static createDocumentationDirectory () {
    return new Promise((resolve, reject) => {
      this.existsDocumentationFile('')
        .then(exists => {
          if (!exists) {
            this.documentationDirectoryPath.then(documentationDirectoryPath =>
              mkdir(documentationDirectoryPath)
                .then(() => resolve('created documentation directory'))
                .catch(reject))
          } else {
            resolve('documentation directory already exists')
          }
        })
        .catch(reject)
    })
  }
  /**
   * @param {*} filePath
   * @param {*} content
   * @param {boolean} [useDocumentationDirectoryAsRootPath=true]
   * @returns {Promise<void>}
   */
  static writeDocumentationFile (filePath, content, useDocumentationDirectoryAsRootPath = true) {
    if (!useDocumentationDirectoryAsRootPath) {
      return writeFile(filePath, content)
    } else {
      return new Promise((resolve, reject) =>
        this.documentationDirectoryPath.then(documentationDirectoryPath =>
          this.writeDocumentationFile(path.join(documentationDirectoryPath, filePath), content, false)
            .then(resolve).catch(reject)).catch(reject))
    }
  }
  static existsDocumentationFile (filePath, useDocumentationDirectoryAsRootPath = true) {
    if (!useDocumentationDirectoryAsRootPath) {
      return new Promise((resolve, reject) => stat(filePath).then(stat => resolve(true))
        .catch(err => err.code === 'ENOENT' ? resolve(false) : reject(err)))
    } else {
      return new Promise((resolve, reject) =>
        this.documentationDirectoryPath.then(documentationDirectoryPath =>
          this.existsDocumentationFile(path.join(documentationDirectoryPath, filePath), false).then(resolve).catch(reject)).catch(reject))
    }
  }
  /**
   * @param {string} filePath TODO
   * @returns {Promise} TODO
   */
  static getDocumentationInformationObject (filePath) {
    return new Promise((resolve, reject) => readFile(filePath)
      .then(jsonContent => jsonContent.toString()).then(JSON.parse).then(resolve).catch(reject))
  }
}

module.exports = { DocumentationHelper: DocumentationHelper }
