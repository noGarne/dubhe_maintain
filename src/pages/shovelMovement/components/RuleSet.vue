<template>
    <!-- 添加/编辑物料 -->
    <div class="add">
    <base-dialog 
      ref="baseDialog"
      :width="'600px'"
      :title="$t('pages.digger-rule-set')"
      @closeDialog="closeInit"
      :buttonShow="false">
            <div class="rule_main_con">
                <div class="rule_left leftMenu">
                    <el-menu default-active="1" @select="menuChange">
                        <el-menu-item index="1">
                            <span slot="title">{{$t('pages.build-rule')}}</span>
                        </el-menu-item>
                        <!-- <el-menu-item index="2">
                            <span slot="title">{{$t('pages.shovel-bind')}}</span>
                        </el-menu-item> -->
                    </el-menu>
                </div>
                <div class="rule_main">
                    <div class="build_rule" v-if="currentTab==1">
                        <div class="paddingLR">
                            <div class="name_input_common">
                                <p>{{$t('pages.shovel-bind')}}<i class="red">*</i></p>
                                <el-select 
                                    clearable 
                                    filterable 
                                    v-model="currentDetatil.shovelSn" 
                                    name="bindShovel" 
                                    key="bindShovel"
                                    :class="{unvalid:errors.has('bindShovel')}"
                                    v-validate="'required:1'" 
                                    :data-vv-as='$t("pages.shovel-bind")'>
                                    <el-option
                                        v-for="(item,index) in shovelList"
                                        :key="index"
                                        :label="item.shovelName"
                                        :value="item.shovelSn">
                                    </el-option>
                                </el-select>
                                <label class="red">{{this.formMsg(errors.items,'bindShovel')}}</label>
                            </div>
                            <div class="name_input_common">
                                <p>{{$t('pages.build-rule')}}<i class="red">*</i></p>
                                <el-select 
                                    clearable 
                                    filterable 
                                    v-model="currentDetatil.digWay" 
                                    key="buildRule"
                                    name="buildRule"
                                    v-validate="currentTab==1?'required:1':''" 
                                    :class="{unvalid:errors.has('buildRule')}"
                                    :data-vv-as='$t("pages.build-rule")'>
                                    <el-option
                                        v-for="(item,index) in ruleList"
                                        :key="index"
                                        :label="item.name"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <label class="red">{{this.formMsg(errors.items,'buildRule')}}</label>
                            </div>
                            <div class="name_input_common">
                                <p>{{$t('pages.rule-describe')}}</p>
                                <el-input
                                    type="textarea"
                                    :rows="2"
                                    :placeholder="$t('action.input')+$t('pages.rule-describe')"
                                    v-model="currentDetatil.digWayDesc">
                                    </el-input>
                            </div>
                            <div class="name_input_common">
                                <p>预览</p>
                                <div class="img_preview">
                                    <img v-if="currentDetatil.digWay==ruleList[0].value" src="../images/path.png" alt="">
                                    <img v-if="currentDetatil.digWay==ruleList[1].value" src="../images/path2.png" alt="">
                                </div>
                            </div>
                        </div>
                        <div class="dialog_footer">
                            <button type="button" @click="closeDialog">取消</button>
                            <button type="button" class="save btnBg" @click="submitRule">确定</button>
                        </div>
                    </div>
                    <!-- <div class="shovel_bind" v-if="currentTab==2">
                        <div class="paddingLR">
                            <div class="name_input_common">
                                <p>{{$t('device.digger')}}<i class="red">*</i></p>
                                <el-select 
                                    clearable 
                                    filterable 
                                    v-model="currentDetatil.shovelSn" 
                                    name="bindShovel"  
                                    key="bindShovel"
                                    :class="{unvalid:errors.has('bindShovel')}"
                                    v-validate="currentTab==2?'required:1':''" 
                                    :data-vv-as='$t("device.digger")'>
                                    <el-option
                                        v-for="(item,index) in shovelList"
                                        :key="index"
                                        :label="item.equipmentName"
                                        :value="item.equipmentSn">
                                    </el-option>
                                </el-select>
                                <label class="red">{{this.formMsg(errors.items,'bindShovel')}}</label>
                            </div>

                            
                            <div class="dialog_footer">
                                <button type="button" @click="closeDialog">取消</button>
                                <button type="button" class="save btnBg" @click="submitBind">确定</button>
                            </div>
                        </div>
                       
                    </div> -->
                </div>
            </div>
    </base-dialog>
    </div>
</template>

<script>
import devicesServer from '../../../api/devices.server'
import shovelMovementServer from '../js/shovelMovement.server'
import dispatchMixin from '@/common/mixins/dispatch.mixins.js';

export default {
    name:'RuleSet',
    mixins:[dispatchMixin],
    data(){
        return{
            radius:null,
            currentTab:1,
            ruleList:[
                {
                    name:"之字形",
                    value:'TYPE_ONE',
                },
                {
                    name:"分条幅",
                    value:'TYPE_TWO',
                }
            ],
            currentDetatil:{
                shovelSn: null,
                digWay: "", 
                digWayDesc: ""
            },
            shovelList:[]
        }
    },
    watch:{
        
    },
    methods:{
        getInfo(data,index){
            this.getShovelList()
            this.$refs.baseDialog.toggleDialog();
            this.currentDetatil=JSON.parse(JSON.stringify(data));
        },
        async getShovelList(){
            try {
                var data = {
                    subareaSn:this.subareaSn,
                    hasDigParam:true
                };
                var result = await shovelMovementServer.getShovelList(data);
                // console.log(data,result)
                this.shovelList = result;
            } catch (e) {
                this.messages.error(e.message);
            }
            
        },
        
        menuChange(e){
            this.currentTab=e;
        },
        async submitRule(ev){//生成规则
            var _this=this;
            //验证表单
            var valid = await this.utils.validateForm(_this);
            if(!valid){
              return;
            }
            // 查找采装设备参数
            var data = this.currentDetatil;
            var shovelList = this.shovelList;
            var len = shovelList.length;
            for(var i=0;i<len;i++){
                if(shovelList[i].shovelSn==data.shovelSn){
                    data['percentage']=shovelList[i].percentage;
                    data['digRadius']=shovelList[i].digRadius;
                    break;
                }
            }
            
            console.log(data)
            this.$parent.updateDetails(data);
            this.$refs.baseDialog.toggleDialog();
        },
        async submitBind(ev){//采装设备绑定
            var _this=this;
            //验证表单
            var valid = await this.utils.validateForm(_this);
            if(!valid){
              return;
            }
            //验证表单
            console.log(this.currentDetatil)
        },
        closeDialog(){
            this.closeInit();
            this.$refs.baseDialog.toggleDialog();
        },
        closeInit(){
            this.currentDetatil={
                shovelSn: null,
                digWay: "", 
                digWayDesc: ""
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.rule_main_con{
    display: flex;
    // width: 600px;
    min-height: 520px;
    height: 100%;
    .leftMenu{
        padding-top: 0;
    }
    .rule_left{
        width: 170px;
        float: left;
        padding-top: 20px;
        box-sizing: border-box;
        height: 100%;
        border-right: 1px solid #ddd;
    }
    .rule_main{
        float: left;
        position: relative;
        width: 90%;
        // .shovel_bind{
        //     .paddingLR{
        //         width: 590px;
        //     }
        // }
        .img_preview{
            margin-top: 10px;
            border:1px solid $borderColor;
            padding: 15px;
            display: inline-block;
            img{
                width: 200px;
                height: 100px;
            }
        }
        .dialog_footer{
            position: absolute;
            bottom: 0;
            right: 0;
            padding: 0 20px 20px;
            button{
                height: 32px;
                padding: 4px 15px;
                background: #f4f4f4;
                border-radius: 3px;
                border: 1px solid #dcdfe6;
                color: #666;
                font-size: 14px;
                cursor: pointer;
                margin-left: 20px;
                &:hover{
                    background: #efefef;
                }
            }
        }
    }
}
</style>

<style lang="scss">
.rule_main_con{
    .el-transfer{
        margin: 0;
        .el-transfer__button{
            border-radius: 5px;
            height: 46px;
            width: 56px;
            span{
                font-size: 18px;
            }
        }
        .el-transfer-panel{
            height: 400px;
        }
    }
    .el-transfer-panel__list.is-filterable{
        height: 280px;
    }
}
</style>
