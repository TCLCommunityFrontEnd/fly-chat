import {useDispatch} from 'react-redux';
// import MsgIcon from '../MsgIcon';
import {Icon} from 'antd';
import * as React from 'react';
// const action=require('../../action');\

interface CompProps {
    content:string,
    onClick?:Function
}

const MsgShare = (props:CompProps) => {
    const dispatch = useDispatch();
    const {content} = props;

    /**
     * 点击分享消息
     * @param data
     */
    function handleClick(data:TypeInterface._Object){
        //具体消息格式请参见components/Bell/index
        switch (data.icon){
            case 'iconBroadcast':
            case 'iconSign':
            case 'iconVote':
                // dispatch(action.broadcast.loadInfo(data.params.id));
                break;
            case 'DOC':
            case 'COURSE':
            case 'TEACH':
                // dispatch(action.workflow.loadApplyInfo(data.params.autoId));
                break;
            case 'iconTraining':
                // dispatch(action.training.loadInfo(data.params.planId, function(info){
                //     //培训结束后才允许评论
                //     if(info.status==2) {
                //         dispatch(action.training.loadComments(info.autoId));
                //     }
                // }));
                break;
        }
    }

    let obj:TypeInterface._Object;
    try {
        obj=JSON.parse(content.replace('#message#', ''));
    }catch (e){
        //如果解析出错，则返回原信息
        console.error('分享消息解析错误', e.toString());
        return <div className="chat-msg-bd">{content}</div>;
    }

    switch (obj.icon){
        case 'iconCircle':
            //#message#{"icon":"iconCircle","title":"来自同事圈分享","params":{"id":"125"},"desc":"Miktone:[图片]"}
            return <div className="chat-msg-bd">[发送了一个同事圏分享，请在手机上查看]</div>;
        case 'iconBroadcast':
        case 'iconSign':
        case 'iconVote':
        case 'DOC':
        case 'COURSE':
        case 'TEACH':
        case 'iconTraining':
            return (
                <a href="javascript:;" onClick={()=>handleClick(obj)} title={obj.desc} className="chat-msg-bd display-flex">
                    <div className="am-text-xxxl"><Icon type="broadcast"/></div>
                    <div style={{width:180,margin:'10px 0 10px 5px'}}>
                        {obj.title}
                        <div className="text-gray am-text-sm am-text-truncate">{obj.desc}</div>
                    </div>
                </a>
            );
    }
    return <div className="chat-msg-bd">{content}</div>;
}

export default MsgShare