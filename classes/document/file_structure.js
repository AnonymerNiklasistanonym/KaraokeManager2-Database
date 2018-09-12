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
          switch (filePath.substring(filePath.lastIndexOf('.') + 1)) {
            case 'js':
            if (value.indexOf('\n * This file contains:') !== -1) {
              const fileContentHeader = value.substring(value.indexOf('* This file contains:') + '* This file contains:'.length, value.indexOf('*/')).split('* ').join('').replace(/^\s+|\s+$/g, '')
              resolve(fileContentHeader)
            } else {
              resolve('TODO')
            }
              break;
              case 'handlebars':
              if (value.indexOf('{{!--') !== -1) {
                const fileContentHeader = value.substring(value.indexOf('{{!--') + 7 + ' Description:'.length, value.indexOf('--}}')).split('\n ').join('').replace(/^\s+|\s+$/g, '')
                resolve(fileContentHeader)
              } else {
                resolve('TODO')
              }
              break;
              case 'json':
              const explanationFile = filePath.substring(0, filePath.lastIndexOf('.')) + '.md'
              existsPromise(explanationFile)
              .then(exists => {
                if (exists) {
                readFilePromise(explanationFile, 'utf8')
                .then(fileContent => resolve(fileContent.substring(fileContent.indexOf('\n')).replace(/^\s+|\s+$/g, '')))
                .catch(reject)
                } else {
                  resolve('TODO')
                }
              }).catch(reject)
              break;

            default:

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
  static get sourceDirectoryClasses () {
    return { path: path.join(this.rootDirectory, 'classes'),
      fileFilter: this.fileFilter('js') }
  }
  static get sourceDirectoryRoutes () {
    return { path: path.join(this.rootDirectory, 'routes'),
      fileFilter: this.fileFilter('js') }
  }
  static get sourceDirectoryData () {
    return { path: path.join(this.rootDirectory, 'data'),
      fileFilter: this.fileFilter('json') }
  }
  static get sourceDirectoryViews () {
    return { path: path.join(this.rootDirectory, 'views'),
      fileFilter: this.fileFilter('handlebars') }
  }
  static get sourceFileIndex () {
    return { path: path.join(this.rootDirectory, 'index.js') }
  }

  static fileFilter (fileExtension) {
    return file => file.filter(a => a.lastIndexOf('.') === -1 || a.substring(a.lastIndexOf('.') + 1) === fileExtension)
  }
  static markdownFileTitleFilter () {
    return filePath => {
      const tempAbsoluteFilePath = filePath.path.replace(this.rootDirectory, '').replace(/\\/g, '/')
      filePath.path = path.basename(filePath.path)
      filePath.path = '[`' + filePath.path + '`](../' + tempAbsoluteFilePath + ')'
      return filePath
    }
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
  static getDocumentationFileContent (directoryPath, depth = 0, filter = a => a, filterMarkdown = a => a) {
    return new Promise((resolve, reject) => {
      DocumentFileStructureHelper.analyzeDirectory(directoryPath, filter)
        .then(files => resolve(DocumentFileStructureHelper.renderFileToMarkdown(files, depth, filterMarkdown)))
        .catch(err => reject(err))
    })
  }
  static getDocumentationFileContentTest (filePath, depth = 0, filterMarkdown = a => a) {
    return new Promise((resolve, reject) => {
      DocumentFileStructureHelper.analyzeFile(filePath)
        .then(files => resolve(DocumentFileStructureHelper.renderFileToMarkdown(files, depth, filterMarkdown)))
        .catch(err => reject(err))
    })
  }
  static createDocumentationFile () {
    return new Promise((resolve, reject) => {
      const indexFileMdPromise = this.getDocumentationFileContentTest(this.sourceFileIndex.path, 2, this.markdownFileTitleFilter())
      const classesDirMdPromise = this.getDocumentationFileContent(this.sourceDirectoryClasses.path, 2, this.sourceDirectoryClasses.fileFilter, this.markdownFileTitleFilter())
      const dataDirMdPromise = this.getDocumentationFileContent(this.sourceDirectoryData.path, 2, this.sourceDirectoryData.fileFilter, this.markdownFileTitleFilter())
      const routesDirMdPromise = this.getDocumentationFileContent(this.sourceDirectoryRoutes.path, 2, this.sourceDirectoryRoutes.fileFilter, this.markdownFileTitleFilter())
      const viewsDirMdPromise = this.getDocumentationFileContent(this.sourceDirectoryViews.path, 2, this.sourceDirectoryViews.fileFilter, this.markdownFileTitleFilter())

      indexFileMdPromise
        .then(index => classesDirMdPromise
          .then(classes => dataDirMdPromise
            .then(data => routesDirMdPromise
              .then(routes => viewsDirMdPromise
                .then(views => {
                  const content = ['# File structure', '## Main method', index, classes, data, routes, views].join('\n\n')
                  writeFilePromise(this.documentationFile, content)
                    .then(() => resolve('File structure documentation exported to "' + this.documentationFile + '"'))
                    .catch(reject)
                }).catch(reject)).catch(reject)).catch(reject)).catch(reject)).catch(reject)
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
