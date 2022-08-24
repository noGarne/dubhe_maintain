<template>
<!-- 卡车产量修改 -->
<div class="table_content truck_output">
  <div class="content_center content_tabs">
    <div class="btn_search">
      <el-date-picker
        class="data_input"
        v-model="searchData.disptchDate"
        type="date"
        @change="pagechange(1)"
        :placeholder="$t('common.select-date')"
        :picker-options="pickerOptions">
      </el-date-picker>
      <el-input v-model="searchData.deviceName" clearable :placeholder="$t('action.input')+$t('action.name')" @input="pagechange(1)">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <button type="button" class="btnGray" @click="resetDate">
        <i class="iconfont icon-zhongzhi themeOrangeColor"></i>
        {{$t('action.reset')}}
      </button>
      <button type="button" class="btnBg" @click="outputEntering"><i class="iconfont icon-chanliangbulu"></i> {{$t('information.output-entering')}}</button>
    </div>
    <el-tabs type="card" class="tabs_only_one">
      <el-tab-pane :label="$t('data-manager.truck-output-edit')">
        <div class="list_scrollbar_page">
          <el-table
            class="no_border"
            :data="ouputList"
            :max-height="tableHeight"
            @filter-change="filterChange"
            :row-class-name="tableRowClassName"
            ref="listTable">
              <!-- 序号 -->
              <el-table-column
                fixed
                :label='$t("common.key")'
                min-width="80">
                <template scope="scope">
                  {{scope.$index+1}}
                </template>
              </el-table-column>
              <!-- 分区 -->
              <el-table-column
                fixed
                min-width="120"
                property="subareaName"
                show-overflow-tooltip
                :label="$t('device.subarea')"
                :filter-multiple="false"
                :filters="subareaList"
                :column-key="'subareaSn'"
                filter-placement="right-start">
              </el-table-column>

              <!-- 矿卡名称 -->
              <el-table-column
                fixed
                min-width="130"
                property="truckName"
                show-overflow-tooltip
                :label="$t('action.truck')+$t('action.name')"
                :filter-multiple="false"
                :filters="truckList"
                :column-key="'truckSn'"
                filter-placement="right-start">
              </el-table-column>

              <!-- 采装设备名称 -->
              <el-table-column
                min-width="130"
                property="shovelName"
                show-overflow-tooltip
                :label="$t('action.digger')+$t('action.name')">
              </el-table-column>
              <!-- 卸点名称 -->
              <el-table-column
                min-width="130"
                property="dumpName"
                show-overflow-tooltip
                :label="$t('action.dump')+$t('action.name')">
              </el-table-column>
              <!-- 卡车司机 -->
              <el-table-column
                min-width="130"
                property="truckDriverName"
                show-overflow-tooltip
                :resizable="false"
                :label="$t('personnel.truck-driver')">
              </el-table-column>
              <!-- 采装设备主司机 -->
              <el-table-column
                min-width="130"
                property="shovelMainDriverName"
                show-overflow-tooltip
                :label="$t('personnel.digger-main-driver')">
                  <template scope="scope">
                    <p>{{scope.row.shovelMainDriverName?scope.row.shovelMainDriverName:""}}</p>
                  </template>
              </el-table-column>
              <!-- 采装设备副司机 -->
              <el-table-column
                min-width="130"
                property="shovelSubDriverName"
                show-overflow-tooltip
                :label="$t('personnel.digger-assistant-driver')">
                  <template scope="scope">
                    <p>{{scope.row.shovelSubDriverName?scope.row.shovelSubDriverName:""}}</p>
                  </template>
              </el-table-column>
              <!-- 折算率 -->
              <el-table-column
                property="conversionRate"
                min-width="80"
                show-overflow-tooltip
                :label="$t('dispatch.discount-rate')">
              </el-table-column>
              <!-- 物料类型 -->
              <el-table-column
                min-width="100"
                property="materialName"
                show-overflow-tooltip
                :label="$t('dispatch.material')">
              </el-table-column>
              <!-- 重量 -->
              <el-table-column
                property="materialWeight"
                min-width="120"
                show-overflow-tooltip
                :label="$t('material.weight')">
              </el-table-column>
              <!-- 装完时间 -->
              <el-table-column
                min-width="170"
                show-overflow-tooltip
                :label="$t('dump.load-time')">
                <template scope="scope">
                  <p>{{scope.row.loadFinishTime | formatDate}}</p>
                </template>
              </el-table-column>
              <!-- 卸载时间 -->
              <el-table-column
                min-width="170"
                show-overflow-tooltip
                :label="$t('dump.dump-over-date')">
                <template scope="scope">
                  <p>{{scope.row.unloadFinishTime | formatDate}}</p>
                </template>
              </el-table-column>
              <!-- 班别 -->
              <el-table-column
                min-width="130"
                property="dispatchShiftTypeName"
                show-overflow-tooltip
                :label="$t('shift.shift-type')"
                :filter-multiple="false"
                :filters="schedulingList"
                :column-key="'disptchSn'"
                filter-placement="right-start">
              </el-table-column>
              <!-- 台阶 -->
              <el-table-column
                min-width="130"
                property="stepName"
                show-overflow-tooltip
                :label="$t('information.step')">
              </el-table-column>
              
            <!-- 运输模式 -->
            <el-table-column
              min-width="120"
              show-overflow-tooltip
              :label="$t('information.transportation-mode')">
              <template scope="scope">
                <p>{{utils.getObjValByKey(vars.dmodeList,scope.row.taskDrvMode,'type','name')}}</p>
              </template>
            </el-table-column>

              <!-- 更新人 -->
              <el-table-column
                min-width="100"
                show-overflow-tooltip
                :label="$t('information.modifier')">
                <template scope="scope">
                  <p v-if="scope.row.changeUserName">{{scope.row.changeUserName}}</p>
                  <p v-else class="blue">系统</p>
                </template>
              </el-table-column>
              <!-- 更新时间 -->
              <el-table-column
                min-width="170"
                show-overflow-tooltip
                :label="$t('information.update-time')">
                <template scope="scope">
                  <p>{{scope.row.updateTime | formatDate}}</p>
                </template>
              </el-table-column>
              <!-- 创建时间 -->
              <el-table-column
                min-width="170"
                show-overflow-tooltip
                :label="$t('common.create-time')">
                <template scope="scope">
                  <p>{{scope.row.createTime | formatDate}}</p>
                </template>
              </el-table-column>

              <!-- 同步状态 -->
              <el-table-column
                fixed="right"
                min-width="100"
                show-overflow-tooltip
                label="同步状态"
                :filter-multiple="false"
                :filters="syncFlagList"
                :filtered-value="[searchData.syncFlag]"
                :column-key="'syncFlag'"
                filter-placement="right-start">
                <template scope="scope">
                      <!-- <i class="output_status" 
                        :class="utils.getObjValByKey(syncFlagList,scope.row.syncFlag,'value','color')">
                      </i> -->
                    <span 
                      class="status_default" 
                      :class="utils.getObjValByKey(syncFlagList,scope.row.syncFlag,'value','color')">
                      {{utils.getObjValByKey(syncFlagList,scope.row.syncFlag,'value','text')}}
                    </span>
                      
                </template>
              </el-table-column>

              <!-- 产量状态 -->
              <el-table-column
                fixed="right"
                min-width="100"
                show-overflow-tooltip
                :label="$t('information.output-status')"
                :filter-multiple="false"
                :filters="effectiveStateList"
                :filtered-value="[searchData.effectiveState]"
                :column-key="'effectiveState'"
                filter-placement="right-start">
                  <template scope="scope">
                    <span 
                      class="status_default" 
                      :class="utils.getObjValByKey(getEffectiveStateList,scope.row.effectiveState,'value','color')">
                      {{utils.getObjValByKey(getEffectiveStateList,scope.row.effectiveState,'value','text')}}
                    </span>
                  </template>
              </el-table-column>
              
              <!-- 操作 -->
              <el-table-column
                fixed="right"
                min-width="200"
                :label="$t('common.operate')">
                  <template scope="scope">
                  <div class="operation_setter">
                    <button :title='$t("action.edit")' @click="editOutput(scope.row)"><i class="iconfont icon-bianji"></i>{{$t("action.edit")}}</button>
                    <button :title='$t("action.edit-log")' @click.stop="OutputLogShow(scope.row)"><i class="iconfont icon-xiangqing green"></i>{{$t("action.edit-log")}}</button>
                  </div>
                  </template>
              </el-table-column>
          </el-table>
        </div>
        <!-- 页码 -->
        <div class="pagination_location">
          <base-pagination :total="pageInit.total" :singleDisplay="pageInit.pageSize" :currentPage="pageInit.pageIndex" @pagechange="pagechange" @sizeChange="sizeChange"></base-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
  <output-input ref="outputInput" @appendOutput="appendOutput" :effectiveStateList="effectiveStateList"></output-input>
  <output-log ref="outputLog"></output-log>
</div>
</template>
<script>

const OutputInput=()=>import('@/components/data/OutputInput.vue')
const OutputLog=()=>import('@/components/data/OutputLog.vue')
import informationServer from "@/api/information.server"
import shiftServer from '@/api/shift.server'
import devicesServer from '@/api/devices.server';
import tableMixins from "../../common/mixins/table.mixins"
import subareaServer from '../../api/subarea.server';

export default {
  name:'TruckOutput',
  mixins: [tableMixins],
  components:{
    OutputInput,
    OutputLog
  },
  data(){
    return {
      searchData:{
        subareaSn:"",
        disptchSn:"",
        disptchDate:"",
        truckSn:"",
        deviceName:"",
        effectiveState:true,
        syncFlag:"",
      },
      subareaList:[],
      pageInit:{},
      ouputList:[],
      types:"矿卡",
      truck:'',
      truckList:[],
      schedulingList:[],
      search:'',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      // 同步状态
      syncFlagList:[
        {
          value:true,
          text:'已同步',
          color:'green'
        },
        {
          value:false,
          text:'未同步',
          color:'red'
        }
      ],
      // 产量状态
      effectiveStateList:[
        {
          text:"有效状态",
          value:true,
          color:'green'
        },
        {
          text:"无效状态",
          value:false,
          color:'red'
        }
      ],
      continueEffective:[
        {
          text:"-",
          value:null,
          color:'blue'
        }
      ]
    }
  },
  created() {
    this.pageInit=JSON.parse(JSON.stringify(this.vars.pageInit));
    this.getOutPut();
    this.getSubareaList();
    this.getShiftType();
    this.getTruck();
  },
  computed: {
    subareaSn(){
      return this.$store.state.subareaSn;
    },
    getEffectiveStateList(){
      return this.effectiveStateList.concat(this.continueEffective);
    }
  },
  watch: {
    subareaSn(){
      this.getOutPut();
    }
  },
  methods: {
    async getOutPut(){
      var _this=this;
       try{
        var searchData = this.searchData;
        var data = {
          pageIndex:this.pageInit.pageIndex,
          pageSize:this.pageInit.pageSize,
          logType:'MANU'
        }
        for(let i in searchData){
          if(searchData[i]){
            if(i=='disptchDate'){
              data[i]=searchData[i].getTime();
            }else{
              data[i]=searchData[i];
            }
          }else{
            if(searchData[i]==false){
              data[i]=searchData[i];
            }
          }
        }

        var result = await informationServer.getOutputList(data);
        this.pageInit.total = result.totalElements
        this.ouputList = result.content;
      }catch(e){
        _this.messages.error(e.message)
      }
    },
    //获取班次
    async getShiftType(){
      var _this = this;
      try{
        var deviceType=this.vars.shiftType[0].type;
          //班次
        var resultShiftType = await shiftServer.getShiftType(deviceType);
        this.schedulingList = this.utils.getFilters(resultShiftType || [],'sn','name');
      }catch(e){
        _this.messages.error(e.message)
      }
    },
    //获取卡车
    async getTruck(){
      var _this = this;
      try{
        
        var arg = {
          pageSize:this.vars.pageData.pageSize,
          pageIndex:this.vars.pageData.pageIndex,
          equipmentTypeSn:this.vars.deviceType[0].id,
          sort:"ASC",
          sortName:"equipmentName"
        };
        
        var resultDevice = await devicesServer.devicesList(arg);
        var list = this.utils.getFilters(resultDevice.content || [],'equipmentSn','equipmentName');

        this.truckList = list
      }catch(e){
        _this.messages.error(e.message)
      }
    },
    
    //获取分区
    async getSubareaList(){
      var _this = this;
      try{
        
        var data = {
            pageSize:this.vars.pageData.pageSize,
            sortName:"subareaName",
            sort:"ASC"
        }
        var result = await subareaServer.subareaList(data);

        var list = this.utils.getFilters(result.content||[],'subareaSn','subareaName');;
        _this.subareaList = list;
      }catch(e){
        _this.messages.error(e.message)
      }
    },
    
    filterChange(filters){
      
      this.pageInit.pageIndex = 1;

      if(filters.hasOwnProperty('subareaSn')){
        this.searchData.subareaSn = filters.subareaSn[0];
      }
      if(filters.hasOwnProperty('disptchSn')){
        this.searchData.disptchSn = filters.disptchSn[0];
      }
      if(filters.hasOwnProperty('truckSn')){
        this.searchData.truckSn = filters.truckSn[0];
      }
      if(filters.hasOwnProperty('effectiveState')){
        this.searchData.effectiveState = filters.effectiveState[0];
      }
      if(filters.hasOwnProperty('syncFlag')){
        this.searchData.syncFlag = filters.syncFlag[0];
      }
      this.getOutPut();

    },
    // 重置
    resetDate(){
      this.searchData={
        subareaSn:"",
        disptchSn:"",
        disptchDate:"",
        truckSn:"",
        deviceName:"",
        effectiveState:null,
        syncFlag:null
      }
      this.$refs.listTable.clearFilter();
      this.getOutPut();
    },
    outputEntering(){
      this.$refs.outputInput.closeDialogShow();
    },
    editOutput(data){
      this.getIndex = data.index;
      this.$refs.outputInput.closeDialogShow(data,'edit');
    },
    OutputLogShow(data){
      this.$refs.outputLog.outputLogShow(data);
    },
    appendOutput(data,edit){
      if(edit){
        var key = data.index;
        this.ouputList.splice(key,1,data);
      }else{
        this.ouputList.unshift(data);
      }
    },
    pagechange(val){//翻页
      this.pageInit.pageIndex = val;
      this.getOutPut()
    },
    sizeChange(val){
      this.pageInit.pageSize = val;
      this.getOutPut();
    },
  }
}
</script>

<style lang="scss">
.truck_output{
  .el-table div.cell{
    padding-left: 10px;
  }
  .el-table thead th:first-child  div.cell{
    padding-left: 30px;
  }
  .el-table td:first-child div.cell{
    padding-left: 30px;
  }
  .output_status{
    height: 8px;
    width: 8px;
    display: inline-block;
    border-radius: 50%;
    &.red{
      background: $themeRed;
    }
    &.green{
      background: $themeGreen;
    }
    &.blue{
      background: $textBlueColor;
    }
  }
} 
</style>

