<template>
	<!-- 添加用户 -->
	<div class="edit_digger conditionAdd">
		<base-dialog ref="baseDialog" title="图表分析" :width="'1400px'" @closeDialog="closeDialog" :buttonShow="false">
			<div class="chartsBox">
				<bar-line-charts v-for="(item,index) in barsDataList" :ref="'barDefaultDom'+index"></bar-line-charts>

			</div>
		</base-dialog>
	</div>
</template>

<script>
	import dispatchServer from '../../api/dispatch.server';
	import barLineCharts from '../statement/barLineCharts.vue'
	export default {
		name: 'chartsBox',
		components: {
			barLineCharts
		},
		data() {
			return {
				barsDataList: [{
						title: '每日跑车时长(h)',
						legend: ['时长(h)', '最低基准线', '最高基准线'],
						chartsXData: ['111', '222', '333', '444'],
						series: [{
								name: '时长(h)',
								type: 'bar',
								barMaxWidth: 25,
								data: ['111', '222', '333', '444']
							},
							{
								name: '最低基准线',
								type: 'line',
								symbol: 'circle',
								symbolSize: 1,
								data: ['33', '33', '33', '33']
							},
							{
								name: '最高基准线',
								type: 'line',
								symbol: 'circle',
								symbolSize: 1,
								data: ['200', '200', '200', '200']
							}
						]
					},
					{
						title: '安全员干预停车次数',
						legend: ['安全员干预停车次数'],
						chartsXData: ['111', '222', '333', '444'],
						series: [{
							name: '安全员干预停车次数',
							type: 'bar',
							barMaxWidth: 25,
							data: ['111', '222', '333', '444']
						}]
					},
					{
						title: '安全员干预恢复行车次数',
						legend: ['安全员干预恢复行车次数'],
						chartsXData: ['111', '222', '333', '444'],
						series: [{
							name: '安全员干预恢复行车次数',
							type: 'bar',
							barMaxWidth: 25,
							data: ['111', '222', '333', '444']
						}]
					},
					{
						title: '监控员干预远程停车次数',
						legend: ['监控员干预远程停车次数'],
						chartsXData: ['111', '222', '333', '444'],
						series: [{
							name: '监控员干预远程停车次数',
							type: 'bar',
							barMaxWidth: 25,
							data: ['111', '222', '333', '444']
						}]
					},
					{
						title: '监控员干预恢复行车次数',
						legend: ['监控员干预恢复行车次数'],
						chartsXData: ['111', '222', '333', '444'],
						series: [{
							name: '监控员干预恢复行车次数',
							type: 'bar',
							barMaxWidth: 25,
							data: ['111', '222', '333', '444']
						}]
					},
					{
						title: '远程接管次数',
						legend: ['远程接管次数'],
						chartsXData: ['111', '222', '333', '444'],
						series: [{
							name: '远程接管次数',
							type: 'bar',
							barMaxWidth: 25,
							data: ['111', '222', '333', '444']
						}]
					},
				]
			}
		},
		methods: {
			closeDialog() {

			},
			openCloseD() {
				this.$refs.baseDialog.toggleDialog();
				this.allChartEve()
			},
			openAddDialog(data) {
				this.openCloseD();
			},
			async allChartEve() {
				try {
					var result = await dispatchServer.allChartEve(this.$parent.$parent.$refs.leftContentBox.searchArr);
					this.barsDataList = result || [];
					this.$nextTick(() => {
						this.barsDataList.forEach((item, index) => {
							item.series.forEach(i => {
								i.itemStyle = {
									normal: {
										label: {
											show: true,
											position: 'top',
											formatter: function(params) {
												if (params.seriesType == 'bar' &&
													params.value > 0) {
													return params.value
												} else if (params.seriesType ==
													'line' && params.dataIndex == 0) {
													return params.value
												} else {return ''}
											},
											textStyle: {
												color: '#ffffff',
												fontSize: 14
											}
										}
									}
								}
							})
							this.$refs['barDefaultDom' + index][0].defaultEcharts(item)
						})
					})
				} catch (e) {
					this.messages.error(e.message)
				}
			},
		},
		mounted() {

		}
	}
</script>


<style lang="scss" scoped>
	.chartsBox {
		padding: 20px 15px 20px 20px;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;

		.boxBaseStyle {
			margin-top: 20px;

			&:nth-child(1),
			&:nth-child(2) {
				margin-top: 0 !important;
			}
		}
	}
</style>
