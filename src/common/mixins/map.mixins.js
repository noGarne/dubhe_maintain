import mapServer from '../../api/map.server';
import obstacleMapMixins from './obstacleMap.mixins';

import {LMap, LTileLayer, LControl, LControlScale, LPolyline, LPolygon, LLayerGroup, LMarker, LGeoJson ,LTooltip ,LPopup,LImageOverlay,LIcon} from 'vue2-leaflet';
import { polygon,centroid } from '@turf/turf';

import 'leaflet/dist/leaflet.css';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});



// 卡车设备
import truck from '../images/truck.svg';
import truck2 from '../images/truck2.svg';
import truck3 from '../images/truck3.svg';

// 卡车超速
import overspeed from '../images/overspeed.svg';
import overspeed2 from '../images/overspeed2.svg';

// 采装设备
import digger from '../images/shovel.svg';
import digger2 from '../images/shovel2.svg';

// 基础设备
// import jichu1 from '../images/jichu1.png';
// import jichu2 from '../images/jichu2.png';

// 地面设备
// import dimian1 from '../images/dimian1.png';
// import dimian2 from '../images/dimian2.png';

// 卸点设备
import xiedian1 from '../images/posuizhan.svg';
import xiedian2 from '../images/posuizhan2.svg';

// 推土机
import tui from '../images/tui.svg';
import tui2 from '../images/tui2.svg';

// rsu
import rsu from '../images/rsu.svg';
import rsu2 from '../images/rsu2.svg';

// 其他设备
import other from '../images/other.svg';
import other2 from '../images/other2.svg';

// 矿满载
import kuangwu from '../images/kuang.svg';
// 驾驶模式
import rengong from '../images/rengong.svg';
import yaokong from '../images/yaokong.svg';
import daijieguan from '../images/daijieguan.svg';

import workingServer from '../../pages/common/js/working.server';

export default {
  mixins: [obstacleMapMixins],
  components: {
    LMap,
    LTileLayer,
    LControl,
    LControlScale,
    LMarker,
    LPolyline,
    LLayerGroup,
    LGeoJson,
    LPolygon,
    LTooltip,
    LPopup,
    LImageOverlay,
    LIcon
  },
  data () {
    return {
      districtLayer:null,
      districtLayer2:null,
      districtLayerLine:null,
      isshow:true,
      isWmsLayer:false,
      currentWmsType:null,
      spaceIconShow:false,
	  yieldMessShow:false,
      mapSiteList:[],//停车场，排土场，装载区地图元素
      mapSiteCenterList:[],
      // 道路
      roadShow:false,
      lineShow:false,
      laneShow:[],
      iconOther:{
        kuangwu:kuangwu,
        rengong:rengong,
        yaokong:yaokong,
        daijieguan:daijieguan
      }
    }
  },
  computed:{
    iconImg(){
      return function(item,full,isOverSpeed=false){
        // console.log(this.markerList);
        var icon = "";
        var icon2 = ""

        var type = item.showTypeSn;
        var subType = item.subShowTypeSn;

        if(type==this.vars.showTypeList[0].id){//矿卡设备
          if(full!=3){//卡车空载/超车
            icon = isOverSpeed ? overspeed : truck;
          }else{//卡车满载/超车
            icon = isOverSpeed ? overspeed2 : truck3;
          }
          icon2 = truck2;
        }else if(type==this.vars.showTypeList[1].id){//挖掘设备
          icon = digger;
          icon2 = digger2;
        }else if(type==this.vars.showTypeList[2].id){//卸点设备
          icon = xiedian1;
          icon2 = xiedian2;
        }else if(subType==this.vars.showTypeList[3].subType[0].id){//推土机/辅助设备
          icon = tui;
          icon2 = tui2;
        }else if(subType==this.vars.showTypeList[4].subType[0].id){//rsu路测单元
          icon = rsu;
          icon2 = rsu2;
        }else{
          icon = other;
          icon2 = other2;
        }
        return {
          iconImg:icon,
          iconImg2:icon2,
        };
      }
    },
    drivingModeIcon(){
      return function(type,drive,attr,takeoverStatus){
        var active = attr?attr.active:"false";
        var show = false;
        var icon = '';
        if((type==this.vars.showTypeList[0].id) && active=='true'){
          if(takeoverStatus=='1'){
            show = true;
            icon = daijieguan;
          }else{
            if(drive==this.vars.drivingMode[0].value){
              show = true;
              icon = rengong;
            }else if(drive==this.vars.drivingMode[2].value){
              show = true;
              icon = yaokong;
            }
          }
        }
        return {
          show:show,
          icon:icon
        }
      }
    },
    direction(){
      return (data,direction)=>{
        // 卡车/采装设备/辅助车辆显示方向
        var rotate=0;
        if(data.showTypeSn==this.vars.showTypeList[0].id||data.showTypeSn==this.vars.showTypeList[1].id 
          || data.showTypeSn==this.vars.showTypeList[3].id){
          rotate=direction;
        }else{
          rotate=0;
        }
        return rotate;
      }
    },
    spaceIcon(){
      return function(type){
        var icon = "";
        if(type==this.vars.baseSite.mapType[0].id){//装载区
          icon="icon-caizhuangquzuoye";
        }else if(type==this.vars.baseSite.mapType[1].id){//卸载区
          icon="icon-paituchangzuoye";
        }else if(type==this.vars.baseSite.mapType[2].id){//停车区域
          icon="icon-tingchechangzuoye";
        }
        return icon;
      }
    }

  },
  mounted(){
    this.$nextTick(() => {
      this.wmsLayer2();
      // 大屏地图特殊处理
      if(this.$route.name == 'ScreenMap' || this.$route.name == 'Login')return;
      this.getObstacleWms();//障碍物边界
    })
  },
  watch:{
    laneShow: {
      handler(newVal, oldVal) {
		  console.log(newVal, oldVal)
        if(newVal.length==0){
          this.wmsLayer2();
          this.getObstacleMap();//障碍物边界
          return false;
        }
        if(newVal.length==2){
          this.wmsLayer2(1);
          this.getObstacleMap();//障碍物边界
          return false;
        }
        
        if(newVal.length==1&&newVal.indexOf('lane')>-1){
          this.wmsLayer2(2);
          this.getObstacleMap();//障碍物边界
          return false;
        }
        if(newVal.length==1&&newVal.indexOf('road')>-1){
          this.wmsLayer2(3);
          this.getObstacleMap();//障碍物边界
          return false;
        }

      },
      deep: true
    },
    roadShow(v){
      if(v){
        this.laneShow = [...new Set([...this.laneShow, ...['road']])];
      }else{
        this.laneShow.splice(this.laneShow.indexOf('road'),1);
      }
    },
    lineShow(v){
		
      if(v){
        this.laneShow = [...new Set([...this.laneShow, ...['lane']])];
      }else{
        this.laneShow.splice(this.laneShow.indexOf('lane'),1);
      }
    },
  },
  methods: {
    setIsWmsLayer(v){
      this.isWmsLayer=v;
    },
    setRoadShow(v){
      this.roadShow=v;
    },
    setLineShow(v){
      this.lineShow=v;
    },
    setSpaceIconShow(v){
      this.spaceIconShow=v;
    },
	setyieldMessShow(v){	
	  this.yieldMessShow=v;
	  for(let x in this.devicesJson){
		  this.devicesJson[x].yieldMessFlag = v;
	  }
	},
    async getSpaceMapList(){
      var geoPolygon = 'thingsboard:RoadElement';
      var cql_filter = "eletype = 2 or eletype = 3 or eletype = 4"
      var data={
        service:'WFS',
        version:'1.0.0',
        request:'GetFeature',
        typeName:geoPolygon,
        outputFormat:'application/json',
        // propertyName:'SecondType,elementid,elename,eletype,siteid',
        cql_filter:cql_filter
      }
      var json = await workingServer.getUploadJson(data);
      var features = json.features;
      // console.log(features);
      this.mapSiteList=features;
      
      this.getCenterList(features)
    },
    getCenterList(mapSiteList){
      var list = [];
      var map = this.$refs.map?this.$refs.map.mapObject:null;
      if(!map)return [];
      mapSiteList.forEach(element => {
        var properties = element.properties;
        var type = properties.eletype;
        var name = properties.elename;
        var elementid = properties.elementid;

        var latLng = (element.geometry.coordinates[0][0]||[]).map(e=>{
          return [e[1],e[0]];
        })

        var polygonL = polygon([latLng]); 
        var centroidL = centroid(polygonL);

        var latlngCenter = centroidL.geometry.coordinates;

        list.push({
          type,
          name,
          id:elementid,
          latLng:latlngCenter
        })

      });
      this.mapSiteCenterList = list;
	  console.log(list)

    },
    districtLayerToggle(e){//是否显示图层
      e.stopPropagation();
      if(this.isWmsLayer){
        this.clearLayer(1)
        this.isWmsLayer = false;
      }else{
        this.isWmsLayer = true;

        this.showGeoLayer();
      }
    },
    showGeoLayer(){
      // 显示卫星图
      this.clearLayer('line')
      this.wmsLayer();
      this.wmsLayer2(this.currentWmsType);
      this.getObstacleMap();//障碍物边界
    },
    clearLayer(type){
      if(type==1&&this.districtLayer){
        this.districtLayer.remove();
        this.districtLayer=null;
      }
      if(type=='line'&&this.districtLayerLine){
        this.districtLayerLine.remove();
        this.districtLayerLine=null;
      }
      if(type=='truck'&&this.districtLayerActive){
        this.districtLayerActive.remove();
        this.districtLayerActive=null;
      }
    },
    clearAll(){
      this.currentWmsType=null;
    },

    LayerToggle(){//图片背景切换
      this.isshow = !this.isshow;
    },
    wmsLayer2(type){//获取wms图层线路图
      this.clearLayer('line');

      this.map = this.$refs.map?this.$refs.map.mapObject:null;
      if(!this.map)return;
      // 接口
      var layerUrl = mapServer.wmsTileLayerLine();
      // 图层组参数
      var geoLayerGroup = mapServer.geoLayerGroup();
      this.currentWmsType = type;
      var layers = geoLayerGroup.geoGroup;
      if(type==1){
        // 车道道路都显示标注
        layers = geoLayerGroup.geoLabelGroup;
      }else if(type==2){
        // 车道显示标注
        layers = geoLayerGroup.geoLaneGroup;
      }else if(type==3){
        // 道路都显示标注
        layers = geoLayerGroup.geoRoadGroup;
      }else{
        // 车道道路都不显示标注
        layers = geoLayerGroup.geoGroup;
      }
      var maxZoom = 22;
      var minZoom = 1;
      var format = 'image/png';

      this.districtLayerLine = L.tileLayer.wms(layerUrl, {
        format: format,
        version: '1.1.1',  
        transparent:true,
        maxZoom: maxZoom,
        minZoom: minZoom,
        layers: layers,
        exceptions: 'application/vnd.ogc.se_inimage'
      }).addTo(this.map);
    },
    clearDe(e){
      e.stopPropagation();
    },
  }
};