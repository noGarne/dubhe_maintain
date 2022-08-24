<template>
	<div class="boxBaseStyle">
		<div class="faultLevelEve">
			<span v-for="(item,index) in levelList" :class="{checkStyle: levelIndex == index}"
				@click="levelCheckEve(index)">{{item}}</span>
		</div>
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
				levelList: ['1级', '2级', '3级'],
				levelIndex: 0,
			}
		},
		methods: {
			myEcharts(e, c) {
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
					tooltip: {
						position: 'top'
					},
					grid: {
						show: true,
						height: '74%',
						left: '4%',
						width: '94%',
						top: '8%',
						bottom:'26%',
						backgroundColor: {
							colorStops: [{
								offset: 0,
								color: '#252C3E' // 0% 处的颜色
							}, {
								offset: 1,
								color: '#252C3E' // 100% 处的颜色
							}],
						},
					},
					tooltip: {
						formatter: function(e) {
							let str = ``
							var arr= [];
							for(var i=0;i<e.data.record.length;i+=2){
							    arr.push(e.data.record.slice(i,i+2));
							}
							arr.forEach(c=>{
								str += `<div style='margin-left:15px'>${c[0]}  &nbsp ${c[1] ? c[1] : ''}</div>`
							})
							 return ` <div>${e.marker}故障名称: ${e.name}</div> ${str}`
						}
					},
					visualMap: {
						type: 'piecewise',
						show: false,
						orient: 'vertical',
						itemWidth:10,
						pieces: [{
							gt: 0,
							lte: 99999999,
							color: '#FF5900',
						}],
					},
					xAxis: {
						type: 'category',
						data: this.chartsXData,
						splitArea: {
							show: false
						},
						axisTick: {
							show: false
						},
						splitLine: {
							show: true,
							lineStyle: {
								color: '#727A89',
								width: 1
							}
						},
						axisLabel: { // X轴线 标签修改 
							rotate: 45,
							textStyle: {
								color: '#BFC8D8', //坐标值得具体的颜色
							}
						},
						
					},
					yAxis: {
						type: 'category',
						data: this.chartsYtakeOverRate,
						splitArea: {
							show: false
						},
						axisTick: {
							show: false
						},
						splitLine: {
							show: true,
							lineStyle: {
								color: '#727A89',
								width: 1
							}
						},
						axisLabel: { // X轴线 标签修改
							textStyle: {
								color: '#BFC8D8', //坐标值得具体的颜色
							}
						},
					
					},

					series: [{
						type: 'heatmap',
						pointSize: 20,
						coordinateSystem:'cartesian2d',
						data: this.chartsYtakeOverAvg,
						label: {
							show: true,
							normal: {
								show: true,
							},	
						},
						emphasis: {
							itemStyle: {
								shadowBlur: 1,
								shadowColor: 'rgba(0, 0, 0, 1)',
							}
						}
					}]
				};
				console.log(this.chartsYtakeOverAvg)
				var myChart = this.$echarts.init(document.getElementById(this.boxId));
				myChart.setOption(option, true);
			},
			levelCheckEve(e) {
				this.levelIndex = e;
				this.$parent.getFaultRepeatTimeChartEve()
				// this.faultData.faultLevel = e + 1;
				// this.singleFaultEveList(this.faultData);
				// this.myChart.dispose();
			},

		}
	}
</script>

<style lang="scss" scoped>
	.boxBaseStyle {
		overflow: hidden;
		width: 99%;
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
	.faultLevelEve{
		right: 3%;
	}
</style>
