/**
 * 接受处理上传的apk文件
 */
var express=require('express'),
    router=express.Router(),
    config=require('../configs/config.js'),
    formidable = require('formidable'),
    fs = require('fs'),
    tools = require('../module/tools.js'),
    db = require('../module/dbTools.js'),
    util = require('util');


router.use((req,res,next)=>{
    console.log('time:'+Date.now());
    next();
});

router.post('/',(req,res)=>{
    let form = new formidable.IncomingForm();
    form.encoding = 'utf-8';		//设置编辑
    form.uploadDir = config.root+'public/upload/';	 //设置上传目录
    form.keepExtensions = true;	 //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
    form.parse(req, function(err, fields, files) {
        if (err) {
            res.locals.error = err;
            res.json({'errorMeg':'upload err'});
            return;
        }

        let extName=tools.ext(files.upload.name);
        if (extName!='.apk'){
            //TODO 这里无法限制上传，限制上传待作
            res.json({'errorMeg':'只能上传apk文件'});
            return;
        }
        let avatarName = files.upload.name+new Date().getTime() + extName;
        let newPath = form.uploadDir + avatarName;
        console.log(newPath);
        fs.renameSync(files.upload.path, newPath);  //重命名

        let manifest=tools.getApkInfo(newPath);
        if (!manifest){
            res.json({'errorMeg':'manifest err'});
            return;
        }

        let appEName='E_'+Math.random();
        let appCName='C_'+Math.random();

        db.checkAppInfo(manifest.package,appEName).then(re=>{
            if (re.idNum>0){
                let v={
                    versionCode:manifest.versionCode,
                    versionName:manifest.versionName,
                    apkUri:'/'+avatarName
                };
                db.insertAppVersionByApplicationId(v,manifest.package).then(()=>{
                    //TODO
                    res.json({'data':files,'url':req.host+':'+config.port+'/'+newPath,'appEName':appEName});
                });
            }else {
                if (re. appENameNum>0){
                    res.json({'errorMeg':'repeat appEName'});
                }else {
                    let i={
                        applicationId:manifest.package,
                        appEName:appEName,
                        appCName:appCName,
                        appIconUrl:'',
                        appInfo:''
                    };
                    let v={
                        versionCode:manifest.versionCode,
                        versionName:manifest.versionName,
                        apkUri:'/'+avatarName
                    };

                    db.insertAppInfo(i).then((r)=>{
                        db.insertAppVersion(v,r.insertId);
                    }).then(()=>{
                        //TODO
                        res.json({'data':files,'url':req.host+':'+config.port+'/'+newPath,'appEName':appEName});
                    });
                }
            }
        })

    });
});

router.get('/',(req,res)=>{
    res.send(    '<form action="/upload" enctype="multipart/form-data" method="post">'+
        '<input type="text" name="title"><br>'+
        '<input type="file" name="upload" multiple="multiple"><br>'+
        '<input type="submit" value="Upload">'+
        '</form>');
});

module.exports=router;
