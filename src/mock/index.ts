import Mock, { mock } from 'mockjs';
import {proBaseUrls,devBaseUrls} from 'config/api';
// let FetchMock =  require('fetch-mock');
// //匹配不到则走网络
// FetchMock.config.fallbackToNetwork = true;
// api.ftpBaseUrl='';

Mock.setup({
    timeout: 500
});

let baseUrls:Array<string> = [];
Object.keys(proBaseUrls).forEach((o:string)=>{
    baseUrls.push(proBaseUrls[o])
})
Object.keys(devBaseUrls).forEach((o:string)=>{
    baseUrls.push(devBaseUrls[o])
})


var mockList:Array<any> = [];

// mockList = mockList.concat(require('./login'));
mockList = mockList.concat(require('./app'));
mockList = mockList.concat(require('./chat'));
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
var mockData:TypeInterface._Object = {};

mockList.forEach((obj) => {
    mockData[obj.url] = obj.result;
});

export function mockServer (url:string) {
    if (mockData[url]) {            
        baseUrls.forEach((o:any)=>{
            Mock.mock(o + url, mockData[url]);
        })
        
    }
}

// module.exports = mockServer;
