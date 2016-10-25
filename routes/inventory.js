var express = require('express');
var router  = express.Router();
var Item    = require('../models/item');
var User    = require('../models/user');

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

/* GET inventory home page. */
router.get('/:homeid', authenticate, function(req, res, next) {
  var home  = currentUser.homes.id(req.params.homeid);
  var items = home.inventory;
  res.render('inventory/index', { home: home, items: items, message: req.flash() });
});

// Get new item page
router.get('/:homeid/new', authenticate, function(req, res, next) {
  var home = currentUser.homes.id(req.params.homeid);
  res.render('inventory/new', { home: home, message: req.flash() });
});

// Create new item
router.post('/:homeid', authenticate, function(req, res, next) {




  var item = ({
    name           : req.body.name,
    brand          : req.body.brand,
    itemModel      : req.body.itemModel,
    picture        : req.body.picture,
    serial         : req.body.serial,
    category       : req.body.category,
    purchaseDate   : req.body.purchaseDate,
    pricePaid      : req.body.pricePaid,
    estimatedValue : req.body.estimatedValue,
    otherNotes     : req.body.otherNotes,
  });
  currentUser.homes.id(req.params.homeid).inventory.push(item);
  currentUser.save()
  .then(function() {
    res.redirect('/inventory/' + req.params.homeid);
  }, function(err) {
    return next(err);
  });
});

// Get view item page
router.get('/:homeid/item/:itemid', authenticate, function(req, res, next) {
  var home = currentUser.homes.id(req.params.homeid);
  var item = home.inventory.id(req.params.itemid);
  res.render('inventory/show', { home: home, item: item, message: req.flash() });
})

// Get item edit page
router.get('/:homeid/item/:itemid/edit',  authenticate, function(req, res, next) {
  var home = currentUser.homes.id(req.params.homeid);
  var item = home.inventory.id(req.params.itemid);
  res.render('inventory/edit', { home: home, item: item, message: req.flash() });
})

// Update item
router.put('/:homeid/item/:itemid', authenticate, function(req, res, next) {
  var home = currentUser.homes.id(req.params.homeid);
  var item = currentUser.homes.id(req.params.homeid).inventory.id(req.params.itemid);
  if (!home || !item) return next(makeError(res, 'Document not found', 404));
  else {
    item.name           = req.body.name;
    item.brand          = req.body.brand;
    item.itemModel      = req.body.itemModel;
    item.picture        = req.body.picture;
    item.serial         = req.body.serial;
    item.category       = req.body.category;
    item.purchaseDate   = req.body.purchaseDate;
    item.pricePaid      = req.body.pricePaid;
    item.estimatedValue = req.body.estimatedValue;
    item.otherNotes     = req.body.otherNotes;
    currentUser.save()
    .then(function(savedUser) {
      res.redirect('/inventory/' + req.params.homeid + '/item/' + req.params.itemid);
    }, function(err) {
      return next(err);
    });
  }
});

// Delete item
router.delete('/:homeid/item/:itemid', authenticate, function(req, res, next) {
  var item = currentUser.homes.id(req.params.homeid).inventory.id(req.params.itemid);
  if (!item) return next(makeError(res, 'Document not found', 404));
  var index = currentUser.homes.id(req.params.homeid).inventory.indexOf(item);
  currentUser.homes.id(req.params.homeid).inventory.splice(index, 1);
  currentUser.save()
  .then(function(saved) {
    res.redirect('/inventory/' + req.params.homeid);
  }, function(err) {
    return next(err);
  });
});

module.exports = router;
