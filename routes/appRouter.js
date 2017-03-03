var express=require('express');
var router=express.Router();

//路由使用的中间件
router.use((req,res,next)=>{
    console.log('time:'+Date.now());
    next();
});

// 登陆后才能查看
router.get('/',(req,res)=>{
   res.send('-----apk list-------');
});

// 登陆后才能看
router.get('/detail',(req,res)=>{
    res.send('-----apk detail-------');
});

module.exports=router;
