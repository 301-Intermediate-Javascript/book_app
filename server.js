'use strict';

// Required Packages

const express = require('express');
const superAgent = require('superagent');
const pg = require('pg');
require('dotenv').config();


// Global Variables

const app = express();
const PORT = process.env.PORT || 3000;

// For Form Use

app.use(express.static('./Public'));
app.use(express.urlencoded({extended: true}));

// Config

app.set('view engine', 'ejs');
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);
client.connect();

// Server Locations
// Get, POST etc

app.get('/hello', helloCallBack);
app.get('/searches/new', searchCallback);
app.post('/books', books);
app.get('/books/:id', booksCallBack)
app.get('/', homeCallBack);
app.post('/searches', searchesCallBack);

function Book(object) {
    this.title = object.title ? object.title : 'Title unknown';
    this.author = object.authors ? object.authors[0] : 'Author unknown';
    if(object.imageLinks.smallThumbnail){
        if(object.imageLinks.smallThumbnail.split(':')[4] === ":"){
            object.imageLinks.smallThumbnail = object.imageLinks.smallThumbnail.split(':').join('s:')
        }
    }
    this.isbn = object.industryIdentifiers ? `${object.industryIdentifiers[0].type} ${object.industryIdentifiers[0].identifier}` : 'ISBN not Found';
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
const bookApiUrl = request.body.Author ? `https://www.googleapis.com/books/v1/volumes?q=inauthor:${request.body.name}` 
:`https://www.googleapis.com/books/v1/volumes?q=intitle:${request.body.name}`;
    superAgent.get(bookApiUrl)
    .then(result =>{
        const newBooks = result.body.items.map(value =>{

            return new Book(value.volumeInfo);
    })
    respond.render('Pages/searches/shows', {'books': newBooks})
    }).catch(error =>{
        app.get('/errors', errors => {

            respond.render('Pages/errors', {'errors': error})
        });

    })
    }
function booksCallBack(request, respond){
console.log(request.params);
const sqlQuery = `SELECT * FROM books WHERE id=$1`
const sqlValue = [request.params.id];
    client.query(sqlQuery, sqlValue)
    .then(value => {
        console.log(value.rows[0]);
        respond.render('Pages/books/show', {'book' : value.rows[0]})
    })
}

function books(request, respond) {
    console.log(request.body);
    const sqlQuery = 'INSERT INTO books (title, author, isbn, description, image) VALUES($1, $2, $3, $4, $5)';
    const sqlValues = [request.body.title, request.body.author, request.body.isbn, request.body.description,
    request.body.image];
    client.query(sqlQuery, sqlValues);
    respond.render('Pages/books/show', {'book': request.body});
}

function homeCallBack(request, respond){
    const sqlQuery = 'SELECT * FROM books'
    client.query(sqlQuery)
    .then(value => {
        console.log(value.rows);
        respond.render('Pages/index', {'collection' : value.rows})
    })
}
//Listen
app.listen(PORT, () => {
    console.log(`Listening to PORT ${PORT}`)
})