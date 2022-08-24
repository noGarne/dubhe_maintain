<template>
    <!-- 终端操作 -->
    <div>
        <div class="operation-list" v-if="detailsInfo.equipmentTypeSn==vars.deviceType[0].id">
            <!-- 请调 -->
            <!-- <div class="operation-content">
                <span><i class="iconfont icon-tongyidiaodu"></i></span>
                <p>{{$t("dispatch.device-operation-apply")}}</p>
            </div> -->
            <!-- 到达 -->
            <!-- <div class="operation-content">
                <span><i class="iconfont icon-chufadaodaxiao"></i></span>
                <p>{{$t("dispatch.device-operation-arrive")}}</p>
            </div> -->
            <!-- 开装 -->
            <!-- <div class="operation-content">
                <span><i class="iconfont icon-yifahuo"></i></span>
                <p>{{$t("dispatch.device-operation-start")}}</p>
            </div> -->
            <!-- 装完 -->
            <!-- <div class="operation-content">
                <span><i class="iconfont icon-wancheng"></i></span>
                <p>{{$t("dispatch.device-operation-end")}}</p>
            </div> -->
            <!-- 卸载 -->
            <!-- <div class="operation-content">
                <span><i class="iconfont icon-xiezai"></i></span>
                <p>{{$t("dispatch.device-operation-dump")}}</p>
            </div> -->
            <!-- 入网 -->
            <!-- <div class="operation-content">
                <span><i class="iconfont icon-ruwang"></i></span>
                <p>{{$t("dispatch.device-operation-login")}}</p>
            </div> -->
            <!-- 退网 -->
            <!-- <div class="operation-content">
                <span><i class="iconfont icon-tuiwang"></i></span>
                <p>{{$t("dispatch.device-operation-logout")}}</p>
            </div> -->
            <!-- 就绪 -->
            <div class="operation-content" @click="!disabledDispatchEdit?setStatus(0):''">
                <span class="btn_jiuxu"><i class="iconfont icon-jiuxu"></i></span>
                <p>{{$t("dispatch.device-operation-ready")}}</p>
            </div>
            <!-- 延时 -->
            <div class="operation-content" @click="!disabledDispatchEdit?setStatus(1):''">
                <span class="btn_yanshi"><i class="iconfont icon-yanshi"></i></span>
                <p>{{$t("dispatch.device-operation-delay")}}</p>
            </div>
            <!-- 故障 -->
            <div class="operation-content" @click="!disabledDispatchEdit?setStatus(2):''">
                <span class="btn_guzhang"><i class="iconfont icon-guzhang"></i></span>
                <p>{{$t("dispatch.device-operation-trouble")}}</p>
            </div>
            <!-- 备用 -->
            <div class="operation-content" @click="!disabledDispatchEdit?setStatus(3):''">
                <span class="btn_beiyong"><i class="iconfont icon-beiyong"></i></span>
                <p>{{$t("dispatch.device-operation-spare")}}</p>
            </div>
        </div>
        <div class="operation-list" v-else-if="detailsInfo.equipmentTypeSn==vars.deviceType[1].id">
            <!-- 入网 -->
            <!-- <div class="operation-content">
                <span><i class="iconfont icon-ruwang"></i></span>
                <p>{{$t("dispatch.device-operation-login")}}</p>
            </div> -->
            <!-- 退网 -->
            <!-- <div class="operation-content">
                <span><i class="iconfont icon-tuiwang"></i></span>
                <p>{{$t("dispatch.device-operation-logout")}}</p>
            </div> -->
            <!-- 装完 -->
            <!-- <div class="operation-content">
                <span><i class="iconfont icon-wancheng"></i></span>
                <p>{{$t("dispatch.device-operation-end")}}</p>
            </div> -->
            <!-- 就绪 -->
            <div class="operation-content" @click="!disabledDispatchEdit?setStatus(0):''">
                <span class="btn_jiuxu"><i class="iconfont icon-jiuxu"></i></span>
                <p>{{$t("dispatch.device-operation-ready")}}</p>
            </div>
            <!-- 延时 -->
            <div class="operation-content" @click="!disabledDispatchEdit?setStatus(1):''">
                <span class="btn_yanshi"><i class="iconfont icon-yanshi"></i></span>
                <p>{{$t("dispatch.device-operation-delay")}}</p>
            </div>
            <!-- 故障 -->
            <div class="operation-content" @click="!disabledDispatchEdit?setStatus(2):''">
                <span class="btn_guzhang"><i class="iconfont icon-guzhang"></i></span>
                <p>{{$t("dispatch.device-operation-trouble")}}</p>
            </div>
            <!-- 备用 -->
            <div class="operation-content" @click="!disabledDispatchEdit?setStatus(3):''">
                <span class="btn_beiyong"><i class="iconfont icon-beiyong"></i></span>
                <p>{{$t("dispatch.device-operation-spare")}}</p>
            </div>
        </div>
        <div class="operation-list" v-else>
            <!-- 就绪 -->
            <div class="operation-content" @click="!disabledDispatchEdit?setStatus(0):''">
                <span class="btn_jiuxu"><i class="iconfont icon-jiuxu"></i></span>
                <p>{{$t("dispatch.device-operation-ready")}}</p>
            </div>
            <!-- 延时 -->
            <div class="operation-content" @click="!disabledDispatchEdit?setStatus(1):''">
                <span class="btn_yanshi"><i class="iconfont icon-yanshi"></i></span>
                <p>{{$t("dispatch.device-operation-delay")}}</p>
            </div>
            <!-- 故障 -->
            <div class="operation-content" @click="!disabledDispatchEdit?setStatus(2):''">
                <span class="btn_guzhuang"><i class="iconfont icon-guzhang"></i></span>
                <p>{{$t("dispatch.device-operation-trouble")}}</p>
            </div>
            <!-- 备用 -->
            <div class="operation-content" @click="!disabledDispatchEdit?setStatus(3):''">
                <span class="btn_beiyong"><i class="iconfont icon-beiyong"></i></span>
                <p>{{$t("dispatch.device-operation-spare")}}</p>
            </div>
        </div>

        <device-status ref="devicesStatus" @updateStatus="updateStatus"></device-status>

    </div>
</template>

<script>

import dispatchMixin from '@/common/mixins/dispatch.mixins.js';

const DeviceStatus=()=>import('../dispatchSet/DeviceStatus.vue')

export default {
    name:'DeviceOperation',
    props:['detailsInfo'],
    mixins:[dispatchMixin],
    components:{
        DeviceStatus
    },
    data(){
        return{
            
        }
    },
    methods:{
        setStatus(statusType){
            if(this.detailsInfo.drivingMode == this.vars.drivingMode[1].type){
                // 自动驾驶不能修改状态
                this.messages.error(this.$t('dispatch-set.status-update-fail').replace('$name',this.detailsInfo.truckName));
                return;
            }
            var state = {
                equStatus: this.vars.runStatus[statusType].code,
                equStatusName:this.vars.runStatus[statusType].name
            }
            if(this.$refs.devicesStatus)this.$refs.devicesStatus.getList(this.detailsInfo,state,this.detailsInfo.equipmentTypeSn,'disable')  
        },
        updateStatus(data){
            this.$emit('updateStatus',data)
        },
    }
}
</script>

<style lang='scss'>
.operation-list{
    display: flex;
    align-items: center;
    align-content: flex-start;
    flex-wrap: wrap;
    .operation-content{
        text-align: center;
        margin: 0 20px 20px 0;
        cursor: pointer;
        p{
            font-size: 14px;
            // color: $themeContentColor;
            @include theme-content-color;
            padding-top: 10px;
        }
        span{
            height: 44px;
            width: 44px;
            display: block;
            // border-radius: 50%;
            // background: $tableHeaderBg;
            @include table-header-bg;
            display: flex;
            align-items: center;
            justify-content: center;
            i{
                font-size: 20px;
                // color: $themeContentColor;
                @include theme-content-color;
            }
            &.btn_jiuxu{
                i{
                    color: $statusColorGreen;
                }
            }
            &.btn_yanshi{
                i{
                    color: $statusColorYellow;
                }
            }
            &.btn_guzhang{
                i{
                    color: $statusColorRed;
                }
            }
            &.btn_beiyong{
                i{
                    color: $statusColorBlue;
                }
            }
        }
        &:last-child{
            padding-right: 0;
        }
    }
}
</style>
