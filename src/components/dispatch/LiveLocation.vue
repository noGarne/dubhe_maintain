<template>
    <!-- 实时位置 -->
    <div class="live-location">
      <!--  :class="{'lock_device':attributeState && attributeState.active &&attributeState.active == 'true'}" -->
      <base-map-control-bar
        :zoom="zoom"
        :maxZoom="maxZoom"
        :minZoom="minZoom"
        @getBounds="getBounds"
        @setZoom="setZoom"  
      >
      </base-map-control-bar>
      <l-map
          class="monitoring_l_map"
          ref="map"
          :zoom="zoom"
          :min-zoom="minZoom"
          :max-zoom="maxZoom"
          :bounds="bounds"
          :center="center"
          :options="options">

          <l-tile-layer
          :url="url"
          :attribution="attribution"/>
          
          <!-- 比例尺 -->
          <l-control-scale :imperial="imperial"
          :position="'bottomleft'" />
          <l-layer-group>

              <l-marker
                v-if="latlng[0]"
                :lat-lng="latlng"
                >
                  <l-icon 
                    class="someCustomClasses" 
                    :icon-anchor="[0, 0]">
                    <div class="icon_devices" 
                      :class="sizeClass">
                      <div class="device-title-status" :title="devicesDetails.equipmentName">
                        <!-- 标题 -->
                        <div class="device-title-bg">
                          {{devicesDetails.equipmentName}}
                          <span class="device-line0"></span>
                          <span class="device-line1"></span>
                          <span class="device-line2"></span>
                          <span class="device-line3"></span>
                          <span class="device-line4"></span>
                          <span class="device-line5"></span>
                          <span class="device-line6"></span>
                        </div>
                        <span class="device-title-icon" :class="iconBgColor(attributeState.active,devicesDetails.showTypeSn,locationState.operationType,'device-title-icon')">
                          <i class="iconfont" :class="iconImgShow(devicesDetails)"></i>
                        </span>



                        <span class="device-title-arrow"><img src="../../common/images/device_title_arr.png" alt=""></span>
                        <img 
                          key="driverMode" 
                          class="title-driver-mode"
                          v-if="drivingModeIcon(devicesDetails.showTypeSn,locationState.drivingMode,attributeState).show"
                          :src="drivingModeIcon(devicesDetails.showTypeSn,locationState.drivingMode,attributeState).icon">
                    </div>
                  
                    <!-- 离线 -->
                    <img 
                      key="offline" 
                      v-if="attributeState && attributeState.active == 'false'" class="devices_alarm" 
                      :src="iconImg(devicesDetails,locationState.loadState).iconImg2" 
                      :style="{ 
                        transform: 'rotateZ('+direction(devicesDetails,locationState.direction)+'deg)'}">
                    <!-- 在线 -->
                    <img 
                      key="online" 
                      v-else 
                      class="devices_alarm" 
                      :src="iconImg(devicesDetails,locationState.loadState).iconImg"
                      :style="{ 
                        transform: 'rotateZ('+direction(devicesDetails,locationState.direction)+'deg)'}">

                    </div>
                  </l-icon>
                  <l-popup ref="popup">
                    <devices-popup :currentTs="locationState" :truckName="devicesDetails.equipmentName?devicesDetails.equipmentName:''"></devices-popup>
                  </l-popup>
                </l-marker>

                
          </l-layer-group>
            
      </l-map>
    </div>
</template>

<script>

import mapMixins from '../../common/mixins/map.mixins';
import deviceIconMixins from '../../common/mixins/deviceIcon.mixins.js';
import leafletMixins from '../../common/mixins/leaflet.mixins';
// import {LMap, LTileLayer, LControl, LControlScale, LPolyline, LPolygon, LLayerGroup, LMarker, LGeoJson ,LTooltip ,LPopup,LIcon,LImageOverlay} from 'vue2-leaflet';

import devicesServer from '../../api/devices.server';
import monitoringServer from '../../api/monitoring.server';
import websocket from '../../api/websocket';

const devicesPopup=()=>import('./DevicesPopup');

export default {
  name:'LiveLocation',
  mixins: [mapMixins,leafletMixins,deviceIconMixins],
  props:['detailsInfo'],
  components:{
    devicesPopup,
  },
  data() {
    return {
      attribution: '实时位置',
      devicesDetails:{},
      locationState:{},
      attributeState:{},
      firstEnter:true,
      tsScriberList:[],
      attrSubList:[],
    }
  },
  mounted(){
    this.getDevicesDetail();
    // this.mapLock();
  },
  watch:{
    detailsInfo(n,o){
      if(n.id!=o.id){
        this.firstEnter=true;
        this.getDevicesDetail();
        this.locationState={};
        this.attributeState={};
      }
    }
  },
  computed:{
    latlng(){
      var locationState = this.locationState?this.locationState:{};
      var lat=locationState.latitude&&locationState.latitude?locationState.latitude:0;
      var lng=locationState.longitude&&locationState.longitude?locationState.longitude:0;
      if(lat||lng){
        return [ lat , lng  ]
      }else{
        return [0,0]
      }
    },
    // direction(){
    //   return (data,direction)=>{
    //     var rotate=0;
    //     if(data.showTypeSn==this.vars.showTypeList[0].id||data.showTypeSn==this.vars.showTypeList[1].id){
    //       rotate=direction;
    //     }else{
    //       rotate=0;
    //     }
    //     return rotate;
    //   }
    // }
  },
  methods: {
    async getDevicesDetail(){//获取设备详情
      this.unwebsocket();
      var _this = this;
      var id= this.detailsInfo.uniqueId
      if(id){
        try{
          var result = await devicesServer.getDevicesDetails(id);

          this.devicesDetails=Object.assign(this.devicesDetails, result);
          var devicesId = this.devicesDetails.id ? this.devicesDetails.id : {};
          if(devicesId){
            var entityType = devicesId.entityType;
            var entityId = devicesId.id

            _this.getwebsocket(entityType,entityId)
            _this.getwebsocket2(entityType,entityId)
          }

        }catch(e){
          _this.messages.error(e.message)
        }
      }
      
    },
    getwebsocket(entityType,entityId){//获取监控
      var _this=this;
      var tsType=monitoringServer.tsType();

      var subscriptionCommand1 = {
        entityType: entityType,
        entityId: entityId,
        keys: tsType.locationN +','+tsType.statusN
      };

      var subscriber = {
          subscriptionCommands: [subscriptionCommand1],
          type: 'tsScriber'
      };

      subscriber.onReconnected = function() {}
      subscriber['onData'] = function(data) {
          if (data.data) {
              _this.onData(data, true);
          }
      }
      websocket.subscribe(subscriber,function(data){
        _this.tsScriberList=data;
      });
    },
    getwebsocket2(entityType,entityId){//获取监控
      var _this=this;
      var tsType=monitoringServer.tsType();

      var subscriptionCommand1 = {
        entityType: entityType,
        entityId: entityId,
        keys: tsType.attr
      };

      var subscriber = {
          subscriptionCommands: [subscriptionCommand1],
          type: 'attrSub'
      };

      subscriber.onReconnected = function() {}
      subscriber['onData'] = function(data) {
          if (data.data) {
              _this.onData(data, true);
          }
      }

      websocket.subscribe(subscriber,function(data){
        _this.attrSubList=data;
      });
    },
    onData(data,type){//实时获取到数据填充
      var errorCode=data.errorCode;
      if(errorCode==0){
        var info=data.data;
        var received_info = {};
        for(let k in info){
          received_info = info[k];
          received_info['ts'] = parseInt(k);
          break;
        }

        if(!received_info.active){
          received_info['cmdId']=data.subscriptionId;
          this.locationState = received_info;
          
          if(this.firstEnter){
            this.setCenter(received_info);
            this.firstEnter = false;
          }
        }else{
          received_info['cmdId']=data.subscriptionId;
          this.attributeState = received_info;
        }
      }
      
    },
    unwebsocket(){//删除实时监控
      var subscriber = {
          subscriptionCommands: this.tsScriberList,
          type: 'tsScriber'
      };
      var subscriber2 = {
          subscriptionCommands: this.attrSubList,
          type: 'attrSub'
      };
      // console.log(subscriber)
      websocket.unsubscribe(subscriber);
      websocket.unsubscribe(subscriber2);
    },
    mapLock(){
      this.$nextTick(() => {
        var map = this.$refs.map?this.$refs.map.mapObject:null;
        if(!map)return;
        map.dragging.disable();
        map.touchZoom.disable();
        map.doubleClickZoom.disable();
        map.boxZoom.disable();
        map.scrollWheelZoom.disable();
        map.keyboard.disable();
      });
    },
    setCenter(data){
      var latitude = data.latitude?data.latitude:0;
      var longitude = data.longitude?data.longitude:0;
      if(latitude&&longitude){
        this.$nextTick(() => {
          var map = this.$refs.map?this.$refs.map.mapObject:null;
          if(!map)return;
          map.setView([latitude, longitude], 17);
        })
      }else{
        this.getBounds();
      }
    },
  },
  destroyed() {
    this.unwebsocket();
    this.locationState={};
    this.attributeState={};
  }

}
</script>

<style lang='scss' scoped>
.live-location{
    background: #000;
    min-height: 200px;
    position: absolute;
    bottom: $marginWidth;
    top: 0;
    left: $marginWidth;
    right: $marginWidth;
    .leaflet-container{
      height: calc(100% - 50px);
    }
}
</style>
