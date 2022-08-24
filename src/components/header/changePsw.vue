<template>
<!-- 修改密码 -->
  <div class="change-psw">
    <base-dialog 
      ref="baseDialog"
      :title="$t('attribute.change-psw')"
      @closeDialog="closeDialog"
      @submitForm="changePswSubmit">
        <div class="paddingLR">
          <div class="name_input_common">
            <p>{{$t("login.current-password")}}<i class="red">*</i></p>
            <el-input 
              type="password" 
              class="group_input" 
              v-model="currentPassword" 
              autocomplete="new-password" 
              :placeholder="$t('attribute.current-psw')" 
              @keyup.enter.native="changePswSubmit" 
              name="currentPassword"  
              maxlength="30"
              v-validate="'required|min:6|max:30'"
              :data-vv-as='$t("login.current-password")'>
            </el-input>
            <label class="red">{{this.formMsg(errors.items,'currentPassword')}}</label>
          </div>

          
        <!-- 密码 -->
        <div class="name_input_common">
          <p>{{$t("login.new-password")}}<i class="red">*</i></p>
          <el-input 
            v-if="passwordShow"
            type="password" 
            name="newPassword"
            autocomplete="new-password"
            v-model="newPassword" 
            @keyup.enter.native="changePswSubmit" 
            maxlength="30"
            v-validate="'required|min:6|max:30'"
            :data-vv-as="$t('login.new-password')"
            :placeholder='$t("action.please-input")+$t("login.new-password")'>
          </el-input>
          <el-input 
            v-else
            type="text" 
            name="password"
            v-model="newPassword" 
            @keyup.enter.native="changePswSubmit" 
            maxlength="30"
            v-validate="'required|min:6|max:30'"
            :placeholder='$t("action.please-input")+$t("login.new-password")'
            :data-vv-as='$t("login.new-password")'>
          </el-input>
            <span @click="setPasswordShow">
              <i v-if="!passwordShow" class="iconfont icon-xianshi"></i>
              <i v-else class="iconfont icon-yincang"></i>
            </span>
            <label class="red">{{this.formMsg(errors.items,'newPassword')}}</label>
          </div>

          <!-- <div class="name_input_common">
            <p>{{$t("login.new-password")}}<i class="red">*</i></p>
            <el-input 
              type="password" 
              class="group_input" 
              v-model="newPassword" 
              autocomplete="new-password" 
              :placeholder="$t('attribute.new-psw')" 
              @keyup.enter.native="changePswSubmit" 
              name="newPassword" 
              v-validate="'required|min:6|max:30'" 
              :data-vv-as='$t("login.new-password")' 
              ref="newPassword">
            </el-input>
            <label class="red">{{this.formMsg(errors.items,'newPassword')}}</label>
          </div> -->

            
          <!-- 重复密码 -->
          <div class="name_input_common">
            <p>{{$t("login.new-password-again")}}<i class="red">*</i></p>
            <el-input 
              v-if="passwordShowRepeat"
              type="password" 
              name="repeatPassword"
              autocomplete="new-password"
              v-model="repeatPassword" 
              @keyup.enter.native="changePswSubmit" 
              maxlength="30"
              v-validate="'required|min:6|max:30'"
              :data-vv-as="$t('login.password-repeat')"
              :placeholder='$t("login.password-repeat")'>
            </el-input>
            <el-input 
              v-else
              type="text" 
              name="repeatPassword"
              v-model="repeatPassword" 
              @keyup.enter.native="changePswSubmit" 
              maxlength="30"
              v-validate="'required|min:6|max:30'"
              :data-vv-as="$t('login.password-repeat')"
              :placeholder='$t("login.password-repeat")'>
            </el-input>
              <span @click="setPasswordShowRepeat">
                <i v-if="!passwordShowRepeat" class="iconfont icon-xianshi"></i>
                <i v-else class="iconfont icon-yincang"></i>
              </span>
              <label class="red">{{this.formMsg(errors.items,'repeatPassword')}}</label>
          </div>
<!--           
          <div class="name_input_common">
            <p>{{$t("login.new-password-again")}}<i class="red">*</i></p>
            <el-input 
              type="password" 
              class="group_input" 
              v-model="repeatPassword" 
              autocomplete="new-password" 
              :placeholder="$t('attribute.repeat-psw')" 
              @keyup.enter.native="changePswSubmit" 
              name="repeatPassword" 
              v-validate="'required|min:6|max:30|confirmed:newPassword'" 
              :data-vv-as='$t("login.confirm-password")'>
            </el-input>
            <label class="red">{{this.formMsg(errors.items,'repeatPassword')}}</label>
          </div> -->
        </div>
    </base-dialog>
  </div>
</template>

<script>

import userServer from '../../api/user.server';
import { mapState, mapMutations } from 'vuex';

export default {
  name:'Attribute',
  data(){
    return {
      currentPassword: "",
      newPassword: "",
      repeatPassword:"",
      passwordShow:true,
      passwordShowRepeat:true
    }
  },
  created(){
    
  },
  computed: {
    ...mapState({
      currentUserDetails(state){
        return state.currentUserDetails
      },
      currentUser(state){
        return state.currentUser
      },
      loaderCurrent(state){
        return state.loaderCurrent
      }
    })
  },
 
  methods:{
    ...mapMutations([
      'setCurrentUserDetails',
    ]),
    closeDiggerDialog(){
      this.$refs.baseDialog.toggleDialog();
    },
    closeDialog(){
      this.currentPassword= ""
      this.newPassword= ""
      this.repeatPassword=""
    },
    setPasswordShow(){
      this.passwordShow = !this.passwordShow;
    },
    setPasswordShowRepeat(){
      this.passwordShowRepeat = !this.passwordShowRepeat;
    },
    async changePswSubmit(ev){//提交
      var {currentPassword,newPassword,repeatPassword} = this;
      var _this = this;
      //验证表单
      var valid = await this.utils.validateForm(_this);
      if(!valid){
        // _this.messages.error(_this.errors.items[0].msg);
        return;
      }
      
      if(newPassword!=repeatPassword){
          _this.messages.error(_this.$t('login.inconformity-psw'));
          return;
      }
      
      try{
        var userData={
          currentPassword: currentPassword,
          newPassword: newPassword
        }
        ev.target.disabled=true;
        var result = await userServer.changePassword(userData);
        _this.messages.success('密码更改成功')
        _this.closeDiggerDialog();
        
      }catch(e){
        ev.target.disabled=false;
        _this.messages.error(e.message)
      }
    },
    changePsw(){
      
    }
  }
}
</script>
<style lang="scss" scoped>

//添加项目 
.passwords{
  padding:20px 40px;
  flex-direction: column;
  overflow: auto;
  max-height: 400px;
  table{
    $heigth:42px;
    tr td{
      padding: 10px 0;
      font-size: 16px;
      i{
        font-size: 18px;
        color: $textGrayColor;
      }
    }
    .group_input{
      height: $heigth;
      line-height: $heigth;
      width: 286px;
      border-radius: 5px;
      border: 1px solid $borderColor;
      background: none;
      padding: 0 20px;
      box-sizing: border-box;
    }
    .file{
      input{
        visibility: hidden;
        position: absolute;
        left: 300px;
      }
      height: $heigth;
      line-height: $heigth;
      width: 95px;
      border-radius: 5px;
      background: $themeColor;
      display: block;
      color: #fff;
      text-align: center;
      cursor: pointer;
    }
  }

}
</style>