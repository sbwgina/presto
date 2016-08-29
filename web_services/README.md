## Installation

> This package follows [NPM](https://docs.npmjs.com/) standards for building and installation. By default the app will be accessible at [http://localhost:2121](http://localhost:2121)

## Required Software
  * [NodeJS](https://nodejs.org/en/download/)
  * [Node Package Manager (npm)] (https://www.npmjs.com/package/download)

## Build and Start

```
   // in the command-line navigate to the web_services module
   cd .../presto_demo/web_services

   // install all relevant packages, ensure there are no errors before proceeding
   npm install

   // start the database server
   // TODO: configure database integration

   // configuration.json - environment specific configurations
   // TODO: document configuration.json in CONFIGME.md

   // starts the web server
   npm start
```


## Start Database
```
    mongod --dbpath=/local/path/to/store/db/presto_demo --port=2300 --journal
```

## Populate Database
```
    mongo --port=2300 scripts/populate_database.js
```

## Command-line Database Query Tool
```
    mongo --port=2300
```