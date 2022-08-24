/**
 * 调度中心服务
 */
import ajax from './ajax'

import config from "./config"
var BASE_URL = config.BASE_URL;
const MAINTAIN_URL = config.MAINTAIN_URL;

/**
 * 获取单个设备详情
 * @param {number} deviceId  设备deviceId
 */
function getDeviceDetail(deviceId){
    var url=`${BASE_URL}/atds/equipment/devices/ext/${deviceId}`;
    return ajax(url);
}

/**
 * 采装设备、卸点单个设备运输线路
 * @param {string} deviceId    设备id
 */
function getDeviceHaulingTrack(deviceId){
    let url = `${BASE_URL}/atds/banLockRule/place/byDevice?deviceId=${deviceId}`;
    return ajax(url)
}
/**
 * 查询调度锁定列表
 * @param {number} subareaSn  分区sn
 */
function getDispatchLock(subareaSn){
    var url=`${BASE_URL}/atds/lockRules/rulesAndPropety/shovelToDumparea/list?subareaSn=${subareaSn}`;
    return ajax(url);
}

/**
 * 接管分析列表页
 * @param {string} deviceGroupId  分区id
 */
function takeOverData(data){
    var url=`${MAINTAIN_URL}/takeoverdata`;
    return ajax(url,data);
}
/**
 * 接管分析设备列表
 * 
 */
function getTakeOverList(data){
    var url=`${MAINTAIN_URL}/getDeviceNames`;
    return ajax(url,data,"post");
}

/**
 * 网关监控折线图
 * 
 */
function getWayLine(data){
    var url=`${MAINTAIN_URL}/gateWay/find`;
    return ajax(url,data,"post");
}

/**
 * 网关监控获取颜色list
 * 
 */
function getfindColour(data){
    var url=`${MAINTAIN_URL}/gateWay/findColour`;
    return ajax(url,data,"post");
}

/**
 * 网关监控新增list
 * 
 */
function getsaveColour(data){
    var url=`${MAINTAIN_URL}/gateWay/save`;
    return ajax(url,data,"post");
}

/**
 * 网关监控热力图
 * 
 */
function getHotColour(data){
    var url=`${MAINTAIN_URL}/gateWay/thermodynamic`;
    return ajax(url,data,"post");
}


/**
 * 网关监控饼图
 * 
 */
function getPieColour(data){
    var url=`${MAINTAIN_URL}/gateWay/sector`;
    return ajax(url,data,"post");
}

/**
 * 网关监控删除list
 * 
 */
function getdelColour(data){
    var url=`${MAINTAIN_URL}/gateWay/del`;
    return ajax(url,data,"post");
}


/**
 * 控制监控字段
 * 
 */
function getField(data){
    var url=`${MAINTAIN_URL}/field`;
    return ajax(url,data,"post");
}



/**
 * 查询
 * @param {string} deviceGroupId  分区id
 */
function addLocked(deviceGroupId,data){
    var url=`${BASE_URL}/fleetDispatcher/${deviceGroupId}/lockRules?_body=list`;
    return ajax(url,data,'post');
}
// 控制监控查询无数据日期
function findExistDataBydateEve(data){
    var url=`${MAINTAIN_URL}/controlMonitor/findExistDataBydate`;
    return ajax(url,data,'post');
}



/**
 * 查询行程
 */
function findMontitoring(data){
    var url=`${MAINTAIN_URL}/timeslot`;
    return ajax(url,data,'post');
}

/**
 * 故障分析故障设备排名查询接口
 */
function faultFindEve(data){
    var url=`${MAINTAIN_URL}/faultAnalysic/find`;
    return ajax(url,data,'post');
}

/**
 * 偏差分析偏差详情查询
 */
function analysisDetails(data){
    var url=`${MAINTAIN_URL}/deviationAnalysis/details`;
    return ajax(url,data,'post');
}

// 导入的跑车时间前端展示
function getAttendanceScheduleEve(data){
    var url=`${MAINTAIN_URL}/sportLong/getAttendanceSchedule`;
    return ajax(url,data,'post');
}

/**
 * 故障分析故障模块排名查询接口
 */
function faultRankingEve(data){
    var url=`${MAINTAIN_URL}/faultAnalysic/faultRanking`;
    return ajax(url,data,'post');
}

//接管明细保存接管原因与备注
function saveTakeReasonEve(data){
    var url=`${MAINTAIN_URL}/saveTakeReason`;
    return ajax(url,data,'post');
}

/**
 * 故障分析单故障排名查询接口
 */
function singleFaultRankingEve(data){
    var url=`${MAINTAIN_URL}/faultAnalysic/singleFaultRanking`;
    return ajax(url,data,'post');
}

/**
 * 故障分析单故障排名导出接口
 */
function exportFaultRankingEve(data){
    var url=`${MAINTAIN_URL}/faultAnalysic/exportFaultRanking`;
    return ajax(url,data,'post',null,null,{responseType: 'blob'});
}


/**
 * 故障分析故障详情
 */
function detailsRankingEve(data){
    var url=`${MAINTAIN_URL}/faultAnalysic/details`;
    return ajax(url,data,'post');
}

/**
 * 接管分析接管原因接口
 */
function findReasonFaultCountEve(data){
    var url=`${MAINTAIN_URL}/findReasonFaultCount`;
    return ajax(url,data);
}
/**
 * 接管分析接管趋势图接口
 */
function findNozzleTrendChartEve(data){
    var url=`${MAINTAIN_URL}/nozzleTrendChart`;
    return ajax(url,data);
}
/**
 * 故障分析故障查询接口
 */
function faultNameFindEve(data){
    var url=`${MAINTAIN_URL}/faultAnalysic/faultName`;
    return ajax(url,data,'post');
}


/**
 * 决策监控查询
 */
function findDrivingMode(data){
    var url=`${MAINTAIN_URL}/findAllInfo`;
    return ajax(url,data,'post');
}

// 下车指标统计指标配置接口
function findAllIndicatorEve(data){
    var url=`${MAINTAIN_URL}/idc/findAllIndicatorDataConfiguration?miningArea=${data}`;
    return ajax(url);
}
// 下车指标统计修改指标配置
function updateIndicatorEve(data){
    var url=`${MAINTAIN_URL}/idc/updateIndicatorDataConfiguration`;
    return ajax(url,data,'post');
}
// 下车指标统计结算结果
function countTestEve(data){
    var url=`${MAINTAIN_URL}/oovis/countTestTimesOfEachIndex`;
    return ajax(url,data,'post');
}

//故障分析故障详情导出excel
function exportFaultAnalysicDetailEve(data){
    var url=`${MAINTAIN_URL}/faultAnalysic/exportFaultAnalysicDetail`;
    return ajax(url,data,'post',null,null,{responseType: 'blob'});
}
// 下车指标统计汇总明细
function CalendarDetailsEve(data){
    var url=`${MAINTAIN_URL}/oovis/everyDayCalendarDetails`;
    return ajax(url,data,'post');
}
// 下车指标统计单车明细
function detailsOfDailyEve(data){
    var url=`${MAINTAIN_URL}/oovis/detailsOfDailyIndexDataOfSingleVehicle`;
    return ajax(url,data,'post');
}

// 下车指标统计汇总明细导出
function excelExportForCalendar(data){
    var url=`${MAINTAIN_URL}/oovis/excelExportForCalendar`;
    return ajax(url,data,'post',null,null,{responseType: 'blob'});
}

// 下车指标统计单车明细导出
function excelExportForEveryDayEachIndexCalendar(data){
    var url=`${MAINTAIN_URL}/oovis/excelExportForEveryDayEachIndexCalendar`;
    return ajax(url,data,'post',null,null,{responseType: 'blob'});
}

//下车指标统计保存规则接口 
function saveIndicatorDataHistoricalRules(data){
    var url=`${MAINTAIN_URL}/idc/saveIndicatorDataHistoricalRules`;
    return ajax(url,data,'post');
}

//偏差分析图表接口 
function deviationAllChartEve(data){
    var url=`${MAINTAIN_URL}/deviationAnalysis/allChart`;
    return ajax(url,data,'post');
}

//下车指标统计历史规则接口 
function findAllIndicatorDataHistoricalRules(data){
    var url=`${MAINTAIN_URL}/idc/findAllIndicatorDataHistoricalRules`;
    return ajax(url,data);
}

//导出手工录入模板
function outPutSheetsEve(data){
    var url=`${MAINTAIN_URL}/sportLong/outPutSheets`;
    return ajax(url,data,'post',null,null,{responseType: 'blob'});
}

//导入手工录入模板
function inPutSheetsEve(data){
    var url=`${MAINTAIN_URL}/sportLong/inPutSheets`;
    return ajax(url,data,'post');
}

//跑车数据表格
function sportDataTableEve(data){
    var url=`${MAINTAIN_URL}/sportLong/sportDataTable`;
    return ajax(url,data,'post');
}

//单车数据明细下钻
function singleVehicleDetailsByClickEve(data){
    var url=`${MAINTAIN_URL}/oovis/singleVehicleDetailsByClick`;
    return ajax(url,data,'post');
}


//手工录入跑车时间
function saveSprotsTimesEve(data){
    var url=`${MAINTAIN_URL}/sportLong/saveSprotsTimes`;
    return ajax(url,data,'post');
}

//效率分析数字
function efficiencyAnalysisTopEve(data){
    var url=`${MAINTAIN_URL}/efficiency/efficiencyAnalysisTop`;
    return ajax(url,data,'post');
}
//效率分析平均循环时间
function efficiencyAnalysisBarChartEve(data){
    var url=`${MAINTAIN_URL}/efficiency/efficiencyAnalysisBarChart`;
    return ajax(url,data,'post');
}

//横向偏差功能
function lateraldeviationEve(data){
    var url=`${MAINTAIN_URL}/deviationAnalysis/lateraldeviation`;
    return ajax(url);
}
//效率分析数据明细
function detailsEffciencyEve(data){
    var url=`${MAINTAIN_URL}/efficiency/detailsEffciencyAnalysisOfSingleVehicle`;
    return ajax(url,data,'post');
}
//效率分析折线图
function efficiencyAnalysisLineChartEve(data){
    var url=`${MAINTAIN_URL}/efficiency/efficiencyAnalysisLineChart`;
    return ajax(url,data,'post');
}

//效率分析行车速度
function drivingSpeedLineChartEve(data){
    var url=`${MAINTAIN_URL}/efficiency/drivingSpeedLineChart`;
    return ajax(url,data,'post');
}
//效率分析路段运行时长
function roadOperationTimeEve(data){
    var url=`${MAINTAIN_URL}/efficiency/roadOperationTime`;
    return ajax(url,data,'post');
}


//效率分析行车时长
function drivingTimeLineChartEve(data){
    var url=`${MAINTAIN_URL}/efficiency/drivingTimeLineChart`;
    return ajax(url,data,'post');
}

//接管原因配置查询当前区域接管原因
function findTakeOverReasonListEve(data){
    var url=`${MAINTAIN_URL}/reasonconfig/findTakeOverReasonList?miningArea=${data}`;
    return ajax(url);
}
//新增监管原因
function saveTakeOverReasonEve(data){
    var url=`${MAINTAIN_URL}/reasonconfig/saveTakeOverReason`;
    return ajax(url,data,'post');
}

//汇总明细查询接口
function totalDetailsByClickEve(data){
    var url=`${MAINTAIN_URL}/oovis/totalDetailsByClick`;
    return ajax(url,data,'post');
}

//编辑监管原因
function updateTakeOverReasonEve(data){
    var url=`${MAINTAIN_URL}/reasonconfig/updateTakeOverReason`;
    return ajax(url,data,'post');
}
//删除监管原因
function deleteTakeOverReason(data,c){
    var url=`${MAINTAIN_URL}/reasonconfig/deleteTakeOverReason?id=${data}&miningArea=${c}`;
    return ajax(url);
}

//故障分析故障趋势图
function getFaultTrendChartEve(data){
    var url=`${MAINTAIN_URL}/faultAnalysic/getFaultTrendChart`;
    return ajax(url,data,'post');
}

//故障分析故障模块趋势图
function getFaultClassTrendChartEve(data){
    var url=`${MAINTAIN_URL}/faultAnalysic/getFaultClassTrendChart`;
    return ajax(url,data,'post');
}

//故障分析重复故障次数
function getFaultRepeatTimeChartEve(data){
    var url=`${MAINTAIN_URL}/faultAnalysic/getFaultRepeatTimeChart`;
    return ajax(url,data,'post');
}


//接管原因分页查询接口
function findTakeOverReasonByPageItemEve(data){
    var url=`${MAINTAIN_URL}/reasonconfig/findTakeOverReasonByPageItem`;
    return ajax(url,data,'post');
}

//下车指标统计图表分析
function allChartEve(data){
    var url=`${MAINTAIN_URL}/oovis/allChart`;
    return ajax(url,data,'post');
}
function getFieldList(data){
  
    return [
    {
        "fieldEnglish": "substatemachine",
        "fieldChinese": "子状态机",
    },
	{
	    "fieldEnglish": "rawsubstatemachine",
	    "fieldChinese": "子状态机",
	},
    {
        "fieldEnglish": "masterstatemachine",
        "fieldChinese": "主状态机",
    },
	{
	    "fieldEnglish": "originalmasterstatemachine",
	    "fieldChinese": "主状态机",
	},
    {
        "fieldEnglish": "drivingmode",
        "fieldChinese": "驾驶模式"
    },
    {
        "fieldEnglish": "throttlecontrol",
        "fieldChinese": "油门控制量",
        "parent_name": "油门踏板"
    },
    {
        "fieldEnglish": "upperthrottlefeedback",
        "fieldChinese": "上位机油门执行反馈",
        "parent_name": "油门踏板"
    },
    {
        "fieldEnglish": "controlquantityofelectricbraking",
        "fieldChinese": "电制动控制量",
        "parent_name": "电制动"
    },
    {
        "fieldEnglish": "upperslowfeedback",
        "fieldChinese": "上位机缓行执行反馈",
        "parent_name": "电制动"
    },
    {
        "fieldEnglish": "hydraulicbrakecontrol",
        "fieldChinese": "液压制动控制量",
        "parent_name": "机械制动"
    },
    {
        "fieldEnglish": "rearpercentagesignal",
        "fieldChinese": "后制动百分比反馈信号",
        "parent_name": "机械制动"
    },
    {
        "fieldEnglish": "loadbrakecontrol",
        "fieldChinese": "装载制动控制量",
        "parent_name": "装载制动"
    },
    {
        "fieldEnglish": "loadingbrakestatus",
        "fieldChinese": "装载制动状态",
        "parent_name": "装载制动"
    },
    {
        "fieldEnglish": "expectedspeed",
        "fieldChinese": "期望车速",
        "parent_name": "车速"
    },
    {
        "fieldEnglish": "actualspeed",
        "fieldChinese": "实际车速",
        "parent_name": "车速"
    },
    {
        "fieldEnglish": "vehicleslopefiltering",
        "fieldChinese": "车辆坡度滤波",
        "parent_name": "坡度"
    },
    {
        "fieldEnglish": "previewslopefiltering",
        "fieldChinese": "预瞄坡度滤波",
        "parent_name": "坡度"
    },
    {
        "fieldEnglish": "basicquantityofspeedcontrol",
        "fieldChinese": "速度控制基础量",
        "parent_name": "计算量"
    },
    {
        "fieldEnglish": "speedcontroladjustment",
        "fieldChinese": "速度控制调节量",
        "parent_name": "计算量"
    },
    {
        "fieldEnglish": "totalcontrolquantityofspeedcontrol",
        "fieldChinese": "速度控制总控制量",
        "parent_name": "计算量"
    },
    {
        "fieldEnglish": "expectedspeedonroad",
        "fieldChinese": "道路期望车速",
        "parent_name": "期望值"
    },
    {
        "fieldEnglish": "expectedspeedoflidar",
        "fieldChinese": "激光雷达期望车速",
        "parent_name": "期望值"
    },
    {
        "fieldEnglish": "expectedspeedofmillimeterwaveradar",
        "fieldChinese": "毫米波雷达期望车速",
        "parent_name": "期望值"
    },
    {
        "fieldEnglish": "gearcontrolquantity",
        "fieldChinese": "档位控制量",
        "parent_name": "档位"
    },
    {
        "fieldEnglish": "transmissiongearfeedback",
        "fieldChinese": "变速箱当前档位反馈量",
        "parent_name": "档位"
    },
	{
	    "fieldEnglish": "gear",
	    "fieldChinese": "档位",
	    "parent_name": "档位"
	},
    {
        "fieldEnglish": "lateraldeviation",
        "fieldChinese": "横向偏差",
        "parent_name": "横向"
    },
    {
        "fieldEnglish": "calculatetheturningangle",
        "fieldChinese": "计算转角",
        "parent_name": "横向"
    },
    {
        "fieldEnglish": "frontwheelangle",
        "fieldChinese": "前轮转角",
        "parent_name": "横向"
    },
    {
        "fieldEnglish": "previewrange",
        "fieldChinese": "预瞄距离"
    },
    {
        "fieldEnglish": "dragonlogo",
        "fieldChinese": "画龙标志",
        "parent_name": "画龙"
    },
    {
        "fieldEnglish": "dragonfrequency",
        "fieldChinese": "画龙频率",
        "parent_name": "画龙"
    },
    {
        "fieldEnglish": "keypointdeviation",
        "fieldChinese": "关键点航向偏差",
        "parent_name": "画龙"
    },
    {
        "fieldEnglish": "angle",
        "fieldChinese": "角度转角",
        "parent_name": "航向转角"
    },
	{
	    "fieldEnglish": "headingangle",
	    "fieldChinese": "航向转角",
	    "parent_name": "航向转角"
	},
	{
	    "fieldEnglish": "azimuthdeviationofpreviewpoint",
	    "fieldChinese": "预瞄点方位角偏差",
	    "parent_name": "预瞄点偏差"
	},
	{
	    "fieldEnglish": "headingangledeviationofpreviewpoint",
	    "fieldChinese": "预瞄点航向角偏差",
	    "parent_name": "预瞄点偏差"
	}
]
}



/**
 * 删除锁定
 * @param {string} deviceGroupId  分区id
 * @param {string} lockRuleId  锁定规则的id
 */
function deleteLocked(deviceGroupId,lockRuleId){
    var url=`${BASE_URL}/fleetDispatcher/${deviceGroupId}/lockRules/${lockRuleId}`;
    return ajax(url,{},'delete');
}

/**
 * 修改锁定
 * @param {string} deviceGroupId  分区id
 * @param {string} lockRuleId  锁定规则的id
 */
function updateLocked(deviceGroupId,lockRuleId,data){
    var url=`${BASE_URL}/fleetDispatcher/${deviceGroupId}/lockRules/${lockRuleId}/lockedElement`;
    return ajax(url,data,'post');
}

/**
 * 查询锁定
 * @param {string} deviceGroupId  分区id
 * @param {string} ruleType  规则类型
 * @param {string} elementId  锁定元素id
 */
function getLocked(deviceGroupId,ruleType,elementId=''){
    var url=`${BASE_URL}/fleetDispatcher/${deviceGroupId}/lockRules/?ruleType=${ruleType}&elementId=${elementId}`;
    return ajax(url);
}

/**
 * 一键消除
 * @param {string} timeLimit  时间限制
 * @param {string} deviceGroupId  分区id
 * @param {string} handleUserId  用户id
 * @param {string} handleUserName  '批量处理
 *
 */
function AllEliminate(data) {
    var url=`${BASE_URL}/dispatchingAlarm/dispatchingAlarms/batch`;
    return ajax(url,data,'put');
}
/**
 * 报警处理-接受/拒绝
 * @param {string} id  分区id
 */
function alarmHandle(id,data) {
    var url=`${BASE_URL}/dispatchingAlarm/dispatchingAlarms/${id}`;
    return ajax(url,data,'put');
}

/**
 * 新增接管分析
 * 
 */
function addtakeoverdataEve(data) {
    return ajax(`${MAINTAIN_URL}/addtakeoverdata`,data,'post');
}


/**
 * 汇总分析一级查询      
 */
 function getOnelevelEve(data) {
    var url = `${MAINTAIN_URL}/getonelevel`;
    return ajax(url,data,'post');
}
/**
 * 汇总分析二级查询      
 */
 function getTwolevelEve(data) {
    var url = `${MAINTAIN_URL}/gettwolevel`;
    return ajax(url,data,'post');
}

/**
 * 编辑接管分析
 * 
 */
function updatetakeoverdataEve(data) {
    return ajax(`${MAINTAIN_URL}/updatetakeoverdata`,data,'post');
}

/**
 * 图表接管分析
 * 
 */
function calculationEve(data) {
    return ajax(`${MAINTAIN_URL}/calculation`,data,);
}


/**
 * 删除接管分析
 * 
 */
function deltakeoverdataEve(data) {
    return ajax(`${MAINTAIN_URL}/deltakeoverdata`,data,'post');
}


//删除历史规则
function deleteRuleEve(data) {
    return ajax(`${MAINTAIN_URL}/idc/delete`,data,'post');
}
/**
 * 获取矿卡当前任务--矿卡的调度情况
 * @param {string} subareaId  分区id
 */
function getTruckCurrentTasks(subareaId){
    var url=`${BASE_URL}/atds/dispatching/${subareaId}/currentTasks`;
    return ajax(url);
}

/**
 * 获取调度目标当前任务--矿卡/卸点的调度情况
 * @param {number} deviceGroupId  分区id
 */
function getDispatchCurrentTasks(deviceGroupId){
    var url=`${BASE_URL}/dispatching/task/${deviceGroupId}/dispatchingObjects/currentTasks`;
    return ajax(url);
}

/**
 * 获取调度历史--矿卡/采装设备/卸点的调度历史
 * @param {number} deviceId      设备id
 * @param {string} deviceType    设备类型
 * @param {string} searchType    搜索类型
 * @param {number} pageIndex     当前页码
 * @param {number} pageSize      一页多少条
 */
function getDispatchHistory(data){
    var url=`${BASE_URL}/dispatching/history/list?id=${data.deviceId}&idType=${data.deviceType}&type=${data.searchType}&pageIndex=${data.pageIndex-1}&pageSize=${data.pageSize}`;
    return ajax(url);
}



/**
 * 获取调度历史--矿卡/采装设备/卸点的调度历史
 * @param {number} pageIndex    当前第几页
 * @param {string} pageSize     一页显示多少条
 * @param {string} subareaSn    分区
 * @param {number} startTimeStr 开始时间
 * @param {number} endTimeStr   结束时间
 * @param {number} truckId      卡车id
 */
function dispatchingJobEvent(data){
    var url=`${BASE_URL}/atds/dispatchingJobEvent/page`;
    return ajax(url,data);
}
/**
 * 下载历史记录
 * @param {string} name:          应用中心id
 */
function getHistoryFile(name,callback) {
    // var url = `${BASE_URL}/noauth/download/map/200528092532250`;
    var url = `${BASE_URL}/noauth/download/file/${name}?ts=${new Date().getTime()}`;
    return ajax(url,{},'GET',null,null,{
        responseType: 'blob',onDownloadProgress: function (progressEvent) {
            var complete = (progressEvent.loaded / progressEvent.total * 100 | 0)||0;
            callback?callback(complete):"";
    }});
}


/**
 * 报警列表
 * @param {number} pageSize        一页显示多少条
 * @param {number} pageIndex       当前第几页
 * @param {string} deviceType      设备类型
 * @param {string} eventType       终端编号
 * @param {string} startTime       开始时间
 * @param {string} endTime         结束时间
 * @param {number} deviceGroupId   分区
 */
function getAlarmHistory(arg) {
    var arg=arg?arg:{};
    var pageSize = arg.pageSize?arg.pageSize:14;
    var pageIndex = arg.pageIndex-1?arg.pageIndex-1:0;
    var deviceType = arg.deviceType?arg.deviceType:"";
    var eventType = arg.eventType?arg.eventType:"";
    var startTime = arg.startTime?arg.startTime:"";
    var endTime = arg.endTime?arg.endTime:"";
    var sourceName = arg.sourceName?arg.sourceName:"";
    var deviceGroupId = arg.deviceGroupId?arg.deviceGroupId:"";
    var alarmGroup = arg.alarmGroup?arg.alarmGroup:"";
    var data = {
        pageSize:pageSize,
        pageIndex:pageIndex,
    }
    !deviceType||(data['deviceType']=deviceType);
    !eventType||(data['eventType']=eventType);
    !startTime||(data['startTime']=startTime);
    !endTime||(data['endTime']=endTime);
    !deviceGroupId||(data['deviceGroupId']=deviceGroupId);
    !sourceName||(data['sourceName']=sourceName);
    !alarmGroup||(data['alarmGroup']=alarmGroup);

    var url=`${BASE_URL}/dispatchingAlarm/dispatchingAlarms`;
    return ajax(url,data);
}


/**
 * 编辑矿卡位置
 * @param {object}  data  编辑内容
 */
function editLocation(data) {
    var id = data.deviceId;
    var url = `${BASE_URL}/device/trucks/${id}/initPositon`;
    return ajax(url, data, "patch");
}

/**
 * 删除调度目标
 * @param {string}  id 矿卡id
 */
function deleteTarget(id) {
    var url = `${BASE_URL}/atds/dispatching/${id}/currentTask`;
    return ajax(url, {}, "delete");
}

/**
 * 查询设备通讯状态-分页
 * @param {number} pageSize        每页行数
 * @param {number} pageIndex       当前第几页
 */
function getSignalStatusList(data) {
    var url = `${BASE_URL}/atds/equipment/devices/state`;
    return ajax(url,data);
}

/**
 * 查询设备通讯状态-时间倒叙
 * @param {number} pageSize        每页行数
 * @param {number} pageIndex       当前第几页
 * @param {number} subareaSn       分区编号
 * @param {string} sortName       排序名称  lastConnectTime:最后登录时间排序/lastActivityTime:最后活跃时间倒叙
 * @param {string} sort       排序名称  DESC倒叙/ASC正序
 */

function getSignalStatusTime(data) {
    var url = `${BASE_URL}/atds/equipment/devices/state/sort`;
    return ajax(url,data);
}


/**
 * 查询单个设备通讯状态
 * @param {string} id  设备通讯状态id
 */
function getDeviceSignalStatus(id) {
    var url = `${BASE_URL}/atds/equipment/devices/${id}/state`;
    return ajax(url);
}

/**
 * 偏差分析查询接口
 */
function GetDeviationFind(data) {
    var url = `${MAINTAIN_URL}/deviationAnalysis/deviationFind`;
    return ajax(url, data, "post");
}

/**
 * 获取跑车日报详情
 */
function getReportDetail(data){
    var url=`${MAINTAIN_URL}/sportLong/reportDetail`;
    return ajax(url, data, 'post');
}

/**
 * 手工录入
 */
function saveAll(data) {
    var url=`${MAINTAIN_URL}/sportLong/saveAll`;
    return ajax(url, data, 'post');
}

/**
 * 跑车日报数字集合
 */
function findAllEce(data) {
    var url=`${MAINTAIN_URL}/sportLong/find`;
    return ajax(url, data, 'post');
}
/**
 * 跑车日报跑车运行图
 */
function reportFormEve(data) {
    var url=`${MAINTAIN_URL}/sportLong/reportForm`;
    return ajax(url, data, 'post');
}
/**
 * 跑车日报跑车运行图导出excel
 */
function exportSportDataTableEve(data) {
    var url=`${MAINTAIN_URL}/sportLong/exportSportDataTable`;
    return ajax(url,data,'post',null,null,{responseType: 'blob'});
}
/**
 * 获取产量消息（作业状态调度历史）
 * @param {string} pageSize     每页行数
 * @param {string} pageIndex    当前页号
 * @param {string} sortName     排序字段，默认为createTime
 * @param {string} sort         排序方式，默认为ASC，取值为ASC升序、DESC降序
 */
function getOutputMessage(arg) {
    var arg=arg?arg:{};
    var pageSize = arg.pageSize?arg.pageSize:14;
    var sort = arg.sort?arg.sort:'DESC';
    var pageIndex = arg.pageIndex-1?arg.pageIndex-1:0;
    var deviceType = arg.deviceType?arg.deviceType:"";
    var deviceSn = arg.deviceSn?arg.deviceSn:"";
    var subareaSn = arg.subareaSn?arg.subareaSn:"";
    var data={
        pageSize,
        pageIndex,
        sort
    }
    !deviceType||(data['deviceType']=deviceType);
    !deviceSn||(data['deviceSn']=deviceSn);
    !subareaSn||(data['subareaSn']=subareaSn);

    var url = `${BASE_URL}/atds/outputMessages/page`;
    return ajax(url,data);
}



/**
 * 临时调度指派
 * @param {object}  data
 */
function temporaryAssigned(data) {
    var url = `${BASE_URL}/trucks/assign`;
    return ajax(url, data, "post");
}

/**
 * 获取调度指派列表
 * @param {string} pageSize     每页行数
 * @param {string} pageIndex    当前页号
 * @param {string} sortName     排序字段，默认为truckSn  /truckSn/truckName
 * @param {string} sort         排序方式，默认为ASC，取值为asc升序、desc降序
 * @param {string} truckSn      卡车sn
 * @param {string} truckName    卡车名称
 * @param {string} subareaSn    分区sn
 * @param {string} equStatus    运营状态 1：就绪 2：延时
 */
function getTemporaryAssigned(arg) {
    var arg=arg?arg:{};
    var pageSize = arg.pageSize?arg.pageSize:14;
    var sort = arg.sort?arg.sort:'desc';
    var sortName = arg.sortName?arg.sortName:'truckSn';
    var pageIndex = arg.pageIndex-1?arg.pageIndex-1:0;
    var data={
        pageSize,
        pageIndex,
        sort,
        sortName
    }
    !arg.subareaSn||(data['subareaSn']=arg.subareaSn);
    !arg.truckSn||(data['truckSn']=arg.truckSn);
    !arg.truckName||(data['truckName']=arg.truckName);
    !arg.equStatus||(data['equStatus']=arg.equStatus);

    var url = `${BASE_URL}/trucks/assignTrucks`;
    return ajax(url,data);
}

// 查询分区生产调度任务
function getProductionDispatchTask(subareaId){
    let url = `${BASE_URL}/atds/dispatching/${subareaId}/currentProductTasks`;
    return ajax(url)
}

// 查询分区暂停派遣信息
function getStopDispatchList(data){
    let url = `${BASE_URL}/atds/lockRules/rulesAndPropety/shovelToDumparea/stopdispatchlist`;
    return ajax(url,data)
}

// 清除车辆占用
function clearTruckOccupy(id){
    let url = `${BASE_URL}/atds/equipment/roadRights/${id}`;
    return ajax(url,{},'delete')
}

/**
 * 查询设备位置上报信息
 * @param {*} deviceId 设备id
 */
 function getDevicePosition(deviceId){
    let url = `${BASE_URL}/atds/equipment/devices/${deviceId}/postions`;
    return ajax(url);
  }

/**
 * 控制监控接口list
 * 
 */
 function getConfindInfoAll(data){
    let url = `${MAINTAIN_URL}/controlMonitor/findInfoAll`;
    return ajax(url,data,'post');
  }


/**
 * 设置安全停车（默认遥控停车）
 * @param {*} deviceId 设备id
 * @param {String} type 操作类型，默认=RemoteParking遥控停车 | EmergencyBraking紧急制动 | MissionAbort任务终止 | SwitchToDriving继续行驶
 */
 function setTruckStop(deviceId, type = 'RemoteParking'){
    // 可用的类型
    // let types = {
    //     'RemoteParking': '安全停车',
    //     'EmergencyBraking': '紧急制动',
    //     'MissionAbort': '取消',
    //     'SwitchToDriving': '重新启动',
    // }
    let url = `${BASE_URL}/atds/equipment/remotecontroller?deviceId=${deviceId}&type=${type}`;
    // let url = `${BASE_URL}/atds/equipment/remotecontroller?deviceId=${deviceId}`;

    return ajax(url , {} ,"put");
  }

export default{
    getDeviceDetail,
    getDeviceHaulingTrack,
    getDispatchLock,
    addLocked,
    deleteLocked,
    updateLocked,
    getLocked,
    alarmHandle,
    AllEliminate,
    getTruckCurrentTasks,
    getDispatchCurrentTasks,
    getDispatchHistory,
    dispatchingJobEvent,
    getAlarmHistory,
	getHotColour,
    editLocation,
    deleteTarget,
	findAllIndicatorEve,
	getTakeOverList,
	deleteRuleEve,
    getSignalStatusList,
	outPutSheetsEve,
	inPutSheetsEve,
	sportDataTableEve,
	saveSprotsTimesEve,
	getAttendanceScheduleEve,
	getFaultRepeatTimeChartEve,
	deltakeoverdataEve,
	findAllIndicatorDataHistoricalRules,
	saveIndicatorDataHistoricalRules,
    getSignalStatusTime,
	getConfindInfoAll,
    getDeviceSignalStatus,
	lateraldeviationEve,
	roadOperationTimeEve,
	singleVehicleDetailsByClickEve,
	getsaveColour,
	drivingTimeLineChartEve,
	getdelColour,
	saveTakeReasonEve,
	getFieldList,
	findNozzleTrendChartEve,
	getOnelevelEve,
	findTakeOverReasonByPageItemEve,
    getOutputMessage,
	drivingSpeedLineChartEve,
	faultRankingEve,
	faultNameFindEve,
	exportFaultRankingEve,
	saveTakeOverReasonEve,
	updateTakeOverReasonEve,
	takeOverData,
	findMontitoring,
	faultFindEve,
	deviationAllChartEve,
	calculationEve,
    temporaryAssigned,
	exportFaultAnalysicDetailEve,
	deleteTakeOverReason,
	analysisDetails,
	totalDetailsByClickEve,
	updateIndicatorEve,
    getTemporaryAssigned,
    getHistoryFile,
	addtakeoverdataEve,
	findExistDataBydateEve,
	GetDeviationFind,
	efficiencyAnalysisTopEve,
	efficiencyAnalysisBarChartEve,
	detailsEffciencyEve,
	efficiencyAnalysisLineChartEve,
	detailsRankingEve,
	allChartEve,
	CalendarDetailsEve,
	singleFaultRankingEve,
	getfindColour,
	exportSportDataTableEve,
	findReasonFaultCountEve,
	getFaultTrendChartEve,
	getFaultClassTrendChartEve,
	getWayLine,
	updatetakeoverdataEve,
	getField,
    getProductionDispatchTask,
	excelExportForEveryDayEachIndexCalendar,
	excelExportForCalendar,
	findDrivingMode,
    getStopDispatchList,
    clearTruckOccupy,
	getPieColour,
	findTakeOverReasonListEve,
    getDevicePosition,
	saveAll,
	getReportDetail,
	countTestEve,
    setTruckStop,
	findAllEce,
	detailsOfDailyEve,
	reportFormEve,
	getTwolevelEve
}