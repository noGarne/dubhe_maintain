/* 
** 调度设置接口
*/
import config from './config.js'
import ajax from './ajax.js'

const BASE_URL=config.BASE_URL;
const MAINTAIN_URL = MAINTAIN_URL;

/**
 * 矿卡、卸点、采装设备列表
 * @param {number} pageSize         一页显示多少条数据
 * @param {number} pageIndex        当前页码
 * @param {string} sort             排序 desc/asc
 * @param {number} equipmentTypeSn  设备类型sn
 * @param {number} subareaSn        分区sn
 */
function getEquipmentList(arg){
    var arg = arg ? arg : {};
    var pageSize = arg.pageSize?arg.pageSize:14;
    var pageIndex = arg.pageIndex?arg.pageIndex-1:0;
    var sort= arg.sort?arg.sort:"desc";
    var equipmentTypeSn= arg.equipmentTypeSn?arg.equipmentTypeSn:"";
    var subareaSn= arg.subareaSn?arg.subareaSn:"";
    var equipmentSn= arg.equipmentSn?arg.equipmentSn:"";
    var equipmentName= arg.equipmentName?arg.equipmentName:"";
    // var deviceId= arg.deviceId?arg.deviceId:"";
    var data = {
      pageIndex,
      pageSize
    }
    !sort||(data['sort']=sort)
    !equipmentTypeSn||(data['equipmentTypeSn']=equipmentTypeSn)
    !subareaSn||(data['subareaSn']=subareaSn)
    !equipmentSn||(data['equipmentSn']=equipmentSn)
    !equipmentName||(data['deviceName']=equipmentName)
    // !deviceId||(data['deviceId']=deviceId)
  
    return ajax(BASE_URL + '/atds/equipment/devices/ext/list',data);
}



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
 * 铲窝、卸点、停车位位置
 * @param {number} siteType       1-采装设备 2-卸点 3-停车位
 * @param {number} equipmentType  SHOVEL(1,"采装设备"), TRUCK(2,"卡车"), DUMPAREA(3,"卸点"), AUXILIARY_SPACE(4, "辅助场所"), OTHER(5,"其它");
 */
function getPositionList(data){
    // return ajax(BASE_URL + '/atds/hdmap/sites/device/list',data);
    return ajax(BASE_URL + '/atds/hdmap/sites/device/dispatch/list',data);
}

/**
 * 推土机位置
 * @param {number} subareaSn   分区sn
 */
function getBulldozerPositionList(data){
    return ajax(BASE_URL + '/atds/hdmap/sites/device/Bulldozer/list',data);
}

/**
 * 修改设备位置
 * @param {string} equipmentSn      //设备sn
 * @param {object} equipmentType    //设备类型  EquipmentType:1-采装设备 2-卡车 3-卸点 6-停车场
 * @param {string} siteType         //位置类型   SiteType : 1-采装设备 2-卸点 3-停车位
 * @param {number} siteSn           //位置sn    
 * @param {string} stopTruckSn      //停车场卡车sn

 */
function setPositionDevice(data) {
    var url = `${BASE_URL}/atds/hdmap/sites/setDeviceToSite`;
    return ajax(url, data, "put");
}

/**
 * 设备状态更改
 * @param {string} shovelId         *设备id
 * @param {object} data             主要状态为以下参数
 * @param {string} startTime        初始时间    
 * @param {number} equStatus        *运营状态 1:备用 2:延时 3:故障 4:备用    
 * @param {string} reasonComment    备注
 * @param {number} reasonSn         原因编号
 * @param {number} planDuration     延时时长
 */
function editEquipmentStatus(id,data) {
    var url = `${BASE_URL}/atds/equipment/devices/${id}/status`;
    return ajax(url, data, "patch");
}

/**
 * 采装设备能力编辑
 * @param {number} shovelSn         采装设备sn
 * @param {object} data             主要状态为以下参数
 * @param {number} loadCapacity     装载能力
 * @param {number} minCapacity      最小能力
 * @param {number} restrictCapacity 最大能力
 * @param {number} digCapacity      挖掘能力
 * @param {number} waitLoadTime     等待装载时间
 */
function editEquipmentCapacity(shovelSn,data) {
    var url = `${BASE_URL}/atds/equipment/shovels/${shovelSn}/capacity`;
    return ajax(url, data, "put");
}

/**
 * 卸点能力编辑
 * @param {string} dumpInfoId           卸点id
 * @param {object} data                 主要状态为以下参数
 * @param {number} unloadingCapacity    卸载能力
 * @param {number} unloadingSpeed       卸载速度
 * @param {number} avgUnloadingTime     平均卸载时间
 * @param {boolean} isRestricted        是否限制能力
 */
function editDumpCapacity(dumpInfoId,data) {
    var url = `${BASE_URL}/atds/equipment/dumpInfos/${dumpInfoId}/unldgCpcty`;
    return ajax(url, data, "put");
}

/**
 * 采装设备优先级编辑
 * @param {number} shovelSn       采装设备sn
 * @param {number} objPrioLevel   优先级
 */
function editShovelPrioLevel(shovelSn,objPrioLevel) {
    var url = `${BASE_URL}/atds/equipment/shovels/${shovelSn}/${objPrioLevel}`;
    return ajax(url, {}, "put");
}

/**
 * 卸点优先级编辑
 * @param {string} dumpInfoId       卸点is
 * @param {number} objPrioLevel   优先级
 */
function editDumpPrioLevel(dumpInfoId,objPrioLevel) {
    var url = `${BASE_URL}/atds/equipment/dumpInfos/${dumpInfoId}/${objPrioLevel}`;
    return ajax(url, {}, "put");
}

/**
 * 设备物料设置
 * @param {string} deviceId         设备id
 * @param {number} curntMtrlSn      当前物料sn
 */
function editEquipmentMaterial(deviceId,curntMtrlSn) {
    var url = `${BASE_URL}/atds/equipment/common/curntmtrl/${deviceId}/${curntMtrlSn}`;
    return ajax(url, {}, "put");
}

/**
 * 卡车位置修改
 * @param {number} truckSn      卡车sn
 * @param {object} data         包含以下参数
 * @param {string} positionId   位置，卸点或采装设备id
 */
function editTruckPosition(truckSn,data) {
    var url = `${BASE_URL}/atds/equipment/trucks/${truckSn}/initPositon`;
    return ajax(url, data, "patch");
}

/**
 * 采装设备基础信息修改
 * @param {number} shovelSn         采装设备sn
 * @param {object} data             包含以下参数
 * @param {number} stepSn           台阶sn
 * @param {number} subareaSn        分区sn
 * @param {number} bucketVolume     斗容量
 * @param {number} smlcircleRadius  小圆半径
 * @param {number} areaRadius       区域半径
 * @param {boolean} loadedEnable     启动装完
 */
function editShovelBaseParame(shovelSn,data) {
    var url = `${BASE_URL}/atds/equipment/shovels/${shovelSn}/baseParame`;
    return ajax(url, data, "put");
}

/**
 * 矿卡基础信息修改
 * @param {number} truckSn          *卡车sn
 * @param {object} data             包含以下参数
 * @param {number} conversionRate   折算率
 * @param {number} subareaSn        分区
 */
function editTruckBaseParame(truckSn,data) {
    var url = `${BASE_URL}/atds/equipment/trucks/${truckSn}/baseParame`;
    return ajax(url, data, "put");
}

/**
 * 卸点基础信息修改
 * @param {string} id                   *卸点id
 * @param {object} data                 包含以下参数
 * @param {number} areaRadius	        区域半径
 * @param {number} maxNumbTruckQueues	最大排队数
 * @param {number} unloadedTrucksNumb	卸载车数
 */
function editDumpBaseParame(id,data) {
    var url = `${BASE_URL}/atds/equipment/dumpInfos/${id}/baseParame`;
    return ajax(url, data, "put");
}

/**
 * 查询锁定/禁止规则列表
 * @param {object} data         包含以下参数
 * @param {number} subareaSn	分区编号
 * @param {number} elmtSn	    元素编号
 * @param {string} elmtType	    元素类型  SHOVEL 采装设备/ TRUCK 矿卡/DUMP_AREA 卸点/MATERIAL 物料
 */
function getRuleList(data) {
    var url = `${BASE_URL}/atds/banLockRules/ruleGroup`;
    return ajax(url,data);
}

/**
 * 设置禁止规则
 * @param {number} subareaSn	分区编号 
 * @param {string} ruleType	    关系类型    TRUCK_TO_DUMPAREA矿卡对卸点/TRUCK_TO_SHOVEL 矿卡对采装设备/TRUCK_TO_MATERIAL 矿卡对物料/SHOVEL_TO_DUMPAREA 采装设备对卸点
 * @param {number} elmtSn	    元素编号
 * @param {string} elmtType	    元素类型    SHOVEL 采装设备/TRUCK 矿卡/DUMP_AREA 卸点/MATERIAL 物料
 * @param {Array} data          禁止的sn数组        
 */
function setBanRule(args,data) {
    var url = `${BASE_URL}/atds/banRules/${args.subareaSn}/${args.ruleType}/${args.elmtSn}/${args.elmtType}`;
    return ajax(url, data, "post");
}

/**
 * 设置锁定规则
 * @param {number} subareaSn	分区编号 
 * @param {string} ruleType	    关系类型    TRUCK_TO_DUMPAREA矿卡对卸点/TRUCK_TO_SHOVEL 矿卡对采装设备/TRUCK_TO_MATERIAL 矿卡对物料/SHOVEL_TO_DUMPAREA 采装设备对卸点
 * @param {number} elmtSn	    元素编号
 * @param {string} elmtType	    元素类型    SHOVEL 采装设备/TRUCK 矿卡/DUMP_AREA 卸点/MATERIAL 物料
 * @param {Array} data          锁定的sn数组        
 * @param {Array} data          锁定的sn数组        
 */
function setLockRule(args,data) {
    var isAllowOthersExceptlock="";
    if(args.ruleType=="TRUCK_TO_SHOVEL" && (typeof args.isAllowOthersExceptlock)=="boolean")isAllowOthersExceptlock="?isAllowOthersExceptlock="+args.isAllowOthersExceptlock;
    var url = `${BASE_URL}/atds/lockRules/${args.subareaSn}/${args.ruleType}/${args.elmtSn}/${args.elmtType}${isAllowOthersExceptlock}`;
    return ajax(url, data, "post");
}

/**
 * 司机修改
 * @param {string} id           设备id
 * @param {object} data         包含以下内容
 * @param {number} mainDriverSn 主司机
 * @param {number} subDriverSn  副司机sn
 */
function editDriver(id,data) {
    var url = `${BASE_URL}/atds/equipment/devices/${id}/driver`;
    return ajax(url, data, "put");
}

/**
 * 批量设备禁用
 * @param {boolean} isForbidden 是否禁用，true禁用，fasle启用
 * @param {object} data         包含以下内容
 * @param {array} deviceId      禁用启用的id
 */
function batchDeviceForbidden(isForbidden,data) {
    var url = `${BASE_URL}/atds/equipment/devices/postForbidDeviceProcessing/${isForbidden}/batch`;
    return ajax(url, data, "post");
}

/**
 * 查询异常原因列表
 * @param {number} equipmentTypeSn      设备类型sn
 * @param {number} equipmentOpStatus    设备状态
 */
function getStatusReason(equipmentTypeSn,equipmentOpStatus) {
    var url = `${BASE_URL}/atds/common/statusReason/${equipmentTypeSn}/${equipmentOpStatus}/reasonList`;
    return ajax(url);
}


/**
 * 查询地图元素列表
 * @param {object}} data    地图元素类型：typeStrs=DUMPAREA,LOADAREA
 */
function getRoadElementList(data={}){
    return ajax(BASE_URL + '/atds/hdmap/roadElement/list',data);
}

/**
 * 查询场地与地图元素的位置绑定
 * @param {object}} data    subareaSn分区
 */
function getRoadElementPlaceList(data){
    return ajax(BASE_URL + '/atds/hdmap/roadElement/place/list',data);
}

/**
 * 设置场地与地图元素的位置绑定
 * @param {object}} data    subareaSn分区
 */
function setRoadElementPlace(data){
    return ajax(BASE_URL + '/atds/hdmap/roadElement/setRoadElementToPlace',data,'put');
}

/**
 * 查询场地设备位置
 * @param {object}} data    包括：subareaSn分区
 */
function getDevicePositionList(data){
    return ajax(BASE_URL + '/atds/hdmap/roadElement/place/list',data);
}


/**
 * 为特定设备添加热量值
 * @param {object}} data    包括：subareaSn分区
 */
function getSaveHotValue(deviceId,hotValue){
    return ajax(BASE_URL + `/atds/equipment/devices/save/${deviceId}/${hotValue}`);
}


/**
 * 调度策略生效
 * 
 */
function getDispatchStrStatus(data){
    return ajax(BASE_URL + '/atds/schedulstrategy/tractional',data,'post');
}

/**
 * 根据类型查询地图元素列表
 * @param {object}} data    包括：subareaSn=1&subShowTypeSn=601
 * @param {number}} subShowTypeSn 601停车场 603卸载区
 */
function getRoadElementByType(data){
    return ajax(BASE_URL + '/atds/hdmap/sites/place/list/withSite',data);
}

/**
 * 查询设备停靠位
 * @param {object}} data    包括：subareaSn=1&showTypeSn=2&equipmentName=xxx
 */
function getDeviceSite(data){
    return ajax(BASE_URL + '/atds/hdmap/sites/device/page',data);
}

/**
 * 设置设备停靠位
 * @param {object}} data  包括：  
    "equipmentSn":1,
    "equipmentType":2,
    "siteType":3,//停车场=3；破碎站=2
    "siteSns":[1, 2]
 */
function setDeviceSite(data){
    return ajax(BASE_URL + '/atds/hdmap/sites/setSiteToDevice',data,'put');
}

/**
 * 设置卸载区装载区编组限制
 * @param {object} data         包含以下内容
 * @param {string} subareaSn    分区
 */
function getHaulingTrack(data) {
    var url = `${BASE_URL}/atds/banLockRule/place/list`;
    return ajax(url,data);
}

/**
 * 设置卸载区装载区编组限制
 * @param {object} data         包含以下内容
 */
function setHaulingTrack(data) {
    var url = `${BASE_URL}/atds/banLockRule/place/modify`;
    return ajax(url, data, "post");
}

/**
 * 查询生产计划列表
 * @param {object} data         
 */
 function getProductionPlan(data) {
    var url = `${BASE_URL}/atds/output/devicePlans`;
    return ajax(url,data);
}

/**
 * 添加生产计划
 * @param {object} data           
 */
 function addProductionPlan(data) {
    var url = `${BASE_URL}/atds/output/devicePlan`;
    return ajax(url,data,'post');
}

/**
 * 编辑生产计划
 * @param {string} id         
 */
 function editProductionPlan(data) {
    var url = `${BASE_URL}/atds/output/updateDevicePlan`;
    return ajax(url,data,'put');
}

/**
 * 删除生产计划
 * @param {string} planId         
 */
 function deleteProductionPlan(planId) {
    var url = `${BASE_URL}/atds/output/devicePlan/${planId}`;
    return ajax(url,{},'delete');
}




/**
 * 查询当天生产计划详情
 * @param {object} data  subAreaId=32ba8930-ec17-11ea-9ebd-2f7e198e2bde&date=2021-05-09 00:00:00       
 */
 function getProductionPlanDetail(data) {
    var url = `${BASE_URL}/atds/output/plan`;
    return ajax(url,data);
}

export default{
    getEquipmentList,
    setPositionDevice,
    editEquipmentCapacity,
    getPositionList,
    getBulldozerPositionList,
    editDumpCapacity,
    editShovelPrioLevel,
    editDumpPrioLevel,
    editEquipmentMaterial,
    editTruckPosition,
    editShovelBaseParame,
    editTruckBaseParame,
    editDumpBaseParame,
    getRuleList,
    setBanRule,
	devicesList,
    setLockRule,
    editDriver,
    batchDeviceForbidden,
    getStatusReason,
    editEquipmentStatus,
    getRoadElementList,
    getRoadElementPlaceList,
    setRoadElementPlace,
    getDevicePositionList,
    getRoadElementByType,
    getDeviceSite,
    setDeviceSite,
    getHaulingTrack,
	getSaveHotValue,
	getDispatchStrStatus,
    setHaulingTrack,
    getProductionPlan,
    addProductionPlan,
    editProductionPlan,
    deleteProductionPlan,
    getProductionPlanDetail
}