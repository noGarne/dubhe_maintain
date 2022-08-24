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
                <el-tabs class="commmon_tabs tabs_no_border" v-model="activeName" @tab-click="tabClick">
                    <el-tab-pane name="first">
                        <span slot="label"> 当前<i>{{alarmList.length}}</i></span>
                        <div :style="{height:currentHeightW+'px'}">
                            <el-table
                            ref="tbCurrent"
                            key="current"
                            class="table-alarm"
                            :height="currentHeight"
                            :data="alarmList"
                            style="width: 100%">
                                <el-table-column
                                    prop="alarmDetail"
                                    :label="$t('pages.task-details')"
                                    min-width="71%">
                                    <!-- <template scope="scope">
                                        <div class="alarm-detail" v-if="scope.row.alarmType==vars.alarmType[0].type">
                                            【{{scope.row.roadElementName}}】装载区边界更新！
                                        </div>
                                        <div class="alarm-detail" v-else-if="scope.row.alarmType==vars.alarmType[1].type">
                                            【{{scope.row.roadElementName}}】卸载区边界更新！
                                        </div>
                                        <div class="alarm-detail" v-else-if="scope.row.alarmType==vars.alarmType[2].type">
                                            【{{scope.row.roadElementName}}】具备启用条件！
                                        </div>
                                    </template> -->
                                </el-table-column>
                                <el-table-column
                                    prop="name"
                                    :label="$t('dispatch.dispatch-log-time')"
                                    min-width="18%">
                                    <template scope="scope">
                                        {{scope.row.alarmTime | formatDate}}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="address"
                                    label="操作"
                                    min-width="11%">
                                    <template scope="scope">
                                        <div 
                                            class="operation_setter" 
                                            v-if="scope.row.alarmType==vars.alarmType[1].type 
                                            || scope.row.alarmType==vars.alarmType[2].type 
                                            || scope.row.alarmType==vars.alarmType[0].type
                                            || scope.row.alarmType==vars.alarmType[3].type
                                            || scope.row.alarmType==vars.alarmType[4].type">
                                            <!-- 接受 -->
                                            <button class="green" @click="alarmAccept(scope.row,scope.$index)">{{'立即处理'}}</button>
                                        </div>
                                        <div 
                                            class="operation_setter" 
                                            v-else-if="scope.row.alarmType==vars.alarmType[5].type">
                                            <!-- 确认 -->
                                            <button class="green" @click="ignoreMessage(scope.row,scope.$index)">{{'确定'}}</button>
                                        </div>

                                        <div class="operation_setter" v-else>-</div>

                                    </template>
                                </el-table-column>
                            </el-table>
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
                                    v-model="searchDate.alarmType" 
                                    @change="searchAlarm"
                                    :placeholder="$t('action.select')">
                                    <el-option
                                        v-for="(item,index) in vars.alarmType"
                                        :key="index"
                                        :label="item.name"
                                        :value="item.type">
                                    </el-option>
                                </el-select>

                                <div class="search_input">
                                    <el-input
                                        :placeholder="$t('action.search-input')"
                                        v-model="searchDate.alarmDetail"
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
                                        prop="alarmType"
                                        label="业务类型"
                                        fixed
                                        min-width="140">
                                        <template scope="scope">
                                            <div class="alarm-detail">
                                                {{utils.getObjValByKey(vars.alarmType,scope.row.alarmType,'type','name')}}
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="alarmDetail"
                                        label="消息详情"
                                        min-width="500">
                                        <template scope="scope">
                                            <div class="alarm-detail">
                                                {{scope.row.alarmDetail}}
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="name"
                                        label="处理时间"
                                        min-width="180">
                                        <template scope="scope">
                                            {{scope.row.handleTime | formatDate}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="name"
                                        label="发生时间"
                                        min-width="180">
                                        <template scope="scope">
                                            {{scope.row.alarmTime | formatDate}}
                                        </template>
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

    </div>
</template>

<script>


import websocket from '../../../api/websocket';
import alarmServer from '../js/alarm.server';

export default {
    name:'AlarmInfo',
    components:{
        
    },
    data(){
        return{
            isShowDialog:false,
            alarmList:[],
            entityType:"ROAD_ELEMENT",
            subscriptionId:'',
            searchText:"",
            cancelList:[],
            cancelList2:[],
            activeName:"first",
            historyAlarmList:[],
            pageInit:{},
            searchDate:{
                date:"",
                startTime:"",
                endTime:"",
                isHandled:"",
                alarmDetail:"",
                alarmType:"",
            },
            currentHeight:520,
            oldHeight:450,
            historyHeight:550,
            currentHeightW:550
        }
    },
    mounted() {
        var _this = this;
        this.pageInit=JSON.parse(JSON.stringify(this.vars.pageInit));
        this.getNewAlarm();
        this.getwebsocket();
        this.getwebsocket2();
        
        window.addEventListener('resize', this.setHeight,false);
        
        this.bus.$on('removeMsgInfo',function(id){
            _this.removeAlarm(id);
        })
        
    },
    // computed:{
    //     searchList(){
    //         return this.alarmList.filter(item=>(item.alarmDetail || '').toLowerCase().includes(this.searchText.toLowerCase()));
    //     }
    // },
    watch:{
        alarmList(){
            var len=this.alarmList.length;
            this.showAlarmInfo(len>0);
            if(len == 0){
                this.isShowDialog=false;
                this.$refs.baseDialog.toggleDialog(false);
            }
        },
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
                startTime:"",
                endTime:"",
                isHandled:"",
                alarmDetail:"",
                alarmType:"",
            }
            
            this.isShowDialog=false;
        },
        showAlarmInfo(data){
            this.$emit('showAlarm',data);
        },
        showAlarmNotify(data){
            this.$emit('showAlarmNotify',data);
        },
        // 未处理的报警
        async getNewAlarm(){
            try{
                var data = {
                    pageSize:1000,
                    pageIndex:1,
                    isHandled:'false',
                    // alarmDetail:alarmDetail,
                    // alarmType:alarmType,
                }
                var result = await alarmServer.getAlarmHistory(data);
                this.alarmList = result.content || [];
            }catch(e){
                this.messages.error(e.message)
            }
        },
        async getAlarmHistory(){//历史
            var _this = this;
            try{
                var pageSize = this.pageInit.pageSize,
                    pageIndex = this.pageInit.pageIndex,
                    startTime = this.searchDate.startTime,
                    endTime = this.searchDate.endTime,
                    isHandled = this.searchDate.isHandled || true,
                    alarmDetail = this.searchDate.alarmDetail,
                    alarmType = this.searchDate.alarmType;
                var data = {
                    pageSize:pageSize,
                    pageIndex:pageIndex,
                    startTime:startTime,
                    endTime:endTime,
                    isHandled:isHandled,
                    alarmDetail:alarmDetail,
                    alarmType:alarmType,
                    // deviceGroupId:subareaId
                }
                var result = await alarmServer.getAlarmHistory(data);
                this.historyAlarmList=result.content;
                this.pageInit.total=result.totalElements;
            }catch(e){
                _this.messages.error(e.message)
            }
        },
        pagechange(val){
            this.pageInit.pageIndex=val;
            this.getAlarmHistory();
        },
        sizeChange(val){
            this.pageInit.pageSize = val;
            this.getAlarmHistory();
        },
        async alarmAccept(info){
            // 边界更新、启用
            let processing='update';
            let activeType=1;
            if(info.alarmType==this.vars.alarmType[3].type||info.alarmType==this.vars.alarmType[4].type){
                processing='obstacle';
            }
            if(info.alarmType==this.vars.alarmType[2].type){
                activeType=2;
                processing='status';
            }
            this.toggleDialog();

            //路由跳转
            let taskId = "";
            if(info.taskId){
                taskId = info.taskId;
            }else{
                taskId = info.alarmEventJson && info.alarmEventJson.taskId ? info.alarmEventJson.taskId : '';
            }
            let sourceSn = info.sourceSn;
            let groupId = info.alarmEventJson && info.alarmEventJson.oldGrpId ? info.alarmEventJson.oldGrpId : '';
            let id = groupId ? groupId : sourceSn;

            if(info.alarmType==this.vars.alarmType[0].type||info.alarmType==this.vars.alarmType[3].type){//采掘区
                var url = '/digLoadingArea/map/'+id
            }else if(info.alarmType==this.vars.alarmType[1].type||info.alarmType==this.vars.alarmType[2].type||info.alarmType==this.vars.alarmType[4].type){//排土场
                var url = '/unloadAeraMovement/map/'+id
            }

            let routerPath = {
                path:url,
                query:{
                    areaSn:sourceSn,
                    areaTypeSn:info.sourceType,
                    activeType:activeType,
                    processing:processing,
                    taskId:taskId,
                    alarmId:info.id
                }
            };
            this.$router.push(routerPath);
        },
        async ignoreMessage(v,i){
            console.log(v);
            try{
                var id = v.id;
                if(!id)return;
                await alarmServer.alarmHandle(id);
                this.alarmList.splice(i,1);
                this.messages.success(this.$t('action.operate-success'));
            }catch(e){
                this.messages.error(e.message);
                console.error(e);
            }
        },
        removeAlarm(id){
            //移除报警
            for (let i = 0; i < this.alarmList.length; i++) {
                if (this.alarmList[i].id == id) {
                    this.alarmList.splice(i,1);
                    break;
                }
            }
        },
        getwebsocket(){//消息订阅
            var entityType = this.entityType;
            // var entityId = this.subareaId;
            var _this=this;

            // if(entityId){
                var hdMapLoadBoundaryCmds = {
                    entityType: entityType,
                    // entityId: entityId,
                };

                var subscriber = {
                    hdMapLoadBoundaryCmds: [hdMapLoadBoundaryCmds],
                    type: 'loadBoundryUpdate'
                };
                
                subscriber.onReconnected = function() {}
                subscriber['onData'] = function(data) {
                    if (data.data) {
                        _this.onData(data, true);
                    }
                }
                websocket.subscribe(subscriber,function(data){
                    _this.cancelList = data;
                });
            // }
        },
        getwebsocket2(){//消息订阅
            var entityType = this.entityType;
            // var entityId = this.subareaId;
            var _this=this;

            // if(entityId){
                var hdMapUnloadBoundaryCmds = {
                    entityType: entityType,
                    // entityId: entityId,
                };

                var subscriber = {
                    hdMapUnloadBoundaryCmds: [hdMapUnloadBoundaryCmds],
                    type: 'unloadBoundryUpdate'
                };
                
                subscriber.onReconnected = function() {}
                subscriber['onData'] = function(data) {
                    if (data.data) {
                        _this.onData(data, true);
                    }
                }
                
                websocket.subscribe(subscriber,function(data){
                    _this.cancelList2 = data;
                });
            // }
        },
        unwebsocket(){//取消订阅
           var _this=this;
            if(_this.cancelList.length>0){
                var subscriber = {
                    hdMapLoadBoundaryCmds: _this.cancelList,
                    type: 'loadBoundryUpdate'
                };

                websocket.unsubscribe(subscriber);
            }
        },
        unwebsocket2(){//取消订阅
           var _this=this;
            if(_this.cancelList2.length>0){
                var subscriber = {
                    hdMapUnloadBoundaryCmds: _this.cancelList2,
                    type: 'unloadBoundryUpdate'
                };

                websocket.unsubscribe(subscriber);
            }
        },
        onData(data,type){//实时获取到数据填充
            this.subscriptionId=data.subscriptionId;
            var res=data.data;
            console.log(data);
            if(res.boundryUpdate){
                //一条新告警
                //如果同时接受相同的告警只显示一条
                this.alarmList.unshift(res.boundryUpdate);
                if(!this.isShowDialog){
                    this.showAlarmNotify(res.boundryUpdate);
                }
                if(this.alarmList.length > 0){
                    this.$emit('vioceAlarm');
                }
            }
            else if(res.removeBoundryUpdateMsg){
                //删除一条告警
                var taskId = res.removeBoundryUpdateMsg[0];
                this.removeAlarm(taskId);
            }
            //console.log(this.alarmList);
            this.showAlarmInfo(this.alarmList.length > 0);

            if(this.$route.name=="LoadareaBoundaryMap"){
                this.$parent.changeHandle();
            };
            
        }
    },
    beforeDestroy() {
        this.bus.$off('removeMsgInfo');
        window.removeEventListener("resize", this.setHeight,false);
        this.unwebsocket();
        this.unwebsocket2();
    }
}
</script>

<style lang="scss" scoped>

</style>

<style lang="scss">

@import "../../../common/css/alarmInfo.scss";

</style>
