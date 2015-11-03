var request = require('request');

exports.getUrlTitle = function(url, cb) {
  request(url, function(err, res, html) {
    if (err) {
      console.log('Error reading url heading: ', err);
      return cb(err);
    } else {
      var tag = /<title>(.*)<\/title>/;
      var match = html.match(tag);
      var title = match ? match[1] : url;
      return cb(err, title);
    }
  });
};

var rValidUrl = /^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i;

exports.isValidUrl = function(url) {
  return url.match(rValidUrl);
};

/************************************************************/
// Add additional utility functions below
/************************************************************/

var sessionStore = [];
// user: sessionID

// Session.regenerate()
  // creates a new session

// Session.save()
  // saves a session

// Session.destroy()
  // destroys a session


exports.createSession = function(userID, req) {
  req.session.regenerate( function(err) {
    if ( err ) {
      console.log(err);
    }
    sessionStore.push({userID: req.session.id});
    req.session.userID = userID;
  });
}


exports.checkUser = function(req) {
  // check if session is still valid
    // check if request sessionID equals user's stored sessionID

  // if not valid,
    // redirect to login page
  //new User({ })

  if ( req.session.id !== sessionStore[req.session.userID] ) {
    return false;
  }
  return true;
}