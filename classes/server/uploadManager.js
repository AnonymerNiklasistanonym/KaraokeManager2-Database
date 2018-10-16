#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * Upload handler
 */

const imageSize = require('image-size')
const fs = require('fs').promises

class UploadManager {
  /**
   * Check if uploaded file is an image
   * @param {import('serverTypes').IRequestFile} requestFile
   * @returns {boolean}
   */
  static checkIfSupportedImage (requestFile) {
    // TODO: Specify only allowed image types
    ['image/'].forEach(a => {
      if (requestFile.mimetype.startsWith(a)) { return true }
    })

    return false
  }
  /**
   * Check if uploaded file is an audio file
   * @param {import('serverTypes').IRequestFile} requestFile
   * @returns {boolean}
   */
  static checkIfSupportedAudio (requestFile) {
    // TODO: Specify only allowed audio types
    ['audio/'].forEach(a => {
      if (requestFile.mimetype.startsWith(a)) { return true }
    })

    return false
  }
  /**
   * Check if uploaded file is an audio file
   * @param {import('serverTypes').IRequestFile} requestFile
   * @returns {boolean}
   */
  static checkIfSupportedVideo (requestFile) {
    // TODO: Specify only allowed video types
    ['video/'].forEach(a => {
      if (requestFile.mimetype.startsWith(a)) { return true }
    })

    return false
  }
  /**
   * Check if uploaded file is an image
   * @param {import('serverTypes').IRequestFile} requestFile
   * @param {number} minWidth
   * @param {number} maxWidth
   * @param {number} minHeight
   * @param {number} maxHeight
   * @returns {boolean}
   */
  static checkImageDimension (requestFile, minWidth, maxWidth, minHeight, maxHeight) {
    // Get dimensions of the uploaded image
    const dimensions = imageSize(requestFile.path)

    // Check if the image is at least "minWidth x maxWidth" pixels big
    if ((dimensions.width < minWidth) || (dimensions.height < minHeight)) {
      return false
    }
    // Check if the image is not bigger than "maxWidth x maxHeight"
    if ((dimensions.width > maxWidth) || (dimensions.height > maxHeight)) {
      return false
    }

    return true
  }
  /**
   * move uploaded file
   * @param {import('serverTypes').IRequestFile} requestFile
   * @param {string} newFilePath
   * @returns {Promise}
   */
  static copyFileTo (requestFile, newFilePath) {
    return new Promise((resolve, reject) => {
      fs.copyFile(`${requestFile.destination}\\${requestFile.filename}`,
        newFilePath)
        .then(() => fs.unlink(`${requestFile.destination}\\${requestFile.filename}`)
          .then(resolve)
          .catch(reject))
        .catch(reject)
    })
  }
}

/*
// Check image for correct format
if (!UploadManager.fileUploadCheckIfImage(fileData)) {
  const imageTypeError = Error('The uploaded file must be an image!')
  imageTypeError.status = 422
  reject(imageTypeError)

  return
}

if (!UploadManager.fileUploadCheckImageDimension(fileData, 128, 4096, 128, 4096)) {
  const imageDimensionError = Error(
    'The image must be at least 128px x 128px and not bigger than 4096px x 4096px!')
  imageDimensionError.status = 422
  reject(imageDimensionError)

  return
}
*/

module.exports = UploadManager
