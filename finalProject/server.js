/*
Author Ivan Perez Pina, Beverly Perez, CSC337, Summer 2020
    final project
    Purpose: Mancala yoo lmao
    CSS Style
*/






/*Start my server up using the express module, and the mongoose module
    Here we start our constants


*/
const express = require('express');
const mongoose = require('mongoose');
const parser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const crypto = require('crypto');






const iterations = 1000;



/*
    app.uses
*/

const app = express();
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.use(cookieParser());

// Allow cors everywhere
app.use(cors());







//Create the mongoose connection and use localhost to host it
const db = mongoose.connection;
const mongoDBURL = 'mongodb://localhost/auto';






//connect to mongoose
mongoose.connect(mongoDBURL, { useNewUrlParser: true });
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

/*
Start my server up using the express module, and the mongoose module
*/


//Create the two Schemes
var Schema = mongoose.Schema;


//////////////////////////MONGODB SCHEMAS//////////////////////////////////////////////////



var Server = new Schema({
    serverid: String,
    usernameOne: String,
    usernameTwo: String,
    password: String,
    gameBoard: []
});
var ServerCheck = mongoose.model('Server', Server);



var AccountSchema = new Schema({
    username: String,
    salt: String,
    hash: String,
    savedGamestates: [],
    wins: Number
});
var AccountCheck = mongoose.model('Account', AccountSchema);



//to clear the database
db.on('open', function () {
    db.dropDatabase(function (err, result) { ; });
});




////////////////////////////////NODE JS///////////////////////////////////////////////

/////ACOUNT CREATION////////////////////////////

/*


// sentTokenCookie creates a cookie which expires after one day
const sendUserIdCookie = (userId, res) => {
    // Our token expires after one day
    const oneDayToSeconds = 24 * 60 * 60;
    res.cookie('userId', userId,
        {
            maxAge: oneDayToSeconds,
            // You can't access these tokens in the client's javascript
            httpOnly: true,
            // Forces to use https in production
            secure: process.env.NODE_ENV === 'production' ? true : false
        });
};



// Our application store is stateful and uses a variable
const sessions = {};

const sessionHandler = (req, res, next) => {
    // extracting the user id from the session
    let userId = getUserId(req, res);

    // If we don't have a userId or the session manager doesn't recognize the userId
    // then we create a new one one
    if (!userId || !sessions[userId]) {
        // this should create a time based unique identifier
        userId = uuidv1();
        sessions[userId] = {
            cart: {}
        };
        // Clearing the cookies in case the session userid is not valid
        res.clearCookie('userId');
        // Returning the newly assigned cookie value
        sendUserIdCookie(userId, res);
    }
    req.session = sessions[userId];
    // Now in our route handlers you'll have session information in req.session
    next();
};



// This will manage our sessions
app.use(sessionHandler)


// returns an object with the cookies' name as keys
const getAppCookies = (req) => {
    // We extract the raw cookies from the request headers
    const rawCookies = req.headers.cookie.split('; ');
    // rawCookies = ['myapp=secretcookie, 'analytics_cookie=beacon;']

    const parsedCookies = {};
    rawCookies.forEach(rawCookie => {
        const parsedCookie = rawCookie.split('=');
        // parsedCookie = ['myapp', 'secretcookie'], ['analytics_cookie', 'beacon']
        parsedCookies[parsedCookie[0]] = parsedCookie[1];
    });
    return parsedCookies;
};

// Returns the value of the userId cookie
const getUserId = (req, res) => getAppCookies(req, res)['userId'];


*/




//Static file
app.use('/', express.static('public_html'));



//Handles loging in a user
app.post('/login', function (req, res) {
    let usernameAdd = String(req.body.username);
    AccountCheck.find({ username: usernameAdd }).exec(function (error, results) {
        if (results.length == 1) {

            let passwordAdd = req.body.password;
            var salt = results[0].salt;

            crypto.pbkdf2(passwordAdd, salt, iterations, 64, 'sha512', (err, hash) => {
                if (err) throw err;
                let hStr = hash.toString('base64');
                if (results[0].hash == hStr) {
                    const cart = req.session.cart;
                    cart[usernameAdd] = -~cart[usernameAdd];
                    res.send(true);
                } else {
                    res.send(false);
                }


            });
        } else {
            res.send(false);
        }

    });

});


//Handles adding a user
app.post('/add/user', function (req, res) {
    //console.log   res.body);
    let usernameAdd = String(req.body.username);

    AccountCheck.find({ username: usernameAdd }).exec(function (error, results) {
        if (results.length == 0) {
            let passwordAdd = req.body.password;
            var salt = crypto.randomBytes(64).toString('base64');
            crypto.pbkdf2(passwordAdd, salt, iterations, 64, 'sha512', (err, hash) => {
                if (err) throw err;
                let hashAdd = hash.toString('base64');
                var Account = new AccountCheck({
                    username: usernameAdd,
                    salt: salt,
                    hash: hashAdd,
                    savedGamestates: [],
                    wins: 0
                });
                Account.save(function (err) { if (err) console.log('an error occurred'); });
                const cart = req.session.cart;
                cart[usernameAdd] = -~cart[usernameAdd];
                res.send(true);


            })



        } else {
            res.send(false);
        }
    });
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Updates leaderboard
app.post('/update', function (req, res) {
    let usernameAdd = String(req.body.username);
    AccountCheck.find({ username: usernameAdd }).exec(function (error, results) {
        if (results.length == 1) {
            results[i].wins += 1;
            Account.save(function (err) { if (err) console.log('an error occurred'); });
            res.send(true);

        } else {
            res.send(false);
        }

    });

});


//Updates leaderboard
app.get('/update/leaderboard', function (req, res) {

    AccountCheck.find({}).exec(function (error, results) {
        var allValues = [];
        for (i in results) {
            let user = results[i].username;
            let wins = results[i].wins;
            let ret = {};
            ret[user] = wins;
            allValues.push(ret);
        }
        //console.log(allValues);
        res.send(allValues);
    });

});


//////////////////////////////SERVER/////////////////////////



//Get the list of servers
app.get('/search/:keyword', function (req, res) {
    let keyword = String(req.params.keyword);
    ServerCheck.find({}).exec(function (error, results) {
        let ret = [];
        for (i in results) {
            if (results[i].usernameTwo == null) {
                var current = results[i].serverid;
                if (current.includes(keyword)) {
                    ret.push(results[i]);
                }
            }
        }
        res.send(ret);
    });

});


//Get the list of servers
app.get('/search', function (req, res) {
    let keyword = String(req.params.keyword);
    ServerCheck.find({}).exec(function (error, results) {
        let ret = [];
        for (i in results) {
            if (results[i].usernameTwo == null) {
                ret.push(results[i]);
            }
        }
        res.send(ret);
    });

});


app.post('/create', function (req, res) {
    let serverid = req.body.serverid;
    let password = req.body.pass;
    let user = req.body.user;

    ServerCheck.find({ serverid: serverid }).exec(function (error, results) {
        if (results.length == 0) {
            var Server = new ServerCheck({
                serverid: serverid,
                usernameOne: user,
                usernameTwo: null,
                password: password,
                gameBoard: [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0]
            });

            Server.save(function (err) { if (err) console.log('an error occurred'); });
            res.send(true);

        } else {
            res.send(false);
        }

    });


});


/////////////////////////////////////////////////////////////////









//Standard port
const port = 3000;
app.listen(port, () => console.log(`Example app listening at http://159.89.134.208:${port}`))

