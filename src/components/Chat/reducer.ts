import {objectAppend} from '../../utils/index';
import { List } from 'antd';
var storage=require('../../utils/storage');
/**
 * 每个容器组件对应一个reducer
 * 这里可以唯一知道新旧状态的地方
 */
//聊天类型：单聊(SINGLE)，组织聊(ORG)，群组聊(GROUP)
var defaultState:TypeInterface._Object={
    show:false,
    onLine:true,
    tabId:0, //1聊天，2通讯录，3组织/群组
    chatList:[], //左侧聊天列表。item格式：{id,type,typeId,userId,content,time,unread}
    personList:[], //左侧通讯录列表
    orgList:[], //左侧所属组织列表
    groupList:[], //左侧群组列表
    personSelected:0,
    groupSelected:{},//{key,type,id,name,manager,memberIds,isEdit}
    editInfo:{}, //用于临时存储新增或修改的信息，{key,id,name}
    groupMap:{}, //{name,memberIds}
    orgMap:{}, //{name,memberIds}
    currentObj:{}, //当前聊天对象。格式：{id,type,typeId,name}
    personSearchKey:'',
    groupSearchKey:'',
    msgLoading:false,
    msgList:[], //右侧聊天消息
    // unReadMsgs:[], //未读消息
    newMsg:{},
    onlineList:[]
};
export default (state:any, action:any)=>{
    //var newState;
    var i=0,group;
    switch (action.type){
        case 'CHAT_INIT':
            state.chatList=[];
            state.msgList=[];
            break;
        case 'CHAT_SHOW':
            state.show=true;
            break;
        case 'CHAT_CLOSE':
            state.show=false;
            break;
        case 'CHAT_ONLINE_LIST':
            state.onlineList = action.list;
            if(state.onlineList.indexOf(storage.getUserInfo().id+'')>-1)
                state.onLine = true;
            else
                state.onLine = false;
            break;
        // case 'CHAT_SERVER_STATE':
        //     state.onLine=action.onLine;
        //     break;
        case 'CHAT_TAB_CHANGE':
            state.tabId=action.tabId;
            break;
        case 'CHAT_CHAT_LIST_CHANGE':
            state.chatList=action.list;
            break;
        case 'CHAT_CHAT_DELETE':
            var delIndex=-1;
            var chatList=state.chatList;
            for(;i<chatList.length;i++){
                if(chatList[i].id==action.id){
                    delIndex=i;
                    break;
                }
            }
            chatList.splice(delIndex, 1);
            state.chatList=chatList;
            break;
        case 'CHAT_PERSON_LIST_DONE':
            state.personList=action.list;
            break;
        case 'CHAT_PERSON_SELECTED':
            state.personSelected=action.id;
            break;
        case 'CHAT_PERSON_SEARCH':
            state.personSearchKey=action.key;
            break;
        case 'CHAT_ORG_LIST_DONE':
            var map:TypeInterface._Object={};
            state.orgList=action.list;
            state.orgList.forEach(function(o:TypeInterface._Object){
                map[o.id]={
                    name:o.name,
                    memberIds:o.memberIds
                };
            });
            state.orgMap=map;
            state.editInfo={};
            break;
        case 'CHAT_GROUP_LIST_DONE':
            state.groupList=action.list;
            break;
        case 'CHAT_GROUP_ADD':
            var manager=storage.getUserInfo().id;
            state.groupSelected={
                key:'NEW',
                //type:'NEW',
                //name:'',
                manager:manager,
                memberIds:[manager] //默认群主在内
            };
            state.editInfo={
                key:'NEW',
                name:'',
                manager:manager,
                memberIds:[manager] //默认群主在内
            };
            break;
        case 'CHAT_GROUP_ADD_DONE':
            state.editInfo={};
            state.groupSelected=action.group;
            state.groupList.unshift(action.group);
            break;
        case 'CHAT_GROUP_EDIT':
            group=action.group;
            state.groupSelected=group;
            state.editInfo={
                key:group.key,
                id:group.id,
                name:group.name
            };
            break;
        case 'CHAT_GROUP_EDIT_INFO':
            state.editInfo=action.info;
            break;
        case 'CHAT_GROUP_EDIT_DONE':
            state.editInfo={};
            state.groupSelected.name=action.name;
            for(;i<state.groupList.length;i++){
                if(state.groupList[i].id==action.groupId){
                    state.groupList[i].name=action.name;
                    break;
                }
            }
            break;
        case 'CHAT_GROUP_EDIT_CANCEL':
            state.editInfo={};
            break;
        case 'CHAT_GROUP_SELECTED':
            state.editInfo={};
            state.groupSelected=action.group;
            break;
        case 'CHAT_GROUP_MEMBER_ADD_DONE':
            //更新memberIds
            state.groupSelected.memberIds=state.groupSelected.memberIds.concat(action.memberIds);
            state.groupList.forEach(function(group:TypeInterface._Object){
                if(group.type=='GROUP'&&group.id==action.groupId){
                    group.memberIds=state.groupSelected.memberIds;
                }
            });
            break;
        case 'CHAT_GROUP_MEMBER_REMOVE_DONE':
            //更新memberIds
            var memberIds:Array<number>=[];
            state.groupSelected.memberIds.forEach(function(id:number){
                if(!~action.memberIds.indexOf(id)){
                    memberIds.push(id);
                }
            });
            state.groupSelected.memberIds=memberIds;
            state.groupList.forEach(function(group:TypeInterface._Object){
                if(group.type=='GROUP'&&group.id==action.groupId){
                    group.memberIds=memberIds;
                }
            });
            break;
        case 'CHAT_GROUP_QUIT_DONE':
        case 'CHAT_GROUP_DISBAND_DONE':
            //去除选中项
            state.groupSelected={};
            for(var groupIndex=-1;i<state.groupList.length;i++){
                if(state.groupList[i].id==action.groupId){
                    groupIndex=i;
                    break;
                }
            }
            state.groupList.splice(groupIndex, 1);
            break;
        case 'CHAT_GROUP_SYNC':
            state.groupMap=action.groupMap;
            break;
        case 'CHAT_GROUP_SEARCH':
            state.groupSearchKey=action.key;
            break;
        case 'CHAT_OBJECT_CHANGE': //切换聊天对象
            state.tabId=1;
            state.currentObj=action.obj;
            state.msgLoading=true;
            state.msgList=[];
            break;
        case 'CHAT_OBJECT_CHANGE_DONE': //因查询数据库稍微耗时，故单独抽出来
            state.msgLoading=false;
            state.msgList=action.list;
            break;
        case 'CHAT_MSG_ADD':
            state.msgList.push(action.msg);
            break;
        case 'CHAT_UNREAD_MSG_ADD':
            let newState:TypeInterface._Object = {};
            // newState.unReadMsgs = state.unReadMsgs.concat([action.msg]);
            newState.newMsg = action.msg;
            return objectAppend(newState,state);
            // state.unReadMsgs = state.unReadMsgs.concat([action.msg]);
            // state.unReadMsgs.push(action.msg);
            break;
        case 'CHAT_UNREAD_MSG_DELETE':
            const index = state.unReadMsgs.findIndex((o:any)=>o.time===action.timeStamp);
            state.unReadMsgs.splice(index,1);
            break;
        default:return state||defaultState;
    }
    return objectAppend({}, state);
};