#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * TODO
 */

const DatabaseQueries = require('../databaseQueries').DatabaseQueries

class DatabaseInternalApiGetArtist {
  /**
   * Get matching artist ids to artist name
   * @param {string} name Artist name
   * @returns {Promise<number[]>}
   */
  static getArtists (name) {
    return new Promise((resolve, reject) => DatabaseQueries
      .getAllRequest(DatabaseQueries.createSelectQuery('artist', ['id'], undefined, 'name'), [name])
      .then(result => result.map(a => a.id))
      .then(resolve)
      .catch(reject))
  }
  /**
   * Get if an artist exists
   * @param {number} id Unique artist id
   * @returns {Promise<boolean>} Exists
   */
  static getArtistExists (id) {
    return DatabaseQueries.getExists('artist', 'id', id)
  }
  /**
   * Get artist
   * @param {number} id Unique artist id
   * @returns {Promise<import('./databaseInternalTypes').IGetArtist>}
   */
  static getArtist (id) {
    return new Promise((resolve, reject) => {
      // Later add comment count, playlist entries etc.
      DatabaseQueries.getEachRequest(DatabaseQueries.createSelectQuery('artist',
        ['id', 'name', 'date', 'author', 'description',
          'server_file_path_artist_picture'],
        undefined, 'id'), [id])
        .then(resolve)
        .catch(reject)
    })
  }
}

module.exports = DatabaseInternalApiGetArtist
