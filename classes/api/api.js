#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * Api functions to interact with anything as fast, short and easy as possible
 */

/**
 * Class that contains all methods to easily and fast get all necessary/important stuff.
 * @author AnonymerNiklasistanonym <https://github.com/AnonymerNiklasistanonym>
 */
class API {
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
  static getAccount (id) {}
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
   * @param {boolean} old Old or current playlist entries
   * @returns {Promise<import("./apiTypes").Playlist>} Promise with information object or error message
   */
  static getPlaylist (page = 0, old = false) {}
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
