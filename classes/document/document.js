// List all files in a directory in Node.js recursively in a synchronous fashion
const promisify = require('util').promisify
const { readFile, readdir, writeFile, mkdir, stat } = require('fs')
const path = require('path')
const mkdirPromise = promisify(mkdir)
const statPromise = promisify(stat)
const readdirPromise = promisify(readdir)
const readFilePromise = promisify(readFile)
const writeFilePromise = promisify(writeFile)

const existsPromise = (filePath) => new Promise((resolve, reject) => {
  stat(filePath, err => {
    if (err == null) {
      resolve(true)
    } else if (err.code === 'ENOENT') {
      resolve(false)
    } else {
      reject(err)
    }
  })
})

const rootDirectory = path.join(__dirname, '..', '..')
const documentationDirectory = path.join(rootDirectory, 'documentation')
const documentationFile = path.join(documentationDirectory, 'fileStructure.md')

/**
 * Type definition for a AccountCommentThreads object
 * @typedef {({path: string}|{path: string, info: string})} SingleFile
 */
/**
 * Type definition for a AccountCommentThreads object
 * @typedef {({path: string, files: [File]}|{path: string, info: string, files: [File]})} Directory
 */
/**
 * Type definition for a AccountCommentThreads object
 * @typedef {(SingleFile|Directory)} File
 */

class Document {
  /**
     * @param {string} directoryPath
     * @returns {Promise<File>} list of files in directory
     */
  static listFiles (directoryPath, filter = a => a) {
    return new Promise((resolve, reject) => {
      // read directory
      readdirPromise(directoryPath)
        .catch(err => reject(err))
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
            promiseList.push(new Promise((resolve, reject) => {
              const fileFilePath = path.join(directoryPath, filePath)
              // analyze specifically if file is a directory or a normal file
              statPromise(fileFilePath)
                .catch(err => reject(err))
                .then(status => {
                  if (status.isDirectory()) {
                    this.analyzeDirectory(fileFilePath, filter)
                      .catch(err => reject(err))
                      .then(result => resolve(result))
                  } else if (status.isFile()) {
                    this.analyzeFile(fileFilePath)
                      .catch(err => reject(err))
                      .then(result => resolve(result))
                  }
                })
            }))
          })
          Promise.all(promiseList)
            .catch(err => reject(err))
            .then(listOfFiles => resolve({
              path: directoryPath,
              files: listOfFiles
            }))
        })
    })
  }
  /**
     * @param {string} filePath
     * @returns {Promise<SingleFile>} checks if the file contains information about its content
     */
  static analyzeFile (filePath) {
    return new Promise((resolve, reject) => {
      this.getFileContent(filePath)
        .catch(err => reject(err))
        .then(info => resolve({
          path: filePath,
          info: info
        }))
    })
  }
  /**
     * @param {string} directoryPath
     * @returns {Promise<Directory>} checks if the directory contains information about its content
     */
  static analyzeDirectory (directoryPath, filter = a => a) {
    return new Promise((resolve, reject) => {
      this.listFiles(directoryPath, filter)
        .catch(err => reject(err))
        .then(fileList => {
          // get info
          this.getReadmeContentDirectory(directoryPath, fileList.files)
            .catch(err => reject(err))
            .then(info => resolve({
              path: directoryPath,
              info: info,
              files: fileList.files
            }))
        })
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
        .catch(err => reject(err))
        .then(exists => {
          if (exists) {
            readFilePromise(path.join(directoryPath, 'README.md'), 'utf8')
              .catch(err => reject(err))
              .then(value => {
                const substr = value.substring(value.indexOf('\n'))
                resolve(substr.replace(/^\s+|\s+$/g, ''))
              })
          } else {
            resolve('TODO')
          }
        })
    })
  }
  /**
     * @param {string} filePath
     * @returns {Promise<String>} checks if the directory contains information about its content
     */
  static getFileContent (filePath) {
    return new Promise((resolve, reject) => {
      readFilePromise(filePath, 'utf8')
        .catch(err => reject(err))
        .then(value => {
          if (value.indexOf('\n * This file contains:') !== -1) {
            const fileContentHeader = value.substring(value.indexOf('* This file contains:') + '* This file contains:'.length, value.indexOf('*/')).split('* ').join('').replace(/^\s+|\s+$/g, '')
            resolve(fileContentHeader)
          } else {
            resolve('TODO')
          }
        })
    })
  }
  /**
     * @param {File} fileObject
     * @returns {string} Information rendered in markdown
     */
  static renderFileToMarkdown (fileObject, depth = 1, filter = (a) => a) {
    // filter file customized
    fileObject = filter(fileObject)
    // check if file is not a directory
    if (fileObject['files'] === undefined) {
      return '- ' + fileObject.path +
            (fileObject['info'] === undefined ? '\n' : '<br>' + fileObject['info'] + '\n')
    } else {
      return '\n' + '#'.repeat(depth) + ' ' + fileObject.path + '\n' +
            (fileObject['info'] === undefined ? '' : '\n' + fileObject['info'] + '\n\n') +
            (fileObject['files'] === undefined ? '' : fileObject['files']
              .map(element => this.renderFileToMarkdown(element, depth + 1, filter)).join(''))
    }
  }
}

// Create documentation directory
const createDocumentationDirectory = new Promise((resolve, reject) => {
  existsPromise(documentationDirectory)
    .catch(err => reject(err))
    .then(exists => {
      if (!exists) {
        mkdirPromise(documentationDirectory)
          .catch(err => reject(err))
          .then(() => resolve('created documentation directory'))
      } else {
        resolve('documentation directory already exists')
      }
    })
})

// File structure
const createFileStructureDocumentation = new Promise((resolve, reject) => {
  Document.analyzeDirectory(path.join(__dirname, '..', '..', 'classes'), (file) => {
    return file.filter(a => {
      const lastIndex = a.lastIndexOf('.')
      return (lastIndex === -1 || a.substring(lastIndex + 1) === 'js')
    })
  })
    .catch(err => reject(err))
    .then(files => {
      writeFilePromise(documentationFile, '# File structure\n\n' + Document.renderFileToMarkdown(files, 2,
        a => {
          const b = a['path'].replace(rootDirectory, '').replace(/\\/g, '/')
          a['path'] = path.basename(a['path'])
          a['path'] = '[`' + a['path'] + '`](../' + b + ')'
          return a
        }))
        .catch(err => reject(err))
        .then(() => resolve('file structure documentation file created'))
    })
})

createDocumentationDirectory
  .catch(err => console.error(err))
  .then(() => createFileStructureDocumentation
    .catch(err => console.error(err))
    .then(message => console.log(message)))

module.exports = { Document: Document }
