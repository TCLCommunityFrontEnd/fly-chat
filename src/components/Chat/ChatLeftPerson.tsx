import * as React from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {Avatar,Input} from 'antd';
var storage=require('../../utils/storage');

const ChatLeftPerson = () => {
    let {personSelected:selectedId,personSearchKey:searchKey,personList} = useSelector((state:any)=>state.Chat);
    const dispatch = useDispatch();

    function onItemSelect(user:any){
        dispatch({type:'CHAT_PERSON_SELECTED', id:user.id});
    }
    /**
     * 搜索联系人
     * @param e
     */
    function onSearchChange(e:any){
        dispatch({type:'CHAT_PERSON_SEARCH', key:e.target.value});
    }

    var orgMap=storage.getOrgMap();
    //筛选联系人
    if(searchKey) {
        personList = personList.filter(function (user:any) {
            return ~user.name.toLowerCase().indexOf(searchKey.toLowerCase());
        });
    }
    return (
        <div className="chat-left">
            <div className="chat-search">
                <div className="chat-search-group">
                    <Input.Search onChange={onSearchChange} defaultValue={searchKey}/>
                    {/* <input type="search" className="am-form-field" onChange={onSearchChange} placeholder={`搜索当前${personList.length}位联系人`}/> */}
                    <i className="am-icon-search"/>
                </div>
            </div>
            <div className="chat-category">
                <ul className="unstyled">
                    {
                        personList.length?personList.map(function(user:any, i:number){
                            return (
                                <li key={i}
                                    onClick={()=>onItemSelect(user)}
                                    className={'chat-list-item overflow-hidden'+(user.id==selectedId?' active':'')}
                                >
                                    <Avatar src={user.avatar}/>
                                    <div className="after-avatar">
                                        <span>{user.name}</span>
                                        <div className="recent am-text-truncate">{orgMap[user.orgId].name}</div>
                                    </div>
                                </li>
                            )
                        }.bind(this)):(
                            <li>
                                <div className="chat-system-msg"><small>还没有联系人</small></div>
                            </li>
                        )
                    }
                </ul>
            </div>
        </div>
    )
}

export default ChatLeftPerson;