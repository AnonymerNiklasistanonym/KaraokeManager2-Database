#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * TODO
 */

const PasswordHelper = require('../other/security')

const registeredAccounts = new Map([])

class LoginManager {
  /**
   * Return if authorized id is currently registered as authorized account
   * @param {string} authorizedId
   * @returns {boolean} True if registered
   */
  static checkIfAccountAuthorized (authorizedId) {
    return registeredAccounts.has(authorizedId)
  }
  /**
   * Register existing and already authorized account
   * @param {string} accountId
   * @returns {string} registeredAccountId
   */
  static registerAuthorizedAccount (accountId) {
    let tempId
    do {
      tempId = PasswordHelper.generateSalt(512)
    } while (registeredAccounts.has(tempId))
    registeredAccounts.set(tempId, accountId)
    // TODO: Remove entries after a specific time to not kill RAM

    return tempId
  }
  /**
   * Remove account authorization
   * @param {string} authorizedId
   */
  static removeAuthorizedAccount (authorizedId) {
    registeredAccounts.delete(authorizedId)
  }
}

module.exports = LoginManager
