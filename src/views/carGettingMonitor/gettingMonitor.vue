<template>
	<!-- 决策监控 -->
	<div class="table_content">
		<div class="btn_search">
			<el-button class="btnBg btn-add" @click="indexAllocationEve">
				<i class="iconfont icon-peizhixinxi"></i>指标配置
			</el-button>
			<el-button class="btnBg btn-add" @click="conditionAddEve">
				<i class="iconfont icon-shaixuantiaojian"></i>条件选择
			</el-button>
			<el-button class="btnBg btn-add btnGray" @click="historyConditionAddEve">
				<i class="iconfont icon-jiluliebiao themeOrangeColor"></i>历史规则
			</el-button>
		</div>
		<div class="content_box">
			<left-content-box :ruleListData="ruleListData" :checkDateList="checkDateList" ref="leftContentBox"></left-content-box>
			<right-content-box :calcResult="calcResult" :actualDataList="actualDataList" :summaryDataList="summaryDataList" :carDataList="carDataList" ref="rightContentBox"></right-content-box>
		</div>
		<condition-add ref="conditionAdd" :limitCheckNum="limitCheckNum"></condition-add>
		<index-allocation ref="indexAllocation"></index-allocation>
	</div>
</template>

<script>
	import dispatchMixin from '@/common/mixins/dispatch.mixins.js';
	import leftContentBox from "../../components/carGettingMonitor/leftContentBox.vue";
	import rightContentBox from "../../components/carGettingMonitor/rightContentBox.vue";
	import conditionAdd from "../../components/carGettingMonitor/conditionAdd.vue";
	import indexAllocation from "../../components/carGettingMonitor/indexAllocation.vue";
	export default {
		name: 'gettingMonitor',
		mixins:[dispatchMixin],
		components: {
		  leftContentBox,
		  rightContentBox,
		  conditionAdd,
		  indexAllocation
		},
		data() {
			return {
				value1: [],
				ruleListData:[],
				checkDateList:[],
				calcResult:[
					{type:'计算结果',value:'-'},
					{type:'阶段名称',value:'-'},
					{type:'累计测试天数',value:'-'},
					{type:'累计测试通过天数',value:'-'},
					],
				actualDataList:[
					{name:'指标数据',aqygycsStand:'-',aqyqdcsStand:'-',jkygycsStand:'-',jkyqdcsStand:'-',ycjgcsStand:'-',autoTimeStand:'-'},
					{name:'实际数据',aqygycsStand:'-',aqyqdcsStand:'-',jkygycsStand:'-',jkyqdcsStand:'-',ycjgcsStand:'-',autoTimeStand:'-'},
				],
				summaryDataList:[],
				carDataList:[],
				limitCheckNum:999,
				stageFlag:'',
				stageNum:[],
				checkRuleId:''
				
			}
		},
		watch: {
			subareaSn() {
				this.summaryDataList = [];
				this.carDataList = [];
				this.actualDataList = [
					{name:'指标数据',aqygycsStand:'-',aqyqdcsStand:'-',jkygycsStand:'-',jkyqdcsStand:'-',ycjgcsStand:'-',autoTimeStand:'-'},
					{name:'实际数据',aqygycsStand:'-',aqyqdcsStand:'-',jkygycsStand:'-',jkyqdcsStand:'-',ycjgcsStand:'-',autoTimeStand:'-'},
				];
				this.ruleListData = [];
				this.checkDateList = [];
				this.limitCheckNum = 999;
				this.$refs.conditionAdd.ruleCheckIndex = null;
				this.$refs.conditionAdd.deleteIndex = null;
				
				this.calcResult = [
					{type:'计算结果',value:'-'},
					{type:'阶段名称',value:'-'},
					{type:'累计测试天数',value:'-'},
					{type:'累计测试通过天数',value:'-'},
					];
			},
			stageFlag(newvalue,oldvalue){
				if(oldvalue !== '' && newvalue !== oldvalue){
					this.ruleListData = [];
					this.checkDateList = [];
				}
			},
			stageNum(newvalue,oldvalue){
				if( newvalue.join() !== oldvalue.join()){
					this.ruleListData = [];
					this.checkDateList = [];
				}
			},
			ruleListData(newvalue,oldvalue){
				let newArr = JSON.parse(JSON.stringify(newvalue))
				let arr = [];
				let arr1 = [];
				newArr.forEach(i=>{
					i.arrList = []
					i.dataTime.substr(0, i.dataTime.length - 1).split(',').forEach(c=>{
						i.arrList.push(c)
					})
					i.arrList.forEach(v=>{
					    let i = arr.indexOf(v.substr(0,7));
					    if(i == -1){
					        arr.push(v.substr(0,7));
					        arr1.push([]);
					         i = arr1.length - 1;
					    }
					     arr1[i].push(v);
					})
				})
				let checkArr = [];
				arr.forEach((i,index)=>{
					checkArr.push({
						value: i,
						times: arr1[index]
					})
				})
				checkArr.sort(function(a,b){
					return new Date(a.value) - new Date(b.value)
				})
				this.$refs.leftContentBox.successList = [];
				this.$refs.leftContentBox.dataList = checkArr;
			}
		},
		methods: {
			conditionAddEve(){
				this.$refs.conditionAdd.openAddDialog(1)
			},
			historyConditionAddEve(){
				this.$refs.conditionAdd.openAddDialog(3)
				// this.findAllIndicatorDataHistoricalRules()
			},
			indexAllocationEve(){
				this.$refs.indexAllocation.openAddDialog()
			},
		},
		mounted() {
		}
	}
</script>

<style lang="scss" scoped>
	.table_content{
		.btn_search {
			position: inherit;
		}
		.content_box{
			height: calc(100% - 32px);
			padding-top: 20px;
			.left_content{
				width: 340px;
				float: left;
				.reportTitle{
					color: #8E96AC;
					font-size: 14px;
				}
			}
			.right_content{
				width: calc(100% - 359px);
				float: right;
				.reportTitle{
					color: #8E96AC;
					font-size: 14px;
				}
			}
		}
	}
	
</style>
