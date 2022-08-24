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
	import dispatchServer from '../../api/dispatch.server';
	export default {
		name: 'stackedVerticalBar',
		props: ['data'],
		data() {
			return {
				boxId: 'basicLineMain' + Math.random(),
				levelList: ['1级', '2级', '3级'],
				levelIndex: 0,
				faultData: {},
				myChart: null,
				originalData: {},
				faultChekFlag: false,
				faultChekItem: {}
			}
		},
		methods: {
			VerticalEcharts(e, c, z, d) {
				if (z) this.originalData = JSON.parse(JSON.stringify(e));
				this.faultData = JSON.parse(JSON.stringify(c));
				console.log(this.originalData)
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
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							// Use axis to trigger tooltip
							type: '' // 'shadow' as default; can also be 'line' or 'shadow'
						},
						formatter: function(e) {
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
						right: '4%',
						bottom: '0%',
						top: '10%',
						containLabel: true
					},
					toolbox: {
						right: '2%',
						top: '-1%',
						show: true,
						feature: {
							saveAsImage: {
								title: '导出为jpg',
								backgroundColor: '#1b202f',
								type: 'jpg',
								icon: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAMxJREFUOE/dk00OgkAMhfuYhScxIXIARxcGLuHSlcfyBF4C4kLxABgSL6KLoaYEJiNk+Ik7Z9Wkr1+bNy3ox4eh+jQvU8knOkx8ujEANwCv7h8BYhxAi4DV0ZApxANFKqpgTsz07hra8yC7l1dm2hBQEHNUu9/EAN3idbh1f6QHuOTPlUF1tsWtGigUB/udXj4GAZLsQTzF9XC+BXEgL0Xq0O1sB5Ngysa5jVx9PUGal6Mb1wFY/Rdg7l0lOkQLkKOJZwIy2YnBW5gC/ADSKWgRqGkL5QAAAABJRU5ErkJggg==',
								emphasis: {
									iconStyle: {
										color: '#ffffff',
									}
								}
							},
							myTool: {
								show: true, //是否显示
								title: "导出为excel", //鼠标悬空的提示文字
								emphasis: {
									iconStyle: {
										color: '#ffffff',
									}
								},
								backgroundColor: '#1b202f',
								icon: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAMxJREFUOE/dk00OgkAMhfuYhScxIXIARxcGLuHSlcfyBF4C4kLxABgSL6KLoaYEJiNk+Ik7Z9Wkr1+bNy3ox4eh+jQvU8knOkx8ujEANwCv7h8BYhxAi4DV0ZApxANFKqpgTsz07hra8yC7l1dm2hBQEHNUu9/EAN3idbh1f6QHuOTPlUF1tsWtGigUB/udXj4GAZLsQTzF9XC+BXEgL0Xq0O1sB5Ngysa5jVx9PUGal6Mb1wFY/Rdg7l0lOkQLkKOJZwIy2YnBW5gC/ADSKWgRqGkL5QAAAABJRU5ErkJggg==',
								onclick: () => {
									console.log('11')
									this.exportFaultRankingEve()
								},
							},
						}
					},
					xAxis: {
						type: 'category',
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
						data: typeof e.xAxis.data == 'string' ? [e.xAxis.data] : e.xAxis.data,
						axisLabel: {
							show: true,
							rotate: e.xAxis.data.length >= 8 ? '45' : '0',
							textStyle: {
								color: "#bfc8d8", //更改坐标轴文字颜色
								fontSize: 12, //更改坐标轴文字大小

							}
						},
					},
					yAxis: {
						type: 'value',
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
				var fun = function(params) {
					var datavalue = 0;
					for (var i = 0; i < series.length; i++) {
						datavalue += Number(series[i].data[params.dataIndex])
					}
					return datavalue;
				}
				series[series.length - 1]["label"]["formatter"] = fun;
				this.myChart = this.$echarts.init(document.getElementById(this.boxId));

				this.myChart.off('legendselectchanged')
				this.myChart.on("legendselectchanged", (c) => {
					let ListData = {};
					ListData.xAxis = this.originalData.xAxis;
					ListData.series = this.originalData.series.filter(i => {
						return !!c.selected[i.name]
					})
					let result = this.$parent.filterVerData(ListData)
					result.series.forEach(i => {
						i.type = 'bar',
							i.stack = 'total',
							i.barWidth = 25,
							i.emphasis = {
								focus: 'series'
							},
							i.label = {
								show: true,
								position: 'top',
								fontSize: 16,
								color: 'rgb(215 215 215 / 0%)',
								formatter: function(params) {
									return params.value
								}
							}
					})
					var b = c.selected,
						d = [];
					for (var key in b) {
						if (b[key]) {
							for (var i = 0, l = result.series.length; i < l; i++) {
								var changename = result.series[i]["name"];
								if (changename == key) {
									d.push(i);
								}
							}
						}
					}
					var fun = function(params) {
						var datavalue = 0;
						for (var i = 0; i < d.length; i++) {
							for (var j = 0; j < result.series.length; j++) {
								if (d[i] == j) {
									datavalue += Number(result.series[j].data[params.dataIndex])
								}
							}
						}
						return datavalue
					}
					for (var i = 0; i < result.series.length; i++) {
						result.series[i]["label"]["show"] = false;
						result.series[i]["label"]["color"] = 'rgb(215 215 215 / 0%)';
					}
					for (var i = result.series.length - 1; i >= 0; i--) {
						var name = result.series[i]["name"];
						if (c["selected"][name]) {
							console.log(result.series[i])
							result.series[i]["label"] = {
								formatter: fun,
								show: true,
								color: '#fff',
								position: 'top',
								fontSize: 16
							}
							break;
						}
					}
					this.VerticalEcharts(result, this.faultData)
				});
				this.myChart.on("click", (c) => {
					this.faultChekItem = JSON.parse(JSON.stringify(this.$parent.searchData));
					this.faultChekItem.faultName = c.name;
					this.faultChekFlag = true;
					this.$parent.detailsRankingEveList(this.faultChekItem, 1)
				})
				this.myChart.setOption(option);
			},
			levelCheckEve(e) {
				this.levelIndex = e;
				this.faultData.faultLevel = e + 1;
				this.singleFaultEveList(this.faultData);
				this.myChart.dispose();
			},
			async singleFaultEveList(data) {
				try {
					var result = await dispatchServer.singleFaultRankingEve(data);
					result = this.$parent.filterVerData(result)
					result.series.forEach((i, index) => {
						i.type = 'bar',
							i.stack = 'total',
							i.barWidth = 25,
							i.emphasis = {
								focus: 'series'
							}
						i.label = {
							show: true,
							position: 'top',
							fontSize: 16,
							color: 'rgb(215 215 215 / 0%)',
							formatter: function(params) {
								return params.value
							}
						}
						if (index == result.series.length - 1) {
							i.label.position = 'top';
							i.label.color = '#fff';
						}
					})
					this.VerticalEcharts(result, data, 1)
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			async exportFaultRankingEve() {
				console.log(this.$parent.searchData)
				let datas = JSON.parse(JSON.stringify(this.$parent.searchData))
				datas.faultLevel = this.faultData.faultLevel;
				try {
					var result = await dispatchServer.exportFaultRankingEve(datas);
					let blob = new Blob([result], {
						type: 'application/vnd.ms-excel'
					});
					let oA = document.createElement('a');
					oA.href = URL.createObjectURL(blob);
					oA.download = '单故障排名';
					oA.click();
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			getArrayIndex(arr, obj) {
				var i = arr.length;
				while (i--) {
					if (arr[i] === obj) {
						return i;
					}
				}
				return -1;
			},
		},
		mounted() {
			// this.VerticalEcharts(this.data)
		}
	}
</script>

<style lang="scss" scoped>
	.boxBaseStyle {
		width: 99%;
		margin-top: 20px;
		position: relative;
	}

	.basicLineBox {
		width: 100%;
		height: 490px;
	}
</style>
