const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const uuid = require('uuid');

//Appending Morgan logs to File
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

app.use(bodyParser.json());

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


const movies = [
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

//Creating GET(http)Request/Route at endpoint /movies returning JSON objects(return all movies)(CRUD: READ)
app.get('/movies', (req,res) => {
    res.status(200).json(movies).send('Successful GET request returning data on all the movies');
});

// Creating GET route at endpoint "/users" returning JSON object (Returns all movies)
app.get('/users', (req, res) => {
    res.status(200).json(users);
  });

//Creating GET(http)Request/Route at endpoint (returns)movies by title (CRUD: READ)
app.get('/movies/:title', (req,res) => {
    const {title} = req.params;
    const movie = movies.find(movie => movie.Title === title);

    if(movie){
        res.status(200).json(movie);
    }else{
        res.status(400).send('No such movie!!')
    } 
});

//Creating GET(http)Request/Route at endpoint (returns)Genre by name (CRUD: READ)
app.get('/movies/genre/:genreName', (req,res) => {
    const {genreName} = req.params;
    const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;

    if(genre){
        res.status(200).json(genre);
    }else{
        res.status(400).send('Genre not found!!!')
    } 
});

//Creating GET(http)Request/Route returns data from Director by name(CRUD: READ)
app.get('/movies/directors/:directorName', (req,res) => {
    const {directorName} = req.params;
    const director = movies.find(movie => movie.Director.Name === directorName).Director;

    if(director){
        res.status(200).json(director);
    }else{
        res.status(400).send('Director not found!!')
    } 
});

//Allow new users to register POST(http)/ (CRUD: Create)
app.post('/users',(req,res) => {
    const newUser = req.body;

    if(newUser.name){
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    }else {
        res.status(400).send('users need names')
    }
})

//Allow users to UPDATE(CRUD)/[HTTP: PUT] their user info
app.put('/users/:id',(req,res) => {
    const {id} = req.params;
    const updatedUser = req.body;

    let user = users.find( user => user.id == id);
    
    if(user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    }else{
        req.status(400).send('no user updated!!')
    }
    
})

//Allow users to add movies to their favorites list and send text as ADDED [CREATE][POST]
app.post('/users/:id/:movieTitle',(req,res) => {
    const {id, movieTitle} = req.params;
    
    let user = users.find( user => user.id == id);
    
    if(user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).json(user).send(`${movieTitle} has been added to user ${id}'s array`);
    }else{
        req.status(400).send(`${movieTitle} has not been added`)
    }
})

//Allow users to remove a movie from their list of favorites [DELETE]
app.delete('/users/:id/:movieTitle',(req,res) => {
    const {id, movieTitle} = req.params;
    
    let user = users.find( user => user.id == id);
    
    if(user) {
        user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
    }else{
        req.status(400).send(`${movieTitle} is not in the list`)
    }
})

//Allow users to deregister [DELETE]
app.delete('/users/:id', (req, res) => {
    const {id} = req.params;
    
    let user = users.find( user => user.id == id);
    
    if(user) {
       users = users.filter( user => user.id != id);
       res.status(200).send(`user ${id} has been deleted`);
    }else{
        req.status(400).send(`${id} has not been deleted`)
    }
})


//another GET route located at the endpoint “/” that returns a default textual response.
app.get('/',(req,res) => {
    res.send('Welcome to MovieFlix!!');
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