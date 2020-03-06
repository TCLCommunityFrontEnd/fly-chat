import {useSelector,useDispatch} from 'react-redux';
import * as React from 'react';
import EditableContent from '../../components/EditableContent';
import ChatMsg from './ChatMsg';
import {timeFormat} from 'utils/index';
import action from '../../action/chat';
import FaceSelect from '../FaceSelect';
import { Icon,Spin,Button,Badge } from 'antd';
// var action=require('../../action/chat');
// var FaceSelect=require('../../components/FaceSelect');

require('./emoticon.css');

interface CompProps {
    onMsgAdd:Function,
    onMsgSend:Function
}

const ChatRight = (props:CompProps) => {
    const dispatch = useDispatch();
    const {currentObj,onLine,msgLoading,msgList,onlineList} = useSelector((state:any)=>state.Chat);
    const {onMsgSend} = props;
    let chatBodyRef:any = React.createRef();
    let contentRef:any = React.createRef();

    React.useEffect(()=>{
         //消息滚动条到最底部
        chatBodyRef.current.scrollTop=chatBodyRef.current.scrollHeight;
    })

    /**
     * 关闭聊天窗口
     */
    function onClose(){
        dispatch({type:'CHAT_CLOSE'});
    }
    /**
     * 选择表情
     * @param img
     */
    function handleFaceSelect(img:any){
        contentRef.current.insertAtCursor(img);
    }
    /**
     * 处理按键发送
     * @param e
     * @returns {boolean}
     */
    function handleKeyDown(e:any){
        if(e.keyCode==13){
            if(!e.shiftKey&&!e.altKey&&!e.ctrlKey){
                //e.preventDefault();
                //Enter发送
                handleSend();
                return false;
            }
            //Alt+Enter、Ctrl+Enter、Shift+Enter正常换行
        }
    }
    /**
     * 发送
     */
    function handleSend(){
        var content=contentRef.current.getValue();
        if(content){
            onMsgSend(content);
            contentRef.current.clear();
        }
    }
    /**
     * 发送图片或文件
     * @param e
     */
    function handleFileChange(e:any){
        var file=e.target.files[0];
        if(file.size>15*1024*1024){
            alert('不能上传超过15M的文件');
            return false;
        }
        // action.uploadFile(file, function(url){
        //     this.props.onMsgSend(url);
        // }.bind(this));
    }

    var currentTime=0;
    var timeStep=60*1000;//1分
    return (
        <div className="chat-right flex-grow-1">
            <div id="chatHeader" className="chat-hd no-select">
                <div className="chat-title">
                    {/* <span className="chat-title-name">{currentObj.name}</span> */}
                    <span className="chat-title-online-state">{
                        onlineList.indexOf((currentObj.typeId+''))>-1? <Badge status="success" text={'在线'} />:<Badge status="error" text={'离线'}/>
                    }</span>
                </div>
                <a href="javascript:;" onClick={onClose} className="chat-close am-fr"><Icon type="shrink" style={{fontSize:20}}/></a>
            </div>
            {/* {
                onLine?<div className="chat-offline am-alert am-alert-danger am-text-center"><i className="am-icon-chain-broken"/> 与服务器断开连接！</div>
                :
                null
            } */}
            <div ref={chatBodyRef} className="chat-bd">
                {
                    !onLine?<div className="chat-offline am-alert am-alert-danger am-text-center"><i className="am-icon-chain-broken"/> 与服务器断开连接！</div>
                    :msgLoading?(
                        <div className="chat-loading">
                            <Icon type="loading" style={{ fontSize: 24 }} spin />
                        </div>
                    ):(
                        <ul className="unstyled">
                            {
                                msgList.length?msgList.map(function(msg:TypeInterface._Object, i:number){
                                    var timeSplitor=null;
                                
                                    if(msg.time-currentTime>timeStep){
                                        timeSplitor=(
                                            <div className="chat-system-msg">
                                                <small>{timeFormat(msg.time)}</small>
                                            </div>
                                        );
                                    }
                                    currentTime=msg.time;
                                    return (
                                        <li key={i}>
                                            {timeSplitor}
                                            <ChatMsg data={msg}/>
                                        </li>
                                    )
                                }):(
                                    <li>
                                        <div className="chat-system-msg">
                                            <small>还没有聊天消息</small>
                                        </div>
                                    </li>
                                )
                            }
                        </ul>
                    )
                }
            </div>
            <div className="chat-ft">
                <EditableContent ref={contentRef} onKeyDown={handleKeyDown} className="chat-input"/>
                <div className="chat-actions">
                    <ul className="chat-action unstyled">
                        <li>
                            <FaceSelect onSelect={handleFaceSelect}>
                                <Icon type="smile" style={{color:'#8c8c8c'}}/>
                            </FaceSelect>
                        </li>
                
                        <li title="发送图片">
                            <label>
                                <Icon type="picture" style={{color:'#8c8c8c'}}/>
                                <input type="file" accept="image/*" className="am-hide" onChange={handleFileChange} style={{display:"none"}}/>
                            </label>
                        </li>
                        <li title="发送文件">
                            <label>
                                <Icon type="folder" style={{color:'#8c8c8c'}}/>
                                <input type="file" className="am-hide" onChange={handleFileChange} style={{display:'none'}}/>
                            </label>
                        </li>
                    </ul>
                    {/* <Button type="primary" onClick={handleSend} title="发送(Enter)，换行(Shift+Enter)" className="am-btn am-btn-secondary am-btn-sm am-margin-right-sm">
                    <Icon type="caret-up" /> 发送
                    </Button> */}
                </div>
                {
                    (currentObj.typeId===undefined||!onLine)&&<div className="chat-ft-cover"></div>
                }
            </div>
        </div>
    )
}

export default ChatRight;