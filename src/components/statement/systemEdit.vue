<template>
	<!-- 审核/编辑系统 -->
	<div class="edit_digger">
		<base-dialog ref="baseDialog" :title="titleStatus ? $t('dispatch.audit') : $t('action.edit')" :width="'800px'" @closeDialog="closeDialog"
			@submitForm="submitSystem">
			<div class="paddingLR paddingLR2">
			
				<!-- 审核状态 -->
				<!-- <div class="name_input_common">
					<p>{{$t("dispatch.audit-status")}}<i class="red">*</i></p>
					<el-select clearable filterable v-model="auditStatus"
						:placeholder="$t('action.select')+$t('dispatch.audit-status')" name="auditStatus"
						v-validate="'required:1'" :class="{unvalid:errors.has('auditStatus')}"
						:data-vv-as="$t('dispatch.audit-status')">
						<el-option v-for="(item,index) in examineStatusList" :key="index" :label="item.name" :value="item.value">
						</el-option>
					</el-select>
					<label class="red">{{this.formMsg(errors.items,'auditStatus')}}</label>
				</div> -->
				<!-- 有效性 -->
				<!-- <div class="name_input_common" v-if="auditStatus == 1">
					<p>{{$t("device.isAvailable")}} <i class="red">*</i></p>
					<el-select clearable filterable v-model="isAvailable" 
					v-validate="'required:1'" :class="{unvalid:errors.has('isAvailable')}" :data-vv-as="$t('device.isAvailable')"
						:placeholder="$t('action.select')+$t('dispatch.audit-status')" name="isAvailable" >
						<el-option  label="有效" value="1"></el-option>
						<el-option  label="无效" value="2"></el-option>
						
					</el-select>
					<label class="red">{{this.formMsg(errors.items,'isAvailable')}}</label>
				</div> -->
				<!-- 接管原因 -->
				<!-- <div class="name_input_common"  v-if="auditStatus == 1">
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
					v-validate="'required:1'" :class="{unvalid:errors.has('takeoverReason')}" :data-vv-as="$t('device.takeover-reason')"
						:placeholder="$t('action.select')+$t('dispatch.takeover-reason')" name="takeoverReason">
						<el-option v-for="(item,index) in takeOverReasonList" :key="index" :label="item.name" :value="item.value">
						</el-option>
					</el-select>
					<label class="red">{{this.formMsg(errors.items,'takeoverReason')}}</label>
				</div> -->

				<!-- 接管等级 -->
				<!-- <div class="name_input_common">
					<p>{{$t("dispatch.takeover-level")}}</p>
					<el-select clearable filterable v-model="faultlevel"
						:placeholder="$t('action.select')+$t('dispatch.fault-level')" name="faultlevel">
						<el-option v-for="(item,index) in taksOverLevelist" :key="index" :label="item.name" :value="item.value">
						</el-option>
					</el-select> -->
					<!-- <label class="red">{{this.formMsg(errors.items,'faultlevel')}}</label> -->
				<!-- </div> -->

				<!-- 备注 -->
				<div class="name_input_common">
					<p>{{$t("dispatch.device-operation-remark")}}</p>
					<el-input type="text" v-model="remark" name="remark" autocomplete="off"
						placeholder='请输入备注,最多支持30字'>
					</el-input>
					<!-- <label class="red">{{this.formMsg(errors.items,'remark')}}</label> -->
				</div>

			</div>
		</base-dialog>
	</div>
</template>

<script>
	import systemServer from '../../api/system.server'
	import dispatchServer from '../../api/dispatch.server';
	export default {
		name: 'systemEdit',
		props:['subareaSn'],
		data() {
			return {
				auditStatus: "",
				takeoverReason: "",
				isAvailable:"",
				titleStatus:false,
				takeOverReasonList:[
					{name:'系统问题',value:0},
					{name:'管理问题',value:1},
					{name:'其他问题',value:3},
				],
				examineStatusList:[
					{name:'待审核',value:0},
					{name:'已通过',value:1},
					{name:'未通过',value:2},
				],
				taksOverLevelist:[
					{name:'严重接管',value:0},
					{name:'告警接管',value:1},
					{name:'一般接管',value:2},
				],
				faultlevel: "",
				remark: "",
				deviceId:"",
				id:""

			}
		},
		methods: {
			closeDialog() {
				this.auditStatus = "";
				this.takeoverReason = "";
				this.faultlevel = "";
				this.remark = "";
			},
			openCloseD() {
				this.$refs.baseDialog.toggleDialog();
			},
			openAddDialog(e) {
				console.log(e)
				this.titleStatus = e.state == 0 ? true : false;
				this.openCloseD();
				this.getRote();
				this.editData = e;
				this.auditStatus = e.state;
				this.isAvailable = e.isAvailable ? e.isAvailable.toString() : '';
				this.takeoverReason = e.reason;
				this.faultlevel = e.takeoverLevel;
				this.remark = e.remark;
			},
			async getRote() {

			},
			async submitSystem(ev) {

				var _this = this;
				//验证表单
				var valid = await this.utils.validateForm(_this);
				if (!valid) {
					return;
				}
				this.editData.state = this.auditStatus;
				this.editData.reason = this.takeoverReason;
				this.editData.takeoverLevel = this.faultlevel;
				this.editData.remark = this.remark;
				this.editData.isAvailable = this.auditStatus == 1 ? this.isAvailable : '';
				 var result = await dispatchServer.updatetakeoverdataEve(this.editData)
				 this.messages.success(this.$t('action.operate-success'));
				 this.openCloseD();
				 this.$parent.getList();
			}
		}
	}
</script>


<style lang="scss" scoped>

</style>
