<template>
	<view class="wrap">
		<view class="header">
			<view class="title">{{companyName}}</view>
			<view class="card">
				<view class="userinfo">
					<view class="username">{{username}}</view>
					<view class="idcard-wrap">
						<image
							style="width:32rpx;height:32rpx;"
							src="https://image.51cheyaoshi.com/xcx/app/static/carlife/idcard_icon.png"
						/>
						<view class="idcard">{{idNum}}</view>
					</view>
				</view>
				<view class="img-wrap">
					<image
						style="width:100%;height:100%;"
						:src="imageUrl"
					/>
				</view>
			</view>
		</view>
		
		<view class="footer">
			<view>
			     <view class="protocol-wrap">
			       <view>
			         <u-checkbox
			             v-model="checked"
			             size="28"
			             label-size="28"
			             icon-size="22"
			         >
			           <view class="placeOrderInfo-address-text">我已阅读并同意</view>
			         </u-checkbox>
			       </view>
			       <view @click="showUserProtocol" class="aPro">《用户隐私保密协议》</view>
			     </view>
			 </view>
			 
			 <button :disabled="disabled" @click="goNextPage">立即认证</button>
		</view>
		
	</view>
</template>

<script>
export default {
	data() {
		return {
			userProtocolUrl: 'https://www.51cheyaoshi.com/applet/protocol/privacy.pdf',
			companyName: '',
			idNum: '',
			username: '',
			imageUrl: 'https://image.51cheyaoshi.com/xcx/app/static/carlife/worker_icon.png',
			checked: false,
		}
	},
	onLoad(options) {
		this.companyName = options.companyName
		this.idNum = options.idNum
		this.username = options.username
		if (options.imageUrl) {
			this.imageUrl = options.imageUrl
		}
	},
	
	computed: {
		disabled() {
			if (this.checked) {
				return false
			}
			
			return true
		}
	},
	
	methods: {
		goNextPage() {
			this.$u.route(`/pages/mine/identity/face-identity-tip?type=6&idNum=${this.idNum}&username=${this.username}`)
		},
		
		showUserProtocol () {
			this.$goHtml(this.userProtocolUrl, '')
		},
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
		.username {
			height: 48rpx;
			font-size: 16px;
			line-height: 48rpx;
			color: #0A0F2D;
		}
		.idcard-wrap {
			margin-top: 4px;
			display: flex;
			align-items: center;
			.idcard {
				padding-left: 10rpx;
				height: 44rpx;
				font-size: 12px;
				line-height: 44rpx;
				color: rgba(10, 15, 45, 0.5);
			}
		}
		.img-wrap {
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
			overflow: hidden;
		}
	}
	.protocol-wrap {
		display: flex;
		align-items: center;
		.placeOrderInfo-address-text {
			height: 44rpx;
			font-size: 28rpx;
			line-height: 44rpx;
			color: #666666;
		}
		.aPro {
			height: 44rpx;
			font-size: 28rpx;
			line-height: 44rpx;
			color: #197EF5;
		}
	}
	
	button {
		margin-top: 12px;
		width: 100%;
		height: 118rpx;
		border-radius: 16rpx;
		background: #0A0F2D;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 17px;
		color: #FFFFFF;
	}
	
	button::after {
		border: none;
	}
	
	button[aria-disabled="true"] {
		background: rgba(10, 15, 45, 0.3);
	}
}
</style>