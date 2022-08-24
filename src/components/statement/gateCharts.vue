<template>
  <div class="boxBaseStyle">

    <div id="chartsgate" class="basicLineBox"></div>
  </div>
</template>
<script>
export default {
  name: "attendanceCharts",
  props: [
    "stackedLine",
    "chartsXData",
    "chartsLegend",
  ],
  data() {
    return {};
  },
  mounted() {
    this.myEcharts();
  },
  methods: {
    myEcharts(e) {
      let option = {
		  title: {
		  	text: this.stackedLine.title,
		  	show: true,
		  	textStyle:{				
		  	color:'#bfc8d8', //颜色
		  	fontSize:14, //大小
		  	fontWeight:'normal', //粗细
		  	}
		  },
        color: ["#5470C6", "#FDDD60", "#91CC75","#58D9F9","#DD79FF"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          formatter: function (e) {
            if (e[0]["seriesName"] == "series\u00000") return;
            let str = `<div>${e[0].axisValue}</div>`;
            e.forEach((i) => {
              str += `<div>${i.marker} ${i.seriesName}: ${i.value}</div>`;
            });
            return str;
          },
        },
        grid: {
          right: "1%",
          left: "3%",
          bottom: "8%",
          top: "10%",
        },
        toolbox: {
          right: "1%",
          top: "-1%",
          show: true,
          feature: {
          saveAsImage: {
          	title: '导出为jpg',
          	type: 'jpg',
			backgroundColor: '#1b202f',
          	icon: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAMxJREFUOE/dk00OgkAMhfuYhScxIXIARxcGLuHSlcfyBF4C4kLxABgSL6KLoaYEJiNk+Ik7Z9Wkr1+bNy3ox4eh+jQvU8knOkx8ujEANwCv7h8BYhxAi4DV0ZApxANFKqpgTsz07hra8yC7l1dm2hBQEHNUu9/EAN3idbh1f6QHuOTPlUF1tsWtGigUB/udXj4GAZLsQTzF9XC+BXEgL0Xq0O1sB5Ngysa5jVx9PUGal6Mb1wFY/Rdg7l0lOkQLkKOJZwIy2YnBW5gC/ADSKWgRqGkL5QAAAABJRU5ErkJggg==',
			emphasis:{
			         iconStyle:{
			          color:'#ffffff',
			         }
			        }
		  },
          },
        },
        legend: {
          data: this.chartsLegend,
          x: "center",
          y: "center",
          top: "0%",
          textStyle: {
            fontSize: 12, //字体大小
            color: "#bfc8d8", //字体颜色
          },
        },
        xAxis: {
          type: "category",
          axisTick: {
            alignWithLabel: true,
          },
          axisLine: {
            lineStyle: {
              color: "#bfc8d8",
            },
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#bfc8d8", //更改坐标轴文字颜色
              fontSize: 12, //更改坐标轴文字大小
            },
          },
          axisTick: {
            show: false,
          },
          data: [
            "1701",
            "1702",
            "1703",
            "1703",
            "1703",
            "1703",
            "1703",
            "1703",
            "1703",
          ],
        },
        yAxis: {
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "#bfc8d8",
            },
          },
        },
        series: [
          {
            name: this.chartsLegend[0],
            barMaxWidth: 30,
            type: "bar",
            itemStyle: {
              normal: {
                color: "#5470c6",
                borderColor: "#5470c6", //拐点边框颜色
              },
            },
            data: [23, 24, 18, 25, 27, 28, 25, 33, 22],
          },
          {
            name: this.chartsLegend[1],
            barMaxWidth: 30,
            type: "bar",
            itemStyle: {
              normal: {
                color: "#91CC75",
                borderColor: "#91CC75", //拐点边框颜色
              },
            },
            data: [26, 24, 18, 22, 23, 20, 27, 33, 23],
          },
          {
            name: this.chartsLegend[2],
            barMaxWidth: 30,
            type: "bar",
            itemStyle: {
              normal: {
                color: "#ee6666",
                borderColor: "#ee6666", //拐点边框颜色
              },
            },
            data: [26, 24, 18, 22, 23, 20, 27, 12, 32],
          },
        ],
      };
      var myChart = this.$echarts.init(document.getElementById("chartsgate"));
      myChart.setOption(option);
    },
  },
};
</script>
<style lang="scss" scoped>

.boxBaseStyle {
  overflow: hidden;
  width: 100%;
  height: 575px !important;
  background: #1b202f;
  border: 1px solid #101012;
  border-radius: 5px;
  padding: 17px;
  margin: 20px 0;	
	}

.basicLineBox {
  width: 100%;
  height: 540px;
}
</style>