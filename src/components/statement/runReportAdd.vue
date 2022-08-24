<template>
	<!-- 添加用户 -->
	<div class="edit_digger">
		<base-dialog ref="baseDialog" title="接管原因" :width="'400px'" @closeDialog="closeDialog"
			@submitForm="submitUser">
			<div class="paddingLR">
				<!-- 设备编号-->
				<div class="name_input_common">
					<p>{{$t("device.takeover-reason")}}<i class="red">*</i></p>
					<el-select clearable filterable v-model="roleSn"
						:placeholder="$t('action.select')+$t('device.takeover-reason')" name="roleSn"
						v-validate="'required:1'" :class="{unvalid:errors.has('roleSn')}"
						:data-vv-as="$t('device.takeover-reason')">
						<el-option v-for="(item,index) in equipmentList" :key="index" :label="item.takeoverReason" :value="item.takeoverReason" >
						</el-option>
					</el-select>
					<label class="red">{{this.formMsg(errors.items,'roleSn')}}</label>
				</div>
				<!-- 接管开始时间 -->
				<!-- <div class="name_input_common">
					<p>{{$t("vehicleLog.start-time")}}<i class="red">*</i></p>
					<el-date-picker v-model="startTime" name="startTime" @change="startTimeChange" :picker-options="option"
						type="datetime"  :class="{unvalid:errors.has('startTime')}" v-validate="'required:1'"
						:data-vv-as="$t('vehicleLog.start-time')"
						:placeholder="$t('action.select')+$t('vehicleLog.start-time')">
					</el-date-picker>
					<label class="red">{{this.formMsg(errors.items,'startTime')}}</label>
				</div> -->

				<!-- 接管结束时间 -->
				<!-- <div class="name_input_common">
					<p>{{$t("vehicleLog.end-time")}}<i class="red">*</i></p>
					<el-date-picker v-model="endTime" name="endTime"  type="datetime" 
						:class="{unvalid:errors.has('endTime')}" v-validate="'required:1'" @change="endTimeChange" :picker-options="option"
						:data-vv-as="$t('vehicleLog.end-time')"
						:placeholder="$t('action.select')+$t('vehicleLog.end-time')">
					</el-date-picker>
					<label class="red">{{this.formMsg(errors.items,'endTime')}}</label>
				</div>
 -->

				<!-- 后续驾驶模式 -->
				<!-- <div class="name_input_common">
					<p>{{$t("dispatch.drive-model")}}<i class="red">*</i></p>
					<el-select clearable filterable v-model="driveModel"
						:placeholder="$t('action.select')+$t('dispatch.drive-model')" name="driveModel"
						v-validate="'required:1'" :class="{unvalid:errors.has('driveModel')}"
						:data-vv-as="$t('dispatch.drive-model')">
						<el-option v-for="(item,index) in driveModelist" :key="index" :label="item.name" :value="item.value">
						</el-option>
					</el-select>
					<label class="red">{{this.formMsg(errors.items,'driveModel')}}</label>
				</div> -->
				<!-- 接管原因 -->
				<!-- <div class="name_input_common">
					<p>{{$t("dispatch.takeover-reason")}}
					<i class="red">*</i>
					<el-tooltip popper-class="tooltip" placement="top">
						<i class="iconfont icon-shuoming"></i>
						<div slot="content" class="tooltip-content">
							<div><p>系统问题：由于自动驾驶系统本身问题引起的接管，如主控通信异常，主控掉线，感知误限停，偏离主路径，货斗举升异常等；</p>
							<p>管理问题：由于系统不适应现场环境导致的接管，如排土场有土堆，排土线有问题，电缆，避让工程车等；</p>
							<p>其他问题：计划外接管原因中除了上面三种原因以外的接管原因，为保证原因的准确性。</p></div>
						</div>
					</el-tooltip>
					</p>
					<el-select clearable filterable v-model="takeoverReason"
						v-validate="'required:1'" :class="{unvalid:errors.has('takeoverReason')}" :data-vv-as="$t('dispatch.takeover-reason')"
						:placeholder="$t('action.select')+$t('dispatch.takeover-reason')" name="takeoverReason"
						>
						<el-option v-for="(item,index) in takeOverReasonList" :key="index" :label="item.name" :value="item.value">
						</el-option>
					</el-select>
					<label class="red">{{this.formMsg(errors.items,'takeoverReason')}}</label>
				</div>
 -->
				<!-- 接管等级 -->
				<!-- <div class="name_input_common">
					<p>{{$t("dispatch.takeover-level")}}</p>
					<el-select clearable filterable v-model="takeoverLevel"
						:placeholder="$t('action.select')+$t('dispatch.takeover-level')" name="takeoverLevel"
						>
						<el-option v-for="(item,index) in taksOverLevelist" :key="index" :label="item.name" :value="item.value">
						</el-option>
					</el-select> -->
				<!-- </div> -->

				<!-- 备注 -->
				<div class="name_input_common">
					<p>{{$t("dispatch.device-operation-remark")}}</p>
					<el-input type="textarea" v-model="CheckItem.remark"   class="alarm-input"
						placeholder='请输入备注'>
					</el-input>
					<!-- <label class="red">{{this.formMsg(errors.items,'remark')}}</label> -->
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
		name: 'runReportAdd',
		  mixins: [tableMixins,dispatchMixin],
		data() {
			return {
				firstName: "",
				roleSn: null,
				editFlag:false,
				startTime: "",
				endTime: "",
				driveModel: "",
				equipmentList:"",
				takeoverReason: "",
				option:{
					disabledDate:(time)=> {
					    return time.getTime() > Date.now();
					}
				},
				editId:null,
				driveModelist:[
					{name:'人工驾驶',value:0},
					{name:'自动驾驶',value:1},
					{name:'遥控驾驶',value:2},
				],
				takeOverReasonList:[
					{name:'系统问题',value:0},
					{name:'管理问题',value:1},
					{name:'其他问题',value:3},
				],
				taksOverLevelist:[
					{name:'严重接管',value:0},
					{name:'告警接管',value:1},
					{name:'一般接管',value:2},
				],
				takeoverLevel: "",
				remark: "",
				roleList: [],
				CheckItem:{}
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
			},
			openCloseD() {
				this.$refs.baseDialog.toggleDialog();
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
				this.editFlag = false;
				this.openCloseD();
				this.getEquipmentList();
				if (data) {
					console.log(data)
					this.roleSn = data.reasonName;
					this.CheckItem = JSON.parse(JSON.stringify(data));
				}
			},
			async getEquipmentList(){
				try{

				var result = await dispatchServer.findTakeOverReasonListEve(this.subareaSn);
				this.equipmentList = result;
				console.log(this.equipmentList)
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
				let check = this.equipmentList.find(c=> c.takeoverReason == this.roleSn)
				console.log(check)
				let {takeoverReasonId,isEffective} = check;
				let {version,remark,id} = this.CheckItem
				let data = {
					   takeoverReasonId, 
					    isEffective,	
						version,
						id,
					    remark,
				}
				 var result =  await dispatchServer.saveTakeReasonEve([data]);
				 this.messages.success(this.$t('action.operate-success'));
				 this.openCloseD();
				 this.$parent.getList();
			}
		}
	}
</script>


<style lang="scss" scoped>

</style>
