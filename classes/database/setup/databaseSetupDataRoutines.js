#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * Description:
 * TODO
 */

const DatabaseInternalApiAddAccount = require('../internal/databaseInternalAddAccount')
const DatabaseInternalApiAddSong = require('../internal/databaseInternalAddSong')
const DatabaseInternalApiAddArtist = require('../internal/databaseInternalAddArtist')
const DatabaseApiSong = require('../databaseApiSong')
const DatabaseInternalApiGetAccount = require('../internal/databaseInternalGetAccount')

/**
 * Parse JSON file to JSON object and the to something else with an additional parser class
 */
class DatabaseSetupDataRoutines {
  /**
   * Create an account
   * @param {import('../databaseTypes2').IJsonFileDataAccount} accountObject
   */
  static createAccount (accountObject) {
    return DatabaseInternalApiAddAccount.addAccount(accountObject.id, accountObject.password,
      accountObject.options)
  }
  /**
   * Create an account
   * @param {import('../databaseTypes2').IJsonFileDataArtist} artistObject
   */
  static createArtist (artistObject) {
    // Double check if the author account even exists
    return new Promise((resolve, reject) => DatabaseInternalApiGetAccount.getAccount('root')
      .then(accountObject => {
        let links
        const artistOptions = {}
        if (artistObject.options !== undefined) {
          if (artistObject.options.links !== undefined) {
            links = Promise.all(artistObject.options.links.map(a =>
              DatabaseInternalApiAddArtist.addArtistLink(a.url,
                accountObject.id, a.options)))
          }
          if (artistObject.options.description !== undefined) {
            artistOptions.description = artistObject.options.description
          }
        }
        const artistPromise = DatabaseInternalApiAddArtist.addArtist(
          artistObject.name, accountObject.id, artistOptions)
        Promise.all([links, artistPromise])
          .then(result => {
            let artistTagLinks
            if (result[0] !== undefined) {
              artistTagLinks = Promise.all(result[0]
                .map(a => DatabaseInternalApiAddArtist
                  .addArtistTagArtistLink(result[1].lastID, accountObject.id, a.lastID)))
            }
            Promise.all([artistTagLinks])
              .then(resolve)
              .catch(reject)
          })
          .catch(reject)
      })
      .catch(reject))
  }
  /**
   * Create an account
   * @param {import('../databaseTypes2').IJsonFileDataSongContentType} object
   */
  static createSongContentType (object) {
    return new Promise((resolve, reject) => DatabaseInternalApiGetAccount.getAccount('root')
      .then(accountObject => DatabaseInternalApiAddSong
        .addSongContentType(object.name, accountObject.id, object.options)
        .then(resolve)
        .catch(reject))
      .catch(reject))
  }
  /**
   * Create an account
   * @param {import('../databaseTypes2').IJsonFileDataSongContentLanguage} object
   */
  static createSongContentLanguage (object) {
    return new Promise((resolve, reject) => DatabaseInternalApiGetAccount.getAccount('root')
      .then(accountObject => DatabaseInternalApiAddSong
        .addSongContentLanguage(object.name, accountObject.id, object.options)
        .then(resolve)
        .catch(reject))
      .catch(reject))
  }
  /**
   * Create an account
   * @param {import('../databaseTypes2').IJsonFileDataSong} songObject
   */
  static createSong (songObject) {
    return new Promise((resolve, reject) => DatabaseInternalApiGetAccount.getAccount('root')
      .then(accountObject => {
        let links
        const songOptions = {}
        if (songObject.options !== undefined) {
          if (songObject.options.links !== undefined) {
            links = Promise.all(songObject.options.links.map(a =>
              DatabaseInternalApiAddSong.addSongLink(a.url,
                accountObject.id, a.options)))
          }
          if (songObject.options.description !== undefined) {
            songOptions.options = { description: songObject.options.description }
          }
        }
        const songPromise = DatabaseApiSong.addSong(songObject.name,
          accountObject.id, songObject.server_file_path, songOptions)
        Promise.all([links, songPromise])
          .then(result => {
            let artistTagLinks
            if (result[0] !== undefined) {
              artistTagLinks = Promise.all(result[0]
                .map(a => DatabaseInternalApiAddSong
                  .addSongTagSongLink(result[1].songResult.lastID, accountObject.id, a.lastID)))
            }
            Promise.all([artistTagLinks])
              .then(resolve)
              .catch(reject)
          })
          .catch(reject)
      })
      .catch(reject))
  }
}

module.exports = DatabaseSetupDataRoutines
