#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * Database api classes
 */

const DatabaseApiAddSong = require('./internal/databaseInternalAddSong')
const DatabaseApiDeleteSong = require('./internal/databaseInternalDeleteSong')
const DatabaseApiGetSong = require('./internal/databaseInternalGetSong')
const DatabaseApiGetSongAdvanced = require('./databaseApiSong')

const DatabaseApiAddArtist = require('./internal/databaseInternalAddArtist')
const DatabaseApiDeleteArtist = require('./internal/databaseInternalDeleteArtist')
const DatabaseApiGetArtist = require('./internal/databaseInternalGetArtist')

const DatabaseApiAddAccount = require('./internal/databaseInternalAddAccount')
const DatabaseApiDeleteAccount = require('./internal/databaseInternalDeleteAccount')
const DatabaseApiGetAccount = require('./internal/databaseInternalGetAccount')

module.exports = {
  DatabaseApiAddAccount,
  DatabaseApiAddArtist,
  DatabaseApiAddSong,
  DatabaseApiDeleteAccount,
  DatabaseApiDeleteArtist,
  DatabaseApiDeleteSong,
  DatabaseApiGetAccount,
  DatabaseApiGetArtist,
  DatabaseApiGetSong,
  DatabaseApiGetSongAdvanced
}
