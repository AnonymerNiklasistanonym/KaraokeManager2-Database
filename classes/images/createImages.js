#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * Script to create the needed images from source images
 */

const ImageLibrary = require('./imageLibrary')
const path = require('path')
const fs = require('fs').promises

/**
 * @param {string[]} directories Directories that should be created
 */
const createDirectories = directories => Promise.all(
  directories.map(directory => new Promise((resolve, reject) => fs.mkdir(directory)
    .then(resolve)
    .catch(err => {
      err ? (err.code === 'EEXIST' ? resolve() : reject(err)) : resolve()
    }))))
/**
 * @param {string} imagePathSvg
 * @param {function(number):string} imagePathPng
 */
const createPngFavicons = (imagePathSvg, imagePathPng) => Promise.all(
  [16, 32, 64, 128, 160, 180, 194, 256, 512]
    .map(size => ImageLibrary.convertSvgToPng(imagePathSvg, imagePathPng(size), { width: size, height: size })))
/**
 * @param {string} imagePathSvg
 * @param {string} imagePathIco
 */
const createIcoFavicon = (imagePathSvg, imagePathIco) => {
  const tempPngImage = 'temp.png'

  return new Promise((resolve, reject) => ImageLibrary
    .convertSvgToPng(imagePathSvg, tempPngImage, { width: 512, height: 512 })
    .then(() => ImageLibrary.convertPngToIco(tempPngImage, imagePathIco)
      .then(() => fs.unlink(tempPngImage)
        .then(resolve)
        .catch(reject)))
    .catch(reject))
}

// Declare file paths
const imageDirectories = [path.join(__dirname, '..', '..', 'public', 'favicons')]
const imageFilePathSvg = path.join(__dirname, '..', '..', 'images', 'logo.svg')
const imageFilePathIco = path.join(__dirname, '..', '..', 'public', 'favicons', 'favicon.ico')
const imageFilePathSvgCopy = path.join(__dirname, '..', '..', 'public', 'favicons', 'favicon.svg')

/**
 * @param {number} size
 */
const imageFilePathPng = size => `${path.join(__dirname, '..', '..', 'public', 'favicons', 'favicon')}_${size}.png`

// Run everything
createDirectories(imageDirectories)
  .then(() => Promise.all([createPngFavicons(imageFilePathSvg, imageFilePathPng),
    createIcoFavicon(imageFilePathSvg, imageFilePathIco),
    fs.copyFile(imageFilePathSvg, imageFilePathSvgCopy)]))
  .catch(console.error)
