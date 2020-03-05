import Axios from 'utils/axios';
import {devBaseUrls,proBaseUrls} from 'config/api';
import * as socket from 'utils/socket.js';
import API from 'config/const';
let storage=require('../utils/storage');

let action:TypeInterface._Object = {};
const appOpts = {
    devBaseUrl:devBaseUrls.baseUrl1,
    proBaseUrl:proBaseUrls.baseUrl1
}

action.getLoginUserInfo = () => (dispatch:any) => {
    // Axios.get('/user/loginInfo.do', {},appOpts).then((data:any)=>{
    //     //成功
    //     var userInfo={
    //         id:data.uid,
    //         name:data.username,
    //         avatar:data.avatar||'https://avatars1.githubusercontent.com/u/15435074?s=60&v=4',
    //         companyName:data.companyName||'TCL云创科技有限公司',
    //         roleType:data.roles.map((o:any)=>o.name).join(',')
    //     };

    //     storage.setUserInfo(userInfo);
    // });

    return Axios.get(API.USER_INFO_LOAD_FOR_USER,{},appOpts).then((data:any) => {
        var userInfo={
            id:data.uid,
            name:data.username,
            avatar:data.avatar||'https://avatars1.githubusercontent.com/u/15435074?s=60&v=4',
            companyName:data.companyName||'TCL云创科技有限公司',
            roleType:data.roles.map((o:any)=>o.name).join(',')
        };
        //连接socket
        socket.connect();
        socket.emit('setName',data.uid);
        storage.setUserInfo(userInfo);
    });
}

/**
 * 主要更新组织和用户本地缓存
 */
action.updateMapStorage = (callback:Function) => {
    //须已登录
    const userInfo=storage.getUserInfo();
    if(userInfo) {
        Axios.get('/company/org_staff.do', {}, appOpts).then((data:any)=>{
            //组织
            var orgMap:TypeInterface._Object = {0:{id:0, name:userInfo.companyName, pid:-1}};
            data.orgs.forEach(function (o:TypeInterface._Object) {
                orgMap[o.uid] = {
                    id: o.uid,
                    name: o.name,
                    pid: o.pid
                };
            });
            storage.setOrgMap(orgMap);

            //获取一个组织的所有父组织
            var getParentIdsByOrg = function (orgId:number) {
                var orgList:Array<number> = [];

                function recurse(id:number) {
                    if (id > 0) {
                        orgList.push(id);
                        recurse(orgMap[id].pid);
                    }
                }

                recurse(orgId);
                return orgList;
            };

            //用户
            Axios.get(API.USER_ALLDATA_LOAD, {
                currentPage: 1,
                pageSize: 10000,
            },appOpts).then((obj:any)=>{
                
                var userMap:TypeInterface._Object = {0:{'id':0,'avatar':'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K',
                'name':'服务器','orgId':1},};
                obj.list.forEach(function (o:TypeInterface._Object) {
                    userMap[o.uid] = {
                        id: o.uid,
                        name: o.username,
                        avatar:o.avatar||'https://avatars0.githubusercontent.com/u/53926282?s=60&v=4',
                        orgId: o.orgId || 0,
                        orgIds: getParentIdsByOrg(o.orgId || 0)
                    };
                });
                storage.setUserMap(userMap);

                if(typeof callback == 'function'){
                    callback();
                }
            })
        });
    }
};


export default action;