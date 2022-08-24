<template>
  <!-- 头部右边操作 -->
  <div class="user-detail">
    <!-- 天气 -->
    <!-- <div class="header-weather">
      晴 24℃
    </div> -->
    <!-- 分区列表 -->
    <div class="diggings" v-if="isShowFleet && subareaList.length>0">
      <el-select size="small"  filterable v-model="selectedFleet" :placeholder="$t('action.select')">
        <el-option
          v-for="(item,index) in subareaList"
          :key="index"
          :label="item.miningName"
          :value="item.id">
        </el-option>
      </el-select>
    </div>
    
    <div class="ucenter min-none">
      <message-notification></message-notification>
    </div>
    <!-- 关于我的 -->
 <div class="ucenter min-none">
      <el-dropdown trigger="click">
        <span class="user-email el-dropdown-link">
          <i class="iconfont icon-dinglanyonghu user-header"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
		<el-dropdown-item disabled class="user-infos">
		         {{userEmail}}
		</el-dropdown-item>
          <el-dropdown-item @click.native="cancel">{{$t("header.exit-login")}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    
    <!-- 全屏 -->
    <div class="setter min-none" @click="handleFullScreen">
      <span>
          <i v-if="!isFullScreen" :title='$t("header.fullscreen")' class="iconfont icon-zuidahua"></i>
          <i v-else :title='$t("header.cancel-fullscreen")' class="iconfont icon-suohui"></i>
      </span>
    </div>
    <change-psw ref="changePassword"></change-psw>
    <user-info ref="userInfo"></user-info>
    <!-- <base-confirm ref="refConfirm"></base-confirm> -->
  </div>
</template>
<script>
import userServer from '../../api/user.server'

const changePsw=()=>import('../../components/header/changePsw')
const UserInfo=()=>import('../../components/header/UserInfo')
const MessageNotification=()=>import('./MessageNotification')

export default {
  name:"userDetail",
  components:{
    changePsw,
    UserInfo,
    MessageNotification
  },
  data(){
    return {
      toggleStyle:false,
      currentStyle:1,
      isFullScreen:false,
      subareaList:[],
      selectedFleet:'',
      dispatchPage:['dispatch','loadBoundary','monitoring','statement','configuration','carGettingMonitor','toolbox'],
      exceptRouteName:['LoadareaBoundaryMap','UnloadAeraMovementMap','DigLoadingAreaMap','CrushingStationMap','ParkingLotMap'],//头部不显示分区的路由名称
    }
  },
  computed:{
    isShowFleet(){
      let page = this.dispatchPage.find(item => item == this.$route.meta.header);
	 // this.selectedFleet = 1;WW
      return page && !this.exceptRouteName.find(item=>item==this.$route.name);
    },
    userEmail(){
      return this.$store.state.currentUserDetails?this.$store.state.currentUserDetails.email:"";
    },
    // roleName(){
    //   return this.$store.state.currentUserDetails?this.$store.state.currentUserDetails.roleName:"";
    // }
  },
  watch: {
    selectedFleet(val){
      this.$store.commit('setSubareaSn',val);
      // var subareaName = this.subareaList.find(item=>item.subareaSn == val).subareaName;
      // var subareaId = this.subareaList.find(item=>item.subareaSn == val).id;
    
    },
    '$route'(to,from){
      let page = this.dispatchPage.find(item => item == this.$route.meta.header);

      if(page && to.meta.header!=from.meta.header){
        this.getSubareaList();
      }
    }
  },
  created(){
    // let page = this.dispatchPage.find(item => item == this.$route.meta.header);
    // if(page){
        this.getSubareaList();
    // }
    this.currentStyle=localStorage.getItem('currentTheme') || 1;
    document.body.setAttribute('data-theme','theme'+this.currentStyle);
  },
  mounted(){
    var _this=this;
    // 监听退出全屏
	
    document.addEventListener("fullscreenchange", screenChange);
    document.addEventListener("webkitfullscreenchange", screenChange);
    document.addEventListener("mozfullscreenchange", screenChange);
    document.addEventListener("MSFullscreenChange", screenChange);

    function screenChange(){
      var fullscreenEle = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
      if (!fullscreenEle) {
        _this.isFullScreen=false;
      }
    }
  },
  methods:{
    cancel () {
      // this.$refs.refConfirm.showConfirm({
      this.$messageConfirm.showConfirm({
        content:this.$t('header.is-quit'),
        // detail:'提示详情'
      },async ()=>{
        // 确定操作
        try {
          userServer.clearTokenData();
          this.$store.commit('setCurrentUserDetails',null);
          this.$router.push('/login');
        } catch (e) {
          this.messages.error(e.message);
        }
      });
    },
    checkFull() {
        var isFull = document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
        if (isFull === undefined) {isFull = false;}
        return isFull
    },
    // 全屏
    handleFullScreen(){
      let element = document.documentElement;
      if (this.isFullScreen) {
          if (document.exitFullscreen) {
              document.exitFullscreen();
          } else if (document.webkitCancelFullScreen) {
              document.webkitCancelFullScreen();
          } else if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
          } else if (document.msExitFullscreen) {
              document.msExitFullscreen();
          }
      } else {
      
          if (element.requestFullscreen) {
              element.requestFullscreen();
          } else if (element.webkitRequestFullScreen) {
              element.webkitRequestFullScreen();
          } else if (element.mozRequestFullScreen) {
              element.mozRequestFullScreen();
          } else if (element.msRequestFullscreen) {
              // IE11
              element.msRequestFullscreen();
          }
      }
      this.isFullScreen = !this.isFullScreen;
    },
    goAttribute(){
      // this.$router.push('/attribute')
      // 用户信息
      this.$refs.userInfo.closeUserDialog();
    },
    updatePwd(){
      // 更改密码
      this.$refs.changePassword.closeDiggerDialog();
    },
    async getSubareaList(){
      try {
        var list=await userServer.getMiningNameList();
        this.subareaList=list;
		var subareaSn=this.$store.state.subareaSn;
		var isSubareaSn=false;
		list.forEach(val =>{
		  if(subareaSn == val.id){
		    isSubareaSn=true;
		  }
		});
		var sid= this.subareaList.length>0 ? this.subareaList[0].id : '';
		this.selectedFleet=subareaSn && isSubareaSn ? parseInt(subareaSn) : sid;
      } catch (e) {
        this.messages.error(e.message);
      }
    },
    showStyle(v){
      this.toggleStyle=v;
    },
    changeStyle(type){
      //修改主题样式
      this.currentStyle=type;
      this.toggleStyle=false;
      document.body.setAttribute('data-theme','theme'+type);
      localStorage.setItem('currentTheme',type);
    }
  }
}
</script>
<style lang="scss" scoped>
.el-dropdown-menu{
  padding-top: 0;
  .el-dropdown-menu__item{
    width: 260px;
  }
  .el-dropdown-item a{
    display: block;
  }
}

.user-infos{
  color: $textGrayColor !important;//#606266 !important;
  border-bottom: 1px solid $borderColor;
  @include theme-search-border;
}
.item-arrow:after{
  position: absolute;
  right: 10px;
  font-family: 'element-icons';
  content: "\E6E0";
  font-size: 12px;
  font-weight: bold;
}

.user-theme-menu{
  position:relative;
  transition: all 3s ease-in-out;
}
.user-theme-item{
  position: absolute;
  // left: -98px;
  left: -108px;
  width: 120px;
  li.active{
    color: $themeOrange;
    // background-color: $themeContentBg;
    @include select-dropdown-active;
    // color: #66b1ff;
    &::after{
      position: absolute;
      right: 10px;
      // left: 4px;
      font-family: 'element-icons';
      content: "\e6da";
      font-size: 12px;
      font-weight: bold;
    }
  }
  .user-theme-color{
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: $themeContentBg;
  }
  .el-dropdown-menu__item{
    width: auto;
  }
}
</style>

<style lang="scss">
.user-detail{
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: $headerHeight;
  color: $textGrayColor;
  .header-weather{
    color: $textGrayColor;
    margin-right: 20px;
  }
  .el-badge__content{
    border: none;
  }
  .diggings{
    input{
      background: none;
      border:1px solid $borderColor;
      color: $textGrayColor;
    }
  }
  .setter{
    cursor: pointer;
    font-size: 16px;
    margin: 0 20px;
    a{
      color: $textGrayColor!important;
      &:hover{
        text-decoration: none;
      }
    }
    i{
      font-size: 18px;

    }
    .text_btn{
      margin-left: 5px;
    }
  }
  .goback{
    margin-right: 20px;
  }
  .ucenter{
    cursor: pointer;
    margin-left: 20px;
    .user-email{
      color: $textGrayColor;
      i{
        font-size: 12px!important;
        display: inline;
        color: $textGrayColor!important;
      }
      .user-header{
        font-size: 20px!important;
        display: inline-block;
        padding-right: 4px;
      }
    }
    .el-dropdown{
      font-size: 16px !important;
    }
  }
}


@media screen and (max-width: 1600px) {
  .user-detail{
    .text_btn{
      display: none;
    }
  }
}

@media screen and (max-width: 1200px) {
  .user-detail{
    .diggings span,.setter{
      margin-left: 30px;
      i{
        font-size: 20px!important;
      }
    }
    .ucenter{
      margin: 0 20px;
    }
  }
}

@media screen and (max-width: 900px) {
  .min-none{
    display: none;
  }
  .diggings{
    margin-right: 20px;
  }
}

</style>

