<template>
  <div id="app">
    <div v-if="isLimit" :class="{leftHidden:leftMenuOpen}">
      <el-container>
        <el-header>
          <router-view name="header"></router-view>
        </el-header>
        
        <el-main>
          <!-- 左边导航 -->
          <div class="page-container" v-if="haveLeft">
            <el-container class="main_body">
              <el-aside class="left_aside">
                <left-menu :navList="navList" class=""></left-menu>
              </el-aside>
              <el-container>
                <el-main>
                  <div class="breadcrumb">
                    <span class="left-menu-btn" @click="setLeftMenu">
                      <i v-if="leftMenuOpen" class="iconfont icon-zhankaizuolan" title="展开导航"></i>
                      <i v-else class="iconfont icon-shouqizuolan" title="折叠导航"></i>
                    </span>
                    <div class="breadcrumb_nav">
                      <base-nav></base-nav>
                    </div>
                  </div>
                  <!-- <router-view/> -->
                  <router-view></router-view>
                </el-main>
              </el-container>
            </el-container>
          </div>
          <div v-else class="main-no-left">
            <div class="breadcrumb">
              <div class="breadcrumb_nav">
                <base-nav></base-nav>
              </div>
            </div>
            <router-view></router-view>
          </div>
          
        </el-main>
      </el-container>
      
      <div class="loaderShow" v-if="isUser" :class="{topLoaderShow:headerTop}">
        <div class="progress_bar" v-if="loader">
          <div class="progress_bar_run"></div>
        </div>
      </div>
    </div>
    <!-- <div v-else v-loading.fullscreen.lock="!isUser"></div> -->
    <div id="loader-wrapper" v-if="!isUser && !login">
      <div class="loading-ant-spin loading-ant-spin-spinning">
        <span class="loading-ant-spin-dot loading-ant-spin-dot-spin">
          <i class="loading-ant-spin-dot-item"></i>
          <i class="loading-ant-spin-dot-item"></i>
          <i class="loading-ant-spin-dot-item"></i>
          <i class="loading-ant-spin-dot-item"></i></span>
        <div class="loading-ant-spin-text">正在加载... 请耐心等待...</div>
      </div>
    </div>
  </div>
</template>

<script>
import userServer from './api/user.server'
const leftMenu=()=>import('@/components/leftMenu/leftMenu.vue')
export default {
  name: 'app',
  data(){
      return {
        login:false,
        headerTop:true,
        leftList:['Home','Login',"MonitoringList","Playback","ScreenMap",'Error'],
        haveLeft:""
      }
  },
  components:{
    leftMenu
  },
  watch:{
    '$route'(to,from){
      this.getName();
      window.document.title = this.$t(to.meta.title);
      
      if(!to.meta.requiresAuth){
        this.login=true;
      }else{
        this.login=false;
      }
      if(to.meta.header=="nolimit"){
        this.headerTop = true;
      }else{
        this.headerTop = false;
      }
    }
  },
  created(){
      this.getName();
	  document.body.setAttribute('data-theme','theme1');
  },
  mounted(){
    var refresh_taken=localStorage.getItem('refresh_token');
    if(refresh_taken){
      userServer.loadUser();
    }
  },
  computed:{
    isLimit(){
      return this.$store.state.isLimit;
    },
    loader(){
      return this.$store.state.loaderCurrent;
    },
    isUser(){
      return this.$store.state.currentUserDetails?true:false;
    },
    leftMenuOpen(){
      return this.$store.state.leftMenuOpen;
    },
    navList(){
      return 'user'
    }
  },
  methods:{
    getName(){
      var name = this.$router.history.current.name;
      if(this.leftList.indexOf(name)==-1){
        this.haveLeft=true;
      }else{
        this.haveLeft=false;
      }
      let currentStyle=localStorage.getItem('currentTheme') || 1;
      document.body.setAttribute('data-theme','theme'+currentStyle);
    },
    setLeftMenu(){
      this.$store.commit('setLeftMenu',!this.leftMenuOpen);
    }
  }
}
</script>
<style lang="scss" scope>
@import "./common/css/main.scss";

.itage-content-w{
  width: 100%;
  .leftMenu-w{
    background: $themeContentColor;
    min-height: 1px;
  }
}
.breadcrumb{
  height: $breadcrumbHeight;
  @include header-title-bg;
  display: flex;
  border-bottom: 1px solid $borderBlack;
  @include theme-border-color;
  
  .left-menu-btn{
    height: $breadcrumbHeight;
    width: $breadcrumbHeight;
    line-height:38px;
    text-align: center;
    color: $textGrayColor;
    @include header-menu-bg;
    z-index: 999;
    overflow: hidden;
    border-right: 1px solid $borderBlack;
    border-bottom: 1px solid $borderBlack;
    @include theme-border-color;
    i{
      font-size: 14px;
      cursor: pointer;
    }
  }
  .breadcrumb_nav{
    color: $textGrayColor;
    line-height: $breadcrumbHeight;
    padding: 0 20px;
    clear: both;
    width: 100%;
  }
}
.main-no-left{
  height: 100%;
}
.loaderShow{
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 999;
  height: 3px;
  overflow: hidden;
  
  .progress_bar{
    height: 100%;
    width: 100%;
    background: rgb(233, 245, 230);
    @include theme-content-bg;
    position: relative;
    .progress_bar_run{
      position: absolute;
      top: 0;
      height: 100px;
      left: -60%;
      width: 60%;
      background: $themeOrange;
      // @include header-menu-bg;
      animation:widthChange 1s infinite;
      -webkit-animation:widthChange 1s infinite;
    }
    @keyframes widthChange{
      from{left: -60%;}
      to{left: 100%}
    }
    

  }
  &.topLoaderShow{
    top:0;
  }
}


// 加载
#loader-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999999;
  background-color: #001d33;
}
.loading-ant-spin{
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  font-feature-settings: 'tnum';
  display: none;
  color:#7b92a3;
  text-align: center;
  vertical-align: middle;
  opacity: 0;
  transition: transform 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
}
.loading-ant-spin-spinning{
  width: 100%;
  opacity: 1;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loading-ant-spin-text {
  position: absolute;
  top: 50%;
  width: 100%;
  padding-top: 30px;
  color: #7b92a3;
  font-size: 16px;
}
.loading-ant-spin-dot {
    position: relative;
    display: inline-block;
    font-size: 32px;
    width: 1em;
    height: 1em;
}
.loading-ant-spin-dot i {
    width: 14px;
    height: 14px;
}
.loading-ant-spin-dot-spin {
  transform: rotate(45deg);
  animation: antRotate 1.2s infinite linear;
}
.el-table th div div{
	padding-left: 0 !important;
}
.loading-ant-spin-dot-item {
    position: absolute;
    display: block;
    width: 0.9rem;
    height: 0.9rem;
    background-color: #7b92a3;
    border-radius: 100%;
    transform: scale(0.75);
    transform-origin: 50% 50%;
    opacity: 0.3;
    animation: antSpinMove 1s infinite linear alternate;
}
.loading-ant-spin-dot-item:nth-child(1) {
    top: 0;
    left: 0;
}
.loading-ant-spin-dot-item:nth-child(2) {
    top: 0;
    right: 0;
    animation-delay: 0.4s;
}
.loading-ant-spin-dot-item:nth-child(3) {
  right: 0;
  bottom: 0;
  animation-delay: 0.8s;
}
.loading-ant-spin-dot-item:nth-child(4) {
  bottom: 0;
  left: 0;
  animation-delay: 1.2s;
}
@keyframes antRotate {
  100%{
    transform: rotate(405deg);
  }
}
@keyframes antSpinMove {
  100% {
      opacity: 1;
  }
}

	

</style>
