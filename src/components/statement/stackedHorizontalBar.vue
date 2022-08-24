<template>
	<div class="boxBaseStyle">

		<div :id="boxId" class="basicLineBox"></div>
	</div>
</template>

<script>
	export default {
		name: 'stackedHorizontalBar',
		props: ['data'],
		data() {
			return {
				boxId: 'basicLineMain' + Math.random(),

			}
		},
		methods: {
			HorizontalEcharts(e) {
				let option = {
					title: {
						text: this.data.title,
						show: true,
						textStyle:{				
						color:'#bfc8d8', //颜色
						fontSize:14, //大小
						fontWeight:'normal', //粗细
						}
					},
					tooltip: {
						
						trigger: 'axis',
						axisPointer: {
							type: '',
						},
						formatter: function(e) {
							if (e[0]['seriesName'] == "series\u00000") return;
							let str = `<div>${e[0].axisValue}</div>`;
							let num = 0
							e.forEach(i => {
								str += `<div>${i.marker} ${i.seriesName}: ${i.value}</div>`;
								num += Number(i.value)
							})
							str +=
								`<div><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#BFC8D8;"></span> 总故障次数: ${num}</div>`
							return str;
						}
					},
					legend: {
						textStyle: {
							fontSize: 12, //字体大小
							color: '#bfc8d8' //字体颜色
						},

					},
					grid: {
						left: '1%',
						right: '6%',
						bottom: '1%',
						top: '8%',
						containLabel: true
					},
					toolbox: {
						right: '3%',
						top: '-1%',
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
							} 
						}
					},
					xAxis: {
						type: 'value',
						axisLine: {
							lineStyle: {
								color: '#727A89',
							}
						},
						axisTick: {
							show: false
						},
						splitLine: {
							show: false
						},
						axisLabel: {
							show: true,
							textStyle: {
								color: "#bfc8d8", //更改坐标轴文字颜色
								fontSize: 12 //更改坐标轴文字大小
							}
						},
					},
					yAxis: {
						type: 'category',
						data: e.xAxis.data,
						axisLine: {
							lineStyle: {
								color: '#727A89',
							}
						},
						splitLine: {
							show: false
						},
						axisTick: {
							show: false
						},
						axisLabel: {
							show: true,
							textStyle: {
								color: "#bfc8d8", //更改坐标轴文字颜色
								fontSize: 12 //更改坐标轴文字大小
							}
						},
					},
					color: this.data.color,
					series: e.series
				};
				var series = option["series"];
				var fun = function (params) {
				  var datavalue = 0;
				  for (var i = 0; i < series.length; i++) {
				    datavalue += Number(series[i].data[params.dataIndex])
				  }
				  return datavalue;
				}
				series[series.length - 1]["label"]["formatter"] = fun;
				
				var myChart = this.$echarts.init(document.getElementById(this.boxId));
				myChart.setOption(option);
				
				myChart.on("legendselectchanged", function (obj) {
				  var b = obj.selected, d = [];
				  for (var key in b) {
				    if (b[key]) {
				      for (var i = 0, l = series.length; i < l; i++) {
				        var changename = series[i]["name"];
				        if (changename == key) {
				          d.push(i);
				        }
				      }
				    }
				  }
				  var fun = function (params) {
				    var datavalue = 0;
				    for (var i = 0; i < d.length; i++) {
				      for (var j = 0; j < series.length; j++) {
				        if (d[i] == j) {
				          datavalue += Number(series[j].data[params.dataIndex])
				        }
				      }
				    }
				    return datavalue
				  }
				  for (var i = 0; i < series.length; i++) {
				    series[i]["label"]["show"] = false;
					 series[i]["label"]["color"] = 'rgb(215 215 215 / 0%)';
				  }
				  for (var i = series.length - 1; i >= 0; i--) {
				    var name = series[i]["name"];
				    if (obj["selected"][name]) {
					  series[i]["label"] = {
						  formatter:fun,
						  show:true,
						  color:'#fff',
						  position:'right',
						  fontSize:16
					  }
				      break;
				    }
				  }
				  myChart.setOption(option);
				})
			}
		},
		mounted() {
			// this.HorizontalEcharts(this.data)
		}
	}
</script>

<style lang="scss" scoped>
	.basicLineBox {
		width: 100%;
		height: 490px;
	}
</style>
