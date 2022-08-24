<template>
	<div>
		<div class="cardata" v-if="tabCheckIndex == '2'">
			<div class="cardata_row">
				<div class="cardata_col itemThree">
					<div class="cardata_left">
						<div class="cardata_col_img">
							<i class="iconfont icon-cheliangshu"></i>
						</div>
						<div class="cardata_col_text">
							<h4>运营车辆/总车辆</h4>
							<p>
								<span class="white">{{numList.numberOfVehicle}}</span>
							</p>
						</div>
					</div>
					<div class="cardata_right">
						<el-progress type="circle" :percentage="numList.numberOfVehicleRate" :width="60" color="#00777B"
							:stroke-width="9">
						</el-progress>
					</div>
				</div>
				<div class="cardata_col cardata_col_center itemThree">
					<div class="cardata_left">
						<div class="cardata_col_img">
							<i class="iconfont icon-shichang"></i>
						</div>
						<div class="cardata_col_text">
							<h4>
								总自动驾驶时长/总运营时长(h)
								<el-tooltip popper-class="tooltip" placement="top">
									<i class="iconfont icon-shuoming"></i>
									<div slot="content" class="tooltip-content">
										<div>总自动驾驶时长/总运行时长(h)</div>
									</div>
								</el-tooltip>
							</h4>
							<p>
								<span class="white">{{numList.autoTotalTimeAndRunTime}}</span>
							</p>
						</div>
					</div>
					<div class="cardata_right">
						<el-progress type="circle" :percentage="numList.autoAndRunRate" :width="60" color="#00777B"
							:stroke-width="9"></el-progress>
					</div>
				</div>
				<div class="cardata_col itemThree">
					<div class="cardata_left">
						<div class="cardata_col_img">
							<i class="iconfont icon-paochetangci"></i>
						</div>
						<div class="cardata_col_text">
							<h4>
								自动驾驶跑车趟次
								<el-tooltip popper-class="tooltip" placement="top">
									<i class="iconfont icon-shuoming"></i>
									<div slot="content" class="tooltip-content">
										<div>自动驾驶跑车趟次</div>
									</div>
								</el-tooltip>
							</h4>
							<p>
								<span class="white">{{numList.wholePocesTime}}</span>
							</p>
						</div>
					</div>
					<div class="cardata_right">
						<h4>前日环比</h4>

						<div
							:class=" numList.wholePocesTimeRate > 1 ? 'scale scaledown' : (numList.wholePocesTimeRate == '-'|| numList.wholePocesTimeRate == 0  ? 'scale' : 'scale scaleup')">
							<i
								:class=" numList.wholePocesTimeRate > 1 ? 'iconfont icon-xiangshang' : (numList.wholePocesTimeRate == '-' || numList.wholePocesTimeRate == 0  ? 'iconfont' : 'iconfont icon-paixu')"></i>{{String(numList.wholePocesTimeRate).includes('-') ? String(numList.wholePocesTimeRate).slice(1) : numList.wholePocesTimeRate }}%
						</div>
					</div>
				</div>
			</div>
			<div class="cardata_row t-MT20">
				<div class="cardata_col itemThree">
					<div class="cardata_left">
						<div class="cardata_col_img">
							<i class="iconfont icon-guzhangcishu"></i>
						</div>
						<div class="cardata_col_text">
							<h4>
								故障次数
								<el-tooltip popper-class="tooltip" placement="top">
									<i class="iconfont icon-shuoming"></i>
									<div slot="content" class="tooltip-content">
										<div>故障次数</div>
									</div>
								</el-tooltip>
							</h4>
							<p>
								<span class="white">{{numList.faultCount}}</span>
							</p>
						</div>
					</div>
					<div class="cardata_right">
						<h4>前日环比</h4>
						<div
							:class=" numList.faultCountRate > 1 ? 'scale scaleup' : (numList.faultCountRate == '-' || numList.faultCountRate == 0  ? 'scale' : 'scale scaledown')">
							<i
								:class=" numList.faultCountRate > 1 ? 'iconfont icon-xiangshang' : (numList.faultCountRate == '-'|| numList.faultCountRate == 0  ? 'iconfont' : 'iconfont icon-paixu')"></i>{{String(numList.faultCountRate).includes('-') ? String(numList.faultCountRate).slice(1) : numList.faultCountRate }}%
						</div>
					</div>
				</div>
				<div class="cardata_col cardata_col_center itemThree">
					<!-- <div class="cardata_left"> -->
					<div class="cardata_left">
						<div class="cardata_col_img">
							<i class="iconfont icon-jieguancishu"></i>
						</div>
						<div class="cardata_col_text">
							<h4>
								接管次数
								<el-tooltip popper-class="tooltip" placement="top">
									<i class="iconfont icon-shuoming"></i>
									<div slot="content" class="tooltip-content">
										<div>接管次数</div>
									</div>
								</el-tooltip>
							</h4>
							<p>
								<span class="white">{{numList.numberOfTakeOver}}</span>
							</p>
						</div>
					</div>

					<!-- </div> -->
					<div class="cardata_right">
						<h4>前日环比</h4>
						<div
							:class=" numList.numberOftakeoverRate > 1 ? 'scale scaleup' : (numList.numberOftakeoverRate == '-' || numList.numberOftakeoverRate == 0 ? 'scale' : 'scale scaledown')">
							<i
								:class="numList.numberOftakeoverRate > 1 ? 'iconfont icon-xiangshang' : (numList.numberOftakeoverRate == '-' || numList.numberOftakeoverRate == 0 ? 'iconfont' : 'iconfont icon-paixu')"></i>{{String(numList.numberOftakeoverRate).includes('-') ? String(numList.numberOftakeoverRate).slice(1) : numList.numberOftakeoverRate }}%
						</div>
					</div>
					<!-- <div class="cardata_cols_right">
					<div class="cardata_times">
						<div class="cardata_times_row">
							<div class="cardata_times_col">
								<span class="times">
									安全员干预-停车次数
									<el-tooltip popper-class="tooltip" placement="top">
										<i class="iconfont icon-shuoming"></i>
										<div slot="content" class="tooltip-content">
											<div>安全员干预-停车次数</div>
										</div>
									</el-tooltip>
								</span>
								<span class="number">{{numList.aqygyTimes}}</span>
							</div>
							<div class="cardata_times_col">
								<span class="times">
									安全员干预-恢复行车次数
									<el-tooltip popper-class="tooltip" placement="top">
										<i class="iconfont icon-shuoming"></i>
										<div slot="content" class="tooltip-content">
											<div>安全员干预-恢复行车次数</div>
										</div>
									</el-tooltip>
								</span>
								<span class="number">{{numList.aqyqdTimes}}</span>
							</div>
							<div class="cardata_times_col">
								<span class="times">
									监控员干预-停车次数
									<el-tooltip popper-class="tooltip" placement="top">
										<i class="iconfont icon-shuoming"></i>
										<div slot="content" class="tooltip-content">
											<div>监控员干预-远程停车次数</div>
										</div>
									</el-tooltip>
								</span>
								<span class="number">{{numList.jkygyTimes}}</span>
							</div>
							<div class="cardata_times_col">
								<span class="times">
									监控员干预-恢复行车次数
									<el-tooltip popper-class="tooltip" placement="top">
										<i class="iconfont icon-shuoming"></i>
										<div slot="content" class="tooltip-content">
											<div>监控员干预-恢复行车次数</div>
										</div>
									</el-tooltip>
								</span>
								<span class="number">{{numList.jkyqdTimes}}</span>
							</div>
							<div class="cardata_times_col">
								<span class="times">
									远程接管次数
									<el-tooltip popper-class="tooltip" placement="top">
										<i class="iconfont icon-shuoming"></i>
										<div slot="content" class="tooltip-content">
											<div>远程接管次数</div>
										</div>
									</el-tooltip>
								</span>
								<span class="number">{{numList.ycjgTimes}}</span>
							</div>
							
							
							<div class="cardata_times_col">
								<span class="times">
									监员启动次数
									<el-tooltip popper-class="tooltip" placement="top">
										<i class="iconfont icon-shuoming"></i>
										<div slot="content" class="tooltip-content">
											<div>监员启动次数</div>
										</div>
									</el-tooltip>
								</span>
								<span class="number">3</span>
							</div>
						</div>
					</div>
				</div> -->
				</div>
				<div class="cardata_col itemThree">
					<div class="cardata_left">
						<div class="cardata_col_img">
							<i class="iconfont icon-guzhangcishu"></i>
						</div>
						<div class="cardata_col_text">
							<h4>
								总油耗(L)
								<el-tooltip popper-class="tooltip" placement="top">
									<i class="iconfont icon-shuoming"></i>
									<div slot="content" class="tooltip-content">
										<div>总油耗(L)</div>
									</div>
								</el-tooltip>
							</h4>
							<p>
								<span class="white">-</span>
							</p>
						</div>
					</div>
					<div class="cardata_right">
						<h4>前日环比</h4>
						<div class="scale">
							<i class="iconfont"></i>-%
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="cardata" v-else>
			<div class="cardata_row">
				<div class="cardata_col bigTabContent">
					<div class="cardata_left">
						<div class="cardata_col_img">
							<i class="iconfont icon-a-xingzhuang1390"></i>
						</div>
						<div class="cardata_col_text">
							<h4>小时运输功/（吨*公里/小时）
								<el-tooltip popper-class="tooltip" placement="bottom">
									<i class="iconfont icon-shuoming"></i>
									<div slot="content" class="tooltip-content">
										<div>(单车总产量*平均运距)/总运行时长；注： 现阶段总产量=额定载重*拉运趟次</div>
									</div>
								</el-tooltip>
							</h4>
							<p>
								<span class="white">{{efficiencyList.hourlyPower}}</span>
							</p>
						</div>
					</div>
					<div class="cardata_right">
						<p>总产量(吨)<a>{{ efficiencyList.totalOutput }}</a></p>
						<p>总运距(KM)<a>{{ efficiencyList.totalHaulDistance }}</a></p>
						<p>总趟次(次)<a>{{ efficiencyList.totalTrips }}</a></p>
						<p>总时长(h)<a>{{ efficiencyList.totalTime }}</a></p>
					</div>
				</div>

				<div class="cardata_col cardata_col_center">
					<div class="cardata_left">
						<div class="cardata_col_img">
							<i class="iconfont icon-a-duobianxing2kaobei3"></i>
						</div>
						<div class="cardata_col_text">
							<h4>
								平均运距（KM)
								<el-tooltip popper-class="tooltip" placement="top">
									<i class="iconfont icon-shuoming"></i>
									<div slot="content" class="tooltip-content">
										<div>总运距/总拉运趟次</div>
									</div>
								</el-tooltip>
							</h4>
							<p>
								<span class="white">{{ efficiencyList.avgHaulDistance }}</span>
							</p>
						</div>
					</div>
				</div>
				<div class="cardata_col">
					<div class="cardata_left">
						<div class="cardata_col_img">
							<i class="iconfont icon-a-juxing4kaobei"></i>
						</div>
						<div class="cardata_col_text">
							<h4>
								平均循环时间(min)
								<el-tooltip popper-class="tooltip" placement="top">
									<i class="iconfont icon-shuoming"></i>
									<div slot="content" class="tooltip-content">
										<div>所有车辆的平均单趟循环时间</div>
									</div>
								</el-tooltip>
							</h4>
							<p>
								<span class="white">{{ efficiencyList.avgCycleTime }}</span>
							</p>
						</div>
					</div>
				</div>
			</div>
			<div class="cardata_row t-MT20">
				<div class="cardata_col">
					<div class="cardata_left">
						<div class="cardata_col_img">
							<i class="iconfont icon-a-duobianxing2kaobei-2"></i>
						</div>
						<div class="cardata_col_text">
							<h4>
								平均装载时间(min)
								<el-tooltip popper-class="tooltip" placement="top">
									<i class="iconfont icon-shuoming"></i>
									<div slot="content" class="tooltip-content">
										<div>装载开始时刻-装载完成时刻</div>
									</div>
								</el-tooltip>
							</h4>
							<p>
								<span class="white">{{ efficiencyList.avgLoadingTime }}</span>
							</p>
						</div>
					</div>

				</div>
				<div class="cardata_col cardata_col_center">
					<!-- <div class="cardata_left"> -->
					<div class="cardata_left">
						<div class="cardata_col_img">
							<i class="iconfont icon-a-duobianxing2kaobei"></i>
						</div>
						<div class="cardata_col_text">
							<h4>
								平均卸载时间(min)
								<el-tooltip popper-class="tooltip" placement="top">
									<i class="iconfont icon-shuoming"></i>
									<div slot="content" class="tooltip-content">
										<div>卸载开始时刻-卸载完成时刻</div>
									</div>
								</el-tooltip>
							</h4>
							<p>
								<span class="white">{{ efficiencyList.avgUnloadingTime }}</span>
							</p>
						</div>
					</div>

				</div>
				<div class="cardata_col cardata_col_center" style="margin-left: 0;">
					<div class="cardata_left">
						<div class="cardata_col_img">
							<i class="iconfont icon-a-xingzhuang4"></i>
						</div>
						<div class="cardata_col_text">
							<h4>
								平均空运时间(min)
								<el-tooltip popper-class="tooltip" placement="top">
									<i class="iconfont icon-shuoming"></i>
									<div slot="content" class="tooltip-content">
										<div>卸载完成时刻-装载开始时刻</div>
									</div>
								</el-tooltip>
							</h4>
							<p>
								<span class="white">{{ efficiencyList.avgEmptyRunningTime }}</span>
							</p>
						</div>
					</div>
				</div>
				<div class="cardata_col">
					<div class="cardata_left">
						<div class="cardata_col_img">
							<i class="iconfont icon-a-juxing3"></i>
						</div>
						<div class="cardata_col_text">
							<h4>
								平均重运时间(min)
								<el-tooltip popper-class="tooltip" placement="top">
									<i class="iconfont icon-shuoming"></i>
									<div slot="content" class="tooltip-content">
										<div>装载完成时刻-卸载开始时刻</div>
									</div>
								</el-tooltip>
							</h4>
							<p>
								<span class="white">{{ efficiencyList.avgHeavyRunningTime }}</span>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'showCardata',
		props: ['tabCheckIndex'],
		data() {
			return {
				numList: {
					numberOfVehicle: "-",
					numberOfVehicleRate: 0,
					autoTotalTimeAndRunTime: '-',
					autoAndRunRate: 0,
					wholePocesTime: '-',
					wholePocesTimeRate: '-',
					faultCount: '-',
					faultCountRate: '-',
					numberOfTakeOver: '-',
					numberOftakeoverRate: '-',
					aqygyTimes: '-',
					jkygyTimes: '-',
					ycjgTimes: '-',
					aqyqdTimes: '-',
					jkyqdTimes: '-'

				},
				efficiencyList: {
					hourlyPower: '-',
					totalOutput: '-',
					totalTrips: '-',
					avgEmptyRunningTime: '-',
					avgHeavyRunningTime: '-',
					totalHaulDistance: '-',
					avgUnloadingTime: '-',
					totalTime: '-',
					avgCycleTime: '-',
					avgHaulDistance: '-',
					avgLoadingTime: '-',
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@mixin boxFlex {
		display: flex;
		align-items: center;
	}

	.t-MT20 {
		margin-top: 20px;
	}

	.cardata {
		.cardata_row {
			@include boxFlex();
			justify-content: space-between;

			.cardata_col {
				width: 24%;
				height: 120px;
				padding: 25px 20px;
				background: #252c3e;
				border-radius: 5px;
				@include boxFlex();
				justify-content: space-between;

				&.bigTabContent {
					width: 49.3%;

					.cardata_right {
						width: 50%;
						display: flex;
						justify-content: space-around;
						align-items: center;
						flex-wrap: wrap;

						p {
							width: 50%;
							display: inline-block;
							color: #8E96AC;
							font-size: 14px;
							line-height: 45px;
							position: relative;

							a {
								color: #FFFFFF;
								font-size: 22px;
								font-family: Bebas Neue, Bebas Neue-Regular;
								padding-left: 5px;
								position: absolute;
								left: 75px;
							}
						}
						
					}
				}

				&.itemThree {
					width: 32.5%;
				}
			}

			.cardata_col_center {
				// margin: 0 20px;
			}

			.cardata_cols {
				width: 67%;
				height: 120px;
				padding: 25px 20px;
				background: #252c3e;
				border-radius: 5px;
				margin-left: 20px;
				@include boxFlex();

				.cardata_cols_left {
					width: 45%;
					padding-right: 30px;
					@include boxFlex();
					justify-content: space-between;
					border-right: 1px solid #454C5F;
				}

				.cardata_cols_right {
					width: 55%;
					padding-left: 20px;

					.cardata_times_row {
						@include boxFlex();
						flex-wrap: wrap;
						justify-content: space-around;

						.cardata_times_col {
							@include boxFlex();
							// margin-right: 12px;
							width: 49%;
							line-height: 30px;

							// line-height: 47px;
							.times {
								font-size: 14px;
								font-weight: 500;
								color: #8e96ac;
							}

							i {
								font-size: 14px;
							}

							.number {
								font-size: 30px;
								font-weight: 400;
								color: #ffffff;
								margin-left: 8px;
								position: relative;
								top: -1px;
								font-family: Bebas Neue, Bebas Neue-Regular;
							}

							&:last-child {
								opacity: 0;
							}
						}
					}
				}
			}

			.cardata_left {
				@include boxFlex();

				.cardata_col_img {
					width: 70px;
					height: 70px;
					background: #1b202f;
					border-radius: 5px;
					margin-right: 20px;
					@include boxFlex();
					justify-content: center;

					i {
						font-size: 35px;
						color: #4a5370;
					}
				}

				.cardata_col_text {
					h4 {
						font-size: 14px;
						font-weight: 500;
						color: #8e96ac;
						position: relative;
						top: -6px;
					}

					i {
						font-size: 14px;
					}

					p {
						font-size: 40px;
						font-weight: 400;
						color: #8e96ac;
						height: 40px;
						position: relative;
						bottom: -4px;
						font-family: Bebas Neue, Bebas Neue-Regular;

						.white {
							color: #ffffff;
						}
					}
				}
			}

			.cardata_right {
				h4 {
					font-size: 14px;
					font-weight: 500;
					color: #8e96ac;
				}

				.scale {
					width: 60px;
					height: 32px;
					background: #1C3756;
					border-radius: 3px;
					margin-top: 14px;
					font-size: 14px;
					text-align: center;
					line-height: 32px;
					color: #ffffff;

					i {
						font-size: 14px;
						height: 13px;
					}

					&.scaleup {
						background: rgba(255, 69, 69, .2);
						color: rgba(255, 69, 69, 1);
					}

					&.scaledown {
						background: rgba(12, 210, 138, .2);
						color: rgba(12, 210, 138, 1);

					}
				}
			}
		}
	}
</style>
