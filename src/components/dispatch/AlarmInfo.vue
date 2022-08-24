<template>
  <!-- 报警信息 -->
  <div class="alarm-info">
    <base-dialog 
      ref="baseDialog"
      :title='$t("dispatch.alarm-info")'
      :width="'1050px'"
      :buttonShow="false"
      @closeDialog="closeDialog">
        <div class="alarm-dialog">
          <button class="btnGray" :class="{btnBgNone:disabledDispatchEdit}" @click="!disabledDispatchEdit?AllEliminate():''" v-if="activeName=='first'"><i class="iconfont icon-qingchuzhanyong themeOrangeColor"></i> 一键消除</button>
          <el-tabs class="commmon_tabs tabs_no_border" v-model="activeName" @tab-click="tabClick">
            <el-tab-pane name="first">
              <span slot="label"> 当前<i>{{alarmList.length}}</i></span>
              <div :style="{height:currentHeightW+'px'}">
                <el-table
                ref="tbCurrent"
                key="current"
                class="table-alarm"
                :height="currentHeight"
                :data="searchList"
                v-loading="loading"
                element-loading-text="加载中..."
                element-loading-background="rgba(0,0,0,0.1)"
                style="width: 100%">
                  <el-table-column
                    prop="dispatchingAlarmDetail"
                    :label="$t('dispatch.msg-details')"
                    min-width="66%">
                    <template scope="scope">
                        <div class="alarm-detail">
                            <span :class="{red:scope.row.alarmLevel=='1',orange:scope.row.alarmLevel=='2',yellow:scope.row.alarmLevel=='3'}"></span>
                            {{scope.row.dispatchingAlarmDetail}}
                        </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    :label="$t('dispatch.dispatch-log-time')"
                    min-width="18%">
                    <template scope="scope">
                        {{scope.row.dispatchingAlarmTime | formatDate}}
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="操作"
                    min-width="16%">
                    <template scope="scope">
                      <div class="operation_setter" v-if="vars.alarmHandleType.indexOf(scope.row.dispatchingAlarmType)>-1">
                        <!-- 接受 -->
                        <button :class="{c999:disabledDispatchEdit}" @click="!disabledDispatchEdit?alarmAccept(scope.row.id):''">
                            <i class="iconfont icon-qiyong green"></i>
                            {{$t('dispatch.alarm-accept')}}
                        </button>
                        <!-- 拒绝 -->
                        <button :class="{c999:disabledDispatchEdit}" @click="!disabledDispatchEdit?alarmReject(scope.row):''">
                            <i class="iconfont icon-jinyong red"></i>
                            {{$t('dispatch.alarm-reject')}}
                        </button>
                      </div>
                      
                      <div class="operation_setter" v-else-if="scope.row.dispatchingAlarmType=='DEVICE_NOT_BIND_SITE'">
                        <!-- 设置 -->
                        <button :class="{c999:disabledDispatchEdit}" @click="!disabledDispatchEdit?setDevicePosition(scope.row):''"><i class="iconfont icon-shezhi green"></i>设置</button>
                        <!-- 忽略 -->
                        <button :class="{c999:disabledDispatchEdit}" @click="!disabledDispatchEdit?alarmConfirm(scope.row.id):''"><i class="iconfont icon-jinyong"></i>忽略</button>
                      </div>
                      <div class="operation_setter" v-else>
                        <!-- 确定 -->
                        <button class="btnGray" :class="{c999:disabledDispatchEdit}" @click="!disabledDispatchEdit?alarmConfirm(scope.row.id):''">
                            <i class="iconfont icon-qiyong"></i>
                            {{$t('action.ok')}}</button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
                
                <div class="pagination_location">
                    <base-pagination :total="pageInitCur.total" :singleDisplay="pageInitCur.pageSize" :currentPage="pageInitCur.pageIndex" @pagechange="pagechangeCur" @sizeChange="sizeChangeCur"></base-pagination>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="历史" name="second">
              <div class="history_alarm" :style="{height:historyHeight+'px'}">
                  <div class="search_history">          
                      <!-- 日期（年月日） -->
                      <el-date-picker
                      v-model="searchDate.date"
                      type="date"
                      @change="searchAlarm"
                      :placeholder="$t('common.select-date')">
                      </el-date-picker>
                                          
                      <!-- 业务类型 -->
                      <el-select 
                          clearable 
                          filterable 
                          v-model="searchDate.alarmGroup" 
                          @change="searchAlarm"
                          :placeholder="$t('action.select')">
                          <el-option
                              v-for="(item,index) in businessTypeList"
                              :key="index"
                              :label="item.text"
                              :value="item.value">
                          </el-option>
                      </el-select>

                      <div class="search_input">
                          <el-input
                              :placeholder="'请输入检索的设备名称'"
                              v-model="searchDate.sourceName"
                              clearable
                              @input="searchAlarm">
                              <i slot="prefix" class="el-input__icon el-icon-search"></i>
                          </el-input>
                      </div>
                  </div>
                  <div>
                      <el-table
                          ref="tbHistory"
                          class="table-alarm"
                          :height="oldHeight"
                          key="history"
                          :data="historyAlarmList"
                          style="width: 100%">
                          <el-table-column
                              label="业务类型"
                              fixed
                              min-width="130">
                              <template scope="scope">
                                <div class="alarm-detail">
                                  <span :class="{red:scope.row.alarmLevel=='1',orange:scope.row.alarmLevel=='2',yellow:scope.row.alarmLevel=='3'}"></span>
                                  {{utils.getObjValByKey(businessTypeList,scope.row.alarmGroup,'value','text')}}
                                </div>
                              </template>
                          </el-table-column>
                          <el-table-column
                              prop="dispatchingAlarmDetail"
                              label="消息详情"
                              min-width="680">
                              <template scope="scope">
                                  <div class="alarm-detail">
                                      {{scope.row.dispatchingAlarmDetail}}
                                  </div>
                              </template>
                          </el-table-column>
                          <el-table-column
                              prop="name"
                              label="处理时间"
                              min-width="185">
                              <template scope="scope">
                                  {{scope.row.handleTime | formatDate}}
                              </template>
                          </el-table-column>
                          <el-table-column
                              prop="name"
                              label="发生时间"
                              min-width="185">
                              <template scope="scope">
                                  {{scope.row.dispatchingAlarmTime | formatDate}}
                              </template>
                          </el-table-column>
                          <el-table-column
                              prop="handleUserName"
                              label="处理人"
                              min-width="100">
                          </el-table-column>
                          <el-table-column
                              prop="name"
                              label="处理结果"
                              width="100">
                              <template scope="scope">
                                  <p v-if="scope.row.handleOption==disposeResult[0].type">{{disposeResult[0].name}}</p>
                                  <p v-if="scope.row.handleOption==disposeResult[1].type">{{disposeResult[1].name}}</p>
                                  <p v-if="scope.row.handleOption==disposeResult[2].type">{{disposeResult[2].name}}</p>
                              </template>
                          </el-table-column>
                          <!-- 处理意见 -->
                          <el-table-column
                              property="handleSuggestion"
                              show-overflow-tooltip
                              :label="$t('dispatch.dispose-opinion')"
                              min-width="100">
                          </el-table-column>
                      </el-table>
                  </div>
                  <div class="pagination_location">
                      <base-pagination :total="pageInit.total" :singleDisplay="pageInit.pageSize" :currentPage="pageInit.pageIndex" @pagechange="pagechange" @sizeChange="sizeChange"></base-pagination>
                  </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </base-dialog>
      <alarm-reject ref="alarmReject"></alarm-reject>
      
      <!-- 采装设备位置 -->
      <digger-position ref="diggerPosition" @updateDiggerPosition="updateDevicePosition"></digger-position>
    <!-- 卸点位置 -->
    <dump-position ref="dumpPosition" @updateDumpPosition="updateDevicePosition"></dump-position>

  </div>
</template>

<script>

const AlarmReject=()=>import('../../components/dispatch/AlarmReject.vue')

import websocket from '../../api/websocket';
import dispatchMixin from '../../common/mixins/dispatch.mixins.js';
import dispatchServer from '../../api/dispatch.server.js';
const DiggerPosition=()=>import('./DiggerPosition.vue')
const DumpPosition=()=>import('../dump/DumpPosition.vue')

export default {
    name:'AlarmInfo',
    mixins:[dispatchMixin],
    components:{
        AlarmReject,
        DiggerPosition,
        DumpPosition
    },
    data(){
        return{
            isShowDialog:false,
            loading:true,
            alarmList:[],
            entityType:"DEVICE_GROUP",
            subscriptionId:'',
            searchText:"",
            cancelList:[],
            checkAll:false,
            checkList:[],
            activeName:"first",
            historyAlarmList:[],
            pageInit:{},
            pageInitCur:{},
            searchDate:{
                date:"",
                type:"",
                sourceName:"",
                alarmGroup:"",
                startTime:"",
                endTime:"",
            },
            disposeResult:[
                {
                type:"CONFIRM",
                name:this.$t('dispatch.alarm-confirm'),
                },
                {
                type:"REFUSE",
                name:this.$t('dispatch.alarm-reject'),
                },
                {
                type:"RECEIVE",
                name:this.$t('dispatch.alarm-accept'),
                }
            ],
            deviceTypeList:[
                {
                value:"SHOVEL",
                text:this.$t('dispatch.device-digger')
                },
                {
                value:"TRUCK",
                text:this.$t('dispatch.device-truck')
                },
                {
                value:"DUMP_AREA",
                text:this.$t('dispatch.info-dumparea')
                }
            ],
            currentHeight:520,
            oldHeight:450,
            historyHeight:550,
            currentHeightW:550
        }
    },
    mounted() {
        this.pageInit=JSON.parse(JSON.stringify(this.vars.pageInit));
        this.pageInitCur=JSON.parse(JSON.stringify(this.vars.pageInit));
        this.getwebsocket();
        
        window.addEventListener('resize', this.setHeight,false);
    },
    computed:{
        searchList(){//搜索
          var list = this.alarmList.filter(item=>item.dispatchingAlarmDetail.toLowerCase().includes(this.searchText.toLowerCase()));
          var {total,pageSize,pageIndex} = this.pageInitCur;
          // 获取整数页
          var page = Math.ceil(total/pageSize);
          var curSize = pageSize;
          // 获取最后一页数量
          if(page==pageIndex){
            curSize = total%pageSize?total%pageSize:pageSize;
          }
          // 获取本页列表
          var curList = list.slice((pageIndex-1)*pageSize,(pageIndex-1)*pageSize+curSize);
          // 如果最后一页无列表,则重新获取最后一页
          if(list.length>0&&curList.length==0){
            this.pageInitCur.pageIndex = Math.ceil(total/pageSize);
            curList = list.slice((this.pageInitCur.pageIndex-1)*pageSize,(this.pageInitCur.pageIndex-1)*pageSize+curSize);
          }
          return curList;
        },
    },
    watch:{
        subareaId(newVal,oldVal){
            this.unwebsocket(oldVal);
            this.getwebsocket();
        },
        alarmList(){
            var len=this.alarmList.length;
            this.pageInitCur.total = len;
            this.showAlarmInfo(len>0);
            if(len == 0){
                this.isShowDialog=false;
                this.$refs.baseDialog.toggleDialog(false);
            }
        },
        checkAll(v){
            this.checkList=[];
            if(v){
                this.searchList.forEach(item => {
                    item.handled=true;
                });
                this.checkList=this.searchList.map(item=>{
                    return {id:item.id,type:item.dispatchingAlarmType}
                });
            } else{
                this.searchList.forEach(item => {
                    item.handled=false;
                });
            }
        }
    },
    methods: {
        // 告警搜索
        searchAlarm(){
            var date = this.searchDate.date;
            if(date){
                var start = new Date(new Date(date).toLocaleDateString()).getTime();
                var startTime =this.utils.formatDate(start);
                var endTime = this.utils.formatDate(start+24*60*60*1000);
                this.searchDate.startTime=startTime;
                this.searchDate.endTime=endTime;
            }else{
                this.searchDate.startTime="";
                this.searchDate.endTime="";
            }
            this.pageInit.pageIndex = 1;
            this.getAlarmHistory();
        },
        // tab切换
        tabClick(v){
            if(v.name=="first")this.pageInitCur.pageIndex=1;
            if(v.name=="second")this.getAlarmHistory();
            setTimeout(() => {
                this.$refs.tbCurrent.doLayout();
                this.$refs.tbHistory.doLayout();
            }, 100);
        },
        toggleDialog(){
            this.isShowDialog=!this.isShowDialog;
            this.$refs.baseDialog.toggleDialog();
            if(this.isShowDialog){
                this.pageInit=JSON.parse(JSON.stringify(this.vars.pageInit));
                this.setHeight();
            }
        },
        setHeight(){
            var windowH=window.innerHeight;
            var surplus = windowH*0.7972;
            var last1  = surplus - 163;
            var last2  = surplus - 213;
            var last3  = surplus - 113;
            var last4  = surplus - 113;
            this.currentHeight=last1;
            this.oldHeight=last2;
            this.currentHeightW=last3;
            this.historyHeight=last4;
        },
        closeDialog(){
            this.activeName="first";
            this.searchDate={
                date:"",
                type:"",
                sourceName:"",
                startTime:"",
                endTime:"",
            }
            
            this.isShowDialog=false;
        },
        showAlarmInfo(data){
            this.$emit('showAlarm',data);
        },
        showAlarmNotify(data){
            this.$emit('showAlarmNotify',data);
        },
        async getAlarmHistory(){//历史
            if(this.subareaId){
                var _this = this;
                try{
                    var pageSize = this.pageInit.pageSize,
                        pageIndex = this.pageInit.pageIndex,
                        eventType = this.searchDate.eventType,
                        deviceType = this.searchDate.deviceType,
                        startTime = this.searchDate.startTime,
                        endTime = this.searchDate.endTime,
                        alarmGroup = this.searchDate.alarmGroup,
                        sourceName = this.searchDate.sourceName,
                        subareaId = this.subareaId?this.subareaId:{};
                    var data = {
                        pageSize:pageSize,
                        pageIndex:pageIndex,
                        deviceType:deviceType,
                        eventType:eventType,
                        startTime:startTime,
                        endTime:endTime,
                        alarmGroup:alarmGroup,
                        sourceName:sourceName,
                        deviceGroupId:subareaId
                    }
                    var result = await dispatchServer.getAlarmHistory(data);
                    this.historyAlarmList=result.content;
                    this.pageInit.total=result.totalElements;
                }catch(e){
                    _this.messages.error(e.message)
                }
            }
        },
        pagechangeCur(val){
            this.pageInitCur.pageIndex=val;
        },
        sizeChangeCur(val){
            this.pageInitCur.pageIndex = 1;
            this.pageInitCur.pageSize = val;
            // this.getAlarmCurrent();
        },
        pagechange(val){
            this.pageInit.pageIndex=val;
            this.getAlarmHistory();
        },
        sizeChange(val){
            this.pageInit.pageSize = val;
            this.getAlarmHistory();
        },
        checkChange(v,item){
            item.handled=v;
            if(v){
                this.checkList.push({id:item.id,type:item.dispatchingAlarmType})
            } else{
                this.checkList.splice(this.checkList.findIndex(n=>n.id==item.id),1)
            }
        },
        handleAll(){
            if(this.checkList.length <= 0){
                this.messages.error(this.$t('dispatch.alarm-confirm-popout-no'));
                return;
            }
            this.$messageConfirm.showConfirm({
                content:this.$t('dispatch.alarm-confirm-popout-all'),
                // detail:'提示详情'
            },async ()=>{
                // 确定操作
                this.checkList.forEach(item=>{
                    if(this.vars.alarmHandleType.indexOf(item.type)>-1){
                        this.alarmAccept(item.id,false);
                    } else{
                        this.alarmConfirm(item.id,false);
                    }
                });
                
                this.messages.success(this.$t('dispatch.alarm-confirm-popout-success'));
            });
        },
        async AllEliminate(){
            // 弹框提示
            var _this=this;
            var limitTime = new Date().getTime()-24*60*60*1000;
            var time = this.utils.formatDate(limitTime);
            this.$messageConfirm.showConfirm({
                content:'是否确认清除'+time+'之前的所有报警数据？',
                // detail:'提示详情'
            },async ()=>{
                // 确定操作
                try {
                    var user= this.$store.state.currentUser;
                    var data = {
                        timeLimit:limitTime,
                        deviceGroupId:this.subareaId,
                        handleUserId:user.userId,
                        handleUserName:user.firstName,
                    };
                    var result=await dispatchServer.AllEliminate(data);
                    this.messages.success(this.$t('action.operate-success'));
                } catch (e) {
                    this.messages.error(e.message);
                }
            });
        },
        async alarmConfirm(id,isConfirm=true){
            var user= this.$store.state.currentUser;
            var info={
                handleUserId:user.userId,
                handleUserName:user.firstName,
                handleOption:'CONFIRM',
                handleSuggestion:''
            };
            //确认
            var _this=this;
            try {
                var result=await dispatchServer.alarmHandle(id,info);
                _this.removeAlarm(id);
                if(isConfirm){
                    _this.messages.success(_this.$t('dispatch.alarm-confirm-popout-success'));
                }
            } catch (e) {
                if(isConfirm){
                    _this.messages.error(e.message);
                }
            }
        },
        async alarmAccept(id,isConfirm=true){
            var user= this.$store.state.currentUser;
            var info={
                handleUserId:user.userId,
                handleUserName:user.firstName,
                handleOption:'RECEIVE',
                handleSuggestion:''
            };
            //接受
            if(isConfirm){
                // 弹框提示
                this.$messageConfirm.showConfirm({
                content:this.$t('dispatch.alarm-accept-popout-content'),
                    // detail:'提示详情'
                },async ()=>{
                    // 确定操作
                    try {
                        var result=await dispatchServer.alarmHandle(id,info);
                        this.removeAlarm(id);
                        this.messages.success(this.$t('dispatch.alarm-accept-popout-success'));
                    } catch (e) {
                        this.messages.error(e.message);
                    }
                });
            } else{
                // 不用弹框，直接确定
                try {
                    var result=await dispatchServer.alarmHandle(id,info);
                    this.removeAlarm(id);
                } catch (e) {
                    
                }
            }
        },
        alarmReject(data){
            //拒绝
            this.$refs.alarmReject.showAlarmReject(data);
        },
        setDevicePosition(data){
            //打开位置
            if(data.sourceType==this.vars.deviceTypeNew[2].type){
                // 卡车
                // var equipmentTypeSn=data.sourceId;
                // var equipmentSn=data.sourceType;
                var equipmentTypeSn=this.vars.deviceTypeNew[2].id;
                var equipmentSn=data.sourceSn;
                var equipmentName=data.sourceName;
                var info ={
                    equipmentTypeSn:equipmentTypeSn,
                    dumpSn:equipmentSn,
                    dumpName:equipmentName,
                    index:data.id,
                    position:{
                        positionId:null,
                    }
                }

                this.$refs.dumpPosition.getDetials(info);

            }
            if(data.sourceType==this.vars.deviceTypeNew[1].type){
                // 采装设备
                // var equipmentTypeSn=data.sourceId;
                // var equipmentSn=data.sourceType;
                var equipmentTypeSn=this.vars.deviceTypeNew[1].id;
                var equipmentSn=data.sourceSn;
                var equipmentName=data.sourceName;
                var info ={
                    equipmentTypeSn:equipmentTypeSn,
                    shovelSn:equipmentSn,
                    shovelName:equipmentName,
                    index:data.id,
                    position:{
                        positionId:null,
                    }
                }
                this.$refs.diggerPosition.getDetials(info);
            }

            
        },
        updateDevicePosition(data,id){
          //更新位置
            this.alarmConfirm(id,false);
        },
        
        removeAlarm(id){
            //移除报警
            for (let i = 0; i < this.alarmList.length; i++) {
                if (this.alarmList[i].id == id) {
                    this.alarmList.splice(i,1);
                    break;
                }
            }
            // this.getAlarmHistory();
        },
        getwebsocket(){//消息订阅
            var entityType = this.entityType;
            var entityId = this.subareaId;
            var _this=this;

            if(entityId){
                var disAlarmCommands = {
                    entityType: entityType,
                    entityId: entityId,
                };

                var subscriber = {
                    disAlarmCommands: [disAlarmCommands],
                    type: 'disAlarm'
                };

                subscriber.onReconnected = function() {}
                subscriber['onData'] = function(data) {
                    if (data.data) {
                        _this.loading=false;
                        _this.onData(data, true);
                    }
                }
                
                websocket.subscribe(subscriber,function(data){
                    _this.cancelList = data;
                });
            }
        },
        unwebsocket(oldSubareaId){//取消订阅
            var _this=this;
            if(_this.cancelList.length>0){
                var subscriber = {
                    disAlarmCommands: _this.cancelList,
                    type: 'disAlarm'
                };

                websocket.unsubscribe(subscriber);
            }
        },
        onData(data,type){//实时获取到数据填充
            this.subscriptionId=data.subscriptionId;
            var res=data.data;
            if(res.dispatchingAlarmList){
                //推送之前信息
                this.alarmList=res.dispatchingAlarmList;
            }
            else if(res.newDispatchingAlarm){
                //一条新告警
                //如果同时接受相同的告警只显示一条
                if(this.alarmList.filter(item=>(item.dispatchingAlarmTitle==res.newDispatchingAlarm[0].dispatchingAlarmTitle)&&(item.dispatchingAlarmDetail==res.newDispatchingAlarm[0].dispatchingAlarmDetail)).length > 0){
                    return;
                }
                if(!this.isShowDialog){
                    if(this.alarmList.filter(item=>item.dispatchingAlarmTitle==res.newDispatchingAlarm[0].dispatchingAlarmTitle).length == 0){
                        this.showAlarmNotify(res.newDispatchingAlarm);
                    }
                }

                this.alarmList=res.newDispatchingAlarm.concat(this.alarmList);
                
                if(this.alarmList.length > 0){
                    this.$emit('vioceAlarm');
                }
            }
            else if(res.removeDispatchingAlarm){
                //删除一条告警
                var id = res.removeDispatchingAlarm[0];
                this.removeAlarm(id);
            }
            //console.log(this.alarmList);
            this.showAlarmInfo(this.alarmList.length > 0);
            
        }
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.setHeight,false);
        this.unwebsocket();
    }
}
</script>

<style lang="scss" scoped>


</style>

<style lang="scss">
@import "../../common/css/alarmInfo.scss"
</style>
