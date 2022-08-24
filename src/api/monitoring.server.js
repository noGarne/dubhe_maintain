import ajax from "./ajax";

import config from "./config"
var BASE_URL = config.BASE_URL;

/**
 * 获取设备
 */
function getDevices(){
  var data ={
    limit: 100,
    textSearch: ""
  }
  return ajax(BASE_URL + "/tenant/devices", data);
}


/**
 * 获取单个设备
 * @param {string} id   设备id
 */
function getDevicesDetails(id){
  var url=BASE_URL + '/device/'+ id;
  return ajax(url);
}

/**
 * 获取
 * @param {string} id   id
 */
function rpcEvent(id){
  var url=BASE_URL + '/rpcEvent/DEVICE/'+ id;
  var data={
    limit:100,
    status:"ANY"
  }
  return ajax(url,data);
}


function tsType(){
  var keys={
    attr:"active,takeRoad",
    list:"currentTaskObject,currentTaskObjectId,latitude,longitude,direction,loadState,operationType,drivingMode,taskStatus,speed,takeoverStatus",
    locationN:"latitude,longitude,altitude,speed,direction,limitSpeed",
    statusN:"operationType,drivingMode,runState,taskStatus,lockState,loadState,materialCode,vehicleDumperState,noTaskStop,errorStop,obstacleStop,remoteControlStop,currentTaskObject,currentTaskObjectId,takeoverStatus",
    warningN:"warningMark",
    monitoring:"latitude,longitude,speed,direction,subMachineState,vehicleGearState,speedDeviation,directionError,stopPointLongitudinalError,stopPointLateralError,frontWheelAngularError,lateralError"
  
  }
  return keys;
}



/**
 * 卡车行程
 * @param {string} startTime   开始时间
 * @param {string} endTime   结束时间
 * @param {string} truckSn   卡车sn
 */
function getRouteTime(data){
  var url=BASE_URL + "/atds/outputhistorys/trips";
  return ajax(url, data);

}


export default {
    getDevices,
    getDevicesDetails,
    rpcEvent,
    tsType,
    getRouteTime
}