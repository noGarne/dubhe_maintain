<template>
    <!-- 矿卡锁定采装设备/卸点/物料 -->
    <div class="lock-truck">
      <base-dialog 
      ref="baseDialog"
      :width="'620px'"
      :title='$t("dispatch.info-group")'
      :buttonShow="false">
        <div class="paddingLR big_content">
            <div class="choise_top">
                <div class="choise_left">{{currentDetail.truckName}}</div>
                <div class="choise_right">
                    <p>
                        {{$t("dispatch.group-shovel")}}：
                        <span v-if="updateShovel.length>0">
                            <span v-for='(item,index) in updateShovel' :key="index">
                                {{item.psvElementName}}
                                {{updateShovel.length != index + 1?' | ':''}}
                            </span>
                        </span>
                        <span v-else>{{$t('action.null')}}</span>
                    </p>
                    <p>
                        {{$t("dispatch.group-dump")}}：
                        <span v-if="updateDump.length>0">
                            <span v-for='(item,index) in updateDump' :key="index">
                                {{item.psvElementName}}
                                {{updateDump.length != index + 1?' | ':''}} 
                            </span>
                        </span>
                        <span v-else>{{$t('action.null')}}</span>
                    </p>
                    <p>
                        {{$t("dispatch.group-material")}}：
                        <span v-if="updateMaterial.length>0">
                            <span v-for='(item,index) in updateMaterial' :key="index">
                                {{item.psvElementName}}
                                {{updateMaterial.length != index + 1?' | ':''}} 
                            </span>
                        </span>
                        <span v-else>{{$t('action.null')}}</span>
                    </p>
                </div>
            </div>

            <div class="wrap warp-long transfer_text">
                <el-tabs class="tabs_no_border" v-model="activeName" @tab-click="tabClick">
                    <!-- 锁定采装设备 -->
                    <el-tab-pane :label='$t("dispatch.group-shovel")' :name="vars.ruleType[1].name">
                        <el-transfer
                            :titles='[$t("dispatch.digger-list"), $t("dispatch.group-shovel")]' 
                            v-model="currentShovel"
                            filterable 
                            :button-texts="[$t('dispatch.cancel-group'), $t('dispatch.in-group')]"
                            :data="diggerList">
                        </el-transfer>
                        <button class="submitListBtn" type="button" @click="submitForm">{{$t('dispatch.true-submit')}}</button>
                    </el-tab-pane>
                    <!-- 锁定卸点 -->
                    <el-tab-pane :label='$t("dispatch.group-dump")' :name="vars.ruleType[0].name">
                        <el-transfer
                            :titles='[$t("dispatch.dump-list"), $t("dispatch.group-dump")]' 
                            v-model="currentDump" 
                            filterable 
                            :button-texts="[$t('dispatch.cancel-group'), $t('dispatch.in-group')]"
                            :data="dumpList">
                        </el-transfer>
                        <button class="submitListBtn" type="button" @click="submitForm">{{$t('dispatch.true-submit')}}</button>

                    </el-tab-pane>
                    <!-- 锁定物料 -->
                    <el-tab-pane :label='$t("dispatch.group-material")' :name="vars.ruleType[2].name">
                        
                        <el-transfer
                            :titles='[$t("material.material-list"), $t("dispatch.group-material")]' 
                            v-model="currentMaterial" 
                            filterable 
                            :button-texts="[$t('dispatch.cancel-group'), $t('dispatch.in-group')]"
                            :data="materialList">
                        </el-transfer>
                        <button class="submitListBtn" type="button" @click="submitForm">{{$t('dispatch.true-submit')}}</button>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
      </base-dialog>  
    </div>
</template>

<script>

import dispatchMixin from '@/common/mixins/dispatch.mixins';
import subareaServer from '../../api/subarea.server'
import materialServer from '../../api/material.server';
import dispatchSet from '../../api/dispatchSet.server';
import devicesServer from '../../api/devices.server';

export default {
    mixins:[dispatchMixin],
    data(){
        return{
            title:'',
            activeName: '',
            currentDetail:{},
            currentShovel:[],
            currentDump:[],
            currentMaterial:[],
            diggerList:[],
            dumpList:[],
            materialList:[],
            updateShovel:[],
            updateDump:[],
            updateMaterial:[]
        }
    },
    methods:{
        tabClick(tab) {
            this.activeName=tab.name;
        },
        getInfo(data){
            this.activeName=this.vars.ruleType[1].name;
            this.currentDetail=data;
            this.updateShovel = this.currentDetail.rule.lock.truckToShovel || [];
            this.updateDump = this.currentDetail.rule.lock.truckToDumpArea || [];
            this.updateMaterial = this.currentDetail.rule.lock.truckToMaterial || [];
            this.getList();
            this.currentShovel=this.getLockIds(this.currentDetail.rule.lock.truckToShovel);
            this.currentDump=this.getLockIds(this.currentDetail.rule.lock.truckToDumpArea);
            this.currentMaterial=this.getLockIds(this.currentDetail.rule.lock.truckToMaterial);
            this.$refs.baseDialog.toggleDialog();
        },
        async getList(){
            try {
                //采装设备

                var info = {
                    pageSize:this.vars.pageData.pageSize,
                    pageIndex:this.vars.pageData.pageIndex,
                    subareaSn:this.subareaSn,
                    isForbidden:false,
                    sort:"ASC",
                    sortName:"equipmentName"
                }
                
                var result = await devicesServer.devicesList(info);

                var diggerList = result.content.filter(v=>v.equipmentTypeSn==this.vars.deviceType[1].id);
                this.diggerList = diggerList.map(item=>{
                    return {
                        key: item.equipmentSn,
                        label: item.equipmentName,
                        disabled: false
                    }
                });
                var dumpList = result.content.filter(v=>v.equipmentTypeSn==this.vars.deviceType[2].id);

                //卸点
                this.dumpList = dumpList.map(item=>{
                    return {
                        key: item.equipmentSn,
                        label: item.equipmentName,
                        disabled: false
                    }
                });

                //物料
                var result3 = await materialServer.getMaterialCategoryList();
                this.materialList = result3.map(item=>{
                    return {
                        key: item.materialSn,
                        label: item.materialName,
                        disabled: false
                    }
                });

            } catch (e) {
                this.messages.error(e.message);
            }
        },
        async submitForm(){
            try{
                
                if(!this.subareaSn||!this.currentDetail.truckSn||!this.vars.deviceType[0].type)return;
                var data={
                    subareaSn:this.subareaSn,
                    ruleType:this.activeName,
                    elmtSn:this.currentDetail.truckSn,
                    elmtType:this.vars.deviceType[0].type
                };
                var currentData=[];
                if(this.activeName==this.vars.ruleType[0].name){
                    currentData=this.currentDump;
                } else if(this.activeName==this.vars.ruleType[1].name){
                    currentData=this.currentShovel;
                } else if(this.activeName==this.vars.ruleType[2].name){
                    currentData=this.currentMaterial;
                }
                var result = await dispatchSet.setLockRule(data,currentData);

                this.updateShovel = result.lock.truckToShovel || [];
                this.updateDump = result.lock.truckToDumpArea || [];
                this.updateMaterial = result.lock.truckToMaterial || [];
                this.$emit('updateTruckRule',result)
                this.messages.success(this.$t('action.operate-success'));
            }
            catch(e){
                this.messages.error(e.message);
            }
        },
        getLockIds(arr){
            return (arr || []).map(item=>item.psvElementSn);
        }
    }
}
</script>

<style lang="scss">
@import './css/dispatch.scss';
</style>
