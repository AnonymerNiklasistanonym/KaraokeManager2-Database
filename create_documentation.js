#!/usr/bin/env node
'use strict'

/*
 * Description:
 * This class helps interacting with the database
 */

// Create JavaScript documentation
const documentation = require('documentation')
// Get database structure to md class
const DatabaseHelper = require('./classes/database_helper')
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
const indexJsDoc = documentation.build(['./index.js'], {external: []})
  // @ts-ignore
  .then(documentation.formats.md)
  .catch(err => console.error(err))

// Wait for everything and then continue with the complete source code documentation
Promise.all([indexJsDoc].map(p => p.catch(err => err)))
  .then(results => {
    const documentationText = '# Database Source Code Documentation\n\n' + results.join('\n')
    writeFilePromise('documentation_database.md', documentationText)
      .then(() => console.log("Database Source Code Documentation exported to file ('documentation_database.md')"))
      .catch(err => console.error(err))
  })
  .catch(err => console.error(err))

// Locally document index.js and all connected files in html document
documentation.build(['./index.js'], {external: []})
  // @ts-ignore
  .then(documentation.formats.html)
  .catch(err => console.error(err))
  .then(output => {
    streamArray(output).pipe(vfs.dest('./documentation_database'))
    console.log("Database Structure Documentation exported to directory ('documentation_database')")
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
