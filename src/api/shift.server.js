/**
 * 班组设置
 */
import ajax from './ajax'

import config from "./config"
var BASE_URL = config.BASE_URL;

/**
 * 新增班次
 * @param {string} name   名称
 * @param {number} sn     编号
 */
function addShiftCrew(data){
    var url=`${BASE_URL}/atds/shift/crews`;
    return ajax(url,data,'post');
}

/**
 * 编辑班次
 * @param {string} id  班次id,
 * @param {string} name  名称,
 */
function editShiftCrew(data){
    var id = data.id;
    var url=`${BASE_URL}/atds/shift/crews/${id}`;
    return ajax(url,data,'put');
}

/**
 * 查询班次
 * @param {string} category  类型  DISPATCH 调度 / TRUCK 卡车
 */
function getShiftCrew(category){
    var url=`${BASE_URL}/atds/shift/crews/list/?category=${category}`;
    return ajax(url);
}

/**
 * 删除班次
 * @param {string} id  班次id
 */
function deleteShiftCrew(id){
    var url=`${BASE_URL}/atds/shift/crews/${id}`;
    return ajax(url,{},'delete');
}

/**
 * 查询班别
 * @param {string} category     类型  DISPATCH 调度 / TRUCK 卡车
 */
// function getShiftType(category){
//     var url=`${BASE_URL}/atds/shift/types/list/?category=${category}`;
//     return ajax(url);
// }

/**
 * 新增班别
 * @param {string} name   名称
 * @param {number} sn     编号
 */
function addShiftType(data){
    var url=`${BASE_URL}/atds/shift/types`;
    return ajax(url,data,'post');
}

/**
 * 编辑班别
 * @param {string} id       班别id
 * @param {string} name     班别名称
 */
function editShiftType(data){
    var id = data.id;
    var url=`${BASE_URL}/atds/shift/types/${id}`;
    return ajax(url,data,'put');
}

/**
 * 删除班别
 * @param {string} id  班次id
 */
function deleteShiftType(id){
    var url=`${BASE_URL}/atds/shift/types/${id}`;
    return ajax(url,{},'delete');
}

/**
 * 获取排班列表
 * @param {string} category 类型  DISPATCH 调度 / TRUCK 卡车
 * @param {string} strDate  开始时间
 * @param {string} endDate  结束时间
 */
function getShiftSetting(data){
    var url=`${BASE_URL}/atds/shift/shifts/list?category=${data.category}&strDate=${data.strDate}&endDate=${data.endDate}`;
    return ajax(url);
}

/**
 * 新增排班列表
 * @param {number} sn	        排班编号sn
 * @param {string} statDate	    班属日期
 * @param {string} beginTime	开班时间
 * @param {string} endTime	    收班时间
 * @param {string} crewsQueue	班组倒班次序
 */
function addShiftSetting(data){
    var url=`${BASE_URL}/atds/shift/settings`;
    return ajax(url,data,'post');
}

/**
 * 删除某一天以后的排班
 * @param {number} sn	      排班sn
 * @param {string} date       时间
 * @param {string} category   类型  DISPATCH 调度 / TRUCK 卡车   
 */
function deleteShiftSetting(data){
    var url=`${BASE_URL}/atds/shift/shifts?category=${data.category}&date=${data.date}&sn=${data.sn}`;
    return ajax(url,{},'delete');
}

/**
 * 删除当前的排班
 * @param {string} id	 排班id 
 */
function deleteSingleShiftSetting(id){
    var url=`${BASE_URL}/atds/shift/shifts/${id}`;
    return ajax(url,{},'delete');
}

export default{
    addShiftCrew,
    editShiftCrew,
    getShiftCrew,
    deleteShiftCrew,
    addShiftType,
    editShiftType,
    deleteShiftType,
    getShiftSetting,
    addShiftSetting,
    deleteShiftSetting,
    deleteSingleShiftSetting
}