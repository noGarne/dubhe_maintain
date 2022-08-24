<template>
    <!-- 报警信息 -->
    <div class="alarm-info">
        <base-dialog 
        ref="baseDialog"
        title='系统消息'
        :width="'1050px'"
        :buttonShow="false"
        @closeDialog="closeDialog">
            <div class="alarm-dialog">
                <div class="alarm-padding">
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
                                    v-for="(item,index) in vars.systemAlarmTypeList"
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
                        <div class="history_content">
                            <el-table
                                ref="tbHistory"
                                class="table-alarm"
                                v-loading="loading"
                                element-loading-text="加载中..."
                                element-loading-background="rgba(0,0,0,0.1)"
                                :height="oldHeight"
                                key="history"
                                :data="historyAlarmList"
                                style="width: 100%">
                                <el-table-column
                                    prop="alarmType"
                                    label="业务类型"
                                    fixed
                                    min-width="80">
                                    <template scope="scope">
                                        <p>{{utils.getObjValByKey(vars.systemAlarmTypeList,scope.row.systemAlarmType,'type','name')}}</p>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="alarmDetail"
                                    label="消息详情"
                                    min-width="600">
                                    <template scope="scope">
                                        <div class="alarm-detail">
                                            {{scope.row.systemAlarmDetail}}
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="name"
                                    label="发生时间"
                                    min-width="160">
                                    <template scope="scope">
                                        {{scope.row.systemAlarmTime | formatDate}}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="name"
                                    label="处理时间"
                                    min-width="160">
                                    <template scope="scope">
                                        {{scope.row.handleTime | formatDate}}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="name"
                                    label="处理人"
                                    min-width="90">
                                    <template scope="scope">
                                        {{scope.row.handleUserName}}
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="pagination_location">
                            <base-pagination :total="pageInit.total" :singleDisplay="pageInit.pageSize" :currentPage="pageInit.pageIndex" @pagechange="pagechange" @sizeChange="sizeChange"></base-pagination>
                        </div>
                    </div>
                </div>
            </div>
        </base-dialog>

    </div>
</template>

<script>

import headerServer from '../../api/header.server';

export default {
    name:'AlarmInfo',
    components:{
    },
    data(){
        return{
            loading:true,
            isShowDialog:false,
            historyAlarmList:[],
            pageInit:{},
            searchDate:{
                date:"",
                startTime:"",
                endTime:"",
                alarmDetail:"",
                alarmType:"",
            },
            oldHeight:450,
            historyHeight:550,
        }
    },
    mounted() {
        this.pageInit=JSON.parse(JSON.stringify(this.vars.pageInit));
        
        window.addEventListener('resize', this.setHeight,false);
        
    },
    computed:{
        
    },
    watch:{
        
    },
    methods: {
        // 告警搜索
        async showMessage(){//查看信息接口
            var _this = this;
            try{
                var user= this.$store.state.currentUser;
                var data = {
                    handleUserId:user.userId,
                    handleUserName:user.firstName
                }
                await headerServer.showMessage(data);
                this.getAlarmHistory();
                
            }catch(e){
                _this.messages.error(e.message)
            }
        },
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
        toggleDialog(){
            this.isShowDialog=!this.isShowDialog;
            this.$refs.baseDialog.toggleDialog();
            if(this.isShowDialog){
                this.pageInit=JSON.parse(JSON.stringify(this.vars.pageInit));
                this.showMessage();
                this.setHeight();
            }
        },
        setHeight(){
            var windowH=window.innerHeight;
            var surplus = windowH*0.7972;
            var last2  = surplus - 213;
            var last4  = surplus - 113;
            this.oldHeight=last2;
            this.historyHeight=last4;
        },
        closeDialog(){
            this.searchDate={
                date:"",
                startTime:"",
                endTime:"",
                alarmDetail:"",
                alarmType:"",
            }
            this.historyAlarmList=[];
            this.loading=true;
            this.isShowDialog=false;
        },
       
        async getAlarmHistory(){//历史
            var _this = this;
            try{
                var pageSize = this.pageInit.pageSize,
                    pageIndex = this.pageInit.pageIndex-1,
                    startTime = this.searchDate.startTime,
                    endTime = this.searchDate.endTime,
                    alarmDetail = this.searchDate.alarmDetail,
                    alarmType = this.searchDate.alarmType;
                var data = {
                    pageSize:pageSize,
                    pageIndex:pageIndex,
                    
                }

                !startTime||(data['startTime']=startTime);
                !endTime||(data['endTime']=endTime);
                !alarmDetail||(data['alarmDetail']=alarmDetail);
                !alarmType||(data['alarmType']=alarmType);
                
                var result = await headerServer.getAlarmHistory(data);
                _this.loading=false;
                this.historyAlarmList=result.content;
                this.pageInit.total=result.totalElements;
            }catch(e){
                _this.loading=false;
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
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.setHeight,false);
    }
}
</script>

<style lang="scss" scoped>

.alarm-dialog{
    // position: relative;
    .alarm-padding{
        padding: 20px 20px 0;
    }
    .search_history{
        padding:0 0 10px 0;
    }
}

</style>

<style lang="scss">

@import "../../common/css/alarmInfo.scss";

</style>
