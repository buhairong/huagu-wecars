<template>
	<view class="wrap">
		<u-image
		  src="https://image.51cheyaoshi.com/xcx/partner/static/logo.png"
			width="120rpx"
		  mode="widthFix"
		/>
		
		<view class="title">关于全民合伙人</view>
		
		<view class="list">
			<view class="item">
				1.全民合伙人是WECARS旗下的众包模式分销平台，合伙人将WECARS上的产品推荐给身边有需要的人，成交后即可获得丰厚的佣金奖励。
			</view>
			
			<view class="item">
				2.当您身边朋友有购车需求时，您只需要把对应车型的订阅方案推荐给TA，注册成功后，您的客户列表就会看到新增一个客户。您还可以挑选您感兴趣的车型订阅方案，直接生成海报发在朋友圈当中，只要有朋友感兴趣，您就会获得新客户。
			</view>
			
			<view class="item">
				3.客户成交后，您将会在账户明细中看到一笔待入账的佣金记录，待客户提车后，商户会向平台支付您的分销佣金，收到佣金后平台会100%入账至您的账户余额中。
			</view>
			
			<view class="item">
				4.更多关于全民合伙人，请您在「我的」-「全民合伙人FAQ」处查看。
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			
		}
	},
	onLoad(options) {
		
	},
	
	methods: {
		
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	width: 100vw;
	padding: 40rpx 32rpx 80rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	.title {
		margin-top: 24rpx;
		margin-bottom: 64rpx;
		height: 44rpx;
		font-size: 30rpx;
		line-height: 44rpx;
		color: #333333;
	}
	.list {
		.item {
			margin-bottom: 24rpx;
			font-size: 28rpx;
			line-height: 44rpx;
			color: #666666;
		}
	}
}
</style>