#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * Socket server binding to *normal* express http/https servers.
 * Also the addition of a custom socket manager function to each of the socket servers.
 */

const socketIo = require('socket.io')
const socketManager = require('./socketManager')
const { serverHttp, serverHttps } = require('./server')

// Make the express http/https servers to socketIo servers
const ioHttp = socketIo(serverHttp)
const ioHttps = socketIo(serverHttps)

// React to socket connections
ioHttp.on('connection', socketManager)
ioHttps.on('connection', socketManager)

module.exports = { serverHttp, serverHttps }
