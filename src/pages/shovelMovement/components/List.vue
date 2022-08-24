<template>
  <div class="leftMenu shovelMovement">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="采掘区" name="first">
        <el-menu v-if="diggerAreaList.length>0" :router="true" :default-active="$route.fullPath">
          <!-- <div > -->
            <el-menu-item v-for="(item,index) in diggerAreaList" :key="item.id" :index="toUrl+item.id" :name="toUrl+item.id" :route="toUrl+item.id">
              <b class="publishOver" v-if="item.publish"></b>
              <span slot="title">{{'采掘面：'+item.name}}</span>
              <el-dropdown placement="bottom-start" trigger="click">
                <span class="el-dropdown-link">
                  <i class="iconfont icon-gengduo"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item  @click.native="editDigger(item,index)">重命名</el-dropdown-item>
                  <el-dropdown-item @click.native="deleteDigger(item,index)">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-menu-item>
          <!-- </div> -->
        </el-menu>
        <div v-else>
          <p class="no_data">没有数据</p>
        </div>
      </el-tab-pane>
      <el-tab-pane label="采装设备" name="second">
        <el-menu v-if="shovelList.length>0">
          <!-- <div > -->
            <el-menu-item v-for="(item,index) in shovelList" :key="'shovel'+index" :index="'shovel'+index" >
              <span slot="title">{{item.shovelName}}</span>
              <i class="iconfont icon-weibiaoti-_huaban" @click="setShovelSet(item,index)"></i>
            </el-menu-item>
          <!-- </div> -->
        </el-menu>
        <div v-else>
          <p class="no_data">没有数据</p>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div v-if="activeName=='first'" class="btnBg add_digger" @click="addDigger"><i class="iconfont icon-xinzeng"></i></div>
    <add-digger-area ref="addDiggerArea"></add-digger-area>
    <shovel-set ref="shovelSet"></shovel-set>
  </div>
</template>

<script>
import shovelMovementServer from "../js/shovelMovement.server";
import dispatchMixin from '@/common/mixins/dispatch.mixins.js';
import devicesServer from '../../../api/devices.server';
const AddDiggerArea=()=>import('./AddDiggingArea')
const ShovelSet=()=>import('./ShovelSet')

export default {
  name: "ShovelMovementList",
  mixins:[dispatchMixin],
  components:{
    AddDiggerArea,
    ShovelSet
  },
  data() {
    return {
      diggerAreaList:[],
      shovelList:[],
      activeName:"first",
      toUrl:this.$route.matched[1].path+'/map/'
    };
  },
  created() {
    this.getList();
    this.getShovelList();
  },
  methods: {
    addDigger(){
      this.$refs.addDiggerArea.getInfo();
    },
    editDigger(info,index){
      this.$refs.addDiggerArea.getInfo(info,index);
    },
    updateDiggerArea(info,index,edit){
      if(edit){
        this.diggerAreaList.splice(index,1,info)
      }else{
        this.diggerAreaList.push(info);
        if(this.diggerAreaList.length==1){
            this.$router.replace(info.id);
        }
      }
      
    },
    deleteDigger(data,i){//删除采掘面
      var _this=this;
      this.$messageConfirm.showConfirm({
        content:this.$t('action.is-delete'),
        // detail:'提示详情'
      },async ()=>{
        // 确定操作
        try{
          let result = await shovelMovementServer.deleteDiggingArea(data.id);
          
          this.diggerAreaList.splice(i,1);

          if(this.diggerAreaList.length==0){
            this.$router.replace('0');
          }else{
            this.$router.replace(this.diggerAreaList[0].id);
          }

          
          _this.messages.success(this.$t('action.operate-success'));
          
        }catch(e){
          _this.messages.error(e.message);
        }
      });
    },
    setShovelSet(info,index){
      this.$refs.shovelSet.getInfo(info,index);
    },
    updateShovelSet(info,index){
      this.shovelList.splice(index,1,info)
    },
    async getList() {

      try {
        let info = {
          subareaSn:this.subareaSn
        };
        let result = await shovelMovementServer.getDiggingArea(info);
        // console.log(info,result);
        this.diggerAreaList = result;

      } catch (e) {
        this.messages.error(e.message);
      }
    },
    async getShovelList(){
      try {
        var data = {
          subareaSn:this.subareaSn,
          // hasDigParam:false
        };
        var result = await shovelMovementServer.getShovelList(data);
        // console.log(data,result)
        this.shovelList = result;
      } catch (e) {
        this.messages.error(e.message);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.leftMenu {
  padding-top: 0;
  .el-menu {
    .el-menu-item{
      &>i{
        position: absolute;
        right: 20px;
        top: 20px;
      }
       span{
        margin-left: 16px !important;
        display: inline-block;
        width: 90%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .publishOver{
        height: 9px;
        width: 9px;
        border-radius: 50%;
        background: $statusColorGreen;
        position: absolute;
        left: 20px;
        top: 24px;
      }
    }
  }
  .add_digger{
    position: fixed;
    left: 160px;
    bottom: 31px;
    height: 46px;
    width: 46px;
    background:$themeOrange;
    text-align: center;
    border-radius: 50%;
    cursor: pointer;
    &:hover{
      background-color: $themeOrangeHover;
    }
    i{
      line-height: 46px;
      color: #fff;
      font-size: 20px;
    }
  }
}

</style>

<style lang="scss">
.shovelMovement {
  .el-tabs__content{
    padding: 0;
  }
  .el-menu {
    .el-menu-item{
      .el-dropdown>span{
        margin-left: 0;
      }
      &>.el-dropdown{
        position: absolute;
        right: 20px;
        top: 0;
      }
    }
  }
  .el-tabs__nav-scroll{
    padding-left: 30px;
  }
}
</style>