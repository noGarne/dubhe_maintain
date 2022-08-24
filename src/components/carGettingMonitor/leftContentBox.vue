<template>
<div class="content_center content_tabs left_content">
				<div class="reportTitle">
					<a>所选日期</a>
					<p></p>
				</div>
				<div class="btn_search search_change">
					<el-button  :class="ruleListData.length == 0 ? 'button-disabled btnBg btn-add' : 'btnBg btn-add'" @click="calculationEve">
						<i class="iconfont icon-jisuanqi"></i>运算
					</el-button>
					<el-button  :class="ruleListData.length == 0 ? 'button-disabled btnBg btn-add btnGray' : 'btnBg btn-add btnGray'" @click="resetEve">
						<i class="iconfont icon-zhongzhi themeOrangeColor"></i>重置
					</el-button>
					<el-button :class="ruleListData.length == 0 ? 'button-disabled btnBg btn-add btnGray' : 'btnBg btn-add btnGray'" @click="saveEve">
						<i class="iconfont icon-xinzeng themeOrangeColor"></i>保存规则
					</el-button>
				</div>
				<div class="calendarBox">
					
					<div v-for="(item) in dataList" class="calendarItem">
						<p class="monthDate">{{item.value.split('-')[0]+'年'+item.value.split('-')[1]+'月'}}</p>
						<el-calendar v-model="item.value">
							<template slot="dateCell" slot-scope="{date, data}">
								<p :class="successList.includes(data.day) ? 'is-success is-selected' : (item.times.includes(data.day)? 'is-selected' : '')">
									{{data.day == utils.formatDate(new Date()).split(' ')[0] ? '今' :data.day.split('-').slice(1)[1] }}
									<a class="carList" v-if="item.times.includes(data.day)" :style="{'width':(dateCarEve(data.day).length * 12)+ 'px'}">
										<a class="arrow-top"></a>
										{{dateCarEve(data.day)}}
									</a>
								</p>
							</template>
						</el-calendar>
					</div> 
					<!-- <div class="ruleList" v-for="item in ruleListData">
						<p>所选日期</p>
						<p class="listStyle">{{item.dataTime.substr(0, item.dataTime.length - 1).replace(/,/g,'、')}}</p>
						<p>所选车辆</p>
						<p class="listStyle">{{item.deviceName.substr(0, item.deviceName.length - 1).replace(/,/g,'、')}}</p>
					</div> -->
				</div>
			</div>
</template>

<script>
	import dispatchServer from '../../api/dispatch.server';
	import tableMixins from "@/common/mixins/table.mixins";
	import dispatchMixin from '@/common/mixins/dispatch.mixins.js';
	export default {
		name:'leftContentBox',
		props:['ruleListData','checkDateList'],
		mixins:[tableMixins,dispatchMixin],
		data(){
			return{
			  dataList: [],
			  searchArr:[],
			  successList:[]
			}
		},
		methods:{
			calculationEve(){
				// 点击运算之前需要对指标进行配置 否则无法进行下去
				if(!this.$parent.$refs.indexAllocation.stageFlag){
					 this.messages.error('请先对阶段、指标进行配置')
					 return
				}
				this.searchArr = [];
				this.ruleListData.forEach(i=>{
					console.log(i)
					this.searchArr.push({
						miningArea:this.subareaSn,
						uniqueId:i.uniqueId,
						dataTime:i.dataTime.replace(/、/g,','),
						stageId:this.$parent.$refs.indexAllocation.stageFlag
					})
				})
				this.countTestEve(this.searchArr)
				this.CalendarDetailsEve(this.searchArr)
				this.detailsOfDailyEve(this.searchArr)
			},
			resetEve(){
				this.$parent.ruleListData = [];
				this.$parent.checkDateList = [];
				this.successList = [];
				this.$parent.$refs.conditionAdd.historyValue = '';
			},
			saveEve(){
				this.$parent.$refs.conditionAdd.openAddDialog(2)
			},
			//运算结果 数据汇总查询
			async countTestEve(e) {
				try {
					var result = await dispatchServer.countTestEve(e);
					console.log(result)
					let calcResult = [
						{type:'计算结果',value:result.isPass},
						{type:'阶段名称',value:result.stageName},
						{type:'累计测试天数',value:result.lengthTestDays},
						{type:'累计测试通过天数',value:result.passDays},
					]
					let actualDataList = [result.listForStand,result.listForAct];
					this.$parent.calcResult = calcResult;
					this.$parent.actualDataList = actualDataList;
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			dateCarEve(e){
				let str = '';
				this.ruleListData.forEach(i=>{
					if(i.dataTime.includes(e)){
						str = i.deviceName.substr(0, i.deviceName.length - 1)
					}
				})
				return str.replace(/,/g,"、")
			},
			//汇总明细查询
			async CalendarDetailsEve(e) {
				try {
					var result = await dispatchServer.CalendarDetailsEve(e) || [];
					result.forEach(c=>{
						if(!!c.flag){
							this.successList.push(c.dataTime)
						}
					})
					this.$parent.summaryDataList = result;
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			//单车明细查询
			async detailsOfDailyEve(e = this.searchArr) {
				let data = JSON.parse(JSON.stringify(e))
				data.forEach(i=>{
					i.pageNum = this.$parent.$refs.rightContentBox.$refs.carDataDom.pageInit.pageIndex;
					i.pageSize = this.$parent.$refs.rightContentBox.$refs.carDataDom.pageInit.pageSize;
					i.sort = this.$parent.$refs.rightContentBox.$refs.carDataDom.sort.sort;
					i.sortName = this.$parent.$refs.rightContentBox.$refs.carDataDom.sort.sortName;
				})
				try {
					console.log(data)
					var result = await dispatchServer.detailsOfDailyEve(data) || [];
					this.$parent.carDataList = result.content;
					this.$parent.$refs.rightContentBox.$refs.carDataDom.pageInit.total = result.totalElements;
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			// 汇总明细导出
			async excelExportForCalendar(e = this.searchArr) {
				try {
					var result = await dispatchServer.excelExportForCalendar(e) || [];
					let blob=new Blob([result], {type:'application/vnd.ms-excel'});
					let oA=document.createElement('a');
					oA.href=URL.createObjectURL(blob);
					oA.download=name;
					oA.click();
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			//单车明细导出
			async excelExportForEveryDayEachIndexCalendar(e = this.searchArr){
				let data = JSON.parse(JSON.stringify(e))
				data.forEach(i=>{
					i.pageNum = this.$parent.$refs.rightContentBox.$refs.carDataDom.pageInit.pageIndex;
					i.pageSize = 1000;
				})
				try {
					var result = await dispatchServer.excelExportForEveryDayEachIndexCalendar(data) || [];
					let blob=new Blob([result], {type:'application/vnd.ms-excel'});
					let oA=document.createElement('a');
					oA.href=URL.createObjectURL(blob);
					oA.download=name;
					oA.click();
				} catch (e) {
					this.messages.error(e.message)
				}
			},
		}
	}
</script>

<style lang="scss">
	.content_center{
		.reportTitle{
			color:#8E96AC ;
		}
		.search_change{
			width: 90%;
			left: -2px !important;
			padding: 0 22px;
			position: inherit !important;
			top: 0px !important;
			margin-top: 20px;
			button{
				padding-right: 12px;
			}
		}
		.calendarBox{
			padding: 0 12px 0 19px;
			width: 98%;
			height: calc(100% - 130px);
			overflow-y: auto;
			margin-top: 20px;
			overflow-x: hidden;
			.ruleList{
				background: #1c2232;
				border: 1px solid #101012;
				border-radius: 4px;
				color: #BFC8D8;
				padding: 0 10px 10px 10px;
				margin-top: 20px;
				font-size: 14px;
				&:first-child{
					margin-top: 0 !important;
				}
				p{
					padding-top: 10px;
				}
				.listStyle{
					line-height: 25px;
				}
			}
			.calendarItem{
				padding: 5px 0;
			}
		}
	}
	
</style>
