/**
 * app 宝管理页面
 */

var express = require('express');
var router = express.Router();
var db = require('../module/dbTools.js');
var config=require('../configs/config')

//路由使用的中间件
router.use((req, res, next)=> {
  console.log('time:' + Date.now());
  next();
});

// app列表页（登陆后才能查看）
router.get('/', (req, res)=> {
  // res.send('-----apk list-------');
  db.getAppList().then((results, fields)=> {
    // res.json({data: results});
    res.render('appList',{data: results,apkDir:config.apkDir});
  }).catch((e)=> {
    res.render('err', {errorCode: e.status, errorMsg: e.stack});
  });

});

// app详情页（登陆后才能看）
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
  Promise.all([appPro,verPro]).then(()=>{
    parm.apkDir=config.apkDir;
    res.render('appDetail',parm);
  }).catch((e)=> {
    res.render('err', {errorCode: e.status, errorMsg: e.stack});
  })
});

module.exports = router;
