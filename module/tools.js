/**
 * Created by Administrator on 2017/1/21.
 */
var fs =require('fs');
var ApkReader = require('node-apk-parser');

/**
 * 首字母大写
 * @param str
 * @returns {string}
 */
exports.toUpperFirst= (str)=>{ // 正则法
  str = str.toLowerCase();
  var reg = /\b(\w)|\s(\w)/g; //  \b判断边界\s判断空格
  // var reg = /\s(\w)/g;
  return str.replace(reg,function(m){
    return m.toUpperCase()
  });
}

/**
 * 获得后缀名
 * @param name
 * @returns {string}
 */
exports.ext=(name)=> {
  let val='';
  let arr=/\.[^\.]+$/.exec(name);
  if (arr && arr.length>0)val=arr[0];
  return val;
}



exports.getFileName=(fullName)=> {
  var pos = fullName.lastIndexOf("/");
  if(pos == -1){pos = fullName.lastIndexOf("\\")}
  var filename = fullName.substr(pos +1)
  return filename;
}

exports.getApkInfo=(apkPath)=>{
  let manifest=null;
  if(fs.existsSync(apkPath)){
    let reader = ApkReader.readFile(apkPath);
     manifest = reader.readManifestSync();
  }
  return manifest;
}
