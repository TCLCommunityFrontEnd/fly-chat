import * as React from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {Avatar,Button} from 'antd';
import action from 'action/chat.js';
var storage=require('../../utils/storage');
var config=require('../../config/chat');
// var action=require('../../action/chat');
// var Avatar=require('../Avatar');

const ChatRightPerson = () => {
    const {personSelected} = useSelector((state:any)=>state.Chat);
    const dispatch = useDispatch();
    /**
     * 关闭聊天窗口
     */
    function onClose(){
    }
    /**
     * 发送消息（开始聊天）
     * @param user
     */
    function onStartChat(user:TypeInterface._Object){
        var userMap=storage.getUserMap();
        var obj={
            type:'SINGLE',
            typeId:user.id,
            name:userMap[user.id].name
        };
        dispatch(action.changeChatObject(obj));

        var msg={
            type:'SINGLE',
            typeId:user.id,
            time:new Date().getTime()
        };
        dispatch(action.refreshChatList(msg));
    }

    var userMap=storage.getUserMap();
    var user=userMap[personSelected];
    return (
        <div className="chat-right flex-grow-1">
            <div id="chatHeader" className="chat-hd no-select">
                <a href="javascript:;" onClick={onClose} className="chat-close am-fr"><i className="am-icon-minus"/></a>
            </div>
            {
                user?(
                    <div className="chat-bd detail">
                        <div className="person">
                            <Avatar src={user.avatar}/>
                            <p className="am-text-xxl" style={{color:'black'}}>{user.name}</p>
                            <Button type="primary" onClick={()=>onStartChat(user)} className="am-btn am-btn-secondary chat-start-btn">发送消息</Button>
                        </div>
                    </div>
                ):null
            }
        </div>
    )
}

export default ChatRightPerson;