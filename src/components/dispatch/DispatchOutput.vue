<template>
<!-- 生产计划兑现分析 -->
  <div class="day-output">
    <div class="day-output-title">
      {{$t('dispatch-set.production-plan-analysis')}}
    </div>
    <div class="day-output-time">
      {{utils.formatDate(new Date(),'date')}}
    </div>
    <div class="day-table">
        <el-table
        :data="list"
        :span-method="objectSpanMethod"
        class="border day-list"
        style="width: 100%;"
      >
        <!-- 总量 -->
        <el-table-column 
          prop="type" 
          label=" " 
          align="center"> </el-table-column>
        <!-- 物料类型 -->
        <el-table-column 
          prop="materialName" 
          label=" " 
          align="center"> 
        </el-table-column>
        <!-- 日计划(吨) -->
        <el-table-column 
          prop="planOutput" 
          :label="$t('dispatch-set.day-plan-unit')" 
          align="center">
        </el-table-column>
        <!-- 日完成(吨) -->
        <el-table-column 
          prop="actualOutput" 
          :label="$t('dispatch-set.day-complete-unit')" 
          align="center"> 
        </el-table-column>
        <el-table-column 
          prop="percent" 
          label="%" 
          align="center"> 
        </el-table-column>
          <!-- 超欠(吨) -->
        <el-table-column 
          prop="compare" 
          :label="$t('dispatch-set.out-less-unit')" 
          align="center"> 
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>

import dispatchMixin from '@/common/mixins/dispatch.mixins.js';

export default {
  name:'DispatchOutput',
  mixins:[dispatchMixin],
  props:['list','details'],
  data() {
    return {

    }
  },
  mounted(){
    this.$nextTick(()=>{
      if(this.details && this.details.hasOwnProperty('mineCount'))this.setColSpan();
    })
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      //合并列
      if (rowIndex === 0 || rowIndex === (1 + this.details.mineCount + this.details.wasteCount)) {
        if (columnIndex === 0) {
          return [1, 2];
        } else if (columnIndex === 1) {
          return [0, 0];
        }
      }
      // 合并行
      if (columnIndex === 0) {
        if (rowIndex === 1) {
          return {
            rowspan: this.details.mineCount,
            colspan: 1,
          };
        } else if (rowIndex === (1 + this.details.mineCount)){
          return {
            rowspan: this.details.wasteCount,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 1,
            colspan: 0,
          };
        }
      }
    },
    setColSpan() {
      let cell = document.getElementsByClassName("el-table__header")[0].rows[0].cells;
      cell[0].colSpan = 2;
      cell[1].style.display = 'none';
    },
  }
}
</script>

<style lang="scss" scoped>
.day-output {
  @include theme-content-bg;
  @include theme-content-color;
  max-height: 400px;
  overflow: auto;
  .output-msg {
    display: inline-block;
    margin-right: 30px;
  }
  .output-num {
    display: inline-block;
    margin: 0 4px;
    font-size: 18px;
    font-weight: bolder;
    @include theme-content-color;
  }
}
.day-output-title{
  text-align: center;
  font-weight: bold;
}
.day-output-time{
  text-align: right;
  font-weight: bold;
  margin-right: 15%;
}
.day-table{
  margin: 10px;
}
@media screen and (max-width:1080px) {
  .day-output{
    display: none;
  }
}
</style>

<style lang="scss">
.day-list{
  &.el-table tr,&.el-table tr:nth-child(2n){
    @include theme-content-bg(!important);
  }
  &.el-table .el-table__row{
    td:first-child{
      @include table-line-bg(!important);
      font-weight: bold;
    }
    td:not([rowspan="1"]) + td[rowspan="1"]{
      @include table-line-bg(!important);
      font-weight: bold;
    }
  }
  &.el-table .el-table__header-wrapper .has-gutter tr,&.el-table .el-table__header-wrapper .has-gutter tr th{
    @include table-line-bg(!important);
  }
  &.border.el-table th,&.border.el-table td{
    @include theme-border-color;
  }
  &.border.el-table td:first-child{
    border-left: 1px solid $borderBlack;
    @include theme-border-color;
  }
  &.border.el-table th{
    border-bottom: 1px solid $borderBlack !important;
    @include theme-border-color(!important);
  }
  &.el-table td{
    color: $themeContentColor !important;
    @include theme-content-color( !important);
  }
}
</style>
