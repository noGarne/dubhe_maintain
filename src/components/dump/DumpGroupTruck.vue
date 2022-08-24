<template>
    <!-- 采装设备禁止锁定卸点 -->
    <div class="lock-truck lock-bar">
      <base-dialog 
      ref="baseDialog"
      :width="'620px'"
      :title='$t("dispatch.info-group")'
      @submitForm="submitGroup">
      <!-- :buttonShow="false" -->
        <div class="paddingLR big_content">
            <div class="choise_top">
                <div class="choise_left">{{currentDetail.dumpName}}</div>
                <div class="choise_right">
                    <p>
                        {{$t("dispatch.truck-group")}}：
                        <span v-if="lockedList.length>0">
                            <span v-for='(item,index) in lockedList' :key="index">
                                {{item.elementName}}
                                {{lockedList.length != index + 1?' | ':''}}
                            </span>
                        </span>
                        <span v-else>{{$t('action.null')}}</span>
                    </p>
                </div>
            </div>
            <div class="wrap warp-long transfer_text">
                <el-transfer
                    filterable
                    :titles='[$t("dispatch.truck-list"), $t("dispatch.truck-group")]' 
                    v-model="lockTruck"
                    :button-texts="[$t('dispatch.cancel-group'), $t('dispatch.in-group')]"
                    :data="fromList">
                </el-transfer>
            </div>
        </div>
      </base-dialog>  
    </div>
</template>

<script>
import dispatchMixin from '@/common/mixins/dispatch.mixins';
import dispatchServer from '../../api/dispatch.server';
import subareaServer from '../../api/subarea.server';
import devicesServer from '../../api/devices.server';
import dispatchSetServer from '../../api/dispatchSet.server';

export default {
    mixins:[dispatchMixin],
    data(){
        return{
            title:'',
            activeName: 'tab1',
            currentDetail:{},
            lockTruck:[],
            fromList:[],
            lockedList:[],
        }
    },
    methods:{
        getInfo(details){
            this.$refs.baseDialog.toggleDialog();
            this.currentDetail = details;

            this.lockedList=details.rule.lock.truckToDumpArea;
            
            this.setList();
            this.getList();
        },
        async getList(){
            try {
                //卸点
                var info = {
                    pageSize:this.vars.pageData.pageSize,
                    pageIndex:0,
                    equipmentTypeSn:this.vars.deviceType[0].id,
                    subareaSn:this.subareaSn,
                    isForbidden:false,
                    sort:"ASC",
                    sortName:"equipmentName"
                }
                var result = await devicesServer.devicesList(info);
                //console.log(result)
                var list=result.content;
                    
                var truckList = list.map(item=>{
                    return {
                        key: item.equipmentSn,
                        label: item.equipmentName,
                        disabled: false
                    }
                });

                this.fromList=truckList;

            } catch (e) {
                this.messages.error(e.message);
            }
        },
        setList(){
            var lockArr = [];
            this.lockedList.forEach(element => {
                lockArr.push(element.elementSn);
            });
            
            this.lockTruck = lockArr;
        },
        // sha(){},
        async submitGroup(ev){
            var _this=this;
            try{
                if(!this.subareaSn||!this.currentDetail.dumpSn)return;
               var lockForbidData = {
                    subareaSn:this.subareaSn,//所属分区
                    ruleType:"TRUCK_TO_DUMPAREA",//规则类型
                    elmtSn:this.currentDetail.dumpSn,//锁定Id
                    elmtType:this.vars.deviceType[2].type,//锁定类型
                }
                var result= await dispatchSetServer.setLockRule(lockForbidData,this.lockTruck);

                _this.lockedList=result.lock.truckToDumpArea;

                _this.setList();
                
                _this.$emit('updateDumpGroupTruck',result);
                
                this.$refs.baseDialog.toggleDialog();
                _this.messages.success(_this.$t('action.operate-success'));
            }
            catch(e){
                _this.messages.error(e.message);
            }
        },
    }
}
</script>

<style lang="scss" >
@import '../dispatch/css/dispatch.scss';
</style>
