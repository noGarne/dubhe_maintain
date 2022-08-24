<template>
    <!-- 报警通知按钮 -->
    <div class="alarm-notify">
        <audio controls="controls" hidden ref='audio'>
            <source src="../../../common/images/alarm.mp3" type="audio/mp3">
        </audio>
        <div class="footer_button">
            <div :title='$t("dispatch.alarm-info")' :class="{'alarm-ani':isShowAlarm}" @click="showAlarmInfo">
                <i class="iconfont icon-gaojingxinxi"></i>
            </div>
        </div>
        <alarm-info 
            ref="alarmInfo" 
            @vioceAlarm="vioceAlarm" 
            @showAlarm="showAlarm" 
            @showAlarmNotify="showAlarmNotify" 
            @setEditDate="setEditDate"></alarm-info>
    </div>
</template>

<script>

const AlarmInfo=()=>import('./AlarmInfo.vue') 

export default {
    name:'AlarmNotify',
    components:{
        AlarmInfo
    },
    data () {
        return {
            isShowAlarm:false,
            audioLoad:false,
            notifications:{},
            notifyNum:1
        }
    },
    methods:{
        showAlarmInfo(){
            if(this.$refs.alarmInfo)this.$refs.alarmInfo.toggleDialog();
        },
        showAlarm(data){
            this.isShowAlarm=data;
        },
        setEditDate(data){
            this.$emit('setEditDate',data);
        },
        showAlarmNotify(res) {
            // console.log(res);
            var _this=this;
            var notifyNum = _this.notifyNum;
            var data=res; // res[0];
            let h = this.$createElement;
            let notify = this.$notify({
                title: data.alarmDetail,
                // message: _this.utils.formatDate(data.alarmTime),
                message:h("div",{class:'alarm-content'},[
                    h("div", {},_this.utils.formatDate(data.alarmTime)),
                    h("div",{class:'alarm-close iconfont icon-guanbi'},''),
                ]),
                position: 'bottom-right',
                offset:60,
                duration:5000,
                onClick:function(){
                    _this.showAlarmInfo();
                },
                onclose:function(){
                    _this.notifications[notifyNum]?_this.closeNotification(notifyNum):"";
                }
            });
            _this.notifications[notifyNum] = notify;
            _this.notifyNum++;
        },
        //关闭单个通知
        closeNotification(messageId){
            //省略部分代码
            this.notifications[messageId].close()
            delete this.notifications[messageId]
        },
        //关闭所有通知
        closeAllNotification() {
            for (let key in this.notifications) {
                this.notifications[key].close()
                delete this.notifications[key]
            }
        },
        vioceAlarm(){
            this.$refs.audio.play();
        },
        changeHandle(){
            this.$emit("changeHandle");
        }
    },
    beforeDestroy(){
        // 取消所有通知
        this.closeAllNotification();
    }
}
</script>

<style lang="scss" scoped>
    
</style>
