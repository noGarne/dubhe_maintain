<template>
    <!-- 矿卡详情 -->
  <base-right-detail v-if="isDialogShow" :topHeight="false">
    <div slot="header">
      
      <div class="right_header">
        <h3 class="right_header_title" style="flex: 1">{{detailsInfo.truckName}}</h3>
      </div>
    </div>
    <div slot="close"><span class="right_details_close" @click="resourceShow"><i class="iconfont icon-guanbi"></i></span></div>
    <div class="log-postion-w">
      <el-tabs value="position" type="card">
        <!-- 信息设定 -->
        <el-tab-pane :label="$t('dispatch.location')" name="position">
          <location-map ref="LocationMap" :detailsInfo="detailsInfo"></location-map>
        </el-tab-pane>
      </el-tabs>
    </div>
  </base-right-detail>
</template>
<script>

import dispatchMixin from '@/common/mixins/dispatch.mixins.js';

const LocationMap=()=>import('./LocationMap.vue')

export default {
  name: 'DispatchTruck',
  mixins:[dispatchMixin],
  components:{
      LocationMap
  },
  data(){
    return {
      isDialogShow:false,
      isTopHeight:true,
      detailsInfo:{},
      deviceInfo:{},
      currentLocation:{
        positionName:"",
        positionId:""
      },
      
    }
  },
  computed:{
      
    
  },
  methods:{
    resourceShow () {
      this.isDialogShow=false;
    },
    async getDetails(data){
        
        this.isDialogShow=true;

        this.detailsInfo = data;

        var positon = data.positionInfo?JSON.parse(JSON.parse(JSON.stringify(data.positionInfo))):{};
        var latitude = positon.endLat?positon.endLat:0;
        var longitude = positon.endLon?positon.endLon:0;
        var direction = positon.endDirection?positon.endDirection:0;

        this.detailsInfo['position']=[latitude,longitude]
        this.detailsInfo['direction']=direction;
        
        // this.$nextTick(() => {
        //   this.$refs.LocationMap.setCenter(positon)
        // })
    },
    
  }
}
</script>


<style lang="scss">
.log-postion-w{
  height: 100%;
}
</style>
