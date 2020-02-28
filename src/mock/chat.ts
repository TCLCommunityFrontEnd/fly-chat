module.exports  = [
    {
        desc:'',
        type:'GET',
        url:'/chat-group/myGroups.do',
        params:{
            ts:1567243858051,//时间戳
        },
        result:{
            "status":0,
            'data|3-5':[
                {
                    'autoId':'@increment',
                    'companyId':20,
                    'describe':'@csentence(6, 10)',
                    'manager|1-10':1,
                    'memberIds':'@range(1,10)',
                    'name':'@cname'
                }
            ]
        }
    }
]