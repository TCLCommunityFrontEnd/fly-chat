import {setCookieWithScope,setCookie,getCookie} from './cookies'
import {isEmpty} from 'utils/index';
import API from 'config/const';
import {mockServer} from '../mock';
import {devBaseUrls,proBaseUrls} from 'config/api';
const ReactDOM = require('react-dom');
import * as React from 'react';
// const Err50x = (cb:any) => { require.ensure([], require => { cb(require('pages/Error/50x').default); }); };
// const LoginInfoError = (cb:any) => { require.ensure([], require => { cb(require('pages/Error/LoginInfoError').default); }); };
import qs from "qs";
import {Modal} from 'antd';
const devBaseUrl = devBaseUrls.baseUrl1;
const proBaseUrl = proBaseUrls.baseUrl1;

var _axios = require('axios');
var axios:TypeInterface._Object = {};

const defaultTimeout = 300000;
const normalHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};
//声明待处理fetch队列和403异常fetch对列
let pendingFetch:Array<any> = [],errorFetch:Array<any> = [];
//声明标志位
let resolveErrorState = false;


/**
 * 创建http请求头
 * @param opts 
 */
function createHttpHeader(opts:TypeInterface._Object,method:string){
    let header = opts.withCookie?{
        ...normalHeaders,
        ...opts.headers,
        Authorization: 'Bearer '+getCookie(opts.tokenType?opts.tokenType:'access_token')
    }
    :
    {...normalHeaders,...opts.headers};
    if(method.toLocaleUpperCase()==='GET'){
        delete header["Content-Type"];
        delete header["content-type"];
    }
    return header;
}

function createAxiosInstance(baseUrl:string,method:string,opts:TypeInterface._Object){
    var config:TypeInterface._Object = {
        method,
        baseURL:baseUrl,
        timeout:opts.timeout||defaultTimeout,
        headers:createHttpHeader(opts,method),
    };

    if(opts.responseType){
        config.responseType = opts.responseType;
    }
    switch(method.toLocaleUpperCase()){
        case 'GET':
            config = {...config};
            break;
        case 'POST':
            config = {...config};
            break;
        case 'PUT':
            break;
    }
    return _axios.create(config);
}

// reqParams.opts.getResponse 是否返回 http response对象
function http(reqParams:TypeInterface._Object){
    let {method,url,params,opts} = reqParams;
    const isFrom = opts.headers && !opts.withQueryStr && opts.headers['content-type'] === 'application/x-www-form-urlencoded'
    //空字段不传
    for (let key in params) {
        if (isEmpty(params[key])) {
            delete params[key];
        }
    }
    mockServer(url);
    opts = {withCookie:true,...opts};
    var baseUrl;
    switch(process.env.NODE_ENV){
        case 'production':
            baseUrl = opts.proBaseUrl?opts.proBaseUrl:proBaseUrl;
            break;
        case 'development':
            baseUrl = opts.devBaseUrl?opts.devBaseUrl:devBaseUrl;
            break;
        default:baseUrl = proBaseUrl;
    }
    const instance = createAxiosInstance(baseUrl,method,opts);
    var config:TypeInterface._Object = {};
    switch(method.toLocaleUpperCase()){
        case 'GET':
            //get请求参数如果为数组，则拼接为字符串
            Object.keys(params).forEach((o)=>{
                if(Object.prototype.toString.call(params[o])==='[object Array]')
                    params[o] = params[o].join(',');
            })
            config.params = params;
            break;
        case 'POST':
            config = isFrom ?qs.stringify(params) : params;
            break;
    }
    //将请求记录到待处理队列
    pendingFetch.push(reqParams);
    return instance[method](url,config).then((resp:any)=>{
        return handleResponse(reqParams,resp);
    },function(error:any){
        console.log(error.message,error.code)
        if(error.message==='Network Error'){
            // message.warn('Network error. Check the network connection.');
            return Promise.reject(error.message);
        }else if(error.code==='ECONNABORTED'){
            return Promise.reject(error.code);
        }
        else
            return handleResponse(reqParams,error.response);
    })
}

function handleResponse(reqParams:TypeInterface._Object,resp:any){
    if((resp.status>=200&&resp.status<300)||resp.status==304){
        return new Promise((resolve,reject)=>{
            if(!isEmpty(resp.data)){
                const code = resp.data.code||resp.data.status;
                switch(~~code){
                    case 0:
                    case 200:
                        removeFromPendingFetch(reqParams);
                        const returnData = reqParams.opts&&reqParams.opts.isRaw ? resp.data : resp.data.data;
                        reqParams.opts&&reqParams.opts.getResponse ? resolve(resp):resolve(returnData)
                        break;
                    case 118:
                    case 119:
                    case 107:
                        resolve(code);
                        break;
                    case 1020:
                        reject(code);
                        break;
                    case 401://access_token超时
                        addToErrorFetch(reqParams,resolve);
                        break;
                    case 403://没有权限
                        // message.warn(resp.data.message);
                        break;
                    default :
                        removeFromPendingFetch(reqParams);
                        reject(resp.data.msg);
                        break;
                }
                //当待处理队列为空，错误队列不为空且当前不处于处理错误队列的状态，刷新access_token
                if(pendingFetch.length===0&&errorFetch.length>0&&!resolveErrorState){
                    refreshToken();
                } 
            }
            else{
                return Promise.reject(resp.data.msg);
            }
        })
    }else if(resp.status==403){
        return new Promise(function(resolve){
            addToErrorFetch(reqParams,resolve);
            if(pendingFetch.length===0&&errorFetch.length>0&&!resolveErrorState){
                refreshToken();
            } 
        })
    }else if([500,502, 503, 504].indexOf(resp.status)>-1){
        // finishLoading();
        Modal.destroyAll();
        // Err50x((component:any) => {
        //     ReactDOM.render(React.createElement(component), document.getElementById('container'));
        // });
        removeFromPendingFetch(reqParams);
        return Promise.reject(resp.data.msg);
    }else{
        removeFromPendingFetch(reqParams);
        if(pendingFetch.length===0&&errorFetch.length>0&&!resolveErrorState){
            refreshToken();
        } 
        return Promise.reject(resp.data.msg);
    }
}

/**
 * 刷新token,并继续上次的请求
 */
function refreshToken(){
    if(isEmpty(getCookie('refresh_token'))){}
        // redirectToLogin();
    else{
        _axios({
            method:'POST',
            baseURL:process.env.NODE_ENV==='production'?proBaseUrl:devBaseUrl,
            url:API.APP_TOKEN,
            data:qs.stringify({
                'grant_type':'refresh_token', 
                'refresh_token':getCookie('refresh_token'),
                'client_id':'one_account', 
                'client_secret':'Aa123456'
            }),
            headers:createHttpHeader({
                    withCookie:false,
                    headers:{'content-type':'application/x-www-form-urlencoded'}},'post')
        }).then((resp:any)=>{
            if(resp.data&&resp.data.code==0){
                setCookie('access_token',resp.data.access_token,resp.data.expires_in*1000);
                setCookie('refresh_token',resp.data.refresh_token);
                localStorage.setItem('tclCloud_baseUrl',resp.data.host);
                //重新请求上次的接口
                resolveErrorState = true;
                errorFetch.forEach((o)=>{
                    //通过保存的resolve来链接到原来的状态，保证原来等待的请求Promise收到重新请求的数据
                    http(o.entity).then((obj:any)=>o.resolve(obj))
                })
                errorFetch.length = 0;
                resolveErrorState = false;
            }else
                handleLoginInfoError();
        }).catch((error:any)=>{
            handleLoginInfoError();
        })
    }
}
function handleLoginInfoError(){
    Modal.destroyAll();
    // clearData();
    // LoginInfoError((component:any) => {
    //     ReactDOM.render(React.createElement(component), document.getElementById('container'));
    // });
}

function removeFromPendingFetch(reqParams:TypeInterface._Object){
    const index = pendingFetch.findIndex((o)=>o.url===reqParams.url);
    pendingFetch.splice(index,1);
}

function addToErrorFetch(reqParams:TypeInterface._Object,resolve:any){
    const index = pendingFetch.findIndex((o)=>o.url===reqParams.url);
    pendingFetch.splice(index,1);
    errorFetch.push({entity:reqParams,resolve});
}

axios.get = function(url:string,params:TypeInterface._Object={},opts:TypeInterface._Object={}){
    return http({method:'get',url,params,opts});
}

axios.post = function(url:string,params:TypeInterface._Object={},opts:TypeInterface._Object={}){
    return http({method:'post',url,params,opts});
}

axios.raw = function(method:string,url:string,params:TypeInterface._Object={},opts:TypeInterface._Object={}){
    opts = {...opts,isRaw:true};
    return http({method,url,params,opts});
}

export default axios;