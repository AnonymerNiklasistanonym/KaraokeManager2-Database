#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * Helping functions for all server/routing scripts
 */

const { IncomingMessage, OutgoingMessage } = require('http')

/**
 * Contains miscellaneous methods for ease of use of the server
 */
class ServerHelper {
  /**
   * Returns function for logging requests
   * @returns {function(*,*,function):void}
   * @example const express = require('express')
   * const ServerHelper = require('./server_helper')
   *
   * const app = express()
   * // use a logger for *all* paths/connections
   * app.all('/*', ServerHelper.requestLogger)
   */
  static get requestLogger () {
    return (req, res, next) => {
      const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`
      if (req instanceof IncomingMessage && res instanceof OutgoingMessage) {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        console.log('Time:', Date.now(), req.method, fullUrl, 'client:', ip)
        next()
      } else {
        throw Error('Something is wrong with the request logger [ServerHelper]')
      }
    }
  }
  /**
   * Returns function for handling server errors
   * @returns {function({code: string, port: number}):void}
   * @example const express = require('express')
   * const http = require('http')
   * const ServerHelper = require('./server_helper')
   *
   * const app = express()
   * const serverHttp = http.createServer(app).on('error', ServerHelper.serverErrorListener)
   */
  static get serverErrorListener () {
    return error => {
      if (error.code === 'EADDRINUSE') {
        console.error(`The server port ${error.port} is already being used! ` +
          'Change port or close the instance that is using this port currently.')
        throw error
      } else {
        console.error(error)
      }
    }
  }
  /**
   * Lists all express routes
   * https://github.com/expressjs/express/issues/3308#issuecomment-300957572
   *
   * @param {*} app (express())
   * @example const express = require('express')
   * // optional: import external router
   * const externalRouteExample = require('./routeExample')
   *
   * const app = express()
   * app.get('/example', (req, res) => res.status(200))
   * app.use('/', externalRouteExample)
   *
   * // print all registered routes
   * printAllServerRoutes(app)
   */
  static printAllServerRoutes (app) {
    const split = thing => {
      if (typeof thing === 'string') {
        return thing.split('/')
      } else if (thing.fast_slash) {
        return ''
      } else {
        const match = thing.toString()
          .replace('\\/?', '')
          .replace('(?=\\/|$)', '$')
          .match(/^\/\^((?:\\[.*+?^${}()|[\]\\/]|[^.*+?^${}()|[\]\\/])*)\$\//)
        if (match) {
          return match[1]
            .replace(/\\(.)/g, '$1')
            .split('/')
        } else {
          return `<complex:${thing.toString()}>`
        }
      }
    }
    const print = (path, layer) => {
      if (layer.route) {
        layer.route.stack.forEach(print.bind(undefined, path.concat(split(layer.route.path))))
      } else if (layer.name === 'router' && layer.handle.stack) {
        layer.handle.stack.forEach(print.bind(undefined, path.concat(split(layer.regexp))))
      } else if (layer.method) {
        console.log('%s /%s',
          layer.method.toUpperCase(),
          path.concat(split(layer.regexp))
            .filter(Boolean)
            .join('/'))
      }
    }
    app._router.stack.forEach(print.bind(undefined, []))
  }
}

module.exports = ServerHelper
