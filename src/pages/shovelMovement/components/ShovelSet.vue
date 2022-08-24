<template>
    <!-- 添加/编辑物料 -->
    <div class="add">
    <base-dialog 
      ref="baseDialog"
      :title="$t('pages.shovel-set')"
      @closeDialog="closeInit"
      @submitForm="submitForm">
            <div class="paddingLR">
                <div class="name_input_common">
                    <p>{{$t('pages.radius')}}</p>
                    <el-input 
                        name="digRadius" 
                        type="number" 
                        v-model="currentDetail.digRadius" 
                        v-validate="'required|max:10'" 
                        maxlength="10" 
                        :data-vv-as='$t("pages.radius")' 
                        @keyup.enter.native="submitForm" 
                        :placeholder='$t("action.please-input")+$t("pages.radius")'>
                    </el-input>
                    <span>{{$t('pages.meter')}}</span>
                    <label class="red">{{this.formMsg(errors.items,'digRadius')}}</label>
                </div>
                <div class="name_input_common">
                    <p>{{$t('pages.percentage')}}</p>
                    <el-input 
                        name="percentage" 
                        type="number" 
                        v-model="currentDetail.percentage" 
                        v-validate="'required|max:3'" 
                        maxlength="3" 
                        :data-vv-as='$t("pages.percentage")' 
                        @keyup.enter.native="submitForm" 
                        :placeholder='$t("action.please-input")+$t("pages.percentage")'>
                    </el-input>
                    <span>%</span>
                    <label class="red">{{this.formMsg(errors.items,'percentage')}}</label>
                </div>
            </div>
    </base-dialog>
    </div>
</template>

<script>
import shovelMovementServer from '../js/shovelMovement.server';

export default {
    name:'ShovelSet',
    data(){
        return{
            currentDetail:{
                digRadius:null,
                percentage:null,
            },
            editIndex:null
        }
    },
    methods:{
        getInfo(data,index){
            console.log(data)
            this.editIndex = index
            this.currentDetail = JSON.parse(JSON.stringify(data))
            this.$refs.baseDialog.toggleDialog();
        },
        async submitForm(ev){
            var _this=this;
            //验证表单
            var valid = await this.utils.validateForm(_this);
            if(!valid){
            //   _this.messages.error(_this.errors.items[0].msg);
              return;
            }
            
            try{
                ev.target.disabled=true;
                //调接口
                var data=this.currentDetail;
                //调接口
                var result= await shovelMovementServer.digParam(data);
                console.log(data,result);
                this.$refs.baseDialog.toggleDialog();
                this.$parent.updateShovelSet(result,this.editIndex);
                this.messages.success(this.$t('action.operate-success'));
            }
            catch(e){
                ev.target.disabled=false;
                _this.messages.error(e.message);
            }
        },
        clickedClose(){
            this.closeInit();
        },
        closeInit(){
            this.currentDetail={
                digRadius:null,
                percentage:null
            };
            this.editIndex = null
        }
    }
}
</script>

<style lang="scss">

</style>
