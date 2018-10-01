#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * Abstracted database post/request queries like:
 * - POST: createTable()
 * - GET: checkPassword()
 */

const DatabaseQueries = require('./databaseQueries').DatabaseQueries
const DatabaseParser = require('./databaseParser')
const PasswordHelper = require('../other/security')

/**
 * Static class that help to access/interact/talk to the database
 */
class DatabaseApi {
  /**
   * Create a database table
   * @param {string} name
   * @param {import('./databaseTypes').IKey} primaryKey
   * @param {import('./databaseTypes').IKey[]} nonNullKeys
   * @param {import('./databaseTypes').IKey[]} nullKeys
   * @param {import('./databaseTypes').TableOption} option
   * @returns {Promise}
   * @example DatabaseApi.createTable('tableName',
   *  { name: 'id', type: 'integer', option: { notNull: true } },
   *  [],[], 'createIfNotAlreadyExisting')
   * .then(() => console.log('successful'))
   * .catch(console.error)
   */
  static createTable (name, primaryKey, nonNullKeys = [], nullKeys = [], option) {
    console.log('>> createTable: ' + name)

    return DatabaseQueries.postRequest(DatabaseParser.createTableQuery(name, primaryKey,
      nonNullKeys, nullKeys, option))
  }
  /**
   * Create user account
   * @param {string} name Unique account name
   * @param {string} password Account password
   * @returns {Promise}
   * @example DatabaseApi.createAccount('unique account name', 'password')
   * .then(() => console.log('successful'))
   * .catch(console.error)
   */
  static createAccount (name, password) {
    console.log('>> createAccount: ' + name)
    const hashAndSalt = PasswordHelper.generateHashAndSalt(password)

    return DatabaseQueries.postRequest(
      'INSERT INTO account(id, password_hash, password_salt) VALUES(?,?,?)',
      [name, hashAndSalt.hash, hashAndSalt.salt])
  }
}

module.exports = DatabaseApi
