/**
 * 登录服务
 */
import ajax from './ajax'

import config from "./config"
var BASE_URL = config.BASE_URL;
var MAINTAIN_URL = config.MAINTAIN_URL;
/**
 * 获取版本信息
 * @param {string} activateToken    token码
 */
function getVersion(){
    // return ajax(BASE_URL + '/noauth/apiPing')
}

/**
 * 登录
 * @param {string} username    用户名
 * @param {string} password    密码
 */
function login(user) {
    return new Promise(function(resolve,reject){
        var loginRequest = {
            username: user.username.trim(),
            password: user.password.trim()
        };
        //console.log(loginRequest)
        ajax(MAINTAIN_URL + '/auth/login',loginRequest,'post').then(function success(response){
            resolve(response)
        },function fail(response){
            reject(response)
        })
    })
}

/**
 * 创建密码
 * @param {string} activateToken    token码
 * @param {string} password         密码
 */
function createPassword(data){
    return ajax(BASE_URL + '/noauth/activate', data, 'post')
}

/**
 * 重置忘记密码
 * @param {string} email    邮箱
 */
function forgetPassword(data){
    // var data
    return ajax(BASE_URL + '/noauth/resetPasswordByEmail', data, 'post')
}

/**
 * 重置密码
 * @param {string} userId       用户id
 * @param {string} password     密码
 */
function resetPassword(data){
    return ajax(BASE_URL + '/noauth/resetPasswordByEmail', data, 'post')
}

export default {
    getVersion,
    login,
    createPassword,
    forgetPassword,
    resetPassword
}