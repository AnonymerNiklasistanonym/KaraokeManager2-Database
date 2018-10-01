#!/usr/bin/env node

/***************************************************************************************************************
 * Copyright 2018 AnonymerNiklasistanonym > https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database
 ***************************************************************************************************************/

/*
 * This file contains:
 * The main documentation code. [Dev]
 * This means in here is everything listed that will be documented on `npm run doc`.
 */

// Create file structure/content documentation
const DocumentFileStructure = require('./fileStructure/fileStructure')
// Create file structure/content documentation
const DocumentJsDoc = require('./documentationJsDoc').DocumentJsDoc

// File structure documentation
DocumentFileStructure.createDocumentation()
  .catch(console.error)

// Source code documentation
DocumentJsDoc.createDocumentation()
  .catch(console.error)
