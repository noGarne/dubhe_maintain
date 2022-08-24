import Vue from 'vue'
import Router from 'vue-router'
import userServer from "../api/user.server";
import routes from "./routes";
import store from "../store";
import loginServer from "../api/login.server"
import userService from "../api/user.server"

Vue.use(Router)


var router=new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach((to, from, next) => {

  store.state.cancelToken.forEach(e=>{
      e && e()
  });
  store.commit('clearCancelTonken');
  // 标题
  //window.document.title = to.meta.title;
  var limit=to.meta.header;
  var exceptLimit=['nolimit','attribute'];
  
  // 获取验证
  let token = window.localStorage.getItem('jwt_token')
  let token_expiration = parseInt(window.localStorage.getItem('jwt_token_expiration'));
  // let refresh_token = window.localStorage.getItem('refresh_token')
  let refresh_token_expiration = parseInt(window.localStorage.getItem('refresh_token_expiration'))
  var nowDate=new Date().valueOf();
  if (to.matched.length === 0) { //匹配前往的路由不存在
    from.name ? next({
      name: from.name
    }) : next({
      path: '/error',
    });
  } else if (refresh_token_expiration && nowDate > refresh_token_expiration) {//匹配验证时间是否过期,跳转到登录页面
    userServer.clearTokenData();
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else if (to.matched.some(record => record.meta.requiresAuth) && (!token || token === null)) {//匹配有沒有taken验证
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else if(to.name == 'Login' && token){//如果在存在用戶信息切在登录页面
    next({
      path: '/',
    })
  } else {

     //权限判断
     if(token){
      if(store.state.currentUserDetails){
        limitSet();
      }
      else{
        store.dispatch('fetchPermission',token).then(()=>{
          limitSet();
        });
      }
    }
    else {
      store.commit('setLimit',true);
    }

    function limitSet(){
      if(store.state.currentUserDetails && store.state.currentUserDetails.authorization){
        var arr = store.state.currentUserDetails.authorization;
        if(exceptLimit.includes(limit)){
          store.commit('setLimit',true);
        }else if(arr.includes(to.name) || arr.includes(to.path)){
          store.commit('setLimit',true);
        }else if(arr.includes(to.matched[0].name) || arr.includes(to.matched[1].name)){
          store.commit('setLimit',true);
        }else if(arr.includes(to.matched[0].path) || arr.includes(to.matched[1].path)){
        store.commit('setLimit',true);
        }else{
          store.commit('setLimit',false);
          //next('/error')
          var vue=new Vue();
          vue.$messageConfirm.showConfirm({
            content:'您没有访问此位置的权限，如果您仍需要访问此位置，请尝试使用其他用户登录？',
            // detail:'提示详情'
          },()=>{
            // 确定操作
            userServer.clearTokenData();
            next('/login')
          });
        }
        return
      }
    }

    next();
    
  }
})

router.afterEach((to, from, next) => {
  window.scrollTo(0, 0);
});

export default router;