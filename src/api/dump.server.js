/* 
** 卸点管理接口
*/
import config from './config.js'
import ajax from './ajax.js'

const BASE_URL=config.BASE_URL;

/**
 * 卸点列表
 * @param {number} pageSize     一页多少条数据
 * @param {number} pageIndex    当前页码
 * @param {number} sort         排序方式    DESC/ASC
 * @param {number} sortName    设备状态
 * @param {number} disable    设备状态
 * @param {number} sTenantId    设备状态
 * @param {number} dumpType    设备状态
 * @param {number} subareaSn    设备状态
 */
function getDumpList(arg){
    var arg = arg ? arg : {};
    var pageSize = arg.pageSize?arg.pageSize:14;
    var pageIndex = arg.pageIndex?arg.pageIndex-1:0;
    var sort = arg.sort?arg.sort:"DESC";
    var sortName = 'dumpSn';
    var disable = (arg.isForbidden==true || arg.isForbidden==false)?arg.isForbidden:'';
    var sTenantId= arg.sTenantId?arg.sTenantId:null
    var dumpType= arg.dumpType?arg.dumpType:null
    var subareaSn= arg.subareaSn?arg.subareaSn:null
    var data = {
      sort,
      sortName,
      pageIndex,
      pageSize,
      disable
    }
    
    !sTenantId||(data['sTenantId']=sTenantId);
    !dumpType||(data['dumpType']=dumpType);
    !subareaSn||(data['subareaSn']=subareaSn);
  
    return ajax(BASE_URL + '/atds/common/dumpInfos',data);
  }

/**
 * 获取卸点详细
 * @param {string} id   卸点id 
 */
function getDumpDetail(id){
    var url=BASE_URL+'/atds/common/dumpInfos/'+id;
    return ajax(url);
}

/**
 * 添加卸点  
 * @param {object} data  
 */
function addDump(data){
    var url=BASE_URL+'/atds/common/dumpInfos';
    return ajax(url,data,'post');
}

/**
 * 编辑卸点  
 * @param {string} id   卸点id 
 * @param {object} data    
 */
function editDump(id,data){
    var url=BASE_URL+'/atds/common/dumpInfos/'+id;
    return ajax(url,data,'patch');
}

/**
 * 删除卸点
 * @param {string} id   卸点id 
 */
function deleteDump(id){
    var url=BASE_URL+'/atds/common/dumpInfos/'+id;
    return ajax(url,{},'delete');
}

/**
 * 关联设备
 * @param {string} id   卸点id 
 * @param {object} data    
 */
function relateDevice(id,data){
    var url=BASE_URL+'/atds/common/dumpInfos/'+id+'/relateDevice';
    return ajax(url,data,'post');
}

/**
 * 锁定物料
 * @param {string} id   卸点id 
 * @param {object} data    
 */
function lockMaterial(id,data){
    var url=BASE_URL+'/atds/common/dumpInfos/'+id+'/lockMaterial';
    return ajax(url,data,'post');
}

/**
 * 查询关联设备类型 
 */
function getDeviceTypes(){
    var url=BASE_URL+'/atds/device/types/types';
    return ajax(url);
}

/**
 * 查询未分配设备
 * @param {string} sn   设备类型sn
 */
function unRelatedDevices(sn){
    // var url=BASE_URL+'/atds/common/dumpInfos/unRelatedDevices';
    var url=BASE_URL+'/atds/common/dumpInfos/unRelatedDevices?equipmentTypeSn='+sn;
    return ajax(url);
}

/**
 * 获取优先级
 * @param {string} id   卸点id
 */
function getPriority(id) {
    var tNow = Math.floor(Math.random()*10000);
    var url = `${BASE_URL}/common/dumpAreas/ext/${id}/${tNow}`;
    return ajax(url);
}

/**
 * 编辑优先级
 * @param {string} id               卸点id
 * @param {number} objPrioLevel   优先级
 */
function editPriority(data) {
    var id = data.id;
    var objPrioLevel = data.objPrioLevel;
    var tNow = Math.floor(Math.random()*10000);
    var url = `${BASE_URL}/atds/common/dumpAreas/ext/${id}/${objPrioLevel}/${tNow}`;
    return ajax(url,{});
}

/**
 * 参数设置
 * @param {string} id       卸点id
 * @param {object} data
 */
function editDumpParameter(id,data) {
    var url = `${BASE_URL}/atds/common/dumpAreas/ext/${id}/baseParame`;
    return ajax(url, data, "put");
}

/**
 * 编辑卸点能力
 * @param {string} id       卸点id
 * @param {object} data
 */
function editDumpCapacity(id,data) {
    var url = `${BASE_URL}/atds/common/dumpAreas/ext/${id}/unldgCpcty`;
    return ajax(url, data, "put");
}
export default{
    // getUnloadingList,
    getDumpDetail,
    addDump,
    editDump,
    deleteDump,
    relateDevice,
    lockMaterial,
    getDeviceTypes,
    unRelatedDevices,
    getPriority,
    editPriority,
    editDumpParameter,
    editDumpCapacity,
    getDumpList
}