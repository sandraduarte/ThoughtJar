// Dependencies

var express = require('express');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var Article = mongoose.model('Article');
var Comment = mongoose.model('Comment');

var request = require('request');
var cheerio = require('cheerio');

var passport = require('passport');

// create the express router
var router = express.Router();


// HOME PAGE
// router.get('/', function(req, res) {
//     res.render('login');
//         });



router.get('/', function(req, res) {
  
            // console.log('articles: ' + JSON.stringify(articles));
            res.redirect('/login');
          
        });





// this will get the articles we scraped from the mongoDB
router.get('/articles', function(req, res){

    scrape();
    // Pull the articles from the database
    Article.find().lean().sort({ createdAt: -1 }).exec({}, function(error, articles) {
        if (error) {
            reject(Error(error));
        } else {
            // console.log('articles: ' + JSON.stringify(articles));
            res.render('index', {
                articles: articles,
                user: req.user
            });
        }
    });
});

// grab an article by it's ObjectId
router.get('/articles/:id', function(req, res){
    var id = req.params.id;
    Article.find().lean().exec({_id:id}, '_id title link img', function(err, article) {
      if (err) console.log(err);
      res.json(article);
    });
});


// replace the existing note of an article with a new one
// or if no note exists for an article, make the posted note it's note.
router.post('/articles/:id', function(req, res){
    var comment = new Comment(req.body);
  // add the username and userId to comment
  comment.authorId = req.user.id;
  comment.author = req.user.username;
  comment.save(function(error, doc) {
    if (error){
      console.log(error);
    }
  });
});

router.get('/articles/:id/comments', function(req, res) {
  console.log("\nreq ID: " + req.params.id);
  var articleId = req.params.id;
  Comment.find({article: new ObjectId(articleId)}, 'text author authorId', function(err, comments){
    if (err) console.log(err);
    console.log(comments);
    res.json(comments);
  });
});

router.get('/articles/:articleId/comments/:commentId/delete', function(req, res) {
 articleId = req.params.article;
 commentId = req.params._id;

  Comment.findOneAndRemove({_id: new ObjectId(commentId)}, function (err,comment){
            if(err) { 
                throw err; 
            } else {
                res.redirect('/articles');

            }
    // ...

  

    });

});

router.delete('/articles/:articleid/comments/:commentid/delete', function(req, res){


});




router.get('/scrape', function(req, res) {
    scrape();
});

function scrape(req,res){

return new Promise (function (resolve, reject) {
    // first, we grab the body of the html with request
  request('http://borboletabeauty.com/blogs/news', function(error, response, html) {
    // then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // now, we grab every h2 within an article tag, and do the following:
    $('li h2').each(function(i, element) {

            // save an empty result object
                var result = {};
                var siteURL= 'http://borboletabeauty.com';

                // add the text and href of every link, 
                // and save them as properties of the result obj
                result.title = $(this).children('a').text();
                result.link = siteURL+$(this).children('a').attr('href');

                // create new article to save to the Database
                var article = new Article(result);

                console.log("\nArticle: " + article);

                // check if the article is already in the Database
                Article.findOne({
                    title: article.title
                }, 'title link img', function(error, found) {

                    if (found) {
                        // if article with same title is found, do not save the article in the database
                        console.log('story already in database');
                    } else {
                        // if no match, save the article in the database
                        article.save(function(err, doc) {
                            if (err) {
                                reject(Error(err));
                            } else {

                                resolve(console.log("\n" + doc));
                            }
                        });
                    }
                });
            });


            console.log("Scrape Complete.");
            resolve();
         });
    });
  }
function isLoggedIn(req, res, next) {

    if (req.user.authenticated)
        return next();
    res.redirect('/');
}


module.exports = router;
