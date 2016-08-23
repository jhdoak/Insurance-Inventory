var express = require('express');
var router = express.Router();
var Home = require('../models/home');

function authenticate(req, res, next) {
  if(!req.isAuthenticated()) {
    req.flash('error', 'Please signup or login.');
    res.redirect('/');
  }
  else {
    next();
  }
}

/* GET users listing. */
router.get('/', authenticate, function(req, res, next) {
  res.send('respond with a resource');
});

// NEW
router.get('/:id/home/new', authenticate, function(req, res, next) {
  res.render('home/new', { message: req.flash() });
});

// CREATE
router.post('/:id/home/', authenticate, function(req, res, next) {
  var home = {
    name: req.body.name,
    address: req.body.address,
    residents: req.body.residents,
    description: req.body.description
  };
  currentUser.homes.push(home);
  currentUser.save()
  .then(function() {
    res.redirect('/');
  }, function(err) {
    return next(err);
  });
});

module.exports = router;
