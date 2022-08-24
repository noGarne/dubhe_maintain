<template>
	<div class="boxBaseStyle">
		<div :id="boxId" class="basicLineBox"></div>
	</div>
</template>

<script>
	export default {
		name: 'barLineCharts',
		props: ['stackedLine', 'chartsXData', 'chartsYtakeOverRate', 'chartsYtakeOverAvg'],
		data() {
			return {
				boxId: 'basicLineMain' + Math.random(),
				checkCar:'',
				
			}
		},
		methods: {
			myEcharts(e) {
				let option = {
					title: {
						text: this.stackedLine.title,
						show: true,
						textStyle: {
							color: '#bfc8d8', //颜色
							fontSize: 14, //大小
							fontWeight: 'normal', //粗细
						}
					},
					color: ['#5470C6', '#91CC75', '#EE6666'],
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross'
						},
						formatter: function(e) {
							let str = ``;
							e.forEach(i => {
								str +=
									`<div>${i.marker}接管原因:${e[0].axisValue}</div><div>${i.marker}${i.seriesName}:${i.value}次</div>`
							})
							return str;
						}
					},
					grid: {
						right: '3%',
						left: '8%',
						bottom: "4%",
						top: "10%"
					},
					legend: {
						data: ['接管次数'],
						x: 'center',
						top: "0%",
						y: 'center',
						textStyle: {
							fontSize: 12, //字体大小
							color: '#bfc8d8' //字体颜色
						},
					},
					toolbox: {
						right: '2%',
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
							},
						}
					},
					xAxis: [{
						type: 'category',
						axisTick: {
							alignWithLabel: true
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
						axisLine: {
							lineStyle: {
								color: '#bfc8d8',
							}
						},
						data: this.chartsXData
					}],
					yAxis: [{
						type: 'value',
						position: 'left',
						axisTick: {
							show: false
						},
						axisLabel: {
							formatter: '{value}次'
						},
						splitLine: {
							show: true,
							lineStyle: {
								color: ['#bfc8d8'],
								width: 1,
								type: 'solid'
							}
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: '#5470C6'
							}
						},
					}],
					series: [{
							name: '接管次数',
							type: 'bar',
							barMaxWidth: 25,
							data: this.chartsYtakeOverAvg
						},

					]
				}
				var myChart = this.$echarts.init(document.getElementById(this.boxId));
				myChart.setOption(option);

			},
			defaultBar(e,d) {
				let option = {
					title: {
						text: this.stackedLine.title,
						show: true,
						 x:'center',
						y: 'bottom',
						subtext: "平均循环时间(min)",
						  left: 24,// 距离左边位置
						  top: -25,// 距离上面位置
						  subtextStyle: { // 设置二级标题的样式
						  	fontSize: 14,
						  	color: '#bfc8d8', //颜色
						  },
						textStyle: {
							color: '#bfc8d8', //颜色
							fontSize: 14, //大小
							fontWeight: 'normal', //粗细
						},
						
					},
					color: ['#5470C6', '#91CC75', '#EE6666'],
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross'
						},

					},
					grid: {
						right: '1%',
						left: '3%',
						bottom: "5%",
						top: "8%"
					},
					xAxis: [{
						type: 'category',
						axisTick: {
							alignWithLabel: true
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
						axisLine: {
							lineStyle: {
								color: '#bfc8d8',
							}
						},
						data: e
					}],
					yAxis: [{
						type: 'value',
						position: 'left',
						axisTick: {
							show: false
						},
						name: '',
						nameTextStyle: {
							color: "#aaa",
							nameLocation: "start",
							padding:[0,0,0,50]
						},
						splitLine: {
							show: true,
							lineStyle: {
								color: ['#454B5E'],
								width: 1,
								type: 'dashad'
							}
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: '#8E96AC'
							}
						},
					}],
					series: d
				}
				var myChart = this.$echarts.init(document.getElementById(this.boxId));
				myChart.setOption(option);
				
				myChart.on('click', (params) => {
						this.$parent.drilingFlag = true;
						this.checkCar = params.data.id;
						this.$parent.checkCarName = params.name;
						console.log(params)
						this.$nextTick(()=>{
							this.$parent.efficiencyAnalysisLineChartEve();
							this.$parent.drivingTimeLineChartEve();
							this.$parent.drivingSpeedLineChartEve();
						})

				})
			},
			titleBarEcharts(e,d,c){
				let option = {
					title: {
						text: d[0].name,
						show: true,
						 x:'center',
						y: '95%',
						textStyle: {
							color: '#bfc8d8', //颜色
							fontSize: 14, //大小
							fontWeight: 'normal', //粗细
						},
						
					},
					color: ['#5470C6', '#91CC75', '#EE6666'],
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross'
						},
						formatter: function(e) {
							console.log(e)
							return `<div>${e[0].seriesName}:${e[0].axisValueLabel}</div> <div>${e[0].marker}占比:${e[0].value}</div>`;
						}
					},
					grid: {
						right: '1%',
						left: '5.3%',
						bottom: "12%",
						top: ['速度误差','行驶横向偏差'].includes(c) ? `9%` : '5%'
					},
					xAxis: [{
						type: 'category',
						axisTick: {
							alignWithLabel: true
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
						axisLine: {
							lineStyle: {
								color: '#bfc8d8',
							}
						},
						data: e
					}],
					yAxis: [{
						type: 'value',
						position: 'left',
						axisTick: {
							show: false
						},
						name: '',
						nameTextStyle: {
							color: "#aaa",
							nameLocation: "start",
							padding:[0,0,0,70]
						},
						splitLine: {
							show: true,
							lineStyle: {
								color: ['#454B5E'],
								width: 1,
								type: 'dashad'
							}
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: '#8E96AC'
							}
						},
					}],
					series: d
				}
				var myChart = this.$echarts.init(document.getElementById(this.boxId));
				myChart.setOption(option);
				
			},
			defaultEcharts(e) {
				let option = {
					title: {
						text: e.title,
						show: true,
						textStyle: {
							color: '#bfc8d8', //颜色
							fontSize: 14, //大小
							fontWeight: 'normal', //粗细
						}
					},
					color: ['#5470C6', '#91CC75', '#EE6666'],
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross'
						},
						formatter: function(e) {
							e = e.filter(c => {
								return !['最低基准线', '最高基准线'].includes(c.seriesName)
							})
							let str = ``;
							e.forEach(i => {
								str +=
									`<div>${i.marker}${i.name}</div><div><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;"></span>${i.seriesName}:${e[0].value}</div>`
							})
							return str;
						}
					},
					grid: {
						right: '4%',
						left: '8%',
						bottom: "4%",
						top: "10%"
					},
					legend: {
						data: e.legend,
						x: 'center',
						top: "0%",
						y: 'center',
						textStyle: {
							fontSize: 12, //字体大小
							color: '#bfc8d8' //字体颜色
						},
					},
					toolbox: {
						right: '3%',
						top: '-1%',
						show: true,
						feature: {
							saveAsImage: {
								title: '导出为jpg',
								backgroundColor: '#1b202f',
								type: 'jpg',
								icon: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAMxJREFUOE/dk00OgkAMhfuYhScxIXIARxcGLuHSlcfyBF4C4kLxABgSL6KLoaYEJiNk+Ik7Z9Wkr1+bNy3ox4eh+jQvU8knOkx8ujEANwCv7h8BYhxAi4DV0ZApxANFKqpgTsz07hra8yC7l1dm2hBQEHNUu9/EAN3idbh1f6QHuOTPlUF1tsWtGigUB/udXj4GAZLsQTzF9XC+BXEgL0Xq0O1sB5Ngysa5jVx9PUGal6Mb1wFY/Rdg7l0lOkQLkKOJZwIy2YnBW5gC/ADSKWgRqGkL5QAAAABJRU5ErkJggg==',
								emphasis:{
								         iconStyle:{
								          color:'#ffffff',
								         }
								        }
							},
						}
					},
					xAxis: [{
						type: 'category',
						axisTick: {
							alignWithLabel: true
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
						axisLine: {
							lineStyle: {
								color: '#bfc8d8',
							}
						},
						data: e.chartsXData
					}],
					yAxis: [{
						type: 'value',
						position: 'left',
						axisTick: {
							show: false
						},
						axisLabel: {

						},
						splitLine: {
							show: true,
							lineStyle: {
								color: ['#bfc8d8'],
								width: 1,
								type: 'solid'
							}
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: '#BFC8D8'
							}
						},
					}],
					series: e.series
				}
				var myChart = this.$echarts.init(document.getElementById(this.boxId));
				myChart.setOption(option);

			},
		}
	}
</script>

<style lang="scss" scoped>
	.boxBaseStyle {
		overflow: hidden;
		width: calc(100% / 2.03);
		height: 570px;
		background: #1b202f;
		border: 1px solid #101012;
		border-radius: 5px;
		padding: 17px;

		.tableHeader {
			color: #bfc8d8;
			font-size: 14px;
		}
	}

	.basicLineBox {
		width: 100%;
		height: 540px;
	}
</style>
