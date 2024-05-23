<template>
	<view v-if="item" class="card-wrap">
		<view class="card">
			
			<view class="plan-title">选择方案</view>
			<view class="plan-list">
					<view 
						v-for="plan in selCity.respVOS"
						:key="plan.id"
						class="plan"
						:class="{'checked-plan': plan.id === selCity.id}"
						@click.stop="changePlan(plan.id)"
					>
							<view class="plan-item1">{{plan.subscribeName}}</view>
							<view class="plan-item2">
								￥{{(plan.monthPay+selCityPlatePrice) | $numFormat}}/月
							</view>
							<view class="plan-item3">
								{{plan.paymentTypeStr}}
							</view>
							
							<view class="checked-icon-wrap">
								<u-icon name="checkmark" color="#ffffff" size="16"></u-icon>
							</view>
					</view>
			</view>
			
			<view class="plan-item" v-if="newType == 1">
				<view class="item-title">用车城市：</view>
				<view class="item-content">
					<view class="city" @click.stop="openCityList">
						{{selCityName}}
						<view class="change-city-link">切换城市</view>
					</view>
				</view>
			</view>
			
			<view class="plan-item">
				<view class="item-title">期末可选：</view>
				<view class="item-content">
					<view class="item-sub" v-if="item.finalSelect.includes(-1)">
						<view class="left" style="height:44rpx;line-height:44rpx;">
							继续订阅 <text style="padding-left:24rpx;color:rgba(10, 15, 45, 0.5);">{{(item.nextMouthPayment+selCityPlatePrice) | $numFormat}}<text style="font-size: 12px;">元/月</text></text>
						</view>
					</view>
					
					<view class="item-sub" v-if="item.finalSelect.includes(0)">
						<view class="left" style="height:44rpx;line-height:44rpx;">
							买断车辆 <text style="padding-left:24rpx;color:rgba(10, 15, 45, 0.5);">{{item.buyoutsFee | $numFormat}}元</text>
						</view>
					</view>
					
					<view class="item-sub" v-if="item.finalSelect.includes(1)">
						<view class="left" style="height:44rpx;line-height:44rpx;">
							退回车辆
						</view>
					</view>
				</view>
			 </view>
			 
			<!-- 0 未申请 1申请中 2审批通过 3 审批拒绝-->
			<!-- <view class="plan-item" v-if="partnerInfo && (partnerInfo.hasDepositFree === 3 || (partnerInfo.hasDepositFree === 2 && partnerInfo.career == 7 && partnerInfo.depositFreeCityId != selCityId))">
				<view class="item-title">车辆押金：</view>
				<view class="item-content">
					{{item.deposit | $numFormat}}元
					<text style="padding-left:14rpx;font-size: 14px;color:rgba(10, 15, 45, 0.5);">(买断可抵尾款)</text>
				</view>
			</view> -->
			 
			<view class="plan-item">
				<view class="item-title">违章押金：</view>
				<view class="item-content">{{violationDeposit | $numFormat}}元</view>
			</view>
			
			<view class="plan-item" v-if="item.serviceStr">
				<view class="item-title">精选服务：</view>
				<view class="item-content item-sub" style='margin-top: 0;'>
					<view class="left" style="line-height:44rpx;">
						{{item.serviceStr}}
					</view>
					<view class="right"></view>
				</view>
			</view>
			
			<template v-if="partnerInfo && partnerInfo.isPartner === 1 && partnerInfo.isFreezed === 0">
				<view class="card-line"></view>
				
				<view class="price-wrap" v-if="showDistributionBrokerageFree === 1 && item.distributionBrokerageFree">
					<view class="left">
						<view class="label">佣金金额：</view>
						<view class="price">{{item.distributionBrokerageFree | $numFormat}} 元</view>
					</view>
					<u-switch
						v-model="showDistributionBrokerageFree" 
						active-color="#31C37B" 
						inactive-color="rgba(114, 114, 114, 0.6)"
						:active-value="1" 
						:inactive-value="0"
						size="24"
						@change="toggleShowDistributionBrokerageFree"
					></u-switch>
				</view>
				<view class="qrcode-wrap" @click="goQrCodePage">
					<image
						style="width:140rpx;height:140rpx;"
					  :src="qrCodeUrl"
					/>
					<view class="qrcode-tip">点击放大，扫码下单</view>
				</view>
			</template>
		</view>
		
		<u-popup class='popupClass' border-radius="14" closeable=true mode="bottom" v-model="showPopup">
			<view class="popupClassTop">汽车订阅</view>
			<view class="popupClassBom">
				    汽车订阅是一种让您可以「后悔」的全新汽车消费模式。您仅需一次性支付当期订阅费用，即可开走车辆。 订阅期结束30天前，您再决定是否买断车辆，届时您可以选择全款或金融方案支付尾款购买车辆，也可选择继续订阅或退回车辆结束订阅。
			</view>
		</u-popup>
		
		<u-popup border-radius="14" mode="center" v-model="showMorePayPopup">
			<view class="wrap">
				<view class="title">订阅12期</view>
				<view class="sub-title">（分两次付）</view>
				<view class="pay-table">
					<view 
							v-for="(item1, index1) in morePayList"
							:key="index1"
							class="pay-row"
					>
						<view class="pay-col">{{item1.periodName}}</view>
						<view class="pay-col">{{item1.monthPayment | $numFormat}}元/月</view>
						<view class="pay-col">{{item1.totalPayment | $numFormat}}元</view>
					</view>
				</view>
				<view class="btn" @click.stop="closeMorePayPopup">我知道了</view>
			</view>
		</u-popup>
		
		<u-select
			v-model="showCityList" 
			:list="cityList"
			@confirm="confirmCity"
		></u-select>
	</view>
</template>

<script>
import { violationDeposit } from "@/constants"

export default {
	props: {
		templateRespVO: {
			type: Array,
			required: true,
		},
		
		userInfo: {
			type: Object | null,
			required: true,
		},
		
		partnerInfo: {
			type: Object | null,
			required: true,
		},
		
		newType: {
			type: Number | String,
			required: true,
		},
		
		cityId: {
			type: Number | String,
			required: true,
		},
		
		thirdAppSubscribeId: {
			type: Number | String,
			required: true,
		},
		
		carProductEntity: {
			type: Object | null,
			required: true,
		},
	},
	
	data() {
		return {
			violationDeposit,
			showPopup: false,
			selCityId: null,
			selCityName: '',
			selCityPlatePrice: 0,
			item: null,
			selCity: {},
			commonItem: {},
			cityList: [],
			showCityList: false,
			thirdSubscribeId: '',
			showMorePayPopup: false,
			morePayList: [],
			qrCodeUrl: '',
			showDistributionBrokerageFree: 0,
		}
	},
	
	watch: {
		templateRespVO: {
			handler(val) {
				this.init()
			},
			deep: true,
		}
	},
	
	async mounted() {
		console.log('carProductEntity', this.carProductEntity)
		this.selCityId = this.cityId
		this.thirdSubscribeId = this.thirdAppSubscribeId
		this.showDistributionBrokerageFree = this.partnerInfo.showDistributionBrokerageFree
		await this.getAllCity()
		this.init()
	},
	
	methods: {
		init() {
			if (this.newType == 1) {
				const item = this.templateRespVO.find(city => city.cityId === 0)
				if (item) {
					this.commonItem = item
				}
				
				this.getCurItem()
			} else {
				this.item = this.templateRespVO[0]
			}
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
						const city = res.data.find(city => city.id == this.cityId)
						if (city) {
							this.selCityName = city.city
							this.selCityPlatePrice = city.energyVehiclesPlatePrice || 0
							
							const value = uni.getStorageSync('isFirstLoginCity')
							if (!value || value != this.cityId) {
								uni.showModal({
									title: '提示',
									content: `您当前所在城市：${city.city} 是否确认用车城市？`,
									confirmText: '确认',
									cancelText: '切换城市',
									success: (res) => {
										if (res.confirm) {
											this.selCityId = this.cityId
											this.selCityName = city.city
											this.selCityPlatePrice = city.energyVehiclesPlatePrice || 0
											this.getCurItem()
											uni.setStorageSync('isFirstLoginCity', this.selCityId)
										} else if (res.cancel) {
											this.openCityList()
										}
									},
									fail: (err) => {
										console.log('fail', err)
									}
								})
							}
						} else {
							uni.showModal({
								title: '提示',
								content: '很抱歉，您所在的城市暂未开放订阅方案，请选择可用订阅方案城市。',
								confirmText: '选择城市',
								success: (res) => {
									if (res.confirm) {
										this.showCityList = true
									} else if (res.cancel) {
										this.selCityId = '310100'
										this.selCityName = '上海'
										const city = res.data.find(city => city.id == 310100)
										if (city) {
											if(this.carProductEntity.powerMode == 1) {
												this.selCityPlatePrice = city.trackPlatePrice || 0
											} else {
												this.selCityPlatePrice = city.energyVehiclesPlatePrice || 0
											}
											
										}
										this.getCurItem()
									}
								},
								fail: (err) => {
									console.log('fail', err)
								}
							})
						}
					}
				})
		},
		
		getCurItem() {
			const city = this.templateRespVO.find(city => city.cityId == this.selCityId)
			if (city) {
				this.selCity = city
			} else {
				this.selCity = this.commonItem
			}
			
			if (this.thirdSubscribeId) {
				const item = this.selCity.respVOS.find(plan => plan.id == this.thirdSubscribeId)
				this.selCity.id = item.id
				this.item = item
				this.thirdSubscribeId = ''
			} else {
				this.selCity.id = this.selCity.respVOS[0].id
				this.item = this.selCity.respVOS[0]
			}
			
			this.getWecarsQrCode()
			
			this.$emit('change', {
				item: this.item,
				selCityId: this.selCityId
			})
		},
		
		changePlan(id) {
			this.selCity.id = id
			this.item = this.selCity.respVOS.find(plan => plan.id === this.selCity.id)
			this.getWecarsQrCode()
			this.$emit('change', {
				item: this.item,
				selCityId: this.selCityId
			})
		},
		
		openPopup() {
			this.showPopup = true
		},
		
		preChooseCarPlatePage() {
			if (this.templateRespVO.length > 1) {
				this.goChooseCarPlatePage(this.item)
			}
		},
		
		goChooseCarPlatePage(item) {
			if (this.userInfo) {
				uni.navigateTo({
					url: `/pagesOrder/chooseCarPlate/chooseCarPlate?id=${item.id}&cityId=${this.cityId}&index=3&cartype=${this.newType}&from=cardetailpage`
				})
			} else {
				const routes = getCurrentPages(); // 获取当前打开过的页面路由数组
				const curRoute = routes[routes.length - 1] // 获取当前页面路由，也就是最后一个打开的页面路由
				let path = curRoute.route
				const option = curRoute.options
				const keys = Object.keys(option)
				keys.forEach((key, index) => {
					if (index === 0) {
						path += `?${key}=${option[key]}`
					} else {
						path += `&${key}=${option[key]}`
					}
				})
				this.$u.route("/pages/sign/sign")
			}
		},
		
		openCityList() {
			this.showCityList = true
		},
		
		changeCity(city) {
			console.log('changeCity', city)
			this.selCityId = city.id
			this.selCityName = city.city
			if(this.carProductEntity.powerMode == 1) {
				this.selCityPlatePrice = city.trackPlatePrice || 0
			} else {
				this.selCityPlatePrice = city.energyVehiclesPlatePrice || 0
			}
			this.getCurItem()
			this.showCityList = false
		},
		
		confirmCity(e) {
			console.log('confirmCity', e)
			this.selCityId = e[0].value
			this.selCityName = e[0].label
			const city = this.cityList.find(city => city.id == e[0].value)
			if (city) {
				this.selCityPlatePrice = city.energyVehiclesPlatePrice || 0
			}
			this.getCurItem()
			const value = uni.getStorageSync('isFirstLoginCity')
			if (!value || value != this.cityId) {
				uni.setStorageSync('isFirstLoginCity', this.selCityId)
			}
		},
		
		openMorePayPopup(plan) {
			this.morePayList = plan
			this.showMorePayPopup = true
		},
		
		closeMorePayPopup() {
			this.showMorePayPopup = false
		},
		
		// 获取小程序码
		async getWecarsQrCode() {
			const res = await this.$getRequest(this.$url.createQrCode, 'POST', {
			  envVersion: 1,
				page: 'pages/home/profile/index',
				scene: `${this.selCityId}&${this.carProductEntity.id}&${this.partnerInfo.id}&${this.carProductEntity.carBrandId}&&${this.selCity.id}`
			})
			if (res.code == 0) {
				this.qrCodeUrl = res.data
			}
		},
		
		goQrCodePage() {
			uni.navigateTo({
				url: `/partner/qrcode/qrcode?page=2&userId=${this.partnerInfo.id}&brand=${this.carProductEntity.carBrand}&type=${this.carProductEntity.carType}&year=${this.carProductEntity.carTypeYear}&product=${this.carProductEntity.carTypeYearProduct}&productId=${this.carProductEntity.id}&brandId=${this.carProductEntity.carBrandId}&cityId=${this.selCityId}&planId=${this.selCity.id}`
			})
		},
		
		toggleShowDistributionBrokerageFree(e) {
			const data = {
				userId: this.partnerInfo.id,
				showDistributionBrokerageFree: 0
			}
			
			this.$getRequest(this.$url.showDistributionBrokerageFree, "GET", data).then(res => {
				if (res.code === 0) {
					uni.showModal({
						title: '提示',
						content: '详情页显示佣金已关闭。要在产品详情页显示合伙人佣金金额，请前往「我的」-「详情页显示佣金」开启。',
						confirmText: '我知道了',
						showCancel: false
					})
					getApp().globalData.userInfo.showDistributionBrokerageFree = 0
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
@import "~@/styles/common.scss";

.card-wrap {
	margin-top: 12px;
	padding: 0 32rpx;
}

.plan-item {
	margin-top: 12px;
	display: flex;
	.item-title {
		margin-right: 24rpx;
		height: 44rpx;
		font-size: 14px;
		line-height: 44rpx;
		color: #64696F;
	}
	.item-content {
		flex: 1;
		font-size: 14px;
		line-height: 44rpx;
		color: #0A0F2D;
	}
	.item-sub {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.left {
			flex: 1;
			font-size: 14px;
			line-height: 44rpx;
			color: #0A0F2D;
			display: flex;
			align-items: center;
		}
		.right {
			margin-left: 20rpx;
			width: 44rpx;
			height: 44rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
	
	.item-sub {
		margin-top: 12px;
		&:first-child {
			margin-top: 0;
		}
	}
}

.city {
	display: flex;
	align-items: center;
	.change-city-link {
		padding-left: 24rpx;
		font-size: 12px;
		text-decoration: underline;
		color: #3446AA;
	}
}

.switch-img {
	width: 32rpx;
	margin-left: 10rpx;
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

.wrap {
	width: 640rpx;
	padding: 50rpx 32rpx 32rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	.title{
		height: 48rpx;
		font-size: 34rpx;
		line-height: 48rpx;
		color: rgba(0, 0, 0, 0.9);
	}
	.sub-title {
		margin-top: 12rpx;
		margin-bottom: 32rpx;
		height: 48rpx;
		font-size: 24rpx;
		line-height: 48rpx;
		color: #767676;
	}
	.pay-table {
		width: 100%;
		border-radius: 8px;
		border: 2rpx solid rgba(10, 15, 45, 0.2);
		.pay-row {
			height: 90rpx;
			display: flex;
			border-bottom: 2rpx solid rgba(10, 15, 45, 0.2);
			font-size: 24rpx;
			color: rgba(10, 15, 45, 0.6);
			.pay-col {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				border-right: 2rpx solid rgba(10, 15, 45, 0.2);
			}
			.pay-col:last-child {
				border-right: none;
			}
		}
		.pay-row:last-child {
			border-bottom: none;
			color: rgba(10, 15, 45, 0.7);
		}
	}
	.btn {
		margin-top: 70rpx;
		width: 100%;
		height: 88rpx;
		border-radius: 16rpx;
		background: rgba(10, 15, 45, 0.9);
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 14px;
		color: #FFFFFF;
	}
}

.city-list {
    display: flex;
    flex-wrap: wrap;
    .city {
        margin-right: 16px;
        margin-bottom: 16px;
        height: 28px;
        line-height: 28px;
        border-radius: 2px;
        display: flex;
        padding: 0 6px;
        background: #F2F3F5;
        color: #848484;
        font-size: 14px;
        cursor: default;
    }
    .active-city {
        border: 1px solid #3446AA;
    }
}

.plan-title {
	height: 44rpx;
	font-size: 32rpx;
	line-height: 44rpx;
	color: #333333;
}

.plan-list {
	margin-top: 12px;
	display: flex;
	flex-wrap: wrap;
	.plan {
		margin-right: 24rpx;
		padding: 16rpx 0;
		width: 190rpx;
		height: 156rpx;
		border-radius: 8rpx;
		border: 2rpx solid rgba(10, 15, 45, 0.3);
		display: flex;
		flex-direction: column;
		align-items: center;
		.plan-item1 {
			height: 44rpx;
			font-size: 28rpx;
			line-height: 44rpx;
			color: #0A0F2D;
		}
		.plan-item2 {
			height: 40rpx;
			font-size: 12px;
			line-height: 40rpx;
			color: #0A0F2D;
		}
		.plan-item3 {
			height: 40rpx;
			font-size: 12px;
			line-height: 40rpx;
			color: rgba(10, 15, 45, 0.5);
			display: flex;
			align-items: center;
		}
	}
	.plan:last-child {
		margin-right: 0;
	}
	.checked-plan {
		position: relative;
		border-color: rgba(10, 235, 125, 0.6);
		.checked-icon-wrap {
			width: 24rpx;
			height: 24rpx;
			background: rgba(10, 235, 125, 0.6);
			border-radius: 0px 6rpx 0px 4rpx;
			position: absolute;
			top: 0;
			right: 0;
			z-index: 100;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
}

.card-line {
	margin: 40rpx 0;
	width: 100%;
	height: 0;
	border-top: 2rpx dashed #D8D8D8;
}

.price-wrap {
	display: flex;
	justify-content: space-between;
	align-items: center;
	.left {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		.label {
			color: #64696F;
			padding-right: 24rpx;
		}
		.price {
			color: #EA0000;
		}
	}
}

.qrcode-wrap {
	margin-top: 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	.qrcode-tip {
		height: 48rpx;
		font-size: 22rpx;
		line-height: 48rpx;
		color: rgba(118, 118, 118, 0.8);
	}
}
</style>