import * as React from 'react';
import {addClass,removeClass} from '../utils/index';
import {Menu,Dropdown} from 'antd';
var config=require('../config/chat');

interface CompProps {
    onSelect?:Function,
    down?:boolean,
    children:any
}

const FaceSelect = (props:CompProps) => {

    let facePanelRef:any = React.createRef();
    const {onSelect,down,children} = props;
    // React.useEffect(()=>{
    //     console.log(facePanelRef)
    //     return function cleanup(){
    //         hideFace();
    //     }
    // },[]);
    // /**
    //  * 显示表情选择框
    //  */
    // function showFace(){
    //     addClass(facePanelRef.current, 'am-active');
    //     document.addEventListener("click", this.hideFace, false);
    // }
    // /**
    //  * 隐藏表情选择框
    //  */
    // function hideFace(){
    //     removeClass(facePanelRef.current, 'am-active');
    //     document.removeEventListener("click", this.hideFace, false);
    // }
    /**
     * 选中一个表情
     * @param e
     */
    function handleFaceClick(e:any){
        var t=e.target;
        //图片
        var img=document.createElement('img');
        img.className=t.className;
        img.alt=`[${t.title}]`;
        img.src=require('../../public/1px.gif');
        onSelect(img);
    }
    const list = <Menu style={{display:'flex',flexWrap:'wrap',maxWidth:210}}>
        {
            config.emoticonNames.map(function(name:string, i:number){
                return (
                    <Menu.Item key={i}>
                    <a key={i} href="javascript:;" onClick={handleFaceClick} className={`emoticon-${name}`} title={name}/>
                    </Menu.Item>
                )
            }.bind(this))
        }
    </Menu>
    
    return (
        <div ref={facePanelRef} className={'am-dropdown'+(down?'':' am-dropdown-up')}>
             <Dropdown overlay={list} trigger={['click']} placement={'topLeft'}>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                {children}
                </a>
            </Dropdown>
            {/* <a href="javascript:;" onClick={showFace} className="am-dropdown-toggle">
                {
                    children
                }
            </a>
            <div className="am-dropdown-content" style={{padding:6,marginLeft:-9}}>
                <div className="am-tabs">
                    <ul className="am-tabs-nav am-nav am-nav-tabs">
                        <li className="am-active"><a href="javascript:;" style={{padding:'2px 10px',fontSize:14}}>表情</a></li>
                    </ul>
                    <div className="am-tabs-bd">
                        <div className="am-tab-panel am-active">
                            <div className="emoticon emotion-tabs">
                                {
                                    config.emoticonNames.map(function(name:string, i:number){
                                        return (
                                            <a key={i} href="javascript:;" onClick={handleFaceClick} className={`emoticon-${name}`} title={name}/>
                                        )
                                    }.bind(this))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    )
}

export default FaceSelect;