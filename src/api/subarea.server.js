/**
 * 登录服务
 */
import ajax from './ajax'
import config from "./config"
var BASE_URL = config.BASE_URL;

/**
 * 获取分区列表
 * @param {number} pageSize     当前页码显示数量
 * @param {number} pageIndex    当前页码
 * @param {string} textSearch   标题搜索
 * @param {string} sortName     排序名称   subareaSn 编号/subareaName 名称
 * @param {string} sort         排序 DESC倒序|ASC正序
 */
function subareaList(arg){
  var pageSize = arg.pageSize?arg.pageSize:14;    //一页显示多少条
  var pageIndex = arg.pageIndex-1?arg.pageIndex-1:0;  //当前第几页
  var sortName=arg.sortName?arg.sortName:null;
  var sort=arg.sort?arg.sort:'DESC';
  var data={
    pageSize:pageSize,
    pageIndex:pageIndex,
    sort:sort
  }
  
  !sortName||(data['sortName']=sortName);
  return ajax(BASE_URL + "/atds/subareas",data);
}

/**
 * 添加车队
 * @param {number} subareaSn    分区编号sn
 * @param {string} subareaName  分区名称
 */
function addSubarea(data){
  return ajax(BASE_URL + '/atds/subareas', data, "post");
}

/**
 * 修改车队
 * @param {string} id           分区id
 * @param {string} subareaName  分区名称
 */
function editSubarea(data){
  var url=BASE_URL + '/atds/subareas/' + data.id;
  return ajax(url, data, "put");
}

/**
 * 删除车队
 * @param {string} id           分区id
 */
// function deleteSubarea(id){
//   var url = BASE_URL + '/atds/subareas/' + id;
//   return ajax(url, {}, "delete");
// }

/**
 * 查看车队详情
 * @param {number} sn   分区sn
 */
function singleSubarea(sn){
  // var url = BASE_URL + '/device/fleets/' + id + '/detail';
  var url = BASE_URL + '/atds/subareas/' + sn;
  var data={
    _view:'detail'
  }
  return ajax(url,data);
}


/**
 * 添加关联车
 * @param {string} subareaId        分区id
 * @param {string} deviceTypeCode   关联设备类型
 */
function assignedDevices(arg){
  var subareaId = arg.subareaId;
  var deviceTypeCode = arg.deviceTypeCode;
  var data={
    deviceIds:arg.id
  }
  return ajax(BASE_URL + '/device/fleets/' + subareaId + '/containedDevicesOfType/' + deviceTypeCode, data, "post");
}

/**
 * 删除关联车
 * @param {string} subareaId        分区id
 * @param {string} deviceId         关联设备id
 */
function deleteDevices(arg){
  var subareaId = arg.subareaId;
  var deviceId = arg.deviceId;
  return ajax(BASE_URL + '/device/fleets/' + subareaId + '/containedDevices/' + deviceId, {}, "delete");
}
/**
 * 未分配设备
 * @param {string} code     类型
 */
function unassigned(code){
  var data = {
    deviceTypeCode:code
  }
  
  return ajax(BASE_URL + '/device/fleets/unassigned/'+code)
}


export default {
    subareaList,
    addSubarea,
    editSubarea,
    // deleteSubarea,
    singleSubarea,
    unassigned,
    assignedDevices,
    deleteDevices
}