#!/usr/bin/env node
'use strict'

const path = require('path')
const { readdir, stat, readFile } = require('fs').promises
const DocumentationHelper = require('./documentation_helper').DocumentationHelper

/**
 * Type definition for a File object
 * @typedef {{path: string, info: string}} File
 */
/**
 * Type definition for a Directory object
 * @typedef {{path: string, files: [File|Directory]}} DirectoryLite
 */
/**
 * Type definition for a Directory object
 * @typedef {{path: string, info: string, files: [File|Directory]}} Directory
 */

/**
 * Type definition for a FileStructureDocumentationInformation object
 * @typedef {{filePath: string[], indexFile: {filePath: string[]}, sourceDirectories: [{filePath: string[], fileExtensions: string[]}]}} FileStructureDocumentationInformation
 */

/**
 * Document file structure helping class.
 * Contains methods to get all files recursively and import README directory infos and javascript file headers.
 */
class DocumentFileStructureHelper {
  /**
     * @param {string} directoryPath
     * @returns {Promise<DirectoryLite>} list of files in directory
     */
  static listFiles (directoryPath, filter = a => a) {
    return new Promise((resolve, reject) => {
      // read directory
      readdir(directoryPath)
        .then(fileList => Promise.all(filter(fileList)
          .map(filePath => this.listFile(directoryPath, filePath, filter)))
          // @ts-ignore
          .then(listOfFiles => resolve({
            path: directoryPath,
            files: listOfFiles
          }))
          .catch(reject))
        .catch(reject)
    })
  }
  /**
   * @param {string} directoryPath
   * @param {string} filePath
   * @param {function(): boolean} directoryFilter
   * @returns {Promise<(File|Directory)>}
   */
  static listFile (directoryPath, filePath, directoryFilter = a => a) {
    return new Promise((resolve, reject) => {
      const fileFilePath = path.join(directoryPath, filePath)
      // analyze specifically if file is a directory or a normal file
      stat(fileFilePath)
        .then(status => {
          if (status.isDirectory()) {
            this.analyzeDirectory(fileFilePath, directoryFilter)
              .then(resolve)
              .catch(reject)
          } else if (status.isFile()) {
            this.analyzeFile(fileFilePath)
              .then(resolve)
              .catch(reject)
          }
        })
        .catch(reject)
    })
  }
  /**
     * @param {string} filePath
     * @returns {Promise<File>} checks if the file contains information about its content
     */
  static analyzeFile (filePath) {
    return new Promise((resolve, reject) => this.getFileContent(filePath)
      .then(info => resolve({
        path: filePath,
        info: info
      }))
      .catch(reject))
  }
  /**
     * @param {string} directoryPath
     * @returns {Promise<Directory>} checks if the directory contains information about its content
     */
  static analyzeDirectory (directoryPath, filter = a => a) {
    return new Promise((resolve, reject) => this.listFiles(directoryPath, filter)
      .then(fileList =>
        this.getReadmeContentDirectory(directoryPath, fileList.files)
          .then(info => resolve({
            path: directoryPath,
            info: info,
            files: fileList.files
          }))
          .catch(reject))
      .catch(reject))
  }
  /**
     * @param {string} directoryPath
     * @param {File[]} fileList
     * @returns {Promise<String>} checks if the directory contains information about its content
     */
  static getReadmeContentDirectory (directoryPath, fileList) {
    return new Promise((resolve, reject) => {
      // if there is a README-md file
      const readmeFile = path.join(directoryPath, 'README.md')
      DocumentationHelper.existsDocumentationFile(readmeFile, false)
        .then(exists => {
          if (exists) {
            readFile(path.join(directoryPath, 'README.md'), 'utf8')
              .then(value => resolve(value.substring(value.indexOf('\n'))
                .replace(/^\s+|\s+$/g, '')))
              .catch(reject)
          } else {
            resolve('TODO')
          }
        })
        .catch(reject)
    })
  }
  /**
     * @param {string} filePath
     * @returns {Promise<String>} checks if the directory contains information about its content
     */
  static getFileContent (filePath) {
    return new Promise((resolve, reject) => {
      readFile(filePath, 'utf8')
        .then(value => {
          switch (filePath.substring(filePath.lastIndexOf('.') + 1)) {
            case 'js':
              this.getFileContentJavaScript(filePath, value)
                .then(resolve)
              break
            case 'handlebars':
              this.getFileContentHandlebars(filePath, value)
                .then(resolve)
              break
            case 'json':
              this.getFileContentJson(filePath)
                .then(resolve)
                .catch(reject)
              break
            default:
              resolve('TODO - NOT SUPPORTED FILE FORMAT')
          }
        })
        .catch(reject)
    })
  }
  static getFileContentJavaScript (filePath, value) {
    return new Promise(resolve => {
      if (value.indexOf('\n * This file contains:') !== -1) {
        const fileContentHeader = value.substring(value.indexOf('* This file contains:') + '* This file contains:'.length, value.indexOf('*/'))
          .split('* ')
          .join('')
          .replace(/^\s+|\s+$/g, '')
        resolve(fileContentHeader)
      } else {
        resolve('TODO')
      }
    })
  }
  static getFileContentHandlebars (filePath, value) {
    return new Promise(resolve => {
      if (value.indexOf('{{!--') !== -1) {
        const fileContentHeader = value
          .substring(value.indexOf('{{!--') + 7 + ' Description:'.length, value.indexOf('--}}'))
          .split('\n ')
          .join('')
          .replace(/^\s+|\s+$/g, '')
        resolve(fileContentHeader)
      } else {
        resolve('TODO')
      }
    })
  }
  static getFileContentJson (filePath) {
    return new Promise((resolve, reject) => {
      const explanationFile = filePath.substring(0, filePath.lastIndexOf('.')) + '.md'
      DocumentationHelper.existsDocumentationFile(explanationFile, false)
        .then(exists => {
          if (exists) {
            readFile(explanationFile, 'utf8')
              .then(fileContent => resolve(fileContent.substring(fileContent.indexOf('\n'))
                .replace(/^\s+|\s+$/g, '')))
              .catch(reject)
          } else {
            resolve('TODO')
          }
        })
        .catch(reject)
    })
  }
  /**
     * @param {(Directory|File)} fileObject
     * @returns {string} Information rendered in markdown
     */
  static renderFileToMarkdown (fileObject, depth = 1, filter = a => a) {
    // filter file customized
    fileObject = filter(fileObject)
    // check if file is not a directory
    if (!fileObject.hasOwnProperty('files')) {
      return '- ' + fileObject.path +
            this.renderFileToMarkdownFileInfo(fileObject.info)
    } else {
      return '\n' + '#'.repeat(depth) + ' ' + fileObject.path + '\n' +
            this.renderFileToMarkdownDirectoryInfo(fileObject.info) +
            // @ts-ignore
            (fileObject.files === undefined ? '' : fileObject.files
              .map(element => this.renderFileToMarkdown(element, depth + 1, filter))
              .join(''))
    }
  }
  static renderFileToMarkdownDirectoryInfo (fileInfo) {
    if (fileInfo === undefined) {
      return ''
    } else {
      return '\n' + fileInfo + '\n\n'
    }
  }
  static renderFileToMarkdownFileInfo (fileInfo) {
    if (fileInfo === undefined) {
      return '\n'
    } else {
      if (fileInfo.split('\n').length > 1) {
        return '<br>\n```\n' + fileInfo + '\n```\n'
      } else {
        return '<br>' + fileInfo + '\n'
      }
    }
  }
}

/**
 * Documentation of the file structure
 */
class DocumentFileStructure {
  static get JSON_FILE_FILE_STRUCTURE_PATH () {
    return path.join(DocumentationHelper.dataDirectoryPath, 'file_structure.json')
  }
  /**
   * Filter/Reduce a list of file paths to only files with a specific file extension
   * @param {string[]} fileExtensions
   * @returns {function(string[]): string[]}
   */
  static fileFilter (fileExtensions) {
    // let all file paths through that have no extension (directory)
    return file => file.filter(a => a.lastIndexOf('.') === -1 ||
    // or files with specified file extension
    fileExtensions.some(b => a.substring(a.lastIndexOf('.') + 1) === b))
  }
  static markdownFileTitleFilter () {
    return filePath => {
      const tempAbsoluteFilePath = filePath.path.replace(DocumentationHelper.rootDirectoryPath, '')
        .replace(/\\/g, '/')
      filePath.path = path.basename(filePath.path)
      filePath.path = '[`' + filePath.path + '`](../' + tempAbsoluteFilePath + ')'
      return filePath
    }
  }
  /**
   * @param {string} directoryPath
   * @param {number} [depth=0]
   * @param {function(string[]): string[]} [filter=a => a]
   * @param {*} [filterMarkdown=a => a]
   * @returns
   */
  static getDocumentationFileContent (directoryPath, depth = 0, filter = a => a, filterMarkdown = a => a) {
    return new Promise((resolve, reject) => {
      DocumentFileStructureHelper.analyzeDirectory(directoryPath, filter)
        .then(files => resolve(DocumentFileStructureHelper.renderFileToMarkdown(files, depth, filterMarkdown)))
        .catch(reject)
    })
  }
  static getDocumentationFileContentTest (filePath, depth = 0, filterMarkdown = a => a) {
    return new Promise((resolve, reject) => {
      DocumentFileStructureHelper.analyzeFile(filePath)
        .then(files => resolve(DocumentFileStructureHelper.renderFileToMarkdown(files, depth, filterMarkdown)))
        .catch(reject)
    })
  }
  /**
   * Get file structure information object
   * @returns {Promise<FileStructureDocumentationInformation>} a
   */
  static getDocumentationInformation () {
    return new Promise((resolve, reject) => readFile(this.JSON_FILE_FILE_STRUCTURE_PATH)
      .then(file => resolve(JSON.parse(file.toString())))
      .catch(reject))
  }
  static createDocumentationFile () {
    return new Promise((resolve, reject) => this.getDocumentationInformation()
      .then(jsonObject => {
        let promiseList = []
        // add promise for main/index file first
        promiseList.push(this.getDocumentationFileContentTest(path.join(DocumentationHelper.rootDirectoryPath, jsonObject.indexFile.filePath.join('/')), 2, this.markdownFileTitleFilter()))
        // then add for each source directory another promise
        jsonObject.sourceDirectories.forEach(directoryObject =>
          promiseList.push(this.getDocumentationFileContent(
            path.join(DocumentationHelper.rootDirectoryPath, directoryObject.filePath.join('/')),
            2, this.fileFilter(directoryObject.fileExtensions), this.markdownFileTitleFilter())))
        // then wait until everything was asynchronously calculated
        Promise.all(promiseList)
          .then(responses =>
            DocumentationHelper.writeDocumentationFile(jsonObject.filePath.join('/'),
              ['# File structure', '## Main method'].join('\n\n') + '\n\n' + responses.join(''))
              .then(resolve)
              .catch(reject))
          .catch(reject)
      })
      .catch(reject))
  }
  /**
   * Convenience method that will be executed on `npm run doc`
   * @returns {Promise<string>} Message that contains export info
   */
  static createDocumentation () {
    return new Promise((resolve, reject) => DocumentationHelper.createDocumentationDirectory()
      .then(() => this.createDocumentationFile()
        .then(resolve)
        .catch(reject))
      .catch(reject))
  }
}

module.exports = { DocumentFileStructure: DocumentFileStructure }
