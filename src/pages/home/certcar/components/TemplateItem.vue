<template>
	<view v-if="item" class="card-wrap">
		<view class="card" @click="preChooseCarPlatePage">
			
			<!-- <view class="plan-title">选择方案</view>
			<view class="plan-list">
					<view 
							class="plan"
							:class="{'checked-plan': true}"
					>
							<view class="plan-item1">12期订阅</view>
							<view class="plan-item2">￥{{6000 | $numFormat}}/月</view>
							<view class="plan-item3">一次性付</view>
							
							<view class="checked-icon-wrap">
								<u-icon name="checkmark" color="#ffffff" size="16"></u-icon>
							</view>
					</view>
			</view> -->
			
			<view class="plan-item" v-if="newType == 1">
				<view class="item-title">用车城市：</view>
				<view class="item-content">
					<view class="city" @click.stop="openCityList">
						{{selCityName}}
						<!-- <image
							class="switch-img"
							src="https://image.51cheyaoshi.com/xcx/merchant/static/home/swap.png"
							mode="widthFix"
						/> -->
						<view class="change-city-link">切换城市</view>
					</view>
				</view>
			</view>
			
			<view class="plan-item">
				<view class="item-title">订阅费用：</view>
				<view class="item-content item-sub" style="margin-top:0;">
					<view class="left">
						<text style="color:#F51A4E; font-weight: 500; font-size:16px">{{item.monthPay | $numFormat}}<text style="font-size: 12px;">元/月</text></text>
						<view style="margin-left: 16rpx;" @click.stop="openPopup">
							<u-icon class="info-circle" name="info-circle"></u-icon>
						</view>
					</view>
				</view>
			</view>
			
			<view class="plan-item">
				<view class="item-title">订阅周期：</view>
				<view class="item-content">
					{{item.monthTotal}}期
				</view>
			</view>
			
			<view class="plan-item">
				<view class="item-title">车辆押金：</view>
				<view class="item-content">
					{{item.deposit | $numFormat}}元
					<text style="padding-left:14rpx;font-size: 14px;color:rgba(10, 15, 45, 0.5);">(买断可抵尾款)</text>
				</view>
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
			
			<view class="plan-item">
				<view class="item-title">期末可选：</view>
				<view class="item-content">
					<view class="item-sub" v-if="item.finalSelect.includes(-1)">
						<view class="left" style="height:44rpx;line-height:44rpx;">
							继续订阅 <text style="padding-left:24rpx;color:rgba(10, 15, 45, 0.5);">{{item.nextMouthPayment | $numFormat}}<text style="font-size: 12px;">元/月</text></text>
						</view>
					</view>
					
					<view class="item-sub" v-if="item.finalSelect.includes(0)">
						<view class="left" style="height:44rpx;line-height:44rpx;">
							买断车辆 <text style="padding-left:24rpx;color:rgba(10, 15, 45, 0.5);">{{item.buyoutsFee | $numFormat}}元</text>
						</view>
					</view>
					
					<view class="item-sub" v-if="item.finalSelect.includes(1)">
						<view class="left" style="height:44rpx;line-height:44rpx;">
							退回车辆 <text style="padding-left:24rpx;color:rgba(10, 15, 45, 0.5);">(押金原路退还)</text>
						</view>
					</view>
				</view>
			 </view>
			 
		
		</view>
		
		<u-popup class='popupClass' border-radius="14" closeable=true mode="bottom" v-model="showPopup">
			<view class="popupClassTop">汽车订阅</view>
			<view class="popupClassBom">
				    汽车订阅是一种让您可以「后悔」的全新汽车消费模式。您仅需一次性支付当期订阅费用，即可开走车辆。 订阅期结束30天前，您再决定是否买断车辆，届时您可以选择全款或金融方案支付尾款购买车辆，也可选择继续订阅或退回车辆结束订阅。
			</view>
		</u-popup>
		
		<!-- <u-popup border-radius="14" mode="center" v-model="showCityList">
			<view class="wrap">
				<view class="title">选择城市</view>
				<view class="city-list">
						<view 
								v-for="city in cityList"
								:key="city.id"
								class="city"
								:class="{'active-city': city.id == selCityId}"
								@click="changeCity(city)"
						>
								{{ city.city }}
						</view>
				</view>
			</view>
		</u-popup> -->
		
		<u-select
			v-model="showCityList" 
			:list="cityList"
			@confirm="confirmCity"
		></u-select>
	</view>
</template>

<script>
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
		
		newType: {
			type: Number | String,
			required: true,
		},
		
		cityId: {
			type: Number | String,
			required: true,
		},
	},
	
	data() {
		return {
			showPopup: false,
			selCityId: null,
			selCityName: '',
			item: null,
			commonItem: {},
			cityList: [],
			showCityList: false,
		}
	},
	
	watch: {
		templateRespVO: {
			handler(val) {
				console.log('handler', val)
				this.init()
			},
			deep: true,
		}
	},
	
	async mounted() {
		this.selCityId = this.cityId
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
			const item = this.templateRespVO.find(city => city.cityId == this.selCityId)
			if (item) {
				this.item = item
			} else {
				this.item = this.commonItem
			}
			
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
			this.selCityId = city.id
			this.selCityName = city.city
			this.getCurItem()
			this.showCityList = false
		},
		
		confirmCity(e) {
			this.selCityId = e[0].value
			this.selCityName = e[0].label
			this.getCurItem()
			const value = uni.getStorageSync('isFirstLoginCity')
			if (!value || value != this.cityId) {
				uni.setStorageSync('isFirstLoginCity', this.selCityId)
			}
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
	padding: 20px 40rpx;
	.title{
		width: 100%;
		text-align: center;
		margin: 24px 0;
		height: 21px;
		font-size: 15px;
		font-weight: 500;
		line-height: 21px;
		color: rgba(0, 0, 0, 0.9);
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
</style>