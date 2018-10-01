#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * Documentation API function to list the projects file structure and render it in `.md` format
 */

const path = require('path')
const fs = require('fs').promises
const DocumentationHelper = require('./../documentationHelper').DocumentationHelper
const FileStructureRenderer = require('./fileStructureRenderer')
const FileStructureScanner = require('./fileStructureScanner')

/**
 * Helping static class to document the file structure
 */
class DocumentFileStructure {
  /**
   * Get file path of json settings
   * @returns {string} File path
   */
  static get JSON_FILE_FILE_STRUCTURE_PATH () {
    return path.join(DocumentationHelper.dataDirectoryPath, 'file_structure.json')
  }
  /**
   * Get file structure information object
   * @returns {Promise<import('./../documentationTypes').IFileStructureDocumentationInformation>} File structure information object
   */
  static getDocumentationInformation () {
    return new Promise((resolve, reject) => fs.readFile(this.JSON_FILE_FILE_STRUCTURE_PATH)
      .then(file => resolve(JSON.parse(file.toString())))
      .catch(reject))
  }
  /**
   * Filter/Reduce a list of file paths to only files with a specific file extension
   * @param {string[]} fileExtensions
   * @returns {function(string): boolean}
   */
  static fileFilter (fileExtensions) {
    // Let all file paths through that have no extension (directory)
    return file => {
      if (file.lastIndexOf('.') === -1) {
        return true
      }
      if (fileExtensions.some(extension => file.substring(file.lastIndexOf('.') + 1) === extension)) {
        return true
      }

      return false
    }
  }
  /**
   * Get file structure that should be documented
   * @returns {Promise<import('./../documentationTypes').IFile[]>}
   */
  static createDocumentation () {
    return new Promise((resolve, reject) => this.getDocumentationInformation()
      .then(settingsObject => {
        Promise.all([FileStructureScanner.analyzeFile(settingsObject.indexFile.filePath.join('/')),
          ...settingsObject.sourceDirectories.map(directory =>
            FileStructureScanner.analyzeFile(directory.filePath.join('/'), this.fileFilter(directory.fileExtensions)))])
          .then(fileObjects => {
            const mdObjects = fileObjects.map(fileObject =>
              FileStructureRenderer.renderFileToMarkdownObject(fileObject, 3, undefined, path.join('.', '..')))
            const renderedMd = mdObjects.map(mdObject =>
              FileStructureRenderer.renderFileToMarkdown(mdObject))
            // Write to file
            const mdContent = renderedMd.join('\n\n')
            const tableOfContent = FileStructureRenderer.getTocOfMdContent(mdContent)
            DocumentationHelper.writeDocumentationFile(settingsObject.filePath.join('/'),
              ['# ' + settingsObject.title, '## ' + settingsObject.tocTitle, tableOfContent,
                '## ' + settingsObject.contentTitle, mdContent].join('\n\n'))
              .catch(console.error)
          })
          .catch(reject)
      })
      .catch(reject))
  }
}

module.exports = DocumentFileStructure
