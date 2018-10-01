#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * Metadata options for music files
 */

const jsmediatags = require('jsmediatags')
const BufferHelper = require('../bufferHelper')

/**
 * Music cover image helper methods
 */
class MetadataMusic {
  /**
   * Get a picture array buffer
   * @param {string} filePath
   * @returns {Promise<{arrayBuffer: number[], base64Type: string}>}
   */
  static getPictureArrayBuffer (filePath) {
    return new Promise((resolve, reject) => new jsmediatags.Reader(filePath)
      // @ts-ignore
      .setTagsToRead(['picture'])
      .read({
        onError: reject,
        // @ts-ignore
        onSuccess: tag => {
          resolve({
            arrayBuffer: tag.tags.picture.data,
            base64Type: tag.tags.picture.format
          })
        }
      }))
  }
  /**
   * Extract cover image file from an audio file
   * @param {string} filePath Path to audio file
   * @returns {Promise<void>} Resolves when image was extracted to a file with the same name
   */
  static extractCoverImageFromAudioFile (filePath) {
    return new Promise((resolve, reject) => this.getPictureArrayBuffer(filePath)
      .then(result => {
        const base64String = BufferHelper.convertArrayBufferToBase64String(result.base64Type, result.arrayBuffer)
        const typeBufferObject = BufferHelper.convertBase64StringToBuffer(base64String)
        resolve(BufferHelper.writeBufferToFile(typeBufferObject.buffer,
          filePath.substring(0, filePath.lastIndexOf('.')), typeBufferObject.type.split('/')[1]))
      })
      .catch(reject))
  }
}

module.exports = MetadataMusic
