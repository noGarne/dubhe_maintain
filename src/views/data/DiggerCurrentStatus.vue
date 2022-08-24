<template>
<!-- 采装设备当前状态 -->

<div class="table_content">
    <div class="content_center content_tabs">
        <!-- <div class="btn_search">
            <el-button type="primary" class="btnGray" @click="resetDate"><i class="iconfont icon-zhongzhi themeOrangeColor"></i>{{$t('action.reset')}}</el-button>
        </div> -->
        <el-tabs type="card" class="tabs_only_one">
          <el-tab-pane :label="$t('data-manager.digger-current-status')">
            <div class="list_scrollbar_page list_scrollbar_page_top">
                <el-table
                    ref="listTable"
                    class="no_border"
                    :max-height="tableHeight+searchHeight"
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
                    property="parameter.subareaName"
                    show-overflow-tooltip
                    :label='$t("device.subarea")'
                    :filter-multiple="false"
                    :filters="subareaList"
                    :column-key="'subareaSn'"
                    min-width="16%"
                    filter-placement="right-start">
                    </el-table-column>
                    <!-- 采装设备名称 -->
                    <el-table-column
                    property="shovelName"
                    min-width="16%"
                    show-overflow-tooltip
                    :label='$t("dispatch-set.digger-name")'
                    :filter-multiple="false"
                    :filters="deviceList"
                    :column-key="'equipmentSn'"
                    filter-placement="right-start">
                    </el-table-column>
                    <!-- 状态类型 -->
                    <el-table-column
                    min-width="17%"
                    show-overflow-tooltip
                    :label='$t("data-manager.status-type")'>
                        <template scope="scope">
                            <p>{{utils.getObjValByKey(vars.runStatus,scope.row.status.equStatus,'code') }}</p>
                        </template>
                    </el-table-column>
                    <!-- 状态原因 -->
                    <el-table-column
                    property="status.reasonName"
                    min-width="17%"
                    show-overflow-tooltip
                    :label='$t("dispatch-set.status-reason")'>
                    </el-table-column>
                    <!-- 原因描述 -->
                    <el-table-column
                    property="status.reasonComment"
                    min-width="17%"
                    show-overflow-tooltip
                    :label='$t("dispatch.device-status-remark")'>
                    </el-table-column>
                    <!-- 发生时间 -->
                    <el-table-column
                    property="status.startTimeStr"
                    min-width="17%"
                    show-overflow-tooltip
                    :label='$t("data-manager.start-time")'>
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

import subareaServer from '../../api/subarea.server';
import devicesServer from '../../api/devices.server';
import dispatchSetServer from '../../api/dispatchSet.server';

import tableMixins from "@/common/mixins/table.mixins";

export default {
    name:'DiggerCurrentStatus',
    mixins: [tableMixins],
    data(){
        return{
            list:[],
            deviceType:'',
            subarea:'',
            subareaList:[],
            device:'',
            deviceList:[],
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
            var resultFleet = await subareaServer.subareaList(page);
            this.subareaList=this.utils.getFilters(resultFleet.content || [],'subareaSn','subareaName');
            //采装设备
            this.deviceType=this.vars.deviceType[1].id;
            
            var data = {
                pageSize:this.vars.pageData.pageSize,
                pageIndex:this.vars.pageData.pageIndex,
                equipmentTypeSn:this.vars.deviceType[1].id,
                sort:"ASC",
                sortName:"equipmentName"
            };
            
            var resultDevice = await devicesServer.devicesList(data);
            this.deviceList = this.utils.getFilters(resultDevice.content || [],'equipmentSn','equipmentName');

            this.getSearch();
        },
        async getSearch(search){
            if(search){
                this.pageInit.pageIndex = 1;
            }
            //列表
            this.subarea=this.subarea?this.subarea:'';
            this.device=this.device?this.device:'';
            var info={
                pageIndex:this.pageInit.pageIndex,
                pageSize:this.pageInit.pageSize,
                equipmentTypeSn:this.deviceType,
                subareaSn:this.subarea,
                equipmentSn:this.device,
            };
            var result = await dispatchSetServer.getEquipmentList(info);
            this.list=result.content || [];
            this.pageInit.total=result.totalElements;
        },
        filterChange(filters){
            if(filters.hasOwnProperty('subareaSn')){
                this.subarea = filters.subareaSn[0];
            }
            if(filters.hasOwnProperty('equipmentSn')){
                this.device = filters.equipmentSn[0];
            }
            this.getSearch(true);
        },
        resetDate(){
            this.subarea='';
            this.device='';
            this.$refs.listTable.clearFilter();
            this.getSearch(true);
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
