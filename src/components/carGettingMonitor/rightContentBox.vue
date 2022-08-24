<template>
	<div class="content_center content_tabs right_content">
		<div class="reportTitle">
			<a>运算结果</a>
			<p></p>
		</div>
		<div class="contentBox">
			<div class="CalcResults">
				<div v-for="(item,index) in CalcResult">
					<p v-if="index == 0" :class="item.value == '-' ? '' : !item.value ? 'noPass' : 'yesPass'">
						<i class="iconfont" :class="item.value == '-' ? '' : !item.value ? 'icon-xinzeng1' : 'icon-shengxiao'" style="padding-right: 8px;"></i>
					{{item.value == '-' ? '计算结果' :( !item.value ? '未通过' : '已通过')}}
					</p>
					<p v-else>{{item.type}}</p>
					<p v-if="index !== 0">{{item.value}}</p>
				</div>
			</div>
			<div class="flexTableBox">
				<flex-table :data="tableSummaryData" :actualDataList="actualDataList"></flex-table>
				<flex-table :data="summaryDetailData" :summaryDataList="summaryDataList"></flex-table>
				<flex-table :data="singleDetailData" :carDataList="carDataList" ref="carDataDom"></flex-table>
			</div>
			<charts-box ref="chartsBox"></charts-box>
			<summ-detail-list ref="summDetailList"></summ-detail-list>
		</div>
	</div>
</template>

<script>
	import flexTable from "./flexTable.vue";
	import chartsBox from "./chartsBox.vue";
	import dispatchServer from '../../api/dispatch.server';
	import summDetailList from "./summDetailList.vue";
	export default {
		name: 'rightContentBox',
		props:['calcResult','actualDataList','summaryDataList','carDataList'],
		components: {
		 flexTable,
		 chartsBox,
		 summDetailList
		},
		data() {
			return {
				dataList: [{
						value: '2022-02-04',
						times: ['2022-02-04', '2022-02-07', '2022-02-09', '2022-02-10']
					},
					{
						value: '2022-06-04',
						times: ['2022-06-04', '2022-06-07', '2022-06-09', '2022-06-10', '2022-06-15']
					},
				],
				CalcResult:[
					{type:'计算结果',value:'-'},
					{type:'阶段名称',value:'-'},
					{type:'累计测试天数',value:'-'},
					{type:'累计测试通过天数',value:'-'},
				],
				tableSummaryData:{
					title:'数据汇总',
					height:'200px'
				},
				summaryDetailData:{
					title:'汇总明细',
				},
				singleDetailData:{
					title:'单车明细',
				}
				
			}
		},
		methods: {
		
		},
		watch:{
			calcResult(value){
				this.CalcResult = value
			}
		}
	}
</script>

<style lang="scss">
	.contentBox{
		margin: 20px 10px 20px 20px;
		height: calc(100% - 80px);
		overflow-y: auto;
		.reportTitle {
			color: #8E96AC;
		}
		.CalcResults{
			display: flex;
			justify-content: space-between;
			// align-items: center;
			width: auto;
			min-width: 570px;
			max-width: 700px;
			height: 78px;
			background: #1B202F;
			border: 1px solid #101012;
			border-radius: 4px;
			color: #BFC8D8;
			font-size: 14px;
			padding-right: 55px;
			p:nth-child(2){
				color:#3C66ED ;
				font-size: 18px;
			}
			div{
				display: inline-block;
				width: auto;
				height: 100%;
				// text-align: center;
				padding-left: 20px;
				overflow: hidden;
				&:nth-child(1){
					background:rgba(53,58,74,.2);
					width: 117px !important;
					font-size: 16px;
					position: relative;
					left: -2px;
					text-align: center;
					padding: 0;
					p{
						display: block;
						line-height: 78px !important;
					}
				}
				p:nth-child(1){
					display: block;
					line-height: 38px;
					
				}
			}
			.noPass{
				background: rgba(255,49,49,.2) !important;
				color: #FF3131;
				width: 100%;
				height: 100%;
				position: relative;
				left: 2px;
			}
			.yesPass{
				background: rgba(73, 255, 23, 0.2) !important;
				color: #00C087;
				width: 100%;
				height: 100%;
				position: relative;
				left: 2px;
			}
			
		}
	}
	
</style>
