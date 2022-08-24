<template>
    <!-- 添加/编辑物料 -->
    <div class="add">
    <base-dialog 
      ref="baseDialog"
      :title="title"
      @closeDialog="closeInit"
      @submitForm="submitForm">
            <div class="paddingLR">
                <div class="name_input_common">
                    <p>{{$t('pages.digger-name')}}</p>
                    <el-input 
                        name="name" 
                        type="text" 
                        v-model="currentDetail.name" 
                        v-validate="'required|max:30|check_name'" 
                        maxlength="30" 
                        :data-vv-as='$t("pages.digger-name")' 
                        @keyup.enter.native="submitForm" 
                        :placeholder='$t("action.please-input")+$t("pages.digger-name")'>
                    </el-input>
                    <label class="red">{{this.formMsg(errors.items,'name')}}</label>
                </div>
            </div>
    </base-dialog>
    
    </div>
</template>

<script>
import shovelMovementServer from '../js/shovelMovement.server';
import dispatchMixin from '@/common/mixins/dispatch.mixins.js';

export default {
    name:'AddDiggerArea',
    mixins:[dispatchMixin],
    data(){
        return{
            title:'',
            // name:'',
            currentDetail:{
                name:""
            },
            editIndex:null,
            isEdit:false
        }
    },
    methods:{
        getInfo(info,index){
            // console.log(info)
            if(!info){
                this.editIndex=null;
                this.isEdit=false;
                this.title = this.$t('pages.add-digger-area');
            }else{
                this.editIndex=index;
                this.isEdit=true;
                this.currentDetail = JSON.parse(JSON.stringify(info));
                this.title = this.$t('pages.edit-digger-area');
            }
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
                if(!this.isEdit){
                     //添加
                    var data={
                        name:this.currentDetail.name,
                        subareaSn:this.subareaSn
                    };
                    //调接口
                    var result= await shovelMovementServer.editDiggingArea(data);
                    // console.log(data,result);
                    this.$parent.updateDiggerArea(result);
                    this.$refs.baseDialog.toggleDialog();
                }
                else {
                   //编辑
                    var data=this.currentDetail;
                    var result= await shovelMovementServer.editDiggingArea(data);
                    this.$parent.updateDiggerArea(result,this.editIndex,true);
                    this.$refs.baseDialog.toggleDialog();
                }
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
            this.title='';
            this.editIndex=null;
            this.isEdit=false;
            this.currentDetail={
                name:""
            };
        }
    }
}
</script>

<style lang="scss">

</style>
