#!/usr/bin/env node
'use strict'

const promisify = require('util').promisify
const fs = require('fs')
const path = require('path')
const mkdirPromise = promisify(fs.mkdir)
const statPromise = promisify(fs.stat)
const readdirPromise = promisify(fs.readdir)
const readFilePromise = promisify(fs.readFile)
const writeFilePromise = promisify(fs.writeFile)

const existsPromise = filePath => new Promise((resolve, reject) => {
  fs.stat(filePath, err => {
    if (err == null) {
      resolve(true)
    } else if (err.code === 'ENOENT') {
      resolve(false)
    } else {
      reject(err)
    }
  })
})

/**
 * Type definition for a File object
 * @typedef {{path: string, info: string}} File
 */

/**
 * Type definition for a Directory object
 * @typedef {{path: string, info: string, files: [File]}} Directory
 */

/**
 * Document file structure helping class.
 * Contains methods to get all files recursively and import README directory infos and javascript file headers.
 */
class DocumentFileStructureHelper {
  /**
     * @param {string} directoryPath
     * @returns {Promise<Directory>} list of files in directory
     */
  static listFiles (directoryPath, filter = a => a) {
    return new Promise((resolve, reject) => {
      // read directory
      readdirPromise(directoryPath)
        .then(fileList => {
          if (fileList === undefined) {
            resolve()
            return
          }
          let promiseList = []
          // custom filter
          const filteredFileList = filter(fileList)
          // iterate over all files of the directory
          filteredFileList.forEach(filePath => {
            // analyze each file
            promiseList.push(this.listFile(directoryPath, filePath, filter))
          })
          Promise.all(promiseList)
            .then(listOfFiles => resolve({
              path: directoryPath,
              files: listOfFiles
            }))
            .catch(err => reject(err))
        })
        .catch(err => reject(err))
    })
  }
  /**
   * @param {*} directoryPath
   * @param {*} filePath
   * @param {*} [filter=a=>a]
   * @returns {Promise<(File|Directory)>}
   */
  static listFile (directoryPath, filePath, filter = a => a) {
    return new Promise((resolve, reject) => {
      const fileFilePath = path.join(directoryPath, filePath)
      // analyze specifically if file is a directory or a normal file
      statPromise(fileFilePath)
        .then(status => {
          if (status.isDirectory()) {
            this.analyzeDirectory(fileFilePath, filter)
              .then(result => resolve(result))
              .catch(err => reject(err))
          } else if (status.isFile()) {
            this.analyzeFile(fileFilePath)
              .then(result => resolve(result))
              .catch(err => reject(err))
          }
        })
        .catch(err => reject(err))
    })
  }
  /**
     * @param {string} filePath
     * @returns {Promise<File>} checks if the file contains information about its content
     */
  static analyzeFile (filePath) {
    return new Promise((resolve, reject) => {
      this.getFileContent(filePath)
        .then(info => resolve({
          path: filePath,
          info: info
        }))
        .catch(err => reject(err))
    })
  }
  /**
     * @param {string} directoryPath
     * @returns {Promise<Directory>} checks if the directory contains information about its content
     */
  static analyzeDirectory (directoryPath, filter = a => a) {
    return new Promise((resolve, reject) => {
      this.listFiles(directoryPath, filter)
        .then(fileList => {
          // get info
          this.getReadmeContentDirectory(directoryPath, fileList.files)
            .then(info => resolve({
              path: directoryPath,
              info: info,
              files: fileList.files
            }))
            .catch(err => reject(err))
        })
        .catch(err => reject(err))
    })
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
      existsPromise(readmeFile)
        .then(exists => {
          if (exists) {
            readFilePromise(path.join(directoryPath, 'README.md'), 'utf8')
              .then(value => resolve(value.substring(value.indexOf('\n')).replace(/^\s+|\s+$/g, '')))
              .catch(err => reject(err))
          } else {
            resolve('TODO')
          }
        })
        .catch(err => reject(err))
    })
  }
  /**
     * @param {string} filePath
     * @returns {Promise<String>} checks if the directory contains information about its content
     */
  static getFileContent (filePath) {
    return new Promise((resolve, reject) => {
      readFilePromise(filePath, 'utf8')
        .then(value => {
          if (value.indexOf('\n * This file contains:') !== -1) {
            const fileContentHeader = value.substring(value.indexOf('* This file contains:') + '* This file contains:'.length, value.indexOf('*/')).split('* ').join('').replace(/^\s+|\s+$/g, '')
            resolve(fileContentHeader)
          } else {
            resolve('TODO')
          }
        })
        .catch(err => reject(err))
    })
  }
  /**
     * @param {Directory|File} fileObject
     * @returns {string} Information rendered in markdown
     */
  static renderFileToMarkdown (fileObject, depth = 1, filter = (a) => a) {
    // filter file customized
    fileObject = filter(fileObject)
    // check if file is not a directory
    if (fileObject.files === undefined) {
      return '- ' + fileObject.path +
            (fileObject.info === undefined ? '\n' : '<br>' + fileObject.info + '\n')
    } else {
      return '\n' + '#'.repeat(depth) + ' ' + fileObject.path + '\n' +
            (fileObject.info === undefined ? '' : '\n' + fileObject.info + '\n\n') +
            (fileObject.files === undefined ? '' : fileObject.files
              .map(element => this.renderFileToMarkdown(element, depth + 1, filter)).join(''))
    }
  }
}

/**
 * Documentation of the file structure
 */
class DocumentFileStructure {
  static get rootDirectory () {
    return path.join(__dirname, '..', '..')
  }
  static get documentationDirectory () {
    return path.join(this.rootDirectory, 'documentation')
  }
  static get documentationFile () {
    return path.join(this.documentationDirectory, 'fileStructure.md')
  }
  /**
   * @returns {Promise<string>} Message
   */
  static createDocumentationDirectory () {
    return new Promise((resolve, reject) => {
      existsPromise(this.documentationDirectory)
        .then(exists => {
          if (!exists) {
            mkdirPromise(this.documentationDirectory)
              .then(() => resolve('created documentation directory'))
              .catch(err => reject(err))
          } else {
            resolve('documentation directory already exists')
          }
        })
        .catch(err => reject(err))
    })
  }
  static createDocumentationFile () {
    return new Promise((resolve, reject) => {
      DocumentFileStructureHelper.analyzeDirectory(path.join(__dirname, '..', '..', 'classes'), (file) => {
        return file.filter(a => {
          const lastIndex = a.lastIndexOf('.')
          return (lastIndex === -1 || a.substring(lastIndex + 1) === 'js')
        })
      })
        .then(files => {
          writeFilePromise(this.documentationFile, '# File structure\n\n' + DocumentFileStructureHelper.renderFileToMarkdown(files, 2,
            a => {
              const b = a.path.replace(this.rootDirectory, '').replace(/\\/g, '/')
              a.path = path.basename(a.path)
              a.path = '[`' + a.path + '`](../' + b + ')'
              return a
            }))
            .then(() => resolve('File structure documentation exported to "' + this.documentationFile + '"'))
            .catch(err => reject(err))
        })
        .catch(err => reject(err))
    })
  }
  /**
   * Convenience method that will be executed on `npm run doc`
   * @returns {Promise<string>} Message that contains export info
   */
  static createDocumentation () {
    return new Promise((resolve, reject) => {
      this.createDocumentationDirectory()
        .catch(err => reject(err))
        .then(() => this.createDocumentationFile()
          .catch(err => reject(err))
          .then(message => resolve(message)))
    })
  }
}

module.exports = { DocumentFileStructure: DocumentFileStructure }
