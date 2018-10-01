#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * The JsDoc documentation code. [Dev]
 */
// Be able to concatenate paths
const path = require('path')
// Create JavaScript documentation
const documentation = require('documentation')
// Html file stream export of documentation into directory
const streamArray = require('stream-array')
const vfs = require('vinyl-fs')
// General documentation helper with useful functions
const DocumentationHelper = require('./documentationHelper').DocumentationHelper

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
   * @returns {Promise<import('./documentationTypes').JsDocDocumentationInformation>} Configuration file object
   */
  static get configurationObject () {
    return DocumentationHelper.getDocumentationInformationObject(this.configurationObjectPath)
  }
  /**
   * Convenience method that will be executed on `npm run doc`
   * @returns {Promise<void>} Empty promise array when everything went right
   */
  static createDocumentation () {
    return new Promise((resolve, reject) =>
      // Get configuration file for a list of all documentations that should be created
      this.configurationObject.then(jsonObject =>
        Promise.all(
          // Create all Promises for the HTML documentations
          jsonObject.map(jsDocObject => this.createJsDocHtml(
            path.join(DocumentationHelper.rootDirectoryPath, path.join.apply(undefined, jsDocObject.indexFilePath)),
            path.join.apply(undefined, jsDocObject.directoryPathJsDoc)))
            // Concatenate these with the
            .concat(
              // Create all Promises for the Markdown documentations
              jsonObject.map(jsDocObject => this.createJsDocMarkdown(
                path.join(DocumentationHelper.rootDirectoryPath, path.join.apply(undefined, jsDocObject.indexFilePath)),
                path.join.apply(undefined, jsDocObject.filePathMdDoc), jsDocObject.name))))
          // Resolve when all jobs are done
          .then(a => { resolve() })
          .catch(reject))
        .catch(reject))
  }
  /**
   * Creates a JsDoc in HTML format in a specified directory of an index file and
   * @returns {Promise<void>} Empty promise when everything went right
   */
  static createJsDocHtml (indexFile, destinationDirectoryPath) {
    return new Promise((resolve, reject) =>
    // Get the documentation main directory
      DocumentationHelper.documentationDirectoryPath.then(documentationDirectoryPath =>
      // Create documentation in specified destination directory
        documentation.build(indexFile, { external: [] })
          // @ts-ignore
          .then(documentation.formats.html)
          .then(output => streamArray(output)
            .pipe(vfs.dest(path.join(documentationDirectoryPath, destinationDirectoryPath))))
          .then(resolve)
          .catch(reject))
        .catch(reject))
  }
  /**
   * Creates a JsDoc in Markdown format in a specified file of an index file and
   * @returns {Promise<void>} Empty promise when everything went right
   */
  static createJsDocMarkdown (indexFile, destinationFile, name) {
    return new Promise((resolve, reject) =>
    // Create documentation markdown string
      documentation.build(indexFile, { external: [] })
      // @ts-ignore
        .then(documentation.formats.md)
        .catch(reject)
        .then(markdownString =>
        // Get the documentation info text
          DocumentationHelper.getInfoText()
            // Write string with documentation infos to destination file
            .then(infoText => DocumentationHelper.writeDocumentationFile(destinationFile,
              `# ${name}\n\n<!-- ${infoText} -->\n\n${markdownString}`)
              .then(resolve)
              .catch(reject))
            .catch(reject))
        .catch(reject))
  }
}

module.exports = { DocumentJsDoc }
