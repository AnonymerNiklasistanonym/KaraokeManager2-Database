#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * Image manipulation library
 * Install this before using it:
 * - https://inkscape.org/en/release/0.92.2/ (Download inkscape)
 */

const execFile = require('child_process').execFile
const fs = require('fs').promises
const pngToIco = require('png-to-ico')
const jimp = require('jimp')

/**
 * Manipulate images
 */
class ImageLibrary {
  /**
   * Convert a `.svg` file to a `.png` file
   * @param {string} inputFilePath
   * @param {string} outputFilePath
   * @param {{width:number,height:number}} [options]
   * @returns {Promise<string>}
   * @example const svgImage = path.join(__dirname, 'image.svg')
   * const pngImage = path.join(__dirname, 'image.png')
   * ImageLibrary.convertSvgToPng(svgImage, pngImage, { width: 2048, height: 2048 })
   *   .catch(console.error)
   */
  static convertSvgToPng (inputFilePath, outputFilePath, options) {
    return new Promise((resolve, reject) => {
      const args = ['-f', inputFilePath, '-e', outputFilePath]
      if (options.height !== undefined) {
        args.push(`--export-height=${options.height}`)
      }
      if (options.width !== undefined) {
        args.push(`--export-width=${options.width}`)
      }
      execFile('inkscape', args, (error, stdout, stderr) => { error ? reject(error) : resolve(stdout) })
    })
  }
  /**
   * Convert a `.png` file to a `.ico` file
   * @param {string} inputFilePath
   * @param {string} outputFilePath
   * @returns {Promise<void>}
   * @example const pngImage = path.join(__dirname, 'image.png')
   * const icoImage = path.join(__dirname, 'image.ico')
   * ImageLibrary.convertPngToIco(pngImage, icoImage)
   *   .catch(console.error)
   */
  static convertPngToIco (inputFilePath, outputFilePath) {
    return new Promise((resolve, reject) => pngToIco(inputFilePath)
      .then(buffer => fs.writeFile(outputFilePath, buffer)
        .then(resolve)
        .catch(reject))
      .catch(console.error))
  }
  static convertToJpg (inputFilePath, outputFilePath) {
    return new Promise((resolve, reject) => {
      jimp.read(inputFilePath)
        .then(image => {
          image.writeAsync(outputFilePath)
            .then(resolve)
            .catch(reject)
        })
        .catch(reject)
    })
  }
  /**
   * Convert a `.svg` file to a `.png` file
   * @param {string} inputFilePath
   * @param {string} outputFilePath
   * @param {{width:number,height:number}} [options]
   * @returns {Promise<void>}
   * @example const svgImage = path.join(__dirname, 'image.svg')
   * const jpgImage = path.join(__dirname, 'image.jpg')
   * ImageLibrary.convertSvgToPng(svgImage, pngImage, { width: 2048, height: 2048 })
   *   .catch(console.error)
   */
  static convertSvgToJpg (inputFilePath, outputFilePath, options) {
    return new Promise((resolve, reject) => {
      const tempPngImage = outputFilePath + '.png'
      this.convertSvgToPng(inputFilePath, tempPngImage, options)
        .then(() => this.convertToJpg(tempPngImage, outputFilePath)
          .then(() => fs.unlink(tempPngImage)
            .then(resolve)
            .catch(reject))
          .catch(reject))
        .catch(reject)
    })
  }
}

module.exports = ImageLibrary
