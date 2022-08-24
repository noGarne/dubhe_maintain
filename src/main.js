import Vue from 'vue'
import "./common/css/iconfont/fonts/iconfont.css"
import utils from './common/utils/utils';
import message from './common/utils/message';
import vars from './common/utils/vars';
import App from './App.vue'
import router from './router'
import axios from 'axios'
import  * as echarts from 'echarts'
Vue.prototype.$echarts = echarts;
import i18n from './locale'
import "babel-polyfill"

import './common/utils/validate';
import './plugins/element.js'


// NOTE: elementui按需引入时，个别组件有依赖，可能会重复引用样式
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// Vue.use(ElementUI)

import store from './store'
import userServer from './api/user.server'

Vue.prototype.bus = new Vue();
Vue.prototype.utils=utils;
Vue.prototype.formMsg=utils.validateFormMsg;
Vue.prototype.messages = message;
Vue.prototype.vars=vars;

import messageConfirm from './common/plugins/messageConfirm';
Vue.use(messageConfirm)

Vue.config.productionTip = false;
// 注册全局组件开始
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

const requireComponent = require.context(
  './common/components',
  false,
  /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)

  const componentName = upperFirst(
    camelCase(
      fileName.replace(/^\.\/(.*)\.\w+$/, '$1')
    )
  )

  // 全局注册组件
  Vue.component(
    componentName,
    componentConfig.default || componentConfig
  )
})
// 注册全局组件end

// 时间格式全局过滤器
Vue.filter("formatDate",(value,type)=>{
  if(type){
    return value ? utils.formatDate(value,type) : "";
  }else{
    return value ? utils.formatDate(value) : "";
  }
})

// 设置验证

const CancelToken = axios.CancelToken;
axios.interceptors.request.use(
  config => {
   config.withCredentials = true;
   if (Object.prototype.toString.call(config.data) != '[object FormData]') {
      config.timeout = 300000;
    // 请求拦截器处理
    }else{
      config.timeout = 1200000;
    }
   let token = localStorage.getItem('jwt_token')
   if (token) {
    config.headers = {
     'X-Authorization': 'Bearer '+token,
    }
   }
   config.cancelToken = new CancelToken((cancel) => {
       store.commit('setCancelToken',cancel);
   });
   return config
  },
  error => {
    console.log(error)
   return Promise.reject(error)
  }
)




axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (axios.isCancel(error)) {
      // 为了终结promise链 就是实际请求 不会走到.catch(rej=>{});这样就不会触发错误提示之类了。
        return new Promise(() => {});
    }else if (error.response) {
      if(error.response.data.message == 'Token has expired'){
        userServer.refreshJwtToken();
      }
    }
    return Promise.reject(error.response?error.response.data:"请检查网络是否连接正常");   // 返回接口返回的错误信息
  });

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
