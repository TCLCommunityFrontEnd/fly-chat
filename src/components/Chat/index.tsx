import * as React from 'react';
import {useSelector,useDispatch} from 'react-redux';
//import notice from '../../utils/notice';
import * as socket from 'utils/socket.js';
import dragChat from '../../hoc/dragChat';
// import Icon from '../Icon';
import {Icon} from 'antd';
import ChatLeft from './ChatLeft';
import ChatLeftPerson from './ChatLeftPerson';
import ChatLeftGroup from './ChatLeftGroup';
import ChatRight from './ChatRight'
import ChatRightPerson from './ChatRightPerson'
import ChatRightGroup from './ChatRightGroup';
import action from '../../action/chat';
import {isEmpty} from 'utils/index';
// var action=require('../../action/chat');
var storage=require('../../utils/storage');
require('./index.css');


let Chat = () => {
    let {show,orgList,groupList,tabId,chatList,currentObj,newMsg,unreadCount} = useSelector((state:any)=>state.Chat);
    const dispatch = useDispatch();
    function init(){
        //初始化聊天状态
        dispatch({type: 'CHAT_INIT'});
        dispatch(action.changeTab(1));
        dispatch(action.getChatList());

        //只能登录的时候才会从服务端加载，之后都不会变，因此本地最好只获取一次就好
        dispatch(action.loadPersonList());
        dispatch(action.loadOrgList());
        //加载一次通讯组，供ChatObjectSelect使用
        dispatch(action.loadGroupList());
    }

    React.useEffect(()=>{
        init();
        //收到消息
        socket.onMessage((data:any)=>_onMsgReceive(dispatch,data));
    },[]);
    React.useMemo(()=>{
        !isEmpty(newMsg)&&onMsgReceive(newMsg)
    },[newMsg]);

    /**
     * 全局发送消息的方法
     * @param type
     * @param typeId
     * @param content
     */
    function sendMsg(type:string, typeId:number, content:string){
        if(type&&!isEmpty(typeId)) {
            var userInfo = storage.getUserInfo();

            var data = {
                type: type,
                typeId: typeId,
                userId: userInfo.id,
                content: content,
                time: new Date().getTime()
            };

            //保存到本地
            action.saveMsg(data);

            let memberIds;
            //如果群聊的话会给发送人发送信息，但是单聊的话只给对方发送信息，因此单聊时需要自己补上
            switch (type){
                case 'SINGLE':
                    //自己添加一条信息
                    dispatch({type:'CHAT_MSG_ADD', msg:data});

                    //更新左侧聊天列表
                    dispatch(action.refreshChatList(data));
                    break;
                case 'ORG':
                    let org=orgList.find((o:TypeInterface._Object) => o.id==typeId);
                    memberIds=org?org.memberIds:[];
                    break;
                case 'GROUP':
                    let group=groupList.find((o:TypeInterface._Object) => o.id==typeId);
                    memberIds=group?group.memberIds:[];
                    break;
            }

            //发送到服务器，ids发给多个人才用到
            socket.send({
                type: type,
                sendId:userInfo.id,
                recvId: typeId,
                ids: memberIds,
                content: content
            });
        }
    }
    function _onMsgReceive(dispatch:any,data:any){
        dispatch({type:'CHAT_UNREAD_MSG_ADD',msg:data});
    }
    /**
     * 接收服务器消息
     * @param data
     */
    function onMsgReceive(data:TypeInterface._Object){
        var msg={
            type:data.type,
            typeId:data.typeId,
            userId:data.userId,
            content:data.content,
            unread:1
        };
        //如果是处于当前聊天对象窗口，则直接显示消息
        if(currentObj.type==data.type&&currentObj.typeId==data.typeId){
            onMsgAdd(data);

            if(show&&tabId==1) {
                msg.unread = 0;
            }
        }

        //更新左侧聊天列表
        dispatch(action.refreshChatList(msg));

        //不管怎样还是要把消息保存到数据库
        action.saveMsg(data);
    }
    /**
     * 上屏一条消息
     * @param data
     */
    function onMsgAdd(data:any){
        dispatch({type:'CHAT_MSG_ADD', msg:data});
        //更新左侧聊天列表
        // dispatch(action.refreshChatList(data));
    }
    /**
     * 发送一条消息
     * @param content
     */
    function onMsgSend(content:string){
        var obj=currentObj;
        //如果为空对象则为无效数据，避免插入到数据库中
        if(!obj.type){
            return false;
        }
        sendMsg(obj.type, obj.typeId, content);
    }
    /**
     * 切换内容
     * @param tabId
     */
    function onTabChange(tabId:number){
        dispatch(action.changeTab(tabId));

        //切换到聊天TAB时，如果当前聊天对象有未读消息也要清除
        if(tabId==1&&currentObj.id){
            dispatch(action.refreshChatList({id:currentObj.id,unread:0}));
        }
    }

    var chatLeft=null;
    var chatRight=null;
    switch (tabId){
        case 1:
            chatLeft=<ChatLeft/>;
            chatRight=<ChatRight onMsgAdd={onMsgAdd} onMsgSend={onMsgSend}/>;
            break;
        case 2:chatLeft=<ChatLeftPerson/>;
            chatRight=<ChatRightPerson/>;
            break;
        case 3:chatLeft=<ChatLeftGroup/>;
            chatRight=<ChatRightGroup/>;
            break;
    }

    //计算未读消息总数
    // var unreadCount=0;
    // chatList.forEach(function(o:TypeInterface._Object){
    //     if(o.unread>0){
    //         unreadCount+=o.unread;
    //     }
    // });
    

    return (
        <div 
            id="chatWindow" 
            className={'chat-window display-flex'+(!show?' hide':'')} 
            // style={this.props.getStyle.call(this)}
            >
            <div id="chatMenu" className="chat-menu">
                <ul className="unstyled list">
                    {
                        tabId==1?(
                            <li className="active">
                                <Icon type="message" className="chat-tab-icon"/>
                                {unreadCount>0?<span className="chat-btn-badge" style={{left:29}}>{unreadCount}</span>:null}
                            </li>
                        ):(
                            <li onClick={()=>onTabChange(1)} title="聊天">
                                <Icon type="message" className="chat-tab-icon"/>
                                {unreadCount>0?<span className="chat-btn-badge" style={{left:29}}>{unreadCount}</span>:null}
                            </li>
                        )
                    }
                    {
                        tabId==2?(
                            <li className="active"><Icon type="user" className="chat-tab-icon"/> </li>
                        ):(
                            <li onClick={()=>onTabChange(2)} title="通讯录"><Icon type="user" className="chat-tab-icon"/> </li>
                        )
                    }
                    {
                        tabId==3?(
                            <li className="active"><Icon type="team" className="chat-tab-icon"/> </li>
                        ):(
                            <li onClick={()=>onTabChange(3)} title="组织/群组"><Icon type="team" className="chat-tab-icon"/> </li>
                        )
                    }
                </ul>
            </div>
            {chatLeft}
            {chatRight}
        </div>
    )
}

Chat = dragChat(Chat);

export default Chat;