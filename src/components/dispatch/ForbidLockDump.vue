<template>
    <!-- 采装设备禁止锁定卸点 -->
    <div class="lock-truck lock-bar">
      <base-dialog 
      ref="baseDialog"
      :width="'620px'"
      :title='$t("action.lock") +"/"+ $t("dispatch.info-forbidden-dumparea")'
      :buttonShow="false">
        <div class="paddingLR big_content">
            <div class="choise_top">
                <div class="choise_left">{{currentDetail.shovelName}}</div>
                <div class="choise_right">
                    <p>
                        {{$t("dispatch.info-lock-dumparea")}}：
                        <span v-if="lockedList.length>0">
                            <span v-for='(item,index) in lockedList' :key="index">
                                {{item.psvElementName}}
                                {{lockedList.length != index + 1?' | ':''}}
                            </span>
                        </span>
                        <span v-else>{{$t('action.null')}}</span>
                    </p>
                    <p>
                        {{$t("dispatch.info-forbidden-dumparea")}}：
                        <span v-if="banList.length>0">
                            <span v-for='(item,index) in banList' :key="index">
                                {{item.psvElementName}}
                                {{banList.length != index + 1?' | ':''}} 
                            </span>
                        </span>
                        <span v-else>{{$t('action.null')}}</span>
                    </p>
                </div>
            </div>
            <div class="wrap warp-long transfer_text">
                <el-tabs v-model="activeName" @tab-click="tabClick">
                    <!-- 禁止采装设备 -->
                    <el-tab-pane :label='$t("dispatch.info-lock-dumparea")' name="tab1">
                        <!-- 卸点列表、锁定卸点 -->
                        <el-transfer
                            :titles='[$t("dispatch.dump-list"), $t("dispatch.info-lock-dumparea")]' 
                            v-model="lockDump"
                            filterable  
                            :button-texts="[$t('dispatch.cancel-group'), $t('dispatch.in-group')]"
                            :data="fromList">
                        </el-transfer>
                        <button class="submitListBtn" type="button" @click="submitForm('lock')">{{$t('dispatch.true-submit')}}</button>
                    </el-tab-pane>
                    <!-- 禁止卸点 -->
                    <el-tab-pane :label='$t("dispatch.info-forbidden-dumparea")' name="tab2">
                        <!-- 卸点列表、禁止卸点 -->
                        <el-transfer 
                            :titles='[$t("dispatch.dump-list"), $t("dispatch.info-forbidden-dumparea")]' 
                            v-model="forbidDump" 
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
import dispatchServer from '../../api/dispatch.server';
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
            forbidDump:[],
            lockDump:[],
            fromList:[],
            lockedList:[],
            banList:[]
        }
    },
    methods:{
        tabClick(tab, event) {
            this.activeIndex=tab.index;
        },
        getInfo(details){
            console.log(details)
            this.$refs.baseDialog.toggleDialog();
            this.lockedList=details.rule.lock.shovelToDumpArea;
            this.banList=details.rule.ban.shovelToDumpArea;
            this.currentDetail = details;
            
            this.setList();
            this.getList();
        },
        setList(){
            var lockArr = [];
            this.lockedList.forEach(element => {
                lockArr.push(element.psvElementSn);
            });
            var forbidArr = [];
            this.banList.forEach(element => {
                forbidArr.push(element.psvElementSn);
            });
            this.lockDump = lockArr;
            this.forbidDump = forbidArr;
        },
        async getList(){
            try {
                //卸点
                var info = {
                    pageSize:this.vars.pageData.pageSize,
                    pageIndex:0,
                    equipmentTypeSn:this.vars.deviceType[2].id,
                    subareaSn:this.subareaSn,
                    isForbidden:false,
                    sort:"ASC",
                    sortName:"equipmentName"
                }
                var result = await devicesServer.devicesList(info);
                var dumpList=result.content;

                    
                var dump = dumpList.map(item=>{
                    return {
                        key: item.equipmentSn,
                        label: item.equipmentName,
                        disabled: false
                    }
                });

                this.fromList=dump;

            } catch (e) {
                this.messages.error(e.message);
            }
        },
        async submitForm(type){
            var _this=this;
            try{
                // ev.target.disabled=true;
                //调接口
                if(!this.subareaSn||!this.currentDetail.shovelSn||!this.vars.deviceType[1].type)return;
                var lockForbidDumpData = {
                    subareaSn:this.subareaSn,//所属分区
                    ruleType:"SHOVEL_TO_DUMPAREA",//规则类型
                    elmtSn:this.currentDetail.shovelSn,//锁定Id
                    elmtType:this.vars.deviceType[1].type,//锁定类型
                }
                if(type=="lock"){
                    var result= await dispatchSetServer.setLockRule(lockForbidDumpData,this.lockDump);
                }else if(type=="ban"){
                    var result= await dispatchSetServer.setBanRule(lockForbidDumpData,this.forbidDump);
                }
                
                _this.lockedList=result.lock.shovelToDumpArea,
                _this.banList=result.ban.shovelToDumpArea,
                _this.setList();

                _this.$emit('updateForbidLockDump',result);
                
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
