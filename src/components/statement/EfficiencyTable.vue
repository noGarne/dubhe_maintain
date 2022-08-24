<template>
	<div class="tableColor">
		<div class="tableBox dafultStyle" v-if="title == '数据明细'">
			<el-table ref="listTable" class="no_border"
			 :data="data"
			  style="width: 100%"
			   @sort-change="changeSort"
				>
				<!-- 序号 -->
				<el-table-column property="num" show-overflow-tooltip  label='序号'>
					
				</el-table-column>
				<!-- 设备编号 -->
				<el-table-column property="deviceName"  label='设备编号'>
				</el-table-column>
			
				<!-- 开始时间 -->
				<el-table-column property="startTime" label='开始时间' >
				</el-table-column>
				<!-- 结束时间 -->
				<el-table-column property="endTime" label='结束时间' >
				</el-table-column>
				<el-table-column property="runTime" label='运行时间(min)' >
				</el-table-column>
				<el-table-column property="haveryRunTime" label='重运时间(min)' >
				</el-table-column>
				<el-table-column property="unloadTime" label='卸载时间(min)' >
				</el-table-column>
				<el-table-column property="emptyTime" label='空运时间(min)' >
				</el-table-column>
				<el-table-column property="loadTime" label='装载时间(min)' >
				</el-table-column>
			</el-table>
			  
		</div>
		
		<div class="tableBox dafultStyle"  v-if="title == '路段运行时长'">
			<el-table ref="listTable" class="no_border  noBorderTableStyle"
			    :data="data.content"
				 :span-method="arraySpanMethod"
				 :row-class-name="tableRowClassName"
			    >
			    <!-- 序号 -->
			    <el-table-column property="num" show-overflow-tooltip  label='序号' width="50">
			     
			    </el-table-column>
			    <!-- 设备编号 -->
			    <el-table-column property="deviceName"  label='设备编号'  width="120">
			    </el-table-column>
			
			    <!-- 开始时间 -->
			    <el-table-column property="startTime" label='开始时间' width="160">
			    </el-table-column>
			    <!-- 结束时间 -->
			    <el-table-column property="endTime" label='结束时间'   width="160">
			    </el-table-column>
			    <el-table-column property="runTime" >
			     <template slot="header" slot-scope="scope">
			      <div>
			       <p class="headerStyle">运行时间</p>
			       <p class="headerStyle">min</p>
			      </div>
			     </template>
			    </el-table-column>
			    <el-table-column property="cc" class="listStyle"  v-for="(item,index) in roadList">
					 <el-table-column property="unloadTime" label='行驶'   width="70">
						 <template slot="header" slot-scope="scope">
						  <div class="headerStyle">
						 行驶
						  </div>
						 </template>
						 <template scope="scope">
						  <div class="headerStyle">
						  {{scope.row.laneTypeRunList[index]}}
						  </div>
						 </template>
					 </el-table-column>
					 <el-table-column property="unloadTime" label='停车'  width="70">
						 <template slot="header" slot-scope="scope">
						  <div class="headerStyle">
						 停车
						  </div>
						 </template>
						 <template scope="scope">
						  <div class="headerStyle">
						  {{scope.row.laneTypeRunList[index]}}
						  </div>
						 </template>
					 </el-table-column>
						 <template slot="header" slot-scope="scope">
						  <div class="headerStyle">
						  {{item}}
						  </div>
						 </template>
						
			    </el-table-column>
				
				<el-table-column property="unloadingTime">
					<template slot="header" slot-scope="scope">
					 <div>
					  <p class="headerStyle">卸载区时间</p>
					  <p class="headerStyle">min</p>
					 </div>
					</template>
				</el-table-column>
				<el-table-column property="loadingTime"  >
				<template slot="header" slot-scope="scope">
				 <div>
					  <p class="headerStyle">装载区时间</p>
					  <p class="headerStyle">min</p>
				 </div>
				</template>
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
		name: 'EfficiencyTable',
		mixins: [tableMixins, ],
		props: ['data','title','roadList'],
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
			}
		},
		methods: {
			pagechange(page) {
				this.pageInit.pageIndex = page;
				console.log(this.title)
				this.title == '数据明细' ? this.$parent.detailsEffciencyEve() : this.$parent.roadOperationTimeEve();
			},
			changeSort(v) {
				let res = this.utils.getConversion(v, v.prop);
				this.$parent.search.sortName = res.sortName;
				this.$parent.search.sort = res.sort;
				this.title == '数据明细' ? this.$parent.detailsEffciencyEve() : this.$parent.roadOperationTimeEve();
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
			arraySpanMethod({ row, column, rowIndex, columnIndex }) {
			        if (rowIndex === 0 && this.pageInit.pageIndex == 1) {
			          if (columnIndex === 0) {
			            return [1, 4];
			          }else if ([1,2,3].includes(columnIndex)) {
						return [0, 0];
					}
			        }
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
				this.title == '数据明细' ? this.$parent.detailsEffciencyEve() : this.$parent.roadOperationTimeEve();
			},
			//把每一行的索引加到行数据中
			tableRowClassName({row,rowIndex}) {
				row.index = rowIndex;
				if (rowIndex == 0 && this.pageInit.pageIndex == 1) {
					return 'averageStyle';
				}
			},
			routerLinkEve(e){
				this.$parent.routerLinkEve([e])
			}

		},

	}
</script>

<style lang="scss" scoped>
	.tableColor{
		background-color: #252C3E;
		
	}
		.tableHeader {
			color: #bfc8d8;
			font-size: 14px;
		}
		/deep/ .el-table__body-wrapper{
			height: auto !important;
		}
		.tableBox {
			overflow-y: scroll;	
			padding: 20px 15px 20px 20px;
			.noBorderTableStyle{
					border: none;
					border-right:1px solid #000000 !important;
					.headerStyle{
						width: 100%;
						text-align: center;
					}
					/deep/ .cell{
						width: 100% !important;
						height: 100%;
						border-right: 1px solid #000000;
						justify-content: center;
						border-bottom: 1px solid #000000;
						text-align: center;
						line-height: 35px;
					}
				/deep/ table{
					width: 100% !important;
					border-top: 1px solid #000000;
					border-left:1px solid #000000;
					border-bottom: none;
					thead{
						border-bottom: none !important;
					}
					tr{
						&:nth-child(2n){
							background-color: #252c3e !important;
						}
						
						&:first-child{
								.cell{
									padding-left: 10px !important;
								}
						}
						td{
							&:first-child{
									.cell{
										padding-left: 10px !important;
									}
							}
						}
					}
					.averageStyle{
						background-color: #1b202f !important;
					}
				}
			}
		}

	
</style>
