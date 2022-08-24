/**
 * 智能调度-终端操作
 */
import ajax from './ajax'

import config from "./config"
var BASE_URL = config.BASE_URL;

/**
 * 获取运营状态
 * @param {string} dispatchingObjectType
 * @param {string} dispatchingObjectId
 */
function getStatus(dispatchingObjectType,dispatchingObjectId){
    var url=`${BASE_URL}/dispatching/operationStatus/${dispatchingObjectType}/${dispatchingObjectId}`;
    return ajax(url);
}

/**
 * 设置运营状态
 * @param {string} dispatchingObjectType
 * @param {string} dispatchingObjectId
 * @param {string} data
 */
function setStatus(dispatchingObjectType,dispatchingObjectId,data){
    var url=`${BASE_URL}/dispatching/operationStatus/${dispatchingObjectType}/${dispatchingObjectId}`;
    return ajax(url,data,'put');
}

/**
 * 查询故障延时原因列表
 * @param {string} dispatchingObjectType
 * @param {string} operationStatusType
 * @param {string} data
 */
function getReasonList(dispatchingObjectType,operationStatusType){
    var url=`${BASE_URL}/dispatching/operationStatus/${dispatchingObjectType}/${operationStatusType}/reasonList`;
    return ajax(url);
}

/**
 * 设置卸点暂停派遣
 * @param {number} dumpSn   卸点sn
 * @param {number} state    状态
 */
function setDumpStopDispatch(dumpSn,state){
    var url=`${BASE_URL}/atds/equipment/dumpInfos/${dumpSn}/stopDispatch/${state}`;
    return ajax(url,{},'patch');
}

/**
 * 设置采装设备暂停派遣
 * @param {number} shovelSn   采装设备sn
 * @param {number} state    状态
 */
function setShovelStopDispatch(shovelSn,state){
    var url=`${BASE_URL}/atds/equipment/shovels/${shovelSn}/stopDispatch/${state}`;
    return ajax(url,{},'patch');
}

/**
 * 设置卡车暂停派遣
 * @param {number} truckSn   卡车sn
 * @param {number} state    状态
 */
function setTruckStopDispatch(truckSn,state){
    var url=`${BASE_URL}/atds/equipment/trucks/${truckSn}/stopDispatch/${state}`;
    return ajax(url,{},'patch');
}

/**
 * 运营状态历史
 * @param {string} deviceType       设备类型
 * @param {number} pageIndex        当前页码
 * @param {number} pageSize         一页多少条
 * @param {string} deviceId         设备id
 * @param {string} oprationType     操作类型
 * @param {string} deviceGroupId    分区id
 * @param {string} startTime        开始时间
 * @param {string} finishTime       结束时间
 */
function getHistoryOperationStatus(data){
    var url=`${BASE_URL}/dispatching/operationStatus/history/list?deviceType=${data.deviceType}&pageIndex=${data.pageIndex-1}&pageSize=${data.pageSize}&deviceId=${data.deviceId}&operationType=${data.oprationType}&deviceGroupId=${data.deviceGroupId}&startTime=${data.startTime}&finishTime=${data.finishTime}`;
    return ajax(url)
}

/**
 * 运营状态当前
 * @param {string} deviceType       设备类型
 * @param {number} pageIndex        当前页码
 * @param {number} pageSize         一页多少条
 * @param {string} deviceId         设备id
 */
// 运营状态当前
function getCurrentOperationStatus(data){
    var url=`${BASE_URL}/dispatching/operationStatus/current/list?deviceType=${data.deviceType}&pageIndex=${data.pageIndex-1}&pageSize=${data.pageSize}&deviceId=${data.deviceId}&deviceGroupId=${data.deviceGroupId}`;
    return ajax(url)
}

export default{
    getStatus,
    setStatus,
    getReasonList,
    setDumpStopDispatch,
    setShovelStopDispatch,
    setTruckStopDispatch,
    getHistoryOperationStatus,
    getCurrentOperationStatus
}