<template>
    <!-- 采装设备禁止锁定卸点 -->
    <div class="lock-truck lock-bar">
      <base-dialog 
      ref="baseDialog"
      :width="'620px'"
      :title='$t("dispatch.info-digger")+$t("action.lock") +"/"+ $t("dispatch.info-forbidden")'
      :buttonShow="false">
        <div class="paddingLR big_content">
            <div class="choise_top">
                <div class="choise_left">{{currentDetail.dumpName}}</div>
                <div class="choise_right">
                    <p>
                        采装设备锁定：
                        <span v-if="lockedList.length>0">
                            <span v-for='(item,index) in lockedList' :key="index">
                                {{item.elementName}}
                                {{lockedList.length != index + 1?' | ':''}}
                            </span>
                        </span>
                        <span v-else>{{$t('action.null')}}</span>
                    </p>
                    <p>
                        采装设备禁止：
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
                    <!-- 禁止采装设备 -->
                    <el-tab-pane :label='$t("dispatch.info-digger")+$t("action.lock")' name="tab1">
                        <!-- 卸点列表、锁定卸点 -->
                        <el-transfer
                                filterable
                                :titles='[$t("dispatch.digger-list"), $t("dispatch.info-digger")+$t("action.lock")]' 
                                v-model="lockShovel"
                            :button-texts="[$t('dispatch.cancel-group'), $t('dispatch.in-group')]"
                            :data="fromList">
                        </el-transfer>
                        <button class="submitListBtn" type="button" @click="submitForm('lock')">{{$t('dispatch.true-submit')}}</button>
                    </el-tab-pane>
                    <!-- 禁止卸点 -->
                    <el-tab-pane :label='$t("dispatch.info-digger")+$t("dispatch.info-forbidden")' name="tab2">
                        <!-- 卸点列表、禁止卸点 -->
                        <el-transfer 
                                filterable
                                :titles='[$t("dispatch.digger-list"), $t("dispatch.info-digger")+$t("dispatch.info-forbidden")]' 
                                v-model="banShovel"
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
import dispatchSetServer from '../../api/dispatchSet.server';
import devicesServer from '../../api/devices.server';
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
            banShovel:[],
            lockShovel:[],
            fromList:[],
            lockedList:[],
            banList:[]
        }
    },
    methods:{
        tabClick(tab, event) {
            this.activeIndex=tab.index;
        },
        getInfo(details,lock,ban){
            this.$refs.baseDialog.toggleDialog();
            console.log(details);
            this.currentDetail = details;
            
            this.lockedList=details.rule.lock.shovelToDumpArea;
            this.banList=details.rule.ban.shovelToDumpArea;

            this.setList();
            this.getList();
        },
        setList(){
            var lockArr = [];
            this.lockedList.forEach(element => {
                lockArr.push(element.elementSn);
            });
            var banArr = [];
            this.banList.forEach(element => {
                banArr.push(element.elementSn);
            });
            this.lockShovel = lockArr;
            this.banShovel = banArr;
        },
        async getList(){
            try {
                //矿卡
                var info = {
                    pageSize:this.vars.pageData.pageSize,
                    pageIndex:0,
                    equipmentTypeSn:this.vars.deviceType[1].id,
                    subareaSn:this.subareaSn,
                    isForbidden:false,
                    sort:"ASC",
                    sortName:"equipmentName"
                }
                var result = await devicesServer.devicesList(info);
                //console.log(result)
                var list=result.content;
                    
                var shovelList = list.map(item=>{
                    return {
                        key: item.equipmentSn,
                        label: item.equipmentName,
                        disabled: false
                    }
                });

                this.fromList=shovelList;

            } catch (e) {
                this.messages.error(e.message);
            }
        },
        async submitForm(type){
            var _this=this;
            try{
                if(!this.subareaSn||!this.currentDetail.dumpSn)return;
               var lockForbidData = {
                    subareaSn:this.subareaSn,//所属分区
                    ruleType:"SHOVEL_TO_DUMPAREA",//规则类型
                    elmtSn:this.currentDetail.dumpSn,//锁定Id
                    elmtType:this.vars.deviceType[2].type,//锁定类型
                }
                if(type=="lock"){
                    var result= await dispatchSetServer.setLockRule(lockForbidData,this.lockShovel);
                }else if(type=="ban"){
                    var result= await dispatchSetServer.setBanRule(lockForbidData,this.banShovel);
                }

                _this.lockedList=result.lock.shovelToDumpArea,
                _this.banList=result.ban.shovelToDumpArea,
                _this.setList();

                _this.$emit('updateForbidLockDigger',result);

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
