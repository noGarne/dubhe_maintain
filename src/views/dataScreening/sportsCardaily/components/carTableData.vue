<template>
	<div>
		<div class="carRoutemap">
			<div class="carRoutemap_action">
				<div class="btn_search">
					<el-button type="primary" @click="onManual">手工录入</el-button>
				</div>
				<div class="brieflyDetailList">

					<span v-for="(item,index) in brieflyDetailList" :class="index == DataCheckFlag ? 'check' : ''"
						@click="brieflyDetailListEve(index)">
						{{item}}
					</span>
				</div>
				<div class="filterBox">
					<div class="faultList">
						<el-checkbox-group v-model="checkList" @change="faultCheckEve">
							<el-checkbox :label="1" class="faultStyle">一级故障</el-checkbox>
							<el-checkbox :label="2">二级故障</el-checkbox>
							<el-checkbox :label="3">三级故障</el-checkbox>
						</el-checkbox-group>
					</div>
				</div>
				<div v-for="(item,index) in tableData" class="tableItemList">
					<el-table ref="listTable" class="no_border table-column" :data="item.detailData"
						:style="{width:DataCheckFlag == 0 ? '50%' : '100%'}" v-show="DataCheckFlag == 1">
						
						<el-table-column fixed align="center" prop="name" show-overflow-tooltip>
							<template slot="header" slot-scope="scope">
								<div class="flexStyle">
									<div>
										<span class="header_load">
											<img src="@/common/images/type-kache.png" alt="" class="carIconStyle">
											<a>{{item.mainData.deviceName}}</a>
										</span>
									</div>
									<div>
										<span class="header_load">出勤时长(h)<a
												class="numStyle">{{item.mainData.attendanceTime}}</a></span>
									</div>
									<div>
										<span class="header_load">运营时长(h)<a
												class="numStyle">{{item.mainData.operationTime}}</a></span>
									</div>
								</div>
							</template>
							<div class="secondMenuStyle">
								<el-table-column prop="haulAllTimes" label="趟次时间">
								</el-table-column>
								<el-table-column prop="haulTimesNum" label="趟次">
								</el-table-column>
								<el-table-column prop="haulTime" label="趟次时长">
								</el-table-column>
							</div>
						</el-table-column>

						<el-table-column fixed align="center" prop="name" show-overflow-tooltip
							v-if="DataCheckFlag == 1">
							<template slot="header" slot-scope="scope">
								<div class="flexStyle">
									<span class="header_load">
										<div>
											<div class="green">
												<img src="@/common/images/takeover.png">
											</div>
											干预次数
											<a class="numStyle">{{item.mainData.numberOfTakeover}}</a>
										</div>
									</span>

								</div>
							</template>
							<div class="secondMenuStyle">
								<el-table-column label="接管原因">
									<template scope="scope">
										<div class="noFixed">
											<a v-for="(it,index) in scope.row.takeoverReason"
											:style="{height:scope.row.takeoverMode[index].split(',').length >= 2 ? scope.row.takeoverMode[index].split(',').length*41+'px' : 82+'px'}"
												class="reasonStyle textCenterClass flexWrapStyle">
												<p :title="it" class="remarkContent"  v-if="!item.editFlag">{{it}}</p>
												<div class="btn_search" v-if="!!item.editFlag">
												<el-select  class="cartSelect"  v-model="scope.row.takeOverRetainedReasonId[index]"
													 :placeholder="$t('action.select')+$t('device.takeover-reason')" @change="reasonChangeEve(scope.row,index,item)">
													<el-option v-for="(itc,index) in equipmentList" :key="index" :label="itc.takeoverReason"
														:value="itc.takeoverReasonId">
													</el-option>
												</el-select>
												</div>
												
												<p v-if="!item.editFlag && !!scope.row.takeoverRemark[index]" class="remarkContent"  :title="scope.row.takeoverRemark[index]">{{'备注：'+scope.row.takeoverRemark[index]}}</p>
												<div class="btn_search" v-if="!!item.editFlag">
													<el-input  type="text" v-model="scope.row.takeoverRetainedRemark[index]" class="alarm-input"
													 @input="reasonChangeEve(scope.row,index,item,1)"
														placeholder='请输入备注'>
													</el-input>
												</div>
											</a>
											<!-- <a>
												<p v-for="(item,index) in [scope.row.takeoverReason[index],scope.row.takeoverRemark[index]]" :title="item">
													{{item}}
												</p>
											</a> -->
											<!-- <a class="showAllStyle" v-show="scope.row.takeoverTime.length > 10"  @click="scope.row.takeoverShowFlag = !scope.row.takeoverShowFlag"></a>	 -->
										</div>
									</template>
									<template slot="header" slot-scope="scope">
										<div class="secondTableStyle">
											接管原因
											<div v-if="item.editFlag == false">
												<i class="iconfont icon-bianji themeOrangeColor" @click="tableEditEve(item)"></i>
											</div>
											<div v-else>
												<i class="iconfont icon-shibai" style="padding-right: 5px;" @click="cancelEditEve(item)"></i>
												<i class="iconfont icon-qiyong themeOrangeColor" @click="determineEditEve(item)"></i>
											</div>
										</div>
									</template>
								</el-table-column>
								<el-table-column label="干预时间" class="nostyle">
									<!-- <el-table-column
										  v-if="item.editFlag == true"
									      type="selection"
									      width="55"
										  >
										  </el-table-column> -->
									<template scope="scope">
										<div class="noFixed">
											
											<a v-for="(it,index) in scope.row.takeoverTime" :title="it"
											:style="{height:scope.row.takeoverMode[index].split(',').length >= 2 ? scope.row.takeoverMode[index].split(',').length*41+'px' : 82+'px'}"
												class="textCenterClass">
												<el-checkbox class="faultStyle" v-model="scope.row.takeOverEditFlag[index]" @change="itemCheckEve($event,scope.row.takeOverId[index])"  v-if="item.editFlag"></el-checkbox>
												<a>{{it}}</a>
											</a>
											<!-- <a class="showAllStyle" v-show="scope.row.takeoverTime.length > 10"  @click="scope.row.takeoverShowFlag = !scope.row.takeoverShowFlag"></a>	 -->
										</div>
									</template>
									<template slot="header" slot-scope="scope">
										<div class="secondTableStyle">
											<el-checkbox class="faultStyle" v-model="item.checkAll" v-if="item.editFlag" @change="checkAllEve($event,item)"></el-checkbox>
											<a>
												干预时间
											</a>
											
										</div>
									</template>
								</el-table-column>

								<el-table-column label="干预方式">
									<template scope="scope">
										<div class="noFixed">
											<a v-for="(item,index) in scope.row.takeoverMode"
											class="textCenterClass flexWrapStyle"
											:style="{height:scope.row.takeoverMode[index].split(',').length >= 2 ? scope.row.takeoverMode[index].split(',').length*41+'px' : 82+'px'}"
											:title="item">
												<p v-for="it in item.split(',')">
													{{it}}
												</p>
											</a>
										</div>
									</template>
								</el-table-column>

							</div>
						</el-table-column>
						<el-table-column fixed align="center" show-overflow-tooltip v-if="DataCheckFlag == 1">
							<template slot="header" slot-scope="scope">
								<div class="flexStyle">
									<span class="header_load">
										<div>
											<div class="red">
												<img src="@/common/images/fault.png" alt="">
											</div>
											故障次数
											<a class="numStyle">{{item.mainData.failuresTime}}</a>
										</div>
									</span>

								</div>
							</template>
							<div class="secondMenuStyle">
								<el-table-column label="故障原因">
									<template scope="scope">
										<div class="noFixed"
											:style="{'height':scope.row.failureShowFlag == true ? (scope.row.causeOfFailure.length+1)*41+'px' : '100%'}">
											<a v-for="(item,index) in scope.row.causeOfFailure" :title="item">
												{{item}}
											</a>
											<!-- <a class="showAllStyle" style="text-align: left;"  v-show="scope.row.causeOfFailure.length > 10"  @click="scope.row.failureShowFlag = !scope.row.failureShowFlag">{{scope.row.failureShowFlag == true ? '起' : '全部'}}</a>	 -->

										</div>
									</template>
								</el-table-column>
								<el-table-column label="故障时间">
									<template scope="scope">
										<div class="noFixed">
											<a v-for="(item,index) in scope.row.failureTime" :title="item">
												{{item}}
											</a>
											<!-- <a class="showAllStyle" style="text-align: right;"  v-show="scope.row.failureTime.length > 10" @click="scope.row.failureShowFlag = !scope.row.failureShowFlag">{{scope.row.failureShowFlag == true ? '收' : '显示'}}</a>	 -->
										</div>
									</template>
								</el-table-column>
							</div>
						</el-table-column>
						<el-table-column fixed align="center" prop="name" show-overflow-tooltip>
							<template slot="header" slot-scope="scope">
								<div class="flexStyle">
									<span class="header_load">
										<div>
											<div class="blue">
												<img src="@/common/images/error.png" alt="">
											</div>
											异常次数
											<a class="numStyle">{{item.mainData.exceptionsTime}}</a>
										</div>
									</span>

								</div>
							</template>
							<div class="secondMenuStyle">
								<el-table-column label="异常情况">
									<template scope="scope">
										<div class="noFixed"
											:style="{'height':scope.row.errorShowFlag == true ? (scope.row.abnormalCondition.length+1)*41+'px' : '100%'}">
											<a v-for="(item,index) in scope.row.abnormalCondition" :title="item">
												{{item}}
											</a>
										</div>
									</template>
								</el-table-column>
								<el-table-column label="异常发生时间">
									<template scope="scope">
										<div class="noFixed">
											<a v-for="(item,index) in scope.row.abnormalOccurrenceTime" :title="item">
												{{item}}
											</a>
											<!-- <a class="showAllStyle" style="text-align: right;" v-show="scope.row.abnormalOccurrenceTime.length > 10" @click="scope.row.errorShowFlag = !scope.row.errorShowFlag">{{scope.row.errorShowFlag == true ? '收' : '显示'}}</a>	 -->
										</div>
									</template>
								</el-table-column>
							</div>
						</el-table-column>
					</el-table>
					
					
					<div class="brieflyDataList no_border" v-show="DataCheckFlag == 0">
						<div class="brieflyDataHeader">
							<div class="dataItem">
								<div class="betweenHead">
									<div class="headerContent flexStyle betFlexStyle ">
										<div>
											<img src="@/common/images/type-kache.png" alt="" class="carIcon">
											<a>{{item.mainData.deviceName}}</a>
										</div>
										<div>
											<div class="blue">
												<img src="@/common/images/error.png" alt="" class="carIconStyle">
											</div>
											<a>异常次数</a>
											<a class="numStyle">{{item.mainData.exceptionsTime}}</a>
										</div>
									</div>

								</div>
								<div class="centerContent">
									<div>
										<a>跑车趟次</a>
										<p>{{item.detailData.length}}</p>
									</div>
									<div>
										<a>出勤时长(h)</a>
										<p>{{item.mainData.attendanceTime}}</p>
									</div>
									<div>
										<a>运营时长(h)</a>
										<p>{{item.mainData.operationTime}}</p>
									</div>
								</div>
							</div>
							<div class="dataItem">
								<div class="centerHead">
									<div class="headerContent flexStyle">
										<div>
											<div class="green">
												<img src="@/common/images/takeover.png" alt="" class="carIconStyle">
											</div>
											<a>干预次数</a>
											<a class="numStyle">{{item.mainData.numberOfTakeover}}</a>
										</div>
									</div>
								</div>
								<div class="centerContent">
									<div v-if="item.countData[0] && item.countData[0].takeCaseDistinct.length > 0"
										class="errorList">
										<div class="countList"
											v-for="(ite,index) in item.countData[0].takeCaseDistinct">
											<a :title="ite">{{ite}}</a>
											<a>{{item.countData[0].takeCaseTimes[index]}}</a>
										</div>
										<div class="lineStyle"></div>
									</div>
								</div>
							</div>
							<div class="dataItem noHeight">
								<div class="centerHead">
									<div class="headerContent flexStyle">
										<div>
											<div class="red">
												<img src="@/common/images/fault.png" alt="" class="carIconStyle">
											</div>
											<a>故障次数</a>
											<a class="numStyle">{{item.mainData.failuresTime}}</a>
										</div>
									</div>
								</div>
								<div class="centerContent">
									<div v-if="item.countData[0] && item.countData[0].faultCountEntities.length > 0"
										class="errorList">
										<div class="countList"
											v-for="(ite,index) in item.countData[0].faultCountEntities">
											<div>
												<a :title="ite.faultName">{{ite.faultName}}</a>
												<a class="faultLevelStyle" :class="ite.faultLevel == '1' ? 'oneLevel' : (ite.faultLevel == '2' ? 'twoLevel' : 'thrLevel')">
												{{ite.faultLevel + '级'}}
												</a>
												<img title="重复故障" src="../../../../common/images/repeatFault.svg" v-show="ite.faultRepeat" />
											</div>
											<a>{{ite.faultNum}}</a>
										</div>
										<div class="lineStyle"></div>
									</div>
								</div>
							</div>
						</div>
						<div class="timesListContent">
							<div class="timesListHead">
								<div class="timesBox"
									v-for="item in ((item.detailData.length / 10)%1 == 0 && item.detailData.length !== 0)  ? Math.floor(item.detailData.length / 10) : Math.floor(item.detailData.length / 10) + 1">
									<p class="hasTimeStyle">趟次</p>
									<p class="hasTimeStyle">趟次时长</p>
									<p class="hasTimeStyle">趟次时间</p>
								</div>
							</div>
							<div>
								<div class="timesBox" v-for="(items,index) in item.detailData">
									<p class="hasTimeStyle">{{items.haulTimesNum}}</p>
									<p :title="items.haulAllTimes">{{items.haulAllTimes}}</p>
									<p :title="items.haulTime">{{items.haulTime}}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<manual-entry ref="manualEntry"></manual-entry>
		</div>
	</div>
</template>

<script>
	import ManualEntry from './manualEntry.vue';
	import dispatchServer from '@/api/dispatch.server';
	import dispatchMixin from '@/common/mixins/dispatch.mixins.js';
	export default {
		name: 'carTableData',
		mixins: [dispatchMixin],			
		data() {
			return {
				checkList: [1, 2, 3],
				tableData: [],
				DataCheckFlag: 0,
				brieflyDetailList: ['简要数据', '详情数据'],
				equipmentList:[],
				itemCheckList:[],
				radioCheckList:[]
			}
		},
		components: {
			ManualEntry
		},
		methods: {
			onManual() {
				this.$refs.manualEntry.openOrCloseDialog()
			},
			faultCheckEve() {
				if (!this.$parent.$parent.$parent.form.startTime) {
					this.messages.error('请选择时间')
					return
				}
				this.$parent.$parent.$parent.tableCheckEve()
			},
			brieflyDetailListEve(e) {
				this.DataCheckFlag = e;
			},
			async tableEditEve(c){
				try{
					this.tableData.forEach(c=>{
						this.cancelEditEve(c)
					})
					var result = await dispatchServer.findTakeOverReasonListEve(this.subareaSn);
					this.equipmentList = result;
					c.editFlag = true;
				}catch(e){
					this.messages.error(e.message)
				}
			},
			checkAllEve(e,c){
				c.detailData.forEach(c => { c.takeOverEditFlag = new Array(c.takeOverEditFlag.length).fill(e ? true : false)})
				this.itemCheckList = c.detailData.reduce((a,b)=>{
					a = [...a,...b.takeOverId] 
					return e ? a : []
				},[])
				console.log(this.itemCheckList)
			},
			itemCheckEve(e,c){
				!!e ? this.itemCheckList.push(c) : this.itemCheckList.splice(this.itemCheckList.indexOf(c), 1); 
				this.itemCheckList = [...new Set(this.itemCheckList)]
			},
			reasonChangeEve(e,c,y,x){
				if(this.itemCheckList.includes(e.takeOverId[c])){
					let checkFaultItem = x ? e.takeoverRetainedRemark[c] : e.takeOverRetainedReasonId[c];
						y.detailData.forEach(p=>{
						p.takeOverId.forEach((i,index)=>{
							if(this.itemCheckList.includes(i)){
									x ? p.takeoverRetainedRemark[index] = checkFaultItem : p.takeOverRetainedReasonId[index] = checkFaultItem;
								}
							})
						})
				}else{
					this.radioCheckList.push(e.takeOverId[c])
				}
				this.itemCheckList = [...new Set(this.itemCheckList)];
				this.radioCheckList = [...new Set(this.radioCheckList)];
			},
			async determineEditEve(e){
				let checkItem = this.itemCheckList.concat(this.radioCheckList);
				let params = [];
				checkItem.forEach(c=>{
					e.detailData.forEach(z=>{
						if(z.takeOverId.includes(c)){
							params.push({
								takeoverReasonId:z.takeOverRetainedReasonId[z.takeOverId.indexOf(c)],
								remark:z.takeoverRetainedRemark[z.takeOverId.indexOf(c)],
								id:z.takeOverId[z.takeOverId.indexOf(c)],
								version:'v2.3'
							})
						}
					})
				})
				try{
					var result = await dispatchServer.saveTakeReasonEve(params);
					console.log(result)
					this.$parent.$parent.$parent.tableCheckEve();
				}catch(e){
					this.messages.error(e.message)
				}
				
			},
			cancelEditEve(e){
				e.editFlag = false;
				e.detailData.forEach(c=>{
					c.takeOverEditFlag = new Array(c.takeOverEditFlag.length).fill(false);
					c.takeOverRetainedReasonId = JSON.parse(JSON.stringify(c.takeOverReasonId));
					c.takeoverRetainedRemark = JSON.parse(JSON.stringify(c.takeoverRemark));
				})
				this.itemCheckList = [];
				this.radioCheckList = [];
			}
		},

	}
</script>

<style lang="scss" scoped>
	@mixin boxFlex {
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	/deep/ .el-button {
		background: #ff5900;
		border-radius: 3px;
		color: #ffffff;
		border: none;
	}

	/deep/ .el-table--group {
		border-color: #000000;
		border-right: 1px solid #000000 !important;

	}

	.brieflyDetailList {
		color: #ffffff;
		width: 160px;
		position: absolute;
		left: 150px;
		display: flex;
		justify-content: space-around;

		span {
			border-bottom: 2px solid transparent;
			padding-bottom: 2px;
			line-height: 25px;
			cursor: pointer;
			color: #878FA5;

			&.check {
				border-bottom: 2px solid #FF5900;
				color: #ffffff;
			}
		}
	}

	.tableItemList {
		overflow: hidden;
	}

	/deep/ .el-table__fixed {
		width: 100% !important;
		height: 100% !important;

	}

	/deep/ .is-group {
		tr {
			&:nth-child(2) {
				th {
					.cell {
						border-top: 0 !important;
						background: #1B202F;
						width: 100% !important;
						justify-content: center;
					}
				}
			}
		}
	}

	.brieflyDataList {
		width: 100%;
		.brieflyDataHeader {
			display: flex;
			justify-content: space-between;
			width: 100%;

			.dataItem {
				border: 1px solid #101012;
				width: 32.5%;
				// height: auto;
				background: #27355D;
				display: block;
				color: #ffffff;
				font-size: 14px;
				height: 162px;

				&.noHeight {
					height: auto !important;
				}
			}

			.betweenHead,
			.centerHead {
				float: none;
				height: 40px;

				.headerContent {
					a {
						color: #ffffff;
						font-size: 14px;
						line-height: 42px;
						padding-left: 4px;

						&.numStyle {
							padding-left: 8px;
						}
					}

					&.betFlexStyle {
						justify-content: space-between;
						padding: 0 10px;

						.carIcon {
							font-size: 16px;
							width: 29px;
							height: 24px;
							padding-right: 5px;
						}

					}
				}
			}

			.centerContent {
				min-height: 120px;
				background: #1B202F;
				display: block;
				width: 100%;
				display: flex;
				justify-content: space-around;
				position: relative;

				div {
					padding-top: 20px;
					a {
						font-size: 13px;
					}
					p {
						font-size: 24px;
						padding-top: 10px;
						font-family: Bebas Neue, Bebas Neue-Regular;
					}
					&.errorList {
						width: 100%;
						padding: 12px 5px 12px 0;
						height: 120px;
						overflow-y: auto;
						.countList {
							width: 49%;
							padding: 0;
							display: flex;
							justify-content: space-between;
							height: 24px;
							line-height: 24px;
							float: left;
							padding-left: 15px;
							align-items: center;
							.faultLevelStyle {
								font-size: 12px;
								border-radius: 2px;
								height: 15px;
								line-height: 15px;
								padding: 0 2px;
								overflow: hidden;
								text-overflow: ellipsis;
								&.oneLevel {
									background: rgba(255, 69, 69, 0.3);
									color: #ff4545;
								}
								&.twoLevel {
									background: rgba(255, 111, 5, 0.3);
									color: rgba(255, 111, 5, 1);
								}
								&.thrLevel {
									background: rgba(255, 193, 5, 0.3);
									color: rgba(255, 193, 5, 1);
								}
							}
							div {
								padding: 0;
								display: flex;
								align-items: center;
								img{
									width: 15px;
									margin-left: 5px;
								}
								a {
									&:nth-child(2) {
										margin-left: 5px;
									}

									&:first-child {
										max-width: 85%;
										white-space: nowrap;
										overflow: hidden;
										text-overflow: ellipsis;
									}
								}
							}
						}
					}
				}
			}
			.lineStyle {
				width: 1px;
				height: calc(100% - 25px);
				background-color: #353A4A;
				position: absolute;
				left: 50%;
			}
		}

		.timesListContent {
			width: 100%;
			background-color: #252C3E;
			margin-top: 11px;
			border: 1px solid #101012;
			overflow: hidden;

			.timesBox {
				width: 9.07%;
				float: left;
				border-right: 1px solid #000000;

				p {
					border-bottom: 1px solid #000000;
					text-align: center;
					color: #BFC8D8;
					height: 30px;
					line-height: 30px;
					   width: 100%;
					    white-space: nowrap;
					    overflow: hidden;
					    text-overflow: ellipsis;
					// &:last-child{
					// 	border: none;
					// }
					&.hasTimeStyle {
						background-color: #1B202F;
					}
				}
			}

			.timesListHead {
				width: 9.29%;
				float: left;

				.timesBox {
					width: 100%;
				}
			}
		}
	}

	.carRoutemap {
		padding: 20px 20px 20px 20px;
		overflow: hidden;

		.carRoutemap_action {

			// @include boxFlex();
			.btn_search {
				position: inherit !important;
				width: 100px;
				float: left;
			}

			.no_border {
				margin: 20px 0;

				/deep/ th {
					&:first-child {
						.cell {
							border-left: none;
						}
					}
				}

				/deep/ tbody {
					tr {
						td {
							&:first-child {
								.cell {
									border-left: none;
								}
							}
						}
					}
				}

				/deep/ .cell {
					height: 100% !important;
					border-left: 1px solid #000000;
					display: flex;
					justify-content: center;
					border-bottom: 0;
					align-items: center;
					padding-left: 0 !important;

					.noFixed {
						width: 100%;
						height: 100%;

						&>a {
							border-bottom: 1px solid #000000;
							// border-bottom: none;
							display: block;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							min-height: 41px;
						}

						.reasonStyle {
							min-height: 41px;
						}

						.showAllStyle {
							color: #FF5900;
							background-color: #353A4A;
							position: absolute;
							bottom: 0;
							min-height: 41px;
							width: 100%;
							cursor: pointer;
						}

						.textCenterClass {
							display: flex;
							justify-content: center;
							align-items: center;
							// flex-wrap: wrap;
							a{
								width: 80%;
								text-align: center;
								overflow: hidden;
								    text-overflow: ellipsis;
								    white-space: nowrap;
							}
							p{
								width: 100%;
							}
							&.flexWrapStyle{
								flex-wrap: wrap;
							}
						}
						.el-checkbox{
							padding-left: 5px;
						}
						.remarkContent{
							width: 100%;
							overflow: hidden;
							    text-overflow: ellipsis;
							    white-space: nowrap;
								padding: 0 5px;
						}
						.btn_search{
							width: 100%;
							.el-input{
								width: 90% !important;
								margin: 0 auto;
							}
						}
					}

					.secondTableStyle {
						position: relative;
						width: 100%;
						
						div {
							position: absolute;
							right: -5%;
							font-size: 14px;
							cursor: pointer;
							top: 0;
						}
						.el-checkbox{
							position: absolute;
							left: 7%;
						}
					}

					&:first-child {
						text-align: center;
					}
				}

				.flexStyle {
					@include boxFlex();
					width: 100%;
					text-align: center;
					height: 100%;
					font-size: 14px;

					div {
						display: inline-block;
						display: flex;
						height: 100%;
						justify-content: space-between;
						align-items: center;
						border-radius: 3px;
						margin-right: 8px;
						font-size: 14px;

						img {
							padding: 0;
							width: 14px;
							height: 14px;
						}

						&.green {
							background: #04aa7b;
							width: 14px;
							height: 14px;
						}

						&.red {
							background: #ff4545;
							width: 14px;
							height: 14px;
						}

						&.blue {
							background: #008aff;
							width: 14px;
							height: 14px;

						}
					}

					.numStyle {
						font-size: 20px;
						font-family: Bebas Neue, Bebas Neue-Regular;
						padding-left: 15px;
					}

					.header_load {
						width: 100%;
						height: 100%;
						display: flex;
						align-items: center;
						justify-content: space-around;

						.carIconStyle {
							font-size: 16px;
							width: 29px;
							height: 24px;
							padding-right: 5px;
						}
					}

					.detailStyle {
						float: right;
						cursor: pointer;
					}
				}

			}

			.filterBox {
				height: 32px;
				line-height: 32px;

				div {
					display: inline-block;
					height: 100%;
					background: #1b202f;
					border-radius: 3px;
					padding: 0 10px;
					float: right;

					/deep/ .el-checkbox__label {
						color: #ffffff !important;
					}

					&.faultList {
						/deep/ .checkAllBut {
							padding: 0 20px 0 0px;
							margin-right: 0 !important;
						}

						/deep/ .el-checkbox-group {
							margin-right: 0 !important;

							label .el-checkbox__label {
								font-size: 12px !important;
							}
						}
					}
				}

			}

			.el-checkbox-group {
				.el-checkbox {
					color: #D7D7D7;
				}
			}
		}
	}
</style>
