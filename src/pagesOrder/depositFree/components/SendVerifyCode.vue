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
	props: {
		type: {
			type: Number,
			required: true,
		},
	},
	
	data() {
		return {
			subTitle: '',
			phone: '',
		}
	},
	
	mounted() {
		getApp().globalData.getUserInfo((data) => {
			this.phone = data.mobile
		})
		// 5.个人 6.企业
		if (this.type == 5) {
			this.subTitle = '请输入您的常用手机号码'
		} else if (this.type === 6) {
			this.subTitle = '请输入企业实际用车人手机号码'
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
			
			this.$emit('nextIdentityStep', {
				phone,
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