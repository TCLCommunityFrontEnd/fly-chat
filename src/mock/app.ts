module.exports = [
    {
        desc:'获取登录人员信息',
        type:'GET',
        url:'/user/loginInfo.do',
        params:{
            ts:1567243858051,//时间戳
        },
        result:{
            "status":0,
            'data':{
                avatar: "cloud/avatar/13888888888/a_admin20170427164138.jpg",
                companyName: "TCL云创科技有限公司",
                companyNo: "1",
                id: 1,
                managerType: "1",
                name: "A管理员"
            }
        }
    },
    {
        desc:'',
        type:'GET',
        url:'/company/org_staff.do',
        params:{
            ts:1567243858051,//时间戳
        },
        result:{
            'data':{
                'orgs':[
                    {'autoId':1,'name':'@cname','desc':'@csentence(6, 10)',parentId:0},
                    {'autoId':2,'name':'@cname','desc':'@csentence(6, 10)',parentId:1},
                    {'autoId':3,'name':'@cname','desc':'@csentence(6, 10)',parentId:1},
                    {'autoId':4,'name':'@cname','desc':'@csentence(6, 10)',parentId:3},
                    {'autoId':5,'name':'@cname','desc':'@csentence(6, 10)',parentId:3}
                ],
                'staff':[
                    {'autoId':1,'avatar': "https://avatars0.githubusercontent.com/u/53926282?s=60&v=4",'name':'@cname','orgId|1-5':1},
                    {'autoId':2,'avatar': "https://avatars0.githubusercontent.com/u/53926282?s=60&v=4",'name':'@cname','orgId|1-5':1},
                    {'autoId':3,'avatar': "https://avatars0.githubusercontent.com/u/53926282?s=60&v=4",'name':'@cname','orgId|1-5':1},
                    {'autoId':4,'avatar': "https://avatars0.githubusercontent.com/u/53926282?s=60&v=4",'name':'@cname','orgId|1-5':1},
                    {'autoId':5,'avatar': "https://avatars0.githubusercontent.com/u/53926282?s=60&v=4",'name':'@cname','orgId|1-5':1},
                    {'autoId':6,'avatar': "https://avatars0.githubusercontent.com/u/53926282?s=60&v=4",'name':'@cname','orgId|1-5':1},
                    {'autoId':7,'avatar': "https://avatars0.githubusercontent.com/u/53926282?s=60&v=4",'name':'@cname','orgId|1-5':1},
                    {'autoId':8,'avatar': "https://avatars0.githubusercontent.com/u/53926282?s=60&v=4",'name':'@cname','orgId|1-5':1},
                    {'autoId':9,'avatar': "https://avatars0.githubusercontent.com/u/53926282?s=60&v=4",'name':'@cname','orgId|1-5':1},
                    {'autoId':10,'avatar': "https://avatars0.githubusercontent.com/u/53926282?s=60&v=4",'name':'@cname','orgId|1-5':1}
                ]
            }
        }
    }
]