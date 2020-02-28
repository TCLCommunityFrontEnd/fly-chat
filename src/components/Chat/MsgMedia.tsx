// const api=require('../../config/api');
// import ImageViewer from '../../components/ImageViewer';
import * as React from 'react';

interface CompProps {
    content:string
}

const MsgMedia = (props:CompProps) => {
    let {content} = props;
    let src = '';
    // const src=api.ftpBaseUrl+content;
    const ext=content.slice(content.lastIndexOf('.')+1).toUpperCase();
    switch (ext){
        //图片
        case 'JPG':
        case 'JPEG':
        case 'GIF':
        case 'PNG':
            return (
                <div className="chat-msg-bd">
                    {/* <ImageViewer imgChild absoluteSrc src={src} /> */}
                </div>
            );
        //无法处理的类型当做普通文件下载
        default:
            const filename=content.slice(content.lastIndexOf('/')+1);
            return (
                <a href={src} target="_blank" className="chat-msg-bd chat-msg-file">
                    <span className="fileIcon">{ext}</span>
                    <span className="name">{filename}</span>
                </a>
            );
    }
}


export default MsgMedia