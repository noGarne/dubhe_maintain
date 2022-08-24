<template>
	<!-- 单车明细详情 -->
	<div class="edit_digger conditionAdd ">
		<base-dialog ref="baseDialog" :title="title" :width="'1050px'" @closeDialog="closeDialog" :buttonShow="false">
			<div class="tableBox">
			<el-table ref="listTable" class="no_border sortStyle" :data="carDataList" style="width: 100%"  >

				<!-- 设备编号 -->
				<el-table-column property="deviceName"  label='设备编号'  >
				</el-table-column>
			
				<!-- 接管开始时间 -->
				<el-table-column property="startTimeStr"  label='接管开始时间'  >
				</el-table-column>
				<!-- 接管结束时间 -->
				<el-table-column property="endTimeStr" label='接管结束时间'  >

				</el-table-column>
				<!-- 接管方式 -->
				<el-table-column property="takeoverTypeName" show-overflow-tooltip label='接管方式' :width="200" :render-header="takeoverType">

				</el-table-column>
				<el-table-column property="reasonName" label='接管原因'  :render-header="takeoverReason">

				</el-table-column>

				<el-table-column property="remark" label='备注'  >

				</el-table-column>
			</el-table>
				<div class="pagination_location">
					<base-pagination :total="pageInit.total" :singleDisplay="pageInit.pageSize"
						:currentPage="pageInit.pageIndex" @pagechange="pagechange" @sizeChange="sizeChange">
					</base-pagination>
				</div>
			</div>
		</base-dialog>
	</div>
</template>

<script>
	import dispatchServer from '../../api/dispatch.server';
	import tableMixins from "@/common/mixins/table.mixins";
	import dispatchMixin from '@/common/mixins/dispatch.mixins.js';
	export default {
		name: 'carGettingDetail',
		mixins: [tableMixins, dispatchMixin],
		props:['title'],
		data() {
			return {
				carDataList:[],
				pageInit: {
					total:0,
					pageSize: 15,
					pageIndex: 1,	
				},
				sort:{sort: "ASC",sortName: "num"}
			}
		},
		methods: {
			closeDialog() {
				
			},
			openCloseD() {
				this.$refs.baseDialog.toggleDialog();
			},
			openAddDialog(data) {
				this.openCloseD();
			
			},
			pagechange(page) {
				this.pageInit.pageIndex = page;
				this.$parent.singleVehicleDetailsByClickEve()
			},
			sizeChange(val) {
				this.pageInit.pageSize = val;
				this.$parent.singleVehicleDetailsByClickEve()
			},
			takeoverType(h,{column}) {
				const paymentContent = [h(
					"div", {
						slot: "content"
					},
					"自动切人工接管/应急手柄接管/平台接管/转向接管/踏板接管等"
				), ];
				return h("div", [
					h("span", column.label),
					h("el-tooltip", {
							props: {
								placement: "top"
							}
						},
						[
							paymentContent,
							h("i", {
								class: "iconfont icon-shuoming",
								style: "font-size:12px;margin-left:3px"
							})
						]
					)
				]);
			},
			takeoverReason(h,{column}) {
				const paymentContent = [h(
					"div", {
						slot: "content"
					},
					"根据现场实际情况所选择的具体接管原因，如偏离主路径/主控通信异常/道路结冰等"
				), ];
				return h("div", [
					h("span", column.label),
					h("el-tooltip", {
							props: {
								placement: "top"
							}
						},
						[
							paymentContent,
							h("i", {
								class: "iconfont icon-shuoming",
								style: "font-size:12px;margin-left:3px"
							})
						]
					)
				]);
			},
			
		},
	}
</script>


<style lang="scss" scoped>
	.tableBox{
		padding: 20px;
		/deep/ .el-table__body-wrapper{
			max-height: 525px;
			overflow-y: auto;
		}
		.pagination_location{
			position: inherit;
		}
	}
</style>
