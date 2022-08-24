export default {
  data(){
    return{
      
    }
  },
  
  watch:{
    
  },
  methods:{
    iconImgShow(info){
      var iconfont = "";
      var type = info.showTypeSn;
      if(type==this.vars.showTypeList[0].id){//矿卡设备
        iconfont = "icon-kache"
      }else if(type==this.vars.showTypeList[1].id){//挖掘设备
        iconfont = "icon-dianchan"
      }else if(type==this.vars.showTypeList[2].id){//卸点设备
        iconfont = "icon-posuiji"
      }else if(type==this.vars.showTypeList[3].id){//辅助车辆设备
        iconfont = "icon-fuzhu"
      }else if(type==this.vars.showTypeList[4].id){//地面设备
        iconfont = "icon-dimiansheshi"
      }else{  
        iconfont = "icon-fuzhu"
      }
      return iconfont
    },
    iconBgColor(active,showTypeSn,operationType,className){//状态背景
      var status = "";
      if(active=="true"){
        if(showTypeSn==this.vars.deviceTypeNew[0].id||showTypeSn==this.vars.deviceTypeNew[1].id||showTypeSn==this.vars.deviceTypeNew[2].id){
          status = className+''+operationType;
        }else{
          status = className + '0';
        }
      }
      return status;
    },
  }
};