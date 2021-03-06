#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * The waveform external test route of the server
 */

const express = require('express')
const router = express.Router()

// Define the home page route
router.get('/', (req, res) => { res.render('audioVideo') })

module.exports = router
