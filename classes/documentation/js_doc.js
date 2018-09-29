#!/usr/bin/env node
'use strict'

/*
 * Description:
 * This class helps interacting with the database
 */

// Be able to concatenate paths
const path = require('path')
// Create JavaScript documentation
const documentation = require('documentation')
// Html file stream export of documentation into directory
const streamArray = require('stream-array')
const vfs = require('vinyl-fs')
// General documentation helper with useful functions
const DocumentationHelper = require('./documentation_helper').DocumentationHelper

/**
 * Type definition for a JsDocDocumentationInformation object
 * @typedef {[{name: string, directoryPathJsDoc: [string],filePathMdDoc: [string],indexFilePath: [string]}]} JsDocDocumentationInformation
 */

/**
 * Documentation of the source code
 */
class DocumentJsDoc {
  /**
   * @returns {string} Configuration file object path
   */
  static get configurationObjectPath () {
    return path.join(DocumentationHelper.dataDirectoryPath, 'js_doc.json')
  }
  /**
   * @returns {Promise<JsDocDocumentationInformation>} Configuration file object
   */
  static get configurationObject () {
    return DocumentationHelper.getDocumentationInformationObject(this.configurationObjectPath)
  }
  /**
   * Convenience method that will be executed on `npm run doc`
   * @returns {Promise} Empty promise array when everything went right
   */
  static createDocumentation () {
    return new Promise((resolve, reject) =>
    // get configuration file for a list of all documentations that should be created
      this.configurationObject.then(jsonObject =>
        Promise.all(
          // create all Promises for the HTML documentations
          jsonObject.map(jsDocObject => this.createJsDocHtml(
            path.join(DocumentationHelper.rootDirectoryPath, path.join.apply(undefined, jsDocObject.indexFilePath)),
            path.join.apply(undefined, jsDocObject.directoryPathJsDoc)))
          // concatenate these with the
            .concat(
              // create all Promises for the Markdown documentations
              jsonObject.map(jsDocObject => this.createJsDocMarkdown(
                path.join(DocumentationHelper.rootDirectoryPath, path.join.apply(undefined, jsDocObject.indexFilePath)),
                path.join.apply(undefined, jsDocObject.filePathMdDoc), jsDocObject.name))))
        // resolve when all jobs are done
          .then(resolve)
          .catch(reject))
        .catch(reject))
  }
  /**
   * Creates a JsDoc in HTML format in a specified directory of an index file and
   * @returns {Promise} Empty promise when everything went right
   */
  static createJsDocHtml (indexFile, destinationDirectoryPath) {
    return new Promise((resolve, reject) =>
    // get the documentation main directory
      DocumentationHelper.documentationDirectoryPath.then(documentationDirectoryPath =>
      // create documentation in specified destination directory
        documentation.build(indexFile, { external: [] })
        // @ts-ignore
          .then(documentation.formats.html)
          .catch(reject)
          .then(output => streamArray(output)
            .pipe(vfs.dest(path.join(documentationDirectoryPath, destinationDirectoryPath))))
          .catch(reject)
          .then(resolve)
          .catch(reject))
        .catch(reject))
  }
  /**
   * Creates a JsDoc in Markdown format in a specified file of an index file and
   * @returns {Promise} Empty promise when everything went right
   */
  static createJsDocMarkdown (indexFile, destinationFile, name) {
    return new Promise((resolve, reject) =>
    // create documentation markdown string
      documentation.build(indexFile, { external: [] })
      // @ts-ignore
        .then(documentation.formats.md)
        .catch(reject)
        .then(markdownString =>
        // get the documentation info text
          DocumentationHelper.getInfoText()
            // write string with documentation infos to destination file
            .then(infoText => DocumentationHelper.writeDocumentationFile(destinationFile,
              '# ' + name + '\n\n<!-- ' + infoText + ' -->\n\n' + markdownString)
              .then(resolve)
              .catch(reject))
            .catch(reject))
        .catch(reject))
  }
}

module.exports = { DocumentJsDoc: DocumentJsDoc }
