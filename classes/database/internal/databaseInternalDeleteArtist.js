#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * TODO
 */

const DatabaseQueries = require('../databaseQueries').DatabaseQueries

class DatabaseInternalApiDeleteArtist {
  /**
   * Delete an artist from the database
   * @param {string} id Unique artist id
   * @returns {Promise}
   */
  static deleteArtist (id) {
    return DatabaseQueries.postRequest(
      DatabaseQueries.createDeleteQuery('artist'), [id])
  }
}

module.exports = DatabaseInternalApiDeleteArtist
