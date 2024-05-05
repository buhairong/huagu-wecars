<template>
	<view>
		<view class="img-wrap">
			<image
				class="img"
				:src="activeTab == 1 ? 'https://image.51cheyaoshi.com/xcx/app/static/home/custom-select-bg.png' : 'https://image.51cheyaoshi.com/xcx/app/static/home/custom-rental-bg.png'"
			/>
			<view class="back-btn" @click="back">
				<u-icon name="arrow-left" color="rgba(0, 0, 0, 0.9)" size="48"></u-icon>
			</view>
		</view>
		
		<view class="wrap">
			<view class="card">
				<view class="tabs">
					<view 
						v-for="tab in tabs"
						:key="tab.id"
						class="tab"
						:class="[
							{'active-tab': tab.id != activeTab},
							{'tab1': tab.id == 2},
						]"
						@click="changeTab(tab.id)"
					>
						{{tab.label}}
					</view>
				</view>
				
				<view class="container">
					<template v-if="activeTab == 1">
						<view class="item">
							<view class="item-title">订阅车型</view>
							<view class="item-content">
								<u-input
									v-model="carProduct"
									placeholder="您想要订阅的车型"
								/>
							</view>
						</view>
						
						<view class="item">
							<view class="item-title">用车城市</view>
							<view class="item-content">
								<u-input
									v-model="city"
									placeholder="您想要用车的城市"
								/>
							</view>
						</view>
						
						<view class="item">
							<view class="item-title">提车时间</view>
							<view class="item-content" @click="openDatePicker">
								{{ deliveryDate || '您计划提车的时间' }}
							</view>
						</view>
						
						<view class="btn" @click="createUserRequirement" v-if="mobile">
							获取订阅方案
							<image
								class="detail-arrow"
								src="https://image.51cheyaoshi.com/xcx/app/static/right_green.png"
							/>
						</view>
						<button
							v-else
							class="scope-btn"
							open-type="getPhoneNumber"
							@getphonenumber="handleLogin"
						>
							获取订阅方案
							<image
								class="detail-arrow"
								src="https://image.51cheyaoshi.com/xcx/app/static/right_green.png"
							/>
						</button>
					</template>
					
					<template v-else>
						<view class="item">
							<view class="item-title">品牌车型</view>
							<view class="item-content">
								<u-input
									v-model="rentalForm.carBrand"
									placeholder="请输入品牌车型"
								/>
							</view>
						</view>
						
						<view class="item">
							<view class="item-title">开票金额</view>
							<view class="item-content">
								<u-input
									type="number"
									v-model="rentalForm.invoicingAmount"
									placeholder="请输入金额"
								/>
							</view>
						</view>
						
						<view class="item">
							<view class="item-title">融购置税</view>
							<view class="item-content">
								<u-switch 
									v-model="taxOpen"
									active-color="#07C160"
									active-value="1" 
									inactive-value="0"
									size="40"
									@change="changeTaxOpen"
								></u-switch>
							</view>
						</view>
						
						<view class="item">
							<view class="item-title">保险费用</view>
							<view class="item-content">
								<u-input
									type="number"
									v-model="rentalForm.insuranceExpenses"
									placeholder="请输入金额"
								/>
							</view>
						</view>
						
						<view class="item">
							<view class="item-title">装潢费用</view>
							<view class="item-content">
								<u-input
									type="number"
									v-model="rentalForm.decorationExpenses"
									placeholder="请输入金额"
								/>
							</view>
						</view>
						
						<view class="item">
							<view class="item-title">签约主体</view>
							<view class="item-content" @click="selectOrderType">
								{{rentalForm.orderType ? (userInfo && userInfo.name) || '' : '请选择'}}
								<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
							</view>
						</view>
						
						<view class="btn" @click="createRental">
							提交方案
							<image
								class="detail-arrow"
								src="https://image.51cheyaoshi.com/xcx/app/static/right_green.png"
							/>
						</view>
					</template>
				</view>
				
				
			</view>
			
			<view class="tip-btn" @click="openPopUp" v-if="activeTab == 1">
				什么是汽车订阅？
			</view>
		</view>
		
		<u-action-sheet :list="periodList" v-model="showPeriodList" :cancel-btn="true" @click="confirmPeriod"></u-action-sheet>
		
		<u-action-sheet :list="finalList" v-model="showFinalList" :tips="tips" :cancel-btn="true" @click="confirmFinal"></u-action-sheet>
		
		<u-popup class='popupClass'  border-radius="14" closeable=true mode="bottom" v-model="showPopUp">
			<view class="popupClassTop"> 
				<text>汽车订阅</text>
			</view>
			<view class="popupClassBom">
				<view style="text-indent: 2em;">
					汽车订阅是一种让您买车可以「后悔」的全新汽车消费模式。您仅需支付一笔订阅费用，即可开走车辆。 订阅期结束前30天，您再决定是否买断车辆，届时您可以通过全款或分期的方式支付尾款购买车辆，也可将车辆退回。
				</view>
			</view>
		</u-popup>
		
		<u-picker
		    v-model="showDatePicker"
		    confirm-color="#0A0F2D"
		    mode="time"
		    @confirm="handleTime"
		/>
	</view>
</template>

<script>
import { validIntegerNum } from '@/utils/validate'

export default {
	data() {
		return {
			periodList: [],
			finalList: [
				{value: 0, text: '期末可能买断车辆'},
				{value: 1, text: '期末可能退回车辆'},
			],
			showPopUp: false,
			showPeriodList: false,
			showFinalList: false,
			period: '',
			finalSelect: '',
			carBrand: '',
			carType: '',
			carYear: '',
			carProduct: '',
			carTypeYearProductId: null,
			tips: {
				text: '订阅结束后，您会计划？',
				color: '#0A0F2D',
				fontSize: 30,
				fontWeight: 600,
			},
			city: '',
			deliveryDate: '',
			showDatePicker: false,
			mobile: '',
			session_key: '',
			tabs: [
				{id: 1, label: '新车订阅'},
				{id: 2, label: '融资租赁'},
			],
			activeTab: 1,
			rentalForm: {
				userId: '',
				carBrand: '', // 品牌车型
				invoicingAmount: '', // 开票金额
				taxOpen: '1', // 融购置税 0关闭，1开启
				insuranceExpenses: '', // 保险费用
				decorationExpenses: '', // 装潢费用
				orderType: '', // 签约主体 1个人 2企业
			},
			taxOpen: 1,
			userInfo: null,
		}
	},
	
	onLoad(options) {
		this.activeTab = options.tab || 1
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
		const rentalForm = uni.getStorageSync('rentalForm')
		
		if (rentalForm) {
			this.rentalForm = rentalForm
		}
		
		const isLogin = uni.getStorageSync('isLogin')
		if (isLogin) {
			getApp().globalData.getUserInfo((data) => {
				if(data) {
					console.log('getUserInfo', data)
					this.mobile = data.mobile
					this.rentalForm.userId = data.id || ''
					this.userInfo = data
				}
			})
		}
		
		
	},
	
	methods: {
		changeTab(id) {
			this.activeTab = id
		},
		
		getPeriodList() {
			this.$getRequest(this.$url.selectPeriodList, "GET").then(res => {
				if (res.code === 0) {
					this.periodList = res.data.map(item => {
						return {
							value: item,
							text: `${item}个月`
						}
					})
				}
			})
		},
		
		back() {
			uni.navigateBack({
				delta: 1
			})
		},
		
		goCustomOrderPage() {
			if(!this.carBrand) {
				uni.showToast({
					title: '请选择订阅车型',
					duration: 2000,
					icon: 'none',
				})
				return
			}
			
			if(!this.period) {
				uni.showToast({
					title: '请选择订阅周期',
					duration: 2000,
					icon: 'none',
				})
				return
			}
			
			if(!this.finalSelect && this.finalSelect !== 0) {
				uni.showToast({
					title: '请选择期末选择',
					duration: 2000,
					icon: 'none',
				})
				return
			}
			
			this.$u.route(`/pages/custom/add-custom-order?period=${this.period}&finalSelect=${this.finalSelect}&carBrand=${this.carBrand}&carType=${this.carType}&carYear=${this.carYear}&carProduct=${this.carProduct}&carTypeYearProductId=${this.carTypeYearProductId}`)
		},
		
		goBrandListPage() {
			this.$u.route('/pages/custom/brandlist')
		},
		
		openPeriodList() {
			this.showPeriodList = true
		},
		
		confirmPeriod(index) {
			this.period = this.periodList[index].value
		},
		
		openFinalList() {
			this.showFinalList = true
		},
		
		confirmFinal(index) {
			this.finalSelect = this.finalList[index].value
		},
		
		openPopUp() {
			this.showPopUp = true
		},
		
		openDatePicker() {
			this.showDatePicker = true
		},
		
		handleTime(obj) {
			const {year, month, day} = obj
			this.deliveryDate = `${year}-${month}-${day}`
		},
		
		handleLogin(e) {
			const  {encryptedData, iv } = e.detail
			this.$getRequest(this.$url.decryptData, 'POST', {
			    encryptedData: encryptedData,
			    iv: iv,
			    sessionKey: this.session_key
			}).then(res => {
				if(res.code === 0) {
				  this.mobile = res.data.phoneNumber
				}
			})
		},
		
		createUserRequirement() {
			const carProduct = this.carProduct.trim()
			const city = this.city.trim()
			if(!carProduct) {
				uni.showToast({
					title: '请输入您想要订阅的车型',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!city) {
				uni.showToast({
					title: '请输入您想要用车的城市',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!this.deliveryDate) {
				uni.showToast({
					title: '请选择您计划提车的时间',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			const data = {
				carProduct,
				city,
				deliveryDate: this.deliveryDate,
				mobile: this.mobile,
			}
			
			
			this.$getRequest(this.$url.createUserRequirement, "POST", data).then(res => {
				if (res.code === 0) {
					uni.showToast({
						title: '保存成功',
						duration: 2000,
						icon: 'none',
					})
					uni.reLaunch({
						url: '/pages/custom/create-success'
					})
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
		
		changeTaxOpen(e) {
			console.log('changeTaxOpen', e)
			this.rentalForm.taxOpen = e
		},
		
		selectOrderType() {
			if (this.userInfo) {
				let riskAuditStatus = ''
				if (this.userInfo.riskAuditStatus) {
					riskAuditStatus = this.userInfo.riskAuditStatus
				}
				
				let idcard = ''
				if (this.userInfo.userInfoEntity) {
					idcard = this.userInfo.userInfoEntity.idcard || ''
				}
				
				uni.setStorageSync('rentalForm', this.rentalForm)
				
				uni.reLaunch({
					url: `/pagesOrder/identity/choose-identity?orderServiceType=3&riskAuditStatus=${riskAuditStatus}&idNum=${idcard}&username=${this.userInfo.name}&userId=${this.userInfo.id}`
				})
			} else {
				uni.navigateTo({
					url: `/pages/sign/sign`
				})
			}
		},
		
		createRental() {
			if(!this.rentalForm.carBrand) {
				uni.showToast({
					title: '请输入品牌车型',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!this.rentalForm.invoicingAmount) {
				uni.showToast({
					title: '请输入开票金额',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!this.rentalForm.insuranceExpenses) {
				uni.showToast({
					title: '请输入保险费用',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!this.rentalForm.decorationExpenses) {
				uni.showToast({
					title: '请输入装潢费用',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!this.rentalForm.orderType) {
				uni.showToast({
					title: '请选择签约主体',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!validIntegerNum(this.rentalForm.invoicingAmount)) {
				uni.showToast({
					title: '请正确输入开票金额',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!validIntegerNum(this.rentalForm.insuranceExpenses)) {
				uni.showToast({
					title: '请正确输入保险费用',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			if(!validIntegerNum(this.rentalForm.decorationExpenses)) {
				uni.showToast({
					title: '请正确输入装潢费用',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			
			this.$getRequest(this.$url.createCustomerRental, "POST", this.rentalForm).then(res => {
				if (res.code === 0) {
					uni.showToast({
						title: '保存成功',
						duration: 2000,
						icon: 'none',
					})
					uni.removeStorageSync('rentalForm')
					uni.reLaunch({
						url: '/pages/custom/create-success'
					})
					
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
	},
}
</script>

<style lang="scss" scoped>
.img-wrap {
	width: 100%;
	height: 576rpx;
	border-radius: 0px 0px 40rpx 40rpx;
	overflow: hidden;
	position: relative;
	.img {
		width: 100%;
		height: 100%;
	}
	.back-btn {
		width: 48rpx;
		height: 48rpx;
		position: fixed;
		top: 90rpx;
		left: 30rpx;
	}
}

.wrap {
	padding: 0 32rpx;
	position: relative;
	top: -180rpx;
	z-index: 100;
}

.card {
	padding: 0 0 40rpx;
	overflow: hidden;
	.tabs {
		height: 112rpx;
		font-size: 34rpx;
		color: #0A0F2D;
		font-weight: 500;
		background: #fff;
		margin-bottom: 20px;
		display: flex;
		.tab {
			width: 0;
			flex: 1;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			border-bottom-right-radius: 24rpx;
		}
		.tab1 {
			border-bottom-left-radius: 24rpx;
		}
		.active-tab {
			color: rgba(10, 15, 45, 0.5);
			font-weight: normal;
			background: rgba(10, 15, 45, 0.04);
		}
	}
	.container {
		padding: 0 40rpx;
	}
	.item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		min-height: 112rpx;
		box-shadow: inset 0px -1px 0px 0px rgba(10, 15, 45, 0.04);
		.item-title {
			font-size: 15px;
			color: #0A0F2D;
			font-weight: 600;
		}
		.item-content {
			padding-left: 20rpx;
			display: flex;
			align-items: center;
			.text-wrap {
				padding-right: 10rpx;
				flex: 1;
				.select-text {
					line-height: 44rpx;
					color: #0A0F2D;
					text-align: right;
				}
				.tip {
					text-align: right;
					color: rgba(10, 15, 45, 0.3);
				}
			}
			::v-deep .u-input__input {
				text-align: right;
			}
		}
	}
}

.btn, .scope-btn {
	margin-top: 40px;
	width: 100%;
	height: 116rpx;
	border-radius: 16rpx;
	background: #0A0F2D;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 17px;
	color: #FFFFFF;
	font-weight: 600;
	.detail-arrow {
		margin-left: 10rpx;
		width: 16rpx;
		height: 16rpx;
	}
}

.tip-btn {
	margin-top: 20px;
	height: 34rpx;
	font-size: 12px;
	line-height: 34rpx;
	text-decoration: underline;
	color: rgba(10, 15, 45, 0.5);
	text-align: center;
}

.popupClass{
	.popupClassTop{
		width: 100%;
		text-align: center;
		margin: 24px 0;
		height: 21px;
		font-family: PingFangSC-Medium;
		font-size: 15px;
		font-weight: 500;
		line-height: 21px;
		letter-spacing: 0px;
		color: rgba(0, 0, 0, 0.9);
		
	}
	.popupClassBom{
		margin:  28px;
		height: 104px;
		font-family: PingFangSC-Regular;
		font-size: 14px;
		font-weight: normal;
		line-height: 22px;
		letter-spacing: 0px;
		color: rgba(10, 15, 45, 0.8);
		margin-bottom: 90px;
	}
}

::v-deep .u-select__header__title {
	font-size: 20px;
	color: #0A0F2D;
}

::v-deep .u-select__body__picker-view__item {
	// height: 60px !important;
}
</style>