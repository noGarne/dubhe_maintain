/**
 *  跑车日报接口
 */

import ajax from './ajax.js'
import config from './config.js'

const MAINTAIN_URL = config.MAINTAIN_URL;

/**
 * 获取跑车日报详情
 */
function getReportDetail(data){
    var url=`${MAINTAIN_URL}/sportLong/reportDetail`;
    return ajax(url, data, 'post');
}

/**
 * 手工录入
 */
function saveAll(data) {
    var url=`${MAINTAIN_URL}/sportLong/saveAll`;
    return ajax(url, data, 'post');
}

export { getReportDetail, saveAll }