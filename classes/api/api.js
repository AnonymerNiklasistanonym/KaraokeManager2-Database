#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * Api functions to interact with anything as fast, short and easy as possible
 */

const DatabaseApi = require('../database/databaseApi')
const LoginManager = require('../communication/loginManager')

/**
 * Class that contains all methods to easily and fast get all necessary/important stuff.
 * @author AnonymerNiklasistanonym <https://github.com/AnonymerNiklasistanonym>
 */
class API {
  /**
   * Register an account
   * @param {string} accountId Unique account id
   * @param {string} password Account password
   * @returns {Promise<string>} Authorized id
   */
  static register (accountId, password) {
    return new Promise((resolve, reject) => {
      DatabaseApi.getAccountExists(accountId)
        .then(exists => {
          if (exists) {
            reject(Error('Account already exists!'))
          } else {
            DatabaseApi.createAccount(accountId, password)
              .then(() => {
                this.login(accountId, password)
                  .then(resolve)
                  .catch(reject)
              })
              .catch(reject)
          }
        })
        .catch(reject)
    })
  }
  /**
   * Log in to an account
   * @param {string} accountId Unique account id
   * @param {string} password Account password
   * @returns {Promise<string>} Authorized id
   */
  static login (accountId, password) {
    return new Promise((resolve, reject) => {
      DatabaseApi.getAccountExists(accountId)
        .then(exists => {
          if (!exists) {
            reject(Error('Account does not exist!'))
          } else {
            DatabaseApi.authorizeAccount(accountId, password)
              .then(authorized => {
                if (!authorized) {
                  reject(Error('Account password is wrong!'))
                }
                resolve(LoginManager.registerAuthorizedAccount(accountId))
              })
              .catch(reject)
          }
        })
        .catch(reject)
    })
  }
  /**
   * Log out a registered account
   * @param {string} authorizedId
   */
  static logout (authorizedId) {
    if (authorizedId === undefined) {
      return false
    }

    return LoginManager.removeAuthorizedAccount(authorizedId)
  }
  /**
   * Check if the authorized id is registered
   * @param {string} authorizedId
   * @returns {boolean} True if authorized id is registered
   */
  static checkIfLoggedIn (authorizedId) {
    if (authorizedId === undefined) {
      return false
    }

    return LoginManager.checkIfAccountAuthorized(authorizedId)
  }
  /**
   * Get 'Create table' SQLite queries
   * @returns {Promise<boolean>} Which resolves with an string array of SQLite queries
   */
  static get setupSQLiteTablesQueries () {}
  /**
   * Get account information
   * @param {string} id Unique account name
   * @returns {Promise<import("./apiTypes").Account>} Promise with information object or error message
   */
  static getAccount (id) {
    return DatabaseApi.getAccount(id)
  }
  /**
   * Get artist information
   * @param {number} id Unique artist number
   * @returns {Promise<import("./apiTypes").Artist>} Promise with information object or error message
   */
  static getArtist (id) {}
  /**
   * Get image album information
   * @param {number} id Unique image album number
   * @returns {Promise<import("./apiTypes").ImageAlbum>} Promise with information object or error message
   */
  static getImageAlbum (id) {}
  /**
   * Get playlist information
   * @param {number} page Page number
   * @param {number} limit Maximum entries to send back
   * @param {boolean} old Old or current playlist entries > TODO
   * @returns {Promise<import("./apiTypesFinal").IPlaylist>} Promise with information object or error message
   */
  static getPlaylist (page = 0, limit = 10, old = false) {
    // TODO change later to playlist entries
    return new Promise((resolve, reject) =>
      Promise.all([
        DatabaseApi.getSongs(page, limit),
        DatabaseApi.getSongPages(limit)
      ])
        .then(results =>
          resolve({
            elements: results[0],
            limit,
            page,
            pages: results[1]
          }))
        .catch(reject))
  }
  /**
   * Get playlist entry information
   * @param {number} id Unique playlist entry number
   * @returns {Promise<import("./apiTypes").PlaylistEntry>} Promise with information object or error message
   */
  static getPlaylistEntry (id) {}
  /**
   * Get song information
   * @param {number} id Unique song number
   * @returns {Promise<import("./apiTypes").Song>} Promise with information object or error message
   */
  static getSong (id) {}
  /**
   * Get account comment thread
   * @param {number} id Unique account comment number
   * @returns {Promise<import("./apiTypes").AccountCommentThread>} Promise with information object or error message
   */
  static getCommentThreadAccount (id) {}
  /**
   * Get all comments of one account
   * @param {number} id Unique account number
   * @returns {Promise<import("./apiTypes").AccountCommentThreads>} Promise with information object or error message
   */
  static getCommentThreadsAccount (id) {}
  /**
   * Get artist comment thread
   * @param {number} id Unique artist number
   * @returns {Promise<import("./apiTypes").ArtistCommentThread>} Promise with information object or error message
   */
  static getCommentThreadArtist (id) {}
  /**
   * Get all comments of one artist
   * @param {number} id Unique artist number
   * @returns {Promise<import("./apiTypes").ArtistCommentThreads>} Promise with information object or error message
   */
  static getCommentThreadsArtist (id) {}
  /**
   * Get image album comment thread
   * @param {number} id Unique image album number
   * @returns {Promise<import("./apiTypes").ImageAlbumCommentThread>} Promise with information object or error message
   */
  static getCommentThreadImageAlbum (id) {}
  /**
   * Get all comments of one image album
   * @param {number} id Unique image album number
   * @returns {Promise<import("./apiTypes").ImageAlbumCommentThreads>} Promise with information object or error message
   */
  static getCommentsThreadImageAlbum (id) {}
  /**
   * Get playlist entry comment thread
   * @param {number} id Unique playlist entry number
   * @returns {Promise<import("./apiTypes").PlaylistEntryCommentThread>} Promise with information object or error message
   */
  static getCommentThreadPlaylistEntry (id) {}
  /**
   * Get all comments of one playlist entry
   * @param {number} id Unique playlist entry number
   * @returns {Promise<import("./apiTypes").PlaylistEntryCommentThreads>} Promise with information object or error message
   */
  static getCommentThreadsPlaylistEntry (id) {}
  /**
   * Get song comment thread
   * @param {number} id Unique song number
   * @returns {Promise<import("./apiTypes").SongCommentThread>} Promise with information object or error message
   */
  static getCommentThreadSong (id) {}
  /**
   * Get all comments of one song
   * @param {number} id Unique song number
   * @returns {Promise<import("./apiTypes").SongCommentThreads>} Promise with information object or error message
   */
  static getCommentThreadsSong (id) {}
}

module.exports = API
