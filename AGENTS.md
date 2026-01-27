# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Repository Overview
A Node.js learning repository containing standalone example files demonstrating core Node.js and Express.js concepts. Each file in `NodejsRoadmap/` is a self-contained, runnable example.

## Commands

### Install dependencies
```bash
cd NodejsRoadmap && npm install
```

### Run any example file
```bash
node NodejsRoadmap/<filename>.js
```
Examples: `node NodejsRoadmap/expressExample.js`, `node NodejsRoadmap/authExample.js`

All Express examples run on port 3000.

### Run with nodemon (auto-reload)
```bash
npx nodemon NodejsRoadmap/<filename>.js
```

## Architecture

### Module System
CommonJS (`require`/`module.exports`) - see `"type": "commonjs"` in package.json.

### File Categories
- **Core Node.js**: `index.js`, `consoleExample.js`, `timersExample.js`, `fileSystemExample.js`, `server.js`
- **Express basics**: `expressExample.js`, `routingExample.js`, `middlewareExample.js`
- **API handling**: `restApi.js`, `postExample.js`, `queryExample.js`
- **Authentication**: `authExample.js` (JWT), `basicAuth.js` (bcrypt)
- **Database**: `mongoCrud.js` (MongoDB native driver)
- **Error handling**: `errorHandler.js`
- **Static files**: `staticFileExpressExample/` subdirectory

### Environment Variables
MongoDB connection string uses `.env` file with `MONGODB_URI`. Load via `require('dotenv').config()`.

### Dependencies
- `express` - Web framework
- `mongodb` - Database driver
- `jsonwebtoken` - JWT authentication
- `bcrypt` - Password hashing
- `dotenv` - Environment variable loading
