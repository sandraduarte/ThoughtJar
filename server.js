

// dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
// Notice: Our scraping tools are prepared, too
var request = require('request'); 
var cheerio = require('cheerio');

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


// And we bring in our thought and Story models
var Thought = require('./models/Thought.js');
var Story = require('./models/Story.js');


// Routes
// ======

// Simple index route
app.get('/', function(req, res) {
  res.send(index.html);
});

// A GET request to scrape the echojs website.
app.get('/scrape', function(req, res) {
	// first, we grab the body of the html with request
  request('http://www.echojs.com/', function(error, response, html) {
  	// then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // now, we grab every h2 within an Story tag, and do the following:
    $('article h2').each(function(i, element) {

    		// save an empty result object
				var result = {};

				// add the text and href of every link, 
				// and save them as properties of the result obj
				result.title = $(this).children('a').text();
				result.link = $(this).children('a').attr('href');

				// using our Story model, create a new entry.
				// Notice the (result):
				// This effectively passes the result object to the entry (and the title and link)
				var entry = new Story (result);

				// now, save that entry to the db
				entry.save(function(err, doc) {
					// log any errors
				  if (err) {
				    console.log(err);
				  } 
				  // or log the doc
				  else {
				    console.log(doc);
				  }
				});


    });
  });
  // tell the browser that we finished scraping the text.
  res.send("Scrape Complete");
});

// this will get the Storys we scraped from the mongoDB
app.get('/Stories', function(req, res){
	// grab every doc in the Storys array
	Story.find({}, function(err, doc){
		// log any errors
		if (err){
			console.log(err);
		} 
		// or send the doc to the browser as a json object
		else {
			res.json(doc);
		}
	});
});

// grab an Story by it's ObjectId
app.get('/Stories/:id', function(req, res){
	// using the id passed in the id parameter, 
	// prepare a query that finds the matching one in our db...
	Story.findOne({'_id': req.params.id})
	// and populate all of the notes associated with it.
	.populate('thought')
	// now, execute our query
	.exec(function(err, doc){
		// log any errors
		if (err){
			console.log(err);
		} 
		// otherwise, send the doc to the browser as a json object
		else {
			res.json(doc);
		}
	});
});


// replace the existing thought of an Story with a new one
// or if no thought exists for an Story, make the posted thought it's thought.
app.post('/Stories/:id', function(req, res){
	// create a new thought and pass the req.body to the entry.
	var newThought = new Thought(req.body);

	// and save the new thought the db
	newThought.save(function(err, doc){
		// log any errors
		if(err){
			console.log(err);
		} 
		// otherwise
		else {
			// using the Story id passed in the id parameter of our url, 
			// prepare a query that finds the matching Story in our db
			// and update it to make it's lone thought the one we just saved
			Story.findOneAndUpdate({'_id': req.params.id}, {'thought':doc._id})
			// execute the above query
			.exec(function(err, doc){
				// log any errors
				if (err){
					console.log(err);
				} else {
					// or send the document to the browser
					res.send(doc);
				}
			});
		}
	});
});







// listen on port 5000
app.listen(5000, function() {
  console.log('App running on port 5000!');
});
