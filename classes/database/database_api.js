#!/usr/bin/env node
'use strict'

/*
 * This file contains:
 * Basic methods to make get and post requests to the database
 */

const DatabaseQueries = require('./database_queries')
const DatabaseParser = require('./database_parser')
const { PasswordHelper } = require('./../other/security')

/**
 * Type definition for a Key object
 * @typedef {{name: string, type: KeyType, default?: KeyDefault, reference?: KeyReference, options?: KeyOptions}} Key
 */
/**
 * Type definition for a KeyType object
 * @typedef {('integer'|'text'|'boolean'|'date')} KeyType
 */
/**
 * Type definition for a KeyType object
 * @typedef {{table: string, property: string}} KeyReference
 */
/**
 * Type definition for a KeyType object
 * @typedef {(number|boolean|string|'now')} KeyDefault
 */
/**
 * Type definition for a KeyOptions object
 * @typedef {{unique?: boolean, notNull?: boolean, primary?: boolean}} KeyOptions
 */
/**
 * Type definition for a ParsedKey object
 * @typedef {{query: string, reference: string}} ParsedKey
 */
/**
 * Type definition for a TableOptions object
 * @typedef {('createIfNotAlreadyExisting'|'createEvenIfAlreadyExisting')} TableOption
 */

/**
 * Static class that help to access/interact/talk to the database
 */
class DatabaseApi {
  /**
   * Create a database table
   * @param {string} name
   * @param {Key} primaryKey
   * @param {Key[]} nonNullKeys
   * @param {Key[]} nullKeys
   * @param {TableOption} option
   * @returns {Promise}
   * @example DatabaseApi.createTable('tableName', {name: 'id', type: 'integer', option: {notNull: true}}, [],[], 'createIfNotAlreadyExisting')
   * .then(() => console.log('successful'))
   * .catch(console.error)
   */
  static createTable (name, primaryKey, nonNullKeys = [], nullKeys = [], option = null) {
    return DatabaseQueries.postRequest(DatabaseParser.createTableQuery(name, primaryKey, nonNullKeys, nullKeys, option))
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
    return DatabaseQueries.postRequest('INSERT INTO account(id, password_hash, password_salt) VALUES(?,?,?)', [name, hashAndSalt.hash, hashAndSalt.salt])
  }
}

// export the static class to another script
module.exports = DatabaseApi
