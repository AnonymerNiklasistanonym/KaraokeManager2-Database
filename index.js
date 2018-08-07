const sqlite3 = require('sqlite3')
const DatabaseHelper = require('./classes/database_helper')

// create/open connection to database
let db = new sqlite3.Database('./karaokemanager2_database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  err => {
    if (err) {
      console.error(err.message)
    }
    console.log('Connected to the database.')
  })

// create tables (if not existing)
DatabaseHelper.parseToSQLiteQueries()
  .then(sqlQueries => {
    db.serialize(() => {
      sqlQueries.forEach(sqliteQuery => {
        db.run(sqliteQuery, err => {
          if (err) console.error(err.message)
        })
      })
    })
    // close database
    db.close(err => {
      if (err) {
        console.error(err.message)
      }
      console.log('Close the database connection.')
    })
  })
  .catch(err => console.error(err))
