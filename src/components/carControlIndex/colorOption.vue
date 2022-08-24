<template>
	<div class="edit_color">
		<base-dialog ref="baseDialog" :width="'700px'" @submitForm="submitSystem" :buttonShow="buttonShow">
			<div class="tabsStyle">
				<el-tabs v-model="currentTab" class="el-tabs--card" @tab-click="handleClick">
					<el-tab-pane :label="$t('device.CSQ')+$t('device.level-option')" name="main_signal_strength">

					</el-tab-pane>
					<el-tab-pane :label="$t('device.error-rate')+$t('device.level-option')" name="main_bit_error_rate">

					</el-tab-pane>
					<el-tab-pane :label="$t('device.star-num')+$t('device.level-option')" name="mins_num">

					</el-tab-pane>
				</el-tabs>
			</div>
			<div class="paddingLR">
				<div class="btn_search">
					<div v-if="!editFlag">
						<el-button class="btnBg btn-add" @click="editEve">
							<i class="iconfont icon-bianji"></i>{{ $t("action.edit") }}
						</el-button>
					</div>
					<div v-else>
						<el-button class="btnBg btn-add" @click="addEve">
							<i class="iconfont icon-xinzeng"></i>{{ $t("action.add") }}
						</el-button>
						<el-button class="btnGray" @click="deleteEve">
							<i class="iconfont themeOrangeColor  icon-shanchu"></i>{{ $t("action.delete") }}
						</el-button>
					</div>
				</div>
				<!-- <div class="list_scrollbar_page"> -->
				<el-table ref="listTable" class="no_border special_border" :data="list"
					style="width: 100%;margin: 20px 0;" :cell-style="{ textAlign: 'center' }"
					:row-class-name="tableRowClassName" :cell-class-name="tableCellClassName" @cell-click="cellClick"
					@selection-change="handleSelectionChange">
					<el-table-column v-if="editFlag" type="selection" width="55">
					</el-table-column>
					<!-- 序号 -->
					<el-table-column :label='$t("common.key")'>
						<template scope="scope">
							{{scope.$index+1}}
						</template>
					</el-table-column>
					<!-- 设备编号 -->
					<el-table-column property="start" show-overflow-tooltip label='开始'>
						<template slot-scope="scope">
							<div v-if="scope.row.index === rowIndex && scope.column.index === columnIndex"
								class='inputnum'>
								<el-input v-model="scope.row.start" type="number" ref='editInput' size="mini"
									@blur="inputBlur(scope)" />
							</div>
							<div class="inputnum" v-else>{{ scope.row.start }}</div>
						</template>

					</el-table-column>
					<!-- 接管开始时间 -->
					<el-table-column property="end" label='结束'>
						<template slot-scope="scope">
							<div v-if="scope.row.index === rowIndex && scope.column.index === columnIndex"
								class='inputnum'>
								<el-input v-model="scope.row.end" type="number" ref='editInput' size="mini"
									@blur="inputBlur(scope)" />
							</div>
							<div class="inputnum" v-else>{{ scope.row.end }}</div>
						</template>
					</el-table-column>
					<el-table-column label='颜色'>
						<template scope="scope">
							<el-color-picker v-model="scope.row.colour" size="mini" :disabled="colorPickerFlag">
							</el-color-picker>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</base-dialog>
	</div>
</template>

<script>
	import systemServer from '../../api/system.server'
	import dispatchServer from '../../api/dispatch.server';
	export default {
		name: 'colorOption',
		data() {
			return {
				currentTab: 'main_signal_strength',
				deleteList: [],
				editFlag: false,
				buttonShow: false,
				main_signal_strength: [],
				main_bit_error_rate: [],
				mins_num: [],
				colorPickerFlag: true,
				list: [],
				rowIndex: -1, //行索引
				columnIndex: -1, //列索引
			}
		},
		methods: {
			openCloseD() {
				this.$refs.baseDialog.toggleDialog();
			},
			openAddDialog(e) {
				this.openCloseD();
				this.currentTab = 'main_signal_strength';
				this.editFlag = false;
				this.buttonShow = false;
				this.colorPickerFlag = true;
				this.deleteList = [];
				this.getColorEve();
				
			},
			editEve() {
				this.editFlag = true;
				this.deleteList = [];
				this.colorPickerFlag = false;
				this.buttonShow = true;
				this.toggleSelection()
			},
			toggleSelection(rows) {
				this.$refs.listTable.clearSelection();
			},
			handleClick(tab) {
				this.getColorEve();
				this.editFlag = false;
				this.colorPickerFlag = true;
				this.deleteList = [];
				this.buttonShow = false;
				this.list = this[tab.name];
			},
			handleSelectionChange(e) {
				console.log(e)
				this.deleteList = e;
			},
			deleteEve() {
				this.deleteList.sort(function(a, b) {
					return a.index - b.index
				})
				var x = 0;
				this.deleteList.forEach(i => {
					this[this.currentTab].splice(i.index - x, 1)
					x++;
				})
				this.delColorEve()
			},
			addEve() {
				this[this.currentTab].push({
					start: 0,
					end: 0,
					colour: '#3bff19',
					type: this.currentTab == 'main_signal_strength' ? '0' : (this.currentTab ==
						'main_bit_error_rate' ? '1' : '2')
				})
			},
			//把每一行的索引加到行数据中
			tableRowClassName({
				row,
				rowIndex
			}) {
				row.index = rowIndex
			},
			//把每一列的索引加到列数据中
			tableCellClassName({
				column,
				columnIndex
			}) {
				column.index = columnIndex
			},
			cellClick(row, column, cell, event) {
				if (['开始', '结束'].includes(column.label) && this.editFlag) {
					this.rowIndex = row.index
					this.columnIndex = column.index
					this.$nextTick(() => {
						this.$refs['editInput'].focus()
					})
				}
			},
			inputBlur(scope) {
				this.rowIndex = -1
				this.columnIndex = -1
			},
			submitSystem() {
				this.editFlag = false;
				this.buttonShow = false;
				this.colorPickerFlag = true;
				this.addColorEve()
				// console.log(this.main_signal_strength)
				// console.log(this.main_bit_error_rate)
				// console.log(this.mins_num)
			},
			async getColorEve() {
				try {
					var data = {
						"type": this.currentTab == 'main_signal_strength' ? 0 : (this.currentTab ==
							'main_bit_error_rate' ? 1 : 2)
					}
					var result = await dispatchServer.getfindColour(data);
					this[this.currentTab] = result;
					this.list = this[this.currentTab];
					console.log(result)
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			async addColorEve() {
				try {
					var result = await dispatchServer.getsaveColour(this[this.currentTab]);
					console.log(result)
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			async delColorEve() {
				try {
					var result = await dispatchServer.getdelColour(this.deleteList);
					console.log(result)
				} catch (e) {
					this.messages.error(e.message)
				}
			},
		}
	}
</script>


<style lang="scss" scoped>
	.tabsStyle {
		position: absolute;
		top: 0;
		z-index: 100;
		height: 40px;
	}

	.paddingLR {
		min-height: 300px;
		width: 660px;
		padding-right: 0 !important;
		padding-bottom: 20px;
	}

	.el-tabs__header {
		margin-bottom: 0 !important;
	}
</style>
