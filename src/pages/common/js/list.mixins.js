// 在线作业管理列表公共部分
export default {
  data(){
    return {
        
    }
  },
  created(){

  },
  methods:{
    openMenu(e){
        var active = e.split('-');
        this.active=active;
        var id = "";
        var query={};
        var details=null;
  
        var area = this.boundayList[active[0]];
        query['areaSn']=area.areaSn;
        query['areaTypeSn']=this.utils.getObjValByKey(this.vars.baseSite.mapType,area.areaType,'type','id');
        
        if(active.length==1){
          
          details = this.boundayList[active[0]];
          id = details.areaSn.toString();
  
          query['activeType']=1;  //1:卸载区;2:停靠区;3:停靠位
  
        }
        else if(active.length==2){
  
          query['activeType']=2;
          details = this.boundayList[active[0]].parkGrps[active[1]];
          id = details.id;
  
        }
        else if(active.length==3){
          query['activeType']=3;
          details = this.boundayList[active[0]].parkGrps[active[1]].parkSpaces[active[2]];
          id = details.id;
        }
        details['activeType']=query.activeType;
        this.$emit('setUploadDetails',details);
        this.$router.push({path: id,query:query});
      },
      activeList(id,data,refresh){
        var active = [];
        var details = null;
        var openeds = [];
        var content = data;
        
        var activeType = this.$route.query.activeType;
  
        uploading:for(let i=0;i<content.length;i++){
          // console.log('content[i].areaSn',content[i].areaSn);
          if(content[i].areaSn==id){
            details=content[i];
            active=[i];
            break;
          }
          if(activeType==2||activeType==3){
            var parkGrps = content[i].parkGrps;
            for(let j=0;j<parkGrps.length;j++){
              active=[i,j];
              if(parkGrps[j].id==id){
                details=parkGrps[j];
                openeds=[''+i+''];
                break uploading;
              }
              if(activeType==3){
                var parkSpaces = parkGrps[j].parkSpaces;
                  for(let k=0;k<parkSpaces.length;k++){
                    active=[i,j,k];
                    if(parkSpaces[k].id==id){
                      details=parkSpaces[k];
                      openeds=[''+i+'',i+'-'+j]
                      break uploading;
                    }
                  }
              }
                
            }
          }
          
        }
        this.active = active;
        
        if(!refresh){
          this.openeds=openeds;
        }
        
        // console.log(!refresh,content,id,details);
        this.$emit('setUploadDetails',details);
      },
  
      berthPlaceTitle(berthPlace){
        return '(' + 
            ( berthPlace.used && berthPlace.workStatusValue==this.vars.workingStatusList[2].code? 
            '正在使用': 
            this.utils.getObjValByKey(this.vars.workingStatusList,berthPlace.workStatusValue,'code','name') ) +
          ')';
      },
      deviceTitle(berthPlace){
        var list = [{
          type:"UNKNOWN",
          code:-1,
          name:'未知',
          color:"#001d33",
        },
        {
          type:"STOP",
          code:0,
          name:'暂停派遣',
          color:"#e60012"
        },
        {
          type:"RUNNING",
          code:1,
          name:'正常派遣',
          color:"#73cd37"
        }]
        return '(' + 
            ( berthPlace.used && berthPlace.workStatusValue==this.vars.workingStatusList[2].code? 
            '正在使用': 
            this.utils.getObjValByKey(list,berthPlace.workStatusValue,'code','name') ) +
          ')';
      },
  }
}