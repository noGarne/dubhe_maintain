

import devicesServer from '../../../api/devices.server';

import monitoringServer from '../../../api/monitoring.server';
import websocket from '../../../api/websocket';


export default {
  data(){
    return {
      devicesList:[],
      devicesJson:{},
      tsScriberList:[],
      attrSubList:[],
    }
  },
  created(){

  },
  
  computed: {
    direction(){
      return (data,direction)=>{
        var rotate=0;
        if(data.showTypeSn==this.vars.showTypeList[0].id||data.showTypeSn==this.vars.showTypeList[1].id){
          rotate=direction;
        }else{
          rotate=0;
        }
        return rotate;
      }
    }
  },
  methods:{
    async getDevices(type){//获取设备
      var _this = this;
      try{
        var arg = {
          pageSize:this.vars.pageData.pageSize,
          // pageSize:10,
          // pageIndex:1,
          isForbidden:false
        }
        type&&(arg['showTypeSn']=type);
        var result=await devicesServer.devicesList(arg);
        
        var data = result.content;

        result = null;
        if(data.length>0){
          var json = {};
          var list = [];
          data.forEach(function(v){
            json[v.id.id]=v;
            
            var child = {};
            child['equipmentModelName']=v.equipmentModelName;
            child['equipmentTypeName']=v.equipmentModelName;
            child['equipmentTypeSn']=v.equipmentTypeSn;
            child['id']=v.id;
            child['equipmentName']=v.equipmentName;
            list.push(child)

          })
          _this.setDevicesList(list,json);
          
          _this.getwebsocketTs(data)
          _this.getwebsocketAttr(data)
        }
        data = null;

      }catch(e){
        _this.messages.error(e.message)
      }
    },
    setDevicesList(data,json){//给设备复值
      this.devicesList=data;
      this.devicesJson=json;
    },
    getwebsocketTs(infoList){//建立长链接
      var _this=this;
      var tsType=monitoringServer.tsType();

      var arrList=[];
      infoList.forEach(function(v,i){
        var subscriptionList={
          entityType:v.id.entityType,
          entityId:v.id.id,
          keys: tsType.list
        }
        arrList.push(subscriptionList)
      })

      var subscriber = {
          subscriptionCommands: arrList,
          type: 'tsScriber'
      };

      subscriber.onReconnected = function() {}
      subscriber['onData'] = function(data) {
        if (data.data) {
            _this.getConfigResult(data);
        }
      }

      websocket.subscribe(subscriber,function(data){
        _this.tsScriberList=data;
      });
    },
    getwebsocketAttr(infoList){//建立长链接
      var _this=this;
      var tsType=monitoringServer.tsType();

      var arrList=[];
      infoList.forEach(function(v,i){
        var subscriptionList={
          entityType:v.id.entityType,
          entityId:v.id.id,
          keys: tsType.attr
        }
        arrList.push(subscriptionList)
      })

      var subscriber = {
          subscriptionCommands: arrList,
          type: 'attrSub'
      };

      subscriber.onReconnected = function() {}
      subscriber['onData'] = function(data) {
        if (data.data) {
            _this.getConfigResult(data);
        }
      }

      websocket.subscribe(subscriber,function(data){
        _this.attrSubList=data;
      });
    },
    
    getConfigResult(info){//数据复值
      // return;
      var _this=this;
      var errorCode=info.errorCode;
      if(errorCode==0){

        var infoData=info.data;
        var received_info = {};
        for(let k in infoData){
          received_info = infoData[k];
          received_info['ts'] = parseInt(k);
          break;
        }
        var received_id=info.entity.entityId;

        var received_type=info.entity.type;

        if(received_type=='tsScriber'){
          var lat=received_info.latitude?received_info.latitude:0;
          var lng=received_info.longitude?received_info.longitude:0;
          received_info['latLng'] = [ lat , lng  ]
        }
        var data={
          id:received_id,
          data:received_info,
          type:received_type,
          cmdId:info.subscriptionId
        }
        // console.log(data);
        _this.setDevicesAttr(data);
      }
    },

    setDevicesAttr(arg){//给设备添加值
    // return;
      var id=arg.id,
          data=arg.data,
          type=arg.type
      if(data&&type){

        var devicesJson = this.devicesJson;
        var d = JSON.parse(JSON.stringify(devicesJson[id]||{}));

        d[type]=data;
        if(type=='tsScriber'){
          if(!d.cmdId){
            d['cmdId'] = {
              ts:arg.cmdId
            }
          }else{
            if(!d.cmdId.ts){
              d.cmdId.ts = arg.cmdId;
            }
          }

        }else if(type=='attrSub'){
          if(!d.cmdId){
            d['cmdId'] = {
              attr:arg.cmdId
            }
          }else{
            if(!d.cmdId.attr){
              d.cmdId.attr = arg.cmdId;
            }
          }
        }
        if(!this.loading){
          this.copyData = true;
        }
        this.devicesJson[id]=d;
        // console.log(this.devicesJson);
      }
    },
    unsubscribe(){//去除长链接
      var subscriber = {
          subscriptionCommands: this.tsScriberList,
          type: 'tsScriber'
      };
      var subscriber2 = {
          subscriptionCommands: this.attrSubList,
          type: 'attrSub'
      };
      // console.log(subscriber)
      websocket.unsubscribe(subscriber);
      websocket.unsubscribe(subscriber2);
    },
  },
  beforeDestroy() {
    this.unsubscribe();
  }
    
}