<template>
  <!-- 调度中心-调度任务图示 -->
  <div class="dispatch-box" ref="dispatchList">  
    <div class="dispatch-wap">
      <div class="dispatch-list"
        v-for="(item,index) in dispatchData.taskList"
        :key="index">
            <div class="list-table list-row1">
              <div class="list-flex"
                v-for="(itemIn,indexIn) in item.inGroup"
                :key="'i'+indexIn">
                <div class="list-box">
                  <template v-if="!itemIn.objs[0].isEmpty || itemIn.objs[0].isPaitu">
                    <div class="list-dump"
                      :class="itemInObj.type=='DUMPAREA' && !itemInObj.isPaitu ? 'cspt' : ''" 
                      v-for="(itemInObj,indexInObj) in itemIn.objs"
                      :key="'io'+indexInObj"
                      :title="itemInObj.name"
                      @click="deviceClick(itemInObj,indexInObj)">
                      <div v-if="itemInObj.type=='DUMPAREA' && !itemInObj.isPaitu" class="title" :class="'status'+itemInObj.status">{{itemInObj.name}}</div>
                      <div class="img">
                        <img v-if="!itemInObj.isPaitu && itemInObj.type=='DUMPAREA' && itemInObj.online" src="../../common/images/dump.png">
                        <img v-if="!itemInObj.isPaitu && itemInObj.type=='DUMPAREA' && !itemInObj.online" src="../../common/images/dump2.png">
                        <img v-if="showStopDispatchIcon(itemInObj.id)" class="stop" src="../../common/images/stop.png">
                      </div>
                    </div>
                  </template>
                  <div class="box-title" :title="itemIn.objs[0].areaName">
                    <i class="iconfont" :class="{
                      'icon-paituchangzuoye':itemIn.objs[0].isPaitu,
                      'icon-posuizhanzuoye':!itemIn.objs[0].isPaitu && itemIn.objs[0].type=='DUMPAREA',
                      'icon-tingchechangzuoye':!itemIn.objs[0].isPaitu && itemIn.objs[0].type=='PARKING_SPACE',
                      'icon-daolu':!itemIn.objs[0].isPaitu && (itemIn.objs[0].type=='LINE' || itemIn.objs[0].type=='INTERSECTION'),
                    }"></i>
                    {{itemIn.objs[0].areaName}}
                  </div>
                </div>
                <div class="list-item item-left">
                  <div class="list-line">
                    <div class="list-truck"
                      v-for="(itemInTruck,indexInTruck) in itemIn.truckList.filter(v=>(v.taskStatus=='ROAD' && !v.drivein) || v.taskStatus=='ROAD_NOTICE')"
                      :key="'it'+indexInTruck"
                      :style="{left:getCurrentDistance(itemInTruck,indexInTruck,'run')}"
                      :title="itemInTruck.truckName"
                      @click="truckShow(itemInTruck.truckId,indexInTruck)">
                      <div class="title" :class="'status'+itemInTruck.equStatus">{{itemInTruck.truckName}}</div>
                      <div class="img">
                        <img v-if="itemInTruck.truckOnline" src="../../common/images/ka1.png">
                        <img v-else src="../../common/images/ka3.png">
                        <img v-if="showStopDispatchIcon(itemInTruck.truckId)" class="stop" src="../../common/images/stop.png">
                      </div>
                    </div>
                    <span v-if="itemIn.objs[0].isLock" class="line line-solid"><i class="line-point line-start"></i></span>
                    <span v-else class="line line-dashed"><i class="line-point line-start"></i></span>
                  </div>
                  <div class="list-dash">
                    <div class="line line-solid">
                      <div class="list-wait">
                        <p class="title-position">装载等待区</p>
                      </div>
                      <i class="line-point line-start"></i>
                      <i class="line-point line-end"></i>
                    </div>
                    <div class="list-truck"
                      v-for="(itemInTruck,indexInTruck) in itemIn.truckList.filter(v=>(v.taskStatus=='ROAD' && v.drivein) || v.taskStatus=='QUEUE' || v.taskStatus=='DOCKING')"
                      :key="'it2'+indexInTruck"
                      :style="{left:getCurrentDistance(itemInTruck,indexInTruck,'wait')}"
                      :title="itemInTruck.truckName"
                      @click="truckShow(itemInTruck.truckId,indexInTruck)">
                      <div class="title" :class="'status'+itemInTruck.equStatus">{{itemInTruck.truckName}}</div>
                      <div class="img">
                        <img v-if="itemInTruck.truckOnline" src="../../common/images/ka1.png">
                        <img v-else src="../../common/images/ka3.png">
                        <img v-if="showStopDispatchIcon(itemInTruck.truckId)" class="stop" src="../../common/images/stop.png">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="list-table list-row2">
              <div class="list-box" :style="{padding:getMiddleStyle(item)}">
                  <div class="box-title" :title="item.areaName">
                    <i class="iconfont" :class="{
                      'icon-caizhuangquzuoye':item.mdls[0].type=='SHOVEL',
                      'icon-tingchechangzuoye':item.mdls[0].type=='PARKING_SPACE',
                      'icon-daolu':item.mdls[0].type=='LINE' || item.mdls[0].type=='INTERSECTION',
                    }"></i>
                    {{item.areaName}}
                  </div>
                  <template v-if="item.equipmentList.length<=0">
                    <div class="list-row-content"
                    v-for="(itemMiddle,indexMiddle) in item.mdls"
                    :key="'m'+indexMiddle">
                      <template v-if="itemMiddle.inList.filter(v=>v.toId == itemMiddle.mid && (v.taskStatus=='DOCKED' || v.taskStatus=='LOADPLACE_DOCK_POINT_DOCKED' || v.taskStatus=='LOADING' || v.taskStatus=='LOADED')).length>0">
                        <div class="list-truck"
                        v-for="(itemInTruck,indexInTruck) in itemMiddle.inList.filter(v=>v.toId == itemMiddle.mid && (v.taskStatus=='DOCKED' || v.taskStatus=='LOADPLACE_DOCK_POINT_DOCKED' || v.taskStatus=='LOADING' || v.taskStatus=='LOADED'))"
                        :key="'it3'+indexInTruck"
                          :title="itemInTruck.truckName"
                          @click="truckShow(itemInTruck.truckId,indexInTruck)">
                          <div class="title" :class="'status'+itemInTruck.equStatus">{{itemInTruck.truckName}}</div>
                          <div class="img">
                            <img v-if="itemInTruck.truckOnline" src="../../common/images/ka1.png">
                            <img v-else src="../../common/images/ka3.png">
                          <img v-if="showStopDispatchIcon(itemInTruck.truckId)" class="stop" src="../../common/images/stop.png">
                          </div>
                        </div>
                      </template>
                      <template v-else-if="itemMiddle.type=='SHOVEL'">
                        <div class="list-truck" style="visibility:hidden;">
                          <div class="title"> </div>
                          <div class="img">
                            <img src="../../common/images/ka1.png">
                          </div>
                        </div>
                      </template>
                      <div class="list-shovel" 
                        v-if="!itemMiddle.isEmpty"
                        :class="itemMiddle.type=='SHOVEL' ? 'cspt' : 'list-one'"
                        :title="itemMiddle.name"
                        @click="deviceClick(itemMiddle,indexMiddle)">
                        <div v-if="itemMiddle.type=='SHOVEL'" class="title" :class="'status'+itemMiddle.status">{{itemMiddle.name}}</div>
                        <div class="img">
                          <!-- <img v-if="itemMiddle.type=='SHOVEL' && itemMiddle.online" src="../../common/images/chan.png">
                          <img v-else-if="itemMiddle.type=='SHOVEL' && !itemMiddle.online" src="../../common/images/chan2.png"> -->
                          <img v-if="itemMiddle.type=='SHOVEL' && itemMiddle.online" src="../../common/images/chan3.png">
                          <img v-else-if="itemMiddle.type=='SHOVEL' && !itemMiddle.online" src="../../common/images/chan4.png">
                          <div class="img-null" v-show="itemMiddle.type!='SHOVEL'"></div>
                          <img v-if="showStopDispatchIcon(itemMiddle.mid)" class="stop" src="../../common/images/stop.png">
                        </div>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="list-row-content"
                    v-for="(itemMiddle,indexMiddle) in item.equipmentList"
                    :key="'m'+indexMiddle">
                      <template v-if="item.inList.filter(v=>v.toId == itemMiddle.id.id && (v.taskStatus=='DOCKED' || v.taskStatus=='LOADPLACE_DOCK_POINT_DOCKED' || v.taskStatus=='LOADING' || v.taskStatus=='LOADED')).length>0">
                        <div class="list-truck"
                          v-for="(itemInTruck,indexInTruck) in item.inList.filter(v=>v.toId == itemMiddle.id.id && (v.taskStatus=='DOCKED' || v.taskStatus=='LOADPLACE_DOCK_POINT_DOCKED' || v.taskStatus=='LOADING' || v.taskStatus=='LOADED'))"
                          :key="'it4'+indexInTruck"
                          :title="itemInTruck.truckName"
                          @click="truckShow(itemInTruck.truckId,indexInTruck)">
                          <div class="title" :class="'status'+itemInTruck.equStatus">{{itemInTruck.truckName}}</div>
                          <div class="img">
                            <img v-if="itemInTruck.truckOnline" src="../../common/images/ka1.png">
                            <img v-else src="../../common/images/ka3.png">
                            <img v-if="showStopDispatchIcon(itemInTruck.truckId)" class="stop" src="../../common/images/stop.png">
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <div class="list-truck" style="visibility:hidden;">
                          <div class="title"> </div>
                          <div class="img">
                            <img src="../../common/images/ka1.png">
                          </div>
                        </div>
                      </template>
                      <div class="list-shovel cspt" 
                        :title="itemMiddle.equipmentName"
                        @click="deviceClick(itemMiddle,indexMiddle)">
                        <div class="title" :class="'status'+itemMiddle.equStatus">{{itemMiddle.equipmentName}}</div>
                        <div class="img">
                          <!-- <img v-if="itemMiddle.online" src="../../common/images/chan.png">
                          <img v-else src="../../common/images/chan2.png"> -->
                          <img v-if="itemMiddle.online" src="../../common/images/chan3.png">
                          <img v-else src="../../common/images/chan4.png">
                            <img v-if="showStopDispatchIcon(itemMiddle.id.id)" class="stop" src="../../common/images/stop.png">
                        </div>
                      </div>
                    </div>
                  </template>
              </div>
            </div>
            <div class="list-table list-row3">
              <div class="list-flex"
                v-for="(itemOut,indexOut) in item.outGroup"
                :key="'o'+indexOut">
                <div class="list-item item-right">
                  <div class="list-line">
                    <div class="list-truck"
                      v-for="(itemOutTruck,indexOutTruck) in itemOut.truckList.filter(v=>(v.taskStatus=='ROAD' && !v.drivein) || v.taskStatus=='ROAD_NOTICE')"
                      :key="'ot'+indexOutTruck"
                      :style="{left:getCurrentDistance(itemOutTruck,indexOutTruck,'run')}"
                      :title="itemOutTruck.truckName"
                      @click="truckShow(itemOutTruck.truckId,indexOutTruck)">
                      <div class="title" :class="'status'+itemOutTruck.equStatus">{{itemOutTruck.truckName}}</div>
                      <div class="img">
                        <img v-if="itemOutTruck.truckOnline" src="../../common/images/ka2.png">
                        <img v-else src="../../common/images/ka4.png">
                        <img v-if="showStopDispatchIcon(itemOutTruck.truckId)" class="stop" src="../../common/images/stop.png">
                      </div>
                    </div>
                    <span v-if="itemOut.objs[0].isLock" class="line line-solid"><i class="line-point line-start"></i></span>
                    <span v-else class="line line-dashed"><i class="line-point line-start"></i></span>
                  </div>
                  <div class="list-dash">
                    <div class="list-wait wait-right">
                      <p class="title-position">卸载等待区</p>
                    </div>
                    <div class="list-truck"
                      v-for="(itemOutTruck,indexOutTruck) in itemOut.truckList.filter(v=>(v.taskStatus=='ROAD' && v.drivein) || v.taskStatus=='QUEUE' || v.taskStatus=='DOCKING')"
                      :key="'ot2'+indexOutTruck"
                      :style="{left:getCurrentDistance(itemOutTruck,indexOutTruck,'wait')}"
                      :title="itemOutTruck.truckName"
                      @click="truckShow(itemOutTruck.truckId,indexOutTruck)">
                      <div class="title" :class="'status'+itemOutTruck.equStatus">{{itemOutTruck.truckName}}</div>
                      <div class="img">
                        <img v-if="itemOutTruck.truckOnline" src="../../common/images/ka2.png">
                        <img v-else src="../../common/images/ka4.png">
                        <img v-if="showStopDispatchIcon(itemOutTruck.truckId)" class="stop" src="../../common/images/stop.png">
                      </div>
                    </div>
                    <div class="line line-solid">
                      <i class="line-point line-start"></i>
                      <i class="line-point line-end"></i>
                    </div>
                  </div>
                </div>
                <div class="list-box">
                  <div class="box-title" :title="itemOut.objs[0].areaName">
                    <i class="iconfont" :class="{
                      'icon-paituchangzuoye':itemOut.objs[0].isPaitu,
                      'icon-posuizhanzuoye':!itemOut.objs[0].isPaitu,
                    }"></i>
                    {{itemOut.objs[0].areaName}}
                  </div>
                  <template v-if="itemOut.truckList.filter(v=>v.taskStatus=='DOCKED' || v.taskStatus=='LOADPLACE_DOCK_POINT_DOCKED' || v.taskStatus=='UNLOADING' || v.taskStatus=='UNLOADED' || v.taskStatus=='DRIVE_WTH_BUCK_ELIFT').length<=1">
                    <div class="list-row-content"
                      :class="itemOutObj.type=='DUMPAREA' && !itemOutObj.isPaitu ? '' : 'list-one'"
                      v-for="(itemOutObj,indexOutObj) in itemOut.objs"
                      :key="'oo'+indexOutObj">
                        <template v-if="itemOut.truckList.filter(v=>(v.taskStatus=='DOCKED' || v.taskStatus=='LOADPLACE_DOCK_POINT_DOCKED' || v.taskStatus=='UNLOADING' || v.taskStatus=='UNLOADED' || v.taskStatus=='DRIVE_WTH_BUCK_ELIFT') && (v.toId==itemOutObj.id)).length==1">
                          <div class="list-truck"
                            :title="itemOutTruck.truckName"
                            @click="truckShow(itemOutTruck.truckId,indexOutTruck)" 
                            v-for="(itemOutTruck,indexOutTruck) in itemOut.truckList.filter(v=>v.taskStatus=='DOCKED' || v.taskStatus=='LOADPLACE_DOCK_POINT_DOCKED' || v.taskStatus=='UNLOADING' || v.taskStatus=='UNLOADED' || v.taskStatus=='DRIVE_WTH_BUCK_ELIFT')"
                            :key="'ot3'+indexOutTruck">
                            <div class="title" :class="'status'+itemOutTruck.equStatus">{{itemOutTruck.truckName}}</div>
                            <div class="img">
                              <img v-if="itemOutTruck.truckOnline" src="../../common/images/ka2.png">
                              <img v-else src="../../common/images/ka4.png">
                              <img v-if="showStopDispatchIcon(itemOutTruck.truckId)" class="stop" src="../../common/images/stop.png">
                            </div>
                          </div>
                        </template>
                        <div v-else class="list-truck" style="visibility:hidden;">
                          <div class="title status3"> </div>
                          <div class="img">
                            <img src="../../common/images/ka1.png">
                          </div>
                        </div>
                        <div class="list-shovel"
                          :class="itemOutObj.type=='DUMPAREA' && !itemOutObj.isPaitu ? 'cspt' : ''"
                          :title="itemOutObj.name"
                          @click="deviceClick(itemOutObj,indexOutObj)">
                          <div v-if="itemOutObj.type=='DUMPAREA' && !itemOutObj.isPaitu" class="title" :class="'status'+itemOutObj.status">{{itemOutObj.name}}</div>
                          <div class="img">
                            <img v-if="!itemOutObj.isPaitu && itemOutObj.online" src="../../common/images/dump.png">
                            <img v-if="!itemOutObj.isPaitu && !itemOutObj.online" src="../../common/images/dump2.png">
                            <img v-if="showStopDispatchIcon(itemOutObj.id)" class="stop" src="../../common/images/stop.png">
                          </div>
                        </div>
                    </div>
                  </template>
                  <template v-else>
                    <!--  -->
                    <div class="list-row-content list-more"
                      :class="{'height-auto':
                      itemOut.truckList.filter(v=>(v.taskStatus=='DOCKED' || v.taskStatus=='LOADPLACE_DOCK_POINT_DOCKED' || v.taskStatus=='UNLOADING' || v.taskStatus=='UNLOADED' || v.taskStatus=='DRIVE_WTH_BUCK_ELIFT') && (v.toId==itemOutObj.id)).length == 3
                       || 
                      itemOut.truckList.filter(v=>(v.taskStatus=='DOCKED' || v.taskStatus=='LOADPLACE_DOCK_POINT_DOCKED' || v.taskStatus=='UNLOADING' || v.taskStatus=='UNLOADED' || v.taskStatus=='DRIVE_WTH_BUCK_ELIFT') && (v.toId==itemOutObj.id)).length == 4
                      }"
                      v-for="(itemOutObj,indexOutObj) in itemOut.objs"
                      :key="'oo'+indexOutObj">
                        <div class="list-truck"
                          :title="itemOutTruck.truckName"
                          @click="truckShow(itemOutTruck.truckId,indexOutTruck)" 
                          v-for="(itemOutTruck,indexOutTruck) in itemOut.truckList.filter(v=>(v.taskStatus=='DOCKED' || v.taskStatus=='LOADPLACE_DOCK_POINT_DOCKED' || v.taskStatus=='UNLOADING' || v.taskStatus=='UNLOADED' || v.taskStatus=='DRIVE_WTH_BUCK_ELIFT') && (v.toId==itemOutObj.id))"
                          :key="'ot3'+indexOutTruck">
                          <div class="title" :class="'status'+itemOutTruck.equStatus">{{itemOutTruck.truckName}}</div>
                        </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
      </div>
    </div>
  </div>
</template>

<script>

import dispatchMixin from '@/common/mixins/dispatch.mixins.js';

export default {
  name: 'DispatchTask',
  mixins:[dispatchMixin],
  props:['dispatchData','onlineTruck'],
  data(){
    return{

    }
  },
  methods: {
    getCurrentDistance(item,index,type){
      let width = 80;
      if(type == 'wait'){
        let stepPer = index * 30;
        if(stepPer >= width) stepPer = width;
        return stepPer + '%';
      }
      let current=item.currentMileage;
      let sum=item.pathMileage;
      let init=100;
      if(!current || !sum || isNaN(current) || isNaN(sum) || sum == 0){
        return 0 + index * 10 + '%';
      }
      if(init <= 0){
        init=1;
      }
      let distance=(parseFloat(current) * 0.01)/parseFloat(sum) * 100 * init;
      let per = parseInt(distance.toFixed(0));
      per = per +  index * 10;
      if(per >= width) per = width;
      return per + '%';
    },
    getMiddleStyle(item){
      let padding = 0;
      let returnStr = 0;
      let groupLength = Math.max(item.inGroup.length,item.outGroup.length);
      let middleLength = item.equipmentList.length > 0 ? item.equipmentList.length : item.mdls.length;
      if(groupLength >= middleLength && groupLength > 1){
        padding = (90 * groupLength - 50 * middleLength) / 2;
        returnStr = padding + 'px 0';
        if(padding == 0)returnStr="22px 0 28px"
      }
      return returnStr;
    },
    deviceClick(item,index){
      if(item.type=='DUMPAREA' && !item.isPaitu){
        this.dumpShow(item.id,index);
      } else if(item.type=='SHOVEL'){
        this.diggerShow(item.mid,index);
      } else if(item.equipmentTypeSn==this.vars.deviceTypeNew[1].id){
        this.diggerShow(item.id.id,index);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dispatch-box{
  .dispatch-wap{
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    margin: 10px 0;
    @include scrollbar-style;
  }
  .dispatch-list{
    text-align: center;
    margin: 10px;
    display: flex;
  }
}

.list-table{
  width: 150px;
  .list-flex{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 10px;
  }
  .title{
    width: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0 auto;
    color: $textBlackColor;
    font-size: 12px;
    padding: 2px;
    margin-bottom: 6px;
  }
  .list-truck{
    cursor: pointer;
    .title{
      margin-bottom: 4px;
    }
  }
  .list-dump{
    margin: 36px 10px 6px;
    .img{
      vertical-align: middle;
    }
  }
  .img{
    position: relative;
    img:first-child{
      width: 50px;
      height: 30px;
    }
  }
  .img-null{
    height: 60px;
  }
  .stop{
      width: 12px;
      position: absolute;
      right: 0;
      top: -3px;
  }
  .list-box{
    position: relative;
    min-height: 94px;
    @include dispatch-device-content-bg;
    .box-title{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      font-size: 12px;
      padding: 4px 0;
      overflow: hidden;
      white-space: nowrap;
      @include theme-content-color;
      @include dispatch-device-header-bg;
      i{
        display: inline-block;
        margin-right: 2px;
        font-size: 12px;
        color: $textGrayColor3;
      }
    }
  }
  .title-position{
    margin-top: 4px;
    font-size: 12px;
    white-space: nowrap;
    @include theme-content-color;
  }
  .line{
    position: absolute;
    left: 10px;
    bottom: -42px;
    width: 100%;
    border: none;
    &.line-dashed{
      border-bottom: 4px dashed $borderGray;
      @include dispatch-line-border-color;
    }
    &.line-solid{
      border-bottom: 4px solid $borderGray;
      @include dispatch-line-border-color;
    }
    .line-point{
      position: absolute;
      bottom: -7px;
      width: 10px;
      height: 10px;
      border:  2px solid $borderGray;
      &.line-start{
        left: -10px;
      }
      &.line-end{
        right: -10px;
      }
    }
  }
  .list-item{
    flex:1;
    display: flex;
    margin-left: 10px;
    &.item-left{
      width: calc(100% - 100px);
    }
    &.item-right{
      width: calc(100% - 150px);
    }
    .list-truck{
      position: absolute;
      left: 0;
      top: -16px;
      margin-left: 10px;
      cursor: pointer;
      transition: all 0.5s;
    }
  }
  .list-line{
    position: relative;
    width: calc(100% - 160px);
  }
  .list-dash{
    position: relative;
    width: 120px;
    margin-left: 10px;
  }
  .list-wait{
    position: absolute;
    border-left: 1px dashed;
    border-right: 1px dashed;
    border-top: 1px dashed;
    @include dispatch-line-border-color;
    height: 90px;
    left: -10px;
    right: -10px;
    bottom: -2px;
    &.wait-right{
      bottom: -42px;
      left: 0;
      right: -20px;
    }
  }
  &.list-row1{
    flex: 1;
    .list-box{
      width: 100px;
      border: 1px dashed $borderGray;
      @include dispatch-line-border-color;
      img:first-child{
        width: 50px;
        height: 30px;
      }
      .title{
        width: 58px;
      }
    }
  }
  &.list-row2{
    width: 150px;
    .list-box{
      position: relative;
      width: 150px;
      border: 1px dashed $borderGray;
      @include dispatch-line-border-color;
      .list-truck{
        margin-top: 10px;
      }
    }
  }
  &.list-row3{
    flex: 1;
    .list-box{
      position: relative;
      width: 150px;
      border: 1px dashed $borderGray;
      @include dispatch-line-border-color;
      .truck-more{
        margin: 0 10px;
      }
      img:first-child{
        width: 50px;
        height: 30px;
      }
      .list-shovel{
        .title{
          width: 58px;
        }
      }
      .list-truck{
        margin-top: 10px;
      }
    }
    .title-position{
      left: 20%;
    }
  }
  .list-row-content{
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px 10px 6px;
    &.list-one{
      margin-top: 30px;
      .list-truck{
        margin-left: 20px;
      }
    }
    .list-shovel{
      margin-left: 20px;
      margin-top: 10px;
      .title{
        margin-bottom: 6px;
      }
    }
  }
  .list-more{
    flex-wrap: wrap;
    overflow: auto;
    justify-content: flex-start;
    height: 60px;
    &.height-auto{
      height: auto;
    }
    .list-truck{
      display: flex;
      flex-wrap: wrap;
      cursor: pointer;
      &:nth-of-type(n+3){
        margin-top: 0 !important;
      }
      .title{
        margin: 3px;
      }
    }
    .list-shovel{
      margin-left: 0;
    }
  }
}

</style>
