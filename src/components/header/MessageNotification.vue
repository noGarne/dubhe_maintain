<template>
  <!-- 消息提醒 -->
  <div @click="showAlarmInfo">
    <el-badge :value="messageNum" :max="99" class="item" :hidden="!messageNum">
      <span class="user-email el-dropdown-link" title="系统消息">
          <i class="iconfont icon-tongzhi user-header"></i>
      </span>
    </el-badge>
    <alarm-info ref="alarmInfo"></alarm-info>
  </div>
</template>
<script>

import websocket from '../../api/websocket';

const AlarmInfo=()=>import('./AlarmInfo')
export default {
  name:"MessageNotification",
  components:{
    AlarmInfo
  },
  data(){
    return {
      messageNum:0,
      cancelList:[],
    }
  },
  computed:{

  },
  watch: {
    
  },
  created(){
  },
  mounted(){
    this.getwebsocket();
  },
  methods:{
    showAlarmInfo(){
      if(this.$refs.alarmInfo)this.$refs.alarmInfo.toggleDialog();
    },
    getwebsocket(){//消息订阅
      var _this=this;
      var systemAlarmCommands = {
          entityType: this.vars.systemAlarmTypeList[0].type
      };

      var subscriber = {
          systemAlarmCommands: [systemAlarmCommands],
          type: 'systemAlarm'
      };
      // console.log(subscriber);

      subscriber.onReconnected = function() {}
      subscriber['onData'] = function(data) {
          if (data.data) {

              _this.onData(data);
          }
      }
      
      websocket.subscribe(subscriber,function(data){
          _this.cancelList = data;
      });
    },
    onData(data){//实时获取到数据填充
      // console.log(data);
      var info = data.data||{};
      if(info.hasOwnProperty('newSystemAlarm')){
        var newSystemAlarm = info.newSystemAlarm;
        this.messageNum=(newSystemAlarm[newSystemAlarm.length>0?newSystemAlarm.length-1:0]||{}).unreadMsgNum;
      }else if(info.hasOwnProperty('removeSystemAlarm')){
        var removeSystemAlarm = info.removeSystemAlarm;
        this.messageNum=(removeSystemAlarm[removeSystemAlarm.length>0?removeSystemAlarm.length-1:0]||{}).unreadMsgNum;
      }
      
    },
    unwebsocket(){//取消订阅
        var _this=this;
        if(_this.cancelList.length>0){
            var subscriber = {
                systemAlarmCommands: _this.cancelList,
                type: 'systemAlarm'
            };

            websocket.unsubscribe(subscriber);
        }
    },
  },
  beforeDestroy(){
    this.unwebsocket();
  }
}
</script>
<style lang="scss" scoped>

</style>

<style lang="scss">

</style>

