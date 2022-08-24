<template>
    <!-- 远程接管历史日志 -->
  <base-right-detail v-if="isDialogShow" :topHeight="false">
    <div slot="header">
      <div class="right_header">
        <h3 class="right_header_title" style="flex: 1">日志详情</h3>
      </div>
    </div>
    <div slot="close"><span class="right_details_close" @click="resourceShow"><i class="iconfont icon-guanbi"></i></span></div>
    <div class="log-postion-w">
      <div class="right_details_header"></div>
      <div class="search_condition_top">
        <div class="search_condition_top_l">
          <!-- 模块类型 -->
          <div class="search_condition_name">
            <span>{{ $t("vehicleLog.log-type") }}</span>
            <el-select 
              key="3" 
              clearable
              class="search-type"
              multiple 
              collapse-tags
              v-model="search.protocolType">
              <el-option
                v-for="(item,index) in protocolList"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="search_condition_submit">
            <el-button type="primary" class="btnBg" @click="getDetails(detailsLog)">
              <i class="iconfont icon-sousuo"></i>
              {{$t("action.search")}}
            </el-button>
            <el-button type="primary" class="btnGray" @click="resetType">
              <i class="iconfont icon-zhongzhi themeOrangeColor"></i>
              {{$t("action.reset")}}
            </el-button>
          </div>
        </div>
        <div class="search_condition_top_r"></div>
      </div>
      <el-table
        class="no_border"
        :data="tableData"
        :max-height="tableHeight"
        ref="listTable"
        style="width: 100%">
          <!-- 序号 -->
          <el-table-column
              width="80"
              :label='$t("common.key")'>
              <template scope="scope">
              {{scope.$index+1}}
              </template>
          </el-table-column>
          <!-- 上数时间 -->
          <el-table-column
            property="timeStamps"
            width="180"
            show-overflow-tooltip
            label="上数时间">
            <template scope="scope">
              {{scope.row.timeStamps | formatDate}}
            </template>
          </el-table-column>
          <!-- 终端报文 -->
          <el-table-column
            width="340"
            label="终端报文">
            <template scope="scope">
              <el-popover
                placement="bottom"
                trigger="hover"
                width="400"
                :content="scope.row.content">
                <p class="blue plain-content line_dot" slot="reference">{{scope.row.content}}</p>
              </el-popover>
            </template>
          </el-table-column>
          <!-- 协议类型 -->
          <el-table-column
            width="100"
            show-overflow-tooltip
            label="协议类型">
            <template scope="scope">
              {{scope.row.id}}
              <!-- {{utils.getObjValByKey(protocolList,scope.row.protocolType,'value','label')}} -->
            </template>
          </el-table-column>
          <!-- 协议解析 -->
          <el-table-column
            label="协议解析">
            <template scope="scope">
              <el-popover
                placement="bottom"
                width="400"
                trigger="hover"
                :content="scope.row.plaintext">
                <p class="blue plain-text" slot="reference">解析内容</p>
              </el-popover>
            </template>
          </el-table-column>
      </el-table>
      <div class="pagination_location">
          <base-pagination :total="pageInit.total" :singleDisplay="pageInit.pageSize" :currentPage="pageInit.pageIndex" @pagechange="pagechange" @sizeChange="sizeChange"></base-pagination>
      </div>
    </div>
  </base-right-detail>
</template>

<script>
import tableMixins from "@/common/mixins/table.mixins";
import ctsServer from "../../api/cts.server"
export default {
  mixins:[tableMixins],
  data(){
    return {
      isDialogShow:false,
      isTopHeight:true,
      // 协议列表
      protocolList: [
        {value: 3, name: 'Rcd_ControlData', label: '控制命令'},
        {value: 4, name: 'Rcd_Status', label: '状态'},
        // {value: 7, name: 'Vehicle_ReportCan', label: 'CAN数据'},
        // {value: 11, name: 'Platform_DeviceLogin', label: '驾驶舱登录'},
        // {value: 13, name: 'Platform_DriverLogin', label: '司机登录'},
        // {value: 15, name: 'Platform_DriverLogout', label: '司机登出'},
        {value: 19, name: 'Platform_CabinTakeoverTaskReply', label: '接管任务应答'},
        {value: 21, name: 'Platform_TakeoverTaskEnd', label: '接管任务结束'},
        {value: 23, name: 'Platform_TakeoverTaskFail', label: '接管任务失败'},
        {value: 24, name: 'Platform_TakeoverTaskGiveUp', label: '放弃接管任务'},
      ],
      
      detailsLog:{},
      tableData: [],
      pageInit:{},
      search:{
        protocolType: []
      }
    }
  },
  computed:{
    protocols() {
      return this.protocolList.map(item => item.value)
    }
  },
  created () {
    this.pageInit=JSON.parse(JSON.stringify(this.vars.pageInit));
  },
  mounted() {
    // this.getDetails()
  },
  methods:{
    resourceShow () {
      this.isDialogShow=false;
      this.search.protocolType=[];
      this.pageInit=JSON.parse(JSON.stringify(this.vars.pageInit));
      this.detailsLog={};
      this.tableData= [];
    },
    resetType(){
      this.search.protocolType=[];
      this.pageInit.pageIndex=1;
      this.getLogList();
    },
    async getDetails(info){
      this.isDialogShow=true;
      this.detailsLog = info;
      var protocolType = this.search.protocolType;

      var startTime = (new Date(info.applyTime)).getTime();
      if(startTime)startTime=startTime-5000;
      
      let data = {
        date: this.utils.formatDate(info.startTime,'date'),
        start: startTime,
        end: (new Date(info.endTime)).getTime(),
        page: this.pageInit.pageIndex-1,
        size: this.pageInit.pageSize,
        protocolType:protocolType
      }
      try{
        
          var result = await ctsServer.queryDetails(data);
          this.tableData = result.content;
          this.pageInit.total=result.totalElements;
          
      }catch(e){
        this.messages.error(e.message)
      }
    },
    searchLog(){
      this.pageInit.pageIndex=1;
      var info = this.detailsLog;
      this.getDetails(info)
    },
    getLogList(){
      var info = this.detailsLog;
      this.getDetails(info)
    },
    pagechange(val){
      this.pageInit.pageIndex=val;
      this.getLogList();
    },
    sizeChange(val){
      this.pageInit.pageSize = val;
      this.getLogList();
    },
  }
}
</script>
<style lang="scss" scoped>
p.plain-text{
  cursor: pointer !important;
}
</style>

<style lang="scss">
.log-postion-w{
  height: 100%;
}
.search-type{
  width: 200px;
}
</style>
