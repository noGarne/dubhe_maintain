/**
 *  任务文件接口 
 */

import ajax from './ajax.js'
import config from './config.js'

const BASE_URL = config.BASE_URL;


/**
 * 上传路径文件
 * @param {string}  formData      上传文件
 * @param {function}  curProgressEvent  上传进程
 * @param {object}  cancelProgress      取消上传
 */
function uploadingPathFiles(formData, curProgressEvent, cancelProgress) {
    var url = `${BASE_URL}/atds/hdmpas`;
    return ajax(url, formData, 'file', curProgressEvent, cancelProgress);
}
/**
 * 查询地图
 * @param {number} pageIndex    当前页码
 * @param {number} pageSize     当前页码显示数量
 * @param {number} subareaSn    分区sn
 */
function getMapFileList(data) {
    var url = `${BASE_URL}/atds/hdmpas/versions/page`;
    return ajax(url,data);
}

/**
 * 查询动态路径文件
 * @param {number} pageIndex    当前页码
 * @param {number} pageSize     当前页码显示数量
 * @param {number} subareaSn    分区sn
 */
function dynamicPath(data) {
    var url = `${BASE_URL}/atds/dispatching/pathPlanningInfo/list`;
    return ajax(url,data);
}

/**
 * 一键释放路权
 */
function releaseWay() {
    var url = `${BASE_URL}/planning/dispatching/roadCoordinates`;
    return ajax(url,{},'delete');
}
/**
 * 一键释放调度目标
 */
function releaseTarget() {
    var url = `${BASE_URL}/dispatching/currentTasks`;
    return ajax(url,{},'delete');
}

/**
 * 获取单个地图文件上传进度列表
 */
function getUpdateCourse(id) {
    var url = `${BASE_URL}/atds/trace/list?traceId=${id}`;
    return ajax(url);
}

/**
 * 获取地图上传日志
 */
function getLogRecord(data) {
    var url = `${BASE_URL}/atds/trace/page`;
    return ajax(url,data);
}

export default {
    uploadingPathFiles,
    getMapFileList,
    dynamicPath,
    releaseWay,
    releaseTarget,
    getUpdateCourse,
    getLogRecord
}
