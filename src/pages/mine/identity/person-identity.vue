<template>
	<view class="wrap">
		<view class="title">输入手机号码</view>
		<view class="sub-title">{{subTitle}}</view>
		<view class="input-wrap">
			<input
				v-model="phone"
				class="input"
				type="number"
				placeholder="请输入手机号码"
				placeholder-style="font-size:14px;color:rgba(10, 15, 45, 0.3);"
			/>
			<view class="code-text" :style="{color: phone ? '#0A0F2D' : 'rgba(10, 15, 45, 0.3)'}" @click="getCode">
				获取验证码
			</view>
		</view>
		<!-- <view class="protocol">
			登录即代表您已同意 <span style="color:#197EF5" @click="showProtocol">《车要试出行用户协议》</span>
		</view> -->
	</view>
</template>

<script>
import { validPhoneNum } from '@/utils/validate'
import { userProtocolUrl } from '@/constants/index.js'

export default {
	data() {
		return {
			type: null, // 5.个人 6.企业
			subTitle: '',
			phone: '',
		}
	},
	onLoad(options) {
		this.type = options.type
		let title = '身份认证'
		this.subTitle = '请输入您的常用手机号码'
		
		if (options.type == 6) {
			title = '企业实际用车人'
			this.subTitle = '请输入企业实际用车人手机号码'
		}
		
		uni.setNavigationBarTitle({
		  title
		})
		
		if (this.type == 5) {
			getApp().globalData.userInfo = null
			getApp().globalData.getUserInfo((data) => {
					console.log('getUserInfo', data)
					this.phone = data.mobile
			})
		}
	},
	
	methods: {
		getCode() {
				const phone = this.phone.trim()
				if(!phone) {
					return
				}
				
				if(!validPhoneNum(phone)) {
					uni.showToast({
						title: '请正确输入手机号码',
						duration: 2000,
						icon: "none"
					})
					return false
				}
				
				uni.navigateTo({
					url: `./verifyCode?mobile=${phone}&type=${this.type}`
				})
		},
		
		showProtocol() {
			this.$goHtml(userProtocolUrl, '')
		},
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	padding: 40px 40rpx;
	.title {
		height: 36px;
		font-size: 28px;
		line-height: 36px;
		color: #0A0F2D;
	}
	.sub-title {
		margin-top: 4px;
		margin-bottom: 40px;
		height: 22px;
		font-size: 14px;
		line-height: 22px;
		color: rgba(10, 15, 45, 0.5);
	}
	.input-wrap {
		padding-right: 32rpx;
		height: 112rpx;
		border-radius: 16rpx;
		background: rgba(10, 15, 45, 0.04);
		display: flex;
		justify-content: space-between;
		align-items: center;
		.input {
			flex: 1;
			background-color: transparent;
		}
		.code-text {
			font-size: 14px;
		}
	}
	.protocol {
		padding: 12px 0;
		height: 22px;
		font-size: 14px;
		line-height: 22px;
		color: rgba(10, 15, 45, 0.5);
	}
}
</style>