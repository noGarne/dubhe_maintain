<template>
    <div class="truck-popup devies-popup">
      <h4>{{$t('monitoring.vehicle-info')}}</h4>
      <div class="popupTable">
        <table>
          <tr>
            <!-- 车辆名称 -->
            <td>{{$t('monitoring.vehicle-name')}}</td>
            <td>{{truckName}}</td>
          </tr>
          <tr>
            <!-- 最后上数时间 -->
            <td>{{$t('monitoring.last-time')}}</td>
            <td v-if="currentTs.ts && currentTs.ts<10000000000000">{{currentTs.ts | formatDate}}</td>
            <td v-else>{{currentTs.ts}}</td>
          </tr>
          <tr>
            <!-- 经度 -->
            <td>{{$t('monitoring.latitude')}}</td>
            <td>{{currentTs.longitude?currentTs.longitude+'°':""}}</td>
          </tr>
          <tr>
            <!-- 纬度 -->
            <td>{{$t('monitoring.longitude')}}</td>
            <td>{{currentTs.latitude?currentTs.latitude+'°':""}}</td>
          </tr>
          <tr>
            <!-- 高程 -->
            <td>{{$t('monitoring.altitude')}}</td>
            <td>{{currentTs.altitude?idToFixed(currentTs.altitude,2)+'m':""}}</td>
          </tr>
          <tr>
            <!-- 航向角 -->
            <td>{{$t('monitoring.direction')}}</td>
            <td>{{currentTs.direction?idToFixed(currentTs.direction,2):""}}</td>
          </tr>
          <tr>
            <!--横摆角速度  -->
            <td>{{$t('monitoring.yawAngularAcceleration')}}</td>
            <td>{{currentTs.yawAngularAcceleration?idToFixed(currentTs.yawAngularAcceleration,2)+'度/秒':""}}</td>
          </tr>
        </table>
      </div>
    </div>
</template>
<script>
export default {
  name: 'TruckPopup',
  props:{
    currentTs: {
      type: Object,
      default: {}
    },
    truckName:{
      type: String,
      default: ''
    }
  },
  data () {
    return {
        
    }
  },
  watch:{
      
  },
  computed: {
    idToFixed(data,num){
      return (data,num)=>{
        return parseFloat(data).toFixed(num)
      }
    }
  },
  mounted(){
      
  },
  methods: {
      
  },
  destroyed() {
    
  }
}
</script>
 
<style lang="scss" scoped>
@import '../monitoring/css/monitoring';

</style>
