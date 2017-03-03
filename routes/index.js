var express = require('express');
var router = express.Router();

var appRouter=require('./appRouter.js');
var uploadRouter=require('./uploadRouter.js');
var downloadRouter=require('./downloadRouter.js');
var versionRouter=require('./versionRouter.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.use('/app',appRouter);
router.use('/upload',uploadRouter);
router.use('/download',downloadRouter);
router.use('/version',versionRouter);

module.exports = router;
