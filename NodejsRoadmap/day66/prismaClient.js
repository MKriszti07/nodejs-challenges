require('dotenv').config();

const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

const configuredUrl = process.env.DATABASE_URL;
const databaseFile = configuredUrl
	? (configuredUrl.startsWith('file:') ? configuredUrl.slice(5) : configuredUrl)
	: path.join(__dirname, 'prisma', 'dev.db');

const adapter = new PrismaBetterSqlite3({ url: databaseFile });
const prisma = new PrismaClient({ adapter });

module.exports = { prisma };