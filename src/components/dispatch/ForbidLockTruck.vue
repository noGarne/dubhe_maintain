<template>
    <!-- 卸点---采装设备锁定、禁止卸点 -->
    <div class="lock-truck lock-bar">
      <base-dialog 
      ref="baseDialog"
      :width="'620px'"
      :title='$t("action.truck")+$t("action.lock") +"/"+ $t("dispatch.info-forbidden")'
      :buttonShow="false">
        <div class="paddingLR big_content">
            <div class="choise_top">
                <div class="choise_left">{{currentDetail.shovelName}}</div>
                <div class="choise_right">
                    <p>
                        {{$t("action.truck")+$t("action.lock")}}：
                        <span v-if="lockedList.length>0">
                            <span v-for='(item,index) in lockedList' :key="index">
                                {{item.elementName}}
                                {{lockedList.length != index + 1?' | ':''}}
                            </span>
                        </span>
                        <span v-else>{{$t('action.null')}}</span>
                    </p>
                    <p>
                        {{$t("action.truck")+$t("dispatch.info-forbidden")}}：
                        <span v-if="banList.length>0">
                            <span v-for='(item,index) in banList' :key="index">
                                {{item.elementName}}
                                {{banList.length != index + 1?' | ':''}} 
                            </span>
                        </span>
                        <span v-else>{{$t('action.null')}}</span>
                    </p>
                </div>
            </div>
            <div class="wrap warp-long transfer_text">
                <el-tabs v-model="activeName" @tab-click="tabClick">
                    <!-- 卡车锁定 -->
                    <el-tab-pane :label='$t("action.truck")+$t("action.lock")' name="tab1">
                        <!-- 卸点列表、锁定卸点 -->
                        <el-transfer
                            :titles='[$t("dispatch.truck-list"), $t("action.truck")+$t("action.lock")]' 
                            v-model="lockTruck"
                            filterable 
                            :button-texts="[$t('dispatch.cancel-group'), $t('dispatch.in-group')]"
                            :data="fromList">
                        </el-transfer>
                        <button class="submitListBtn" type="button" @click="submitForm('lock')">{{$t('dispatch.true-submit')}}</button>
                    </el-tab-pane>
                    <!-- 禁止卸点 -->
                    <el-tab-pane :label='$t("action.truck")+$t("dispatch.info-forbidden")' name="tab2">
                        <!-- 卸点列表、禁止卸点 -->
                        <el-transfer 
                            :titles='[$t("dispatch.truck-list"), $t("action.truck")+$t("dispatch.info-forbidden")]' 
                            v-model="banTruck"
                            filterable 
                            :button-texts="[$t('dispatch.cancel-limit'), $t('dispatch.in-limit')]"
                            :data="fromList"
                        ></el-transfer>
                        <button class="submitListBtn" type="button" @click="submitForm('ban')">{{$t('dispatch.true-submit')}}</button>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
      </base-dialog>  
    </div>
</template>

<script>
import devicesServer from '../../api/devices.server';
import dispatchSetServer from '../../api/dispatchSet.server';


import dispatchMixin from '@/common/mixins/dispatch.mixins';

export default {
    mixins:[dispatchMixin],
    data(){
        return{
            title:'',
            activeName: 'tab1',
            activeIndex:0,
            name:'',
            currentDetail:{},
            banTruck:[],
            lockTruck:[],
            fromList:[],
            lockedList:[],
            banList:[],
        }
    },
    methods:{
        tabClick(tab, event) {
            this.activeIndex=tab.index;
        },
        getInfo(details){
            this.$refs.baseDialog.toggleDialog();
            this.currentDetail = details;
            var rule = details.rule||{};
            this.lockedList=rule.lock.truckToShovel;
            this.banList=rule.ban.truckToShovel;
            var lockArr = [];
            this.lockedList.forEach(element => {
                lockArr.push(element.elementSn);
            });
            var forbidArr = [];
            this.banList.forEach(element => {
                forbidArr.push(element.elementSn);
            });
            this.lockTruck = lockArr;
            this.banTruck = forbidArr;
            this.getList();
        },
        async getList(){
            try {
                // 卡车列表
                var info = {
                    pageSize:this.vars.pageData.pageSize,
                    pageIndex:this.vars.pageData.pageIndex,
                    equipmentTypeSn:this.vars.deviceType[0].id,
                    subareaSn:this.subareaSn,
                    isForbidden:false,
                    sort:"ASC",
                    sortName:"equipmentName"
                }
                var result = await devicesServer.devicesList(info);

                var truckList=result.content;

                var truck = truckList.map(item=>{
                    return {
                        key: item.equipmentSn,
                        label: item.equipmentName,
                        disabled: false
                    }
                });

                this.fromList=truck;

            } catch (e) {
                this.messages.error(e.message);
            }
        },
        async submitForm(type){
            var _this=this;
            try{
                
                if(!this.subareaSn||!this.currentDetail.shovelSn||!this.vars.deviceType[1].type)return;
                var banTruckData = {
                    subareaSn:this.subareaSn,//所属分区
                    ruleType:"TRUCK_TO_SHOVEL",//规则类型
                    elmtSn:this.currentDetail.shovelSn,//锁定Id
                    elmtType:this.vars.deviceType[1].type,//锁定类型
                }

                if(type=="lock"){
                    var result= await dispatchSetServer.setLockRule(banTruckData,this.lockTruck);
                }else if(type=="ban"){
                    var result= await dispatchSetServer.setBanRule(banTruckData,this.banTruck);
                }

                this.lockedList=result.lock.truckToShovel,
                this.banList=result.ban.truckToShovel,

                _this.$emit('updateForbidLockTruck',result,banTruckData);

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
@import './css/dispatch.scss';
</style>
