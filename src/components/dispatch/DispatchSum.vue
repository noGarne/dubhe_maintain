<template>
  <!-- 调度中心头部汇总 -->
  <div class="dispatch-header" :class="{'dispatch-header-small':currentType>0}" :style="{left: currentType>0 ? '420px' : '60px'}">
    <div class="dispatch-header-left" :class="{'hide-header':hideHeader}">
      <div class="dispatch-header-box dispatch-header-box-short">
        <div class="dispatch-header-img"><i class="iconfont icon-chanliangshuliang"></i></div>
        <div class="dispatch-header-flex">
          <el-popover class="dispatch-header-pop" placement="bottom-start" width="800" trigger="hover">
            <dispatch-output :list="list" :details="details"></dispatch-output>
            <div slot="reference">
              <!-- 日完成产量 -->
              <div class="dispatch-header-content">
                <div class="dispatch-header-content-title">{{$t('dispatch-set.day-complete-output')}}</div>
                <div class="dispatch-header-content-num">{{details.completeSum || 0}}</div>
              </div>
              <!-- 日计划产量 -->
              <div class="dispatch-header-content">
                <div class="dispatch-header-content-title">{{$t('dispatch-set.day-plan-output')}}</div>
                <div class="dispatch-header-content-num">{{formateNum(details.planSum || 0)}}</div>
              </div>
            </div>
          </el-popover>
        </div>
      </div>
      <div class="dispatch-header-box dispatch-header-box-middle">
        <div class="dispatch-header-img"><i class="iconfont icon-shebeishuliang"></i></div>
        <div class="dispatch-header-flex">
          <!-- 在线车数 -->
          <div class="dispatch-header-content">
            <div class="dispatch-header-content-title">{{$t('dispatch.online-vehicle')}}</div>
            <div class="dispatch-header-content-num">{{onlineTruck || 0}}</div>
          </div>
          <!-- 出动车数 -->
          <div class="dispatch-header-content">
            <div class="dispatch-header-content-title">{{$t('dispatch.run-vehicle')}}</div>
            <div class="dispatch-header-content-num">{{dispatchData.truckNum || 0}}</div>
          </div>
        </div>
      </div>
      <div class="dispatch-header-box dispatch-header-box-long">
        <div class="dispatch-header-img"><i class="iconfont icon-renwushuliang"></i></div>
        <div class="dispatch-header-flex">
          <el-popover class="dispatch-header-pop" placement="bottom-start" width="800" trigger="hover">
            <dispatch-nonproduction :list="dispatchData.loadList"></dispatch-nonproduction>
          <div slot="reference">
            <!-- 装载任务 -->
            <div class="dispatch-header-content">
              <div class="dispatch-header-content-title">{{$t('dispatch.load-task')}}</div>
              <div class="dispatch-header-content-num">{{(dispatchData.loadList && dispatchData.loadList.length) || 0}}</div>
            </div>
          </div>
          </el-popover>
          <el-popover class="dispatch-header-pop" placement="bottom-start" width="800" trigger="hover">
            <dispatch-nonproduction :list="dispatchData.unloadList"></dispatch-nonproduction>
          <div slot="reference">
            <!-- 卸载任务 -->
            <div class="dispatch-header-content">
              <div class="dispatch-header-content-title">{{$t('dispatch.unload-task')}}</div>
              <div class="dispatch-header-content-num">{{(dispatchData.unloadList && dispatchData.unloadList.length) || 0}}</div>
            </div>
          </div>
          </el-popover>
          <el-popover class="dispatch-header-pop" placement="bottom-start" width="800" trigger="hover">
            <dispatch-nonproduction :list="checkList"></dispatch-nonproduction>
          <div slot="reference">
            <!-- 点检任务 -->
            <div class="dispatch-header-content">
              <div class="dispatch-header-content-title">{{$t('dispatch.check-task')}}</div>
              <div class="dispatch-header-content-num">{{checkList.length || 0}}</div>
            </div>
          </div>
          </el-popover>
          <el-popover class="dispatch-header-pop" placement="bottom-start" width="800" trigger="hover">
            <dispatch-nonproduction :list="offList"></dispatch-nonproduction>
          <div slot="reference">
            <!-- 收车任务 -->
            <div class="dispatch-header-content">
              <div class="dispatch-header-content-title">{{$t('dispatch.off-task')}}</div>
              <div class="dispatch-header-content-num">{{offList.length || 0}}</div>
            </div>
          </div>
          </el-popover>
          <el-popover class="dispatch-header-pop" placement="bottom-start" width="800" trigger="hover">
            <dispatch-nonproduction :list="parkList"></dispatch-nonproduction>
          <div slot="reference">
            <!-- 临时停车 -->
            <div class="dispatch-header-content">
              <div class="dispatch-header-content-title">{{$t('dispatch.park-task')}}</div>
              <div class="dispatch-header-content-num">{{parkList.length || 0}}</div>
            </div>
          </div>
          </el-popover>
          <el-popover class="dispatch-header-pop" placement="bottom-start" width="800" trigger="hover">
            <dispatch-nonproduction :list="oilList"></dispatch-nonproduction>
          <div slot="reference">
            <!-- 加油任务 -->
            <div class="dispatch-header-content">
              <div class="dispatch-header-content-title">{{$t('dispatch.oil-task')}}</div>
              <div class="dispatch-header-content-num">{{oilList.length || 0}}</div>
            </div>
          </div>
          </el-popover>
        </div>
      </div>
    </div>
    <div class="dispatch-header-right" @click="headerClick">
      <div class="dispatch-header-right-img">
        <i v-if="this.hideHeader" class="iconfont icon-zhankaitongji"></i>
        <i v-else class="iconfont icon-shouqitongji"></i>
      </div>
    </div>
  </div>
</template>

<script>

import dispatchMixin from '../../common/mixins/dispatch.mixins';
import dispatchSetServer from '../../api/dispatchSet.server';
import dispatchServer from '../../api/dispatch.server';

const DispatchOutput = () => import("../../components/dispatch/DispatchOutput.vue")
const DispatchNonproduction = () => import("../../components/dispatch/DispatchNonproduction.vue")

export default {
  mixins:[dispatchMixin],
  props:['dispatchData','onlineTruck','currentType'],
  components:{
    DispatchOutput,
    DispatchNonproduction
  },
  data(){
    return{
      hideHeader: false,
      timers:null,
      list: [],
      details:{},
      nonproductionTask:[]
    }
  },
  mounted(){
    this.addInterval(this.initData,10000);
    this.getNonproductionList();
  },
  watch:{
    subareaId(){
      this.initData();
    }
  },
  computed:{
    mineSum(){
      return this.list.filter(v=>v.materialType==this.vars.materialType[0].code).length;
    },
    wasteSum(){
      return this.list.filter(v=>v.materialType==this.vars.materialType[1].code).length;
    },
    checkList(){
      return this.nonproductionTask.filter(v=>!!v.toId && v.jobType == this.dispatchTaskType[4].value);
    },
    offList(){
      return  this.nonproductionTask.filter(v=>!!v.toId && v.jobType == this.dispatchTaskType[2].value);
    },
    parkList(){
      return  this.nonproductionTask.filter(v=>!!v.toId && v.jobType == this.dispatchTaskType[5].value);
    },
    oilList(){
      return  this.nonproductionTask.filter(v=>!!v.toId && v.jobType == this.dispatchTaskType[6].value);
    },
  },
  methods:{
    headerClick(){
      this.hideHeader = !this.hideHeader;
      this.$parent.setTop(this.hideHeader);
    },
    initData(){
      this.getOutput();
      this.getNonproductionList();
    },
    async getNonproductionList(){
      // 非生产任务
      try {
        if(!this.subareaId) return;
        let result = await dispatchServer.getTruckCurrentTasks(this.subareaId);
        this.nonproductionTask = result;
      }catch (e) {
        this.messages.error(e.message)
      }
    },
    async getOutput(){
      // 查询产量
      if(!this.subareaId)return;
      try {
        let info = {
          subAreaId: this.subareaId,
          date: this.utils.formatDate(new Date().getTime(),'date') + ' 00:00:00'
        };
        let res = await dispatchSetServer.getProductionPlanDetail(info);
        // 处理数据
        let data = res.detailList.sort((a,b)=>{
          if(a.materialType>b.materialType) return 1;
          if(a.materialType<b.materialType) return -1;
          return 0;
        });
        let val = 0;
        // 汇总
        this.details.planSum = data.reduce((pre,cur) => {
          return this.getAdd(pre,cur.planOutput);
        },val);
        this.details.completeSum = data.reduce((pre,cur) => {
          return this.getAdd(pre,cur.actualOutput);
        },val);
        // 分类
        let mineList = data.filter(v=>v.materialType==this.vars.materialType[0].code);
        this.details.mineCount = mineList.length + 1;
        this.details.planMineSum = mineList.reduce((pre,cur) => {
          return this.getAdd(pre,cur.planOutput);
        },val);
        this.details.completeMineSum = mineList.reduce((pre,cur) => {
          return this.getAdd(pre,cur.actualOutput);
        },val);
        let wasteList = data.filter(v=>v.materialType==this.vars.materialType[1].code);
        this.details.wasteCount = wasteList.length + 1;
        this.details.planWasteSum = wasteList.reduce((pre,cur) => {
          return this.getAdd(pre,cur.planOutput);
        },val);
        this.details.completeWasteSum = wasteList.reduce((pre,cur) => {
          return this.getAdd(pre,cur.actualOutput);
        },val);
        // 列表
        data.forEach(v => {
          v.planOutput = v.planOutput ? parseFloat(v.planOutput).toFixed(2) : 0;
          v.actualOutput = v.actualOutput ? parseFloat(v.actualOutput).toFixed(2) : 0;
          v.type = this.utils.getObjValByKey(this.vars.materialType,v.materialType,'code');
          v.percent = this.getPercent(v.actualOutput,v.planOutput) + '%';
          v.compare = this.getCompare(v.actualOutput,v.planOutput);
        });
        let sumWasteInfo = {
          type: "废料",
          materialType:'',
          materialName: '废料总量',
          planOutput: this.details.planWasteSum,
          actualOutput: this.details.completeWasteSum,
          percent: this.getPercent(this.details.completeWasteSum,this.details.planWasteSum) + '%',
          compare: this.getCompare(this.details.completeWasteSum,this.details.planWasteSum),
        };
        if(wasteList.length > 0){
          let wasteIndex = data.findIndex(v=>v.type=='废料');
          data.splice(wasteIndex,0,sumWasteInfo);
        } else{
          data.push(sumWasteInfo);
        }
        let sumMineInfo = {
          type: "矿物",
          materialType:'',
          materialName: '矿物总量',
          planOutput: this.details.planMineSum,
          actualOutput: this.details.completeMineSum,
          percent: this.getPercent(this.details.completeMineSum,this.details.planMineSum) + '%',
          compare: this.getCompare(this.details.completeMineSum,this.details.planMineSum),
        };
        data.unshift(sumMineInfo);
        let sumInfo = {
          type: "总量",
          materialType:'',
          materialName: '',
          planOutput: this.details.planSum,
          actualOutput: this.details.completeSum,
          percent: this.getPercent(this.details.completeSum,this.details.planSum) + '%',
          compare: this.getCompare(this.details.completeSum,this.details.planSum),
        };
        data.unshift(sumInfo);
        let compareInfo = {
          type: "剥采比",
          materialType:'',
          materialName: '',
          planOutput: this.getPercent(this.details.planWasteSum,this.details.planMineSum,2,true),
          actualOutput: this.getPercent(this.details.completeWasteSum,this.details.completeMineSum,2,true),
          percent: '-',
          compare: '-',
        };
        data.push(compareInfo);
        this.list = data;
      } catch (e) {
        this.messages.error(e.message)
      }
    },
    getPercent(a,b,fix=2,noPercent=false){
      if(!a)a=0;
      if(!b || b==0)return (a==0 ? 0 : 100);
      let num = (parseFloat((parseFloat(a) * 0.01) / (parseFloat(b) * 0.01)) * 100).toFixed(fix);
      if(noPercent){
        num = (parseFloat((parseFloat(a) * 0.01) / (parseFloat(b) * 0.01))).toFixed(fix);
      }
      return num == 0.00 ? 0 : num;
    },
    getCompare(a,b,fix=2,isCompare=false){
      if(!a)a=0;
      if(!b)b=0;
      let num = Math.abs(parseFloat(a) - parseFloat(b)).toFixed(fix);
      if(isCompare){
        num = (parseFloat(a) - parseFloat(b)).toFixed(fix);
      }
      return num == 0.00 ? 0 : num;
    },
    getAdd(a,b,fix=2){
      if(!a)a=0;
      if(!b)b=0;
      let num = (parseFloat(a) + parseFloat(b)).toFixed(fix);
      return num == 0.00 ? 0 : num;
    },
    formateNum(v){
      return (v > 999999 && this.currentType>0) ? '999999+' : v;
    },
    addInterval(fn,timeout){
      let _this = this;
      fn();
      function _interval(){
        fn();
        _this.timers = setTimeout(_interval, timeout);
      };
      _this.timers = setTimeout(_interval,timeout);
    },
    removeInterval(){
     if(this.timers){
        clearTimeout(this.timers)
        this.timers = null;
     }
    },
  },
  beforeDestroy() {
    this.removeInterval();
  },
}
</script>

<style lang="scss" scoped>
$dispatchHeaderHeight:70px;
.dispatch-header{
  position: absolute;
  top: 20px;
  left: 60px;
  right: 0;
  transition: all .5s;
  .dispatch-header-left{
    display: flex;
    align-items: center;
    width: 100%;
    color: $textGrayColor;
    &.hide-header{
      display: none;
    }
    .dispatch-header-box{
      display: flex;
      align-items: center;
      height: $dispatchHeaderHeight;
      margin-right: 20px;
      border: 1px solid $borderBlack;
      @include theme-border-color;
      @include theme-content-bg;
      &.dispatch-header-box-short{
        width: 28%;
      }
      &.dispatch-header-box-middle{
        width: 20%;
      }
      &.dispatch-header-box-long{
        width: 56%;
        margin-right: 40px;
      }
      .dispatch-header-img{
        min-width: 68px;
        height: 100%;
        @include header-title-bg;
        text-align: center;
        i{
          font-size: 30px;
          line-height: $dispatchHeaderHeight;
        }
      }
      .dispatch-header-flex{
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        .dispatch-header-content{
          line-height: 1;
          flex: 1;
          padding: 0 30px;
          .dispatch-header-content-title{
            margin-bottom: 8px;
            font-size: 14px;
            white-space: nowrap;
          }
          .dispatch-header-content-num{
            color: $textBlueColor;
            font-size: 18px;
          }
        }
      }
    }
  }
  .dispatch-header-right{
    position: absolute;
    top: 0;
    right: 0;
    @include dispatch-header-right-bg;
    width: 20px;
    height: $dispatchHeaderHeight;
    cursor: pointer;
    .dispatch-header-right-img{
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      i{
        color: $textBlueColor;
        font-size: 18px;
      }
    }
  }
  &.dispatch-header-small{
    .dispatch-header-content{
      padding:0 7% !important;
    }
  }
}

@media screen and (max-width: 1746px) {
  .dispatch-header{
    &.dispatch-header-small{
      .dispatch-header-img{
        display: none;
      }
    }
  }
}
@media screen and (max-width: 1536px) {
  .dispatch-header{
    .dispatch-header-left{
      .dispatch-header-box{
        margin-right: 20px;
        &.dispatch-header-box-short{
          width: 23%;
        }
        &.dispatch-header-box-middle{
          width: 17%;
        }
        &.dispatch-header-box-long{
          width: 60%;
          margin-right: 20px;
        }
        .dispatch-header-img{
          min-width: 48px;
        }
        .dispatch-header-flex{
          .dispatch-header-content{
            padding: 0 20px;
            .dispatch-header-content-title{
              font-size: 12px;
            }
            .dispatch-header-content-num{
              font-size: 16px;
            }
          }
        }
      }
    }
  }
  
}
@media screen and (max-width: 1280px) {
  .dispatch-header{
    .dispatch-header-img{
      display: none;
    }
  }
}
</style>
<style lang="scss">
  .dispatch-header-pop{
    display: inline-block;
    width: 100%;
    height: 100%;
    &:hover{
      @include table-line-bg(!important);
    }
    .el-popover__reference{
      display: flex;
      height: 100%;
      align-items: center;
    }
  }
</style>