#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * The bird external test route of the server
 */

const express = require('express')
const router = express.Router()
let configuration = require('./../classes/configuration/configuration')

// Define the home page route
router.get('/', (req, res) => res.send('Birds home page'))

router.get('/about', (req, res) => res.send('About birds'))

router.get('/test', (req, res) => {
  res.locals = {
    materializeCardBannerPartial: configuration.getMaterializeCardBanner(),
    materializeFooterPartial: configuration.getMaterializeFooter(),
    navBar: configuration.getNavBar(),
    theme: configuration.getTheme(),
    fab: configuration.getMaterializeFab(),
    applicationName: 'KaraokeManager v2'
  }
  res.render('materialize', {
    featureRow: true,
    featureRowObject: {
      materializeCardFeatureRowPartial: configuration.getMaterializeFeatureRow(),
      theme: configuration.getTheme()
    },
    layout: 'materialize',
    title: 'Home page'
  })
})

module.exports = router
