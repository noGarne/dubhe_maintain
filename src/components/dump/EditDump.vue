<template> 
  <!-- 卸点详情 -->
   <base-right-detail v-if="showEditUnloading" :topHeight="toHeight">
    <div slot="header">
      <div class="right_header">
        <h3 class="right_header_title" style="flex: 1">{{detailsInfo.dumpName}}</h3>
      </div>
    </div>
    <div slot="close"><span class="right_details_close" @click="closeEditUnloading"><i class="iconfont icon-guanbi"></i></span></div>
    <div class="dispatch_content">
      <el-tabs v-model="currentTab" type="card">
        <!-- 信息设定 -->
        <el-tab-pane :label="$t('dispatch.info-set')" name="tab-info">
          <div class="message_set">
              <div class="height-line2 disabled">
                  <!-- 待卸及卸载时间 -->
                  <h4>{{$t("dump.dump-time")}}</h4>
                  <div v-if="detailsInfo.unloadingCapacity">
                      <p>{{$t("dump.unload-time")}}：
                        <span>{{detailsInfo.unloadingCapacity.avgUnloadingTime? detailsInfo.unloadingCapacity.avgUnloadingTime :0 }}</span> <span>{{$t('dispatch.second')}}</span></p>
                      <p>{{$t("dump.unloading-time")}}：
                        <span>{{detailsInfo.unloadingCapacity.avgWaitLoadTime?detailsInfo.unloadingCapacity.avgWaitLoadTime:0}}</span> <span>{{$t('dispatch.second')}}</span></p>
                  </div>
              </div>
              <div class="height-line2" :class="{disabled:disabledDispatchEdit}" @click="!disabledDispatchEdit?setDispatchStatus():''">
                  <!-- 派遣状态 -->
                  <h4>{{$t("dispatch.dispatch-status")}}</h4>
                  <div>
                    <p>
                        {{$t("dispatch.current-status")}}：
                        <span>{{getStopDispatch(utils.getObjValByKey(vars.stopDispatch,detailsInfo.stopDispatch,'type'))}}</span>
                    </p>
                  </div>
              </div>
              <div class="height-line2" :class="{disabled:disabledDispatchEdit}" @click="!disabledDispatchEdit?setDumpPriority():''">
                  <!-- 优先级 -->
                  <h4>{{$t("dispatch.priority")}}</h4>
                  <div>
                      <p>{{$t("dispatch.priority")}}：<span>{{priority(detailsInfo.objectPriorityLevel)}}</span></p>
                  </div>
              </div>
              <div class="height-line2" :class="{disabled:disabledDispatchEdit}" @click="!disabledDispatchEdit?setDumpPosition():''">
                  <!-- 位置 -->
                  <h4>{{$t("dispatch.location")}}</h4>
                  <div v-if="detailsInfo.place">
                      <p>{{$t("dispatch.initial-location")}}：<span>{{detailsInfo.place.equipmentName?detailsInfo.place.equipmentName:$t('action.null')}}</span></p>
                  </div>
                  <div v-else>
                    <p>{{$t('action.null')}}</p>
                  </div>
              </div>
              <div class="height-line2" :class="{disabled:disabledDispatchEdit}" @click="!disabledDispatchEdit?setDeviceStatus():''">
                  <!-- 设备状态 -->
                  <h4>{{$t("dispatch.operationType")}}</h4>
                  <div v-if="detailsInfo.status">
                      <p>{{$t('dispatch-set.status')}}：<span>{{utils.getObjValByKey(vars.runStatus,detailsInfo.status.equStatus,'code')}}</span></p>
                      <p v-if="detailsInfo.status.startTimeStr">{{$t('dispatch.start-time')}}：<span>{{detailsInfo.status.startTimeStr}}</span></p>
                      <p v-if="detailsInfo.status.reasonName">{{$t('dispatch.device-operation-reason')}}：<span>{{detailsInfo.status.reasonName}}</span></p>
                      <p v-if="detailsInfo.status.planDuration">{{$t('dispatch.device-status-duration')}}：<span>{{detailsInfo.status.planDuration}}</span> <span>{{$t('dispatch.second')}}</span></p>
                      <p v-if="detailsInfo.status.reasonComment">{{$t('dispatch.device-operation-remark')}}：<span>{{detailsInfo.status.reasonComment}}</span></p>
                  </div>
                  <div v-else>
                    <p>{{$t('action.null')}}</p>
                  </div>
              </div>
              <div class="height-line2" :class="{disabled:disabledDispatchEdit}" @click="!disabledDispatchEdit?setDumpAbility():''">
                  <!-- 卸载能力 -->
                  <h4>{{$t("dump.dump-ability")}}</h4>
                  <div v-if="detailsInfo.unloadingCapacity">
                      <p>{{$t('dump.dump-ability')}}：
                        <span>{{(detailsInfo.unloadingCapacity.unloadingCapacity?detailsInfo.unloadingCapacity.unloadingCapacity + " " +$t('dispatch.cube'):$t('action.null'))}}</span></p>
                      <p>{{$t('dump.ability-to-limit')}}：<span>{{isWhether(detailsInfo.unloadingCapacity.isRestricted)}}</span></p>
                  </div>
              </div>
              <div :class="{disabled:disabledDispatchEdit}" @click="!disabledDispatchEdit?setCurrentMaterial():''">
                  <!-- 当前物料 -->
                  <h4>{{$t("dispatch.current-material")}}</h4>
                  <div v-if="detailsInfo.curntMtrlName">
                    <p>
                        {{$t("dispatch.current-material")}}：<span>{{detailsInfo.curntMtrlName}}</span>
						
                    </p>
					 <p v-if="detailsInfo.curntMtrlNameList.includes('煤')">{{$t('dispatch.hot-value-set')}}：<span>{{detailsInfo.hotValue}}</span></p>
                  </div>
                  <div v-else>
                    <p>{{$t("dispatch.current-material")}}：<span>{{$t('action.null')}}</span></p>
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
              <div :class="{disabled:disabledDispatchEdit}" @click="!disabledDispatchEdit?setDumpGroupTruck():''">
                  <!-- 卡车编组规则 -->
                  <h4>{{$t("dispatch.info-group")}}</h4>
                  <div>
                      <p v-if="detailsInfo.rule && detailsInfo.rule.lock">
                        {{$t('dispatch.info-group')}}：<span>{{getLockName(detailsInfo.rule.lock.truckToDumpArea)}}</span>
                      </p>
                  </div>
              </div>
              <div :class="{disabled:disabledDispatchEdit}" @click="!disabledDispatchEdit?setDumpLimitTruck():''">
                <!-- 卡车限制规则 -->
                <h4>{{$t("dispatch.info-limit")}}</h4>
                <div>
                    <p v-if="detailsInfo.rule && detailsInfo.rule.ban">
                      {{$t('dispatch.info-forbidden')}}：<span>{{getLockName(detailsInfo.rule.ban.truckToDumpArea)}}</span>
                    </p>
                </div>
              </div>
              <div :class="{disabled:disabledDispatchEdit}" @click="!disabledDispatchEdit?setBasicParameter():''">
                  <!-- 基本参数 -->
                  <h4>{{$t("dispatch.base-parameter")}}</h4>
                  <div v-if="detailsInfo.devParams">
                    <p>{{$t('device.rated-crush-capacity')}}：<span>{{detailsInfo.devParams.ratedCrushCapacity+" "+$t('dispatch.ton-hour')}}</span></p>
                    <p>{{$t('device.unload-place-count')}}：<span>{{detailsInfo.devParams.parkSpaceNumber+" "+$t('dispatch.individual')}}</span></p>
                  </div>
              </div>
          </div>
        </el-tab-pane>
        <!-- 信息设定 -->
        <el-tab-pane :label="$t('dispatch.device-operation')" name="tab-zhongduan">
          <device-operation deviceType='dump' :detailsInfo="detailsInfo" @updateStatus="updateStatus"></device-operation>
        </el-tab-pane>
        <!-- 设备状态 -->
        <el-tab-pane :label="$t('dispatch.device-status')" name="tab-diaodu">
          <dispatch-log :detailsInfo="detailsInfo"></dispatch-log>
        </el-tab-pane>
      </el-tabs>
      <!-- 卸载能力 -->
      <dump-ability ref="dumpAbility" @updateDumpAbility="updateDumpAbility"></dump-ability>
      <!-- 优先级 -->
      <dump-priority ref="dumpPriority" @updateEquipmentPriority="updateEquipmentPriority"></dump-priority>
      <!-- 基本参数 -->
      <basic-parameter ref="basicParameter" @updateBasicParameter="updateBasicParameter"></basic-parameter>
      <!-- 设备状态 -->
      <device-status ref="devicesStatus" @updateStatus="updateStatus"></device-status>
      <!-- 卸点位置 -->
      <place-set ref="dumpPosition" @updatePosition="updateDumpPosition"></place-set>
      <!-- 当前物料 -->
      <lock-material ref="lockMaterial" @updateCurrentMaterial="updateCurrentMaterial"></lock-material>
      <!-- 矿卡锁定卸点 -->
      <dump-group-truck ref="dumpGroupTruck" @updateDumpGroupTruck="updateDumpGroupTruck"></dump-group-truck>
      <dump-limit-truck ref="dumpLimitTruck" @updateDumpGroupTruck="updateDumpGroupTruck"></dump-limit-truck>
      <!-- 采装设备锁定卸点 -->
      <forbid-lock-digger ref="forbidLockDigger" @updateForbidLockDigger="updateForbidLockDigger"></forbid-lock-digger>
      <!-- 派遣状态 -->
      <dispatch-status ref="dispatchStatus" @updateCurrentStatus="updateCurrentStatus"></dispatch-status>
    </div>
    </base-right-detail> 
</template>

<script>

import dispatchMixin from '@/common/mixins/dispatch.mixins.js';
import dumpServer from '../../api/dump.server.js'
import materialServer from '../../api/material.server.js'
import dispatchOperateServer from '../../api/dispatchOperate.server'
import devicesServer from '../../api/devices.server';
import dispatchServer from '../../api/dispatch.server';

const DeviceOperation=()=>import('../../components/dispatch/DeviceOperation.vue');
const DumpAbility=()=>import('../dispatchSet/DumpAbility.vue');
const BasicParameter=()=>import('../dispatchSet/EditOther.vue');
const DumpPriority=()=>import('../dispatchSet/DevicePriority.vue');
const ForbidLockDigger=()=>import('./ForbidLockDigger.vue');
const DeviceStatus=()=>import('../dispatchSet/DeviceStatus.vue');
const PlaceSet=()=>import('../dispatch/PlaceSet.vue')
const DispatchLog=()=>import('../../components/dispatch/DispatchLog.vue');
const LockMaterial=()=>import('../dispatchSet/MaterialSetting.vue');
const DispatchStatus=()=>import('../dispatchSet/DispatchStatus.vue');
const DumpGroupTruck=()=>import('./DumpGroupTruck.vue');
const DumpLimitTruck=()=>import('./DumpLimitTruck.vue');

export default {
    mixins:[dispatchMixin],
    components:{
        DeviceOperation,
        DumpAbility,
        DumpPriority,
        BasicParameter,
        ForbidLockDigger,
        DeviceStatus,
        PlaceSet,
        DispatchLog,
        LockMaterial,
        DispatchStatus,
        DumpGroupTruck,
        DumpLimitTruck
    },
    data(){
        return{
          currentTab:"tab-info",
          toHeight:true,
          fromDispatch:false,
          detailsInfo:{},
          showEditUnloading:false,
          deviceStatus:{},
          forbidDiggerList:[],
          lockDiggerList:[],
          forbidTruckList:[],
          lockTruckList:[],
          currentMaterail:{},//当前物料
          dumpAbility:{//卸载能力
            unloadingCapacity:"",
            isRestricted:""
          },
          dumpPriority:{//优先级
            objectPriorityLevel:""
          },
          currentBasicParameter:{
            areaRadius:null,
            maxNumbTruckQueues:null,
            unloadedTrucksNumb:null,
            deviceGroupName:null
          },
          HaulingTrackList:{
            lockRules:[],
            barRules:[]
          }
        }
    },
    computed:{
        isWhether(v){//是否
          return function(v){
            var r ="";
            if(typeof v == 'boolean'){
              r = v?this.whetherList[1]:this.whetherList[0];
            }else{
              r = this.$t('action.null')
            }
            return r;
          }
        }
    },
    methods:{
        closeEditUnloading(){
            this.showEditUnloading=false;
            this.currentTab="tab-info";
            this.$parent.currentIndex=-1;
        },
        async resourceShow(deviceId,from,isFullscreen){
          this.toHeight = isFullscreen;
          this.showEditUnloading=true;
          try {
            var result = await dispatchServer.getDeviceDetail(deviceId);
            this.detailsInfo = result;
            //当前物料
            this.getMaterialDetails(this.detailsInfo.curntMtrlSnList);
            // 运输线路
            this.getDeviceHaulingTrack(deviceId)
          } catch (e) {
            this.messages.error(e.message);
          }
          if(from){
            this.fromDispatch = true;
          }else{
            this.fromDispatch = false;
          }
        },
            
        async getDeviceHaulingTrack(deviceId){
          try {
              var result = await dispatchServer.getDeviceHaulingTrack(deviceId);
              console.log(result);
              this.HaulingTrackList = result;
            } catch (e) {
              this.messages.error(e.message);
            }
        },
        joinArray(info){
          var arr = [];
          info = info || []
          info.forEach(element => {
            arr.push(element.elementName);
          });
          var text = '无';
          if(arr.length>0){
            text = arr.join(' | ');
          }
          return text;
        },
        setDumpForbidden(){
          // 选中添加class
          var data = this.detailsInfo;
          // console.log(data)
          var _this=this;
          this.$messageConfirm.showConfirm({
            content:'确定要禁用 “'+data.dumpName+'”吗?',
            detail:this.$t('device.forbidden-info')
          },async ()=>{
            // 确定操作
            try{
              var info = {
                deviceId:data.deviceId,
                isForbidden:!data.forbidden
              }
              var result = await devicesServer.forbiddenDevices(info)
              _this.$parent.getList();
              _this.closeEditUnloading(); 
              this.messages.success(this.$t('action.operate-success'));
            }catch(e){
              _this.messages.error(e.message);
            }
          });
        },
        updateDump(data){
          this.detailsInfo=data;
          this.$parent.updateDump(data);
        },
        deleteDevice(){
          this.$messageConfirm.showConfirm({
            content:this.$t('dump.delete-device'),
            // detail:'提示详情'
          },async ()=>{
            // 确定操作
            try {
              var data={
                deviceId:null
              }
              var result = await dumpServer.relateDevice(this.detailsInfo.id,data);
              this.messages.success(this.$t('action.delete-success'));
              this.appendUnloading(result);
              this.messages.success(this.$t('action.operate-success'));
            } catch (e) {
              this.messages.error(e.message);
            }
          });
        },
        appendUnloading(data,id){
          if(data){
             this.detailsInfo=data;
          } else{
            this.getDumpDetail(id);
          }
          // this.$parent.updateUnloadingList(this.detailsInfo);
         
        },
        setDumpAbility(){
          // this.$refs.dumpAbility.getDetials(this.detailsInfo,this.detailsInfo.capacity,this.vars.deviceType[1].id,);
          this.$refs.dumpAbility.getDetials(this.detailsInfo,this.detailsInfo,'dispatch');
          // this.$refs.dumpAbility.getDetials(this.detailsInfo,this.dumpAbility);
        },
        updateDumpAbility(data){
          // 卸载能力
          this.detailsInfo.unloadingCapacity = data.unloadingCapacity;
        },
       
        setDumpPriority(){
          //打开设置优先级
          this.$refs.dumpPriority.getDetials(this.detailsInfo,this.detailsInfo,this.vars.deviceType[2].id,'dispatch');
        },
        updateEquipmentPriority(data){
          //更新优先级
          this.detailsInfo.objectPriorityLevel = data.objectPriorityLevel;
        },
        setBasicParameter(){

          //基本参数  
          var detailsInfo = this.detailsInfo;
          // console.log(detailsInfo);
          
          var info = detailsInfo.parameter;
          info.devParams=detailsInfo.devParams;

          info.equipmentTypeSn=this.vars.deviceType[2].id;
          info.equipmentSn=detailsInfo.dumpSn;
          info.equipmentName=detailsInfo.dumpName;
          info.equipmentId=detailsInfo.deviceId;
          // console.log(info);

          this.$refs.basicParameter.getInfo(info,'dispatch');
        },
        updateBasicParameter(data){
          // 基本参数复值
          // this.resourceShow(this.detailsInfo.deviceId,this.fromDispatch,this.toHeight)
          this.detailsInfo.devParams = data.devParams;
          // this.detailsInfo.parameter = data.parameter;
        },
        updateForbidLockDigger(data){
          
          this.detailsInfo.rule = data;
          if(this.fromDispatch){
            this.$parent.getList();
          }
          
        },
        updateDumpGroupTruck(data){
          this.detailsInfo.rule = data;
        },
        async getDeviceStatus(deviceType,deviceId){
          //查询设备状态
          try {
              var result=await dispatchOperateServer.getStatus(deviceType,deviceId);
              this.deviceStatus=result;
          } catch (e) {
              this.messages.error(e.message);
          }
        },
        async setDispatchStatus(){
          //设置暂停派遣
          this.$refs.dispatchStatus.getStatusList(this.detailsInfo,this.vars.deviceType[2].id);
        },
        updateCurrentStatus(data){
            this.detailsInfo.stopDispatch = data.stopDispatch;
        },
        setForbidLockDigger(){
          this.$refs.forbidLockDigger.getInfo(this.detailsInfo);
        },
        setDumpGroupTruck(){
          this.$refs.dumpGroupTruck.getInfo(this.detailsInfo);
        },
        setDumpLimitTruck(){
          this.$refs.dumpLimitTruck.getInfo(this.detailsInfo);
        },
        setDeviceStatus(){
          if(this.$refs.devicesStatus)this.$refs.devicesStatus.getList(this.detailsInfo,this.detailsInfo.status,this.vars.deviceType[2].id);
        },
        updateStatus(data){
          //设备状态
          this.detailsInfo.status = data.status;
        },
        setCurrentMaterial(){
            //设置当前物料
            this.$refs.lockMaterial.getMaterialList(this.detailsInfo,this.vars.deviceType[2].id);
        },
        updateCurrentMaterial(data){
            this.getMaterialDetails(data.curntMtrlSnList);
        },
        async getMaterialDetails(snList){
          // 查询物料详细
          try {
            let snStr = snList.join(',') ||  0;
            let result = await materialServer.getMaterialDetails(snStr);
            this.detailsInfo.curntMtrlName=result.join(',');
            this.detailsInfo.curntMtrlSnList=snList;
          } catch (e) {
            this.messages.error(e.message);
          }
        },
        setDumpPosition(){
          //打开位置
          this.detailsInfo.subareaSn = this.subareaSn;
          this.$refs.dumpPosition.getDetials(this.detailsInfo,'dump');
        },
        updateDumpPosition(data){
          //更新位置
          this.detailsInfo.place = data;
        }
      }
    }
</script>

<style lang="scss" scoped>
</style>

