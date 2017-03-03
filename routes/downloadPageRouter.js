/**
 * Created by huangxiangkuan on 2017/2/10.
 */
var express=require('express');
var router=express.Router();
var db=require('../module/dbTools.js');

router.get('/:app',(req,res)=>{
    let app=req.params.app;
    let id=req.query.id;
    let promise;
    if(id){
        promise= new Promise((resolve,reject)=>db.getAppInfoById(id).then((results, fields)=>{
            if (results && app!=results.appEName)resolve(null, fields);
            resolve(results, fields);
        }))
    }else if (app){
        promise= db.getCurrentAppInfo(app);
    }
    promise&&promise.then((results, fields)=>{
        res.json({'query':req.query,'params':req.params.app,'results':results});
    }).catch((e)=>{
        res.render('err',{errorCode:e.status,errorMsg: e.stack});
    });
});

module.exports=router;
