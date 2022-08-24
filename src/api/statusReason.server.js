/**
 *  异常原因接口 
 */

import ajax from './ajax.js'
import config from './config.js'

const BASE_URL = config.BASE_URL;

/**
 * 查询异常原因列表-分页
 * @param {number} pageIndex            当前页码
 * @param {number} pageSize             当前页码显示数量
 * @param {number} equipmentTypeSn      设备类型sn   1 采装设备 / 2 卡车 / 3 卸点
 * @param {number} equipmentOpStatus    状态
 * @param {boolean} systemPredefine      是否为系统默认
 */
function getStatusReason(data) {
    data.pageIndex?data.pageIndex=data.pageIndex-1:"";
    var url = `${BASE_URL}/atds/common/statusReason`;
    return ajax(url,data);
}

/**
 * 添加异常原因
 * @param {number} delayTime:           延时时间
 * @param {number} equipmentOpStatus    状态
 * @param {number} equipmentTypeSn      设备类型
 * @param {string} reasonDesc           备注
 * @param {string} reasonName           原因
 * @param {number} reasonSn             原因编码
 * @param {boolean} systemPredefine      人工自动  false 人工 / true 自动
 */
function addStatusReason(data) {
    var url = `${BASE_URL}/atds/common/statusReason`;
    return ajax(url, data, "post");
}

/**
 * 编辑异常原因
 * @param {number} delayTime:           延时时间
 * @param {number} equipmentOpStatus    状态
 * @param {number} equipmentTypeSn      设备类型
 * @param {string} reasonDesc           备注
 * @param {string} reasonName           原因
 * @param {number} reasonSn             原因编码
 * @param {boolean} systemPredefine      人工自动  false 人工 / true 自动
 */
function editStatusReason(id,data) {
    var url = `${BASE_URL}/atds/common/statusReason/${id}`;
    return ajax(url, data, "put");
}

/**
 * 删除异常原因
 * @param {string} id     原因id
 */
function deleteStatusReason(id) {
    // var url = `${BASE_URL}/atds/common/statusReason/${id}`;
    // return ajax(url, {}, "delete");
}

export default {
    getStatusReason,
    addStatusReason,
    editStatusReason,
    deleteStatusReason
}
