<template>
	<div class="boxBaseStyle">

		<div :id="boxId" class="basicLineBox"></div>
	</div>
</template>

<script>
	export default {
		name: 'basicCharts',
		props: ['data'],
		data() {
			return {
				boxId: 'basicLineMain' + Math.random(),

			}
		},
		methods: {
			myEcharts(e, c) {

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
						axisLabel: {
							show: true,
							textStyle: {
								color: "#bfc8d8", //更改坐标轴文字颜色
								fontSize: 12 //更改坐标轴文字大小
							}
						},
						type:'value',
						axisLine: {
							lineStyle: {
								color: '#bfc8d8',
							}
						},
						min:this.data.xMin*0.999997
					},
					yAxis: {
						textStyle: {
							fontSize: 15,
							color: '#fff'
						},
						axisLine: {
							lineStyle: {
								color: '#bfc8d8',
							}
						},
						splitLine: {
							show: true,
							lineStyle: {
								color: ['#454B5E'],
								width: 1,
								type: 'dashad'
							}
						},
						 axisLabel:{
							 formatter:(e)=>{
								 return e.toFixed(4)
							 }
						 },
						min:this.data.yMin*0.999997
					},
					legend: {
						data: this.data.legendList,
						top: "1%",
						x: 'center',
						textStyle: {
							fontSize: 12, //字体大小
							color: '#bfc8d8' //字体颜色
						},
					},
					grid: {
						right: '2%',
						left: '4%',
						bottom: "13%",
						top: "11%"
					},
					toolbox: {
						right:'2%',
						top:'-1%',
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
					series: this.data.list
				};
				var myChart = this.$echarts.init(document.getElementById(this.boxId));
				myChart.setOption(option);

			}
		},
		mounted() {
			// this.myEcharts()
		}
	}
</script>

<style lang="scss" scoped>
	.boxBaseStyle {
		overflow: hidden;
		width: 100%;
		height: 530px;
		background: #1b202f;
		border: 1px solid #101012;
		border-radius: 5px;
		padding: 17px;
		margin-bottom: 20px;
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
