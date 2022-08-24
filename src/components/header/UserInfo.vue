<template>
<!-- 用户信息 -->
  <div class="user-info">
    <base-dialog 
      ref="baseDialog"
      :title="$t('header.user-message')"
      @closeDialog="closeDialog"
      @submitForm="formSubmit">
        <div class="paddingLR">
          <div class="name_input_common">
            <p><i class="red"> </i>{{$t("user.group-name")}}</p>
            <el-input 
              type="text" 
              class="group_input" 
              v-model="roleName"
              disabled>
            </el-input>
            <label class="red"></label>
          </div>
          <div class="name_input_common">
            <p><i class="red"> *</i>{{$t("personnel.name")}}</p>
            <el-input 
              type="text" 
              class="group_input" 
              v-model="firstName" 
              :placeholder="$t('personnel.name')" 
              :data-vv-as='$t("personnel.name")'
              maxlength="30"
              v-validate="'required|min:1|max:30'"
              @keyup.enter.native="formSubmit" 
              name="firstName" >
            </el-input>
            <label class="red">{{this.formMsg(errors.items,'firstName')}}</label>
          </div>
          <div class="name_input_common">
            <p>{{$t("login.account")}}<i class="red">*</i></p>
            <el-input 
              type="text" 
              class="group_input" 
              v-model="email" 
              :placeholder="$t('login.account')" 
              @keyup.enter.native="formSubmit" 
              name="email" 
              maxlength="30"
              v-validate="'required|email|min:6|max:30'" 
              :data-vv-as='$t("login.email")'>
            </el-input>
            <label class="red">{{this.formMsg(errors.items,'email')}}</label>
          </div>
        </div>
    </base-dialog>
  </div>
</template>

<script>

import userServer from '../../api/user.server';
import { mapState, mapMutations } from 'vuex';

export default {
  name:'UserInfo',
  data(){
    return {
      email:"",
      firstName:"",
      lastName:"",
    }
  },
  created(){
    this.getUserInfo();
  },
  computed: {
    ...mapState({
      currentUserDetails(state){
        return state.currentUserDetails
      },
    })
  },
 
  methods:{
    ...mapMutations([
      'setCurrentUserDetails',
    ]),
    closeUserDialog(){
      this.$refs.baseDialog.toggleDialog();
    },
    closeDialog(){
      this.getUserInfo();
    },
    getUserInfo(){
      var currentUserDetails=this.currentUserDetails;
      this.firstName=currentUserDetails.firstName;
      this.lastName=currentUserDetails.lastName;
      this.email=currentUserDetails.email;
      this.roleName=currentUserDetails.roleName;
    },
    async formSubmit(ev){//提交
      var {email,firstName,lastName} = this;
      var _this = this;
      //验证表单
      var valid = await this.utils.validateForm(_this);
      if(!valid){
        // _this.messages.error(_this.errors.items[0].msg);
        return;
      }
      try{
        var userData=JSON.parse(JSON.stringify(this.currentUserDetails));
        userData.firstName=firstName;
        userData.lastName=lastName;
        userData.email=email;
        ev.target.disabled=true;
        var result = await userServer.userAttribute(userData);
        //console.log(result)
        var details = JSON.parse(JSON.stringify(_this.currentUserDetails));
        details.firstName=firstName;
        details.lastName=lastName;
        details.email=email;
        _this.setCurrentUserDetails(details);
        _this.messages.success('提交成功')
        _this.closeUserDialog();
        
      }catch(e){
        ev.target.disabled=false;
        _this.messages.error(e.message)
      }
    },
  }
}
</script>
<style lang="scss" scoped>

</style>