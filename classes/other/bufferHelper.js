#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * Handle anything _complicated_ with buffers
 */

const fs = require('fs').promises

/**
 * Buffer conversion methods
 */
class BufferHelper {
  /**
   * Convert array buffer to Base64 String
   * @param {string} base64Type Base64 type
   * @param {number[]} arrayBuffer Array buffer
   * @returns {string} Base64 string
   */
  static convertArrayBufferToBase64String (base64Type, arrayBuffer) {
    const base64DataString = arrayBuffer
      .map(a => String.fromCharCode(a))
      .join('')

    return `data:${base64Type};base64,${this.bota(base64DataString)}`
  }
  /**
   * Write a buffer to a file
   * @param {Buffer} buffer Buffer
   * @param {string} fileName File name
   * @param {string} fileType File type/extension
   * @returns {Promise<void>}
   */
  static writeBufferToFile (buffer, fileName, fileType = '') {
    return fs.writeFile(fileName + (fileType === '' ? '' : '.' + fileType), buffer)
  }
  /**
   * Convert base64 string to file [writeable] buffer
   * @param {string} base64String Base64 encoded string
   * @returns {{type: string, buffer: Buffer}} File buffer
   */
  static convertBase64StringToBuffer (base64String) {
    const matches = base64String.match(/^data:([A-Za-z-+\\/]+);base64,(.+)$/)
    if (matches.length !== 3) {
      throw Error('Invalid input string')
    } else {
      return {
        buffer: Buffer.alloc(matches[2].length, matches[2], 'base64'),
        type: matches[1]
      }
    }
  }
  /**
   * Encodes a string or anything else in a base64 encoded string (equivalent to `window.btoa(str)`)
   * @param {*} input Input
   * @returns {string} Base64 encoded string
   */
  static bota (input) {
    return ((input instanceof Buffer) ? input : Buffer.from(input.toString(), 'binary'))
      .toString('base64')
  }
}

module.exports = BufferHelper
