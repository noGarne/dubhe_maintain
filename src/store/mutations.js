
import menuService from '../components/header/menu.service'
export default {
    // 设置当前用户详细信息
    setCurrentUserDetails(state,value){
      if(value){
        // 获取列表
        var data = menuService.getSections();
        // 获取头部左滑导航允许显示的模块
        var addRoute=[];
        for(let i in data){
          if(data[i].setLimit.indexOf('2')>-1){
            addRoute.push(data[i].id);
          }
        }
        var userList = [];
        // 获取权限列表
        var userRole = value.functionalPoints;
        userRole.map((v)=>{
          userList.push(v.sn);
        })
        // 有权限和默认显示的连接
        var num = userList.concat(addRoute);

        var routeArr = [];
        // 根据编号查找需要显示的路由
        for(let i in data){
          if(num.indexOf(data[i].id) > -1){
            data[i].route && routeArr.push(data[i].route);
            data[i].link && routeArr.push(data[i].link);
          }
          if(data[i].limitList){
            var limitList = data[i].limitList;
            for(let j=0;j<limitList.length;j++){
              if(num.indexOf(limitList[j].id) > -1){
                limitList[j].route && routeArr.push(limitList[j].route);
                limitList[j].link && routeArr.push(limitList[j].link);
                if(data[i].children){
                  data[i].children.map((v)=>{
                    v.route && routeArr.push(v.route);
                    v.link && routeArr.push(v.link);
                  });
                }
              }
            }
          }else{
            if(data[i].children){
              var child = data[i].children;
              for(let j=0;j<child.length;j++){
                if(num.indexOf(child[j].id) > -1){
                  child[j].route && routeArr.push(child[j].route);
                  child[j].link && routeArr.push(child[j].link);
                  if(child[j].children){
                    child[j].children.map((v)=>{
                      v.route && routeArr.push(v.route);
                      v.link && routeArr.push(v.link);
                      if(v.children){
                        v.children.map((w)=>{
                          w.route && routeArr.push(w.route);
                          w.link && routeArr.push(w.link);
                        });
                      }
                    });
                  }
                }
              }
            }
          }
        }
        // 存放权限
        value['authorization']=routeArr;
        //调度中心二级调度员禁用编辑功能
        state.disabledDispatchEdit=routeArr.indexOf('SecondDispatch') > -1;

        //清除调度中心选中的分区
        if(!value.subareas.find(item=>item.subareaSn==state.subareaSn)){
          this.commit('cleanSubareaSn');
        }

      }
      state.currentUserDetails=value;
    },
    // 设置当前用户
    setCurrentUser(state,value){
      // console.log('setCurrentUser',value)
      state.currentUser=value;
    },
    // 设置当前用户
    addCurrentUser(state,key,value){
      state.currentUser[key]=value
    },
    //
    setAllowedDashboardIds(state,value){
      state.allowedDashboardIds.push(value);
    },
    setForceFullscreen(state,value){
      state.allowedDashboardIds.push(value);
    },
    setRefreshTokenQueue(state,value){
      state.refreshTokenQueue.push(value);
    },
    // 存储矿产资源
    setAssetsList(state,list){
      state.assetsList=list
    },

    // 存储矿产资源
    setAssetsDefault(state,data){
      state.defaultAssets=false;
      state.defaultAssets=data;
    },

    // 设置页面访问权限
    setLimit(state,data){
      state.isLimit=data;
    },

    //设置选中的分区sn
    setSubareaSn(state,data){
      if(data){
        sessionStorage.setItem('subareaSn',data);
        state.subareaSn=sessionStorage.getItem('subareaSn');
      }
    },
    //清除分区sn
    cleanSubareaSn(state){
      sessionStorage.removeItem('subareaSn');
      state.subareaSn='';
    },
    //取消axios请求
    setCancelToken(state,data){
      state.cancelToken.push(data);
    },
    // 清空axios请求
    clearCancelTonken(state){
      state.cancelToken=[];
    },
    //左边导航设置
    setLeftMenu(state,data){
      state.leftMenuOpen=data;
    },
    //左边菜单远程启停页面控制
    setLeftMenuRemoteOperation(state,data){
      state.leftMenuRemoteOperation=data;
    },
    // 版本信息
    setVersionInfo(state,data){
      state.versionInfo=data;
    },
    // 集成监视页面当前设备id
    setMoniDeviceId(state,data){
      state.currMoniDeviceId=data;
    },
    // 集成监视告警弹框显示情况
    setMonitorAlarmDialogShow(state,data){
      state.monitorAlarmDialogShow=data;
    },
  }