<template>
  <div class="home-statement">
    <div class="btn_search">
      <div>
          <span v-for="(item,index) in typeList" :key="index" :class="{active:selectedDate==item.value}" @click="selectedDate=item.value">{{item.text}}</span>
          <!-- <span :class="{active:selectedDate=='WEEK'}" @click="selectedDate='WEEK'">本周</span>
          <span :class="{active:selectedDate=='MONTH'}" @click="selectedDate='MONTH'">本月</span>
          <span :class="{active:selectedDate=='YEAR'}" @click="selectedDate='YEAR'">全年</span> -->
      </div>
    </div>
    
    <el-tabs v-model="selectedDevice">
      <!-- 信息设定 -->
      <el-tab-pane label="历史产量统计" name="TRUCK">
        <div class="statement_content">
            <!-- <home-echart v-if="selectedDevice=='TRUCK'" :outputJson="outputJson" :selectedDate="selectedDate"></home-echart> -->
            <chart-line :datas="chartData" style="height:100%"></chart-line>
          </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>

import HomeEchart from "@/components/home/HomeEchart"
const ChartLine = () => import("@/components/statement/ChartLine");

import statementServer from '../../api/statement.server';

export default {
  name: 'Homestatement',
  mixins: [],
  components: {
      HomeEchart,
      ChartLine
  },
  data () {
    return {
        selectedDate:'DAY',
        selectedDevice:"TRUCK",
        selectedUnit:"时",
        outputJson:{},
        chartData:{},
        typeList:[
          {
            value:'DAY',
            text:"今日",
            unit: "时"
          },
          {
            value:'WEEK',
            text:"本周",
            unit: "日"
          },
          {
            value:'MONTH',
            text:"本月",
            unit: "日"
          },
          {
            value:'YEAR',
            text:"全年",
            unit: "月"
          },
        ]
    }
  },
  watch:{
    selectedDate(v){
      this.selectedUnit=this.utils.getObjValByKey(this.typeList,v,'value','unit');
      this.getOutput()
    }
  },
  created () {
    this.getOutput();
  },
  methods: {
    tabClick(v){
      this.selectedDevice = v;
    },
    async getOutput(){
      try{
        var selectedDate = this.selectedDate;
        var selectedDevice = this.selectedDevice;
        var data = {
          dimension:selectedDate,
          equipmentType:this.selectedDevice
        }
        var result = await statementServer.getHistoryOutput(data);
        // this.outputJson = result;

        let legendConfig = {right: '4%'};
        let legendData = this.vars.materialType.map(item=>item.name);
        let seriesInfo = [...[result.data.MINERAL], ...[result.data.WASTE]];
        let xData = result.abscissa;
        let xName = this.selectedUnit;
        let yName = this.vars.MATERIAL_UNIT[0].name;
        let isDel = false;
        //折线图
        this.chartData = {
          legendConfig,
          legendData,
          seriesInfo,
          xData,
          xName,
          yName,
          isDel
        };

        return;
      }catch(e){
        this.messages.error(e.message)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.home-statement{
    height: 100%;
    position: relative;
    .btn_search{
        position: absolute;
        right: 0;
        top: 0;
        line-height: 50px;
        z-index: 2;
        span{
            position: relative;
            margin-right: 30px;
            font-size: 14px;
            cursor: pointer;
            &:hover,&.active{
              @include theme-content-color;
              &:after{
                content: '';
                position: absolute;
                bottom: -13px;
                left: 0;
                width: 30px;
                height: 2px;
                @include theme-content-bg;
              }
            }
        }
    }
    .statement_content{
        height: 100%;
        overflow: auto;
    }
}
</style>
<style lang="scss">
.home-statement{
  .el-tabs{
    position: relative;
  }
  .el-tabs__content{
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 52px;
    background: #fff;
    .el-tab-pane{
      height: 100%;
    }
  }
    
}
</style>
