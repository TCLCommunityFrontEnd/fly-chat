import {useSelector,useDispatch} from 'react-redux';
import * as React from 'react';
import {Avatar,Icon,Input} from 'antd';
var storage=require('../../utils/storage');
// var Avatar=require('../Avatar');
// import Icon from '../Icon';

const ChatLeftGroup = () => {
    let {
        groupSelected:selected,
        editInfo,
        groupSearchKey:searchKey,
        orgList,
        groupList} = useSelector((state:any)=>state.Chat);
    const dispatch = useDispatch();

    /**
     * 选择聊天组时
     * @param group
     */
    function onItemSelect(group:Object){
        dispatch({type:'CHAT_GROUP_SELECTED', group:group});
    }
    /**
     * 添加聊天组操作
     */
    function onAddGroup(){
        dispatch({type:'CHAT_GROUP_ADD'});
    }
    /**
     * 编辑群组
     * @param group
     * @param e
     */
    function onEditGroup(group:Object, e:any){
        e.stopPropagation();
        dispatch({type:'CHAT_GROUP_EDIT', group:group});
    }
    /**
     * 编辑聊天组名称变化时
     * @param e
     */
    function onTitleChange(e:any){
        this.editInfo.name=e.target.value;
        dispatch({type:'CHAT_GROUP_EDIT_INFO', info:this.editInfo});
    }
    /**
     * 搜索联系人
     * @param e
     */
    function onSearchChange(e:any){
        dispatch({type:'CHAT_GROUP_SEARCH', key:e.target.value});
    }

    let userInfo=storage.getUserInfo();
    //筛选组织/群组
    if(searchKey) {
        orgList = orgList.filter(function (org:TypeInterface._Object) {
            return ~org.name.toLowerCase().indexOf(searchKey.toLowerCase());
        });
        groupList = groupList.filter(function (group:TypeInterface._Object) {
            return ~group.name.toLowerCase().indexOf(searchKey.toLowerCase());
        });
    }
    return (
        <div className="chat-left">
            <div className="chat-search">
                <div className="chat-search-group">
                    <Input.Search onChange={onSearchChange} placeholder={`搜索当前共${orgList.length+groupList.length}个组织/群组`}/>
                    {/* <input type="search" className="am-form-field" onChange={onSearchChange} placeholder={`搜索当前共${orgList.length+groupList.length}个组织/群组`}/> */}
                    <i className="am-icon-search"/>
                </div>
            </div>
            <div className="chat-category">
                {
                    orgList.length?(
                        <div>
                            <div className="chat-list-title">所属组织</div>
                            <ul className="unstyled">
                                {
                                    orgList.map(function(org:TypeInterface._Object, i:number){
                                        return (
                                            <li key={i}
                                                onClick={onItemSelect.bind(this, org)}
                                                className={'chat-list-item overflow-hidden'+(org.key==selected.key?' active':'')}
                                            >
                                                <div className="avatar" style={{fontSize:'1.8em'}}><Icon type={'team'}/> </div>
                                                <div className="after-avatar">
                                                    <span style={{color:'black'}}>{org.name}</span>
                                                    <div className="recent am-text-truncate">{org.memberIds.length}人</div>
                                                </div>
                                            </li>
                                        )
                                    }.bind(this))
                                }
                            </ul>
                        </div>
                    ):null
                }
                {
                    groupList.length?(
                        <div>
                            <div className="chat-list-title">
                                聊天群组
                                {
                                    editInfo.key!='NEW'&&!searchKey
                                        ?<a href="javascript:;" onClick={onAddGroup} className="am-fr" style={{color:'#888'}} title="新建聊天组"><i className="am-icon-plus"/> </a>
                                        :null
                                }
                            </div>
                            <ul className="unstyled">
                                {
                                    editInfo.key=='NEW'?(
                                        <li className="chat-list-item overflow-hidden active">
                                            <div className="avatar" style={{fontSize:'1.8em'}}><i className="am-icon-users"/> </div>
                                            <div className="after-avatar">
                                                <input type="text" value={editInfo.name} onChange={(e)=>onTitleChange(e)} className="am-form-field am-padding-xs" placeholder="请输入组名"/>
                                            </div>
                                        </li>
                                    ):null
                                }
                                {
                                    groupList.map(function(group:TypeInterface._Object, i:number){
                                        //编辑状态
                                        if(group.key==editInfo.key){
                                            return (
                                                <li key={i} className="chat-list-item overflow-hidden active">
                                                    <div className="avatar" style={{fontSize:'1.8em'}}><Icon type="group-f"/> </div>
                                                    <div className="after-avatar">
                                                        <input type="text" value={editInfo.name} onChange={onTitleChange} className="am-form-field am-padding-xs" placeholder="请输入组名"/>
                                                    </div>
                                                </li>
                                            )
                                        }
                                        return (
                                            <li key={i}
                                                onClick={onItemSelect.bind(this, group)}
                                                className={'chat-list-item overflow-hidden'+(group.key==selected.key?' active':'')}
                                            >
                                                <div className="avatar" style={{fontSize:'1.8em'}}><Icon type="group-f"/> </div>
                                                <div className="after-avatar">
                                                    <span>{group.name}</span>
                                                    <div className="recent am-text-truncate">{group.memberIds.length}人</div>
                                                </div>
                                                {
                                                    group.manager==userInfo.id
                                                        ?<a href="javascript:;" onClick={(e)=>onEditGroup(group,e)} className="edit" style={{color:'#888'}} title="编辑"><i className="am-icon-edit"/> </a>
                                                        :null
                                                }
                                            </li>
                                        )
                                    }.bind(this))
                                }
                            </ul>
                        </div>
                    ):null
                }
            </div>
        </div>
    )
}

export default ChatLeftGroup;