#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * Documentation helper code. [Dev]
 */

const path = require('path')
const fs = require('fs').promises

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
   * @returns {Promise<import('./documentationTypes').DocumentationGeneralOptions>} Promise that contains the documentation directory file object
   */
  static get documentationDirectoryObject () {
    return new Promise((resolve, reject) => fs.readFile(this.documentationGeneralOptionsObjectPath)
      .then(file => resolve(JSON.parse(file.toString())))
      .catch(reject))
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
              fs.mkdir(documentationDirectoryPath)
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
      return fs.writeFile(filePath, content)
    } else {
      return new Promise((resolve, reject) =>
        this.documentationDirectoryPath.then(documentationDirectoryPath =>
          this.writeDocumentationFile(path.join(documentationDirectoryPath, filePath), content, false)
            .then(resolve)
            .catch(reject))
          .catch(reject))
    }
  }
  static existsDocumentationFile (filePath, useDocumentationDirectoryAsRootPath = true) {
    if (!useDocumentationDirectoryAsRootPath) {
      return new Promise((resolve, reject) => fs.stat(filePath)
        .then(status => resolve(status.isFile() || status.isDirectory()))
        .catch(err => err.code === 'ENOENT' ? resolve(false) : reject(err)))
    } else {
      return new Promise((resolve, reject) =>
        this.documentationDirectoryPath.then(documentationDirectoryPath =>
          this.existsDocumentationFile(path.join(documentationDirectoryPath, filePath), false)
            .then(resolve)
            .catch(reject))
          .catch(reject))
    }
  }
  /**
   * @param {string} filePath TODO
   * @returns {Promise} TODO
   */
  static getDocumentationInformationObject (filePath) {
    return new Promise((resolve, reject) => fs.readFile(filePath)
      .then(jsonContent => jsonContent.toString())
      .then(JSON.parse)
      .then(resolve)
      .catch(reject))
  }
}

module.exports = { DocumentationHelper }
