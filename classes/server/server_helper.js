#!/usr/bin/env node
'use strict'

/*
 * This file contains:
 * Helping functions for all server/routing scripts
 */

const { IncomingMessage, OutgoingMessage } = require('http')

/**
 * Documentation helper methods
 */
class ServerHelper {
  /**
   * Returns function for logging requests
   * @returns {function(*,*,function)}
   */
  static get requestLogger () {
    return (req, res, next) => {
      const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
      if (req instanceof IncomingMessage && res instanceof OutgoingMessage) {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        console.log('Time:', Date.now(), req.method, fullUrl, 'client:', ip)
        next()
      } else {
        throw Error('Something is wrong with the request logger [ServerHelper]')
      }
    }
  }
}

module.exports = { ServerHelper: ServerHelper }
