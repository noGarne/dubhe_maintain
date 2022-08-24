<template>
  <!-- 编辑设备状态 -->
  <div class="standby">
    <base-dialog 
      ref="baseDialog"
      :title='title'
      @closeDialog="closeInit"
      @submitForm="submitForm">
        <div class="paddingLR">
          <!-- 设备状态 -->
          <div class="name_input_common">
            <p>{{$t("dispatch.device-status")}}<i class="red">*</i></p>
            <el-select v-model="statusInfo.equStatus" @change="changeStatus">
              <el-option
                v-for="(item,index) in statusList"
                :key="index"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </div>
          <!-- 原因种类 -->
          <div v-if="isShow" class="name_input_common">
            <p>{{$t('dispatch-set.status-reason')}}<i class="red">*</i></p>
            <el-select 
                v-model="statusInfo.reasonSn"
                name="reasonSn"
                v-validate="'required:1'"
                :data-vv-as="$t('dispatch-set.status-reason')">
              <el-option
                v-for="(item,index) in reasonList"
                :key="index"
                :label="item.reasonName"
                :value="item.reasonSn">
              </el-option>
            </el-select>
            <label class="red">{{this.formMsg(errors.items,'reasonSn')}}</label>
          </div>
          <!-- 发生时间 -->
          <div class="name_input_common" key="startTime">
            <p>{{$t('information.happen-time')}}<i class="red">*</i></p>
            <el-date-picker
                name="startTime"
                v-model="statusInfo.startTime"
                type="datetime"
                :default-value="new Date()"
                placeholder="选择发生时间" 
                :data-vv-as='$t("information.happen-time")' 
                v-validate="'required'">
            </el-date-picker>
            <label class="red">{{this.formMsg(errors.items,'startTime')}}</label>
        </div>
          <!-- 结束时间 -->
          <div class="name_input_common" key="finishTime">
            <p>{{$t('information.finish-time')}}<i class="red">*</i></p>
            <el-date-picker
                name="finishTime"
                v-model="statusInfo.finishTime"
                type="datetime"
                :default-value="new Date()"
                placeholder="选择结束时间" 
                :data-vv-as='$t("information.finish-time")' 
                v-validate="'required'">
            </el-date-picker>
            <label class="red">{{this.formMsg(errors.items,'finishTime')}}</label>
        </div>
          <!-- 延时时长 -->
          <div v-if="statusInfo.equStatus==vars.runStatus[1].code" class="name_input_common">
            <p>{{$t('dispatch.device-operation-delay-duration')}}</p>
            <el-input 
              class="group_input" 
              name="durationTime" 
              v-model="statusInfo.durationTime" 
              :data-vv-as='$t("dispatch.device-operation-delay-duration")' 
              :placeholder="$t('dispatch.device-operation-delay-duration')"
              v-validate="'max:10|after_dot:0'"
              maxlength="10"
              type="text">
            </el-input>
              <span>{{$t('dispatch.second')}}</span>
            <label class="red">{{this.formMsg(errors.items,'durationTime')}}</label>
          </div>
          <!-- 原因描述 -->
          <div class="name_input_common">
            <p>{{$t('dispatch.device-status-remark')}}</p>
            <el-input 
              class="group_input" 
              type="text"
              name="reasonComment" 
              v-model="statusInfo.reasonComment">
            </el-input>
          </div>
        </div>
      </base-dialog>
  </div>
</template>

<script>

import statusReasonServer from '@/api/statusReason.server'

import dispatchMixin from '@/common/mixins/dispatch.mixins.js';
import dispatchSetServer from '../../api/dispatchSet.server';
import informationServer from '../../api/information.server';

export default {
    name:'EditDeviceStatus',
    mixins:[dispatchMixin],
    data(){
         return {
            title:'',
            deviceInfo:{},
            statusList:[],
            reasonList:[],
            statusInfo:{
                equStatus:'',
                reasonSn:"",
                durationTime:"",
                startTime:"",
                finishTime:"",
                reasonComment:"",
            },
            isShow:false,
         }
    },
    watch:{
      reasonList(v){
        var list = v.filter(e=>e.reasonSn==this.deviceInfo.reasonSn)
        if(list.length==0){
          this.statusInfo.reasonSn=null;
        }
      }
    },
    created(){
        
    },
    methods:{
        getList(data){
            this.deviceInfo=data;
            // console.log(data);
            this.title=data.equipmentName+this.$t('information.status-edit');
            this.statusInfo=JSON.parse(JSON.stringify(data));
            this.$refs.baseDialog.toggleDialog();
            this.getDataList();
        },
        async getDataList(){
            try {
                //设备状态     
                this.statusList=this.vars.runStatus;
                this.changeStatus('init');
            } catch (e) {
                this.messages.error(e.message);
            }
        },
        async submitForm(ev){
            //验证表单
            var valid = await this.utils.validateForm(this);
            if(!valid){
              // this.messages.error(this.errors.items[0].msg);
              return;
            }
            try {
                var info = JSON.parse(JSON.stringify(this.statusInfo));
                if(info.startTime){
                  info.startTime=this.utils.formatDate(new Date(info.startTime).getTime())
                }
                if(info.finishTime){
                  info.finishTime=this.utils.formatDate(new Date(info.finishTime).getTime())
                }
                if(info.startTime && info.finishTime && info.startTime > info.finishTime){
                  this.messages.error('结束时间应大于发生时间');
                  return;
                }
                info.durationTime = parseFloat(info.durationTime);
                var result=await informationServer.editEquipmentStatusList(this.deviceInfo.id,info);
                this.$emit('updateStatus',result,this.deviceInfo.index);
                
                this.$refs.baseDialog.toggleDialog();
                this.messages.success(this.$t('action.operate-success'));
            } catch (e) {
                this.messages.error(e.message);
            }
        },
        async changeStatus(clear){
            var equStatus = this.statusInfo.equStatus;
            var deviceType = this.statusInfo.equipmentTypeSn;
            var operationStatusType = this.vars.runStatus;
            if(clear!="init"){
                this.statusInfo.reasonSn = "";
            }
            if(equStatus == operationStatusType[1].code || equStatus == operationStatusType[2].code){
                //延时/故障
                this.isShow=true;
                var result=await dispatchSetServer.getStatusReason(deviceType,equStatus);
                this.reasonList=result;
            }
            else if(equStatus == operationStatusType[0].code || equStatus == operationStatusType[3].code){
                //就绪/备用
                this.statusInfo.reasonSn="";
                this.statusInfo.durationTime="";
                this.isShow=false;
            }
        },
        closeInit(){
            this.isShow=false;
            this.deviceInfo={};
            this.statusInfo={};
            this.reasonList=[];
            this.statusInfo={
                equStatus:'',
                reasonSn:"",
                durationTime:"",
                startTime:"",
                finishTime:"",
                reasonComment:"",
            }
        },
    }
}
</script>

<style lang="scss" scoped>

</style>

