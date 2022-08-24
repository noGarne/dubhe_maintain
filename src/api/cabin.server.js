/**
 *  接管舱接口
 */

import ajax from './ajax.js'
import config from './config.js'

const BASE_URL = config.BASE_URL;

/**
 * 获取接管舱列表
 * @returns {array}
 */
function getReciverCabinList(){
  let url = `${BASE_URL}/atds/cabin/list`;
  return ajax(url);
}

/**
 * 设置接管任务
 * @param {string} cabinId	驾驶舱id
 * @param {string} truckId	矿卡id
 * @param {number} takeoverReasonId	接管任务类型：0:靠边停车，1:精确停靠，2:绕障，3:行驶至调度目标
 * @returns {string} success:成功,fail:失败
 */
function setReciverTask(data){
  let url = `${BASE_URL}/atds/cabin/task/assign`;
  return ajax(url,data,'post');
}

/**
 * 取消接管任务
 * @param {*} cabinId 驾驶舱id
 * @returns {string} success:成功,fail:失败
 */
function cancelReciverTask(cabinId){
  let url = `${BASE_URL}/atds/cabin/task/cancel?cabinId=${cabinId}`;
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
 function clearAlarm(data) {
  var url=`${BASE_URL}/atds/monitor/alarm/handle/batch`;
  return ajax(url,data,'put');
}
/**
* 报警确认处理
* @param {string} id  分区id
*/
function confirmAlarm(id,data) {
  var url=`${BASE_URL}/atds/monitor/alarm/handle/${id}`;
  return ajax(url,data,'put');
}

/**
 * 分页查询报警列表
 * @param {json} data
 */
 function getAlarmHistory(data) {
  var url=`${BASE_URL}/atds/monitor/alarm/page`;
  return ajax(url,data);
}

/**
 * 根据分区查询当前可被接管的车辆
 * data: subareaSn=x
 */
 function getTakeoverTruckList(subareaSn){
  let url=`${BASE_URL}/atds/takeover/truck/list?subareaSn=${subareaSn}`;
  return ajax(url);
}

/**
 * 接管历史分页查询
 */
function getTakeoverTaskHistory(data){
  // let sample = {
  //   sort: '排序方式',
  //   sortName: '排序依据',
  //   pageIndex: '当前页码',
  //   pageSize: '页容量',
  //   assignDate: '指派时间', // Long
  // }
  let url = `${BASE_URL}/atds/cabin/task/history/page`;
  return ajax(url,data);
}

export default {
  getReciverCabinList,
  setReciverTask,
  cancelReciverTask,
  clearAlarm,
  confirmAlarm,
  getAlarmHistory,
  getTakeoverTruckList,
  getTakeoverTaskHistory
}
