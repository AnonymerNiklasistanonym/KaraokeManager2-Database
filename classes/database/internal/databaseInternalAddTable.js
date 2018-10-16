#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * TODO
 */

const DatabaseQueries = require('../databaseQueries').DatabaseQueries
const DatabaseParser = require('../databaseParser')

class DatabaseInternalApiAddTable {
  /**
   * Create a database table
   * @param {string} name Table name
   * @param {import('./databaseInternalTypes').IKey} primaryKey Primary key of table
   * @param {import('./databaseInternalTypes').IKey[]} nonNullKeys Not null keys of table
   * @param {import('./databaseInternalTypes').IKey[]} nullKeys Null keys of table
   * @param {import('./databaseInternalTypes').TableOption} option Table creation options
   * @returns {Promise<import('../databaseQueriesTypes').IPostRequestResult>}
   */
  static createTable (name, primaryKey, nonNullKeys = [], nullKeys = [], option) {
    return DatabaseQueries.postRequest(DatabaseParser.createTableQuery(name, primaryKey,
      nonNullKeys, nullKeys, option))
  }
}

module.exports = DatabaseInternalApiAddTable
