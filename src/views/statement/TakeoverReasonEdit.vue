<template>
	<!-- 接管原因配置 -->
	<div class="table_content">
		<div class="content_center content_tabs">
			<div class="reportTitle">
				<a>{{$t('route.takeover-reason-edit')}}</a>
			</div>
			<div class="btn_search">
				<el-select class="cartSelect" clearable filterable multiple v-model="takeoverReason" collapse-tags
					:placeholder="$t('action.select')+$t('device.takeover-reason')">
					<el-option v-for="(item,index) in takeoverReasonList" :key="index" :label="item.takeoverReason"
						:value="item.takeoverReasonId">
					</el-option>
				</el-select>
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
				<!-- 新增 -->
				<el-button class="btnBg btn-add" @click="dataAddEve">
					<i class="iconfont icon-xinzeng"></i>{{ $t("action.add") }}
				</el-button>
			</div>
			<div class="list_scrollbar_page">
				<el-table ref="listTable" class="no_border" :data="takeoverListData" style="width: 100%">
					<!-- 序号 -->
					<el-table-column property="takeoverReasonId" :label='$t("common.key")'>

					</el-table-column>

					<!-- 接管原因 -->
					<el-table-column property="takeoverReason" show-overflow-tooltip
						:label='$t("dispatch.takeover-reason")'>

					</el-table-column>

					<!-- 有效性 -->
					<el-table-column property="isEffective" show-overflow-tooltip :label='$t("device.isAvailable")'>
						<template scope="scope">
							{{isEffectiveList[scope.row.isEffective]}}
						</template>
					</el-table-column>
					<!-- 操作 -->
					<el-table-column :label='$t("action.operation")'>
						<template scope="scope">
							<!-- {{scope.row}} -->
							<div class="operation_setter">
								<button :title='$t("action.edit")' @click="systemEditEve(scope.row)" :disabled="!scope.row.flag">
									<i class="iconfont icon-bianji"></i>
									{{$t("action.edit")}}
								</button>
								<!-- 删除 -->
								<button :title='$t("action.delete")' @click="deleteEve(scope.row)" :disabled="!scope.row.flag">
									<i class="iconfont icon-shanchu red"></i>
									{{$t("action.delete")}}
								</button>
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
			<Takeover-reason-add ref="TakeoverReasonAdd"></Takeover-reason-add>
		</div>
	</div>
</template>

<script>
	import tableMixins from "@/common/mixins/table.mixins";
	import dispatchMixin from '@/common/mixins/dispatch.mixins.js';
	import dispatchServer from '../../api/dispatch.server';
	import TakeoverReasonAdd from '../../components/statement/TakeoverReasonAdd.vue';
	export default {
		name: 'TakeoverReasonEdit',
		mixins: [tableMixins, dispatchMixin],
		components: {
			TakeoverReasonAdd
		},
		data() {
			return {
				takeoverReason: [],
				takeoverReasonList: [],
				pageInit: {
					pageSize: 15,
					pageIndex: 1,
					total: 0
				},
				takeoverListData: [],
				isEffectiveList: ['无效', '系统因素', '环境因素']
			}
		},

		watch: {
			subareaSn() {
				this.takeoverReason = [];
				this.pageInit.pageIndex = 1;
				this.findTakeOverReasonListEve();
				this.findTakeOverReasonByPageItemEve();
			},
		},
		methods: {
			dataSearchEve() {
				this.findTakeOverReasonByPageItemEve();
			},
			dataResizeEve() {
				this.takeoverReason = [];
			},
			dataAddEve() {
				this.$refs.TakeoverReasonAdd.openAddDialog()
			},
			systemEditEve(e) {
				this.$refs.TakeoverReasonAdd.openAddDialog(e)
			},
			async deleteEve(e) {
				try {
					var result = await dispatchServer.deleteTakeOverReason(e.id,this.subareaSn);
					this.messages.success(this.$t('action.operate-success'));
					this.findTakeOverReasonByPageItemEve();
					this.findTakeOverReasonListEve();
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			async findTakeOverReasonListEve() {
				try {
					var result = await dispatchServer.findTakeOverReasonListEve(this.subareaSn);
					this.takeoverReasonList = result;
					console.log()
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			async findTakeOverReasonByPageItemEve() {
				let data = {
					pageNum: this.pageInit.pageIndex,
					pageSize: this.pageInit.pageSize,
					dataList: this.takeoverReason,
					miningArea:this.subareaSn
				}
				try {
					var result = await dispatchServer.findTakeOverReasonByPageItemEve(data);
					this.takeoverListData = result.content;
					this.pageInit.total = result.totalElements;
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			pagechange(page) {
				this.pageInit.pageIndex = page;
				this.findTakeOverReasonByPageItemEve();
			},
			sizeChange(val) {
				this.pageInit.pageSize = val;
				this.findTakeOverReasonByPageItemEve();
			},

		},
		mounted() {
			this.findTakeOverReasonListEve();
			this.findTakeOverReasonByPageItemEve();
		}
	}
</script>

<style lang="scss" scoped>
	.list_scrollbar_page {
		top: 115px;
	}

	/deep/ .btn_search .cartSelect .el-input {
		width: 250px;
	}
</style>
