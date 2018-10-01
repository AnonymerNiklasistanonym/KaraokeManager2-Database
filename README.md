# KaraokeManager2-Database

[![platform-linux-osx-win](https://img.shields.io/badge/platform-linux%20%7C%20osx%20%7C%20win-lightgrey.svg)](https://nodejs.org/en/download/current/)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
[![node-version-10.11](https://img.shields.io/badge/node-v10.11-blue.svg)](https://nodejs.org/en/blog/release/v10.11.0/)

## Setup

1. Install the latest version of [nodejs](https://nodejs.org/en/download/current/)
2. Clone the directory via `git clone https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database.git`
3. Run in the cloned directory `chmod +x setup.sh && ./setup.sh` to create a self signed certificate and dh parameter for the server (on Linux everything works, on Windows use WSL to do this)
4. Run in the cloned directory `npm install`
5. Now start the server with `npm start`

## Setup via Makefile (`make`)

1. Install the latest version of [nodejs](https://nodejs.org/en/download/current/)
2. Clone the directory via `git clone https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database.git`
3. Run in the cloned directory `make -f Makefile`
4. Now start the server with `make -f Makefile server`

## Commands

- `npm start` Execute main file
- `npm run build` Creates binary builds of this project via [pkg](https://github.com/zeit/pkg)
- `npm run documentation` Creates documentation files (HTML, Markdown) of source code and file/database structure
- `npm run jsdoc` Creates jsdoc (HTML directory) documentation
- `npm run format` Automatically fixes JavaScript source code to be in the correct format
- `npm run test` Lints JavaScript source code without looking mainly at the code style

## Dependencies (non-dev)

Calculated using the tool [`cost-of-modules`](https://github.com/siddharthkp/cost-of-modules):

name | children | size | version | latest version
---- | -------- | --------- | ------- | ---------------
sqlite3 | 125 | [![install size](https://packagephobia.now.sh/badge?p=sqlite3)](https://packagephobia.now.sh/result?p=sqlite3) | 4.0.2 | [![latest-version-sqlite3](https://badge.fury.io/js/sqlite3.svg)](https://www.npmjs.com/package/sqlite3)
express-handlebars | 31 | [![install size](https://packagephobia.now.sh/badge?p=express-handlebars)](https://packagephobia.now.sh/result?p=express-handlebars) | 3.0.0 | [![latest-version-express-minify-html](https://badge.fury.io/js/express-minify-html.svg)](https://www.npmjs.com/package/express-minify-html)
express-minify-html | 18 | [![install size](https://packagephobia.now.sh/badge?p=express-minify-html)](https://packagephobia.now.sh/result?p=express-minify-html) | 0.12.0 | [![latest-version-express-minify-html](https://badge.fury.io/js/express-minify-html.svg)](https://www.npmjs.com/package/express-minify-html)
socket.io | 57 | [![install size](https://packagephobia.now.sh/badge?p=socket.io)](https://packagephobia.now.sh/result?p=socket.io) | 2.1.1 | [![latest-version-socket.io](https://badge.fury.io/js/socket.io.svg)](https://www.npmjs.com/package/socket.io)
express | 74 | [![install size](https://packagephobia.now.sh/badge?p=express)](https://packagephobia.now.sh/result?p=express) | 4.16.3 | [![latest-version-express](https://badge.fury.io/js/express.svg)](https://www.npmjs.com/package/express)
wavesurfer.js | 0 | [![install size](https://packagephobia.now.sh/badge?p=wavesurfer.js)](https://packagephobia.now.sh/result?p=wavesurfer.js) | 2.0.6 | [![latest-version-wavesurfer.js](https://badge.fury.io/js/wavesurfer.js.svg)](https://www.npmjs.com/package/wavesurfer.js)
materialize-css | 0 | [![install size](https://packagephobia.now.sh/badge?p=materialize-css)](https://packagephobia.now.sh/result?p=materialize-css) | 1.0.0 | [![latest-version-materialize-css](https://badge.fury.io/js/materialize-css.svg)](https://www.npmjs.com/package/materialize-css)
body-parser | 24 | [![install size](https://packagephobia.now.sh/badge?p=body-parser)](https://packagephobia.now.sh/result?p=body-parser) | 1.18.3 | [![latest-version-body-parser](https://badge.fury.io/js/body-parser.svg)](https://www.npmjs.com/package/body-parser)
spdy | 26 | [![install size](https://packagephobia.now.sh/badge?p=spdy)](https://packagephobia.now.sh/result?p=spdy) | 3.4.7 | [![latest-version-spdy](https://badge.fury.io/js/spdy.svg)](https://www.npmjs.com/package/spdy)
material-icons | 0 | [![install size](https://packagephobia.now.sh/badge?p=material-icons)](https://packagephobia.now.sh/result?p=material-icons) | 3.8.1 | [![latest-version-material-icons](https://badge.fury.io/js/material-icons.svg)](https://www.npmjs.com/package/material-icons)
jsmediatags | 1 | [![install size](https://packagephobia.now.sh/badge?p=jsmediatags)](https://packagephobia.now.sh/result?p=jsmediatags) | 3.8.1 | [![latest-version-jsmediatags](https://badge.fury.io/js/jsmediatags.svg)](https://www.npmjs.com/package/jsmediatags)
compression | 10 | [![install size](https://packagephobia.now.sh/badge?p=compression)](https://packagephobia.now.sh/result?p=compression) | 1.7.3 | [![latest-version-compression](https://badge.fury.io/js/compression.svg)](https://www.npmjs.com/package/compression)
express-session | 10 | [![install size](https://packagephobia.now.sh/badge?p=express-session)](https://packagephobia.now.sh/result?p=express-session) | 1.15.6 | [![latest-version-express-session](https://badge.fury.io/js/express-session.svg)](https://www.npmjs.com/package/express-session)
morgan | 6 | [![install size](https://packagephobia.now.sh/badge?p=morgan)](https://packagephobia.now.sh/result?p=morgan) | 1.9.1 | [![latest-version-morgan](https://badge.fury.io/js/morgan.svg)](https://www.npmjs.com/package/morgan)
helmet | 17 | [![install size](https://packagephobia.now.sh/badge?p=helmet)](https://packagephobia.now.sh/result?p=helmet) | 3.13.0 | [![latest-version-helmet](https://badge.fury.io/js/helmet.svg)](https://www.npmjs.com/package/helmet)
rotating-file-stream | 0 | [![install size](https://packagephobia.now.sh/badge?p=rotating-file-stream)](https://packagephobia.now.sh/result?p=rotating-file-stream) | 1.3.9 | [![latest-version-rotating-file-stream](https://badge.fury.io/js/rotating-file-stream.svg)](https://www.npmjs.com/package/rotating-file-stream)
**16 modules** | **237 children** | **29.08**
