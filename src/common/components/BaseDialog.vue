<template>
<!-- 弹出框 -->
<div>
    <el-dialog 
        :visible.sync="isShowDialog" 
        v-if="isShowDialog"
		:class="aloneFlag ? 'aloneFlagStyle' : ''"
        :fullscreen="fullscreen"
        :modal-append-to-body="isBoolean" 
        :append-to-body="isBoolean"
        :close-on-click-modal="outsideClose" 
        :width="width"
        :show-close="false"
        :custom-class="dialogStyle"
        @close="colseDialog"
        @submitForm="submitForm">
        <div slot="title">
            <i class="iconfont icon-tishi dialog-title-icon" v-if="showIcon"></i>{{title}}
            <slot name="title"></slot>
            <i class="iconfont icon-guanbi dialog_close" v-if="showXClose" @click="toggleDialog"></i>
            <!-- <i class="iconfont fullscreen" @click="isFullscreen" :class="{'icon-zuidahua':!fullscreen,'icon-suohui':fullscreen}"></i> -->
        </div>
        <slot></slot>
        <div slot="footer" class="dialog-footer" v-if="buttonShow">
            <!-- <slot name="footer"></slot> -->
            <el-button v-if="closeShow" @click="toggleDialog">{{closeText}}</el-button>
            <el-button v-if="submitShow" type="primary" @click="submitForm">{{submitText}}</el-button>
        </div>
    </el-dialog>

</div>
</template>

<script>
export default {data(){
        return{
            isBoolean:true,
            isShowDialog:false,
            fullscreen:false
        }
    },
    props:{
        title:{
            type:String,
            default:''
        },
        width:{
            type:String,
            default:'420px'
        },
        buttonShow:{
            type: Boolean,
            default: true
        },
        submitShow:{
            type: Boolean,
            default: true
        },
        closeShow:{
            type: Boolean,
            default: true
        },
        closeText:{
            type:String,
            default:function(){
                return this.$t('action.cancel')
            }
        },
        submitText:{
            type:String,
            default:function(){
                return this.$t('action.ok')
            }
        },
        outsideClose:{
            type: Boolean,
            default: false
        },
        showXClose:{
            type: Boolean,
            default: true
        },
        dialogStyle:{
            type: String,
            default:''
        },
        showIcon:{
            type:Boolean,
            default:false
        },
		aloneFlag:{
		    type:Boolean,
		    default:false
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
        submitForm(ev){
            this.$emit('submitForm',ev);
        },
        colseDialog(){
            this.$emit('closeDialog');
            if(this.$parent.$parent.getIndex>=0){
                this.$parent.$parent.getIndex="";
            }
        },
        isFullscreen(){
            this.fullscreen=!this.fullscreen;
        },
        clickedOutside(){
            if(this.outsideClose){
                this.colseDialog();
            }
        }
    }
}
</script>

<style lang="scss">
	.el-dialog{
		max-height: calc(100% - 70px);
	}
.fullscreen{
    float: right;
    margin-right: 40px;
    margin-top: 4px;
    cursor: pointer;
    translate: all 0.3s;
}
.aloneFlagStyle{
	.el-dialog__header{
		.dialog_close{
			position: absolute;
			right: 20px;
			z-index: 1000;
		}
	}
	.el-dialog__body{
		.el-tabs__header{
			 position: fixed;
			 top: 1px;
			}
		}
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
    @include theme-content-bg(!important);
    border-radius: 0;
    overflow: hidden;
  }
  
  .el-dialog__header{
    padding: 10px 18px;
    border-bottom: 1px solid $borderBlack;
    @include theme-border-color;
    @include header-title-bg(!important);
    @include theme-content-color();
    font-size: 16px;
    .el-dialog__headerbtn{
        top: 11px;
        .el-dialog__close{
            color: $textGrayColor;
            border: 2px solid $textGrayColor;
            font-size: 12px;
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
        border-radius: 3px;
        border: none;
        // border: 1px solid $headerTitle;

        @include theme-border-color;
        @include header-title-bg;
        @include theme-content-color;
        font-size: 14px;
        cursor: pointer;
        &:hover{
            opacity: 0.9;   
        }
    }
    .el-button--primary{
        background: $themeOrange !important;
        color: $textWhiteColor !important;
    }
  }
}

</style>