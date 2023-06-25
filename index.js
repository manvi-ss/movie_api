const express = require('express');
const app = express();

//Appending Morgan logs to File
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');


let favMovies = [
    {
        title: 'Intersteller',
        genre: 'Science Fiction',
        director: 'Christopher Nolan',
        year: 2014
    },
    {
        title: 'John Wick',
        genre: 'Action',
        director: 'Chad Stahelski',
        year: 2014
    },
    {
        title: 'The Shining',
        genre: 'Horror',
        director: 'Stanley Kubrick',
        year : 1980
    },
    {
        title: 'The lord of the rings',
        genre: 'Fantasy',
        director: 'Peter Jackson',
        year: 2001
    },
    {
        title: 'Titanic',
        genre: 'Romance',
        director: 'James Cameron',
        year: 1997
    },
    {
        title: 'Dunkirk',
        genre: 'War',
        director: 'Christopher Nolan',
        year: 2017
    },
    {
        title: 'Forrest Gump',
        genre: 'Drama',
        director: 'Robert Zemeckis',
        year: 1994
    },
    {
        title: 'The Sixth Sense',
        genre: 'Thriller',
        director: 'M. Night Shyamalan',
        year: 1999
    },
    {
        title: 'Raides of the Lost Ark',
        genre: 'Adventure',
        director: 'Steven Spielberg',
        year: 1981
    },
    {
        title: 'Hot Fuzz',
        genre: 'Comedy',
        director: 'Edgar Wright',
        year: 2007
    },
];

//Get Requests
app.get('/movies', (req,res) => {
    res.json(favMovies);
});

//another GET route located at the endpoint “/” that returns a default textual response.
app.get('/',(req,res) => {
    res.send('Welcome to my MovieFlix!!');
});

// for serving static files
app.use(express.static('public'));

// for serving static files in public folder
app.use(express.static('public'));

//create a write stream in append mode. a log.txt file is in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname,'log.txt'), {flags: 'a'})

//setup the logger
app.use(morgan('combined',{ stream: accessLogStream}));

//error-handling middleware
app.use((err,req,res,next) => {
    console.error(err.stack);
    res.status(500).send('Something Broke!');
});

// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });