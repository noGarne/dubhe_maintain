import jwt from "jsonwebtoken";
import userServer from '../api/user.server'

export default {
	async fetchPermission({
		commit,
		state
	}, jwtToken) {
		var currentUser = state.currentUser;
		if (!currentUser) {
			//var jwtToken = localStorage.getItem('jwt_token');
			var currentUser = jwt.decode(jwtToken);
			commit('setCurrentUser', currentUser)
			if (state.currentUser.userId) {
				// var user = await userServer.getUserById(state.currentUser.userId);
				var user = {
					additionalInfo: {
						description: ""
					},
					authority: "TENANT_ADMIN",
					authorization: ["Home", "RunReport", "/runReport", "RunReport", "/runReport"],
					createdTime: 1567414695712,
					customerId: {
						entityType: "CUSTOMER",
						id: "13814000-1dd2-11b2-8080-808080808080"
					},
					email: "itage@i-tage.com",
					firstName: "itage",
					functionalPoints: [{
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
						},
						{
							"id": "ea0734d3-3b54-1d8f-bbde-cb32018da45b",
							"createTime": "2021-04-14T10:16:40.704+0000",
							"updateTime": "2021-04-14T10:16:40.704+0000",
							"name": "跑车日报",
							"sn": 1001,
							"parentSn": 0,
							"code": "",
							"level": -1,
							"pointIndex": -1,
							"children": [],
							"bhas": true
						}
					],
					id: {
						entityType: "USER",
						id: "cd0a9200-cd5f-11e9-8070-b5c4323ff450"
					},
					lastName: "",
					name: "itage@i-tage.com",
					roleName: "管理员",
					roleSn: 1,
					subareas: [{
						bhas: true,
						createTime: "2021-08-30T11:24:22.916+0000",
						id: "d36f9100-0984-11ec-8edf-7d27c299edf5",
						opUserSn: null,
						subareaName: "白云",
						subareaSn: 1,
						updateTime: "2021-09-14T07:13:00.679+0000",
						userId: "cd0a9200-cd5f-11e9-8070-b5c4323ff450",
					}],
					tenantId: {
						entityType: "TENANT",
						id: "7514aeb0-d72d-11e8-a6c2-1d5b278f7ce8"
					}

				}
				commit('setCurrentUserDetails', user)
				//console.log('获取用户',user);
			}
		}
	}
}
