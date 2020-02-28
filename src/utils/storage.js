/**
 * 本地存储
 */
var prefix='office_';   //统一前缀
var cache={}; //缓存

module.exports={
    get:function(key){
        var value=localStorage.getItem(prefix+key);
        if(value) {
            //反序列化
            value = JSON.parse(value);

            //已经获取过的缓存起来
            cache[prefix+key]=value;

            return value;
        }else{
            return null;
        }
    },
    getCache:function(key){
        return cache[prefix+key];
    },
    set:function(key, value){
        //重新set时清空该缓存
        delete cache[prefix+key];

        //序列化
        value=JSON.stringify(value);
        localStorage.setItem(prefix+key, value);
    },
    del:function(key){
        localStorage.removeItem(prefix+key);
    },
    clear:function(){
        cache={};
        localStorage.clear();
    },
    /**
     * 快捷方式
     */
    getUserInfo:function(){
        //优先从缓存中取数据
        return this.getCache('user_info')||this.get('user_info');
    },
    setUserInfo:function(data){
        this.set('user_info', data);
    },
    delUserInfo:function(){
        this.del('user_info')
    },
    getUserMap:function(){
        return this.getCache('user_map')||this.get('user_map')||{};
    },
    getUserList:function(){
        var userMap=this.getUserMap();
        var userList=[];
        for (var userId in userMap) {
            userList.push(userMap[userId]);
        }
        return userList;
    },
    getUserListByOrg:function(orgId){
        var userMap=this.getUserMap();
        var userList=[];
        for (var userId in userMap) {
            if(~userMap[userId].orgIds.indexOf(orgId)) {
                userList.push(userMap[userId]);
            }
        }
        return userList;
    },
    setUserMap:function(map){
        this.set('user_map', map);
    },
    getOrgMap:function(){
        return this.getCache('org_map')||this.get('org_map')||{};
    },
    getOrgList:function(){
        var orgMap=this.getOrgMap();
        var orgList=[];
        for (var orgId in orgMap) {
            orgList.push(orgMap[orgId]);
        }
        return orgList;
    },
    setOrgMap:function(map){
        this.set('org_map', map);
    },
    setMenuRight:function(map){
        this.set('menu_right', map);
    },
    getMenuRight:function(key){
        var map=this.getCache('menu_right')||this.get('menu_right')||{};
        return map[key];
    },
    getBroadcastUnread(){
        return this.getCache('bc_unread')||this.get('bc_unread')||[];
    },
    addBroadcastUnread(timestamp){
        //以时间戮作为未读消息的ID
        let unreadList=this.getBroadcastUnread();
        unreadList.push(timestamp);
        this.set('bc_unread', unreadList);
    },
    removeBroadcastUnread(timestamp){
        let unreadList=this.getBroadcastUnread();
        const index=unreadList.indexOf(timestamp);
        if(index>=0){
            unreadList.splice(index, 1);
            this.set('bc_unread', unreadList);
        }
    }
};