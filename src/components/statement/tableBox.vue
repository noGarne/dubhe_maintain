<template>
	<div :class="data.title == '汇总明细' ? 'boxBaseStyle fixedWdith' : 'boxBaseStyle'" :style="{width:(data.title == '汇总明细' ? '100%' :'49.4%')}">
		<div class="tableHeader">
			{{data.title}}
			<a class="returnAllDetail" v-show="returnAllFlag" @click="returnAllDetailEve">返回全部故障详情</a>
			<i class="iconfont icon-xiazai" v-if="data.title == '故障详情' " @click="reportFaultEve"></i>
		</div>
		
		<div class="tableBox dafultStyle">
		
			<el-table ref="listTable" class="no_border sortStyle" :data="data.data" style="width: 100%"
				@cell-click="checkCellEve" :cell-class-name="tableCellClassName" :row-class-name="tableRowClassName"
				v-if="data.title == '故障详情'" @sort-change="changeSort">
				<!-- 序号 -->
				<el-table-column property="name" show-overflow-tooltip width="55" label='序号'>
					<template scope="scope">
						<div>
							{{scope.$index + 1}}
						</div>
					</template>
				</el-table-column>
				<!-- 设备编号 -->
				<el-table-column property="device_name" show-overflow-tooltip width="90" label='设备编号' sortable>
				</el-table-column>
				<!-- 故障名称 -->
				<el-table-column property="fault_name" label='故障名称' width="180">
				</el-table-column>
				<!-- 故障模块 -->
				<el-table-column show-overflow-tooltip sortable label='故障模块' :filter-multiple="false"
					 :column-key="'equStatus'" filter-placement="right-start" width="90">
						<template scope="scope">
							<div>
								{{scope.row.fault_class}}
								<i class="iconfont icon-icon-arrow-right2 themeOrangeColor" v-if="scope.row.fault_class == 'CCU'" @click="ToControlMonitor(scope.row)"></i>
							</div>
						</template>
				</el-table-column>
				<!-- 故障等级 -->
				<el-table-column show-overflow-tooltip sortable property="fault_level_autopilot" width="90"
					label='故障等级'>
					<template scope="scope">
						<div>
							{{scope.row.fault_level_autopilot + '级'}}
						</div>
					</template>
				</el-table-column>
				<!-- 时长 -->
				<el-table-column property="time" show-overflow-tooltip sortable label='时长(s)'>
				</el-table-column>
				<!-- 开始时间 -->
				<el-table-column property="start_time" label='开始时间' sortable width="190">
				</el-table-column>
				<!-- 结束时间 -->
				<el-table-column property="end_time" label='结束时间' sortable width="190">
				</el-table-column>
			</el-table>


			<el-table ref="listTable" class="no_border sortStyle" :data="data.data" style="width: 100%"
				@cell-click="checkCellEve" :cell-class-name="tableCellClassName" @sort-change="changeSort"
				:row-class-name="tableRowClassName" v-if="data.title == '偏差详情'">
				<!-- 序号 -->
				<el-table-column property="name" show-overflow-tooltip width="55" label='序号'>
					<template scope="scope">
						<div>
							{{scope.$index + 1}}
						</div>
					</template>
				</el-table-column>
				<!-- 设备编号 -->
				<el-table-column property="deviceName" width="75" label='设备编号'>
				</el-table-column>

				<!-- 偏差原因 -->
				<el-table-column show-overflow-tooltip label='偏差原因' :filter-multiple="false" property="resion"
					:column-key="'equStatus'" filter-placement="right-start">

				</el-table-column>

				<!-- 时长 -->
				<el-table-column property="duration" show-overflow-tooltip label='时长(s)' sortable width="80">
				</el-table-column>
				<!-- 开始时间 -->
				<el-table-column property="start_time" label='开始时间' width="190" sortable>
				</el-table-column>
				<!-- 结束时间 -->
				<el-table-column property="end_time" label='结束时间' width="193" sortable>
				</el-table-column>
			</el-table>

		
				<el-table ref="listTable" class="no_border sortStyle fixedTableHeight" :max-height="tableHeight"
					v-if="data.title == '汇总明细'"
					@sort-change="changeSort"
					:data="data.data" style="width: 100%">
					<!-- 序号 -->
					<el-table-column  property="id" label='序号' width="60">

					</el-table-column>
					<!-- 设备编号 -->
					<el-table-column property="deviceName" show-overflow-tooltip label='设备编号'>
					</el-table-column>
					<!-- 运行时长(h) -->
					<el-table-column property="runTime" label='运行总时长(h)'  width="120" sortable>
					</el-table-column>
					<!-- 自动驾驶时长(h) -->
					<el-table-column property="autoTime" label='自动驾驶总时长(h)'  width="145" sortable>
					</el-table-column>
					<!-- 自动驾驶趟次 -->
					<el-table-column property="wholeProcesTimes" label='自动驾驶趟次'  width="110" sortable>
					</el-table-column>
					<!-- 接管次数 -->
					<el-table-column property="numberOfTakeover" sortable  show-overflow-tooltip label='接管次数' width="90">
						<template scope="scope">
							<a class="clickStyle" @click="routerLinkEve(scope.row.uniqueId)">
								{{scope.row.numberOfTakeover}}
							</a>
						</template>
					</el-table-column>
					<!-- 故障次数 -->
					<el-table-column property="failCount" show-overflow-tooltip sortable  label='故障次数'  width="90" >
						<template scope="scope">
							<a class="clickStyle" @click="faultLinkEve(scope.row)">
								{{scope.row.failCount}}
							</a>
						</template>
					</el-table-column>
					<!-- 感知跟停次数 -->
					<el-table-column property="perceivedStop" show-overflow-tooltip  label='感知跟停次数' sortable width="110">
						<template scope="scope">
							<a class="">
								{{scope.row.perceivedStop}}
							</a>
						</template>
					</el-table-column>
					<!-- 道路行驶横向偏差≥0.5时长(s) -->
					<el-table-column property="lateraldeviationDuration" show-overflow-tooltip label='道路行驶横向偏差≥0.5时长(s)' width="220" sortable >
						<template scope="scope">
							<a class="clickStyle" @click="deviationLinkEve(scope.row)">
								{{scope.row.lateraldeviationDuration}}
							</a>
						</template>
					</el-table-column>
					<!-- 工作区停靠横向偏差≥0.5次数 -->
					<el-table-column property="horizontaldeviationTimes" show-overflow-tooltip label='工作区停靠横向偏差≥0.5次数'  width="220" sortable>
						<template scope="scope">
							<a class="clickStyle" @click="deviationLinkEve(scope.row)">
								{{scope.row.horizontaldeviationTimes}}
							</a>
						</template>
					</el-table-column>
					<!-- 工作区停靠纵向偏差≥0.3次数 -->
					<el-table-column property="longitudinaldeviationTimes" show-overflow-tooltip  label='工作区停靠纵向偏差≥0.3次数'  width="220" sortable>
						<template scope="scope">
							<a class="clickStyle" @click="deviationLinkEve(scope.row)">
								{{scope.row.longitudinaldeviationTimes}}
							</a>
						</template>
					</el-table-column> 
					<!-- 工作区停靠航向偏差≥5°次数 -->
					<el-table-column property="dockingheadingdeviationTimes" show-overflow-tooltip  label='工作区停靠航向偏差≥5°次数'  width="210" sortable>
						<template scope="scope">
							<a class="clickStyle" @click="deviationLinkEve(scope.row)">
								{{scope.row.dockingheadingdeviationTimes}}
							</a>
						</template>
					</el-table-column> 
					
					<!-- 平均单趟自动驾驶跑车时长(min) -->
					<el-table-column property="avgDriverTime" label='平均单趟自动驾驶跑车时长(min)'  width="250" sortable>
					</el-table-column>
				</el-table>
		</div>
		<div class="pageList">
			<base-pagination :total="pageInit.total" :singleDisplay="pageInit.pageSize"
				:currentPage="pageInit.pageIndex" @pagechange="pagechange" @sizeChange="sizeChange">
			</base-pagination>
		</div>
	</div>
</template>

<script>
	import tableMixins from "@/common/mixins/table.mixins";
	import dispatchServer from '../../api/dispatch.server';
	export default {
		name: 'tableBox',
		mixins: [tableMixins],
		props: ['data'],
		data() {
			return {
				list: [],
				pageInit: {
					pageSize: 15,
					pageIndex: 1,
					total: 0
				},
				detailList: [],
				searchData: {},
				tableCheckItem: null,
				returnAllFlag:false
			}
		},
		methods: {
			pagechange(page) {
				this.pageInit.pageIndex = page;
				this.$parent.detailsRankingEveList();
				this.tableCheckItem = null;
				this.$nextTick(() => { 
					this.$parent.setStartEndList([])
				})
			},
			changeSort(v) {
				let res = this.utils.getConversion(v, v.prop);
				this.$parent.search.sortName = res.sortName;
				this.$parent.search.sort = res.sort;
				this.$parent.detailsRankingEveList();
			},
			async reportFaultEve(){
				let params = this.$parent.$refs.singleFault.faultChekFlag ? this.$parent.$refs.singleFault.faultChekItem : this.$parent.searchData;
				let datas = JSON.parse(JSON.stringify(params));
				datas.pageSize = this.$parent.$refs.detailRef.pageInit.pageSize;
				datas.pageNum = this.$parent.$refs.detailRef.pageInit.pageIndex;
				datas.sort = this.$parent.search.sort;
				datas.sortName = this.$parent.search.sortName;
				try {
					var result = await dispatchServer.exportFaultAnalysicDetailEve(datas) || [];
					let blob=new Blob([result], {type:'application/vnd.ms-excel'});
					let oA=document.createElement('a');
					oA.href=URL.createObjectURL(blob);
					oA.download='故障详情';
					oA.click();
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			ToControlMonitor(e){
				let {start_time,end_time,unique_id} = e;
				start_time = this.utils.formatDate(new Date(start_time).getTime()-300000)
				this.$router.push({name:'controlMonitor',params: {
					start_time,
					end_time:e.time > 1200 ? this.utils.formatDate(new Date(start_time).getTime() + 1200000) : end_time,
					unique_id
				}})
				let str = {
					truckId:this.$parent.search.truckId,
					start_time: this.$parent.search.start_time,
					end_time: this.$parent.search.end_time,
				}
				localStorage.setItem('routerToParams',JSON.stringify(str))
			},
			faultLinkEve(e){
				this.$router.push({name:'FaultAnaly',params: {
					car: [e.deviceName],
					fault: '',
					start_time: e.workDate + ' 00:00:00',
					end_time:e.workDate + ' 23:59:59',
					sortName: "start_time",
					sort: "DESC"
					
				}})
			},
			returnAllDetailEve(){
				this.returnAllFlag = false;
				this.$parent.$refs.singleFault.faultChekFlag = false;
				this.$parent.$refs.detailRef.pageInit.pageIndex = 1;
				this.$parent.detailsRankingEveList();
			},
			deviationLinkEve(e){
				this.$router.push({name:'DeviationAnaly',params: {
					car: e.deviceName,
					start_time: e.workDate + ' 00:00:00',
					end_time:e.workDate + ' 23:59:59',
					sortName: "start_time",
					sort: "DESC"
				}})
			},
			sizeChange(val) {
				this.pageInit.pageSize = val;
				this.$parent.detailsRankingEveList()
			},
			//把每一行的索引加到行数据中
			tableRowClassName({row,rowIndex}) {
				row.index = rowIndex;
				if (rowIndex == this.tableCheckItem) {
					return 'warning-row';
				}
			},
			//把每一列的索引加到列数据中
			tableCellClassName({column,columnIndex}) {
				column.index = columnIndex
			},
			checkCellEve(row, column, cell, event) {
				this.tableCheckItem = row.index;
				let latLngList = [{
						name: 'start',
						latLng: [row.start_longitude, row.start_latitude]
					},
					{
						name: 'end',
						latLng: [row.end_longitude, row.end_latitude]
					}
				]
				if (this.data.title == '偏差详情') {
					latLngList.forEach(i => {
						i.latLng.reverse()
					})
				}
				this.$parent.setStartEndList(latLngList)
			},
			routerLinkEve(e){
				this.$parent.routerLinkEve([e])
			}

		},
	

	}
</script>

<style lang="scss" scoped>
	.boxBaseStyle {
		overflow: hidden;
		width: 49.3%;
		height: 685px;
		background: #252c3e;
		border: 1px solid #101012;
		border-radius: 5px;
		padding: 20px;
		margin: 20px 0 20px 0;
		position: relative;
		&.fixedWdith{
			height: 460px !important;
		} 
		.tableHeader {
			color: #bfc8d8;
			font-size: 14px;
			i{
				float: right;
				padding-right: 10px;
				cursor: pointer;
			}
			.returnAllDetail{
				cursor: pointer;
				margin: 0 40px;
			}
		}
		.tableBox {
			margin-top: 15px;
			height: 580px !important;
			overflow-y: scroll;
			.el-table {
				max-height: 580px !important;
				.el-table__body-wrapper {
					max-height: 555px !important;
					overflow: scroll !important;
				}
				tr td {
					height: 30px !important;
					.iconfont {
						font-size: 12px;
						position: relative;
						top: -2px;
						cursor: pointer;
					}
				}
				.clickStyle{
					color: #3C66ED;
					cursor: pointer;
					text-decoration:underline;
					font-size: 14px;
				}
				&.fixedTableHeight{
					height: 360px !important;
				}
			}

			
		}
		.pageList {
			position: absolute;
			bottom: 3px;
			left: 50%;
			transform: translate(-50%);
		}
	}
</style>
