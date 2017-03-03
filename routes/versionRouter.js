/**
 * version，用于手机端更新使用的url
 */
var express=require('express');
var router=express.Router();
var db=require('../module/dbTools.js');

router.get('/',(req,res)=>{
    let appName=req.query.app;
    console.log(appName);
    if(!appName)return;
    db.downloadInfo(appName).then((results,fields)=>{
        res.json(results);
    }).catch((e)=>{
        res.json({'error':e});
    })
});

module.exports=router;
