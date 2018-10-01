#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * Socket server, the initial binding
 */

const socketIo = require('socket.io')

/**
 * Express server
 */
const serverHttp = require('./server').ServerHttp
/**
 * Express https server
 */
const serverHttps = require('./server').ServerHttps
/**
 * SocketIO.Server
 */
const ioHttp = socketIo(serverHttp)
const ioHttps = socketIo(serverHttps)

const socketMethod = clientSocket => {
  let identifier = 'Socket Unsecured'
  if (clientSocket.client.request.socket.encrypted) {
    identifier = 'Socket Secured'
  }
  console.log(identifier + ' > Client connected...', clientSocket.client.id)

  clientSocket.on('join', data => {
    console.log(identifier + ' > client sent data -', clientSocket.client.id, '\n\t', data)
  })
}

/*
 * React to socket connections
 */
ioHttp.on('connection', socketMethod)
ioHttps.on('connection', socketMethod)

module.exports = { serverHttp, serverHttps, ServerHttpSocketIo: ioHttp, ServerHttpsSocketIo: ioHttps }
