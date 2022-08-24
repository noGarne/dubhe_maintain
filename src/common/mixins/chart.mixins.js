
import ECharts from "vue-echarts";
import "echarts/lib/chart/line";
// import "echarts/lib/chart/bar";
// import "echarts/lib/chart/pie";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/legend";
import "echarts/lib/component/title";
import "echarts/theme/macarons";

export default{
  components: {
    "v-chart": ECharts
  },
  props: {
    datas: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      options: {}
    };
  },
  watch: {
    datas: {
      deep: true,
      handler() {
        this.initChart();
      }
    }
  },
  created() {
    this.initChart();
  },
  methods: {
    delChart() {
      this.$emit("delChart");
    }
  },
}