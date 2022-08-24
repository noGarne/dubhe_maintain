<template>
<!-- 基本统计报表模板页面 -->
<div class="report_container">
  <div class="report_all">
      <div class="search_condition_top">
        <div class="search_condition_top_l">

          <!-- 物料类型 -->
          <div class="search_condition_name" key="18" v-if="currentData.reportCondition.includes(conditionAll[16])">
            <span>物料类型</span>
            <el-select 
              v-model="conditionData.material" 
              clearable filterable
              multiple
              collapse-tags
              :placeholder='$t("action.select")'
              @change="getReport">
              <el-option
                  v-for="(item,index) in conditionList.materialList"
                  :key="index"
                  :label="item.materialName"
                  :value="item.materialSn">
              </el-option>
            </el-select>
          </div>

          <!-- 运输模式 -->
          <div class="search_condition_name" key="19" v-if="currentData.reportCondition.includes(conditionAll[17])">
            <span>运输模式</span>
            <el-select 
              clearable 
              filterable 
              v-model="conditionData.dmode" 
              :placeholder="$t('action.select')" 
              @change="getReport">
              <el-option
                  v-for="(item,index) in conditionList.dmodeList"
                  :key="index"
                  :label="item.name"
                  :value="item.value">
              </el-option>
            </el-select>
          </div>

          <!-- 时间类型 -->
          <div class="search_condition_name" key="15" v-if="currentData.reportCondition.includes(conditionAll[14])||currentData.reportCondition.includes(conditionAll[15])">
            <span>时间类型</span>
            <el-select filterable v-model="currentData.timeType" :placeholder="$t('action.select')" @change="changeTimeType">
              <el-option
                  v-for="(item,index) in conditionList.timeTypeList"
                  :key="index"
                  :label="item.name"
                  :value="item.value">
              </el-option>
            </el-select>
          </div>
          
          <!-- 日期（年月日） -->
          <div class="search_condition_name" key="1" v-if="currentData.reportCondition.includes(conditionAll[5])||currentData.timeTypeValue.includes(conditionAll[5])">
              <span>{{$t('common.date')}}</span>
              <div class="block">
                <el-date-picker
                  v-model="conditionData.date"
                  type="date"
                  @change="getReport"
                  :picker-options="pickerDayOptions"
                  :placeholder="$t('common.select-date')">
                </el-date-picker>
              </div>
          </div>
          <!-- 开始日期 -->
          <div class="search_condition_name" key="2" v-if="currentData.reportCondition.includes(conditionAll[6])||currentData.timeTypeValue.includes(conditionAll[6])">
              <span>{{$t('common.date-start')}}</span>
              <div class="block">
                <el-date-picker
                  v-model="conditionData.starttime"
                  type="date"
                  @change="getReport('startTime')"
                  :picker-options="pickerStartOptions"
                  :placeholder="$t('common.date-start')">
                </el-date-picker>
              </div>
          </div>
          <!-- 结束日期 -->
          <div class="search_condition_name" key="3" v-if="currentData.reportCondition.includes(conditionAll[7])||currentData.timeTypeValue.includes(conditionAll[7])">
              <span>{{$t('common.date-end')}}</span>
              <div class="block">
                <el-date-picker
                  v-model="conditionData.endtime"
                  type="date"
                  @change="getReport('endTime')"
                  :picker-options="pickerEndOptions"
                  :placeholder="$t('common.date-start')">
                </el-date-picker>
              </div>
          </div>
          <!-- 年份 -->
          <div class="search_condition_name" key="4" v-if="currentData.reportCondition.includes(conditionAll[8])||currentData.timeTypeValue.includes(conditionAll[8])">
              <span>{{$t('common.year')}}</span>
              <div class="block">
                <el-date-picker
                  v-model="conditionData.year"
                  type="year"
                  @change="getReport"
                  :picker-options="pickerYearOptions"
                  :placeholder="$t('common.year')">
                </el-date-picker>
              </div>
          </div>
          <!-- 月份 -->
          <div class="search_condition_name" key="5" v-if="currentData.reportCondition.includes(conditionAll[9])||currentData.timeTypeValue.includes(conditionAll[9])">
              <span>{{$t('common.month')}}</span>
              <div class="block">
                <el-date-picker
                  v-model="conditionData.month"
                  type="month"
                  @change="getReport"
                  :picker-options="pickerMonthOptions"
                  :placeholder="$t('common.month')">
                </el-date-picker>
              </div>
          </div>
          <!-- 分区 -->
          <div class="search_condition_name" key="6" v-if="currentData.reportCondition.includes(conditionAll[0])">
              <span>{{$t('information.subarea')}}</span>
              <el-select clearable filterable v-model="conditionData.subarea" :placeholder="$t('action.select')" @change="getReport">
                <el-option
                    v-for="(item,index) in conditionList.subareaList"
                    :key="index"
                    :label="item.subareaName"
                    :value="item.subareaSn">
                </el-option>
              </el-select>
          </div>
          <!-- 班次 -->
          <div class="search_condition_name" key="10" v-if="currentData.reportCondition.includes(conditionAll[4])||currentData.timeTypeValue.includes(conditionAll[4])">
              <span>{{$t('information.shift-crew')}}</span>
              <el-select clearable filterable v-model="conditionData.shift" :placeholder="$t('action.select')" @change="getReport">
                <el-option
                    v-for="(item,index) in conditionList.shiftList"
                    :key="index"
                    :label="item.name"
                    :value="item.sn">
                </el-option>
              </el-select>
          </div>
          <!-- 卡车 -->
          <div class="search_condition_name" key="7" v-if="currentData.reportCondition.includes(conditionAll[1])">
              <span>{{$t('action.truck')}}</span>
              <el-select clearable filterable v-model="conditionData.truck" :placeholder="$t('action.select')" @change="getReport">
                <el-option
                    v-for="(item,index) in conditionList.truckList"
                    :key="index"
                    :label="item.equipmentName"
                    :value="item.equipmentSn">
                </el-option>
              </el-select>
          </div>
          <!-- 采装设备 -->
          <div class="search_condition_name" key="8" v-if="currentData.reportCondition.includes(conditionAll[2])">
              <span>{{$t('action.digger')}}</span>
              <el-select clearable filterable v-model="conditionData.shovel" :placeholder="$t('action.select')" @change="getReport">
                <el-option
                    v-for="(item,index) in conditionList.shovelList"
                    :key="index"
                    :label="item.equipmentName"
                    :value="item.equipmentSn">
                </el-option>
              </el-select>
          </div>
          <!-- 卸点 -->
          <div class="search_condition_name" key="9" v-if="currentData.reportCondition.includes(conditionAll[3])">
              <span>{{$t('action.dump')}}</span>
              <el-select clearable filterable v-model="conditionData.dump" :placeholder="$t('action.select')" @change="getReport">
                <el-option
                    v-for="(item,index) in conditionList.dumpList"
                    :key="index"
                    :label="item.equipmentName"
                    :value="item.equipmentSn">
                </el-option>
              </el-select>
          </div>
          <!-- 卡车故障类别 -->
          <div class="search_condition_name" key="11" v-if="currentData.reportCondition.includes(conditionAll[10])">
              <span>{{$t('statement.fault-type')}}</span>
              <el-select clearable filterable v-model="conditionData.treason" :placeholder="$t('action.select')" @change="getReport">
                <el-option
                    v-for="(item,index) in conditionList.treasonList"
                    :key="index"
                    :label="item.reasonName"
                    :value="item.reasonSn">
                </el-option>
              </el-select>
          </div>
          <!-- 采装设备故障类别 -->
          <div class="search_condition_name" key="12" v-if="currentData.reportCondition.includes(conditionAll[11])">
              <span>{{$t('statement.fault-type')}}</span>
              <el-select clearable filterable v-model="conditionData.sreason" :placeholder="$t('action.select')" @change="getReport">
                <el-option
                    v-for="(item,index) in conditionList.sreasonList"
                    :key="index"
                    :label="item.reasonName"
                    :value="item.reasonSn">
                </el-option>
              </el-select>
          </div>
          <!-- 卸点故障类别 -->
          <div class="search_condition_name" key="13" v-if="currentData.reportCondition.includes(conditionAll[12])">
              <span>{{$t('statement.fault-type')}}</span>
              <el-select clearable filterable v-model="conditionData.dreason" :placeholder="$t('action.select')" @change="getReport">
                <el-option
                    v-for="(item,index) in conditionList.dreasonList"
                    :key="index"
                    :label="item.reasonName"
                    :value="item.reasonSn">
                </el-option>
              </el-select>
          </div>
          <!-- 设备状态 -->
          <div class="search_condition_name" key="14" v-if="currentData.reportCondition.includes(conditionAll[13])">
            <span>{{$t('data-manager.status')}}</span>
            <el-select clearable filterable v-model="conditionData.status" :placeholder="$t('action.select')" @change="getReport">
              <el-option
                  v-for="(item,index) in conditionList.statusList"
                  :key="index"
                  :label="item.name"
                  :value="item.code">
              </el-option>
            </el-select>
          </div>
          <div class="search_condition_submit">
            <el-button type="primary" class="btnGray" @click="resetDate">
              <i class="iconfont icon-zhongzhi themeOrangeColor"></i>
              {{$t('action.reset')}}
            </el-button>
          </div>
        </div>
        <div class="search_condition_top_r">
          <el-button :title='$t("monitoring.download")' type="primary" class="btnGray" @click="exportReport"><i class="iconfont icon-xiazai themeOrangeColor"></i> 下载</el-button>
        </div>
      </div>
      <div class="report-list report_content">
          <div class="report-title">{{currentData.reportTitle}}
            <p class="report-time">
              <span v-if="currentData.reportCondition.includes(conditionAll[0])">分区：{{conditionData.subarea ? conditionData.subareaName : $t('action.all')}}</span>
              <span v-if="currentData.reportCondition.includes(conditionAll[1])">卡车：{{conditionData.truck ? conditionData.truckName : $t('action.all')}}</span>
              <span v-if="currentData.reportCondition.includes(conditionAll[2])">采装设备：{{conditionData.shovel ? conditionData.shovelName : $t('action.all')}}</span>
              <span v-if="currentData.reportCondition.includes(conditionAll[3])">卸点：{{conditionData.dump ? conditionData.dumpName : $t('action.all')}}</span>
              <span v-if="currentData.reportCondition.includes(conditionAll[4])||currentData.timeTypeValue.includes(conditionAll[4])">班次：{{conditionData.shift ? conditionData.shiftName : $t('action.all')}}</span>
              <span v-if="currentData.reportCondition.includes(conditionAll[5])||currentData.timeTypeValue.includes(conditionAll[5])">日期：{{conditionData.date ? dateFormat(conditionData.date,1) : $t('action.all')}}</span>
              <span v-if="currentData.reportCondition.includes(conditionAll[6])||currentData.timeTypeValue.includes(conditionAll[6])">开始日期：{{conditionData.starttime ? dateFormat(conditionData.starttime,1) : $t('action.all')}}</span>
              <span v-if="currentData.reportCondition.includes(conditionAll[7])||currentData.timeTypeValue.includes(conditionAll[7])">结束日期：{{conditionData.endtime ? dateFormat(conditionData.endtime,1) : $t('action.all')}}</span>
              <span v-if="currentData.reportCondition.includes(conditionAll[8])||currentData.timeTypeValue.includes(conditionAll[8])">年：{{conditionData.year ? yearFormat(conditionData.year) : $t('action.all')}}</span>
              <span v-if="currentData.reportCondition.includes(conditionAll[9])||currentData.timeTypeValue.includes(conditionAll[9])">月：{{conditionData.month ? monthFormat(conditionData.month,1) : $t('action.all')}}</span>
              <span v-if="currentData.reportCondition.includes(conditionAll[10])">故障类别：{{conditionData.treason ? conditionData.treasonName : $t('action.all')}}</span>
              <span v-if="currentData.reportCondition.includes(conditionAll[11])">故障类别：{{conditionData.sreason ? conditionData.sreasonName : $t('action.all')}}</span>
              <span v-if="currentData.reportCondition.includes(conditionAll[12])">延时：{{conditionData.dreason ? conditionData.dreasonName : $t('action.all')}}</span>
              <span v-if="currentData.reportCondition.includes(conditionAll[13])">状态：{{conditionData.status ? conditionData.statusName : $t('action.all')}}</span>
            </p>
          </div>
          <report-list :info="currentData"></report-list>
      </div>
    </div>
    
  </div>
</template>

<script>

const ReportList=()=>import('../../components/statement/ReportList')

import ReportMinxins from '../../common/mixins/report.mixins'
export default {
  name:'BaseReport',
  components:{
    ReportList
  },
  mixins:[ReportMinxins],
  data(){
    return {

    }
  },
  mounted(){
    this.getDay('output_date');
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
 
</style>