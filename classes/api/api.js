#!/usr/bin/env node
'use strict'

/*
 * This file contains:
 * Api functions to interact with anything as fast, short and easy as possible
 */

/**
 * Type definition for an Account object
 * @typedef {{id: string, name: string, isAdmin: boolean, isBanned: boolean, isPrivate: boolean, picture: string, status: string}} Account
 */
/**
 * Type definition for an Artist object
 * @typedef {{name: string, picture: string, links: {spotify: string, youTube: string}}} Artist
 */
/**
 * Type definition for a Playlist object
 * @typedef {[PlaylistEntry]} Playlist
 */
/**
 * Type definition for a PlaylistEntry object
 * @typedef {{id: number, author: Account, song: Song}} PlaylistEntry
 */
/**
 * Type definition for a Song object
 * @typedef {{id: number, name: string, date: number, author: Account, song: Song}} Song
 */
/**
 * Type definition for an ImageAlbum object
 * @typedef {{id: number, name: string, date: number, author: Account}} ImageAlbum
 */
/**
 * Type definition for a Comment object
 * @typedef {{id: number, name: string, date: number, author: Account, answers: [Comment]}} Comment
 */
/**
 * Type definition for a AccountCommentThread object
 * @typedef {{account: Account, comment: Comment}} AccountCommentThread
 */
/**
 * Type definition for a AccountCommentThreads object
 * @typedef {{account: Account, comments: [Comment]}} AccountCommentThreads
 */
/**
 * Type definition for a ArtistCommentThread object
 * @typedef {{artist: Artist, comment: Comment}} ArtistCommentThread
 */
/**
 * Type definition for a ArtistCommentThreads object
 * @typedef {{artist: Artist, comments: [Comment]}} ArtistCommentThreads
 */
/**
 * Type definition for a SongCommentThread object
 * @typedef {{song: Song, comment: Comment}} SongCommentThread
 */
/**
 * Type definition for a SongCommentThreads object
 * @typedef {{song: Song, comments: [Comment]}} SongCommentThreads
 */
/**
 * Type definition for a PlaylistEntryCommentThread object
 * @typedef {{playlistEntry: PlaylistEntry, comment: Comment}} PlaylistEntryCommentThread
 */
/**
 * Type definition for a PlaylistEntryCommentThreads object
 * @typedef {{playlistEntry: PlaylistEntry, comment: [Comment]}} PlaylistEntryCommentThreads
 */
/**
 * Type definition for a ImageAlbumCommentThread object
 * @typedef {{imageAlbum: ImageAlbum, comment: Comment}} ImageAlbumCommentThread
 */
/**
 * Type definition for a ImageAlbumCommentThreads object
 * @typedef {{imageAlbum: ImageAlbum, comment: [Comment]}} ImageAlbumCommentThreads
 */

/**
 * Class that contains all methods to easily and fast get all necessary/important stuff.
 *
 * @author AnonymerNiklasistanonym <https://github.com/AnonymerNiklasistanonym>
 */
class API {
  /**
   * Get 'Create table' SQLite queries
   *
   * @readonly
   * @static
   * @returns {Promise<boolean>} Which resolves with an string array of SQLite queries
   * @example
   * DatabaseHelper.setupSQLiteTablesQueries
   *   .then(stringArray => console.log(stringArray))
   * // outputs ['', '', ...]
   * @author AnonymerNiklasistanonym <https://github.com/AnonymerNiklasistanonym>
   */
  static get setupSQLiteTablesQueries () {
    // return new Promise((resolve, reject) => true ? resolve(true) : reject(false))
  }
  /**
   * Get account information
   * @param {string} id Unique account name
   * @returns {Promise<Account>} Promise with information object or error message
   */
  static getAccount (id) {}
  /**
   * Get artist information
   * @param {number} id Unique artist number
   * @returns {Promise<Artist>} Promise with information object or error message
   */
  static getArtist (id) {}
  /**
   * Get image album information
   * @param {number} id Unique image album number
   * @returns {Promise<ImageAlbum>} Promise with information object or error message
   */
  static getImageAlbum (id) {}
  /**
   * Get playlist information
   * @param {number} page Page number
   * @param {boolean} old Old or current playlist entries
   * @returns {Promise<Playlist>} Promise with information object or error message
   */
  static getPlaylist (page = 0, old = false) {}
  /**
   * Get playlist entry information
   * @param {number} id Unique playlist entry number
   * @returns {Promise<PlaylistEntry>} Promise with information object or error message
   */
  static getPlaylistEntry (id) {}
  /**
   * Get song information
   * @param {number} id Unique song number
   * @returns {Promise<Song>} Promise with information object or error message
   */
  static getSong (id) {}
  /**
   * Get account comment thread
   * @param {number} id Unique account comment number
   * @returns {Promise<AccountCommentThread>} Promise with information object or error message
   */
  static getCommentThreadAccount (id) {}
  /**
   * Get all comments of one account
   * @param {number} id Unique account number
   * @returns {Promise<AccountCommentThreads>} Promise with information object or error message
   */
  static getCommentThreadsAccount (id) {}
  /**
   * Get artist comment thread
   * @param {number} id Unique artist number
   * @returns {Promise<ArtistCommentThread>} Promise with information object or error message
   */
  static getCommentThreadArtist (id) {}
  /**
   * Get all comments of one artist
   * @param {number} id Unique artist number
   * @returns {Promise<ArtistCommentThreads>} Promise with information object or error message
   */
  static getCommentThreadsArtist (id) {}
  /**
   * Get image album comment thread
   * @param {number} id Unique image album number
   * @returns {Promise<ImageAlbumCommentThread>} Promise with information object or error message
   */
  static getCommentThreadImageAlbum (id) {}
  /**
   * Get all comments of one image album
   * @param {number} id Unique image album number
   * @returns {Promise<ImageAlbumCommentThreads>} Promise with information object or error message
   */
  static getCommentsThreadImageAlbum (id) {}
  /**
   * Get playlist entry comment thread
   * @param {number} id Unique playlist entry number
   * @returns {Promise<PlaylistEntryCommentThread>} Promise with information object or error message
   */
  static getCommentThreadPlaylistEntry (id) {}
  /**
   * Get all comments of one playlist entry
   * @param {number} id Unique playlist entry number
   * @returns {Promise<PlaylistEntryCommentThreads>} Promise with information object or error message
   */
  static getCommentThreadsPlaylistEntry (id) {}
  /**
   * Get song comment thread
   * @param {number} id Unique song number
   * @returns {Promise<SongCommentThread>} Promise with information object or error message
   */
  static getCommentThreadSong (id) {}
  /**
   * Get all comments of one song
   * @param {number} id Unique song number
   * @returns {Promise<SongCommentThreads>} Promise with information object or error message
   */
  static getCommentThreadsSong (id) {}
}

module.exports = API
