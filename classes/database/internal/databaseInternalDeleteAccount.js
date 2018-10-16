#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * TODO
 */

const DatabaseQueries = require('../databaseQueries').DatabaseQueries

class DatabaseInternalApiDeleteAccount {
  /**
   * Delete an account from the database
   * @param {string} name Unique account name
   * @returns {Promise}
   */
  static deleteAccount (name) {
    return DatabaseQueries.postRequest(
      DatabaseQueries.createDeleteQuery('account'), [name])
  }
}

module.exports = DatabaseInternalApiDeleteAccount
