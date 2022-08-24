<template>
  <div class="load-container">
    <div class="map-info" v-if="uploadDetails && activeType==2">
      <div class="map-li">
        <div class="map-title">
          <div class="status-cart" v-if="uploadDetails.workStatus==vars.workingStatusList[1].type || uploadDetails.workStatus==vars.workingStatusList[2].type">

            <span>
              <b :class="{green:unloadMaterial==vars.workingStatusList[2].type}">允许卸料 </b>
                <el-switch
                  v-model="unloadMaterial"
                  active-color="#ff4949"
                  inactive-color="#13ce66"
                  :active-value="materialUnloadStatus[1].id"
                  :inactive-value="materialUnloadStatus[0].id"
                  @change="unloadMaterialChange"
                  >
                </el-switch>
                <b :class="{red:unloadMaterial==vars.workingStatusList[1].type}"> 禁止卸料</b>
            </span>
            
          </div>

          <el-button v-if="uploadDetails.workStatus==vars.workingStatusList[4].type" key="stoping" class="btnBg" disabled>正在停用</el-button>
        </div>
      </div>
    </div>
    <div class="map-info" v-if="uploadDetails && activeType==3">
      <div class="map-li">
        <div class="map-title">
          <div class="status-cart">
            <span>
              <el-switch
                v-model="stopStateSpaces"
                active-color="#FF3131"
                inactive-color="#8E96AC"
                :active-value="vars.workingStatusList[3].type"
                :inactive-value="vars.workingStatusList[2].type"
                @change="stopStateSpacesChange">
              </el-switch>
              是否禁用

              <!-- <el-checkbox 
                v-model="stopStateSpaces"
                :true-label="vars.workingStatusList[3].type"
                :false-label="vars.workingStatusList[2].type"
                @change="stopStateSpacesChange">
              </el-checkbox> -->
              &nbsp;&nbsp;
            </span>
            <span>
              <b :class="{green:berthStateSpaces}">允许停靠 &nbsp;</b>
              <el-switch
                v-model="berthStateSpaces"
                active-color="#ff4949"
                inactive-color="#13ce66"
                :active-value="false"
                :inactive-value="true"
                @change="berthStateSpacesChange">
              </el-switch>
              <b :class="{red:!berthStateSpaces}"> &nbsp;禁止停靠</b>
            </span>
            <!-- <span v-if="uploadDetails.workStatus!=vars.workingStatusList[3].type">
              <b :class="{green:stopStateSpaces==vars.workingStatusList[2].type}">允许停靠 </b>
              <el-switch
                v-model="stopStateSpaces"
                active-color="#ff4949"
                inactive-color="#13ce66"
                :active-value="vars.workingStatusList[1].type"
                :inactive-value="vars.workingStatusList[2].type"
                @change="stopStateSpacesChange">
              </el-switch>
              <b :class="{red:stopStateSpaces==vars.workingStatusList[1].type}"> 禁止停靠</b>
            </span> -->
          </div>
        </div>
      </div>
    </div>
    <!-- 搜索回到原点 -->
    <base-map-control-bar
      :zoom="zoom"
      :maxZoom="maxZoom"
      :minZoom="minZoom"
      @getBounds="getBounds"
      @setZoom="setZoom"  
    >
    </base-map-control-bar>

    <l-map class="map" ref="map" :zoom="zoom" :center="center" :options="options" :bounds="bounds">
      <!-- 卸载边界 -->
      <l-polygon
        :key="'bounds1'"
        :weight="3"
        :fillOpacity="0.1"
        :fillColor="'#b0e2a8'"
        :lat-lngs="unloadBoundary"
        :color="'#b0e2a8'"
      />

      <!-- 停靠位 -->
      <l-polygon
        v-for="(item,index) in parkSpaces"
        :key="'parkSpace'+index"
        :lat-lngs="item.latlngs"
        :weight="1"
        :dashArray="'6,2'"
        :color="item.color"
        :fill="item.used"
        :fillColor="item.color"
        :fillOpacity="0.2"
      />
      
      <!-- 停车位被使用的卡车 -->
      <l-marker
        ref="markerDot"
        v-if="usedDetails.centerLatlng&&usedDetails.usedDev&&usedDetails.usedDev.equipmentName"
        :lat-lng="usedDetails.centerLatlng">
          <l-icon :icon-anchor="[0, 0]">
            <div :class="sizeClass">
              <div 
                class="map_device_name" :title="usedDetails.usedDev.equipmentName">
                {{usedDetails.usedDev.equipmentName}}
              </div>
            </div>
          </l-icon>
      </l-marker>
    </l-map>
  </div>
</template>

<script>

import mapServer from '../../../api/map.server';
import workingServer from "../../common/js/working.server";

import leafletMixins from '../../../common/mixins/leaflet.mixins';
import obstacleMapMixins from '../../../common/mixins/obstacleMap.mixins';


var geoLayerGroup = mapServer.geoLayerGroup();
import {
  LMap,
  LFeatureGroup,
  LTileLayer,
  LPolyline,
  LPolygon,
  LControl,
  LMarker,
  LIcon,
} from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default {
  name: "CrushingStationMap",
  mixins:[leafletMixins,obstacleMapMixins],
  components: {
    LMap,
    LFeatureGroup,
    LTileLayer,
    LPolyline,
    LPolygon,
    LControl,
    LMarker,
    LIcon
  },
  props:{
    boundayList:{
      type:Array,
      default:()=>{
        return []
      }
    },
    uploadDetails:{
      type:Object,
      default:()=>{
        return {
          status:null
        }
      }
    }
  },
  data() {
    return {
      options: {
        attributionControl: false,
        zoomControl:false,
        editable: true,
        editOptions:{
          skipMiddleMarkers:true
        }
      },

      // 基本信息
      id: "",
      activeType:null,

      // 状态切换监控
      unloadMaterial:8,
      stopStateSpaces:false,
      berthStateSpaces:false,
      
      unloadBoundary:[],
      // 地图底图路线
      districtLayerLine:null,
      isFirst:0,
      
      parkSpaceList:{},//存的停靠位的经纬度

      parkSpaces:null,//停靠位经纬度状态颜色

      cancelList:[],//订阅列表
      materialUnloadStatus:[
        {
          id:8,
          name:"允许卸料"
        },
        {
          id:9,
          name:"禁止卸料"
        },
      ]
    };
  },
  watch: {
    $route(to, from) {
      this.id = to.params.id;
      this.activeType = to.query.activeType;

      if(!this.activeType){
        this.clearParkList();
        return
      };

      var oldAreaSn = from.query.areaSn;
      var newAreaSn = to.query.areaSn;
      
      // this.unloadMaterial = this.materialUnloadStatus[0].id;
      
      if(this.activeType && oldAreaSn!=newAreaSn){

        this.clearParkList();
        // this.getParkLayer('parkGrps',this.boundayList);
        this.getParkLayer('parkSpaces',this.boundayList);
      }
      if(Object.keys(this.parkSpaceList).length == 0 && oldAreaSn==newAreaSn){
        // this.getParkLayer('parkGrps',this.boundayList);
        this.getParkLayer('parkSpaces',this.boundayList);
      }
      
      this.getUpload();//获取卸载区边界

    },
    boundayList:{
      handler(v){
        // this.removePark();
        var isEmpty=true;
        for(let i=0;i<v.length;i++){
          var parkGrps=v[i].parkGrps||[];
          if(parkGrps.length>0){
            isEmpty=false;
            if(this.isFirst<2)this.isFirst++;
            break;
          }
        }
       
        if(this.isFirst==1){
          this.wmsLayer();
          this.getObstacleMap();//障碍物边界
        }
        
        // this.getParkLayer('parkGrps',v);
        this.getParkLayer('parkSpaces',v);
      },
      deep:true
    },
    
    uploadDetails(v){
      var activeType = this.$route.query.activeType; 
      
      if(activeType==2){
        this.unloadMaterial = v.stopUnload?this.materialUnloadStatus[1].id:this.materialUnloadStatus[0].id;
      }
      if(activeType==3){
        this.stopStateSpaces = v.workStatus;
        this.berthStateSpaces = v.allowParking;
      }
    },
  },
  computed:{
    // 被使用的卡车
    usedDetails(){
      var activeType = this.$route.query.activeType;
      if(activeType!=3)return {};//选中为停车位

      var uploadDetails = this.uploadDetails;
      if(uploadDetails && uploadDetails.used){
        var parkSpaces = this.parkSpaces;
        if(!uploadDetails||!parkSpaces||Object.keys(parkSpaces).length == 0)return {};

        var id = uploadDetails.id;

        var latlng = parkSpaces[id].latlngs;
        var center = this.getCenter(latlng);
        return Object.assign({centerLatlng:center},parkSpaces[id]);
      }else{
        return {};
      }
    }
  },
  created() {
    this.id = this.$route.params.id;
    this.activeType = this.$route.query.activeType; 
    
    if(this.id != -1){//
      this.getUpload();//获取卸载区边界
    }else{
      this.getBounds();
    }
  },
  mounted(){
    this.$nextTick(() => {
      this.map = this.$refs.map?this.$refs.map.mapObject:null;
      if(!this.map)return;
      if(this.isFirst==0){
        this.wmsLayer(1);
        this.getObstacleMap();//障碍物边界
      }
      
      // this.getParkLayer('parkGrps',this.boundayList);
      this.getParkLayer('parkSpaces',this.boundayList);
    })
  },
  methods: {
    clearParkList(){
      this.parkSpaceList={};//存的停靠位的经纬度

      this.parkSpaces=null;

      this.unloadBoundary=[];
    },
    // 加载停靠区/停靠位
    async getParkLayer(type,list){

      if(type=="parkSpaces"){//设置停靠位
        
        if(Object.keys(this.parkSpaceList).length == 0){
          // 停靠位过滤
          var cql_filter_array = [];
          // 地图元素
          for(let i=0;i<list.length;i++){
            var areaSn = this.$route.query.areaSn;
            var parkGrps = list[i].parkGrps;
            if(list[i].areaSn==areaSn){
              // 停靠区
              list[i].parkGrps.forEach((e)=>{
                // 停靠位
                e.parkSpaces.forEach((v)=>{
                  cql_filter_array.push("id='"+v.id+"'")
                })
              })
            }
          }
          if(cql_filter_array.length==0)return
          var cql_filter = cql_filter_array.join(' OR ');

          // 开始获取停靠位对象
          var geoPolygon = geoLayerGroup.geoParkSpacesPolygon;
          // 获取停靠位
          var json = await this.getMapJson(geoPolygon,cql_filter);
          // console.log(json);
          //开始存停靠位经纬度
          var listfeatures = json.features || [];
          listfeatures.forEach((feature)=>{
            var properties = feature.properties;

            var latlngs = [];
            var geometry = feature.geometry;
            var coordinates=[];
            if(geometry)coordinates = geometry.coordinates[0]||[];
            var latlngs = [];
            if(coordinates){
              latlngs = (coordinates[0]||[]).map(v=>{
                return [v[1],v[0]];
              });
            }
            this.parkSpaceList[properties.id]=latlngs;
          })
        }
        // 开始设置经纬度、状态显示
        var parkSpaceList = this.parkSpaceList;
        for(let id in parkSpaceList){
          uploading:for(let i=0;i<list.length;i++){
            var parkGrps = list[i].parkGrps;
            // 循环停靠区
            for(let j = 0;j<parkGrps.length;j++){
              var parkSpaces = parkGrps[j].parkSpaces;
              // 循环停靠位
              for(let k = 0;k<parkSpaces.length;k++){

                // 找到相同的
                if(parkSpaces[k].id==id){
                  var color = this.utils.getObjValByKey(this.vars.workingStatusList,parkSpaces[k].workStatusValue,'code','color');
                  
                  var d ={
                    color:color,
                    latlngs:parkSpaceList[id]
                  }
                  var area = Object.assign({},d,parkSpaces[k]);
                  if(!this.parkSpaces){
                    var obj={};
                    obj[id]=area;
                    this.parkSpaces=obj;
                  }else{
                    this.parkSpaces[id]=area;
                  }
                  break uploading;
                }
              }
            }
          }
        }
      }
    },
    async getMapJson(name,cql_filter){
      var data={
        service:'WFS',
        version:'1.0.0',
        request:'GetFeature',
        typeName:name,
        outputFormat:'application/json',
        cql_filter:cql_filter,
        // propertyName:propertyName
      }
      var json = await workingServer.getUploadJson(data);
      return json;
    },
    // 获取选中详情
    async getUpload(){//加载卸载区边界
      var query = this.$route.query;

      if(!query.hasOwnProperty('areaSn')){//如果没有区域sn，加载全局图形边界
        this.getBounds();
        return;
      }

      var elementSn = query.areaSn;
      var areaTypeSn = query.hasOwnProperty('areaTypeSn')?query.areaTypeSn:3;
      
      var cql_filter='eletype='+areaTypeSn+' AND elementid='+elementSn;
      
      try{
        var json = await this.getMapJson(geoLayerGroup.geoPolygon,cql_filter);

        var lnglat = json.features.length>0?json.features[0].geometry.coordinates[0][0]:[];
        if(lnglat.length>0){
          this.$nextTick(()=>{
            var lat = lnglat.map((o) => [o[1],o[0]]);
            const bounds = L.latLngBounds(lat);
            this.unloadBoundary = lat;
            this.map.fitBounds(bounds);
          });
        }

      }catch(e){
        console.error(e);
      }
    },
    // 状态变化
    unloadMaterialChange(v){
      this.setUnloadMaterial(v);
    },
    
    async setUnloadMaterial(status){//设置状态
      try{
        if(!this.uploadDetails.bindDevice)return;
        var deviceId = this.uploadDetails.bindDevice.id.id;

        var result = await workingServer.setUnloadMaterial(deviceId,status);
       
        if(result.success){
          this.messages.success(result.message);
          this.$emit('updateList',status);
        }else{
          this.messages.error(result.message);
        }
        
      }catch(e){
        this.messages.error(e.message);
        console.error(e);
      }
    },

    stopStateSpacesChange(v){
      this.setStatus(v,'spaces');
    },
    // 允许停靠
    berthStateSpacesChange(v){
      this.setBerthState(v,'spaces');
    },
    async setStatus(status,type){//设置状态
      try{
        var formData = new FormData();
        formData.append("siteId", this.uploadDetails.siteId);
        formData.append("grpSn", this.uploadDetails.grpSn);
        if(type=='spaces')formData.append("spcSn", this.uploadDetails.spcSn);

        var result = await workingServer.setParkStatus(type,status.toLowerCase(),formData);
        
        if(result.success){
          this.$emit('updateList',status);
        }
        this.messages.success(result.message);
      }catch(e){
        this.messages.error(e.message);
        console.error(e);
      }
    },
    async setBerthState(status){//允许停靠
      try{
        let info = {
          spcSn:this.uploadDetails.spcSn,
          grpSn:this.uploadDetails.grpSn,
          siteId:this.uploadDetails.siteId
        };
        var result = await workingServer.setSpaceState(status,info);
        
        if(result.success){
          this.$emit('updateList',status);
        }
        this.messages.success(result.message);
      }catch(e){
        this.messages.error(e.message);
        console.error(e);
      }
    },
    wmsLayer(first){//获取wms图层线路图
      this.clearLayer();
      
      // 图层url
      var layerUrl = mapServer.wmsTileLayerLine();
      
      var layers = "thingsboard:ts_park_group";
      if(first==1){
        layers="thingsboard:ts_group_polygon";
      }

      // var layers = geoLayerGroup.geoParkGroup;
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
        exceptions: 'application/vnd.ogc.se_inimage',
        MathRandom:Math.ceil(Math.random()*10000)
      }).addTo(this.map);
    },
    
    // 清除地图图层
    clearLayer(){
      if(this.districtLayerLine){
        this.districtLayerLine.remove();
        this.districtLayerLine=null;
      }
    },
  },
  beforeDestroy(){
    
  }
};
</script>

<style lang="scss" scoped>

</style>
<style lang="scss">
@import "../../common/css/working.scss";
</style>