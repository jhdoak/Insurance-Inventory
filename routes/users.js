var express = require('express');
var router = express.Router();
var Home = require('../models/home');

function makeError(res, message, status) {
  res.statusCode = status;
  var error = new Error(message);
  error.status = status;
  return error;
}

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

// GET NEW HOME PAGE
router.get('/:id/home/new', authenticate, function(req, res, next) {
  res.render('home/new', { message: req.flash() });
});

// CREATE NEW HOME
router.post('/:id/home/', authenticate, function(req, res, next) {
  var home = {
    name        : req.body.name,
    address     : req.body.address,
    residents   : req.body.residents,
    description : req.body.description
  };
  currentUser.homes.push(home);
  currentUser.save()
  .then(function() {
    res.redirect('/');
  }, function(err) {
    return next(err);
  });
});

// GET HOME EDIT PAGE
router.get('/:id/home/:homeid/edit', authenticate, function(req, res, next) {
  var home = currentUser.homes.id(req.params.homeid);
  if (!home) return next(makeError(res, 'Document not found', 404));
  res.render('home/edit', { home: home, message: req.flash() });
});

// UPDATE HOME
router.put('/:id/home/:homeid', authenticate, function(req, res, next) {
  var home = currentUser.homes.id(req.params.homeid);
  if (!home) return next(makeError(res, 'Document not found', 404));
  else {
    home.name        = req.body.name;
    home.address     = req.body.address;
    home.residents   = req.body.residents;
    home.description = req.body.description;
    currentUser.save()
    .then(function(saved) {
      res.redirect('/');
    }, function(err) {
      return next(err);
    });
  }
});

// GET HOME DELETE PAGE
router.get('/:id/home/:homeid/delete', authenticate, function(req, res, next) {
  var home = currentUser.homes.id(req.params.homeid);
  if (!home) return next(makeError(res, 'Document not found', 404));
  res.render('home/delete', { home: home, message: req.flash() });
});

// DELETE HOME
router.delete('/:id/home/:homeid', authenticate, function(req, res, next) {
  var home = currentUser.homes.id(req.params.homeid);
  if (!home) return next(makeError(res, 'Document not found', 404));
  var index = currentUser.homes.indexOf(home);
  currentUser.homes.splice(index, 1);
  currentUser.save()
  .then(function(saved) {
    res.redirect('/');
  }, function(err) {
    return next(err);
  });
});


module.exports = router;
