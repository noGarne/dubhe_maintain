/**
 * 破碎站作业管理
 */

import ajax from '../../../api/ajax';
import config from '../../../api/config';
var GEOSERVER_URL = config.GEOSERVER_URL;

const BASE_URL = config.BASE_URL;


/**
 * 查询停靠区停靠位列表边界列表
 * @param {string} 
 * 
 */
function getUnLoadList() {
  let url = `${BASE_URL}/atds/workAreas/infos/list`;
  return ajax(url);
}

/**
 * 查询停靠区停靠位列表边界列表
 * @param {string} 
 * 
 */
function getUnloadBoundary(taskId) {
  let url = `${BASE_URL}/atds/hdmap/boundry/${taskId}`;
  return ajax(url);
}

/**
 * 装载区/卸载区障碍物边界
 * @param {string} 
 * 
 */
function getObstacleBoundary(taskId) {
  let url = `${BASE_URL}/atds/hdmap/obstacle/detail/${taskId}`;
  return ajax(url);
}
/**
 * 更新/驳回
 * @param {string} id taskId 
 * @param {number} processResult 0-驳回  1-更新
 * 
 */
function setUpdateProcessAsync(data) {
  // let url = `${BASE_URL}/atds/hdmap/boundry/process`;
  let url = `${BASE_URL}/atds/hdmap/boundry/process/async`;
  return ajax(url,data,'post');
}
/**
 * 更新/驳回
 * @param {string} id taskId 
 * @param {number} processResult 0-驳回  1-更新
 * 
 */
function setObstacleProcess(data) {
  let url = `${BASE_URL}/atds/hdmap/obstacle/process`;
  return ajax(url,data,'post');
}

/**
 * 是否有障碍物图层
 * @param {string} 
 * 
 */
function obstacleHasLayer() {
  // let url = `${BASE_URL}/atds/hdmap/obstacle/hasLayer`;
  // return ajax(url);
}
/**
 * 查询
 * @param {string} id  任务id
 * 
 */
function getUpdateProcessList(id) {
  let url = `${BASE_URL}/atds/trace/findById?uuid=${id}`;
  return ajax(url);
}

/**
 * 停车区/停车位状态变更
 * @param {string} type //spaces:停车位||groups:停车区
 * @param {string} status //状态
 * @param {object} data //grpSn停靠位分组编号   || spcSn 停靠位编号
 */
function setParkStatus(type,status,data) {
  let url = `${BASE_URL}/atds/parks/status/${type}/${status}`;
  return ajax(url,data,'post');
}

/**
 * 获取边界
 * @param 
 */
function getUploadJson(data) {
  var url = GEOSERVER_URL+"/thingsboard/ows"
  return ajax(url,data);
}

/**
 * 路径字符串数据转化为数组
 * @param {string} info
 */
 function getPolygonData(info) {
  if (info) {
    let infoNew = info.replace("LINESTRING(", "").replace(")", "");
    if (infoNew.endsWith(';')) {
      infoNew = infoNew.substring(0,infoNew.length - 1);
    }
    let arr = infoNew.split(";");
    let arrNew = arr.map(v => {
      let array = v.split(",");
      return [array[1], array[0]];
    });
    return arrNew;
  } else {
    return [];
  }
}
/**
 * 障碍边界数据格式
 * @param {string} info
 */
function getObstacleData(info) {
  if (info) {
    let infoNew = info.replace("MULTILINESTRING ((", "").replace("))", "");
    var arr1 = infoNew.split('), (');
    var arr2=[];
    arr1.forEach((e)=>{
      var list = e.split(', ');
      let arrNew = list.map(v => {
        let arr3 = v.split(" ");
        return [arr3[1], arr3[0]];
      });
      arr2.push(arrNew);
    })
    console.log(arr2);
    return arr2;
  } else {
    return [];
  }
}

/**
 * 破碎站允许/禁止卸料
 * @param {string} deviceId //破碎机id
 * @param {number} actType //START_UNLOADING("开始卸载", 0X08),PAUSE_UNLOAD("暂停卸载", 0X09)
 */
function setUnloadMaterial(deviceId,actType) {
  let url = `${BASE_URL}/atds/equipment/remotecontroller/unloadCtlCmd/${deviceId}/${actType}`;
  return ajax(url,{},'put');
}

/**
 * 设置停靠状态
 * @param {string} type //spaces:停车位||groups:停车区
 * @param {string} status //状态
 * @param {object} data //grpSn停靠位分组编号   || spcSn 停靠位编号
 */
function setBerthState(type,status,data) {
  let url = `${BASE_URL}/atds/parks/status/${type}/${status}`;
  return ajax(url,data,'post');
}

/**
 * 设置运行停靠状态
 * @param {string} status //状态 true/false
 * @param {object} data //grpSn停靠位分组编号   spcSn 停靠位编号
 */
function setSpaceState(status,data) {
  let url = `${BASE_URL}/atds/parks/allowParking/parkSpace/${status}`;
  return ajax(url,data,'post');
}

export default {
  getUnLoadList,
  setParkStatus,
  getUploadJson,
  setUpdateProcessAsync,
  setObstacleProcess,
  obstacleHasLayer,
  getUpdateProcessList,
  getUnloadBoundary,
  getObstacleBoundary,
  getPolygonData,
  getObstacleData,
  setUnloadMaterial,
  setBerthState,
  setSpaceState
}