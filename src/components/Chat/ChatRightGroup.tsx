import {useSelector,useDispatch} from 'react-redux';
import * as React from 'react';
import {Avatar,Icon,Button} from 'antd';
import action from 'action/chat.js';
// import UserModal from '../UserModal';
var storage=require('../../utils/storage');
// var action=require('../../action/chat');
// var Avatar=require('../Avatar');

const ChatRightGroup = () => {
    const dispatch = useDispatch();
    const {groupSelected:group,editInfo} = useSelector((state:any)=>state.Chat);

    /**
     * 关闭聊天窗口
     */
    function onClose(){
        dispatch({type:'CHAT_CLOSE'});
    }
    /**
     * 发送消息（开始聊天）
     * @param group
     */
    function onStartChat(group:TypeInterface._Object){
        var obj={
            type:group.type,
            typeId:group.id,
            name:group.name,
            memberIds:group.memberIds
        };
        dispatch(action.changeChatObject(obj));

        var msg={
            type:group.type,
            typeId:group.id,
            time:new Date().getTime()
        };
        dispatch(action.refreshChatList(msg));
    }
    /**
     * 保存添加的成员
     * @param id
     * @param userIds
     */
    function onAddOK(id:number, userIds:Array<any>){
        if(userIds.length){
            if(id) {
                //选择后直接保存
                dispatch(action.addMembers(id, userIds));
            }else{
                //添加群组
                this.groupSelected.memberIds=this.groupSelected.memberIds.concat(userIds);
                dispatch({type:'CHAT_GROUP_SELECTED', group:this.groupSelected});
            }
        }
    }
    /**
     * 踢除成员
     * @param groupId
     * @param userId
     */
    function onRemove(groupId:number, userId:number){
        if(groupId) {
            //直接踢除保存
            dispatch(action.removeMembers(groupId, [userId]))
        }else{
            var index=this.groupSelected.memberIds.indexOf(userId);
            this.groupSelected.memberIds.splice(index, 1);
            dispatch({type:'CHAT_GROUP_SELECTED', group:this.groupSelected});
        }
    }
    /**
     * 退出群组
     * @param groupId
     * @param userId
     */
    function onQuit(groupId:number, userId:number){
        // if(confirm('确定要退出该群吗？')){
        //     dispatch(action.quitGroup(groupId, userId));
        // }
    }
    /**
     * 解散群组
     * @param groupId
     */
    function onDisband(groupId:number){
        // if(confirm('注意！确定要解散该群吗？')){
        //     dispatch(action.disbandGroup(groupId));
        // }
    }
    /**
     * 保存
     */
    function onEditSave(){
        var group=this.groupSelected;
        var info=this.editInfo;
        if(info.name){
            if(info.id){
                //更新
                dispatch(action.updateGroup(info.id, info.name));
            }else{
                //新增
                dispatch(action.addGroup(info.name, group.memberIds));
            }
        }else{
            alert('请输入聊天组名称');
        }
    }
    /**
     * 取消
     * @param isNew
     */
    function onEditCancel(isNew:boolean){
        if(isNew) {
            dispatch({type: 'CHAT_GROUP_SELECTED', group: {}});
        }else{
            dispatch({type:'CHAT_GROUP_EDIT_CANCEL'});
        }
    }

    var userInfo=storage.getUserInfo();
    var userMap=storage.getUserMap();

    return (
        <div className="chat-right flex-grow-1">
            <div id="chatHeader" className="chat-hd no-select">
                <span className="chat-title">{group.name}</span>
                <a href="javascript:;" onClick={onClose} className="chat-close am-fr"><Icon type="minus"/></a>
            </div>
            {
                group.key?(
                    <div className="chat-bd group">
                        <ul className="unstyled chat-group-members">
                            {
                                group.memberIds.map(function(userId:number, i:number){
                                    var user=userMap[userId];
                                    return (
                                        <li key={i}>
                                            <Avatar src={user.avatar} shape="square"/>
                                            <div className='member-name'>{user.name}</div>
                                            {
                                                group.type!='ORG'
                                                    ?(group.manager==userId
                                                        ?<span className="master" title="群主"><i className="am-icon-user"/></span>
                                                        :(group.manager==userInfo.id
                                                            ?<a href="javascript:;" onClick={()=>onRemove(group.id, userId)} className="remove" title="踢除该成员">&times;</a>
                                                            :null
                                                        )
                                                    )
                                                    :null
                                            }
                                        </li>
                                    )
                                }.bind(this))
                            }
                            {
                                group.type!='ORG'&&group.manager==userInfo.id?(
                                    <li>
                                        {/* <UserModal onSelected={this.props.onAddOK.bind(this.props, group.id)} filterUserIds={group.memberIds}>
                                            <a href="javascript:;" className="add">+</a>
                                        </UserModal> */}
                                    </li>
                                ):null
                            }
                        </ul>
                    </div>
                ):null
            }
            {
                group.key?(
                    (group.type=='NEW'||group.key==editInfo.key)?(
                        <div className="chat-ft group">
                            <Button type="primary" onClick={onEditSave} className="am-btn am-btn-xs am-btn-secondary"><i className="am-icon-check"/> 保存</Button>
                            {' '}
                            <Button type="primary" onClick={()=>onEditCancel(!group.id)} className="am-btn am-btn-xs am-btn-default"><i className="am-icon-remove"/> 取消</Button>
                        </div>
                    ):(
                        <div className="chat-ft group">
                            {
                                group.type=='GROUP'&&group.manager==userInfo.id
                                    ?<a href="javascript:;" onClick={()=>onDisband(group.id)} className="am-text-danger disband" title="解散该群"><i className="am-icon-trash-o"/></a>
                                    :null
                            }
                            <Button type="primary" onClick={()=>onStartChat(group)} className="am-btn am-btn-secondary chat-start-btn">发送消息</Button>
                            {
                                group.type=='GROUP'
                                    ?<a href="javascript:;" onClick={()=>onQuit(group.id, userInfo.id)} className="am-text-warning quit" title="退出该群"><i className="am-icon-sign-out"/></a>
                                    :null
                            }
                        </div>
                    )
                ):null
            }
        </div>
    )
}

export default ChatRightGroup;