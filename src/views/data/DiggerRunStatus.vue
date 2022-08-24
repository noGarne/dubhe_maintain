<template>
<!-- 采装设备运行状态 -->
<div class="table_content">
    <div class="content_center content_tabs">
        <div class="btn_search">
            <el-date-picker
                v-model="time"
                type="daterange"
                :range-separator="$t('devicesLog.to')"
                :start-placeholder="$t('devicesLog.startTime')"
                :end-placeholder="$t('devicesLog.endTime')"
                    @change="getSearch(true)"
                align="right">
            </el-date-picker>
            <button type="button" class="btnGray" @click="resetDate">
                <i class="iconfont icon-zhongzhi themeOrangeColor"></i>
                {{$t('action.reset')}}
            </button>
        </div>
        <el-tabs type="card" class="tabs_only_one">
          <el-tab-pane :label="$t('data-manager.digger-run-status')">
            <div class="list_scrollbar_page">
                <el-table
                    ref="listTable"
                    class="no_border"
                    :max-height="tableHeight"
                    :data="list"
                    @filter-change="filterChange"
                    :row-class-name="tableRowClassName"
                    style="width: 100%">
                    <!-- 序号 -->
                    <el-table-column
                        :label='$t("common.key")'
                        width="100px">
                        <template scope="scope">
                        {{scope.$index+1}}
                        </template>
                    </el-table-column>
                    <!-- 所属分区 -->
                    <el-table-column
                    show-overflow-tooltip
                    :label='$t("device.subarea")'
                    :filter-multiple="false"
                    :filters="subareaList"
                    :column-key="'subareaSn'"
                    filter-placement="right-start">
                        <template scope="scope">
                        {{utils.getObjValByKey(subareaList,scope.row.subareaSn,'value','text')}}
                        </template>
                    </el-table-column>
                    
                    <!-- 采装设备名称 -->
                    <el-table-column
                    property="equipmentName"
                    show-overflow-tooltip
                    :label='$t("dispatch-set.digger-name")'
                    :filter-multiple="false"
                    :filters="deviceList"
                    :column-key="'equipmentSn'"
                    filter-placement="right-start">
                    </el-table-column>
                    
                    <!-- 状态类型 -->
                    <el-table-column
                    show-overflow-tooltip
                    :label='$t("data-manager.status-type")'
                    :filter-multiple="false"
                    :filters="statusList"
                    :column-key="'equStatus'"
                    filter-placement="right-start">
                        <template scope="scope">
                            <p>{{utils.getObjValByKey(vars.runStatus,scope.row.equStatus,'code') }}</p>
                        </template>
                    </el-table-column>
                    
                    <!-- 状态原因 -->
                    <el-table-column
                    property="reasonName"
                    show-overflow-tooltip
                    :label='$t("dispatch-set.status-reason")'>
                    </el-table-column>
                    <!-- 原因描述 -->
                    <el-table-column
                    property="reasonComment"
                    show-overflow-tooltip
                    :label='$t("dispatch.device-status-remark")'>
                    </el-table-column>
                    <!-- 发生时间 -->
                    <el-table-column
                    show-overflow-tooltip
                    :label='$t("data-manager.start-time")'>
                        <template scope="scope">
                        <p>{{scope.row.startTime | formatDate}}</p>
                        </template>
                    </el-table-column>
                    <!-- 结束时间 -->
                    <el-table-column
                    show-overflow-tooltip
                    :label='$t("data-manager.end-time")'>
                        <template scope="scope">
                        <p>{{scope.row.finishTime | formatDate}}</p>
                        </template>
                    </el-table-column>
                    <!-- 持续时间 -->
                    <el-table-column
                    property="durationTime"
                    show-overflow-tooltip
                    :label='$t("data-manager.continue-time")'>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination_location">
                <base-pagination :total="pageInit.total" :singleDisplay="pageInit.pageSize" :currentPage="pageInit.pageIndex" @pagechange="pagechange" @sizeChange="sizeChange"></base-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
    </div>
</div>
</template>

<script>

import subareaServer from '@/api/subarea.server';
import devicesServer from '@/api/devices.server';
import informationServer from '../../api/information.server';

import tableMixins from "@/common/mixins/table.mixins";

export default {
    name:'DiggerRunStatus',
    mixins: [tableMixins],
    data(){
        return{
            list:[],
            subarea:'',
            subareaList:[],
            device:'',
            deviceList:[],
            status:'',
            statusList:[],
            time:'',
            pageInit:{},
        }
    },
    created(){
        this.pageInit=JSON.parse(JSON.stringify(this.vars.pageInit));
        this.getList();
    },
    methods:{
        pagechange(page){
            this.pageInit.pageIndex = page;
            this.getList();
        },
        sizeChange(val){
            this.pageInit.pageSize = val;
            this.getList();
        },
        async getList(){
            //分区
            var page = {
                pageSize:this.vars.pageData.pageSize,
                sortName:"subareaName",
                sort:"ASC"
            }
            var resultSubarea = await subareaServer.subareaList(page);
            this.subareaList=this.utils.getFilters(resultSubarea.content || [],'subareaSn','subareaName');
            //采装设备
            var data = {
                pageSize:this.vars.pageData.pageSize,
                pageIndex:this.vars.pageData.pageIndex,
                equipmentTypeSn:this.vars.deviceType[1].id,
                sort:"ASC",
                sortName:"equipmentName"
            };
            var resultDevice = await devicesServer.devicesList(data);
            this.deviceList = this.utils.getFilters(resultDevice.content || [],'equipmentSn','equipmentName');
            //运行状态
            this.statusList=this.utils.getFilters(this.vars.runStatus,'code','name');

            //列表
            this.getSearch();
        },
        async getSearch(search){
            if(search){
                this.pageInit.pageIndex = 1;
            }
            //列表
            var subareaSn=this.subarea?this.subarea:'';
            var equipmentSn=this.device?this.device:'';
            var equStatus=this.status?this.status:'';
            var time=this.time || [];
            var startTime=time[0]?new Date(new Date(time[0]).toLocaleDateString()+' 00:00:00').getTime():'';
            var endTime=time[1]?new Date(new Date(time[1]).toLocaleDateString()+' 23:59:59').getTime():'';
            var info={
                pageIndex:this.pageInit.pageIndex-1,
                pageSize:this.pageInit.pageSize,
                subareaSn:subareaSn,
                equipmentTypeSn:this.vars.deviceType[1].id,
                equipmentSn:equipmentSn,
                equStatus:equStatus,
                startTime:startTime,
                endTime:endTime,
            };
            var result = await informationServer.getEquipmentStatusList(info);
            this.list=result.content || [];
            this.pageInit.total=result.totalElements;
        },
        filterChange(filters){
            console.log(filters)
            if(filters.hasOwnProperty('subareaSn')){
                this.subarea = filters.subareaSn[0];
            }
            if(filters.hasOwnProperty('equipmentSn')){
                this.device = filters.equipmentSn[0];
            }
            if(filters.hasOwnProperty('equStatus')){
                this.status = filters.equStatus[0];
            }
            this.getSearch(true);
        },
        resetDate(){
            this.subarea='';
            this.device='';
            this.status='';
            this.time='';
            this.getSearch(true);
            this.$refs.listTable.clearFilter();
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
