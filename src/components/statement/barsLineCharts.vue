<template>
	<div class="boxBaseStyle">

		<div id="chartstwo" class="basicLineBox"></div>
	</div>
</template>

<script>
	export default {
		name: 'barsLineCharts',
		props: ['stackedLine', 'chartsXData', 'chartsYtakeOverAvg', 'chartsYtakeOverCount', 'chartsYtakeOverTimeSingle',
			'chartsLegend'
		],
		data() {
			return {

			}
		},
		methods: {
			myEcharts(e) {
				let option = {
					color: ['#5470C6', '#91CC75', '#EE6666'],
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross'
						},
						formatter: function(e) {
							let str = `<div>${e[0].axisValue}</div>`
							e.forEach(i => {
								str +=
									`<div>${i.marker} ${i.seriesName.split('(')[0]}:${i.value+'('+i.seriesName.split('(')[1]}</div>`
							})
							return str;
						}
					},
					title: {
						text: this.stackedLine.title,
						show: true,
						textStyle: {
							color: '#bfc8d8', //颜色
							fontSize: 14, //大小
							fontWeight: 'normal', //粗细
						}
					},
					grid: {
						right: '17%',
						left: '6%',
						bottom: "4%",
						top: "10%"
					},
					toolbox: {
						right: '4%',
						top: '-1%',
						show: true,
						feature: {
							saveAsImage: {
								title: '导出为jpg',
								type: 'jpg',
								backgroundColor: '#1b202f',
								icon: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAMxJREFUOE/dk00OgkAMhfuYhScxIXIARxcGLuHSlcfyBF4C4kLxABgSL6KLoaYEJiNk+Ik7Z9Wkr1+bNy3ox4eh+jQvU8knOkx8ujEANwCv7h8BYhxAi4DV0ZApxANFKqpgTsz07hra8yC7l1dm2hBQEHNUu9/EAN3idbh1f6QHuOTPlUF1tsWtGigUB/udXj4GAZLsQTzF9XC+BXEgL0Xq0O1sB5Ngysa5jVx9PUGal6Mb1wFY/Rdg7l0lOkQLkKOJZwIy2YnBW5gC/ADSKWgRqGkL5QAAAABJRU5ErkJggg==',
								emphasis: {
									iconStyle: {
										color: '#ffffff',
									}
								}
							},
						}
					},
					legend: {
						data: this.chartsLegend,
						x: 'center',
						y: ' center',
						top: "0%",
						textStyle: {
							fontSize: 12, //字体大小
							color: '#bfc8d8' //字体颜色
						},
					},
					xAxis: [{
						type: 'category',
						axisTick: {
							alignWithLabel: true
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
						axisTick: {
							show: false
						},
						// prettier-ignore
						data: this.chartsXData
					}],
					yAxis: [{
							type: 'value',
							position: 'right',
							offset: 70,
							splitLine: {
								show: false
							},
							axisTick: {
								show: false
							},
							axisLabel: {
								formatter: '{value}次'
							},
							axisLine: {
								show: true,
								lineStyle: {
									color: "#ee6666"
								}
							},
						},
						{
							type: 'value',
							position: 'left',
							splitLine: {
								show: false
							},
							axisTick: {
								show: false
							},
							axisLabel: {
								formatter: '{value}'
							},
							axisLine: {
								show: true,
								lineStyle: {
									color: '#91cc75'
								}
							},
						},
						{
							type: 'value',
							position: 'right',
							axisTick: {
								show: false
							},
							splitLine: {
								show: true,
								lineStyle: {
									color: ['#bfc8d8'],
									width: 1,
									type: 'solid'
								}
							},
							axisLabel: {
								formatter: '{value}h'
							},
							axisLine: {
								show: true,
								lineStyle: {
									color: '#5470c6'
								}
							},
						}
					],
					series: [{
							name: this.chartsLegend[0],
							type: 'line',
							symbol: 'circle',
							symbolSize: 5,
							itemStyle: {
								normal: {
									color: '#91CC75',
									borderColor: '#91CC75', //拐点边框颜色
								}
							},
							yAxisIndex: 1,
							data: this.chartsYtakeOverAvg,
						},
						{
							name: this.chartsLegend[1],
							type: 'bar',
							barMaxWidth: 20,
							yAxisIndex: 2,
							itemStyle: {
								normal: {
									color: '#5470c6',
							 	borderColor: '#5470c6', //拐点边框颜色
								}
							},

							data: this.chartsYtakeOverTimeSingle
						},
						{
							name: this.chartsLegend[2],
							barMaxWidth: 20,
							type: 'bar',
							itemStyle: {
								normal: {
									color: '#ee6666',
									borderColor: '#ee6666', //拐点边框颜色
								}
							},
							data: this.chartsYtakeOverCount
						}
					]
				}
				var myChart = this.$echarts.init(document.getElementById('chartstwo'));
				myChart.setOption(option);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.boxBaseStyle {
		overflow: hidden;
		width: 48%;
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
