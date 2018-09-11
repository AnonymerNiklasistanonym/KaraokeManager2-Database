# KaraokeManager2-Database

[![platform-linux-osx-win](https://img.shields.io/badge/platform-linux%20%7C%20osx%20%7C%20win-lightgrey.svg)](https://nodejs.org/en/download/current/)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
[![node-version-10.9](https://img.shields.io/badge/node-v10.9-blue.svg)](https://nodejs.org/en/blog/release/v10.9.0/)

## Commands

"start": "node index.js",
    "build": "node_modules/.bin/pkg .",
    "doc": "node ./classes/document/document.js",
    "format": "node_modules/.bin/standard --fix ./index.js ./classes/**/*.js ./routes/**/*.js",
    "test": "node_modules/.bin/jshint -c ./.jshint.json --verbose ./index.js ./classes/ ./routes/",

- `npm start` Execute main file
- `npm run build` Creates binary builds of this project via [pkg](https://github.com/zeit/pkg)
- `npm run doc` Creates documentation files (HTML, MD) of source code and file/database structure
- `npm run format` Automatically fixes JavaScript source code to be in the correct format ([js-standard-style](http://standardjs.com))
- `npm run test` Lints JavaScript source code without looking mainly at the code style via [jshint](http://jshint.com/)
