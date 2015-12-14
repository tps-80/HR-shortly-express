var express = require('express');
var util = require('./lib/utility');
var partials = require('express-partials');
var bodyParser = require('body-parser');
var logger = require('./lib/logger');
var session = require('express-session')


var db = require('./app/config');
var Users = require('./app/collections/users');
var User = require('./app/models/user');
var Links = require('./app/collections/links');
var Link = require('./app/models/link');
var Click = require('./app/models/click');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(session({
  secret: 'mySecret',
  resave: true,
  saveUninitialized: true
}));
app.use(logger);
app.use(partials());
// Parse JSON (uniform resource locators)
app.use(bodyParser.json());
// Parse forms (signup/login)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


app.get('/', util.checkUser, 02048c6ad6840224ef15ad631a2134e699b310ce
function(req, res) {
  // if ( util.checkUser(req) )   {
  //   res.render('index');
  // } else {
  //   res.redirect('/login');
  // }
  res.render('index');
});

app.get('/create', util.checkUser,
function(req, res) {
  res.render('index');
});

app.get('/links', util.checkUser,
function(req, res) {
  Links.reset().fetch().then(function(links) {
    res.send(200, links.models);
  });
});

// path for /signup
  // render template for signup
app.get('/signup', 
  function(req, res) {
    console.log('in signup handler');
    res.render('signup');
  });



// path for /login
  // render template for login
app.get('/login', 
  function(req, res) {
    res.render('login');
  });


app.post('/links', util.checkUser,
function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  new Link({ url: uri }).fetch().then(function(found) {
    if (found) {
      res.send(200, found.attributes);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        Links.create({
          url: uri,
          title: title,
          base_url: req.headers.origin
        })
        .then(function(newLink) {
          res.send(200, newLink);
        });
      });
    }
  });
});

/************************************************************/
// Write your authentication routes here
/************************************************************/

app.post('/signup',
function(req, res) {
  //read the request (username/password) 
  //initiate database connection to users table
  //write username and password to users table
    //if successful 
      //send 302 redirect to '/'
    //if err
      //send 404
  var username = req.body.username;
  var password = req.body.password;

 
  Users.create({
    username: username,
    password: password
  })
  .then(function(user) {
    util.createSession(user.attributes.id, req);
    res.redirect('/');
    //how do we check for an error?
  });
    
});

app.post('/login', 
  function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    // if username exists within the users table,
      // if password = password in users
        // redirect to '/'
      // if wrong password
        // redirect back to the login page
    // if username doesn't exist
      // redirect back to login

    new User({ username: username }).fetch()
      .then( function( user ) {
        if ( user ) {
          if ( user.attributes.password === password ) {

                util.createSession(user.attributes.id, req);
                res.redirect('/');
          
          } else {
            res.redirect('/login');
          }
        } else {
          res.redirect('/login');
        }
      });


  });


/************************************************************/
// Handle the wildcard route last - if all other routes fail
// assume the route is a short code and try and handle it here.
// If the short-code doesn't exist, send the user to '/'
/************************************************************/

app.get('/*', function(req, res) {
  new Link({ code: req.params[0] }).fetch().then(function(link) {
    if (!link) {
      res.redirect('/');
    } else {
      var click = new Click({
        link_id: link.get('id')
      });

      click.save().then(function() {
        link.set('visits', link.get('visits')+1);
        link.save().then(function() {
          return res.redirect(link.get('url'));
        });
      });
    }
  });
});

console.log('Shortly is listening on 4568');
app.listen(4568);
