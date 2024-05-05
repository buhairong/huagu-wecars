<template>
	<view class="page-wrap">
		<view class="card-item-wrap">
			<view class="label">持卡人</view>
			<view class="content">{{form.cardOwner}}</view>
		</view>
		
		<view class="card-item-wrap">
			<view class="label">卡号</view>
			<view class="content">
				<input
					v-model="form.bankCardNo"
					class="input"
					maxlength="30"
					placeholder="输入本人储蓄卡号"
					placeholder-style="font-size:14px;color:#A4AEBB;"
				/>
			</view>
		</view>
		
		<view class="card-item-wrap">
			<view class="label">银行</view>
			<view class="content content1">
				<input
					v-model="form.bankName"
					class="input"
					maxlength="30"
					placeholder="输入银行"
					placeholder-style="font-size:14px;color:#A4AEBB;"
				/>
				<view class="icon-wrap" @click="upload">
					<u-icon name="camera" color="#BEBEBE" size="40"></u-icon>
				</view>
			</view>
		</view>
		
		<view class="card-item-wrap">
			<view class="label">持卡人银行预留手机号</view>
			<view class="content content1">
				<input
					v-model="form.mobile"
					class="input"
					maxlength="30"
					placeholder="输入银行预留手机号"
					placeholder-style="font-size:14px;color:#A4AEBB;"
					inputmode="numeric" 
					type="digit"
				/>
			</view>
		</view>
		
		<view class="tip">身份信息仅用于银行验证</view>
		
		<view class="buttom-disabled-btn">
			<button :disabled="disabled" @click="bind">绑 定</button>
		</view>
		
		<u-popup v-model="showPopup" mode="center" border-radius="14">
			<view class="popupWrap">
				<u-icon name="checkmark-circle-fill" color="#00C777" size="120"></u-icon>
				<view class="text">绑定成功</view>
				<view class="btn" @click="goCashHomePage">完成</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import { validPhoneNum } from '@/utils/validate'
import { uploadAction } from '@/constants/index.js'
	
export default {
	data() {
		return {
			form: {
				userId: '',
				cardOwner: '',
				bankCardNo: '',
				bankName: '',
				mobile: '',
				bankCardUrl: '',
			},
			showMobileInput: false,
			showPopup: false,
		}
	},
	
	computed: {
		disabled() {
			return !(this.form.bankCardNo && this.form.bankName && this.form.mobile)
		},
	},
	
	onLoad(options) {
		this.form.userId = options.userId
		this.form.cardOwner = options.realName
	},
	
	methods: {
		openMobileInput() {
			this.showMobileInput = true
		},
		
		upload() {
			uni.chooseImage({
				success: async (result) => {
					uni.showLoading({
						title: '上传中'
					})
					
					const tempFilePaths = result.tempFilePaths
					const res = await this.$getFileUpload(this.$url.upload, tempFilePaths)
					if (res.code == 0) {
						this.form.bankCardUrl = res.data.src
						this.OCRCardImg(res.data.src)
					}
				}
			})
		},
		
		async OCRCardImg(src) {
			const params = {
				bankCardUrl: src
			}
			
			const res =  await this.$getRequest(this.$url.ocrBankCard, 'POST', params)
			uni.hideLoading()
			
			this.form.bankName = res.data.bank_name
			this.form.bankCardNo = res.data.card_num
			
		},
		
		async bind() {
			if(!validPhoneNum(this.form.mobile)) {
				uni.showToast({
					title: '请正确输入手机号码',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			uni.showLoading({
				title: '保存中'
			})
			const res =  await this.$getRequest(this.$url.bindBankCard, 'POST', this.form)
			uni.hideLoading()
			
			if (res.code === 0) {
				this.showPopup = true
			}
			
		},
		
		goCashHomePage() {
			uni.reLaunch({
				url: `/partner/cash/home?userId=${this.form.userId}`,
			})
			this.showPopup = false
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.page-wrap {
	.card-item-wrap {
		border-top: 2rpx solid #E6E6E6;
		height: 100rpx;
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #333333;
		line-height: 40rpx;
		.label {
			padding-right: 40rpx;
			width: 180rpx;
		}
		.content {
			width: 0;
			flex: 1;
			.input {
				background: transparent;
				padding: 0;
			}
		}
		.content1 {
			height: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.input {
				width: 0;
				flex: 1;
				background: transparent;
			}
			.icon-wrap {
				height: 100%;
				padding-left: 32rpx;
				display: flex;
				align-items: center;
			}
		}
	}
	.tip {
		padding-top: 36rpx;
		border-top: 2rpx solid #E6E6E6;
		height: 40rpx;
		font-size: 12px;
		line-height: 40rpx;
		color: #7E7E7E;
	}
	
	.buttom-disabled-btn {
		margin-top: 200rpx;
	}
}

.popupWrap {
	width: 560rpx;
	padding: 40px 64rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	.text {
		margin-top: 16px;
		height: 56rpx;
		font-size: 18px;
		line-height: 56rpx;
		color: #1D2129;
	}
	.btn {
		margin-top: 60px;
		width: 100%;
		height: 90rpx;
		border-radius: 16rpx;
		background: #31C37B;
		font-size: 16px;
		color: #FFFFFF;
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
</style>