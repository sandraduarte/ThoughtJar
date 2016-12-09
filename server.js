/* Showing Mongoose's "Populated" Method (18.3.8)
 * INSTRUCTOR ONLY
 * =============================================== */

// dependencies
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var flash = require('connect-flash');

//models
var Comment = require('./models/Comment.js');
var Article = require('./models/Article.js');
var User = require("./models/User.js");

//express
var app = express();

//scrapers
var request = require('request'); 
var cheerio = require('cheerio');

//routers
var articles = require('./controllers/artController.js');
var users = require('./controllers/user_controller.js');

var Promise = require("bluebird");

mongoose.Promise = Promise;

// use morgan and bodyparser with our app
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));

// make public a static dir
app.use(express.static('public'));


// Database configuration with mongoose
mongoose.connect('mongodb://localhost/thoughtjar');
var db = mongoose.connection;

// show any mongoose errors
db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

// once logged in to the db through mongoose, log a success message
db.once('open', function() {
  console.log('Mongoose connection successful.');
});

// Configuring Passport
var passport = require('passport');
require('./config/passport')(passport);
var expressSession = require('express-session');
var MongoStore = require('connect-mongo')(expressSession);

app.use(expressSession({secret: 'sand',
                        store: new MongoStore({ mongooseConnection: mongoose.connection }),
                        resave: false,
                        saveUninitialized: false
                      }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

///////Set up Handlebars 
var exphbs = require('express-handlebars');

var hbs = require('express-handlebars');
app.engine('handlebars', hbs({
    defaultLayout: 'main',
    helpers: {
        if_eq: function(a, b, c, d, opts) {
            if (a == b && c == d) {
                return opts.fn(this);
            } else {
                return opts.inverse(this);
            }
        }
    }
}));
app.set('view engine', 'handlebars');


// Routes
// ======
app.use('/', articles);
app.use('/', users);


// listen on port 3000
app.listen(3000, function() {
  console.log('App running on port 3000!');
});
// catch-all handlebars
app.use(function(err, req, res, next) {
    console.log(err);
});
