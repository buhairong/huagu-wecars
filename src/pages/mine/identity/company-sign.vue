<template>
	<view class="wrap">
		<view class="header">
			<view class="title">{{companyName}}</view>
			<view class="card">
				<view class="text">企业实际用车人</view>
				<view class="img-wrap">
					<image
						style="width:100%;height:100%;"
						src="https://image.51cheyaoshi.com/xcx/app/static/carlife/worker_icon.png"
					/>
				</view>
			</view>
		</view>
		
		<view class="btn" @click="goNextPage">添加</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			companyName: '',
		}
	},
	onLoad(options) {
		this.companyName = options.companyName
	},
	
	methods: {
		goNextPage() {
			this.$u.route('/pages/mine/identity/person-identity?type=6')
		}
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	padding: 40px 40rpx;
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	.title {
		height: 44rpx;
		font-size: 15px;
		line-height: 44rpx;
		color: rgba(10, 15, 45, 0.8);
	}
	.card {
		margin-top: 16px;
		padding: 0 40rpx;
		width: 100%;
		height: 214rpx;
		border-radius: 24rpx;
		background: #FFFFFF;
		box-shadow: 0px -2px 32px 0px rgba(10, 15, 45, 0.02),0px 8px 24px 0px rgba(10, 15, 45, 0.04);
		display: flex;
		justify-content: space-between;
		align-items: center;
		.text {
			font-size: 16px;
			color: #0A0F2D;
		}
		.img-wrap {
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
			overflow: hidden;
		}
	}
	.btn {
		width: 100%;
		height: 116rpx;
		border-radius: 16rpx;
		background: #0A0F2D;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 17px;
		color: #FFFFFF;
	}
}
</style>