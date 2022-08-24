<template>
	<div class="boxBaseStyle" :style="{'width':data.width,'height':data.height,'margin-top':data.top}"  :class="{'noTopStyle':!data.list}">
		<div class="tableHeader defaultBox">
			<p>{{data.title}}</p>
			 <i class="iconfont icon-huidaozhongxin" v-if="data.title == '故障位置' || data.title == '偏差位置'" @click="getBounds()"></i>
			<span class="legendList">
				<span v-for="item in data.legendList">
					<span :style="{'background-color':item.color}" class="iconStyle"></span>
					<a>{{item.name}}</a>
				</span>
			</span>
		</div>
		<div class="mapContent">
			<l-map class="monitoring_l_map" ref="map" :zoom="zoom" :maxZoom="maxZoom" :minZoom="minZoom"
				:bounds="bounds" :center="center" :options="options">
				
				<l-layer-group v-for="(item,index) in startEndList" v-if="startEndList.length > 0" :key="index+'colorss'">
					<l-marker :lat-lng="item.latLng">
						<l-icon :icon-anchor="[0,0]">
							 <!-- <p class="map-place-space">0.5555</p> -->
							<!-- <div class="map-place-space">
							 0.5555
							 </div> -->
							 <i class="iconfont map-place-space" :class="{ 'icon-qidian-01 themeOrangeColor' : (item.name == 'start'), 'icon-zhongdian-01 themeGreenColor' :(item.name == 'end') }"></i>
						</l-icon>
					</l-marker>
				</l-layer-group>

				<l-layer-group v-for="(item,index) in lateraldeviation"  :key="index+'lateraldeviation'">
					<l-marker :lat-lng="item.latLng">
						<l-icon :icon-anchor="[0,0]">
							 <!-- <p class="map-place-space">0.5555</p> -->
							<div class="map-place-space iconNum">
							{{item.lateraldeviation.toFixed(3)}}
							 </div>
							 <!-- <i class="iconfont map-place-space" :class="{ 'icon-qidian-01 themeOrangeColor' : (item.name == 'start'), 'icon-zhongdian-01 themeGreenColor' :(item.name == 'end') }"></i> -->
						</l-icon>
					</l-marker>
				</l-layer-group>
				
				<l-layer-group v-for="(item,index) in data.list" :key="index+'color'">
					<l-marker :lat-lng="item.latLng">
						<l-icon :icon-anchor="[0,0]">
							<div class="map-place-space"
								:style="{'background-color':item.color,'width':'7px','height':'7px'}">
								<!-- {{item.color}} -->
							</div>
						</l-icon>
					</l-marker>
				</l-layer-group>
			</l-map>
		</div>
	</div>
</template>

<script>
	import mapMixins from '../../common/mixins/map.mixins';
	import deviceIconMixins from '../../common/mixins/deviceIcon.mixins.js';
	import leafletMixins from '../../common/mixins/leaflet.mixins';
	export default {
		name: 'leafletMap',
		props: ['data'],
		mixins: [mapMixins, deviceIconMixins, leafletMixins],
		data() {
			return {
				zoom: 2,
				maxZoom: 21,
				minZoom: 2,
				hotFlag: false,
				startEndList: [],
				lateraldeviation:[]
			}
		},
		methods: {
			startEndMarker() {
			}
		},
		mounted() {
			this.getSpaceMapList();
			this.hotFlag = true;
		}
	}
</script>

<style lang="scss" scoped>
	.boxBaseStyle {
		overflow: hidden;
		width: 100%;
		height: 520px;
		background: #252c3e;
		border: 1px solid #101012;
		border-radius: 5px;
		padding: 17px;
		margin: 0 0 20px 0;
		position: relative;

		.legendList {
			float: right;
			position: absolute;
			z-index: 1000;
			top: 10px;
			left: 50%;
			transform: translate(-50%, -50%);

			span {
				margin-left: 7px;
				font-size: 12px;
			}

			.iconStyle {
				display: inline-block;
				width: 13px;
				height: 13px;
				border-radius: 50%;
				position: relative;
				margin-right: 9px;
				top: 2px;
			}
		}

		.tableHeader {
			color: #bfc8d8;
			font-size: 14px;
			position: absolute;
			z-index: 100;
			width: 100%;
			// padding-left: 10px;
			i{
				float: right;
				font-size: 20px;
				cursor: pointer;
				position: absolute;
				z-index: 1000;
				right: 50px;
			}
		}

		.mapContent {
			height: 95%;
			margin-top: 4%;
			i{
				font-size: 23px;
			}
			.themeGreenColor{
				    color: #55ff00 !important;
			}
			.map-place-space{
				text-shadow: none !important;
				&.iconNum{
					color: yellowgreen;
				}
			}
			
		}
		&.noTopStyle{
			margin-top: 0 !important;
		}
	}
</style>
