#!/usr/bin/env node
'use strict'

const path = require('path')
// database
const sqlite3 = require('sqlite3')
const DatabaseHelper = require('./classes/database/setup/database_helper')
// server
const express = require('express')
const compression = require('compression')
const handlebars = require('express-handlebars')
const app = express()
const hbs = handlebars.create({
  // Specify helpers which are only registered on this instance.
  helpers: {
    foo: function () { return 'FOO!' },
    bar: function () { return 'BAR!' }
  },
  extname: '.handlebars',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials')
})
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.use(compression())
const birds = require('./routes/birds')

// create/open connection to database
let db = new sqlite3.Database('./karaokemanager2_database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  err => {
    if (err) {
      console.error(err.message)
    }
    console.log('Connected to the database.')
  })

// create tables (if not existing)
let createdSetupTables = new Promise((resolve, reject) => {
  DatabaseHelper.setupSQLiteTablesQueries
    .then(sqlQueries => {
      db.serialize(() => {
        sqlQueries.forEach(sqliteQuery => {
          db.run(sqliteQuery, err => {
            if (err) console.error(err.message)
          })
        })
      })
      resolve()
    })
    .catch(err => reject(err))
})

// create default values (if not existing)
let createdSetupValues = new Promise((resolve, reject) => {
  createdSetupTables.then(() => {
    DatabaseHelper.setupSQLiteTableValuesQueries
      .then(sqlQueries => {
        db.serialize(() => {
          sqlQueries.forEach(sqliteQuery => {
            db.run(sqliteQuery, err => {
              if (err) console.error(err.message)
            })
          })
        })
        resolve()
      })
      .catch(err => reject(err))
  }).catch(err => reject(err))
})

createdSetupValues
  .then(() => {
    // close database
    db.close(err => {
      if (err) {
        console.error(err.message)
      }
      console.log('Close the database connection.')
    })
  })
  .catch(err => console.error(err))

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.send('hello world')
})

// GET method route
app.get('/get', (req, res) => {
  res.send('GET request')
})

// POST method route
app.post('/post', (req, res) => {
  res.send('POST request')
})

// Rout middleware functions
app.all('/secret', (req, res, next) => {
  console.log('Accessing the secret section ...')
  next() // pass control to the next handler
})

// GET 'a file'
app.get('/random.text', (req, res) => {
  res.send('random.text')
})

/*
 * Route parameters
 */

// http://localhost:3000/users/34/books/8989
app.get('/users/:userId/books/:bookId', (req, res) => {
  res.send(req.params)
})
// http://localhost:3000/plantae/Prunus.persica
app.get('/plantae/:genus.:species', (req, res) => {
  res.send(req.params)
})
// http://localhost:3000/user/42
app.get('/user/:userId(\d+)', (req, res) => {
  res.send(req.params)
})

/*
 * Route handlers
 */
app.get('/example/b', (req, res, next) => {
  console.log('the response will be sent by the next function ...')
  next()
}, (req, res) => {
  res.send('Hello from B!')
})

const cb0 = (req, res, next) => {
  console.log('CB0')
  next()
}

const cb1 = (req, res, next) => {
  console.log('CB1')
  next()
}

const cb2 = (req, res) => {
  res.send('Hello from C!')
}

app.get('/example/c', [cb0, cb1, cb2])

/*
 * Response types
 */
app.get('/type/download', (req, res) => {
  res.download('./data/README.md', 'custom _file_name.md', (err) => {
    if (err) {
      console.error(err)
    }
  }) // Prompt a file to be downloaded
})
app.get('/type/end', (req, res) => {
  res.end() // End the response process
})
app.get('/type/json', (req, res) => {
  // res.setHeader('x-no-compression')
  res.json({ json: 'object'.repeat(9999), first: { second: true } }) // Send a JSON response
})
app.get('/type/redirect', (req, res) => {
  res.redirect('/type/json') // Redirect a request
})
app.get('/type/send', (req, res) => {
  res.send() // Send a response of various types
})
app.get('/type/sendFile', (req, res) => {
  res.sendFile() // Send a file as an octet stream
})
app.get('/type/render', (req, res) => {

  res.locals = {
    some_value: 'foo bar',
    list: ['cat', 'dog']
}

  res.render('home', {
    showTitle: true,
    array: ['first value', 'second value', 'third value'],

    // Override `foo` helper only for this rendering.
    helpers: {
      foo: function () { return 'foo.' }
    }
  }) // Render a view template
})
app.get('/type/status', (req, res) => {
  res.sendStatus() // Set the response status code and send its string representation as the response body
})

/*
 * Make a whole directory downloadable
 */
// http://localhost:3000/database/tables.json
app.use(express.static(__dirname + '/data'))

/*
 * Use externalized router
 */
app.use('/birds', birds)

app.listen(3000, () => console.log('Example app listening on port 3000!'))
