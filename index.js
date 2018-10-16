#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * Main method of app/program
 * - setup server
 *    - create tables
 *    - create default data (admin account)
 * - start server
 *    - server websites/files
 *    - interactive
 */

const DatabaseApiSong = require('./classes/database/databaseApiSong')
const DatabaseInternalApiGetArtist = require('./classes/database/internal/databaseInternalGetArtist')

const DatabaseSetup = require('./classes/database/setup/databaseSetup')

/**
 * Express http/https socket-io server
 */
const { serverHttp, serverHttps } = require('./classes/server/socketServer')

// Start server
const httpPort = 8080
const httpsPort = 8443

serverHttp.listen(httpPort, () => { console.log(`Example app listening on -> http://localhost:${httpPort}`) })
serverHttps.listen(httpsPort, () => { console.log(`Example app listening on -> https://localhost:${httpsPort}`) })

DatabaseSetup.createEverything()
  .then(() => {
    console.log('Table setup completed')
    DatabaseApiSong.getSongList(5, 1)
      .then(a => { console.log('getSongList [page: 1]', a) })
      .catch(console.error)
    DatabaseApiSong.getSongList(5, 2)
      .then(a => { console.log('getSongList [page: 2]', a) })
      .catch(console.error)
    DatabaseInternalApiGetArtist.getArtist(1).then(a => { console.log('getArtist ', a) })
      .catch(console.error)
  })
  .catch(console.error)
