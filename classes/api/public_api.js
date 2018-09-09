#!/usr/bin/env node
'use strict'

/*
 * This file contains:
 * Public API functions to interact with anything as fast, short and easy as possible
 */

const API = require('./api')
// const CustomTypes = require('./custom_types')

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
 * Class that contains all methods to easily and fast get all necessary/important stuff for any
 * user.
 *
 * @author AnonymerNiklasistanonym <https://github.com/AnonymerNiklasistanonym>
 */
class PublicAPI {
  /**
   * Get account information
   * @param {string} id Unique account name
   * @returns {Promise<Account>} Promise with information object or error message
   */
  getAccount (id) {}
  /**
   * Get artist information
   * @param {number} id Unique artist number
   * @returns {Promise<Artist>} Promise with information object or error message
   */
  getArtist (id) {}
  /**
   * Get image album information
   * @param {number} id Unique image album number
   * @returns {Promise<ImageAlbum>} Promise with information object or error message
   */
  getImageAlbum (id) {}
  /**
   * Get playlist information
   * @param {number} page Page number
   * @param {boolean} old Old or current playlist entries
   * @returns {Promise<Playlist>} Promise with information object or error message
   */
  getPlaylist (page=0, old=false) {}
  /**
   * Get playlist entry information
   * @param {number} id Unique playlist entry number
   * @returns {Promise<PlaylistEntry>} Promise with information object or error message
   */
  getPlaylistEntry (id) {}
  /**
   * Get song information
   * @param {number} id Unique song number
   * @returns {Promise<Song>} Promise with information object or error message
   */
  getSong (id) {}
  /**
   * Get account comment thread
   * @param {number} id Unique account comment number
   * @returns {Promise<AccountCommentThread>} Promise with information object or error message
   */
  getCommentThreadAccount (id) {}
  /**
   * Get all comments of one account
   * @param {number} id Unique account number
   * @returns {Promise<AccountCommentThreads>} Promise with information object or error message
   */
  getCommentThreadsAccount (id) {}
  getCommentThreadArtist (id) {}
  getCommentThreadImageAlbum (id) {}
  getCommentThreadPlaylistEntry (id) {}
  getCommentThreadSong (id) {}
}

module.exports = PublicAPI
