<template>
  <!-- 调度中心-左边设备 -->
  <div class="dispatch-left-content">
    <!-- 卡车 -->
    <div class="dispatch-device" :class="{'current-device':currentDevice == vars.showTypeList[0].id}" :title="$t('action.truck')" @click="showDevice(vars.showTypeList[0].id)">
      <img src="../../common/images/type-kache.png" alt="">
      <p class="title">{{$t('action.truck')}}</p>
      <p class="num"><span class="num-value">{{deviceInfo.truckNum}}</span></p>
    </div>
    <!-- 采装设备 -->
    <div class="dispatch-device" :class="{'current-device':currentDevice == vars.showTypeList[1].id}" :title="$t('action.digger')" @click="showDevice(vars.showTypeList[1].id)">
      <!-- <img src="../../common/images/type-dianchan.png" alt=""> -->
      <img src="../../common/images/type-dianchan2.png" alt="">
      <p class="title">{{$t('action.digger')}}</p>
      <p class="num"><span class="num-value">{{deviceInfo.shovelNum}}</span></p>
    </div>
    <!-- 卸点 -->
    <div class="dispatch-device" :class="{'current-device':currentDevice == vars.showTypeList[2].id}" :title="$t('action.dump')" @click="showDevice(vars.showTypeList[2].id)">
      <img src="../../common/images/type-xiedian.png" alt="">
      <p class="title">{{$t('action.dump')}}</p>
      <p class="num"><span class="num-value">{{deviceInfo.dumpNum}}</span></p>
    </div>
    <!-- 辅助 -->
    <div class="dispatch-device" :class="{'current-device':currentDevice == vars.showTypeList[3].id}" :title="$t('action.assist')" @click="showDevice(vars.showTypeList[3].id)">
      <img src="../../common/images/type-fuzhu.png" alt="">
      <p class="title">{{$t('action.assist')}}</p>
      <p class="num"><span class="num-value">{{deviceInfo.assistNum}}</span></p>
    </div>
  </div>
</template>

<script>
  export default {
    props:['deviceInfo','currentType'],
    data(){
      return{
        currentDevice:0
      }
    },
    watch:{
      currentDevice(){
        return this.currentType;
      }
    },
    methods:{
      showDevice(v){
        this.currentDevice = v;
        this.$parent.setDeviceType(v);
      }
    }
  }
</script>

<style lang="scss" scoped>
.dispatch-left-content{
  .dispatch-device{
    @include theme-border-color;
    border-bottom: 1px solid $borderBlack;
    padding: 10px 0;
    text-align: center;
    line-height: 22px;
    font-size: 12px;
    cursor: pointer;
    overflow: hidden;
    &:hover,&.current-device{
      @include theme-content-bg;
    }
    .title{
      @include device-type-name-color;
      margin: -6px 0 4px 0;
    }
    .num{
      color: $textWhiteColor;
      .num-value{
        display: inline-block;
        @include device-type-num-bg;
        padding: 0 4px;
      }
    }
  }
}
</style>