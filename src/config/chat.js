let location = window.location;
module.exports = (function(){
    var config = {
        msgMaxCount:100, //本地最多能存储的历史记录
        emoticonNames:[
            'cool',
            'fight',
            'hush',
            'laugh',
            'laughAndCry',
            'smile',
            'tired',
            'unhappy',
            'wunai',
            'sad',
            'angry',
            'naughty',
            'asleep',
            'cry',
            'han',
            'ignore',
            'scared',
            'question',
            'sleep',
            'handshake',
            'enjoy',
            'koubi',
            'se',
            'shuai',
            'wuyu',
            'yun',
            'down',
            'up',
            'victory',
            'wugu',
            'qiu',
            'yinxian',
            'haixiu',
            'huaixiao',
            'kelian',
            'bigMouth',
            'amazed',
            'cryNotStop',
            'grievance',
            'pig',
            'doNotCare'
        ]
    };

    if(process.env.NODE_ENV === 'production'){
        config.server=`http://3.1.103.172:3012`;
    }else{
        // config.server=`http://3.1.103.172:3012`;
        config.server=`${location.hostname}:3012`;
        // var ch='tmp';
        // if(location.search){
        //     //假定location.search等于?ch=tmp
        //     ch=location.search.slice(4);
        // }
        // if(ch=='web'){
        //     config.server=`119.23.205.81:3006`;
        // }else {
        //     config.server = `${location.hostname}:3006`;
        // }
    }

    return config;
})();