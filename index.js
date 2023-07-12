//Modules
const mongoose = require('mongoose');
const Models = require('./models.js');
const express = require('express');
const {check, validationResult} = require('express-validator');
const bodyParser = require('body-parser');
const uuid = require('uuid');

//Appending Morgan logs to File
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const cors = require('cors');
app.use(cors());

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

const Movies = Models.Movie;
const Users = Models.User;




//mongoose.connect('mongodb://127.0.0.1:27017/myFlixDB', {useNewUrlParser:true, useUnifiedTopology:true});
mongoose.connect(process.env.CONNECTION_URI, {useNewUrlParser:true, useUnifiedTopology:true})
.then(() => console.log('Connected to database'))
.catch((error) => console.log('Error message:', error.message ));



//Creating GET(http)Request at endpoint "/movies" returning JSON objects(return all movies)(CRUD: READ)
app.get('/movies', passport.authenticate('jwt',{ session: false}), (req,res) => {
    Movies.find()
    .then((movies) => {
        res.status(200).json(movies); 
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error ' + err);
    });
});

// Creating GET route at endpoint "/users" returning JSON object (Returns all users)(CRUD: READ)
app.get('/users',passport.authenticate('jwt',{ session: false}),  (req, res) => {
    Users.find()
    .then((users) => {
        res.status(200).json(users);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Creating GET(http)Request at endpoint "/movies/:Title" (get movies by title (CRUD: READ))
app.get('/movies/:Title', passport.authenticate('jwt',{ session: false}),(req,res) => {
    Movies.findOne({Title: req.params.Title})
    .then((movies)=> {
        if (movies){
            res.json(movies);
            return;
        }
        res.status(404).send('No movie found with that title');
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Creating GET(http)Request/Route at endpoint (returnsJson object of Genre name and description (CRUD: READ))
app.get('/movies/genres/:genreName',passport.authenticate('jwt',{ session: false}), (req,res) => {
    Movies.findOne({ 'Genre.Name' : req.params.genreName})
    .then((movies) => {
        res.status(200).json(movies.Genre);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});
 //return a list of movies by genre
app.get('/movies/genres/:genreName/movies',passport.authenticate('jwt',{ session: false}), (req,res) => {
    Movies.find({ 'Genre.Name' : req.params.genreName}).select('Title')
    .then((movieTitle) => {
        if(movieTitle.length === 0){
            return res.status(404).send('Genre not found');
        }
        res.status(200).json(movieTitle);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Creating GET(http)Request/Route returns Json object of details of Director (CRUD: READ)
app.get('/movies/directors/:directorName', passport.authenticate('jwt',{ session: false}), (req,res) => {
    Movies.findOne({ 'Director.Name' : req.params.directorName})
    .then((movies) => {
        res.status(200).json(movies.Director);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

app.get('/movies/directors/:directorName/movies', passport.authenticate('jwt',{ session: false}), (req,res) => {
    Movies.find({ 'Director.Name' : req.params.directorName}).select('Title')
    .then((movieTitle) => {
        if(movieTitle.length === 0){
            return res.status(400).send('No movies found')
        }
        res.status(200).json(movieTitle);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Creating GET(http)Request at endpoint "/users/:Username" (get user by Username (CRUD: READ))
app.get('/users/:Username', passport.authenticate('jwt',{ session: false}), (req,res) => {
    Users.findOne({Username: req.params.Username})
    .then((users) =>{
        if(!users){
            return res.status(400).send('No user found')
        }
        res.json({Username:users.Username});
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Allow new users to register POST(http)/ (CRUD: CREATE)
app.post('/users',
[
    check('Username','Username is required').isLength({min:5}),//minimum value of 5 characters are allowed
    check('Username','Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password','Password is required').not().isEmpty(),//it should not be empty
    check('Email','Email does not appear to be valid.').isEmail()
],
(req,res) => {
    //check the validation object for errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errors:errors.array()});
    }

    const hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }) //Search to see if a user with the requested username already exists
    .then((user) => {
        if(user){ // If the user is found , send a esponse that it alreday exists
            return res.status(400).send(req.body.Usename+ 'already exists');
        } else {
            Users.create({
                Username : req.body.Username,
                Password: hashedPassword,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            })
            .then((user) => {res.status(201).json(user);
            
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error' + error);
            });
        }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
    });
    

//Allow users to UPDATE(CRUD)/[HTTP: PUT] their user info(username)
app.put('/users/:Username',
passport.authenticate('jwt',{ session: false}),
[
    check('Username','Username is required').isLength({min:5}),//minimum value of 5 characters are allowed
    check('Username','Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password','Password is required').not().isEmpty(),//it should not be empty
    check('Email','Email does not appear to be valid.').isEmail()
],
(req,res) => {
    const hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate({ Username: req.params.Username}, 
        {$set: 
        {
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        }
    },
    {new : true} //This line makes sure that the updates document is returned
    )
    .then((updatedUser) => {
        if (!updatedUser) {
            return res.status(404).send("Error: User does not exist");
        } else{
            res.status(201).json(updatedUser);
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});
    
//Allow users to add movies to their favorites list and send text as ADDED [CREATE][POST]
//Add a movie to a user's list of Favorites
app.post('/users/:Username/movies/:MovieID',(req,res) =>{
    Movies.find({'MovieID': req.params.MovieID})
    .then((MovieID) => {
        if(!MovieID){
            return res.status(400).send('No movies found!')
        } 
        else {
            Users.findOneAndUpdate({ Username: req.params.Username},
                {
                    $addToSet:{ FavoriteMovies: req.params.MovieID }
                },
                {new : true} //This line make sure the updated document is returned
            )
            .then((updatedUser) => {
                if (!updatedUser) {
                    return res.status(404).send("Error: User does not exist");
                } else{
                    res.status(201).json(updatedUser);
                } 
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error' + error);
            });
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

//Allow users to remove a movie from their list of favorites [DELETE]
app.delete('/users/:Username/movies/:MovieID',(req,res) => {
    Users.findOneAndUpdate({ Username: req.params.Username},
        {
            $pull:{FavoriteMovies: req.params.MovieID}
        },
        {new : true} //This line make sure the updated document is returned
    )
    .then((updatedUser) => {
        if (!updatedUser) {
            return res.status(404).send("Error: User does not exist");
        } else{
            res.json(updatedUser);
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

//Allow users to deregister [DELETE]
//Delete a user by Username
app.delete('/users/:Username', passport.authenticate('jwt',{ session: false}), (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username})
    .then((user)=> {
        if(!user){
            res.status(400).send(req.params.Username + 'was not found');
        }else {
            res.status(204).send(req.params.Username + 'was deleted.');
        }
    }) .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});


//another GET route located at the endpoint “/” that returns a default textual response.
app.get('/',(req,res) => {
    res.send('Welcome to MovieFlix!!');
});

app.get('/documentation',(req,res) => {
    res.sendFile('public/documentation.html', {root: __dirname});
});

// for serving static files in public folder
// app.use(express.static('public'));

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
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on port' + port);
  });