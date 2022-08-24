/**
 * 登录服务
 */
import ajax from './ajax'
import config from "./config"
var BASE_URL = config.BASE_URL;

/**
 * 获取用户组列表
 */
function userRolesList(){
  return ajax(BASE_URL + "/atds/roles/list");
}

/**
 * 添加用户组
 * @param {string} name 组名称
 */
function addUsersRoles(data){
  var url = BASE_URL + "/atds/roles"
  return ajax(url, data, 'post');
}

/**
 * 修改用户组
 * @param {string} id   组id
 * @param {number} sn   组编号 id和sn两者至少有一个
 * @param {string} name 组名称
 */
function editUsersRoles(data){
  var url = BASE_URL + "/atds/roles"
  return ajax(url, data, 'post');
}

/**
 * 删除用户租
 * @param {number} sn 用户组编号
 */
function deleteUserRoles(sn){
  var data = {
    sn:sn
  }
  var url = BASE_URL + "/atds/roles";
  return ajax(url, data, 'delete');
}

/**
 * 获取用户组权限
 * @param {number} sn 用户组编号
 */
function getUserRoles(sn){
  var data = {
    roleSn:sn,
    isTree:false
  }
  return ajax(BASE_URL + "/atds/userFnctnalPoints/list",data);
}
/**
 * 设置用户组权限
 * @param {number} sn 用户组编号
 * @param {string} fpSns 用户组编号
 */
function setUserRoles(data){
  var data = {
    roleSn:data.roleSn,
    fpSns:data.fpSns
  }
  return ajax(BASE_URL + "/atds/userFnctnalPoints",data,'post');
}

/**
 * 获取用户权限
 * @param {string} id 用户uuid
 */
function getUserSubarea(id){
  var data = {
    userId:id,
  }
  return ajax(BASE_URL + "/atds/userSubareas/list",data);
}

/**
 * 设置用户权限
 * @param {string} userId     用户uuid
 * @param {string} subareaSns 分区列表
 */
function setUserSubarea(data){
  var data = {
    userId:data.userId,
    subareaSns:data.subareaSns
  }
  return ajax(BASE_URL + "/atds/userSubareas",data,'post');
}



/**
 * 获取用户列表
 * @param {string} id 租户id
 * @param {string} textSearch 搜索内容
 */
function userList(arg){
  var id = arg.id;
  var url = BASE_URL + "/tenant/"+id+"/users"
  var sort = arg.sort?arg.sort:"ASC";
  var sortName = arg.sortName?arg.sortName:"id";
  var data={
    limit:arg.pageSize,
    pageIndex:arg.pageIndex,
    sort:sort,
    sortName:sortName
  }
  !arg.searchEmil||(data['textSearch']=arg.searchEmil)
  !arg.roleSnList||(data['roleSnList']=arg.roleSnList)
  return ajax(url,data);
}

/**
 * 删除用户
 * @param {string} id 用户id
 */
function deleteUser(id){
	console.log(id)
  var url = BASE_URL + "/user/"+id;
  return ajax(url, {}, 'delete');
}

/**
 * 添加用户
 * @param {string} authority            用户类型 TENANT_ADMIN/
 * @param {string} email                邮箱  
 * @param {string} firstName            姓
 * @param {string} lastName             名
 * @param {boolean} sendActivationMail   是否是邮箱激活   false否/true是
 * @param {object} tenantId:            租户id  以下内容
 * @param {string} entityType           租户类型"TENANT"
 * @param {string} id                   租户id
 */
function addUsers(data){
  var url = BASE_URL + "/user?sendActivationMail="+data.sendActivationMail
  return ajax(url, data, 'post');
}

/**
 * 编辑用户
 * @param {string} id 用户id
 */
function editUsers(data){
  var url = BASE_URL + "/user"
  return ajax(url, data, 'post');
}


/**
 * 获取激活链接
 * @param {string} id 用户id
 */
function getActivateLink(id){
  var url = BASE_URL + '/user/'+id+'/activationLink'
  return ajax(url);
}

/**
 * 获取租户列表
 */ 
function tenantList(){
  var url = BASE_URL + "/tenants"
  var data={
    limit:100
  }
  return ajax(url,data);
}

/**
 * 编辑租户
 * @param {string} title 租户名称
 */ 
function editTenant(data){
  var url = BASE_URL + "/tenant"
  return ajax(url,data,"post");
}

/**
 * 重置密码
 * @param {string} userId     用户id
 * @param {string} password   密码
 */ 
function resetPassword(data){
  var url = BASE_URL + "/noauth/resetPassword"
  return ajax(url, data, 'put');
}

/**
 * 司机列表--分页
 * @param {number} pageSize     当前页码显示条数
 * @param {number} pageIndex    当前页码
 * @param {string} sort         排序方式  DESC/ASC
 * @param {string} sortName     排序键值 name 名称 sn编号
 * @param {number} driverType   驾驶类型:1、truck;2、shovel;3、dump
 */
function driverList(arg){
  var pageSize = arg.pageSize?arg.pageSize:14;    //一页显示多少条
  var pageIndex = arg.pageIndex-1?arg.pageIndex-1:0;  //当前第几页
  var sort = arg.sort?arg.sort:"DESC";
  var data={
    pageSize:pageSize,
    pageIndex:pageIndex,
    sort
  }
  if(arg.subareaSn){
    data['subareaSn'] = arg.subareaSn
  }
  if(arg.driverType){
    data['driverType'] = arg.driverType
  }
  if(arg.driverName){
    data['searchText'] = arg.driverName
  }
  if(arg.sortName){
    data['sortName'] = arg.sortName
  }
  return ajax(BASE_URL + "/atds/common/drivers/page",data);
}

/**
 * 司机列表
 * @param {number} driverType   驾驶类型:1、truck;2、shovel;3、dump
 */
function getDriver(driverType){
  var url = BASE_URL + "/atds/common/drivers/list?driverType="+driverType;
  return ajax(url);
}

/**
 * 添加司机
 * @param {string} driverType   驾驶类型:1、truck;2、shovel;3、dump
 * @param {number} sn           司机编码
 * @param {string} name:        司机名字
 * @param {number} password     密码
 * @param {number} subareaSn    司机分区
 */
function addDriver(data){
  var url = BASE_URL + "/atds/common/drivers";
  return ajax(url, data, 'post');
}

/**
 * 添加司机
 * @param {string} driverType   驾驶类型:1、truck;2、shovel;3、dump
 * @param {string} id           司机id
 * @param {string} name:        司机名字
 * @param {number} password     密码
 * @param {number} subareaSn    司机分区
 */
function updateDriver(data){
  var url = BASE_URL + "/atds/common/drivers/"+data.id;
  return ajax(url, data, 'put');
}

/**
 * 删除司机
 */
function deleteDriver(id){
  var url = BASE_URL + "/atds/common/drivers/"+id;
  return ajax(url, {}, 'delete');
}

/**
 * 登录司机修改
 * @param {string} deviceType       设备类型
 * @param {number} pageIndex        当前页码
 * @param {number} pageSize:        当前页码显示数量
 * @param {string} deviceId         设备id
 * @param {number} oprationType     类型
 * @param {number} deviceGroupId    分区
 * @param {string} startTime        开始时间
 */
function getLoginDriver(data){
  // var url=`${BASE_URL}/dispatching/operationStatus/history/list?deviceType=${data.deviceType}&pageIndex=${data.pageIndex-1}&pageSize=${data.pageSize}&deviceId=${data.deviceId}&operationType=${data.oprationType}&deviceGroupId=${data.deviceGroupId}&startTime=${data.startTime}`;
  // return ajax(url)
}

/**
 * 查询远程设备故障诊断开关列表
 * @param {string} deviceId 设备id
 */
function getRemoteFaultSwitch(deviceId){
  let url = `${BASE_URL}/atds/equipment/remotecontroller/faultFlagOpt/${deviceId}`;
  return ajax(url)
}

/**
 * 设置远程设备故障诊断开关
 *  @param {Ojbect} args
 */
function setRemoteFaultSwitch(args){
  let url = `${BASE_URL}/atds/equipment/remotecontroller/faultFlagOpt`;
  return ajax(url,args,'put')
}

/**
 * 查询系统配置信息
 */
function getSystemConfig(){
  let url = `${BASE_URL}/atds/configInfo/get`;
  return ajax(url)
}

/**
 * 查询低速会车开关
 */
function getLowerSpeedPass(){
  let url = `${BASE_URL}/atds/vehicles/lowSpeedMeeting/enabled`;
  return ajax(url)
}

/**
 * 设置低速会车开关
 *  @param {Ojbect} enabled 要设置的低速会车使能开关，值为true或false，true表示开，false表示关
 */
function setLowerSpeedPass(enabled){
  let url = `${BASE_URL}/atds/vehicles/lowSpeedMeeting/enabled/${enabled}`;
  return ajax(url,{},'put')
}

/**
 * 查询排土场模式开关(获取当前排土场是否可以设置停止卸载)
 * 返回true表示可以设置，false表示不能设置
 */
 function getDumpingMode(){
  let url = `${BASE_URL}/atds/parks/wasteDump/stopUnload/canSet/enabled`;
  return ajax(url)
}

/**
 * 设置排土场模式开关(设置排土场是否可以设置停止卸载)
 *  @param {Ojbect} enabled true表示可以设置，为false表示不能设置
 * 返回true表示可以设置，false表示不能设置
 */
function setDumpingMode(enabled){
  let url = `${BASE_URL}/atds/parks/wasteDump/stopUnload/canSet/enabled/${enabled}`;
  return ajax(url,{},'put')
}

/**
 * 查询远程遥控使能开关
 * 返回true表示使能开关打开,false表示关闭
 */
function getRemoteOperation(){
  let url = `${BASE_URL}/atds/equipment/remotecontroller/enabled`;
  return ajax(url)
}

/**
 * 设置远程遥控使能开关
 *  @param {Ojbect} enabled 值为true或false，true表示使能开关打开,false表示关闭
 * 返回true表示当前使能开关打开,false表示关闭
 */
function setRemoteOperation(enabled){
  let url = `${BASE_URL}/atds/equipment/remotecontroller/enabled/${enabled}`;
  return ajax(url,{},'put')
}


/**
 * 查询雨雪天气
 * 返回true表示使能开关打开,false表示关闭
 */
 function getWeatherOperation(){
  let url = `${BASE_URL}/atds/equipment/drivingMode/get`;
  return ajax(url)
}


/**
 * 设置雨雪天气
 *  @param {number} type 1为标准模式，2为雨雪天气
 */
function setWeatherOperation(type){
  var data = {
    type:type
  }
  let url = `${BASE_URL}/atds/equipment/drivingMode/set`;
  return ajax(url,data,'post')
}

  
export default {
    userRolesList,
    addUsersRoles,
    editUsersRoles,
    deleteUserRoles,
    getUserRoles,
    setUserRoles,
    getUserSubarea,
    setUserSubarea,
    userList,
    deleteUser,
    addUsers,
    getActivateLink,
    editUsers,
    tenantList,
    editTenant,
    resetPassword,
    driverList,
    getDriver,
    addDriver,
    updateDriver,
    deleteDriver,
    getLoginDriver,
    getRemoteFaultSwitch,
    setRemoteFaultSwitch,
    getSystemConfig,
    getLowerSpeedPass,
    setLowerSpeedPass,
    getDumpingMode,
    setDumpingMode,
    getRemoteOperation,
    setRemoteOperation,
    getWeatherOperation,
    setWeatherOperation
}