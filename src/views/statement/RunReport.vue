<template>
	<!-- 接管分析 -->
	<div class="table_content">
		<div class="content_center content_tabs">
			<div class="reportTitle">
				<a>{{$t('route.statement-data-detail')}}</a>
				<p><i class="iconfont icon-gaojingxinxi red"></i>注：现阶段接管率只分析按照正常流程产生的接管数据，异常流程产生的接管数据不包含在内！</p>
			</div>
					<div class="btn_search">
						<!-- 卡车 -->
						<el-select class="cartSelect" clearable filterable multiple v-model="search.truckId"
							collapse-tags :placeholder="$t('action.select')+$t('action.truck')" @change="selectAllChange">
							<!-- <el-select class="cartSelect" clearable filterable  v-model="search.truckId"
								collapse-tags :placeholder="$t('action.select')+$t('action.truck')"> -->
							<el-option label="全选" value="selectAll" :class="search.truckId.length == equipmentList.length ? 'selected' : ''" v-if="equipmentList.length > 0"></el-option>
							<el-option v-for="(item,index) in equipmentList" :key="index" :label="item.deviceName"
								:value="item.uniqueId">
							</el-option>
						</el-select>
						<!-- 开始时间-结束时间  -->
						<el-date-picker v-model="search.start_time" :picker-options="option" type="datetime"
							:placeholder="$t('monitoring.start-time')" :range-separator="$t('devicesLog.to')"
							align="right" @change="startTimeChange"
							prefix-icon="el-icon-date"
							></el-date-picker>
						<el-date-picker v-model="search.end_time" :picker-options="option" type="datetime"
							:placeholder="$t('monitoring.end-time')" :range-separator="$t('devicesLog.to')"
							align="right" @change="endTimeChange"
							prefix-icon="el-icon-date"
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
							<el-button type="button" class="btnBg" @click="batchEditFlagEve" v-show="!batchEditFlag">
							<i class="iconfont icon-bianji"></i>
							{{$t('dispatch.takeover-reason')}}
							</el-button>
							<el-button type="button" class="btnBg" @click="batchEditFlagUpset" v-show="batchEditFlag">
								完成编辑
							</el-button>
							<el-button type="button" class="btnGray"  @click="batchEditFlag = !batchEditFlag" v-show="batchEditFlag">
								取消编辑
							</el-button>
					</div>

					<div class="list_scrollbar_page">
						<el-table ref="listTable" class="no_border sortStyle" :max-height="tableHeight" @sort-change="changeSort"
							:row-class-name="tableRowClassName" @filter-change="filterChange" :data="list"
							style="width: 100%" @selection-change="checkboxSelect">
								<el-table-column
								  v-if="batchEditFlag"
							      type="selection"
							      width="55"
								  >
								  </el-table-column>
							<!-- 序号 -->
							<el-table-column :width="80" sortable property="id" :label='$t("common.key")'>
							</el-table-column>
							<!-- 设备编号 -->
							<el-table-column sortable :width="90" property="deviceName" show-overflow-tooltip
								:label='$t("vehicleLog.device-imei")'>
							</el-table-column>
							<!-- 接管开始时间 -->
							<el-table-column property="startTimeStr" sortable="custom" :width="180"
								show-overflow-tooltip :label='$t("vehicleLog.start-time")'>
							</el-table-column>
							<!-- 接管结束时间 -->
							<el-table-column property="endTimeStr" :width="180" sortable show-overflow-tooltip
				  			:label='$t("vehicleLog.end-time")'>
				  		</el-table-column>
							<!-- 接管时长(min) -->
							<el-table-column show-overflow-tooltip sortable 
								:label='$t("vehicleLog.takeover-time")' :filter-multiple="false" property="takeoverTime"
								:column-key="'equStatus'" filter-placement="right-start">
							</el-table-column>
							<!-- 接管方式 -->
							<el-table-column property="takeoverTypeName" show-overflow-tooltip 
								:label='$t("device.takeover-style")' :render-header="followDrivingHeader">
							</el-table-column>>
							<!-- 接管原因 -->
							<el-table-column property="reasonName" 
								:label='$t("dispatch.takeover-reason")' :render-header="reasonHeader"
								 :filters="[{text: '审核', value: 1}, {text: '未审核', value: 0}]"
								 filter-placement="right-start"
								 :filter-multiple="false"
								  :column-key="'takeoverReason'"
								>
								<template scope="scope">
									<p v-show="!batchEditFlag">{{scope.row.reasonName}}</p>
									<div class="btn_search noPadding" v-show="batchEditFlag">
									<el-select class="cartSelect" clearable v-model="scope.row.retainedReason" @change="reasonChangeEve(scope.row)">
										<el-option v-for="(item,index) in takeoverReasonList" :key="index" :label="item.takeoverReason"
											:value="item.takeoverReasonId">
										</el-option>
									</el-select>
									</div>
								</template>
							</el-table-column>
							<!-- 备注 -->
							<el-table-column property="remark" show-overflow-tooltip
								:label='$t("dispatch.device-operation-remark")'>
								<template scope="scope">
									<p v-show="!batchEditFlag">{{scope.row.remark}}</p>
									<div class="btn_search noPadding" v-show="batchEditFlag">
									<el-input type="text" v-model="scope.row.retainedRemark" class="alarm-input"
										@input="remarkChangeEve(scope.row)"
										placeholder='请输入备注'>
									</el-input>
									</div>
								</template>
							</el-table-column>
							<!-- 操作 -->
							<el-table-column width="145" :label='$t("action.operation")'>
								<template scope="scope">
									<!-- {{scope.row}} -->
									<div class="operation_setter">
									</div>
								</template>
							</el-table-column>
						</el-table>
					</div>
					<div class="pagination_location">
						<base-pagination :total="pageInit.total" :singleDisplay="pageInit.pageSize"
							:currentPage="pageInit.pageIndex" @pagechange="pagechange" @sizeChange="sizeChange">
						</base-pagination>
					</div>
				<!-- </el-tab-pane> -->
			<!-- </el-tabs> -->

		</div>
		<run-report-add ref="runreportadd"></run-report-add>
		<system-edit ref="systemedit" :subareaSn="subareaSn"></system-edit>

	</div>
</template> 

<script>
	import tableMixins from "@/common/mixins/table.mixins";
	import dispatchMixin from '@/common/mixins/dispatch.mixins.js';
	import dispatchSetServer from '../../api/dispatchSet.server';
	const runReportAdd = () => import('../../components/statement/runReportAdd.vue')
	const systemEdit = () => import('../../components/statement/systemEdit.vue')
	import dispatchServer from '../../api/dispatch.server';

	export default {
		name: 'RunReport',
		mixins: [tableMixins, dispatchMixin],
		components: {
			runReportAdd,
			systemEdit,
		},
		data() {
			return {
				equipmentList: [],
				list: [],
				currentTab: '0',
				pageInit: {
					pageSize: 15,
					pageIndex: 1
				},
				oldSeleValue: [],
				takeoverReasonList:[],
				truckName: '',
				equStatus: null,
				batchEditFlag:false,
				selectionCheckList:[],
				radioCheckList:[],
				sortData: {
					sort: "",
					sortName: "",
					
				},
				search: {
					sortName: "id",
					end_time: this.getYesterEve() + ' 23:59:59',
					start_time: this.getYesterEve() + ' 00:00:00',
					truckId: [],
					sort: "DESC",
					isApproved:'all'
				}

			}
		},
		created() {
			if (this.subareaSn) {
				this.getList();
				this.getEquipmentList();
				this.findTakeOverReasonListEve();
			}
		},
		watch: {
			subareaSn() {
				this.search = {
					sortName: "id",
					end_time: this.getYesterEve() + ' 23:59:59',
					start_time: this.getYesterEve() + ' 00:00:00',
					truckId: [],
					sort: "DESC",
					isApproved:'all'
				};
				this.pageInit.pageIndex = 1;
				this.equipmentList = [];
				this.getList();
				this.findTakeOverReasonListEve();
				this.getEquipmentList();
				this.batchEditFlag = false;
			}
		},
		methods: { 
			async getList() {
				try {
					var data = {
						pageSize: this.pageInit.pageSize,
						pageIndex: this.pageInit.pageIndex,
						sort: this.search.sort,
						sortName: this.search.sortName,
						startTime: this.search.start_time ? this.utils.formatDate(this.search.start_time) : '',
						endTime: this.search.end_time ? this.utils.formatDate(this.search.end_time) : '',
						isApproved:this.search.isApproved,
						miningArea: this.subareaSn,
						uniqueId: this.search.truckId.filter(c=> c!== 'selectAll'),
					}
					var result =  await dispatchServer.takeOverData(data);
					result.content.forEach(c=>{
						c.retainedRemark = c.remark;
						c.retainedReason = c.reason;
					})
					this.list = result.content || [];
					console.log(this.list)
					this.pageInit.total = result.totalElements;
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			takeoverReasonEve(value,row,column){ 
				this.search.isApproved = value == 1 ? 1 : (value == 0 ? 0 : 'all');
				return row.dataSources == 1;
			},	
			async findTakeOverReasonListEve() {
				try {
					var result = await dispatchServer.findTakeOverReasonListEve(this.subareaSn);
					this.takeoverReasonList = result;
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			batchEditFlagEve(){
				this.batchEditFlag = true;
				this.$refs.listTable.clearSelection();
				this.list.forEach(c=>{
					c.retainedRemark = c.remark;
					c.retainedReason = c.reason;
				})
			},
			remarkChangeEve(e){
				this.reasonChangeEve(e,1)
			},
			batchEditFlagUpset(){
				let params = [];
				this.list.forEach(c=>{
					if([...new Set(this.selectionCheckList.concat(this.radioCheckList))].includes(c.id)){
						params.push({
							takeoverReasonId:c.retainedReason,
							remark:c.retainedRemark,
							id:c.id,
							version:c.version
						})
					}
				})
				this.saveTakeReasonEve(params)
			},
			timeVerification(a,b){
				if(new Date(a) >= new Date(b)){
					this.messages.error('结束时间需大于开始时间');
					return false;
				}
			},
			async saveTakeReasonEve(e){
				try {
					var result = await dispatchServer.saveTakeReasonEve(e);
					this.batchEditFlag = false;
					this.getList();
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			reasonChangeEve(e,z){
				console.log(e)
				if(this.selectionCheckList.includes(e.id)){
					this.list.forEach(c=>{
						if(this.selectionCheckList.includes(c.id)){
							z ? c.retainedRemark = e.retainedRemark : c.retainedReason = e.retainedReason;
						}
					})
				}else{
					this.radioCheckList = this.radioCheckList.push(e.id) && [...new Set(this.radioCheckList)]
					console.log(this.radioCheckList)
				}
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
			checkboxSelect(row){
				this.selectionCheckList = [];
				this.radioCheckList = [];
				this.selectionCheckList = row.map(c=> c.id)
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
			systemEditEve(e) {
					this.$refs.runreportadd.openAddDialog(e)
			},
			takeoverChartsEve() {
				// this.$refs.takeoverchartbox.openAddDialog(this.search)
			},
			changeSort(v) {
				let res = this.utils.getConversion(v, v.prop);
				console.log(res)
				this.search.sort = res.sort;
				this.search.sortName = res.sortName;
				console.log(res)
				this.getList();
			},
			async deleteEve(e) {
				this.$messageConfirm.showConfirm({
					content: '确定要删除该条数据吗?',
					title: "删除"
				}, async () => {
					let data = {
						id: e.id
					}
					var result = await dispatchServer.deltakeoverdataEve(data);
					this.getList();
					this.messages.success(this.$t('action.operate-success'));
				});
			},
			filterChange(filters) {
				this.pageInit.pageIndex = 1;
				this.search.isApproved = filters.takeoverReason.length > 0 ? filters.takeoverReason[0] : 'all';
				this.getList();
			},
			dataResizeEve() {
				this.search = {
					sortName: "id",
					start_time: "",
					end_time: "",
					truckId: [],
					isApproved:'all',
					sort: "DESC"
				};
			},
			pagechange(page) {
				this.pageInit.pageIndex = page;
				this.getList();
			},
			sizeChange(val) {
				this.pageInit.pageSize = val;
				this.getList();
			},
			renderHeader(h, {
				column
			}) {
				const paymentContent = [h(
					"div", {
						slot: "content"
					},
					"展示过去5min发生的故障"
				), ];
				return h("div", [
					h("span", column.label),
					h("el-tooltip", {
							props: {
								placement: "bottom"
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
			followDrivingHeader(h, {
				column
			}) {
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
								placement: "bottom"
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
			dataSourcesHeader(h, {
				column
			}) {
				const paymentContent = [h(
					"div", {
						slot: "content"
					},
					"人为录入/系统生成"
				), ];
				return h("div", [
					h("span", column.label),
					h("el-tooltip", {
							props: {
								placement: "bottom"
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
			reasonHeader(h, {
				column
			}) {
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
								placement: "bottom"
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
			takeoverLeveHeader(h, {
				column
			}) {
				const paymentContent = [h(
					"div", {
						slot: "content"
					},
					"严重接管/告警接管/一般接管"
				), ];
				return h("div", [
					h("span", column.label),
					h("el-tooltip", {
							props: {
								placement: "bottom"
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
			stateNameHeader(h, {
				column
			}) {
				const paymentContent = [h(
					"div", {
						slot: "content"
					},
					"未通过：计划内的接管，如收车，交接班，测试等；已通过：计划外的接管。"
				), ];
				return h("div", [
					h("span", column.label),
					h("el-tooltip", {
							props: {
								placement: "bottom"
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
			isAvailableNameHeader(h, {
				column
			}) {
				const paymentContent = [h(
					"div", {
						slot: "content"
					},
					"有效：自动驾驶本身问题引起的接管；无效：非自动驾驶本身引起的接管，如场地问题，环境问题等。"
				), ];
				return h("div", [
					h("span", column.label),
					h("el-tooltip", {
							props: {
								placement: "bottom"
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
			dataSearchEve() {
				console.log(this.search)
				this.getList();
			},
			dataAddEve() {
				this.$refs.runreportadd.openAddDialog()
			},
			setTemporary(data) {
				this.getIndex = data.index;
				this.$refs.temporary.getInfo(data, 'list');
			},
		},
		computed: {
			allSeleValue() {
				return this.equipmentList.map(v => v.uniqueId);
			}
		},
	}
</script>

<style lang="scss" scoped>
	.btn_search {
		top: 60px !important;
		left: 20px;
		z-index: 1;
	}
	.content_center{
		// padding-top: 30px;
	}
	.list_scrollbar_page {
		margin: 70px 20px 0 0;
	}
	
	.el-table {
		width: 99% !important;
		/deep/ .noPadding{
			position: inherit !important;
			
				.el-input {
					width: 180px !important;
				}
			
		}
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
