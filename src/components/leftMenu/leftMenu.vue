<template>
  <div class="leftMenu">
    <el-menu
      :router="true"
      :default-active="$route.fullPath" 
      :collapse="leftMenuOpen"
      :unique-opened="true">
      <div 
        v-for="(item,index) in (menuList && menuList.children)" 
        :key="keyTime+index">
        <!-- 一级 -->
        <el-menu-item 
          v-if="!item.children" 
          :index="item.link"
          :name="item.link"
          :route="item.link"
          :title="!item.disabled?'无权限':''"
          :disabled="!item.disabled"
          class="first_menu_item">
            <i class="iconfont" :class="item.icon"></i>
            <span slot="title">{{$t(item.name)}}</span>
        </el-menu-item>
        <el-submenu 
          v-else 
          :index="item.name"
          class="first_menu_item"
          :title="!item.disabled?'无权限':''"
          :disabled="!item.disabled">
          <!-- 一级有下级标题 -->
          <template slot="title">
            <i class="iconfont" :class="item.icon"></i>
            <span slot="title" v-if="!leftMenuOpen">{{$t(item.name)}}</span>
          </template>
          <!-- 二级 -->
          <div v-for="(child,idx) in item.children" :key="child.link+''+idx">
              <el-menu-item 
                v-if="!child.children" 
                :index="child.link" 
                :route="child.link" 
                :name="child.link">
                {{$t(child.name)}}
              </el-menu-item>
              <div v-else>
                <el-submenu :index="child.name">
                  <!-- 一级有下级标题 -->
                  <template slot="title">{{$t(child.name)}}</template>
                  <!-- 三级 -->
                  <el-menu-item  
                    v-for="(third,i) in child.children" 
                    :key="third.link+''+i" 
                    :index="third.link" 
                    :route="third.link"
                    :name="third.link">
                      {{$t(third.name)}}
                  </el-menu-item>
                </el-submenu>
              </div>
          </div>
        </el-submenu>
      </div>
    </el-menu>
  </div>
</template>

<script>
import menuService from "../../components/header/menu.service";
import systemServer from '../../api/system.server';
export default {
  name:'LeftMenu',
  props:['navList'],
  data(){
      return {
        menuList:[],
        keyTime:"",
        //特殊处理一级页面
        firstMenuPage:"loadBoundary",
        //特殊处理二级页面
        secondMenuPage:{
          route:"ClosedClass",
          link:"/systemDebug/remoteOperation"
        },
      }
  },
  computed:{
    leftMenuOpen(){
      return this.$store.state.leftMenuOpen;
    },
    leftMenuRemoteOperation(){
      return this.$store.state.leftMenuRemoteOperation;
    }
  },
  
  watch:{
    "$route"(to,from){
      this.getList(to,from);
      this.keyTime = Date.parse(new Date());
    },
    leftMenuRemoteOperation(){
      this.getList({meta:{header:1}},{meta:{header:2}});
    }
  },
  created(){
    this.getList({meta:{header:1}},{meta:{header:2}});
    this.keyTime = Date.parse(new Date());
  },
  methods:{
    getList(to,from){
      var newPage = to.meta.header;
      var oldPage = from.meta.header;
      if(newPage!=oldPage || newPage==this.firstMenuPage){
        var path = this.$router.history.current;
        var header = path.meta.header?path.meta.header:null;
        var list= JSON.parse(JSON.stringify(menuService.getSections()));
        var child = list[header] && list[header].children;
        if(child){
          var limit = this.$store.state.currentUserDetails?(this.$store.state.currentUserDetails.authorization||[]):[];
          child.map((v)=>{
            if(limit.some(u => u == v.route || u == v.link)){
              v.disabled=true;
			  
            }
            // 作业管理特殊处理
            if(path.meta.header==this.firstMenuPage && path.name == v.route){
              v.link = path.fullPath;
            }
          })
        }
        this.menuList = list[header];
        // 远程启停功能菜单特殊处理
        let listNew = list[header];
        let listNew2 = listNew && listNew.children && listNew.children.find(v=>v.route == this.secondMenuPage.route);
        let index = listNew2 && listNew2.children && listNew2.children.findIndex(v=>v.link==this.secondMenuPage.link);
        // systemServer.getRemoteOperation().then((res)=>{
        //   this.$store.commit('setLeftMenuRemoteOperation',res);
        //   if(!res && index >= 0){
        //     listNew2.children.splice(index,1);
        //     // list[header].children.find(v=>v.route == this.secondMenuPage.route).children.splice(index,1);
        //   }
        //   this.menuList = list[header];
        // }).catch(e=>{
        //   this.menuList = list[header];
        // });
        // console.log(this.menuList);
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>