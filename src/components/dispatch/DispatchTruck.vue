<template>
    <!-- 矿卡详情 -->
  <base-right-detail v-if="isDialogShow" :topHeight="isTopHeight">
    <div slot="header">
      <div class="right_header">
        <h3 class="right_header_title" style="flex: 1">{{detailsInfo.truckName}}</h3>
      </div>
    </div>
    <div slot="close"><span class="right_details_close" @click="resourceShow"><i class="iconfont icon-guanbi"></i></span></div>
    <div class="dispatch_content">
      <el-tabs v-model="currentTab" type="card">
        <!-- 信息设定 -->
        <el-tab-pane :label="$t('dispatch.info-set')" name="tab-detail">
          <div class="message_set">
              <div :class="{disabled:disabledDispatchEdit||!signalStatus}" @click="getSafeStop(disabledDispatchEdit||!signalStatus)">
                  <!-- 安全停车 -->
                  <h4 :class="{'dispatch-btn-red':!disabledDispatchEdit && signalStatus}">{{$t("dispatch.safe-stop")}}</h4>
              </div>
              <div class="hidden">
                  <h4></h4>
              </div>
              <div class="hidden">
                  <h4></h4>
              </div>
            <!-- 临时指派 -->
            <div class="" :class="{disabled:disabledDispatchEdit||!temporaryAssigned||!signalStatus}" @click="getTemporary(disabledDispatchEdit||!temporaryAssigned||!signalStatus)">
                <h4 :class="{'dispatch-btn-orange':!disabledDispatchEdit && temporaryAssigned && signalStatus}">临时指派</h4>
            </div>
            <!-- 取消调度任务 -->
            <div :class="{disabled:(disabledDispatchEdit||!detailsInfo.dispatchingObjectName)}" @click="!(disabledDispatchEdit||!detailsInfo.dispatchingObjectName)?deleteDispatchTarget():''">
                <h4 :class="{'dispatch-btn-orange':!disabledDispatchEdit && detailsInfo.dispatchingObjectName}">取消调度任务</h4>
            </div>
            <!-- 清除车辆占用 -->
            <div :class="{disabled:(disabledDispatchEdit||!isClearOccupy)}" @click="!(disabledDispatchEdit||!isClearOccupy)?clearTruckOccupy():''">
                <h4 :class="{'dispatch-btn-orange':!disabledDispatchEdit && isClearOccupy}">清除车辆占用</h4>
            </div>
            <div class="height-line3 disabled">
              <!-- 通讯定位 -->
              <h4>{{$t("dispatch.communication-location")}}</h4>
              <div>
                  <p>{{$t("dispatch.communication-status")}}：<span>{{(signalStatus ? '在线' : '离线')}}</span></p>
                  <p>{{$t("dispatch.location-status")}}：<span>{{utils.getObjValByKey(vars.locationStatus,detailsInfo.locationStatus)||'未定位'}}</span></p>
              </div>
            </div>
            <div class="height-line3 disabled">
              <!-- 设备信息 -->
              <h4>{{$t("dispatch.device-info")}}</h4>
              <div>
                  <!-- 工作状态 -->
                  <p>{{$t("dispatch.work-status")}}：<span>{{utils.getObjValByKey(vars.loadStatus,detailsInfo.loadStatus,'value','name')}}</span></p>
                  <!-- 驾驶模式 -->
                  <p>{{$t("dispatch.drive-mode")}}：<span>{{detailsInfo.drivingMode?utils.getObjValByKey(vars.drivingMode,detailsInfo.drivingMode,'type'):$t('action.null')}}</span></p>
                  <!-- 运输模式 -->
                  <p>{{$t("dispatch.transport-mode")}}：<span>{{detailsInfo.taskDriveMode?utils.getObjValByKey(taskDriveMode,detailsInfo.taskDriveMode):$t('action.null')}}</span></p>
              </div>
            </div>
            <div class="height-line3 disabled">
              <!-- 调度信息 -->
              <h4>{{$t("dispatch.dispatch-msg")}}</h4>
              <div>
                  <p>{{$t("dispatch.dispatch-target")}}：<span>{{detailsInfo.dispatchingObjectName?detailsInfo.dispatchingObjectName:$t('action.null')}}</span></p>
                  <p>{{$t("dispatch.dispatch-type")}}：<span>{{jobType?utils.getObjValByKey(dispatchTaskType,jobType,'value','text'):$t('action.null')}}</span></p>
                  <p>{{$t("dispatch.dispatch-mode")}}：<span>{{detailsInfo.dispatchingType?utils.getObjValByKey(vars.dispatchingMode,detailsInfo.dispatchingType,'type'):$t('action.null')}}</span></p>
              </div>
            </div>

            
            <div class="height-line3" :class="{disabled:disabledDispatchEdit}" @click="!disabledDispatchEdit?setDeviceStatus():''">
              <!-- 设备状态 -->
              <h4>{{$t("dispatch.operationType")}}</h4>
              <div v-if="detailsInfo.status">
                  <p>{{$t('dispatch-set.status')}}：<span>{{utils.getObjValByKey(vars.runStatus,detailsInfo.status.equStatus,'code')}}</span></p>
                  <p v-if="detailsInfo.status.startTimeStr">{{$t('dispatch.start-time')}}：<span>{{detailsInfo.status.startTimeStr}}</span></p>
                  <p v-if="detailsInfo.status.reasonName">{{$t('dispatch.device-operation-reason')}}：<span>{{detailsInfo.status.reasonName}}</span></p>
                  <p v-if="detailsInfo.status.planDuration">{{$t('dispatch.device-status-duration')}}：<span>{{detailsInfo.status.planDuration}}{{$t('dispatch.second')}}</span></p>
                  <p v-if="detailsInfo.status.reasonComment">{{$t('dispatch.device-operation-remark')}}：<span>{{detailsInfo.status.reasonComment}}</span></p>
              </div>
              <div v-else>
                <p>{{$t('action.null')}}</p>
              </div>
            </div>

            <div class="height-line3" :class="{disabled:disabledDispatchEdit}" @click="!disabledDispatchEdit?setDispatchStatus():''">
              <!-- 派遣状态 -->
              <h4>{{$t("dispatch.dispatch-status")}}</h4>
              <div>
                <p>
                    {{$t("dispatch.current-status")}}：<span>{{getStopDispatch(utils.getObjValByKey(vars.stopDispatch,detailsInfo.stopDispatch,'type'))}}</span>
                </p>
              </div>
            </div>
            
            <div class="height-line3" :class="{disabled:disabledDispatchEdit}" @click="!disabledDispatchEdit?setDevicesDriver():''">
              <!-- 司机 -->
              <h4>{{$t("dispatch.driver")}}</h4>
              <div v-if="detailsInfo.drivers">
                <p>{{$t('dispatch.main-driver')}}：<span>{{detailsInfo.drivers.mainDriverName?detailsInfo.drivers.mainDriverName:$t('action.null')}}</span></p>
                <!-- <p>副司机：{{detailsInfo.drivers.subDriverName?detailsInfo.drivers.subDriverName:$t('action.null')}}</p> -->
                <p v-if="detailsInfo.drivers.loginTime">{{$t('dispatch.login-time')}}：<span>{{detailsInfo.drivers.loginTime | formatDate}}</span></p>
                <p v-else>{{$t('dispatch.login-time')}}：<span>{{$t('action.null')}}</span></p>
              </div>
            </div>
            
            <div :class="{disabled:disabledDispatchEdit}" @click="!disabledDispatchEdit?setTruckLocked():''">
              <!-- 锁定 -->
              <h4>{{$t("dispatch.info-group")}}</h4>
              <div v-if="detailsInfo.rule">
                  <p>{{$t("dispatch.info-digger")}}：<span>{{getBanName(detailsInfo.rule.lock.truckToShovel)}}</span></p>
                  <p>{{$t("dispatch.info-dumparea")}}：<span>{{getBanName(detailsInfo.rule.lock.truckToDumpArea)}}</span></p>
                  <p>{{$t("dispatch.info-material")}}：<span>{{getBanName(detailsInfo.rule.lock.truckToMaterial)}}</span></p>
              </div>
            </div>
            <div :class="{disabled:disabledDispatchEdit}" @click="!disabledDispatchEdit?setTruckForbidden():''">
                <!-- 禁止 -->
              <h4>{{$t("dispatch.info-limit")}}</h4>
              <div v-if="detailsInfo.rule">
                  <p>{{$t("dispatch.info-digger")}}：<span>{{getBanName(detailsInfo.rule.ban.truckToShovel)}}</span></p>
                  <p>{{$t("dispatch.info-dumparea")}}：<span>{{getBanName(detailsInfo.rule.ban.truckToDumpArea)}}</span></p>
                  <p>{{$t("dispatch.info-material")}}：<span>{{getBanName(detailsInfo.rule.ban.truckToMaterial)}}</span></p>
              </div>
            </div>
            <div :class="{disabled:disabledDispatchEdit}" @click="!disabledDispatchEdit?setBasicParameter():''">
              <!-- 基本参数 -->
              <h4>{{$t("dispatch.base-parameter")}}</h4>
              <div v-if="detailsInfo.devParams">
                  <!-- 额定载重 -->
                  <p>{{$t('device.rated-load')}}：<span>{{detailsInfo.devParams.ratedLoad+" "+$t('dispatch.ton')}}</span></p>
                  <!-- 装矿载重 -->
                  <p>{{$t('device.ore-load')}}：<span>{{detailsInfo.parameter.loadMineWeight==null?$t('action.null'):(detailsInfo.parameter.loadMineWeight+" "+$t('dispatch.ton'))}}</span></p>
                  <!-- 装岩载重 -->
                  <p>{{$t('device.rock-load')}}：<span>{{detailsInfo.parameter.loadWasteWeight==null?$t('action.null'):(detailsInfo.parameter.loadWasteWeight+" "+$t('dispatch.ton'))}}</span></p>
                  <!-- 车厢容积 -->
                  <p>{{$t('device.vehicle-volume')}}：<span>{{detailsInfo.devParams.carriageVolume+" "+$t('dispatch.stere')}}</span></p>
                  <!-- 总长 -->
                  <p>{{$t('device.vehicle-length')}}：<span>{{detailsInfo.devParams.totalLength+" "+$t('dispatch.meter')}}</span></p>
                  <!-- 总宽 -->
                  <p>{{$t('device.vehicle-width')}}：<span>{{detailsInfo.devParams.totalWidth+" "+$t('dispatch.meter')}}</span></p>
                  <!-- 总高 -->
                  <p>{{$t('device.vehicle-height')}}：<span>{{detailsInfo.devParams.totalHight+" "+$t('dispatch.meter')}}</span></p>
                  <!-- 最小转弯半径 -->
                  <p>{{$t('device.min-turning-raduis')}}：<span>{{detailsInfo.devParams.minTurnRadius+" "+$t('dispatch.meter')}}</span></p>
                  <!-- 折算系数 -->
                  <p>{{$t('dispatch.discount-num')}}：<span>{{detailsInfo.parameter.conversionRate}}</span></p>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <!-- 终端操作 -->
        <el-tab-pane :label="$t('dispatch.device-operation')" name="tab-zhongduan">
          <device-operation :detailsInfo="detailsInfo" @updateStatus="updateStatus"></device-operation>
        </el-tab-pane>
        <!-- 调度历史 -->
        <el-tab-pane :label="$t('dispatch.dispatch-log')" name="tab-diaodu">
          <dispatch-log :detailsInfo="detailsInfo"></dispatch-log>
        </el-tab-pane>
        <!-- 实时位置 -->
        <el-tab-pane :label="$t('dispatch.live-location')" name="tab-shishi">
          <live-location :detailsInfo="detailsInfo" v-if="currentTab=='tab-shishi'"></live-location>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 临时派遣 -->
    <temporary ref="temporary" @setTemporary="setTemporary"></temporary>
    <lock-truck ref="lockTruck" @updateTruckRule="updateTruckRule"></lock-truck>
    <forbidden-truck ref="forbiddenTruck" @updateTruckRule="updateTruckRule"></forbidden-truck>
    <!-- <set-location ref="truckPostion" @updateCurrentTruckPosition="updateCurrentTruckPosition"></set-location> -->
    <basic-parameter ref="basicParameter" @updateBasicParameter="updateBasicParameter"></basic-parameter>
    <!-- 矿卡司机 -->
    <devices-driver ref="devicesDriver" @updateDevicesDriver="updateDevicesDriver"></devices-driver>
    <device-status ref="devicesStatus" @updateStatus="updateStatus"></device-status>
    <!-- 当前物料 -->
    <!-- <material-setting ref="materialSetting" @updateCurrentMaterial="updateCurrentMaterial"></material-setting> -->
    <!-- 派遣状态 -->
    <dispatch-status ref="dispatchStatus" @updateCurrentStatus="updateCurrentStatus"></dispatch-status>
  </base-right-detail>
</template>
<script>

import dispatchServer from '@/api/dispatch.server.js';
import dispatchOperateServer from '@/api/dispatchOperate.server'
import dispatchMixin from '@/common/mixins/dispatch.mixins.js';
import devicesServer from '../../api/devices.server';
// import dispatchSetServer from '../../api/dispatchSet.server';

const Temporary=()=>import('./Temporary.vue')
const LockTruck=()=>import('./LockTruck.vue')
const ForbiddenTruck=()=>import('./ForbiddenTruck.vue')
const DeviceOperation=()=>import('./DeviceOperation.vue')
const LiveLocation=()=>import('./LiveLocation.vue')
const DispatchLog=()=>import('./DispatchLog.vue')
const BasicParameter=()=>import('../dispatchSet/EditOther.vue')
const DevicesDriver=()=>import('../dispatchSet/EditDriver.vue')
const DeviceStatus=()=>import('../dispatchSet/DeviceStatus.vue')
// const MaterialSetting=()=>import('../dispatchSet/MaterialSetting.vue')
const DispatchStatus=()=>import('../dispatchSet/DispatchStatus.vue')

export default {
  name: 'DispatchTruck',
  mixins:[dispatchMixin],
  components:{
      LockTruck,
      ForbiddenTruck,
      DeviceOperation,
      LiveLocation,
      DispatchLog,
      BasicParameter,
      DeviceStatus,
      // MaterialSetting,
      DevicesDriver,
      Temporary,
      DispatchStatus
  },
  data(){
    return {
      currentTab:"tab-detail",
      isDialogShow:false,
      isTopHeight:true,
      detailsInfo:{},
      deviceStatus:{},
      driveMode:'',
      deviceInfo:{},
      currentLocation:{
        positionName:"",
        positionId:""
      },
      currentBasicParameter:{//基本参数
        conversionRate:"",//折算系数
        mineQuantity:"",//矿产
        stripQuantity:"",//剥离
        speedParam:""//速度参数
      },
      truckDriver:{//司机
        mainDriverName:"",
        subDriverName:"",
        loginTime:"",
      },
      timer:null,
      signalStatus:false,//通信状态
      dispatchTarget:"",//调度目标
      jobType:"",
      currentMaterail:{},//当前物料
    }
  },
  computed:{
    temporaryAssigned(){
      return this.detailsInfo.status?(this.detailsInfo.status.equStatus==this.vars.runStatus[0].code||this.detailsInfo.status.equStatus==this.vars.runStatus[1].code):false;
    },
    isClearOccupy(){
      // 离线
      return !this.signalStatus;
    },
  },
  beforeDestroy() {
    this.clearIntervalClear()
  },
  methods:{
    resourceShow () {
      this.isDialogShow=false;
      this.currentTab="tab-detail",
      this.clearIntervalClear();
    },
    async getDetails(deviceId,show,isFullscreen){
      this.isTopHeight=isFullscreen;
      this.isDialogShow=true;
      this.getDeviceDetail(deviceId);
      
      this.clearIntervalClear()

      this.mySetIntervalTruck(() => {
        // 定时刷新
        this.getDeviceDetail(deviceId);
      }, 5000);

    },
    
    mySetIntervalTruck(fn, millisec){
      var _this = this;
      function interval(){
        _this.timer = setTimeout(interval, millisec);
        fn();
      }
      _this.timer = setTimeout(interval, millisec)
    },
    clearIntervalClear(){
      clearInterval(this.timer);
      this.timer = null;
    },
    
    async getDeviceDetail(deviceId){
         try {
            var result = await dispatchServer.getDeviceDetail(deviceId);
            this.detailsInfo = result;

            //通信状态
            this.getSignalStatus(deviceId);
            // 工作状态
            this.getCurrentTasks();
            // 设置上报位置
            // this.getDevicePosition(deviceId);

        } catch (e) {
            this.messages.error(e.message);
        }
    },
    // async getDevicePosition(deviceId){
    //   try {
    //     let res = await dispatchServer.getDevicePosition(deviceId);
    //     console.log(res);
    //     this.truckStop = res.runState == 1 ? true : false
    //   } catch (e) {
    //       this.messages.error(e.message);
    //     }
    // },
    async getCurrentTasks(){
       try {
         if(!this.subareaId)return;
          var resultTask= await dispatchServer.getTruckCurrentTasks(this.subareaId);
          this.jobType = "";
          for(let i =0;i<resultTask.length;i++){
            if(resultTask[i].truckId==this.detailsInfo.deviceId){
              if(resultTask[i].toId){
                this.jobType = resultTask[i].jobType;
              }else{

                this.jobType="";
              }
              this.detailsInfo['jobType']=resultTask[i].jobType;
              break;
            }
          }
        } catch (e) {
            this.messages.error(e.message);
        }
    },
    getTemporary(v){
      console.log(v);
      if(!v){
        this.$refs.temporary.getInfo(this.detailsInfo,'dispatch');
      }
    },
    setTemporary(id){
      this.getDeviceDetail(id);
      this.$parent.getList();
    },
    async getSignalStatus(deviceId){
      //通讯状态
       try {
          var result = await dispatchServer.getDeviceSignalStatus(deviceId);
          this.signalStatus=result.active;
        } catch (e) {
            this.messages.error(e.message);
        }
    },
    deleteDispatchTarget(){
      // console.log('调度目标')
      // this.$refs.dispatchTarget.getList(this.detailsInfo);
      this.$messageConfirm.showConfirm({
        content:`确定要取消“${this.detailsInfo.truckName}”到“${this.detailsInfo.dispatchingObjectName}”的调度任务吗？`,
        // detail:'提示详情'
      },async ()=>{
        // 确定操作
        try {
            var result=await dispatchServer.deleteTarget(this.detailsInfo.deviceId);
            // 删除调度目标后
            this.detailsInfo.dispatchingObjectName="";
            this.$parent.getList();
            this.messages.success(this.$t('action.operate-success'));
        } catch (e) {
            this.messages.error(e.message);
        }
      });
    },
    setDevicesDriver(){
      var detailsInfo = this.detailsInfo;
      var info = detailsInfo.drivers;
      info.equipmentTypeId = detailsInfo.deviceId;
      info.equipmentTypeSn = this.vars.deviceType[0].id;
      info.equipmentSn = detailsInfo.truckSn;
      info.equipmentName = detailsInfo.truckName;
      
      this.$refs.devicesDriver.getInfo(info,'dispatch');
    },
    updateDevicesDriver(data){
      //更新铲车司机
      this.detailsInfo.drivers = data.drivers;
    },
    async getDeviceStatus(){
      //查询设备状态
      try {
          var result=await dispatchOperateServer.getStatus(this.deviceType,this.deviceId);
          this.deviceStatus=result;
      } catch (e) {
          this.messages.error(e.message);
      }
    },
    setForbidden(){//禁用
      // 选中添加class
      var data = this.detailsInfo;
      var _this=this;
      this.$messageConfirm.showConfirm({
        content:'确定要禁用 “'+data.truckName+'”吗?',
        detail:this.$t('device.forbidden-info')
      },async ()=>{
        // 确定操作
        try{
          var info = {
            deviceId:data.deviceId,
            isForbidden:true
          }
          var result = await devicesServer.forbiddenDevices(info)
          _this.$parent.getList();
          _this.resourceShow(); 
          _this.messages.success(_this.$t('action.operate-success'));
        }catch(e){
          _this.messages.error(e.message);
        }
      });
    },
    async setDispatchStatus(){
        //设置暂停派遣
        this.$refs.dispatchStatus.getStatusList(this.detailsInfo,this.vars.deviceType[0].id);
    },
    updateCurrentStatus(data){
        this.detailsInfo.stopDispatch=data.stopDispatch;
    },
    setBasicParameter(){
      //基本参数  
      var detailsInfo = this.detailsInfo;
      var info = detailsInfo.parameter;
      info.devParams=detailsInfo.devParams;
      // var info=detailsInfo.parameter;

      info.conversionRate=detailsInfo.parameter.conversionRate;
      info.equipmentTypeSn=this.vars.deviceType[0].id;
      info.equipmentSn=detailsInfo.truckSn;
      info.equipmentName=detailsInfo.truckName;
      info.equipmentId=detailsInfo.deviceId;

      this.$refs.basicParameter.getInfo(info,'dispatch');
    },
    updateBasicParameter(data){
      // 基本参数复值
      this.detailsInfo.devParams = data.devParams;
      this.detailsInfo.parameter = data.parameter;
    },
    setDeviceStatus(){
      //设备状态
      if(this.detailsInfo.drivingMode == this.vars.drivingMode[1].type){
        // 自动驾驶不能修改状态
        this.messages.error(this.$t('dispatch-set.status-update-fail').replace('$name',this.detailsInfo.truckName));
        return;
      }
      if(this.$refs.devicesStatus)this.$refs.devicesStatus.getList(this.detailsInfo,this.detailsInfo.status,this.vars.deviceType[0].id)
    },
    updateStatus(data){
      //设备状态
      this.detailsInfo.status = data.status;
    },
    setTruckLocked(){
      if(this.$refs.lockTruck){
        this.$refs.lockTruck.getInfo(this.detailsInfo);
      }
    },
    updateTruckRule(data){
      this.detailsInfo.rule=data;
    },
    setTruckForbidden(){
      if(this.$refs.forbiddenTruck){
        this.$refs.forbiddenTruck.getInfo(this.detailsInfo);
      }
    },
    clearTruckOccupy(){
      // 停车或离线可清除车辆占用
      var data = this.detailsInfo;
      this.$messageConfirm.showConfirm({
        content:this.$t('dispatch.clear-truck-occupy-info').replace('$truck',data.truckName),
        // detail:'提示详情'
      },async ()=>{
        // 确定操作
        try{
          let res = await dispatchServer.clearTruckOccupy(data.deviceId);
          if(res.success){
            this.messages.success(res.message);
          } else{
            this.messages.error(res.message);
          }
          this.$parent.getList();
        }catch(e){
          this.messages.error(e.message);
        }
      });
      
    },
    getSafeStop(v){
      // 在线可安全停车
      if(!v){
        this.$messageConfirm.showConfirm({
          content:this.$t('dispatch.safe-stop-tips'),
          // detail:'提示详情'
        },async ()=>{
          // 确定操作
          try{
              let result = await dispatchServer.setTruckStop(this.detailsInfo.deviceId);
              if(result.success === true){
                this.messages.success(this.$t('action.operate-success'));
              } else{
                this.messages.error(this.$t('action.operate-fail'));
              }
          }
          catch(e){
              this.messages.error(e.message);
          }
        });
      }
    },
  }
}
</script>


<style lang="scss" scoped>

</style>
