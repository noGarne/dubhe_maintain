<template>
<!-- 头部 -->
  <div class="nav-menu_w">
    <div class="nav-menu">
      <div class="nav-menu-left">
        <div class="logo">
          <img src="../../common/images/logo.png" alt="">
         <!-- <i class="iconfont icon-logo"></i>
          <h1>{{$t('common.project-name')}}</h1> -->
        </div>
        <nav-list></nav-list>
      </div>
      <user-details></user-details>
    </div>
  </div>
</template>
<script>
const navList=()=>import("../../components/header/NavList.vue")
const UserDetails=()=>import("../../components/header/UserDetails.vue")
export default {
  name: "navMenu",
  data(){
      return {
        menuList:{},
      }
  },
  components:{
    navList,
    UserDetails
  },
}
</script>
<style lang="scss">
.nav-menu_w{
  height: $headerHeight;
  vertical-align: center;
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
}
.nav-menu{
  background: $hearderBg;
  height: $headerHeight;
  vertical-align: center;
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  z-index: 2;
  display: flex;
  justify-content:space-between;
  .nav-menu-left{
    display: flex;
  }
  .logo{
    float: left;
    height: $headerHeight;
    line-height: $headerHeight;
    overflow: hidden;
    box-sizing: border-box;
    display: flex;
    width: 380px;
    align-items: center;
    padding-left: 20px;
    i{
      color: #fff;
      font-size: 25px;
	  padding-right: 10px;
	  padding-left: 5px;
    }
    
    h1{
      color: #fff;
      font-weight: normal;
      padding-left: 10px;
      font-size: 20px;
	  letter-spacing: 1px;
    }
  }
  ul{
    float: left;
    li{
      float: left;
      // margin-left: 40px;
    }
  }
  .userEmail{
    float: right;
  }
}
@media screen and (max-width: 1580px) {
  
}

@media screen and (max-width: 1430px) {
  .nav-menu {
    .nav_link .nav{
      span{
        font-size: 14px;
      }
    }
  }
  .logo{
    width: $leftMenuWidth*0.8;
  }
}

@media screen and (max-width: 1290px) {
  
}

@media screen and (max-width: 1000px) {
  .logo{
    display: none;
  }
}

@media screen and (max-width: 767px) {
  .nav-menu{
    ul {
      float: none;
      li{
        margin-left: 0;
      }
    }
    .logo{
      width:80px;
    }
  } 
}

</style>
