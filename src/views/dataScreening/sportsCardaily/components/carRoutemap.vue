<template>
	<div>
	<!-- <div class="reportTitle">
		<a>跑车运行图</a>
		
	</div> -->
	<!-- <div class="timeRuleList">
		<span :class="timeRuleCheckIndex == index ? 'checkStyle' : ''" v-for="(item,index) in timeRuleList" @click="timeRuleEve(index)">
			{{item}}
		</span>
	</div> -->
	<div class="carRoutemap">
		
		<div class="carRoutemap_action">
			<div class="btn_search">
				<el-button type="primary" @click="onManual">手工录入</el-button>
			</div>
		
		</div>
		<div class="carRoutemap_action" style="margin-top: 20px;">
		<div class="filterBox">
			<div class="takeOverList">
					<el-checkbox v-model="takeOverList" @change="checkBoxChange">干预次数</el-checkbox>
			</div>
			<div class="takeOverList">
					
					<el-checkbox v-model="interveneList" @change="checkBoxChange">接管次数</el-checkbox>
			</div>
			<div class="faultList">
				<div class="checkAllBut">
					<el-checkbox :indeterminate="isIndeterminate" v-model="faultCheckAll"
						@change="handleCheckAllChange">故障次数</el-checkbox>
				</div>
				<el-checkbox-group v-model="checkList" @change="handleCheckedCitiesChange">
					<el-checkbox :label="1" class="faultStyle">一级故障</el-checkbox>
					<el-checkbox :label="2">二级故障</el-checkbox>
					<el-checkbox :label="3">三级故障</el-checkbox>
				</el-checkbox-group>
			</div>
				<div class="errorStatus">
				<el-checkbox v-model="errorStatus" @change="checkBoxChange">异常次数</el-checkbox>
			</div>
			<div class="taskStatus">
				<el-checkbox v-model="taskStatus" @change="checkBoxChange">任务状态</el-checkbox>
				<div class="taskStatusBox" v-show="taskStatus">
					<span v-for="item in taskStatusList">
						<a :style="{background:item.color}"></a>
						{{item.name}}
					</span>
				</div>
			</div>
			<div class="driverStatus">
				<el-checkbox v-model="driverStatus" @change="checkBoxChange">驾驶模式</el-checkbox>
				<div class="taskStatusBox" v-show="driverStatus">
					<span v-for="item in driverStatusList">
						<a :style="{background:item.color}"></a>
						{{item.name}}
					</span>
				</div>
			</div>
		</div>
		</div>
		<div class="carRoutemap_table" v-for="(item,index) in deviceList"  :id="'canvasReport'+item.carName">
			<div class="tableLabelHead" >
				<div class="carRoutemap_table_col">
					<span>
						<img src="@/common/images/type-kache.png" alt="">
						{{ item.carName }}
						<i class="iconfont icon-xiazai"  @click="exportCanvas('canvasReport'+item.carName)" title="导出图片以及excel"></i>
					</span>
				</div>
				<div class="carRoutemap_table_col" v-show="takeOverList">
					<span>
						<div class="green">
							<img src="@/common/images/takeover.png" alt="">
						</div>
						<a>干预次数</a>
						<span>{{item.takeoverList && item.takeoverList.length || 0}}</span>
					</span>
				</div>
				<div class="carRoutemap_table_col" v-show="interveneList">
					<span>
						<div class="yellowGreen">
							<img src="@/common/images/intervene.svg" alt="">
						</div>
						<a>接管次数</a>
						<span>{{item.dateListTakeOverDataNew && item.dateListTakeOverDataNew.length || 0}}</span>
					</span>
				</div>
				<div class="carRoutemap_table_col">
					<span>
						<div class="red">
							<img src="@/common/images/fault.png" alt="">
						</div>
						<a>故障次数</a>
						<span>{{item.faultList && item.faultList.length || 0}}</span>
					</span>
				</div>
				<div class="carRoutemap_table_col" v-show="errorStatus">
					<span>
						<div class="blue">
							<img src="@/common/images/error.png" alt="">
						</div>
						<a>异常次数</a>
						<span>{{(item.errorList && item.errorList.length) || 0}}</span>
					</span>
				</div>
				<div class="carRoutemap_table_col" v-show="taskStatus">
					<span>
						<div class="yellow">
							<img src="@/common/images/status.png" alt="">
						</div>
						<a>任务状态</a>
						<!-- <span>{{(item.errorList && item.errorList.length) || 0}}</span> -->
					</span>
				</div>
				<div class="carRoutemap_table_col" v-show="driverStatus">
					<span>
						<div class="pink">
							<img src="@/common/images/takeoIcon.png" alt="">
						</div>
						<a>驾驶模式</a>
						<!-- <span>{{(item.errorList && item.errorList.length) || 0}}</span> -->
					</span>
				</div>
			</div>
			<div class="tableLabelContent" :ref="'scrollBoxDom' + index" >
				<div class="contentCenterBox" :style="{'width':(timeData.length-1)*120.3+'px'}" >
					<div class="carRoutemap_table_row" :style="{'width':(timeData.length-1)*120.3+'px'}">
						<div class="carRoutemap_table_time" v-for="(item, index) in timeData" :key="index">
							<span>{{ item }}</span>
						</div>
					</div>
					<div class="carRoutemap_table_row addMoreStyle" :style="{'width':(timeData.length-1)*120.3+'px'}">
						<div class="workTimeSlot workTimeFlag" v-for="(it,inde) in item.workTimeSlot"
							:style="{'width':(new Date(it.end) - new Date(it.start))/864000+'%','left':((86400000 - (new Date(it.end.split(' ')[0] + ' 23:59:59') - new Date(it.start)))/864000) + '%'}"
							>
						</div>
						<div class="workTimeSlot workTimeFlag workTimeFlagBack" v-for="(it,inde) in item.workTimeSlot"
							:style="{'width':(new Date(it.end) - new Date(it.start))/864000+'%','left':((86400000 - (new Date(it.end.split(' ')[0] + ' 23:59:59') - new Date(it.start)))/864000) + '%'}"
							:ref="'time'+item.carName+inde"
							@mouseover="operationUpEve(it,'time'+item.carName+inde)"
							@mouseout="operationoutEve(it,'time'+item.carName+inde)"
							@mousemove="dataDetailsRight($event)"
							>
							<div class="showBox minWidth" 
								v-show="it.showFlag">
								<div class="arrow-top" @mouseover="it.showFlag = true"></div>
								<div class="hoverTitle">运营时间</div>
								<div class="timeSlot noMargin">
									{{it.start.split(' ')[1]+"~"+ it.end.split(' ')[1]}}
								</div>
							</div>
						</div>
						<div v-for="(it, index) in timeData.length-1" :key="index" :class="index == 0 ? 'carRoutemap_table_col noLeftBorder' : 'carRoutemap_table_col'">

						</div>
						
					</div>
					<div class="carRoutemap_table_row no_border_row" :style="{'width':(timeData.length-1)*120.3+'px'}" v-show="takeOverList">
						<div  v-for="(it, index) in timeData.length-1"
							:key="index"
							:class="index == timeData.length-2 ? 'carRoutemap_table_col no_border_col lastBorder' : 'carRoutemap_table_col no_border_col'"
							>

						</div>
						<div class="operationList takeoverStyle" v-for="(it,inde) in item.takeoverList"
							:ref="'takeover'+item.carName+inde"
							:style="{'width':(new Date(it.end) - new Date(it.start))/864000+'%','left':((86400000 - (new Date(it.end.split(' ')[0] + ' 23:59:59') - new Date(it.start)))/864000) + '%'}"
							@mouseover="operationUpEve(it,'takeover'+item.carName+inde)"
							@mouseout="operationoutEve(it,'takeover'+item.carName+inde)"
							@mousemove="dataDetailsRight($event)"
							>
							<div class="showBox" :style="{'width':(it.title && it.title.length * 14)+40 + 'px'}"
								v-show="it.showFlag">
								<div class="arrow-top" @mouseover="it.showFlag = true"></div>
								<div class="boxStyle green">
									<img src="@/common/images/takeover.png" alt="">
								</div>
								<div class="hoverTitle">{{it.title}}</div>
								<div class="timeSlot">
									{{it.start.split(' ')[1]+"~"+ it.end.split(' ')[1]}}
								</div>
							</div>
						</div>

					</div>
					
					<div class="carRoutemap_table_row no_border_row" :style="{'width':(timeData.length-1)*120.3+'px'}" v-show="interveneList">
						<div  v-for="(it, index) in timeData.length-1"
							:key="index"
							:class="index == timeData.length-2 ? 'carRoutemap_table_col no_border_col lastBorder' : 'carRoutemap_table_col no_border_col'"
							>
					
						</div>
						<div class="operationList interveneStyle" v-for="(it,inde) in item.dateListTakeOverDataNew"
							:ref="'intervene'+item.carName+inde"
							:style="{'width':(new Date(it.end) - new Date(it.start))/864000+'%','left':((86400000 - (new Date(it.end.split(' ')[0] + ' 23:59:59') - new Date(it.start)))/864000) + '%'}"
							@mouseover="operationUpEve(it,'intervene'+item.carName+inde)"
							@mouseout="operationoutEve(it,'intervene'+item.carName+inde)"
							@mousemove="dataDetailsRight($event)"
							>
							<div class="showBox" :style="{'width':(it.title && it.title.length * 14)+40 + 'px'}"
								v-show="it.showFlag">
								<div class="arrow-top" @mouseover="it.showFlag = true"></div>
								<div class="boxStyle yellowGreen">
									<img src="@/common/images/intervene.svg" alt="">
								</div>
								<div class="hoverTitle">{{it.title}}</div>
								<div class="timeSlot">
									{{it.start.split(' ')[1]+"~"+ it.end.split(' ')[1]}}
								</div>
							</div>
						</div>
					
					</div>
					
					<div class="carRoutemap_table_row no_border_row" :style="{'width':(timeData.length-1)*120.3+'px'}">
						<div  v-for="(it, index) in timeData.length-1"
							:key="index"
							:class="index == timeData.length-2 ? 'carRoutemap_table_col no_border_col lastBorder' : 'carRoutemap_table_col no_border_col'"
							>

						</div>
						<div class="operationList faultStyle" v-for="(it,inde) in item.faultList"
							:ref="'fault'+item.carName+inde"
							:style="{'width':(new Date(it.end) - new Date(it.start))/864000+'%','left':((86400000 - (new Date(it.end.split(' ')[0] + ' 23:59:59') - new Date(it.start)))/864000) + '%'}"
							@mouseover="operationUpEve(it,'fault'+item.carName+inde)"
							@mouseout="operationoutEve(it,'fault'+item.carName+inde)"
							@mousemove="dataDetailsRight($event)">
							<!-- <transition name="fade"> -->
							<div class="showBox topArrow"
								:style="{'width':(it.title && it.title.length * 14)+40 + 'px'}" v-show="it.showFlag">
								<div class="arrow-top" @mouseover="it.showFlag = true"></div>
								<div class="boxStyle red">
									<img src="@/common/images/fault.png" alt="">
								</div>
								<div class="hoverTitle">{{it.title}}</div>
								<div class="timeSlot">
									{{it.start.split(' ')[1]+"~"+ it.end.split(' ')[1]}}
								</div>

							</div>
							<!-- </transition> -->
						</div>
					</div>
					<div class="carRoutemap_table_row no_border_row" :style="{'width':(timeData.length-1)*120.3+'px'}" v-show="errorStatus">
						<div  v-for="(it, index) in timeData.length-1"
							:key="index"
							:class="index == timeData.length-2 ? 'carRoutemap_table_col no_border_col lastBorder' : 'carRoutemap_table_col no_border_col'"
							>

						</div>
						<div class="operationList errorStyle" v-for="(it,inde) in item.errorList"
							:ref="'error'+item.carName+inde"
							:style="{'width':(new Date(it.end) - new Date(it.start))/864000+'%','left':((86400000 - (new Date(it.end.split(' ')[0] + ' 23:59:59') - new Date(it.start)))/864000) + '%'}"
							@mouseover="operationUpEve(it,'error'+item.carName+inde)"
							@mouseout="operationoutEve(it,'error'+item.carName+inde)"
							@mousemove="dataDetailsRight($event)"
							>
							<!-- <transition name="fade"> -->
							<div class="showBox topArrow"
								:style="{'width':(it.title && it.title.length * 14)+40 + 'px'}" v-show="it.showFlag">
								<div class="arrow-top" @mouseover="it.showFlag = true"></div>
								<div class="boxStyle blue">
									<img src="@/common/images/error.png" alt="">
								</div>
								<div class="hoverTitle">{{it.title}}</div>
								<div class="timeSlot">
									{{it.start.split(' ')[1]+"~"+ it.end.split(' ')[1]}}
								</div>

							</div>
							<!-- </transition> -->
						</div>
					</div>
					<div class="carRoutemap_table_row no_border_row" :style="{'width':(timeData.length-1)*120.3+'px'}" v-if="taskStatus">
						<div  v-for="(it, index) in timeData.length-1"
							:key="index"
							:class="index == timeData.length-2 ? 'carRoutemap_table_col no_border_col lastBorder' : 'carRoutemap_table_col no_border_col'"
							>
					
						</div>
						<div class="operationList errorStyle" v-for="(it,inde) in item.workTimes"
							:ref="'status'+item.carName+inde"
							:style="{'width':(new Date(it.end) - new Date(it.start))/864000+'%','left':((86400000 - (new Date(it.end.split(' ')[0] + ' 23:59:59') - new Date(it.start)))/864000) + '%','background':taskStatusList.find(c=> c.name == it.title).color}"
							@mouseover="operationUpEve(it,'status'+item.carName+inde)"
							@mouseout="operationoutEve(it,'status'+item.carName+inde)"
							@mousemove="dataDetailsRight($event)"
							>
							<!-- <transition name="fade"> -->
							<div class="showBox topArrow"
								:style="{'width':(it.title && it.title.length * 14)+40 + 'px'}" v-show="it.showFlag">
								<div class="arrow-top" @mouseover="it.showFlag = true"></div>
								<div class="boxStyle smallBoxStyle" :style="{'background':it.color}">
								
								</div>
								<div class="hoverTitle specialStyle">
									{{it.title}}
									<a>{{it.totalTime}}</a>
								</div>
								<div class="timeSlot">
									{{it.start.split(' ')[1]+"~"+ it.end.split(' ')[1]}}
								</div>
					
							</div>
							<!-- </transition> -->
						</div>
					</div>
					<div class="carRoutemap_table_row no_border_row" :style="{'width':(timeData.length-1)*120.3+'px'}" v-if="driverStatus">
						<div  v-for="(it, index) in timeData.length-1"
							:key="index"
							:class="index == timeData.length-2 ? 'carRoutemap_table_col no_border_col lastBorder' : 'carRoutemap_table_col no_border_col'"
							>
						</div>
						<div class="operationList errorStyle" v-for="(it,inde) in item.drivingModeList"
							:ref="'driver'+item.carName+inde"
							:style="{'width':(new Date(it.end) - new Date(it.start))/864000+'%','left':((86400000 - (new Date(it.end.split(' ')[0] + ' 23:59:59') - new Date(it.start)))/864000) + '%','background':driverStatusList.find(c=> c.name == it.title).color}"
							@mouseover="operationUpEve(it,'driver'+item.carName+inde)"
							@mouseout="operationoutEve(it,'driver'+item.carName+inde)"
							@mousemove="dataDetailsRight($event)">
							<!-- <transition name="fade"> -->
							<div class="showBox topArrow"
								:style="{'width':(it.title && it.title.length * 14)+40 + 'px'}" v-show="it.showFlag">
								<div class="arrow-top" @mouseover="it.showFlag = true"></div>
								<div class="boxStyle smallBoxStyle" :style="{'background':it.color}">
									
								</div>
								<div class="hoverTitle specialStyle">
								{{it.title}}
								<a>{{it.totalTime}}</a>
								</div>
								<div class="timeSlot">
									{{it.start.split(' ')[1]+"~"+ it.end.split(' ')[1]}}
								</div>
							</div>
							<!-- </transition> -->
						</div>
					</div>
					
					<div class="workTimeSlot" v-for="it in item.workTimeSlot"
						:style="{'width':(new Date(it.end) - new Date(it.start))/864000+'%','left':((86400000 - (new Date(it.end.split(' ')[0] + ' 23:59:59') - new Date(it.start)))/864000) + '%','background':it.color}">
					</div>
				</div>
			</div>
		</div>
		<manual-entry ref="manualEntry"></manual-entry>
	</div>
	</div>
</template>

<script>
	import ManualEntry from './manualEntry.vue';
	import html2Canvas from 'html2canvas';
	import dispatchServer from '@/api/dispatch.server';
	export default {
		name: 'carRoutemap',
		data() {
			return {
				checkList: [1],
				timeData: [],
				timeRuleOne:[
					['00:00','02:00','04:00','06:00','08:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00','24:00'],
					['00:00', '00:40', '01:20', '02:00', '02:40', '03:20', '04:00', '04:40', '05:20', '06:00', '06:40', '07:20', '08:00', '08:40', '09:20', '10:00', '10:40', '11:20', '12:00', '12:40', '13:20', '14:00', '14:40', '15:20', '16:00', '16:40', '17:20', '18:00', '18:40', '19:20', '20:00', '20:40', '21:20', '22:00', '22:40', '23:20', '24:00'],
					['00:00', '00:20','00:40','01:00', '01:20','01:40', '02:00','02:20', '02:40','03:00', '03:20','03:40', '04:00','04:20', '04:40','05:00', '05:20','05:40', '06:00', '06:20','06:40','07:00', '07:20','07:40', '08:00','08:20', '08:40','09:00', '09:20','09:40', '10:00','10:20', '10:40','11:00', '11:20','11:40', '12:00','12:20', '12:40','13:00', '13:20','13:40', '14:00','14:20', '14:40','15:00', '15:20', '15:40','16:00','16:20', '16:40','17:00', '17:20','17:40', '18:00','18:20', '18:40','19:00', '19:20', '19:40','20:00','20:20', '20:40','21:00', '21:20','21:40', '22:00','22:20', '22:40','23:00', '23:20', '23:40','24:00']
					],
				deviceList: [],
				takeOverList: true,
				interveneList:false,
				errorStatus: true,
				faultCheckAll: true,
				isIndeterminate: true,
				taskStatus: false,
				driverStatus: false,
				faultCheckList: [1, 2, 3],
				taskStatusList: [{
						name: '空载',
						color: '#57C745'
					},
					{
						name: '重载',
						color: '#e89f2b'
					},
					{
						name: '装载',
						color: '#008aff'
					},
					{
						name: '卸载',
						color: '#604ace'
					},
					{
						name: '无任务',
						color: '#fa4444'
					}
				],
				driverStatusList: [{
						name: '自动',
						color: '#604ace'
					},
					{
						name: '人工',
						color: '#39CCFC'
					},
					{
						name: '远程',
						color: '#FF7E00'
					},
				]

			}
		},
		components: {
			ManualEntry
		},
		methods: {
			onManual() {
				this.$refs.manualEntry.openOrCloseDialog();
			},
			operationUpEve(e, c) {
				e.showFlag = true;
				this.$refs[c][0].style.zIndex = 25;
				this.$refs[c][0].parentNode.style.zIndex = 30;
			},
			async exportSportDataTableEve(e) {
				let parent = this.$parent.$parent.$parent;
				try {
					var data = {
						miningArea: parent.subareaSn,
						startTime:parent.form.startTime,
						faultLevel:parent.$refs.carRoutemap.checkList
					}
					var result = await dispatchServer.exportSportDataTableEve(data);
					let blob=new Blob([result], {type:'application/vnd.ms-excel'});
					let oA=document.createElement('a');
					oA.href=URL.createObjectURL(blob);
					oA.download=e.slice(12)+'跑车运行图';
					oA.click();
				} catch (e) {
					this.messages.error(e.message)
				}
			},
			operationoutEve(e, c) {
				e.showFlag = false;
				this.$refs[c][0].style.zIndex = 11;
				this.$refs[c][0].parentNode.style.zIndex = 20;
			},
			checkBoxChange() {
				this.$parent.$parent.$parent.reportFormEve()
			},
			handleCheckAllChange(val) {
				this.checkList = val ? this.faultCheckList : [];
				this.isIndeterminate = false;
				this.checkBoxChange()
			},
			handleCheckedCitiesChange(value) {
				let checkedCount = value.length;
				this.faultCheckAll = checkedCount === this.faultCheckList.length;
				this.isIndeterminate = checkedCount > 0 && checkedCount < this.faultCheckList.length;
				this.checkBoxChange()
			},
			timeRuleEve(e){
				if(!this.$parent.$parent.$parent.form.startTime){
					this.messages.error('请选择时间')
					return
				}
				this.$parent.$parent.$parent.timeRuleCheckIndex = e;
				this.$nextTick(()=>{
					this.timeData = this.timeRuleOne[e]
				})
				this.$parent.$parent.$parent.scrollToEve(e);
			},
			exportCanvas(e){
				html2Canvas(document.querySelector("#"+e),{backgroundColor:'#1b202f'}).then(canvas => {
				    let dataURL = canvas.toDataURL("image/png");
				        if (dataURL !== "") {
				            var a = document.createElement('a')
				            a.download = e.slice(12)+'跑车运行图';
				            a.href = dataURL;
				            a.click()
				        }
				    }).then((c)=>{
						this.exportSportDataTableEve(e);
					})	
			},
			dataDetailsRight(e){
				if(["operationList takeoverStyle","workTimeSlot workTimeFlag workTimeFlagBack","operationList interveneStyle"].includes(e.target._prevClass)){
					e.currentTarget.firstChild.style.left = e.offsetX+'px';
					e.currentTarget.firstChild.style.top = e.offsetY+13+'px';
				}else if(["operationList faultStyle","operationList errorStyle"].includes(e.target._prevClass)){
					e.currentTarget.firstChild.style.left = e.offsetX+'px';
					e.currentTarget.firstChild.style.top = e.offsetY-63+'px';
				}
			}
		},
		mounted() {
			this.timeData = this.timeRuleOne[1]
		}
	}
</script>

<style lang="scss" scoped>
	@mixin boxFlex {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	/deep/ .el-button {
		background: #ff5900;
		border-radius: 3px;
		color: #ffffff;
		border: none;
	}
	
	.carRoutemap {
		padding: 20px 20px 20px 20px;
		overflow: hidden;
		.carRoutemap_action {
			// @include boxFlex();
			height: 32px;
			.btn_search {
				position: inherit !important;
				width: 100px;
				float: left;
			}

			.filterBox {
				height: 32px;
				line-height: 32px;

				div {
					display: inline-block;
					height: 100%;
					background: #1b202f;
					border-radius: 3px;
					padding: 0 10px;
					margin-right: 20px;

					/deep/ .el-checkbox__label {
						color: #ffffff !important;
					}

					&.takeOverList {
						// margin-left: 40px;
						margin-right: 20px;
					}

					&.faultList {
						/deep/ .checkAllBut {
							padding: 0 20px 0 0px;
							margin-right: 0 !important;
						}

						/deep/ .el-checkbox-group {
							margin-right: 0 !important;

							label .el-checkbox__label {
								font-size: 12px !important;
							}
						}
					}
				}

				.taskStatusBox {
					color: #FFFFFF;
					font-size: 12px;
					margin: 0;
					padding-right: 0 !important;

					span {
						padding: 0 5px;

						a {
							width: 8px;
							height: 8px;
							display: inline-block;
							position: relative;
							top: 1px;
							right: 1px;
						}
					}
				}
			}

			.el-checkbox-group {
				.el-checkbox {
					color: #D7D7D7;
				}
			}
		}
	}

	.carRoutemap_table {
		width: 99%;
		margin-top: 30px;
		position: relative;
		overflow: hidden;

		.tableLabelHead {
			width: 142.73px;
			float: left;
			margin-top: 19px;

			.carRoutemap_table_col {
				background: rgba(40, 54, 98, 1);
				width: 142.64px;
				min-width: 142.64px !important;
				height: 30px;
				border: 1px solid rgba(114, 122, 137, 1);
				border-right: 1px solid rgba(114, 122, 137, 1);
				border-top: none;
				// text-align: center;
				line-height: 30px;
				background: rgba(114, 122, 137, 0);
				color: #878fa5;
				font-size: 13px;

				span {
					color: rgba(135, 143, 165, 1);
					font-size: 13px;
					padding-left: 8px !important;
					position: relative;

					span {
						position: absolute;
						right: 5px;
						font-size: 20px;
						color: rgba(255, 255, 255, 1);
						font-weight: 400;
						font-family: Bebas Neue, Bebas Neue-Regular;
					}
					i{
						cursor: pointer;
						position: absolute;
						right: 3%;
					}
				}

				span {
					padding-left: 10px;
					display: flex;
					height: 100%;
					align-items: center;

					div {
						display: inline-block;
						width: 14px;
						height: 14px;
						display: flex;
						justify-content: space-around;
						align-items: center;
						border-radius: 3px;
						margin-right: 8px;
						font-size: 14px;

						img {
							padding: 0;
							width: 14px;
							height: 14px;
						}

						&.green {
							background: #04aa7b;
						}

						&.red {
							background: rgba(255, 69, 69, 1);
						}
						&.yellowGreen {
							background: rgba(139,184,0,1);
							img{
								width: 11px;
							}
						}
						
						&.blue {
							background: rgba(0, 138, 255, 1);
						}
						&.yellow {
							background: #FFAF00;
						}
						&.pink {
							background: #604ACE;
						}
					}

					img {
						padding-right: 10px;
					}
				}

				&:nth-child(1) {
					span {
						font-size: 16px;
						border-top: 1px solid rgba(114, 122, 137, 1);
						background: #283662;
						color: #ffffff;
						position: relative;
					}
				}
				&:last-child {
						
						
				}
			}
		}

		.tableLabelContent {
			width: calc(100% - 142.73px);
			float: left;
			overflow-x: scroll;
			overflow-y: hidden;
			padding-bottom: 7px;

			.contentCenterBox {
				position: relative;
				overflow: hidden;
				max-width: 8658px;
			}

			&::-webkit-scrollbar {
				height: 12px;
			}
		
		}

		.workTimeSlot {
			position: absolute;
			height: 88px;
			background: rgba(28, 55, 86, 1);
			top: 50px;
			z-index: 9;
			&.workTimeFlag{
				height: 28px;
				top: 20px;
				z-index: 8;
				background: #1c4a7d;
				&.workTimeFlagBack{
					background: transparent;
					z-index: 50;
				}
			}
		}

		.carRoutemap_table_row {
			// width: 100%;
			z-index: 11;
			// @include boxFlex();
			display: -webkit-box;

			.carRoutemap_table_time {
				width: 120.25px;
				color: #8E96AC;
				text-align: left;

				span {
					display: block;
					margin-left: -20px;
				}

				&:nth-last-of-type(1) {
					width: 0%;
				}

				&:first-child {
					padding-left: 19px;
				}
				&:last-child {
					span{
						position: relative;
						right: 16px;
					}
				}
			}

			&.addMoreStyle {
				.carRoutemap_table_col {
					&:last-child {
						border-right: 1px solid #727a89;
						// width: 122.25px;
					}
					&:first-child{
						padding-left: 30px;
					}
					
				}
			}
		

			.carRoutemap_table_col {
				width: 120.25px;
				min-width: 120.25px;
				height: 30px;
				border: 1px solid rgba(114, 122, 137, 1);
				border-right: none;
				// text-align: center;
				line-height: 30px;
				position: relative;
				z-index: 10;
				
				span {
					color: #ffffff;
					font-weight: 500;
					font-size: 16px;
				}

				&:nth-last-of-type(1) {}
				&:last-child{
					border-right: 1px solid rgba(114, 122, 137, 1);
				}
				&.no_border_col {
					border-top: none;
					border-right: none;
					border-left: none;
				}
				&:nth-child(1){
					border-left:none;
				}
				&.noLeftBorder{
					border-left: none;
				}
				&.lastBorder{
					border-right: 1px solid #727a89;
				}
			}

			&.no_border_row {
				// border-left: 1px solid #727a89;
				// border-right: 1px solid #727a89;
				position: relative;
				
				.operationList {
					position: absolute;
					height: 29px;
					top: 0;
					z-index: 11;
					min-width: 1px;

					&:hover .showBox {
						display: block;
					}

					&.takeoverStyle {
						background: rgba(4, 170, 123, 1);
						z-index: 12;
					}
					&.interveneStyle {
						background: rgba(139,184,0,1);
						z-index: 12;
					}
					&.faultStyle {
						background: rgba(255, 69, 69, 1);
						z-index: 11;
					}

					&.errorStyle {
						background: rgba(0, 138, 255, 1);
						z-index: 10;
					}

					
				}

				.no_border_col {
					&:first-child {
						// border-right: 1px solid #727a89;
						background: rgba(114, 122, 137, 0);

					}
				}
			}
		}
		.showBox {
			box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.30);
			background: #353a4a;
			padding: 7px;
			border: 1px solid #101012;
			border-radius: 5px;
			position: absolute;
			top: 100%;
			left: 50%;
			min-width: 152px;
			// min-width: 100px;
			transform: translate(-50%, 0%);
			z-index: 1000;
		
			// display: flex !important;
			// align-items: center;
			.arrow-top {
				font-size: 0;
				line-height: 0;
				border-width: 10px;
				border-color: #353A4A;
				border-top-width: 0;
				border-style: dashed;
				border-bottom-style: solid;
				border-left-color: transparent;
				border-right-color: transparent;
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -330%);
			}
		
			.boxStyle {
				display: inline-block;
				width: 14px;
				height: 14px;
				align-items: center;
				border-radius: 3px;
				margin-right: 8px;
				font-size: 14px;
				justify-content: space-around;
				align-items: center;
				display: flex;
				float: left;
				position: relative;
				top: 3px;
				&.smallBoxStyle{
					width: 8px;
					height: 8px;
					border-radius: 0px;
					top: 6px;
					left: 3px;
				}
				&.green {
					background: #04AA7B;
				}
				&.yellowGreen {
					background: rgba(139,184,0,1);

				}
				&.red {
					background: #FF4545;
				}
		
				&.blue {
					background: #008AFF;
				}
			}
		
			.timeSlot {
				color: #8E96AC;
				font-size: 13px;
				padding-left: 20px;
				&.noMargin{
					padding-left: 0;
				}
			}
		
			.hoverTitle {
				display: inline-block;
				color: #D7D7D7;
				font-size: 14px;
				min-width: 111px;
				a{
					float: right;
					font-size: 13px;
				}
				&.specialStyle{
					min-width: 117px;
					padding-left: 4px;
				}
			}
		
			&.topArrow {
				top: -180%;
		
				.arrow-top {
					transform: translate(-50%, -330%) rotate(180deg);
					top: 163% !important;
				}
		
			}
			&.minWidth{
				min-width: 110px;
			}
		}
	}
</style>
