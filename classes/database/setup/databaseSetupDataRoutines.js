#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * Description:
 * TODO
 */

const DatabaseApi = require('../databaseApi')

/**
 * Parse JSON file to JSON object and the to something else with an additional parser class
 */
class DatabaseSetupDataRoutines {
  /**
   * Create an account
   * @param {import('../databaseTypes').IJsonDataTableDataAccount} accountObject
   */
  static createAccount (accountObject) {
    return DatabaseApi.createAccount(accountObject.id, accountObject.password,
      accountObject.options !== undefined ? accountObject.options : {})
  }
  /**
   * Create an account
   * @param {import('../databaseTypes').IJsonDataTableDataArtist} artistObject
   */
  static createArtist (artistObject) {
    // Double check if the author account even exists
    return new Promise((resolve, reject) => DatabaseApi.getAccount('root')
      .then(accountObject => DatabaseApi.createArtist(artistObject.name, accountObject.id,
        artistObject.options !== undefined ? artistObject.options : {})
        .then(resolve)
        .catch(reject))
      .catch(reject))
  }
  /**
   * Create an account
   * @param {import('../databaseTypes').IJsonDataTableDataSong} songObject
   */
  static createSong (songObject) {
    return new Promise((resolve, reject) => DatabaseApi.getAccount('root')
      .then(accountObject => DatabaseApi.createSong(songObject.name, accountObject.id, songObject.server_file_path,
        songObject.options !== undefined ? songObject.options : {})
        .then(resolve)
        .catch(reject))
      .catch(reject))
  }
}

module.exports = DatabaseSetupDataRoutines
