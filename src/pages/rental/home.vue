<template>
	<view>
		<view class="img-wrap">
			<image
				class="img"
				:src="form.businessType == 1 ? 'https://image.51cheyaoshi.com/xcx/tab_2.png' : 'https://image.51cheyaoshi.com/xcx/tab_1.png'"
			/>
		</view>
		
		<view class="wrap">
			<view class="card">
				<view class="tabs">
					<view 
						v-for="tab in CAR_RENTAL_BUSINESS_TYPE_LIST"
						:key="tab.value"
						class="tab"
						:class="[
							{'active-tab': tab.value != form.businessType},
							{'tab1': tab.value == 1},
						]"
						@click="changeTab(tab.value)"
					>
						{{tab.label}}
					</view>
				</view>
				
				<view class="container">
					<view class="item">
						<view class="item-title">选择车型</view>
						<view class="item-content" @click="goRentalList">
							{{ carProduct || '请选择' }}
							<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
						</view>
					</view>
					
					<view class="item">
						<view class="item-title">用车城市</view>
						<view class="item-content" @click="openCityList">
							{{ form.cityName || '请选择' }}
							<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
						</view>
					</view>
					
					<view class="item" v-if="form.businessType == 1">
						<view class="item-title">长租套餐</view>
						<view class="item-content" @click="openPeriodPopup">
							{{ periodStr || '请选择' }}
							<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
						</view>
					</view>
					
					<view class="item" v-if="form.businessType == 2">
						<view class="item-title">租车价格</view>
						<view class="item-content">
							{{ form.money ? `${form.money}元/天` : '' }}
						</view>
					</view>
					
					<view class="item">
						<view class="item-title">用车时间</view>
						<view class="item-content" @click="openPicker(1)">
							{{ startDateStr || '请选择' }}
							<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
						</view>
					</view>
					
					<view class="item">
						<view class="item-title">还车时间</view>
						<view class="item-content" @click="openPicker(2)">
							{{ endDateStr || `${form.businessType == 2 ? '请选择' : ''}` }}
							<u-icon name="arrow-right" color="#969799" size="28" v-if="form.businessType == 2"></u-icon>
						</view>
					</view>
					
					<view class="item">
						<view class="item-title">送车地址</view>
						<view class="item-content" @click="handleAddress(2)">
							{{ form.pickUpAddress || '请选择' }}
							<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
						</view>
					</view>
					
					<view class="item" v-if="isSameAddr != 1">
						<view class="item-title">还车地址</view>
						<view class="item-content" @click="handleAddress(3)">
							{{ form.returnAddress || '请选择' }}
							<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
						</view>
					</view>
					
					<view class="operator">
						<u-checkbox-group>
							<u-checkbox 
								v-model="isSameAddr" 
								name="1"
							>
								还车地址相同
							</u-checkbox>
						</u-checkbox-group>
					</view>
						
					<view class="btn" @click="createRental">
						立即订车
						<image
							class="detail-arrow"
							src="https://image.51cheyaoshi.com/xcx/app/static/right_green.png"
						/>
					</view>
				</view>
				
				
			</view>
		</view>
		
		<CustomerPicker 
			v-if="showPickCarDateList" 
			:ableStartDate="ableStartDate" 
			:days="days" 
			@close="close"
			@comfirm="comfirmPicker"
		/>
		
		<u-select
			v-model="showCityList" 
			:list="cityList"
			@confirm="confirmCity"
		></u-select>
		
		<u-popup
			v-model="showPeriodPopup" 
			mode="bottom"
			border-radius="12"
		>
			<view class="popup-wrap">
				<view class="title">选择长租套餐</view>
				<view class="container">
					<u-radio-group v-model="selectPeriod" class="radio-group">
						<view class="radio-item" v-for="(item, index) in item.typeReqVos" :key="index" @click="changePeriod(item)">
							<view class="left">
								<view class="period" :class="{active: selectPeriod === item.id}">{{item.period}}天套餐</view>
								<view class="price">{{item.money}}元/月</view>
							</view>
							<view class="right">
								<view class="total">￥{{item.totalMoney}}</view>
								<u-radio active-color="#0AEB7D" :name="item.id"></u-radio>
							</view>
						</view>
					</u-radio-group>
				</view>
				<view class="btn-group">
					<view class="btn" @click="closePopup">取消</view>
					<view class="btn save-btn" @click="savePeriod">确认</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import dayjs from 'dayjs'
import { CAR_RENTAL_BUSINESS_TYPE_LIST, CAR_RENTAL_PERIOD_STATUS, dayTimer, dayList } from '@/constants'
import { formatDate, formatTimeStamp } from '@/utils'
import { CustomerPicker } from '@/common/CustomerPicker.vue'

export default {
	components: {
		CustomerPicker,
	},
	
	data() {
		return {
			CAR_RENTAL_BUSINESS_TYPE_LIST,
			userInfo: null,
			carTypeId: '',
			carProduct: '',
			startDateObj: {},
			startTimeStamp: '',
			startDateStr: '',
			endDateStr: '',
			periodStr: '',
			form: {
				businessType: 2,
				carRentalDetailSubscribeId: '',
				carTypeYearProductId: '',
				cityId: '',
				cityName: '',
				startDate: '',
				endDate: '',
				pickUpAddress: '',
				returnAddress: '',
				deposit: '',
				money: '',
				totalPayment: '',
				userId: '',
				plateNumFee: '',
			},
			detail: null,
			showPickCarDateList: false,
			pickCarDateList: [],
			selectProduct: {},
			ableStartDate: '',
			days: 60,
			pickerType: 1,
			showCityList: false,
			cityList: [],
			commonItem: {},
			item: {},
			showPeriodPopup: false,
			selectPeriod: '',
			isSameAddr: 1,
		}
	},
	
	onLoad(options) {
		this.getAllCity()
	},
	
	onShow() {
		const isLogin = uni.getStorageSync('isLogin')
		if (isLogin) {
			getApp().globalData.getUserInfo((data) => {
				if(data) {
					this.userInfo = data
					this.form.userId = data.id
				}
			})
		}
		
		const rentalCarSelectProduct = uni.getStorageSync('rentalCarSelectProduct')
		
		if (rentalCarSelectProduct) {
			this.form.businessType = rentalCarSelectProduct.businessType
			this.form.carTypeYearProductId = rentalCarSelectProduct.carTypeYearProductId
			this.carProduct = rentalCarSelectProduct.carProduct
			this.carTypeId = rentalCarSelectProduct.carTypeId
			this.getDetail()
		}
	},
	
	methods: {
		close() {
			this.showPickCarDateList = false
		},
		
		changeTab(id) {
			this.form.businessType = id
			this.form.carRentalDetailSubscribeId = ''
			this.form.carTypeYearProductId = ''
			this.carProduct = ''
			this.carTypeId = ''
			this.form.cityId = ''
			this.form.cityName = ''
			this.form.endDate = ''
			this.form.deposit = ''
			this.form.money = ''
			this.form.totalPayment = ''
			this.form.plateNumFee = ''
			this.periodStr = ''
			this.endDateStr = ''
			this.selectPeriod = ''
		},
		
		goRentalList() {
			uni.navigateTo({
				url: `/pagesOrder/rental/product/list?businessType=${this.form.businessType}`
			})
		},
		
		getAllCity() {
			this.$getRequest(this.$url.cityList, 'POST', {})
				.then((res) => {
					if(res.code == 0) {
						this.cityList = res.data
						this.cityList.forEach(item => {
							item.value = item.id
							item.label = item.city
						})
					}
				})
		},
		
		getDetail() {
			this.$getRequest(this.$url.getCarRentalDetail, 'GET', {
				businessType: this.form.businessType,
				carTypeId: this.carTypeId,
				userId: '',
			}).then(res => {
				if (res.code === 0) {
					this.detail = res.data
					this.selectProduct = res.data.carRentalProductDetailRespVOList.find(item => item.carRentalDetailEntityList[0].carTypeYearProductId === this.form.carTypeYearProductId)
					this.ableStartDate = this.selectProduct.carRentalDetailEntityList[0].typeReqVos[0].pickCarTimeStart
					const item = this.selectProduct.carRentalDetailEntityList.find(city => city.cityId === 0)
					if (item) {
						this.commonItem = item
					}
					
					this.getRentalPrice()
				}
			})
		},
		
		// 1. 用车时间 2.还车时间
		openPicker(type) {
			this.pickerType = type
			if (type === 1) {
				if (!this.form.carTypeYearProductId) {
					uni.showToast({
						title: '请先选择车型',
						duration: 2000,
						icon: 'none'
					})
					return 
				}
				this.days = 60
			} else {
				if (this.form.businessType == 1) {
					return 
				}
				
				if (!this.form.startDate) {
					uni.showToast({
						title: '请先选择用车时间',
						duration: 2000,
						icon: 'none'
					})
					return 
				} else {
					let timeStamp = new Date(this.form.startDate).getTime()
					timeStamp = timeStamp + (24 * 60 * 60 * 1000)
					this.ableStartDate = dayjs(timeStamp).format('YYYY-MM-DD HH:mm:ss')
				}
				this.days = 30
			}
			this.showPickCarDateList = true
		},
		
		comfirmPicker(date) {
			const str = `${date.month}月${date.date}日（${date.weekDay}）${date.hour}:${date.minute}`
			if (this.pickerType === 1) {
				this.form.startDate = date.timer
				this.startDateStr = str
				this.startDateObj = date
				this.startTimeStamp = date.timeStamp
				if (this.form.businessType == 1) {
					this.getEndTime() 
				}
			} else {
				this.form.endDate = date.timer
				this.endDateStr = str
				const timer = date.timeStamp - this.startTimeStamp
				const days = Math.floor(timer / dayTimer)
				this.form.totalPayment = this.form.money * days
			}
		},
		
		getEndTime() {
			if (this.form.businessType == 1 && this.startTimeStamp && this.form.carRentalDetailSubscribeId) {
				const plan = this.item.typeReqVos.find(item => item.id === this.form.carRentalDetailSubscribeId)
				
				const endTimeStamp = CAR_RENTAL_PERIOD_STATUS[plan.period].days * dayTimer + this.startTimeStamp
				const pickCarTimeEnd = formatTimeStamp(endTimeStamp)
				
				const date1 = new Date(endTimeStamp)
				const weekDay = `周${dayList[date1.getDay()]}`
				
				const year = pickCarTimeEnd.year
				
				let month = this.startDateObj.month
				if (this.item.period === 180) {
					month = (parseInt(this.startDateObj.month) + 6) % 12
					if (month === 0) {
						month = 12
					}
				}
				
				let date = parseInt(this.startDateObj.date) - 1
				if (date === 0) {
					month -= 1
					if (month === 0) {
						month = 12
					}
					date = monthLastDay[month]
					if (month === 2 && year % 4 === 0) {
						date = 29
					}
				}
				
				this.form.endDate = `${year}-${month}-${date} ${this.startDateObj.hour}:${this.startDateObj.minute}`
				this.endDateStr = `${month}月${date}日（${weekDay}）${this.startDateObj.hour}:${this.startDateObj.minute}`
				console.log('endDate', this.form.endDate, this.endDateStr)
			}
		},
		
		openCityList() {
			this.showCityList = true
		},
		
		confirmCity(e) {
			this.form.cityId = e[0].value
			this.form.cityName = e[0].label
			const city1 = this.cityList.find(city => city.id == this.form.cityId)
			if (city1) {
				if (this.selectProduct.carTypeYearProductEntity.mold === 1) {
					this.form.plateNumFee = city1.trackPlatePrice || 0
				} else {
					this.form.plateNumFee = city1.energyVehiclesPlatePrice || 0
				}
			}
			this.getRentalPrice()
		},
		
		getRentalPrice() {
			this.form.carRentalDetailSubscribeId = ''
			this.selectPeriod = ''
			this.periodStr = ''
			if (this.form.cityId && this.form.carTypeYearProductId) {
				let item = this.selectProduct.carRentalDetailEntityList.find(city => city.cityId === this.form.cityId)
				if (!item) {
					item = this.commonItem
				}
				this.item = item
				
				if (this.form.businessType == 2) {
					this.form.carRentalDetailSubscribeId = this.item.typeReqVos[0].id
					this.form.money = this.item.typeReqVos[0].money
					this.form.deposit = this.item.deposit
				}
			}
		},
		
		openPeriodPopup() {
			if (!this.form.carTypeYearProductId) {
				uni.showToast({
					title: '请先选择车型',
					duration: 2000,
					icon: 'none'
				})
				return 
			}
			
			if (!this.form.cityId) {
				uni.showToast({
					title: '请先选择城市',
					duration: 2000,
					icon: 'none'
				})
				return 
			}
			
			this.showPeriodPopup = true
		},
		
		changePeriod(item) {
			this.selectPeriod = item.id
		},
		
		closePopup () {
			this.showPeriodPopup = false
		},
		
		savePeriod() {
			if (!this.selectPeriod) {
				uni.showToast({
					title: '请选择套餐',
					duration: 2000,
					icon: 'none'
				})
				return 
			}
			
			const plan = this.item.typeReqVos.find(item => item.id === this.selectPeriod)
			if (plan) {
				this.form.carRentalDetailSubscribeId = plan.id
				this.form.deposit = plan.depositDetail
				this.form.totalPayment = plan.totalMoney
				this.periodStr = `${plan.period}天套餐`
			}
			
			this.closePopup()
			this.getEndTime()
		},
		
		// 2.取车地址 3.还车地址
		handleAddress(type = 2) {
			wx.getSetting({
				success: (res) => {
					if (!res.authSetting['scope.userLocation']) {
						wx.authorize({
							scope: 'scope.userLocation',
							success: (res) => {
		
							},
							fail: (res) => {
								wx.showModal({
									title: '提示',
									content: '位置信息未授权，点击确定前往授权',
									success: function (res) {
										if (res.confirm) {
											wx.openSetting({
												success: (res) => {
													console.log('授权成功')
												}
											})
										}
									}
								})
							}
						})
					} else {
						uni.getLocation({
							type: "gcj02",
							success: (res) => {
								let latitude = res.latitude
								let longitude = res.longitude
								uni.chooseLocation({
									latitude,
									longitude,
									success: (result) => {
										if(type == 2) {
											this.form.pickUpAddress = result.name
											if(this.isSameAddr == 1) {
												this.form.returnAddress = result.name
											}
 										} else if(type == 3) {
											this.form.returnAddress = result.name
										} else {
											this.form.pickUpAddress = result.name
											this.form.returnAddress = result.name
										}
									}
								}) 
							}
						})
					}
				}
			})
		},
		
		async createRental() {
			if (this.userInfo) {
				if (!this.form.carTypeYearProductId) {
					uni.showToast({
						title: '请选择车型',
						duration: 2000,
						icon: 'none'
					})
					return 
				}
				
				if (!this.form.cityId) {
					uni.showToast({
						title: '请选择城市',
						duration: 2000,
						icon: 'none'
					})
					return 
				}
				
				if (!this.form.carRentalDetailSubscribeId) {
					uni.showToast({
						title: '请选择套餐',
						duration: 2000,
						icon: 'none'
					})
					return 
				}
				
				if (!this.form.startDate) {
					uni.showToast({
						title: '请选择用车时间',
						duration: 2000,
						icon: 'none'
					})
					return 
				}
				
				if (!this.form.endDate) {
					uni.showToast({
						title: '请选择还车时间',
						duration: 2000,
						icon: 'none'
					})
					return 
				}
				
				if (!this.form.pickUpAddress) {
					uni.showToast({
						title: '请输入送车地址',
						duration: 2000,
						icon: 'none'
					})
					return 
				}
				
				if (!this.form.returnAddress) {
					uni.showToast({
						title: '请输入还车地址',
						duration: 2000,
						icon: 'none'
					})
					return 
				}
				
				let riskAuditStatus = ''
				if (this.userInfo.riskAuditStatus) {
					riskAuditStatus = this.userInfo.riskAuditStatus
				}
				
				let idcard = ''
				let issue = ''
				if (this.userInfo.userInfoEntity) {
					idcard = this.userInfo.userInfoEntity.idcard || ''
					issue = this.userInfo.userInfoEntity.issue || ''
				}
				
				let depositFreeType = ''
				if (this.userInfo.depositFreeType) {
					depositFreeType = this.userInfo.depositFreeType
				}
				
				let companyName = ''
				if (this.userInfo.userCompanyEntity && this.userInfo.userCompanyEntity.companyName) {
					companyName = this.userInfo.userCompanyEntity.companyName
				}
				
				const res = await this.$getRequest(this.$url.createUserCarRentalSubscribe, 'POST', this.form)
				
				if(res.code === 0) {
					uni.removeStorageSync('rentalCarSelectProduct')
					uni.reLaunch({
						url: `/pagesOrder/identity/choose-identity?orderServiceType=2&riskAuditStatus=${riskAuditStatus}&id=${res.data}&idNum=${idcard}&username=${this.userInfo.name}&userId=${this.userInfo.id}&hasDepositFree=${this.userInfo.hasDepositFree}&cityId=${this.form.cityId}&cityName=${this.form.cityName}&issue=${issue}&depositFreeType=${depositFreeType}&companyName=${companyName}`
					})
				}
			} else {
				uni.navigateTo({
					url: `/pages/sign/sign`
				})
			}
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
			width: 0;
			flex: 1;
			padding-left: 20rpx;
			display: flex;
			align-items: center;
			justify-content: flex-end;
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

.operator {
	margin-top: 40rpx;
}

.btn {
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

.popup-wrap {
	padding: 32rpx 0 120rpx;
	.title {
		height: 60rpx;
		font-size: 20px;
		line-height: 60rpx;
		color: #141414;
		text-align: center;
		margin-bottom: 32rpx;
	}
	.container {
		border-top: 2rpx solid #F1F1F1;
		.radio-item {
			border-bottom: 2rpx solid #F1F1F1;
			height: 120rpx;
			padding-left: 40rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.left {
				.period {
					height: 44rpx;
					font-size: 28rpx;
					line-height: 44rpx;
					color: #3B3F57;
				}
				.active {
					color: #0AEB7D;
					font-weight: 400;
				}
				.price {
					height: 40rpx;
					font-size: 24rpx;
					line-height: 40rpx;
					color: rgba(10, 15, 45, 0.5);
				}
			}
			.right {
				display: flex;
				align-items: center;
				.total {
					padding-right: 24rpx;
					font-size: 28rpx;
					color: #0A0F2D;
				}
			}
		}
	}
	.btn-group {
		margin-top: 40rpx;
		display: flex;
		justify-content: center;
		.btn {
			margin-top: 0;
			width: 216rpx;
			height: 80rpx;
			border-radius: 8rpx;
			background: rgba(10, 15, 45, 0.04);
			color: rgba(10, 15, 45, 0.8);
			font-size: 34rpx;
		}
		.save-btn {
			margin-left: 32rpx;
			background: #0A0F2D;
			color: #FFFFFF;
		}
	}
}
</style>