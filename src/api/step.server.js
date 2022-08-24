/**
 *  台阶接口 
 */

import ajax from './ajax.js'
import config from './config.js'

const BASE_URL = config.BASE_URL;

/**
 * 查询台阶列表-分页
 * @param {number} pageSize     当前页面显示数量
 * @param {number} pageIndex    当前页面
 * @param {number} sort         排序
 * @param {number} sortName     排序字段  stepSn:编号/stepName:名称
 */
function getStepList(info) {
    var sort = info.sort?info.sort:"DESC"
    var sortName = info.sortName?info.sortName:"stepSn"
    var data={
        pageIndex:info.pageIndex-1,
        pageSize:info.pageSize,
        sort:sort,
        sortName:sortName,
    }
    
    !info.subareaSn||(data['subareaSn']=info.subareaSn);

    var url = `${BASE_URL}/atds/steps`;
    return ajax(url,data);
}

/**
 * 获取台阶详细
 * @param {string} id 台阶id   
 */
function getStepDetail(id) {
    var url = `${BASE_URL}/atds/steps/${id}`;
    return ajax(url);
}

/**
 * 添加台阶
 * @param {string} stepName:    台阶名称
 * @param {number} stepSn:      台阶编码sn
 * @param {number} subareaSn:   分区sn
 */
function addStep(data) {
    var url = `${BASE_URL}/atds/steps`;
    return ajax(url, data, "post");
}

/**
 * 编辑台阶
 * @param {string} id:          台阶id
 * @param {string} stepName:    台阶名称
 * @param {number} subareaSn:   分区sn
 */
function editStep(id,data) {
    var url = `${BASE_URL}/atds/steps/${id}`;
    return ajax(url, data, "put");
}

/**
 * 删除台阶
 * @param {string} id:          台阶id
 */
function deleteStep(id) {
    var url = `${BASE_URL}/atds/steps/${id}`;
    return ajax(url, {}, "delete");
}

export default {
    getStepList,
    getStepDetail,
    addStep,
    editStep,
    deleteStep
}
