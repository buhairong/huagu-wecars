<template>
	<view class="page">
		<view class="input-wrap">
			<view class="input-title">担保人姓名</view>
			<u-input 
				v-model="guarantorName"
				placeholder="请输入担保人姓名"
				input-align="right"
			/>
		</view>
		
		<view class="input-wrap">
			<view class="input-title">担保人手机号码</view>
			<u-input 
				v-model="guarantorMobile"
				placeholder="请输入担保人手机号码"
				input-align="right"
			/>
		</view>
		
		<view class="tip">
			请确保您已得到担保人的同意，我们会以短信形式通知到您添加的担保人。请您及时提醒担保人查看并上传验证信息。
		</view>
		
		<view class="fixed-buttom-disabled-btn">
			<button :disabled="disabled" @click="save">添加担保人</button>
		</view>
	</view>
</template>

<script>
import { validPhoneNum } from '@/utils/validate'

export default {
	data() {
		return {
			guarantorName: '',
			guarantorMobile: '',
		}
	},
	
	computed: {
		disabled() {
			let res = true
			
			if (this.guarantorName.trim() && this.guarantorMobile.trim()) {
				res = false
			}
			
			return res
		},
	},
	
	methods: {
		save() {
			const guarantorName = this.guarantorName.trim()
			const guarantorMobile = this.guarantorMobile.trim()
			if(!validPhoneNum(guarantorMobile)) {
				uni.showToast({
					title: '请正确输入手机号码',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			this.$emit('save', {
				guarantorName,
				guarantorMobile,
			})
		},
	}
}
</script>

<style lang="scss" scoped>
.input-wrap {
	margin-top: 16rpx;
	padding: 0 32rpx;
	height: 108rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: rgba(10, 15, 45, 0.04);
	border-radius: 16rpx;
	.input-title {
		padding-right: 20rpx;
		font-size: 15px;
		color: #0A0F2D;
	}
	u-input {
		flex: 1;
	}
}
	
.tip {
	padding-top: 32rpx;
	font-family: PingFang SC;
	font-size: 28rpx;
	line-height: 48rpx;
	color: rgba(61, 61, 61, 0.8);
}

.fixed-buttom-disabled-btn {
	button {
		background: #0A0F2D;
	}
	button[aria-disabled="true"] {
		background: rgba(216, 216, 216, 0.6);
		color: #FFFFFF;
	}
}
</style>
