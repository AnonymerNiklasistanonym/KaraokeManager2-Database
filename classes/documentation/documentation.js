#!/usr/bin/env node
'use strict'

/*
 * This file contains:
 * The main documentation code. This means in here is everything listed that will be documented on `npm run doc`.
 */

// Create database structure/content documentation
const DocumentDatabaseStructure = require('./database_structure').DocumentDatabaseStructure
// Create file structure/content documentation
const DocumentFileStructure = require('./file_structure').DocumentFileStructure
// Create file structure/content documentation
const DocumentJsDoc = require('./js_doc').DocumentJsDoc

// File structure documentation
DocumentFileStructure.createDocumentation()
  .catch(console.error)

// Database structure documentation
DocumentDatabaseStructure.createDocumentation()
  .catch(console.error)

// Source code documentation
DocumentJsDoc.createDocumentation()
  .catch(console.error)
