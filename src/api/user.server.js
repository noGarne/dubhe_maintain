/**
 * 获取用户信息接口
 */
import router from "../router";
import store from "../store";
import jwt from "jsonwebtoken";
import ajax from './ajax'
import ajax2 from './ajax2'

import limitServer from './limit.server'

import config from "./config"
var BASE_URL = config.BASE_URL;
var MAINTAIN_URL = config.MAINTAIN_URL;


var TIMES = 1000;

function setUserFromJwtToken(jwtToken, refreshToken, notify) {
	if (!jwtToken) {
		clearTokenData();
		if (notify) {
			goLogin()
		}
	} else {
		updateAndValidateToken(jwtToken, 'jwt_token', true);
		updateAndValidateToken(refreshToken, 'refresh_token', true);
		if (notify) {
			loadUser(false).then(function success() {
				var query = router.history.current.query;
				var toPath = query.redirect ? query.redirect : '/';
				router.push({
					path: toPath
				});
			}, function fail() {
				goLogin()
			});
		} else {
			loadUser(false);
		}
	}
}

/**
 * 获取矿区列表
 *
 */
function getMiningNameList(data) {
	let url = `${MAINTAIN_URL}/getMiningNames`;
	return ajax(url, data, "post")
}


function checkUserFromJwtToken(jwtToken, refreshToken) {
	return new Promise((resolve, reject) => {
		if (!jwtToken) {
			clearTokenData();
			resolve(false)
		} else {
			updateAndValidateToken(jwtToken, 'jwt_token', true);
			updateAndValidateToken(refreshToken, 'refresh_token', true);
			loadUser(false).then(res => {
				resolve(true)
			}).catch(err => {
				resolve(false)
			});
		}
	})
}

// function setUserFromJwtToken(jwtToken, refreshToken, notify) {
//     if (!jwtToken) {
//         clearTokenData();
//         if (notify) {
//             goLogin()
//         }
//     } else {
//         updateAndValidateToken(jwtToken, 'jwt_token', true);
//         updateAndValidateToken(refreshToken, 'refresh_token', true);
//         if (notify) {
//             loadUser(false).then(function success() {
//                 var query=router.history.current.query;
//                 var toPath = query.redirect ? query.redirect : '/';
//                 router.push({path: toPath});
//             }, function fail() {
//                 goLogin()
//             });
//         } else {
//             loadUser(false);
//         }
//     }
// }

// 清除token存储
function clearTokenData() {
	localStorage.removeItem('jwt_token');
	localStorage.removeItem('jwt_token_expiration');
	localStorage.removeItem('refresh_token');
	localStorage.removeItem('refresh_token_expiration');
}
// 存储token数据
function updateAndValidateToken(token, prefix, notify) {
	store.state.currentUser = null;
	var valid = false;
	var tokenData = jwt.decode(token);

	var issuedAt = tokenData.iat;
	var expTime = tokenData.exp;

	if (issuedAt && expTime) {
		var ttl = expTime - issuedAt;
		if (ttl > 0) {
			var clientExpiration = new Date().valueOf() + ttl * 1000;
			localStorage.setItem(prefix, token);

			localStorage.setItem(prefix + '_expiration', clientExpiration);
			valid = true;
		}
	}
	if (!valid && notify) {
		goLogin()
	}
}

// 加载用户信息
function loadUser(doTokenRefresh) {
	var currentUser = store.state.currentUser;
	return new Promise(function(resolve, reject) {
		if (!currentUser) {
			var locationSearch = router.history.current.query;
			if (locationSearch.publicId) {} else {
				procceedJwtTokenValidate(doTokenRefresh).then(function success() {
					resolve();
				}, function fail() {
					reject();
				});
			}
		} else {
			resolve();
		}
	})
}

// 
function procceedJwtTokenValidate(doTokenRefresh) {
	return new Promise(function(resolve, reject) {
		validateJwtToken(doTokenRefresh).then(function success() {
			var jwtToken = localStorage.getItem('jwt_token');
			var currentUser = jwt.decode(jwtToken);
			store.commit('setCurrentUser', currentUser)
			var userId = store.state.currentUser.userId;
			if (userId) {
				getUser(userId, true).then(
					function success(user) {
						store.commit('setCurrentUserDetails', user);
						resolve();
					},
					function fail() {
						reject();
						logout();
					}
				)
			} else {
				reject();
			}
		}, function fail() {
			reject();
		});
	})

}

function logout() {
	clearJwtToken(true);
}

function clearJwtToken() {
	setUserFromJwtToken(null, null, true);
}

function validateJwtToken(doRefresh) {
	return new Promise(function(resolve, reject) {
		if (!isTokenValid('jwt_token')) {
			if (doRefresh) {
				refreshJwtToken().then(function success() {

					resolve();
				}, function fail() {

					reject();
				});
			} else {
				clearJwtToken(false);

				reject();
			}
		} else {

			resolve();
		}
	})

}

function isTokenValid(prefix) {
	var clientExpiration = localStorage.getItem(prefix + '_expiration');
	return clientExpiration && clientExpiration - TIMES > new Date().valueOf();
}

// function rejectRefreshTokenQueue(message) {
//     for (var q=0;q<refreshTokenQueue.length;q++) {
//         refreshTokenQueue[q].reject(message);
//     }
//     refreshTokenQueue = [];
// }


// 获取用户信息接口
function getUser(userId, ignoreErrors, config) {
	return new Promise(function(resolve, reject) {
		// var url = BASE_URL + '/user/' + userId;
		// if (!config) {
		//     config = {};
		// }
		// // config = Object.assign(config, { ignoreErrors: ignoreErrors });
		// ajax(url,config).then(function success(response){
		//     resolve(response);
		// },function fail(response){
		//     reject(response)
		// })
		let c = {
			"id": {
				"entityType": "USER",
				"id": "cd0a9200-cd5f-11e9-8070-b5c4323ff450"
			},
			"createdTime": 1567414695712,
			"additionalInfo": {
				"description": ""
			},
			"tenantId": {
				"entityType": "TENANT",
				"id": "7514aeb0-d72d-11e8-a6c2-1d5b278f7ce8"
			},
			"customerId": {
				"entityType": "CUSTOMER",
				"id": "13814000-1dd2-11b2-8080-808080808080"
			},
			"email": "itage@i-tage.com",
			"authority": "TENANT_ADMIN",
			"firstName": "itage1111111111111111111111111",
			"lastName": "",
			"roleSn": 1,
			"roleName": "管理员",
			"functionalPoints": [{
					"id": "8f620400-9c5c-102d-4a14-1cc6a4b73e79",
					"createTime": "2021-04-14T10:16:40.704+0000",
					"updateTime": "2021-04-14T10:16:40.704+0000",
					"name": "基础配置",
					"sn": 100,
					"parentSn": 0,
					"code": "",
					"level": -1,
					"pointIndex": -1,
					"children": [],
					"bhas": true
				},
				{
					"id": "5269b4ea-a209-1989-ebed-dab6896fbb84",
					"createTime": "2021-04-14T10:16:40.704+0000",
					"updateTime": "2021-04-14T10:16:40.704+0000",
					"name": "矿区管理",
					"sn": 101,
					"parentSn": 0,
					"code": "",
					"level": -1,
					"pointIndex": -1,
					"children": [],
					"bhas": true
				},
				{
					"id": "892084e5-91e1-1868-ea4e-e56c19be0fc4",
					"createTime": "2021-04-14T10:16:40.704+0000",
					"updateTime": "2021-04-14T10:16:40.704+0000",
					"name": "设备管理",
					"sn": 102,
					"parentSn": 0,
					"code": "",
					"level": -1,
					"pointIndex": -1,
					"children": [],
					"bhas": true
				},
				{
					"id": "a71cc48d-2d30-1144-b90f-c16ae40e7216",
					"createTime": "2021-04-14T10:16:40.704+0000",
					"updateTime": "2021-04-14T10:16:40.704+0000",
					"name": "人员管理",
					"sn": 103,
					"parentSn": 0,
					"code": "",
					"level": -1,
					"pointIndex": -1,
					"children": [],
					"bhas": true
				},
				{
					"id": "5c94c44c-355a-13b3-1b81-2fbd468eaa89",
					"createTime": "2021-04-14T10:16:40.704+0000",
					"updateTime": "2021-04-14T10:16:40.704+0000",
					"name": "数据管理",
					"sn": 104,
					"parentSn": 0,
					"code": "",
					"level": -1,
					"pointIndex": -1,
					"children": [],
					"bhas": true
				},
				{
					"id": "bbc434b0-0500-1c6b-8946-f924d19f9996",
					"createTime": "2021-04-14T10:16:40.704+0000",
					"updateTime": "2021-04-14T10:16:40.704+0000",
					"name": "主调度",
					"sn": 201,
					"parentSn": 0,
					"code": "",
					"level": -1,
					"pointIndex": -1,
					"children": [],
					"bhas": true
				},
				{
					"id": "6db5942d-db5d-1990-f975-e065ee3cba16",
					"createTime": "2021-04-14T10:16:40.704+0000",
					"updateTime": "2021-04-14T10:16:40.704+0000",
					"name": "集成监视",
					"sn": 400,
					"parentSn": 0,
					"code": "",
					"level": -1,
					"pointIndex": -1,
					"children": [],
					"bhas": true
				},
				{
					"id": "bd59c447-a1c5-174d-5add-8664d361fd7b",
					"createTime": "2021-04-14T10:16:40.704+0000",
					"updateTime": "2021-04-14T10:16:40.704+0000",
					"name": "监控中心",
					"sn": 401,
					"parentSn": 0,
					"code": "",
					"level": -1,
					"pointIndex": -1,
					"children": [],
					"bhas": true
				},
				{
					"id": "f3c35494-1cae-1cd6-faea-40f67d153c63",
					"createTime": "2021-04-14T10:16:40.704+0000",
					"updateTime": "2021-04-14T10:16:40.704+0000",
					"name": "数据回放",
					"sn": 402,
					"parentSn": 0,
					"code": "",
					"level": -1,
					"pointIndex": -1,
					"children": [],
					"bhas": true
				},
				{
					"id": "630b148d-ef8a-1ee1-094c-c4f32648d580",
					"createTime": "2021-04-14T10:16:40.704+0000",
					"updateTime": "2021-04-14T10:16:40.704+0000",
					"name": "统计分析",
					"sn": 600,
					"parentSn": 0,
					"code": "",
					"level": -1,
					"pointIndex": -1,
					"children": [],
					"bhas": true
				},
				{
					"id": "fe73246d-03de-109a-7988-28c612a614a7",
					"createTime": "2021-04-14T10:16:40.704+0000",
					"updateTime": "2021-04-14T10:16:40.704+0000",
					"name": "产量统计",
					"sn": 601,
					"parentSn": 0,
					"code": "",
					"level": -1,
					"pointIndex": -1,
					"children": [],
					"bhas": true
				},
				{
					"id": "399d7457-689b-1ed3-f9c9-48795f2c4173",
					"createTime": "2021-04-14T10:16:40.704+0000",
					"updateTime": "2021-04-14T10:16:40.704+0000",
					"name": "设备状态统计",
					"sn": 602,
					"parentSn": 0,
					"code": "",
					"level": -1,
					"pointIndex": -1,
					"children": [],
					"bhas": true
				},
				{
					"id": "a6095458-aeab-11c5-0aac-91cff3f507fa",
					"createTime": "2021-04-14T10:16:40.704+0000",
					"updateTime": "2021-04-14T10:16:40.704+0000",
					"name": "运行图表",
					"sn": 603,
					"parentSn": 0,
					"code": "",
					"level": -1,
					"pointIndex": -1,
					"children": [],
					"bhas": true
				},
				{
					"id": "6a717c00-f5b5-11eb-82f2-bd6a5d939cbd",
					"createTime": "2021-08-11T03:53:17.123+0000",
					"updateTime": "2021-08-11T03:53:17.123+0000",
					"name": "人工接管",
					"sn": 604,
					"parentSn": 0,
					"code": "",
					"level": -1,
					"pointIndex": -1,
					"children": [],
					"bhas": true
				},
				{
					"id": "6a717c00-f5b5-11eb-82f2-bd6a5d939cbd",
					"createTime": "2021-08-11T03:53:17.123+0000",
					"updateTime": "2021-08-11T03:53:17.123+0000",
					"name": "人工",
					"sn": 605,
					"parentSn": 0,
					"code": "",
					"level": -1,
					"pointIndex": -1,
					"children": [],
					"bhas": true
				},
				{
					"id": "6a717c00-f5b5-11eb-82f2-bd6a5d939cbd",
					"createTime": "2021-08-11T03:53:17.123+0000",
					"updateTime": "2021-08-11T03:53:17.123+0000",
					"name": "人工1",
					"sn": 606,
					"parentSn": 0,
					"code": "",
					"level": -1,
					"pointIndex": -1,
					"children": [],
					"bhas": true
				},
				{
					"id": "6a717c00-f5b5-11eb-82f2-bd6a5d939cbd",
					"createTime": "2021-08-11T03:53:17.123+0000",
					"updateTime": "2021-08-11T03:53:17.123+0000",
					"name": "人工1",
					"sn": 607,
					"parentSn": 0,
					"code": "",
					"level": -1,
					"pointIndex": -1,
					"children": [],
					"bhas": true
				},
				{
					"id": "35b4647e-caff-1b20-080f-2d7c5a241730",
					"createTime": "2021-04-14T10:16:40.704+0000",
					"updateTime": "2021-04-14T10:16:40.704+0000",
					"name": "系统设置",
					"sn": 700,
					"parentSn": 0,
					"code": "",
					"level": -1,
					"pointIndex": -1,
					"children": [],
					"bhas": true
				},
				{
					"id": "fb59a4fd-7503-15d4-5815-d593b3869e92",
					"createTime": "2021-04-14T10:16:40.704+0000",
					"updateTime": "2021-04-14T10:16:40.704+0000",
					"name": "系统维护",
					"sn": 701,
					"parentSn": 0,
					"code": "",
					"level": -1,
					"pointIndex": -1,
					"children": [],
					"bhas": true
				},
				{
					"id": "b428d424-d965-19b0-b9be-53da858cfe77",
					"createTime": "2021-04-14T10:16:40.704+0000",
					"updateTime": "2021-04-14T10:16:40.704+0000",
					"name": "系统调试",
					"sn": 702,
					"parentSn": 0,
					"code": "",
					"level": -1,
					"pointIndex": -1,
					"children": [],
					"bhas": true
				},
				{
					"id": "a98cd441-9ba8-1b24-99f2-ee4cfe1a3d79",
					"createTime": "2021-04-14T10:16:40.704+0000",
					"updateTime": "2021-04-14T10:16:40.704+0000",
					"name": "用户管理",
					"sn": 703,
					"parentSn": 0,
					"code": "",
					"level": -1,
					"pointIndex": -1,
					"children": [],
					"bhas": true
				},
				{
					"id": "58b92431-3d99-1bac-db80-7ca7a7656836",
					"createTime": "2021-04-14T10:16:40.704+0000",
					"updateTime": "2021-04-14T10:16:40.704+0000",
					"name": "作业管理",
					"sn": 900,
					"parentSn": 0,
					"code": "",
					"level": -1,
					"pointIndex": -1,
					"children": [],
					"bhas": true
				},
				{
					"id": "c0de2495-e211-1e94-c99c-146265529577",
					"createTime": "2021-04-14T10:16:40.704+0000",
					"updateTime": "2021-04-14T10:16:40.704+0000",
					"name": "采掘区作业管理",
					"sn": 901,
					"parentSn": 0,
					"code": "",
					"level": -1,
					"pointIndex": -1,
					"children": [],
					"bhas": true
				},
				{
					"id": "85e8a48c-a5a3-12e9-8bed-1855c8b4892c",
					"createTime": "2021-04-14T10:16:40.704+0000",
					"updateTime": "2021-04-14T10:16:40.704+0000",
					"name": "电铲移动规划",
					"sn": 902,
					"parentSn": 0,
					"code": "",
					"level": -1,
					"pointIndex": -1,
					"children": [],
					"bhas": true
				},
				{
					"id": "da23c406-fa89-196f-9b25-e38fc3472fee",
					"createTime": "2021-04-14T10:16:40.704+0000",
					"updateTime": "2021-04-14T10:16:40.704+0000",
					"name": "排土场作业管理",
					"sn": 903,
					"parentSn": 0,
					"code": "",
					"level": -1,
					"pointIndex": -1,
					"children": [],
					"bhas": true
				},
				{
					"id": "ea0734d3-3b54-1d8f-bbde-cb32018da45b",
					"createTime": "2021-04-14T10:16:40.704+0000",
					"updateTime": "2021-04-14T10:16:40.704+0000",
					"name": "破碎站作业管理",
					"sn": 904,
					"parentSn": 0,
					"code": "",
					"level": -1,
					"pointIndex": -1,
					"children": [],
					"bhas": true
				},
				{
					"id": "ea0734d3-3b54-1d8f-bbde-cb32018da45b",
					"createTime": "2021-04-14T10:16:40.704+0000",
					"updateTime": "2021-04-14T10:16:40.704+0000",
					"name": "数据总览",
					"sn": 1000,
					"parentSn": 0,
					"code": "",
					"level": -1,
					"pointIndex": -1,
					"children": [],
					"bhas": true
				}
			],
			"subareas": [{
				"id": "d36f9100-0984-11ec-8edf-7d27c299edf5",
				"subareaSn": 1,
				"subareaName": "白云",
				"createTime": "2021-08-30T11:24:22.916+0000",
				"updateTime": "2021-09-14T07:13:00.679+0000",
				"opUserSn": null,
				"userId": "cd0a9200-cd5f-11e9-8070-b5c4323ff450",
				"bhas": true
			}],
			"name": "itage@i-tage.com"
		}
		resolve(c);
	})
}
// 刷新jwttokon
function refreshJwtToken() {
	return new Promise(function(resolve, reject) {
		var refreshToken = localStorage.getItem('refresh_token');
		var refreshTokenValid = isTokenValid('refresh_token');
		// setUserFromJwtToken(null, null, false, false);
		if (!refreshTokenValid) {

			// rejectRefreshTokenQueue($translate.instant('access.refresh-token-expired'));
		} else {
			var refreshTokenRequest = {
				refreshToken: refreshToken
			};

			ajax2(BASE_URL + '/auth/token', refreshTokenRequest, 'post').then(function success(response) {
				var token = response.token;
				var refreshToken = response.refreshToken;


				// updateAndValidateToken(token, 'jwt_token', true);
				// updateAndValidateToken(refreshToken, 'refresh_token', true);

				setUserFromJwtToken(token, refreshToken, false);

				resolve()
				// resolveRefreshTokenQueue(response.data);
			}, function fail(response) {

				clearJwtToken(false);
				reject();
				// rejectRefreshTokenQueue($translate.instant('access.refresh-token-failed'));
			})
		}
	})
}
// 验证是否过期
function isTakenStaleDated() {
	// let token = window.localStorage.getItem('jwt_token')
	let token_expiration = window.localStorage.getItem('jwt_token_expiration') - TIMES
	// let refresh_token = window.localStorage.getItem('refresh_token')
	let refresh_token_expiration = window.localStorage.getItem('refresh_token_expiration');
	var nowDate = new Date().valueOf();
	if (refresh_token_expiration && nowDate >= refresh_token_expiration) { //匹配驗證時間是否過期,跳转到登录页面
		clearTokenData();
		goLogin();
		return false;
	} else if (token_expiration && nowDate >= token_expiration) { //匹配驗證時間是否過期,刷新token

		validateJwtToken(true).then(() => {

		});
		return false;
	}
	return true;
}


// 验证是否过期
function isTakenStaleDatedT() {

	return new Promise(function(resolve, reject) {
		var jwt_token_expiration = window.localStorage.getItem('jwt_token_expiration');
		var jwt_token = window.localStorage.getItem('jwt_token');
		var noLogin = ['/login', '/screenMap'];
		if (!jwt_token && (noLogin.indexOf(window.location.pathname) < 0)) {
			goLogin(window.location.pathname);
			reject('退出登录');
		}

		let token_expiration = parseInt(jwt_token_expiration) - TIMES
		// let refresh_token = window.localStorage.getItem('refresh_token')
		let refresh_token_expiration = parseInt(window.localStorage.getItem('refresh_token_expiration'));
		var nowDate = new Date().valueOf();

		if (refresh_token_expiration && nowDate >= refresh_token_expiration) { //匹配驗證時間是否過期,跳转到登录页面
			clearTokenData();
			goLogin();
			// return false;
		} else if (token_expiration && nowDate >= token_expiration) { //匹配驗證時間是否過期,刷新token
			validateJwtToken(true).then(() => {
				resolve();
			}, function fail() {
				reject();
			})
		} else {
			resolve();
		}

	})

}


// 跳转登录
function goLogin(url) {
	router.push({
		name: 'Login',
		query: {
			redirect: url
		}
	});
}

function isLogin() {

}
// 判断是否有用户信息
function isUserLoaded() {
	if (store.state.currentUser) {
		return true;
	}
	return false;
}
// 获取当前用户
function getCurrentUser() {
	return store.state.currentUser;
}
// 获取当前登录用户
function getCurrentUserDetails() {
	return store.state.currentUserDetails;
}

function getUserTenantId() {
	if (getCurrentUserDetails().hasOwnProperty('tenantId')) {
		var id = getCurrentUserDetails().tenantId.id;
		return id;
	}
	return ""
}

// 获取当前矿区id
function getCurrentAssetsId() {
	return store.state.defaultAssets ? store.state.defaultAssets.id.id : "";
}

// 有无jwt_token
function isJwtTokenValid() {
	return isTokenValid('jwt_token');
}

// 获取jwt_token
function getJwtToken() {
	return localStorage.getItem('jwt_token');
}

// 获取用户信息
function userAttribute(data) {
	return ajax(BASE_URL + '/user', data, "post");
}
// 更换密码
function changePassword(data) {
	return ajax(BASE_URL + '/auth/changePassword', data, "post");
}



// 获取用户信息接口
function getUserById(userId) {
	var url = BASE_URL + '/user/' + userId;
	return ajax(url)
}

// 获取用户权限
function getUserPermissions() {
	var userPermissions = store.state.currentUserDetails.userPermissions;
	var arr = [];
	if (store.state.currentUserDetails.authority == limitServer.SYS_ADMIN) {
		//authority: "SYS_ADMIN"特殊权限处理
		arr.push(limitServer.SYS_ADMIN_Limit);
	} else {
		if (userPermissions) {
			userPermissions.forEach(v => {
				if (v.functionalPermissionCode != limitServer.SYS_ADMIN_Limit) {
					arr.push(v.functionalPermissionCode);
				}
			})
			// arr.push('runChart');
		}
	}

	return arr;
}

// 获取用户权限车队Id
function getUserPermissionsId() {
	var userPermissions = store.state.currentUserDetails.userPermissions;
	var arr = [];
	if (userPermissions) {
		userPermissions.forEach(v => {
			var items = v.userDataPermissionItems;
			items.forEach(item => {
				arr.push(item.allowedItemId);
			})
		})
	}
	return arr;
}

export default {
	setUserFromJwtToken,
	checkUserFromJwtToken,
	clearTokenData,
	refreshJwtToken,
	loadUser,
	getCurrentUser,
	isUserLoaded,
	validateJwtToken,
	getCurrentAssetsId,
	isTakenStaleDated,
	goLogin,
	isLogin,
	getJwtToken,
	isJwtTokenValid,
	userAttribute,
	changePassword,
	getCurrentUserDetails,
	getUserTenantId,
	getMiningNameList,
	getUserById,
	getUserPermissions,
	getUserPermissionsId,
	isTakenStaleDatedT
}
