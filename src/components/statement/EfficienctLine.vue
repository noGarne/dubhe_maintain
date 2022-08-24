<template>
	<div class="boxBaseStyle">
		<div :id="boxId" class="basicLineBox"></div>
	</div>
</template>

<script>
	export default {
		name: 'EfficienctLine',
		props: ['stackedLine', 'chartsXData', 'chartsYtakeOverRate', 'chartsYtakeOverAvg'],
		data() {
			return {
				boxId: 'basicLineMain' + Math.random(),
			}
		},
		methods: {
			myEcharts(e, c) {
				let option = {
					title: {
						text: this.stackedLine.title,
						show: true,
						subtext: this.stackedLine.company,
						left: 14, // 距离左边位置
						top: -25, // 距离上面位置
						subtextStyle: { // 设置二级标题的样式
							fontSize: 14,
							color: '#bfc8d8', //颜色
						},
						textStyle: {
							color: '#bfc8d8', //颜色
							fontSize: 14, //大小
							fontWeight: 'normal', //粗细
						}
					},
					color: ['#0088FF', '#FFC000', '#EE6666', '#31FDFF', '#04B66B'],
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross'
						},

					},
					grid: {
						right: '2%',
						left: '3%',
						bottom: "6%",
						top: "12%"
					},
					legend: {
						textStyle: {
							fontSize: 12, //字体大小
							color: '#ffffff' //字体颜色
						},
						x: 'right',
						padding: [10, 120, 0, 0],

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
							// interval:2,
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
								color: '#bfc8d8'
							}
						},
					}],
					series: this.chartsYtakeOverRate
				}
				var myChart = this.$echarts.init(document.getElementById(this.boxId));
				myChart.setOption(option, true);
			},
			faultAnalyEcharts(e, c) {
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
					color: ['#5470C6', '#FFC000', '#91CC75', '#58D9F9', '#DD79FF', '#04B66B'],
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross'
						},

					},
					grid: {
						right: '4%',
						left: '6%',
						bottom: "4%",
						top: "12%"
					},
					legend: {
						textStyle: {
							fontSize: 12, //字体大小
							color: '#ffffff' //字体颜色
						},
						x: 'center',
						padding: [10, 120, 0, 0],

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
								color: '#bfc8d8'
							}
						},
					}],
					series: this.chartsYtakeOverRate
				}
				var myChart = this.$echarts.init(document.getElementById(this.boxId));
				myChart.setOption(option, true);
			},
			wheelCharts(e, c) {
				let option = {
					title: {
						text: this.stackedLine.title,
						show: true,
						subtext: '行车速度(km/h)',
						left: 14, // 距离左边位置
						top: -25, // 距离上面位置
						subtextStyle: { // 设置二级标题的样式
							fontSize: 14,
							color: '#bfc8d8', //颜色
						},
						textStyle: {
							color: '#bfc8d8', //颜色
							fontSize: 14, //大小
							fontWeight: 'normal', //粗细
						}
					},
					color: ['#0088FF', '#FFC000', '#EE6666', '#31FDFF', '#04B66B'],
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross'
						},

					},
					grid: {
						right: '2%',
						left: '3%',
						bottom: "6%",
						top: "12%"
					},
					legend: {
						textStyle: {
							fontSize: 12, //字体大小
							color: '#ffffff' //字体颜色
						},
						x: 'right',
						padding: [10, 120, 0, 0],

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
							},
						}
					},
					xAxis: [{
						type: 'value',
						axisTick: {
							alignWithLabel: true
						},
						axisTick: {
							show: false
						},
						axisLabel: {
							show: true,
							// interval:2,
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
						boundaryGap: false,
						// data: this.chartsXData
					}],
					yAxis: [{
						type: 'value',
						// position: 'left',
						// axisTick: {
						// 	show: false
						// },
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
								color: '#bfc8d8'
							}
						},
					}],
					series: this.chartsYtakeOverRate
				}
				var myChart = this.$echarts.init(document.getElementById(this.boxId));
				myChart.setOption(option, true);
			},

		}
	}
</script>

<style lang="scss" scoped>
	.boxBaseStyle {
		overflow: hidden;
		width: 48.85%;
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
