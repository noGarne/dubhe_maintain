// 导航的接口
function buildMenu() {
    var sections=[];
    var homeSections=[];
    sections={
        home:{
            id:0,
            name: 'home.home',//首页
            type: 'link',
            link: 'Home',
            icon: 'icon-shouye',
            setLimit:'2,3',// 1-用户组权限显示；2-头部左滑菜单添加路由；3-首页不显示模块
            children:[]
        },
    //     dispatch:{
    //         id:200,
    //         name: 'dispatch.dispatch',//智能调度
    //         english:"Intelligent scheduling",
    //         type: 'link',
    //         route: 'Dispatch',
    //         icon: 'icon-zhinengtiaodu',
    //         setLimit:'1',
    //         limitList:[{
    //             id:201,
    //             name: 'system.main-dispatch',//主调度
    //             link: 'MainDispatch'
    //         },{
    //             id:202,
    //             name: 'system.second-dispatch',//二级调度
    //             link: 'SecondDispatch'
    //         }],
    //         children:[
    //             {
    //                 id:210,
    //                 name: 'route.dispatch',//调度中心
    //                 type: 'link',
    //                 route: 'Dispatch',
    //                 link:"/dispatch",
    //                 icon: 'icon-tiaoduzhongxin'
    //             },
    //             {
    //                 id:213,
    //                 name: 'route.dispatch-command',//调度指挥
    //                 type: 'link',
    //                 route:'Temporary',
    //                 icon: 'icon-tiaoduzhihui',
    //                 children:[
    //                     {
    //                       name :"tools.temporary-assign",//临时指派
    //                       link: "/tools/temporary",
    //                       icon: "icon-delegate",
    //                       type: "link"
    //                     },
    //                     {
    //                       name :"dispatch.device-operation",//终端操作
    //                       link: "/tools/terminal",
    //                       icon: "icon-caozuo",
    //                       type: "link"
    //                     }
    //                   ],
    //             },
    //             {
    //                 id:211,
    //                 name: 'route.dispatch-set',//调度配置
    //                 type: 'link',
    //                 route:"DispatchSet",
    //                 icon: 'icon-tiaodupeizhi',
    //                 children:[
    //                     {
    //                       name :"dispatch-set.live-set",//现场设置
    //                       icon: "icon-set-configure",
    //                       type: "link",
    //                       children:[
    //                         {
    //                           name :"dispatch-set.production-plan",//生产计划
    //                           link: "/dispatchSet/productionPlan"
    //                         },
    //                         {
    //                           name :"dispatch-set.status-set",//状态设置
    //                           link: "/dispatchSet/statusSet"
    //                         },
    //                         {
    //                           name :"dispatch-set.ability-set",//能力设置
    //                           link: "/dispatchSet/diggerAbility"
    //                         },
    //                         {
    //                           name :"dispatch.priority-set",//优先级设置
    //                           link: "/dispatchSet/priority"
    //                         },
    //                         {
    //                           name :"dispatch-set.material-set",//物料设置
    //                           link: "/dispatchSet/materialSet"
    //                         },
    //                         {
    //                           name :"dispatch-set.device-position-set",//设备位置设置
    //                           link: "/dispatchSet/devicePositionSet"
    //                         },
    //                         {
    //                           name :"dispatch-set.device-site-set",//设备停靠位设置
    //                           link: "/dispatchSet/deviceSiteSet"
    //                         },
    //                         {
    //                           name :"dispatch-set.place-position-set",//场地位置设置
    //                           link: "/dispatchSet/positionSet"
    //                         },
    //                         {
    //                           name :"dispatch-set.subarea-set",//分区调拨
    //                           link: "/dispatchSet/subareaSet"
    //                         },
    //                       ]
    //                     },
    //                     {
    //                       name :"dispatch-set.lock-forbidden",//锁定禁止
    //                       icon: "icon-yilaiguanxi",
    //                       type: "link",
    //                       children:[
    //                         {
    //                           name :"dispatch-set.hauling-track",//运输路线
    //                           link: "/dispatchSet/haulingTrack"
    //                         },
    //                         {
    //                           name :"dispatch-set.truck-lock",//卡车锁定
    //                           link: "/dispatchSet/truckLock"
    //                         },
    //                         {
    //                           name :"dispatch-set.truck-forbidden",//卡车禁止
    //                           link: "/dispatchSet/truckForbidden"
    //                         },
    //                       ]
    //                     },
    //                     {
    //                       name :"dispatch-set.base-info",//基础信息
    //                       icon: "icon-jichuxinxishezhi",
    //                       type: "link",
    //                       children:[
    //                         {
    //                           name :"dispatch-set.driver-edit",//司机修改
    //                           link: "/dispatchSet/driverEdit"
    //                         },
    //                         {
    //                           name :"dispatch-set.other-set",//杂项设置
    //                           link: "/dispatchSet/otherSet"
    //                         },
    //                         {
    //                           name :"dispatch-set.device-disabled",//设备禁用
    //                           link: "/dispatchSet/deviceDisabled"
    //                         },
    //                       ]
    //                     },
    //                 ],
    //             },
				// {
				//     id:357,
				//     name: 'route.dispatch-list',//调度策略
				//     type: 'link',
				//     route:"DispatchStr",
				//     icon: 'icon-tiaoducelve',
				//     children:[
				//         {
				//           name :"route.trad-group",//传统调度
				//           icon: "icon-set-configure",
				//           link: "/dispatchStr/tradGroup"
				//         },
				//         {
				//           name :"route.accu-group",//精准导向
				//           icon: "icon-yilaiguanxi",
				//           link: "/dispatchStr/accuGroup"
				//         },
				//         {
				//           name :"route.blend-group",//混合调度
				//           icon: "icon-jichuxinxishezhi",
				//           link: "/dispatchStr/blendGroup"
				//         },
				//     ],
				// },
    //             {
    //                 id:212,
    //                 name: 'route.dispatch-info',//调度信息
    //                 type: 'link',
    //                 route: 'Information',
    //                 icon: 'icon-tiaoduxinxi',
    //                 children:[
    //                     {
    //                       name :"dispatch.dispatch-log",//调度历史
    //                       link: "/information/dispatchHistory",
    //                       icon: "icon-tiaodu",
    //                       type: "link"
    //                     },
    //                     {
    //                       name :"dispatch.reciever-log",//远程接管历史
    //                       link: "/information/receiverHistory",
    //                       icon: "icon-tiaodu",
    //                       type: "link"
    //                     },
    //                     {
    //                       name :"information.signal-status",//设备通讯状态
    //                       link: "/information/signalStatus",
    //                       icon: "icon-zhuangtai",
    //                       type: "link"
    //                     },
    //                     {
    //                       name :"information.alarm-history",//报警历史记录
    //                       link: "/information/alarmHistory",
    //                       icon: "icon-baojingxiaoxi",
    //                       type: "link"
    //                     },
    //                     {
    //                       name :"route.output",//产量查询
    //                       icon: "icon-group47",
    //                       type: "link",
    //                       children:[
    //                         {
    //                           name :"information.device-output",//设备产量统计
    //                           link: "/information/output"
    //                         },
    //                         {
    //                           name :"information.effective-output",//有效产量记录
    //                           link: "/information/outputEffective"
    //                         },
    //                         {
    //                           name :"information.output-massages",//产量消息
    //                           link: "/information/outputMsg"
    //                         },
    //                         {
    //                           name :"information.dispatch-instruct",//调度指令
    //                           link: "/information/outputCommand"
    //                         }
    //                       ]
    //                     },
    //                     {
    //                       name :"dispatch.dispatch-list",//调度列表
    //                       link: "/information/dispatchList",
    //                       icon: "icon-zuoyezhongxin",
    //                       type: "link"
    //                     },
    //                     {
    //                       name :"information.drive-time",//出车时间
    //                       link: "/information/departTime",
    //                       icon: "icon-huaban-",
    //                       type: "link"
    //                     },
    //                     {
    //                       name :"information.net-device",//入网车辆
    //                       link: "/information/netVehicle",
    //                       icon: "icon-iconset0401",
    //                       type: "link"
    //                     },
    //                     {
    //                       name :"information.not-out-vehicle",//未出车辆
    //                       link: "/information/notOutVehicle",
    //                       icon: "icon-weitongbu",
    //                       type: "link"
    //                     },
    //                     {
    //                       name :"information.over-speed",//超速查询
    //                       link: "/information/overspeed",
    //                       icon: "icon-suduspeed8",
    //                       type: "link"
    //                     },
    //                     {
    //                       name :"dispatch.device-status",//设备状态
    //                       link: "/information/deviceStatus",
    //                       icon: "icon-shebeiguanli1",
    //                       type: "link"
    //                     }
    //                 ],
    //             }
    //         ]
    //     },
        // monitoring:{
        //     id:400,
        //     name: 'monitoring.monitor',//集成监视
        //     english:"Integrated monitoring",
        //     type: 'link',
        //     route: 'Monitoring',
        //     link: '/monitoring',
        //     icon: 'icon-jichengjianshi',
        //     setLimit:'1',
        //     children:[
        //         {
        //             id:401,
        //             name: 'monitoring.ucenter',//监控中心
        //             type: 'link',
        //             route: 'Monitoring',
        //             link: '/monitoring',
        //             icon: 'icon-jiankongleixing-xiugai'
        //         },
        //         {
        //             id:402,
        //             name: 'monitoring.playback',//数据回放
        //             type: 'link',
        //             route: 'Playback',
        //             link: '/playback',
        //             icon: 'icon-huodonghuifang'
        //         }
        //     ]
        // },
        // loadBoundary:{
        //     id:900,
        //     name: 'route.line-management',//作业管理
        //     english:"Job management",
        //     type: 'link',
        //     route: 'DigLoadingArea',
        //     link: '/digLoadingArea/map/-1',
        //     setLimit:'1',
        //     icon: 'icon-zuoyeguanli',
        //     children:[
        //         {
        //             id:901,
        //             name: 'pages.dig-loading-area',//采装区作业管理
        //             type: 'link',
        //             route: 'DigLoadingAreaMap',
        //             link: '/digLoadingArea/map/-1',
        //             icon: 'icon-caizhuangquzuoye'
        //         },
        //         {
        //             id:904,
        //             name: 'pages.crushing-station',//破碎站作业管理
        //             type: 'link',
        //             route: 'CrushingStationMap',
        //             link: '/crushingStation/map/-1',
        //             icon: 'icon-posuizhanzuoye'
        //         },
        //         {
        //             id:903,
        //             name: 'pages.unloadarea',//卸载区/排土场作业管理
        //             type: 'link',
        //             route: 'UnloadAeraMovementMap',
        //             link: '/unloadAeraMovement/map/-1',
        //             icon: 'icon-paituchangzuoye'
        //         },
        //         {
        //             id:902,
        //             name: 'pages.parking-lot',//停车场作业管理
        //             type: 'link',
        //             route: 'ParkingLotMap',
        //             link: '/parkingLot/map/-1',
        //             icon: 'icon-tingchechangzuoye'
        //         },
        //         // {
        //         //     id:905,
        //         //     name: 'pages.shovel-movement',//采装设备移动规划
        //         //     type: 'link',
        //         //     route: 'ShovelMovementMap',
        //         //     link: '/shovelMovement/map/-1',
        //         //     icon: 'icon-dianchanyidongguihua'
        //         // },
        //     ]
        // },
		mapWatch:{
		    id:400,
		    name: 'map.map-watch',//地图监视
		    english:"Statistical analysis",
		    icon: 'icon-jichengjianshi',
		    setLimit:'1',
		   
		},
        statement:{
            id:600,
            name: 'route.data-analysis',//统计分析
            english:"Statistical analysis",
            type: 'link',
			link: '/sportsCardaily',
            route: 'sportsCardaily',
            icon: 'icon-tongjifenxi',
            setLimit:'1',
            children:[		
				{
				    id:605,
				    name: 'route.sports-cardaily',//跑车日报
				    type: 'link',
				    route: 'sportsCardaily',
					link: '/sportsCardaily',
				    icon: 'icon-paocheribao'
				},
                {
                    id:603,
                    name: 'route.statement-output',//接管分析
                    type: 'link',
                    route: 'RunReport',
                    icon: 'icon-yangshi_icon_tongyong_steeering_wheel',
					children:[
						{
							id:608,
							name: 'route.statement-all',//接管汇总
							type: 'link',
							route: 'TakeoverChartBox',
							link: '/takeoverChart',
						},
						{
							id:603,
							name: 'route.statement-data-detail',//接管数据明细
							type: 'link',
							route: 'RunReport',
							link: '/runReport',
							icon: 'icon-yangshi_icon_tongyong_steeering_wheel',
						},
						{
							id:607,
							name: 'route.takeover-reason-edit',//接管原因配置
							type: 'link',
							route: 'TakeoverReasonEdit',
							link: '/takeoverReasonEdit',
							icon: 'icon-yangshi_icon_tongyong_steeering_wheel',
						}
					]
                },
				{
				    id:602,
				    name: 'route.faultAnaly',//故障分析
				    type: 'link',
				    route: 'FaultAnaly',
				    link: '/faultAnaly',
				    icon: 'icon-guzhangfenxi'
				},
				{
				    id:604,
				    name: 'route.deviationAnaly',//偏差分析
				    type: 'link',
				    route: 'DeviationAnaly',
				    link: '/deviationAnaly',
				    icon: 'icon-pianchafenxi'
				},
				// {
				//     id:601,
				//     name: 'route.statement-data',//汇总分析
				//     type: 'link',
				//     route: 'DataSummary',
				//     link: '/dataSummary',
				//     icon: 'icon-a-ziyuan4'
				// },
				{
				    id:606,
				    name: 'route.efficiencyAnaly',//效率分析
				    type: 'link',
				    route: 'EfficiencyAnaly',
				    link: '/efficiencyAnaly',
				    icon: 'icon-xiaoshuaifenxi'
				},
				// {
				//     id:605,
				//     name: 'route.statement-status',//出勤分析
				//     type: 'link',
				//     route: 'AttenDanceReport',
				//     link: '/attenDanceReport',
				//     icon: 'icon-calendar-fill',
				// 	},
				// {
				//     id:601,
				//     name: 'route.nozzle-analysis',//指点成功率
				//     type: 'link',
				//     route: 'SuccessRate',
				//     link: '/successRate',
				//     icon: 'icon-dianji',
				// },
            ]
        },
		maintainSize:{
		    id:400,
		    name: 'information.maintain-size',//保养管理
		    english:"Statistical analysis",
		    icon: 'icon-baoyangguanli',
		    setLimit:'1', 
		},
		healthAssess:{
		    id:300,
		    name: 'information.health-assess',//健康评估
		    icon: 'icon-jiankangpinggu',
		    setLimit:'1', 
		},
		repairSupervise:{
			id:200,
			name: 'information.repair-supervise',//检维修管理
			icon: 'icon-jianweixiu',
			setLimit:'1', 
		},
		knowledge:{
			id:800,
			name: 'information.knowledge',//知识库
			icon: 'icon-zhishiku',
			setLimit:'1', 
		},
		toolbox:{
		    id:100,
		    name: 'route.tools',//工具箱
		    english:"toolbox",
		    type: 'link',
			link: '/gettingMonitor',
		    route: 'gettingMonitor',
		    icon: 'icon-gongjuxiang',
		    setLimit:'1',
		    children:[
				{
				    id:104,
				    name: 'route.gettingMonitor',//下车指标统计
				    type: 'link',
				    route: 'gettingMonitor',
					 link: '/gettingMonitor',
				    icon: 'icon-xiachezhibiao'
				},
				{
				    id:102,
				    name: 'route.policyMonitor',//决策监控
				    type: 'link',
				    route: 'policyMonitor',
					 link: '/policyMonitor',
				    icon: 'icon-juecejiankong'
				},
				{
				    id:103,
				    name: 'route.controlMonitor',//控制监控
				    type: 'link',
				    route: 'controlMonitor',
					 link: '/controlMonitor',
				    icon: 'icon-kongzhijiankong'
				},
				{
				    id:101,
				    name: 'route.getawayMonitor',//网关监控
				    type: 'link',
				    route: 'gateWayMonitor',
					 link: '/gateWayMonitor',
				    icon: 'icon-wangguanjiankong'
				},
				
			

		    ]
		},
		systemLogSettings:{
			id:700,
			name: 'route.system-set',//系统设置
			icon: 'icon-xitongshezhi',
			setLimit:'1', 
		},
      // dataScreening:{
      //     id: 1000,
      //     name: 'route.data-screening',//数据总览
      //     english:"Data screening",
      //     type: 'link',
      //     link: '/sportsCardaily',
      //     route: 'sportsCardaily',
      //     icon: 'icon-shujuzonglan',
      //     setLimit:'1',
      //     children:[
      		
      //     ]
      // },
        // configuration:{
        //     id:100,
        //     name: 'route.configuration',//基础配置
        //     english:"Basic configuration",
        //     type: 'link',
        //     route: 'BaseSet',
        //     link:'/baseset',
        //     icon: 'icon-jichupeizhi',
        //     setLimit:'1',
        //     children:[
        //         { 
        //             id:101,
        //             name: 'route.mine-management',//矿区管理
        //             type: 'link',
        //             route: 'Subarea',
        //             link:'/baseset/subarea',
        //             icon: 'icon-kuangquguanli',
        //             children:[
        //                 {
        //                     name :"route.group",//分区信息
        //                     link: "/baseset/subarea",
        //                     icon: "icon-zhangbuguanlianguizeguanli",
        //                     type: "link"
        //                   },
        //                   {
        //                     name :"route.step",//台阶信息
        //                     link: "/baseset/step",
        //                     icon: "icon-loutistairs7",
        //                     type: "link"
        //                   },
        //                   {
        //                     name :"material.category",//物料类别
        //                     link: "/baseset/material",
        //                     icon: "icon-wuliaoguanli",
        //                     type: "link"
        //                   },
        //                   {
        //                     name :"device.site-management",//场地管理
        //                     link: "/baseset/siteManagement",
        //                     icon: "icon-yingyongguanli",
        //                     type: "link"
        //                   },
        //             ]
        //         },
        //         {
        //             id:102,
        //             name: 'route.devices',//设备管理
        //             type: 'link',
        //             route: 'Device',
        //             link:'/personnelDevice/device',
        //             icon: 'icon-shebeiguanli',
        //             children:[
        //               {
        //                 name :"device.list",//设备列表
        //                 link: "/personnelDevice/device",
        //                 icon: "icon-Grouping",
        //                 type: "link",
        //               },
        //               {
        //                 name :"device.device-models",//设备型号
        //                 link: "/personnelDevice/model",
        //                 icon: "icon-yingyongguanli",
        //                 type: "link"
        //               },
        //             ],
        //         },
        //         {
        //             id:103,
        //             name: 'route.person-management',//人员管理
        //             type: 'link',
        //             route: 'DispatchShift',
        //             link: "/personnel/dispatchShift",
        //             icon: 'icon-renyuanguanli',
        //             children:[
        //               {
        //                 name :"route.shift-type-set",//班组设置
        //                 icon: "icon-banji",
        //                 type: "link",
        //                 link: "/personnel/dispatchShift",
        //                 children:[
        //                   {
        //                     name :"shift.dispatch-shift-crew",//调度班次
        //                     link: "/personnel/dispatchShift"
        //                   },
        //                   {
        //                     name :"shift.truck-shift-crew",//卡车班次
        //                     link: "/personnel/truckShift"
        //                   }
        //                 ]
        //               },
        //               {
        //                 name :"route.driver",//司机信息
        //                 link: "/personnel/Driver",
        //                 icon: "icon-yonghu1",
        //                 type: "link"
        //               },
        //             ],
        //         },
        //         {
        //             id:104,
        //             name: 'route.data-manager',//数据管理
        //             type: 'link',
        //             route: 'TruckOutput',
        //             link: "/data/truckOutput",
        //             icon: 'icon-shujuguanli',
        //             children:[
        //                 {
        //                   name :"data-manager.truck-output-edit",//卡车产量修改
        //                   link: "/data/truckOutput",
        //                   icon: "icon-tongchanliangtongji",
        //                   type: "link"
        //                 },
        //                 {
        //                   name :"data-manager.login-driver-edit",//登录司机修改
        //                   link: "/data/loginDriver",
        //                   icon: "icon-siji-",
        //                   type: "link"
        //                 },
        //                 {
        //                   name :"data-manager.truck-run-status",//卡车运行状态
        //                   link: "/data/truckRunStatus",
        //                   icon: "icon-xitongzhuangtai",
        //                   type: "link"
        //                 },
        //                 {
        //                   name :"data-manager.truck-current-status",//卡车当前状态
        //                   link: "/data/truckCurrentStatus",
        //                   icon: "icon-B",
        //                   type: "link"
        //                 },
        //                 {
        //                   name :"data-manager.digger-run-status",//采装设备运行状态
        //                   link: "/data/diggerRunStatus",
        //                   icon: "icon-xitongzhuangtai",
        //                   type: "link"
        //                 },
        //                 {
        //                   name :"data-manager.digger-current-status",//采装设备当前状态
        //                   link: "/data/diggerCurrentStatus",
        //                   icon: "icon-B",
        //                   type: "link"
        //                 },
        //                 {
        //                   name :"data-manager.dump-run-status",//卸点运行状态
        //                   link: "/data/dumpRunStatus",
        //                   icon: "icon-xitongzhuangtai",
        //                   type: "link"
        //                 },
        //                 {
        //                   name :"data-manager.dump-current-status",//卸点当前状态
        //                   link: "/data/dumpCurrentStatus",
        //                   icon: "icon-B",
        //                   type: "link"
        //                 },
        //               ],
        //         }
        //     ]
        // },
        // systemLog:{
        //     id:700,
        //     name: 'route.system-set',//系统配置
        //     english:"System configuration",
        //     type: 'link',
        //     route: 'System',
        //     setLimit:'1',
        //     icon: 'icon-xitongpeizhi',
        //     children:[
        //         {
        //             id:703,
        //             name: 'system.user-management',//用户管理
        //             type: 'link',
        //             route: 'UserGroup',
        //             icon: 'icon-dinglanyonghu',
        //             children:[
        //                 {
        //                   name :"route.user-group",//组管理
        //                   link: "/user/group",
        //                   icon: "icon-zuhe",
        //                   type: "link"
        //                 },
        //                 {
        //                   name :"system.user-management",//用户管理
        //                   link: "/user/list",
        //                   icon: "icon-yonghu",
        //                   type: "link"
        //                 },
        //               ],
        //         },
        //         {
        //             id:701,
        //             name: 'system.system-log',//系统维护
        //             type: 'link',
        //             route: 'StatusReason',
        //             icon: 'icon-xitongweihu',
        //             children:[
        //                 {
        //                   name :"route.status-reason",//原因类型
        //                   link: "/system/statusReason",
        //                   icon: "icon-duomeitiicon-",
        //                   type: "link"
        //                 },
        //                 {
        //                   name :"route.alarm-set",//消息配置
        //                   link: "/system/alarmSet",
        //                   icon: "icon-baojingguanli",
        //                   type: "link"
        //                 },
        //                 {
        //                   name :"route.map-management",//地图管理
        //                   link: "/system/pathFile",
        //                   icon: "icon-dituguanli",
        //                   type: "link"
        //                 },
        //                 {
        //                   name :"route.path-management",//路径管理
        //                   link: "/system/dynamicPath",
        //                   icon: "icon-icon-lujingguanli",
        //                   type: "link"
        //                 },
        //             ],
        //         },
        //         {
        //             id:702,
        //             name: 'route.system-debug',//系统调试
        //             type: 'link',
        //             route: 'ClosedClass',
        //             icon: 'icon-xitongtiaoshi',
        //             children:[
        //                 {
        //                   name :"tools.closed-class",//收班操作
        //                   link: "/systemDebug/closedClass",
        //                   icon: "icon-paibanguanli",
        //                   type: "link"
        //                 },
        //                 {
        //                   name :"tools.custom-feature",//定制功能
        //                   link: "/systemDebug/customFeature",
        //                   icon: "icon-kongzhi",
        //                   type: "link"
        //                 },
        //                 {
        //                   name :"tools.remote-operation",//远程启停
        //                   link: "/systemDebug/remoteOperation",
        //                   icon: "icon-tiaoshi",
        //                   type: "link"
        //                 },
        //                 {
        //                   name :"route.vehicle-log",//车端日志
        //                   link: "/systemDebug/vehicleLog",
        //                   icon: "icon-xueshengrizhi",
        //                   type: "link"
        //                 },
        //                 {
        //                   name :"route.system-config",//系统配置
        //                   link: "/systemDebug/systemConfig",
        //                   icon: "icon-peizhiguanli",
        //                   type: "link"
        //                 },
        //                 {
        //                   name :"route.lpx-manage",//lpx文件管理
        //                   link: "/systemDebug/lpxManage",
        //                   icon: "icon-shangchuan",
        //                   type: "link"
        //                 },
        //             ]
        //         }
        //     ]
        // },

    }
    return {
        sections:sections,
        homeSections:homeSections
    }
}

function getSections(){
    return buildMenu().sections;
}

export default {
    getSections: getSections
}