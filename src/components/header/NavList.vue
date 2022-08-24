<template>
  <!-- 一级导航菜单 -->
  <div class="nav_list_down">
    <div 
      v-for="(item,index) in navList" 
      :key="index" 
      :class="{no_jurisdiction:item.disabled,active:item.active == curRouter}"
      :title="!item.disabled?'':'无权限'">
      <template v-if="item.link">
        <router-link :to="{path:item.link}">
          <div class="icon_text">
            <span><i class="iconfont" :class="item.icon"></i></span>
            <p>{{$t(item.name)}}</p>
          </div>
        </router-link>
      </template>
      <template v-else>
        <router-link :to="{name:item.route}">
          <div class="icon_text">
            <span><i class="iconfont" :class="item.icon"></i></span>
            <p>{{$t(item.name)}}</p>
          </div>
        </router-link>
      </template>
    </div>
  </div>
</template>
<script>

import menuService from './menu.service'

export default {
  name:"NavList",
  data(){
    return {
      navShow:false,
      curRouter:""
    }
  },
  mounted(){
    document.addEventListener('click', (e) => {
       if (!this.$el.contains(e.target)) this.navShow = false;
   })
    this.curRouter = this.$route.meta.header;
  },
  watch:{
    '$route'(n){
      this.curRouter = n.meta.header;
    }
  },
  computed:{
    navList(){
      var limitList=[];
      let userInfo = this.$store.state.currentUserDetails;
      var limit = (userInfo && userInfo.authorization) || [];
      var list = menuService.getSections();
      for (const key in list) {
        const item = list[key];
        item['active']=key;
        if(!limit.some(v => v == item.route || v == item.link)){
          var child = item.children;
          if(child && child.length>0){
            var isExist = false;
            for(let i=0;i<child.length;i++){
              if(limit.some(u => u == child[i].route || u == child[i].link)){
                item.route=child[i].route;
                if(child[i].link)item.link=child[i].link;
                isExist=true;
                break;
              }
            }
            if(!isExist){
              item.disabled='no_jurisdiction';
              item.route='';
              item.link='';
            }
            
          }else{
            item.disabled='no_jurisdiction';
            item.route='';
            item.link='';
          }
        }
        if(this.authorityTenant && item.id > 0){
          limitList.push(item);
        }
      }
      return limitList;
    },
    authorityTenant(){
      let userInfo = this.$store.state.currentUserDetails;
      return userInfo && userInfo.authority == "TENANT_ADMIN"
    }
  },
  methods:{
    
  }
}
</script>
<style lang="scss" scoped>
.nav_list_down{
  height: 100%;
  display: flex;
  align-items: center;
  &>div{
    float: left;
    width: 100px;
    text-align: center;
    height: 100%;
    &.no_jurisdiction{
      opacity: 0.4;
    }
    .icon_text{
      display: flex;
      height: 100%;
      flex-direction:column;
      span{
        padding-top: 12px;
        i{
          color: $textGrayColor;
          font-size: 24px;
        }
      }
      p{
        margin-top: 2px;
        color: $textGrayColor;
      }
    }
    &:not(.no_jurisdiction){
      &:hover,&.active{
        background: #10131c;
        span{
          i{
            color: $themeOrange;
          }
        }
        p{
          color: $themeOrange;
        }
      }

    }
  }
}
</style>
<style lang="scss">
.icon_text{
  a{
    display: block;
    height: 100%;
    width: 100%;
  }
}
</style>
