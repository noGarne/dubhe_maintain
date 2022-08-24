<template>
    <!-- 报警拒绝原因 -->
    <div class="alarm-reject">
        <base-dialog 
        ref="baseDialog"
        :width="'760px'"
        :title='$t("dispatch.alarm-reject-reason")'
        @closeDialog="closeDialog"
        @submitForm="submitForm">
            <div class="detail">
                <div class="title">{{$t('dispatch.alarm-description')}}</div>
                <div class="alarm-info">
                    <div class="title">{{alarmInfo.dispatchingAlarmTitle}}</div>
                    <p>{{alarmInfo.dispatchingAlarmDetail | substringBR}}</p>
                </div>
                <div class="title">{{$t('dispatch.alarm-reject-reason')}}</div>
                <div class="alarm-info">
                    <textarea class="alarm-input" v-model="rejectReason" :placeholder="'请输入'+$t('dispatch.alarm-reject-reason')"></textarea>
                </div>
            </div>
        </base-dialog>
    </div>
</template>

<script>

import dispatchServer from '../../api/dispatch.server.js';

export default {
    name:'AlarmReject',
    data(){
        return{
            alarmInfo:{},
            rejectReason:''
        }
    },
    created() {
        
    },
    destroyed() {
        this.bus.$off('showAlarmReject');
    },
    methods: {
        toggleDialog(){
            this.$refs.baseDialog.toggleDialog();
        },
        closeDialog(){
            this.rejectReason = "";
        },
        getAlarmInfo(data){
            this.alarmInfo=data;
        },
        showAlarmReject(data){
            this.toggleDialog();
            this.getAlarmInfo(data);
        },
        async submitForm(ev){
            if (!this.rejectReason) {
                this.messages.error(this.$t('action.please-input')+this.$t('dispatch.alarm-reject-reason'));
                return;
            }
            try {
                //调接口
                var user= this.$store.state.currentUser;
                var info={
                    handleUserId:user.userId,
                    handleUserName:user.lastName+user.firstName,
                    handleOption:'REFUSE',
                    handleSuggestion:this.rejectReason
                };
                var id=this.alarmInfo.id;
                //console.log(id)
                try {
                    ev.target.disabled=true;
                    var result=await dispatchServer.alarmHandle(id,info);
                    this.toggleDialog();
                    this.$parent.removeAlarm(id);
                    this.messages.success(this.$t('dispatch.alarm-reject-popout-success'));
                } catch (e) {
                    ev.target.disabled=false;
                    this.messages.error(e.message);
                }
            } catch (e) {
                this.messages.error(e.message);
            }
        }
    },
    filters:{
        substringBR(val){
            // console.log(val);
            // console.log(val.split('\n'));
            return val ? val.split('\n')[0] : "";
        }
    }
}
</script>

<style lang="scss" scoped>
.edit_dialog_content{
    width: 760px;
}
.detail{
    width: 760px;
    padding: 20px 16px;
    .title{
        color: $themeContentColor;
        @include theme-content-color;
    }
    .alarm-info{
        margin: 10px 0 20px;
        padding: 16px;
        border:1px solid $borderBlack;
        @include theme-border-color;
        @include theme-content-color;
        p{
            line-height: 30px;
            @include theme-content-color;

        }
        .title{
            @include theme-content-color;
            font-size: 16px;
            span{
                display: inline-block;
                margin-left: 20px;
            }
        }
        .alarm-input{
            width:100%;
            height: 50px;
            border:0;
            outline: none;
            resize: none;
            background: none;
            font-family: inherit;
            @include theme-content-color;
        }
    }
}
</style>
