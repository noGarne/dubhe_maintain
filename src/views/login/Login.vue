<template>
  <div class="page-login">
    <div class="login-box">
      <div class="login-header">
        <img src="../../common/images/login-header.png" alt="">
        <!-- <img class="cspt" @click="loginEnter" src="../../common/images/login-icon.png" alt=""> -->
      </div>
      <div class="login-content">
        <div class="login-left" @contextmenu.prevent="">
          <video class="login-video" muted autoplay loop>
            <source src="../../common/images/login-ani.mp4" type="video/mp4" />
          </video>
        </div>
        <div class="login-right">
          <div class="login-enter"></div>
            <div class="login-form">
              <div class="login-title">系统登录</div>
              <div class="login-input">
                <i class="iconfont icon-dengluyonghu"></i>
                <el-input 
                  v-model="username" 
                  @keyup.enter="login"
                  placeholder="用户名">
                </el-input>
              </div>
              <div class="login-input">
                <i class="iconfont icon-denglumima"></i>
                <el-input 
                  type="password"
                  v-model="password" 
                  @keyup.enter="login"
                  placeholder="密码">
                </el-input>
              </div>
              <div class="login-pwd">
                <el-checkbox v-model="remember">记住用户名密码</el-checkbox>
              </div>
              <!-- <div class="login-agree">
                <el-checkbox>我已阅读并接受</el-checkbox>
                <span class="login-a">《服务条款》</span>
              </div> -->
              <div class="login-button">
                <el-button ref="refLogin" v-if="!isLogin" class="btnBg login-button-style" @click="login">登录</el-button>
                <el-button v-else class="btnBg login-button-style" loading>登录中...</el-button>
              </div>
            </div>
        </div>
      </div>
    </div>
   <div class="login-bottom">
      <p>Copyright© {{currentYear}} 北京踏歌智行科技有限公司 All rights reserved.</p>
      <p>V1.1.7.1</p>
    </div>
  </div>
</template>

<script>
  import loginServer from "../../api/login.server"
  import userService from "../../api/user.server"

  export default {
    data(){
      return {
        remember:false,
        versionInfo:'',
        versionError:'',
        username:"",
        password:"",
        isLogin:false,
        passwordShow:true,
        currentYear:new Date().getFullYear(),
      }
    },
    computed: {
      loader(){
        return this.$store.state.loaderCurrent;
      }
    },
    watch:{
      username(v){
        this.username = this.utils.trim(v);
      },
      password(v){
        this.password = this.utils.trim(v);
      },
    },
    created(){
      
    },
    mounted() {
      this.getVersion();
      
      var remember = localStorage.getItem('remember');
      if(remember){
        remember = this.utils.decode(remember);
        remember = JSON.parse(remember);
        this.username = remember.username;
        this.password = remember.password;
        this.remember = true;
      }
      this.$nextTick(()=>{
        document.addEventListener('keyup',this.keyupLogin);
      })
    },
    methods:{
      async getVersion(){
         try{
            var result = await loginServer.getVersion();
            this.versionInfo='V'+result;
            if(result){
              this.$store.commit('setVersionInfo',result);
            }

            if(this.$route.query.hasOwnProperty('redirect') && this.$route.query.redirect.includes('/screenMap')){
              this.$router.push(this.$route.query.redirect);
            }
          }catch(e){
            this.versionError="版本信息获取异常";
          }
      },
      async login (ev) {
        var _this=this;
        const {username,password}=this;
        if(!username||!password){
          this.messages.error('用户名和密码不能为空');
          return;
        }
        _this.isLogin=true;
        ev.target.disabled=true;
        loginServer.login({username,password}).then(function success(response){
          var token = response.token;
          var refreshToken = response.refreshToken;
		  console.log(response)
          //清除调度中心选中的分区
          _this.$store.commit('cleanSubareaSn');
          // 获取用户信息
          userService.setUserFromJwtToken(token, refreshToken, true);
          
          if(_this.remember){
            var user = {username,password};
            user = JSON.stringify(user);
            user = _this.utils.encode(user);
            localStorage.setItem('remember',user);
          }else{
            localStorage.removeItem('remember');
          }
            
        },function fail(e){
          ev.target.disabled=false;
          _this.isLogin=false;
          _this.messages.error(e.message)
        })
      },
      loginEnter(){
        // 跳转到平台
        window.location.href = window.location.protocol + "//" + window.location.hostname + ':' + (ConfigData.monitorPort || 9000);
      },
      keyupLogin(e){
        if(e.keyCode === 13 || e.key === 'Enter'){
          this.login(e);
        }
      }
    },
    beforeDestroy(){
       document.removeEventListener('keyup',this.keyupLogin);
    }
  }
</script>

<style lang="scss" scoped>
.page-login{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('../../common/images/login-bg.jpg') center center no-repeat;
  background-size: 100% 100%;
  .login-box{
    position: absolute;
    top: 18%;
    left: 24%;
    width: 1000px;
    height: 460px;
    .login-header{
      text-align: center;
      margin-bottom: 10px;
      img{
        vertical-align: middle;
      }
    }
    .login-content{
      display: flex;
      width: 100%;
      height: 100%;
      .login-left{
        width: 60%;
        text-align: right;
        .login-video{
          height: 100%;
          border-bottom-left-radius: 5px;
          border-top-left-radius: 5px;
          box-shadow: 0px 10px 20px 0px rgba(0,0,0,.5);
        }
      }
      .login-right{
        width: 40%;
        line-height: 20px;
        position: relative;
        background: $textWhiteColor;
        border-bottom-right-radius: 5px;
        border-top-right-radius: 5px;
        box-shadow: 0px 10px 20px 0px rgba(0,0,0,.5);
        .login-form{
          position: absolute;
          top: 20%;
          left: 40px;
          right: 60px;
          .login-title{
            font-size: 24px;
            color: $headerTitle;
            margin-bottom: 30px;
          }
          .login-input{
            margin: 20px 0;
            position: relative;
            i{
              position: absolute;
              left: 12px;
              top:50%;
              transform: translateY(-50%);
              z-index: 1;
              color: #8e96ac;
              font-size: 14px;
            }
          }
          .login-agree{
            margin-top: 10px;
            font-size: 14px;
            color: #353a4a;
            .login-a{
              color: #ff7200;
              display: inline-block;
              cursor: pointer;
            }
          }
          .login-button{
            margin: 20px 0;
          }
          .login-button-style{
            width: 100%;
            font-size: 16px;
            letter-spacing: 2px;
          }
		  /deep/ .login-pwd{
			  .el-checkbox__label{
				  color: #606266!important;
			  }
		  }
        }
        .login-enter{
          position: absolute;
          left: 30%;
          top: 4%;
          width: 40px;
          height: 40px;
        }
        
      }
    }
  }
  .login-bottom{
    position: absolute;
    bottom: 20px;
    color: #b6bfd7;
    width: 100%;
    font-size: 14px;
    p{
      text-align: center;
      line-height: 24px;
      span{
        color:#d00;
      }
    }
  }
}
@media screen and (max-width:1746px) {
  .page-login{
    .login-box {
      left: 22%;
  }
  }
}
@media screen and (max-width:1536px) {
  .page-login{
    .login-box {
      left: 15%;
  }
  }
}
@media screen and (max-width:1280px) {
  .page-login{
    .login-box {
      top: 6%;
  }
  }
}
@media screen and (max-width:1024px) {
  .page-login{
    .login-box {
        width: 100%;
        position: relative;
        top: 0;
        left: 0;
        .login-header{
          img{
            width: 100%;
            &:last-child{
              display: none;
            }
          }
        }
        .login-content{
          justify-content: center;
          .login-left{
            width: 0;
            display: none;
          }
          .login-right{
            width: 100%;
          }
        }
    }
    
  }
}
           
</style>
<style lang="scss">
.page-login{
  .el-input__inner{
    color: #353a4a;
    border-color: #bdc4d7;
    height: 40px !important;
    line-height: 40px !important;
    font-size: 16px;
    padding-left: 32px;
  }
}
</style>