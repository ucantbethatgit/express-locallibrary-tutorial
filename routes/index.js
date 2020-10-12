var express = require('express');
var router = express.Router();
var User = require('../models/user');
var mid = require('../middleware');

// GET home page.
router.get('/', function(req, res) {
  res.redirect('/catalog');
});

// GET /register
router.get('/register', function(req, res, next) {
  //return res.send('Register today!');
  return res.render('register', { title: 'Sign Up for Membership privileges' });
});

// GET /logout
router.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

// GET /login
router.get('/login', function(req, res, next) {
  //return res.send('Register today!');
  return res.render('login', { title: 'member Zone' });
});

// POST /login
router.post('/login', function(req, res, next) {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      }  else {
        req.session.userId = user._id;
 //     return res.redirect('/profile');
        return res.render('profile', {title: 'You are now in the member zone'});
      }
    });
  } else {
    var err = new Error('Email and password are required.');
    err.status = 401;
    return next(err);
  }
});

// POST /register
router.post('/register', function(req, res, next) {
  if (req.body.email &&
    req.body.name &&
    req.body.favoriteBook &&
    req.body.password &&
    req.body.confirmPassword) {

      // confirm that user typed same password twice
      if (req.body.password !== req.body.confirmPassword) {
        var err = new Error('Passwords do not match.');
        err.status = 400;
        return next(err);
      }

      // create object with form input
      var userData = {
        email: req.body.email,
        name: req.body.name,
        favoriteBook: req.body.favoriteBook,
        password: req.body.password
      };

      // use schema's `create` method to insert document into Mongo
      User.create(userData, function (error, user) {
        if (error) {
          return next(error);
        } else {
          req.session.userId = user._id;
 //         return res.redirect('/profile');
 //         return res.redirect('/catalog');
            return res.render('profile', { title: 'the profile page' });
        }
      });

    } 
      else {
      var err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
})

module.exports = router;
