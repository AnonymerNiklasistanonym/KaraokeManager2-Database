#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * An upload test
 */

const express = require('express')
const router = express.Router()
const multer = require('multer')
const UploadManager = require('../classes/server/uploadManager')
const MediaHelper = require('../classes/other/mediaHelper')
const fs = require('fs').promises

// Setup a path for uploads
const upload = multer({
  dest: 'uploads/'
})

// Define the home page route
router.get('/', (req, res) => {
  res.render('upload', { csrfToken: true, layout: 'dropzone', xCsrfToken: '123XYZ' })
})

router.post('/image', upload.single('file'), (req, res, next) => {
  if (req.file === undefined) {
    return res.status(422)
      .json({ error: 'No file was uploaded!' })
  }

  if (!UploadManager.checkIfSupportedImage(req.file)) {
    return res.status(422)
      .json({ error: 'The uploaded file must be an image' })
  }

  if (!UploadManager.checkImageDimension(req.file, 128, 4096, 128, 4096)) {
    return res.status(422)
      .json({ error: 'The image must be at least 128px x 128px and not bigger than 4096px x 4096px' })
  }

  fs.copyFile(`${req.file.destination}\\${req.file.filename}`,
    `${req.file.destination}\\${req.file.originalname}`)
    .catch(console.error)

  // Change the profile picture
  MediaHelper.setProfilePicture(121, `${req.file.destination}\\${req.file.filename}`)
    .then(() => {
      res
        .status(200)
        .send(req.file)
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: `The image processing went wrong (${err})` })
    })
})

module.exports = router
