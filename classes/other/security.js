#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * Class with methods to provide password creation/checking possibilities
 */

const crypto = require('crypto')

/**
 * Password library
 */
class PasswordHelper {
  /**
   * Additional security through salt in code >> Database breach is not that bad
   * @returns {string} Pepper
   */
  static get pepper () {
    return 'a899f12d640b3cb7aeacfeeaa1d330792f92d50f8e9b54db5c189a7f7c118d62e4487c2ca4fe5b69562d' +
      'b2936f68937d4dab5ae298a6f6cb1c753962fdedc2a0'
  }
  /**
   * Generates salt (a random string of characters of the given length)
   * @param {number} length Salt length
   * @returns {string} Salt
   */
  static generateSalt (length = 2048) {
    return crypto
      .randomBytes(Math.ceil(length / 2)) // Generate random bytes
      .toString('hex') // Convert string into the hexadecimal format
      .slice(0, length) // Slice the string to the wanted length of characters
  }

  /**
   * Generates a new password hash
   * @param {string} password Password
   * @param {number} saltLength Salt length
   * @returns {{salt: string, hash: string}}} Salt and calculated hash
   */
  static generateHashAndSalt (password, saltLength = 2048) {
    const salt = this.generateSalt(saltLength)

    return { salt, hash: this.generateHash(password, salt) }
  }

  /**
   * Generates a password hash
   * Future hint: update hash algorithm >> get supported algorithms: `openssl list -digest-algorithms`
   * @param {string} password Password
   * @param {string} salt Salt
   * @returns {string} Hash
   */
  static generateHash (password, salt) {
    return crypto
      .createHmac('sha512', salt + this.pepper)
      .update(password)
      .digest('hex')
  }

  /**
   * Checks if a password is correct
   * @param {string} password Password
   * @param {string} salt Salt
   * @param {string} hash Hash
   * @returns {boolean} Is password correct
   */
  static checkPassword (password, salt, hash) {
    return this.generateHash(password, salt) === hash
  }
}

module.exports = PasswordHelper
