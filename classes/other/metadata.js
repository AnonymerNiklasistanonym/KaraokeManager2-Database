'use strict'

const jsmediatags = require('jsmediatags')
const fs = require('fs').promises
const btoa = require('btoa')

/**
 * Music cover image helper methods
 */
class MetadataMusicFileHelper {
  /**
   * @param {string} filePath
   * @returns {Promise<{base64Type: string, arrayBuffer: number[]}>}
   */
  static getPictureArrayBuffer (filePath) {
    // @ts-ignore
    return new Promise((resolve, reject) => new jsmediatags.Reader(filePath).setTagsToRead(['picture']).read({
      onSuccess: tag => resolve({ base64Type: tag.tags.picture.format, arrayBuffer: tag.tags.picture.data }),
      onError: reject
    }))
  }
}

/**
 * Buffer conversion methods
 */
class BufferUtilHelper {
  /**
   * @param {string} base64Type
   * @param {number[]} arrayBuffer
   * @returns {string}
   */
  static convertArrayBufferToBase64String (base64Type, arrayBuffer) {
    const base64DataString = arrayBuffer.map(a => String.fromCharCode(a)).join('')
    // @ts-ignore
    return 'data:' + base64Type + ';base64,' + btoa(base64DataString)
  }
  /**
   * @param {Buffer} buffer
   * @param {string} fileName
   * @param {string} fileType
   * @returns {Promise}
   */
  static writeBufferToFile (buffer, fileName, fileType = '') {
    return fs.writeFile(fileName + (fileType === '' ? '' : '.' + fileType), buffer)
  }
  /**
   * @param {string} base64String
   * @returns {{type: string, buffer: Buffer}} file buffer
   */
  static convertBase64StringToBuffer (base64String) {
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/) // eslint-disable-line no-useless-escape
    if (matches.length !== 3) {
      throw new Error('Invalid input string')
    } else {
      return {
        type: matches[1],
        buffer: Buffer.alloc(matches[2].length, matches[2], 'base64')
      }
    }
  }
}

/**
 * Metadata helper methods
 */
class MetadataHelper {
  /**
   * @param {string} filePath Path to file
   * @returns {Promise<void>} Resolves when image was extracted to a file with the same name
   */
  static extractCoverImageFromAudioFile (filePath) {
    return new Promise((resolve, reject) =>
      MetadataMusicFileHelper.getPictureArrayBuffer(filePath).then((result) => {
        const base64String = BufferUtilHelper.convertArrayBufferToBase64String(result.base64Type, result.arrayBuffer)
        const typeBufferObject = BufferUtilHelper.convertBase64StringToBuffer(base64String)
        resolve(BufferUtilHelper.writeBufferToFile(typeBufferObject.buffer, filePath.substring(0, filePath.lastIndexOf('.')), typeBufferObject.type.split('/')[1]))
      }).catch(reject))
  }
}

module.exports = { MetadataHelper, BufferUtilHelper, MetadataMusicFileHelper }
