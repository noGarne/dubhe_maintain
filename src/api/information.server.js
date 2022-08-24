/**
 *  任务文件接口
 */

import ajax from './ajax.js'
import config from './config.js'

const BASE_URL = config.BASE_URL;


/**
 * 查询输出列表
 * @param {number} pageIndex    当前页码
 * @param {number} pageSize     当前页码显示条数
 * @param {object} data         当前页码显示条数
 * @param {string} sort         排序方式，默认为ASC，取值为ASC升序、DESC降序
 * @param {string} sortName     排序字段
 * @param {string} disptchDate  调度当班日期
 * @param {number} disptchSn    调度班组编号
 * @param {number} subareaSn    分区编号
 * @param {number} truckSn      卡车编号
 */
function getOutputList(data) {
    var url = `${BASE_URL}/atds/outputhistorys/page`;
    var rData = JSON.parse(JSON.stringify(data));
    rData['pageIndex']=rData.pageIndex-1;
    rData['pageSize']=rData.pageSize;
    rData['sort']="DESC";

    return ajax(url,rData);
}

/**
 * 添加产量
 * @param {object} data
 */
function addOutput(data) {
    var url = `${BASE_URL}/atds/outputhistorys`;
    return ajax(url, data, "post");
}


/**
 * 修改产量
 * @param {object} data
 */
function editOutput(data) {
    var url = `${BASE_URL}/atds/outputhistorys`;
    return ajax(url, data, "post");
}


/**
 * 查询产量日志
 * @param {object} id
 */
 function getOutputLog(id) {
    var url = `${BASE_URL}/atds/changeValues/list/${id}`;
    return ajax(url);
}


/**
 * 查询载重
 * @param {string} materialId    物料id
 * @param {string} truckId       矿卡id
 * @param {number} vehicleNumber 车数
 */
function getMaterialLoad(materialId,truckId,vehicleNumber) {
    var nowTime = Math.floor(Math.random()*100000);
    var url = `${BASE_URL}/calculation/materialload/${materialId}/${truckId}/${vehicleNumber}/${nowTime}`;
    return ajax(url);
}

/**
 * 查询出车时间列表
 * @param {number} pageIndex    当前页码
 * @param {number} pageSize     当前页码显示条数
 */
function getDepartTime(data) {
    var url = `${BASE_URL}/atds/trucks/currentDispatchingTrucks`;
    var rData = JSON.parse(JSON.stringify(data));
    rData['pageIndex']=rData.pageIndex-1;
    rData['pageSize']=rData.pageSize;

    return ajax(url,rData);
}

/**
 * 查询入网车辆列表
 * @param {number} pageIndex    当前页码
 * @param {number} pageSize     当前页码显示条数
 */
function getNetVehicle(data) {
    var url = `${BASE_URL}/atds/login/drivers`;
    var rData = JSON.parse(JSON.stringify(data));
    rData['pageIndex']=rData.pageIndex-1;
    rData['pageSize']=rData.pageSize;

    return ajax(url,rData);
}

/**
 * 查询未出车辆
 * @param {object} data
 */
function getNotOutVehicle(data) {
    var url = `${BASE_URL}/atds/equipments/status/free`;
    return ajax(url,data);
}

/**
 * 设备状态列表--分页
 * @param {number} pageIndex    当前页码
 * @param {number} pageSize     当前页码显示条数
 */
function getEquipmentStatusList(data) {
    var url = `${BASE_URL}/atds/equipments/status/history`;
    return ajax(url,data);
}

/**
 * 修改设备状态列表
 * @param {number} id               设备id
 * @param {object} data             包含以下内容
 * @param {number} equStatus        运营状态 必填 1:备用 2:延时 3:故障 4:备用
 * @param {number} reasonSn         原因编号
 * @param {number} durationTime     延时时长
 * @param {string} startTime        开始时间
 * @param {string} finishTime       结束时间
 * @param {string} reasonComment    备注
 */
//修改设备状态列表
function editEquipmentStatusList(id,data) {
    var url = `${BASE_URL}/atds/equipments/status/history/${id}`;
    return ajax(url,data,'put');
}

/**
 * 登录司机分页查询，目前仅用于查询接管员
 */
function getDriverLoginHistory(data){
//   let sample = {
//     "driverType": 7, // 司机类型 int
//     "longDate": 1629372512267, // 登录日期 Long
//     "pageIndex": 1,
//     "pageSize": 15,
//   }
//   data = sample
  let url = `${BASE_URL}/atds/driver/login/history`;
  return ajax(url,data);
}

export default {
    getOutputList,
    addOutput,
    editOutput,
    getOutputLog,
    getMaterialLoad,
    getDepartTime,
    getNetVehicle,
    getNotOutVehicle,
    getEquipmentStatusList,
    editEquipmentStatusList,
    getDriverLoginHistory,
}
