<template>
  <!-- 设备列表 -->
  <div class="dispatch-device">
    <div class="dispatch-device-header">
      <span class="dispatch-device-header-title">{{utils.getObjValByKey(vars.showTypeList,currentType)+$t('common.list')}}</span>
      <span class="close" @click="clickClose"><i class="iconfont icon-guanbi"></i></span>
    </div>
    <div class="dispatch-device-list">
      <!-- 卡车设备 -->
      <div v-if="currentType == vars.showTypeList[0].id">
        <el-table
          :data="truckList" 
          style="width: 100%;" 
          class="no_border task-table device-table"
          @row-click="rowClick"
          :row-class-name="tableRowClassName"
          >
          <!-- 卡车名称 -->
          <el-table-column 
            prop="equipmentName" 
            :label="$t('dispatch-set.truck-name')" 
            show-overflow-tooltip>
          </el-table-column>
          <!-- 通信状态 -->
          <el-table-column
            prop="online"
            :label="$t('dispatch.signal-status')"
            show-overflow-tooltip
            :filter-multiple="false"
            :filters="vars.signalStatusList"
            :filter-method="filterSignalStatus"
          >
           <template scope="scope">
              <p>{{utils.getObjValByKey(vars.signalStatusList,scope.row.online,'value','text')}}</p>
            </template>
          </el-table-column>
          <!-- 运营状态 -->
          <el-table-column
            prop="equStatus" 
            :label="$t('status-reason.status')" 
            show-overflow-tooltip
            :filter-multiple="false"
            :filters="runStatusList"
            :filter-method="filterRunStatus">
              <template scope="scope">
                <p>
                  <i class="status" :class="'status'+scope.row.equStatus"></i>
                {{utils.getObjValByKey(vars.runStatus,scope.row.equStatus,'code','name') || '-'}}
                </p>
              </template>
            </el-table-column>
        </el-table>
      </div>
      <!-- 采装设备 -->
      <div v-else-if="currentType == vars.showTypeList[1].id">
        <el-table
          :data="shovelList" 
          style="width: 100%;" 
          class="no_border task-table device-table"
          @row-click="rowClickShovel"
          :row-class-name="tableRowClassName2"
          >
          <!-- 卡车名称 -->
          <el-table-column 
            prop="equipmentName" 
            :label="$t('dispatch-set.digger-name')" 
            show-overflow-tooltip>
          </el-table-column>
          <!-- 通信状态 -->
          <el-table-column
            prop="online"
            :label="$t('dispatch.signal-status')"
            show-overflow-tooltip
            :filter-multiple="false"
            :filters="vars.signalStatusList"
            :filter-method="filterSignalStatus"
          >
           <template scope="scope">
              <p>{{utils.getObjValByKey(vars.signalStatusList,scope.row.online,'value','text')}}</p>
            </template>
          </el-table-column>
          <!-- 运营状态 -->
          <el-table-column
            prop="equStatus" 
            :label="$t('status-reason.status')" 
            show-overflow-tooltip
            :filter-multiple="false"
            :filters="runStatusList"
            :filter-method="filterRunStatus">
              <template scope="scope">
                <p>
                  <i class="status" :class="'status'+scope.row.equStatus"></i>
                {{utils.getObjValByKey(vars.runStatus,scope.row.equStatus,'code','name') || '-'}}
                </p>
              </template>
            </el-table-column>
        </el-table>
      </div>
      <!-- 卸点设备 -->
      <div v-else-if="currentType == vars.showTypeList[2].id">
        <el-table 
          :data="dumpList" 
          style="width: 100%;" 
          class="no_border task-table device-table"
          @row-click="rowClickDump"
          :row-class-name="tableRowClassName2"
          >
          <!-- 卡车名称 -->
          <el-table-column 
            prop="equipmentName" 
            :label="$t('dispatch-set.dump-name')" 
            show-overflow-tooltip>
          </el-table-column>
          <!-- 通信状态 -->
          <el-table-column
            prop="online"
            :label="$t('dispatch.signal-status')"
            show-overflow-tooltip
            :filter-multiple="false"
            :filters="vars.signalStatusList"
            :filter-method="filterSignalStatus"
          >
           <template scope="scope">
              <p>{{utils.getObjValByKey(vars.signalStatusList,scope.row.online,'value','text')}}</p>
            </template>
          </el-table-column>
          <!-- 运营状态 -->
          <el-table-column
            prop="equStatus" 
            :label="$t('status-reason.status')" 
            show-overflow-tooltip
            :filter-multiple="false"
            :filters="runStatusList"
            :filter-method="filterRunStatus">
              <template scope="scope">
                <p>
                  <i class="status" :class="'status'+scope.row.equStatus"></i>
                {{utils.getObjValByKey(vars.runStatus,scope.row.equStatus,'code','name') || '-'}}
                </p>
              </template>
            </el-table-column>
        </el-table>
      </div>
      <!-- 辅助设备 -->
      <div v-else-if="currentType == vars.showTypeList[3].id">
        <el-table
          :data="assistList"
          class="no_border task-table">
          <!-- 设备名称 -->
          <el-table-column 
            prop="equipmentName" 
            :label="$t('device.device-name')" 
            show-overflow-tooltip>
          </el-table-column>
          <!-- 通信状态 -->
          <el-table-column
            prop="online"
            :label="$t('dispatch.signal-status')"
            show-overflow-tooltip
            :filter-multiple="false"
            :filters="vars.signalStatusList"
            :filter-method="filterSignalStatus"
          >
           <template scope="scope">
              <p>{{utils.getObjValByKey(vars.signalStatusList,scope.row.online,'value','text')}}</p>
            </template>
          </el-table-column>
          <!-- 当前位置 -->
          <el-table-column 
            prop="placeName" 
            :label="$t('dispatch.current-position')" 
            show-overflow-tooltip>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column :label="$t('action.operation')">
            <template slot-scope="scope">
              <div class="operation_setter">
                <button
                  :disabled="disabledDispatchEdit"
                  :title="$t('action.set')"
                  @click="setPosition(scope.row,scope.$index)"
                >{{$t("action.set")}}</button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <place-set ref="refPosition" @updatePosition="updatePosition"></place-set>
  </div>
</template>

<script>

const PlaceSet=()=>import('./PlaceSet')

import dispatchMixin from '../../common/mixins/dispatch.mixins';
export default {
  mixins:[dispatchMixin],
  props:{
    truckList:{
      type:Array,
      default(){
        return []
      }
    },
    shovelList:{
      type:Array,
      default(){
        return []
      }
    },
    dumpList:{
      type:Array,
      default(){
        return []
      }
    },
    assistList:{
      type:Array,
      default(){
        return []
      }
    },
    showList:{
      type:Boolean,
      default(){
        return false
      }
    },
    currentType:{
      type:Number,
      default(){
        return 1
      }
    }
  },
  components:{
    PlaceSet
  },
  data() {
    return {
      runStatusList: [],
      deviceId:''
    }
  },
  mounted(){
    this.runStatusList = this.vars.runStatus.map(item=>{
      return { text: item.name, value: item.code };
    });
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
      if (row.uuid == this.deviceId) {
        return 'hightlisht-row';
      }
      return '';
    },
    tableRowClassName2({row, rowIndex}) {
      if (row.id.id == this.deviceId) {
        return 'hightlisht-row';
      }
      return '';
    },
    rowClick(row){
      this.deviceId = row.uuid;
      this.truckShow(row.uuid);
      // this.truckShow(row.id.id);
    },
    rowClickShovel(row){
      this.deviceId = row.id.id;
      this.diggerShow(row.id.id);
    },
    rowClickDump(row){
      this.deviceId = row.id.id;
      this.dumpShow(row.id.id);
    },
    setPosition(data) {
      var info ={
        deviceName:data.equipmentName,
        deviceId:data.id.id,
        placeId:data.placeId,
        subareaSn:this.subareaSn
      }
      this.$refs.refPosition.getDetials(info,'assist');
    },
    updatePosition(data,index){
      this.$parent.getAssistList();
    },
    filterSignalStatus(value, row) {
      return row.online === value;
    },
    filterRunStatus(value, row) {
      return row.equStatus === value;
    },
    clickClose(){
      this.$parent.setDeviceType(0);
    }
  },
};
</script>

<style lang="scss" scoped>
.dispatch-device {
  width: 360px;
  height: 100%;
  .dispatch-device-header{
    width: 100%;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    // background: $headerTitle;
    @include header-title-bg;
    .dispatch-device-header-title{
      // color: $themeContentColor;
      @include theme-content-color;
    }
  }
  .dispatch-device-list {
    width: 100%;
    padding: 20px 20px 50px;
    height: 100%;
    overflow: auto;
  }
  .close{
    color: $textGrayColor;
    float: right;
    cursor: pointer;
    &:hover{
      color: $themeGrayHover3;
    }
  }
  // .status{
  //   display: inline-block;
  //   margin-right: 6px;
  //   width:8px;
  //   height: 8px;
  // }
}
</style>
<style lang="scss">
.task-table{
  &.no_border.el-table tr td:first-child div.cell, &.no_border.el-table tr th:first-child div.cell, &.no_border.el-table tr th div.cell{
    padding-left: 10px !important;
  }
  &.device-table.no_border.el-table tr:hover>td,&.device-table.no_border.el-table tr.hightlisht-row>td{
    border-bottom: 1px solid $themeOrange !important;
    border-top: 1px solid $themeOrange !important;
    &:first-child{
      border-left: 1px solid $themeOrange !important;
    }
    &:last-child{
      border-right: 1px solid $themeOrange !important;
    }
  }
}
</style>