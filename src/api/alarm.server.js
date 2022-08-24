/**
 *  报警接口 
 */

import ajax from './ajax.js'
import config from './config.js'

const BASE_URL = config.BASE_URL;

/**
 * 查询报警原因列表-分页
 * @param {number} pageSize     当前页面显示数量
 * @param {number} pageIndex    当前页面
 */
function getAlarmType(data) {
    var url = `${BASE_URL}/atds/dispatchingAlarm/alarmTypes`;
    return ajax(url,data);
}

/**
 * 修改报警处理方式
 * @param {string} name:    报警类型名称
 * @param {number} auto:   是否系统自动处理
 */
function editAlarmType(data) {
    var url = `${BASE_URL}/atds/dispatchingAlarm/alarmTypes`;
    return ajax(url, data, "patch");
}

export default {
    getAlarmType,
    editAlarmType
}
