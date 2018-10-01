#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * Documentation file structure scanner
 */

const path = require('path')
const fs = require('fs').promises

/**
 * Document file structure helping class.
 * Contains methods to get all files recursively and import README directory infos and javascript file headers.
 */
class FileStructureScanner {
  /**
   * List files in a directory
   * @param {string} directoryPath Path of directory
   * @param {function(string): boolean} fileFilter Allowed files filter
   * @returns {Promise<File[]>} List of files in directory
   */
  static listFiles (directoryPath, fileFilter = a => true) {
    return new Promise((resolve, reject) => {
      // Read directory to get all specified files
      fs.readdir(directoryPath)
        .then(fileList => Promise.all(fileList
          // Filter file list to only get files that should be analyzed
          .filter(fileFilter)
          // Analyze each file
          .map(filePath => this.analyzeFile(path.join(directoryPath, filePath), fileFilter)))
          // Put all information into one object
          .then(resolve)
          .catch(reject))
        .catch(reject)
    })
  }
  /**
   * Analyze any file
   * @param {string} filePath Path of file
   * @param {function(string): boolean} fileFilter Allowed files filter
   * @returns {Promise<File>} File object of this file
   */
  static analyzeFile (filePath, fileFilter = a => true) {
    return new Promise((resolve, reject) => {
      // Analyze specifically if file is a directory or a normal file
      fs.stat(filePath)
        .then(status => {
          // According to that choose specific method
          if (status.isDirectory()) {
            this.analyzeDirectory(filePath, fileFilter)
              .then(resolve)
              .catch(reject)
          } else if (status.isFile()) {
            this.analyzeSingleFile(filePath)
              .then(resolve)
              .catch(reject)
          } else {
            reject(Error('File is neither a single file nor a directory!'))
          }
        })
        .catch(reject)
    })
  }
  /**
   * Analyze a directory
   * @param {string} directoryPath Path of directory
   * @param {function(string): boolean} fileFilter Allowed files filter
   * @returns {Promise<File>} File object of this directory
   */
  static analyzeDirectory (directoryPath, fileFilter = a => true) {
    return new Promise((resolve, reject) =>
      // List the files of the directory and get directory information
      Promise.all([this.getDirectoryInformation(directoryPath), this.listFiles(directoryPath, fileFilter)])
        .then(results => {
          resolve({ ...results[0], files: results[1] })
        })
        .catch(reject))
  }
  /**
   * Analyze single file
   * @param {string} filePath Path of single file
   * @returns {Promise<File>} checks if the file contains information about its content
   */
  static analyzeSingleFile (filePath) {
    return new Promise((resolve, reject) =>
      // Get file information
      this.getFileInformation(filePath)
        .then(resolve)
        .catch(reject))
  }
  /**
   * Get information object of a directory
   * @param {string} directoryPath Path of directory
   * @returns {Promise<FileInformation>} FileInformation object of this directory
   */
  static getDirectoryInformation (directoryPath) {
    return new Promise((resolve, reject) =>
      // Get directory info
      Promise.all([this.getDirectoryInformationString(directoryPath)])
        .then(results => resolve({
          info: results[0],
          path: directoryPath.replace(/^.*[\\/]/, '')
        }))
        .catch(reject))
  }
  /**
   * Get information object of a single file
   * @param {string} filePath Path of single file
   * @returns {Promise<FileInformation>} FileInformation object of this single file
   */
  static getFileInformation (filePath) {
    return new Promise((resolve, reject) =>
      // Get file info, get file JSON info
      Promise.all([this.getFileInformationString(filePath), this.getFileInformationJson(filePath)])
        .then(results => {
          resolve({
            info: results[0],
            jsonHelp: results[1],
            path: filePath.replace(/^.*[\\/]/, '')
          })
        })
        .catch(reject))
  }
  /**
   * Get info string
   * @param {string} directoryPath Path of directory
   * @returns {Promise<string>} Info string
   */
  static getDirectoryInformationString (directoryPath) {
    return new Promise((resolve, reject) => {
      // If there is a README-md file
      const readmeFile = path.join(directoryPath, 'README.md')
      this.helpIfFileExistsReturnContentElseUndefined(readmeFile)
        .then(content => {
          if (content !== undefined) {
            resolve(content
              .substring(content.indexOf('\n'))
              .replace(/^\s+|\s+$/g, ''))
          } else {
            resolve(undefined)
          }
        })
        .catch(reject)
    })
  }
  /**
   * Get info string
   * @param {string} filePath Path of single file
   * @returns {Promise<string>} Info string
   */
  static getFileInformationString (filePath) {
    return new Promise((resolve, reject) => {
      const fileExtension = filePath.substring(filePath.lastIndexOf('.') + 1)
      switch (fileExtension) {
        case 'js':
          this.getFileInformationStringJs(filePath)
            .then(resolve)
            .catch(reject)
          break
        case 'handlebars':
          this.getFileInformationStringHandlebars(filePath)
            .then(resolve)
            .catch(reject)
          break
        case 'json':
          this.getFileInformationStringJson(filePath)
            .then(resolve)
          break
        default:
          reject(Error('File extension is not supported: ' + fileExtension))
      }
    })
  }
  /**
   * Get Json object
   * @param {string} filePath Path of single file
   * @returns {Promise<*>} Json object
   */
  static getFileInformationJson (filePath) {
    return new Promise((resolve, reject) => {
      const jsonFile = filePath + '.json'
      this.helpIfFileExistsReturnContentElseUndefined(jsonFile)
        .then(content => {
          if (content !== undefined) {
            resolve(JSON.parse(content))
          } else {
            resolve(undefined)
          }
        })
        .catch(reject)
    })
  }
  /**
   * Get file content or undefined if not existing
   * @param {string} filePath Path of single file
   * @returns {Promise<string>} Content of file or if not existing undefined
   */
  static helpIfFileExistsReturnContentElseUndefined (filePath) {
    return new Promise((resolve, reject) => {
      fs.stat(filePath)
        .then(status => {
          if (status.isFile()) {
            fs.readFile(filePath, 'utf8')
              .then(content => content.toString())
              .then(resolve)
              .catch(reject)
          } else {
            resolve(undefined)
          }
        })
        .catch(() => { resolve(undefined) })
    })
  }
  /**
   * Get file information string of JavaScript files
   * @param {string} filePath Path of single file
   * @returns {Promise<string>} Content of file or if not existing undefined
   */
  static getFileInformationStringJs (filePath) {
    return new Promise((resolve, reject) => {
      this.helpIfFileExistsReturnContentElseUndefined(filePath)
        .then(content => {
          if (content !== undefined) {
            // The `\n` is included to not accidentally checking this file with the following line
            if (content.indexOf('\n * This file contains:') !== -1) {
              const borders = { begin: 'This file contains:', end: ' */' }
              resolve(content
                .substring(content.indexOf(borders.begin) + borders.begin.length,
                  content.indexOf(borders.end))
                .split('* ')
                .join('')
                .replace(/^\s+|\s+$/g, ''))
            } else {
              resolve(undefined)
            }
          } else {
            reject(Error('File content cannot be undefined!'))
          }
        })
    })
  }
  /**
   * Get file information string of Handlebars files
   * @param {string} filePath Path of single file
   * @returns {Promise<string>} Content of file or if not existing undefined
   */
  static getFileInformationStringHandlebars (filePath) {
    return new Promise((resolve, reject) => {
      this.helpIfFileExistsReturnContentElseUndefined(filePath)
        .then(content => {
          if (content !== undefined) {
            if (content.indexOf('{{!--') !== -1) {
              const borders = { begin: 'Description:', end: '--}}' }
              resolve(content
                .substring(content.indexOf(borders.begin) + ' Description:'.length,
                  content.indexOf(borders.end))
                .split('\n ')
                .join('')
                .replace(/^\s+|\s+$/g, ''))
            } else {
              resolve(undefined)
            }
          } else {
            reject(Error('File content cannot be undefined!'))
          }
        })
    })
  }
  /**
   * Get file information string of Handlebars files
   * @param {string} filePath Path of single file
   * @returns {Promise<string>} Content of file or if not existing undefined
   */
  static getFileInformationStringJson (filePath) {
    return new Promise(resolve => {
      const explanationFile = filePath.substring(0, filePath.lastIndexOf('.')) + '.md'
      this.helpIfFileExistsReturnContentElseUndefined(explanationFile)
        .then(content => {
          if (content !== undefined) {
            resolve(content.substring(content.indexOf('\n'))
              .replace(/^\s+|\s+$/g, ''))
          } else {
            resolve(undefined)
          }
        })
    })
  }
}

module.exports = FileStructureScanner

/**
 * Type definition for a File object
 * @typedef {{path: string, info?: string, jsonHelp?: *, files?: File[]}} File
 */
/**
 * Type definition for a FileInformation object
 * @typedef {{path: string, info?: string, jsonHelp?: *}} FileInformation
 */
