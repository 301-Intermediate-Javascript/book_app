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

// Server Callbacks

function helloCallBack(request, respond){
    respond.render('Pages/index')
}

//Listen
app.listen(PORT, () => {
    console.log(`Listening to PORT ${PORT}`)
})