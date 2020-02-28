// import objectAssign from 'tf-utils/lib/objectAssign';
import {objectAppend} from './index'; 
var config=require('../config/main');

/**
 * 构造函数
 * @constructor
 */
function IndexedDB(){
    this.TABLE_MSG='msg';//ownerId, type, typeId, userId, content, time
    this.TABLE_BROADCAST='broadcast';//ownerId, content, time
}

//IndexedDB.prototype.index_date=['date'];
//IndexedDB.prototype.keyRange={
//    //特定某个月的
//    atMonth:function(value){
//        //按月份最大天数进行对比
//        return IDBKeyRange.bound([value[0]+'-01'], [value[0]+'-31']);
//    },
//    inType:function(value){
//        return IDBKeyRange.only(value);
//    }
//};

/**
 * 打开数据库
 * @param callback
 */
IndexedDB.prototype.open=function(callback){
    var request = window.indexedDB.open(config.DB_NAME, config.DB_VERSION);
    request.onerror = function (e) {
        console.log('数据库打开出错', e.currentTarget.error);
    };
    request.onabort=function(e){
        console.log(e);
    };
    request.onsuccess = function (e) {
        var db = e.target.result;
        callback(db);
    };
    request.onupgradeneeded = function (e) {
        var db = e.target.result;
        var transaction=e.target.transaction;
        var store;
        //创建表

        //聊天消息表
        if (!db.objectStoreNames.contains(this.TABLE_MSG)) {
            store = db.createObjectStore(this.TABLE_MSG, {autoIncrement: true});
        }else{
            store=transaction.objectStore(this.TABLE_MSG);
            //删除所有索引
            let names=store.indexNames;
            for(let i=0;i<names.length;i++){
                store.deleteIndex(names[i]);
            }
        }
        store.createIndex('ownerId_type_typeId', ['ownerId', 'type', 'typeId'], {unique: false});
        store.createIndex('ownerId', 'ownerId', {unique: false});

        //广播消息表
        if (!db.objectStoreNames.contains(this.TABLE_BROADCAST)) {
            store = db.createObjectStore(this.TABLE_BROADCAST, {autoIncrement: true});
        }else{
            store=transaction.objectStore(this.TABLE_BROADCAST);
            //删除所有索引
            let names=store.indexNames;
            for(let i=0;i<names.length;i++){
                store.deleteIndex(names[i]);
            }
        }
        store.createIndex('ownerId', 'ownerId', {unique: false});

        console.log('DB version changed to ' + config.DB_VERSION);
    }.bind(this);
};

/**
 * 插入数据
 * @param storeName
 * @param data
 */
IndexedDB.prototype.add=function(storeName, data){
    this.open(function(db){
        var transaction=db.transaction(storeName, 'readwrite');
        var store=transaction.objectStore(storeName);
        //如果插入数据为数组，则为批量插入，否则直接插入
        if(Object.prototype.toString.apply(data) === '[object Array]'){
            data.forEach(function(o){
                store.add(o);
            });
        }else{
            store.add(data);
        }
        db.close();
    });
};

/**
 * 保存
 * @param storeName
 * @param id 主键字段
 * @param data 保存的对象
 */
IndexedDB.prototype.save=function(storeName, id, data){
    this.open(function(db){
        var transaction=db.transaction(storeName, 'readwrite');
        var store=transaction.objectStore(storeName);
        var request=store.get(+id);
        request.onsuccess=function(e){
            var row=e.target.result;
            objectAppend(row, data);
            store.put(row, +id);
        };
    });
};

/**
 * 保存
 * @param storeName
 * @param id 主键字段,不传则为删除全部
 */
IndexedDB.prototype.del=function(storeName, id){
    this.open(function(db){
        var transaction=db.transaction(storeName, 'readwrite');
        var store=transaction.objectStore(storeName);
        if(id) {
            store.delete(+id);
        }else{
            store.clear();
        }
    });
};

/**
 * 获取指定条件的数据列表
 * @param storeName
 * @param id 主键字段
 * @param callback
 */
IndexedDB.prototype.get=function(storeName, id, callback){
    this.open(function(db){
        var transaction=db.transaction(storeName, 'readonly');
        var store=transaction.objectStore(storeName);
        var request=store.get(+id);
        request.onsuccess=function(e){
            var row=e.target.result;
            callback(row);
        };
    });
};

/**
 * 获取指定条件的数据列表
 * @param storeName
 * @param callback
 * @param indexArr array 条件字段名
 * @param keyRange IDBKeyRange 条件对象
 * @param limit int 限制条数
 */
IndexedDB.prototype.getList=function(storeName, callback, indexArr, keyRange, limit){
    this.open(function(db){
        var transaction=db.transaction(storeName, 'readonly');
        var store=transaction.objectStore(storeName);
        var request;
        //不传条件则查询全部
        if(indexArr&&keyRange) {
            if(typeof indexArr !== 'string'){
                indexArr=indexArr.join('_');
            }
            //指定索引，条件查询
            var index = store.index(indexArr);
            //打开游标，进行遍历
            request = index.openCursor(keyRange);
        }else{
            request=store.openCursor();
        }
        var list=[];
        request.onsuccess=function(e){
            var cursor=e.target.result;
            if(cursor&&(!limit||list.length<limit)){
                var row=cursor.value;
                //set primary key
                row.primaryKey=cursor.primaryKey;
                list.push(row);
                cursor.continue();
            }else {
                callback(list);
                db.close();
            }
        };
    });
};

/**
 * 获取指定条件的数据数量
 * @param storeName
 * @param indexArr array 条件字段名
 * @param keyRange IDBKeyRange 条件对象
 * @param callback
 */
IndexedDB.prototype.getCount=function(storeName, callback, indexArr, keyRange){
    this.open(function(db){
        var transaction=db.transaction(storeName, 'readonly');
        var store=transaction.objectStore(storeName);
        var request;
        //不传条件则查询全部
        if(indexArr&&keyRange) {
            if(typeof indexArr !== 'string'){
                indexArr=indexArr.join('_');
            }
            //指定索引，条件查询
            var index = store.index(indexArr);
            //打开游标，进行遍历
            request = index.count(keyRange);
        }else{
            request=store.count();
        }
        request.onsuccess=function(e){
            var count=e.target.result;
            callback(count);
            db.close();
        };
    });
};

var _db = new IndexedDB();
if(process.env.NODE_ENV !=='production') {
    window.toffy_db = _db;
}
export default _db;