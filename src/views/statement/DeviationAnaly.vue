<template>
	<!-- 故障分析 -->
	<div class="table_content">
			<div class="btn_search">
				<!-- 卡车 -->
				<el-select clearable filterable v-model="search.car"
					:placeholder="$t('action.select')+$t('action.truck')">
					<el-option v-for="(item,index) in equipmentList" :key="index" :label="item.deviceName"
						:value="item.deviceName">
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
			<div class="dataContent">
				<div class="taskoverListBox">
					<!-- 接管总时长(min) -->
					<div class="listItem" v-for="item in equipmentFrequencyList">
						<div class="iconBox">
							<i class="iconfont" :class="item.icon"></i>
						</div>
						<div class="numBox">
							<p>{{item.name}}
								<el-tooltip popper-class="tooltip" placement="top">
									<i class="iconfont icon-shuoming"></i>
									<div slot="content" class="tooltip-content">
										<div>{{item.tooltip}}</div>
									</div>
								</el-tooltip>
							</p>
							<p>{{deviationList[item.english] && item.english.includes("Rate") ? deviationList[item.english]+'%' :deviationList[item.english]  || 0}}
							</p>
						</div>
						<div class="cardata_right">
							<el-progress type="circle" :percentage="deviationList[item.english+'Rate']" :width="60" color="#00777B"
								:stroke-width="9">
							</el-progress>
						</div>
					</div>

				</div>
				
				<div  v-if="barListFlag && barListData.length > 0">
					<div class="reportTitle">
						<a>偏差信息</a>
					</div>
					<div class="barChartsBoxList">
					<div class="barItemStyle" v-for="(item,index) in barListData">
						<div class="echartsHeadTitle" v-if="index == 0">
							速度误差均方粗值
							   <a>{{item.series[0].avgValue}}</a>
						</div>	
						<div class="echartsHeadTitle" v-if="index == 1">
							行驶横向偏差均方粗值
							   <a>{{item.series[0].avgValue[speedErrorCheck].avgValue}}</a>
							   <div class="speedErrorList">
							   	<span v-for="(item,index) in speedErrorList" :class="speedErrorCheck == index ? 'checkStyle' : ''" @click="speedErrorCheck = index">{{item}}</span>
							   </div>
						</div>
						<bar-line-charts :ref="'bar'+index" :stackedLine="{}"></bar-line-charts>
					</div>	
					</div>
				</div>	
				<div class="barChartsBox">
					<div>
						<div class="reportTitle">
							<a>偏差详情</a>
						</div>
						<table-box :data="carTabTakeOverData" ref="detailRef"></table-box>
					</div>
					<div>
						<div class="reportTitle">
							<a>偏差位置</a>
						</div>
						<leaflet-map :data="hotData" :lateraldeviation="lateraldeviationList" ref="leafleatRefs"></leaflet-map>
					</div>
				</div>
			</div>
		<!-- </div> -->
	</div>
</template>

<script>
	import tableMixins from "@/common/mixins/table.mixins";
	import dispatchMixin from '@/common/mixins/dispatch.mixins.js';
	import dispatchServer from '../../api/dispatch.server';
	import barLineCharts from '@/components/statement/barLineCharts.vue'
	import tableBox from '@/components/statement/tableBox.vue'
	import leafletMap from '@/components/carControlIndex/leafletMap.vue';
	export default {
		name: 'DeviationAnaly',
		mixins: [tableMixins, dispatchMixin],
		components: {
			tableBox,
			leafletMap,
			barLineCharts
		},
		data() {
			return {
				search: {
					car: '',
					start_time: '',
					end_time: '',
					sortName: "start_time",
					sort: "DESC"
				},
				hotData: {
					title: '偏差位置',
					list: [],
					
					height: '685px !important',
					top: '20px',
					legendList: []
				},
				carTabTakeOverData: {
					title: '偏差详情',
					data: []
				},
				barListFlag:false,
				barListData:[],
				speedErrorList:['大于30','小于30','所有'],
				speedErrorCheck:0,
				equipmentFrequencyList: [
					{	
						name: '道路行驶横向偏差≥0.5时长',
						english: 'lateralDeviation',
						tooltip: '道路行驶过程中的横向偏差≥0.5的时间',
						icon: 'icon-a-xingzhuang549'
					},
					{
						name: '工作区停靠横向偏差≥0.5次数',
						english: 'lateralErrorOfDocking',
						tooltip: '工作区停靠时横向偏差≥0.5次数',
						icon: 'icon-a-duobianxing1kaobei-2'
					},
					{
						name: '工作区停靠纵向偏差≥0.3次数',
						english: 'dockingLongitudinalError',
						tooltip: '工作区停靠时纵向偏差≥0.3次数',
						icon: 'icon-a-duobianxing1kaobei'
					},
					{
						name: '工作区停靠航向偏差≥5°次数',
						english: 'dockingHeadingError',
						tooltip: '工作区停靠时航向偏差≥5°次数',
						icon: 'icon-a-xingzhuang1'
					},
				],
				equipmentList: [],
				lateraldeviationList:[],
				pageInit: {
					pageSize: 15,
					pageIndex: 1,
					total: 0
				},
				searchData: {},
				deviationList: []

			}
		},
		watch: {
			subareaSn() {
				this.dataResizeEve();
				this.getEquipmentList();
			},
		},
		methods: {
			dataSearchEve() {
				for (let x in this.search) {
					if (!this.search[x] || this.search[x].length == 0) {
						if (x == 'fault') continue;
						this.messages.error(`请选择${x=='car' ? '卡车' : (x=='start_time' ? '开始时间' : '结束时间')}`);
						return
					}
				}
				this.$refs.detailRef.pageInit.pageIndex = 1;
				this.$refs.detailRef.pageInit.pageSize = 15;
				this.barListFlag = true;
				this.setStartEndList([])
				this.searchData = {
					miningArea: this.subareaSn,
					deviceName: this.search.car,
					startTime: this.utils.formatDate(this.search.start_time),
					endTime: this.utils.formatDate(this.search.end_time),
				}
				this.GetDeviationFindEve(this.searchData);
				this.detailsRankingEveList(this.searchData);
				this.deviationAllChartEve(this.searchData);
			},
			dataResizeEve() {
				this.search = {
					car: '',
					start_time: '',
					end_time: '',
					sortName: "start_time",
					sort: "DESC"
				}
				this.deviationList = [];
				this.barListData = [];
				this.barListFlag = false;
				this.carTabTakeOverData.data = [];
				this.$refs.leafleatRefs.startEndList = [];
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
			// 偏差数字
			async GetDeviationFindEve(data) {
				try {
					var result = await dispatchServer.GetDeviationFind(data);
					this.deviationList = result;
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			// 偏差图表
			async deviationAllChartEve(data) {
				try {
					var result = await dispatchServer.deviationAllChartEve(data);
					this.barListData = result;
					setTimeout(()=>{
						result.forEach((c,index)=>{
							this.$refs['bar'+index][0].titleBarEcharts(c.chartsXData,c.series,c.title)
						})
					},300)
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			// 横向偏差
			async lateraldeviationEve(data) {
				try {
					var result = await dispatchServer.lateraldeviationEve(data);
					
					this.$refs.leafleatRefs.lateraldeviation = result.data.date;
					console.log(this.$refs.leafleatRefs.lateraldeviation)
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			// 偏差详情
			async detailsRankingEveList(e = this.searchData) {
				for (let x in this.search) {
					if (!this.search[x] || this.search[x].length == 0) {
						if (x == 'fault') continue;
						this.messages.error(`请选择${x=='car' ? '卡车' : (x=='start_time' ? '开始时间' : '结束时间')}`);
						return
					}
				}
				let data = JSON.parse(JSON.stringify(e))
				data.pageNum = this.$refs.detailRef.pageInit.pageIndex;
				data.sort = this.search.sort;
				data.sortName = this.search.sortName;
				data.pageSize = this.$refs.detailRef.pageInit.pageSize;
				try {
					var result = await dispatchServer.analysisDetails(data);
					this.$refs.detailRef.pageInit.total = result.count;
					this.carTabTakeOverData.data = result.data;
				} catch (e) {
					this.messages.error(e.message)
				}
			},
		},
		mounted() {
			if (this.subareaSn) {
				this.getEquipmentList();
				
				this.$nextTick(() => {
					this.$refs.leafleatRefs.setSpaceIconShow(true);
					this.$refs.leafleatRefs.setRoadShow(true);
					// this.lateraldeviationEve();
				})

			}
			if (JSON.stringify(this.$route.params) !== '{}') {
				this.search = this.$route.params;
				this.dataSearchEve()
			}
		},

	}
</script>

<style lang="scss" scoped>
	.table_content{
		padding: 0 !important;
		.reportTitle{
			border-radius: 5px 5px 0 0 ;
		}
	.content_center{
		background: #1b202f !important;
	}
	.btn_search{
		position: inherit !important;
		height: 50px;
		background: #252c3e;
		padding-left: 20px;
	}
	.dataContent{
		padding: 20px;
		.barChartsBox {
			display: flex;
			justify-content: space-between;
			align-items: center;
			// margin-left: 14px;
			&>div{
				width: 49.3%;
				/deep/ .boxBaseStyle{
						width: 100% !important;
						padding-top: 5px !important;
						border-radius: 0 0 5px 5px;
						border: none;
						&:last-child{
							padding-bottom: 5px;
							.mapContent{
								margin-top: 15px;
								border-radius: 5px !important;
							}
							.defaultBox{
								display: block !important;
								i{
									top: 30px;
								}
								p{
									display: none;
								}
							}
						}
						.tableHeader{
							display: none !important;
						}
					}
			}
			}
			.barChartsBoxList{
				display: flex;
				justify-content: space-around;
				align-items: center;
				background-color: #252C3E;
				flex-wrap: wrap;
				margin: 0 auto 20px 0px;
				padding: 22px 10px 0 10px;
				border-radius: 0 0 5px 5px;
				.barItemStyle{
					position: relative;
					width: 32%;
					height: 400px;
					margin-bottom: 20px;
					
					/deep/ .boxBaseStyle{
						width: 100% !important;
						height: 100% !important;
						background-color: #252C3E !important;
						.basicLineBox{
							width: 100% !important;
							height: 100% !important;
						}
					}
					.echartsHeadTitle{
						position: absolute;
						width: 90%;
						top: 12px;
						left: 30px;
						color: #BFC8D8;
						font-size: 14px;
						a{
							padding-left: 30px;
							font-size: 18px;
							font-family: Bebas Neue, Bebas Neue-Regular;
						}
						.speedErrorList{
							display: inline-block;
							position: absolute;
							right: 0px;
							width: 170px;
							top: -2px;
							display: flex;
							justify-content: space-around;
							align-items: center;
							span{
								border: 1px solid transparent;
								padding: 3px 6px;
								border-radius: 5px;
								font-size: 12px;
								cursor: pointer;
								z-index: 2000;
								&.checkStyle{
									border-color: #FF4600;
								}
							}
						}
					}
				}
			}
		// }
	}
	// .chartsBox {
	// 	height: 100%;
	// 	position: absolute;
	// 	top: 113px;
	// 	width: 99%;
	// 	margin: 0 15px 0 5px;
	// 	border-radius: 3px;
	// 	height: calc(100% - 130px);
	// 	overflow-y: scroll !important;

		
		
	// }

	.boxBaseStyle {
		margin-top: 0 !important;
		background-color: #252C3E;
		margin-bottom: 0 !important;
		/deep/ .mapContent{
			height: calc(100% - 30px) !important;
			margin-top: 30px;
		}
	}

	.taskoverListBox {
		flex-wrap: wrap;
		width: 100%;
		margin: 0 auto 0 0;

		.listItem {
			width: 49.35%;
			margin-bottom: 20px;
			background-color: #252C3E;
			border: none;
			display: flex;
			padding: 15px 10px 15px 20px;
			align-items: center;
			position: relative;
			p {
				&:nth-child(2) {
					color: #BFC8D8;
					padding: 11px 0 9px 11px;
					font-size: 25px;
					font-weight: 700;
					font-family: Bebas Neue, Bebas Neue-Regular;
				}
			}
			.iconBox {
				float: left;
				width: 70px;
				height: 70px;
				background: #1b202f;
				border-radius: 5px;
				margin-right: 20px;
				display: -webkit-box;
				display: -ms-flexbox;
				display: flex;
				-webkit-box-align: center;
				-ms-flex-align: center;
				align-items: center;
				-webkit-box-pack: center;
				-ms-flex-pack: center;
				justify-content: center;
				i{
					font-size: 35px;
					    color: #4a5370;
				}
			}
			.cardata_right{
				margin-left: 0 auto;
				position: absolute;
				right: 20px;
			}

		}
	}
	}
</style>
