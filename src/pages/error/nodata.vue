<template>
	<view class="page-wrap">
		<u-image
		  src="https://image.51cheyaoshi.com/xcx/partner/static/order/group_e3fc_2.png"
			width="304rpx"
		  mode="widthFix"
			@click="goHomePage"
		/>
		<view class="tip1">
			暂无此车辆信息
		</view>
		<view class="tip2">
			去首页逛逛，查看更多车辆信息
		</view>
		<view class="btn" @click="goHomePage">
			去首页
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			goHomePage() {
				console.log('goHomePage')
				uni.switchTab({
					url: '/pages/home/choose-index'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.page-wrap {
	padding-top: 120rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	.tip1 {
		margin-top: 9px;
		font-size: 16px;
		font-weight: 600;
		line-height: 17px;
		color: #0A0F2D;
	}
	.tip2 {
		margin-top: 10px;
		font-size: 12px;
		line-height: 17px;
		color: rgba(10, 15, 45, 0.5);
	}
	.btn {
		margin-top: 30px;
		width: 430rpx;
		height: 116rpx;
		border-radius: 16rpx;
		background: #0A0F2D;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 17px;
		font-weight: 500;
		color: #FFFFFF;
	}
}
</style>
