<template>
<!-- 调度历史 -->
    <div class="dispatch-log">
        <div class="search" v-if="detailsInfo.equipmentTypeSn==vars.deviceType[0].id">
            <el-radio-group class="radio-group" v-model="search" @change="datachange">
                <!-- 作业状态 -->
                <el-radio :label="1">{{$t("dispatch.dispatch-log-search-task")}}</el-radio>
                <!-- 设备状态 -->
                <el-radio :label="2">{{$t("dispatch.dispatch-log-search-device")}}</el-radio>
                <!-- 路权信息 -->
                <!-- <el-radio :label="3">{{$t("dispatch.dispatch-log-search-road")}}</el-radio> -->
            </el-radio-group>
        </div>
        <div class="dispatch_table" :class="{dispatchTop:detailsInfo.equipmentTypeSn!=vars.deviceType[0].id}">
            <!-- 作业状态 -->
            <el-table
                ref="workStatus"
                @filter-change="filterChange"
                key="search1"
                v-if="search==1"
                class="no_border"
                :data="dataList"
                style="width: 100%">
                <!-- 序号 -->
                <el-table-column
                    width="90"
                    :label='$t("common.key")'>
                    <template scope="scope">
                    {{scope.$index+1}}
                    </template>
                </el-table-column>
                
                <!-- 时间 -->
                <el-table-column
                width="200"
                :label='$t("dispatch.dispatch-log-time")'>
                    <template scope="scope">
                    <p>{{scope.row.eventTime | formatDate}}</p>
                    </template>
                </el-table-column>
                <!-- 调度目标 -->
                <el-table-column
                property="toIdName"
                show-overflow-tooltip
                :label='$t("dispatch.dispatch-target")'>
                </el-table-column>
                <!-- 结果 -->
                <el-table-column
                :filter-multiple="false"
                :filters="dispatchingResultList"
                :column-key="'dispatchingResult'"
                filter-placement="right-start"
                :label='$t("dispatch.result")'>
                    <template scope="scope">
                        <p>{{utils.getObjValByKey(dispatchingResultList,scope.row.dispatchingResult,'value','text')}}</p>
                    </template>
                </el-table-column>
                <!-- 原因 -->
                <el-table-column
                width="300"
                property="failureReason"
                show-overflow-tooltip
                :label='$t("dispatch.device-operation-reason")'>
                </el-table-column>
            </el-table>
            <!-- 设备状态，路权信息 -->
            <el-table
                key="search2"
                v-else
                class="no_border"
                :data="dataList"
                style="width: 100%">
                <!-- 序号 -->
                <el-table-column
                    :label='$t("common.key")'
                    min-width="15%">
                    <template scope="scope">
                    {{scope.$index+1}}
                    </template>
                </el-table-column>

                <el-table-column
                min-width="30%"
                :label='$t("dispatch.dispatch-log-time")'>
                    <template scope="scope">
                    <p>{{scope.row.createTime | formatDate}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                min-width="55%"
                property="messageInfo"
                show-overflow-tooltip
                :label='$t("dispatch.dispatch-log-description")'>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination_footer_w">
            <div class="pagination_footer">
                <base-pagination :total="pageInit.total" :singleDisplay="pageInit.pageSize" :currentPage="pageInit.pageIndex" @pagechange="pagechange" @sizeChange="sizeChange"></base-pagination>
            </div>
        </div>
    </div>
</template>

<script>

import dispatchMixin from '@/common/mixins/dispatch.mixins.js';
import dispatchServer from '../..//api/dispatch.server.js';
import informationServer from '../../api/information.server';

export default {
    name:'DispatchLog',
    mixins:[dispatchMixin],
    props:['detailsInfo'],
    data() {
        return {
            dataList:[],
            search:1,
            pageInit:{},
            deviceSn:'',
            deviceId:"",
            dispatchingResult:"",
            dispatchingResultList:[
                {
                    value:0,
                    text:'失败',
                },
                {
                    value:1,
                    text:'成功',
                },
            ],
        }
    },
    created() {
        this.pageInit=JSON.parse(JSON.stringify(this.vars.pageInit));
        this.deviceId=this.detailsInfo.deviceId;
        this.getInit();
    },
    watch:{
        'detailsInfo.deviceId'(val){
            this.deviceId=val;
            this.pageInit.pageIndex=1;
            this.getInit();
        }
    },
    methods: {
        getInit(page){
            if(!page){
                this.dispatchingResult="";
                if(this.$refs.workStatus)this.$refs.workStatus.clearFilter();
            };
            if(this.detailsInfo.equipmentTypeSn==this.vars.deviceType[0].id){
                this.deviceSn = this.detailsInfo.truckSn;
                this.deviceType="TRUCK";
            }else if(this.detailsInfo.equipmentTypeSn==this.vars.deviceType[1].id){
                this.search=2;
                this.deviceSn = this.detailsInfo.shovelSn;
                this.deviceType="DIGGER";
            }else if(this.detailsInfo.equipmentTypeSn==this.vars.deviceType[2].id){
                this.search=2;
                this.deviceSn = this.detailsInfo.dumpSn;
                this.deviceType="DUMP_AREA";
            }
            if(this.search==1&&(this.detailsInfo.equipmentTypeSn==this.vars.deviceType[0].id)){
                this.getOutputMessage();
            } else if(this.search==2){
                this.getStatus();
            } else if(this.search==3){
                this.getHistory();
            }
            
        },
        pagechange(val){
            this.pageInit.pageIndex = val;
            this.getInit(true);
        },
        sizeChange(val){
            this.pageInit.pageSize = val;
            this.getInit(true);
        },
        filterChange(filters){
            this.pageInit.pageIndex = 1;

            if(filters.hasOwnProperty('dispatchingResult')){
                var dispatchingResult = filters.dispatchingResult[0];
                this.dispatchingResult = (!this.utils.isNotNum(dispatchingResult)?dispatchingResult:"");
            }
            this.getOutputMessage();
        },
        datachange(val){
            this.pageInit.pageIndex=1;
            this.search=val;
            this.getInit();
        },
        async getOutputMessage(){
            //查询调度历史-作业状态
            try {
                
                var data = {
                    pageSize:this.pageInit.pageSize,
                    pageIndex:this.pageInit.pageIndex-1,
                    subareaSn:this.subareaSn,
                    truckId:this.deviceId
                }
                
                var dispatchingResult=this.dispatchingResult;
                this.utils.isNotNum(dispatchingResult)||(data['dispatchingResult']=dispatchingResult);
                
                var result=await dispatchServer.dispatchingJobEvent(data);
                
                this.dataList=result.content;
                this.pageInit.total=result.totalElements;
            } catch (e) {
                this.messages.error(e.message);
            }
        },
        async getHistory(){
            //查询调度历史-路权信息
            try {
                var info={
                    deviceId:this.deviceId,
                    deviceType:this.deviceType,
                    searchType:this.search,
                    pageIndex:this.pageInit.pageIndex,
                    pageSize:this.pageInit.pageSize
                };
                var result=await dispatchServer.getDispatchHistory(info);
                var content=result.content;
                this.dataList=content.map(item=>{
                    return {
                        createTime:item.createdStr,
                        messageInfo:item.info
                    }
                });
                this.pageInit.total=result.totalElements;
            } catch (e) {
                this.messages.error(e.message);
            }
        },
        async getStatus(){
            //查询调度历史-设备状态
            try {
                var equipmenttypeSn = this.equipmenttypeSn?this.equipmenttypeSn:'';
                var device = this.device?this.device:'';
                var info={
                    pageIndex:this.pageInit.pageIndex-1,
                    pageSize:this.pageInit.pageSize,
                    subareaSn:this.subareaSn,
                    equipmentTypeSn:this.detailsInfo.equipmentTypeSn,
                    equipmentSn:this.deviceSn,
                };
                var result=await informationServer.getEquipmentStatusList(info);
                var content=result.content;
                this.dataList=content.map(item=>{
                    return {
                        createTime:item.startTime,
                        messageInfo:'变更为'+this.utils.getObjValByKey(this.vars.runStatus,item.equStatus,'code')
                    }
                });
                this.pageInit.total=result.totalElements;
            } catch (e) {
                this.messages.error(e.message);
            }
        }
    },
}
</script>

<style lang='scss'>
.dispatch-log{
    height: 100%;
    .search{
        margin: 0 20px 20px;
        .el-radio{
            @include theme-content-color;
        }
        
    }
    .dispatch_table{
        position: absolute;
        top: 50px;
        left: 0;
        right: 0;
        bottom: 60px;
        @include scrollbar-style;
        &.dispatchTop{
            top: 20px;
        }
    }
    .pagination_footer_w{
        height: 80px;
        .pagination_footer{
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
        }
    }
}


</style>
