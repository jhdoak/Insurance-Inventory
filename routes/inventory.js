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
  var items = home.inventory.populate('Item');
  res.render('inventory/index', { home: home, items: items, message: req.flash() });
});


//  User.homes.findOne({ _id: req.params.homeid })
//  .populate('inventory')
//  .exec(function (err, home) {
//    if (err) return handleError(err);
//    console.log('populatedhome:', home);
//    res.render('inventory/index', { home: home, message: req.flash() });
//  });
//});


// Get new item page
router.get('/:homeid/new', authenticate, function(req, res, next) {
  var home = currentUser.homes.id(req.params.homeid);
  res.render('inventory/new', { home: home, message: req.flash() });
});

// Create new item
router.post('/:homeid', authenticate, function(req, res, next) {
  var item = new Item ({
    name           : req.body.name,
    brand          : req.body.brand,
    itemModel      : req.body.itemModel,
    serial         : req.body.serial,
    category       : req.body.category,
    purchaseDate   : req.body.purchaseDate,
    pricePaid      : req.body.pricePaid,
    estimatedValue : req.body.estimatedValue,
    otherNotes     : req.body.otherNotes,
    home           : req.params.homeid
  });
  Item.create(item)
  .then(function(createdItem) {
    currentUser.homes.id(req.params.homeid).inventory.push(createdItem._id);
    return currentUser.save();
  })
  .then(function() {
    var home = currentUser.homes.id(req.params.homeid);
    res.render('inventory/index', { home: home, message: req.flash() });
  }, function(err) {
    return next(err);
  });
});



module.exports = router;
