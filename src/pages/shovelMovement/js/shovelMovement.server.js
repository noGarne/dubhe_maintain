/**
 * 装载区作业管理
 */

import ajax from '../../../api/ajax';
import config from '../../../api/config';

const BASE_URL = config.BASE_URL;


/**
 * 路径字符串数据转化为数组
 * @param {string} info
 */
function getPolygonData(info) {
  if (info) {
    let infoNew = info.replace("POLYGON((", "").replace("))", "");
    if (infoNew.endsWith(';')) {
      infoNew = infoNew.substring(0,infoNew.length - 1);
    }
    let arr = infoNew.split(";");
    let arrNew = arr.map(v => {
      let array = v.split(",");
      return [array[1], array[0]];
    });
    return arrNew;
  } else {
    return [];
  }
}
function getPolygonArray(info) {
  if (info) {
    let infoNew = info;
    if (infoNew.endsWith(';')) {
      infoNew = infoNew.substring(0,infoNew.length - 1);
    }
    let arr = infoNew.split(";");
    let arrNew = arr.map(v => {
      let array = v.split(",");
      return {lat:parseFloat(array[1]), lng:parseFloat(array[0])};
    });
    return [arrNew];
  } else {
    return [];
  }
}

/**
 * 路径数组转换成字符串
 * @param {array} info 
 */
function getPolygonString(info){
  let str = '';
  let arr = [];
  for (let index = 0; index < info.length; index++) {
    let item = info[index];
    arr.push([item.lng,item.lat])
  }
  arr.flat();
  str = arr.join(';')
  return str;
}

/**
 * 查询装载区边界列表
 * @param {string} roadElementType roadElementType，非必填，2-装载区，3-卸载区
 * @param {number} pageSize 每页条数，必填
 * @param {number} pageIndex 页开始位置，必填
 */
function getBoundaryList(data) {
  let url = `${BASE_URL}/atds/hdmap/boundry/roadelement/page`;
  return ajax(url,data);
}

/**
 * 获取采掘区详情
 * @param {string} id digAreaId
 */
function getBoundaryDetail(id) {
  let url = `${BASE_URL}/atds/movement/digArea/${id}`;
  return ajax(url);
}

/**
 * 上传爆破文件
 * @param {object} data formData数据
 * @param {function} uploadEvent 正在上传事件
 * @param {function} cancelEvent 取消上传事件
 */
function uploadPath(data,uploadEvent,cancelEvent) {
  let url = `${BASE_URL}/atds/movement/digArea/upload`;
  return ajax(url,data,'file',uploadEvent,cancelEvent);
}

/**
 * 保存采装设备移动规格的路径
 * @param {string} id 采掘区id
 * @param {json} data 采装设备移动规格的路径详细信息
 */
function savePath(id,data) {
  let url = `${BASE_URL}/atds/movement/digArea/save/${id}`;
  return ajax(url,data,'post');
}

/**
 * 发布采装设备移动规格的路径
 * @param {string} id digAreaId
 */
function publishPath(id) {
  let url = `${BASE_URL}/atds/movement/digArea/publish/${id}`;
  return ajax(url,{},'post');
}


/**d
 * 获取采掘区列表
 * @param {number} subareaSn 分区sn
 */
function getDiggingArea(data) {
  let url = `${BASE_URL}/atds/movement/digArea/list`;
  return ajax(url,data);
}

/**
 * 添加采掘区
 * @param {string} name 采掘区名称
 * @param {number} subareaSn 分区sn
 */
function editDiggingArea(data) {
  let url = `${BASE_URL}/atds/movement/digArea`;
  return ajax(url,data,'post');
}

/**
 * 删除采掘区
 * @param {string} name 采掘区名称
 */
function deleteDiggingArea(id) {
  let url = `${BASE_URL}/atds/movement/digArea/${id}`;
  return ajax(url,{},'delete');
}


/**
 * 获取采装设备列表
 * @param {number} subareaSn 分区sn
 * @param {number} hasDigParam 是否显示参数
 */
function getShovelList(data) {
  let url = `${BASE_URL}/atds/movement/shovel/list`;
  return ajax(url,data);
}

/**
 * 设置采装设备参数
 * @param {string} shovelSn 采掘区名称
 * @param {number} digRadius 清场半径
 * @param {number} percentage 百分比
 * 
 */
function digParam(data) {
  let url = `${BASE_URL}/atds/movement/shovel/digParam`;
  return ajax(url,data,'put');
}
/**
 * 规则设置
 * @param {string} drawBoundary
 * @param {string} shovelSn         绑定采装设备
 * @param {string} digWay           规则形状
 * @param {string} digWayDesc       形状描述
 * @param {string} startLatitude
 * @param {string} startLongitude
 * @param {string} startDirection
 * 
 */
function ruleSet(data) {
  let url = `${BASE_URL}/atds/movement/digArea/save/${data.id}`;
  return ajax(url,data,'post');
}



export default {
  getPolygonData,
  getPolygonArray,
  getPolygonString,
  getBoundaryList,
  getBoundaryDetail,
  uploadPath,
  savePath,
  publishPath,
  editDiggingArea,
  getDiggingArea,
  deleteDiggingArea,
  getShovelList,
  digParam,
  ruleSet
}