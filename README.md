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

## Commands

- `npm start` Execute main file
- `npm run build` Creates binary builds of this project via [pkg](https://github.com/zeit/pkg)
- `npm run documentation` Creates documentation files (HTML, Markdown) of source code and file/database structure
- `npm run format` Automatically fixes JavaScript source code to be in the correct format ([js-standard-style](http://standardjs.com))
- `npm run test` Lints JavaScript source code without looking mainly at the code style via [jshint](http://jshint.com/)
