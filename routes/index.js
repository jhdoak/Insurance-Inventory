var express  = require('express');
var router   = express.Router();
var passport = require('passport');
var aws      = require('aws-sdk');
const S3_BUCKET = process.env.S3_BUCKET;

// GET home page
router.get('/', function(req, res, next) {
  res.render('index.ejs', { title: 'Express', message: req.flash() });
});

// GET /signup
router.get('/signup', function(req, res, next) {
  res.render('signup.ejs', { message: req.flash() });
});

// POST /signup
router.post('/signup', function(req, res, next) {
  var signUpStrategy = passport.authenticate('local-signup', {
    successRedirect : '/',
    failureRedirect : '/signup',
    failureFlash : true
  });
  return signUpStrategy(req, res, next);
});

// GET /login
router.get('/login', function(req, res, next) {
  res.render('login.ejs', { message: req.flash() });
});

// POST /login
router.post('/login', function(req, res, next) {
  var loginProperty = passport.authenticate('local-login', {
    successRedirect : '/',
    failureRedirect : '/login',
    failureFlash : true
  });

  return loginProperty(req, res, next);
});

// GET /logout
router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});


// Create a signed URL to make a
// PUT request to S3
router.get('/sign-s3', (req, res) => {
  console.log("/SIGN-S3!!")
  const s3 = new aws.S3();
  console.log("still going!");
  const fileName = req.query['file-name'];
  console.log("fileName:", fileName);
  const fileType = req.query['file-type'];
  console.log("fileType:", fileType);
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };
  console.log("s3Params:", s3Params);

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

module.exports = router;
