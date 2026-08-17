var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');

/* GET home page. */
router.get('/', ctrlMain.index);
router.post('/', function(req, res) {
  res.redirect(303, '/');
});

// Static pages still link to the old filename; the homepage is now a view at /
router.get(['/index', '/index.html'], function(req, res) {
  res.redirect('/');
});
router.post('/index.html', function(req, res) {
  res.redirect(303, '/');
});

// Same situation for the old travel.html filename
router.get('/travel.html', function(req, res) {
  res.redirect('/travel');
});

module.exports = router;
//var express = require('express');
//var router = express.Router();
//
///* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
//});
//
//module.exports = router;
