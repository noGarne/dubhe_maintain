<template>
  <!-- 确认提示框 -->
  <div class="confirm-container">
     <base-dialog 
      ref="baseDialog"
      :title='title'
      dialogStyle="confrim-style"
      :showIcon='true'
      @submitForm="submitForm">
        <div class="paddingLR">
          <!-- 提示内容 -->
          <p v-if="innerContent">{{innerContent}}</p>
          <!-- 提示详情 -->
          <p class="msg" v-if="innerDetail">{{innerDetail}}</p>
        </div>
      </base-dialog>
  </div>
</template>

<script>
export default {
  props:{
    title:{
      type:String,
      default(){
        return this.$t("action.tips")
      }
    },
    content:{
      type:String,
      default:''
    },
    detail:{
      type:String,
      default:''
    }
  },
  data(){
    return{
      innerContent:'',
      innerDetail:'',
      fnSubmit:null
    }
  },
  methods:{
    // 显示确认弹框
    showConfirm(options,fnSubmit){
      // options弹框内容
      this.innerContent = options.content || this.content;
      this.innerDetail = options.detail || this.detail;
      // fnSubmit确定操作回调函数
      this.fnSubmit = fnSubmit;
      this.$refs.baseDialog.toggleDialog();
    },
    // 确定操作
    submitForm(){
      this.$refs.baseDialog.toggleDialog();
      if(typeof this.fnSubmit  === 'function'){
        this.fnSubmit();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.paddingLR{
  min-height:80px;
  padding: 40px 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  p{
    // color: $themeContentColor;
    @include theme-content-color;
    font-size: 18px;
    &.msg{
      // color: $themeContentColor;
      @include theme-content-color;
      font-size: 16px;
      padding-top: 10px;
    }
  }
}
</style>
<style lang="scss">
.confrim-style{
  .el-dialog__footer > div{
    justify-content: center !important;
  }
}
</style>