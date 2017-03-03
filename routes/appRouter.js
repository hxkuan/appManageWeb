var express = require('express');
var router = express.Router();
var db = require('../module/dbTools.js');

//路由使用的中间件
router.use((req, res, next)=> {
  console.log('time:' + Date.now());
  next();
});

// 登陆后才能查看
router.get('/', (req, res)=> {
  // res.send('-----apk list-------');
  db.getAppList().then((results, fields)=> {
    res.json({data: results});
  }).catch((e)=> {
    res.render('err', {errorCode: e.status, errorMsg: e.stack});
  });

});

// 登陆后才能看
router.get('/detail', (req, res)=> {
  // res.send('-----apk detail-------');
  let id = req.query.id;
  let parm = {};
  let appPro = db.getAppById(id).then((results, fields)=> {
    parm.appInfo = results
  });
  let verPro = db.getVersionListByAppId(id).then((results, fields)=> {
    parm.appVersions = results
  });
  Promise.all(appPro,verPro).then(()=>res.json({data: parm})).catch((e)=> {
    res.render('err', {errorCode: e.status, errorMsg: e.stack});
  })
});

module.exports = router;
