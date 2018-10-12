#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * TODO
 */

const PasswordHelper = require('../other/security')

/**
 * Map to save account authorizations timeouts
 */
const registeredAccounts = new Map([])
/**
 * Map to save 'Remove account authorization' timeouts
 */
const terminateConnectionQueue = new Map([])
/**
 * 30 min until a new login is required
 */
const authorizationTimeMs = 1000 * 60 * 30

/**
 * Authorization manager
 */
class LoginManager {
  /**
   * @param {string} authorizedId
   * @returns {string}
   */
  static getAuthorizedAccount (authorizedId) {
    return registeredAccounts.get(authorizedId).accountId
  }
  /**
   * Extend authorization time
   * @param {string} authorizedId
   */
  static extendAccountAuthorization (authorizedId) {
    // Clear set timeout for removing the account authorization
    if (terminateConnectionQueue.has(authorizedId)) {
      clearTimeout(terminateConnectionQueue.get(authorizedId))
    }
    // Set/Override new timeout for removing the account authorization
    terminateConnectionQueue.set(authorizedId, setTimeout(() => {
      // If timeout expires remove account authorization and delete Map entry
      this.removeAuthorizedAccount(authorizedId)
      terminateConnectionQueue.delete(authorizedId)
    }, authorizationTimeMs))
  }
  /**
   * Return if authorized id is currently registered as authorized account
   * @param {string} authorizedId
   * @returns {boolean} True if registered
   */
  static checkIfAccountAuthorized (authorizedId) {
    if (registeredAccounts.has(authorizedId)) {
      this.extendAccountAuthorization(authorizedId)

      return true
    } else {
      return false
    }
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
    registeredAccounts.set(tempId, { accountId })
    this.extendAccountAuthorization(tempId)

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
