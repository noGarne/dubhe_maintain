<template>
	<div>
		<div class="btn_search">
			<div class="timeRuleList reportListStyle">
				<span :class="reportCheckIndex == index ? 'checkStyle' : ''" v-for="(item,index) in reportList">
					{{item}}
				</span>
			</div>
			<!-- 日期 -->
			<!-- 永顺版本 -->
			<el-date-picker v-model="form.startTime" :picker-options="option" type="date"
				placeholder="选择时间" :range-separator="$t('devicesLog.to')" align="right"
				format="yyyy-MM-dd" value-format="yyyy-MM-dd">
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
		<div class="table_content">
			<div class="content_data">
				<show-cardata ref="showCardata" :tabCheckIndex="2"> </show-cardata>
			</div>
			<!-- 跑车运行图 -->
			<div class="content_center">
				<div class="timeRuleList" v-show="runCarFlag == 0">
					<span :class="timeRuleCheckIndex == index ? 'checkStyle' : ''" v-for="(item,index) in timeRuleList"
						@click="timeRuleListEve(index)">
						{{item}}
					</span>
				</div>
				<el-tabs v-model="runCarFlag" class="el-tabs--card">
					<el-tab-pane label="跑车运行图" name="0">
						<car-routemap ref="carRoutemap"></car-routemap>
					</el-tab-pane>
					<el-tab-pane label="跑车数据表格" name="1">
						<car-table-data ref="carTableData"></car-table-data>
					</el-tab-pane>
				</el-tabs>
			</div>
			<div class="content_center">
				<div class="reportTitle">
					<a>跑车明细</a>
				</div>
				<div class="box-table">
					<el-table :data="tableData" class="no_border task-table device-table sortStyle"
						@sort-change="changeSort">
						<el-table-column prop="deviceName" label="车辆" sortable width="90"></el-table-column>
						<el-table-column prop="attendanceTimes" label="出勤时长(h)"></el-table-column>
						<el-table-column prop="totalAttendance" label="运营时长(h)"></el-table-column>
						<el-table-column prop="autoTotalTime" label="自动驾驶时长(h)"></el-table-column>
						<el-table-column prop="haulTimes" label="自动驾驶趟次"></el-table-column>
						<el-table-column prop="faultTimes" label="故障次数"></el-table-column>
						<!-- 	<el-table-column prop="perceptualLimitationTimes" label="感知限停次数">
							     {{'-'}}
						</el-table-column> -->
						<el-table-column prop="takeoverTimes" label="接管次数" width="100"></el-table-column>
						<el-table-column prop="aqygyTimes" label="安全员干预-停车次数" width="150"></el-table-column>
						<el-table-column prop="aqyqdTimes" label="安全员干预-恢复行车次数" width="170"></el-table-column>
						<el-table-column prop="jkygyTimes" label="监控员干预-远程停车次数" width="170"></el-table-column>
						<el-table-column prop="jkyqdTimes" label="监控员干预-恢复行车次数" width="170"></el-table-column>
						<el-table-column prop="ycjgTimes" label="远程接管次数"></el-table-column>

					</el-table>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import tableMixins from "@/common/mixins/table.mixins";
	import dispatchMixin from '@/common/mixins/dispatch.mixins.js';
	import showCardata from './components/showCardata.vue';
	import CarRoutemap from './components/carRoutemap.vue';
	import carTableData from './components/carTableData.vue';
	import dispatchServer from '@/api/dispatch.server';

	export default {
		name: 'sportsCardaily',
		mixins: [tableMixins, dispatchMixin],
		components: {
			showCardata,
			CarRoutemap,
			carTableData
		},
		data() {
			return {
				form: {
					miningArea: '',
					startTime: ''
				},
				tableData: [],
				runCarFlag: 0,
				timeRuleCheckIndex: 1,
				reportCheckIndex: 0,
				timeRuleList: ['24h', '8h', '4h'],
				reportList: ['日报', '周报', '月报', '年报'],
			}
		},
		methods: {
			async dataSearchEve() {
				this.form.miningArea = this.subareaSn;
				if (!this.form.startTime) {
					this.messages.error('请选择时间')
					return
				}
				this.numListEve();
				this.getReportDetail();
				this.reportFormEve();
				this.scrollToEve(this.timeRuleCheckIndex);
				this.tableCheckEve();
			},
			async numListEve() {
				try {
					var result = await dispatchServer.findAllEce(this.form) || [];
					this.$refs.showCardata.numList = result[0]
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			async getReportDetail() {
				try {
					var result = await dispatchServer.getReportDetail(this.form) || [];
					this.tableData = result;
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			async reportFormEve() {
				if (!this.form.startTime) {
					this.messages.error('请选择时间')
					return
				}
				let data = JSON.parse(JSON.stringify(this.form))
				data.faultLevel = this.$refs.carRoutemap.checkList;
				try {
					var result = await dispatchServer.reportFormEve(data);
					result.forEach(i => {
						for (let x in i) {
							typeof i[x] == 'object' && i[x].forEach(c => {
								c.showFlag = false;
							})
							i['drivingModeList'].forEach(c => {
								c.color = this.$refs.carRoutemap.driverStatusList.find(z => z.name == c
									.title).color;
							})
							i['workTimes'].forEach(c => {
								c.color = this.$refs.carRoutemap.taskStatusList.find(z => z.name == c
									.title).color;
							})

						}
					})
					this.$refs.carRoutemap.deviceList = result;
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			timeRuleListEve(e) {
				this.$refs.carRoutemap.timeRuleEve(e);
			},
			async tableCheckEve() {
				this.$refs.carTableData.tableData = [];

				try {
					var result = await dispatchServer.sportDataTableEve({
						miningArea: this.subareaSn,
						startTime: this.form.startTime,
						faultLevel: this.$refs.carTableData.checkList
					});
					result.forEach(c => {
						c.countData = JSON.stringify(c.countData) ==
							'{"takeCaseDistinct":[],"takeCaseTimes":[],"failureCaseDistinct":[],"failureCaseTimes":[]}' ?
							[] : [c.countData]
					})
					result.forEach(c => {
						c.editFlag = false;
						c.checkAll = false;
						c.detailData.forEach(z => {
							z.takeOverEditFlag = new Array(z.takeoverTime.length).fill(false);
							z.takeOverRetainedReasonId = z.takeOverReasonId;
							z.takeoverRetainedRemark = JSON.parse(JSON.stringify(z.takeoverRemark));
						})
					})
					this.$refs.carTableData.tableData = result;
					console.log(result)
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			dataResizeEve() {
				this.form = {
					miningArea: this.subareaSn,
					startTime: '',
				};
				for (let x in this.$refs.showCardata.numList) {
					this.$refs.showCardata.numList[x] = ['numberOfVehicleRate','autoAndRunRate'].includes(x) ? 0 : '-'
				}
				this.$refs.carRoutemap.deviceList = [];
				this.tableData = [];
				this.$refs.carTableData.tableData = [];
			},
			scrollToEve(e = 1) {
				setTimeout(() => {
					var doms = document.getElementsByClassName('tableLabelContent')
					for (let i = 0; i < doms.length; i++) {
						doms[i].scrollTo(e == 1 ? 1770 : 3540, 0);
					}
				}, 600)
			},
			changeSort(v) {
				let res = this.utils.getConversion(v, v.prop);
			},
		},
		watch: {
			subareaSn() {
				this.dataResizeEve();
			},
		}
	}
</script>

<style lang="scss" scoped>
	.btn_search {
		width: 100%;
		height: 50px;
		background: #252c3e;
		padding: 10px 20px;
	}

	.timeRuleList {
		width: 180px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-right: 30px;
		font-size: 15px;
		font-weight: 700;
		color: #8E96AC;
		position: absolute;
		z-index: 100;
		right: 0;
		top: 3px;

		span {
			cursor: pointer;
			// padding-bottom: 5px;
			// padding-top: 8px;
			padding: 8px 5px 5px;
			line-height: 20px;
			border-bottom: 4px solid transparent;

			&.checkStyle {
				color: #FFFFFF;
				border-bottom: 4px solid #FF5900;
			}
		}
	}

	.reportListStyle {
		position: relative;
		width: 250px;
		top: 5px;
		height: 44px;

		span {
			padding-bottom: 8px;
		}
	}

	.content_center {
		margin-top: 20px;
	}

	.box-table {
		padding: 20px;
	}

	/deep/ .el-table .el-table__header-wrapper .has-gutter tr th {
		font-weight: normal;
		color: #BFC8D8 !important;
		background: #27355D !important;
		border-bottom: none;
	}
</style>
