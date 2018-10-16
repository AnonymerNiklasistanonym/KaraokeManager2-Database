#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * TODO
 */

const DatabaseQueries = require('../databaseQueries').DatabaseQueries

class DatabaseInternalApiAddSong {
  /**
   * Add a song
   * @param {string} name Song name
   * @param {string} authorId Author id of song entry
   * @param {string} serverFilePath Server file path song file
   * @param {import('./databaseInternalTypes').IAddSongOptions} [options] Song options
   * @returns {Promise<import('../databaseQueriesTypes').IPostRequestResult>}
   */
  static addSong (name, authorId, serverFilePath, options) {
    const columns = ['name', 'author', 'server_file_path']
    const values = [name, authorId, serverFilePath]

    if (options !== undefined) {
      if (options.description !== undefined) {
        columns.push('description')
        values.push(options.description)
      }
      if (options.lyrics !== undefined) {
        columns.push('lyrics')
        values.push(options.lyrics)
      }
      if (options.release_date !== undefined) {
        columns.push('release_date')
        // @ts-ignore
        values.push(options.release_date)
      }
    }

    return DatabaseQueries.postRequest(
      DatabaseQueries.createInsertQuery('song', columns), values)
  }
  /**
   * Add a song tag: Artist
   * @param {number} songId Unique song id
   * @param {string} authorId Author id of song entry
   * @param {number} artistId Unique artist id
   * @returns {Promise<import('../databaseQueriesTypes').IPostRequestResult>}
   */
  static addSongTagArtist (songId, authorId, artistId) {
    const columns = ['song_id', 'author', 'artist_id']
    const values = [songId, authorId, artistId]

    return DatabaseQueries.postRequest(
      DatabaseQueries.createInsertQuery(
        'song_tag_artist', columns), values)
  }
  /**
   * Add a song tag: Song link
   * @param {number} songId Unique song id
   * @param {string} authorId Author id of song entry
   * @param {number} songLinkId Unique song link id
   * @returns {Promise<import('../databaseQueriesTypes').IPostRequestResult>}
   */
  static addSongTagSongLink (songId, authorId, songLinkId) {
    const columns = ['song_id', 'author', 'song_link_id']
    const values = [songId, authorId, songLinkId]

    return DatabaseQueries.postRequest(
      DatabaseQueries.createInsertQuery(
        'song_tag_song_link', columns), values)
  }
  /**
   * Add a song link
   * @param {string} url Link url
   * @param {string} authorId Author id of entry
   * @param {import('./databaseInternalTypes').IAddSongLinkOptions} [options] Song link options
   * @returns {Promise<import('../databaseQueriesTypes').IPostRequestResult>}
   */
  static addSongLink (url, authorId, options) {
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
        'song_link', columns), values)
  }
  /**
   * Add a song tag: Song content type
   * @param {number} songId Unique song id
   * @param {string} authorId Author id of song entry
   * @param {number} songContentTypeId Unique song content type id
   * @returns {Promise<import('../databaseQueriesTypes').IPostRequestResult>}
   */
  static addSongTagContentType (songId, authorId, songContentTypeId) {
    const columns = ['song_id', 'author', 'song_content_type_id']
    const values = [songId, authorId, songContentTypeId]

    return DatabaseQueries.postRequest(
      DatabaseQueries.createInsertQuery(
        'song_tag_song_content_type', columns), values)
  }
  /**
   * Add a song tag: Song content language
   * @param {number} songId Unique song id
   * @param {string} authorId Author id of song entry
   * @param {number} songContentLanguageId Unique song content language id
   * @returns {Promise<import('../databaseQueriesTypes').IPostRequestResult>}
   */
  static addSongTagContentLanguage (songId, authorId, songContentLanguageId) {
    const columns = ['song_id', 'author', 'song_content_language_id']
    const values = [songId, authorId, songContentLanguageId]

    return DatabaseQueries.postRequest(
      DatabaseQueries.createInsertQuery(
        'song_tag_song_content_language', columns), values)
  }
  /**
   * Add a song content language
   * @param {string} name Content language name
   * @param {string} authorId Author id of song entry
   * @param {import('./databaseInternalTypes').IAddSongContentLanguageOptions} [options] Song content language options
   * @returns {Promise<import('../databaseQueriesTypes').IPostRequestResult>}
   */
  static addSongContentLanguage (name, authorId, options) {
    const columns = ['name', 'author']
    const values = [name, authorId]

    if (options !== undefined) {
      if (options.description !== undefined) {
        columns.push('description')
        values.push(options.description)
      }
    }

    return DatabaseQueries.postRequest(
      DatabaseQueries.createInsertQuery(
        'song_content_language', columns), values)
  }
  /**
   * Add a song content type
   * @param {string} name Content language name
   * @param {string} authorId Author id of song entry
   * @param {import('./databaseInternalTypes').IAddSongContentTypeOptions} [options] Song content type options
   * @returns {Promise<import('../databaseQueriesTypes').IPostRequestResult>}
   */
  static addSongContentType (name, authorId, options) {
    const columns = ['name', 'author']
    const values = [name, authorId]

    if (options !== undefined) {
      if (options.description !== undefined) {
        columns.push('description')
        values.push(options.description)
      }
    }

    return DatabaseQueries.postRequest(
      DatabaseQueries.createInsertQuery(
        'song_content_type', columns), values)
  }
}

module.exports = DatabaseInternalApiAddSong
