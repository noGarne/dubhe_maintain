/**
 * 车端日志接口
 */

 import ajax from './ajax.js'
 import config from './config.js'
 
 const BASE_URL = config.BASE_URL;

 /**
 * 分页获取卡车列表
 * @param {object} data     deviceName=卡车&deviceImei=111&pageIndex=0&pageSize=15&sort=DESC&sortName=deviceImei
 */
function getTruckList(data){
  let url = `${BASE_URL}/atds/logfile/TruckLogfileindex`;
  return ajax(url,data);
}

/**
* 日志同步验证
* @param {object} deviceImei     i
*/
function setLogCheck(deviceImei){
  let url = `${BASE_URL}/atds/logfile/synchronize?deviceImei=${deviceImei}`;
  return ajax(url);
 }
 
 /**
 * 日志同步确认
 * @param {object} deviceImei     imei
 */
 function setLogSync(deviceImei){
  let url = `${BASE_URL}/atds/logfile/synchronizeWarning?istrue=true&deviceImei=${deviceImei}`;
  return ajax(url);
 }

/**
* 分页获取卡车日志详情列表
* @param {object} deviceImei     imei
* @param {object} data     ?startTime=xxxx&endTime=xxx&fileModuleType=xxx&pageIndex=0&pageSize=15&sort=DESC&sortName=fileCreateTime
*/
function getLogList(deviceImei,data){
 let url = `${BASE_URL}/atds/logfile/${deviceImei}/details`;
 return ajax(url,data);
}

/**
* 卡车日志下载
* @param {object} filename     文件名
*/
function getDownloadLog(filename){
 let url = `${BASE_URL}/noauth/log/download/?filename=${filename}`;
 return ajax(url,data);
}

export default{
  getTruckList,
  setLogCheck,
  setLogSync,
  getLogList,
  getDownloadLog
}