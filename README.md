# KaraokeManager2-Database

[![platform-linux-osx-win](https://img.shields.io/badge/platform-linux%20%7C%20osx%20%7C%20win-lightgrey.svg)](https://nodejs.org/en/download/current/)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
[![node-version-10.11](https://img.shields.io/badge/node-v10.11-blue.svg)](https://nodejs.org/en/blog/release/v10.11.0/)

## Setup

1. Install the latest version of [nodejs](https://nodejs.org/en/download/current/)
2. Clone the directory via `git clone https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database.git`
3. Run in the cloned directory `chmod +x setup.sh && ./setup.sh` to create a self signed certificate and dh parameter for the server (on Linux everything works, on Windows use WSL to do this)
4. Run in the cloned directory `npm install` and `npm run createImages`
5. Now start the server with `npm start`

## Setup via Makefile (`make`)

1. Install the latest version of [nodejs](https://nodejs.org/en/download/current/)
2. Clone the directory via `git clone https://github.com/AnonymerNiklasistanonym/KaraokeManager2-Database.git`
3. Run in the cloned directory `make -f Makefile`
4. Now start the server with `make -f Makefile server`

## Debug in [VisualStudioCode](https://code.visualstudio.com/)

1. To not use infinite `console.log('...')` statements for debugging you can use an IDE like VSC for debugging
2. Open the directory in your VSC workspace
   - Either through your file explorer context menu (...*Open with Code Insiders* or something else)
   - Or open VSC, click `File`, click `Add Folder to Workspace` and select this directory
3. In the side bar of VSC select the 3rd icon from the top (or the one that has a bug on it and displays the text `Debug (Ctrl+Shift+D)`)
4. Normally you should now be able to use the `Debug KaraokeManager2` in the top selection box
5. Select it and click the `Start Debugging` button (the triangle)
6. Now you can
   - Set breakpoints
   - Inspect values of local and global variables
   - Watch variables
   - View call stack
7. Since I found this I don't need to use `console.log('...')` any more and can change my code on the fly :D
8. Additional tip: If you click the terminal symbol next to the `Debug KaraokeManager2` you can still view the `console.log('...')` statements ;)

## Commands

### Production

- `npm start` Execute main file / Start server

### Development

- `npm run build` Creates binary builds of this project via [pkg](https://github.com/zeit/pkg)
- `npm run typedoc` Creates (for now the best) HTML documentation of the source code
- `npm run documentation` Creates documentation files (HTML, Markdown) of source code and file structure
- `npm run jsdoc` Creates jsdoc (HTML directory) documentation
- `npm run format` Automatically fixes JavaScript source code to be in the correct format (+ additional warnings)
- `npm run test` Lints JavaScript source code
- `npm run previews` Creates HTML (preView) render files of views
- `npm run images` Create images (to run this command you need to install [inkscape](https://inkscape.org/en/release/0.92.3/) first)

## Dependencies (non-dev)

Calculated using the tool [`cost-of-modules`](https://github.com/siddharthkp/cost-of-modules):

name | children | size | version | latest version
---- | -------- | ---- | ------- | --------------
jimp | 123 | [![install size](https://packagephobia.now.sh/badge?p=jimp)](https://packagephobia.now.sh/result?p=jimp) | 0.5.4 | [![latest-version-jimp](https://badge.fury.io/js/jimp.svg)](https://www.npmjs.com/package/jimp)
sqlite3 | 124 | [![install size](https://packagephobia.now.sh/badge?p=sqlite3)](https://packagephobia.now.sh/result?p=sqlite3) | 4.0.2 | [![latest-version-sqlite3](https://badge.fury.io/js/sqlite3.svg)](https://www.npmjs.com/package/sqlite3)
express-handlebars | 31 | [![install size](https://packagephobia.now.sh/badge?p=express-handlebars)](https://packagephobia.now.sh/result?p=express-handlebars) | 3.0.0 | [![latest-version-express-handlebars](https://badge.fury.io/js/express-handlebars.svg)](https://www.npmjs.com/package/express-handlebars)
express-minify-html | 18 | [![install size](https://packagephobia.now.sh/badge?p=express-minify-html)](https://packagephobia.now.sh/result?p=express-minify-html) | 0.12.0 | [![latest-version-express-minify-html](https://badge.fury.io/js/express-minify-html.svg)](https://www.npmjs.com/package/express-minify-html)
png-to-ico | 3 | [![install size](https://packagephobia.now.sh/badge?p=png-to-ico)](https://packagephobia.now.sh/result?p=png-to-ico) | 2.0.1| [![latest-version-png-to-ico](https://badge.fury.io/js/png-to-ico.svg)](https://www.npmjs.com/package/png-to-ico)
socket.io | 57 | [![install size](https://packagephobia.now.sh/badge?p=socket.io)](https://packagephobia.now.sh/result?p=socket.io) | 2.1.1 | [![latest-version-socket.io](https://badge.fury.io/js/socket.io.svg)](https://www.npmjs.com/package/socket.io)
multer | 33 | [![install size](https://packagephobia.now.sh/badge?p=multer)](https://packagephobia.now.sh/result?p=multer) | 1.4.1 | [![latest-version-multer](https://badge.fury.io/js/multer.svg)](https://www.npmjs.com/package/multer)
wavesurfer.js | 0 | [![install size](https://packagephobia.now.sh/badge?p=wavesurfer.js)](https://packagephobia.now.sh/result?p=wavesurfer.js) | 2.1.0 | [![latest-version-wavesurfer.js](https://badge.fury.io/js/wavesurfer.js.svg)](https://www.npmjs.com/package/wavesurfer.js)
materialize-css | 0 | [![install size](https://packagephobia.now.sh/badge?p=materialize-css)](https://packagephobia.now.sh/result?p=materialize-css) | 1.0.0 | [![latest-version-materialize-css](https://badge.fury.io/js/materialize-css.svg)](https://www.npmjs.com/package/materialize-css)
body-parser | 24 | [![install size](https://packagephobia.now.sh/badge?p=body-parser)](https://packagephobia.now.sh/result?p=body-parser) | 1.18.3 | [![latest-version-body-parser](https://badge.fury.io/js/body-parser.svg)](https://www.npmjs.com/package/body-parser)
express | 56 | [![install size](https://packagephobia.now.sh/badge?p=express)](https://packagephobia.now.sh/result?p=express) | 4.16.4 | [![latest-version-express](https://badge.fury.io/js/express.svg)](https://www.npmjs.com/package/express)
material-icons | 0 | [![install size](https://packagephobia.now.sh/badge?p=material-icons)](https://packagephobia.now.sh/result?p=material-icons) | 0.2.3 | [![latest-version-material-icons](https://badge.fury.io/js/material-icons.svg)](https://www.npmjs.com/package/material-icons)
spdy | 18 | [![install size](https://packagephobia.now.sh/badge?p=spdy)](https://packagephobia.now.sh/result?p=spdy) | 3.4.7 | [![latest-version-spdy](https://badge.fury.io/js/spdy.svg)](https://www.npmjs.com/package/spdy)
jsmediatags | 1 | [![install size](https://packagephobia.now.sh/badge?p=jsmediatags)](https://packagephobia.now.sh/result?p=jsmediatags) | 3.8.1 | [![latest-version-jsmediatags](https://badge.fury.io/js/jsmediatags.svg)](https://www.npmjs.com/package/jsmediatags)
compression | 10 | [![install size](https://packagephobia.now.sh/badge?p=compression)](https://packagephobia.now.sh/result?p=compression) | 1.7.3 | [![latest-version-compression](https://badge.fury.io/js/compression.svg)](https://www.npmjs.com/package/compression)
dropzone | 0 | [![install size](https://packagephobia.now.sh/badge?p=dropzone)](https://packagephobia.now.sh/result?p=dropzone) | 5.5.1 | [![latest-version-dropzone](https://badge.fury.io/js/dropzone.svg)](https://www.npmjs.com/package/dropzone)
express-session | 10 | [![install size](https://packagephobia.now.sh/badge?p=express-session)](https://packagephobia.now.sh/result?p=express-session) | 1.15.6 | [![latest-version-express-session](https://badge.fury.io/js/express-session.svg)](https://www.npmjs.com/package/express-session)
helmet | 18 | [![install size](https://packagephobia.now.sh/badge?p=helmet)](https://packagephobia.now.sh/result?p=helmet) | 3.14.0 | [![latest-version-helmet](https://badge.fury.io/js/helmet.svg)](https://www.npmjs.com/package/helmet)
morgan | 6 | [![install size](https://packagephobia.now.sh/badge?p=morgan)](https://packagephobia.now.sh/result?p=morgan) | 1.9.1 | [![latest-version-morgan](https://badge.fury.io/js/morgan.svg)](https://www.npmjs.com/package/morgan)
rotating-file-stream | 0 | [![install size](https://packagephobia.now.sh/badge?p=rotating-file-stream)](https://packagephobia.now.sh/result?p=rotating-file-stream) | 1.3.9 | [![latest-version-rotating-file-stream](https://badge.fury.io/js/rotating-file-stream.svg)](https://www.npmjs.com/package/rotating-file-stream)
image-size | 0 | [![install size](https://packagephobia.now.sh/badge?p=image-size)](https://packagephobia.now.sh/result?p=image-size) | 0.6.3 | [![latest-version-image-size](https://badge.fury.io/js/image-size.svg)](https://www.npmjs.com/package/image-size)

## Codebase

### Source code

The source code of the app itself is 100% Nodejs JavaScript (`.js`) BUT because of there is no way to simply declare recursive or repeating data structures (which can than be set as parameter and return types which then can be linted) those types are externalized in TypeScript (`.ts`) files.

This works because my editor (Visual Studio Code [Insiders]) supports it while editing, and for running the app or packaging it the TypeScript (`.ts`) files simply are left out, because they don't do anything besides giving types and helping linting.

The source code should contain no unnecessary data, preferably only the name of the data or website template files.

### Data structures

The data structures are JSON (`.json`) files.

### Websites

Each website or website element will never be rendered via the source code but by using partials and template handlebars (`.handlebars`) documents.
