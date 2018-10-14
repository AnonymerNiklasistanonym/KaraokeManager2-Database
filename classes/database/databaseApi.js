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
   * Get user account information fro navBar
   * @param {string} name Unique account name
   * @returns {Promise<import('./databaseTypes').IGetAccountObjectNavBar>}
   * @example DatabaseApi.getAccountNavBar('unique account name')
   *   .then(console.log)
   *   .catch(console.error)
   */
  static getAccountNavBar (name) {
    return DatabaseQueries.getEachRequest('SELECT id, is_admin, is_private, ' +
      'name, server_file_path_profile_picture, server_file_path_bg_picture ' +
      'FROM account WHERE id=?;', [name])
  }
  /**
   * Create a song
   * @param {string} name Song name
   * @param {string} authorId Author id of song entry
   * @param {string} serverFilePath Server file path song file
   * @param {import('./databaseTypes').ICreateSongOptions} [options] Song options
   * @example DatabaseApi.createSong('song name', 'artist id')
   *   .then(() => { console.log('successful') })
   *   .catch(console.error)
   */
  static createSong (name, authorId, serverFilePath, options) {
    // tslint:disable-next-line:cyclomatic-complexity
    const columns = ['name', 'author', 'server_file_path']
    const data = [name, authorId, serverFilePath]

    if (options !== undefined) {
      if (options.description !== undefined) {
        columns.push('description')
        data.push(options.description)
      }
      if (options.link_spotify !== undefined) {
        columns.push('link_spotify')
        data.push(options.link_spotify)
      }
      if (options.link_youtube !== undefined) {
        columns.push('link_youtube')
        data.push(options.link_youtube)
      }
      if (options.lyrics !== undefined) {
        columns.push('lyrics')
        data.push(options.lyrics)
      }
      if (options.release_date !== undefined) {
        columns.push('release_date')
        // @ts-ignore
        data.push(options.release_date)
      }
      if (options.song_content_language !== undefined) {
        columns.push('song_content_language')
        data.push(options.song_content_language)
      }
      if (options.song_content_type !== undefined) {
        columns.push('song_content_type')
        data.push(options.song_content_type)
      }
    }

    const questionMarks = new Array(columns.length).fill('?')

    return DatabaseQueries.postRequest(
      `INSERT INTO song(${columns.join(',')}) VALUES(${questionMarks.join(',')});`,
      data)
  }
  /**
   * Create an artist
   * @param {string} name Artist name
   * @param {string} authorId Author id of artist entry
   * @param {import('./databaseTypes').ICreateArtistOptions} [options] Artist options
   * @example DatabaseApi.createArtist('artist name', 'artist id')
   *   .then(() => { console.log('successful') })
   *   .catch(console.error)
   */
  static createArtist (name, authorId, options) {
    // tslint:disable-next-line:cyclomatic-complexity
    const columns = ['name', 'author']
    const data = [name, authorId]

    if (options !== undefined) {
      if (options.description !== undefined) {
        columns.push('description')
        data.push(options.description)
      }
      if (options.link_spotify !== undefined) {
        columns.push('link_spotify')
        data.push(options.link_spotify)
      }
      if (options.link_youtube !== undefined) {
        columns.push('link_youtube')
        data.push(options.link_youtube)
      }
      if (options.server_file_path_artist_picture !== undefined) {
        columns.push('server_file_path_artist_picture')
        data.push(options.server_file_path_artist_picture)
      }
    }

    const questionMarks = new Array(columns.length).fill('?')

    return DatabaseQueries.postRequest(
      `INSERT INTO artist(${columns.join(',')}) VALUES(${questionMarks.join(',')});`,
      data)
  }
  /**
   * Create a database table
   * @param {string} name Table name
   * @param {import('./databaseTypes').IKey} primaryKey Primary key of table
   * @param {import('./databaseTypes').IKey[]} nonNullKeys Not null keys of table
   * @param {import('./databaseTypes').IKey[]} nullKeys Null keys of table
   * @param {import('./databaseTypes').TableOption} option Table creation options
   * @returns {Promise}
   * @example DatabaseApi.createTable('tableName',
   *  { name: 'id', type: 'integer', option: { notNull: true } },
   *  [],[], 'createIfNotAlreadyExisting')
   *   .then(() => { console.log('successful') })
   *   .catch(console.error)
   */
  static createTable (name, primaryKey, nonNullKeys = [], nullKeys = [], option) {
    return DatabaseQueries.postRequest(DatabaseParser.createTableQuery(name, primaryKey,
      nonNullKeys, nullKeys, option))
  }
  /**
   * Create user account
   * @param {string} id Unique account name
   * @param {string} password Account password
   * @param {import('./databaseTypes').ICreateAccountOptions} [options] Account options
   * @returns {Promise}
   * @example DatabaseApi.createAccount('unique account name', 'password')
   *   .then(() => { console.log('successful') })
   *   .catch(console.error)
   */
  static createAccount (id, password, options) {
    // tslint:disable-next-line:cyclomatic-complexity
    const hashAndSalt = PasswordHelper.generateHashAndSalt(password)
    const columns = ['id', 'password_hash', 'password_salt',
      'server_file_path_profile_picture', 'server_file_path_bg_picture']
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
  /**
   * Get if a user account exists
   * @param {string} name Unique account name
   * @returns {Promise<boolean>}
   * @example DatabaseApi.getAccountExists('unique account name')
   *   .then(console.log)
   *   .catch(console.error)
   */
  static getAccountExists (name) {
    return new Promise((resolve, reject) => {
      DatabaseQueries.getEachRequest('SELECT EXISTS(SELECT 1 FROM account WHERE id=?) AS existsValue;', [name])
        .then(result => { resolve(result.existsValue === 1) })
        .catch(reject)
    })
  }
  /**
   * Get user account information
   * @param {string} name Unique account name
   * @returns {Promise<import('./databaseTypes').IGetAccountObject>}
   * @example DatabaseApi.getAccount('unique account name')
   *   .then(console.log)
   *   .catch(console.error)
   */
  static getAccount (name) {
    return new Promise((resolve, reject) => {
      // Later add comment count, playlist entries etc.
      DatabaseQueries.getEachRequest('SELECT id, name, is_admin, is_private, is_banned, ' +
      'is_banned_comments, is_banned_entries, server_file_path_profile_picture, status ' +
      'FROM account WHERE id=?;', [name])
        .then(object => {
          if (object.id === undefined) {
            reject(Error('No account was found!'))
          } else {
            resolve({
              id: object.id,
              is_admin: object.is_admin === 1,
              is_banned: object.is_banned === 1,
              is_banned_comments: object.is_banned_comments === 1,
              is_banned_entries: object.is_banned_entries === 1,
              is_private: object.is_private === 1,
              name: object.name,
              server_file_path_profile_picture: object.server_file_path_profile_picture,
              status: object.status
            })
          }
        })
        .catch(reject)
    })
  }
  /**
   * Get song information
   * @param {number} id Unique song id
   * @returns {Promise<import('./databaseTypes').IGetSongObject>}
   * @example DatabaseApi.getAccount('unique account name')
   *   .then(console.log)
   *   .catch(console.error)
   */
  static getSong (id) {
    return new Promise((resolve, reject) => {
      // Later add comment count, playlist entries etc.
      DatabaseQueries.getEachRequest('SELECT id, name, date, author, server_file_path, ' +
      'release_date, description, lyrics, local_file_path ' +
      'song_content_type, song_content_language, link_spotify, link _youtube ' +
      'FROM song WHERE id=?;', [id])
        .then(object => {
          resolve({
            author: object.author,
            date: object.date,
            description: object.description,
            id: object.id,
            link_spotify: object.link_spotify,
            link_youtube: object.link_youtube,
            local_file_path: object.local_file_path,
            lyrics: object.lyrics,
            name: object.name,
            release_date: object.release_date,
            server_file_path: object.server_file_path,
            song_content_language: object.song_content_language,
            song_content_type: object.song_content_type
          })
        })
        .catch(reject)
    })
  }
  /**
   * Get user account credential information
   * @param {string} name Unique account name
   * @returns {Promise<import('./databaseTypes').IGetAccountCredentialsObject>}
   * @example DatabaseApi.getAccountCredentials('unique account name')
   *   .then(console.log)
   *   .catch(console.error)
   */
  static getAccountCredentials (name) {
    return DatabaseQueries.getEachRequest('SELECT password_hash, password_salt ' +
    'FROM account WHERE id=?;', [name])
  }
  /**
   * Authorize user account (check the password)
   * @param {string} name Unique account name
   * @param {string} password Account password
   * @returns {Promise<boolean>}
   * @example DatabaseApi.authorizeAccount('unique account name', 'password')
   *   .then(console.log)
   *   .catch(console.error)
   */
  static authorizeAccount (name, password) {
    return new Promise((resolve, reject) => {
      this.getAccountCredentials(name)
        .then(accountHashAndSalt => {
          resolve(PasswordHelper.checkPassword(password, accountHashAndSalt.password_salt,
            accountHashAndSalt.password_hash))
        })
        .catch(reject)
    })
  }
  /**
   * Get matching artist ids to artist name
   * @param {string} name Artist name
   * @returns {Promise<number[]>}
   * @example DatabaseApi.getArtists('artist name')
   *   .then(console.log)
   *   .catch(console.error)
   */
  static getArtists (name) {
    return new Promise((resolve, reject) => DatabaseQueries
      .getAllRequest('SELECT id FROM artist WHERE name=?;', [name])
      .then(result => result.map(a => a.id))
      .then(resolve)
      .catch(reject))
  }
  /**
   * Get if an artist exists
   * @param {number} id Unique artist id
   * @returns {Promise<boolean>}
   * @example const uniqueArtistId = 1
   * DatabaseApi.getArtistExists(uniqueArtistId)
   *   .then(console.log)
   *   .catch(console.error)
   */
  static getArtistExists (id) {
    return new Promise((resolve, reject) => {
      DatabaseQueries.getEachRequest('SELECT EXISTS(SELECT 1 FROM artist WHERE id=?) AS existsValue;', [id])
        .then(result => { resolve(result.existsValue === 1) })
        .catch(reject)
    })
  }
  /**
   * Get artist information
   * @param {number} id Unique artist id
   * @returns {Promise<import('./databaseTypes').IGetArtistObject>}
   * @example const uniqueArtistId = 1
   * DatabaseApi.getArtist(uniqueArtistId)
   *   .then(console.log)
   *   .catch(console.error)
   */
  static getArtist (id) {
    return new Promise((resolve, reject) => {
      // Later add comment count, playlist entries etc.
      DatabaseQueries.getEachRequest('SELECT id, name, date, author, description, ' +
      'server_file_path_artist_picture, link_spotify, link_youtube ' +
      'FROM artist WHERE id=?;', [id])
        .then(object => {
          resolve({
            author: object.author,
            date: object.date,
            description: object.description,
            id: object.id,
            link_spotify: object.link_spotify,
            link_youtube: object.link_youtube,
            name: object.name,
            server_file_path_artist_picture: object.server_file_path_artist_picture
          })
        })
        .catch(reject)
    })
  }
  /**
   * Add type of content
   * @param {import('./databaseTypes').IGetSongObjectDatabase3} object
   * @returns {import('./databaseTypes').IGetSongObjectDatabase}
   */
  static addIsTypeOfContent (object) {
    if (object.songContentTypes === null || object.songContentTypes === undefined) {
      throw Error('Content type not defined!')
    }
    const isVideo = object.songContentTypes.find(a => a.name === 'Video') !== undefined
    const isAudio = object.songContentTypes.find(a => a.name === 'Audio') !== undefined
    const isUnknown = object.songContentTypes.find(a => a.name === 'Unknown') !== undefined

    return { ...object, isVideo, isAudio, isUnknown }
  }
  /**
   * Clean database song results
   * @param {import('./databaseTypes').IGetSongObjectDatabase1} object
   * @returns {import('./databaseTypes').IGetSongObjectDatabase2}
   */
  static cleanSongResultsExternalizeSubObjects (object) {
    return {
      artist: {
        author: object.artistAuthor,
        date: object.artistDate,
        description: object.artistDescription,
        id: object.artistId,
        linkSpotify: object.artistLinkSpotify,
        linkYouTube: object.artistLinkYouTube,
        name: object.artistName,
        serverFilePathArtistPicture: object.artistServerFilePathArtistPicture
      },
      author: object.songAuthor,
      contentLanguage: object.songContentLanguage,
      contentType: object.songContentType,
      date: object.songDate,
      description: object.songDescription,
      id: object.songId,
      linkSpotify: object.songLinkSpotify,
      linkYouTube: object.songLinkYouTube,
      name: object.songName,
      releaseDate: object.songReleaseDate,
      serverFilePath: object.songServerFilePath,
      songContentType: {
        author: object.songContentTypeAuthor,
        date: object.songContentTypeDate,
        description: object.songContentTypeDescription,
        id: object.songContentTypeId,
        name: object.songContentTypeName
      }
    }
  }
  /**
   * Clean database song results
   * @param {import('./databaseTypes').IGetSongObjectDatabase2[]} objectArray
   * @returns {import('./databaseTypes').IGetSongObjectDatabase3[]}
   */
  static cleanSongResultsMergeArtists (objectArray) {
    // Push all results to a set to get the unique songs
    const uniqueSongIds = new Set()
    objectArray.forEach(element => { uniqueSongIds.add(element.id) })
    const uniqueArtistIds = new Set()
    objectArray.forEach(element => { uniqueArtistIds.add(element.artist.id) })
    const uniqueSongContentTypeIds = new Set()
    objectArray.forEach(element => { uniqueSongContentTypeIds.add(element.songContentType.id) })

    const uniqueArtists = Array.from(uniqueArtistIds)
      .map(uniqueArtistId => objectArray.find(song => song.artist.id === uniqueArtistId))
    const uniqueSongContentTypes = Array.from(uniqueSongContentTypeIds)
      .map(uniqueArtistId => objectArray.find(song => song.songContentType.id === uniqueArtistId))

    // Add song information and artists
    return Array.from(uniqueSongIds)
      .map(uniqueSongId => {
        // Get song information
        const songInfo = objectArray.find(song => song.id === uniqueSongId)
        // Create new artists element that has all artists in it
        const artists = uniqueArtists
          .filter(song => song.id === uniqueSongId)
          .map(song => song.artist)
        // Create new song content types element that has all content types in it
        const songContentTypes = uniqueSongContentTypes
          .filter(song => song.id === uniqueSongId)
          .map(song => song.songContentType)

        return { ...songInfo, artists, songContentTypes }
      })
  }
  /**
   * Get song list
   * @param {number} page Page number
   * @param {number} limit Song entry limit
   * @param {string} [searchQuery] Search query
   * @returns {Promise<import('./databaseTypes').IGetSongObjectDatabase[]>}
   */
  static getSongs (page = 0, limit = 4, searchQuery) {
    let query = 'SELECT '
    query += [
      'song.author AS songAuthor', 'song.song_content_language AS songContentLanguage',
      'song.song_content_type AS songContentType', 'song.date AS songDate',
      'song.description AS songDescription', 'song.id AS songId',
      'song.link_spotify AS songLinkSpotify', 'song.link_youtube AS songLinkYouTube',
      'song.name AS songName', 'song.release_date AS songReleaseDate',
      'song.server_file_path AS songServerFilePath', ''
    ].join(', ')
    query += [
      'artist.author AS artistAuthor', 'artist.date AS artistDate',
      'artist.description AS artistDescription', 'artist.id AS artistId',
      'artist.link_spotify AS artistLinkSpotify', 'artist.link_youtube AS artistLinkYouTube',
      'artist.name AS artistName',
      'artist.server_file_path_artist_picture AS artistServerFilePathArtistPicture', ''
    ].join(', ')
    query += [
      'song_content_type.author AS songContentTypeAuthor', 'song_content_type.date AS songContentTypeDate',
      'song_content_type.id AS songContentTypeId', 'song_content_type.name AS songContentTypeName',
      'song_content_type.description AS songContentTypeDescription', ''
    ].join(', ')
    query += '* FROM song '
    const data = []
    if (searchQuery !== undefined) {
      query += 'WHERE song LIKE ? '
      data.push(searchQuery)
    }
    data.push(limit, limit * page)

    // Inner joins to get song content type, artists
    query += 'INNER JOIN song_content_type ON song.song_content_type = song_content_type.id '
    query += 'INNER JOIN song_tag_artist ON song.id = song_tag_artist.song '
    query += 'INNER JOIN artist ON song_tag_artist.artist = artist.id '

    // The result will now be a row for each song/artist combination and all data is one object
    // This means we need to tidy things up to get a cleaner result with arrays and such things
    return new Promise((resolve, reject) =>
      DatabaseQueries.getAllRequest(query + 'LIMIT ? OFFSET ?;', data)
        // Externalize artist object from song object
        .then(songs => songs.map(this.cleanSongResultsExternalizeSubObjects))
        // Merge artists to the same song
        .then(songs => this.cleanSongResultsMergeArtists(songs))
        // At last add handlebars medium content type Info
        .then(songs => songs.map(this.addIsTypeOfContent))
        .then(resolve)
        .catch(reject))
  }
  /**
   * Get song list pages
   * @param {number} limit Song entry limit
   * @param {string} [searchQuery] Search query
   * @returns {Promise<number>}
   */
  static getSongPages (limit = 4, searchQuery) {
    return new Promise((resolve, reject) => {
      let query = 'SELECT count(*) AS count FROM song'
      const data = []
      if (searchQuery !== undefined) {
        query += ' WHERE song LIKE ?'
        data.push(searchQuery)
      }
      data.push(searchQuery)
      DatabaseQueries.getEachRequest(query + ';', data)
        .then(result => { resolve(Math.round(result.count / limit)) })
        .catch(reject)
    })
  }
  /**
   * Delete a song from the database
   * @param {number} id Song id
   * @returns {Promise}
   */
  static deleteSong (id) {
    return DatabaseQueries.postRequest('DELETE FROM song WHERE id=?;', [id])
  }
  /**
   * Delete an account from the database
   * @param {string} id Account id
   * @returns {Promise}
   */
  static deleteAccount (id) {
    return DatabaseQueries.postRequest('DELETE FROM account WHERE id=?;', [id])
  }
  /**
   * Delete an artist from the database
   * @param {number} id Artist id
   * @returns {Promise}
   */
  static deleteArtist (id) {
    return DatabaseQueries.postRequest('DELETE FROM artist WHERE id=?;', [id])
  }
}

module.exports = DatabaseApi
