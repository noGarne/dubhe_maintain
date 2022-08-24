/*
ajax请求函数模块
返回值: promise对象(异步返回的数据是: response.data)
 */

import axios from 'axios'
import store from '../store/index'

export default function ajax2 (url, data={}, type='GET') {
  store.state.loaderCurrent=true;
  // console.log(userServer)
  return new Promise(function (resolve, reject) {
      // 执行异步ajax请求
      let promise
      if (type === 'GET') {
        // 准备url query参数数据
        let dataStr = '' //数据拼接字符串
        Object.keys(data).forEach(key => {
          dataStr += key + '=' + encodeURIComponent(data[key])+ '&'
        })
        if (dataStr !== '') {
          dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
          url = url + '?' + dataStr
        }
        // 发送get请求
        promise = axios.get(url)
      } else if(type === 'post'){
        // 发送post请求
        promise = axios.post(url, data)
      }
      promise.then(function (response) {
        store.state.loaderCurrent=false;
        // 成功了调用resolve()
        resolve(response.data)
      }).catch(function (error) {
        store.state.loaderCurrent=false;
        //失败了调用reject()
        var err = {message:"请检查网络是否连接正常"};
        if (error.response) {
          err=error.response.data;
        } else if (error.request) {
          err=error.request;
        } else if((error instanceof Object)&&error.hasOwnProperty('message')){
          err=error;
        }
        reject(err);
      })
  })
}