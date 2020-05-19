'use strict';

// Required Packages

const express = require('express');
const superAgent = require('superagent');

// Global Variables

const app = express();
const PORT = process.env.PORT || 3000;

// For Form Use

app.use(express.static('./Public'));
app.use(express.urlencoded({extended: true}));

// Config

app.set('view engine', 'ejs');

// Server Locations
// Get, POST etc

app.get('/hello', helloCallBack);
app.get('/searches/new', searchCallback);
app.post('/searches', searchesCallBack)
// Constructor
// Book

function Book(object) {
    this.title = object.title ? object.title : 'Title unknown';
    this.author = object.author ? object.author : 'Author unknown';
    this.image = object.image ? object.image : 'https://i.imgur.com/J5LVHEL.jpg';
    this.description = object.description ? object.description : 'No description available';
}

// Server Callbacks

function helloCallBack(request, respond){
    respond.render('Pages/index')
}

function searchCallback(request, respond){
    respond.render('Pages/searches/new');
}

function searchesCallBack(request, respond){
console.log(request.body);
const bookApiUrl = `https://www.googleapis.com/books/v1/volumes?q=${request.body.name}`
    superAgent.get(bookApiUrl)
    .then()
    .catch()
}
//Listen
app.listen(PORT, () => {
    console.log(`Listening to PORT ${PORT}`)
})