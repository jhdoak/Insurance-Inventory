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
  var alicia  = new User({ name: 'Alicia',  email: 'alicia@doak.com',  password: 'abc123' });
  var michael = new User({ name: 'Michael', email: 'michael@mike.com', password: 'abc123' });
  return User.create([justin, alicia, michael]);
})
.then(function(allUsers) {
  console.log('allUsers:', allUsers);
  console.log('%s, %s, and %s created!', allUsers[0].name, allUsers[1].name, allUsers[2].name);
  console.log('Giving users new homes...');
  allUsers[0].homes.push(new Home({ name: 'Family Home', address: '123 This St.' }));
  console.log('User0:', allUsers[0]);
  allUsers[1].homes.push(new Home({ name: 'Beach Home',  address: '1000 Beach Rd.' }));
  console.log('User1:', allUsers[1]);
  allUsers[2].homes.push(new Home({ name: 'Apartment',   address: '195 Univ. Ave.' }));
  console.log('User2:', allUsers[2]);
  return allUsers.map(function(user) { return user.save(); });
})
.spread(function(user0, user1, user2) {
  return User.find({});
})
.then(function(usersWithHomes) {
  console.log('\n ========== \n');
  console.log('usersWithHomes:', usersWithHomes);
  console.log('Homes saved to users!');
  console.log('Creating items...');
  var tv       = new Item({ name: 'Living Room TV', brand: 'LG', model: '55LGVS-T', category: 'electronics'});
  var couch    = new Item({ name: 'Couch',          brand: 'West Elm',              category: 'furniture'  });
  var blender  = new Item({ name: 'Blender',        brand: 'LG', model: '55LGVS-T', category: 'appliances' });
  var computer = new Item({ name: 'Living Room TV', brand: 'LG', model: '55LGVS-T', category: 'electronics'});
  return Item.create([tv, couch, blender, computer]);
})
.then(function(allItems) {
  console.log('Items created!');
  console.log('Associating items with owners');
  return User.find({});
})
.then(function(allUsers) {
  console.log('allUsers:', allUsers);
  // console.log(allUsers)
  allUsers[0].homes[0].inventory.push(allItems[0]._id);
  allUsers[0].homes[0].inventory.push(allItems[1]._id);
  allUsers[1].homes[0].inventory.push(allItems[2]._id);
  allUsers[2].homes[0].inventory.push(allItems[3]._id);
  return allUsers.map(function(user) { return user.save(); });
})
.spread(function(...usersWithHomesWithItems) {
  console.log('\nusersWithHomesWithItems:', usersWithHomesWithItems);
  return Item.find();
})
.then(function(allItems) {
  console.log('Owners given item ids!');
  console.log('Giving items the IDs of their owners');
  allItems[0].home.push(Home.find({})[0]._id);
  allItems[1].home.push(Home.find({})[0]._id);
  allItems[2].home.push(Home.find({})[1]._id);
  allItems[3].home.push(Home.find({})[2]._id);
  allItems.map(function(item) { return item.save() });
})
.spread(function(...items) {
  return User.find({});
})
.then(function(users) {
  allUsers.forEach(function(user) {
    console.log(user);
  });
  return Item.find({});
})
.then(function(allItems) {
  allItems.forEach(function(item) {
    console.log(item);
  });
  quit();
}, function(err) {
  return handleError(err);
});
