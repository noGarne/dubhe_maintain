<template>
  <!-- 出勤分析 -->
  <div class="table_content">
    <div class="content_center content_tabs">
      <div class="reportTitle">
        <a>{{ $t("route.statement-status") }}</a>
      </div>
      <div class="btn_search">
        <!-- 卡车 -->
        <el-select
          class="cartSelect"
          clearable
          filterable
          multiple
          v-model="search.truckId"
          collapse-tags
          :placeholder="$t('action.truck')"
        >
          <el-option
            v-for="(item, index) in equipmentList"
            :key="index"
            :label="item.deviceName"
            :value="item.uniqueId"
          >
          </el-option>
        </el-select>
        <!-- 日期 -->
        <el-date-picker
          v-model="search.time"
          type="datetime"
          prefix-icon="el-icon-date"
          :placeholder="$t('common.date')"
          :range-separator="$t('devicesLog.to')"
          align="right"
          @change="timeChange"
        ></el-date-picker>
        <!-- 查询 -->
        <el-button type="primary" class="btnGray" @click="dataSearchEve">
          <i class="iconfont icon-sousuo themeOrangeColor"></i>
          {{ $t("action.search") }}
        </el-button>
        <!-- 重置 -->
        <el-button type="primary" class="btnGray" @click="dataResizeEve">
          <i class="iconfont icon-zhongzhi themeOrangeColor"></i>
          {{ $t("action.reset") }}
        </el-button>
      </div>
      <div class="taskoverListBox">
        <!-- 出勤车辆 -->
        <div class="listItem">
          <p>
            {{ $t("device.attendance-car") }}(h)
            <el-tooltip popper-class="tooltip" placement="top">
              <i class="iconfont icon-shuoming"></i>
              <div slot="content" class="tooltip-content">
                <div>工作的车辆</div>
              </div>
            </el-tooltip>
          </p>
          <p>{{ chartsData.takeOverTimeSum }}</p>
        </div>
        <!-- 出勤总时长 -->
        <div class="listItem">
          <p>
            {{ $t("device.attendance—time")}}(h)
            <el-tooltip popper-class="tooltip" placement="top">
              <i class="iconfont icon-shuoming"></i>
              <div slot="content" class="tooltip-content">
                <div>所有车辆的出勤时长总和</div>
              </div>
            </el-tooltip>
          </p>
          <p>{{ chartsData.takeOverTimeSum }}</p>
        </div>
        <!-- 平均出勤时长 -->
        <div class="listItem">
          <p>
            {{ $t("device.attendance—average-time") }}(h)
            <el-tooltip popper-class="tooltip" placement="top">
              <i class="iconfont icon-shuoming"></i>
              <div slot="content" class="tooltip-content">
                <div>所有车辆的运行时长总和/车辆数</div>
              </div>
            </el-tooltip>
          </p>
          <p>{{ chartsData.takeOverTimeSum }}</p>
        </div>
        <!-- 自动驾驶运行总时长 -->
        <div class="listItem">
          <p>
            {{ $t("device.autodrive-run-time") }}(h)
            <el-tooltip popper-class="tooltip" placement="top">
              <i class="iconfont icon-shuoming"></i>
              <div slot="content" class="tooltip-content">
                <div>所有车辆的自动驾驶运行时长总和</div>
              </div>
            </el-tooltip>
          </p>
          <p>{{ chartsData.takeOverTimeSum }}</p>
        </div>
        <!-- 平均自动驾驶运行时长 -->
        <div class="listItem">
          <p>
            {{ $t("device.autodrive-run-average-time") }}(h)
            <el-tooltip popper-class="tooltip" placement="top">
              <i class="iconfont icon-shuoming"></i>
              <div slot="content" class="tooltip-content">
                <div>所有车辆的自动驾驶运行时长总和/车辆数</div>
              </div>
            </el-tooltip>
          </p>
          <p>{{ chartsData.takeOverTimeSum }}</p>
        </div>
      </div>

      <div class="chartsBox">
        <AttendanceCharts
          :stackedLine="carAttendanceDetal"
          :chartsXData="chartsXData"
          ref="chartsTwo"
          :chartsLegend="chartsLegend"
        >
        </AttendanceCharts>
      </div>
    </div>
  </div>
</template>
<script>
import AttendanceCharts from "../../components/statement/gateCharts.vue";

export default {
  name: "AttenDance",
  components: {
    AttendanceCharts,
  },
  data() {
    return {
      carAttendanceDetal: {
        title: "单车出勤展示",
      },
      chartsLegend: ["出勤时长", "自动驾驶运行时长", "接管时长"],
      chartsXData: {},
      equipmentList: [],
      chartsData: {
        takeOverTimeSum: "33333",
      },
      search: {
        sortName: "id",
        time: "",
        truckId: [],
        sort: "DESC",
      },
    };
  },
  methods: {
    timeChange(v) {
      if (!v) return;
      this.search.time = this.utils.formatDate(v);
    },
    dataSearchEve() {
      console.log(this.search);
    },
    dataResizeEve() {
      this.search = {
        sortName: "id",
        time: "",
        truckId: [],
        sort: "DESC",
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.cartSelect {
  .el-input {
    width: 250px !important;
  }
}

.table_content {
  .btn_search {
    position: inherit;
    top: 0;
    margin-top: 20px;
  }

  .taskoverListBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;

    .listItem {
      width: 19%;
      height: 94px;
      background: #1b202f;
      border: 1px solid #101012;
      border-radius: 5px;
      padding: 5px;

      p:nth-child(1) {
        color: #bfc8d8;
        padding: 11px 0 9px 11px;
        font-size: 14px;

        i {
          font-size: 12px !important;
          padding-left: 4px;
        }
      }

      p:nth-child(2) {
        color: #3c66ed;
        padding: 11px 0 9px 11px;
        font-size: 17px;
        font-weight: 700;
      }
    }
  }
  .chartsBox {
    position: absolute;
    top: 200px;
    width: 97.9%;
    margin: 5px 0 0 20px;
    border-radius: 3px;
    height: calc(100% - 130px);
    overflow-y: scroll !important;
  }
}
</style>
