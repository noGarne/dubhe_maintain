<template>
<div class="working_content">
  <el-container class="working_content_c">
    <el-aside :style="{'display':editDate.processing?'none':'block'}">
      <list 
        ref="refList" 
        :boundayList="boundayList"
        @setBoundayList="setBoundayList"
        @setUploadDetails="setUploadDetails"></list>
    </el-aside>
    <el-container>
      <router-view 
        :uploadDetails="uploadDetails"
        :boundayList="boundayList"
        @getList="getList"
        @updateList="updateList"
        @showAlarmInfo="showAlarmInfo"/>
    
      <alarm-notify ref="alarmNotify" v-show="!editDate.processing"></alarm-notify> 
    </el-container>
  </el-container>
</div>

</template>

<script>
import List from "./components/List";
// const AlarmNotify=()=>import('./components/AlarmNotify.vue')
const AlarmNotify=()=>import('../common/components/AlarmNotify')

export default {
  name: "UnloadAeraMovement",
  components: {
    List,
    AlarmNotify
  },
  data() {
    return {
      boundayList: [],
      uploadDetails:null,
      timer:null
    };
  },
  computed:{
    editDate(){
      var processing = this.$route.query.processing;
      var data = {}
      if(processing){
        var data = {
          processing
        }
      }
      return data;
    },
    // processing(){
    //   var processing = this.$route.query.processing;
    //   if(processing){
    //     return true;
    //   }else{
    //     return false;
    //   }
    // }
  },
  watch: {
    $route(to, from) {
      if(to.params.id==-1){
        this.setUploadDetails(null)
      }
    },
  },
  mounted(){
    this.mySetInterval(()=>{
      this.getList(true);
    },10000)
  },
  methods: {
    clearTimer(){
      clearTimeout(this.timer);
      this.timer=null;
    },
    showAlarmInfo(){
      if(this.$refs.alarmNotify)this.$refs.alarmNotify.showAlarmInfo();
    },
    mySetInterval(fn, millisec){
      var _this = this;
      function interval(){
        _this.timer = setTimeout(interval, millisec);
        fn();
      }
      _this.timer = setTimeout(interval, millisec)
    },
    updateState(workStatus){
      var active = this.$refs.refList.active;
      var activeType = this.$route.query.activeType;
      var workStatusValue = this.utils.getObjValByKey(this.vars.workingStatusList,workStatus,'type','code');
      // console.log(workStatus,workStatusValue,active);
      if(activeType==2){
        if(
          this.boundayList[active[0]]&&
          this.boundayList[active[0]].parkGrps[active[1]]
        ){
          this.boundayList[active[0]].parkGrps[active[1]].workStatus=workStatus;
          this.boundayList[active[0]].parkGrps[active[1]].workStatusValue=workStatusValue;
          this.boundayList[active[0]].parkGrps[active[1]].parkSpaces.forEach((e)=>{
            if(e.workStatusValue!=2){
              e.workStatus=workStatus;
              e.workStatusValue=workStatusValue;
            }
          })
        }
      }else if(activeType==3){
        this.$nextTick(()=>{
          if(
            this.boundayList[active[0]]&&
            this.boundayList[active[0]].parkGrps[active[1]]&&
            this.boundayList[active[0]].parkGrps[active[1]].parkSpaces[active[2]]
          ){
            this.boundayList[active[0]].parkGrps[active[1]].parkSpaces[active[2]].workStatus=workStatus;
            this.boundayList[active[0]].parkGrps[active[1]].parkSpaces[active[2]].workStatusValue=workStatusValue;
          }
        })
      }
    },
    
    getList(refresh){
      if(this.$refs.refList)this.$refs.refList.getList(refresh);
    },
    setBoundayList(data){
      this.boundayList = data;
    },
    setUploadDetails(data){
      this.uploadDetails=data;
    },
    updateList(data){
      this.getList();
    },
  },
  beforeDestroy(){
    this.clearTimer();
  }
};
</script>

<style lang="scss" scoped>
</style>
