#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * Main configuration interface where all the important data can be got
 */

const fs = require('fs')
const path = require('path')

/**
 * Main configuration interface where all the important data can be got
 *
 * @author AnonymerNiklasistanonym <https://github.com/AnonymerNiklasistanonym>
 */
class Configuration {
  /**
   * Get JSON object from a `.json` file
   * @param {string} filePath File path to `.json` file
   * @returns {*} JSON object
   */
  static parseJsonData (filePath) {
    return JSON.parse(fs
      .readFileSync(filePath)
      .toString())
  }
  getTheme () {
    return this.theme
  }
  getNavBar () {
    return this.navBar
  }
  getMaterializeFooter () {
    return this.materializeFooter
  }
  getMaterializeCardBanner () {
    return this.materializeBanner
  }
  getMaterializeFeatureRow () {
    return this.materializeFeatureRow
  }
  getMaterializeFab () {
    return this.materializeFab
  }
  setupNavBar () {
    this.navBar = Configuration.parseJsonData(path.join(__dirname, '../../data/server/nav.json'))

    return this
  }
  setupFooter () {
    this.materializeFooter = Configuration.parseJsonData(path.join(__dirname, '../../data/server/footer.json'))

    return this
  }
  setupCardBanner () {
    this.materializeBanner = Configuration.parseJsonData(path.join(__dirname, '../../data/server/banner.json'))

    return this
  }
  setupFeatureRow () {
    this.materializeFeatureRow = Configuration.parseJsonData(path.join(__dirname, '../../data/server/featureRow.json'))

    return this
  }
  setupTheme () {
    this.theme = Configuration.parseJsonData(path.join(__dirname, '../../data/server/theme.json'))

    return this
  }
  setupFab () {
    this.materializeFab = Configuration.parseJsonData(path.join(__dirname, '../../data/server/fab.json'))

    return this
  }
}

const configuration = new Configuration()
  .setupFooter()
  .setupCardBanner()
  .setupTheme()
  .setupFeatureRow()
  .setupNavBar()
  .setupFab()

module.exports = configuration
