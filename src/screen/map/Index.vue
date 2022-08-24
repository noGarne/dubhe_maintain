<template>
  <!-- 大屏显示监控中心-全局模式 -->
  <div class="screen-map" :class="{'lock_device':currentDeviceId}">
    <l-map
    class="monitoring_l_map"
    ref="map"
    :zoom="zoom"
    :min-zoom="minZoom"
    :max-zoom="maxZoom"
    :bounds="bounds"
    :center="center"
    :options="{zoomControl:false}"
    >

    <l-tile-layer
      :url="url"
      :attribution="''"/>

    <!-- 比例尺 -->
    <l-control-scale :imperial="imperial"
      :position="'bottomleft'" />

    <!-- 调度指引线 -->
    <l-polyline
      v-if="dispatchLatLng.length==2"
      key="'dispatchLine'"
      :weight="1"
      :lat-lngs="dispatchLatLng"
      dashArray="4"
      :color="'#00dc94'"
      :fill="false"/>

    <l-layer-group
      v-for="(item,index) in devicesJson"
      :key="index">
      <!-- 路权 -->
      <l-polyline 
        v-if="currentDeviceId && item.wayInfo && item.wayInfo.length>0" 
        key="'way'"
        :lat-lngs="[...item.wayInfo]" 
        color="#f00" 
        :fill="false">
      </l-polyline>
      <!-- 设备 -->
      <l-marker
        v-if="item.tsScriber && item.tsScriber.latLng && item.tsScriber.latLng[0] && (!activeShow?true:(item.attrSub?item.attrSub.active=='true':'true'))"
        :lat-lng="item.tsScriber.latLng"
        >
          <l-icon :icon-anchor="[0,0]">
            <div class="icon_devices" :class="sizeClass">
              <!-- 高亮显示 -->
              <div v-if="currentDeviceId==item.id.id" class="device_active">
                <div class="device_active1">
                    <div class="device_active2">
                        <div class="device_active3"></div>
                    </div>
                </div>
              </div>
              <!-- 名称 -->
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

                <span class="device-title-arrow"><img src="../../common/images/device_title_arr.png" alt=""></span>
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
            </div>
          </l-icon>
      </l-marker>
    </l-layer-group>
    <l-layer-group
      v-for="(item,index) in mapSiteCenterList"
      :key="index+'space'">
      <l-marker :lat-lng="item.latLng" v-if="spaceIconShow||(item.type==currentObjectId.type && item.id==currentObjectId.id)">
          <l-icon :icon-anchor="[0,0]">
            <div class="map-place-space">
              <i class="iconfont" :class="spaceIcon(item.type)"></i> {{item.name}}</div>
          </l-icon>
      </l-marker>
    </l-layer-group>
  </l-map>
  </div>
</template>

<script>

import deviceIconMixins from '../../common/mixins/deviceIcon.mixins.js';
import mapMixins from '../../common/mixins/map.mixins';
import leafletMixins from '../../common/mixins/leaflet.mixins';
import dispatchMixin from '../../common/mixins/dispatch.mixins.js';

import loginServer from "../../api/login.server"
import userService from "../../api/user.server"
import devicesServer from '../../api/devices.server';
import monitoringServer from '../../api/monitoring.server';
import dispatchSetServer from '../../api/dispatchSet.server.js';
import mapServer from '../../api/map.server.js';
import websocket from '../../api/websocket';

export default {
  name: 'ScreenMap',
  mixins: [mapMixins,leafletMixins,deviceIconMixins,dispatchMixin],
  data () {
    return {
      devicesList:[],
      devicesJson:{},
      waySubList: [],
      wayArray:[],
      laneJson:{},
      timer:null,
      currentDeviceId:''
      // loadNum:0,
      // loading:false,
      // subareaSn:0
    }
  },
  created(){
    this.getLayerJson();
  },
  mounted(){
    this.login();
    // this.subareaSn = this.$route.params.sid || 1;
    // if(this.subareaSn){
      // this.getDevices();
    // }
  },
  computed: {
    dispatchLatLng(){
      var _this = this;
      this.currentObjectId={};
      var latLng = [];
      var id = this.currentDeviceId
      if(id){//在详情页
        var devicesJson = this.devicesJson;
        if(
          devicesJson.hasOwnProperty(id) &&
          devicesJson[id].showTypeSn==this.vars.showTypeList[0].id &&
          devicesJson[id].tsScriber
        ){//列表存在id/矿卡设备/存在上数

          var taskStatus = devicesJson[id].tsScriber.taskStatus;
          if(
            !(taskStatus==this.vars.dispatchTaskStatus[1].id||
            taskStatus==this.vars.dispatchTaskStatus[2].id||
            taskStatus==this.vars.dispatchTaskStatus[3].id)
          ){//任务执行状态不是道路行驶/道路预告/排队等待
            return latLng;
          }

          var deviceLatLng = devicesJson[id].tsScriber.latLng;
          var currentTaskObjectId = devicesJson[id].tsScriber.currentTaskObjectId;
          if(
            deviceLatLng.length>1 &&
            (deviceLatLng[0] || deviceLatLng[1]) &&
            currentTaskObjectId &&
            devicesJson.hasOwnProperty(currentTaskObjectId)
          ){//卡车存在经纬度/经纬度两个不能同时为0/存在调度目标的id
            var toLatLng = devicesJson[currentTaskObjectId].tsScriber.latLng;
            if(
              toLatLng &&
              (toLatLng[0] || toLatLng[0])
            ){//调度目标存在经纬度

              latLng = [deviceLatLng,toLatLng];
            }
          }else if(!devicesJson.hasOwnProperty(currentTaskObjectId)){//设备列表不存在调度目标
            var site = this.siteList.filter(e=>e.device.id.id==currentTaskObjectId);
            if(site.length>0){//获取到对应的场地设备
              var roadElementType = site[0].roadElementType;
              var raodElementSn = site[0].raodElementSn;
              if(roadElementType!=null&&raodElementSn!=null){//存在地图元素
                var typeId = this.utils.getObjValByKey(this.vars.baseSite.mapType,roadElementType,'type','id');
                var mapCenter = this.mapSiteCenterList.filter(e=>e.type==typeId&&e.id==raodElementSn);
                if(mapCenter.length>0){
                  latLng = [deviceLatLng,mapCenter[0].latLng];
                  _this.currentObjectId={
                    type:typeId,
                    id:raodElementSn
                  };
                }
              }
            }
          }
        }
      }
      return latLng;
    },
  },
  methods: {
    async login () {
      var _this=this;
      let username = ConfigData.screenMap.username;//'daping@i-tage.com';
      let password = ConfigData.screenMap.password;//'daping@i-tage.com';
      loginServer.login({username,password}).then(function success(response){
        var token = response.token;
        var refreshToken = response.refreshToken;
        // 获取用户信息
        userService.setUserFromJwtToken(token, refreshToken, false);
        _this.getPositionList();
        _this.getDevices();
        _this.showGeoLayer();
        
        // _this.timer = setInterval(_this.login,30 * 60 * 1000);
        _this.timer = setInterval(_this.refreshPage,50 * 60 * 1000);
      },function fail(e){
        _this.messages.error(e.message)
      })
    },
    refreshPage(){
      window.location.reload();
    },
    setLock(){
      var id= this.currentDeviceId;
      if(!id)return;
      // this.setMapD(true);
      var data = this.devicesJson[id].tsScriber;
      this.deviceCurrent(data, true);
    },
    async getPositionList(){//场地和地图元素的关系
      // if(!this.subareaSn)return;
      try{
        var data={
          subareaSn:this.subareaSn
        }
        var result = await dispatchSetServer.getRoadElementPlaceList(data);
        this.siteList=result.filter(v=>v.device.forbidden==false);
      }catch(e){
        this.messages.error(e.message)
      }
    },
    deviceCurrent(data,isLock){
      if(!data)return;
      var _this = this;
      var latitude = data.latitude?data.latitude:0;
      var longitude = data.longitude?data.longitude:0;

      if(_this.currentDeviceId && latitude && isLock){
        // 缩放范围
        this.$nextTick(() => {
          var map = this.$refs.map?this.$refs.map.mapObject:null;
          if(!map)return;
          map.setView([latitude, longitude], 18);
        })
      }
    },
    setMapD(disable){
      this.$nextTick(() => {
        var map = this.$refs.map?this.$refs.map.mapObject:null;
        if(!map)return;
        if(disable){
          map.dragging.disable();
          map.touchZoom.disable();
          map.doubleClickZoom.disable();
          map.keyboard.disable();
        }else{
          map.dragging.enable();
          map.touchZoom.enable();
          map.doubleClickZoom.enable();
          map.keyboard.enable();
        }
      });
    },   
    // setLoading(){
    //   this.loading = false;
    // }, 
    getCurrentDeviceInfo(data){
      let id = this.$route.params.id;
      if(data && id){
        // 根据tbox号查找
        let info = data.find(v=>v.deviceImei==id 
        || (v.spareParts && v.spareParts.mboxIMEI && v.spareParts.mboxIMEI.svalue==id) 
        || (v.spareParts && v.spareParts.tboxIMEI && v.spareParts.tboxIMEI.svalue==id));
        this.currentDeviceId = info && info.id && info.id.id;
      }
    },
    setDevicesList(data,json){//给设备复值
      this.devicesList=data;
      this.devicesJson=json;
    },
    async getDevices(){//获取设备
      var _this = this;
      try{
        // if(!this.subareaSn)return;
        var arg = {
          pageSize:this.vars.pageData.pageSize,
          // subareaSn:this.subareaSn,
          isForbidden:false,
          notShowTypeSn:_this.vars.baseSite.id
        }
        var result=await devicesServer.devicesList(arg);        
        var data = result.content;
        result = null;
        if(data.length>0){
          _this.getCurrentDeviceInfo(data);
          var json = {};
          var list = [];
          data.forEach(function(v){
            json[v.id.id]=v;
            
            var child = {};
            child['equipmentModelName']=v.equipmentModelName;
            child['equipmentTypeName']=v.equipmentModelName;
            child['equipmentTypeSn']=v.equipmentTypeSn;
            child['showTypeSn']=v.showTypeSn;
            child['id']=v.id;
            child['equipmentName']=v.equipmentName;
            list.push(child)

          })
          _this.setDevicesList(list,json);
          
          _this.getwebsocket(data);
          _this.getwebsocketOnline(data);
          _this.getwebsocketWay();
        }else{
          // _this.setLoading();
        }
        data = null;

      }catch(e){
        // _this.setLoading();
        _this.messages.error(e.message)
      }
    },
    getwebsocket(infoList){//建立长链接
      var _this=this;
      var tsType=monitoringServer.tsType();

      var arrList=[];
      infoList.forEach(function(v,i){
        var subscriptionList={
          entityType:v.id.entityType,
          entityId:v.id.id,
          keys: tsType.list
        }
        arrList.push(subscriptionList)
      })

      var subscriber = {
          subscriptionCommands: arrList,
          type: 'tsScriber'
      };

      subscriber.onReconnected = function() {}
      subscriber['onData'] = function(data) {
        if (data.data) {
            _this.getConfigResult(data);
        }
      }

      websocket.subscribe(subscriber,function(data){
        _this.tsScriberList=data;
      });
    },
    getwebsocketOnline(infoList){//建立长链接
      var _this=this;
      var tsType=monitoringServer.tsType();

      var arrList=[];
      infoList.forEach(function(v,i){
        var subscriptionList={
          entityType:v.id.entityType,
          entityId:v.id.id,
          keys: tsType.attr
        }
        arrList.push(subscriptionList)
      })

      var subscriber = {
          subscriptionCommands: arrList,
          type: 'attrSub'
      };

      subscriber.onReconnected = function() {}
      subscriber['onData'] = function(data) {
        if (data.data) {
            _this.getConfigResult(data);
        }
      }

      websocket.subscribe(subscriber,function(data){
        _this.attrSubList=data;
      });
    },
    getConfigResult(info){//数据复值
      // console.log(info);
      var _this=this;
      var errorCode=info.errorCode;
      if(errorCode==0){

        var infoData=info.data;
        var received_info = {};
        for(let k in infoData){
          received_info = infoData[k];
          received_info['ts'] = parseInt(k);
          break;
        }
        var received_id=info.entity.entityId;
        var received_type=info.entity.type;

        if(received_type=='tsScriber'){
          var lat=received_info.latitude?received_info.latitude:0;
          var lng=received_info.longitude?received_info.longitude:0;
          received_info['latLng'] = [ lat , lng  ]
        }
        var data={
            id:received_id,
            data:received_info,
            type:received_type,
            cmdId:info.subscriptionId
          }
          _this.setDevicesAttr(data);
      }
        // 去掉加载
      // if(this.loading){
      //   this.loadNum++;
      // }
      // if(this.loadNum==this.devicesList.length*2){
      //   this.setLoading();
      // }
    },
    setDevicesAttr(arg){//给设备添加值
      var id=arg.id,
          data=arg.data,
          type=arg.type
      if(data&&type){

        var devicesJson = this.devicesJson;
        var d = JSON.parse(JSON.stringify(devicesJson[id]||{}));

        d[type]=data;
        if(type=='tsScriber'){
          if(!d.cmdId){
            d['cmdId'] = {
              ts:arg.cmdId
            }
          }else{
            if(!d.cmdId.ts){
              d.cmdId.ts = arg.cmdId;
            }
          }

        }else if(type=='attrSub'){
          if(!d.cmdId){
            d['cmdId'] = {
              attr:arg.cmdId
            }
          }else{
            if(!d.cmdId.attr){
              d.cmdId.attr = arg.cmdId;
            }
          }
        }
        if(!this.loading){
          this.copyData = true;
        }
        this.devicesJson[id]=d;

        this.setLock();
      }
    },
    // 路权
    getwebsocketWay() {
      var _this = this;
      if(!_this.currentDeviceId)return;
      var subscriptionCommands = []
      this.devicesList.filter(v=>v.showTypeSn==this.vars.showTypeList[0].id).forEach(v => {
        let subscriptionCommand = {
          entityType: v.id.entityType,
          entityId: v.id.id
        };
        subscriptionCommands.push(subscriptionCommand);
      })

      var subscriber = {
        mvAthoUpdateCmds: subscriptionCommands,
        type: 'mvAthoUpdate'
      };

      subscriber.onReconnected = function () { }
      subscriber['onData'] = function (data) {
        if (data.data) {
          _this.onDataWay(data);
        }
      }

      websocket.subscribe(subscriber, function (data) {
        _this.waySubList = data;
      });
    },
    onDataWay(data) {
      let json = data.data;
      if (Object.keys(json).length > 0 && Object.keys(this.devicesJson).length > 0) {
        let info = json;
        info['ts'] = parseInt(json.createTime);
        info['cmdId'] = data.subscriptionId;
        info['id'] = json.deviceId;
        this.devicesJson[info['id']]['lastTreeTime'] = info['ts'];
        // 显示在线卡车的路权
        if(info.hasOwnProperty('safeOccupied')){
          this.devicesJson[info['id']]['wayInfo'] = this.getWayInfo(info);
          this.devicesJson[info['id']]['mvAthoUpdate'] = info['safeOccupied'];
        }
      }
    },
    getWayInfo(wayInfo){
      // 设置路权
      let wayList = wayInfo.safeOccupied;
      let startPoint = wayList.startPoint;
      let endPoint = wayList.endPoint;
      let lineids = wayList.lineSnQ;
      if(!lineids || lineids.length<=0) return [];
      let startIndex = lineids.findIndex(v=>v==startPoint.lineSn);
      let endIndex = lineids.findIndex(v=>v==endPoint.lineSn);
      let lineidsNew = lineids.slice(startIndex,endIndex+1);
      let wayArray = [];
      for (let i = 0; i < lineidsNew.length; i++) {
        let laneInfo = this.wayArray.filter(v=>v.laneid==lineidsNew[i]);
        if(laneInfo.length>0){
          wayArray.push(laneInfo);
        }
      }
      let lineArray = [];
      (wayArray || []).forEach(wayItems=>{
        let wayItem = wayItems[0];
        let itemLineid = wayItem.laneid;
        let itemCoordinates = wayItem.coordinates[0];
        if(startPoint.lineSn == itemLineid){
          if(endPoint.lineSn == itemLineid){
            // 截取到endPoint
            lineArray.push(...itemCoordinates.slice(startPoint.index,endPoint.index+1));
          }else{
            // 截取到最后
            lineArray.push(...itemCoordinates.slice(startPoint.index));
          }
        }else{
          if(endPoint.lineSn == itemLineid){
            // 截取到endPoint
            lineArray.push(...itemCoordinates.slice(0,endPoint.index+1));
          }else{
            // 不截取
            lineArray.push(...itemCoordinates);
          }
        }
      });

      if(lineArray.length>0){
        lineArray = lineArray.map(l=>[l[1],l[0]])
      }
      return lineArray;
    },
    async getLayerJson(){
      if(Object.keys(this.laneJson).length <= 0){
        let resultMap = await mapServer.getLayersJson(mapServer.geoLayerGroup().geoLaneElement);
        this.laneJson = resultMap;
        this.wayArray = mapServer.getLayersArray(this.laneJson) || [];
        let wayResult2 = await mapServer.getLayersJson(mapServer.geoLayerGroup().geoDumpLineLayer);
        if(typeof wayResult2 == 'object' && wayResult2.hasOwnProperty('bbox')){
          let wayArray2 = mapServer.getLayersArray(wayResult2) || [];
          this.wayArray.push(...wayArray2);
        }
      }
    },
    unsubscribeWay(v) {
      let wayCommands = this.waySubList;
      if (wayCommands.length > 0) {
        let subscriber = {
          mvAthoUpdateCmds: wayCommands,
          type: 'mvAthoUpdate'
        };
        websocket.unsubscribe(subscriber);
      }
    },
    unsubscribe(){//去除长链接
      var subscriber = {
          subscriptionCommands: this.tsScriberList,
          type: 'tsScriber'
      };
      var subscriber2 = {
          subscriptionCommands: this.attrSubList,
          type: 'attrSub'
      };
      websocket.unsubscribe(subscriber);
      websocket.unsubscribe(subscriber2);
    },
    removeDevicesList(){//移除列表
      this.devicesList=[];
      this.devicesJson={};
      this.waySubList=[];
      this.wayArray=[];
      this.laneJson={};
    }
  },
  beforeDestroy(){
    if(this.timer){
      clearInterval(this.timer)
      this.timer = null;
    }
    if(this.devicesList.length>0){
      this.unsubscribe();
      this.unsubscribeWay();
      this.removeDevicesList();
    }
  }
}
</script>

<style lang="scss" scoped>
.screen-map{
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
}
.monitoring_l_map{
  height: 100%;
  width: 100%;
}
</style>