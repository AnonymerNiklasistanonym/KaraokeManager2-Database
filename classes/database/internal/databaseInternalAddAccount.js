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

class DatabaseInternalApiAddAccount {
  /**
   * Add an user account
   * @param {string} id Unique account name
   * @param {string} password Account password
   * @param {import('./databaseInternalTypes').IAddAccountOptions} [options] Account options
   * @returns {Promise<import('../databaseQueriesTypes').IPostRequestResult>}
   */
  static addAccount (id, password, options) {
    // tslint:disable-next-line:cyclomatic-complexity
    const hashAndSalt = PasswordHelper.generateHashAndSalt(password)
    const columns = ['id', 'password_hash', 'password_salt',
      'server_file_path_profile_picture', 'server_file_path_bg_picture'
    ]
    const data = [id, hashAndSalt.hash, hashAndSalt.salt]

    if (options !== undefined && options.server_file_path_profile_picture !== undefined) {
      data.push(options.server_file_path_profile_picture)
    } else {
      data.push('defaultAccountFg')
    }
    if (options !== undefined && options.server_file_path_bg_picture !== undefined) {
      data.push(options.server_file_path_bg_picture)
    } else {
      data.push('defaultAccountBg')
    }

    if (options !== undefined) {
      if (options.isAdmin !== undefined) {
        columns.push('is_admin')
        // @ts-ignore
        data.push(options.isAdmin ? 1 : 0)
      }
      if (options.isPrivate !== undefined) {
        columns.push('is_private')
        // @ts-ignore
        data.push(options.isPrivate ? 1 : 0)
      }
      if (options.name !== undefined) {
        columns.push('name')
        data.push(options.name)
      }
      if (options.status !== undefined) {
        columns.push('name')
        data.push(options.status)
      }
    }

    const questionMarks = new Array(columns.length).fill('?')

    return DatabaseQueries.postRequest(
      `INSERT INTO account(${columns.join(',')}) VALUES(${questionMarks.join(',')});`,
      data)
  }
}

module.exports = DatabaseInternalApiAddAccount
