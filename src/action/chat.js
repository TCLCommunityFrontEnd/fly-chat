// var ajax=require('../utils/ajax');
import Axios from 'utils/axios';
import db from 'utils/db.js';
// var db=require('../utils/db');
var storage=require('utils/storage.js');
//var encrypt=require('../utils/encrypt');
//var cookie=require('../utils/cookie');
//var config=require('../config/api');
//var history=require('../history');
//var store=require('../store');
var config=require('../config/chat');
import {devBaseUrls,proBaseUrls} from 'config/api';
var ActionObj={};

const chatOpts = {
    devBaseUrl:devBaseUrls.baseUrl2,
    proBaseUrl:proBaseUrls.baseUrl2
}

/**
 * 统一上传文件的接口
 * @param file
 * @param callback
 */
// ActionObj.uploadFile=function(file, callback){
//     var fd=new FormData();
//     fd.append('uploadItem', file);
//     ajax.formData('/chat/upload.do', fd, function(url){
//         ajax.clearFileInput(file);

//         callback(url);
//     });
// };

/**
 * 加载联系人列表
 * @returns {Function}
 */
ActionObj.loadPersonList=function(){
    return dispatch => {
        const userInfo=storage.getUserInfo();
        let userList = storage.getUserList();
        //排除自己
        userList = userList.filter(user => userInfo.id != user.id);
        dispatch({
            type: 'CHAT_PERSON_LIST_DONE',
            list: userList
        });
    }
};

/**
 * 加载组织列表
 * @returns {Function}
 */
ActionObj.loadOrgList=function(){
    return dispatch => {
        const userInfo=storage.getUserInfo();
        if(userInfo) {
            //获取与当前登录者相关的所有组织
            var orgMap = storage.getOrgMap();
            var userMap = storage.getUserMap();
            var userList = storage.getUserList();
            var orgList = [{
                id: 0,
                type: 'ORG',
                key: 'ORG_0',
                name: userInfo.companyName,
                memberIds: userList.map(function (user) {
                    return user.id;
                })
            }];
            //只列出该员工所属的组织
            userMap[userInfo.id].orgIds.forEach(function (orgId) {
                var org = orgMap[orgId];
                orgList.push({
                    id: org.id,
                    type: 'ORG',
                    key: 'ORG_' + org.id,
                    name: org.name,
                    memberIds: userList.filter(function (user) {
                        return ~user.orgIds.indexOf(orgId);
                    }).map(function (user) {
                        return user.id;
                    })
                });
            });
            dispatch({
                type: 'CHAT_ORG_LIST_DONE',
                list: orgList
            });
        }
    }
};

/**
 * 加载通讯组列表
 * @returns {Function}
 */
ActionObj.loadGroupList=function(){
    return dispatch => {
        const userInfo=storage.getUserInfo();
        if(userInfo) {
            Axios.get('/chat-group/myGroups.do', {loginId: userInfo.id}, chatOpts).then((list)=>{
                //反序
                list.reverse();
                dispatch({
                    type: 'CHAT_GROUP_LIST_DONE',
                    list: list.map(function (group) {
                        group.id = group.autoId;
                        group.type = 'GROUP';
                        group.key = 'GROUP_' + group.id;
                        return group;
                    })
                });
            });
        }
    }
};

/**
 * 切换tab
 * @param tabId
 * @returns {Function}
 */
ActionObj.changeTab=function(tabId){
    return function (dispatch){
        var userInfo=storage.getUserInfo();
        if(userInfo) {
            dispatch({type: 'CHAT_TAB_CHANGE', tabId: tabId});
            //加载列表
            if (tabId == 3) {
                //群组tab
                //聊天组
                dispatch(ActionObj.loadGroupList());
            } else if (tabId == 1) { //默认聊天tab
                //每次都需要同步群组名
                Axios.get('/chat-group/myGroups.do', {loginId: userInfo.id}, function (list) {
                    var map = {};
                    list.forEach(function (o) {
                        map[o.autoId] = {
                            name: o.name,
                            memberIds: o.memberIds
                        };
                    });
                    dispatch({
                        type: 'CHAT_GROUP_SYNC',
                        groupMap: map
                    });
                });
            }
        }
    }
};

/**
 * 获取当前登录用户的聊天列表
 */
ActionObj.getChatList=function(){
    return (dispatch) => {
        const userInfo=storage.getUserInfo();
        if(userInfo&&userInfo.id){
            //获取聊天对象列表
            db.getList(db.TABLE_MSG, function (list) {
                //获取各对象的最新一条记录
                let chatList = [];
                let addedFlag = [];
                //倒序
                list.sort(function (a, b) {
                    return b.time - a.time;
                });

                list.forEach(function (msg) {
                    //手动构造id
                    msg.id = msg.type + '_' + msg.typeId; //光typeId无法保持唯一
                    if (!~addedFlag.indexOf(msg.id)) {
                        chatList.push(msg);
                        addedFlag.push(msg.id);
                    }
                });

                dispatch({
                    type: 'CHAT_CHAT_LIST_CHANGE',
                    list: chatList
                });
            }, 'ownerId', IDBKeyRange.only(userInfo.id));
        }
    }
};

/**
 * 刷新聊天列表
 * @param msg
 * @returns {Function}
 */
ActionObj.refreshChatList=function(msg){
    return function (dispatch, getState){
        var chatList=getState().Chat.chatList;
        if(!msg.id) {
            msg.id = msg.type + '_' + msg.typeId;
        }

        if(chatList.length) {
            //更新content和time
            for (var i = 0; i < chatList.length; i++) {
                if (chatList[i].id == msg.id) {
                    //有赋值的才设值
                    if(msg.content!==undefined) {
                        chatList[i].content = msg.content;
                        chatList[i].userId = msg.userId;
                        chatList[i].time = msg.time;
                    }
                    if(msg.unread!==undefined) {
                        //累加未读数，如果unread显式设为0的话，则清除未读数；否则累加
                        if(msg.unread==0){
                            chatList[i].unread=0;
                        }else {
                            chatList[i].unread = (chatList[i].unread || 0) + msg.unread;
                        }
                    }
                    break;
                }

                //如果是一条新聊天对象则插在最前面
                if(i==chatList.length-1){
                    chatList.unshift(msg);
                    //要及时跳出，否则死循环
                    break;
                }
            }

            //重新排序
            chatList.sort(function (a, b) {
                return b.time - a.time;
            });
        }else{
            chatList.push(msg);
        }

        dispatch({type:'CHAT_CHAT_LIST_CHANGE', list:chatList});
    }
};

/**
 * 切换聊天对象
 * @param obj
 * @returns {Function}
 */
ActionObj.changeChatObject=function(obj){
    return function (dispatch) {
        if(!obj.id){
            obj.id=obj.type+'_'+obj.typeId;
        }
        var userInfo=storage.getUserInfo();
        dispatch({
            type:'CHAT_OBJECT_CHANGE',
            obj:obj
        });

        //获取该对象的聊天消息
        db.getList(db.TABLE_MSG, function(list){
            //时间顺序
            list.sort(function(a, b){
                return a.time-b.time;
            });

            dispatch({
                type:'CHAT_OBJECT_CHANGE_DONE',
                list:list
            });
        }, 'ownerId_type_typeId', IDBKeyRange.only([userInfo.id, obj.type, +obj.typeId]));
    }
};

/**
 * 保存一条消息
 * @param data
 * @returns {Function}
 */
// ActionObj.saveMsg=function(data){
//     //data: ownerId, type, typeId, userId, content, time
//     var userInfo=storage.getUserInfo();

//     //插入一条数据
//     db.add(db.TABLE_MSG, {
//         ownerId:userInfo.id,
//         type:data.type,
//         typeId:+data.typeId,
//         userId:+data.userId,
//         content:data.content,
//         time:data.time
//     });

//     //该用户已保存消息数量
//     db.getCount(db.TABLE_MSG, function(count){
//         //超出的条数
//         var exceed=count-config.msgMaxCount;
//         if(exceed>0){
//             //把超出的具体记录查出来
//             db.getList(db.TABLE_MSG, function(list){
//                 //遍历删除
//                 list.forEach(function(o){
//                     db.del(db.TABLE_MSG, o.primaryKey);
//                 });
//             }, 'ownerId_type_typeId', IDBKeyRange.only([userInfo.id, data.type, +data.typeId]), exceed);
//         }
//     }, 'ownerId_type_typeId', IDBKeyRange.only([userInfo.id, data.type, +data.typeId]));
// };

/**
 * 删除聊天
 * @param id
 * @returns {Function}
 */
ActionObj.deleteChat=function(id){
    return function (dispatch){
        var userInfo=storage.getUserInfo();
        var s=id.split('_');
        var type=s[0];
        var typeId=+s[1];
        db.getList(db.TABLE_MSG, function(list){
            //遍历删除
            list.forEach(function(o){
                db.del(db.TABLE_MSG, o.primaryKey);
            });
        }, 'ownerId_type_typeId', IDBKeyRange.only([userInfo.id, type, typeId]));

        dispatch({type:'CHAT_CHAT_DELETE', id:id});
    }
};

/**
 * 添加成员
 * @param groupId
 * @param memberIds
 * @returns {Function}
 */
ActionObj.addMembers=function(groupId, memberIds){
    return function (dispatch){
        Axios.post('/chat-group/addMembers.do', {
            groupId:groupId,
            addIds:memberIds.join(',')
        }, chatOpts).then(()=>{
            dispatch({type:'CHAT_GROUP_MEMBER_ADD_DONE', groupId:groupId, memberIds:memberIds});
        });
    }
};

/**
 * 踢除成员
 * @param groupId
 * @param memberIds
 * @returns {Function}
 */
ActionObj.removeMembers=function(groupId, memberIds){
    return function (dispatch){
        Axios.post('/chat-group/removeMembers.do', {
            groupId:groupId,
            removeIds:memberIds.join(',')
        }, chatOpts).then(()=>{
            dispatch({type:'CHAT_GROUP_MEMBER_REMOVE_DONE', groupId:groupId, memberIds:memberIds});
        });
    }
};

/**
 * 退出群组
 * @param groupId
 * @param userId
 * @returns {Function}
 */
// ActionObj.quitGroup=function(groupId, userId){
//     return function (dispatch){
//         ajax.post('/chat-group/quit.do', {
//             groupId:groupId,
//             userId:userId
//         }, function(){
//             dispatch({type:'CHAT_GROUP_QUIT_DONE', groupId:groupId});
//         });
//     }
// };

/**
 * 解散群组
 * @param groupId
 * @returns {Function}
 */
// ActionObj.disbandGroup=function(groupId){
//     return function (dispatch){
//         ajax.post('/chat-group/disband.do', {
//             groupId:groupId
//         }, function(){
//             dispatch({type:'CHAT_GROUP_DISBAND_DONE', groupId:groupId});
//         });
//     }
// };

/**
 * 添加群组
 * @param name
 * @param memberIds
 * @returns {Function}
 */
ActionObj.addGroup=function(name, memberIds){
    return function (dispatch){
        var userInfo=storage.getUserInfo();
        Axios.post('/chat-group/save.do', {
            name:name,
            describe:'',
            manager:userInfo.id,
            userIds:memberIds.join(',')
        }, chatOpts).then((group)=>{
            group.id=group.autoId;
            group.type='GROUP';
            group.key=group.type+'_'+group.id;
            dispatch({type:'CHAT_GROUP_ADD_DONE', group:group});
        });
    }
};

/**
 * 更新群组
 * @param groupId
 * @param name
 * @returns {Function}
 */
ActionObj.updateGroup=function(groupId, name){
    return function (dispatch){
        Axios.post('/chat-group/update.do', {
            autoId:groupId,
            name:name,
            describe:''
        }, chatOpts).then(()=>{
            dispatch({type:'CHAT_GROUP_EDIT_DONE', groupId:groupId, name:name});
        });
    }
};

export default ActionObj;