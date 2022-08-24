/**
 * 登录服务
 */
import ajax from './ajax'

import config from "./config"
var BASE_URL = config.BASE_URL;

/**
 * 获取终端日志列表
 * @param {number} pageSize        一页显示条数
 * @param {number} pageIndex       当前页码
 * @param {string} type            类型
 * @param {string} imei            终端编号
 * @param {string} startTime       开始时间
 * @param {string} endTime         结束时间
 */
function getRpcMsg(arg){
    var arg=arg?arg:{};
    var pageSize = arg.pageSize?arg.pageSize:14;
    var pageIndex = arg.pageIndex-1?arg.pageIndex-1:0;
    var type = arg.type?arg.type:"";
    var imei = arg.imei?arg.imei:"";
    var startTime = arg.startTime?arg.startTime:"";
    var endTime = arg.endTime?arg.endTime:"";
    var data = {
        pageSize:pageSize,
        pageIndex:pageIndex,
    }
    !type||(data['type']=type);
    !imei||(data['imei']=imei);
    !startTime||(data['startTime']=startTime);
    !endTime||(data['endTime']=endTime);

    return ajax(BASE_URL + '/rpcMsg', data)
}
function getRpcMsgTypes(){
    return ajax(BASE_URL + '/rpcMsg/types')
}

export default {
    getRpcMsg,
    getRpcMsgTypes
}