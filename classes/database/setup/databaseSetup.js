#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * The database setup
 * - create default tables
 * - create default data
 *    - create accounts/artists/songs
 */

const { DatabaseTablesJsonParser, DatabaseTableValuesJsonParser } = require('./databaseSetupJsonParser')
const { DatabaseQueriesErrorHelper } = require('../databaseQueries')
const DatabaseSetupDataRoutines = require('./databaseSetupDataRoutines')
const DatabaseApi = require('../databaseApi')

/**
 * Setup database with default tables and values
 */
class DatabaseSetup {
  static createDefaultTables () {
    return new Promise((resolve, reject) => DatabaseTablesJsonParser.setupTables
      .then(dbTablesJson => {
        Promise.all(dbTablesJson
          .map(dbTableJson => DatabaseApi.createTable(
            dbTableJson.name, dbTableJson.primary_key, dbTableJson.not_null_keys, dbTableJson.null_keys,
            'createIfNotAlreadyExisting')))
          .then(resolve)
          .catch(reject)
      })
      .catch(reject))
  }
  static createDefaultTableData () {
    return new Promise((resolve, reject) => DatabaseTableValuesJsonParser.setupTableValues
      .then(dbTableValuesJson => {
        Promise.all([...dbTableValuesJson.accounts.map(DatabaseSetupDataRoutines.createAccount),
          ...dbTableValuesJson.artists.map(DatabaseSetupDataRoutines.createArtist),
          ...dbTableValuesJson.songs.map(DatabaseSetupDataRoutines.createSong)
        ])
          .then(resolve)
          .catch(err => {
            if (err.errno !== DatabaseQueriesErrorHelper.errorCodes.SQLITE_CONSTRAINT) {
              reject(err)
            } else {
              resolve()
            }
          })
      })
      .catch(reject))
  }
  static createEverything () {
    return new Promise((resolve, reject) => this.createDefaultTables()
      .then(() => this.createDefaultTableData()
        .then(resolve)
        .catch(reject))
      .catch(reject))
  }
}

module.exports = DatabaseSetup
