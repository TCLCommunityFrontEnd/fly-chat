import Axios from 'utils/axios';
import {devBaseUrls,proBaseUrls} from 'config/api';
import * as socket from 'utils/socket.js';
let storage=require('../utils/storage');

let action:TypeInterface._Object = {};
const appOpts = {
    devBaseUrl:devBaseUrls.baseUrl1,
    proBaseUrl:proBaseUrls.baseUrl1
}

action.getLoginUserInfo = () => (dispatch:any) => {
    //连接socket
    socket.connect();
    Axios.get('/user/loginInfo.do', {},appOpts).then((data:any)=>{
        //成功
        var userInfo={
            id:data.id,
            name:data.name,
            avatar:data.avatar,
            companyName:data.companyName,
            roleType:data.managerType
        };
        console.log('userinfo',userInfo);

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
            var orgMap:TypeInterface._Object = {0:{id:0, name:userInfo.companyName, parentId:-1}};
            data.orgs.forEach(function (o:TypeInterface._Object) {
                orgMap[o.autoId] = {
                    id: o.autoId,
                    name: o.name,
                    parentId: o.parentId
                };
            });
            storage.setOrgMap(orgMap);

            //获取一个组织的所有父组织
            var getParentIdsByOrg = function (orgId:number) {
                var orgList:Array<number> = [];

                function recurse(id:number) {
                    if (id > 0) {
                        orgList.push(id);
                        recurse(orgMap[id].parentId);
                    }
                }

                recurse(orgId);
                return orgList;
            };

            //用户
            var userMap:TypeInterface._Object = {};
            data.staff.forEach(function (o:TypeInterface._Object) {
                userMap[o.autoId] = {
                    id: o.autoId,
                    name: o.name,
                    // avatar: '/' + o.avatar,
                    avatar:o.avatar,
                    orgId: o.orgId || 0,
                    orgIds: getParentIdsByOrg(o.orgId || 0)
                };
            });
            storage.setUserMap(userMap);

            if(typeof callback == 'function'){
                callback();
            }
        });
    }
};


export default action;