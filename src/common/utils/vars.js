/**
 * 全局公共变量
 */

//  查询有分页的所有数据时默认分页数据
const pageData = {
    pageSize:1000,
    pageIndex:1
};

//  分页初始化数据
var pageInit = {
    total:0,
    pageSize:15,
    pageIndex:1
};

//  物料类别
const materialType=[
    {
        id:1,
        code:"MINERAL",
        name:'矿物'
    },
    {
        id:2,
        code:"WASTE",
        name:'废料'
    }
];

//  物料单位
const MATERIAL_UNIT=[
    {
        name:'吨'
    }
];

// 折算系数
const conversionRateList = [
    {
        id:1,
        name:1
    },{
        id:0.5,
        name:0.5
    }
];

// 物料类型
const dumpTypeList = [
    {
        type:"CRUSH_STATION",
        name:"破碎站"
    }
];

// 系统消息
const systemAlarmTypeList = [
    {
        type:"OUTPUT_SYNC",
        name:"产量同步"
    }
];

// 设备类型
const deviceType = [
    { id:2, name:"卡车", type:"TRUCK" },
    { id:1, name:"采装设备", type:"SHOVEL" },
    { id:3, name:"卸点", type:"DUMPAREA" },
];

// NOTE: equipmentTypeSn和showTypeSn应用场景不一致，id不对应
// 调度类型 对应equipmentTypeSn
const deviceTypeNew = [
    { id:2, name:"卡车", type:"TRUCK" },
    { id:1, name:"采装设备", type:"SHOVEL" },
    { id:3, name:"卸点", type:"DUMPAREA" },
    { id:4, name:"辅助场所", type:"AUXILIARY_SPACE" },
    { id:6, name:"接管舱", type:"CABIN" },
    { id:5, name:"其它", type:"OTHER" },
    // {
    //     id:4,
    //     name:"停车区",
    //     type:"PARKING_SPACE"
    // },
];

// 显示设备类型 对应showTypeSn
const showTypeList = [
    {
        id:1,
        name:"矿卡设备",
        subType:[
            { id:100, name:"矿用自卸卡车" },
            { id:101, name:"矿用宽体自卸车" }
        ]
    },
    {
        id:2,
        name:"采装设备",
        subType:[
            { id:200, name:"电铲" },
            { id:201, name:"挖机" }
        ]
    },
    {
        id:3,
        name:"卸点设备",
        subType:[
            { id:300, name:"破碎机" }
        ]
    },
    {
        id:4,
        name:"辅助车辆设备",
        subType:[
            { id:400, name:"推土机" },
            { id:401, name:"洒水车" },
            { id:402, name:"平地机" },
            { id:403, name:"压路机" },
            { id:404, name:"生产指挥车" },
            { id:405, name:"加油车" },
            { id:406, name:"装载机" },
            { id:407, name:"其它" }
        ]
    },
    {
        id:5,
        name:"地面设备",
        subType:[
            { id:500, name:"路侧单元" },
            { id:501, name:"通信基站" },
            { id:502, name:"定位基站" },
            { id:503, name:"其它" }
        ]
    },
    {
        id:6,
        name:"基础场地"
    },
    {
        id:7,
        name:"远程接管舱"
    },
];

// 基础场地
// UNKNOWN("未知", -1), ROAD("路段", 0), CROSSING("交叉路口", 1), LOADAREA("装载区域", 2), DUMPAREA("卸载区域", 3), PARKINGAREA("停车区域", 4), GASAREA("加油区域", 5), MAINTENANCEAREA("维修区域", 6),  LANE_TYPE_TWO("双行线", 1000), LANE_TYPE_ONE("单行线", 1001);
const baseSite = {
    id:6,
    name:"基础场地",
    subType:[{
        id:600,
        name:"排土场"//卸载区
    },{
        id:601,
        name:"停车场"//非生产区
    },{
        id:602,
        name:"采装区"//装载区
    },{
        id:603,
        name:"破碎站"//卸载区
    },{
        id:604,
        name:"转运台"//卸载区
    },{
        id:605,
        name:"加油站"//非生产区
    },{
        id:606,
        name:"维修区"//非生产区
    }],
    mapType:[{
        id:2,
        name:"装载区域",//装载区
        type:"LOADAREA"
    },{
        id:3,
        name:"卸载区域",//卸载区
        type:"DUMPAREA"
    },{
        id:4,
        name:"停车区域",//非生产区
        type:"PARKINGAREA"
    }]
}

// 除设备外的其他元素类型
const elementType=[{
    id:4,
    name:"物料",
    type:"MATERIAL"
},{
    id:5,
    name:"分区",
    type:"SUBAREA"
},{
    id:6,
    name:"班次",
    type:"SHIFT"
}];

// 延时故障原因
const equipmentOpStatus=[
    {
        id:3,
        name:'故障'
    },
    {
        id:2,
        name:'延时'
    }
];

// 运行状态
const runStatus=[{
        code:1,
        id:'READY',
        name:'就绪',
        color:'#06de9e'
    },{
        code:2,
        id:'DELAY',
        name:'延时',
        color:'#ffba00'
    },{
        code:3,
        id:'TROUBLE',
        name:'故障',
        color:'#ff3131'
    },{
        code:4,
        id:'SPARE',
        name:'备用',
        color:'#00a6ff'
    }
];

// 规则类型
const ruleType=[{
        id:1,
        name:'TRUCK_TO_DUMPAREA'
    },{
        id:2,
        name:'TRUCK_TO_SHOVEL'
    },{
        id:3,
        name:'TRUCK_TO_MATERIAL'
    },{
        id:4,
        name:'SHOVEL_TO_DUMPAREA'
    },{
        id:5,
        name:'SUBAREA_TO_DUMPAREA'
    }
];

// 优先级
const priorityList=[
    {
      id:0,
      name:"最高"
    },
    {
      id:1,
      name:"高"
    },
    {
      id:2,
      name:"中"
    },
    {
      id:3,
      name:"低"
    },
    {
      id:4,
      name:"最低"
    }
];

const runStateList=[
    {
        value:1,
        text:"停车"
    },
    {
        value:2,
        text:"运行"
    },
    {
        value:0,
        text:"-"
    },
]

// 正常派遣/暂停派遣
const stopDispatch=[
    {
        type:false,
        name:'正常派遣'
    },
    {
        type:true,
        name:'暂停派遣'
    }
]
// 调度任务状态 UNKNOW("无任务", 0), ROAD("道路行驶", 1), ROAD_NOTICE("道路预告", 2), QUEUE("排队等待", 3), DOCKING("驶入停靠", 4), DOCKED("停靠完成", 5), LOADING("装载中", 6), LOADED("装载完成", 7), UNLOADING("卸载中", 8), UNLOADED("卸载完成", 9),APPLY_LOAD_TASK("申请装载任务", 10),  APPLY_UNLOAD_TASK("申请卸载任务", 11);
const  dispatchTaskStatus=[{
        id:0,
        text:'无任务',
        value:'UNKNOW'
    },{
        id:1,
        text:'道路行驶',
        value:'ROAD'
    },{
        id:2,
        text:'道路预告',
        value:'ROAD_NOTICE'
    },{
        id:3,
        text:'排队等待',
        value:'QUEUE'
    },{
        id:4,
        text:'驶入停靠',
        value:'DOCKING'
    },{
        id:5,
        text:'停靠完成',
        value:'DOCKED'
    },{
        id:6,
        text:'装载中',
        value:'LOADING'
    },{
        id:7,
        text:'装载完成',
        value:'LOADED'
    },{
        id:8,
        text:'卸载中',
        value:'UNLOADING'
    },{
        id:9,
        text:'卸载完成',
        value:'UNLOADED'
    },{
        id:10,
        text:'申请装载任务',
        value:'APPLY_LOAD_TASK'
    },{
        id:11,
        text:'申请卸载任务',
        value:'APPLY_UNLOAD_TASK'
    },{
        id:12,
        text:'举斗前行',
        value:'DRIVE_WTH_BUCK_ELIFT'
    },{
        id:13,
        text:'装载区停靠完成',
        value:'LOADPLACE_DOCK_POINT_DOCKED'
    }
];


// 驾驶模式
const drivingMode=[
    {
        type:"MANU",
        value:0,
        name:"人工"
    },
    {
        type:"AUTO",
        value:1,
        name:"自动"
    },
    {
        type:"REMOTE_CONTROL",
        value:2,
        name:"遥控"
    },
    {
        type:"UNKNOW",
        value:-1,
        name:"-"
    }
];
// 驾驶模式
const dmodeList = [
    {
      name:"自动运输",
      value:1,
      type:"AUTO"
    },
    {
      name:"半自动运输",
      value:2,
      type:"SEMI_AUTO"
    },
    {
      name:"人工运输",
      value:4,
      type:"MANU"
    },
    // {
    //     name:"遥控运输",
    //     value:3,
    //     type:"REMOTE_CONTROL"
    // },

  ]

// 工作状态
const loadStatus=[
    {
        value:0,
        name:"空载"
    },
    {
        value:1,
        name:"半载"
    },
    {
        value:2,
        name:"未知"
    },
    {
        value:3,
        name:"重载"
    },
    {
        value:-1,
        name:"未知"
    }
];
// 调度模式
const dispatchingMode=[
    {
        type:"MANU",
        name:"人工指派"
    },
    {
        type:"AUTO",
        name:"系统指派"
    },
];

// 定位状态
const locationStatus=[
    {
        id:0,
        name:'未定位'
    },
    {
        id:1,
        name:'GPS定位'
    },
    {
        id:2,
        name:'差分定位'
    }
];

// 雨雪天气
const weatherType=[
    {
        id:1,
        name:'正常模式'
    },
    {
        id:2,
        name:'雨雪天气'
    }
];


// 排班类别
const shiftType=[
    {
        type:"DISPATCH",
        name:"调度"
    },
    {
        type:"TRUCK",
        name:"卡车"
    },
];

// 报表类别
const reportType=[
    {
        type:"output",
        name:"产量报表"
    },
    {
        type:"fault",
        name:"故障延时报表"
    },
];

// 需要处理的报警类型
const alarmHandleType=["DIGGER_APPLIED_TO_BREAKDOWN_STATE", "DIGGER_APPLIED_TO_DELAY_STATE", "DIGGER_APPLIED_TO_READY_STATE", "DIGGER_APPLIED_TO_STANDBY_STATE", "DUMP_APPLIED_TO_BREAKDOWN_STATE", "DUMP_APPLIED_TO_DELAY_STATE", "DUMP_APPLIED_TO_READY_STATE", "DUMP_APPLIED_TO_STANDBY_STATE", "TRUCK_AUTO_APPLIED_TO_BREAKDOWN_STATE", "TRUCK_AUTO_APPLIED_TO_DELAY_STATE", "TRUCK_AUTO_APPLIED_TO_READY_STATE", "TRUCK_AUTO_APPLIED_TO_STANDBY_STATE", "TRUCK_MANU_APPLIED_TO_BREAKDOWN_STATE", "TRUCK_MANU_APPLIED_TO_DELAY_STATE", "TRUCK_MANU_APPLIED_TO_READY_STATE", "TRUCK_MANU_APPLIED_TO_STANDBY_STATE","DIGGER_APPLY_FOR_MATERIAL_BINDING"];


// 主题样式
const themeList=[
    {
      id:1,
      name:"深色主题",
      color:'#000'
    },
    {
      id:2,
      name:"浅色主题",
      color:'#fff'
    },
];


// 报警消息类型
const alarmType = [{
    type:'LOAD_BOUNDARY_UPDATE',
    name:'装载区边界更新'
},{
    type:'UNLOAD_BOUNDARY_UPDATE',
    name:'卸载区边界更新'
},{
    type:'DOCK_GROUP_STATE_CHANGE',
    name:'停靠区状态更新'
},{
    type:'LOAD_OBSTACLE_UPDATE',
    name:'装载区障碍物更新'
},{
    type:'UNLOAD_OBSTACLE_UPDATE',
    name:'排土场障碍物更新'
},{
    type:'SHOVEL_DOCK_POINT',
    name:'采装设备指点失败'
}];

const workingStatusList = [
    {
      type:"UNKNOWN",
      code:-1,
      name:'未知',
      color:"#001d33",
    },
    {
      type:"STOP",
      code:0,
      name:'关闭',
      color:"#e60012"
    },
    {
      type:"RUNNING",
      code:1,
      name:'开放',
      color:"#73cd37"
    },
    {
      type:"DISABLE",
      code:2,
      name:'禁用',
      color:"#001d33"
    },
    {
      type:"STOPING",
      code:3,
      name:'正在停用',
      color:"#ffd40c"
    }
  ];

// 场地作业类型
const placeJobType = [
    { id:"AUTO", code:1, name:'自动' },
    { id:"MANU", code:2, name:'人工' }
];

  // 通信状态
const signalStatusList = [
    { text: "在线", value: true },
    { text: "离线", value: false },
];

// 驾驶舱状态
const cabinStatus = [{
  id:0,
  name:'空闲中'
},{
  id:1,
  name:'待接受'
},{
  id:2,
  name:'待启动'
},{
  id:3,
  name:'接管中'
}];

// 驾驶舱接管任务
const cabinTask = [{
  id:0,
  name:'靠边停车'
},{
  id:1,
  name:'精确停靠'
},{
  id:2,
  name:'绕障'
},{
  id:3,
  name:'行驶至调度目标'
}];

// 远程启停操作
const remoteOperationList=[
    {
        type:"RemoteParking",
        name:"遥控停车",
        text:"安全停车"
    },
    {
        type:"EmergencyBraking",
        name:"紧急制动",
        text:"紧急停车"
    },
    {
        type:"MissionAbort",
        name:"任务终止",
        text:"终止"
    },
    {
        type:"SwitchToDriving",
        name:"继续行驶",
        text:"启动"
    },
];

export default{
    pageData,
    pageInit,
    materialType,
    MATERIAL_UNIT,
    conversionRateList,
    dumpTypeList,
    systemAlarmTypeList,
    deviceType,
    deviceTypeNew,
    showTypeList,
    baseSite,
    elementType,
    equipmentOpStatus,
    runStatus,
    ruleType,
    priorityList,
    runStateList,
    stopDispatch,
    drivingMode,
    dmodeList,
    loadStatus,
    dispatchingMode,
    locationStatus,
    weatherType,
    shiftType,
    reportType,
    alarmHandleType,
    themeList,
    alarmType,
    workingStatusList,
    placeJobType,
    signalStatusList,
    cabinStatus,
    cabinTask,
    remoteOperationList,
    dispatchTaskStatus
}