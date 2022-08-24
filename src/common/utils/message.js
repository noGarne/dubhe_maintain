import Vue from "vue"
var vue = new Vue();
function error(message,duration = 3000){
    vue.$message({
        // type:"error",
        // showClose:true,
        customClass:'msg-toast',
        iconClass:'msg-icon-error iconfont icon-shibai',
        center:true,
        message:message,
        duration:duration
    })
}

function success(message,duration = 3000){
    vue.$message({
        // type:"success",
        // showClose:true,
        customClass:'msg-toast',
        iconClass:'msg-icon-success iconfont icon-qiyong',
        center:true,
        message:message,
        duration:duration
    })
}

function warning(message,duration = 3000){
    vue.$message({
        // type:"warning",
        // showClose:true,
        customClass:'msg-toast',
        iconClass:'msg-icon',
        center:true,
        message:message,
        duration:duration
    })
}

function info(message,duration = 3000){
    vue.$message({
        // showClose: true,
        customClass:'msg-toast',
        iconClass:'msg-icon',
        center:true,
        message: message,
        duration:duration
    });
}

function toast(message,duration = 3000){
    vue.$message({
        customClass:'msg-toast',
        iconClass:'msg-icon',
        center:true,
        message: message,
        duration:duration
    });
}

export default {
    error,
    success,
    warning,
    info,
    toast
}