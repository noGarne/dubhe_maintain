<template>
  <!-- 首页 -->
  <div>

  </div>
</template>

<script>
import menuService from '../../components/header/menu.service'
export default {
  data(){
    return{
      indexPage:null
    }
  },
  computed:{
    navList(){
      var limitList=[];
      let indexPage = null;
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
        if(!item.disabled && item.id > 0){
          if(!indexPage)indexPage=item;
        }
      }
      if(indexPage && indexPage.hasOwnProperty('id')){
        this.indexPage = indexPage;
      }
      return limitList;
    },
    authorityTenant(){
      let userInfo = this.$store.state.currentUserDetails;
      return userInfo && userInfo.authority == "TENANT_ADMIN"
    }
  },
  mounted(){
    this.getList();
  },
  methods:{
    getList(){
      // 首页权限跳转
      let nav = this.navList;
      let indexPage = this.indexPage;
      let to = '/dispatch';
      let route = 'Dispatch';
      if(indexPage && indexPage.hasOwnProperty('id')){
        if(indexPage.link){
          to = indexPage.link;
          this.$router.replace(to);
          return;
        }
        route = indexPage.route;
        this.$router.replace({name:route});
        return;
      }
      this.$router.replace(to);
    }
  }
}
</script>

<style lang="scss" scoped>

</style>