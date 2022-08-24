/**
 *  接管舱接口 cts
 */

import ajax from './ajax.js'
import config from './config.js'

const CTS_URL = config.CTS_URL;

/**
 * 日志接口1
 * 不传协议类型，初次进入页面使用
 */
// function findByTimeStampsBetween(data){
//   // start/end是timestamp
//   // let sample = {
//   //   "date":"2021-08-19",
//   //   "start":1629372512267,
//   //   "end":1629372512267,
//   //   "page":0,
//   //   "size":1
//   // }
//   let url = `${CTS_URL}/cabin/findByTimeStampsBetween`;
//   return ajax(url,data,'post');
// }

/**
 * 日志接口2，支协议类型
 * NOTE: 该查询是基于es的，和一般的后台查询不同
 */
function queryDetails(data){
  // let sample = {
  //   "date": "2021-08-19",
  //   "protocolType": [3,5],
  //   "start": 1629372512267,
  //   "end": 1629372512267,
  //   "page": 0,
  //   "size": 10
  // }
  let url = `${CTS_URL}/cabin/queryDetails`;
  return ajax(url,data,'post');
}

/**
 * 协议数据解析
 */
function analysisContent(data){
  // let params = {
  //   protocolType: 3, // Int 协议类型
  //   content: [], // Array 原始报文
  // }
  let url = `${CTS_URL}/analysis/analysisContent`;
  return ajax(url,data,'post');
}

export default {
  // findByTimeStampsBetween,
  queryDetails,
  analysisContent
}
