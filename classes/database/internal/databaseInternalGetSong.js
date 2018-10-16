#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * TODO
 */

const DatabaseQueries = require('../databaseQueries').DatabaseQueries

class DatabaseInternalApiGetSong {
  /**
   * Get song
   * @param {number} songId Unique song id
   * @returns {Promise<import('./databaseInternalTypes').IGetSong>} Song object
   */
  static getSong (songId) {
    // tslint:disable-next-line:prefer-template
    const query = 'SELECT ' +
      ['author', 'date', 'description', 'id',
        'name', 'release_date', 'server_file_path'
      ].join(', ') +
      ' FROM song WHERE song.id = ?;'

    return new Promise((resolve, reject) =>
      DatabaseQueries.getEachRequest(query, [songId])
        .then(resolve)
        .catch(reject))
  }
  /**
   * Get song list
   * @param {number} limit Song entry limit
   * @param {number} page Page number
   * @returns {Promise<import('./databaseInternalTypes').IGetSong[]>} Song list
   */
  static getSongs (limit = 4, page = 1) {
    // tslint:disable-next-line:prefer-template
    const query = 'SELECT ' +
      ['song.author', 'song.date', 'song.description', 'song.id',
        'song.name', 'song.release_date', 'song.server_file_path'
      ].join(', ') +
      ' FROM song LIMIT ? OFFSET ?;'

    return new Promise((resolve, reject) =>
      DatabaseQueries.getAllRequest(query, [limit, limit * page - limit])
        .then(resolve)
        .catch(reject))
  }
  /**
   * Get song link list
   * @param {number} songId unique song id
   * @returns {Promise<import('./databaseInternalTypes').IGetSongLink[]>} Song links object array
   */
  static getSongLinks (songId) {
    // tslint:disable-next-line:prefer-template
    const query = 'SELECT ' +
      ['song_link.author', 'song_link.date', 'song_link.description',
        'song_link.id', 'song_link.url'].join(', ') +
      ' FROM song_tag_song_link ' +
      ' INNER JOIN song_link ON song_tag_song_link.song_link_id = song_link.id' +
      ' WHERE song_tag_song_link.song_id = ?;'

    return new Promise((resolve, reject) =>
      DatabaseQueries.getAllRequest(query, [songId])
        .then(resolve)
        .catch(reject))
  }
  /**
   * Get song artist
   * @param {number} songId unique song id
   * @returns {Promise<import('./databaseInternalTypes').IGetSongArtist[]>} Song artist object array
   */
  static getSongArtists (songId) {
    // tslint:disable-next-line:prefer-template
    const query = 'SELECT ' +
      ['artist.author', 'artist.date', 'artist.id', 'artist.name',
        'artist.server_file_path_artist_picture'].join(', ') +
        ' FROM song_tag_artist' +
        ' INNER JOIN artist ON song_tag_artist.artist_id = artist.id ' +
        ' WHERE song_tag_artist.song_id = ?;'

    return new Promise((resolve, reject) =>
      DatabaseQueries.getAllRequest(query, [songId])
        .then(resolve)
        .catch(reject))
  }
  /**
   * Get song content types
   * @param {number} songId unique song id
   * @returns {Promise<import('./databaseInternalTypes').IGetSongContentType[]>} Song content type object array
   */
  static getSongContentTypes (songId) {
    // tslint:disable-next-line:prefer-template
    const query = 'SELECT ' +
      ['song_content_type.author', 'song_content_type.date',
        'song_content_type.id', 'song_content_type.name',
        'song_content_type.description'].join(', ') +
       ' FROM song_tag_song_content_type' +
       ' INNER JOIN song_content_type ON ' +
       'song_tag_song_content_type.song_content_type_id = song_content_type.id' +
       ' WHERE song_tag_song_content_type.song_id = ?;'

    return new Promise((resolve, reject) =>
      DatabaseQueries.getAllRequest(query, [songId])
        .then(resolve)
        .catch(reject))
  }
  /**
   * Get song content languages
   * @param {number} songId unique song id
   * @returns {Promise<import('./databaseInternalTypes').IGetSongContentLanguage[]>} Song content language object array
   */
  static getSongContentLanguages (songId) {
    // tslint:disable-next-line:prefer-template
    const query = 'SELECT ' +
      ['song_content_language.id', 'song_content_language.name',
        'song_content_language.author', 'song_content_language.date',
        'song_content_language.description'].join(', ') +
      ' FROM song_tag_song_content_language' +
      ' INNER JOIN song_content_language ON ' +
      'song_tag_song_content_language.song_content_language_id = song_content_language.id' +
      ' WHERE song_tag_song_content_language.song_id = ?;'

    return new Promise((resolve, reject) =>
      DatabaseQueries.getAllRequest(query, [songId])
        .then(resolve)
        .catch(reject))
  }
  /**
   * Get song list pages
   * @param {number} limit Song entry limit
   * @returns {Promise<number>} Number of pages
   */
  static getSongPages (limit = 4) {
    return new Promise((resolve, reject) => {
      DatabaseQueries.getEachRequest('SELECT count(*) AS count FROM song;')
        .then(result => {
          resolve(Math.round(result.count / limit))
        })
        .catch(reject)
    })
  }
  /**
   * Get song object + all connected information
   * @param {import('./databaseInternalTypes').IGetSong} song Song object
   * @returns {Promise<import('./databaseInternalTypes').IGetSongFinal>} Song object + additional information
   */
  static getSongInformation (song) {
    return new Promise((resolve, reject) => Promise.all([
      DatabaseInternalApiGetSong.getSongArtists(song.id),
      DatabaseInternalApiGetSong.getSongContentLanguages(song.id),
      DatabaseInternalApiGetSong.getSongContentTypes(song.id),
      DatabaseInternalApiGetSong.getSongLinks(song.id)
    ])
      .then(result => ({
        ...song,
        artists: result[0],
        contentLanguages: result[1],
        contentTypes: result[2],
        links: result[3]
      }))
      .then(resolve)
      .catch(reject))
  }
  /**
   * Get if a song exists
   * @param {number} id Unique song id
   * @returns {Promise<boolean>} Exists
   */
  static getSongExists (id) {
    return DatabaseQueries.getExists('song', 'id', id)
  }
}

module.exports = DatabaseInternalApiGetSong
