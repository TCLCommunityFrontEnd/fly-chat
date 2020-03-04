var io=require('socket.io-client');
var config=require('../config/chat');

let socket=null;
let messageEventList=[];
let broadcastEventList=[];

/**
 * 连接服务器
 */
export function connect(){
    socket = io.connect(config.server);

    socket.on('message', (data) => {
        messageEventList.forEach((listener) => {
            listener(data);
        });
    });

    socket.on('broadcast', (data) => {
        broadcastEventList.forEach((listener) => {
            listener(data);
        });
    });
}

/**
 * 断连
 */
export function disconnect(){
    socket&&socket.disconnect();
}

/**
 * 加入新用户
 * @param id
 * @param name
 */
export function register(id, name){
    socket.emit('newUser', {id:id, name:name});
}

export function send(data){
    socket.send(data);
}

export function emit(type,data){
    socket.emit(type,data);
}

/**
 * 连接成功
 * @param listener
 */
export function onConnect(listener){
    socket.on('connect', listener);
}

/**
 * 断开连接
 * @param listener
 */
export function onDisconnect(listener){
    socket.on('disconnect', listener);
}

/**
 * 收到消息
 * @param listener
 */
export function onMessage(listener){
    messageEventList.push(listener);
}

/**
 * 被顶替掉
 * @param listener
 */
export function onReplace(listener){
    socket.on('replace', listener);
}

/**
 * 收到广播消息
 * @param listener
 */
export function onBroadcast(listener){
    broadcastEventList.push(listener);
}