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

    <!-- 没有找到对象 -->
    <div class="map-info" v-if="!uploadDetails && editDate && editDate.processing">
      <div class="map-li">
        <div class="map-title">
          <div class="alarm-cart">
            <p class="red">采掘区不存在。</p>
            <p class="alarm-content">{{alarmDetails.alarmTime | formatDate}}{{alarmDetails.alarmDetail}}</p>
          </div>
        </div>

        <div class="map-button">
          <el-button class="btnBg" key="ignore" @click="ignoreAlarm(1)">忽略</el-button>
          <el-button class="btnBg" key="exit2" @click="clearEditDate(1)">退出</el-button>
        </div>
      </div>
    </div>
    <base-map-control-bar
      :zoom="zoom"
      :maxZoom="maxZoom"
      :minZoom="minZoom"
      @getBounds="getBounds"
      @setZoom="setZoom"  
    >
    </base-map-control-bar>

    <l-map class="map" ref="map" :zoom="zoom" :center="center" :options="options" :bounds="bounds">

      <l-layer-group
        v-for="(item,index) in devicesJson"
        :key="index">
        <!-- @mouseenter="popupShow($event,item,index)" -->
        <l-marker
          v-if="
            item.tsScriber && 
            item.tsScriber.latLng && 
            item.tsScriber.latLng[0]"
          :lat-lng="item.tsScriber.latLng"
          >
          <!--  &&
            (!activeShow?true:(item.attrSub?item.attrSub.active=='true':'true')) -->
            <l-icon 
              :icon-anchor="[0,0]">
              <div 
                class="icon_devices" 
                :class="sizeClass">
                <div class="device-title-status" :title="item.equipmentName">
                  <!-- 标题 -->
                  <div class="device-title-bg">
                    {{item.equipmentName}}
                    <span class="device-line0"></span>
                    <span class="device-line1"></span>
                    <span class="device-line2"></span>
                    <span class="device-line3"></span>
                    <span class="device-line4"></span>
                    <span class="device-line5"></span>
                    <span class="device-line6"></span>
                  </div>
                  <span class="device-title-icon" :class="iconBgColor(item.attrSub?item.attrSub.active:'false',item.showTypeSn,item.tsScriber.operationType,'device-title-icon')">
                    <i class="iconfont" :class="iconImgShow(item)"></i>
                  </span>



                  <span class="device-title-arrow"><img src="../../../common/images/device_title_arr.png" alt=""></span>
                  <img 
                    key="driverMode" 
                    class="title-driver-mode"
                    v-if="drivingModeIcon(item.showTypeSn,item.tsScriber.drivingMode,item.attrSub).show"
                    :src="drivingModeIcon(item.showTypeSn,item.tsScriber.drivingMode,item.attrSub).icon">
              </div>
            
              <!-- 离线 -->
              <img 
                key="offline" 
                v-if="item.attrSub && item.attrSub.active == 'false'" class="devices_alarm" 
                :src="iconImg(item,item.tsScriber.loadState).iconImg2" 
                :style="{ 
                  transform: 'rotateZ('+direction(item,item.tsScriber.direction)+'deg)'}">
              <!-- 在线 -->
              <img 
                key="online" 
                v-else 
                class="devices_alarm" 
                :src="iconImg(item,item.tsScriber.loadState).iconImg"
                :style="{ 
                  transform: 'rotateZ('+direction(item,item.tsScriber.direction)+'deg)'}">

                  <!-- <div class="device_title">
                    <span 
                      v-if="(item.equipmentTypeSn==vars.deviceTypeNew[0].id) || (item.equipmentTypeSn==vars.deviceTypeNew[1].id) || (item.equipmentTypeSn==vars.deviceTypeNew[2].id)" 
                      :class="'status'+item.tsScriber.operationType">
                    </span>
                    {{item.equipmentName}}
                  </div>

                <img v-if="item.tsScriber.operationType==3" class="devices_icon" :src="iconImg('alarm').iconImg">

                <img key="lixian" 
                  v-if="item.attrSub && item.attrSub.active == 'false'" class="devices_alarm" 
                  :src="iconImg(item.showTypeSn,item.tsScriber.loadState).iconImg2" 
                  :style="{ 
                    transform: 'rotateZ('+direction(item,item.tsScriber.direction)+'deg)'}">
                
                <img 
                  key="zaixian" 
                  v-else 
                  class="devices_alarm" 
                  :src="iconImg(item.showTypeSn,item.tsScriber.loadState).iconImg"
                  :style="{ 
                    transform: 'rotateZ('+direction(item,item.tsScriber.direction)+'deg)'}">
                     -->
              </div>
            </l-icon>
          </l-marker>
      </l-layer-group>
      
      <!-- 卸载边界 -->
      <l-polygon
        :key="'bounds1'"
        :weight="3"
        :fillOpacity="0.1"
        :fillColor="'#5bb3f9'"
        :lat-lngs="unloadBoundary"
        :color="'#5bb3f9'"
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
    <update-progress ref="updateProgress" @updateProgressReturn="updateProgressReturn" @clearEdit="clearEdit"></update-progress>
  </div>
</template>

<script>

import websocket from '../../../api/websocket';

import mapServer from '../../../api/map.server';

import devicesMixins from '../../common/js/devices.mixins';
import mapMixins from '../../../common/mixins/map.mixins';
import deviceIconMixins from '../../../common/mixins/deviceIcon.mixins.js';
import leafletMixins from '../../../common/mixins/leaflet.mixins';
import obstacleMapMixins from '../../../common/mixins/obstacleMap.mixins';

import workingServer from "../../common/js/working.server";
import alarmServer from '../../common/js/alarm.server';

const UpdateProgress=()=>import('../../common/components/UpdateProgress.vue')

var geoLayerGroup = mapServer.geoLayerGroup();

export default {
  name: "digLoadingAreaMap",
  mixins:[devicesMixins,leafletMixins,obstacleMapMixins,mapMixins,deviceIconMixins],
  components: {
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

      parkSpaceList:{},//存的停靠位的经纬度

      parkSpaces:null,//停靠位经纬度状态颜色

      cancelList:[]//订阅列表
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
        
        // this.getParkLayer('parkGrps',v);
        this.getParkLayer('parkSpaces',v);
      },
      deep:true
    }
  },
  computed:{
    editDate(){//编辑状态
      var processing = this.$route.query.processing;
      var data = {}
      if(processing){
        var data = {
          processing
        }
      }
      return data;
    },
    alarmDetails(){//告警详情
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
      this.getBounds()
    }
    this.getDevices(this.vars.showTypeList[1].id);
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
    clearParkList(){//清除选中停车位停靠组列表
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
        outputFormat:'application/json',
        cql_filter:cql_filter,
        // propertyName:propertyName
      }
      var json = await workingServer.getUploadJson(data);
      return json;
    },

    async getUpload(){//加载卸载区边界
      var query = this.$route.query;
      
      if(!query.hasOwnProperty('areaSn')){//如果没有区域sn，加载全局图形边界
        this.getBounds();
        return;
      }
      var elementSn = query.areaSn;
      var areaTypeSn = query.hasOwnProperty('areaTypeSn')?query.areaTypeSn:2;
      // 采掘区eletype=2
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
    async getAlarmList(){//获取告警列表
      try{
        var id = this.$route.query.alarmId;
        if(!id)return;
        var data = {
            pageSize:this.vars.pageData.pageSize,
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
          if(this.alarmDetails.alarmType==this.vars.alarmType[0].type){
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
    //     exceptions: 'application/vnd.ogc.se_inimage',
    //     MathRandom:Math.ceil(Math.random()*10000)
    //   }).addTo(this.map);
    // },
    updateProgressReturn(){
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
      // 跳转页面
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
      console.log(this.$route);
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
    toUnloadArea(){
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