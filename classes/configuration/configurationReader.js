#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * Configuration file reader
 */

const fs = require('fs')
const path = require('path')

/**
 * Read configuration files
 */
class ConfigurationReader {
  /**
   * Data path
   * @returns {string} File path
   */
  static get dataPath () {
    return path.join(__dirname, '../../data/server')
  }
  /**
   * Get JSON object from a `.json` file
   * @param {string} filePath File path to `.json` file
   * @returns {*} JSON object
   */
  static parseJsonData (filePath) {
    return JSON.parse(fs
      .readFileSync(path.join(this.dataPath, filePath))
      .toString())
  }
  /**
   * Get JSON object from multiple `.json` files
   * @param {string[]} filePaths File paths to `.json` files
   * @returns {*[]} JSON object array
   */
  static parseJsonDataArray (filePaths) {
    return filePaths.map(this.parseJsonData)
  }
}

module.exports = ConfigurationReader
