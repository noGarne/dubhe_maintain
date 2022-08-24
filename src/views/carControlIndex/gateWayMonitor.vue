<template>
	<!-- 决策监控 -->
	<div class="table_content">
		<div class="content_center content_tabs">
			<div class="reportTitle">
				<a>{{$t('route.getawayMonitor')}}</a>
				<p><i class="iconfont icon-gaojingxinxi red"></i>注：最长支持0.5h时长的数据查询！</p>
			</div>
			<div class="btn_search">
				<!-- 类型 -->
				<el-select filterable v-model="search.type" :placeholder="$t('action.select')+$t('device.type')"
					@change="typeChangeEve">
					<el-option v-for="(item,index) in typeList" :key="index" :label="item.name" :value="item.value">
					</el-option>
				</el-select>

				<!-- 卡车 -->
				<el-select clearable filterable v-model="search.car"
					:placeholder="$t('action.select')+$t('action.truck')" @change="tripEve">
					<el-option v-for="(item,index) in equipmentList" :key="index" :label="item.deviceName"
						:value="item.uniqueId">
					</el-option>

				</el-select>
				<!-- 行程逻辑 -->
				<!-- 时间 -->
				<el-date-picker v-model="search.time" v-show="search.type == 'trip'" :placeholder="$t('devicesLog.selectTime')" :picker-options="option"
					value-format="yyyy-MM-dd" @change="tripEve" :range-separator="$t('devicesLog.to')" align="right"
					></el-date-picker>
				<!-- 行程 -->
				<el-select clearable filterable v-model="search.trip" v-show="search.type == 'trip'"
					:placeholder="$t('action.select')+$t('tools.trip')" >
					<el-option v-for="(item,index) in tripList" :key="index" :label="item" :value="item">
					</el-option>
				</el-select>
				<!-- 时间段逻辑 -->
				<el-date-picker v-model="search.start_time"  :picker-options="option" type="datetime" :placeholder="$t('monitoring.start-time')"
					v-show="search.type == 'time'" :range-separator="$t('devicesLog.to')" align="right" prefix-icon="el-icon-date" @change="startTimeChange"></el-date-picker>
				<el-date-picker v-model="search.end_time"  :picker-options="option" type="datetime" :placeholder="$t('monitoring.end-time')"
					v-show="search.type == 'time'" :range-separator="$t('devicesLog.to')" align="right" prefix-icon="el-icon-date" @change="endTimeChange"></el-date-picker>
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
			<div class="tabsBox">
			  <el-tabs v-model="currentTab" class="el-tabs--card" @tab-click="handleClick">
			    <el-tab-pane :label="$t('device.CSQ')" name="0">
			    </el-tab-pane>
			    <el-tab-pane :label="$t('device.error-rate')" name="1">
			    </el-tab-pane>
			    <el-tab-pane :label="$t('device.network-mode')" name="3">
			    </el-tab-pane>
				<el-tab-pane :label="$t('device.location-level')" name="4">
				</el-tab-pane>
				<el-tab-pane :label="$t('device.star-num')" name="2">
				</el-tab-pane>
				<div class="tabsContent" v-if="contentFlag">
					<!-- <leafletMap :data="hotData" ref="leafletRef"></leafletMap> -->
						<basic-charts :data="hotData" ref="basicRef"></basic-charts>
					<pie-charts :data="pieData" ref="pieRef"></pie-charts>
					<line-charts :data="linesData" ref="chartsRef"></line-charts>
				</div>
			  </el-tabs>
			  
			 <div class="tabs_icon">
				  <!-- <i class="iconfont icon-huidaozhongxin" @click="getBounds"></i> -->
				 
				 <!-- <el-popover
				  
				      placement="bottom"
				      width="100"
				      trigger="hover">
				<div class="switchStyle">
					场地标注
					<el-switch
					:disabled="!contentFlag"
					  v-model="spaceIconShow"
					  active-color="#13ce66"
					  inactive-color="#c7c7c7">
					</el-switch>
				</div>
				<div class="switchStyle">
					道路标注
					<el-switch
					:disabled="!contentFlag"
					  v-model="roadIconShow"
					  active-color="#13ce66"
					  inactive-color="#c7c7c7">
					</el-switch>
				</div>
				      <i class="iconfont icon-dituxianyin lineStyle" slot="reference" ></i>
				    </el-popover> -->
				  <i class="iconfont icon-shezhi" @click="colorOptionEve"></i>
			  </div>
			</div>
			<color-option ref="coloroption"></color-option>
		</div>
		
	</div>
</template>

<script>
	import draggable from "vuedraggable"
	import tableMixins from "@/common/mixins/table.mixins";
	import dispatchMixin from '@/common/mixins/dispatch.mixins.js';
	import dispatchServer from '../../api/dispatch.server';
	import lineCharts from '@/components/statement/lineCharts.vue'
	// import leafletMap from '@/components/carControlIndex/leafletMap.vue';
	import basicCharts from '@/components/carControlIndex/basicCharts.vue';
	import pieCharts from '@/components/carControlIndex/pieCharts.vue'
	import colorOption from '@/components/carControlIndex/colorOption.vue'
	export default {
		name: 'gateWayMonitor',
		mixins: [tableMixins, dispatchMixin],
		components: {
			lineCharts,
			draggable,
			basicCharts,
			pieCharts,
			colorOption
		},
		data() {
			return {
				props: {
					multiple: true,
					value:'id',
					label:'fieldChinese',
					emitPath:false
				},
				contentFlag:false,
				hotData:{
					title:'CSQ热力图',
					list:[],
					legendList:[],
					xMin:'',
					yMin:''
				},
				pieData:{
					title:'CSQ饼图'
				},
				linesData:{
					title:'CSQ/误码率/网络模式折线图',
					height:'520'
				},
				spaceIconShow:false,
				roadIconShow:false,
				currentTab:'0',
				option:{
						disabledDate:(time)=> {
					        return time.getTime() > Date.now()
					    }
					},
				cascaderList: [],
				options: [],
				typeList: [{
						name: '时间段',
						value: 'time'
					},
					
				],
				tripList: [],
				search: {
					type: 'time',
					car: '',
					trip: '',
					time: '',
					start_time:'',
					end_time:''
				},
				tripFlag: false,
				equipmentList: [],
				driveStyleData: {
					color: "#91CC75",
					title: "驾驶模式"
				},
				subStateData: {
					color: "#5470C6",
					title: "子状态机"
				},
				mainStateData: {
					color: "#EE6666",
					title: "主状态机"
				}

			}
		},
		watch: {
			subareaSn() {
				console.log(this.subareaSn)
				this.search = {
					type: '',
					car: '',
					trip: '',
					time: '',
					start_time:'',
					end_time:''
				}
				this.equipmentList = [];
				this.contentFlag = false;
				this.getEquipmentList();
			},
			spaceIconShow(v){
			  this.$refs.leafletRef.setSpaceIconShow(v);
			},
			roadIconShow(v){
			   this.$refs.leafletRef.setRoadShow(v);
			},
		},
		methods: {
			 dataSearchEve() {
				if(!this.search.type){
					this.messages.error('请选择类型');
					return;
				}
				if (this.tripFlag) {
					this.messages.error('暂无行程');
					return;
				}
				if (this.search.type == 'trip' && (!this.search.car || !this.search.time || !this.search.trip)) {
					this.messages.error(`请选择${!this.search.car ? '卡车' : (!this.search.time ? '时间' : '行程')}`)
					return;
				}
				if(this.search.type == 'time' && (!this.search.car || !this.search.start_time || !this.search.end_time)){
					this.messages.error(`请选择${!this.search.car ? '卡车' : (!this.search.start_time ? '开始时间' : '结束时间')}`)
					return;
				}
				console.log(this.search)
				this.contentFlag = false;
				let data = this.search.type == 'time' ? {
						miningArea:this.subareaSn,
						startTime:this.utils.formatDate(this.search.start_time),
						endTime:this.utils.formatDate(this.search.end_time),
						param:this.currentTab,
						uniqueId:this.search.car,
						type:'time'
					} : {
						miningArea:this.subareaSn,
						uniqueId:this.search.car,
						time:this.search.time,
						trip:this.search.trip,
						type:'trip',
						param:this.currentTab,
					}
				this.getWayLineEve(data);
				
			},
			async tripEve() {
				if(this.search.type == 'time' || !this.search.type) return;
				this.search.trip = [];
				if (!this.search.car || !this.search.time) {
					this.messages.error(`请选择${!this.search.car ? '卡车' : '时间'}`)
					return;
				}
				try {
					var data = {
						"uniqueId": this.search.car,
						"time": this.search.time
					}
					var result = await dispatchServer.findMontitoring(data);
					this.tripList = result;
					this.tripFlag = this.tripList.length == 0 ? true : false;
					if (this.tripFlag) {
						this.messages.error('暂无行程');
					}
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			dataResizeEve() {
				this.search = {
					type: this.search.type,
					car: '',
					trip: '',
					time: '',
					start_time:'',
					end_time:''
				}
				this.contentFlag = false;
			},
			typeChangeEve(e) {
				e == 'time' ? (this.search.car = '', this.search.start_time = '', this.search.end_time = '', this.tripFlag = false) : (this.search.car =
					'', this.search.time = '', this.search.trip = '', this.tripFlag = false)
			},
			colorOptionEve(){
				this.$refs.coloroption.openAddDialog()
			},
			getBounds(){
				
				 this.contentFlag && this.$refs.leafletRef.getBounds();
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
			getNameEve(e){
				let str = {
					'main_signal_strength':'csq',
					'main_bit_error_rate':'误码率',
					'main_network_mode':'网络模式',
					'positioning_state':'定位等级',
					'mins_num':'搜星数量'
				}
				return str[e];

			},
			async getWayLineEve(data) {
				let str = JSON.parse(JSON.stringify(data));
				str.param = str.param == '0' ? 'main_signal_strength' : ( str.param == '1' ? 'main_bit_error_rate' : (str.param == '2' ? 'mins_num' : (str.param == '3' ? 'main_network_mode' : 'positioning_state')))
				try {
					var result = await dispatchServer.getWayLine(str);
					if(result.xAxis.date && result.xAxis.date.length == 0){
							this.messages.error('该时间段暂无数据');
							this.contentFlag = false;
							return
					}
					this.getWayPieEve(data);
					this.getHotEve(data);
					let dataX = result.xAxis.date;
					result.series.nameList = [];
					for(let x in result.series){
						if(x == 'nameList')  continue;
						result.series.nameList.push({name:this.getNameEve(x),value:x})
					}
					this.contentFlag = true;
					this.$nextTick(()=>{
						this.$refs.chartsRef.otherChrts(dataX,result.series,{fieldChinese:1},'CSQ')
					})
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			async getWayPieEve(data) {
				try {
					var result = await dispatchServer.getPieColour(data);
					let legends = [];
					let datas = [];
						result.forEach(i=>{
							legends.push(i.colour)
							datas.push({
								name:data.param == '3' ? (i.name == 0 ? '无服务' : `${i.name + 1}G`) : (data.param == '4' ? (i.name == 0 ? '正常定位' : '异常定位') : i.name ),
								value:i.value,
								rateResult:i.rateResult
							})
						})
					if(!this.contentFlag) return;
					this.$nextTick(()=>{
						this.$refs.pieRef.myEcharts(legends,datas)
						this.$refs.basicRef.myEcharts()
					})
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			async getFieldEve() {
				try {
					var result = await dispatchServer.getField();
					// this.equipmentList = result || []
					this.options =  result || []
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			async getHotEve(e) {
				try {
					var result = await dispatchServer.getHotColour(e);
					this.hotData.legendList = [];
					let dataList = [];
					let legendList = [];
					let xData = [];
					let yData = [];
					result.forEach(i=>{
						i.latLng && i.latLng.length > 0 && dataList.push({
								symbolSize: 20,
								name:this.currentTab == '3' ? (i.name == 0 ? '无服务' : `${Number(i.name) + 1}G`) : (this.currentTab == '4' ? (i.name == 0 ? '正常定位' : '异常定位') : i.name ),
								data:i.latLng,
								itemStyle:{
									color:i.colour
								},
								type: 'scatter'
							}) && i.latLng.forEach(z=>{
							xData.push(z[0])
							yData.push(z[1])
						})		
						legendList.push(this.currentTab == '3' ? (i.name == 0 ? '无服务' : `${Number(i.name) + 1}G`) : (this.currentTab == '4' ? (i.name == 0 ? '正常定位' : '异常定位') : i.name ))
					})
					if(result.length == 0) return
					this.hotData.list = dataList;
					this.hotData.xMin = Math.min(...xData);
					this.hotData.yMin = Math.min(...yData);
					this.hotData.legendList = legendList;
					// this.equipmentList = result || []
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			
			handleClick(tab, event){
				this.dataSearchEve()
				this.spaceIconShow = false;
				this.roadIconShow = false;
				this.hotData.title = tab.label + '热力图';
				this.pieData.title =  tab.label + '饼图';
				this.linesData.title =  ['CSQ','误码率','网络模式'].includes(tab.label) ? 'CSQ/误码率/网络模式折线图' : '定位等级/搜星数量折线图' ;
			},
			analyData(e){
				var c = 0;
				let lengthAnaly = (e.length > 1000 && e.length < 2000) ? 3 : (e.length > 2500 ? 5 : 2)
				let z = [];
				e.forEach((item,index)=>{
			 		if(!e[c]) return;
					z.push(e[c])
					c += lengthAnaly
				})
				return z
			}
			

		},
		created() {
			if (this.subareaSn) {
				this.getEquipmentList();
				this.getFieldEve();
			}
		},
	}
</script>

<style lang="scss" scoped>
	.chartsBox {
		width: 96%;
		margin: 0 auto;
		margin-top: 70px;
		overflow-y: scroll;
		height: calc(100% - 100px);
	}
	.tabsBox{
		    height: 100%;
		    position: absolute;
		    top: 120px;
		    width: 97.7%;
		    margin: 0 10px 0 20px;
			border-radius: 3px;
			overflow: hidden!important;
			.tabs_icon{
				position: absolute;
				top: 0;
				right: 0;
				height: 40px;
				line-height: 40px;
				i{
					color: #8e96ac;
					font-size: 18px;
					margin-right: 20px;
					margin-left: 10px;
					cursor: pointer;
					&:hover{
						color: #d7d7d7;
					}
				}
				.lineStyle{
					margin-right: 40px;
					&:after{
						content: "";
						    border-right: 1px solid #454c5f;
						    border-color: #454c5f;
						    height: 32px;
						    position: absolute;
						    right: 37%;
						    top: 50%;
						    margin-top: -16px;	
					}
				}
			}
			.tabsContent{
				height: calc(100% - 140px);
				overflow-y: scroll;
				.boxBaseStyle{
					&:last-child{
						margin-bottom: 0 !important;
					}
				}
			}	
	}
	.switchStyle{
			color: #bfc8d8;
			text-align: center;
			padding: 5px 0;
			.el-switch{
				margin-left: 4px;
			}
	}
</style>
