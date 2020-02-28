import CONST from './const';
const proBaseUrl = 'http://localhost:3011';
const devBaseUrl:string = 'http://localhost:3011';
const devBaseUrls:TypeInterface._Object = {
    baseUrl1:'https://www.test-teye.com/api',
    baseUrl2:'http://localhost:3011',
}
const proBaseUrls:TypeInterface._Object = {
    baseUrl1:'https://www.test-teye.com/api',
    baseUrl2:'http://localhost:3011',
}

interface conf {
    baseUrl?:string,
}

export default (function () {
    let config:conf = {};
    switch(process.env.NODE_ENV){
        case 'production':
            config.baseUrl = proBaseUrls.baseUrl1 ;
            break;
        case 'development':
            config.baseUrl = devBaseUrls.baseUrl1 ;
            break;
        default:
            config.baseUrl = 'http://' + location.host + '/' + process.env.NODE_ENV.split('_')[1];
    }
    return config;
})();

const resourceBaseUrl = 'http://18.222.66.96'

const apiTest:Array<string> = [];
let temp:TypeInterface._Object = CONST;
Object.keys(CONST).forEach(o=>{
    apiTest.push(temp[o])
})

export {
    apiTest,
    resourceBaseUrl,
    proBaseUrl,
    devBaseUrl,
    devBaseUrls,
    proBaseUrls
}
