var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');
var ctrlPages = require('../controllers/pages');

/* GET home page. */
router.get('/', ctrlMain.index);
router.post('/', function(req, res) {
  res.redirect(303, '/');
});

/* Customer-facing pages converted from static HTML */
router.get('/rooms', ctrlPages.rooms);
router.get('/meals', ctrlPages.meals);
router.get('/news', ctrlPages.news);
router.get('/about', ctrlPages.about);
router.get('/contact', ctrlPages.contact);
router.post('/contact', ctrlPages.contactSubmit);

/* Redirect leftover .html filenames to clean routes */
router.get(['/index', '/index.html'], function(req, res) {
  res.redirect('/');
});
router.post('/index.html', function(req, res) {
  res.redirect(303, '/');
});
router.get('/travel.html', function(req, res) {
  res.redirect('/travel');
});
router.get('/rooms.html', function(req, res) {
  res.redirect('/rooms');
});
router.get('/meals.html', function(req, res) {
  res.redirect('/meals');
});
router.get('/news.html', function(req, res) {
  res.redirect('/news');
});
router.get('/about.html', function(req, res) {
  res.redirect('/about');
});
router.get('/contact.html', function(req, res) {
  res.redirect('/contact');
});

module.exports = router;
