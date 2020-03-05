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
                avatar: "https://avatars1.githubusercontent.com/u/15435074?s=60&v=4",
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
                    {'uid':1,'name':'TCL','desc':'TCL云创',pid:0},
                ],
                'staff':[
                    {'autoId':0,'avatar':'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K',
                    'name':'服务器','orgId|1-5':1},
                    {'autoId':1,'avatar': "https://avatars0.githubusercontent.com/u/53926282?s=60&v=4",'name':'陈一冰','orgId|1-5':1},
                    {'autoId':2,'avatar': "https://avatars0.githubusercontent.com/u/53926282?s=60&v=4",'name':'陈二冰','orgId|1-5':1},
                    {'autoId':3,'avatar': "https://avatars0.githubusercontent.com/u/53926282?s=60&v=4",'name':'陈三冰','orgId|1-5':1},
                    {'autoId':4,'avatar': "https://avatars0.githubusercontent.com/u/53926282?s=60&v=4",'name':'陈四冰','orgId|1-5':1},
                    {'autoId':5,'avatar': "https://avatars0.githubusercontent.com/u/53926282?s=60&v=4",'name':'陈五冰','orgId|1-5':1},
                    {'autoId':6,'avatar': "https://avatars0.githubusercontent.com/u/53926282?s=60&v=4",'name':'陈六冰','orgId|1-5':1},
                    {'autoId':7,'avatar': "https://avatars0.githubusercontent.com/u/53926282?s=60&v=4",'name':'陈七冰','orgId|1-5':1},
                    {'autoId':8,'avatar': "https://avatars0.githubusercontent.com/u/53926282?s=60&v=4",'name':'陈八冰','orgId|1-5':1},
                    {'autoId':9,'avatar': "https://avatars0.githubusercontent.com/u/53926282?s=60&v=4",'name':'陈九冰','orgId|1-5':1},
                    {'autoId':10,'avatar': "https://avatars0.githubusercontent.com/u/53926282?s=60&v=4",'name':'陈十冰','orgId|1-5':1}
                ]
            }
        }
    }
]