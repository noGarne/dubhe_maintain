<template>
	<!-- 决策监控 -->
	<div class="table_content">
		<div class="content_center content_tabs">
			<div class="reportTitle">
				<a>{{$t('route.policyMonitor')}}</a>
				<p><i class="iconfont icon-gaojingxinxi red"></i>注：最长支持0.5h时长的数据查询！</p>
			</div>
			<div class="btn_search">
				<!-- 类型 -->
				<el-select  filterable  v-model="search.type"
					:placeholder="$t('action.select')+$t('device.type')"   @change="typeChangeEve">
					<el-option v-for="(item,index) in typeList" :key="index" :label="item.name"
						:value="item.value">
					</el-option>
				</el-select>
				
				<!-- 卡车 -->
				<el-select  clearable filterable  v-model="search.car" 
				:placeholder="$t('action.select')+$t('action.truck')">
					<el-option v-for="(item,index) in equipmentList" :key="index" :label="item.deviceName"
						:value="item.uniqueId">
					</el-option>
					
				</el-select>
				<!-- 行程逻辑 -->
				<!-- 时间 -->
				<el-date-picker v-model="search.time":placeholder="$t('devicesLog.selectTime')" 
				value-format="yyyy-MM-dd" @change="tripEve" :picker-options="option"
				prefix-icon="el-icon-date"
					:range-separator="$t('devicesLog.to')" align="right" v-show="search.type == 'trip'"></el-date-picker>
					<!-- 行程 -->
				<el-select  clearable filterable  v-model="search.trip"
						:placeholder="$t('action.select')+$t('tools.trip')" v-show="search.type == 'trip'"> 
						<el-option v-for="(item,index) in tripList" :key="index" :label="item"
							:value="item">
						</el-option>
				</el-select>
				<!-- 时间段逻辑 -->
				<!-- <el-date-picker
				 :picker-options="option"
				 value-format="yyyy-MM-dd HH:mm:SS"
				 v-show="search.type == 'time'"
				 @change="timeCheck"
				      v-model="search.times"
				      type="datetimerange"
				      range-separator="至"
				      start-placeholder="开始日期"
				      end-placeholder="结束日期">
				    </el-date-picker> -->
				<el-date-picker v-model="search.start_time"  :picker-options="option" type="datetime" :placeholder="$t('monitoring.start-time')"
					:range-separator="$t('devicesLog.to')" align="right" @change="startTimeChange" prefix-icon="el-icon-date"></el-date-picker>
				<el-date-picker v-model="search.end_time"  :picker-options="option" type="datetime" :placeholder="$t('monitoring.end-time')"
					:range-separator="$t('devicesLog.to')" align="right" @change="endTimeChange" prefix-icon="el-icon-date"></el-date-picker>
					
				<!-- 查询 -->
				<el-button type="primary" class="btnGray" @click="dataSearchEve">
					<i class="iconfont icon-sousuo themeOrangeColor"></i>
					{{$t('action.search')}}
				</el-button>
				<!-- 重置 -->
				<el-button type="primary" class="btnGray" @click="dataResizeEve">
					<i class="iconfont icon-zhongzhi themeOrangeColor"></i>
					{{$t('action.reset')}}
				</el-button>
				<!-- 导出 -->
			<!-- 	<el-button class="btnGray">
					<i class="iconfont icon-xiazai themeOrangeColor"></i>{{ $t("action.export") }}
				</el-button> -->
			</div>
			<div class="chartsBox">
			<draggable class="syllable_ul"
            element="ul"
            :options="{group:'title', animation:150}"
            :no-transition-on-drag="true"
				>
				<line-charts ref="driverCharts" :data="driveStyleData" v-if="chartsFlag"></line-charts>
				<line-charts ref="subCharts" :data="subStateData" v-if="chartsFlag"></line-charts>
				<line-charts ref="mainCharts" :data="mainStateData"  v-if="chartsFlag"></line-charts>
			</draggable>
			</div>
	</div>
	</div>
</template>

<script>
	import draggable from "vuedraggable"
	import tableMixins from "@/common/mixins/table.mixins";
	import dispatchMixin from '@/common/mixins/dispatch.mixins.js';
	import dispatchServer from '../../api/dispatch.server';
	import lineCharts from '@/components/statement/lineCharts.vue'
	export default {
		name: 'policyMonitor',
		mixins: [tableMixins, dispatchMixin],
		components:{
			lineCharts,
			draggable
		},
		data() {
			return {
				typeList:[
					{name:'时间段',value:'time'},
					// {name:'行程',value:"trip"}
				],
				tripList:[],
				search:{
					type:'time',
					car:'',
					trip:'',
					start_time:'',
					end_time:''
				},
				tripFlag:false,
				equipmentList:[],
				chartsFlag:false,
				driveStyleData:{
					color:"#91CC75",
					title:"驾驶模式",
					xData:[],
					yData:[]
				},
				subStateData:{
					color:"#5470C6",
					title:"子状态机",
					xData:[],
					yData:[]
				},
				mainStateData:{
					color:"#EE6666",
					title:"主状态机",
					xData:[],
					yData:[]
				}
	
			}
		},
		watch: {
			subareaSn() {
				this.search = {
					type:'time',
					car:'',
					trip:'',
					start_time:'',
					end_time:''
				}
				this.equipmentList = [];
				this.getEquipmentList();
			},
		},
		methods: {
			async dataSearchEve(){
				if(!this.search.car){
					this.messages.error('请选择卡车')
					return;
				}
				if(this.tripFlag){
					this.messages.error('暂无行程');
					return;
				}
				console.log(this.search.type)
				if(this.search.type == 'time' && (!this.search.car || !this.search.start_time || !this.search.end_time)){
					this.messages.error(`请选择${!this.search.car ? '卡车' : (!this.search.start_time ? '开始时间' : '结束时间')}`)
					return;
				}

				this.driveStyleData.xData = [];
				this.driveStyleData.yData = [];
				this.chartsFlag = false;
				try {
					var data = this.search.type == "trip" ?  {
						   "timesolt":this.search.trip,
						   "uniqueId":this.search.car,
						   "type":this.search.type,
						   "miningArea":this.subareaSn
					} : {
						"uniqueId":this.search.car,
						"type":this.search.type,
						"startTime":this.utils.formatDate(this.search.start_time),
						"endTime":this.utils.formatDate(this.search.end_time),
						 "miningArea":this.subareaSn
					}
					var result = await dispatchServer.findDrivingMode(data);
					if(result.xAxis.date && result.xAxis.date.length == 0){
						this.messages.error(`该时间段暂无数据`)
						return
					}
					this.chartsFlag = true;
					this.driveStyleData.xData = result.xAxis.date;
					this.subStateData.xData = result.xAxis.date;
					this.mainStateData.xData = result.xAxis.date;
					result.series.drivingmode.forEach(i=>{
						this.driveStyleData.yData.push(i)
					})
					result.series.rawsubstatemachine.forEach((i,index)=>{
						this.subStateData.yData.push({
							value:Number(i),
							type:result.series.substatemachine[index],
							model:result.series.drivingmode[index]
						})
						this.mainStateData.yData.push({
							value:result.series.originalmasterstatemachine[index],
							type:result.series.masterstatemachine[index],
							model:result.series.drivingmode[index],
							describe:result.series.faultcodedescription[index],
						})
					})
					this.$nextTick(()=>{
						this.$refs.driverCharts.driverEcharts(this.driveStyleData);
						this.$refs.subCharts.subEcharts(this.subStateData)
						this.$refs.mainCharts.mainEcharts(this.mainStateData)
					})
				} catch (e) {
					this.messages.error(e.message)
				}	
			},
			timeCheck(e){
				if(new Date(e[1]).getTime() - new Date(e[0]).getTime() > 1800000){
					this.messages.error('最多选择30分钟以内');
					this.search.times[1] = this.utils.formatDate(new Date(e[0]).getTime() + 1800000);
					return;
				}
				
			},
			
			async tripEve(){
				
				if(this.search.type == 'time' && (!this.search.car || !this.search.start_time || !this.search.end_time)){
					this.messages.error(`请选择${!this.search.car ? '卡车' : (!this.search.start_time ? '开始时间' : '结束时间')}`)
					return;
				}

			},
			dataResizeEve(){
				this.search = {
					type:'time',
					car:'',
					trip:'',
					time:'',
					times:''
				}
				this.chartsFlag = false;
			},
			typeChangeEve(e){
				e == 'time' ? (this.search.car = '',this.search.times = '',this.tripFlag = false) :(this.search.car = '',this.search.time = '', this.search.trip = '',this.tripFlag = false)
			},
			async getEquipmentList() {
				try {
					var data = {
						miningArea: this.subareaSn
					}
					var result = await dispatchServer.getTakeOverList(data);
					this.equipmentList = result || []
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			
		
		},
		created() {
			if(this.subareaSn){
				this.getEquipmentList();
			}
		},
		
	}
</script>

<style lang="scss" scoped>
.chartsBox{
	width: 98%;
	margin: 0 1px 0 20px;
	margin-top: 73px;
	overflow-y: scroll;
	height: calc(100% - 100px);
}
</style>
