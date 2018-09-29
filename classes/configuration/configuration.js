#!/usr/bin/env node
'use strict'

/*
 * This file contains:
 * Main configuration interface where all the important data can be got
 */

const fs = require('fs').promises
const path = require('path')

/**
 * Main configuration interface where all the important data can be got
 *
 * @author AnonymerNiklasistanonym <https://github.com/AnonymerNiklasistanonym>
 */
class Configuration {
  constructor () {
    this.materializeFooter = 'ERROR'
    this.theme = 'ERROR'
  }
  getTheme () {
    return this.theme
  }
  getMaterializeFooter () {
    return this.materializeFooter
  }
  static parseJsonData (filePath) {
    return new Promise((resolve, reject) => fs.readFile(filePath)
      .then(content => resolve(JSON.parse(content.toString())))
      .catch(reject))
  }
  setupFooter () {
    return new Promise((resolve, reject) =>
      Configuration.parseJsonData(path.join(__dirname, '../../data/server/footer.json'))
        .then(content => {
          this.materializeFooter = content
          resolve()
        })
        .catch(reject))
  }
  setupTheme () {
    return new Promise((resolve, reject) =>
      Configuration.parseJsonData(path.join(__dirname, '../../data/server/theme.json'))
        .then(content => {
          this.theme = content
          resolve()
        })
        .catch(reject))
  }
}

const configuration = new Configuration()
const waitForThesePromises = Promise.all([configuration.setupFooter(), configuration.setupTheme()])

module.exports = new Promise((resolve, reject) =>
  waitForThesePromises
    .then(() => resolve(configuration))
    .catch(reject))
