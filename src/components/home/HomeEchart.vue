<template>
    <div class="charts_content">
        <v-chart :options="options" :autoresize="true" />
    </div>
</template>

<script>

import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
// import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'

export default {
  name: 'HomeEchart',
  mixins: [],
  components: {
    'v-chart': ECharts
  },
  data () {
    return {
        options: {},
        // lineColor:['1890ff','13c2c2','2fc25b','facc14','f04864','8543e0','fa8014','7ae59a','83eddd','fae749']
    }
  },
  watch:{
    outputJson: {
      handler(newName, oldName) {
        this.setChart();

      },
      immediate: true
    }
  },
  props:{
    outputJson:{
      type:Object,
      default:function(){
        return {}
      }
    },
    selectedDate:{
      type:String,
      default:'DAY'
    },
    // selectedDevice:{
    //   type:String,
    //   default:'truck'
    // }
  },
  created () {
    this.setChart();
  },
  methods: {
    setChart(){

      var abscissaOld = this.outputJson.abscissa||[]
      var dateText = ""
      if(this.selectedDate == 'WEEK'){
        var abscissa = ['周一','周二','周三','周四','周五','周六','周日'];
      }else if(this.selectedDate == 'MONTH'){
        var dateText = "日"
        var abscissa = [];
        abscissaOld.forEach(element => {
          abscissa.push(element.toString().substring(6));
        });
      }else if(this.selectedDate == 'YEAR'){
        var dateText = "月"
        var abscissa = [];
        abscissaOld.forEach(element => {
          abscissa.push(element.toString().substring(4));
        });
      }else{
        var dateText = "时"
        var abscissa=abscissaOld;
      }

      var data=this.outputJson.data||{};

      var type = [];
      var seriesList = [];
      for(let i in data){
        var text = this.utils.getObjValByKey(this.vars.materialType,i,'code','name');
        type.push(text)
        var li = {
          name:text,
          type:'line',
          stack: '总量',
          data:data[i]
        }
        seriesList.push(li);
      }

      var obj1 = {
        type:type,
        xAxis:abscissa,
        series:seriesList,
        dateText:dateText
      }
      this.options=this.defaultOptions(obj1);
      
    },
    defaultOptions(obj){
      var type = obj.type;
      var xAxis = obj.xAxis;
      var dateText = obj.dateText;
      var series = obj.series;


      var options={
        tooltip: {
            trigger: 'axis'
        },
        color:['#1890ff','#13c2c2','#2fc25b','#facc14','#f04864','#8543e0','#fa8014','#7ae59a','#83eddd','#fae749'],
        legend: {
            data:type,
            right:'3%'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
                color: '#5f5f5f',
                width: 1,
            }
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#5f5f5f',
              fontSize : 14
            },
            // interval:0
          },
          data: xAxis,
          name:dateText
        },
        yAxis: {
          splitLine:{  
            show:true,
            lineStyle:{
              color:'#f0f0f0',
              width: 1,
              type:"dotted"
            },
          },
          axisLine: {
              lineStyle: {
                color: '#fff',
                width: 0,
              },
          },
          nameTextStyle:{
            color: '#5f5f5f',
            fontSize : 14
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#5f5f5f',
              fontSize : 14
            }
          },
          type: 'value',
          name:'吨',
        },
        series: series
      }
      return options;
    }
  }
}
</script>
<style lang="scss" scoped>
.charts_content{
    height: 100%;
    .echarts{
      width: 100%;
      height: 100%;

    }
}
</style>
