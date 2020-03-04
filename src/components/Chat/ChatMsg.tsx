import {Avatar} from 'antd';
// var Avatar=require('../Avatar');
//var Msg=require('./Msg');
import Msg from './Msg'
import PropTypes from 'prop-types';
import * as React from 'react';
var storage=require('../../utils/storage');

interface CompProps {
    data?:TypeInterface._Object
}

class ChatMsg extends React.Component<CompProps> {

    shouldComponentUpdate(nextProps:CompProps){
        return nextProps.data.primaryKey!==this.props.data.primaryKey;
    }

    render(){
        var userMap=storage.getUserMap();
        var userInfo=storage.getUserInfo();
        const msg=this.props.data;
        const user=userMap[msg.userId];
        return (
            <div className={'chat-msg '+(msg.userId==userInfo.id?'right':'left')}>
                <span style={{display:'flex'}}>
                    <Avatar src={msg.userId==userInfo.id?userInfo.avatar:user.avatar}/>
                </span>
                <Msg content={msg.content}/>
            </div>
        )
    }
}

export default ChatMsg