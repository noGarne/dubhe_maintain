<template>
	<div class="dataBox">
		<div class="headerTitle">{{data.title}}</div>
		<div class="dataList">
			<div class="listItem">
				<a class="itemTitle">{{$t('cabin.direcNum')}}</a>
				<a class="itemValue">{{data.direcNum}}</a>
			</div>
			<div class="listItem">
				<a class="itemTitle">{{$t('cabin.succeNum')}}</a>
				<a class="itemValue">{{data.succeNum}}</a>
			</div>
			<div class="listItem">
				<a class="itemTitle">{{$t('cabin.direcTimes')}}</a>
				<a class="itemValue">{{data.direcTimes}}</a>
			</div>
			<div class="listItem">
				<a class="itemTitle">{{$t('cabin.direcAverNum')}}</a>
				<a class="itemValue">{{data.direcAverNum}}</a>
			</div>
			<div class="listItem">
				<a class="itemTitle">{{$t('cabin.driverNum')}}</a>
				<a class="itemValue">{{data.driverNum}}</a>
			</div>
			<div class="listItem">
				<a class="itemTitle">{{$t('cabin.planTimes')}}</a>
				<a class="itemValue">{{data.planTimes}}</a>
			</div>
			<div class="listItem">
				<a class="itemTitle">{{$t('cabin.driverAverNum')}}</a>
				<a class="itemValue">{{data.driverAverNum}}</a>
			</div>
			<div class="listItem">
				<a class="itemTitle">{{$t('cabin.planAverTimes')}}</a>
				<a class="itemValue">{{data.planAverTimes}}</a>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'directionsData',
		props:['data'],
		data() {
			return {
				
			}
		},
		methods: {

		
		},

	}
</script>

<style lang="scss" scoped>
.dataBox{
	width: 48%;
	height: 233px;
	background: #1b202f;
	border: 1px solid #101012;
	border-radius: 5px;
	margin: 0 auto;
	color: #bfc8d8;
	font-size: 14px;
	padding: 15px;
	.dataList{
		width: 95%;
		margin: 0 auto;
		display: flex;
		justify-content: space-around;
		flex-direction: row;
		flex-wrap: wrap;
		margin-top: 20px;
		div{
			width: 50%;
			height: 40px;
			line-height: 37px;
			border: 1px solid #101012;
			a{
				display: inline-block;
				text-align: center;
				width: 50%;
				font-size: 14px;
				background: #1c2232;
			}
			.itemTitle{
				border-right: 1px solid #101012;
			}
			.itemValue{
				background: #252c3e;
			}
		}
	}
}
</style>
