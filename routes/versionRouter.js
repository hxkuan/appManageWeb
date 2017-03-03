/**
 * version，用于手机端更新使用的url
 */
var express=require('express');
var router=express.Router();
var db=require('../module/dbTools.js');

router.get('/:app',(req,res)=>{
    let appName=req.params.app;
    console.log(appName);
    if(!appName)return;
    db.getCurrentAppInfo(appName).then((results, fields)=>{
        res.json(results);
    }).catch((e)=>{
        res.render('err',{errorCode:e.status,errorMsg: e.stack});
    })
});

module.exports=router;
