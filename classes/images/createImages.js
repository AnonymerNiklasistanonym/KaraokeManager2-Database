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
  [16, 32, 64, 94, 128, 160, 180, 194, 256, 512]
    .map(size => ImageLibrary.convertSvgToPng(imagePathSvg, imagePathPng(size), { width: size, height: size })))
/**
 * @param {string} imagePathSvg
 * @param {function(number):string} imagePathJpg
 */
const createJpgAccountFg = (imagePathSvg, imagePathJpg) => Promise.all(
  [64, 128, 256, 512, 1000]
    .map(size => ImageLibrary.convertSvgToJpg(imagePathSvg, imagePathJpg(size), { width: size, height: size })))
/**
 * @param {string} imagePathSvg
 * @param {function(number[]):string} imagePathJpg
 */
const createJpgAccountBg = (imagePathSvg, imagePathJpg) => Promise.all(
  [[300, 176], [600, 353], [1200, 706], [2400, 1412]]
    .map(size => ImageLibrary.convertSvgToJpg(imagePathSvg, imagePathJpg(size), { width: size[0], height: size[1] })))

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
const imageDirectories = [path.join(__dirname, '..', '..', 'public', 'favicons'),
  path.join(__dirname, '..', '..', 'public', 'accounts')]
const imageFilePathFaviconSvg = path.join(__dirname, '..', '..', 'images', 'logo.svg')
const imageFilePathFaviconIco = path.join(__dirname, '..', '..', 'public', 'favicons', 'favicon.ico')
const imageFilePathFaviconSvgCopy = path.join(__dirname, '..', '..', 'public', 'favicons', 'favicon.svg')
const imageFilePathAccountFgSvg = path.join(__dirname, '..', '..', 'images', 'accountFg.svg')
const imageFilePathAccountBgSvg = path.join(__dirname, '..', '..', 'images', 'accountBg.svg')
const imageFilePathRootFgSvg = path.join(__dirname, '..', '..', 'images', 'rootFg.svg')
const imageFilePathRootBgSvg = path.join(__dirname, '..', '..', 'images', 'rootBg.svg')
/**
 * @param {number} size
 */
const imageFilePathFaviconPng = size =>
  `${path.join(__dirname, '..', '..', 'public', 'favicons', 'favicon')}_${size}.png`
/**
 * @param {number} size
 */
const imageFilePathJpgAccountFg = size =>
  `${path.join(__dirname, '..', '..', 'public', 'accounts', 'defaultAccountFg')}_${size}x${size}.jpg`
/**
 * @param {number[]} sizes
 */
const imageFilePathJpgAccountBg = sizes =>
  `${path.join(__dirname, '..', '..', 'public', 'accounts', 'defaultAccountBg')}_${sizes[0]}x${sizes[1]}.jpg`
/**
 * @param {number} size
 */
const imageFilePathJpgRootFg = size =>
  `${path.join(__dirname, '..', '..', 'public', 'accounts', 'defaultRootFg')}_${size}x${size}.jpg`
/**
 * @param {number[]} sizes
 */
const imageFilePathJpgRootBg = sizes =>
  `${path.join(__dirname, '..', '..', 'public', 'accounts', 'defaultRootBg')}_${sizes[0]}x${sizes[1]}.jpg`

// Run everything
createDirectories(imageDirectories)
  .then(() => Promise.all([createPngFavicons(imageFilePathFaviconSvg, imageFilePathFaviconPng),
    createIcoFavicon(imageFilePathFaviconSvg, imageFilePathFaviconIco),
    fs.copyFile(imageFilePathFaviconSvg, imageFilePathFaviconSvgCopy),
    createJpgAccountFg(imageFilePathAccountFgSvg, imageFilePathJpgAccountFg),
    createJpgAccountBg(imageFilePathAccountBgSvg, imageFilePathJpgAccountBg),
    createJpgAccountFg(imageFilePathRootFgSvg, imageFilePathJpgRootFg),
    createJpgAccountBg(imageFilePathRootBgSvg, imageFilePathJpgRootBg)]))
  .catch(console.error)
