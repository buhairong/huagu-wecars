<template>
	<view class="wrap">
		<view class="header">
			<view class="card">
				<view class="title">新车订阅方案</view>
				<view class="item">
					<view class="item-title">订阅车型：</view>
					<view class="item-content">
						{{form.carBrand}} {{form.carType}} {{form.carYear}} {{form.carProduct}}
					</view>
				</view>
				
				<view class="item">
					<view class="item-title">订阅周期：</view>
					<view class="item-content">
						{{form.period}}个月
					</view>
				</view>
				
				<view class="item">
					<view class="item-title">期末选择：</view>
					<view class="item-content">
						{{finalSelect == 0 ? '期末可能买断' : '期末可能退回'}}
					</view>
				</view>
			</view>
			
			<view class="input-item">
				<view class="item-title">姓名</view>
				<view class="item-content">
					<u-input 
						v-model="form.username"
						placeholder="请输入您的姓名"
					/>
				</view>
			</view>
			
			<view class="input-item">
				<view class="item-title">手机号</view>
				<view class="item-content">
					<u-input 
						v-model="form.mobile"
						placeholder="请输入您的手机号"
					/>
					<button 
						class="scope-btn"
						open-type="getPhoneNumber"
						@getphonenumber="handleLogin"
					>
						一键获取
					</button>
				</view>
			</view>
		</view>
		
		<button :disabled="disabled" @click="createUserRequirement">获取方案</button>
	</view>
</template>

<script>
import { validPhoneNum } from '@/utils/validate'

export default {
	data() {
		return {
			form: {
				period: '',
				finalSelect: '',
				carBrand: '',
				carType: '',
				carYear: '',
				carProduct: '',
				carTypeYearProductId: null,
				userId: '',
				username: '',
				mobile: '',
			},
			session_key: '',
		}
	},
	
	computed: {
		disabled() {
			if (this.form.username && this.form.mobile) {
				return false
			}
			
			return true
		}
	},
	
	onLoad(options) {
		this.form.period = options.period
		this.form.finalSelect = options.finalSelect
		this.form.carBrand = options.carBrand
		this.form.carType = options.carType
		this.form.carYear = options.carYear
		this.form.carProduct = options.carProduct
		this.form.carTypeYearProductId = options.carTypeYearProductId
		
		uni.login({
		    provider: 'weixin',
		    onlyAuthorize: true,
		    success: (loginRes) => {
		        this.$getRequest(this.$url.getOpenId, 'POST', {
		            code: loginRes.code,
		        }).then( async (res) => {
		            this.session_key = res.data.session_key
		        })
		    }
		})
	},
	
	onShow() {
		getApp().globalData.getUserInfo((data) => {
			if(data) {
				this.form.userId = data.id
				this.form.mobile = data.mobile
			}
		})
	},
	
	methods: {
		createUserRequirement() {
			const mobile = this.form.mobile.trim()
			if(!validPhoneNum(mobile)) {
				uni.showToast({
					title: '请正确输入手机号码',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			
			this.$getRequest(this.$url.createUserRequirement, "POST", this.form).then(res => {
				if (res.code === 0) {
					uni.showToast({
						title: '保存成功',
						duration: 2000,
						icon: 'none',
					})
					uni.removeStorageSync('customCarInfo')
					this.$u.route('/pages/custom/create-success')
				} else {
					uni.showToast({
						title: '保存失败',
						duration: 2000,
						icon: 'none',
					})
				}
			}).catch(err => {
				uni.showToast({
					title: '保存失败',
					duration: 2000,
					icon: 'none',
				})
			})
		},
		
		handleLogin(e) {
			const  {encryptedData, iv } = e.detail
			this.$getRequest(this.$url.decryptData, 'POST', {
			    encryptedData: encryptedData,
			    iv: iv,
			    sessionKey: this.session_key
			}).then(res => {
				if(res.code === 0) {
				  this.form.mobile = res.data.phoneNumber
				}
			})
			
		},
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	width: 100vw;
	height: 100vh;
	padding: 20px 32rpx 40px;
	display: flex;
	flex-direction: column;
	.header {
		flex: 1;
	}
	.card {
		padding: 20px 32rpx;
		margin-bottom: 28px;
		.title {
			margin-bottom: 16px;
			height: 48rpx;
			font-size: 16px;
			line-height: 48rpx;
			color: #0A0F2D;
			font-weight: 600;
		}
		.item {
			margin-top: 8px;
			display: flex;
			.item-title {
				font-size: 14px;
				color: #64696F;
				height: 42rpx;
				line-height: 42rpx;
			}
			.item-content {
				padding-left: 20rpx;
				width: 0;
				flex: 1;
				font-size: 14px;
				color: #0A0F2D;
				line-height: 42rpx;
			}
		}
	}
	
	.input-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 108rpx;
		box-shadow: inset 0px -1px 0px 0px rgba(10, 15, 45, 0.04);
		.item-title {
			width: 160rpx;
			font-size: 15px;
			color: #0A0F2D;
		}
		.item-content {
			padding-left: 20rpx;
			width: 0;
			flex: 1;
			display: flex;
			justify-content: space-between;
			align-items: center;
			::v-deep input {
				font-size: 15px;
			}
			.scope-btn {
				width: 140rpx;
				height: 56rpx;
				border-radius: 8rpx;
				background: #0A0F2D;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 12px;
				color: #FFFFFF;
				border: none;
				padding: 0;
				margin: 0;
			}
			.scope-btn:after {
				border: none;
			}
		}
	}
	
	button {
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