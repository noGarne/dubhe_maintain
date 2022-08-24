<template>
	<!-- 决策监控 -->
	<div class="table_content">
		<div class="content_center content_tabs">
			<div class="reportTitle">
				<a>{{$t('route.controlMonitor')}}</a>
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
					:placeholder="$t('action.select')+$t('action.truck')">
					<el-option v-for="(item,index) in equipmentList" :key="index" :label="item.deviceName"
						:value="item.uniqueId">
					</el-option>

				</el-select>
				<!-- 行程逻辑 -->
				<!-- 时间 -->
				<el-date-picker v-model="search.time" :placeholder="$t('devicesLog.selectTime')" :picker-options="option"
					value-format="yyyy-MM-dd"  :range-separator="$t('devicesLog.to')" align="right"
					v-show="search.type == 'trip'"></el-date-picker>
				<!-- 行程 -->
				<el-select clearable filterable v-model="search.trip"
					:placeholder="$t('action.select')+$t('tools.trip')" v-show="search.type == 'trip'">
					<el-option v-for="(item,index) in tripList" :key="index" :label="item" :value="item">
					</el-option>
				</el-select>
				<!-- 时间段逻辑 -->
				<!-- <el-date-picker value-format="yyyy-MM-dd HH:mm:SS"  @change="timeCheck" v-show="search.type == 'time'" v-model="search.times" :picker-options="option"
					type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
				</el-date-picker> -->
				<el-date-picker v-model="search.start_time"  :picker-options="option" type="datetime" :placeholder="$t('monitoring.start-time')"
					:range-separator="$t('devicesLog.to')" align="right" @change="startTimeChange" @focus="focusTime" prefix-icon="el-icon-date" class="startTimePicker"></el-date-picker>
				<el-date-picker v-model="search.end_time"  :picker-options="option" type="datetime" :placeholder="$t('monitoring.end-time')"
					:range-separator="$t('devicesLog.to')" align="right" @change="endTimeChange" @focus="focusTime" prefix-icon="el-icon-date" class="endTimePicker"></el-date-picker>
				   <!-- 多选list -->
				     <el-cascader
				     v-model="cascaderList"
				        :options="options"
						:placeholder="$t('action.select')+$t('action.field')"
				        :props="props"
				        collapse-tags
						@change="cascaderListEve"
				        clearable></el-cascader> 
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
				<!-- <el-button class="btnGray">
					<i class="iconfont icon-xiazai themeOrangeColor"></i>{{ $t("action.export") }}
				</el-button> -->
			</div>
			<div class="chartsBox">
				<draggable class="syllable_ul" element="ul" :options="{group:'title', animation:150}"
					:no-transition-on-drag="true">
					<div  v-for="(value,key,index) in Ydata" v-if="chartsFlag">
						<line-charts :ref="key" :data="value.nameList[0]"></line-charts>
					</div>
					
					
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
		name: 'controlMonitor',
		mixins: [tableMixins, dispatchMixin],
		components: {
			lineCharts,
			draggable
		},
		data() {
			return {
				props: {
					multiple: true,
					value:'fieldEnglish',
					label:'fieldChinese',
					emitPath:false
				},
				cascaderList: [],
				noDataTimeList:[],
				options: [],
				typeList: [{
						name: '时间段',
						value: 'time'
					},
				],
				option: {
					disabledDate: (time) => {
						return this.noDataTimeList.includes(this.utils.formatDate(time.getTime()).split(' ')[0]) || time.getTime() > Date.now()
					}
				},
				tripList: [],
				Xdata:[],
				Ydata:[],
				chartsFlag:false,
				search: {
					type: 'time',
					car: '',
					trip: '',
					start_time: '',
					end_time: '',
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
				this.search = {
					type: 'time',
					car: '',
					trip: '',
					start_time: '',
					end_time: '',
				}
				this.getFieldEve();
				this.cascaderList = [];
				this.equipmentList = [];
				this.getEquipmentList();
			},
		},
		methods: {
			async dataSearchEve() {
				if (!this.search.car) {
					this.messages.error('请选择卡车')
					return;
				}
				if (this.tripFlag) {
					this.messages.error('暂无行程');
					return;
				}
				if (this.search.type == 'time' && (!this.search.car || !this.search.start_time || !this.search.end_time)) {
					this.messages.error(`请选择${!this.search.car ? '卡车' : (!this.search.start_time ? '开始时间' : '结束时间')}`)
					return;
				}

				if(this.cascaderList.length == 0){
					this.messages.error(`请选择字段`)
					return;
				}
				let filedList = []
				this.cascaderList.forEach(i=>{
					filedList.push({
						"fieldEnglish":i
					})
				})
				this.chartsFlag = false;
				try {
					var data = {
						"uniqueId":this.search.car,
						 "startTime":this.utils.formatDate(this.search.start_time),
						 "endTime":this.utils.formatDate(this.search.end_time),
						 "fieldList":filedList,
						 "miningArea":this.subareaSn
					}
					console.log(this.search)
					var result = await dispatchServer.getConfindInfoAll(data);
					this.Ydata = this.chartsDataFilter(result);
					if(!result.series.xaxisDataMap){
						this.messages.error(`该时间段暂无数据`)
						return
					}
					this.Xdata = result.series.xaxisDataMap.date;
					this.chartsFlag = true;
					for(let x in this.Ydata){
						this.$nextTick(()=>{
							let arr = [{
								name:'drivingmode',
								title:'驾驶模式',
								value:'drivingmode',
								color:"#91CC75"
							},{
								name:'substatemachine',
								title:'子状态机',
								value:'rawsubstatemachine',
								color:"#5470C6"
							},{
								name:'masterstatemachine',
								title:'主状态机',
								value:'originalmasterstatemachine',
								color:'#EE6666'
							}]
							let checkItem = arr.find(i=>i.name == x);
							if(checkItem){
								let data;
								if(x == 'drivingmode'){
									 data = {
										color: checkItem.color,
										title: checkItem.title,
										xData:this.Xdata,
										yData:this.Ydata[x][checkItem.value]
									}
								}else{
									// console.log(this.Ydata[x])
									let arr = [];
									this.Ydata[x][x].forEach((item,index)=>{
										arr.push({
											type:item,
											value:this.Ydata[x][checkItem.value][index],
										})
									})
									data = {
										color: checkItem.color,
										title: checkItem.title,
										xData:this.Xdata,
										yData:arr
									}
								}
								x == 'drivingmode' ? this.$refs[x][0].driverEcharts(data) :(x == 'substatemachine' ? this.$refs[x][0].subEcharts(data) : this.$refs[x][0].mainEcharts(data) )
							}else{
								console.log(this.Xdata,this.Ydata[x],this.options.find(i=>  i.fieldEnglish == x ))
								this.$refs[x][0].otherChrts(this.Xdata,this.Ydata[x],this.options.find(i=>  i.fieldEnglish == x ))
							}
							
						})
					}
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
			cascaderListEve(e){
				console.log(e)
				if(e.length == 1) return
			},
			async focusTime(e){
				let nowMonth = await this.getMonthEve();
				this.findExistDataBydateEve(nowMonth)
				this.$nextTick(() => {
				    let prevBtn = document.getElementsByClassName("el-icon-arrow-left");
				    prevBtn[prevBtn.length-1].addEventListener('click', (e) => {
				     this.getMonthEve().then(c=>{
				     this.findExistDataBydateEve(c)
				     })
				    })
				})
				this.$nextTick(() => {
				    let prevBtn = document.getElementsByClassName("el-icon-arrow-right");
				    prevBtn[prevBtn.length-1].addEventListener('click', (e) => {
				       this.getMonthEve().then(c=>{
						   this.findExistDataBydateEve(c)
					   })
				    })
				})
			},

			async findExistDataBydateEve(e) {
				let params = {
					miningArea:this.subareaSn,
					pt:e,
					uniqueId:this.search.car
				}
				try {
					var result = await dispatchServer.findExistDataBydateEve(params);
					this.noDataTimeList = result.data.data;
					console.log(result)
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			getMonthEve(){
				let month;
				return new Promise((resolve,reject)=>{
				      this.$nextTick(()=>{
				      	month = document.getElementsByClassName("el-date-picker__header-label");
						resolve ((month[month.length - 2].innerHTML.split(' ')[0] +'-')+(month[month.length - 1].innerHTML.split(' ')[0] >= 10 ? month[month.length - 1].innerHTML.split(' ')[0] : '0'+month[month.length - 1].innerHTML.split(' ')[0])+'-01')				      }) 
				    })	
			},
			chartsDataFilter(result){
				let YData = {};
				// YData.xAxis = result.series.xaxisDataMap.date;
				for(let x in result.series){
					if(result.series[x]&&result.series[x].length>0){
						YData[x] = {}
						for(let z in result.series[x]){
							YData[x][z] = {}
							for(let c in result.series[x][z]){
								YData[x][c] = result.series[x][z][c]
							}
							
						}
						
					}
				}
				for(let x in YData){
					YData[x]['nameList'] = []
					for(let z in YData[x]){
						if(Object.keys(YData[x][z]).length == 0){
							delete YData[x][z]
						}else{
							let c = dispatchServer.getFieldList().find(i=>  i.fieldEnglish == z );
							console.log(c)
							YData[x]['nameList'].push({
								name: z == 'nameList' ? '' : c.fieldChinese,
								title:z == 'nameList' ? '' : (c.parent_name ? c.parent_name : c.fieldChinese),
								value:z
							});
							YData[x]['nameList'] = YData[x]['nameList'].filter(i=>  i.value!=='nameList');
						}
					}
				}
				return YData
			},
			dataResizeEve() {
				this.search = {
					type: 'time',
					car: '',
					trip: '',
					time: '',
					times: ''
				}
				this.chartsFlag = false;
				this.cascaderList = [];
			},
			typeChangeEve(e) {
				e == 'time' ? (this.search.car = '', this.search.times = '', this.tripFlag = false) : (this.search.car =
					'', this.search.time = '', this.search.trip = '', this.tripFlag = false)
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
			async getFieldEve() {
				try {
					var result = await dispatchServer.getField();
					// this.equipmentList = result || []
					this.options =  result || []
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			

		},
		created() {
			if (this.subareaSn) {
				this.getEquipmentList();
				this.getFieldEve();
			}
		},
		mounted() {
			if (JSON.stringify(this.$route.params) !== '{}') {
				this.search.start_time =  this.$route.params.start_time;
				this.search.end_time =  this.$route.params.end_time;
				this.search.car = this.$route.params.unique_id;
			}
		}

	}
</script>

<style lang="scss" scoped>
	.chartsBox {
		width: 98%;
		margin: 0 1px 0 20px;
		margin-top: 73px;
		overflow-y: scroll;
		height: calc(100% - 100px);
	}
</style>
