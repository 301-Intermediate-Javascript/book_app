'use strict';

// Required Packages

const express = require('express');
const superAgent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override')
require('dotenv').config();


// Global Variables

const app = express();
const PORT = process.env.PORT || 3000;

// For Form Use

app.use(express.static('./Public'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_overrideMethod'));
// Config

app.set('view engine', 'ejs');
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);
client.connect();

// Server Locations
// Get, POST etc

app.get('/hello', helloCallBack);
app.get('/searches/new', searchCallback);
app.post('/searches', searchesCallBack);
app.post('/books', books);
app.get('/books/:id', booksCallBack)
app.put('/books/:id/update', updateCallback)
app.get('/', homeCallBack);

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
// console.log(request.params);
const sqlQuery = `SELECT * FROM books WHERE id=$1`
const sqlValue = [request.params.id];
    client.query(sqlQuery, sqlValue)
    .then(value => {
        respond.render('Pages/books/show', {'book' : value.rows[0], displayButton: true})
    }).catch(error =>{
        app.get('/errors', errors => {

            respond.render('Pages/errors', {'errors': error})
        });

    })
}

function books(request, respond) {
    console.log(request.body);
    const sqlQuery = 'INSERT INTO books (title, author, isbn, description, image, bookshelf) VALUES($1, $2, $3, $4, $5, $6)';
    const sqlValues = [request.body.title, request.body.author, request.body.isbn, request.body.description,
    request.body.image, 1];
    client.query(sqlQuery, sqlValues);

    respond.render('Pages/books/show', {'book': request.body, displayButton: false});
}

function homeCallBack(request, respond){
    const sqlQuery = 'SELECT * FROM books'
    client.query(sqlQuery)
    .then(value => {
        respond.render('Pages/index', {'collection' : value.rows})
    }).catch(error =>{
        app.get('/errors', errors => {

            respond.render('Pages/errors', {'errors': error})
        });

    })
}

function updateCallback(request, respond){
    // console.log(request.body);
    // console.log(request.params);
    let sql = `
    UPDATE books
    SET title=$1, description=$2, author=$3, image=$4, isbn=$5, bookshelf=$7
    WHERE id=$6
    `;
    const values = [request.body.title, request.body.description, request.body.author, request.body.image, request.body.isbn, request.params.id, request.body.newBookShelf];
    client.query(sql, values)
    .then(() =>{
        sql = `SELECT bookshelf FROM books WHERE id=${request.params.id}`;
        client.query(sql)
        .then(result =>{
            console.log(result);
            respond.redirect(`/books/${request.params.id}`)

        })
    })
}
//Listen
app.listen(PORT, () => {
    console.log(`Listening to PORT ${PORT}`)
})