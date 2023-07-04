const mongoose = require('mongoose');
const Models = require('./models.js');
const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');

//Appending Morgan logs to File
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const Movies = Models.Movie;
const Users = Models.User;


mongoose.connect('mongodb://127.0.0.1:27017/myFlixDB', {useNewUrlParser:true, useUnifiedTopology:true});

let users = [
    {
        id : 1,
        name: "Manny",
        favoriteMovies:[]
    },
    {
        id : 2,
        name: "Luke",
        favoriteMovies:["Interstellar"]
    }
];


let movies = [
    {
        Title: 'Interstellar',
        Description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
        Genre: {
            Name: 'Science Fiction',
            Description:'Science fiction is a film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science.'
        },
        Director: {
            Name: 'Christopher Nolan',
            YearOfBirth:1970,
            Biography: 'Christopher Nolan is a British-American filmmaker. Known for his Hollywood blockbusters with complex storytelling, Nolan is considered a leading filmmaker of the 21st century'
        },
        Year: 2014
    },
    {
        Title: 'John Wick',
        Description:'An ex-hitman comes out of retirement to track down the gangsters who killed his dog and stole his car.',
        Genre: {
            Name: 'Action',
            Description:'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.'
        },
        Director: {
            Name: 'Chad Stahelski',
            YearOfBirth:1968,
            Biography: 'Chad Stahelski is an American stuntman and film director. He has worked as a stuntman, stunt coordinator and second unit director on several films.'
        },
        Year: 2014
    },
    {
        Title: 'The Conjuring',
        Description: 'Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse.',
        Genre: {
            Name: 'Horor',
            Description:'Horror is a film genre that seeks to elicit fear or disgust in its audience for entertainment purposes.'
        },
        Director: {
            Name: 'James Wan',
            YearOfBirth:1977,
            Biography: 'James Wan is an Australian film producer, screenwriter and film director of Malaysian Chinese descent. He is widely known for directing the horror film Saw (2004) and creating Billy the puppet'
        },
        Year: 2013
    },
    {
        Title: 'The Mummy',
        Description: 'At an archaeological dig in the ancient city of Hamunaptra, an American serving in the French Foreign Legion accidentally awakens a mummy who begins to wreak havoc as he searches for the reincarnation of his long-lost love.',
        Genre: {
            Name: 'Fantasy',
            Description:'Fantasy is a genre of speculative fiction involving magical elements, typically set in a fictional universe and usually inspired by mythology and folklore.'
        },
        Director: {
            Name: 'Stephen Sommers',
            YearOfBirth:1962,
            Biography: 'Stephen Sommers is an American filmmaker, best known for big-budget action fantasy movies, such as The Mummy (1999), its sequel, The Mummy Returns (2001)'
        },
        Year: 1999
    },
    {
        Title: 'Titanic',
        Description: 'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.',
        Genre: {
            Name: 'Romance',
            Description:'Romance films involve romantic love stories recorded in visual media for broadcast in theatres or on television that focus on passion, emotion, and the affectionate romantic involvement of the main characters.'
        },
        Director: {
            Name: 'James Cameron',
            YearOfBirth:1954,
            Biography: "James Cameron is a Canadian filmmaker. A major figure in the post-New Hollywood era, Cameron is considered one of the industry's most innovative filmmakers, regularly making use of novel technologies."
        },
        Year: 1997
    },
    {
        Title: 'Dunkirk',
        Description:'Allied soldiers from Belgium, the British Commonwealth and Empire, and France are surrounded by the German Army and evacuated during a fierce battle in World War II.' ,
        Genre: {
            Name: 'War Film',
            Description:'War film is a film genre concerned with warfare, typically about naval, air, or land battles, with combat scenes central to the drama.'
        },
        Director: {
            Name: 'Christopher Nolan',
            YearOfBirth:1970,
            Biography: 'Christopher Nolan is a British-American filmmaker. Known for his Hollywood blockbusters with complex storytelling, Nolan is considered a leading filmmaker of the 21st century'
        },
        Year: 2017
    },
    {
        Title: 'Forrest Gump',
        Description: "The history of the United States from the 1950s to the '70s unfolds from the perspective of an Alabama man with an IQ of 75, who yearns to be reunited with his childhood sweetheart.",
        Genre: {
            Name: 'Drama',
            Description:'In film and television, drama is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.'
        },
        Director: {
            Name: 'Robert Zemeckis',
            YearOfBirth:1952,
            Biography: 'Robert Zemeckis is an American filmmaker. He first came to public attention as the director of Romancing the Stone (1984). He subsequently directed the satirical black comedy and then diversified into more dramatic fare like Forrest Gump for which he won the Academy Award for Best Director. He has directed films across a wide variety of genres, for both adults and families.'
        },
        Year: 1994
    },
    {
        Title: 'Shutter Island',
        Description:'Teddy Daniels and Chuck Aule, two US marshals, are sent to an asylum on a remote island in order to investigate the disappearance of a patient, where Teddy uncovers a shocking truth about the place.',
        Genre: {
            Name: 'Thriller',
            Description:'Thriller film, also known as suspense film or suspense thriller, is a broad film genre that evokes excitement and suspense in the audience.'
        },
        Director: {
            Name: 'Martin Scorsese',
            YearOfBirth:1942,
            Biography: 'Martin Scorsese is an American and Italian film director, producer, screenwriter and actor. Scorsese emerged as one of the major figures of the New Hollywood era. He is the recipient of many major accolades, including an Academy Award, four BAFTA Awards, three Emmy Awards, a Grammy Award, three Golden Globe Awards, and two Directors Guild of America Awards.'
        },
        Year: 2010
    },
    {
        Title: 'Dune',
        Description:"A noble family becomes embroiled in a war for control over the galaxy's most valuable asset while its heir becomes troubled by visions of a dark future.",
        Genre: {
            Name: 'Adventure',
            Description:'An adventure film is a form of adventure fiction. Settings plays an important role in an adventure film, sometimes itself acting as a character in the narrative. They are typically set in far away lands, such as lost continents or other exotic locations'
        },
        Director: {
            Name: 'Denis Villeneuve',
            YearOfBirth:1967,
            Biography: 'Denis Villeneuve is a French-Canadian filmmaker.Internationally, he is known for directing several critically acclaimed films. His Film "Dune" received critical acclaim, was a commercial success at the box office internationally, and is his highest grossing film to date'
        },
        Year: 2021
    },
    {
        Title: 'The Mask',
        Description:'Bank clerk Stanley Ipkiss is transformed into a manic superhero when he wears a mysterious mask.',
        Genre: {
            Name: 'Comedy',
            Description:'A comedy film is a category of film which emphasizes on humor. These films are designed to make the audience laugh in amusement. Films in this style traditionally have a happy ending (dark comedy being an exception to this rule).'
        },
        Director: {
            Name: 'Chuck Russell',
            YearOfBirth:1958,
            Biography: 'Charles Russell is an American filmmaker and actor known for his work on several genre films. Russell also executive produced the critically acclaimed Michael Mann-directed neo-noir action thriller Collateral.'
        },
        Year: 1994
    }
];

//Creating GET(http)Request at endpoint "/movies" returning JSON objects(return all movies)(CRUD: READ)
app.get('/movies', (req,res) => {
    Movies.find()
    .then((movies) => {
        res.status(201).json(movies); 
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error ' + err);
    });
});

// Creating GET route at endpoint "/users" returning JSON object (Returns all users)(CRUD: READ)
app.get('/users', (req, res) => {
    Users.find()
    .then((users) => {
        res.status(201).json(users);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Creating GET(http)Request at endpoint "/movies/:Title" (get movies by title (CRUD: READ))
app.get('/movies/:Title', (req,res) => {
    Movies.findOne({Title: req.params.Title})
    .then((movies)=> {
        res.json(movies)
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Creating GET(http)Request/Route at endpoint (returnsJson object of Genre name and description (CRUD: READ))
app.get('/movies/genres/:genreName', (req,res) => {
    Movies.findOne({ 'Genre.Name' : req.params.genreName})
    .then((movies) => {
        res.status(200).json(movies.Genre);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Creating GET(http)Request/Route returns Json object of details of Director (CRUD: READ)
app.get('/movies/directors/:directorName', (req,res) => {
    Movies.findOne({ 'Director.Name' : req.params.directorName})
    .then((movies) => {
        res.status(200).json(movies.Director);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Creating GET(http)Request at endpoint "/users/:Username" (get user by Username (CRUD: READ))
app.get('/users/:Username', (req,res) => {
    Users.findOne({Username: req.params.Username})
    .then((users) =>{
        res.json(users);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Allow new users to register POST(http)/ (CRUD: CREATE)
app.post('/users',(req,res) => {
    Users.findOne({ Username: req.body.Username })
    .then((user) => {
        if(user){
            return res.status(400).send(req.body.Usename+ 'already exists');
        } else {
            Users.create({
                Username : req.body.Username,
                Password: req.body.Password,
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
app.put('/users/:Username',(req,res) => {
    Users.findOneAndUpdate({ Username: req.params.Username}, 
        {$set: 
        {
            Username: req.body.Username,
            Password: req.body.Password,
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
            res.json(updatedUser);
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});
    

//Allow users to add movies to their favorites list and send text as ADDED [CREATE][POST]
//Add a movie to a user's list of Favorites
app.post('/users/:Username/movies/:MovieID',(req,res) => {
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
            res.json(updatedUser);
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
app.delete('/users/:Username', (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username})
    .then((user)=> {
        if(!user){
            res.status(400).send(req.params.Username + 'was not found');
        }else {
            res.status(200).send(req.params.Username + 'was deleted.');
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