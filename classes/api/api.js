#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * Api functions to interact with anything as fast, short and easy as possible
 */

const DatabaseApiSong = require('../database/databaseApiSong')
const DatabaseApiInternalGetSong = require('../database/internal/databaseInternalGetSong')
const DatabaseApiInternalGetArtist = require('../database/internal/databaseInternalGetArtist')
const DatabaseApiInternalGetAccount = require('../database/internal/databaseInternalGetAccount')
const DatabaseApiInternalAddAccount = require('../database/internal/databaseInternalAddAccount')
const UploadManager = require('../server/uploadManager')
const path = require('path')

const LoginManager = require('../communication/loginManager')

/**
 * Class that contains all methods to easily and fast get all necessary/important stuff.
 * @author AnonymerNiklasistanonym <https://github.com/AnonymerNiklasistanonym>
 */
class API {
  /**
   * Register an account
   * @param {string} name Unique account name
   * @param {string} password Account password
   * @returns {Promise<string>} Authorized id
   */
  static register (name, password) {
    return new Promise((resolve, reject) => {
      DatabaseApiInternalGetAccount.getAccountExists(name)
        .then(exists => {
          if (exists) {
            reject(Error('Account already exists!'))
          } else {
            DatabaseApiInternalAddAccount.addAccount(name, password)
              .then(() => {
                this.login(name, password)
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
   * @param {string} name Unique account name
   * @param {string} password Account password
   * @returns {Promise<string>} Authorized id
   */
  static login (name, password) {
    return new Promise((resolve, reject) => {
      DatabaseApiInternalGetAccount.getAccountExists(name)
        .then(exists => {
          if (!exists) {
            reject(Error(`Account ("${name}") does not exist!`))
          } else {
            DatabaseApiInternalGetAccount.verifyAccount(name, password)
              .then(authorized => {
                if (!authorized) {
                  reject(Error(`Account ("${name}") password is wrong!`))
                }
                resolve(LoginManager.registerAuthorizedAccount(name))
              })
              .catch(reject)
          }
        })
        .catch(reject)
    })
  }
  /**
   * Log out a registered account by authorized id
   * @param {string} authorizedId
   * @returns {void}
   */
  static logout (authorizedId) {
    if (authorizedId !== undefined) {
      return LoginManager.removeAuthorizedAccount(authorizedId)
    }
  }
  /**
   * Check if the authorized id is registered
   * @param {string} authorizedId
   * @returns {boolean} True if authorized id is registered
   */
  static checkIfLoggedIn (authorizedId) {
    if (authorizedId === undefined) {
      return false
    } else {
      return LoginManager.checkIfAccountAuthorized(authorizedId)
    }
  }
  /**
   * Get account information
   * @param {string} name Unique account name
   * @returns {Promise<import("./apiTypesFinal").IAccount>} Promise with information object or error message
   */
  static getAccount (name) {
    return DatabaseApiInternalGetAccount.getAccount(name)
  }
  /**
   * Get artist information
   * @param {number} id Unique artist number
   * @returns {Promise<import("./apiTypesFinal").IArtist>} Promise with information object or error message
   */
  static getArtist (id) {
    return DatabaseApiInternalGetArtist.getArtist(id)
  }
  /**
   * Get song list
   * @param {number} page Page number
   * @param {number} limit Maximum entries to send back
   * @returns {Promise<import("./apiTypesFinal").ISongList>} Promise with information object or error message
   */
  static getSongList (page = 1, limit = 10) {
    // TODO change later to playlist entries
    return new Promise((resolve, reject) =>
      Promise.all([
        DatabaseApiSong.getSongList(limit, page),
        DatabaseApiInternalGetSong.getSongPages(limit)
      ])
        .then(results =>
          resolve({
            elements: results[0].map(DatabaseApiSong.handlebarsSongConversion),
            limit,
            page,
            pages: results[1]
          }))
        .catch(reject))
  }
  /**
   * Add a new song
   * @param {string} name Song title/name
   * @param {string} authorId Unique account name
   * @param {import("./apiTypesFinal").IAddSongFileData} fileData FileData
   * @param {import("./apiTypesFinal").IAddSongOptions} options Song creation options
   * @returns {Promise<number>} Promise with song id
   */
  static addSong (name, authorId, fileData, options) {
    return new Promise((resolve, reject) => {
      // Check for correct format
      if (!(UploadManager.checkIfSupportedAudio(fileData) || UploadManager.checkIfSupportedVideo(fileData))) {
        reject(Error('The uploaded file must be an audio or video file!'))

        return
      }
      // Copy the file to the correct path to remove it from the uploaded section
      const newFilePath = path.join(__dirname, '../../public/songs/', fileData.originalname)
      UploadManager.copyFileTo(fileData, newFilePath)
        .then(() => DatabaseApiSong
          .addSong(name, authorId, newFilePath, options)
          .then(result => { resolve(result.songResult.lastID) })
          .catch(reject))
        .catch(reject)
    })
  }
  /**
   * Get image album information
   * @param {number} id Unique image album number
   * @returns {Promise<import("./apiTypes").ImageAlbum>} Promise with information object or error message
   */
  static getImageAlbum (id) {}
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
