<template>
<div class="working_content">
  <el-container class="working_content_c">
    <el-aside>
      <list ref="refList"></list>
    </el-aside>
    <el-container>
      <router-view @changeHandle="changeHandle" />
    
    <alarm-notify  @changeHandle="changeHandle"></alarm-notify> 
    </el-container>
  </el-container>
</div>
</template>

<script>
import List from "./components/List";
// import workingMinxin from "../common/js/working.mixins";
// const AlarmNotify=()=>import('../loadBoundary/components/AlarmNotify')
const AlarmNotify=()=>import('../common/components/AlarmNotify')

export default {
  name: "ShovelMovementIndex",
  // mixins: [workingMinxin],
  components: {
    List,
    AlarmNotify
  },
  data() {
    return {
      
    };
  },
  watch: {
    // $route(to, from) {
    //   this.headerShow(to);
    // }
  },
  created() {
    
  },
  methods: {
    changeHandle(){
      this.$refs.refList.getList();
    }
  }
};
</script>

<style lang="scss" scoped>
.working_content{
  height: calc(100% - 50px);
  .working_content_c{
    height: 100%;
  }
}

</style>


<style lang="scss" scoped>
.working_content{
  height: calc(100% - #{$breadcrumbHeight});
  .working_content_c{
    height: 100%;
    i.iconfont{
      line-height: 1;
    }
    .el-container{
      position: relative;
    }
    .el-aside {
      width: 230px !important;
      height: 100%;
      padding-top: 0;
      box-sizing: border-box;
      background-color: $leftMenuBg;
    }
  }
}
</style>