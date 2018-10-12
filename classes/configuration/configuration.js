#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * Main configuration interface where all the important data can be got
 */

const ConfigurationReader = require('./configurationReader')
const DatabaseApi = require('../database/databaseApi')
const LoginManager = require('../communication/loginManager')
const path = require('path')

// Globals
const applicationName = ConfigurationReader.parseJsonData('applicationName.json').name
const navBar = ConfigurationReader.parseJsonData('navBar.json')
const navBarLoggedIn = ConfigurationReader.parseJsonData('navBarLoggedIn.json')
const theme = ConfigurationReader.parseJsonData('theme.json')
const footer = ConfigurationReader.parseJsonData('footer.json')
// Welcome page
const welcomeBanner = ConfigurationReader.parseJsonData('welcome/banner.json')
const welcomeFeatures = ConfigurationReader.parseJsonData('welcome/features.json')
// Accounts image directory
const accountsPath = path.join('accounts')
// LoginRegister page
const loginRegisterCard = ConfigurationReader.parseJsonData('loginRegister/card.json')
// Fab button
const fab = ConfigurationReader.parseJsonData('fab.json')

/**
 * Main configuration interface where all the important data can be got
 *
 * @author AnonymerNiklasistanonym <https://github.com/AnonymerNiklasistanonym>
 */
class Configuration {
  /**
   * @param {string} authorizedId
   */
  static generateNavBarContent (authorizedId) {
    return new Promise((resolve, reject) => {
      if (LoginManager.checkIfAccountAuthorized(authorizedId)) {
        const accountId = LoginManager.getAuthorizedAccount(authorizedId)
        DatabaseApi.getAccountNavBar(accountId)
          .then(accountObject =>
            resolve({
              ...navBarLoggedIn,
              ...accountObject,
              account: {
                bgPicture: ['', accountsPath, accountObject.server_file_path_bg_picture + '_300x176.jpg'].join('/'),
                id: accountObject.id,
                name: accountObject.name,
                profilePicture: ['', accountsPath,
                  accountObject.server_file_path_profile_picture + '_64x64.jpg'].join('/'),
                profilePictureBig: ['', accountsPath,
                  accountObject.server_file_path_profile_picture + '_1000x1000.jpg'].join('/')
              },
              title: applicationName
            }))
          .catch(reject)
      } else {
        resolve({ ...navBar, title: applicationName })
      }
    })
  }
  static get fabContent () {
    return { fab }
  }
  /**
   * Content that can be merged with `res.locals`
   */
  static get generalContent () {
    return { applicationName, theme, footer }
  }
  /**
   * Content that can be merged with `res.locals`
   */
  static get welcomeContent () {
    return { banner: welcomeBanner, featureRow: welcomeFeatures }
  }
  /**
   * Content that can be merged with `res.locals`
   */
  static get navBar () {
    return { loggedIn: {}, loggedOut: {} }
  }
  static get loginRegisterContent () {
    return { loginRegisterCard }
  }
}

module.exports = Configuration
