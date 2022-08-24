<template>
<!-- 采装设备 -->
  <base-right-detail v-if="isDialogShow" :topHeight="isTopHeight">
    <div slot="header">
      <div class="right_header">
        <h3 class="right_header_title" style="flex: 1">{{detailsInfo.shovelName}}</h3>
      </div>
    </div>
  <div slot="close"><span class="right_details_close" @click="resourceShow"><i class="iconfont icon-guanbi"></i></span></div>
    <div class="dispatch_content">
      <el-tabs v-model="currentTab" type="card">
        <!-- 信息设定 -->
        <el-tab-pane :label="$t('dispatch.info-set')" name="tab-detail">
          <div class="message_set">
              <div class="height-line2 disabled">
                  <!-- 通讯定位 -->
                  <h4>{{$t("dispatch.communication-location")}}</h4>
                  <div>
                      <p>{{$t("dispatch.communication-status")}}：<span>{{signalStatus}}</span></p>
                      <p>{{$t("dispatch.location-status")}}：<span>{{utils.getObjValByKey(vars.locationStatus,detailsInfo.locationStatus)}}</span></p>
                  </div>
              </div>
              <div class="height-line2" :class="{disabled:disabledDispatchEdit}" @click="!disabledDispatchEdit?setDispatchStatus():''">
                  <!-- 派遣状态 -->
                  <h4>{{$t("dispatch.dispatch-status")}}</h4>
                  <div>
                    <p>
                        {{$t("dispatch.current-status")}}：<span>{{getStopDispatch(utils.getObjValByKey(vars.stopDispatch,detailsInfo.stopDispatch,'type'))}}</span>
                    </p>
                  </div>
              </div>
              <div class="height-line2" :class="{disabled:disabledDispatchEdit}" @click="!disabledDispatchEdit?setDiggerPriority():''">
                  <!-- 优先级 -->
                  <h4>{{$t("dispatch.priority")}}</h4>
                  <div>
                      <p>{{$t("dispatch.priority")}}：<span>{{priority(detailsInfo.objectPriorityLevel)}}</span></p>
                  </div>
              </div>
              <div class="height-line2" :class="{disabled:disabledDispatchEdit}" @click="!disabledDispatchEdit?setDeviceStatus():''">
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
                    <p><span>{{$t('action.null')}}</span></p>
                  </div>
              </div>
              <div class="height-line2" :class="{disabled:disabledDispatchEdit}" @click="!disabledDispatchEdit?setDiggerPosition():''">
                  <!-- 位置 -->
                  <h4>{{$t("dispatch.location")}}</h4>
                  <div v-if="detailsInfo.place">
                      <!-- <p>{{$t("dispatch.initial-location")}}：{{detailsInfo.placeName?detailsInfo.placeName:$t('action.null')}}</p> -->
                      <p>{{$t("dispatch.initial-location")}}：<span>{{detailsInfo.place.equipmentName?detailsInfo.place.equipmentName:$t('action.null')}}</span></p>
                  </div>
                  <div v-else>
                    <p><span>{{$t('action.null')}}</span></p>
                  </div>
              </div>
              <div class="height-line2" :class="{disabled:disabledDispatchEdit}" @click="!disabledDispatchEdit?setCurrentMaterial():''">
                  <!-- 当前物料 -->
                  <h4>{{$t("dispatch.current-material")}}</h4>
                  <div v-if="detailsInfo.curntMtrlName">
                    <p>
                        {{$t("dispatch.current-material")}}:
                        <span>{{detailsInfo.curntMtrlName}}</span>
                    </p>
					 <p v-if="detailsInfo.curntMtrlName.includes('煤')">{{$t('dispatch.hot-value-set')}}：<span>{{detailsInfo.hotValue}}</span></p>
                  </div>
                  <div v-else>
                    <p><span>{{$t('action.null')}}</span></p>
                  </div>
              </div>
              <div class="disabled">
                  <!-- 运输线路 -->
                  <h4>运输线路</h4>
                  <div>
                      <p>编组规则：<span>{{joinArray(HaulingTrackList.lockRules)}}</span></p>
                      <p>限制规则：<span>{{joinArray(HaulingTrackList.banRules)}}</span></p>
                  </div>
              </div>
              <!-- 卡车编组规则 -->
              <div :class="{disabled:disabledDispatchEdit}" @click="!disabledDispatchEdit?setShovelGroupTruck():''">
                <h4>{{$t("dispatch.info-group")}}</h4>
                <div v-if="detailsInfo.rule">
                  <p>
                    {{$t('dispatch.info-group')}}：<span>{{getLockName(detailsInfo.rule.lock.truckToShovel)}}</span>
                  </p>
                </div>
              </div>

              <div :class="{disabled:disabledDispatchEdit}" @click="!disabledDispatchEdit?setShovelLimitTruck():''">
                <!-- 卡车限制规则 -->
                <h4>{{$t("dispatch.info-limit")}}</h4>
                <div v-if="detailsInfo.rule">
                    <p>
                      {{$t('dispatch.info-limit')}}：<span>{{getLockName(detailsInfo.rule.ban.truckToShovel)}}</span>
                    </p>
                </div>
              </div>
              
              <div class="height-line5" :class="{disabled:disabledDispatchEdit}" @click="!disabledDispatchEdit?setDevicesDriver():''">
                  <!-- 司机 -->
                  <h4>{{$t("dispatch.driver")}}</h4>
                  <div v-if="detailsInfo.drivers">
                    <p>{{$t('dispatch.main-driver')}}：<span>{{detailsInfo.drivers.mainDriverName?detailsInfo.drivers.mainDriverName:$t('action.null')}}</span></p>
                    <p>{{$t('dispatch.assistant-driver')}}：<span>{{detailsInfo.drivers.subDriverName?detailsInfo.drivers.subDriverName:$t('action.null')}}</span></p>
                    <p>{{$t('dispatch.login-time')}}：<span>{{detailsInfo.drivers.loginTime | formatDate}}</span></p>
                  </div>
              </div>

              <div class="height-line5" :class="{disabled:disabledDispatchEdit}" @click="!disabledDispatchEdit?setDiggerAbility():''">
                  <!-- 挖掘能力 -->
                  <h4>{{$t("dispatch.dig-ability")}}</h4>
                  <div class="height5" v-if="detailsInfo.capacity">
                      <p>{{$t('dispatch.loading-ability')}}：<span>{{(detailsInfo.capacity.loadCapacity?detailsInfo.capacity.loadCapacity+" " + $t('dispatch.cube'):$t('action.null'))}}</span></p>
                      <p>{{$t('dispatch.limit-ability')}}：<span>{{(detailsInfo.capacity.restrictCapacity?detailsInfo.capacity.restrictCapacity+" " + $t('dispatch.cube'):$t('action.null'))}}</span></p>
                      <p>{{$t('dispatch.min-ability')}}：<span>{{(detailsInfo.capacity.minCapacity?detailsInfo.capacity.minCapacity+" " + $t('dispatch.cube'):$t('action.null'))}}</span></p>
                      <p>{{$t('dispatch.digger-ability')}}：<span>{{(detailsInfo.capacity.digCapacity?detailsInfo.capacity.digCapacity+" " + $t('dispatch.cube'):$t('action.null'))}}</span></p>
                      <p>{{$t('dispatch.await-loading-time')}}：<span>{{(detailsInfo.capacity.waitLoadTime?detailsInfo.capacity.waitLoadTime+" " + $t('dispatch.second'):$t('action.null'))}}</span></p>
                  </div>
              </div>
              <div class="height-line5" :class="{disabled:disabledDispatchEdit}" @click="!disabledDispatchEdit?setBasicParameter():''">
                  <!-- 基本参数 -->
                  <h4>{{$t("dispatch.base-parameter")}}</h4>
                  <div v-if="detailsInfo.devParams">
                      <!-- 台阶 -->
                      <!-- <p>{{$t('information.step')}}：{{detailsInfo.devParams.stepName?detailsInfo.devParams.stepName:$t('action.null')}}</p> -->
                      <!-- 斗容量 -->
                      <p>{{$t('dispatch.dipper-capacity')}}：<span>{{detailsInfo.devParams.bucketVolume+" "+$t('dispatch.stere')}}</span></p>
                      <!-- 最大挖掘半径 -->
                      <p>{{$t('device.max-digger-radius')}}：<span>{{detailsInfo.devParams.maxDigRadius+" "+$t('dispatch.meter')}}</span></p>
                      <!-- 尾部回转半径 -->
                      <p>{{$t('device.end-turn-radius')}}：<span>{{detailsInfo.devParams.tailTurnRadius+" "+$t('dispatch.meter')}}</span></p>
                      <!-- 额定小时能力 -->
                      <p>{{$t('device.rated-hour-capacity')}}：<span>{{detailsInfo.devParams.hourCapacity+" "+$t('dispatch.stere-hour')}}</span></p>
                  </div>
              </div>
          </div>
        </el-tab-pane>
        <!-- 终端操作 -->
        <el-tab-pane :label="$t('dispatch.device-operation')" name="tab-zhongduan">
          <device-operation :detailsInfo="detailsInfo" @updateStatus="updateStatus"></device-operation>
        </el-tab-pane>
        <!-- 设备状态 -->
        <el-tab-pane :label="$t('dispatch.device-status')" name="tab-diaodu">
          <dispatch-log :detailsInfo="detailsInfo"></dispatch-log>
        </el-tab-pane>
        <!-- 实时位置 -->
        <el-tab-pane :label="$t('dispatch.live-location')" name="tab-shishi">
          <live-location :detailsInfo="detailsInfo" v-if="currentTab=='tab-shishi'"></live-location>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 当前物料 -->
    <material-setting ref="materialSetting" @updateCurrentMaterial="updateCurrentMaterial"></material-setting>
    <!-- 基本参数 -->
    <basic-parameter ref="basicParameter" @updateBasicParameter="updateBasicParameter"></basic-parameter>
    <!-- 采装设备能力 -->
    <digger-ability ref="diggerAbility" @updateShovelAbility="updateShovelAbility"></digger-ability>
    <!-- 采装设备优先级 -->
    <digger-priority ref="diggerPriority" @updateEquipmentPriority="updateEquipmentPriority"></digger-priority>
    <!-- 采装设备位置 -->
    <!-- <digger-position ref="diggerPosition1" @updateDiggerPosition="updateDiggerPosition"></digger-position> -->
    <place-set ref="diggerPosition" @updatePosition="updateDiggerPosition"></place-set>
    <!-- 采装设备司机 -->
    <devices-driver ref="devicesDriver" @updateDevicesDriver="updateDevicesDriver"></devices-driver>
    <!-- 采装设备状态 -->
    <device-status ref="devicesStatus" @updateStatus="updateStatus"></device-status>
    <!-- 采装设备编组卡车 -->
    <shovel-group-truck ref="shovelGroupTruck" @updateShovelGroupTruck="updateShovelGroupTruck"></shovel-group-truck>
    <!-- 采装设备限制卡车 -->
    <shovel-limit-truck ref="shovelLimitTruck" @updateShovelGroupTruck="updateShovelGroupTruck"></shovel-limit-truck>
    <!-- 派遣状态 -->
    <dispatch-status ref="dispatchStatus" @updateCurrentStatus="updateCurrentStatus"></dispatch-status>
  </base-right-detail>
</template>
<script>

import dispatchServer from '../../api/dispatch.server.js';
// import dispatchOperateServer from '../../api/dispatchOperate.server';
import dispatchMixin from '@/common/mixins/dispatch.mixins.js';
import devicesServer from '../../api/devices.server';

const MaterialSetting=()=>import('../dispatchSet/MaterialSetting.vue')
const DeviceOperation=()=>import('./DeviceOperation.vue')
const LiveLocation=()=>import('./LiveLocation.vue')
const DispatchLog=()=>import('./DispatchLog.vue')
const BasicParameter=()=>import('../dispatchSet/EditOther.vue')
const DiggerAbility=()=>import('../dispatchSet/ShovelAbility.vue')
const DiggerPriority=()=>import('../dispatchSet/DevicePriority.vue')
// const DiggerPosition=()=>import('./DiggerPosition.vue')
const PlaceSet=()=>import('./PlaceSet.vue')
const DevicesDriver=()=>import('../dispatchSet/EditDriver.vue')
const DeviceStatus=()=>import('../dispatchSet/DeviceStatus.vue')
const ShovelGroupTruck=()=>import('./ShovelGroupTruck.vue')
const ShovelLimitTruck=()=>import('./ShovelLimitTruck.vue')
const DispatchStatus=()=>import('../dispatchSet/DispatchStatus.vue')
export default {
  name: 'DispatchDigger',
  mixins:[dispatchMixin],
  components:{
      MaterialSetting,
      DeviceOperation,
      LiveLocation,
      DispatchLog,
      BasicParameter,
      DiggerAbility,
      // DiggerPosition,
      PlaceSet,
      DevicesDriver,
      DiggerPriority,
      DeviceStatus,
      DispatchStatus,
      ShovelGroupTruck,
      ShovelLimitTruck
  },
  data(){
    return {
      currentTab:"tab-detail",
      isDialogShow:false,
      isTopHeight:true,
      detailsInfo:{},
      dumpareaLockedList:[],
      dumpareaForbidList:[],
      // forbidTruckList:[],
      // lockTruckList:[],
      isAllowOthersExceptlock:false,
      deviceStatus:{},
      deviceInfo:{},
      currentDispatchStatus:'',
      timer:null,
      signalStatus:'',//通信状态
      HaulingTrackList:{
        lockRules:[],
        barRules:[]
      }
    }
  },
  computed:{
    loadedEnableB(v){
      return function(v){
        return v?1:0;
      }
    }
  },
  beforeDestroy() {
    this.clearIntervalClear()
  },
  methods:{
    resourceShow () {//显示
      this.isDialogShow=false;
      this.currentTab='tab-detail';
      // this.clearIntervalClear()
    },
    async getDetails(deviceId,show,isFullscreen){
        this.isTopHeight=isFullscreen;
        this.isDialogShow=true;
        try {
            var result = await dispatchServer.getDeviceDetail(deviceId);
            this.detailsInfo = result;
            this.isAllowOthersExceptlock = result.allowOtherTrucks;

            //通信状态
            this.getSignalStatus(deviceId);
            this.getDeviceHaulingTrack(deviceId);
        } catch (e) {
            this.messages.error(e.message);
        }
        
        // this.clearIntervalClear()
        // this.timer = setInterval(() => {
        //   // 定时刷新
        //   this.getDeviceStatus();
        // }, 5000);
    },
    async getDeviceHaulingTrack(deviceId){
      try {
          var result = await dispatchServer.getDeviceHaulingTrack(deviceId);
          this.HaulingTrackList = result;
        } catch (e) {
          this.messages.error(e.message);
        }
    },
    joinArray(info){
      var arr = [];
      info = info || []
      info.forEach(element => {
        arr.push(element.psvElementName);
      });
      var text = '无';
      if(arr.length>0){
        text = arr.join(' | ');
      }
      return text;
    },
    clearIntervalClear(){
      clearInterval(this.timer);
      this.timer = null;
    },
    async getSignalStatus(deviceId){
      //通讯状态
       try {
          var result = await dispatchServer.getDeviceSignalStatus(deviceId);
          this.signalStatus=result.active ? '在线' : '离线';
        } catch (e) {
            this.messages.error(e.message);
        }
    },
    setDumpareaLocked(){
      //设置锁定卸点
      this.bus.$emit('showDumparea',this.dumpareaLockedList,this.deviceId);
    },
    updateDumpareaLocked(data){
      //更新锁定卸点
      this.dumpareaLockedList=data;

      this.$parent.getList();
    },
    updateShovelGroupTruck(data){
      this.detailsInfo.rule = data;
      if(data.lock.hasOwnProperty('isAllowOthersExceptlock')){
        this.isAllowOthersExceptlock=data.lock.isAllowOthersExceptlock;
      }
    },
    setDiggerAbility(){
      //打开设置装载能力
      this.$refs.diggerAbility.getDetials(this.detailsInfo,this.detailsInfo.capacity,this.vars.deviceType[1].id,0);
    },
    updateShovelAbility(data){
      //更新装载能力
      this.detailsInfo.capacity=data.capacity;
    },
    setDiggerPriority(){
      //打开设置优先级
      this.$refs.diggerPriority.getDetials(this.detailsInfo,this.detailsInfo,this.vars.deviceType[1].id,'dispatch');
    },
    updateEquipmentPriority(data){
      //更新优先级
      this.detailsInfo.objectPriorityLevel = data.objectPriorityLevel;
    },
    setDiggerForbidden(){//禁用
      // 选中添加class
      var data = this.detailsInfo;
      var _this=this;
      this.$messageConfirm.showConfirm({
        content:'确定要禁用 “'+data.shovelName+'”吗?',
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
    setDiggerPosition(){
      //打开位置
      this.detailsInfo.subareaSn = this.subareaSn;
      this.$refs.diggerPosition.getDetials(this.detailsInfo,'shovel');
    },
    updateDiggerPosition(data){
      //更新位置
      this.detailsInfo.place = data;
    },
    setDevicesDriver(){
      //打开铲车司机
      var detailsInfo = this.detailsInfo;
      var info = detailsInfo.drivers;
      info.equipmentTypeId = detailsInfo.deviceId;
      info.equipmentTypeSn = this.vars.deviceType[1].id;
      info.equipmentSn = detailsInfo.shovelSn;
      info.equipmentName = detailsInfo.shovelName;
      
      this.$refs.devicesDriver.getInfo(info,'dispatch');


      // this.$refs.devicesDriver.getDetials(this.detailsInfo,this.diggerDriver);
    },
    updateDevicesDriver(data){
      //更新铲车司机
      this.detailsInfo.drivers = data.drivers;
    },
    setCurrentMaterial(){
        //设置当前物料
        this.$refs.materialSetting.getMaterialList(this.detailsInfo,this.vars.deviceType[1].id,'dispatch');
    },
    updateCurrentMaterial(data){
        // this.detailsInfo=data;
        this.detailsInfo.curntMtrlSn=data.curntMtrlSn;
        this.detailsInfo.curntMtrlName=data.curntMtrlName;
    },
    async setDispatchStatus(){
        //设置暂停派遣
        this.$refs.dispatchStatus.getStatusList(this.detailsInfo,this.vars.deviceType[1].id);
    },
    updateCurrentStatus(data){
        this.detailsInfo.stopDispatch = data.stopDispatch;
    },
    setBasicParameter(){
      //基本参数  
      var detailsInfo = this.detailsInfo;
      
      var info = detailsInfo.parameter;
      info.devParams=detailsInfo.devParams;

      info.equipmentTypeSn=this.vars.deviceType[1].id;
      info.equipmentSn=detailsInfo.shovelSn;
      info.equipmentName=detailsInfo.shovelName;
      info.equipmentId=detailsInfo.deviceId;

      this.$refs.basicParameter.getInfo(info,'dispatch');
    },
    updateBasicParameter(data){
      // 基本参数复值
      this.detailsInfo.devParams = data.devParams;
      // this.getBasicParameter();
    },
    setDeviceStatus(){
      //设备状态
      if(this.$refs.devicesStatus)this.$refs.devicesStatus.getList(this.detailsInfo,this.detailsInfo.status,this.vars.deviceType[1].id)
    },
    updateStatus(data){
      //设备状态
      this.detailsInfo.status = data.status;
    },
    
    setShovelGroupTruck(){
      this.$refs.shovelGroupTruck.getInfo(this.detailsInfo);
    },
    setShovelLimitTruck(){
      this.$refs.shovelLimitTruck.getInfo(this.detailsInfo);
    }
  }
}
</script>


<style lang="scss" scoped>
</style>
