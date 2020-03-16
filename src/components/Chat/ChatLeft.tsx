import * as React from 'react';
import {useSelector,useDispatch} from 'react-redux'; 
import {decodeFace,timeFormat} from 'utils/index';
import {Avatar,Input, Icon,message} from 'antd';
import ContextMenu from '../ContextMenu';
import action from '../../action/chat';
const {useState} = React;
var storage=require('../../utils/storage');

let chatId:any = 0;


const ChatLeft = () => {
    const {orgMap,groupMap,currentObj,chatList} = useSelector((state:any)=>state.Chat);
    const dispatch = useDispatch();

    let [showContextMenu,setShowContextMenu] = useState(false);
    let [x,setX] = useState(0);
    let [y,setY] = useState(0);

    /**
     * 打开右键菜单
     * @param id
     * @param e
     */
    function handleContextMenu(id:number, e:any){
        e.preventDefault();
        chatId=id;
        setShowContextMenu(true);
        setX(e.clientX);
        setY(e.clientY);
    }
    /**
     * 关闭右键菜单
     */
    function handleContextMenuClose(){
        setShowContextMenu(false);
    }
     /**
     * 删除聊天
     */
    function handleChatDelete(){
        handleContextMenuClose();
        if(chatId==0){
            message.warn('请选择要删除的会话');
        }else{
            onItemDelete(chatId);
        }
        // if(confirm('确定删除该聊天？')){
        //     this.props.onItemDelete(chatId);
        // }
    }

     /**
     * 选择某个聊天对象
     * @param obj 用户或组
     */
    function onItemSelect(obj:any){
        dispatch(action.changeChatObject(obj));

        //清除该聊天对象的未读消息
        if(chatList.length) {
            dispatch(action.refreshChatList({id:obj.id,unread:0}));
        }
    }
    /**
     * 删除聊天
     * @param chatId 即type+typeId
     */
    function onItemDelete(chatId:number){
        dispatch(action.deleteChat(chatId));
    }
    /**
     * 搜索聊天记录
     */
    function onSearchChange(e:any){
        // dispatch({type:'CHAT_PERSON_SEARCH', key:e.target.value});
    }

    var userMap=storage.getUserMap();
    return (
        <div className="chat-left">
            <ContextMenu show={showContextMenu} x={x} y={y} onClose={handleContextMenuClose}>
                <a href="javascript:;" onClick={handleChatDelete}>删除聊天</a>
            </ContextMenu>
            <div className="chat-search am-hide">
                <div className="chat-search-group">
                    {/* <input type="search" className="am-form-field"/> */}
                    <Input.Search onChange={onSearchChange}/>
                    <i className="am-icon-search"/>
                </div>
            </div>
            <div className="chat-category" style={{top:60}}>
                <ul className="unstyled">
                    {
                        chatList.length?chatList.map(function(obj:any, i:number){
                            var avatar=null;
                            var typeObj;
                            switch (obj.type){
                                case 'SINGLE':
                                    typeObj=userMap[obj.typeId];
                                    avatar=<Avatar src={typeObj.avatar}/>;
                                    break;
                                case 'GROUP':
                                    typeObj=groupMap[obj.typeId];
                                    avatar=<div className="avatar" style={{fontSize:'1.8em'}}><Icon type="team"/> </div>;
                                    break;
                                case 'ORG':
                                    typeObj=orgMap[obj.typeId];
                                    avatar=<div className="avatar" style={{fontSize:'1.8em'}}><Icon type="apartment" /></div>;
                                    break;
                            }

                            //防止有无效数据而报错
                            if(!typeObj){
                                return null;
                            }

                            obj.name=typeObj.name||'　';
                            var chatObj={
                                id:obj.id,
                                type:obj.type,
                                typeId:obj.typeId,
                                name:obj.name,
                                memberIds:typeObj.memberIds //如果针对ORG和GROUP
                            };

                            var recentContent='';
                            if(obj.content){
                                //清除HTML标签
                                var content=obj.content.replace(/<\w+?\/?>|<\/\w+?>/gi, '');
                                //替换成表情图片
                                content=decodeFace(content);
                                recentContent=userMap[obj.userId].name+':'+content
                            }
                            return (
                                <li key={i}
                                    onClick={obj.id==currentObj.id?null:()=>onItemSelect(chatObj)}
                                    onContextMenu={(e)=>handleContextMenu(obj.id,e)}
                                    className={'chat-list-item overflow-hidden'+(obj.id==currentObj.id?' active':'')}
                                    >
                                    {avatar}
                                    {obj.unread>0?<span className="chat-btn-badge">{obj.unread>99?'99+':obj.unread}</span>:null}
                                    <div className="after-avatar">
                                        <span>{obj.name}</span>
                                        <div style={{display:'flex'}}>
                                            <div className="recent am-text-truncate icon-sm" dangerouslySetInnerHTML={{__html:recentContent}}></div>
                                            <small className="am-fr">{timeFormat(obj.time)}</small>
                                        </div>
                                    </div>
                                </li>
                            )
                        }.bind(this)):(
                            <li>
                                <div className="chat-system-msg"><small>还没有聊天记录</small></div>
                            </li>
                        )
                    }
                </ul>
            </div>
        </div>
    )
  
}

export default ChatLeft;