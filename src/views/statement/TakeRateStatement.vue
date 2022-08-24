<template>
  <!-- 接管率统计 -->
  <div class="report_container">
  <div class="report_all">
      <div class="search_condition_top">
        <div class="search_condition_top_l">
          
          <!-- 日期（年月日） -->
          <div class="search_condition_name" key="1">
              <span>{{$t('common.date')}}</span>
              <div class="block">
                <el-date-picker
                  v-model="date"
                  type="date"
                  @change="getReport"
                  :picker-options="pickerDayOptions"
                  :placeholder="$t('common.select-date')">
                </el-date-picker>
              </div>
          </div>
          <!-- 卡车 -->
          <div class="search_condition_name" key="2">
              <span>{{$t('action.truck')}}</span>
              <el-select clearable filterable v-model="truck" :placeholder="$t('action.select')" @change="getReport">
                <el-option
                    v-for="(item,index) in truckList"
                    :key="index"
                    :label="item.equipmentName"
                    :value="item.id.id">
                </el-option>
              </el-select>
          </div>
          <div class="search_condition_submit">
            <el-button type="primary" class="btnGray" @click="resetData">
              <i class="iconfont icon-zhongzhi themeOrangeColor"></i>
              {{$t('action.reset')}}
            </el-button>
          </div>
        </div>
        <div class="search_condition_top_r">
          <!-- 下载 -->
          <base-excel
              type="html"
              :data="reportData"
              :worksheet="$t('statement.take-rate-statement')"
              :title="$t('statement.take-rate-statement')"
              :name="$t('statement.take-rate-statement')+'.xls'">
              <el-button :title='$t("action.download")' type="primary" class="btnBg" @click="exportReport"><i class="iconfont icon-xiazai"></i>{{$t('action.download')}}</el-button>
          </base-excel>
        </div>
      </div>
      <div class="report-list report_content">
          <div class="report-title">{{$t('statement.take-rate-statement')}}
            <p class="report-time">
              <span>日期：{{date ? utils.formatDate(date,'date') : '全部'}}</span>
              <span>卡车：{{truck && truckList.find(v=>v.equipmentSn==truck) ? truckList.find(v=>v.equipmentSn==truck).equipmentName : '全部'}}</span>
            </p>
          </div>
          <div class="report-table" ref="reportHtml">
            <el-table
            class="border"
            ref="refTable1"
            :data="sumList"
            style="width: 100%">
              <!-- 卡车名称 -->
              <el-table-column
                align="center"
                property="devName"
                show-overflow-tooltip
                :label='$t("dispatch-set.truck-name")'>
              </el-table-column>
              <!-- 日期 -->
              <el-table-column
                align="center"
                property="createTime"
                show-overflow-tooltip
                :label='$t("common.date")'>
                <template slot-scope="scope">
                  {{utils.formatDate(scope.row.createTime,'date')}}
                </template>
              </el-table-column>
              <!-- 接管次数(次) -->
              <el-table-column
                align="center"
                property="takeoverTimes"
                show-overflow-tooltip
                :label='$t("statement.take-count")'>
              </el-table-column>
              <!-- 自动驾驶运行里程(公里) -->
              <el-table-column
                align="center"
                property="accumulatedMileage"
                show-overflow-tooltip
                :label='$t("statement.autodrive-run-km")'>
                <template slot-scope="scope">
                  {{parseFloat(scope.row.accumulatedMileage / 1000.00).toFixed(2)}}
                </template>
              </el-table-column>
              <!-- 接管率 -->
              <el-table-column
                align="center"
                show-overflow-tooltip
                :label='$t("statement.take-rate")'>
                <template slot-scope="scope">
                  {{parseFloat(scope.row.takeoverRate * 100).toFixed(2) + '%'}}
                </template>
              </el-table-column>
          </el-table>
         <div>&nbsp;</div>
            <el-table
            class="border table-top"
            ref="refTable2"
            :data="detailList"
            style="width: 100%">
              <!-- 卡车名称 -->
              <el-table-column
                align="center"
                property="devName"
                show-overflow-tooltip
                :label='$t("common.name")'>
              </el-table-column>
              <!-- 接管发生时间 -->
              <el-table-column
                align="center"
                property="createTime"
                show-overflow-tooltip
                :label='$t("statement.take-time")'>
                <template slot-scope="scope">
                  {{scope.row.createTime | formatDate}}
                </template>
              </el-table-column>
              <!-- 历史回放 -->
              <el-table-column
                align="center"
                :label='$t("statement.history-playback")'>
                <template slot-scope="scope">
                <div class="operation_setter">
                  <button :title='$t("action.view")' @click="viewPlayback(scope.row,scope.$index)">{{$t("action.view")}}</button>
                </div>
                </template>
              </el-table-column>
          </el-table>
          </div>
      </div>
    </div>
    
  </div>
</template>

<script>

import devicesServer from '../../api/devices.server';
import statementServer from '../../api/statement.server';

export default {
  name:"TakeRateStatement",
  data(){
    return{
      pickerDayOptions:{
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      date:Date.now(),
      truck:'',
      truckList:[],
      sumList:[],
      detailList:[],
      reportData:''
    }
  },
  created(){
    this.initData();
  },
  methods:{
    async initData(){
      try {
        //卡车
        let dataDevice=JSON.parse(JSON.stringify(this.vars.pageData));
        dataDevice.sort="ASC";
        dataDevice.sortName="equipmentName";
        dataDevice.isForbidden=false;
        dataDevice.equipmentTypeSn=this.vars.deviceType[0].id;
        let result = await devicesServer.devicesList(dataDevice);
        this.truckList=result.content || [];

        this.getReport();
      } catch (e) {
        this.messages.error(e.message);
      }
    },
    async getReport(){
      try {
        if(!this.date){
          this.messages.error(this.$t('action.select')+this.$t('common.date'));
          return;
        }
        let time = new Date(this.date).getTime();
        let info = {
          date:time,
        };
        if(this.truck){
          info.deviceId = this.truck;
        }

        let resSum = await statementServer.getTakeRateSum(info);
        this.sumList = resSum.returnObj || [];
        let resDetail = await statementServer.getTakeRateDetail(info);
        this.detailList = resDetail.returnObj || [];

        this.exportReport(1);
      } catch (e) {
        this.messages.error(e.message);
      }
    },
    exportReport(v){
      //下载报表数据
      if(!this.date){
        this.messages.error(this.$t('action.select')+this.$t('common.date'));
        return;
      }
      if(this.sumList.length <= 0){
        if(v!=1)this.messages.error("暂无数据");
        return;
      }
      this.$nextTick(()=>{
        try {
          var html=this.$refs.reportHtml.innerHTML;
          html=html.replace(/>历史回放</gi,'><').replace(/>查看</gi,'><');
          this.reportData=html;
        } catch (error) {
            this.messages.error("下载失败");
        }
     });
    },
    viewPlayback(v){
      window.open(`/playback?truckId=${v.deviceId}&time=${new Date(v.createTime).getTime()}`,'_blank');
    },
    resetData(){
      this.truck = '';
      this.sumList = [];
      this.detailList = [];
      this.getReport();
    }
  }
}
</script>

<style lang="scss" scoped>
.report_content{
  overflow: auto;
  .report-table{
    margin:20px;
    .table-top{
      margin-top: 20px;
    }
  }
}
</style>