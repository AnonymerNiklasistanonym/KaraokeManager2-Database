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
const sizeOf = require('image-size')
const MediaHelper = require('../classes/other/mediaHelper')

// setup a path for uploads
const upload = multer({
  dest: 'uploads/'
})

// Define the home page route
router.get('/', (req, res) => res.render('upload', {
  layout: 'dropzone', csrfToken: true, xCsrfToken: '123XYZ' }))

router.post('/image', upload.single('file'), (req, res, next) => {

    console.log(req.headers)

  // check if uploaded file is an image or return error
  if (!req.file.mimetype.startsWith('image/')) {
    return res.status(422).json({
      error: 'The uploaded file must be an image'
    })
  }

  // get dimensions of the uploaded image
  const dimensions = sizeOf(req.file.path)

  // check if the image is at least 128x128 pixels big
  if ((dimensions.width < 128) || (dimensions.height < 128)) {
    return res.status(422).json({
      error: 'The image must be at least 128px x 128px'
    })
  }

  // change the profile picture
  MediaHelper.setProfilePicture(121, req.file.destination + '\\' + req.file.filename, (err) => {
    if (err) {
      return res.status(500).json({
        error: 'The image processing went wrong'
      })
    } else {
      res.status(200).send(req.file)
    }
  })
})

module.exports = router
