<template>
	<div class="boxBaseStyle">

		<div id="chartsOne" class="basicLineBox"></div>
	</div>
</template>

<script>
	export default {
		name: 'pieCharts',
		props:['data'],
		data() {
			return {
				boxId: 'basicLineMain' + Math.random(),

			}
		},
		methods: {
			myEcharts(e,c) {
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
					    trigger: 'item',
						formatter: function(e) {
							return `<div>${e.name}</div>
									<div>数量:${e.value}</div>
									<div>占比:${e.data.rateResult}</div>
									</div>
									`
						}
					  },
					  legend: {
					    orient: 'horizontal',
					    x: 'center',
						icon:'circle',
						textStyle:{
						      fontSize: 12,
						      color:'#BFC8D8',
							  
						 }
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
					  color:e,
					  series: [
					    {
					      type: 'pie',
					      radius: '65%',
					      data: c,
					      emphasis: {
					        itemStyle: {
					          shadowBlur: 10,
					          shadowOffsetX: 0,
					          shadowColor: 'rgba(0, 0, 0, 0.5)'
					        }
					      }
					    }
					  ]
				}
				var myChart = this.$echarts.init(document.getElementById('chartsOne'));
				myChart.setOption(option);

			}
		},
		mounted() {
			this.myEcharts()
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
