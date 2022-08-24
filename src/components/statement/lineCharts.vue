<template>
	<div class="boxBaseStyle" :style="{height:(data.height ? data.height+'px' :'350px')}">

		<div :id="boxId" class="basicLineBox" :style="{height:(data.height ? data.height-50+'px' :'300px')}"></div>
	</div>
</template>

<script>
	export default {
		name: 'lineCharts',
		props: ['data','defaultXdata','defaultYdata','defaultLegend'],
		data() {
			return {
				boxId: 'basicLineMain' + Math.random(),
			}
		},
		methods: {
			driverEcharts(e) {
				let option = {
					title: {
						text: this.data.title,
						show: true,
						textStyle: {
							color: '#bfc8d8', //颜色
							fontSize: 14, //大小
							fontWeight: 'normal', //粗细
						}
					},
					xAxis: {
						type: 'category',
						data: e.xData,
						axisTick: {
							show: false
						},
						axisLine: {
							lineStyle: {
								color: '#bfc8d8',
							}
						},
						axisLabel: {
							show: true,
							textStyle: {
								color: "#bfc8d8", //更改坐标轴文字颜色
								fontSize: 12 //更改坐标轴文字大小
							}
						},
					},
					legend: {
						data: [e.title],
						top: "1%",
						x: 'center',
						textStyle: {
							fontSize: 12, //字体大小
							color: '#bfc8d8' //字体颜色
						},
					},
					toolbox: {
						right: '2%',
						top: '1%',
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
					dataZoom: [{
						type: 'slider',
						show: true,
						xAxisIndex: [0],
						bottom: -5,
						start: 5,
						end: 95, //初始化滚动条
						textStyle: {
							color: e.color,
						}
					}],
					tooltip: {
						trigger: 'axis',
						formatter: function(e) {
							console.log(e)
							return `<div>${e[0].marker} 驾驶模式</div>
									<div>时间:${e[0].axisValue}</div>
									<div>驾驶模式:${e[0].data == '0' ? '人工驾驶' : (e[0].data == '1' ? '自动驾驶' : '遥控驾驶') }</div>
									</div>
									`
						}
					},
					yAxis: {
						type: 'value',
						axisTick: {
							show: false
						},
						max: 3,
						textStyle: {
							fontSize: 15,
							color: '#fff'
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: e.color
							}
						},
					},
					grid: {
						right: '2%',
						left: '3%',
						bottom: "7%",
						top: "18%"
					},
					series: [{
						data: e.yData,
						name: e.title,
						symbol: 'circle',
						symbolSize: 6,
						itemStyle: {
							normal: {
								color: e.color,
								borderColor: e.color, //拐点边框颜色
								lineStyle: {
									color: e.color
								}
							}
						},
						type: 'line',

						splitLine: {
							show: true,
							lineStyle: {
								color: '#bfc8d8',
								width: 1,
								type: 'solid'
							}
						},
					}]
				}
				var myChart = this.$echarts.init(document.getElementById(this.boxId));
				myChart.setOption(option);
			},
			subEcharts(e) {
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
					xAxis: {
						type: 'category',
						data: e.xData,
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
					},
					toolbox: {
						right: '2%',
						top: '1%',
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
					dataZoom: [{
						type: 'slider',
						show: true,
						xAxisIndex: [0],
						bottom: -5,
						start: 5,
						end: 95, //初始化滚动条
						textStyle: {
							color: e.color,
						}
					}],
					legend: {
						data: [e.title],
						top: "1%",
						x: 'center',
						textStyle: {
							fontSize: 12, //字体大小
							color: '#bfc8d8' //字体颜色
						},
					},
					tooltip: {
						trigger: 'axis',
						formatter: function(e) {

							return `<div>${e[0].marker} 子状态机</div>
									<div>时间:${e[0].axisValue}</div>
									<div>子状态机:${e[0].data.type}</div>
									<div>子状态机原始值:${e[0].data.value}</div>
									`
						}
					},
					yAxis: {
						type: 'value',
						axisTick: {
							show: false
						},
						textStyle: {
							fontSize: 15,
							color: '#fff'
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: e.color
							}
						},
					},
					grid: {
						right: '2%',
						left: '3%',
						bottom: "7%",
						top: "18%"
					},
					series: [{
						data: e.yData,
						name: e.title,
						symbol: 'circle',
						step: 'start',
						symbolSize: 6,
						itemStyle: {
							normal: {
								color: e.color,
								borderColor: e.color, //拐点边框颜色
							}
						},
						type: 'line',
						itemStyle: {
							normal: {
								color: e.color,
								lineStyle: {
									color: e.color
								}
							}
						},
						splitLine: {
							show: true,
							lineStyle: {
								color: '#bfc8d8',
								width: 1,
								type: 'solid'
							}
						},
					}]
				}
				var myChart = this.$echarts.init(document.getElementById(this.boxId));
				myChart.setOption(option);
			},
			mainEcharts(e) {
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
					xAxis: {
						type: 'category',
						data: e.xData,
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
					},
					toolbox: {
						right: '2%',
						top: '1%',
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
					dataZoom: [{
						type: 'slider',
						show: true,
						xAxisIndex: [0],
						bottom: 5,
						start: 5,
						end: 95, //初始化滚动条
						textStyle: {
							color: e.color,
						}
					}],
					legend: {
						data: [e.title],
						top: "1%",
						x: 'center',
						textStyle: {
							fontSize: 12, //字体大小
							color: '#bfc8d8' //字体颜色
						},
					},
					tooltip: {
						trigger: 'axis',
						formatter: function(e) {
							return `<div>${e[0].marker} 主状态机</div>
									<div>时间:${e[0].axisValue}</div>
									<div>主状态机:${e[0].data.type}</div>
									<div>主状态机原始值:${e[0].data.value}</div>
									`
						}

					},
					yAxis: {
						type: 'value',
						axisTick: {
							show: false
						},
						textStyle: {
							fontSize: 15,
							color: '#fff'
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: e.color
							}
						},
					},
					grid: {
						right: '2%',
						left: '3%',
						bottom: "7%",
						top: "18%"
					},
					series: [{
						data: e.yData,
						name: e.title,
						symbol: 'circle',
						step: 'start',
						symbolSize: 6,
						itemStyle: {
							normal: {
								color: e.color,
								borderColor: e.color, //拐点边框颜色
							}
						},
						type: 'line',
						itemStyle: {
							normal: {
								color: e.color,
								lineStyle: {
									color: e.color
								}
							}
						},
						splitLine: {
							show: true,
							lineStyle: {
								color: '#bfc8d8',
								width: 1,
								type: 'solid'
							}
						},
					}]
				}
				var myChart = this.$echarts.init(document.getElementById(this.boxId));
				myChart.setOption(option);
			},
			otherChrts(e, c, d, f) {
				let option = {
					title: {
						text: this.data.title,
						show: true,
						textStyle: {
							color: '#bfc8d8', //颜色
							fontSize: 14, //大小
							fontWeight: 'normal', //粗细
						}
					},
					xAxis: {
						type: 'category',
						data: e,
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
					},
					toolbox: {
						right: '2%',
						top: '1%',
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
					dataZoom: [{
						type: 'slider',
						show: true,
						xAxisIndex: [0],
						bottom: 5,
						start: 5,
						end: 95, //初始化滚动条
						textStyle: {
							color: "#49c18f",
						}
					}],
					legend: {
						data: [],
						top: "1%",
						x: 'center',
						textStyle: {
							fontSize: 12, //字体大小
							color: '#bfc8d8' //字体颜色
						},
					},
					tooltip: {
						trigger: 'axis',

					},
					yAxis: {
						type: 'value',
						axisTick: {
							show: false
						},
						textStyle: {
							fontSize: 15,
							color: '#fff'
						},
						axisLine: {
							show: true,
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: "#ffffff"
							}
						},
					},
					grid: {
						right: '2%',
						left: '3%',
						bottom: "7%",
						top: "18%"
					},
					series: []
				}
				let arr = ['#91CC75', '#5470C6', '#EE6666'];
				c.nameList.forEach((i, index) => {
					option.legend.data.push(i.name);
					option.series.push({
						data: c[i.value],
						name: i.name,
						symbol: 'circle',
						symbolSize: 6,
						step: 'start',
						type: 'line',
						splitLine: {
							show: true,
							lineStyle: {
								color: '#bfc8d8',
								width: 1,
								type: 'solid'
							}
						},
						itemStyle: {
							normal: {
								color: arr[index],
								borderColor: arr[index],
							},

						},
					})
				})
				if (f) {
					option.tooltip.formatter = function(e) {
						let str = `<div>${e[0].axisValue}</div>`
						e.forEach(i => {
							str +=
								`<div>${i.marker} ${i.seriesName}:${i.seriesName == '网络模式' ? (i.value > 0 ? (Number(i.value) + 1 +'G') : '无服务') : (i.seriesName == '定位等级' ? (i.value == '0' ? '正常定位' : '异常定位') : i.value) }</div>`
						})
						return str;
					}
				}
				var myChart = this.$echarts.init(document.getElementById(this.boxId));
				myChart.setOption(option);
			},
			defaultStyle(x,y,l) {	
				let option = {
					title: {
						text: this.data.title,
						show: true,
						textStyle: {
							color: '#bfc8d8', //颜色
							fontSize: 14, //大小
							fontWeight: 'normal', //粗细
						}
					},
					xAxis: {
						type: 'category',
						data: this.defaultXdata,
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
					},
					toolbox: {
						right: '2%',
						top: '1%',
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
						},
						
					},
					color: ['#5470C6','#EE6666','#91CC75','#FDDD60','#DD79FF','#19FFD1','#FF9719','#1981FF'],
					legend: {
						 data: this.defaultLegend,
						top: "1%",
						x: 'center',
						textStyle: {
							fontSize: 12, //字体大小
							color: '#bfc8d8' //字体颜色
						},
					},
					tooltip: {
						trigger: 'axis',
						
					},
					yAxis: {
						type: 'value',
						axisTick: {
							show: false
						},
						textStyle: {
							fontSize: 15,
							color: '#fff'
						},
						axisLine: {
							show: true,
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: "#ffffff"
							}
						},
					},
					grid: {
						right: '3%',
						left: '4%',
						bottom: "4%",
						top: "15%"
					},
					series: this.defaultYdata
				}
				console.log(this.defaultYdata)
				var myChart = this.$echarts.init(document.getElementById(this.boxId));
				myChart.setOption(option,true);
			}
		},

	}
</script>

<style lang="scss" scoped>
	.boxBaseStyle {
		overflow: hidden;
		width: 100%;
		background: #1b202f;
		border: 1px solid #101012;
		border-radius: 5px;
		padding: 10px;
		margin: 20px 0;

		&:nth-child(1) {
			margin-top: 0 !important;
		}

		.tableHeader {
			color: #bfc8d8;
			font-size: 14px;
			padding-left: 10px;
		}
		.basicLineBox {
			width: 100%;
			// height: 300px;
		}
	}

	
</style>
