#!/usr/bin/env node
'use strict'

const socketIo = require('socket.io')

/**
 * Express http server
 */
const server = require('./server').Server
/**
 * SocketIO.Server
 */
const io = socketIo(server)

/*
 * React to socket connections
 */
io.on('connection', (clientSocket) => {
  console.log('Client connected...', clientSocket.client.id)

  clientSocket.on('join', (data) => {
    console.log('client sent data -', clientSocket.client.id, '\n\t', data)
  })
})

module.exports = { Server: server, SocketIO$Server: io }
