#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * TODO
 */

const DatabaseQueries = require('../databaseQueries').DatabaseQueries

class DatabaseInternalApiAddArtist {
  /**
   * Add an artist link
   * @param {string} url Link url
   * @param {string} authorId Author id of artist entry
   * @param {import('./databaseInternalTypes').IAddArtistLinkOptions} [options] Artist link options
   * @returns {Promise<import('../databaseQueriesTypes').IPostRequestResult>}
   */
  static addArtistLink (url, authorId, options) {
    const columns = ['url', 'author']
    const values = [url, authorId]

    if (options !== undefined) {
      if (options.description !== undefined) {
        columns.push('description')
        values.push(options.description)
      }
    }

    return DatabaseQueries.postRequest(
      DatabaseQueries.createInsertQuery(
        'artist_link', columns), values)
  }
  /**
   * Add an artist tag link
   * @param {number} artistId Unique artist id
   * @param {string} authorId Author id of artist entry
   * @param {number} artistLinkId Artist link id
   * @returns {Promise<import('../databaseQueriesTypes').IPostRequestResult>}
   */
  static addArtistTagArtistLink (artistId, authorId, artistLinkId) {
    const columns = ['artist', 'author', 'artist_link']
    const values = [artistId, authorId, artistLinkId]

    return DatabaseQueries.postRequest(
      DatabaseQueries.createInsertQuery(
        'artist_tag_artist_link', columns), values)
  }
  /**
   * Add an artist
   * @param {string} name Artist name
   * @param {string} authorId Author id of artist entry
   * @param {import('./databaseInternalTypes').IAddArtistOptions} [options] Artist options
   * @returns {Promise<import('../databaseQueriesTypes').IPostRequestResult>}
   */
  static addArtist (name, authorId, options) {
    const columns = ['name', 'author']
    const values = [name, authorId]

    if (options !== undefined) {
      if (options.description !== undefined) {
        columns.push('description')
        values.push(options.description)
      }
      if (options.server_file_path_artist_picture !== undefined) {
        columns.push('server_file_path_artist_picture')
        values.push(options.server_file_path_artist_picture)
      }
    }

    return DatabaseQueries.postRequest(
      DatabaseQueries.createInsertQuery(
        'artist', columns), values)
  }
}

module.exports = DatabaseInternalApiAddArtist
