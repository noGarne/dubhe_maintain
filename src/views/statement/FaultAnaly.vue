<template>
	<!-- 故障分析 -->
	<div class="table_content">
		<div class="content_center content_tabs">
			<div class="reportTitle">
				<a>{{$t('route.faultAnaly')}}</a>
				<!-- <p><i class="iconfont icon-gaojingxinxi red"></i>注：最长支持0.5h时长的数据查询！</p> -->
			</div>
			<div class="btn_search">

				<!-- 卡车 -->
				<el-select clearable filterable multiple collapse-tags v-model="search.truckId"
					:placeholder="$t('action.select')+$t('action.truck')" @change="selectAllChange">

					<el-option label="全选" value="selectAll"
						:class="search.truckId.length == equipmentList.length ? 'selected' : ''"
						v-if="equipmentList.length > 0"></el-option>
					<el-option v-for="(item,index) in equipmentList" :key="index" :label="item.deviceName"
						:value="item.deviceName">
					</el-option>
				</el-select>
				<!-- 故障 -->
				<el-select clearable filterable v-model="search.fault"
					:placeholder="$t('action.select')+$t('dispatch.device-operation-trouble')">
					<el-option v-for="(item,index) in faultList" :key="index" :label="item" :value="item">
					</el-option>
				</el-select>
				<!-- 开始时间-结束时间 -->
				<el-date-picker v-model="search.start_time" :picker-options="option" type="datetime"
					:placeholder="$t('monitoring.start-time')" 
					prefix-icon="el-icon-date"
					@change="startTimeNoThirty"
					:range-separator="$t('devicesLog.to')" align="right">
				</el-date-picker>
				<el-date-picker v-model="search.end_time" :picker-options="option" type="datetime"
					:placeholder="$t('monitoring.end-time')"
					 prefix-icon="el-icon-date"
					 @change="endTimeNoThirty"
					:range-separator="$t('devicesLog.to')" align="right">
				</el-date-picker>

				<!-- 查询 -->
				<el-button type="primary" class="btnGray" @click="dataSearchEve">
					<i class="iconfont icon-sousuo themeOrangeColor"></i>
					{{$t('action.search')}}
				</el-button>
				<!-- 重置 -->
				<el-button type="primary" class="btnGray" @click="dataResizeEve">
					<i class="iconfont icon-zhongzhi themeOrangeColor"></i>
					{{$t('action.reset')}}
				</el-button>

			</div>
			<div class="chartsBox" ref="chartsBox"> 
				<div class="barChartsBox" v-if="faultRankModelFlag">
					<stacked-horizontal-bar ref="equipRank" :data="faultEquiBarData"></stacked-horizontal-bar>
					<stacked-horizontal-bar ref="modelRank" :data="faultModelBarData"></stacked-horizontal-bar>
				</div>
				<div class="barChartsBox" v-if="faultRankModelFlag">
					<efficienct-line ref="FaultTrendChart" :stackedLine="{title:'故障趋势图'}"
						:chartsXData="FaultTrendData.xdata" :chartsYtakeOverRate="FaultTrendData.ydata">
					</efficienct-line>
					<efficienct-line ref="FaultClassTrendChart" :stackedLine="{title:'故障模块趋势图'}"
						:chartsXData="FaultClassTrendData.xdata" :chartsYtakeOverRate="FaultClassTrendData.ydata">
					</efficienct-line>
				</div>
				<div class="barChartsBox" v-if="singleFaultFlag">
					<stacked-vertical-bar ref="singleFault" :data="faultRankData"></stacked-vertical-bar>
				</div>
				<div class="barChartsBox">
					<table-box :data="carTabTakeOverData" ref="detailRef" v-show="detailRankFlag"></table-box>
					<leaflet-map :data="hotData" ref="leafleatRefs" v-if="mapShowFlag"></leaflet-map>
					<!-- <table-box :data="carTabTakeOverDetal"></table-box> -->
				</div>
				<div class="barChartsBox" v-show="singleFaultFlag">
					<cartesian-box ref="cartesianBox" :stackedLine="{title:'重复故障次数'}"
						:chartsXData="FaultRepeatTime.xdata" :chartsYtakeOverRate="FaultRepeatTime.ydata"
						:chartsYtakeOverAvg="FaultRepeatTime.content"></cartesian-box>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import tableMixins from "@/common/mixins/table.mixins";
	import dispatchMixin from '@/common/mixins/dispatch.mixins.js';
	import dispatchServer from '../../api/dispatch.server';
	import lineCharts from '@/components/statement/lineCharts.vue';
	import stackedHorizontalBar from '@/components/statement/stackedHorizontalBar.vue';
	import stackedVerticalBar from '@/components/statement/stackedVerticalBar.vue';
	import cartesianBox from '@/components/statement/cartesianBox.vue';
	import tableBox from '@/components/statement/tableBox.vue'
	import leafletMap from '@/components/carControlIndex/leafletMap.vue';
	import efficienctLine from '@/components/statement/EfficienctLine.vue'
	export default {
		name: 'FaultAnaly',
		beforeRouteEnter(to, from, next) {
			localStorage.setItem('routerToParamsFlag',from.name == 'controlMonitor' ? 1 : 0)
			next()
		},
		mixins: [tableMixins, dispatchMixin],
		components: {
			lineCharts,
			stackedHorizontalBar,
			stackedVerticalBar,
			tableBox,
			leafletMap,
			efficienctLine,
			cartesianBox
		},
		data() {
			return {
				search: {
					truckId: [],
					fault: '',
					start_time: '',
					end_time: '',
					sortName: "start_time",
					sort: "DESC"
				},
				oldSeleValue: [],
				FaultTrendData: {
					xdata: [],
					ydata: []
				},
				FaultRepeatTime: {
					xdata: [],
					ydata: [],
					content: []
				},
				FaultClassTrendData: {
					xdata: [],
					ydata: []
				},
				hotData: {
					title: '故障位置',
					list: [],
					width: '48.5% !important',
					height: '685px !important',
					top: '20px',
					legendList: []
				},
				faultList: [],
				faultRankModelFlag: false,
				singleFaultFlag: false,
				detailRankFlag: false,
				mapShowFlag: false,
				carTabTakeOverData: {
					title: '故障详情',
					data: []
				},
				equipmentList: [],
				chartsFlag: false,
				faultEquiBarData: {
					title: '故障设备排名',
					color: ['#5470C6', '#FDDD60', '#91CC75', '#EE6666', '#7ad3ee']
				},
				faultModelBarData: {
					title: '故障模块排名',
					color: ['#5470C6', '#FDDD60', '#EE6666']
				},
				faultRankData: {
					title: '单故障排名',
					color: ['#5470C6', '#FDDD60', '#91CC75', '#58D9F9', '#DD79FF', '#ee3cb6', '#43e31f'],
				},
				pageInit: {
					pageSize: 15,
					pageIndex: 1,
					total: 0
				},
				searchData: {},
				faultTypeList: ['VCU', 'CCU', 'ICU', 'CGU'],
				faultLevelList: ['1级', '2级', '3级']


			}
		},
		watch: {
			subareaSn() {
				this.search = {
					truckId: [],
					fault: '',
					start_time: '',
					end_time: '',
					sortName: "start_time",
					sort: "DESC"
				}
				this.chartsFlag = false;
				this.equipmentList = [];
				this.getEquipmentList();
				this.faultNameFindEve();
				this.faultRankModelFlag = false;
				this.singleFaultFlag = false;
				this.detailRankFlag = false;
				this.mapShowFlag = false;
				this.$refs.detailRef.returnAllFlag = false;
			},
		},
		methods: {
			async dataSearchEve() {
				for (let x in this.search) {
					if (!this.search[x] || this.search[x].length == 0) {
						if (x == 'fault') continue;
						this.messages.error(`请选择${x=='truckId' ? '卡车' : (x=='start_time' ? '开始时间' : '结束时间')}`);
						return
					}
				}
				this.faultRankModelFlag = false;
				this.singleFaultFlag = false;
				this.detailRankFlag = false;
				this.mapShowFlag = false;
				this.$refs.detailRef.pageInit.pageSize = 15;
				this.$refs.detailRef.pageInit.pageIndex = 1;
				this.$refs.detailRef.returnAllFlag = false;
				try {
					this.searchData = {
						miningArea: this.subareaSn,
						deviceNameList: this.search.truckId.filter((c) => c !== "selectAll"),
						faultName: this.search.fault,
						startTime: this.utils.formatDate(this.search.start_time),
						endTime: this.utils.formatDate(this.search.end_time),
					}
					this.getEquipRankList(this.searchData);
					this.faultRankingEveList(this.searchData);
					this.singleFaultEveList(this.searchData);
					this.detailsRankingEveList(this.searchData);
					this.getFaultTrendChartEve(this.searchData);
					this.getFaultClassTrendChartEve(this.searchData);
					this.getFaultRepeatTimeChartEve(this.searchData)
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			routerParamsEve(){
				this.$nextTick(()=>{
					console.log(this)
				})
			},
			async getEquipRankList(data) {
				try {
					var result = await dispatchServer.faultFindEve(data);
					this.chartsFlag = true;
					if (result.xAxis.data.length == 0) {
						result = {
							xAxis: {
								data: this.search.truckId
							},
							series: []
						};
						this.faultTypeList.forEach(i => {
							result.series.push({
								name: i,
								data: new Array(this.search.truckId.length).fill(0),

							})
						})
					}
					let addNum = 0
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
							color: 'rgb(215 215 215 / 0%)',
							fontSize: 16,
							formatter: function(params) {
								return params.value
							}
						}
						if (index == result.series.length - 1) {
							i.label.position = 'right';
							i.label.color = '#fff';
						}

					})

					this.faultRankModelFlag = true;
					result && result.xAxis && this.$nextTick(() => {
						this.$refs.equipRank.HorizontalEcharts(result)
						// this.$refs.modelRank.HorizontalEcharts(result)
					})
				} catch (e) {
					this.messages.error(e.message)
				}
			},

			async faultRankingEveList(data) {
				try {
					var result = await dispatchServer.faultRankingEve(data);
					if (result.xAxis.data.length == 0) {
						result = {
							xAxis: {
								data: this.faultTypeList
							},
							series: []
						};
						this.faultLevelList.forEach(i => {
							result.series.push({
								name: i,
								data: new Array(this.faultTypeList.length).fill(0)
							})
						})
					}
					result.series.forEach((i, index) => {
						i.name = i.name.includes('级') ? i.name : i.name + '级',
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
						if (index == result.series.length - 1) {
							i.label.position = 'right';
							i.label.color = '#fff';
						}
					})
					this.faultRankModelFlag = true
					result && result.xAxis && this.$nextTick(() => {
						this.$refs.modelRank.HorizontalEcharts(result)
					})
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			async detailsRankingEveList(data = this.searchData, c) {
				for (let x in this.search) {
					if (!this.search[x] || this.search[x].length == 0) {
						if (x == 'fault') continue;
						this.messages.error(`请选择${x=='truckId' ? '卡车' : (x=='start_time' ? '开始时间' : '结束时间')}`);
						return
					}
				}
				let datas = JSON.parse(JSON.stringify(data));
				datas.pageSize = this.$refs.detailRef.pageInit.pageSize;
				datas.pageNum = this.$refs.detailRef.pageInit.pageIndex;
				datas.sort = this.search.sort;
				datas.sortName = this.search.sortName;
				try {
					var result = await dispatchServer.detailsRankingEve(datas);
					this.detailRankFlag = true;
					this.mapShowFlag = true;
					this.$nextTick(() => {
						this.$refs.leafleatRefs.setSpaceIconShow(true);
						this.$refs.leafleatRefs.setRoadShow(true);
					})
					if (c) this.$refs.detailRef.returnAllFlag = true;
					this.$refs.detailRef.tableCheckItem = null;
					this.carTabTakeOverData.data = result.data;
					this.$refs.detailRef.pageInit.total = result.count;
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			async singleFaultEveList(data) {
				try {

					let datas = JSON.parse(JSON.stringify(data))
					datas.faultLevel = 1;
					var result = await dispatchServer.singleFaultRankingEve(datas);
					result = this.filterVerData(result)
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
					this.singleFaultFlag = result && result.xAxis ? true : false;
					result && result.xAxis && this.$nextTick(() => {
						this.$refs.singleFault.VerticalEcharts(result, datas, 1)
					})
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			arrReduce(arr) {
				var obj = {};
				arr = arr.reduce(function(item, next) {
					obj[next.name] ? '' : obj[next.name] = true && item.push(next);
					return item;
				}, []);
				return arr
			},
			filterVerData(e) {
				let ls = {
					data: [],
					col: [],
					initData(data) {
						ls.data = [];
						ls.col = [];
						let t = true;
						data.xAxis.data = typeof data.xAxis == 'string' ? [data.xAxis.data] : data.xAxis.data;
						data.xAxis.data.forEach((im, ix) => {
							let item = {};
							item.name = im;
							data.series.forEach((jm, jx) => {
								item[jm.name] = jm.data[ix];
								if (t) ls.col.push(jm.name);
							})
							ls.data.push(item);
							t = false;
						})

					},
					getData(calcCol) {
						calcCol = !!calcCol && calcCol.length > 0 ? calcCol : ls.col;
						ls.data.forEach((im, ix) => {
							im.sortVal = 0;
							calcCol.forEach((jm, jx) => {
								im.sortVal += !!im[jm] ? Number(im[jm]) : 0;
							})
						})
						ls.data.sort((a, b) => b.sortVal - a.sortVal);
						let temp = {
							xAxis: {
								data: []
							},
							series: []
						}
						let t = true;
						calcCol.forEach((jm, jx) => {
							let d = {
								data: [],
								name: jm
							}
							ls.data.forEach((im, ix) => {
								// if(im.sortVal > 0){
								if (t) temp.xAxis.data.push(im.name);
								d.data.push(im[jm])
								// }
							})
							temp.series.push(d);
							t = false;
						})
						return temp;
					}
				}
				ls.initData(e);
				return ls.getData()
			},
			dataResizeEve() {
				this.search = {
					truckId: [],
					fault: '',
					start_time: '',
					end_time: '',
					sortName: "start_time",
					sort: "DESC"
				}
				this.faultRankModelFlag = false;
				this.singleFaultFlag = false;
				this.detailRankFlag = false;
				this.mapShowFlag = false;
				this.$refs.detailRef.returnAllFlag = false;
			},
			setStartEndList(e) {
				this.$refs.leafleatRefs.startEndList = e;
			},
			async getEquipmentList() {
				try {
					var data = {
						miningArea: this.subareaSn
					}
					var result = await dispatchServer.getTakeOverList(data);
					this.equipmentList = result || []
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			//故障趋势图
			async getFaultTrendChartEve(e) {
				try {
					var result = await dispatchServer.getFaultTrendChartEve(e);
					result.data.ydata.forEach(c => {
						c.type = 'line';
						c.symbolSize = 12;
						c.symbol = 'circle'
					})
					this.FaultTrendData = result.data;
					this.$nextTick(() => {
						this.$refs.FaultTrendChart.faultAnalyEcharts();
					})
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			//故障模块趋势图
			async getFaultClassTrendChartEve(e) {
				try {
					var result = await dispatchServer.getFaultClassTrendChartEve(e);
					result.data.ydata.forEach(c => {
						c.type = 'line';
						c.symbolSize = 8;
						c.symbol = 'circle';
					})
					this.FaultClassTrendData = result.data;
					this.$nextTick(() => {
						this.$refs.FaultClassTrendChart.faultAnalyEcharts();
					})
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			//故障重复次数图表
			async getFaultRepeatTimeChartEve(e = this.searchData) {
				let datas = JSON.parse(JSON.stringify(e));
				datas.sort = 'DESC';
				datas.sortName = 'start_time';
				datas.faultLevel = this.$refs.cartesianBox.levelIndex + 1;
				try {
					var result = await dispatchServer.getFaultRepeatTimeChartEve(datas);
					this.FaultRepeatTime = result.data;
					this.$nextTick(() => {
						this.$refs.cartesianBox.myEcharts()
					})
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			async faultNameFindEve() {
				try {
					var result = await dispatchServer.faultNameFindEve({});
					this.faultList = result || [];
				} catch (e) {
					this.messages.error(e.message)
				}
			},
		},
		mounted() {
			if (this.subareaSn) {
				this.getEquipmentList();
				this.faultNameFindEve();
				if(localStorage.getItem('routerToParamsFlag') == '1'){
					let params = JSON.parse(localStorage.getItem('routerToParams'));
					this.search.truckId = params.truckId;
					this.search.start_time = params.start_time;
					this.search.end_time =  params.end_time;
					this.dataSearchEve();
					// setTimeout(()=>{
					// 	this.$refs.chartsBox.scrollTo(0,1700);
					// },1000)
				}
			}
			if (JSON.stringify(this.$route.params) !== '{}') {
				this.search = this.$route.params
				this.dataSearchEve()
			}
		},
		computed: {
			allSeleValue() {
				return this.equipmentList.map(v => v.deviceName);
			}
		},

	}
</script>

<style lang="scss" scoped>
	.chartsBox {
		height: 100%;
		position: absolute;
		top: 115px;
		width: 99%;
		margin: 0 13px;
		border-radius: 3px;
		height: calc(100% - 130px);
		overflow-y: scroll !important;

		.barChartsBox {
			display: flex;
			justify-content: space-around;

			.boxBaseStyle {
				background: #1b202f;
			}

			&:first-child {
				padding-bottom: 20px;
			}
		}
	}
</style>
