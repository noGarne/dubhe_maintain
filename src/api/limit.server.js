/**
 * 权限设置接口
 */

import config from './config'
import ajax from './ajax';

const BASE_URL = config.BASE_URL;

//authority: "SYS_ADMIN"系统管理员特殊权限
const SYS_ADMIN='SYS_ADMIN';
const SYS_ADMIN_Limit='systemLog';

/**
 * 获取功能权限列表
 * @param {number} tenantId    租户id
 */
function getLimitList(tenantId) {
    var data = {
        tenantId:tenantId
    }
    let url = BASE_URL + '/auth/permissions';
    return ajax(url,data);
}

/**
 * 获取用户功能权限
 * @param {string} id    用户id
 */
function getUserLimit(id) {
    let url = BASE_URL + `/user/${id}/permissions`;
    return ajax(url);
}

/**
 * 添加/更新用户功能权限
 * @param {string} id    用户id
 * @param {object} data  
 */
function updateUserLimit(id, data) {
    let url = BASE_URL + `/user/${id}/permissions`;
    return ajax(url, data, "post");
}

export default{
    getLimitList,
    getUserLimit,
    updateUserLimit,
    SYS_ADMIN,
    SYS_ADMIN_Limit
}