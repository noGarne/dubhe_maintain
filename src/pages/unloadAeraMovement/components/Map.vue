<template>
  <div class="load-container" :class="{'processing':editDate.processing}">
    <div class="map-info" v-if="uploadDetails && activeType==1">
      <div class="map-li" v-if="editDate">
        <div class="map-title" v-if="alarmDetails">
          <div class="alarm-cart">
            <p>任务信息</p>
            <p class="alarm-content">{{alarmDetails.alarmTime | formatDate}}{{alarmDetails.alarmDetail}}</p>
          </div>
        </div>
        <div class="map-button" v-if="editDate.processing=='update'">
          <el-button class="btnBg" key="load" @click="loadGraph" :disabled="!!newUploading"> 加载</el-button>
          <el-button class="btnBg" key="reset" @click="resetGraph" :disabled="!newUploading"> 重置</el-button>
          <el-button class="btnBg" key="confirm" @click="confirmClick" :disabled="!newUploading"> 更新</el-button>
          <el-button class="btnBg" key="reject" @click="rejectUpdate" :disabled="!newUploading"> 驳回</el-button>

          <el-button class="btnBg" key="exit1" @click="clearEditDate">退出</el-button>
        </div>
        <div class="map-button" v-if="editDate.processing=='obstacle'">
          <el-button class="btnBg" key="load" @click="loadObstacleGraph" :disabled="!!newUploading"> 加载</el-button>
          <el-button class="btnBg" key="reset" @click="resetGraph" :disabled="!newUploading"> 重置</el-button>
          <el-button class="btnBg" key="confirm" @click="confirmObstacleClick" :disabled="!newUploading"> 更新</el-button>
          <el-button class="btnBg" key="reject" @click="rejectObstacleUpdate" :disabled="!newUploading"> 驳回</el-button>

          <el-button class="btnBg" key="exit1" @click="clearEditDate">退出</el-button>
        </div>
      </div>
    </div>
    <div class="map-info" v-if="uploadDetails && activeType==2">
      <div class="map-li">
        <div class="map-title" v-if="!(editDate && editDate.processing=='status')">

          <div class="status-cart">
            <span v-if="uploadDetails.workStatus==vars.workingStatusList[1].type || uploadDetails.workStatus==vars.workingStatusList[2].type">
              <b :class="{green:stopStateGroup==vars.workingStatusList[2].type}">开放 </b>
              <el-switch
                v-model="stopStateGroup"
                active-color="#ff4949"
                inactive-color="#13ce66"
                :active-value="vars.workingStatusList[1].type"
                :inactive-value="vars.workingStatusList[2].type"
                @change="stopStateGroupChange"
                >
              </el-switch>
              <b :class="{red:stopStateGroup==vars.workingStatusList[1].type}"> 关闭</b>
            </span>
            &nbsp;&nbsp;
            <span v-if="uploadDetails.workStatus==vars.workingStatusList[4].type"><b>正在停用</b></span>
            &nbsp;&nbsp;
            <span v-if="uploadDetails.canSetStopUnload">
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
        </div>
        
        <div class="map-title" v-if="editDate && editDate.processing=='status'">
          <div class="alarm-cart">
            <p>任务信息</p>
            <p class="alarm-content">{{alarmDetails.alarmTime | formatDate}}{{alarmDetails.alarmDetail}}</p>
          </div>
        </div>

        <div class="map-button" v-if="editDate && editDate.processing=='status'">
          <el-button :disabled="uploadDetails.workStatus!=vars.workingStatusList[1].type" key="start1" class="btnBg" @click="setStatus(vars.workingStatusList[2].type,'groups')">开放</el-button>
          <el-button class="btnBg" key="ignore" @click="ignoreAlarm">忽略</el-button>
          <el-button class="btnBg" key="exit2" @click="clearEditDate">退出</el-button>
        </div>
      </div>
    </div>
    <div class="map-info" v-if="uploadDetails && activeType==3">
      <div class="map-li">
        <div class="map-title">
          <div class="status-cart" v-if="uploadDetails.workStatus!=vars.workingStatusList[4].type">
            <!--  v-if="uploadDetails.workStatus==vars.workingStatusList[1].type||uploadDetails.workStatus==vars.workingStatusList[3].type" -->
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
              
              <!-- 是否禁用
              <el-checkbox 
                v-model="stopStateSpaces"
                :true-label="vars.workingStatusList[3].type"
                :false-label="vars.workingStatusList[2].type"
                @change="stopStateSpacesChange">
              </el-checkbox> -->
               
            </span>
            &nbsp;&nbsp;
            <span v-if="uploadDetails.workStatus!=vars.workingStatusList[3].type">
              <b :class="{green:stopStateSpaces==vars.workingStatusList[2].type}">开放 </b>
              <el-switch
                v-model="stopStateSpaces"
                active-color="#ff4949"
                inactive-color="#13ce66"
                :active-value="vars.workingStatusList[1].type"
                :inactive-value="vars.workingStatusList[2].type"
                @change="stopStateSpacesChange">
              </el-switch>
              <b :class="{red:stopStateSpaces==vars.workingStatusList[1].type}"> 关闭</b>
            </span>
            
          </div>

          <el-button v-if="uploadDetails.workStatus==vars.workingStatusList[4].type" key="stoping" class="btnBg" disabled>正在停用</el-button>
        </div>
      </div>
    </div>

    <!-- 没有找到对象 -->
    <div class="map-info" v-if="!uploadDetails && editDate && editDate.processing">
      <div class="map-li">
        <div class="map-title">
          <div class="alarm-cart">
            <p class="red">卸载区/停靠区不存在。</p>
            <p class="alarm-content">{{alarmDetails.alarmTime | formatDate}}{{alarmDetails.alarmDetail}}</p>
          </div>
        </div>

        <div class="map-button">
          <el-button class="btnBg" key="ignore" @click="ignoreAlarm(1)">忽略</el-button>
          <el-button class="btnBg" key="exit2" @click="clearEditDate(1)">退出</el-button>
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

    <l-map 
      class="map" 
      ref="map" 
      :zoom="zoom" 
      :center="center" 
      :options="options" 
      :bounds="bounds">

      <!-- 卸载边界 -->
      <l-polygon
        :key="'bounds1'"
        :weight="3"
        :fillOpacity="0.1"
        :fillColor="'#b0e2a8'"
        :lat-lngs="unloadBoundary"
        :color="'#b0e2a8'"
      />

      <!-- 停靠区 -->
      <l-polygon
        v-for="(item,index) in parkAreas"
        :key="'parkArea'+index"
        :weight="1"
        :fill="false"
        :dashArray="'6,2'"
        :lat-lngs="item.latlngs"
        :color="item.color"
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
        :fillOpacity="0.1"/>
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
    <update-progress ref="updateProgress" @updateProgressReturn="updateProgressReturn" @clearEdit="clearEdit"></update-progress>
  </div>
</template>

<script>

import websocket from '../../../api/websocket';

import mapServer from '../../../api/map.server';

import workingServer from "../../common/js/working.server";
import alarmServer from '../../common/js/alarm.server';
import leafletMixins from '../../../common/mixins/leaflet.mixins';
import obstacleMapMixins from '../../../common/mixins/obstacleMap.mixins';

const UpdateProgress=()=>import('../../common/components/UpdateProgress.vue')


var geoLayerGroup = mapServer.geoLayerGroup();
import {
  LMap,
  LFeatureGroup,
  LTileLayer,
  LPolyline,
  LPolygon,
  LControl,
  LMarker,
  LIcon
} from "vue2-leaflet";
import 'leaflet/dist/leaflet.css';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default {
  name: "unloadAeraMap",
  mixins:[leafletMixins,obstacleMapMixins],
  components: {
    LMap,
    LFeatureGroup,
    LTileLayer,
    LPolyline,
    LPolygon,
    LMarker,
    LControl,
    LIcon,
    UpdateProgress
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
      // 地图元素
      options: {
        attributionControl: false,
        zoomControl:false,
        editable: true,
        editOptions:{
          skipMiddleMarkers:true
        }
      },

      // 基本信息
      details:{},
      id: "",
      activeType:null,

      stopStateGroup:false,
      stopStateSpaces:false,

      // 允许卸料状态切换监控
      unloadMaterial:8,

      // alarmDetails:{},
      alarmList:[],
      
      // 图形信息
      mapPath:{
        oldPath: null,
      },
      polylineOld: {
        latlngs: [],
        color: "#0f0"
      },
      unloadBoundary:[],
      // 加载新图形数据;
      newUploading:null,
      // 地图底图路线
      districtLayerLine:null,
      // obstacleLayer:null,// 障碍物边界
      isFirst:0,

      parkGrpList:{},//存的停靠区经纬度
      parkSpaceList:{},//存的停靠位的经纬度

      parkAreas:null,//停靠区经纬度状态颜色
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
      this.newUploadingRemove();

      // this.alarmDetails={};
      if(!this.activeType){
        this.clearParkList();
        return
      };

      var oldAreaSn = from.query.areaSn;
      var newAreaSn = to.query.areaSn;
      // 路由切换的时候
      if(this.activeType && oldAreaSn!=newAreaSn){
        this.clearParkList();
        this.getParkLayer('parkGrps',this.boundayList);
        this.getParkLayer('parkSpaces',this.boundayList);
      }
      // 不存在停车位，并且在同一个区域路由跳转的时候
      if(Object.keys(this.parkSpaceList).length == 0 && oldAreaSn==newAreaSn){
        this.getParkLayer('parkGrps',this.boundayList);
        this.getParkLayer('parkSpaces',this.boundayList);
      }
      
      this.getUpload();//获取卸载区边界
      if(to.query.processing){
        this.getAlarmList();
      }

    },
    boundayList:{//列表变化以后
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
        
        this.getParkLayer('parkGrps',v);
        this.getParkLayer('parkSpaces',v);
      },
      deep:true
    },
    uploadDetails(v){//选中详情变化的时候
      var activeType = this.$route.query.activeType; 
      if(activeType==2){
        this.unloadMaterial = v.stopUnload?this.materialUnloadStatus[1].id:this.materialUnloadStatus[0].id;
      }

      if(this.activeType==2){
        this.stopStateGroup = v.workStatus;
      }else if(activeType==3){
        this.stopStateSpaces = v.workStatus;
      }
    },
  },
  computed:{
    editDate(){//编辑
      var processing = this.$route.query.processing;
      var data = {}
      if(processing){
        var data = {
          processing
        }
      }
      return data;
    },
    alarmDetails(){//当前选中的告警
      var id = this.$route.query.alarmId;
      if(!id)return;

      var infoList = this.alarmList.filter(e=>e.id==id);
      var json = {};

      if(infoList.length>0){
        json = infoList[0];
      };
      return json;
    },
    // 停车位被使用的卡车
    usedDetails(){
      var activeType = this.$route.query.activeType;
      if(activeType!=3)return {};//选中为停车位

      var uploadDetails = this.uploadDetails;
      
      if(uploadDetails && uploadDetails.used){
        var parkSpaces = this.parkSpaces;
        if(!uploadDetails||!parkSpaces||Object.keys(parkSpaces).length == 0)return {};

        var id = uploadDetails.id;
        if(parkSpaces[id]){
          var latlng = parkSpaces[id].latlngs;
          var center = this.getCenter(latlng);
          return Object.assign({centerLatlng:center},parkSpaces[id]);
        }else{
          return {};
        }
        
      }else{
        return {};
      }
    }
  },
  created() {
    this.getwebsocketShapeReload();
    this.id = this.$route.params.id;
    this.activeType = this.$route.query.activeType; 
    
    if(this.id != -1){
      this.getUpload();//获取卸载区边界

      if(this.$route.query.processing){
        this.getAlarmList();
      }
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
      
      this.getParkLayer('parkGrps',this.boundayList);
      this.getParkLayer('parkSpaces',this.boundayList);
    })
  },
  methods: {
    clearParkList(){//清除选中停车位停靠组列表
      this.parkGrpList={};//存的停靠区经纬度
      this.parkSpaceList={};//存的停靠位的经纬度

      this.parkAreas=null;
      this.parkSpaces=null;

      this.unloadBoundary=[];
    },
    // 加载停靠区/停靠位
    async getParkLayer(type,list){
      // var cql_filter='eletype=3 AND elementid=1';

      if(type=="parkGrps"){//加载停靠区
        if(Object.keys(this.parkGrpList).length == 0){
          // 获取cql_filter
          var cql_filter_array = [];

          for(let i=0;i<list.length;i++){
            var areaSn = this.$route.query.areaSn;
            if(list[i].areaSn==areaSn){
              list[i].parkGrps.forEach((e)=>{
                cql_filter_array.push("id='"+e.id+"'")
              })
            }
          }
          if(cql_filter_array.length==0)return;
          var cql_filter = cql_filter_array.join(' OR ');
          // 获取图层对象
          var geoPolygon = geoLayerGroup.geoParkGrpsPolygon;
          var json = await this.getMapJson(geoPolygon,cql_filter);
          // console.log(json);
          // 开始存经纬度
          var listfeatures = json.features || [];
          listfeatures.forEach((feature)=>{
            var properties = feature.properties;

            var latlngs = [];
            var geometry = feature.geometry;
            var coordinates=[];
            if(geometry)coordinates = geometry.coordinates[0]||[];
            // console.log(coordinates);
            var latlngs = [];
            if(coordinates)latlngs = coordinates[0]||[];

            var latLngDot = latlngs.map((o) => [o[1],o[0]]);

            this.parkGrpList[properties.id]=latLngDot;
          })
        }
        // 停靠区开始设置颜色显示
        var parkGrpList = this.parkGrpList;
        // 循环停靠区图层
        for(let id in parkGrpList){
          // 循环卸载区
          uploading:for(let i=0;i<list.length;i++){
            var parkGrps = list[i].parkGrps;
            // 循环停靠区
            for(let j = 0;j<parkGrps.length;j++){
              if(parkGrps[j].id==id){
                var color = this.utils.getObjValByKey(this.vars.workingStatusList,parkGrps[j].workStatusValue,'code','color');

                d ={
                  color:color,
                  latlngs:parkGrpList[id]
                }
                var area = Object.assign({},d,parkGrps[j]);
                if(!this.parkAreas){
                  var obj={};
                  obj[id]=area;
                  this.parkAreas=obj;
                }else{
                  this.parkAreas[id]=area;
                }
                break uploading;
              }
            }
          }
        }
        return;
      }

      if(type=="parkSpaces"){//设置停靠位
        // 如果没有停车位，则加载停车位经纬度；
        if(Object.keys(this.parkSpaceList).length == 0){
          // 停靠位过滤
          var cql_filter_array = [];
          for(let i=0;i<list.length;i++){
            var areaSn = this.$route.query.areaSn;
            var parkGrps = list[i].parkGrps;
            if(list[i].areaSn==areaSn){
              list[i].parkGrps.forEach((e)=>{
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
                  
                  // var used = parkSpaces[k].used?true:false;
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
    async getMapJson(name,cql_filter){//获取地图json数据
      var data={
        service:'WFS',
        version:'1.0.0',
        request:'GetFeature',
        typeName:name,
        maxFeatures:'20000',
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
    stopStateGroupChange(v){
      this.setStatus(v,'groups');
    },
    // 状态变化
    unloadMaterialChange(v){
      this.setUnloadMaterial(v);
    },
    
    async setUnloadMaterial(status){//设置状态
      try{
        // if(!this.uploadDetails.bindDevice)return;
        var deviceId = this.uploadDetails.id;

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
    async setStatus(status,type){//设置状态
      try{
        var formData = new FormData();
        formData.append("siteId", this.uploadDetails.siteId);
        formData.append("grpSn", this.uploadDetails.grpSn);
        if(type=='spaces')formData.append("spcSn", this.uploadDetails.spcSn);

        var result = await workingServer.setParkStatus(type,status.toLowerCase(),formData);
        
        if(result.success){
          this.$emit('updateList',status);
          var processing = this.$route.query.processing;
          if(processing){
            this.ignoreAlarm();
          }
          this.messages.success(result.message);
        }else{
          this.$emit('updateList',status);
          this.messages.error(result.message);
        }
        
      }catch(e){
        this.messages.error(e.message);
        console.error(e);
      }
    },
    async getAlarmList(){//获取告警列表
      try{
        var id = this.$route.query.alarmId;
        if(!id)return;
        var data = {
            pageSize:1000,
            pageIndex:1,
            isHandled:'false',
        }
        var result = await alarmServer.getAlarmHistory(data);

        var content = result.content || [];

        this.alarmList = content;

      }catch(e){
          this.messages.error(e.message)
      }
    },
    async ignoreAlarm(type){//忽略状态告警
      try{
        var id = this.$route.query.alarmId;
        if(!id)return;
        var result = await alarmServer.alarmHandle(id);
        if(type==1){
          if(this.alarmDetails.alarmType==this.vars.alarmType[1].type){
            if(this.alarmDetails.alarmEventJson&&this.alarmDetails.alarmEventJson.taskId){
              var data = {
                id:this.alarmDetails.alarmEventJson.taskId,
                processResult:0
              }
              var result = await unloadAeraServer.setUpdateProcessAsync(data);
            }
          }
          this.clearEdit(type);
        }else{
          this.clearEdit();
        }
        
      }catch(e){
        this.messages.error(e.message);
        console.error(e);
      }
    },
    async loadGraph(){//加载图形
      var taskId = this.$route.query.taskId;
      try{
        var result = await workingServer.getUnloadBoundary(taskId);
        var listStr = result.uploadBoundry;
        
        var lnglat = workingServer.getPolygonData(listStr);
        
        this.newUploading = L.polyline(lnglat, {color: "#f00",dashArray:'4',weight:"2"}).addTo(this.map);
      }catch(e){
        this.messages.error(e.message);
        console.error(e);
      }
    },
    async loadObstacleGraph(){//加载障碍物图形
      var taskId = this.$route.query.taskId;
      try{
        var result = await workingServer.getObstacleBoundary(taskId);
        // console.log(result);
        // return;
        var listStr = result.boundaryText;
        
        var lnglat = workingServer.getObstacleData(listStr);
        console.log(lnglat);
        
        this.newUploading = L.polyline(lnglat, {color: "#f00",dashArray:'4',weight:"2"}).addTo(this.map);
      }catch(e){
        this.messages.error(e.message);
        console.error(e);
      }
    },
    resetGraph(){//重置
      this.newUploadingRemove();
    },
    confirmClick() {//更新 发布地图
      let _this = this;
      this.$messageConfirm.showConfirm({
        content:'确定要更新卸载区吗？',
        // detail:'提示详情'
      },async ()=>{
        // 确定操作
        this.setUpdateProcess(1);
      });
    },
    confirmObstacleClick() {//更新 障碍物边界发布
      let _this = this;
      this.$messageConfirm.showConfirm({
        content:'确定要更新卸载区障碍物边界吗？',
        // detail:'提示详情'
      },async ()=>{
        // 确定操作
        this.setObstacleProcess(1);
      });
    },
    rejectUpdate() {//驳回
      let _this = this;
      this.$messageConfirm.showConfirm({
        content:'确定要驳回吗？',
        // detail:'提示详情'
      },async ()=>{
        // 确定操作
        this.setUpdateProcess(0);
      });
    },
    async setUpdateProcess(processResult){//更新卸载区
      let _this = this;
      try{
        var taskId = this.$route.query.taskId;
        var data = {
          id:taskId,
          processResult:processResult
        }
        var result = await workingServer.setUpdateProcessAsync(data);

        if(processResult==1&&result){
          this.$refs.updateProgress.openDialog(result);

        }else if(processResult==0){
          _this.bus.$emit('removeMsgInfo',_this.$route.query.alarmId);
          _this.newUploadingRemove();
          _this.clearEdit();
          // _this.$emit('getList');
        }
      }catch(e){
        _this.messages.error(e.message);
        console.error(e)
      }
    },
    rejectObstacleUpdate() {//驳回
      let _this = this;
      this.$messageConfirm.showConfirm({
        content:'确定要驳回吗？',
        // detail:'提示详情'
      },async ()=>{
        // 确定操作
        this.setObstacleProcess(0);
      });
    },
    async setObstacleProcess(processResult){//更新障碍区卸载区
      let _this = this;
      try{
        var taskId = this.$route.query.taskId;
        var data = {
          id:taskId,
          processResult:processResult
        }
        var result = await workingServer.setObstacleProcess(data);

        if(processResult==1&&result){
          this.$refs.updateProgress.openDialog(result);

        }else if(processResult==0){
          _this.bus.$emit('removeMsgInfo',_this.$route.query.alarmId);
          _this.newUploadingRemove();
          _this.clearEdit();
        }
      }catch(e){
        _this.messages.error(e.message);
        console.error(e)
      }
    },
    // async getObstacleMap(){//判断获取障碍区地图
    //   let _this = this;
    //   try{
    //     var isObstacleHasLayer = await workingServer.obstacleHasLayer();
    //     if(isObstacleHasLayer){
    //       this.getObstacleWms();
    //     }
    //   }catch(e){
    //     _this.messages.error(e.message);
    //   }
    // },
    // getObstacleWms(){//加载障碍物地图
    //   this.map = this.$refs.map?this.$refs.map.mapObject:null;
    //    if(!this.map)return;
    //   // 接口
    //   var layerUrl = mapServer.wmsTileLayerLine();
    //   // 图层组参数
    //   var geoLayerGroup = mapServer.geoLayerGroup();
    //   var layers = geoLayerGroup.geoObstacle;
      
    //   var maxZoom = 22;
    //   var minZoom = 1;
    //   var format = 'image/png';

    //   this.obstacleLayer = L.tileLayer.wms(layerUrl, {
    //     format: format,
    //     version: '1.1.1',  
    //     transparent:true,
    //     styles:geoLayerGroup.geoObstacleStyle,
    //     maxZoom: maxZoom,
    //     minZoom: minZoom,
    //     layers: layers,
    //     exceptions: 'application/vnd.ogc.se_inimage'
    //   }).addTo(this.map);
    // },
    updateProgressReturn(){//重置加载地图
      // 清除当前选中停车位停车区
      this.clearParkList();
      // 更新障碍区边界
      this.clearObstacleLayer();
      // 移除显示要更新的边界
      this.newUploadingRemove();
      // 更新底图
      this.wmsLayer();
      // 更新障碍区边界;
      this.getObstacleMap()
      // 第一次
      this.isFirst = 0;
      // 更新列表
      this.$emit('getList');
      // 跳到卸载区
      this.toUnloadArea();

    },
    clearEditDate(type){//退出
      let _this = this;
      this.$messageConfirm.showConfirm({
        content:this.$t("pages.cancel-update-unload"),
        // detail:'提示详情'
      },async ()=>{
        // 确定操作
         _this.newUploadingRemove();
        _this.clearEdit(type);
      });
    },
    clearEdit(type){//退出路由跳转
      var processing = this.$route.query.processing;
      if(processing){
        this.$emit('showAlarmInfo');
      }
      var toUrl = this.$route.matched[1].path+'/map';
      if(type==1){
        var routerPath = {
          path:`${toUrl}/-1`,
        }
      }else{
        var route = this.$route;
        var id = route.params.id;
        var query = route.query;
        var routerPath = {
            path:`${toUrl}/${id}`,
            query:{
              areaTypeSn:query.areaTypeSn,
              areaSn:query.areaSn,
              activeType:query.activeType
            }
        };
      }
      
      this.$router.replace(routerPath);
    },
    toUnloadArea(){//跳转到排土场不处理告警的状态
      var query = this.$route.query;
      if(!query.activeType)return;
      var toUrl = this.$route.matched[1].path+'/map';
      let routerPath = {
          path:`${toUrl}/${query.areaSn}`,
          query:{
              areaTypeSn:query.areaTypeSn,
              areaSn:query.areaSn,
              activeType:1
          }
      };
      this.$router.replace(routerPath);
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
    
    getwebsocketShapeReload(){//消息订阅
        var _this=this;
        var shapeReloadCmds = {
            entityType: 'SHAPE_RELOAD'
        };
        var subscriber = {
            shapeReloadCmds: [shapeReloadCmds],
            type: 'shapeReload'
        };
        
        subscriber.onReconnected = function() {}
        subscriber['onData'] = function(data) {
            if (data.data) {
              _this.updateProgressReturn();
            }
        }
        websocket.subscribe(subscriber,function(data){
            _this.cancelList = data;
        });
    },
    unwebsocketShapeReload(){//取消订阅
        var _this=this;
        if(_this.cancelList.length>0){
            var subscriber = {
                shapeReloadCmds: _this.cancelList,
                type: 'shapeReload'
            };

            websocket.unsubscribe(subscriber);
        }
    },
    
    // 要更新的路线
    newUploadingRemove(){
      if(this.newUploading){
        this.newUploading.remove();
        this.newUploading=null;
      }
    },
    // 清除地图图层
    clearLayer(){
      if(this.districtLayerLine){
        this.districtLayerLine.remove();
        this.districtLayerLine=null;
      }
    },
    // 清除地图图层
    // clearObstacleLayer(){
    //   if(this.obstacleLayer){
    //     this.obstacleLayer.remove();
    //     this.obstacleLayer=null;
    //   }
    // },
  },
  beforeRouteLeave(to, from, next) {
    let _this = this;
    var processing = this.$route.query.processing;
    if(processing){
      this.$messageConfirm.showConfirm({
        content:'消息未处理，确定要离开吗？',
        // detail:'提示详情'
      },async ()=>{
        // 确定操作
        next(true);
      });
    }else{
      next(true);
    }
  },
  beforeDestroy(){
    this.unwebsocketShapeReload();
  }
};
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
@import "../../common/css/working.scss";
</style>