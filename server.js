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
app.post('/searches', searchesCallBack);
// Constructor
// Book
// { title: 'Justice',
//   authors: [ 'Harry Brighouse' ],
//   publisher: 'Polity',
//   publishedDate: '2004',
//   description:
//    'Introducing the concept of justice in contemporary political theory, this title outlines all the main theories and details the theories advanced by major thinkers such as Rawls, Sen, Friedman, Nozick and Fraser. It connects philosophical theories to real world issues and discusses the slogan \'the personal is political\'',
//   industryIdentifiers:
//    [ { type: 'ISBN_13', identifier: '9780745625959' },
//      { type: 'ISBN_10', identifier: '0745625959' } ],
//   readingModes: { text: true, image: true },
//   pageCount: 180,
//   printType: 'BOOK',
//   categories: [ 'Law' ],
//   maturityRating: 'NOT_MATURE',
//   allowAnonLogging: false,
//   contentVersion: '0.0.1.0.preview.3',
//   panelizationSummary: { containsEpubBubbles: false, containsImageBubbles: false },
//   imageLinks:
//    { smallThumbnail:
//       'http://books.google.com/books/content?id=8XrVJJlQvEUC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
//      thumbnail:
//       'http://books.google.com/books/content?id=8XrVJJlQvEUC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api' },
//   language: 'en',
//   previewLink:
//    'http://books.google.com/books?id=8XrVJJlQvEUC&printsec=frontcover&dq=inauthor:harry&hl=&cd=1&source=gbs_api',
//   infoLink:
//    'http://books.google.com/books?id=8XrVJJlQvEUC&dq=inauthor:harry&hl=&source=gbs_api',
//   canonicalVolumeLink:
//    'https://books.google.com/books/about/Justice.html?hl=&id=8XrVJJlQvEUC' }

function Book(object) {
    this.title = object.title ? object.title : 'Title unknown';
    this.author = object.author ? object.authors[0] : 'Author unknown';
    this.image = object.imageLinks.smallThumbnail ? object.imageLinks.smallThumbnail : 'https://i.imgur.com/J5LVHEL.jpg';
    this.description = object.description ? object.description : 'No description available';
}

// Server Callbacks

function helloCallBack(request, respond){
    respond.render('Pages/index')
    // respond.render('pathName', {Object: toBeSent})
}

function searchCallback(request, respond){
    respond.render('Pages/searches/new');
}

function searchesCallBack(request, respond){
console.log(request.body);
const bookApiUrl = request.body.Author ? `https://www.googleapis.com/books/v1/volumes?q=inauthor:${request.body.name}` 
:`https://www.googleapis.com/books/v1/volumes?q=intitle:${request.body.name}`;
    superAgent.get(bookApiUrl)
    .then(result =>{
        console.log(result.body.items[0].volumeInfo)
       const newBooks = result.body.items.map(value =>{
        return new Book(value.volumeInfo);
    })
    console.log(newBooks);
    respond.render('Pages/searches/shows', {'books': newBooks})
    })
    }
    

//Listen
app.listen(PORT, () => {
    console.log(`Listening to PORT ${PORT}`)
})