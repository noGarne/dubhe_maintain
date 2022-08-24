export default{
    data(){
        return{
          deviceId:'',
          deviceType:'',
          // 任务状态
          //UNKNOW("未知", 0), ROAD("道路行驶", 1), ROAD_NOTICE("道路预告", 2), QUEUE("排队等待", 3), DOCKING("驶入停靠", 4), DOCKED("停靠完成", 5), LOADING("装载中", 6), LOADED("装载完成", 7), UNLOADING("卸载中", 8), UNLOADED("卸载完成", 9),APPLY_LOAD_TASK("申请装载任务", 10),  APPLY_UNLOAD_TASK("申请卸载任务", 11);
          taskStatus:['UNKNOW','STARTED','ARRIVED','PUTIN','lOAD','LOADED','UNLOAD','UNLOADED','ARRIVED_DIGGER'],
          taskStatusCn:['','出发','到达','驶入','开装','装完','开卸','卸完','到达'],
          taskIdType:['DUMPAREA','SHOVEL','LINE','INTERSECTION','PARKING_SPACE'],
          // 启动卡车装完
          loadedEnableList:['禁用','启用'],
          whetherList:['否',"是"],
          positionSet:[
            {
              id:1,
              name:"铲窝"
            },
            {
              id:2,
              name:"卸点"
            },
            {
              id:3,
              name:"停车位"
            },
          ],
          
          businessTypeList:[
            {
              text:"状态变更",
              value:'state_change'
            },
            {
              text:"系统申请",
              value:'system_apply'
            },
            {
              text:"任务变更",
              value:'task_change'
            },
            {
              text:"运行异常",
              value:'system_exception'
            },
            {
              text:"系统设置",
              value:'system_setting'
            },
            {
              text:"系统消息",
              value:'system_message'
            },
            {
              text:"车辆注册/注销",
              value:'device_connection'
            },
            {
              text:"司机登录/登出",
              value:'driver_login_logout'
            }
          ],
          
          // 调度任务类型 LOAD("装载任务", 1), UNLOAD("卸载任务", 2), PARKING("收车任务", 3), DIG("采装设备挖掘任务", 4), TEST("测试任务", 5);
          dispatchTaskType:[{
            id:1,
            text:'装载任务',
            value:'LOAD'
          },{
            id:2,
            text:'卸载任务',
            value:'UNLOAD'
          },{
            id:3,
            text:'收车任务',
            value:'PARKING'
          },{
            id:4,
            text:'采装设备挖掘任务',
            value:'DIG'
          },{
            id:5,
            text:'测试任务',
            value:'TEST'
          },{
            id:6,
            text:'临时停车任务',
            value:'TEMPORARY_PARKING'
          },{
            id:7,
            text:'加油任务',
            value:'ADD_OIL'
          },{
            id:8,
            text:'空载卸货',
            value:'NO_GOODS'
          }],
          //运输模式:AUTO("自动", 1), SEMI_AUTO("半自动", 2), REMOTE_CONTROL("遥控", 3), MANU("人工", 4);
          taskDriveMode:[{
            id:"AUTO",
            code:1,
            name:'自动'
          },{
            id:"SEMI_AUTO",
            code:2,
            name:'半自动'
          },{
            id:"REMOTE_CONTROL",
            code:3,
            name:'遥控'
          },{
            id:"MANU",
            code:4,
            name:'人工'
          }],
           //安全停车
           truckStop:[{
            id:"RemoteParking",
            code:1,
            name:'遥控停车'
          },{
            id:"EmergencyBraking",
            code:2,
            name:'紧急制动'
          },{
            id:"MissionAbort",
            code:3,
            name:'任务终止'
          },{
            id:"SwitchToDriving",
            code:4,
            name:'继续行驶'
          }],
        }
    },
    computed: {
      subareaSn(){
        return this.$store.state.subareaSn;
      },
      subareaId(){
        var subareasList = this.$store.state.currentUserDetails?this.$store.state.currentUserDetails.subareas:[];
        var json = subareasList.find(item=>item.subareaSn == this.subareaSn)||{};
        return json.id;
      },
      subareaName(){
        var subareasList = this.$store.state.currentUserDetails?this.$store.state.currentUserDetails.subareas:[];
        var json = subareasList.find(item=>item.subareaSn == this.subareaSn)||{};
        return json.subareaName;
      },
      disabledDispatchEdit(){//是否禁用智能调度编辑权限
        return this.$store.state.disabledDispatchEdit;
      },
      priority(v){
        return function(v){
          var name = this.$t('action.null');
          var priorityList = this.vars.priorityList;
          for(let i=0; i< priorityList.length;i++){
            if(priorityList[i].id === v){
              name = priorityList[i].name;
              break;
            }
          }
          return name;
        }
      }
    },
    methods: {
      diggerShow(data,key){
        //console.log(data,key)
        // console.log(this.$parent);
        if(data){
          this.$parent.diggerShow(data,key);
        }
      },
      truckShow(data,key){
        // console.log(data,key)
        if(data){
          this.$parent.truckShow(data,key);
        }
      },
      dumpShow(data,key){
        if(data){
          this.$parent.dumpShow(data,key);
        }
      },
      getLockName(arr){
        return (arr || []).map(item=>{
          if(item.elementName){
            return item.elementName
          }
        }).join(' | ') || '无';
      },
      getBanName(arr){
        return (arr || []).map(item=>{
          if(item.elementName){
            return item.psvElementName
          }
        }).join(' | ') || '无';
      },
      getStopDispatch(val){
        return val ? val : this.vars.stopDispatch[0].name;
      },
      showStopDispatchIcon(key){
        let stopDispatch =  this.dispatchData.hasOwnProperty('stopDispatch') ? this.dispatchData.stopDispatch[key] : false;
        return stopDispatch == true ? true : false;
      }
    }
}