<template>
	<!-- 接管分析 -->
	<div class="table_content">
		<div class="content_center content_tabs">
			<div class="reportTitle">
				<a>{{$t('route.statement-data')}}</a>
				<!-- <p><i class="iconfont icon-gaojingxinxi red"></i>注：最长支持0.5h时长的数据查询！</p> -->
			</div>
			<div class="btn_search">
				<el-date-picker v-model="search.start_time" value-format="yyyy-MM-dd" :picker-options=" option"
					type="date" :placeholder="$t('common.time-select')" align="right">
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
			<div class="chartsBox">
				<div class="taskoverListBox">
					<div class="listItem">
						<p>运行车辆
						<el-tooltip popper-class="tooltip" placement="top">
							<i class="iconfont icon-shuoming"></i>
							<div slot="content" class="tooltip-content">
								<div>在选择日期内矿区运行的车辆总数</div>
							</div>
						</el-tooltip>
						</p>
						<p>{{dataList.numberOfVehicle || 0}}</p>
					</div>
					<div class="listItem">
						<p>总运行时长(h)
							<el-tooltip popper-class="tooltip" placement="top">
								<i class="iconfont icon-shuoming"></i>
								<div slot="content" class="tooltip-content">
									<div>在选择日期内矿区所有车辆运行时长的总和</div>
								</div>
							</el-tooltip>
						</p>
						<p>{{dataList.runTime ||0}}</p>
					</div>
					<div class="listItem" @click="routerLinkEve([])">
						<p>接管次数
							<el-tooltip popper-class="tooltip" placement="top">
								<i class="iconfont icon-shuoming"></i>
								<div slot="content" class="tooltip-content">
									<div>在选择日期内矿区所有运行车辆接管次数的总和</div>
								</div>
							</el-tooltip>
						</p>
						<p>{{dataList.numberOfTakeover || 0}}</p>
					</div>
					<div class="listItem listItemSec">
						<p>故障次数
							<el-tooltip popper-class="tooltip" placement="top">
								<i class="iconfont icon-shuoming"></i>
								<div slot="content" class="tooltip-content">
									<div>在选择日期内矿区所有运行车辆故障次数的总和</div>
								</div>
							</el-tooltip>
						</p>
						<p>{{(dataList.icuFailure + dataList.ccuFailure + dataList.cguFailure + dataList.vcuFailure) || 0}}</p>
					</div>
					<div class="listItemSec listItem">
						<p>总自动驾驶时长(h)
							<el-tooltip popper-class="tooltip" placement="top">
								<i class="iconfont icon-shuoming"></i>
								<div slot="content" class="tooltip-content">
									<div>在选择日期内矿区所有运行车辆自动驾驶时长的总和</div>
								</div>
							</el-tooltip>
						</p>
						<p>{{dataList.autoTime || 0}}</p>
					</div>
					<div class="listItemSec listItem">
						<p>自动驾驶跑车趟次
							<el-tooltip popper-class="tooltip" placement="top">
								<i class="iconfont icon-shuoming"></i>
								<div slot="content" class="tooltip-content">
									<div>在选择日期内矿区所有运行车辆全自动驾驶跑车趟次的总和</div>
								</div>
							</el-tooltip>
						</p>
						<p>{{dataList.wholeProcesTimes || 0}}</p>
					</div>
					<!-- <div class="listItemSec listItem">
						<p>平均单趟自动驾驶跑车时长(min)
							<el-tooltip popper-class="tooltip" placement="top">
								<i class="iconfont icon-shuoming"></i>
								<div slot="content" class="tooltip-content">
									<div>在选择日期内矿区所有运行车辆全自动驾驶跑车总时长/在选择日期内矿区所有运行车辆全自动驾驶跑车趟次的总和</div>
								</div>
							</el-tooltip>
						</p>
						<p>{{dataList.autoTime && (dataList.autoTime/dataList.wholeProcesTimes*60).toFixed(2) || 0}}</p>
					</div> -->
				</div>
			
					
			
				<div class="barChartsBox">
					<!-- <AttendanceCharts
					:stackedLine="carAttendanceDetal"
					:chartsXData="chartsXData"
					ref="chartsTwo"
					:chartsLegend="chartsLegend"
					></AttendanceCharts> -->
					<table-box :data="carTabTakeOverData" ref="detailRef"></table-box>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import tableMixins from "@/common/mixins/table.mixins";
	import dispatchMixin from '@/common/mixins/dispatch.mixins.js';
	import dispatchSetServer from '../../api/dispatchSet.server';
	import tableBox from '@/components/statement/tableBox.vue'
	import dispatchServer from '../../api/dispatch.server';
	import AttendanceCharts from "../../components/statement/gateCharts.vue";
	export default {
		name: 'DataSummary',
		mixins: [tableMixins, dispatchMixin],
		components: {
			tableBox,
			AttendanceCharts
		},
		data() {
			return {
				equipmentList: [],
				carAttendanceDetal: {
				  title: "汇总分析",
				},
				list: [],
				currentTab: '0',
				pageInit: {
					pageSize: 15,
					pageIndex: 1
				},
				carTabTakeOverData: {
					title: '汇总明细',
					data: []
				},
				truckName: '',
				equStatus: null,
				sortData: {
					sort: "",
					sortName: ""
				},
				search: {
					sortName: "id",
					start_time: "",
					end_time: "",
					truckId: [],
					sort: "DESC"
				},
				dataList:{},
				chartsLegend: ["出勤时长", "自动驾驶运行时长", "接管时长"],
				chartsXData: {},

			}
		},
		created() {
			
		},
		watch: {
			subareaSn() {
				this.search = {
					sortName: "id",
					start_time: "",
					end_time: "",
					truckId: [],
					sort: "DESC"
				};
				this.pageInit.pageIndex = 1;
				this.equipmentList = [];
				this.carTabTakeOverData.data = [];
				// this.getList();
				// this.getEquipmentList();
				this.dataList = {};
			},
		},
		methods: {
			async getList() {
				try {
					var data = {
						workDate: this.search.start_time,
						miningArea:this.subareaSn
					}
					var result = await dispatchServer.getOnelevelEve(data);
					
					this.dataList = result[0] || [];
					console.log(this.dataList)
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			async detailsRankingEveList() {
				try {
					var data = {
						workDate: this.search.start_time,
						miningArea:this.subareaSn,
						sort:this.search.sort,
						sortName:this.search.sortName,
						...this.pageInit
					}
					var result = await dispatchServer.getTwolevelEve(data);
					this.carTabTakeOverData.data = result;
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			dataResizeEve() {
				this.search.start_time = '';
				this.dataList = {};
				this.carTabTakeOverData.data = [];
			},
			routerLinkEve(e){
				if(!this.search.start_time) return;
				this.$router.push({name:'RunReport',params: {
					sortName: "id",
					start_time: this.search.start_time + ' 00:00:00',
					end_time: this.search.start_time + ' 23:59:59',
					truckId:e,
					sort: "DESC"
				}})
			},
			changeSort(v) {
			 	let res = this.utils.getConversion(v, v.prop);
				this.search.sort = res.sort;
				this.search.sortName = res.sortName;
				this.getList();
			},
			filterChange(filters) {
				this.pageInit.pageIndex = 1;
				if (filters.hasOwnProperty('equStatus')) {
					this.equStatus = filters.equStatus[0];
				}
				this.getList();
			},
			dataSearchEve() {
				if(!this.search.start_time) {
					this.messages.error('请选择时间')
					return
				}
				this.getList();
				this.detailsRankingEveList()
			},
		}
	}
</script>

<style lang="scss" scoped>
	.chartsBox {
		position: absolute;
		top: 113px;
		width: 99%;
		border-radius: 3px;
		height: calc(100% - 105px);
		overflow-y: scroll !important;
	}

	.btn_search {
		position: inherit;
		top: 20px;
	}

	.list_scrollbar_page {
		margin: 40px 0px 0 0px;
	}

	.el-table {
		width: 99% !important;
		.cell {
			padding: 20px !important;
		}
		thead {
			.icon-shuoming {
				font-size: 12px !important;
				margin-left: 3px;
				transform: scale(0.9);
			}

		}

		th div {
			padding-left: 0 !important;
		}
	}

	.cartSelect {
		.el-input {
			width: 250px !important;
		}
	}

	.list_scrollbar_page {
		position: inherit;
		top: 0;
	}

	.table_content {
		.defalutStyle {
			position: absolute;
			top: 20px !important;
			left: 0px !important;
			z-index: 1;
		}

		.barChartsBox {
			margin: 0 0 0 20px;
		}

		.taskoverListBox {
			margin: 0px 0px 0 20px;
			flex-wrap: wrap;

			.listItem {
				width: 32.5%;
			}

			.listItemSec {
				margin-top: 20px;
				// width: 32.4%;
			}
		}

		.statusStyle {
			width: 67px;
			height: 24px;
			border-radius: 3px;
			line-height: 24px;
			text-align: center;
			font-size: 12px;
		}

		.blueStyle {
			background: rgba(70, 114, 255, .2);
			color: #4672ff;
			font-weight: 400;
		}

		.greenStyle {
			background: rgba(1, 200, 113, .2);
			color: #01c871;
			font-weight: 400;
		}

		.redStyle {
			background: rgba(255, 69, 69, .2);
			color: #ff4545;
			font-weight: 400;
		}

		.orangeStyle {
			background: rgba(255, 89, 0, .2);
			color: #ff5900;
			font-weight: 400;
		}

		.yellowStyle {
			background: rgba(255, 186, 0, .2);
			color: #ffba00;
			font-weight: 400;
		}
	}
</style>
