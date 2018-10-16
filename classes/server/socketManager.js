#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * Socket interaction helper class and final function
 */

/**
 * Socket helper functions
 */
class SocketManager {
  /**
   * Get if socket connection is 'secure'
   * @param {import('socket.io').Socket} clientSocket Client socket
   */
  static isHttpsSocketConnection (clientSocket) {
    return clientSocket.client.request.socket.encrypted
  }
}

/**
 * Socket method that will be implemented by the socket servers
 * (Externalize anything repetitive to the SocketManager static class)
 * @param {import('socket.io').Socket} clientSocket Socket.io client socket
 */
const socketManagerFunction = clientSocket => {
  const identifier = SocketManager.isHttpsSocketConnection(clientSocket) ? 'Socket Secured' : 'Socket Unsecured'

  console.log(identifier + ' > Client connected...', clientSocket.client.id)

  clientSocket.on('join', data => {
    console.log(identifier + ' > client sent data -', clientSocket.client.id, '\n\t', data)
  })
}

module.exports = socketManagerFunction
