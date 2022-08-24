/*
ajax请求函数模块
返回值: promise对象(异步返回的数据是: response.data)
 */

import axios from 'axios'
import store from '../store/index'
import userServer  from './user.server'

export default function ajax (url, data={}, type='GET', curProgressEvent, cancelProgress,configData) {
  
  store.state.loaderCurrent=true;
  return new Promise(function (resolve, reject) {
    userServer.isTakenStaleDatedT().then(()=>{
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
        promise = axios.get(url,configData)
        
      } else if(type === 'post'){
        // 发送post请求
        promise = axios.post(url, data,configData)
      }else if(type === 'put'){
        // 发送post请求
        promise = axios.put(url, data,configData)
      }else if(type === 'patch'){
        // 发送post请求
        promise = axios.patch(url, data,configData)
      }else if(type === 'delete'){
        // 准备url query参数数据
        let dataStr = '' //数据拼接字符串
        Object.keys(data).forEach(key => {
          dataStr += key + '=' + encodeURIComponent(data[key])+ '&'
        })
        if (dataStr !== '') {
          dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
          url = url + '?' + dataStr
        }
        promise = axios.delete(url,configData)
      }else if(type==="file"){
        var CancelToken = axios.CancelToken;
        let config = {
          onUploadProgress: progressEvent => {
            var complete = (progressEvent.loaded / progressEvent.total * 100 | 0)||0;
            curProgressEvent?curProgressEvent(complete,progressEvent):""
          },
          cancelToken: new CancelToken(function executor(c) {
            // executor 函数接收一个 cancel 函数作为参数
            // cancelProgress(c);
            cancelProgress?cancelProgress(c):""
          }),
          headers: {
              'Content-Type': 'multipart/form-data'  //之前说的以表单传数据的格式来传递fromdata
          }
        };
        promise = axios.post(url, data,config)
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
        if(err.message != "Token has expired"){
          reject(err);
        }
        
      })
    },function fail(e) {
      console.log(e);
    })
  })
}