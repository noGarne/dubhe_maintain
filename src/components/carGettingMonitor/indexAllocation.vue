<template>
	<!-- 添加用户 -->
	<div class="edit_digger conditionAdd ">
		<base-dialog ref="baseDialog" title="指标配置" :width="'1500px'" @closeDialog="closeDialog" :buttonShow="false">
			<div class="tableBox  hauling_track">
				<!-- bianji -->
				<div class="btn_search">
					<el-button class="btnBg btn-add" v-if="!editFlag" :class="stageFlag == '' ? 'button-disabled' : ''"
						@click="editFlag = true">
						<i class="iconfont icon-bianji"></i>{{ $t("action.edit") }}
					</el-button>
					<div v-else>
						<el-button class="btnBg btn-add" @click="saveRuleEce">
							<i class="iconfont icon-shengxiao"></i>{{ $t("action.save") }}
						</el-button>
						<el-button class=" btn-add btnGray" @click="editFlag = false">
							<i class="iconfont icon-guanbi themeOrangeColor"></i>{{ $t("action.cancel") }}
						</el-button>
					</div>
				</div>
				<el-table ref="listTable" class="no_border table-column" :data="historyList" style="width: 100%;"
					:row-class-name="tableRowClassName" :cell-class-name="tableCellClassName">
					<!-- 序号 -->
					<el-table-column fixed align="center" prop="name" show-overflow-tooltip width="170">
						<template slot="header" slot-scope="scope">
							<div class="table_header_sprit">
								<span class="header_load">指标名称</span>
								<span class="header_unload">阶段名称</span>
								<b></b>
							</div>
						</template>
					</el-table-column>
					<el-table-column v-for="(item,index) in tableColumnList" align="center" show-overflow-tooltip
						:label='item.name'>
						<template slot="header" slot-scope="scope">
							<div class="labelItem">
								<el-radio v-model="stageFlag" :label="item.key"
									:disabled="!!editFlag && stageFlag !==item.key ">{{item.name}}</el-radio>
							</div>
						</template>
						<el-table-column :width="index == '4' ? '175' : ''" :label="item.nameDetail" align="center">
							<template scope="scope">
								<div v-if=" stageFlag == item.key && editFlag" class='inputnum'>
									<el-input v-model="scope.row['value'+item.key]" type="number" ref='editInput'
										size="mini" @keydown.native="channelInputLimit" />
								</div>
								<p v-else :class="stageFlag == item.key ? 'labelCheck' : ''">
									{{scope.row['value'+item.key]}}
								</p>
							</template>
						</el-table-column>
					</el-table-column>
				</el-table>
				<div class="btn_search bottom_search">
					<el-button class="btnBg btn-add" :class=" !stageFlag   ? 'button-disabled' : ''"
						@click="setTableData">
						提交
					</el-button>
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
		name: 'indexAllocation',
		mixins: [tableMixins, dispatchMixin],
		data() {
			return {
				dateCheck: [],
				carCheck: [],
				equipmentList: [],
				dialogType: false,
				ruleName: '',
				historyList: [],
				tableColumnList: [{
						name: '阶段一',
						nameDetail: '模拟安全员下车6小时（昼）',
						key: 1
					},
					{
						name: '阶段二',
						nameDetail: '模拟安全员下车6小时（夜）',
						key: 2
					},
					{
						name: '阶段三',
						nameDetail: '安全员下车6小时（昼）',
						key: 3
					},
					{
						name: '阶段四',
						nameDetail: '安全员下车6小时（夜）',
						key: 4
					},
					{
						name: '阶段五',
						nameDetail: '安全员下车12小时（昼夜）',
						key: 5
					},
					{
						name: '阶段六',
						nameDetail: '安全员下车24小时',
						key: 6
					},
					// {
					// 	name: '阶段七',
					// 	nameDetail: '安全员下车9小时',
					// 	key: 7
					// },
					// {
					// 	name: '阶段八',
					// 	nameDetail: '安全员下车24小时',
					// 	key: 8
					// }
				],
				historyValue: '',
				stageFlag: '',
				rowIndex: -1, //行索引
				columnIndex: -1, //列索引
				editFlag: false,
				updateFlag: false,
			}
		},
		methods: {
			closeDialog() {
				this.historyValue = '';
			},
			openCloseD() {
				this.$refs.baseDialog.toggleDialog();
			},
			openAddDialog(data) {
				this.openCloseD();
				this.historyValue = '';
				this.updateFlag = false;
				// this.stageFlag = '';
				this.inputBlur();
				this.editFlag = false;
				this.findAllIndicatorEve()
			},
			async findAllIndicatorEve(ev) {
				try {
					var result = await dispatchServer.findAllIndicatorEve(this.subareaSn);
					this.historyList = (result.filter(i => {
						return ['卡车数量','参考运行天数', '阶段运行总时长', '安全员干预-停车次数', '安全员干预-恢复行车次数', '监控员干预-远程停车次数', '监控员干预-恢复行车次数', '远程接管次数']
							.includes(i.name)
					})).reverse()
					this.historyList.sort((a,b)=>{
						var order = ['卡车数量', '参考运行天数','阶段运行总时长', '安全员干预-停车次数', '安全员干预-恢复行车次数', '监控员干预-远程停车次数', '监控员干预-恢复行车次数', '远程接管次数'];
						  return order.indexOf(a.name) - order.indexOf(b.name);
					})
					
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			async updateIndicatorEve(data) {
				try {
					var result = await dispatchServer.updateIndicatorEve(data);
					this.messages.success('修改成功')
				} catch (e) {
					this.messages.error(e.message)
				}
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
			inputBlur(scope) {
				this.rowIndex = -1
				this.columnIndex = -1
			},
			setTableData() {
				this.editFlag = false;
				let itemArr = [];
				let idArr = [];

				this.historyList.forEach(i => {
					itemArr.push(Number(i['value' + this.stageFlag]));
					idArr.push(Number(i['indicatorId']));
				})
				if (itemArr[0] == 0) {
					this.messages.error('卡车数量不能为空或0')
					return
				}
				this.$parent.limitCheckNum = itemArr[0];
				this.$parent.stageNum = itemArr;
				this.$parent.stageFlag = this.stageFlag;
				this.updateIndicatorEve({
					miningArea:this.subareaSn,
					stageId: this.stageFlag,
					valueTimesList: itemArr,
					indicatorIdList: idArr
				})
				this.openCloseD();
				// this.stageFlag = ''
			},
			saveRuleEce() {
				this.editFlag = false;
				this.updateFlag = true;
			},
			channelInputLimit(e) {
				let key = e.key
				if (key === 'e' || key === '.' || key === ' ') {
					e.returnValue = false
					return false
				}
				return true
			}
		},
		mounted() {
			this.openCloseD();
			this.findAllIndicatorEve()
		},
		watch: {
			subareaSn(value) {
				this.stageFlag = '';
				this.updateFlag = false;
			},
		},
	}
</script>


<style lang="scss" scoped>
	.hauling_track {
		padding: 0 40px;
		.labelItem {
			display: flex;
			justify-content: center;
			padding: 0 !important;
			.el-radio {
				color: #D7D7D7 !important;
				font-size: 12px !important;
				line-height: 20px;
				display: flex;
				align-items: center;

			}
			.is-checked {
				.el-radio__label {
					padding-left: 10px !important;
				}
			}
		}
		.table_header_sprit {
			width: 170px !important;
			height: 80px !important;
			background: #1c2232 url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTcwMC4wMDAwMDAwMDAwMDAyIiBoZWlnaHQ9Ijc5OS45OTk5OTk5OTk5OTk5IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogPCEtLSBDcmVhdGVkIHdpdGggTWV0aG9kIERyYXcgLSBodHRwOi8vZ2l0aHViLmNvbS9kdW9waXhlbC9NZXRob2QtRHJhdy8gLS0+CiA8Zz4KICA8dGl0bGU+YmFja2dyb3VuZDwvdGl0bGU+CiAgPHJlY3QgZmlsbD0iIzFjMjIzMiIgaWQ9ImNhbnZhc19iYWNrZ3JvdW5kIiBoZWlnaHQ9IjgwMiIgd2lkdGg9IjE3MDIiIHk9Ii0xIiB4PSItMSIvPgogIDxnIGRpc3BsYXk9Im5vbmUiIG92ZXJmbG93PSJ2aXNpYmxlIiB5PSIwIiB4PSIwIiBoZWlnaHQ9IjEwMCUiIHdpZHRoPSIxMDAlIiBpZD0iY2FudmFzR3JpZCI+CiAgIDxyZWN0IGZpbGw9InVybCgjZ3JpZHBhdHRlcm4pIiBzdHJva2Utd2lkdGg9IjAiIHk9IjAiIHg9IjAiIGhlaWdodD0iMTAwJSIgd2lkdGg9IjEwMCUiLz4KICA8L2c+CiA8L2c+CiA8Zz4KICA8dGl0bGU+TGF5ZXIgMTwvdGl0bGU+CiAgPGxpbmUgc3Ryb2tlPSIjMTAxMDEyIiBzdHJva2UtbGluZWNhcD0idW5kZWZpbmVkIiBzdHJva2UtbGluZWpvaW49InVuZGVmaW5lZCIgaWQ9InN2Z184IiB5Mj0iNzk3LjYyMDY2NiIgeDI9IjE2OTguNDYyNTg3IiB5MT0iMi4yMzUwOTQiIHgxPSIxLjUzNzQ3NyIgZmlsbC1vcGFjaXR5PSJudWxsIiBzdHJva2Utb3BhY2l0eT0ibnVsbCIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CiA8L2c+Cjwvc3ZnPg==') !important;
			.header_unload {
				top: 13px;
			}
			.header_load {
				bottom: 13px;
			}
		}

		.btn_search {
			padding: 20px 0;
		}
		.bottom_search {
			float: right;
			button {
				width: 80px;
			}
		}
	}
</style>
