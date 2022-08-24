<template>
    <!-- 地图文件更新日志进度详情 -->
    <div>
    <base-dialog 
      ref="baseDialog"
      :closeShow="closeBtnShow"
      :submitShow="false"
      :outsideClose="false"
      :title='$t("tools.map-update-course-detaild")'
      :showXClose="closeBtnShow"
      @closeDialog="closeInit">
        <div class="paddingLR">
            <div class="map-progress">
                <div class="progress-list">
                    <div class="progress-list-title">
                        <span>
                            <i class="iconfont qiyong icon-qiyong" v-if="progressList.result=='SUCCESS'"></i>
                            <i class="iconfont shibai icon-shibai" v-if="progressList.result=='FAILED'"></i>
                            <i class="iconfont dengdai icon-dengdai" v-if="!progressList.result"></i>
                        </span>
                        
                        <p v-if="!progressList.result">正在更新...</p>
                        <p v-if="progressList.result=='FAILED'">更新失败！</p>
                        <p v-if="progressList.result=='SUCCESS'">更新成功！</p>
                    </div>
                    <div class="progress-list-content" v-if="progressList.resultData&&progressList.result=='FAILED'">
                        <p>{{progressList.resultData}}</p>
                    </div>
                </div>
            </div>
        </div>
      </base-dialog>  
    </div>
</template>

<script>
import workingServer from '../../common/js/working.server';

export default {
    name:"digUpdateProgress",
    data(){
        return{
            closeBtnShow:false,
            progressList:[],
            timer2:null
        }
    },
    props:{
        
    },
    mounted(){
        
    },
    methods:{
        toggleDialog(){
            this.$refs.baseDialog.toggleDialog();
        },
        openDialog(uuid){
            this.toggleDialog();
            this.getLogDetails(uuid);
        },
        closeInit(){
            this.$emit('clearEdit');

            this.closeBtnShow=false;
            this.timer2&&clearTimeout(this.timer2);
            this.progressList=[];
            
        },
        async getLogDetails(uuid){
            var _this = this;
            try{
                var info = await workingServer.getUpdateProcessList(uuid);
                
                _this.progressList=info;

                console.log(info,info.hasOwnProperty('result'))

                if(info.hasOwnProperty('result')){
                    if(!info.result){
                        this.timer2 = setTimeout(()=>{
                            this.getLogDetails(uuid);
                        },3000)
                    }else if(info.result=='SUCCESS'){
                        _this.closeBtnShow=true;
                        _this.bus.$emit('removeMsgInfo',_this.$route.query.alarmId);
                        _this.$emit('updateProgressReturn');
                    }else if(info.result=='FAILED'){
                        _this.closeBtnShow=true;
                    }
                }else{
                    setTimeout(()=>{
                        this.getLogDetails(uuid);
                    },1000)
                }
                    
            }catch(e){
                this.messages.error(e.message)
            }
        },
    },
    beforeDestroy(){
        this.timer2&&clearTimeout(this.timer2);
    }
}
</script>

<style lang="scss" scoped>
.paddingLR{
    padding: 20px;
    overflow: hidden;
    min-height: 260px;
}

// 从右边划出
.show-right-enter,
.show-right-leave-active {
  transform: translateX(50px);
  opacity: 0.1;
}
.show-right-leave-active,
.show-right-enter-active {
  transition: all .5s;
}


.map-progress{
    .progress-list{
        padding: 10px 0;
        border-bottom: 1px solid $borderColor;
        @include theme-search-border;
        .progress-list-title{
            overflow: hidden;
            font-size: 18px;
            // font-weight: bold;
            p{
                display: inline;
                @include theme-content-color;
            }
        }
        .progress-list-content{
            padding-left: 34px;
            line-height: 30px;
            color: $textGrayColor;
        }
        span{
            margin-right: 10px;
            float: left;
        }
        i{
            display: block;
            width: 25px;
            float: left;
            text-align: center;
            line-height: 25px;
            height: 25px;
            &.qiyong{
                color: $themeGreen;
            }
            
            &.dengdai{
                color: $statusColorYellow;
                animation: turn 2s linear infinite;
                @keyframes turn{
                    0%{-webkit-transform:rotate(0deg);}
                    25%{-webkit-transform:rotate(90deg);}
                    50%{-webkit-transform:rotate(180deg);}
                    75%{-webkit-transform:rotate(270deg);}
                    100%{-webkit-transform:rotate(360deg);}
                }
            }
            
            &.shibai{
                color: $themeRed;
            }
                
        }
        b{
            font-weight: normal;
            float: right;
        }
    }
}


</style>
