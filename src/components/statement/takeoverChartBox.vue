<template>
	<!-- 审核/编辑系统 -->
	<div class=" table_content">
		<div class="content_center content_tabs">
			<div class="reportTitle">
				<a>{{$t('route.statement-all')}}</a>
				<p><i class="iconfont icon-gaojingxinxi red"></i>注：现阶段接管率只分析按照正常流程产生的接管数据，异常流程产生的接管数据不包含在内！</p>
			</div>
		<div class="paddingLR">
			<div class="btn_search">
				<!-- 卡车 -->
				<el-select clearable filterable multiple v-model="search.truckId" collapse-tags
					:placeholder="$t('action.select')+$t('action.truck')" @change="selectAllChange">
					<!-- <el-select clearable filterable multiple v-model="search.truckId" collapse-tags
						:placeholder="$t('action.select')+$t('action.truck')"> -->
					<el-option label="全选" value="selectAll" :class="search.truckId.length == equipmentList.length ? 'selected' : ''" v-if="equipmentList.length > 0"></el-option>
					<el-option v-for="(item,index) in equipmentList" :key="index" :label="item.deviceName"
						:value="item.uniqueId">
					</el-option>
				</el-select>
				<!-- 开始时间-结束时间  -->
				<el-date-picker v-model="search.start_time" type="datetime" @change="startTimeChange"
					:picker-options="option" :placeholder="$t('monitoring.start-time')"
					prefix-icon="el-icon-date"
					:range-separator="$t('devicesLog.to')" align="right"></el-date-picker>
				<el-date-picker v-model="search.end_time" type="datetime" :picker-options="option"
					:placeholder="$t('monitoring.end-time')" @change="endTimeChange"
					prefix-icon="el-icon-date"
					:range-separator="$t('devicesLog.to')" align="right"></el-date-picker>
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
					<!-- 接管总时长(min) -->
					<div class="listItem">
						<p>{{$t('device.taskover-time')}}
							<el-tooltip popper-class="tooltip" placement="top">
								<i class="iconfont icon-shuoming"></i>
								<div slot="content" class="tooltip-content">
									<div>车辆接管时长总和</div>
								</div>
							</el-tooltip>
						</p>
						<p>{{chartsData.takeOverTimeSum || 0}}</p>
					</div>
					<!-- 接管总次数 -->
					<div class="listItem">
						<p>{{$t('device.taskover-num')}}
							<el-tooltip popper-class="tooltip" placement="top">
								<i class="iconfont icon-shuoming"></i>
								<div slot="content" class="tooltip-content">
									<div>车辆接管次数总和</div>
								</div>
							</el-tooltip>
						</p>
						<p>{{chartsData.takeOverCountSum || 0}}</p>
					</div>
					<!-- 单车平均接管时长(min) -->
					<div class="listItem">
						<p>平均无接管时长(h)
							<el-tooltip popper-class="tooltip" placement="top">
								<i class="iconfont icon-shuoming"></i>
								<div slot="content" class="tooltip-content">
									<div>MTTF,（用户选择时间范围内的运行总时长-用户选择时间范围内的接管总时长）/接管次数</div>
								</div>
							</el-tooltip>
						</p>
						<p>{{chartsData.autoTimeAvgFloat&&(chartsData.autoTimeAvgFloat).toFixed(2) || 0}}</p>
					</div>

					<!-- 单车平均接管次数 -->
					<div class="listItem">
						<p>平均接管时长(min)
							<el-tooltip popper-class="tooltip" placement="top">
								<i class="iconfont icon-shuoming"></i>
								<div slot="content" class="tooltip-content">
									<div>MTTR, 接管总时长/接管总次数</div>
								</div>
							</el-tooltip>
						</p>
						<p>{{chartsData.takeOverAvgSingle || 0}}</p>
					</div>
					<!-- 平均单次接管时长 -->
					<div class="listItem">
						<p>平均接管间隔(h)
							<el-tooltip popper-class="tooltip" placement="top">
								<i class="iconfont icon-shuoming"></i>
								<div slot="content" class="tooltip-content">
									<div>MTBF, 用户选择时间范围内的运行总时长/接管次数</div>
								</div>
							</el-tooltip>
						</p>
						<p>{{chartsData.autoIntervalAvg && (chartsData.autoIntervalAvg).toFixed(2) || 0}}</p>
					</div>
				</div>

				<div class="chartsListBox">
					<bars-line-charts :stackedLine="carTakeOverDetal" :chartsXData="chartsXData" ref="chartsTwo"
						:chartsYtakeOverAvg="chartsYtakeOverAvg" :chartsYtakeOverCount="chartsYtakeOverCount"
						:chartsLegend="chartsLegend" :chartsYtakeOverTimeSingle="chartsYtakeOverTimeSingle">
					</bars-line-charts>
					<bar-line-charts :stackedLine="carTakeOverData" :chartsXData="faultListData" ref="chartsOne"
						:chartsYtakeOverAvg="faultYdata">
					</bar-line-charts>

				</div>
				<div class="linesBox">
					<line-charts ref="lines" :data="linesData" :defaultXdata="defaultXdata" :defaultYdata="defaultYdata" :defaultLegend="defaultLegend"></line-charts>

				</div>
			</div>
		</div>
		</div>
	</div>
</template>

<script>
	import tableMixins from "@/common/mixins/table.mixins";
	import dispatchMixin from '@/common/mixins/dispatch.mixins.js';
	import lineCharts from '@/components/statement/lineCharts.vue';
	import dispatchServer from '../../api/dispatch.server';
	import barLineCharts from './barLineCharts.vue';
	import barsLineCharts from './barsLineCharts.vue';
	export default {
		name: 'takeoverChartBox',
		mixins: [tableMixins, dispatchMixin],
		components: {
			barLineCharts,
			barsLineCharts,
			lineCharts,
		},
		data() {
			return {
				search: {
					end_time: this.getYesterEve() + ' 23:59:59',
					start_time: this.getYesterEve() + ' 00:00:00', 
					truckId: "",
					sort: "DESC",
					sortName: "id",
				},
				equipmentList: [],
				option: {
					disabledDate: (time) => {
						return time.getTime() > Date.now()
					}
				},
				linesData: {
					title: "接管趋势图",
					height: "550"
				},
				chartsData: {},
				oldSeleValue: [],
				chartsLegend: ['接管率(h/次)', '自动驾驶时长(h)', '接管次数(次)'],
				chartsXData: [],
				chartsYtakeOverAvg: [],
				faultListData: [],
				faultYdata: [],
				chartsYtakeOverCount: [],
				chartsYtakeOverTimeSingle: [],
				carTakeOverData: {
					title: '接管原因'
				},
				carTakeOverDetal: {
					title: '接管分析'
				},
				defaultXdata:[],
				defaultYdata:[],
				defaultLegend:[],
			}
		},
		mounted() {
			this.subareaSn && JSON.stringify(this.$route.params) == '{}' && this.$nextTick(() => {
				this.getData();
				this.getEquipmentList();
			}) 

		},
		watch: {
			subareaSn() {
				this.search = {
					end_time: this.getYesterEve() + ' 23:59:59',
					start_time: this.getYesterEve() + ' 00:00:00',
					truckId: [],
					sort: "DESC",
					sortName: "id",
				}
				this.getData();
				this.getEquipmentList();
			},
		},
		methods: {
			closeDialog() {
				this.search = {
					end_time: '',
					start_time: '',
					truckId: [],
					sort: "DESC",
					sortName: "id",
				};
			},
			endTimeChange(v) {
				if (!v) return;
				if (!this.search.start_time) {
					this.search.end_time = this.utils.formatDate(v)
					return
				}
				if (v <= new Date(this.search.start_time)) {
					this.messages.error('结束时间需大于开始时间');
					this.search.end_time = '';
					return false;
				} else {
					this.search.end_time = this.utils.formatDate(v)
				}
			},
			startTimeChange(v) {
				if (!v) return;
				if (!this.search.end_time) {
					this.search.start_time = this.utils.formatDate(v)
					return
				}
				if (v >= new Date(this.search.end_time)) {
					this.messages.error('结束时间需大于开始时间');
					this.search.start_time = '';
					return false;
				} else {
					this.search.start_time = this.utils.formatDate(v)
				}
			},
			openCloseD() {
				this.$refs.baseDialog.toggleDialog();
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
			dataSearchEve() {
				this.getData();
			},
			dataResizeEve() {
				this.closeDialog();
			},
			async getData() {
				let chartsXData = [];
				let chartsYtakeOverAvg = [];
				let chartsYtakeOverCount = [];
				let chartsYtakeOverTimeSingle = [];
				var data = {
					startTimeStr: this.search.start_time ? this.search.start_time : '',
					endTimeStr: this.search.end_time ? this.search.end_time : '',
					miningArea: this.$store.state.subareaSn,
					uniqueId: this.search.truckId.filter(c=> c !== 'selectAll'),
				}
				var result = await dispatchServer.calculationEve(data);
				this.getfindReasonFault(data);
				this.linesDataEve(data)
				this.chartsData = result || [];
				this.chartsData.avgForGraph.forEach(i => {
					chartsXData.push(i.deviceName);
					chartsYtakeOverAvg.push((i.takeOverRate / 60).toFixed(2));
					chartsYtakeOverCount.push(i.takeOverCount);
					chartsYtakeOverTimeSingle.push((i.autoTimes / 60).toFixed(2));
				})
				this.chartsXData = chartsXData;
				this.chartsYtakeOverAvg = chartsYtakeOverAvg;
				this.chartsYtakeOverCount = chartsYtakeOverCount;
				this.chartsYtakeOverTimeSingle = chartsYtakeOverTimeSingle;
				console.log(this.chartsXData)
				this.$nextTick(()=>{
					this.$refs.chartsTwo.myEcharts();
				})
			},
			
			async getfindReasonFault(data) {
				let faultListData = [];
				let faultYdata = [];
				var result = await dispatchServer.findReasonFaultCountEve(data);
				result.forEach(i => {
					faultListData.push(i.reasonName);
					faultYdata.push(i.reasonCount)
				})
				this.faultListData = faultListData;
				this.faultYdata = faultYdata;
				this.$nextTick(()=>{
					this.$refs.chartsOne.myEcharts();
				})
			},
			async linesDataEve(data) {
				this.defaultXdata = [];
				this.defaultYdata = [];
				this.defaultLegend = [];
				var result = await dispatchServer.findNozzleTrendChartEve(data) || [];
				let legendList = [];
				result.data.forEach(i => {
					this.defaultLegend.push(i.name)
					i.type = 'line';
					i.symbol = 'circle';
					i.symbolSize = 7;
				})
				this.defaultXdata = result.times;
				this.defaultYdata = result.data;
				this.$nextTick(()=>{
					this.$refs.lines.defaultStyle()
				})
			}

		},
		computed: {
			allSeleValue() {
				return this.equipmentList.map(v => v.uniqueId);
			}
		},
	}
</script>


<style lang="scss" scoped>
	.paddingLR {
		padding: 4px 20px 0 20px;

		.btn_search {
			top: 60px;
			left: 20px;
			z-index: 1;
		}

		.chartsListBox {
			width: 100%;
			height: 610px;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.boxBaseStyle {
				width: 49.3%;
			}

		}
	}

	.chartsBox {
		height: 100%;
		position: absolute;
		top: 114px;
		width: 98%;
		border-radius: 3px;
		height: calc(100% - 110px);
		overflow-y: scroll !important;

		.taskoverListBox {
			margin-top: 0 !important;
		}

	}
</style>
