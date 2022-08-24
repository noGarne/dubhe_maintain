import ajax from "./ajax";
import config from "./config"
var BASE_URL = config.BASE_URL;

// 获取lpx文件列表
function lpxList(type){
    let url= BASE_URL + '/noauth/mapCollect/trackFiles/infos/list'
    return ajax(url, {type})
}

// 重命名lpx文件
function renameLpx(data){
    // 文件名必须以MCP_/MCB_/MCS_等开头
    let url= BASE_URL + '/noauth/mapCollect/trackFiles/rename'
    return ajax(url, data, "post")
}

// import axios from "axios"

// 加载lpx文件数据
function lpxFile(fileName){
    // return axios.get('/data/' + fileName).then(res => res.data)
    let url= `${BASE_URL}/noauth/download/file/${fileName}`
    return ajax(url, {})
}

// 加载lpx文件数据
function lpxFileById(fileId){
    let url= `${BASE_URL}/noauth/download/file/id/${fileId}`
    return ajax(url, {})
}

/**
 * 上传lpx文件
 * @param {string}  formData      上传文件
 * @param {function}  curProgressEvent  上传进程
 * @param {object}  cancelProgress      取消上传
 */
function uploadingLpxFiles(formData, curProgressEvent, cancelProgress) {
    // let success = {"Ret":0,"msg":"success"}
    // let failure = {"Ret":3,"msg":"根据IMEI号未能找到设备,IMEI:left"}
    let url =  BASE_URL + '/noauth/mapCollect/trackFiles'
    return ajax(url, formData, 'file', curProgressEvent, cancelProgress)
}

export default {
    lpxList,
    lpxFile,
    lpxFileById,
    renameLpx,
    uploadingLpxFiles,
}
