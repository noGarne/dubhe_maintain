/**
 *  物料类别接口 
 */

import ajax from './ajax.js'
import config from './config.js'

const BASE_URL = config.BASE_URL;


/**
 * 获取物料列表-分页
 * @param {number} pageSize      当前页码显示条数
 * @param {number} pageIndex     当前页码
 */
function getMaterialList(data) {
    var url = BASE_URL + "/atds/materials";
    return ajax(url,data);
}

/**
 * 获取物料类别列表
 */
function getMaterialCategoryList() {
    var url = BASE_URL + "/atds/materials/list";
    return ajax(url);
}

/**
 * 获取物料类别详细
 * @param {number} sn    物料sn
 */
function getMaterialCategoryDetail(sn) {
    var url = BASE_URL + '/atds/materials/'+sn;
    return ajax(url);
}

/**
 * 添加物料类别
 * @param {string} materialName     物料名称
 * @param {number} materialSn       物料编码sn
 * @param {string} materialType     物料类型
 */
function addMaterialCategory(data) {
    var url = BASE_URL + "/atds/materials";
    return ajax(url, data, "post");
}

/**
 * 编辑物料类别
 * @param {string} id               物料id
 * @param {string} materialName     物料名称
 * @param {string} materialType     物料类型
 */
function editMaterialCategory(id,data) {
    var url = BASE_URL + "/atds/materials/"+id;
    return ajax(url, data, "put");
}

/**
 * 删除物料类别
 * @param {string} id               物料id
 */
function deleteMaterialCategory(id) {
    var url = BASE_URL + "/common/materials/" + id;
    return ajax(url, {}, "delete");
}

/**
 * 查询(采装设备/卸点)锁定物料
 * @param {string} dispatchingObjectType    类型  DUMP_AREA卸点 / DIGGER采装设备
 * @param {string} dispatchingObjectId      id
 */
function getMaterialLockedList(dispatchingObjectType,dispatchingObjectId){
    var url=`${BASE_URL}/dispatching/materialBinding/${dispatchingObjectType}/${dispatchingObjectId}`;
    return ajax(url);
}

/**
 * 添加/修改锁定的物料
 * @param {string} dispatchingObjectType    类型
 * @param {string} dispatchingObjectId      id
 * @param {object} data                     包含以下参数
 * @param {number} materialCode             物料编号
 */
function setMaterialLocked(dispatchingObjectType,dispatchingObjectId,data){
    var url=`${BASE_URL}/dispatching/materialBinding/${dispatchingObjectType}/${dispatchingObjectId}`;
    return ajax(url,data,'post');
}

/**
 * 设置当前物料
 * @param {string} elmtId           设备id
 * @param {string} curntMtrlId      当前物料id
 * @param {string} elmtType         类型
 */
function setCurrentMaterial(data){
    var elmtId=data.deviceId;
    var curntMtrlId=data.materialId;
    var elmtType=data.deviceType;
    var url=`${BASE_URL}/common/curntmtrl/${elmtId}/${curntMtrlId}/${elmtType}`;
    return ajax(url,{},"put")
}

/**
 * 获取物料类别详细
 * @param {String} materialCode    多个物料sn
 */
function getMaterialDetails(materialCode) {
    var url = `${BASE_URL}/atds/materials/codes/${materialCode}`;
    return ajax(url);
}

export default {
    getMaterialList,
    getMaterialCategoryList,
    getMaterialCategoryDetail,
    addMaterialCategory,
    editMaterialCategory,
    deleteMaterialCategory,
    getMaterialLockedList,
    setMaterialLocked,
    setCurrentMaterial,
    getMaterialDetails
}
