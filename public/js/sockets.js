/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * Socket helper class.
 */

/**
 * Socket
 */
let socket

// When everything is loaded do the following
document.addEventListener('DOMContentLoaded', () => {
  // Register socket when socket.io script is loaded
  socket = io.connect('/')
})

/**
 * Manages the socket connection to the server
 */
class SocketHelper {
  /**
   * Send a message via sockets
   * @param {string} channel Channel
   * @param {*} message Message to send over channel
   * @returns {Promise<void>}
   */
  static sendMessage (channel, message) {
    return new Promise(resolve => {
      socket.emit(channel, message)
      resolve()
    })
  }
  /**
   * Send a message via sockets
   * @param {string} channel Channel
   * @param {function} callback Callback for incoming messages
   */
  static registerChannelListener (channel, callback) {
    socket.on(channel, message => {
      callback(message)
    })
  }
}
