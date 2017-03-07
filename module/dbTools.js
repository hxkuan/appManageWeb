var mysql      = require('mysql');
var config=require('../configs/config.js');
var connection = mysql.createConnection(config.dbConfig);

function commonMethod(callback){
    connection = mysql.createConnection(connection.config);
    connection.connect();
    callback.call(connection,callback);
    connection.end();
};


function query(sql){
    return new Promise((resolve,reject)=>{
        commonMethod(()=>{
            connection.query(sql, function (error, results, fields) {
                if (error) reject(error);
                console.log('The solution is: ', results);
                resolve(results,fields);
            });
        });
    });
}
exports.query=query;

/**
 * 只获取一条数据
 * @param sql
 * @returns {Promise}
 */
function query_one(sql){
    console.log('sql---'+sql);
    return new Promise((resolve,reject)=>{
        commonMethod(()=>{
            connection.query(sql, function (error, results, fields) {
                if (error) reject(error);
                console.log('The solution is: ', results);
                if (results.length>0){
                    resolve(results[0],fields);
                }else {
                    resolve(null,fields);
                }
            });
        });
    });
}
exports.query_one=query_one;

exports.getAppList=()=>{
    let sql='SELECT i.id,i.applicationId,i.appEName,i.appCName,' +
      'i.appIconUrl,i.appInfo,v.id versionId,v.versionCode,v.versionName,' +
      'v.versionInfo,v.uploadTime,v.apkUri url,v.apkSize FROM app_apk_info i,' +
      'app_apk_version v WHERE i.currentVersionId=v.id';
    return query(sql);
}

exports.getCurrentAppInfo=(appEName)=>{
    let sql="SELECT i.id,i.applicationId,i.appEName,i.appCName,i.appIconUrl,i.appInfo,"+
        "v.id versionId,v.versionCode,v.versionName,v.versionInfo,v.uploadTime,v.apkUri url,v.apkSize "+
    "FROM app_apk_info i,app_apk_version v WHERE i.currentVersionId=v.id AND i.appEName='"+appEName+"'";
    return query_one(sql);
}

exports.getAppInfoById=(id)=>{
    let sql="SELECT i.id,i.applicationId,i.appEName,i.appCName,i.appIconUrl," +
      "i.appInfo,v.id versionId,v.versionCode,v.versionName,v.versionInfo,v.uploadTime," +
      "v.apkUri url,v.apkSize, v.mainVersion FROM app_apk_info i,app_apk_version v WHERE v.appId=i.id AND " +
      " v.id="+id;
    return query_one(sql);
}

exports.getAppById=(id)=>{
    let sql='SELECT * FROM app_apk_info i WHERE i.id='+id;
    return query_one(sql);
}


exports.getVersionListByAppId=(appId)=>{
    let sql='SELECT * FROM app_apk_version v WHERE v.appId='+appId;
    return query(sql);
}

/**
 * 返回
 * 对应applicationId的app个数：idNum 和
 * 对应appEName的app个数：appENameNum
 * @param applicationId
 * @param appEName
 * @returns {Promise}
 */
exports.checkAppInfo=(applicationId,appEName)=>{
    let sql="SELECT a.idNum,b.appENameNum FROM "+
    "(SELECT COUNT(id) idNum FROM app_apk_info WHERE applicationId='"+applicationId+"') a,"+
      " (SELECT COUNT(id) appENameNum FROM app_apk_info WHERE appEName='"+appEName+"') b";
    return query_one(sql);
}

exports.insertAppInfo=(i)=>{
    let sql="INSERT INTO app_apk_info (applicationId,appEName,appCName,appIconUrl,appInfo) VALUES('"
        +i.applicationId+"','"+i.appEName+"','"+i.appCName+"','"+i.appIconUrl+"','"+i.appInfo+"')";
    console.log(sql);
    return query(sql);
}

exports.insertAppVersionByApplicationId=(v,applicationId)=>{
    let sql="INSERT INTO app_apk_version (appId,versionCode,versionName,apkUri,uploadTime,apkSize) "+
    "VALUES ((SELECT i.id FROM app_apk_info i WHERE i.applicationId ='"+applicationId+"')," +
        v.versionCode+",'"+v.versionName+"','"+v.apkUri+"',NOW(),"+v.apkSize+")";
    console.log(sql);
    return query(sql);
}

exports.insertAppVersion=(v,appId)=>{
    let sql="INSERT INTO app_apk_version (appId,versionCode,versionName,apkUri,uploadTime,apkSize) "+
        "VALUES ("+
        appId+"," +v.versionCode+",'"+v.versionName+"','"+v.apkUri+"',NOW(),"+v.apkSize+")";
    console.log(sql);
    return query(sql);
}

/**
 * 设置app的当前版本
 * 1.设置VersionId
 * 2.将对应的version中mainVersion设为值1
 * @param id
 * @param versionId
 */
exports.setCurrentVersionId=(id,versionId)=>{
    let sql_v='UPDATE app_apk_info  SET currentVersionId='+versionId+' WHERE id='+id;
    let sql_m='UPDATE app_apk_version  SET mainVersion=1 WHERE id='+versionId;
    Promise.all([query(sql_v), query(sql_m)]);
}

