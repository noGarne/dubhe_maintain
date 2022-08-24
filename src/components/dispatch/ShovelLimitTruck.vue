<template>
    <!-- 卸点---采装设备锁定、禁止卸点 -->
    <div class="lock-truck lock-bar">
      <base-dialog 
      ref="baseDialog"
      :width="'620px'"
      :title='$t("dispatch.info-limit")'
      @submitForm="submitGroup">
        <div class="paddingLR big_content">
            <div class="choise_top">
                <div class="choise_left">{{currentDetail.shovelName}}</div>
                <div class="choise_right">
                    <p>
                        {{$t("dispatch.truck-limit")}}：
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
                <el-transfer 
                    :titles='[$t("dispatch.truck-list"), $t("dispatch.truck-limit")]' 
                    v-model="banTruck"
                    filterable 
                    :button-texts="[$t('dispatch.cancel-limit'), $t('dispatch.in-limit')]"
                    :data="fromList"
                ></el-transfer>
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
            fromList:[],
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
            
            this.banList=details.rule.ban.truckToShovel;
           
            var forbidArr = [];
            this.banList.forEach(element => {
                forbidArr.push(element.elementSn);
            });
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
        async submitGroup(type){
            var _this=this;
            try{
                
                var banTruckData = {
                    subareaSn:this.subareaSn,//所属分区
                    ruleType:"TRUCK_TO_SHOVEL",//规则类型
                    elmtSn:this.currentDetail.shovelSn,//锁定Id
                    elmtType:this.vars.deviceType[1].type,//锁定类型
                }

                var result= await dispatchSetServer.setBanRule(banTruckData,this.banTruck);

                this.banList=result.ban.truckToShovel,

                _this.$emit('updateShovelGroupTruck',result,banTruckData);
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
@import './css/dispatch.scss';
</style>
