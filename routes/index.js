var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/user', function(req, res, next) {
  res.send('respond with a resource2');
});

module.exports = router;

module.exports = router;
