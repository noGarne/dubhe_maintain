/**
 * 设备
 */
import ajax from './ajax'
import config from "./config"
var BASE_URL = config.BASE_URL;

/**
 * 获取设备列表
 * @param {number} pageSize        一页显示条数
 * @param {number} pageIndex       当前页码
 * @param {string} sort            排序   DESC/ASC
 * @param {number} showTypeSn      大类
 * @param {number} subShowTypeSn   子类型
 * @param {number} equipmentTypeSn 设备类型Sn  1：采装设备 2：矿卡 3：卸点
 * @param {string} equipmentName   设备名称
 * @param {number} subareaSn       分区sn
 * @param {boolean} isForbidden     设备是否禁用  true/false
 */
function devicesList(arg){
  var arg = arg ? arg : {};
  var pageSize = arg.pageSize?arg.pageSize:14;
  var pageIndex = arg.pageIndex?arg.pageIndex-1:0;
  var sort = arg.sort?arg.sort:"DESC";
  var sortName = arg.sortName?arg.sortName:"equipmentSn";

  var showTypeSn = arg.showTypeSn?arg.showTypeSn:"";
  var subShowTypeSn = arg.subShowTypeSn?arg.subShowTypeSn:"";
  var equipmentTypeSn = arg.equipmentTypeSn?arg.equipmentTypeSn:"";
  var equipmentName = arg.equipmentName?arg.equipmentName:"";
  var subareaSn = arg.subareaSn?arg.subareaSn:"";
  var equipmentModelSn = arg.equipmentModelSn?arg.equipmentModelSn:null;
  var data = {
    pageSize,
    pageIndex:pageIndex,
    sort,
    sortName
  }
  if(arg.isForbidden===true || arg.isForbidden===false){
    data['isForbidden']=arg.isForbidden
  }

  !showTypeSn||(data['showTypeSn']=showTypeSn);
  !subShowTypeSn||(data['subShowTypeSn']=subShowTypeSn);
  !equipmentTypeSn||(data['equipmentTypeSn']=equipmentTypeSn);
  !equipmentName||(data['searchText']=equipmentName);
  !subareaSn||(data['subareaSn']=subareaSn);
  !equipmentModelSn||(data['equipmentModelSn']=equipmentModelSn);
  !arg.notShowTypeSn||(data['notShowTypeSn']=arg.notShowTypeSn);

  return ajax(BASE_URL + '/atds/equipment/devices/deviceViewList',data);
}

/**
 * 添加设备
 * @param {number} equipmentSn       设备sn
 * @param {string} equipmentName     设备名称
 * @param {number} showTypeSn   设备类型sn
 * @param {number} equipmentModelSn  设备型号sn
 * @param {number} subareaSn         分区sn
 * @param {boolean} forbidden         是否禁用 true/false
 * @param {number} bucketVolume      铲斗容量
 * @param {number} conversionRate    折算率 0.5或1
 */
function addDevices(data){
  return ajax(BASE_URL + '/atds/equipment/devices/deviceViews',data,"post");
}

/**
 * 修改设备
 * @param {number} equipmentSn       设备sn
 * @param {string} equipmentName     设备名称
 * @param {number} showTypeSn   设备类型sn
 * @param {number} equipmentModelSn  设备型号sn
 * @param {number} subareaSn         分区sn
 * @param {boolean} forbidden         是否禁用 true/false
 * @param {number} bucketVolume      铲斗容量
 * @param {number} conversionRate    折算率 0.5或1
 */
function editDevices(data){
  return ajax(BASE_URL + '/atds/equipment/devices/deviceViews',data,"post");
}

/**
 * 删除设备
 * @param {string} id       设备id
 */
function deleteDevices(id){
  var url =`${BASE_URL}/atds/equipment/devices/deviceViews/${id}`
  return ajax(url,{},"delete");
}

/**
 * 禁用设备
 * @param {string} deviceId  设备id
 * @param {boolean} isForbidden  是否禁用设备   true/false
 */
function forbiddenDevices(arg){
  var deviceId = arg.deviceId?arg.deviceId:"";
  var isForbidden = arg.isForbidden?arg.isForbidden:false;
  // var url = BASE_URL + "/device/devices/postForbidDeviceProcessing";
  var url = `${BASE_URL}/atds/equipment/devices/${deviceId}/postForbidDeviceProcessing/${isForbidden}`;
  var data = {}
  return ajax(url, data, "post");
}

/**
 * 查看设备详情
 * @param {string} id  设备id
 */
function getDevicesDetails(id){
  var url = BASE_URL + "/atds/equipment/devices/deviceViews/"+id;
  return ajax(url);
}

/**
 * 获取凭证
 * @param {string} id  设备id
 */
function getCredentials(id){
  var url = `${BASE_URL}/atds/equipment/${id}/credentials`;
  return ajax(url);
}

/**
 * 修改凭证
 * @param {string} deviceId          设备deviceId
 * @param {string} credentialsType   类型  ACCESS_TOKEN/X509_CERTIFICATE
 * @param {string} credentialsId     Imei 的值
 * @param {string} credentialsValue  选填
 * @param {string} id                设备id
 */
function editCredentials(data){
  return ajax( BASE_URL + '/atds/equipment/devices/credentials',data,"post");
}

/**
 * 获取车型类型设备型号列表
 */
function getParameter(){
  var url = BASE_URL + '/atds/equipment/types/typeAndModelTree'
  return ajax(url);
}


/**
 * 新增车型型号
 * @param {number} equipmentTypeSn  设备类型sn
 * @param {string} name             设备型号名称
 * @param {number} sn               设备型号sn
 */
function addDeviceModel(data){
  return ajax( BASE_URL + '/atds/equipment/models', data ,"post");
}

/**
 * 修改车型型号
 * @param {string} id               设备型号id
 * @param {number} equipmentTypeSn  设备类型sn
 * @param {string} name             设备型号名称
 * @param {number} sn               设备型号sn
 */
function editDeviceModel(data){
  var url = `${BASE_URL}/atds/equipment/models/${data.id}`
  return ajax(url , data ,"put");
}

/**
 * 删除设备型号
 */
function deleteDeviceModel(id){
  let url = BASE_URL + '/atds/equipment/models/' + id;
  return ajax( url, {} ,"delete");
}

/**
 * 获取设备详情
 * @param {string} id      设备型号id
 */
function getDeviceModel(id){
  var url = `${BASE_URL}/atds/equipment/models/${id}`;
  return ajax(url);
}

/**
 * 获取参数
 * @param {number} truckModelSn      矿卡型号sn
 */
function getParameterLoad(truckModelSn){
  var url = `${BASE_URL}/atds/equipment/truckModels/${truckModelSn}/load`;
  return ajax(url);
}

/**
 * 获取参数
 * @param {number} truckModelSn      矿卡型号sn
 * @param {number} loadWasteWeight   装岩载重
 * @param {number} loadMineWeight    装矿载重
 */
function editParameterLoad(data){
  var url = `${BASE_URL}/atds/equipment/truckModels/${data.truckModelSn}/load`;
  return ajax(url , data ,"patch");
}

/**
 * 查询位置列表
 * @param {number} siteType      1-铲窝 2-卸点
 */
function getPosition(siteType){
  var url = `${BASE_URL}/atds/hdmap/sites/list?siteType=${siteType}`;
  return ajax(url);
}

/**
 * 设置采装设备采装设备/卸点位置
 * @param {number} equipmentSn      设备sn
 * @param {number} equipmentType    型号sn
 * @param {number} siteType         1-铲窝 2-卸点
 * @param {number} siteSn           位置sn
 */
function setPostion(data){
  var url = `${BASE_URL}/atds/hdmap/sites/setSiteToDevice`;
  return ajax(url , data ,"put");
}

/**
 * 设置设备-场地位置关系
 * @param {*} data placeId        场地id
 * @param {*} data deviceIds      设备id，多个用,隔开
 * @param {*} data operator       操作类型：place/device
 * @param {*} data equipmentType  调度类型：SHOVEL/DUMPAREA
 */ 
function setDevicePlace(data){
  var url = `${BASE_URL}/atds/equipment/devices/place/set`;
  return ajax(url , data ,"put");
}

/**
 * 获取设备运营状态列表
 * data: subareaSn=x&equipmentTypeSn=x&equStatus=x&online=x
 */
function getDeviceStatusList(data){
  var url = BASE_URL + '/atds/equipment/devices/statusView';
  return ajax(url,data);
}
/**
 * 新增卸载点
 * 
 */
function getdeviceListViews(data){
    return ajax(BASE_URL + '/atds/equipment/devices/deviceListViews',data,'post');
}


/**
 * 获取设备设施类型
 */
function getEquipmentTypeList(){
  var url = BASE_URL + '/atds/equipment/type/types';
  return ajax(url);
}

export default {
    devicesList,
    addDevices,
    editDevices,
    deleteDevices,
    getCredentials,
    editCredentials,
    getParameter,
    forbiddenDevices,
    editDeviceModel,
    deleteDeviceModel,
    getDeviceModel,
    addDeviceModel,
    getDevicesDetails,
    getParameterLoad,
    editParameterLoad,
    getPosition,
	getdeviceListViews,
    setPostion,
    setDevicePlace,
    getDeviceStatusList,
    getEquipmentTypeList
}