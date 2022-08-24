/**
 * 权限设置接口
 */

import config from './config'
import ajax from './ajax';

const BASE_URL = config.BASE_URL;

/**
 * 头部消息提醒查看
 * @param {number} pageSize     当前页面显示数量
 * @param {number} pageIndex    当前页面
 */
 function showMessage(data) {
    var url = `${BASE_URL}/atds/system/alarm/handle/batch`;
    return ajax(url,data,'put');
}


/**
 * 报警列表
 * @param {number} pageSize        一页显示多少条
 * @param {number} pageIndex       当前第几页
 * @param {string} startTime       开始时间
 * @param {string} endTime         结束时间
 * @param {string} isHandled       true-已处理 false-未处理 （必填）
 * @param {string} alarmDetail     报警信息搜索
 * @param {number} alarmType       报警类型 （可多选,隔开） LOAD_BOUNDARY_UPDATE：装载区边界更新；UNLOAD_BOUNDARY_UPDATE：卸载区边界更新；DOCK_GROUP_STATE_CHANGE：停靠区状态更新
 * atds/hdmap/alarm/page?isHandled=true&pageIndex=0&pageSize=10&alarmType=DOCK_GROUP_STATE_CHANGE&startTime=2020-10-15 00:00:00&endTime=2020-10-16 00:00:00&alarmDetail=卸载区%232
 */
 function getAlarmHistory(data) {
    var url=`${BASE_URL}/atds/system/alarm/page`;
    return ajax(url,data);
  }
  
  
export default{
    showMessage,
    getAlarmHistory
}