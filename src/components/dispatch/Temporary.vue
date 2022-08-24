<template>
    <!-- 临时指派 -->
    <div class="lock-truck">
        <base-dialog 
        ref="baseDialog"
        :title='$t("dispatch.temporary-assign")+" - "+currentDetail.truckName'
        @closeDialog="closeDialog"
        @submitForm="submitForm">
            <div class="paddingLR">
                
                <!-- 当前调度目标 -->
                <div class="name_input_common">
                    <p>{{$t('dispatch.current-dispatch-target')}}</p>
                    <el-input 
                        type="text" 
                        disabled 
                        :value="currentDetail.dispatchingObjectName?currentDetail.dispatchingObjectName:'无'">
                    </el-input>
                </div>

                <!-- 调度类型 -->
                <div class="name_input_common">
                    <p>{{$t('dispatch.dispatch-type')}}</p>
                    <el-select 
                        v-model="targetType">
                        <el-option
                            v-for="(item,index) in deviceTypeListNew"
                            :key="index"
                            :label="item.text"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <!-- 指派目标 -->
                <div class="name_input_common">
                    <p>{{$t('dispatch.assign-target')}}<i class="red">*</i></p>
                    <el-select 
                        clearable filterable 
                        v-model="assignTruckId"
                        name="assignTruckId"
                        v-validate="'required:1'"
                        :class="{unvalid:errors.has('assignTruckId')}"
                        :data-vv-as="$t('dispatch.dispatch-target')">
                        <el-option
                            v-for="(item,index) in deviceList"
                            :key="index"
                            :label="item.equipmentName"
                            :value="item.id.id">
                        </el-option>
                    </el-select>
                    <label class="red">{{this.formMsg(errors.items,'assignTruckId')}}</label>
                </div>
            </div>
        </base-dialog>
    </div>
</template>

<script>

import dispatchMixin from '@/common/mixins/dispatch.mixins';
import devicesServer from '../../api/devices.server';
import dispatchServer from '../../api/dispatch.server';
import dispatchSetServer from '../../api/dispatchSet.server';

export default {
    mixins:[dispatchMixin],
    data(){
        return{
            currentDetail:{
                dispatchingObjectType:null,
                dispatchingObjectSn:null,
                dispatchingObjectName:null
            },
            assignTruckId:null,
            truckId:"",
            targetType:'',
            targetTypeName:'',
            // parkingId:null,
            // isParking:false,
            parkingList:[],
            deviceList:[],
            // deviceTypeList:[
            //     {
            //         text:"装载任务",
            //         value:1,
            //         type:'LOAD'
            //     },
            //     {
            //         text:"卸载任务",
            //         value:2,
            //         type:'UNLOAD'
            //     },
            //     {
            //         text:"收车任务",
            //         value:3,
            //         type:'PARKING'
            //     },
            //     {
            //         text:"临时停车任务",
            //         value:4,
            //         type:'TEMPORARY_PARKING'
            //     },
            //     {
            //         text:"加油任务",
            //         value:4,
            //         type:'ADD_OIL'
            //     },
            // ],
            deviceTypeListNew:[],
            from:""
        }
    },
    watch:{
        targetType(v){
            console.log(v);
            // if(v==this.dispatchTaskType[3].value||v==this.dispatchTaskType[4].value){
            //     this.isParking=true;
            // }else{
            //     this.isParking=false;
            // }
            this.getList();
            this.assignTruckId=null;
        },
    },
    methods:{
        toggleDialog(){
            this.$refs.baseDialog.toggleDialog();
        },
        closeDialog(){
            this.currentDetail={
                dispatchingObjectType:null,
                dispatchingObjectSn:null,
                dispatchingObjectName:null
            };
            this.deviceTypeListNew = [];
            this.assignTruckId=null;
            this.truckId=null;
            this.from=null;
            this.getType='';
            this.targetTypeName='';
            // this.parkingId=null;
            // this.isParking=false;
        },
        getInfo(data,from){
            this.toggleDialog();
            this.from = from;
            this.currentDetail=data;
            var temporaryTaskType = this.dispatchTaskType.filter(
                v=>v.value!=this.dispatchTaskType[3].value&&
                v.value!=this.dispatchTaskType[4].value&&
                v.value!=this.dispatchTaskType[7].value
            );
            if(data.jobType==this.dispatchTaskType[1].value){//"UNLOAD"卸载任务
                // 允许：卸载任务/临时停车(卸点/临时停车去停车位)
                this.deviceTypeListNew = temporaryTaskType.filter(v=>v.value==this.dispatchTaskType[1].value||v.value==this.dispatchTaskType[5].value);
                this.targetType=this.dispatchTaskType[1].value;
                this.targetTypeName=this.dispatchTaskType[1].text;
            }else if(data.jobType==this.dispatchTaskType[0].value){//"LOAD"装载任务
                // 允许：装载任务/收车任务/临时停车/加油任务（采装设备/停车场/临时停车去停车位）
                this.deviceTypeListNew = temporaryTaskType.filter(v=>v.value!=this.dispatchTaskType[1].value);
                this.targetType=this.dispatchTaskType[0].value;
                this.targetTypeName=this.dispatchTaskType[0].text;
            }else if(data.jobType==this.dispatchTaskType[2].value){//"PARKING"收车任务，去停车场
                // 允许：停车场
                this.deviceTypeListNew = temporaryTaskType.filter(v=>v.value==this.dispatchTaskType[2].value);
                this.targetType=this.dispatchTaskType[2].value;
                this.targetTypeName=this.dispatchTaskType[2].text;
            }else if(data.jobType==this.dispatchTaskType[5].value){//"TEMPORARY_PARKING"临时停车，去停车位
                // 允许：临时停车
                this.deviceTypeListNew = temporaryTaskType.filter(v=>v.value==this.dispatchTaskType[5].value);
                this.targetType=this.dispatchTaskType[5].value;
                this.targetTypeName=this.dispatchTaskType[5].text;
                // this.isParking=true;
            }else if(data.jobType==this.dispatchTaskType[6].value){//"ADD_OIL"加油任务，去停车位
                // 允许：停车场
                this.deviceTypeListNew = temporaryTaskType.filter(v=>v.value==this.dispatchTaskType[6].value);
                this.targetType=this.dispatchTaskType[6].value;
                this.targetTypeName=this.dispatchTaskType[6].text;
                // this.isParking=true;
            }else if(data.jobType==this.dispatchTaskType[7].value){//"NO_GOODS"空载卸货
                // 允许：收车任务/临时停车/加油任务（停车场/临时停车去停车位）
                this.deviceTypeListNew = temporaryTaskType.filter(v=>
                    v.value==this.dispatchTaskType[2].value||
                    v.value==this.dispatchTaskType[5].value||
                    v.value==this.dispatchTaskType[6].value
                );
                this.targetType='';
                this.targetTypeName='';
            }else{
                this.deviceTypeListNew = temporaryTaskType.filter(v=>v.value!=this.dispatchTaskType[1].value);
                this.targetType=this.dispatchTaskType[0].value;
                this.targetTypeName=this.dispatchTaskType[0].text;
            }

            if(from=='list'){
                this.truckId=data.id;
                
                var type = this.utils.getObjValByKey(this.vars.deviceTypeNew,data.toIdType,'type','id')
                this.currentDetail['dispatchingObjectType']=type;

                this.currentDetail['dispatchingObjectSn']=data.toSn;
                this.currentDetail['dispatchingObjectName']=data.toName;
            }else{
                this.truckId=data.uniqueId;
            }
            this.getList();
        },
        async getList(){
            try {
                //采装设备/卸点/停车区
                var type = this.targetType;
                var equipmentTypeSn;
                if(!type){//比如'NO_GOODS'空载卸货
                    this.deviceList=[];
                    return;
                }
                switch(type){
                    case this.dispatchTaskType[0].value://LOAD
                        equipmentTypeSn=1;
                        break;
                    case this.dispatchTaskType[1].value://UNLOAD
                        equipmentTypeSn=3;
                        break;
                    case this.dispatchTaskType[2].value://PARKING
                        equipmentTypeSn=4;
                        break;
                    case this.dispatchTaskType[5].value://TEMPORARY_PARKING
                        equipmentTypeSn=4;
                        break;
                    case this.dispatchTaskType[6].value://ADD_OIL
                        equipmentTypeSn=4;
                        break;
                }
                var info = {
                    pageSize:this.vars.pageData.pageSize,
                    pageIndex:this.vars.pageData.pageIndex,
                    subareaSn:this.subareaSn,
                    isForbidden:false,
                    equipmentTypeSn:equipmentTypeSn,
                    sort:"ASC",
                    sortName:"equipmentName"
                }
                
                var result = await devicesServer.devicesList(info);
                
                this.deviceList = result.content.filter(item=>((item.equipmentTypeSn!=this.currentDetail.dispatchingObjectType)||(item.equipmentSn!=this.currentDetail.dispatchingObjectSn)));
            } catch (e) {
                this.messages.error(e.message);
            }
        },
        async submitForm(){
                    
            //验证表单
            var valid = await this.utils.validateForm(this);
            if(!valid){
                // this.messages.error(this.errors.items[0].msg);
                return;
            }
            if(this.currentDetail.dispatchingObjectSn==this.assignTruckId){
                this.messages.error('临时指派目标不能与原来调度目标相同');
                return;
            }
            
            try{
                var assignTruckId = this.assignTruckId;
                // if(this.targetType == this.dispatchTaskType[3].value||this.targetType == this.dispatchTaskType[4].value){
                //     assignTruckId = this.parkingId;
                // }
                var data = {
                    truckId:this.truckId,
                    toId:assignTruckId,
                    jobType:this.targetType
                }
                // console.log(data);
                // return;
            
                var result = await dispatchServer.temporaryAssigned(data);
                
                if(this.from=='list'){
                    this.$parent.getList();
                }else if(this.from=='dispatch'){
                    this.$emit('setTemporary',this.truckId);
                }
                this.toggleDialog();

                this.messages.success(this.$t('action.operate-success'));
            }
            catch(e){
                this.messages.error(e.message);
            }
        },
    }
}
</script>

<style lang="scss">
@import './css/dispatch.scss';
</style>
