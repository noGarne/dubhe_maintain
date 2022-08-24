<template>
  <!-- 确认提示框 -->
  <div class="confirm-container">
    <el-dialog
      :visible.sync="isShowDialog" 
      v-if="isShowDialog"
      :fullscreen="fullscreen"
      :modal-append-to-body="isBoolean" 
      :append-to-body="isBoolean"
      :close-on-click-modal="false" 
      :width="'420px'"
      :show-close="false"
      custom-class="confrim-style"
      @submitForm="submitForm">
        <div slot="title">
            <i class="iconfont icon-tishi dialog-title-icon"></i>{{title}}
            <i class="iconfont icon-guanbi dialog_close" @click="toggleDialog"></i>
            <!-- <i class="iconfont fullscreen" @click="isFullscreen" :class="{'icon-zuidahua':!fullscreen,'icon-suohui':fullscreen}"></i> -->
        </div>
        <div class="paddingLR">
          <!-- 提示内容 -->
          <p v-if="innerContent">{{innerContent}}</p>
          <!-- 提示详情 -->
          <p class="msg" v-if="innerDetail">{{innerDetail}}</p>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="toggleDialog">取消</el-button>
            <el-button type="primary" @click="submitForm">确定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return{
      isBoolean:true,
      isShowDialog:false,
      fullscreen:false,
      title:'',
      innerContent:'',
      innerDetail:'',
      fnSubmit:null
    }
  },
  methods:{
    toggleDialog(b){
      if(b==false){
          this.isShowDialog = false;
      } else if(b==true){
          this.isShowDialog = true;
      }else {
          this.isShowDialog = !this.isShowDialog;
          if(!this.isShowDialog){
              this.colseDialog();
          }
      }
    },
    colseDialog(){
        // this.$emit('closeDialog');
    },
    isFullscreen(){
        this.fullscreen=!this.fullscreen;
    },
    clickedOutside(){
        if(this.outsideClose){
            this.colseDialog();
        }
    },
    // 显示确认弹框
    showConfirm(options,fnSubmit){
      // options弹框内容
      this.title = options.title || '提示';
      this.innerContent = options.content || '';
      this.innerDetail = options.detail || '';
      // fnSubmit确定操作回调函数
      this.fnSubmit = fnSubmit;
      // this.$refs.baseDialog.toggleDialog();
      this.toggleDialog();
    },
    // 确定操作
    submitForm(){
      // this.$refs.baseDialog.toggleDialog();
      this.toggleDialog();
      this.fnSubmit && this.fnSubmit();
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
    // color: $textWhiteColor;
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
.fullscreen{
    float: right;
    margin-right: 40px;
    margin-top: 4px;
    cursor: pointer;
    translate: all 0.3s;
}

.dialog_close{
    float: right;
    margin-top: 4px;
    cursor: pointer;
    translate: all 0.3s;
    color: $textGrayColor;
    &:hover{
      color: $themeGrayHover3;
    }
}
.dialog-title-icon{
    margin-right: 10px;
    color: #8E96AC;
}

.el-dialog__wrapper {
  .el-dialog{
    background: $themeContentBg !important;
    border-radius: 0;
    overflow: hidden;
  }
  
  .el-dialog__header{
    padding: 10px 18px;
    background: $headerTitle !important;
    color: $themeContentColor;
    border-bottom: 1px solid $borderBlack;
    font-size: 16px;
    .el-dialog__headerbtn{
        top: 11px;
        .el-dialog__close{
            color: $textGrayColor;
            border: 2px solid $textGrayColor;
            font-size: 12px;
            // font-weight: bold;
            // line-height: 12px;
            // height: 16px;
            // width: 16px;
            // overflow: hidden;
        }
    }
  }
  .el-dialog__footer{
    padding: 0 40px 40px;
    &>div{
        display: flex;
        justify-content: flex-end;
    }
    .el-button--default{
      float: left;
    }
    .el-button{
      height: 32px;
      padding: 4px 25px;
      border-radius: 0;
      border: 1px solid $headerTitle;
      background: $headerTitle;
      color: #fff;
      font-size: 14px;
      cursor: pointer;
      &:hover{
        opacity: 0.9;   
      }
    }
    .el-button--primary{
        background: $themeOrange;
        color: #fff !important;
    }
  }
}

.confrim-style{
  .el-dialog__footer > div{
    justify-content: center !important;
  }
}
</style>