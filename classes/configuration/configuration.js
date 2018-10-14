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
// Playlist page
const searchBar = ConfigurationReader.parseJsonData('playlist/searchBar.json')

/**
 * Main configuration interface where all the important data can be got
 *
 * @author AnonymerNiklasistanonym <https://github.com/AnonymerNiklasistanonym>
 */
class Configuration {
  /**
   * Parse pagination object
   * @param {number} currentPage
   * @param {number} lastPage
   * @param {string} baseLinkUrl
   * @param {number} size
   * @returns {{arrows:{left:{disabled:boolean,exists:boolean,link:string},right:{disabled:boolean,exists:boolean,link:string}},pages:{active:boolean,link:string,number:number}[]}}
   */
  static parsePagination (currentPage, lastPage, baseLinkUrl, size = 5) {
    const pages = []
    // Always try to make the active page in the middle
    // Exceptions are the first and last three places
    let paginationBeginIndex
    if (currentPage <= 3) {
      paginationBeginIndex = 1
    } else if (currentPage >= lastPage - 3) {
      paginationBeginIndex = lastPage - size
    } else {
      paginationBeginIndex = currentPage - Math.floor(size / 2)
    }

    for (let index = paginationBeginIndex; index <= paginationBeginIndex + size; index++) {
      pages.push({
        active: index === currentPage,
        link: baseLinkUrl + index,
        number: index
      })
    }

    return {
      arrows: {
        left: {
          disabled: currentPage === 1,
          exists: true,
          link: currentPage === 1 ? 'javascript:void(0);' : baseLinkUrl + (currentPage - 1)
        },
        right: {
          disabled: currentPage === lastPage,
          exists: true,
          link: currentPage === lastPage ? 'javascript:void(0);' : baseLinkUrl + (currentPage + 1)
        }
      },
      pages
    }
  }
  static parsePlaylistEntries (object) {
    return {
      firstLine: `by ${object.artists.map(a => a.name).join(', ')} [${object.songContentTypes.map(a => a.name).join(', ')}]`,
      isAudio: object.isAudio,
      isUnknown: object.isUnknown,
      isVideo: object.isVideo,
      secondLine: `added and supported by [add singer later]`,
      title: `${object.name}`,
      url: `/song/${object.id}/name`
    }
  }
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
                bgPicture: ['', accountsPath, accountObject.server_file_path_bg_picture + '_600x353.jpg'].join('/'),
                id: accountObject.id,
                name: accountObject.name,
                profilePicture: ['', accountsPath,
                  accountObject.server_file_path_profile_picture + '_128x128.jpg'].join('/'),
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
  /**
   * Content that can be merged with `res.locals`
   */
  static get generalContent () {
    return { applicationName, theme, footer, fab }
  }
  /**
   * Content that can be merged with `res.locals`
   */
  static get generalContentClean () {
    return { applicationName, theme }
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
  static get playlistContent () {
    return { searchBar }
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
