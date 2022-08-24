/**
 * 统计报表接口
 */
import config from './config.js'
import ajax from './ajax.js'

const BASE_URL = config.BASE_URL;
const JASPERSERVER_URL=config.JASPERSERVER_URL;
const JASPERSERVER_URL_PARAMS='?j_username=jasperadmin&j_password=jasperadmin&';

/**
 * 获取报表地址
 * @param {string} file     文件名称
 * @param {string} params   参数
 * @param {string} path     路径
 */
function getList(file,params,path='thingsboard'){
    var url=`${JASPERSERVER_URL}/rest_v2/reports/${path}/${file}${JASPERSERVER_URL_PARAMS}${params}`;
    return url;
}
function getHtml(file,params,path='thingsboard'){
    var url=getList(file,params,path);
    return ajax(url);
}
function getExcel(file,params,path='thingsboard'){
    var url=getList(file,params,path);
    return ajax(url,{},'GET',null,null,{responseType: 'blob'});
}


//报表
function getReportUrl(file,params,path='thingsboard') {
    var url = `${JASPERSERVER_URL}/rest_v2/reports/${path}/${file}${JASPERSERVER_URL_PARAMS}${params}`;
    return ajax(url);
}

/**
 * 获取报表json格式api数据
 * @param {string} file     jrxml文件名称=接口名（例如：truck_current_output_detail）
 * @param {string} params   自定义参数=普通查询条件（例如： &subarea_sn=1）
 * @param {string} sql   sql参数=sql查询条件（例如： and subarea_sn=1）
 * 例如：/jasperserver/rest_v2/reports/thingsboard/truck_current_output_detail.json?j_username=jasperadmin&j_password=jasperadmin&subarea_sn=1&param= and subarea_sn=1
 */
function getJsonReport(file,params='',sql=''){
    let url = `${JASPERSERVER_URL}/rest_v2/reports/thingsboard/${file}.json${JASPERSERVER_URL_PARAMS}${params}&param=${sql}`;
    return ajax(url);
  }

/**
 * 查询运行图表数据
 * @param {number} subareaSn        分区sn
 * @param {number} shiftTypeSn      调度班别
 * @param {number} equipmentTypeSn  设备sn
 * @param {number} date             查询日期Long型数值
 */
function getRunReport(data) {
    var url = `${BASE_URL}/atds/running/chart`;
    return ajax(url,data);
}

/**
 * 查询运行图表图例
 * @param {number} subareaSn    分区sn
 */
function getRunSymbol() {
    var url = `${BASE_URL}/atds/running/chart/symbol`;
    return ajax(url);
}

/**
 * 当班产量统计
 * @param {string} bTypeSum:    必填项，true按物料类型统计，false按物料名称统计
 */
function getCurrentOutput(bTypeSum) {
    var url = `${BASE_URL}/atds/userEcharts/currentShiftSum?bTypeSum=${bTypeSum}`;
    return ajax(url);
}


/**
 * 首页产量
 * @param {string} dimension        DAY/WEEK/MONTH/YEAR
 * @param {string} equipmentType    TRUCK
 */
function getHistoryOutput(data) {
    var url = `${BASE_URL}/atds/outputhistorys/chart`;
    return ajax(url,data);
}

/**
 * 首页汇总
 * @param {string} bTypeSum:    必填项，true按物料类型统计，false按物料名称统计
 */
function getTotal() {
    var url = `${BASE_URL}/atds/outputhistorys/homepage/statistic`;
    return ajax(url);
}


/**
 * 某天接管率统计汇总
 * @param {object} data deviceId=设备ID&date=时间戳
 */
 function getTakeRateSum(data) {
    var url = `${BASE_URL}/atds/equipment/takeoverRates/list`;
    return ajax(url,data);
}

/**
 * 某天接管率统计详情
 * @param {object} data deviceId=设备ID&date=时间戳
 */
 function getTakeRateDetail(data) {
    var url = `${BASE_URL}/atds/equipment/takeover/list`;
    return ajax(url,data);
}

export default{
    getList,
    getHtml,
    getExcel,
    getRunReport,
    getRunSymbol,
    getCurrentOutput,
    getReportUrl,
    getJsonReport,
    getHistoryOutput,
    getTotal,
    getTakeRateSum,
    getTakeRateDetail
}