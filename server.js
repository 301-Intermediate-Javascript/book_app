'use strict';

// Required Packages

const express = require('express');
const methodOverride = require('method-override');
require('dotenv').config();

// Imported Callback Functions

const searchCallback = require('./Modules/searches_new.js');
const searchesCallBack = require('./Modules/searches.js');
const booksCallback = require('./Modules/booksid.js');
const books = require('./Modules/books.js');
const homeCallBack = require('./Modules/home.js');
const updateCallback = require('./Modules/update.js');
const deleteBook = require('./Modules/delete.js');

// Global Variables

const app = express();
const PORT = process.env.PORT || 3000;

// For Form Use

app.use(express.static('./Public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_overrideMethod'));
// Config

app.set('view engine', 'ejs');

// Server Locations
// Get, POST etc

app.get('/searches/new', searchCallback);
app.post('/searches', searchesCallBack);
app.post('/books', books);
app.get('/books/:id', booksCallback)
app.put('/books/:id/update', updateCallback)
app.get('/', homeCallBack);
app.delete('/books/:id/delete', deleteBook);

//Listen

app.listen(PORT, () => {
  console.log(`Listening to PORT ${PORT}`)
});
