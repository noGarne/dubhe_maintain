<template>
	<div class="contentBox">
		<base-dialog ref="baseDialog" title="手工录入" :width="'1062px'" @submitForm="onSubmit" :aloneFlag="true">

			<el-tabs v-model="currentTab" class="el-tabs--card" @tab-click="handleClick">
				<!-- <div slot="header">
				   <p>asdsadsad</p>
				</div> -->
			  <el-tab-pane label="跑车时间" name="0">
				<div class="btn_search btnSearchStyle">
					<el-button type="primary" class="btnGray" @click="uploadExcel">
						<i class="iconfont icon-daochu themeOrangeColor"></i>
						导入数据
					</el-button>
					 <input type="file" @change="fileValueChange2" ref="uploadFile2" enctype="multipart/form-data" style="display:none;">

					<el-button type="primary" class="btnGray" @click="reportExcel">
						<i class="iconfont icon-xiazai themeOrangeColor"></i>
						导出模板
					</el-button>
				</div>
				  <div class="manual_box aloneStyle">
				  	<div class="manual_box_list" v-for="item in runRiverData" :key="item.id">
				  		<div class="manual_action">
				  			<p>
				  			 <img src="@/common/images/type-kache.png" alt="">	<span>{{ item.carNum }}</span>
				  			</p>
				  
				  			<div class="btn_search">
				  				<el-button type="primary" class="btnGray" @click="addManudalDataRunRiverData(item)">
				  					<i class="iconfont icon-xinzeng themeOrangeColor"></i>
				  					{{$t('action.add')}}
				  				</el-button>
				  			</div>
				  		</div>
				  		<div class="manual_table" v-if="item.tableData.length > 0">
				  			<table>
				  				<thead>
				  					<tr>
				  						<th>阶段<i class="red">*</i></th>
				  						<th>开始时间<i class="red">*</i></th>
				  						<th>结束时间<i class="red">*</i></th>
				  					</tr>
				  				</thead>
				  				<tbody>
				  					<tr v-for="(list,index) in item.tableData" :key="list.id">
				  						<td class="select">
				  							<div class="btn_search">
				  								<el-select v-model="list['stageName']"
				  								 placeholder="请选择"
				  								 :name="'stageName'+item.carNum+index"
				  								 :class="{unvalid:errors.has('stageName'+item.carNum+index)}"
				  								  v-validate="'required:1'"
				  								  >
				  									<el-option v-for="(item) in stageListData" :label="item" :value="item"></el-option>
				  									<!-- <el-option label="正常" :value="2"></el-option> -->
				  								</el-select>
				  							</div>
				  						</td>
				  						<td class="time">
				  							<div class="btn_search">
				  								<el-date-picker style="width: 92%" v-model="list['startTime']"
				  									:name="'startTime'+item.carNum+index"
				  									:class="{unvalid:errors.has('startTime'+item.carNum+index)}" v-validate="'required:1'"
				  									type="datetime" :picker-options="option"
				  									value-format="yyyy-MM-dd HH:mm:ss"
				  									:data-vv-as="$t('common.date')"
				  									:placeholder="$t('monitoring.start-time')"
				  									:range-separator="$t('devicesLog.to')" align="right">
				  								</el-date-picker>
				  							</div>
				  						</td>
				  						<td class="time">
				  							<div class="btn_search">
				  								<el-date-picker style="width: 98%" v-model="list['endTime']" type="datetime"
				  								:name="'endTime'+item.carNum+index"
				  								:class="{unvalid:errors.has('endTime'+item.carNum+index) || new Date(list['endTime']) <= new Date(list['startTime']) }" v-validate="'required:1'"
				  									:picker-options="option" format="yyyy-MM-dd HH:mm:ss"
				  									value-format="yyyy-MM-dd HH:mm:ss"
				  									:placeholder="$t('monitoring.end-time')"
				  									:range-separator="$t('devicesLog.to')" align="right">
				  			 					</el-date-picker>
				  							</div>
				  						</td>

				  						<td class="delete">
				  							<div @click="delManudalData(index,item)">
				  								<i class="iconfont icon-shanchu"></i>
				  							</div>
				  						</td>
				  					</tr>
				  				</tbody>
				  			</table>
				  		</div>
				  	</div>
				  </div>
			  </el-tab-pane>
			  <el-tab-pane label="异常情况" name="1">
				  <div class="manual_box">
				  	<div class="manual_box_list" v-for="item in manudalData" :key="item.id">
				  		<div class="manual_action">
				  			<p>
				  			 <img src="@/common/images/type-kache.png" alt="">	<span>{{ item.carNum }}</span>
				  			</p>
				  
				  			<div class="btn_search">
				  				<el-button type="primary" class="btnGray" @click="addManudalData(item)">
				  					<i class="iconfont icon-xinzeng themeOrangeColor"></i>
				  					{{$t('action.add')}}
				  				</el-button>
				  			</div>
				  		</div>
				  		<div class="manual_table" v-if="item.tableData.length > 0">
				  			<table>
				  				<thead>
				  					<tr>
				  						<th>类型<i class="red">*</i></th>
				  						<th>开始时间<i class="red">*</i></th>
				  						<th>结束时间<i class="red">*</i></th>
				  						<th>备注<i class="red">*</i></th>
				  					</tr>
				  				</thead>
				  				<tbody>
				  					<tr v-for="(list,index) in item.tableData" :key="list.id">
				  						<td class="select">
				  							<div class="btn_search">
				  								<el-select v-model="list['exceptionType']"
				  								 placeholder="请选择"
				  								 :name="'exceptionType'+item.carNum+index"
				  								 :class="{unvalid:errors.has('exceptionType'+item.carNum+index)}"
				  								  style="width: 90%"
				  								  v-validate="'required:1'"
				  								  >
				  									<el-option label="异常" value="异常"></el-option>
				  									<!-- <el-option label="正常" :value="2"></el-option> -->
				  								</el-select>
				  							</div>
				  						</td>
				  						<td class="time">
				  							<div class="btn_search">
				  								<el-date-picker style="width: 90%" v-model="list['startTime']"
				  									:name="'startTime'+item.carNum+index"
				  									:class="{unvalid:errors.has('startTime'+item.carNum+index)}" v-validate="'required:1'"
				  									type="datetime" :picker-options="option"
				  									value-format="yyyy-MM-dd HH:mm:ss"
				  									:data-vv-as="$t('common.date')"
				  									:placeholder="$t('monitoring.start-time')"
				  									:range-separator="$t('devicesLog.to')" align="right">
				  								</el-date-picker>
				  							</div>
				  						</td>
				  						<td class="time">
				  							<div class="btn_search">
				  								<el-date-picker style="width: 90%" v-model="list['endTime']" type="datetime"
				  								:name="'endTime'+item.carNum+index"
				  								:class="{unvalid:errors.has('endTime'+item.carNum+index) || new Date(list['endTime']) <= new Date(list['startTime']) }" v-validate="'required:1'"
				  									:picker-options="option" format="yyyy-MM-dd HH:mm:ss"
				  									value-format="yyyy-MM-dd HH:mm:ss"
				  									:placeholder="$t('monitoring.end-time')"
				  									:range-separator="$t('devicesLog.to')" align="right">
				  			 					</el-date-picker>
				  							</div>
				  						</td>
				  						<td class="remark">
				  							<div class="btn_search">
				  								<el-input
				  								 v-model="list['bank']" 
				  								 :name="'bank'+item.carNum+index"
				  								 :class="{unvalid:errors.has('bank'+item.carNum+index)}"
				  								 v-validate="'required:1'"
				  								  placeholder="请输入备注"
				  								  >
				  								  </el-input>
				  							</div>
				  						</td>
				  						<td class="delete">
				  							<div @click="delManudalData(index,item)">
				  								<i class="iconfont icon-shanchu"></i>
				  							</div>
				  						</td>
				  					</tr>
				  				</tbody>
				  			</table>
				  		</div>
				  	</div>
				  </div>
			  </el-tab-pane>

			</el-tabs>
			
		</base-dialog>
	</div>
</template>

<script>
	import tableMixins from "@/common/mixins/table.mixins";
	import dispatchMixin from '@/common/mixins/dispatch.mixins.js';
	import dispatchServer from '@/api/dispatch.server';

	export default {
		name: 'ManualEntry',
		mixins: [tableMixins, dispatchMixin],
		data() {
			return {
				manudalData: [],
				dataArrList:[],
				currentTab:0,
				runRiverData:[],
				stageListData:['模拟安全员下车6小时（昼）','模拟安全员下车6小时（夜）','安全员下车6小时（昼）','安全员下车6小时（夜）','安全员下车12小时（昼夜）','安全员下车24小时']
			}
		},
		methods: {
			openOrCloseDialog() {
				this.$refs.baseDialog.toggleDialog();
				this.getTakeOverList();
				
				this.manudalData = [];
				this.runRiverData = [];
			},
			addManudalData(id) {
				id.tableData.push({
					exceptionType:'异常',
					startTime:'',
					endTime:'',
					bank:'',
					uniqueId:id.devideId,
					deviceName:id.carNum
				})
			},
			async reportExcel(){
				try {
					var result = await dispatchServer.outPutSheetsEve({miningArea:this.$parent.$parent.$parent.$parent.subareaSn});
					let blob=new Blob([result], {type:'application/vnd.ms-excel'});
					let oA=document.createElement('a');
					oA.href=URL.createObjectURL(blob);
					oA.download='安全员下车记录表';
					oA.click();
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			uploadExcel(){
				this.$refs.uploadFile2.click()
			},
			async fileValueChange2(){
				try{
					let formData = new FormData()
					formData.append('file',this.$refs.uploadFile2.files[0])
					formData.append('miningArea',this.$parent.$parent.$parent.$parent.subareaSn)
					var result = await dispatchServer.inPutSheetsEve(formData);
					!result.success ? this.messages.error(result.message) : this.messages.success(result.message)
					this.getAttendanceScheduleEve();
				}catch(e){
					this.messages.error(e.message)
				}
				
			},
			addManudalDataRunRiverData(id){
				id.tableData.push({
					stageName:'',
					startTime:'',
					endTime:'',
					uniqueId:id.devideId,
					deviceName:id.carNum,
					miningId:this.$parent.$parent.$parent.$parent.subareaSn,
					stageId:''
				})
			},
			delManudalData(index,item) {
				item.tableData.splice(index,1) 
			},
			handleClick(){
				this.manudalData.forEach((c,index)=>{
					c.tableData = [];
					this.runRiverData[index].tableData = [];
				})
				
			},
			checkDateVeri(){
				this.dataArrList = this[this.currentTab == 0 ? 'runRiverData' : 'manudalData'].reduce((a,b)=>{
					a = [...a,...b.tableData]
					return a
					},[])
				return this.dataArrList.every(i=>{return new Date(i['endTime']) > new Date(i['startTime'])})
			},
			async onSubmit() {
				var _this = this;
				//验证表单
				var valid = await this.utils.validateForm(_this);
				if (!valid) {
					return;
				}
				if(!this.checkDateVeri()){
					this.messages.error('结束时间应大于开始时间')
					return
				}
				
				this.dataArrList.forEach(c=>{
					c.stageId = this.stageListData.indexOf(c.stageName)+1
				})
				console.log(this.runRiverData)
				console.log(this.dataArrList)
				this.currentTab == 0 ? this.saveCarAll(this.dataArrList) : this.saveAll(this.dataArrList);
			},
			// 获取当前区域车辆
			async getTakeOverList() {
				var result = await dispatchServer.getTakeOverList({miningArea:this.$parent.$parent.$parent.$parent.subareaSn});
				result.forEach(i=>{
					this.manudalData.push({
						carNum: i.deviceName,
						tableData: [],
						devideId:i.uniqueId
					})
					this.runRiverData.push({
						carNum: i.deviceName,
						tableData: [],
						devideId:i.uniqueId
					})
				})
				this.getAttendanceScheduleEve();
			},
			// 获取当前日期手工录入的数据
			async getAttendanceScheduleEve() {
				var result = await dispatchServer.getAttendanceScheduleEve({miningArea:this.$parent.$parent.$parent.$parent.subareaSn,pt:this.$parent.$parent.$parent.$parent.form.startTime});
				console.log(result)
				result.data.list.forEach(c=>{
					c.startTime = this.$parent.$parent.$parent.$parent.form.startTime + ' '+c.startTime;
					c.endTime = this.$parent.$parent.$parent.$parent.form.startTime + ' '+c.endTime;
				})
				
				this.$nextTick(()=>{
					this.runRiverData.forEach(c=>{
						result.data.list.forEach(z=>{
							if(z.deviceName == c.carNum){
								c.tableData.push(z)
							}
						})
					})
				})
				console.log(this.manudalData)
			},
			// 提交手工录入数据
			async saveAll(e) {
				var result = await dispatchServer.saveAll(e);
				this.messages.success('提交成功')
				this.$refs.baseDialog.toggleDialog();
			},
			// 提交跑车时间录入数据
			async saveCarAll(e) {
				var result = await dispatchServer.saveSprotsTimesEve(e);
				this.messages.success('提交成功')
				this.$refs.baseDialog.toggleDialog();
			},
		},
	}
</script> 

<style lang="scss" scoped>
	.btnSearchStyle{
		padding: 20px 20px 0 20px;
	}
	.manual_box {
		padding: 20px;
		.manual_box_list {
			background: #1B202F;
			border-radius: 5px;
			padding: 20px;
			margin-bottom: 20px;

			.manual_action {
				display: flex;
				align-items: center;
				justify-content: space-between;

				p {
					font-size: 16px;
					font-weight: 500;
					color: #ffffff;
					display: flex;
					align-items: center;
					img{
						margin-right: 8px;
					}
				}

				.manual_add {
					padding: 3px 12px;
					background: #353a4a;
					border-radius: 3px;
					color: #ffffff;
					cursor: pointer;
					display: flex;
					align-items: center;

					.add {
						font-size: 20px;
						color: #FF5900;
						padding-right: 12px;
					}
				}
			}

			.manual_table {
				width: 100%;
				margin-top: 24px;

				table {
					width: 100%;

					thead {
						width: 100%;
						margin-bottom: 10px;

						tr {
							color: #D7D7D7;

							th {
								text-align: left;
							}
						}
					}

					tbody {
						tr {

							td {
								div {
									margin-top: 7px;
								}
							}

							.select {
								width: 14%;
							}

							.time {
								width: 24%;
								margin: 0 10px;
							}

							.remark {
								width: 29%;
								margin-right: 10px;

								.btn_search {
									.el-input {
										width: 280px;
										margin-right: 10px;
									}
								}

							}

							.delete {
								width: 5%;

								div {
									width: 32px;
									height: 32px;
									background: #353a4a;
									border-radius: 3px;
									margin-left: 10px;
									line-height: 32px;
									text-align: center;
									cursor: pointer;
									position: relative;
									top: 4px;

									.iconfont {
										color: #FF4545;
									}
								}
							}
						}
					}
				}
			}
		}
		&.aloneStyle{
			.select{
				width: 34% !important;
				padding-right: 20px;
				.btn_search{
						/deep/ .el-select{
							width: 100% !important;
							.el-input{
								width: 100% !important;
							}
						}
				}
			}
			
		}
	}
</style>
