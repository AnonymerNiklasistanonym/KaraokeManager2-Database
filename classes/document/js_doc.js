#!/usr/bin/env node
'use strict'

/*
 * Description:
 * This class helps interacting with the database
 */

const path = require('path')

// Create JavaScript documentation
const documentation = require('documentation')
// Convert callbacks to promises
const promisify = require('util').promisify
// Write files asynchronously
const writeFile = require('fs').writeFile
// Html export of documentation
const streamArray = require('stream-array')
const vfs = require('vinyl-fs')

// Write files asynchronously with Promise
const writeFilePromise = promisify(writeFile)

/**
 * Documentation of the source code
 */
class DocumentJsDoc {
  static get rootDirectory () {
    return path.join(__dirname, '..', '..')
  }
  static get indexFileProject () {
    return path.join(this.rootDirectory, 'index.js')
  }
  static get indexFileApi () {
    return path.join(this.rootDirectory, 'classes', 'api', 'api.js')
  }
  static get indexFileDocument () {
    return path.join(this.rootDirectory, 'classes', 'document', 'document.js')
  }
  static get documentationDirectory () {
    return path.join(this.rootDirectory, 'documentation')
  }
  static get documentationFileProject () {
    return path.join(this.documentationDirectory, 'sourceCodeProject.md')
  }
  static get documentationFileApi () {
    return path.join(this.documentationDirectory, 'sourceCodeApi.md')
  }
  static get documentationFileDocument () {
    return path.join(this.documentationDirectory, 'sourceCodeDocument.md')
  }
  static get documentationDirectoryProject () {
    return path.join(this.documentationDirectory, 'jsDocProject')
  }
  static get documentationDirectoryApi () {
    return path.join(this.documentationDirectory, 'jsDocApi')
  }
  static get documentationDirectoryDocument () {
    return path.join(this.documentationDirectory, 'jsDocDocument')
  }
  /**
   * Convenience method that will be executed on `npm run doc`
   * @returns {Promise<String[]>} Messages that contain export info
   */
  static createDocumentation () {
    return Promise.all([this.createJsDocDocumentationHtmlProject(), this.createJsDocDocumentationHtmlApi(), this.createJsDocDocumentationHtmlDocument(), this.createJsDocDocumentationMarkdownProject(), this.createJsDocDocumentationMarkdownApi(), this.createJsDocDocumentationMarkdownDocument()])
  }
  /**
   * @returns {Promise<String>} Message of the finished process
   */
  static createJsDocDocumentationHtmlProject () {
    return this.createJsDocDocumentationHtml(this.indexFileProject, this.documentationDirectoryProject)
  }
  /**
   * @returns {Promise<String>} Message of the finished process
   */
  static createJsDocDocumentationHtmlApi () {
    return this.createJsDocDocumentationHtml(this.indexFileApi, this.documentationDirectoryApi)
  }
  /**
   * @returns {Promise<String>} Message of the finished process
   */
  static createJsDocDocumentationHtmlDocument () {
    return this.createJsDocDocumentationHtml(this.indexFileDocument, this.documentationDirectoryDocument)
  }
  /**
   * @returns {Promise<String>} Message of the finished process
   */
  static createJsDocDocumentationHtml (indexFile, destinationFile) {
    return new Promise((resolve, reject) => {
      documentation.build(indexFile, { external: [] })
      // @ts-ignore
        .then(documentation.formats.html)
        .catch(err => reject(err))
        .then(output => {
          streamArray(output).pipe(vfs.dest(destinationFile))
          resolve('Source code (JsDoc) HTML documentation with the index "' + indexFile + '" successfully exported to (directory) "' + path.join(destinationFile, 'index.html') + '"')
        })
        .catch(err => reject(err))
    })
  }
  /**
   * @returns {Promise<String>} Message of the finished process
   */
  static createJsDocDocumentationMarkdown (indexFile, destinationFile, name) {
    return new Promise((resolve, reject) => {
      documentation.build(indexFile, { external: [] })
        // @ts-ignore
        .then(documentation.formats.md)
        .catch(err => reject(err))
        .then(result => {
          writeFilePromise(destinationFile, '# Source Code Documentation ' + name + '\n\n' + result)
            .then(() => resolve('Source code Markdown documentation with the index "' + indexFile + '" successfully exported to "' + destinationFile + '"'))
            .catch(err => reject(err))
        })
        .catch(err => reject(err))
    })
  }
  /**
   * @returns {Promise<String>} Message of the finished process
   */
  static createJsDocDocumentationMarkdownProject () {
    return this.createJsDocDocumentationMarkdown(this.indexFileProject, this.documentationFileProject, 'Project')
  }
  /**
   * @returns {Promise<String>} Message of the finished process
   */
  static createJsDocDocumentationMarkdownApi () {
    return this.createJsDocDocumentationMarkdown(this.indexFileApi, this.documentationFileApi, 'Api')
  }
  /**
   * @returns {Promise<String>} Message of the finished process
   */
  static createJsDocDocumentationMarkdownDocument () {
    return this.createJsDocDocumentationMarkdown(this.indexFileDocument, this.documentationFileDocument, 'Document')
  }
}

module.exports = { DocumentJsDoc: DocumentJsDoc }
