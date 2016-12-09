// Dependencies

var express = require('express');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Comment = mongoose.model('Comment');
var Article = mongoose.model('Article');
// var models = require('../models');
var passport = require('passport');
var crypto = require('crypto');

// create the express router
var router = express.Router();

router.get('/', function(req, res) {

});

//=============================================
// USERS
//=============================================
router.get('/users', function(req, res) {
    User.find({}, 'id username', function(err, users) {
        res.json(users);
    });
});

router.get('/users/:username', function(req, res) {
    var userQuery = req.params.username;
    User.findOne({
        username: userQuery
    }, 'username _id').lean().exec(function(err, user) {
        res.render('user', {
            user: user
        });
    });// code to pull comments from DB breaks this
});

//=============================================
// SIGNUP
//=============================================
router.get('/signup', function(req, res) {
    res.render('signup');
});

router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/',
    failureRedirect: '/signup/',
    failureFlash: false
}));

//=============================================
// LOGIN
//=============================================
router.get('/login', function(req, res) {
    res.render('login');
});

router.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: false
}));

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;
