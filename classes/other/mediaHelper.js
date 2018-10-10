#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * Media helper functions
 * - Resize an image (crop/letterbox)
 */

const Jimp = require('jimp')
const fs = require('fs').promises

/**
 * Static class that has methods to do things with images and co
 */
class MediaHelper {
  /**
   * Get image conversion modes
   */
  static get resizeImageMode () {
    return Object.freeze({ CROP: 1, LETTERBOX: 2 })
  }
  /**
   * Resize an image to a new size
   * @param {string} oldFileName Existing image file path
   * @param {string} newFileName New image file path
   * @param {number} newWidth New image width
   * @param {number} newHeight New image height
   * @param {number} mode Image resize mode (default=crop)
   * @returns {Promise<void>}
   */
  static resizeImage (oldFileName, newFileName, newWidth, newHeight, mode = this.resizeImageMode.CROP) {
    return new Promise((resolve, reject) => Jimp.read(oldFileName)
      .then(imageFile => {
        switch (mode) {
          case this.resizeImageMode.CROP:
            imageFile.cover(newWidth, newHeight)
            break
          case this.resizeImageMode.LETTERBOX:
            imageFile.contain(newWidth, newHeight)
            break
          default:
            return reject(Error(`No valid image convert mode specified (${mode})`))
        }
        if (mode) {
          imageFile
            .writeAsync(newFileName)
            .then(() => { console.log(`"${oldFileName}" to "${newFileName}" with the size ${newWidth}x${newHeight}`) })
            .then(resolve)
            .catch(reject)
        }
      })
      .catch(reject))
  }

  /**
   * Save profile picture in public directory
   * @param {number} accountId
   * @param {string} fileName
   * @returns {Promise<void>}
   */
  static setProfilePicture (accountId, fileName) {
    return new Promise((resolve, reject) => Promise.all([60, 80, 128, 512, 1024]
      .map(size => this.resizeImage(fileName, `public\\pictures\\picture_profile_${accountId}_${size}.jpg`,
        size, size)))
      .then(() => { console.log('All files converted') })
      .then(() => fs
        .unlink(fileName)
        .then(resolve)
        .catch(reject))
      .catch(reject))
  }
}

// Export the static class to another script
module.exports = MediaHelper
