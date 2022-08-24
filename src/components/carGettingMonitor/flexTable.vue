<template>
	<div class="boxBaseStyle" :style="{height:data.height}">
		<div class="tableHeader">
			{{data.title}}
			<div class="btn_search">
				<el-button @click="detailListEve"  :class="actualDataList[0].aqygycsStand == '-' ? 'button-disabled btnBg btn-add ' : 'btnBg btn-add '" v-if="data.title == '数据汇总'">
				汇总明细
				</el-button>
				<el-button @click="chartsBoxEve"  :class="actualDataList[0].aqygycsStand == '-' ? 'button-disabled btnBg btn-add ' : 'btnBg btn-add '" v-if="data.title == '数据汇总'">
				图表分析
				</el-button>
				<i class="iconfont icon-xiazai" v-if="data.title == '汇总明细' " @click="detailDown(data.title)"></i>
				<i class="iconfont icon-xiazai" v-if="data.title == '单车明细' " @click="detailDown(data.title)"></i>
			</div>
			
		
		</div>
		<div class="tableBox  hauling_track" v-if="data.title == '数据汇总'">
			<el-table ref="listTable" class="no_border table-column" :data="actualDataList" style="width: 100%" >
				<!-- 序号 -->
				<el-table-column
				  fixed
				  align="center"
				  prop="name"
				  show-overflow-tooltip
				  width="120">
				  <template slot="header" slot-scope="scope">
				    <div class="table_header_sprit">
				      <span class="header_load">指标名称</span>
				      <span class="header_unload">数据名称</span>
				      <b></b>
				    </div>
				  </template>
				  <template scope="scope">
				  	{{scope.$index == 0 ? '指标数据' : '实际数据'}}
				  </template>
				</el-table-column>
				<el-table-column property="aqygycsStand"  align="center" show-overflow-tooltip  label='安全员干预-停车次数'>
					<template scope="scope">
						<p :class="scope.$index !== 0 && (scope.row.aqygycsStand == '-' ? '' : (scope.row.aqygycsStand <= actualDataList[0].aqygycsStand ? 'satisfyStyle' : 'noSatisfyStyle'))">{{scope.row.aqygycsStand}}</p>
					</template>
				</el-table-column>
				<!-- 设备编号 -->
				<el-table-column property="aqyqdcsStand"  align="center" show-overflow-tooltip label='安全员干预-恢复行车次数' >
					<template scope="scope">
						<p :class="scope.$index !== 0 && (scope.row.aqyqdcsStand == '-' ? '' : (scope.row.aqyqdcsStand <= actualDataList[0].aqyqdcsStand ? 'satisfyStyle' : 'noSatisfyStyle'))">{{scope.row.aqyqdcsStand}}</p>
					</template>
				</el-table-column>
				<!-- 故障名称 -->
				<el-table-column property="jkygycsStand"  align="center" show-overflow-tooltip label='监控员干预-远程停车次数' >
					<template scope="scope">
						<p :class="scope.$index !== 0 && (scope.row.jkygycsStand == '-' ? '' : (scope.row.jkygycsStand <= actualDataList[0].jkygycsStand ? 'satisfyStyle' : 'noSatisfyStyle'))">{{scope.row.jkygycsStand}}</p>
					</template>
				</el-table-column>
				<el-table-column property="jkyqdcsStand"  align="center" show-overflow-tooltip label='监控员干预-恢复行车次数' >
					<template scope="scope">
						<p :class="scope.$index !== 0 && (scope.row.jkyqdcsStand == '-' ? '' : (scope.row.jkyqdcsStand <= actualDataList[0].jkyqdcsStand ? 'satisfyStyle' : 'noSatisfyStyle'))">{{scope.row.jkyqdcsStand}}</p>
					</template>
				</el-table-column>
				<el-table-column property="ycjgcsStand"  align="center" show-overflow-tooltip label='远程接管次数' >
					<template scope="scope">
						<p :class="scope.$index !== 0 && (scope.row.ycjgcsStand == '-' ? '' : (scope.row.ycjgcsStand <= actualDataList[0].ycjgcsStand ? 'satisfyStyle' : 'noSatisfyStyle'))">{{scope.row.ycjgcsStand}}</p>
					</template>
				</el-table-column>
				<el-table-column property="autoTimeStand"  align="center" show-overflow-tooltip label='测试总时长' >
					<template scope="scope">
						<p :class="scope.$index !== 0 && (scope.row.autoTimeStand == '-' ? '' : (scope.row.autoTimeStand >= actualDataList[0].autoTimeStand ? 'satisfyStyle' : 'noSatisfyStyle'))">{{scope.row.autoTimeStand}}</p>
					</template>
				</el-table-column>

			</el-table>
			</div>
			<div class="tableBox  hauling_track" v-if="data.title == '汇总明细'">
			<el-table ref="listTable" class="no_border table-column" :data="summaryDataList" style="width: 100%" 
			 :row-class-name="tableRowClassName"
			>
				<!-- 序号 -->
				<el-table-column
				  fixed
				  align="center"
				  prop="dataTime"
				  show-overflow-tooltip
				  width="120">
				  <template slot="header" slot-scope="scope">
				    <div class="table_header_sprit">
				      <span class="header_load">日期</span>
				      <span class="header_unload">指标名称</span>
				      <b></b>
				    </div>
				  </template>
				</el-table-column>
				<el-table-column property="autoTimes"  align="center" show-overflow-tooltip  label='测试时长' width="100">
				</el-table-column>
				<!-- 设备编号 -->
				<el-table-column property="autoTotalTimes"  align="center" show-overflow-tooltip label='测试总时长' width="110">
				</el-table-column>
				<!-- 故障名称 -->
				<el-table-column property="aqygyTimes"  align="center" show-overflow-tooltip label='安全员干预-停车次数' >
				</el-table-column>
				<el-table-column property="aqyqdTimes"  align="center" show-overflow-tooltip label='安全员干预-恢复行车次数' >
				</el-table-column>
				<el-table-column property="jkygyTimes"  align="center" show-overflow-tooltip label='监控员干预-远程停车次数' >
				</el-table-column>
				<el-table-column property="jkyqdTimes"  align="center" show-overflow-tooltip label='监控员干预-恢复行车次数' >
				</el-table-column>
				<el-table-column property="ycjgTimes"  align="center" show-overflow-tooltip label='远程接管次数' >
				</el-table-column>
			
			</el-table>
		</div>
			<div class="tableBox " v-if="data.title == '单车明细'">
			<el-table ref="listTable" class="no_border sortStyle" :data="carDataList" style="width: 100%"  @sort-change="changeSort">
				<!-- 序号 -->
				<el-table-column property="num" show-overflow-tooltip  label='序号' width="80" sortable>
				
				</el-table-column>
				<!-- 设备编号 -->
				<el-table-column property="deviceName"  label='设备编号' width="100" sortable>
				</el-table-column>
			
				<!-- 偏差原因 -->
				<el-table-column show-overflow-tooltip label='日期' :filter-multiple="false" property="dataTime"width="110" sortable>
			
				</el-table-column>
			
				<!-- 时长 -->
				<el-table-column property="autoTimes" show-overflow-tooltip label='测试时长'  sortable>
				</el-table-column>
				<!-- 开始时间 -->
				<el-table-column property="aqygyTimes" label='安全员干预-停车次数' width="160" sortable>
					<template scope="scope">
						<a class="clickStyle" @click="detailEve(scope.row,'AQYTC')">{{scope.row.aqygyTimes}}</a>
					</template>
				</el-table-column>
				<!-- 结束时间 -->
				<el-table-column property="aqyqdTimes" label='安全员干预-恢复行车次数' width="190" sortable>
					<template scope="scope">
						<a class="clickStyle" @click="detailEve(scope.row,'AQYQD')">{{scope.row.aqyqdTimes}}</a>
					</template>
				</el-table-column>
				<el-table-column property="jkygyTimes" label='监控员干预-远程停车次数' width="190" sortable>
					<template scope="scope">
						<a class="clickStyle" @click="detailEve(scope.row,'JKYTC')">{{scope.row.jkygyTimes}}</a>
					</template>
				</el-table-column>
				<el-table-column property="jkyqdTimes" label='监控员干预-恢复行车次数' width="190" sortable>
					<template scope="scope">
						<a class="clickStyle" @click="detailEve(scope.row,'JKYQD')">{{scope.row.jkyqdTimes}}</a>
					</template>
				</el-table-column>
				<el-table-column property="ycjgTimes" label='远程接管次数' width="120" sortable>
					<template scope="scope">
						<a class="clickStyle" @click="detailEve(scope.row,'YCJG')">{{scope.row.ycjgTimes}}</a>
					</template>
				</el-table-column>
			</el-table>
				<div class="pagination_location">
					<base-pagination :total="pageInit.total" :singleDisplay="pageInit.pageSize"
						:currentPage="pageInit.pageIndex" @pagechange="pagechange" @sizeChange="sizeChange">
					</base-pagination>
				</div>
			</div>
				<car-getting-detail ref="carGettingDetail" :title="detailTitle"></car-getting-detail>
	</div>
</template>

<script>
	import tableMixins from "@/common/mixins/table.mixins";
	import dispatchServer from '../../api/dispatch.server';
	import carGettingDetail from "./carGettingDetail.vue";
	import dispatchMixin from '@/common/mixins/dispatch.mixins.js';
	export default {
		name: 'tableBox',
		mixins: [tableMixins,dispatchMixin],
		components: {
		  carGettingDetail
		},
		props: ['data','actualDataList','summaryDataList','carDataList'],
		data() {
			return {
				pageInit: {
					pageSize: 15,
					pageIndex: 1,	
				},
				sort:{sort: "ASC",sortName: "num"},
				searchData:{},
				titleList:[
					{type:'AQYTC',name:'安全员干预停车'},
					{type:'AQYQD',name:'安全员恢复行车'},
					{type:'JKYTC',name:'监控员远程停车'},
					{type:'JKYQD',name:'监控员恢复行车'},
					{type:'YCJG',name:'远程接管次数'},
				],
				detailTitle:''
			}
		},
		methods: {
				chartsBoxEve(){
					this.$parent.$refs.chartsBox.openAddDialog()
				},
				detailListEve(){
					this.$parent.$refs.summDetailList.openAddDialog();
					this.$parent.$refs.summDetailList.typeCheck = 'AQYTC';
				},
				pagechange(page) {
					this.pageInit.pageIndex = page;
					this.$parent.$parent.$refs.leftContentBox.detailsOfDailyEve()
				},
				sizeChange(val) {
					this.pageInit.pageSize = val;
					this.$parent.$parent.$refs.leftContentBox.detailsOfDailyEve()
				},
				tableRowClassName({row, rowIndex}){
					if(!row.flag){
						 return 'noSatisfyStyle';
					}
					return '';
				},
				detailDown(e){
					if(this.$parent.$parent.actualDataList[0].aqygycsStand == '-') return;
					e == '汇总明细' ? this.$parent.$parent.$refs.leftContentBox.excelExportForCalendar() : this.$parent.$parent.$refs.leftContentBox.excelExportForEveryDayEachIndexCalendar();
				},
				changeSort(v){
					let res = this.utils.getConversion(v, v.prop);	
					this.sort = res;
					this.$parent.$parent.$refs.leftContentBox.detailsOfDailyEve()
				},
				detailEve(e,c){
					this.$refs.carGettingDetail.openAddDialog();
					this.searchData = {
						dataTime:e.dataTime,
						uniqueId:e.uniqueId,
						miningArea:this.subareaSn,
						type:c
					}
					this.detailTitle = this.titleList.find(z=> z.type == c).name;
					console.log(this.detailTitle)
					this.singleVehicleDetailsByClickEve(this.searchData);
				},
				async singleVehicleDetailsByClickEve(data = this.searchData) {
					let params = JSON.parse(JSON.stringify(data))
					params.pageNum = this.$refs.carGettingDetail.pageInit.pageIndex;
					params.pageSize = this.$refs.carGettingDetail.pageInit.pageSize;
					this.$refs.carGettingDetail.carDataList = [];
					try {
						var result = await dispatchServer.singleVehicleDetailsByClickEve(params);
						this.$refs.carGettingDetail.carDataList = result.content;
						this.$refs.carGettingDetail.pageInit.total = result.totalElements;
						this.$refs.carGettingDetail.pageInit.pageSize = result.size;
					} catch (e) {
						this.messages.error(e.message)
					}
				},
		},

	}
</script>

<style lang="scss" scoped>
	.boxBaseStyle {
		overflow: hidden;
		width: 100%;
		height: auto;
		border-radius: 5px;
		padding: 20px 0 0 0;
		background: none !important;
		border: none !important;
		position: relative;
		&:nth-child(3){
			// min-height: 210px !important;
		}
		&.fixedWdith{
			height: 460px !important;
		} 
		.no_border.el-table tr th{
			background: #1c2232 !important;
		}
		.tableHeader {
			color: #bfc8d8;
			font-size: 14px;
			.btn_search{
				position: inherit;
				display: inline-block;
				float: right;
				i{
					position: relative;
					right: 10px;
					top: 10px;
					cursor: pointer;
				}
			}
		}
		.tableBox {
			margin-top: 20px;
			height:auto !important;
			overflow-y: scroll;
			.el-table{
				height: 100% !important;
				.el-table__row{
					.satisfyStyle{
						color: #00C087;
					}
					.noSatisfyStyle{
						color: #FF3131;
						background: rgba(210,49,49,.2);
					}
					
				}
				
			}
			.clickStyle{
				color: #3C66ED;
				cursor: pointer;
				text-decoration:underline;
				font-size: 14px;
				text-align: center;
				// width: 50%;
				// display: block;
				// margin: 0 auto;
			}
			
		}
		.pagination_location{
			position: inherit !important; 
		}
	}
</style>
