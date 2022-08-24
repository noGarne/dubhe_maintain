/**
 * 报警管理
 */

import ajax from '../../../api/ajax';
import config from '../../../api/config';

const BASE_URL = config.BASE_URL;


/**
* 报警处理-接受/拒绝
* @param {string} id  报警消息id
*/
function alarmHandle(id,data={}) {
  var url=`${BASE_URL}/atds/hdmap/alarm/handle/${id}`;
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
function getAlarmHistory(arg) {
  var arg=arg?arg:{};
  var pageSize = arg.pageSize?arg.pageSize:14;
  var pageIndex = arg.pageIndex-1?arg.pageIndex-1:0;
  var startTime = arg.startTime?arg.startTime:"";
  var endTime = arg.endTime?arg.endTime:"";
  var isHandled = arg.isHandled?arg.isHandled:"";
  var alarmType = arg.alarmType?arg.alarmType:"";
  var alarmDetail = arg.alarmDetail?arg.alarmDetail:"";
  var data = {
      pageSize:pageSize,
      pageIndex:pageIndex,
  }
  !startTime||(data['startTime']=startTime);
  !endTime||(data['endTime']=endTime);
  !isHandled||(data['isHandled']=isHandled);
  !alarmType||(data['alarmType']=alarmType);
  !alarmDetail||(data['alarmDetail']=alarmDetail);

  var url=`${BASE_URL}/atds/hdmap/alarm/page`;
  return ajax(url,data);
}



export default {
  alarmHandle,
  getAlarmHistory
}