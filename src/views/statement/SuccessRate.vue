<template>
	<!-- 决策监控 -->
	<div class="table_content">
		<div class="content_center content_tabs">
			<div class="reportTitle">
				<a>{{$t('route.nozzle-analysis')}}</a>
			</div>
			<div class="btn_search">
				<!-- 卡车 -->
				<el-select  clearable filterable  v-model="search.car" 
				:placeholder="$t('action.select')+$t('action.truck')" >
					<el-option v-for="(item,index) in equipmentList" :key="index" :label="item.deviceName"
						:value="item.uniqueId">
					</el-option>
				</el-select>
				<!-- 时间段逻辑 -->
				 <el-date-picker
				 value-format="yyyy-MM-dd HH:mm:SS"
				      v-model="search.times"
				      type="datetimerange"
				      range-separator="至"
				      start-placeholder="开始日期"
				      end-placeholder="结束日期">
				    </el-date-picker>
					<!-- 统计类型 -->
					<el-select   filterable  v-model="search.type"
					>
						<el-option v-for="(item,index) in typeList" :key="index" :label="item.name"
							:value="item.value">
						</el-option>
					</el-select>
					
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
			</div>	
			<div class="contentBox">
				<!-- 版本指点成功率 -->
			<div class="visonList">
				<div class="visonListItem">
					<p>{{$t('data-manager.success-rate')}}</p>
					<p>80%</p>
				</div>
				<div class="visonListItem">
					<p>{{$t('data-manager.success-rates')}}</p>
					<p>80%</p>
				</div>
			</div>
				<!-- 版本指点数据统计 -->
				<div class="directDataBox">
					<directions-data :data="directionOne"></directions-data>
					<directions-data :data="directionTwo"></directions-data>
				</div>
				<!-- 版本指点成功率分析 -->
				<div class="directDataBox">
					<bars-line-charts :stackedLine="carTakeOverData" :chartsXData="carTakeOverData.chartsXData" ref="chartsTwo"
						:chartsYtakeOverAvg="carTakeOverData.chartsYtakeOverAvg" :chartsYtakeOverCount="carTakeOverData.chartsYtakeOverCount" :chartsLegend="chartsLegend"
						:chartsYtakeOverTimeSingle="carTakeOverData.chartsYtakeOverTimeSingle"
						>
					</bars-line-charts>
					<bars-line-charts :stackedLine="carTakeOverDetal" :chartsXData="carTakeOverDetal.chartsXData" ref="chartsTwo"
						:chartsYtakeOverAvg="carTakeOverDetal.chartsYtakeOverAvg" :chartsYtakeOverCount="carTakeOverDetal.chartsYtakeOverCount" :chartsLegend="chartsLegend"
						:chartsYtakeOverTimeSingle="carTakeOverDetal.chartsYtakeOverTimeSingle"
						>
					</bars-line-charts>
				</div>
				<!-- 版本指点成功率详情 -->
				<div class="directDataBox">
				<table-box :data="carTabTakeOverData"></table-box>
				<table-box :data="carTabTakeOverDetal"></table-box>
				</div>
			</div>
	</div>
	</div>
</template>

<script>
	import tableMixins from "@/common/mixins/table.mixins";
	import dispatchMixin from '@/common/mixins/dispatch.mixins.js';
	import dispatchServer from '../../api/dispatch.server';
	import barsLineCharts from '@/components/statement/barsLineCharts.vue'
	import tableBox from '@/components/statement/tableBox.vue'
	const directionsData = () => import('../../components/statement/directionsData.vue')
	export default {
		name: 'SuccessRate',
		mixins: [tableMixins, dispatchMixin],
		components:{
			directionsData,
			barsLineCharts,
			tableBox
		},
		data() {
			return {
				equipmentList:[],
				search:{
					car:'',
					times:'',
					type:'day'
				},
				carTakeOverData: {
					title: 'V2.2指点成功率分析',
					chartsXData:[],
					chartsYtakeOverAvg:[],
					chartsYtakeOverCount:[],
					chartsYtakeOverTimeSingle:[]
				},
				carTabTakeOverData: {
					title: 'V2.2指点成功率详情'
				},
				carTakeOverDetal: {
					title: 'V2.3指点成功率分析',
					chartsXData:[],
					chartsYtakeOverAvg:[],
					chartsYtakeOverCount:[],
					chartsYtakeOverTimeSingle:[]
				},
				carTabTakeOverDetal: {
					title: 'V2.3指点成功率详情'
				},
				chartsLegend:['指点成功率','司机操作时长','平台规划时长'],
				typeList:[
					{name:'按天统计',value:'day'},
					{name:'按周统计',value:'week'},
					{name:'按月统计',value:'month'}
				],
				directionOne:{
					title:'V2.2指点数据统计'
				},
				directionTwo:{
					title:'V2.3指点数据统计'
				}
			}
		},

		watch: {
			subareaSn() {
				this.getEquipmentList();
			},
		},
		methods: {
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
			dataSearchEve(){
				
			},
			dataResizeEve(){
				
			}
			
		
		},
		created() {
			if(this.subareaSn){
				this.getEquipmentList();
			}
		}
	}
</script>

<style lang="scss" scoped>
.contentBox{	
	margin-top: 70px;
	height: calc(100% - 120px);
	overflow-y: scroll;
	.visonList{
	display: flex;
	justify-content: space-around;
	div{
		width: 48%;
		height: 94px;
		background: #1b202f;
		border: 1px solid #101012;
		border-radius: 5px;
		font-size: 14px;
		text-align: center;
		line-height: 50px;
		color: #bfc8d8;
		p:nth-child(2){
			color: #3c66ed;
			line-height: 28px;
			font-weight: 700;
			font-size: 17px;
		}
		}
	}
	.directDataBox{
		display: flex;
		justify-content: space-around;
		margin-top: 20px;
	}
}
</style>
