<template>
	<!-- 单车明细详情 -->
	<div class="edit_digger conditionAdd ">
		<base-dialog ref="baseDialog" title="汇总明细" :width="'1600px'" @closeDialog="closeDialog" :buttonShow="false">
			<div class="tableBox">
				<div class="typeCheckList">
					<span v-for="item in titleList" :class="item.type == typeCheck ? 'checkStyle' : ''" @click="typeCheckEve(item.type)">{{item.name}}</span>
				</div>	
			<el-table ref="listTable" class="no_border sortStyle" :data="carDataList" style="width: 100%"  @sort-change="changeSort">
				<!-- 序号 -->
				<el-table-column property="id"  label='序号'  :width="100">
				</el-table-column>
				<!-- 设备编号 -->
				<el-table-column property="deviceName"  label='设备编号' :width="100" sortable>
				</el-table-column>
			
				<!-- 接管开始时间 -->
				<el-table-column property="startTimeStr"  label='接管开始时间'  :width="200" sortable>
				</el-table-column>
				<!-- 接管结束时间 -->
				<el-table-column property="endTimeStr" label='接管结束时间'  :width="200" sortable>

				</el-table-column>
				<!-- 接管时长-->
				<el-table-column property="takeoverTime" show-overflow-tooltip label='接管时长(min)' :width="130" sortable>
				
				</el-table-column>
				<!-- 接管方式 -->
				<el-table-column property="takeoverTypeName" show-overflow-tooltip label='接管方式' :width="200" :render-header="takeoverType">

				</el-table-column>
				<el-table-column property="reasonName" label='接管原因' show-overflow-tooltip  :render-header="takeoverReason">

				</el-table-column>

				<el-table-column property="remark" label='备注' show-overflow-tooltip >

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
		name: 'SummDetailList',
		mixins: [tableMixins, dispatchMixin],
		data() {
			return {
				carDataList:[],
				pageInit: {
					total:0,
					pageSize: 15,
					pageIndex: 1,	
				},
				sort:{sort: "ASC",sortName: "deviceName"},
				titleList:[
					{type:'AQYTC',name:'安全员干预'},
					{type:'AQYQD',name:'安全员恢复'},
					{type:'JKYTC',name:'监控员远程'},
					{type:'JKYQD',name:'监控员恢复'},
					{type:'YCJG',name:'远程接管'},
				],
				typeCheck:'AQYTC'
				
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
				this.totalDetailsByClickEve();
			},
			pagechange(page) {
				this.pageInit.pageIndex = page;
				this.totalDetailsByClickEve(this.typeCheck);
			},
			sizeChange(val) {
				this.pageInit.pageSize = val;
				this.totalDetailsByClickEve(this.typeCheck);
			},
			typeCheckEve(e){
				this.typeCheck = e;
				this.totalDetailsByClickEve(e);
				this.pageInit.pageIndex = 1;
			},
			changeSort(v){
				let res = this.utils.getConversion(v, v.prop);	
				this.sort = res;
				this.totalDetailsByClickEve(this.typeCheck)
			},
			async totalDetailsByClickEve(e = 'AQYTC') {
				let params = {
					dataTime:this.$parent.$parent.$refs.leftContentBox.searchArr.map(c=> c.dataTime).join(''),
					uniqueId:this.$parent.$parent.$refs.leftContentBox.searchArr.map(c=> c.uniqueId).join(''),
					miningArea:this.subareaSn,
					type:e,
					pageNum:this.pageInit.pageIndex,
					pageSize:this.pageInit.pageSize,
					...this.sort
				}
				try {
					var result = await dispatchServer.totalDetailsByClickEve(params);
					this.carDataList = result.content;
					this.pageInit.total = result.totalElements;
				} catch (e) {
					this.messages.error(e.message)
				}
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

		watch: {
			subareaSn(value) {
			
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
			min-height: 525px;
		}
		.pagination_location{
			position: inherit;
		}
		.typeCheckList{
			width: 500px;
			display: flex;
			justify-content: space-between;
			font-size: 14px;
			color: #8F96AA;
			padding-bottom: 15px;
			span{
				cursor: pointer;
				line-height: 30px;
				border-bottom: 3px solid transparent;
				&.checkStyle{
					border-color: #FF5900;
					color: #ffffff;
				}
			}
		}
	}
</style>
