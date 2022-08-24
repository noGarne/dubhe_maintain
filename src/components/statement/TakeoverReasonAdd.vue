<template>
	<!-- 添加用户 -->
	<div class="edit_digger">
		<base-dialog ref="baseDialog" :title="addOrEdit ? '新增接管原因' : '编辑接管原因'" :width="'400px'" @closeDialog="closeDialog"
			@submitForm="submitUser">
			<div class="paddingLR">
				<!-- 接管原因 -->
				<div class="name_input_common searchStyle">
					<p>{{$t("dispatch.takeover-reason")}}
					<i class="red">*</i>
					</p>
					<el-autocomplete type="text" v-model="checkItem.takeoverReason" 
					 :data-vv-as="$t('dispatch.takeover-reason')"
					 placeholder='请输入' 
					 :fetch-suggestions="querySearchAsync"
					 name="takeoverReason"
					 v-validate="'required:2'"
					 :class="{unvalid:errors.has('takeoverReason')}"
					  >
					</el-autocomplete>
					<label class="red">{{this.formMsg(errors.items,'takeoverReason')}}</label>
				</div>

				<!-- 有效性 -->
				<div class="name_input_common">
					<p>{{$t('device.isAvailable')}}
					<i class="red">*</i>
					</p>
					<el-select clearable filterable v-model="checkItem.isEffective"
						v-validate="'required:1'" :class="{unvalid:errors.has('isEffective')}" :data-vv-as="$t('device.isAvailable')"
						:placeholder="$t('action.select')+$t('device.isAvailable')" name="isEffective"
						>
						<el-option v-for="(item,index) in isEffectiveList"  :label="item.name" :value="item.value">
						</el-option>
					</el-select>
					<label class="red">{{this.formMsg(errors.items,'isEffective')}}</label>
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
		name: 'TakeoverReasonAdd',
		mixins: [tableMixins,dispatchMixin],
		data() {
			return {
				checkItem:{
					isEffective:null,
					takeoverReason:'',
				},
				addOrEdit:true,
				isEffectiveList:[{name:"无效",value:'0'},{name:"系统因素",value:'1'},{name:"环境因素",value:'2'}],
				takeoverReasonList:[]
			}
		},
		methods: {
			async submitUser(){
				var _this = this;
				//验证表单
				var valid = await this.utils.validateForm(_this);
				if (!valid) {
					return;
				}
				let data = {
					takeoverReason:this.checkItem.takeoverReason,
					miningArea:this.subareaSn,
					isEffective:this.checkItem.isEffective
				}
				try {
					var result = !this.addOrEdit ? await dispatchServer.updateTakeOverReasonEve(this.checkItem) : await dispatchServer.saveTakeOverReasonEve(data);
					this.messages.success(this.$t('action.operate-success'));
					this.openCloseD();
					this.$parent.findTakeOverReasonByPageItemEve();
					this.$parent.findTakeOverReasonListEve();
				} catch (e) {
					this.messages.error(e.message)
				}
				
			},
			closeDialog() {
				this.isEffective = '';
				this.takeoverReason = '';
				
			},
			openCloseD() {
				this.$refs.baseDialog.toggleDialog();
			},
			openAddDialog(data) {
				this.findTakeOverReasonListEve()
				this.openCloseD();
				this.addOrEdit = data ? false : true;
				this.checkItem = {
					isEffective:null,
					takeoverReason:'',
				};
				if(data){
					let c = JSON.parse(JSON.stringify(data))
					this.checkItem = c;
					this.checkItem.isEffective = String(c.isEffective)
				}
			},
			async findTakeOverReasonListEve() {
				try {
					var result = await dispatchServer.findTakeOverReasonListEve(this.subareaSn);
					result.forEach(c=>{
						c.value = c.takeoverReason
					})
					this.takeoverReasonList = result.filter(c=> !['系统问题','管理问题'].includes(c.takeoverReason));
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			querySearchAsync(queryString, cb){
				 var restaurants = this.takeoverReasonList;
				 var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
				cb(results);
			},
			createStateFilter(queryString) {
			        return (state) => {
			         return (state.takeoverReason.toLowerCase().includes(queryString.toLowerCase()));
			        };
			},
		}
	}
</script>


<style lang="scss" scoped>
/deep/ .searchStyle{
	input{
		width: 320px !important;
	}
}
/deep/ .el-autocomplete-suggestion{
	background: #353A4A !important;
}
</style>
