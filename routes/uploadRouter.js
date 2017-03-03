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
    let appName= req.params.appName;
    let appIconUrl= req.params.appIconUrl;
    let appInfo= req.params.appInfo;
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

        let pg=manifest.package;
        let appEName=appName || pg.substring(pg.lastIndexOf('.')+1);
        let appCName=manifest.application.label;

        db.checkAppInfo(manifest.package,appEName).then(re=>{
            if (re.idNum>0){
                let v={
                    versionCode:manifest.versionCode,
                    versionName:manifest.versionName,
                    apkUri:'/'+avatarName
                };
                db.insertAppVersionByApplicationId(v,manifest.package).then(()=>{
                    //TODO
                    res.json({'data':files,'uri':'/'+avatarName,'appEName':appEName});
                });
            }else {
                if (re. appENameNum>0){
                    res.json({'errorMeg':'repeat appEName'});
                }else {
                    let i={
                        applicationId:manifest.package,
                        appEName:appEName,
                        appCName:appCName,
                        appIconUrl:appIconUrl,
                        appInfo:appInfo
                    };
                    let v={
                        versionCode:manifest.versionCode,
                        versionName:manifest.versionName,
                        apkUri:'/'+avatarName
                    };

                    db.insertAppInfo(i).then((r)=>{
                        db.insertAppVersion(v,r.insertId).then((s)=>{
                            db.setCurrentVersionId(r.insertId,s.insertId);//TODO 测试所用 默认给第一个上传的app包就是正式包
                        });
                    }).then(()=>{
                        //TODO
                        res.json({'data':files,'url':'/'+avatarName,'appEName':appEName,appCName:appCName});
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
