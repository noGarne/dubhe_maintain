import ajax from "./ajax";
import config from "./config"
var BASE_URL = config.BASE_URL;
var GEOSERVER_URL = config.GEOSERVER_URL;

// 获取车道列表
function laneList(id){
    var data={
        tenantId:id
    }
    return ajax(BASE_URL+'/lane/lanes', data);
}

// 创建车道
function appendlane(res){
    var id=res.id ? res.id: '';
    var name=res.name ? res.name: '';
    var limit=res.limit ? res.limit: '';
    var gpsInfo=res.gpsInfo ? res.gpsInfo:null;
    var direction=res.direction ? res.direction:"forward";
    var tenantId=res.tenantId ? res.tenantId:"";
    var data={
        name:name,
        direction:direction,
        tenantId:tenantId
    }
    if(limit){
        data['limit']=parseFloat(limit);
    }
    if(gpsInfo){
        data['gpsInfo']=gpsInfo;
    }
    if(id){
        data['id']=id;
    }
    
    return ajax(BASE_URL+'/lane', data, "post");
}
// 查询相邻车道
function getConnectedLanes(res){
    var data = {
        startPoint:res.startPoint,
        endPoint:res.endPoint
    }
    return ajax(BASE_URL+"/lane/getConnectedLanes", data, "post")
}

// 查询车道详情
function getLanesdetail(laneId){
    var url= BASE_URL + "/lane/" + laneId
    return ajax(url);
}

// 删除车道
function deletelane(laneId){
    var url= BASE_URL+"/lane/" + laneId
    return ajax(url, {}, "delete");
}

// 获取工作面列表
function areaList(res){
    var data={
        type:res.type,
        tenantId:res.id
    }
    return ajax(BASE_URL+'/workArea/list', data);
}


// 创建工作面
function appenderea(res){
    var inIds=res.inIds?res.inIds:null;
    var outIds=res.outIds?res.outIds:null;
    var data={
        code:res.code,
        name:res.name,
        type:res.type,
        gpsInfo:res.gpsInfo,
        latitude:res.latitude,
        longitude:res.longitude,
        tenantId:res.tenantId,
        outIds:outIds,
        inIds:inIds,
        altitude:res.altitude?res.altitude:null
    }
    if(res.id){
        data['id']=res.id;
    }
    return ajax(BASE_URL+'/workArea', data, "post");
}

// 删除工作面
function deleteArea(workAreaId){
    var url= BASE_URL+"/workArea/" + workAreaId
    return ajax(url, {}, "delete");
}

// 查看工作面详情
function getAreaDetail(workAreaId){
    var url = BASE_URL+"/workArea/" + workAreaId
    return ajax(url);
}

// 矿区地图发布
function mapPublish(id){
    var data={
        tenantId:id
    }
    return ajax(BASE_URL+"/map/publish",data,"post");
}

// 从数据库获取地图边界
function getBounds(){
    return ajax(BASE_URL+"/tenant/getBoundary");
    
}

// 从GeoServer获取图层边界
function getMapBounds(layerName){
    let url = `${GEOSERVER_URL}/thingsboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${layerName}&maxFeatures=100000&outputFormat=application%2Fjson`;
    return ajax(url);
}

// 矿区地图查看
function getMapPublish(data){
  var url = GEOSERVER_URL+"/thingsboard/ows"
  var data={
    service:'WFS',
    version:'1.0.0',
    request:'GetFeature',
    typeName:data.typeName,
    outputFormat:'application%2Fjson',
    viewparams:'tenantId:'+data.tenantId
  }
    return ajax(url,data);
}

function wmsTileLayer(){
    // return "http://120.79.188.243:9999/geoserver/wms?"
    return GEOSERVER_URL + "/wms?"
}


function wmsTileLayerLine(){
    return GEOSERVER_URL + "/thingsboard/wms?"
}

/**
 * 查询geoserver图层json数据
 * @param {*} layerName  图层名称
 * @param {*} args       查询条件
 */
 function getLayersJson(layerName,args={}){
    let url = `${GEOSERVER_URL}/thingsboard/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${layerName}&maxFeatures=1000000&outputFormat=application%2Fjson`;
    if(args.hasOwnProperty('laneids') && args.laneids.length>0){
      // 路段ids
      let query = '&cql_filter=';
      args.laneids.forEach((v,i) => {
        query += i==0 ? 'laneid='+v : ' or laneid='+v;
      });
      url += query;
    }
    if(args.hasOwnProperty('propertyName')){
      url += '&propertyName='+args.propertyName;
    }
    return ajax(url);
  }
  
  
  /**
   * 查询路段坐标数组数据
   * @param {*} json 
   */
  function getLayersArray(json){
    let arr = [];
    if(json && json.hasOwnProperty('features')){
      arr = json.features.map(feature => {
        return {
          laneid:feature.properties.laneid,
          coordinates:feature.geometry.coordinates,
        }
      });
    }
    return arr;
  }

/**
 * 添加图层
 * @return {string} geo 没有标注的图层组
 * @return {string} tsRoad 道路标注的图层组
 * @return {string} geoLane 车道标注的图层组
 * @return {string} geoLabel 车道道路标注的图层组
 * @return {string} geoStypeActive 车道选中状态的样式
 */
function geoLayerGroup(){
    var json = {
        geoGroup:"thingsboard:ts_group",
        geoRoadGroup:"thingsboard:ts_group_polygon",
        geoLaneGroup:"thingsboard:ts_group_line",
        geoLabelGroup:"thingsboard:ts_group_label",
        geoPolygon:"thingsboard:RoadElement",
        geoLaneElement: "thingsboard:LaneElement",
        geoDumpLineLayer: "thingsboard:DumpLine",
        geoParkGrpsPolygon:"thingsboard:DockGroupPolygon",
        geoParkSpacesPolygon:"thingsboard:DockPointPolygon",
        geoParkSpacesPolyline:"thingsboard:DumpLine",
        geoParkGroup:"thingsboard:ts_park_group",
        geoObstacle:"thingsboard:Obstacle",
        geoObstacleStyle:"ts_obstacle_line",
        geoDumpLine:"thingsboard:ts_dump_line_white",
        satelliteTiles:"thingsboard:tiles",
        geoStyleActive:"ts_polygon_activity",
    }
    return json;
}

function mapClick(url){
    return ajax(url);
}

export default {
    laneList,
    areaList,
    appendlane,
    deletelane,
    getConnectedLanes,
    getLanesdetail,
    appenderea,
    getAreaDetail,
    deleteArea,
    mapPublish,
    getMapPublish,
    getBounds,
    getMapBounds,
    wmsTileLayer,
    wmsTileLayerLine,
    mapClick,
    geoLayerGroup,
    getLayersJson,
    getLayersArray
}
