module.exports = function (req, res, next) {
  console.log('Received ' + req.method + ' from ' + req.path);
  console.log(req.session.id);
  next();
};
