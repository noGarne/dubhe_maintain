<template>
    <div class="nav-content">
      <span class="nav-info">{{navData}}</span>
      <span class="version-info">版本信息 V1.1.7.1</span>
    </div>
</template>

<script>
  import menuService from "../../components/header/menu.service";
  import loginServer from "../../api/login.server"
  export default {
    props:['navList'],
    data(){
      return{
        
      }
    },
    computed:{
      versionInfo(){
        return this.$store.state.versionInfo;
      },
      navData(){
        // 目前支持四级导航面包屑显示，后续再优化
        let _this = this;
        let matched = this.$route.matched;
        let path = this.$route.path;
        let header = this.$route.meta && this.$route.meta.header;
        let menus =  menuService.getSections();
        let arr = [];
        if(!header)return;
        let data = menus[header];
        if(!data)return;
        arr.push(_this.$t(data.name));
        let c1 = data.children;
        if(matched.filter(item=>item.path.includes(':')).length<=0){
          // 静态路由
          if(c1 && c1.length>0){
            c1.forEach(v1=>{
              if(v1.link == path){
                arr.push(_this.$t(v1.name));
              }else{
                let c2 = v1.children;
                if(c2 && c2.length>0){
                  c2.forEach(v2=>{
                    if(v2.link == path){
                      arr.push(_this.$t(v1.name));
                      arr.push(_this.$t(v2.name));
                    }else{
                      let c3 = v2.children;
                      if(c3 && c3.length>0){
                        c3.forEach(v3=>{
                          if(v3.link == path){
                            arr.push(_this.$t(v1.name));
                            arr.push(_this.$t(v2.name));
                            arr.push(_this.$t(v3.name));
                          }
                        });
                      }
                    }
                  });
                }
              }
            });
          }
        } else{
          // 动态路由
          let info = matched.find(item=>item.path.includes(':'));
          if(info){
            let name = info.name;
            if(c1 && c1.length>0){
              c1.forEach(v1=>{
                if(v1.route == name){
                  arr.push(_this.$t(v1.name));
                  let c2 = v1.children;
                  if(c2 && c2.length>0){
                    c2.forEach(v2=>{
                      if(v2.link == path){
                        arr.push(_this.$t(v2.name));
                      }else{
                        let c3 = v2.children;
                        if(c3 && c3.length>0){
                          c3.forEach(v3=>{
                            if(v3.link == path){
                              arr.push(_this.$t(v2.name));
                              arr.push(_this.$t(v3.name));
                            }
                          });
                        }
                      }
                    });
                  }
                }
              });
            }
          }
        }
        
        return arr.join('>');
      },
    },
    created(){
      // this.getVersion();
    },
    methods:{
      async getVersion(){
        // 版本信息
        let v = this.versionInfo;
        if(!v){
          try {
            var result = await loginServer.getVersion();
            if(result){
              this.$store.commit('setVersionInfo',result);
            }
          } catch (e) {
            this.versionInfo = '-';
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.nav-content{
  display: flex;
  justify-content: space-between;
}
</style>