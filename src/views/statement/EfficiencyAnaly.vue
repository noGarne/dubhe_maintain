<template>
	<!-- 效率分析 -->
	<div class="table_content">
		<div class="btn_search">
			<!-- 卡车 -->
			<el-select class="cartSelect" clearable filterable multiple v-model="search.truckId" collapse-tags
				:placeholder="$t('action.select')+$t('action.truck')" @change="selectAllChange">
				<el-option label="全选" value="selectAll" :class="search.truckId.length == equipmentList.length ? 'selected' : ''" v-if="equipmentList.length > 0"></el-option>
				<el-option v-for="(item,index) in equipmentList" :key="index.uniqueId" :label="item.deviceName"
					:value="item.uniqueId">
				</el-option>
			</el-select>
			<!-- 开始时间-结束时间  -->
			<el-date-picker v-model="search.start_time" :picker-options="option" type="date"
				:placeholder="$t('monitoring.start-time')" :range-separator="$t('devicesLog.to')" align="right"
				@change="startTimeNoThirty"
				></el-date-picker>
			<el-date-picker v-model="search.end_time" :picker-options="option" type="date"
				:placeholder="$t('monitoring.end-time')" :range-separator="$t('devicesLog.to')" align="right"
				@change="endTimeNoThirty"
				></el-date-picker>
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
		<div class="dataContent">
			<div class="numListBox">
				<show-cardata ref="showCardata" :tabCheckIndex="1"></show-cardata>
			</div>
			<div class="chartsBox">
				<div class="reportTitle noFlex">
					<a v-show="!drilingFlag">平均循环时间</a>
					<div v-show="drilingFlag && chartshowFlag">
						<a>{{checkCarName}}循环时间</a>
						<a @click="returnBarEve">返回上级</a>
					</div>
				</div>
				<bar-line-charts :stackedLine="{}" ref="chartsOne" v-show="!drilingFlag && chartshowFlag">
				</bar-line-charts>
				<Efficienct-line ref="EfficienctLine" :chartsXData="lineXdata" :chartsYtakeOverRate="lineYseries"
					v-if="drilingFlag && chartshowFlag" :stackedLine="{company:'循环时间(min)'}"></Efficienct-line>
			</div>
			<div class="chartsBox" v-if="drilingFlag && chartshowFlag">
				<div class="reportTitle flesBetween">
					<a>{{checkCarName}}行车时长</a>
					<!-- <i class="iconfont  icon-xiazai"></i> -->
					<div class="btn_search noPosition">
						<el-date-picker v-model="driverTimeValue" :picker-options="startEndoption" type="date"
							:placeholder="$t('monitoring.start-time')" :range-separator="$t('devicesLog.to')"
							align="right" @change="driverTimeChange(driverTimeValue,'driverTimeValue')">
						</el-date-picker>
					</div>
				</div>
				<Efficienct-line ref="driverTimeLine" :chartsXData="driverTimeXdata"
					:chartsYtakeOverRate="driverTimeYseries" :stackedLine="{company:'行车时长(s)'}"></Efficienct-line>
			</div>
			<div class="chartsBox" v-if="drilingFlag && chartshowFlag">
				<div class="reportTitle flesBetween">
					<a>{{checkCarName}}行车速度</a>
					<!-- <i class="iconfont  icon-xiazai"></i> -->
					<div class="btn_search noPosition">
						<el-date-picker v-model="driverSpeedValue" :picker-options="startEndoption" type="date"
							:placeholder="$t('monitoring.start-time')" :range-separator="$t('devicesLog.to')"
							align="right" @change="driverTimeChange(driverSpeedValue,'driverSpeedValue')">
						</el-date-picker>
					</div>
				</div>
				<Efficienct-line ref="driverSpeedLine" :chartsXData="driverSpeedXdata"
					:chartsYtakeOverRate="driverSpeedYseries" :stackedLine="{}"></Efficienct-line>
			</div>
			<div class="chartsBox">
				<div class="reportTitle">
					<a>{{dataDetail}}</a>
					<!-- <i class="iconfont  icon-xiazai"></i> -->
					<a v-if="detailData && detailData.length > 0">{{JSON.parse(JSON.stringify(search.start_time)).split(' ')[0]}}~{{JSON.parse(JSON.stringify(search.end_time)).split(' ')[0]}}</a>
				</div>
				<Efficiency-table :data="detailData" :title="dataDetail" ref="EfficiencyTable"></Efficiency-table>
			</div>
			<div class="chartsBox">
				<div class="reportTitle">
					<a>{{roadRunTime}}</a>
				</div>
				<Efficiency-table :data="roadRunTimeData" :title="roadRunTime" :roadList="roadList" ref="allHeadTable">
				</Efficiency-table>
			</div>
		</div>
	</div>
</template>

<script>
	import tableMixins from "@/common/mixins/table.mixins";
	import dispatchMixin from '@/common/mixins/dispatch.mixins.js';
	import dispatchServer from '../../api/dispatch.server';
	import showCardata from '@/views/dataScreening/sportsCardaily/components/showCardata.vue'
	import barLineCharts from '@/components/statement/barLineCharts.vue'
	import EfficiencyTable from '@/components/statement/EfficiencyTable.vue'
	import EfficienctLine from '@/components/statement/EfficienctLine.vue'
	export default {
		name: 'EfficiencyAnaly',
		mixins: [tableMixins, dispatchMixin],
		components: {
			showCardata,
			barLineCharts,
			EfficiencyTable,
			EfficienctLine
		},
		data() {
			return {
				equipmentList: [],
				oldSeleValue: [],
				search: {
					truckId: [],
					start_time: "",
					end_time: "",
				},
				drilingFlag: false,
				lineXdata: [],
				lineYseries: [],
				chartshowFlag: false,
				paramsObject: {},
				detailData: [],
				roadRunTimeData: {
					content: []
				},
				checkCarName: '',
				dataDetail: '数据明细',
				roadRunTime: '路段运行时长',
				driverTimeValue: '',
				driverSpeedValue: '',
				roadList: [],
				driverTimeXdata: [],
				driverTimeYseries: [],
				driverSpeedXdata: [],
				driverSpeedYseries: [],
				startEndoption: {
					disabledDate: (time) => {
						return time.getTime() < new Date(this.search.start_time) || time.getTime() > new Date(this
							.search.end_time);
					}
				},
			}
		},

		watch: {
			subareaSn() {
				this.getEquipmentList();
				this.dataResizeEve()
			},
		},
		methods: {
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
				for (let x in this.search) {
					if (this.search[x].length == 0 || !this.search[x]) {
						this.messages.error(`请选择${x=='truckId' ? '卡车' : (x=='start_time' ? '开始时间' : '结束时间')}`);
						return
					}
				}
				this.paramsObject = {
					startTime: this.search.start_time,
					endTime: this.search.end_time,
					miningArea: this.subareaSn,
					uniqueId: this.search.truckId.join()
				}
				this.chartshowFlag = true;
				this.drilingFlag = false;
				this.driverTimeValue = this.paramsObject.startTime.split(' ')[0];
				this.driverSpeedValue = this.paramsObject.startTime.split(' ')[0];
				this.$refs.EfficiencyTable.pageInit.pageSize = 15;
				this.$refs.EfficiencyTable.pageInit.pageIndex = 1;
				this.$refs.allHeadTable.pageInit.pageSize = 15;
				this.$refs.allHeadTable.pageInit.pageIndex = 1;
				this.efficiencyAnalysisTopEve(this.paramsObject);
				this.efficiencyAnalysisBarChartEve(this.paramsObject);
				this.detailsEffciencyEve(this.paramsObject);
				this.roadOperationTimeEve(this.paramsObject)
			},
			dataResizeEve() {
				this.search = {
					truckId: [],
					start_time: "",
					end_time: "",
				}
				for (let x in this.$refs.showCardata.efficiencyList) {
					this.$refs.showCardata.efficiencyList[x] = '-'
				}

				this.chartshowFlag = false;
				this.detailData = [];
				this.roadRunTimeData = [];
				this.roadList = [];
				this.$refs.EfficiencyTable.pageInit.pageSize = 15;
				this.$refs.EfficiencyTable.pageInit.pageIndex = 1;
				this.$refs.EfficiencyTable.pageInit.total = 0;
				this.$refs.allHeadTable.pageInit.total = 0;
				this.$refs.allHeadTable.pageInit.pageSize = 15;
				this.$refs.allHeadTable.pageInit.pageIndex = 1;
			},
			async efficiencyAnalysisTopEve(e) {
				try {
					var result = await dispatchServer.efficiencyAnalysisTopEve(e);
					this.$refs.showCardata.efficiencyList = result.data;
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			async efficiencyAnalysisBarChartEve(e) {
				try {
					var result = await dispatchServer.efficiencyAnalysisBarChartEve(e);
					let arr = [];
					this.$refs.chartsOne.defaultBar(result.data.chartsXData, [{
						name: "平均循环时间(min)",
						type: 'bar',
						barMaxWidth: 55,
						data: result.data.series[0].data
					}]);
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			async detailsEffciencyEve(e = this.paramsObject) {
				let params = JSON.parse(JSON.stringify(e))
				params.pageNum = this.$refs.EfficiencyTable.pageInit.pageIndex;
				params.pageSize = this.$refs.EfficiencyTable.pageInit.pageSize;
				try {
					var result = await dispatchServer.detailsEffciencyEve(params);
					this.detailData = result.content;
					this.$refs.EfficiencyTable.pageInit.total = result.totalElements;
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			async roadOperationTimeEve(e = this.paramsObject) {
				let params = JSON.parse(JSON.stringify(e))
				params.pageNum = this.$refs.allHeadTable.pageInit.pageIndex;
				params.pageSize = this.$refs.allHeadTable.pageInit.pageSize;
				this.roadRunTimeData = [];
				try {
					var result = await dispatchServer.roadOperationTimeEve(params);
					console.log(result)
					this.roadRunTimeData = result.data.page;
					if (this.roadRunTimeData.content[0].deviceName == '自动拉运平均时长') {
						this.roadRunTimeData.content[0].num = this.roadRunTimeData.content[0].deviceName;
					}
					this.roadList = result.data.title;
					this.$refs.allHeadTable.pageInit.total = result.data.page.totalElements;
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			async efficiencyAnalysisLineChartEve(e = this.paramsObject) {
				let params = JSON.parse(JSON.stringify(e))
				params.uniqueId = this.$refs.chartsOne.checkCar;
				try {
					var result = await dispatchServer.efficiencyAnalysisLineChartEve(params);
					result.data.ydata.forEach(c => {
						c.type = 'line';
						c.symbolSize = 8;
					})
					this.lineXdata = result.data.xdata;
					this.lineYseries = result.data.ydata;
					this.$nextTick(() => {
						this.$refs.EfficienctLine.myEcharts();
					})
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			async drivingTimeLineChartEve(e = this.paramsObject) {
				let params = JSON.parse(JSON.stringify(e))
				params.endTime = this.utils.formatDate(this.driverTimeValue).split(' ')[0];
				params.startTime = this.utils.formatDate(this.driverTimeValue).split(' ')[0];
				params.uniqueId = this.$refs.chartsOne.checkCar;
				try {
					var result = await dispatchServer.drivingTimeLineChartEve(params);
					result.data.yData.forEach(c => {
						c.type = 'line';
						c.symbolSize = 8;
					})
					this.driverTimeXdata = result.data.xData;
					result.data.yData.sort((a,b)=>{
						return a.name.split('')[1] - b.name.split('')[1];
					})
					this.driverTimeYseries = result.data.yData;
					this.$nextTick(() => {
						this.$refs.driverTimeLine.myEcharts();
					})
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			async drivingSpeedLineChartEve(e = this.paramsObject) {
				let params = JSON.parse(JSON.stringify(e))
				params.endTime = this.utils.formatDate(this.driverSpeedValue).split(' ')[0];
				params.startTime = this.utils.formatDate(this.driverSpeedValue).split(' ')[0];
				params.uniqueId = this.$refs.chartsOne.checkCar;

				try {
					var result = await dispatchServer.drivingSpeedLineChartEve(params);
					result.data.content.forEach(c => {
						c.type = 'line';
						c.symbol = 'circle';
						c.symbolSize = 4;
						
					})
					this.driverSpeedYseries = result.data.content;
					this.$nextTick(() => {
						this.$refs.driverSpeedLine.wheelCharts();
					})
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			driverTimeChange(e, c) {
				c == 'driverTimeValue' ? this.drivingTimeLineChartEve() : this.drivingSpeedLineChartEve();
			},
			returnBarEve() {
				this.drilingFlag = false;
				this.driverTimeValue = this.paramsObject.startTime;
			},
		},
		created() {
			if (this.subareaSn) {
				this.getEquipmentList();
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
	.table_content {
		padding: 0 0 20px 0 !important;

		.btn_search {
			position: inherit;
			// width: 100%;
			height: 50px;
			background: #252c3e;
			padding: 10px 20px;

			&.noPosition {
				position: inherit !important;
				top: 0;
				left: 0;
				display: inline;
				background: none;
			}
		}

		.dataContent {
			padding: 20px;
		}

		.chartsBox {
			margin-top: 20px;
			border: 1px solid #101012;

			.reportTitle {
				border-radius: 5px 5px 0 0;
				color: #878FA5;
				display: flex;

				// justify-content: space-between;
				i {
					padding-right: 20px;
					cursor: pointer;
				}

				&.noFlex {
					display: block;
					line-height: 41px;

					a {
						&:nth-child(2) {
							padding-left: 50px;
							cursor: pointer;
						}
					}
				}

				a {
					color: #bfc8d8;

					&:nth-child(2) {
						color: #878FA5;
						padding-left: 50px;
					}
				}

				&.flesBetween {
					justify-content: space-between;
					align-items: center;
				}
			}

			.boxBaseStyle {
				width: 100%;
				height: 460px !important;
				background-color: #252c3e;
				border-radius: 0 0 5px 5px;
				border: none;

				/deep/ .basicLineBox {
					width: 100% !important;
					height: 100% !important;
				}
			}
		}
	}
</style>
