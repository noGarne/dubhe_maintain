
import statementServer from '../../api/statement.server';
import subareaServer from '../../api/subarea.server';
import devicesServer from '../../api/devices.server';
import shiftServer from '../../api/shift.server';
import statusReason from '../../api/statusReason.server';
import materialServer from '../../api/material.server';

export default {
  data () {
    return {
      pickerDayOptions:{
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      pickerMonthOptions:{
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      pickerYearOptions:{
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      pickerStartOptions:{
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      pickerEndOptions:{
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      hasDataTime:{
        listDay:[]
      },
      reportHeight:'',
      setRows:[],
      setRows2:[],
      currentData:{
        id:'',
        src:'',
        reportType:'',
        reportName:'',
        reportCondition:'',
        reportTitle:'',
        timeType:'',
        timeTypeValue:"",
        html:'',
        tableNum:1,//表格数，默认1=普通1个表格；>2=多个表格
        headerNum:1,//表头有几行，默认1=普通表格；>2=多行表头
        firstNum:1,//多行表头中未合并的开始列有几列，默认1， 或者 普通单行表头中要合并行的列数，默认不合并
        lastNum:0,////多行表头中未合并的最后列有几列，默认0
        colNum:2,//多行表头有几列合并为1列，列个数固定，默认2
      },
      conditionList:{
        subareaList:[],
        truckList:[],
        shovelList:[],
        dumpList:[],
        shiftList:[],
        treasonList:[],
        sreasonList:[],
        dreasonList:[],
        statusList:[],
        timeTypeList:[],
        materialList:[],
        dmodeList:[]
      },
      conditionData:{
        date:'',
        starttime:'',
        endtime:'',
        year:'',
        month:'',
        subarea:'',
        truck:'',
        shovel:'',
        dump:'',
        shift:'',
        treason:'',
        sreason:'',
        dreason:'',
        status:'',
        subareaName:'',
        truckName:'',
        shovelName:'',
        dumpName:'',
        shiftName:'',
        treasonName:'',
        sreasonName:'',
        dreasonName:'',
        statusName:'',
        material:[],
        dmode:''
      },
      conditionAll:['subarea','truck','shovel','dump','shift','date','starttime','endtime','year','month','treason','sreason','dreason','status','timeType','eachteam','material','dmode'],
      reportData:[
        //当班产量查询
        {
          id:'101',
          condition:'subarea,truck',
          reportName:'truck_current_output_detail',//卡车当班产量明细
          title:'statement.truck-current-output-detail'
        },{
          id:'102',
          condition:'subarea,shovel',
          reportName:'shovel_current_output_detail',//采装设备当班产量明细
          title:'statement.digger-current-output-detail'
        },{
          id:'103',
          condition:'subarea,dump',
          reportName:'dump_current_output_detail',//卸点当班产量明细
          title:'statement.dump-current-output-detail'
        },{
          id:'104',
          condition:'subarea',
          reportName:'truck_current_output_search',//卡车当班产量查询
          title:'statement.truck-current-output-search',
          headerNum:2,
          firstNum:2
        },{
          id:'105',
          condition:'subarea',
          reportName:'shovel_current_output_search',//采装设备当班产量查询
          title:'statement.digger-current-output-search',
          headerNum:2,
          firstNum:2
        },{
          id:'106',
          condition:'subarea',
          reportName:'dump_current_output_search',//卸点当班产量查询
          title:'statement.dump-current-output-search',
          headerNum:2,
          firstNum:2
        },
        // {
        //   id:'107',
        //   condition:'subarea',
        //   reportName:'truck_current_output_dump',//卡车当班产量分卸点
        //   title:'statement.truck-current-output-dump',
        //   headerNum:4,
        //   firstNum:2,
        //   lastNum:2
        // },{
        //   id:'108',
        //   condition:'subarea',
        //   reportName:'shovel_current_output_hour_horizontal',//采装设备当班小时产量（横）
        //   title:'statement.digger-current-output-hour-horizontal',
        //   headerNum:2
        // },{
        //   id:'109',
        //   condition:'subarea',
        //   reportName:'shovel_current_output_hour_vertical',//采装设备当班小时产量（竖）
        //   title:'statement.digger-current-output-hour-vertical',
        //   headerNum:2
        // },{
        //   id:'110',
        //   condition:'subarea',
        //   reportName:'dump_current_output_hour_horizontal',//卸点当班小时产量（横）
        //   title:'statement.dump-current-output-hour-horizontal',
        //   headerNum:2
        // },{
        //   id:'111',
        //   condition:'subarea',
        //   reportName:'dump_current_output_hour_vertical',//卸点当班小时产量（竖）
        //   title:'statement.dump-current-output-hour-vertical',
        //   headerNum:2
        // },
          //采装设备历史查询
        /*{
          id:'201',
          condition:'shift,date',
          reportName:'shovel_history_output_search',//采装设备历史班产量查询
          title:'statement.digger-history-output-search',
          headerNum:2,
          firstNum:2
        },
        {
          id:'202',
          condition:'date',
          reportName:'shovel_history_day_output_search',//采装设备历史日产量查询
          title:'statement.digger-history-day-output-search',
          headerNum:2,
          firstNum:2
        },
        {
          id:'203',
          condition:'month',
          reportName:'shovel_history_month_output_search',//采装设备历史月产量查询
          title:'statement.digger-history-month-output-search',
          headerNum:2,
          firstNum:2
        },
        {
          id:'204',
          condition:'year',
          reportName:'shovel_history_year_output_search',//采装设备历史年产量查询
          title:'statement.digger-history-year-output-search',
          headerNum:2,
          firstNum:2
        },
        {
          id:'205',
          condition:'starttime,endtime',
          reportName:'shovel_history_date_output',//采装设备历史日期段产量
          title:'statement.digger-history-date-output',
          headerNum:2,
          firstNum:2
        },*/
        /*{
          id:'206',
          condition:'date',
          reportName:'shovel_shift_day_output_search',//采装设备各班日产量查询
          title:'statement.digger-class-day-output-search',
          headerNum:2,
          firstNum:2
        },
        {
          id:'207',
          condition:'month',
          reportName:'shovel_shift_month_output_search',//采装设备各班月产量查询
          title:'statement.digger-class-month-output-search',
          headerNum:2,
          firstNum:2
        },
        {
          id:'208',
          condition:'year',
          reportName:'shovel_shift_year_output_search',//采装设备各班年产量查询
          title:'statement.digger-class-year-output-search',
          headerNum:2,
          firstNum:2
        },
        {
          id:'209',
          condition:'starttime,endtime',
          reportName:'shovel_shift_date_output',//采装设备各班日期段产量
          title:'statement.digger-class-date-output',
          headerNum:2,
          firstNum:2
        },*/
        {
          id:'210',
          condition:'shift,date',
          reportName:'shovel_output_dump',//采装设备产量分卸点
          title:'statement.digger-output-dump',
          headerNum:2
        },
        {
          id:'211',
          condition:'shovel,shift,date',
          reportName:'shovel_history_shift_detail',//采装设备历史班明细
          title:'statement.digger-history-class-search'
        },
        {
          id:'212',
          condition:'shift,date',
          reportName:'shovel_history_hour_output_horizontal',//采装设备历史小时产量（横）
          title:'statement.digger-history-hour-output-horizontal',
          headerNum:2
        },
        {
          id:'213',
          condition:'shift,date',
          reportName:'shovel_history_hour_output_vertical',//采装设备历史小时产量（竖）
          title:'statement.digger-history-hour-output-vertical',
          headerNum:2
        },
        {
          id:'214',
          condition:'timeType',
          reportName:'shovel_history_output',//采装设备历史产量
          title:'statement.digger-history-output',
          headerNum:2,
          firstNum:2
        },
        {
          id:'215',
          condition:'eachteam',
          reportName:'shovel_shift_output',//采装设备各班产量
          title:'statement.digger-class-output',
          headerNum:2,
          firstNum:2
        },
          //卡车历史查询
        // {
        //   id:'301',
        //   condition:'subarea,shift,date',
        //   reportName:'truck_history_output_search',//卡车历史班产量
        //   title:'statement.truck-history-output-search',
        //   headerNum:2,
        //   firstNum:2
        // },
        // {
        //   id:'302',
        //   condition:'subarea,date',
        //   reportName:'truck_history_day_output_search',//卡车历史日产量
        //   title:'statement.truck-history-day-output-search',
        //   headerNum:2,
        //   firstNum:2
        // },
        // {
        //   id:'303',
        //   condition:'subarea,month',
        //   reportName:'truck_history_month_output_search',//卡车历史月产量
        //   title:'statement.truck-history-month-output-search',
        //   headerNum:2,
        //   firstNum:2
        // },
        // {
        //   id:'304',
        //   condition:'subarea,year',
        //   reportName:'truck_history_year_output_search',//卡车历史年产量
        //   title:'statement.truck-history-year-output-search',
        //   headerNum:2,
        //   firstNum:2
        // },
        // {
        //   id:'305',
        //   condition:'subarea,starttime,endtime',
        //   reportName:'truck_history_date_output',//卡车历史日期段产量
        //   title:'statement.truck-history-date-output',
        //   headerNum:2,
        //   firstNum:2
        // },
        // {
        //   id:'306',
        //   condition:'subarea,date',
        //   reportName:'truck_shift_day_output_search',//卡车各班日产量
        //   title:'statement.truck-class-day-output-search',
        //   headerNum:2,
        //   firstNum:2
        // },
        // {
        //   id:'307',
        //   condition:'subarea,month',
        //   reportName:'truck_shift_month_output_search',//卡车各班月产量
        //   title:'statement.truck-class-month-output-search',
        //   headerNum:2,
        //   firstNum:2
        // },
        // {
        //   id:'308',
        //   condition:'subarea,year',
        //   reportName:'truck_shift_year_output_search',//卡车各班年产量
        //   title:'statement.truck-class-year-output-search',
        //   headerNum:2,
        //   firstNum:2
        // },
        {
          id:'309',
          condition:'subarea,truck,shift,date',
          reportName:'truck_history_shift_detail',//卡车历史班明细
          title:'statement.truck-history-class-search'
        },
        {
          id:'310',
          condition:'starttime,endtime',
          reportName:'truck_transport_output_report',//运输产量报表
          title:'statement.transport-output-report',
          headerNum:2,
          lastNum:1
        },
        {
          id:'311',
          condition:'timeType',
          reportName:'truck_history_output',//卡车历史产量
          title:'statement.truck-history-output',
          headerNum:2,
          firstNum:2
        },
        {
          id:'312',
          condition:'eachteam',
          reportName:'truck_shift_output',//卡车各班产量
          title:'statement.truck-class-output',
          headerNum:2,
          firstNum:2
        },
          //卸点历史查询
        // {
        //   id:'401',
        //   condition:'shift,date',
        //   reportName:'dump_history_output_search',//卸点历史班产量查询
        //   title:'statement.dump-history-output-search',
        //   headerNum:2,
        //   firstNum:2
        // },
        // {
        //   id:'402',
        //   condition:'date',
        //   reportName:'dump_history_day_output_search',//卸点历史日产量查询
        //   title:'statement.dump-history-day-output-search',
        //   headerNum:2,
        //   firstNum:2
        // },
        // {
        //   id:'403',
        //   condition:'month',
        //   reportName:'dump_history_month_output_search',//卸点历史月产量查询
        //   title:'statement.dump-history-month-output-search',
        //   headerNum:2,
        //   firstNum:2
        // },
        // {
        //   id:'404',
        //   condition:'year',
        //   reportName:'dump_history_year_output_search',//卸点历史年产量查询
        //   title:'statement.dump-history-year-output-search',
        //   headerNum:2,
        //   firstNum:2
        // },
        // {
        //   id:'405',
        //   condition:'starttime,endtime',
        //   reportName:'dump_history_date_output',//卸点历史日期段产量
        //   title:'statement.dump-history-date-output',
        //   headerNum:2,
        //   firstNum:2
        // },
        // {
        //   id:'406',
        //   condition:'date',
        //   reportName:'dump_shift_day_output_search',//卸点各班日产量查询
        //   title:'statement.dump-class-day-output-search',
        //   headerNum:2,
        //   firstNum:2
        // },
        // {
        //   id:'407',
        //   condition:'month',
        //   reportName:'dump_shift_month_output_search',//卸点各班月产量查询
        //   title:'statement.dump-class-month-output-search',
        //   headerNum:2,
        //   firstNum:2
        // },
        // {
        //   id:'408',
        //   condition:'year',
        //   reportName:'dump_shift_year_output_search',//卸点各班年产量查询
        //   title:'statement.dump-class-year-output-search',
        //   headerNum:2,
        //   firstNum:2
        // },
        // {
        //   id:'409',
        //   condition:'starttime,endtime',
        //   reportName:'dump_shift_date_output',//卸点各班日期段产量
        //   title:'statement.dump-class-date-output',
        //   headerNum:2,
        //   firstNum:2
        // },
        {
          id:'410',
          condition:'dump,shift,date',
          reportName:'dump_history_shift_detail',//卸点历史班产量明细
          title:'statement.dump-history-class-search'
        },
        {
          id:'411',
          condition:'shift,date',
          reportName:'dump_history_hour_output_horizontal',//卸点历史小时产量(横)
          title:'statement.dump-history-hour-output-horizontal',
          headerNum:2
        },
        {
          id:'412',
          condition:'shift,date',
          reportName:'dump_history_hour_output_vertical',//卸点历史小时产量（竖）
          title:'statement.dump-history-hour-output-vertical',
          headerNum:2
        },
        {
          id:'413',
          condition:'timeType',
          reportName:'dump_history_output',//卸点历史产量
          title:'statement.dump-history-output',
          headerNum:2,
          firstNum:2
        },
        {
          id:'414',
          condition:'eachteam',
          reportName:'dump_shift_output',//卸点各班产量
          title:'statement.dump-class-output',
          headerNum:2,
          firstNum:2
        },
          //设备故障统计
        {
          id:'501',
          type:'fault',
          condition:'starttime,endtime',
          reportName:'truck_fault_output',//卡车故障报表
          title:'statement.truck-fault-output',
          tableNum:2
        },
        {
          id:'502',
          type:'fault',
          condition:'truck,starttime,endtime',
          reportName:'truck_fault_output_single',//卡车故障统计（单车）
          title:'statement.truck-fault-output-single',
          tableNum:2
        },
        {
          id:'503',
          type:'fault',
          condition:'starttime,endtime,treason',
          reportName:'truck_fault_type_detail',//卡车按故障类别查询故障明细
          title:'statement.truck-fault-type-detail',
          tableNum:2
        },
        {
          id:'504',
          type:'fault',
          condition:'starttime,endtime,sreason',
          reportName:'shovel_fault_type_detail',//采装设备按故障类别查询故障明细
          title:'statement.digger-fault-type-detail',
          tableNum:2
        },
        // {
        //   id:'505',
        //   type:'fault',
        //   condition:'starttime,endtime',
        //   reportName:'east_shovel_fault_output',//东矿采装设备故障报表
        //   title:'statement.east-digger-fault-output',
        //   tableNum:2
        // },
        // {
        //   id:'506',
        //   type:'fault',
        //   condition:'starttime,endtime',
        //   reportName:'main_shovel_fault_output',//主矿采装设备故障报表
        //   title:'statement.main-digger-fault-output',
        //   tableNum:2
        // },
        {
          id:'507',
          type:'fault',
          condition:'shovel,starttime,endtime',
          reportName:'east_shovel_fault_output_single',//东矿采装设备故障统计（单铲）
          title:'statement.east-digger-fault-output-single',
          tableNum:2
        },
        {
          id:'508',
          type:'fault',
          condition:'shovel,starttime,endtime',
          reportName:'main_shovel_fault_output_single',//主矿采装设备故障统计（单铲）
          title:'statement.main-digger-fault-output-single',
          tableNum:2
        },
        {
          id:'509',
          type:'fault',
          condition:'starttime,endtime',
          reportName:'vibrate_fault_list',//振动放矿故障列表
          title:'statement.vibrate-fault-list',
          tableNum:2
        },
        {
          id:'510',
          type:'fault',
          condition:'starttime,endtime',
          reportName:'crusher_fault_list',//破碎站故障列表
          title:'statement.crusher-fault-list',
          tableNum:2
        },
        {
          id:'511',
          type:'fault',
          condition:'starttime,endtime,dreason',
          reportName:'dump_fault_type_detail',//卸点按故障类别查询故障明细
          title:'statement.dump-fault-type-detail',
          tableNum:2
        },
        {
          id:'512',
          type:'fault',
          condition:'starttime,endtime',
          reportName:'shovel_fault_output',//采装设备故障报表
          title:'statement.digger-fault-output',
          tableNum:2
        },
        {
          id:'513',
          type:'fault',
          condition:'shovel,starttime,endtime',
          reportName:'shovel_fault_output_single',//主矿采装设备故障统计（单铲）
          title:'statement.digger-fault-output-single',
          tableNum:2
        },
          //设备延时统计
        {
          id:'601',
          type:'fault',
          condition:'starttime,endtime',
          reportName:'east_shovel_delay_report',//东矿采装设备延时报表
          title:'statement.east-digger-delay-report',
          tableNum:2
        },
        {
          id:'602',
          type:'fault',
          condition:'starttime,endtime',
          reportName:'main_shovel_delay_report',//主矿采装设备延时报表
          title:'statement.main-digger-delay-report',
          tableNum:2
        },
        {
          id:'603',
          type:'fault',
          condition:'starttime,endtime',
          reportName:'truck_delay_report',//卡车延时报表
          title:'statement.truck-delay-report',
          tableNum:2
        },
        {
          id:'604',
          type:'fault',
          condition:'shovel,starttime,endtime',
          reportName:'shovel_delay_report_single',//东矿采装设备延时报表（单铲）
          title:'statement.digger-delay-report-single',
          tableNum:2
        },
        // {
        //   id:'604',
        //   type:'fault',
        //   condition:'shovel,starttime,endtime',
        //   reportName:'east_shovel_delay_report_single',//东矿采装设备延时报表（单铲）
        //   title:'statement.east-digger-delay-report-single',
        //   tableNum:2
        // },
        // {
        //   id:'605',
        //   type:'fault',
        //   condition:'shovel,starttime,endtime',
        //   reportName:'main_shovel_delay_report_single',//主矿采装设备延时报表（单铲）
        //   title:'statement.main-digger-delay-report-single',
        //   tableNum:2
        // },
        {
          id:'606',
          type:'fault',
          condition:'truck,starttime,endtime',
          reportName:'truck_delay_report_single',//卡车延时报表（单车）
          title:'statement.truck-delay-report-single',
          tableNum:2
        },
        {
          id:'607',
          type:'fault',
          condition:'starttime,endtime',
          reportName:'vibrate_delay_report',//卸点延时报表
          title:'statement.dump-delay-report',
          tableNum:2
        },
        
        {
          id:'608',
          type:'fault',
          condition:'starttime,endtime',
          reportName:'shovel_delay_report',//采装设备延时报表
          title:'statement.digger-delay-report',
          tableNum:2
        },
        {
          id:'609',
          type:'fault',
          condition:'shovel,starttime,endtime',
          reportName:'shovel_delay_report_single',//采装设备延时报表（单铲）
          title:'statement.digger-delay-report-single',
          tableNum:2
        },

          //设备状态查询
        {
          id:'701',
          type:'fault',
          condition:'date',
          reportName:'truck_operation',//卡车运营
          title:'statement.truck-operation'
        },
        {
          id:'702',
          type:'fault',
          condition:'date',
          reportName:'shovel_operation',//采装设备运营
          title:'statement.digger-operation'
        },
        {
          id:'703',
          type:'fault',
          condition:'truck,shift,date,status',
          reportName:'truck_status_detail',//卡车设备状态明细
          title:'statement.truck-status-detail',
        },
        {
          id:'704',
          type:'fault',
          condition:'shovel,shift,date,status',
          reportName:'shovel_status_detail',//采装设备状态明细
          title:'statement.digger-status-detail'
        },
        {
          id:'705',
          type:'fault',
          condition:'starttime,endtime',
          reportName:'truck_month_fault_report',//卡车月故障分类统计
          title:'statement.truck-month-fault-report'
        },
        {
          id:'706',
          type:'fault',
          condition:'starttime,endtime',
          reportName:'',//卡车作业台时
          title:'statement.truck-work-hour'
        },
          //产量统计
        // {
        //   id:'801',
        //   condition:'starttime,endtime',
        //   reportName:'east_shift_output',//东矿各班组生产量
        //   title:'statement.east-shift-output',
        //   headerNum:2
        // },
        // {
        //   id:'802',
        //   condition:'starttime,endtime',
        //   reportName:'main_shift_output',//主矿各班组生产量
        //   title:'statement.main-shift-output',
        //   headerNum:2
        // },
        {
          id:'803',
          condition:'starttime,endtime',
          reportName:'month_transport_register',//月汽车运输量次登记表
          title:'statement.month-transport-register'
        },
        {
          id:'804',
          condition:'shift,month',
          reportName:'group_month_shovel',//各班组月采装设备车次明细
          title:'statement.group-month-digger'
        },
        {
          id:'805',
          condition:'subarea,starttime,endtime',
          reportName:'workshop_group_device_num',//车间各班各机台车数
          title:'statement.workshop-group-device-num',
          headerNum:2,
          lastNum:1
        },
        {
          id:'806',
          condition:'subarea,shift,month',
          reportName:'group_month_truck',//各班组月汽车车次明细
          title:'statement.group-month-truck',
          headerNum:2,
          lastNum:1
        },
        {
          id:'807',
          condition:'starttime,endtime',
          reportName:'shovel_load_report',//采装设备装载量统计报表
          title:'statement.digger-load-report',
          headerNum:2,
          colNum:3,
          firstNum:3
        },
        {
          id:'808',
          condition:'subarea,dump,month',
          reportName:'dump_output_report',//卸点生产量统计
          title:'statement.dump-output-report',
          firstNum:3
        },
        {
          id:'809',
          condition:'starttime,endtime',
          reportName:'output_km_report',//生产公里统计
          title:'statement.output-km-report',
          firstNum:2
        },
        // {
        //   id:'810',
        //   condition:'date',
        //   reportName:'shovel_rock_day',//车型采装设备矿岩量日报
        //   title:'statement.digger-rock-day',
        //   headerNum:2,
        //   firstNum:2,
        //   colNum:3
        // },
        // {
        //   id:'811',
        //   condition:'month',
        //   reportName:'shovel_rock_month',//车型采装设备矿岩量月报
        //   title:'statement.digger-rock-month',
        //   headerNum:2,
        //   firstNum:2,
        //   colNum:3
        // },
        // {
        //   id:'812',
        //   condition:'year',
        //   reportName:'shovel_rock_year',//车型采装设备矿岩量年报
        //   title:'statement.digger-rock-year',
        //   headerNum:2,
        //   firstNum:2,
        //   colNum:3
        // },
        // {
        //   id:'813',
        //   condition:'starttime,endtime',
        //   reportName:'shovel_rock_date',//车型采装设备矿岩量日日期段
        //   title:'statement.digger-rock-date',
        //   headerNum:2,
        //   firstNum:2,
        //   colNum:3
        // },
        {
          id:'814',
          condition:'shift,date',
          reportName:'shovel_output_statistics',//采装设备产量统计
          title:'statement.digger-output-report',
          firstNum:2
        },
        {
          id:'815',
          condition:'subarea,shift,date',
          reportName:'transportation_output',//运输产量表
          title:'statement.transport-output'
        },
        {
          id:'816',
          condition:'starttime,endtime',
          reportName:'',//采装设备报警时间段
          title:'statement.digger-alarm-date'
        },
        {
          id:'817',
          condition:'starttime,endtime',
          reportName:'transport_workshop_distance',//汽运车间运距
          title:'statement.transport-workshop-distance',
          firstNum:2
        },
        {
          id:'818',
          condition:'month,subarea',
          reportName:'workshop_truck_step_output',//车间卡车台阶产量报表
          title:'statement.workshop-truck-step-output',
          firstNum:2
        },
        {
          id:'819',
          condition:'eachteam',
          reportName:'shovel_rock',//车型采装设备矿岩量报表
          title:'statement.digger-rock-report',
          headerNum:2,
          firstNum:2,
          colNum:3
        },
        {
          id:'820',
          condition:'subarea,starttime,endtime',
          reportName:'shift_output',//各班组生产量报表
          title:'statement.shift-output',
          headerNum:2
        },
        // 自动运输产量
        {
          id:'901',
          condition:'material,timeType',
          reportName:'truck_history_output',//卡车自动运输产量
          title:'statement.truck-auto-transport-output',
          headerNum:2,
          firstNum:2
        },
        {
          id:'902',
          condition:'material,timeType',
          reportName:'shovel_history_output',//采装设备自动运输产量
          title:'statement.shovel-auto-transport-output',
          headerNum:2,
          firstNum:2
        },
        {
          id:'903',
          condition:'material,timeType',
          reportName:'dump_history_output',//卸点自动运输产量
          title:'statement.dump-auto-transport-output',
          headerNum:2,
          firstNum:2
        },
      ]
    }
  },
  mounted() {
    this.currentData.id=this.$route.params.id;
    if(this.currentData.id){
      this.getInit();
    }
  },
  watch:{
      '$route'(to,from){
        this.currentData.id=to.params.id;
        if(this.currentData.id){
          this.getInit();
        }
      }
  },
  methods: {
    clearData(){
      this.conditionData={
        date:'',
        starttime:'',
        endtime:'',
        year:'',
        month:'',
        subarea:'',
        truck:'',
        shovel:'',
        dump:'',
        shift:'',
        treason:'',
        sreason:'',
        dreason:'',
        status:'',
        material:[],
        dmode:'',
      };
    },
    clearTime(){
      this.conditionData.date = '';
      this.conditionData.starttime = '';
      this.conditionData.endtime = '';
      this.conditionData.year = '';
      this.conditionData.month = '';
      this.conditionData.shift = '';
    },
    getParams(){
      let query_type=this.currentData.reportType;
      //sql语句参数
      let query_starttime='';
      let query_endtime='';
      let query_truck='';
      let query_shovel='';
      let query_dump='';
      let query_date='';
      if(query_type==this.vars.reportType[1].type){
        //故障延时
        query_date=this.conditionData.date ? ` and start_time_query='${this.dateFormat(this.conditionData.date)}'&datestr=${this.dateFormat(this.conditionData.date,1)}` : '';
        query_starttime=this.conditionData.starttime ? ` and finish_time_query>='${this.dateFormat(this.conditionData.starttime)}'` : '';
        query_endtime=this.conditionData.endtime ? ` and start_time_query<='${this.dateFormat(this.conditionData.endtime)}'` : '';
        query_truck=this.conditionData.truck ? ` and equipment_sn=${this.conditionData.truck}` : '';
        query_shovel=this.conditionData.shovel ? ` and equipment_sn=${this.conditionData.shovel}` : '';
        query_dump=this.conditionData.dump ? ` and equipment_sn=${this.conditionData.dump}` : '';
      } else{
        //产量
        query_date=this.conditionData.date ? ` and dispatch_shift_begin_date='${this.dateFormat(this.conditionData.date)}'&datestr=${this.dateFormat(this.conditionData.date,1)}` : '';
        query_starttime=this.conditionData.starttime ? ` and dispatch_shift_begin_date>='${this.dateFormat(this.conditionData.starttime)}'` : '';
        query_endtime=this.conditionData.endtime ? ` and dispatch_shift_begin_date<='${this.dateFormat(this.conditionData.endtime)}'` : '';
        query_truck=this.conditionData.truck ? ` and truck_sn=${this.conditionData.truck}` : '';
        query_shovel=this.conditionData.shovel ? ` and shovel_sn=${this.conditionData.shovel}` : '';
        query_dump=this.conditionData.dump ? ` and dump_sn=${this.conditionData.dump}` : '';
      }   
      let query_year=this.conditionData.year ? ` and dispatch_shift_begin_year='${this.yearFormat(this.conditionData.year)}'&yearstr=${this.yearFormat(this.conditionData.year)}` : '';
      let query_month=this.conditionData.month ? ` and dispatch_shift_begin_month='${this.monthFormat(this.conditionData.month)}'&monthstr=${this.monthFormat(this.conditionData.month,1)}` : '';
      let query_subarea=this.conditionData.subarea ? ` and subarea_sn=${this.conditionData.subarea}` : '';  
      let query_shift=this.conditionData.shift ? ` and dispatch_shift_crew_sn=${this.conditionData.shift}` : '';
      let query_treason=this.conditionData.treason ? ` and reason_sn=${this.conditionData.treason}` : '';
      let query_sreason=this.conditionData.sreason ? ` and reason_sn=${this.conditionData.sreason}` : '';
      let query_status=this.conditionData.status ? ` and equipment_status_sn=${this.conditionData.status}` : '';
      
      let query_material = this.conditionData.material.length>0?` and (material_sn=${this.conditionData.material.join(' OR material_sn=')})`:'';
      let query_dmode= !this.utils.isNotNum(this.conditionData.dmode) ? ` and task_drv_mode=${this.conditionData.dmode}` : '';
      //其它显示参数
      let query_other='';
      query_other+=this.conditionData.starttime ? `&starttimestr=${this.dateFormat(this.conditionData.starttime,1)}` : '';
      query_other+=this.conditionData.endtime ? `&endtimestr=${this.dateFormat(this.conditionData.endtime,1)}` : '';
      query_other+=this.conditionData.subarea ? `&subarea=${this.conditionData.subarea}` : '';  
      query_other+=this.conditionData.shift ? `&shift=${this.conditionData.shift}` : '';
      query_other+=this.conditionData.truck ? `&truck=${this.conditionData.truck}` : '';
      query_other+=this.conditionData.shovel ? `&shovel=${this.conditionData.shovel}` : '';
      query_other+=this.conditionData.dump ? `&dump=${this.conditionData.dump}` : '';
      query_other+=this.conditionData.status ? `&status=${this.conditionData.status}` : '';
      //最终查询参数
      let query= `param=${query_subarea}${query_truck}${query_shovel}${query_dump}${query_material}${query_dmode}${query_shift}${query_treason}${query_sreason}${query_status}${query_date}${query_starttime}${query_endtime}${query_year}${query_month}${query_other}`;
      return query;
    },
    async getInit(){
        try{
            //初始化数据
            this.clearData();
            let data = this.reportData.find(item=>item.id==this.currentData.id);
            if(data){
              this.currentData.reportName=data.reportName;
              
              document.title=this.$t(data.title);
              this.currentData.reportCondition=data.condition;
              this.currentData.reportType=data.type;
              this.currentData.reportTitle=this.$t(data.title);
              this.currentData.tableNum=data.tableNum || 1;
              this.currentData.headerNum=data.headerNum || 1;
              this.currentData.firstNum=data.firstNum || 1;
              this.currentData.lastNum=data.lastNum || 0;
              this.currentData.colNum=data.colNum || 2;

              if(data.condition.includes(this.conditionAll[14])){
                this.conditionList.timeTypeList=[
                  {
                    value:'date',
                    name:"日",
                  },
                  {
                    value:'month',
                    name:"月",
                  },
                  {
                    value:'year',
                    name:"年",
                  },
                  {
                    value:'starttime,endtime',
                    name:"时间段",
                  },
                  {
                    value:'date,shift',
                    name:"班次",
                  },
                ]
                this.currentData.timeTypeValue='date';
                this.currentData.timeType='date';
              }else if(data.condition.includes(this.conditionAll[15])){
                this.conditionList.timeTypeList=[
                  {
                    value:'date',
                    name:"日",
                  },
                  {
                    value:'month',
                    name:"月",
                  },
                  {
                    value:'year',
                    name:"年",
                  },
                  {
                    value:'starttime,endtime',
                    name:"时间段",
                  },
                ]
                this.currentData.timeTypeValue='date';
                this.currentData.timeType='date';
              }else{
                this.currentData.timeTypeValue='';
                this.currentData.timeType='';
              }

            }
            
            //日期
            let time=new Date();
            if(this.currentData.reportCondition.includes(this.conditionAll[5])||this.currentData.timeTypeValue.includes(this.conditionAll[5])){
              this.conditionData.date=this.utils.formatDate(time.getTime(),'date');
            }
            //开始日期
            if(this.currentData.reportCondition.includes(this.conditionAll[6])){
              this.conditionData.starttime=this.utils.formatDate(time.getTime(),'date');
              console.log(this.conditionData.starttime);
            }
            //结束日期
            if(this.currentData.reportCondition.includes(this.conditionAll[7])){
              this.conditionData.endtime=this.utils.formatDate(time.getTime(),'date');
            }
            // 开始时间结束不可选设置
            this.setPickerOptions('startTime');
            this.setPickerOptions('endTime');
            //年份
            if(this.currentData.reportCondition.includes(this.conditionAll[8])){
              this.conditionData.year=time.getTime();
            }
            //月份
            if(this.currentData.reportCondition.includes(this.conditionAll[9])){
              this.conditionData.month=time.getFullYear()+"-"+this.utils.isNumGtTen(time.getMonth()+1);
            }

            if(this.currentData.reportCondition.includes(this.conditionAll[17])){
              //运输模式
              this.conditionList.dmodeList=this.vars.dmodeList;
            }
            //分区
            if(this.currentData.reportCondition.includes(this.conditionAll[0])){
              var arg = {
                pageSize:this.vars.pageData.pageSize,
                sortName:"subareaName",
                sort:"ASC"
              }
              let result = await subareaServer.subareaList(arg);
              this.conditionList.subareaList = result.content || [];
              // this.conditionData.subarea=this.conditionList.subareaList ? this.conditionList.subareaList[0].subareaSn:'';
            }
            if(this.currentData.reportCondition.includes(this.conditionAll[16])){
              //物料
              var result=await materialServer.getMaterialCategoryList();
              this.conditionList.materialList=result || [];
            }

            //班次
            if(this.currentData.reportCondition.includes(this.conditionAll[4])||this.currentData.timeTypeValue.includes(this.conditionAll[4])){
              let result = await shiftServer.getShiftCrew(this.vars.shiftType[0].type);
              this.conditionList.shiftList=result || [];
              // this.conditionData.shift=this.conditionList.shiftList ? this.conditionList.shiftList[0].sn:'';console.log(this.currentData.reportCondition);
            }
            
            //设备
            let dataDevice=JSON.parse(JSON.stringify(this.vars.pageData));
            dataDevice.sort="ASC";
            dataDevice.sortName="equipmentName";
            if(this.currentData.reportCondition.includes(this.conditionAll[1])){
              //卡车
              dataDevice.equipmentTypeSn=this.vars.deviceType[0].id;
              let result = await devicesServer.devicesList(dataDevice);
              this.conditionList.truckList=result.content || [];
              // this.conditionData.truck=this.conditionList.truckList ? this.conditionList.truckList[0].equipmentSn:'';
            } 
            if(this.currentData.reportCondition.includes(this.conditionAll[2])){
              //采装设备
              dataDevice.equipmentTypeSn=this.vars.deviceType[1].id;
              let result = await devicesServer.devicesList(dataDevice);
              this.conditionList.shovelList=result.content || [];
              // this.conditionData.shovel=this.conditionList.shovelList ? this.conditionList.shovelList[0].equipmentSn:'';
            }
            if(this.currentData.reportCondition.includes(this.conditionAll[3])){
              //卸点
              dataDevice.equipmentTypeSn=this.vars.deviceType[2].id;
              let result = await devicesServer.devicesList(dataDevice);
              this.conditionList.dumpList=result.content || [];
              // this.conditionData.dump=this.conditionList.dumpList ? this.conditionList.dumpList[0].equipmentSn:'';
            }

            //卡车故障原因类型
            if(this.currentData.reportCondition.includes(this.conditionAll[10])){
              var info=JSON.parse(JSON.stringify(this.vars.pageData));
              info.equipmentTypeSn=this.vars.deviceType[0].id;
              info.equipmentOpStatus=this.vars.equipmentOpStatus[0].id;
              info.systemPredefine=false;
              var result = await statusReason.getStatusReason(info);
              this.conditionList.treasonList=result.content || [];
              // this.conditionData.treason=this.conditionList.treasonList ? this.conditionList.treasonList[0].reasonSn:'';
            }
            //采装设备故障原因类型
            if(this.currentData.reportCondition.includes(this.conditionAll[11])){
              var info=JSON.parse(JSON.stringify(this.vars.pageData));
              info.equipmentTypeSn=this.vars.deviceType[1].id;
              info.equipmentOpStatus=this.vars.equipmentOpStatus[0].id;
              info.systemPredefine=false;
              var result = await statusReason.getStatusReason(info);
              this.conditionList.sreasonList=result.content || [];
              // this.conditionData.sreason=this.conditionList.sreasonList ? this.conditionList.sreasonList[0].reasonSn:'';
            }
            //卸点故障原因类型
            if(this.currentData.reportCondition.includes(this.conditionAll[12])){
              var info=JSON.parse(JSON.stringify(this.vars.pageData));
              info.equipmentTypeSn=this.vars.deviceType[2].id;
              info.equipmentOpStatus=this.vars.equipmentOpStatus[0].id;
              info.systemPredefine=false;
              var result = await statusReason.getStatusReason(info);
              this.conditionList.dreasonList=result.content || [];
              // this.conditionData.dreason=this.conditionList.dreasonList ? this.conditionList.dreasonList[0].reasonSn:'';
            }

            //设备状态
            if(this.currentData.reportCondition.includes(this.conditionAll[13])){
              this.conditionList.statusList=this.vars.runStatus;
            }

            //加载报表
            this.getReport();
        }catch(e){
            this.messages.error(e.message)
        }
    },
    async changeTimeType(v){
      this.clearTime();
      var string = v;

      this.currentData.timeTypeValue = string;
      //日期
      let time=new Date();
      if(this.currentData.timeTypeValue.includes(this.conditionAll[5])){
        this.conditionData.date=this.utils.formatDate(time.getTime(),'date');
      }
      //开始日期
      if(this.currentData.timeTypeValue.includes(this.conditionAll[6])){
        this.conditionData.starttime=this.utils.formatDate(time.getTime(),'date');
      }
      //结束日期
      if(this.currentData.timeTypeValue.includes(this.conditionAll[7])){
        this.conditionData.endtime=this.utils.formatDate(time.getTime(),'date');
      }
      //年份
      if(this.currentData.timeTypeValue.includes(this.conditionAll[8])){
        this.conditionData.year=time.getTime();
      }
      //月份
      if(this.currentData.timeTypeValue.includes(this.conditionAll[9])){
        this.conditionData.month=time.getFullYear()+"-"+this.utils.isNumGtTen(time.getMonth()+1);
      }
      //班次
      if(this.currentData.timeTypeValue.includes(this.conditionAll[4])){
        let result = await shiftServer.getShiftCrew(this.vars.shiftType[0].type);
        this.conditionList.shiftList=result || [];
      }
      
      this.getReport();
      
    },
    async getReport(type){
      // 加载报表
      try{
        //查询条件
        if(this.conditionData.subarea){
          this.conditionData.subareaName=this.conditionList.subareaList.find(item=>item.subareaSn==this.conditionData.subarea).subareaName;
        }
        if(this.conditionData.truck){
          this.conditionData.truckName=this.conditionList.truckList.find(item=>item.equipmentSn==this.conditionData.truck).equipmentName;
        }
        if(this.conditionData.shovel){
          this.conditionData.shovelName=this.conditionList.shovelList.find(item=>item.equipmentSn==this.conditionData.shovel).equipmentName;
        }
        if(this.conditionData.dump){
          this.conditionData.dumpName=this.conditionList.dumpList.find(item=>item.equipmentSn==this.conditionData.dump).equipmentName;
        }
        if(this.conditionData.shift){
          this.conditionData.shiftName=this.conditionList.shiftList.find(item=>item.sn==this.conditionData.shift).name;
        }
        if(this.conditionData.treason){
          this.conditionData.treasonName=this.conditionList.treasonList.find(item=>item.reasonSn==this.conditionData.treason).reasonName;
        }
        if(this.conditionData.sreason){
          this.conditionData.sreasonName=this.conditionList.sreasonList.find(item=>item.reasonSn==this.conditionData.sreason).reasonName;
        }
        if(this.conditionData.dreason){
          this.conditionData.dreasonName=this.conditionList.dreasonList.find(item=>item.reasonSn==this.conditionData.dreason).reasonName;
        }
        if(this.conditionData.status){
          this.conditionData.statusName=this.conditionList.statusList.find(item=>item.code==this.conditionData.status).name;
        }

        this.setPickerOptions(type);
        //报表文件url
        let html = await statementServer.getHtml(this.currentData.reportName+'.html',this.getParams());
        this.currentData.html=html;
        
      }catch(e){
        this.messages.error(e.message)
      }
    },
    setPickerOptions(type){
      // 开始时间和结束时间不可选设置
      var _this = this;

      if(type=='startTime'){
        if(this.conditionData.starttime){
          _this.pickerEndOptions={
            disabledDate(time) {
              return time.getTime() > Date.now() || time.getTime() < new Date(new Date(_this.conditionData.starttime).toLocaleDateString());
            }
          }
        }else{
          _this.pickerEndOptions={
            disabledDate(time) {
              return time.getTime() > Date.now();
            }
          }
        }
      }

      if(type=='endTime'){
        if(this.conditionData.endtime){
          _this.pickerStartOptions={
            disabledDate(time) {
              return time.getTime() > Date.now() || time.getTime() > new Date(new Date(_this.conditionData.endtime).toLocaleDateString());
            }
          }
        }else{
          _this.pickerStartOptions={
            disabledDate(time) {
              return time.getTime() > Date.now();
            }
          }
        }
      }

      if(this.currentData.timeType=='starttime,endtime'){
        if(this.conditionData.starttime){
          _this.pickerEndOptions={
            disabledDate(time) {
              return !_this.hasDataTime.listDay.includes(_this.utils.formatDate(time,'date')) || time.getTime() < new Date(new Date(_this.conditionData.starttime).toLocaleDateString());
            }
          }
        }else{
          _this.pickerEndOptions={
            disabledDate(time) {
              return !_this.hasDataTime.listDay.includes(_this.utils.formatDate(time,'date'));
            }
          }
        }
        if(this.conditionData.endtime){
          _this.pickerStartOptions={
            disabledDate(time) {
              return !_this.hasDataTime.listDay.includes(_this.utils.formatDate(time,'date')) || time.getTime() > new Date(new Date(_this.conditionData.endtime).toLocaleDateString());
            }
          }
        }else{
          _this.pickerStartOptions={
            disabledDate(time) {
              return !_this.hasDataTime.listDay.includes(_this.utils.formatDate(time,'date'));
            }
          }
        }
      }
    },
    exportReport(){
      // 导出报表
      let url=statementServer.getList(this.currentData.reportName+'.xlsx',this.getParams());
      window.location.href=url;
    },
    resetDate(){
      this.clearData();
      this.getReport();
    },
    strFormat(str){
      return str.replace(/-/g,'');
    },
    dateFormat(time,str){
      if(str){
        return this.utils.formatDate(new Date(time).getTime(),'date');
      } else {
        return this.strFormat(this.utils.formatDate(new Date(time).getTime(),'date'));
      }
    },
    yearFormat(time){
      return new Date(time).getFullYear()+'';
    },
    monthFormat(time,str){
      if(str){
        return new Date(time).getFullYear()+'-'+this.utils.isNumGtTen(new Date(time).getMonth()+1);
      } else {
        return new Date(time).getFullYear()+''+this.utils.isNumGtTen(new Date(time).getMonth()+1);
      }
    },
    getRows(data){
      this.setRows = [];
      if(data==null){
        return;
      }
      for(var i=0;i<data.length;i++){
        if(i==0){
          this.setRows.push(1);
          this.pos = 0;
          this.setRows2.push(1);
          this.pos2 = 0;
        }else{
          if(data[i].col0==data[i-1].col0){
            this.setRows[this.pos]+=1;
            this.setRows.push(0);
          }else{
            this.setRows.push(1);
            this.pos = i;
          }
          if(data[i].col1==data[i-1].col1){
            this.setRows2[this.pos2]+=1;
            this.setRows2.push(0);
          }else{
            this.setRows2.push(1);
            this.pos2 = i;
          }
        }
      }
    },
    async getDay(reportName){
      try{
        var _this = this;
        var result = await statementServer.getJsonReport(reportName);
        
        var listDay = [];
        var listMonth = [];
        var listYear = [];
        result.forEach(element => {
          if(element.day!='null'){
            listDay.push(_this.utils.formatDate(new Date(element.day),'date'))
            listMonth.push(_this.utils.formatDate(new Date(element.day),'month'))
            listYear.push(_this.utils.formatDate(new Date(element.day),'year'))
          }
        });
        this.hasDataTime.listDay = listDay;
        
        this.pickerDayOptions={
          disabledDate(time) {
            return !listDay.includes(_this.utils.formatDate(time,'date'));
          }
        }
        
        this.pickerMonthOptions={
          disabledDate(time) {
            return !listMonth.includes(_this.utils.formatDate(time,'month'));
          }
        }
        this.pickerYearOptions={
          disabledDate(time) {
            return !listYear.includes(_this.utils.formatDate(time,'year'));
          }
        }
        this.pickerStartOptions={
          disabledDate(time) {
            return !listYear.includes(_this.utils.formatDate(time,'date'));
          }
        }
        this.pickerEndOptions={
          disabledDate(time) {
            return !listYear.includes(_this.utils.formatDate(time,'date'));
          }
        }

      }catch(e){
        console.error(e.message)
      }
    },
  }
};