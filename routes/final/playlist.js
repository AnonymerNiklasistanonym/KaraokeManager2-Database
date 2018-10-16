#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * The routing paths for the route `/playlist`.
 */

const ErrorPage = require('../../classes/server/errorPage')
const API = require('../../classes/api/api')
const Configuration = require('../../classes/configuration/configuration')
const express = require('express')
const router = express.Router()

/*
 * Display current playlist entries
 */
router.get('/', (req, res, next) => {
  const pageNumber = isNaN(Number(req.query.page)) ? 1 : Number(req.query.page)
  Promise.all([
    Configuration.generateNavBarContent(req.session.authorized),
    API.getSongList(pageNumber)
  ])
    .then(navBarPlaylistEntries => {
      res.locals = {
        ...res.locals,
        ...Configuration.generalContent,
        ...Configuration.playlistContent,
        navBar: navBarPlaylistEntries[0],
        pagination: Configuration.parsePagination(navBarPlaylistEntries[1].page,
          navBarPlaylistEntries[1].pages, '/playlist?page='),
        playlist: {
          elements: navBarPlaylistEntries[1].elements.map(Configuration.parsePlaylistEntries)
        }
      }
      res.render('home', { layout: 'materialize', title: 'Home' })
    })
    .catch(err => {
      res.locals.customLinks = ErrorPage.createErrorLinks()
      next(err)
    })
})

module.exports = router
