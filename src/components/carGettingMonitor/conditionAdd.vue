<template>
	<!-- 添加用户 -->
	<div class="edit_digger conditionAdd">
		<base-dialog ref="baseDialog" :title="dialogType == 1 ? '条件选择' : (dialogType == 2 ? '保存规则' : '历史规则')" :width="'410px'" @closeDialog="closeDialog"
			@submitForm="submitUser">
			<div class="paddingLR" v-if="dialogType == 1">
				<div class="name_input_common">
					<p>日期选择<i class="red">*</i></p>
					<el-date-picker v-model="dateCheck" name="dateCheck"  collapse-tags
					:picker-options="option"
					value-format="yyyy-MM-dd"
						type="dates"  :class="{unvalid:errors.has('dateCheck')}" v-validate="'required:1'"
						:data-vv-as="$t('common.date')"
						placeholder="请选择">
					</el-date-picker>
					<label class="red">{{this.formMsg(errors.items,'dateCheck')}}</label>
				</div>
				<div class="name_input_common changeInput">
					<p>车辆选择<i class="red">*</i></p>
					<el-select clearable collapse-tags v-model="carCheck" multiple :multiple-limit="limitCheckNum"
						placeholder="请选择"
						 name="carCheck"
						v-validate="'required:1'" 
						:class="{unvalid:errors.has('carCheck')}"
						:data-vv-as="$t('dispatch.vehicle')">
						<el-option v-for="(item,index) in equipmentList" :key="index" :label="item.deviceName" :value="item.uniqueId" >
						</el-option>
					</el-select>
					<label class="red">{{this.formMsg(errors.items,'carCheck')}}</label>
				</div>
			</div>
			
			<div class="paddingLR" v-if="dialogType == 2">
				<div class="name_input_common changeInput">
					<p>规则名称<i class="red">*</i></p>
					<el-input
					  type="text" 
					  class="group_input" 
					  v-model="ruleName" 
					  :class="{unvalid:errors.has('ruleName')}"
					  placeholder="请输入规则名称" 
					  :data-vv-as='$t("lpx.rule-name")'
					  maxlength="30"
					  v-validate="'required|min:1|max:30'"
					  name="ruleName" >
					</el-input>
					<label class="red">{{this.formMsg(errors.items,'ruleName')}}</label>
				</div>
			</div>
			
			<div class="paddingLR" v-if="dialogType == 3">
				<div>
					<div v-for="(item,index) in historyList" class="labelItem">
						<!-- <el-radio v-model="historyValue" :label="item.id">{{item.rule}}</el-radio> -->
						<p :class="historyValue == item.id ? 'ruleCheckStyle' : ''" @click="ruleCheckEve(index,item)">{{item.rule}}</p>
							<a v-if="deleteIndex !== index" @click="deleteItemEve(index)"><i class="iconfont icon-shanchu themeOrangeColor" ></i></a>
							<a v-else class="deleteBox">
								<span @click="deleteIndex = ''">取消</span>
								<span class="deleteBut" @click="deleteRuleEve">删除</span>
							</a>
					</div>
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
		name: 'conditionAdd',
		  mixins: [tableMixins,dispatchMixin],
		  props:['limitCheckNum'],
		data() {
			return {
				dateCheck:[],
				carCheck:[],
				equipmentList:[],
				dialogType:false,
				ruleName:'',
				option: {
					disabledDate: (time) => {
						return this.$parent.checkDateList.includes(this.utils.formatDate(time.getTime()).split(' ')[0]) || time.getTime() > Date.now()
					}
				},
				historyList:[],
				historyValue:'',
				deleteIndex:null
			}
		},
		methods: {
			closeDialog() {
				this.roleSn = "";
				this.startTime = "";
				this.endTime = "";
				this.driveModel = "";
				this.takeoverReason = "";
				this.takeoverLevel = "";
				this.remark = "";
			},
			openCloseD() {
				this.$refs.baseDialog.toggleDialog();
				this.ruleName = '';
				this.deleteIndex = null;
				this.historyValue = this.$parent.checkRuleId;
			},
			endTimeChange(v) {
				if(!v) return;
				if (!this.startTime){
					this.endTime = this.utils.formatDate(v)
					 return
					}
				if (v <= new Date(this.startTime)) {
					this.messages.error('结束时间需大于开始时间');
					this.endTime = '';
					return false;
				} else {
					this.endTime = this.utils.formatDate(v)
				}
			},
			startTimeChange(v) {
				if(!v) return;
				if (!this.endTime){
					this.startTime = this.utils.formatDate(v)
					 return
					}
				if (v >= new Date(this.endTime)) {
					this.messages.error('结束时间需大于开始时间');
					this.startTime = '';
					return false;
				} else {
					this.startTime = this.utils.formatDate(v)
				}
			},
			openAddDialog(data) {
				this.openCloseD();
				this.getEquipmentList()
				this.dateCheck = [];
				this.carCheck = [];
				this.dialogType = data;
				this.findAllIndicatorDataHistoricalRules()
			},
			async getEquipmentList(){
				try{
				  var data={
				   miningArea:this.subareaSn
				  }
				  var result = await dispatchServer.getTakeOverList(data);
				  this.equipmentList = result || [];
				}catch(e){
				  this.messages.error(e.message)
				}
			},
			async submitUser(ev) {
			var _this = this;
			//验证表单
			var valid = await this.utils.validateForm(_this);
			if (!valid) {
				return;
			}
			if(this.dialogType == 1){
				console.log('1')
				let checkCarItem = [];
				console.log(this.carCheck)
				this.carCheck.forEach(i=>{
					checkCarItem.push(this.equipmentList.find(c=>{return c.uniqueId == i}))
				})
				console.log(checkCarItem)
				let str = {dataTime:'',deviceName:'',uniqueId:[]};
				this.dateCheck.forEach(i=>{
					str.dataTime += i+',';
					this.$parent.checkDateList.push(i)
				})
				this.carCheck.forEach((i,index)=>{
					console.log(checkCarItem[index])
					str.deviceName += checkCarItem[index]['deviceName']+',';
					str.uniqueId += checkCarItem[index]['uniqueId']+',';
				})
				this.$parent.ruleListData.push(str)
				this.openCloseD();
			}else if(this.dialogType == 2){
				console.log('2')
				let arr = [];
				let str = {
						miningArea:this.subareaSn,
						uniqueIdList:[],
						dataTimeList:[],
						stageId:this.$parent.$refs.indexAllocation.stageFlag,
						rule:this.ruleName,
						deviceNameList:[]
					}
				this.$parent.ruleListData.forEach(i=>{
					console.log(this.$parent.ruleListData)
					str.uniqueIdList.push(typeof i.uniqueId == 'object' ? i.uniqueId.join() : i.uniqueId)
					str.deviceNameList.push(i.deviceName.replace(/、/g,','))
					str.dataTimeList.push(i.dataTime.replace(/、/g,','))
				})
				this.saveIndicatorDataHistoricalRules(str)
			}else{
				if(this.historyList.length == 0 || !this.historyValue){
					this.openCloseD();
					return
				}
				let checkItem = this.historyList.find(i=> i.id == this.historyValue)
				this.$parent.checkRuleId = checkItem.id;
				this.$parent.ruleListData = checkItem.ruleChildren;
				console.log(checkItem.ruleChildren)
				let checkDateList = []
				checkItem.ruleChildren.forEach(i=>{
					checkDateList = checkDateList.concat(...(i.dataTime.substr(0, i.dataTime.length - 1).split(',')))
				})
				this.$parent.checkDateList = checkDateList;
				this.$parent.$refs.indexAllocation.stageFlag = checkItem.stageId;
				this.openCloseD();
			}
			},
			// 保存历史规则
			async saveIndicatorDataHistoricalRules(data){
				if(data.stageId == ''){
					this.messages.error('请先对阶段、指标进行配置');
					return;
				}
				try{
				  var result = await dispatchServer.saveIndicatorDataHistoricalRules(data) || [];
					this.messages.success('保存成功');
					this.openCloseD();
				}catch(e){
				  this.messages.error(e.message)
				}
			},
			// 查询历史规则
			async findAllIndicatorDataHistoricalRules() {
				this.historyList = [];
				try {
					var result = await dispatchServer.findAllIndicatorDataHistoricalRules({}) || [];
					this.historyList = result.filter(i=>{return i.miningArea == this.subareaSn});
					
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			ruleCheckEve(e,c){
				this.historyValue = c.id;
			},
			deleteItemEve(e){
				this.deleteIndex = e;
			},
			async deleteRuleEve(){
				try {
					if(this.historyList[this.deleteIndex].id == this.historyValue){
						this.$parent.ruleListData = [];
					}
					var result = await dispatchServer.deleteRuleEve({'ids':this.historyList[this.deleteIndex].id});
					result.code == 2000 && (this.messages.success(result.message),this.openCloseD())
					
				} catch (e) {
					this.messages.error(e.message)
				}
			}
		}
	}
</script>


<style lang="scss" scoped>
	.labelItem{
		padding: 7px;
		height: 45px;
		.el-radio{
			color: #D7D7D7 !important;
			font-size: 12px !important;
			line-height: 20px;
			display: flex;
			align-items: center;
			
		}
		p{
			width: 280px;
			height: 30px;
			background: #1b202f;
			border-radius: 3px;
			line-height: 30px;
			color: #ffffff;
			padding-left: 8px;
			display: inline-block;
			float: left;
			border:1px solid transparent;
			&.ruleCheckStyle{
				background: rgba(255,89,0,0.30);
				border: 1px solid #ff5900;
				transition: all 0.2s;
			}

		}
		a{
			width: 30px;
			height: 30px;
			background: #353a4a;
			border-radius: 3px;
			display: inline-block;
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;
			left: 10px;
			cursor: pointer;
		}
		.deleteBox{
			display: flex;
			justify-content: space-around;
			align-items: center;
			width: 100px;
			position: relative;
			top: -30px;
			box-shadow: 0px 5px 10px 0px rgba(0,0,0,0.30);
			left: 220px;
			span{
				color: #FFFFFF;
				font-size: 14px;
				&.deleteBut{
					color: #FF4545;
				}
			}
		}
	}
</style>
