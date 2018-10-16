#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * TODO
 */

const DatabaseQueries = require('../databaseQueries').DatabaseQueries

class DatabaseInternalApiDeleteSong {
  /**
   * Delete a song from the database
   * @param {string} id Unique song id
   * @returns {Promise}
   */
  static deleteAccount (id) {
    return DatabaseQueries.postRequest(
      DatabaseQueries.createDeleteQuery('account'), [id])
  }
}

module.exports = DatabaseInternalApiDeleteSong
