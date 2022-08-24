<template>
<!-- 登录司机修改 -->
<div class="table_content">
    <div class="content_center content_tabs">
        <div class="btn_search">
            <el-date-picker
                v-if="currTab=='1'"
                :key="'driverTime'"
                v-model="time"
                type="date"
                :placeholder="$t('common.select-date')"
                @change="getSearch(true)"
                align="right">
            </el-date-picker>
            
            <el-date-picker
                v-else
                :key="'getCabinDriverData'"
                v-model="time"
                type="date"
                :placeholder="$t('common.select-date')"
                @change="getCabinDriver(true)"
                align="right">
            </el-date-picker>
            <el-button type="primary" class="btnGray" @click="resetDate">
                <i class="iconfont icon-zhongzhi themeOrangeColor"></i>
                {{$t('action.reset')}}
            </el-button>
        </div>
        <!-- <el-tabs type="card" class="tabs_only_one"> -->
        <el-tabs type="card" v-model="currTab">
            <el-tab-pane :label="$t('data-manager.login-driver-edit')" name="1">
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
                        property="subareaName"
                        show-overflow-tooltip
                        :label='$t("device.subarea")'
                        :filter-multiple="false"
                        :filters="subareaList"
                        :column-key="'subareaSn'"
                        filter-placement="right-start">
                    </el-table-column>
                    <!-- 卡车名称 -->
                    <el-table-column
                        property="truckName"
                        show-overflow-tooltip
                        :label='$t("dispatch-set.truck-name")'
                        :filter-multiple="false"
                        :filters="truckList"
                        :column-key="'truckSn'"
                        filter-placement="right-start">
                    </el-table-column>
                    <!-- 卡车司机 -->
                    <el-table-column
                        property="truckDriverName"
                        show-overflow-tooltip
                        :label='$t("personnel.truck-driver")'>
                    </el-table-column>
                    <!-- 采装设备名称 -->
                    <el-table-column
                        property="shovelName"
                        show-overflow-tooltip
                        :label='$t("dispatch-set.digger-name")'
                        :filter-multiple="false"
                        :filters="shovelList"
                        :column-key="'shovelSn'"
                        filter-placement="right-start">
                    </el-table-column>
                    <!-- 采装设备主司机 -->
                    <el-table-column
                        property="shovelMainDriverName"
                        show-overflow-tooltip
                        :label='$t("personnel.digger-main-driver")'>
                    </el-table-column>
                    <!-- 采装设备副司机 -->
                    <el-table-column
                        property="shovelSubDriverName"
                        show-overflow-tooltip
                        :label='$t("personnel.digger-assistant-driver")'>
                    </el-table-column>
                    <!-- 班次 -->
                    <el-table-column
                        width="100"
                        property="truckShiftTypeName"
                        show-overflow-tooltip
                        :label='$t("information.shift-crew")'
                        :filter-multiple="false"
                        :filters="shiftList"
                        :column-key="'truckShiftTypeSn'"
                        filter-placement="right-start">
                    </el-table-column>
                    <!-- 装完时间 -->
                    <el-table-column
                        show-overflow-tooltip
                        width="200"
                        :label='$t("dump.load-time")'>
                        <template scope="scope">
                        <p>{{scope.row.loadFinishTime | formatDate}}</p>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination_location">
                <base-pagination :total="pageInit.total" :singleDisplay="pageInit.pageSize" :currentPage="pageInit.pageIndex" @pagechange="pagechange" @sizeChange="sizeChange"></base-pagination>
            </div>
            </el-tab-pane>
            <!-- <el-tab-pane :label="$t('data-manager.login-driver-edit')" name="2"> -->
            <el-tab-pane label="远程接管员" name="2">
            <div class="list_scrollbar_page">
                <el-table
                    ref="listTable2"
                    class="no_border"
                    :max-height="tableHeight"
                    :data="cabinDriverList"
                    @filter-change="filterChange2"
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
                        property="subareaName"
                        show-overflow-tooltip
                        :label='$t("device.subarea")'
                        :filter-multiple="false"
                        :filters="subareaList"
                        :column-key="'subareaSn'"
                        filter-placement="right-start">
                    </el-table-column>
                    <!-- 远程接管座舱 -->
                    <el-table-column
                        property="equipmentName"
                        show-overflow-tooltip
                        label='远程接管座舱'>
                    </el-table-column>
                    <!-- 远程接管员 -->
                    <el-table-column
                        property="driverName"
                        show-overflow-tooltip
                        label='远程接管员'>
                    </el-table-column>
                    <!-- 手机号 -->
                    <el-table-column
                        property="phoneNumber"
                        show-overflow-tooltip
                        label='手机号'>
                    </el-table-column>
                    <!-- 最近登录时间 -->
                    <el-table-column
                        show-overflow-tooltip
                        width="200"
                        :label='$t("information.login-time")'>
                        <template scope="scope">
                        <p>{{scope.row.loginTime | formatDate}}</p>
                        </template>
                    </el-table-column>
                    <!-- 最近登出时间 -->
                    <el-table-column
                        show-overflow-tooltip
                        width="200"
                        :label='$t("information.log-out-time")'>
                        <template scope="scope">
                        <p>{{scope.row.logoutTime | formatDate}}</p>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination_location">
                <base-pagination :total="pageInit2.total" :singleDisplay="pageInit2.pageSize" :currentPage="pageInit2.pageIndex" @pagechange="pagechange2" @sizeChange="sizeChange2"></base-pagination>
            </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</div>
</template>

<script>

import subareaServer from '@/api/subarea.server';
import devicesServer from '@/api/devices.server';
import systemServer from '@/api/system.server';
import shiftServer from '@/api/shift.server'
import informationServer from "@/api/information.server"

import tableMixins from "@/common/mixins/table.mixins";

export default {
    name:'LoginDriver',
    mixins: [tableMixins],
    data(){
        return{
            list:[],
            shift:'',
            shiftList:[],
            subareaSn:'',
            subareaList:[],
            truck:'',
            truckList:[],
            shovel:'',
            shovelList:[],
            time:'',
            pageInit:{},
            currTab: '1', // 当前标签页
            // 序号 所属分区 远程接管舱 远程接管员
            // 手机号 最近登录时间 最近登出时间
            subareaSn2:'',
            pageInit2:{},
            cabinDriverList: [], // 接管员列表
        }
    },
    created(){
        this.pageInit=JSON.parse(JSON.stringify(this.vars.pageInit));
        this.pageInit2=JSON.parse(JSON.stringify(this.vars.pageInit));
        this.getList();
    },
    watch:{
        currTab(){
            this.time="";
        }
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
        pagechange2(page){
            this.pageInit2.pageIndex = page;
            this.getCabinDriver();
        },
        sizeChange2(val){
            this.pageInit2.pageSize = val;
            this.getCabinDriver();
        },
        async getList(){
            //班次
            var resultShift = await shiftServer.getShiftType(this.vars.deviceType[0].type);
            this.shiftList=this.utils.getFilters(resultShift || [],'sn','name');
            //分区
            var data = {
                pageSize:this.vars.pageData.pageSize,
                sortName:"subareaName",
                sort:"ASC"
            }
            var resultFleet = await subareaServer.subareaList(data);
            this.subareaList = this.utils.getFilters(resultFleet.content || [],'subareaSn','subareaName');
            //卡车
            var arg = {
                pageSize:this.vars.pageData.pageSize,
                pageIndex:this.vars.pageData.pageIndex,
                equipmentTypeSn:this.vars.deviceType[0].id,
                sort:"ASC",
                sortName:"equipmentName"
            };

            var resultDevice = await devicesServer.devicesList(arg);
            this.truckList = this.utils.getFilters(resultDevice.content || [],'equipmentSn','equipmentName');
            //采装设备
            arg.equipmentTypeSn=this.vars.deviceType[1].id;
            var resultDevice = await devicesServer.devicesList(arg);
            this.shovelList =this.utils.getFilters(resultDevice.content || [],'equipmentSn','equipmentName');

            this.getSearch();
            this.getCabinDriver();
        },
        async getSearch(search){
            if(search){
                this.pageInit.pageIndex = 1;
            }
            //列表
            var shift=this.shift?this.shift:'';
            var subareaSn=this.subareaSn?this.subareaSn:'';
            var truck=this.truck?this.truck:'';
            var shovel=this.shovel?this.shovel:'';
            var time=this.time?this.time.getTime():'';
            var info={
                pageIndex:this.pageInit.pageIndex,
                pageSize:this.pageInit.pageSize,
                disptchSn:shift,
                subareaSn:subareaSn,
                truckSn:truck,
                shovelSn:shovel,
                disptchDate:time,
            };
            var result = await informationServer.getOutputList(info);


            this.list=result.content || [];
            this.pageInit.total=result.totalElements;
        },
        
        async getCabinDriver(search){
            if(search){
                this.pageInit.pageIndex = 1;
            }
            //列表
            
            var subareaSn=this.subareaSn2?this.subareaSn2:'';
            var time=this.time?this.time.getTime():'';
            let {pageIndex,pageSize} = this.pageInit2;
            var info={
                pageIndex:pageIndex-1,
                pageSize:pageSize,
                subareaSn:subareaSn,
                loginDate:time,
                sort:"DESC"
            };
            
            var result = await informationServer.getDriverLoginHistory(info);
            console.log(result)

            this.cabinDriverList=result.content || [];
            this.pageInit2.total=result.totalElements;
        },
        filterChange(filters){
            console.log(filters);
            if(filters.hasOwnProperty('subareaSn')){
                this.subareaSn = filters.subareaSn[0];
            }
            if(filters.hasOwnProperty('truckSn')){
                this.truck = filters.truckSn[0];
            }
            if(filters.hasOwnProperty('shovelSn')){
                this.shovel = filters.shovelSn[0];
            }
            if(filters.hasOwnProperty('truckShiftTypeSn')){
                this.shift = filters.truckShiftTypeSn[0];
            }
            this.getSearch(true);
        },
        filterChange2(filters){
            console.log(filters);
            if(filters.hasOwnProperty('subareaSn')){
                this.subareaSn2 = filters.subareaSn[0];
            }
            this.getCabinDriver(true);
        },
        resetDate(){
            console.log(this.currTab);
            if(this.currTab == '1'){
                this.shift='';
                this.subareaSn='';
                this.truck='';
                this.shovel='';
                this.time='';
                this.$refs.listTable.clearFilter();
                this.getSearch(true);
            }else{
                this.subareaSn2='';
                this.time='';
                this.$refs.listTable2.clearFilter();
                this.getCabinDriver(true);
            }
        },
    }
}
</script>

<style lang="scss" scoped>

</style>
