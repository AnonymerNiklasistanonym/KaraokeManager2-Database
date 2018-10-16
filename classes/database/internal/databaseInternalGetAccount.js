#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * TODO
 */

const DatabaseQueries = require('../databaseQueries').DatabaseQueries
const PasswordHelper = require('../../other/security')

class DatabaseInternalApiGetAccount {
  /**
   * Get if an account exists
   * @param {string} name Unique account name
   * @returns {Promise<boolean>} Exists
   */
  static getAccountExists (name) {
    return DatabaseQueries.getExists('account', 'id', name)
  }
  /**
   * Get user account information
   * @param {string} name Unique account name
   * @returns {Promise<import('./databaseInternalTypes').IGetAccount>}
   */
  static getAccount (name) {
    return new Promise((resolve, reject) => {
      // Later add comment count, playlist entries etc.
      DatabaseQueries.getEachRequest(
        DatabaseQueries.createSelectQuery('account', ['id', 'name', 'is_admin',
          'is_private', 'is_banned', 'is_banned_comments', 'is_banned_entries',
          'server_file_path_profile_picture', 'server_file_path_bg_picture',
          'status'], undefined, 'id'), [name])
        .then(object => {
          if (object.id === undefined) {
            reject(Error('No account was found!'))
          } else {
            const isAdmin = object.is_admin === 1
            const isBanned = object.is_banned === 1
            const isBannedComments = object.is_banned_comments === 1
            const isBannedEntries = object.is_banned_entries === 1
            const isPrivate = object.is_private === 1
            resolve({
              ...object,
              is_admin: isAdmin,
              is_banned: isBanned,
              is_banned_comments: isBannedComments,
              is_banned_entries: isBannedEntries,
              is_private: isPrivate
            })
          }
        })
        .catch(reject)
    })
  }
  /**
   * Verify user account with the correct password
   * @param {string} name Unique account name
   * @param {string} password Account password
   * @returns {Promise<boolean>}
   */
  static verifyAccount (name, password) {
    return new Promise((resolve, reject) => {
      DatabaseQueries.getEachRequest(
        DatabaseQueries.createSelectQuery('account', ['password_hash',
          'password_salt'], undefined, 'id'), [name])
        .then(accountHashAndSalt => {
          resolve(PasswordHelper.checkPassword(password, accountHashAndSalt.password_salt,
            accountHashAndSalt.password_hash))
        })
        .catch(reject)
    })
  }
}

module.exports = DatabaseInternalApiGetAccount
