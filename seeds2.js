var mongoose = require('mongoose');
var Home     = require('./models/home');
var User     = require('./models/user');
var Item     = require('./models/item');

mongoose.Promise = require('bluebird');

mongoose.connect('mongodb://localhost/insurance-inventory');

function quit() {
  mongoose.disconnect();
  console.log('\nQuitting!');
}

// a simple error handler
function handleError(err) {
  console.log('ERROR:', err);
  quit();
  return err;
}

console.log('removing all items');
Item.remove({})
.then(function() {
  console.log('all items removed');
  console.log('removing all users and their homes');
  return User.remove({});
})
.then(function() {
  console.log('all users and homes removed');
  console.log('creating new users...');
  var justin  = new User({ name: 'Justin',  email: 'doak@doak.com',    password: 'abc123' });
  return User.create(justin);
})
.then(function(savedUser) {
  console.log('savedUser:', savedUser);

  console.log('Giving Justin a new home...');
  savedUser.homes.push(new Home({ name: 'Family Home', address: '123 This St.' }));
  console.log('savedUser:', savedUser);
  return savedUser.save();
})
.then(function(user) {
  return User.find();
})
.then(function(usersWithHomes) {
  console.log('\n ========== \n');
  console.log('usersWithHomes:', usersWithHomes);
  quit();
}, function(err) {
  return handleError(err);
});
