import {decodeFace} from '../../utils';
import MsgMedia from './MsgMedia';
import MsgShare from './MsgShare';
import PropTypes from 'prop-types';
import * as React from 'react';

interface CompProps {
    content:string
}
const Msg = (props:CompProps) => {
    let {content} = props;
    //消息类型：
    //1.普通消息（包括表情转义、超链接转义）
    //2.多媒体消息（相对地址：以“/cloud/chat/”开头，文件格式结尾）
    //3.分享消息（包含消息体#message#{...}，格式如：#message#{"icon":"iconCircle","title":"来自同事圈分享","params":{"id":"125"},"desc":"Miktone:[图片]"}）

    //多媒体消息
    if(/^\/cloud\/chat\/.+?\.\w+$/.test(content)){
        return <MsgMedia content={content}/>;
    }

    if(/^#message#\{.+?\}$/.test(content)){
        return <MsgShare content={content}/>;
    }

    //检验有没超链接
    if(/https?:\/\/\w+/i.test(content)){
        //包含链接的消息
        content = content.replace(/(https?:\/\/.+?)(\s+|$)/gi, function(match, $1, $2){
            return `<a href="${$1}" target="_blank">${$1}</a>${$2}`;
        });
    }else {
        //纯文本消息
        //表情转义
        content = decodeFace(content);
    }

    return (
        <div className="chat-msg-bd" dangerouslySetInnerHTML={{__html:content}}></div>
    )
}


export default Msg;
