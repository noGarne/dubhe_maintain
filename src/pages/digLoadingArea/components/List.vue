<template>
  <div class="leftMenu working-management">
    <el-menu 
      v-if="boundayList.length>0"
      :default-openeds="openeds"
      @open="openMenu"
      @close="openMenu">
      <!-- 采掘区地图元素 -->
      <div v-for="(item,i) in boundayList" :key="i">
        <el-submenu 
          :index="''+i+''" 
          class="other item_menu1"
          :key="'unload-area'+i+''" 
          :class="{'active-item':active.length==1&&active[0]==i}">
          <template slot="title">
            <p>
              <span 
                class="unload-area" 
                :title="item.areaName">
                  <i class="iconfont icon-caizhuangquzuoye park_left_icon"></i>
                  {{item.areaName}}
              </span>
            </p>
          </template>
          <!-- 采装设备 -->
          <div v-for="(berthArea,j) in item.parkGrps" :key="i+'-'+j">
            <el-submenu 
              class="other paiking_group item_menu2"
             :class="{'active-item':active.length==2&&active[0]==i&&active[1]==j}"
              :index="i+'-'+j">
              <template slot="title">
                  <p>
                    <span 
                      class="dock-area" 
                      :title="berthArea.bindDevice.equipmentName +deviceTitle(berthArea)" 
                      v-if="berthArea.bindDevice">
                      <i 
                        class="iconfont icon-dianchan park_left_icon park_area_icon" 
                        :class="'active'+berthArea.workStatusValue">
                      </i>
                      {{berthArea.bindDevice?berthArea.bindDevice.equipmentName:""}}
                      <i 
                        v-if="berthArea.equStatus" class="element_status" 
                        :class="'opt_status'+berthArea.equStatus">
                          {{utils.getObjValByKey(vars.runStatus,berthArea.equStatus,'code','name')}}
                      </i>
                    </span>
                  </p>
              </template>
              <!-- 停车位 -->
              <div v-for="(berthPlace,k) in berthArea.parkSpaces" :key="i+'-'+j +'-'+k">
                <el-menu-item 
                  :index="i+'-'+j+'-'+k"
                  class="other item_menu3"
                  :class="{'active-item':active.length==3&&active[0]==i&&active[1]==j&&active[2]==k}"
                  @click="openMenu(i+'-'+j+'-'+k)">
                  <p :title="berthPlace.name+berthPlaceTitle(berthPlace)">
                    <i class="iconfont icon-dianwei" :class="'open_status'+berthPlace.workStatusValue"></i>
                    <span class="dock-place">{{berthPlace.name}}</span>
                  </p>
                </el-menu-item>
              </div>
          </el-submenu>
          </div>
        </el-submenu>
      </div>
    </el-menu>
    <div v-else>
      <p class="no_data">没有数据</p>
    </div>
  </div>
</template>

<script>
import workingServer from '../../common/js/working.server'
import listMixin from '../../common/js/list.mixins';

export default {
  name: "digLoadingAreaList",
  mixins:[listMixin],
  data() {
    return {
      active:[],
      openeds:[]
      // activeType:""  //uploadArea:卸载区;berthArea:停靠区;berthPlace:停靠位
    };
  },
  props:{
    boundayList:{
      type:Array,
      default:()=>{
        return []
      }
    },
  },
  watch: {
    $route(to,from){
      var activeType = to.query.activeType;
      if(!activeType){
        this.active=[];
      }
      var id = to.params.id;
      var processing = to.query.processing;
      if(id!=-1&&processing){
        this.activeList(id,this.boundayList);
      }
    },
  },
  computed:{
    
  },
  created() {
    this.active=[];
    this.getList();
  },
  methods: {
    // 获取列表
    async getList(refresh) {
      try {
        var result = await workingServer.getUnLoadList();
        var data = result||[];

        var list = data.filter(e=>e.subShowTypeSn==602);
      
        list.forEach((v)=>{
          var info = [];
          v.parkGrps.forEach((w)=>{
            if(w.bindDevice){
              info.push(w);
            }
          })
          v.parkGrps = info;
        })

        this.$emit('setBoundayList',list);
        var id = this.$route.params.id;
        if(!id)return;
        
        this.activeList(id,list,refresh);

      } catch (e) {
        this.messages.error(e.message);
      }
    },

    
  }
};
</script>

<style lang="scss" scoped>

</style>

<style lang="scss">
@import "../../common/css/working.scss";
</style>