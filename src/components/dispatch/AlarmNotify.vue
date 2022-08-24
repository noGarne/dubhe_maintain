<template>
    <!-- 报警通知按钮 -->
    <div class="alarm-notify">
        <audio controls="controls" hidden ref='audio'>
            <source src="../../common/images/alarm.mp3" type="audio/mp3">
        </audio>
        <div class="footer_button">
            <div :title='$t("dispatch.alarm-info")' :class="{'alarm-ani':isShowAlarm}" @click="showAlarmInfo">
                <i class="iconfont icon-gaojingxinxi"></i>
            </div>
        </div>
        <alarm-info ref="alarmInfo" @vioceAlarm="vioceAlarm" @showAlarm="showAlarm" @showAlarmNotify="showAlarmNotify"></alarm-info>
    </div>
</template>

<script>

const AlarmInfo=()=>import('../../components/dispatch/AlarmInfo.vue') 

export default {
    name:'AlarmNotify',
    components:{
        AlarmInfo
    },
    data () {
        return {
            isShowAlarm:false,
            audioLoad:false
        }
    },
    methods:{
        showAlarmInfo(){
            this.$refs.alarmInfo.toggleDialog();
        },
        showAlarm(data){
            this.isShowAlarm=data;
        },
        showAlarmNotify(res) {
            var _this=this;
            var data=res[0];
            let h = this.$createElement;
            this.$notify({
                title: data.dispatchingAlarmTitle,
                // message: data.dispatchingAlarmDetail,
                message:h("div",{class:'alarm-content'},[
                    h("div", {},data.dispatchingAlarmDetail),
                    h("div",{class:'alarm-close iconfont icon-guanbi'},''),
                    h("span",{class:'alarm-type red'},''),
                ]),
                position: 'bottom-right',
                offset:60,
                duration:5000,
                onClick:function(){
                    _this.showAlarmInfo();
                }
            });
        },
        vioceAlarm(){
            this.$refs.audio.play();
        }
    }
}
</script>

<style lang="scss" scoped>
    
</style>