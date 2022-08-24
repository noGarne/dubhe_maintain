<template>
    <!-- 实时位置 -->
    <div class="live-location">
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
                v-if="detailsInfo.position"
                :lat-lng="detailsInfo.position"
                >
                  <l-icon 
                    class="someCustomClasses" 
                    :icon-anchor="[0, 0]">
                    <div class="icon_devices" 
                      :class="sizeClass">
                      <!-- 标题 -->
                      
                      <div class="device-title-status" :title="detailsInfo.truckName">
                        <div class="device-title-bg">
                          {{detailsInfo.truckName}}
                          <span class="device-line0"></span>
                          <span class="device-line1"></span>
                          <span class="device-line2"></span>
                          <span class="device-line3"></span>
                          <span class="device-line4"></span>
                          <span class="device-line5"></span>
                          <span class="device-line6"></span>
                        </div>
                        <span 
                          class="device-title-icon" 
                          :class="iconBgColor(
                              'true',
                              4,
                              4,
                              'device-title-icon')">
                          <i class="iconfont" :class="iconImgShow({showTypeSn:1})"></i>
                        </span>
                      </div>
                  
                    <!-- 在线 -->
                    <img 
                      key="online" 
                      class="devices_alarm" 
                      :src="iconImg({showTypeSn:1},1).iconImg"
                      :style="{ 
                        transform: 'rotateZ('+direction({showTypeSn:1},detailsInfo.direction)+'deg)'}">
                    </div>
                  </l-icon>
                  <l-popup ref="popup">
                    <div class="truck-popup devies-popup">
                      <h4>{{$t('monitoring.vehicle-info')}}</h4>
                      <div class="popupTable">
                        <table>
                          <tr>
                            <!-- 经度 -->
                            <td>{{$t('monitoring.latitude')}}</td>
                            <td>{{detailsInfo.position[1]+'°'}}</td>
                          </tr>
                          <tr>
                            <!-- 纬度 -->
                            <td>{{$t('monitoring.longitude')}}</td>
                            <td>{{detailsInfo.position[0]+'°'}}</td>
                          </tr>
                          <tr>
                            <!-- 航向角 -->
                            <td>{{$t('monitoring.direction')}}</td>
                            <td>{{detailsInfo.direction?idToFixed(detailsInfo.direction,2):""}}</td>
                          </tr>
                        </table>
                      </div>
                    </div>
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

export default {
  name:'LiveLocation',
  props:['detailsInfo'],
  components:{
    
  },
  mixins: [mapMixins,leafletMixins,deviceIconMixins],
  data() {
    return {
      attribution: '调度位置',
      devicesDetails:{},
      locationState:{},
      attributeState:{},
      firstEnter:true,
      tsScriberList:[],
      attrSubList:[],
    }
  },
  mounted(){
    // this.getDevicesDetail();
  },
  watch:{
    detailsInfo: {
      handler(n,o) {
        this.setCenter(n)
      },
      immediate: true
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
    idToFixed(data,num){
      return (data,num)=>{
        return parseFloat(data).toFixed(num)
      }
    }
  },
  methods: {
    setCenter(data){
      console.log(data);
      var latitude = data.position[0]?data.position[0]:0;
      var longitude = data.position[1]?data.position[1]:0;
      if(latitude&&longitude){
        this.$nextTick(() => {
          var map = this.$refs.map?this.$refs.map.mapObject:null;
          if(!map)return;
          map.setView([latitude, longitude], 17);
        })
      }else{
        this.getBounds();
      }
    }
  },
  destroyed() {
    this.locationState={};
    
  }

}
</script>

<style lang='scss' scoped>
@import '../monitoring/css/monitoring';

.live-location{
    background: #000;
    min-height: 200px;
    position: absolute;
    bottom: $marginWidth;
    top: 15px;
    left: $marginWidth;
    right: $marginWidth;
    .leaflet-container{
      height: calc(100% - 50px);
    }
}
</style>
