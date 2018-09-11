#!/usr/bin/env node
'use strict'

/*
 * Description:
 * This class helps interacting with the database
 */

// Create JavaScript documentation
const documentation = require('documentation')
// Get database structure to md class
const DatabaseHelper = require('./classes/database/setup/database_helper').DatabaseHelper
// Convert callbacks to promises
const promisify = require('util').promisify
// Write files asynchronously
const writeFile = require('fs').writeFile
// Html export of documentation
const streamArray = require('stream-array')
const vfs = require('vinyl-fs')

// Write files asynchronously with Promise
const writeFilePromise = promisify(writeFile)

// Document index.js and all connected files
const indexJsDoc = documentation.build(['./index.js'], { external: [] })
  // @ts-ignore
  .then(documentation.formats.md)
  .catch(err => console.error(err))

// Document index.js and all connected files
const indexDoc = documentation.build(['./index.js'], { external: [] })
  // @ts-ignore
  .then(documentation.formats.html)
  .catch(err => console.error(err))
  .then(output => {
    streamArray(output).pipe(vfs.dest('./documentation/index'))
    console.log("API Documentation exported to directory ('documentation/index')")
  })
  .catch(err => console.error(err))

// Document public_api.js and all connected files
const indexApiDoc = documentation.build(['./classes/api/api.js'], { external: [] })
  // @ts-ignore
  .then(documentation.formats.html)
  .catch(err => console.error(err))
  .then(output => {
    streamArray(output).pipe(vfs.dest('./documentation/api'))
    console.log("API Documentation exported to directory ('documentation/api')")
  })
  .catch(err => console.error(err))

// Wait for everything and then continue with the complete source code documentation
Promise.all([indexJsDoc, indexDoc, indexApiDoc].map(p => p.catch(err => err)))
  .then(results => {
    const documentationText = '# Database Source Code Documentation\n\n' + results.join('\n')
    writeFilePromise('documentation_database.md', documentationText)
      .then(() => console.log("Database Source Code Documentation exported to file ('documentation_database.md')"))
      .catch(err => console.error(err))
  })
  .catch(err => console.error(err))

// Locally document index.js and all connected files in html document
documentation.build(['./index.js'], { external: [] })
  // @ts-ignore
  .then(documentation.formats.html)
  .catch(err => console.error(err))
  .then(output => {
    streamArray(output).pipe(vfs.dest('./documentation/database'))
    console.log("Database Structure Documentation exported to directory ('documentation/database')")
  })
  .catch(err => console.error(err))

// Document the database structure
DatabaseHelper.markdownDocumentationTables
  .then(returnValue => {
    writeFilePromise('documentation_database_structure.md', returnValue)
      .then(() => console.log("Database Structure Documentation exported to file ('documentation_database_structure.md')"))
      .catch(err => console.error(err))
  })
  .catch(err => console.error(err))
