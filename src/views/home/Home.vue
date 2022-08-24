<template>
<!-- 首页 -->
  <div class="home">
    <div class="home-content">
      <div class="home_top">
        <ul>
          <li class="home_li" v-for="(item,index) in navList" :key="index" :class="item.disabled">
            <router-link :to='item.disabled?"":{name:item.route}' tag="div" :name="item.id">
              <div class="li_icon">
                <i class="center-icon" :class="item.icon"></i>
                <i class="iconfont icon-liubian six-xing six-border"></i>
                <i class="iconfont icon-liubian-bg six-xing six-bg"></i>
              </div>
              <div class="li_text">
                <h3>{{$t(item.name)}}</h3>
                <p>{{item.english}}</p>
              </div>
            </router-link>
            <div class="no_access">
              暂无权限
            </div>
          </li>
          
          <li class="end">
            <div class="li_text">
              <h3>期待更多...</h3>
            </div>
          </li>
        </ul>
      </div>

      <div class="home_bottom">
        <div class="home_left">
          <ul>
            <li>
              <div class="calendar">
                <div class="calendar_t">
                  <i class="iconfont icon-rili1"></i>
                  <span>{{timeDate.year}}年{{timeDate.month}}月 {{timeDate.nv}}</span>
                </div>
                <div class="calendar_m">
                  {{timeDate.date}}
                </div>
                <div class="calendar_b">
                  星期{{timeDate.day}}
                </div>
              </div>
              <i class="iconbg icon-rili1"></i>
            </li>
            <li>
              <div class="current_data">
                <span><i class="iconfont icon-xingzhuang"></i></span>
                <div>
                  <p class="data_title">无人驾驶安全运行</p>
                  <p class="data_number">
                    <span> 
                      <animated-number
                        :value="sumDate.runningDays?sumDate.runningDays:0"
                        :formatValue="formatToPrice"
                        :duration="1000"
                      />
                    </span> 天</p>
                    
                    <!-- {{sumDate.runningDays}} -->
                </div>
              </div>
              <i class="iconbg icon-xingzhuang"></i>
            </li>
            <li>
              <div class="current_data">
                <span><i class="iconfont icon-chelianglicheng"></i></span>
                <div>
                  <p class="data_title">无人驾驶运营里程</p>
                  <p class="data_number"> <span>
                    <animated-number
                        :value="sumDate.totalHeavyDistance?sumDate.totalHeavyDistance:0"
                        :formatValue="formatToPrice"
                        :duration="1000"
                      />
                      <!-- {{sumDate.totalHeavyDistance}} -->
                      </span> 公里</p>
                </div>
              </div>
              <i class="iconbg icon-chelianglicheng"></i>
            </li>
            <li>
              <div class="current_data">
                <span><i class="iconfont icon-tongji1"></i></span>
                <div>
                  <p class="data_title">无人驾驶运输产量</p>
                  <p class="data_number"> <span>
                    <animated-number
                        :value="sumDate.totalWeight?sumDate.totalWeight:0"
                        :formatValue="formatToPrice"
                        :duration="1000"/>
                    <!-- {{sumDate.totalWeight}} -->
                    </span> 吨</p>
                </div>
              </div>
              <i class="iconbg icon-tongji1"></i>
            </li>
          </ul>
        </div>
        <div class="home_right">
          <home-statement></home-statement>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

import menuService from '../../components/header/menu.service'

import HomeStatement from "@/components/home/HomeStatement"
import statementServer from '../../api/statement.server'
import AnimatedNumber from "animated-number-vue";

  export default {
    name: 'home',
    data(){
      return{
        timeDate:{},
        sumDate:{
          runningDays: 0,
          totalWeight: 0,
          totalHeavyDistance: 0
        }
      }
    },
    components:{
      HomeStatement,
      AnimatedNumber
    },
    computed:{
      navList(){
        var limitList=[];
        // console.log(this.$store.state.currentUserDetails)
        var limit = this.$store.state.currentUserDetails?(this.$store.state.currentUserDetails.authorization||[]):[];
        var list = menuService.getSections();
        for (const key in list) {
          const item = list[key];
          if(!limit.some(v => v == item.route)){
            var child = item.children;
            var limitChild = item.limitList;
            if(child && child.length>0){
              var isExist = false;
              for(let i=0;i<child.length;i++){
                if(limit.some(u => u == child[i].route)){
                  item.route=child[i].route;
                  isExist=true;
                  break;
                }
              }
              if(!isExist){
                item.disabled='disabled';
                item.route='';
              }
            } else{
              item.disabled='disabled';
              item.route='';
            }
          }
          // console.log(item.route);
          var exceptLimit=[];
          for(let i in list){
            if(list[i].setLimit.indexOf('3')>-1){
              exceptLimit.push(i);
            }
          }
          
          if(!exceptLimit.some(v => v == key)){
            limitList.push(item);
          }
        }
        return limitList; 
      }
    },
    created(){
      this.getTimeD();
      this.getTotal();
    },
    methods:{
      formatToPrice(value){
        return parseInt(value);
      },
      async getTotal(){
        try{
          var result = await statementServer.getTotal();
          var sumDate = result;
          var totalHeavyDistance = result.totalHeavyDistance?(result.totalHeavyDistance/1000):0;
          sumDate.totalHeavyDistance = parseInt(totalHeavyDistance);
          this.sumDate = sumDate;
          this.getTimeD(result.currentTime)
        }catch(e){
          this.messages.error(e.message)
        }
      },
      getTimeD(date){
        if(date){
          var curDate = new Date(date);
        }else{
          var curDate = new Date();
        }
        
        var year = curDate.getFullYear();
        var month = curDate.getMonth()+1;
        var date = curDate.getDate();
        var day = curDate.getDay();

        switch(day){
          case 1:
            day='一'
          break;
          case 2:
            day='二'
          break;
          case 3:
            day='三'
          break;
          case 4:
            day='四'
          break;
          case 5:
            day='五'
          break;
          case 6:
            day='六'
          break;
          case 0:
            day='日'
          break;
        }

        var nv = this.getD(curDate);

        var time = {
          year:year,
          month:month,
          date:date,
          day:day,
          nv:nv
        }
        this.timeDate=time;
      },
      getD(curDate){
        var CalendarData=new Array(100);
        var madd=new Array(12);
        var tgString="甲乙丙丁戊己庚辛壬癸";
        var dzString="子丑寅卯辰巳午未申酉戌亥";
        var numString="一二三四五六七八九十";
        var monString="正二三四五六七八九十冬腊";
        var weekString="日一二三四五六";
        var sx="鼠牛虎兔龙蛇马羊猴鸡狗猪";
        var cYear,cMonth,cDay,TheDate;
        CalendarData = new Array(0xA4B,0x5164B,0x6A5,0x6D4,0x415B5,0x2B6,0x957,0x2092F,0x497,0x60C96,0xD4A,0xEA5,0x50DA9,0x5AD,0x2B6,0x3126E, 0x92E,0x7192D,0xC95,0xD4A,0x61B4A,0xB55,0x56A,0x4155B, 0x25D,0x92D,0x2192B,0xA95,0x71695,0x6CA,0xB55,0x50AB5,0x4DA,0xA5B,0x30A57,0x52B,0x8152A,0xE95,0x6AA,0x615AA,0xAB5,0x4B6,0x414AE,0xA57,0x526,0x31D26,0xD95,0x70B55,0x56A,0x96D,0x5095D,0x4AD,0xA4D,0x41A4D,0xD25,0x81AA5,0xB54,0xB6A,0x612DA,0x95B,0x49B,0x41497,0xA4B,0xA164B, 0x6A5,0x6D4,0x615B4,0xAB6,0x957,0x5092F,0x497,0x64B, 0x30D4A,0xEA5,0x80D65,0x5AC,0xAB6,0x5126D,0x92E,0xC96,0x41A95,0xD4A,0xDA5,0x20B55,0x56A,0x7155B,0x25D,0x92D,0x5192B,0xA95,0xB4A,0x416AA,0xAD5,0x90AB5,0x4BA,0xA5B, 0x60A57,0x52B,0xA93,0x40E95);
        madd[0]=0;
        madd[1]=31;
        madd[2]=59;
        madd[3]=90;
        madd[4]=120;
        madd[5]=151;
        madd[6]=181;
        madd[7]=212;
        madd[8]=243;
        madd[9]=273;
        madd[10]=304;
        madd[11]=334;
        
        function GetBit(m,n){
          return (m>>n)&1;
        }
        function e2c(){
          TheDate= (arguments.length!=3) ? new Date() : new Date(arguments[0],arguments[1],arguments[2]);
          var total,m,n,k;
          var isEnd=false;
          var tmp=TheDate.getYear();
          if(tmp<1900){
            tmp+=1900;
          }
          total=(tmp-1921)*365+Math.floor((tmp-1921)/4)+madd[TheDate.getMonth()]+TheDate.getDate()-38;
          
          if(TheDate.getYear()%4==0&&TheDate.getMonth()>1) {
            total++;
          }
          for(m=0;;m++){
            k=(CalendarData[m]<0xfff)?11:12;
            for(n=k;n>=0;n--){
              if(total<=29+GetBit(CalendarData[m],n)){
                isEnd=true; break;
              }
              total=total-29-GetBit(CalendarData[m],n);
            }
            if(isEnd) break;
          }
          cYear=1921 + m;
          cMonth=k-n+1;
          cDay=total;
          if(k==12){
            if(cMonth==Math.floor(CalendarData[m]/0x10000)+1){
              cMonth=1-cMonth;
            }
            if(cMonth>Math.floor(CalendarData[m]/0x10000)+1){
              cMonth--;
            }
          }
        }
        
        function GetcDateString(){
          var tmp="";
          if(cMonth<1){
          tmp+="(闰)";
          tmp+=monString.charAt(-cMonth-1);
          }else{
          tmp+=monString.charAt(cMonth-1);
          }
          tmp+="月";
          tmp+=(cDay<11)?"初":((cDay<20)?"十":((cDay<30)?"廿":"三十"));
          if (cDay%10!=0||cDay==10){
            tmp+=numString.charAt((cDay-1)%10);
          }
          return tmp;
        }
        
        function GetLunarDay(solarYear,solarMonth,solarDay){
          //solarYear = solarYear<1900?(1900+solarYear):solarYear;
          if(solarYear<1921 || solarYear>2020){
            return "";
          }else{
            solarMonth = (parseInt(solarMonth)>0) ? (solarMonth-1) : 11;
            e2c(solarYear,solarMonth,solarDay);
            return GetcDateString();
          }
        }
        
        // var D=new Date();
        var D=curDate;
        var yy=D.getFullYear();
        var mm=D.getMonth()+1;
        var dd=D.getDate();
        var ww=D.getDay();
        var ss=parseInt(D.getTime() / 1000);
        if (yy<100) yy="19"+yy;
        return GetLunarDay(yy,mm,dd);
        
      }
    }
  }
</script>

<style lang="scss" scoped>
$homeColor:#1c90f7;
.home{
  position: absolute;
  left: 0;
  top: $headerHeight;
  right: 0;
  bottom: 0;
  background: #f3f7fa;
  // overflow: hidden;
}
.home-content{
  width: 90%;
  height: 100%;
  margin: 0 auto;
}
.home_top{
  box-sizing: border-box;
  padding: 2% 0;
  height: 48%;
  width: 100%;
  ul{
    width: 100%;
    height: 100%;
    li{
      width: 25%;
      height: 50%;
      float: left;
      border-right: 2px solid #eee;
      box-sizing: border-box;
      background: #fff;
      transition: all 0.5s;
      cursor: pointer;
      position: relative;
      padding-left: 40px;
      &>div{
        display: block;
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        // justify-content: center;
      }
      &:nth-child(4n){
        border-right: 0;
      }
      &:nth-child(-n+4){
        border-bottom: 2px solid #eee;
      }

      .li_icon{
        float: left;
        @include theme-content-color;
        width: 91px;
        min-width: 91px;
        height: 78px;
        // background: url('./images/home-kuang.png') no-repeat center center;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        transition: all 0.5s;
        position: relative;
        .six-xing{
          height: 100%;
          width: 100%;
          font-size: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          @include theme-content-color;
          display: block;
          &.six-bg{
            display: none;
          }
        }
        .center-icon{
          height: 100%;
          width: 100%;
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 34px;
          @include theme-content-color;
          transition: all 0.5s;
        }
      }
      .li_text{
        float: left;
        padding-left: 30px;
        h3{
          line-height: 42px;
          font-size: 18px;
          font-weight: normal;
          @include theme-content-color;
        }
        p{
          color: #abacad;
          line-height: 30px;
        }
      }
      &.end{
        padding-left: 0;
        text-align: center;
        cursor: default;
        box-sizing: border-box;
        border-right: none;
        .li_text{
          padding-left: 0;
        }
        h3{
          font-size: 16px;
          width: 100%;
        }
      }
      .no_access{
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        background: rgba(255,255,255,0.8);
        text-align: center;
        line-height: 100%;
          @include theme-content-color;
        font-size: 18px;
        justify-content: center;
        display: none;
      }
      &.disabled{
        cursor: default;
        .li_icon{
          // background-image: url('./images/home-kuang3.png');
          i{
            color: #abacad !important;
          }
        }
        h3{
          color: #abacad !important;
        }
        &:hover{
          .no_access{
            display: flex;
          }
        }
      }
      
      &:hover:not(.end):not(.disabled){
        z-index: 2;
        position: relative;
        box-shadow: 0 0 40px rgba(28, 144, 247,.21);
        .li_icon{
          // background-image: url('./images/home-kuang2.png');
          i.center-icon{
            color: #fff;
            transform: scale(1.2)
          }
          .six-xing{
            &.six-border{
              display: none;
            }
            &.six-bg{
              display: block;
            }
            
          }
          
        }
      }
      @media screen and (max-width: 1540px) {
        &.home_li{
          padding-left: 30px;
        }
        .li_icon{
          
          width: 86px;
          min-width: 86px;
          height: 75px;
          
          .six-xing{
            font-size: 76px;
          }

          // background-size: auto 100%;
          i.center-icon{
            font-size: 28px;
          }
        }
        .li_text{
          padding-left: 10px;
          h3{
            font-size: 16px;
          }
          p{
            font-size: 14px;
          }
        }
      }
      
      @media screen and (max-width: 1360px) {
        &.home_li{
          padding-left: 20px;
        }
        .li_icon{
          width: 70px;
          min-width: 70px;
          height: 60px;
          // height: 50px;
          .six-xing{
            font-size: 60px;
          }

          // background-size: auto 100%;
          i.center-icon{
            font-size: 28px;
          }
        }
        .li_text{
          padding-left: 5px;
          h3{
            font-size: 14px;
          }
          p{
            font-size: 12px;
          }
        }
      }
    }
  }
}
.home_bottom{
  box-sizing: border-box;
  height: 50%;
  width: 100%;
  overflow: hidden;
  padding-bottom: $marginWidth;
}

.home_left{
  height: 100%;
  width: 46%;
  float: left;
  ul{
    height: 100%;
    width: 100%;
    li{
      width: 50%;
      height: 50%;
      float: left;
      box-sizing: border-box;
      background: #fff;
      display: flex;
      align-items: center;
      position: relative;
      overflow: hidden;
      &:first-child{
        &>div{
          width:100%;
        }
      }
      padding-left: 3%;
      .iconbg{
        position: absolute;
        right: -20px;
        bottom: -20px;
        opacity: 0.05;
        font-size: 150px;
        color: #2558a7;
      }
      &:nth-child(2n+1){
        border-right: 2px solid #eee;
      }
      
      &:nth-child(-n+2){
        border-bottom: 2px solid #eee;
      }
      .calendar{
        $color:#2558a7;
        div{
          // color: $color;
          
          @include theme-content-color;
        }
        .calendar_t{
          font-size: 18px;
          line-height: 40px;
          i{
            font-size: 36px;
          @include theme-content-color;
            // color: $color;
            margin-right: 10px;
            float: left;
          }
        }
        .calendar_m{
          text-align: center;
          font-size: 54px;
          line-height: 100px;
        }
        .calendar_b{
          text-align: center;
          font-size: 18px;
        }
      }
      .current_data{
        display: flex;
        $bg:#f2732e;
        &>span{
          float: left;
          @include theme-content-color;
          $height:70px;
          height: $height;
          width: $height;
          min-width: $height;
          min-height: $height;
          background: $bg;
          border-radius: 50%;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          -webkit-box-pack: center;
          -ms-flex-pack: center;
          justify-content: center;
          i{
            font-size: 34px;
            color:#fff;
          }
        }
        &>div{
          float: left;
          padding-left: 20px;
          .data_title{
            line-height: 32px;
            font-size: 18px;
            font-weight: normal;
            padding-bottom: 10px;
          }
          .data_number{
            font-size: 18px;
            color: $bg;
            line-height: 30px;
            span{
              font-size: 28px;
              font-weight: bold;
              margin-right: 5px;
            }
          }
        }
      }
      &:nth-child(2){
        $bg:#f2732e;
        .iconbg{
          color: $bg;
        }
        .current_data{
          &>span{
            background: $bg;
          }
          &>div{
            .data_number{
              color: $bg;
            }
          }
        }
      }
      
      &:nth-child(3){
        $bg:#82d587;
        .iconbg{
          color: $bg;
        }
        .current_data{
          &>span{
            background: $bg;
          }
          &>div{
            .data_number{
              color: $bg;
            }
          }
        }
      }
      &:nth-child(4){
        $bg:#4da1ff;
        .iconbg{
          color: $bg;
        }
        .current_data{
          &>span{
            background: $bg;
          }
          &>div{
            .data_number{
              color: $bg;
            }
          }
        }
      }
      @media screen and (max-width: 1540px) {
        .calendar{
          .calendar_t{
            font-size: 16px;
            i{
              font-size: 30px;
            }
          }
          .calendar_m{
            line-height: 60px;
            font-size: 40px;
          }
          .calendar_b{
            font-size: 16px;
          }
        }
        .current_data {
          &>span{
            $height:60px;
            height: $height;
            width: $height;
            min-width: $height;
            min-height: $height;
          }
          div p.data_title{
            font-size: 18px;
            padding-bottom: 6px;
          }
          &>div p.data_number{
            font-size: 16px;
            span{
              font-size: 22px;
            }
          }
        }
        .iconbg{
          font-size: 100px;
        }
      }

      @media screen and (max-width: 1340px) {
        .calendar{
          .calendar_t{
            font-size: 14px;
            i{
              font-size: 26px;
            }
          }
          .calendar_m{
            line-height: 40px;
            font-size: 34px;
          }
          .calendar_b{
            font-size: 14px;
          }
        }
        .current_data {
          &> span{
            $height:50px;
            height: $height;
            width: $height;
            min-width: $height;
            min-height: $height;
            i{
              font-size: 28px;
            }
          }
          div p.data_title{
            font-size: 14px;
          }
          &>div p.data_number{
            font-size: 14px;
            span{
              font-size: 20px;
            }
          }
        }
        .iconbg{
          font-size: 100px;
        }
      }
      
      @media screen and (max-width: 1140px) {
        .calendar{
          .calendar_m{
            line-height: 34px;
            font-size: 30px;
          }
        }
        .current_data {
          .data_title{
            font-size: 12px;
          }
        }
      }
    }
  }
}

.home_right{
  height: 100%;
  width: 52%;
  float: right;
  background: #fff;
}

 
</style>