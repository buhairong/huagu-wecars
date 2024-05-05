<template>
	<u-popup class="agreement-popup" border-radius="14" mode="center" :mask-close-able="false" v-model="show">
		<view class="wrap">
			<view class="log-wrap">
				<image
					class="logo"
					src="https://image.51cheyaoshi.com/xcx/app/static/logo.svg"
					mode="widthFix"
				/>
			</view>
			<view class="title">隐私政策提示</view>
			<view class="container">
				请在使用51车要试小程序前点击下方并仔细阅读
				<text style="font-weight:500;color:#3D3D3D;" @click="goAgreeMentPage">
					《WECARS隐私政策》
				</text>
				同意并勾选以下内容继续,不同意仅能以游客身份浏览小程序页面
			</view>
			
			<button class="btn refuse" @click="handleOpenPrivacyContract">查看隐私协议</button>
			<button id="agree-btn" class="btn" open-type="agreePrivacyAuthorization" @agreeprivacyauthorization="handleAgreePrivacyAuthorization">同意</button>
		</view>
	</u-popup>
</template>

<script>
export default {
	props: {
		show: {
			type: Boolean,
			default: false,
		}
	},
	
	data() {
		return {
			showFirstPageAgreeMentPopup: false,
			isAgree: '',
		}
	},
	
	methods: {
		handleAgreePrivacyAuthorization() {
			try {
				uni.setStorageSync('isAgreeFirstPagePrivacy', true)
				this.closeAgreeMentPopup()
				this.$emit('agree')
			} catch (e) {
				this.closeAgreeMentPopup()
			}
		},
		
		handleOpenPrivacyContract() {
			// 打开隐私协议页面
			wx.openPrivacyContract({
				success: () => {}, // 打开成功
				fail: () => {}, // 打开失败
				complete: () => {}
			})
		},
		
		closeAgreeMentPopup() {
			this.$emit('update:show', false)
		},
		
		goAgreeMentPage() {
			uni.navigateTo({
				url: `/pages/agreement/privacyAgreement`
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.agreement-popup {
	.wrap {
		width: 620rpx;
		padding: 35px 40rpx;
		.log-wrap {
			display: flex;
			justify-content: center;
			.logo {
				width: 160rpx;
			}
		}
		.title {
			margin-top: 40px;
			margin-bottom: 15px;
			height: 44rpx;
			line-height: 44rpx;
			text-align: center;
			font-size: 17px;
			color: #3D3D3D;
			font-weight: 500;
		}
		.container {
			line-height: 50rpx;
			font-size: 14px;
			color: #5D5D5D;
		}
		.operator {
			margin-top: 60px;
			margin-bottom: 25px;
			color: #5D5D5D;
			font-size: 12px;
			height: 44rpx;
			line-height: 44rpx;
		}
		
		.btn {
			width: 100%;
			height: 74rpx;
			border-radius: 4rpx;
			background: #0A0F2D;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #FFFFFF;
			font-size: 12px;
		}
		.refuse {
			margin: 24rpx 0;
			background-color: #fff;
			color: #5D5D5D;
			border: 2rpx solid #5D5D5D;
		}
	}
}

u-checkbox-group ::v-deep .u-checkbox__label{
	margin-right: 0;
}
</style>