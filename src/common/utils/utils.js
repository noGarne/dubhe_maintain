
import aesjs from "aes-js"

// 时间戳转化为日期时间
function formatDate(timestamp,time) {
  if(!timestamp)return;
  var date = timeDateT(timestamp);

  var Y = date.getFullYear()
  var M = isNumGtTen(date.getMonth()+1);
  var D = isNumGtTen(date.getDate());
  var h = isNumGtTen(date.getHours());
  var m = isNumGtTen(date.getMinutes());
  var s = isNumGtTen(date.getSeconds());
  var timeStr = "";
  if(time == "time"){
    timeStr = h + ":" + m + ":" + s; 
  }else if(time == "date"){
    timeStr = Y + "-" + M + "-" + D;
  }else if(time == "month"){
    timeStr = Y + "-" + M;
  }else if(time == "year"){
    timeStr = Y;
  }else{
    timeStr = Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s; 
  }
  return timeStr;
  
}
function isNumGtTen(num){
  return num >= 10 ? num : "0" + num
}
function timeDateT(timestamp){
  if(!timestamp)return;
  var str = timestamp;
  if(new Date(str).toString()==="Invalid Date"){//兼容ie浏览器的时间
    var reg = /\dT\d/g;
    if(reg.test(str)){
        str = str.split('.')[0];
        str = str.replace(/T/,' ');
        str = str.replace(/\-/g,'\/');
        var date = new Date(str);
        date.setHours(date.getHours() + 8);
    }else{
        str = str.replace(/\-/g,'\/');
        var date = new Date(str);
    }
  }else{
    var date = new Date(str);
  }
  return date;
}
// 差值变成时：分：秒
function diffTimeTime(difference){
  var hour = Math.floor(difference / 1000 / 60 / 60);//小时

  difference = difference % (1000 * 60 * 60);
  var min = Math.floor(difference / 1000 / 60);//分钟

  difference = difference % (1000 * 60);
  var second = Math.floor(difference / 1000);
  // var min = difference/
  return isNumGtTen(hour) +':'+ isNumGtTen(min)+':'+isNumGtTen(second);
}
// 验证邮箱
function emailVerify(text){
  var reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/; 
  return reg.test(text)
}
// 验证满足条件
// function specific(text){
//   var pattern = /[^\a-\z\A-\Z0-9\u4E00-\u9FA5\~\`\!\@\#\%\^\&\*\(\)\_\{\}\|\\\:\；\"\<\>\?\！\$\¥\＄\￥\…\（\）\—\+\{\}\|\：\“\”\‘\’\《\》\？\/\,\.\、\，\。\;\'\[\]\=\-\【\】\·\｛\｝\～\s+]/g;
//   return pattern.test(text);
// }

// 验证名称
function nameVerify(text){
  var pattern = /[^\a-\z\A-\Z0-9\u4E00-\u9FA5\_\-\.\#\s+]/g;
  return pattern.test(text);
}

function setCode(code){
  if(code){
    var code = parseInt(code);
    if(code<0){
        code = - code;
    }
    return code;
  }
}

function isNotNum(nubmer) {
  　　var re = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字 //判断正整数 /^[1-9]+[0-9]*]*$/
  　　if (!re.test(nubmer)) {
  　　　　return true;
  　　}else{
        return false
      }
  }


/*删除的空格*/
function trim(str){
  return str.replace(/ /g,'');
}

/*验证手机号*/
function isPhoneNo(phone) {
 	var pattern = /^1\d{10}$/;
  return pattern.test(phone);
}

/*判断密码为6-16位*/
function pswVerify(psw) {
	var pattern = /^(?![\d]+$)(?![a-zA-Z]+$)(?![\(\)\（\）\，\,\.\、\-\/\\\~\_\&\*\#]+$)[\da-zA-Z\(\)\（\）\，\,\.\、\-\/\\\~\_\&\*\#]{6,16}$/;
 	return pattern.test(psw);
}

function ispsw(psw) {
	var pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,16}$/;
 	return pattern.test(psw);
}

/*中文*/
function hanEng(psw) {
	var pattern = /^[\u4E00-\u9FA5A-Za-z]+$/;
 	return pattern.test(psw);
}
/*判断不能为非法字符*/
function notdot(stry) {
	var pattern = new RegExp("[`~!@#$^&*=|{}':;',\\[\\].<>/?！@#￥……&*|{}‘；：”“'。，？]");
 	return pattern.test(stry);
}


//验证表单
function validateForm(_this){ 
  return new Promise((reslove,reject)=>{
    var res = _this.$validator.validateAll();
    reslove(res);
  })
}


/**
 * 获取验证消息文本
 * 根据key=val的值获得数组对象中其他的属性值，默认key=field,默认属性msg
 * 例如：var obj={[field:1,msg='str1'],[field:2,msg='str2']}
 * 调用validateFormMsg(obj,2)或者validateFormMsg(obj,2,'field','msg')后得到str2
 */
function validateFormMsg(obj={},val,key='field',name='msg'){
  var data = obj.find(item=>item[key]==val);
  return data?data[name]:'';
}

var key = [1,3,5,7,9,2,4,6,8,10,1,2,3,4,5,6];
/**
 * 
 * @param {string} text 加密字符串
 */
function encode(text){
  var textBytes = aesjs.utils.utf8.toBytes(text);
  var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
  var encryptedBytes = aesCtr.encrypt(textBytes);
  var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
  return encryptedHex;
}
/**
 * 
 * @param {string} encryptedHex 解密字符串
 */
function decode(encryptedHex){
          
  var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);
  var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
  var decryptedBytes = aesCtr.decrypt(encryptedBytes);
  var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
  return decryptedText;

}

//UUID格式转换
function uuidFormat(str){
  return str && str.length>24 ? str.slice(15, 18) + str.slice(9, 13) + str.slice(0, 8) + str.slice(19, 23) + str.slice(24):str;
}

/**
 * 根据key=val的值获得数组对象中其他的属性值，默认key=id,默认属性name
 * 例如：var obj=[{id:1,name='str1'},{id:2,name='str2'}]
 * 调用getObjValByKey(obj,2)或者getObjValByKey(obj,2,'id','name')后得到str2
 */
function getObjValByKey(obj=[],val,key='id',name='name'){
  var data = obj.find(item=>item[key]==val);
  return data?data[name]:'';
}

/**
 * 根据数组对象中某个属性值用,隔开的字符串，默认属性key=name
 * 例如：var obj={[id:1,name='str1'],[id:2,name='str2']}
 * getObjStrByKey(obj)或者getObjStrByKey(obj,'name')后得到1,2
 */
function getObjStrByKey(obj={},key='name'){
  var data = obj.map(item=>item[key])
  return data?data.join():'';
}

/**
 * 过滤数据转换
 * @param {Array} list    列表
 * @param {string} value  值
 * @param {string} text   显示文字
 */
function getFilters(list,value="id",text="name"){
  var arr = [];
  list.forEach(element => {
    arr.push({
      text:element[text],
      value:element[value]
    })
  });
  return arr;
}

/**
 * 
 * @param {object} v 
 * @param {string} order 排序
 * @param {string} prop  名称
 */
function getConversion(v,name){
  var order = v.order;
  var sort='DESC';
  var hasName = v.hasOwnProperty('prop')
  if(hasName){
    var sortName = v.prop;
  }
  if(order=='ascending'){
    sort ="ASC"
  }else if(order=='descending'){
    sort ="DESC"
  }else{
    if(hasName){
      sortName = name;
    }
  }
  return {
    sort,
    sortName
  }
}

// json数据转换
function convertKV(jsonObj, parentKey, result) {
  for (key in jsonObj) {
    var itemkey = key;
    var val = jsonObj[itemkey];
    if (isJson(val) == 1) {
        // 对象
        convertKV(val, parentKey + itemkey + ".", result);
    } else if (isJson(val) == 2) {
       // 数组
        for (var i = 0; i < val.length; i++) {
            var valElement = val[i];
            convertKV(valElement, parentKey + itemkey + i + ".", result);
        }
    } else {
        // 值
        result[parentKey + itemkey] = val;
    }
  }
}
function isJson(obj) {
  // json对象
  if (obj && Object.prototype.toString.call(obj) == "[object Object]") {
      return 1;
  } else if (obj && Object.prototype.toString.call(obj) == "[object Array") {
    // json数组
        return 2;
  } else {
  // 值
      return 0;
  }
}

export default{
  formatDate,
  timeDateT,
  emailVerify,
  isNumGtTen,
  diffTimeTime,
  nameVerify,
  trim,
  pswVerify,
  ispsw,
  validateForm,
  validateFormMsg,
  uuidFormat,
  getObjValByKey,
  getObjStrByKey,
  setCode,
  getFilters,
  getConversion,
  decode,
  encode,
  isNotNum,
  convertKV
}