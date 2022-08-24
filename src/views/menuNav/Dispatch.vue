<template>
<!-- 智能调度 -->
<div class="dispatch-wraper">
  <router-view></router-view>
  <alarm-notify></alarm-notify>
</div>
</template>

<script>

const AlarmNotify=()=>import('../../components/dispatch/AlarmNotify.vue')
export default {
  name:'Dispatch',
  components:{
    AlarmNotify
  },
  data(){
    return{
      
    }
  }
}
</script>

<style lang="scss">
.dispatch-wraper{
  // position: absolute;
  // left: 0;
  // top: 0;
  // right: 0;
  // bottom: 0;
  height: calc(100% - #{$breadcrumbHeight});
  width: 100%;
  background-color: $hearderBg;
  .table_content{
    height: 100% !important;
  }
}
</style>
