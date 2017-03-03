/**
 * Created by huangxiangkuan on 2017/2/10.
 */
var express=require('express');
var router=express.Router();
var db=require('../module/dbTools.js');

router.get('/*',(req,res)=>{
    res.json({'query':req.query,'params':req.params});
});

module.exports=router;
