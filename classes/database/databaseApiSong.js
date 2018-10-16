#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * Database api class around songs
 */

const DatabaseInternalApiGetSong = require('./internal/databaseInternalGetSong')
const DatabaseInternalApiAddSong = require('./internal/databaseInternalAddSong')

/**
 * Combines the basic internal song `get` and `add` API for more useful methods
 */
class DatabaseApiSong {
  /**
   * Add a song
   * @param {string} name Song name
   * @param {string} authorId Author id of song entry
   * @param {string} serverFilePath Server file path song file
   * @param {import('./databaseTypes2').IAddSongOptionsMore} [options] Song options
   * @returns {Promise<import('./databaseTypes2').IAddSongResult>}
   */
  static addSong (name, authorId, serverFilePath, options) {
    const optionsParameter = options !== undefined ? options.options : undefined

    return new Promise((resolve, reject) => DatabaseInternalApiAddSong
      .addSong(name, authorId, serverFilePath, optionsParameter)
      // tslint:disable-next-line:cyclomatic-complexity
      .then(songResult => {
        const songId = songResult.lastID
        let promSongContentLanguages
        let promSongContentTypes
        let promSongLinks

        if (songId === undefined) {
          reject(Error('Song id was undefined!'))

          return undefined
        }

        const optionsTagsNotUndefined = options !== undefined && options.tags !== undefined

        if (optionsTagsNotUndefined && options.tags.songContentLanguages !== undefined) {
          promSongContentLanguages = Promise.all(options.tags.songContentLanguages.map(id =>
            DatabaseInternalApiAddSong.addSongTagContentLanguage(songId, authorId, id)))
        } else {
          promSongContentLanguages = Promise.all([
            DatabaseInternalApiAddSong.addSongTagContentLanguage(songId, authorId, 1)])
        }
        if (optionsTagsNotUndefined && options.tags.songContentTypes !== undefined) {
          promSongContentTypes = Promise.all(options.tags.songContentTypes.map(id =>
            DatabaseInternalApiAddSong.addSongTagContentType(songId, authorId, id)))
        } else {
          promSongContentTypes = Promise.all([
            DatabaseInternalApiAddSong.addSongTagContentType(songId, authorId, 1)])
        }
        if (optionsTagsNotUndefined && options.tags.songLinks !== undefined) {
          promSongLinks = Promise.all(options.tags.songLinks.map(id =>
            DatabaseInternalApiAddSong.addSongTagSongLink(songId, authorId, id)))
        }

        Promise.all([promSongContentLanguages, promSongContentTypes, promSongLinks])
          .then(results => {
            resolve({
              songContentLanguageResults: results[0],
              songContentTypeResults: results[1],
              songLinkResults: results[2],
              songResult
            })
          })
          .catch(reject)
      })
      .catch(reject))
  }
  /**
   * Get song list
   * @param {number} [limit] Maximum song entries
   * @param {number} [page] Page number (respective to the limit)
   * @returns {Promise<import('./databaseTypes2').IGetSongHbs[]>} Song list
   */
  static getSongList (limit, page) {
    return new Promise((resolve, reject) =>
      DatabaseInternalApiGetSong.getSongs(limit, page)
        .then(songs => Promise.all(songs.map(DatabaseInternalApiGetSong.getSongInformation)))
        .then(resolve)
        .catch(reject))
  }
  /**
   * Get song
   * @param {number} songId Unique song id
   * @returns {Promise<import('./databaseTypes2').IGetSongHbs>} Song
   */
  static getSong (songId) {
    return new Promise((resolve, reject) =>
      DatabaseInternalApiGetSong.getSong(songId)
        .then(DatabaseInternalApiGetSong.getSongInformation)
        .then(resolve)
        .catch(reject))
  }
  /**
   * Convert songs to be readable in handlebars documents
   * @param {import('./databaseTypes2').IGetSong} song
   * @returns {import('./databaseTypes2').IGetSongHbs} Song
   */
  static handlebarsSongConversion (song) {
    if ((song.contentTypes === null || song.contentTypes === undefined) ||
      song.contentTypes.length === 0) {
      throw Error('Song content type not defined!')
    }
    const isVideo = song.contentTypes.find(a => a.name === 'Video') !== undefined
    const isAudio = song.contentTypes.find(a => a.name === 'Audio') !== undefined
    const isUnknown = song.contentTypes.find(a => a.name === 'Unknown') !== undefined

    return { ...song, isVideo, isAudio, isUnknown }
  }
}

module.exports = DatabaseApiSong
