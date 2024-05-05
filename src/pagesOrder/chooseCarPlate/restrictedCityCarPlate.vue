<template>
	<view class="page">
		<view class="header">当前所选用车城市：{{selCity.cityName}}</view>
		
		<view class="sub-title">您没有限牌城市牌照，请选择上牌方案</view>
		
		<button
			class="tab-btn"
			:class="{'active-btn': curPlate === 0}"
			@click="changePlate(0)"
		>
			<view class="btn-title">我接受「{{selCity.freeCityName}}」牌照</view>
			<view class="btn-text">使用{{selCity.freeCityName}}牌照，无额外牌照费用</view>
		</button>
		
		<button
			class="tab-btn"
			:class="{'active-btn': curPlate === 1}"
			@click="changePlate(1)"
		>
			<view class="btn-title">我需要使用「{{selCity.cityName}}」牌照</view>
			<view class="btn-text">使用{{selCity.cityName}}牌照，牌照费用{{selCity.plateMonthPrice | $numFormat}}元/月（一次性支付）</view>
		</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			id: null,
			index: 3,
			cartype: null,
			cityId: null,
			orderId: null,
			from: '',
			cityList: [],
			selCity: {},
			carTypeYearProductId: '',
		}
	},
	
	onLoad(options) {
		this.id = options.id
		this.index = options.index
		this.cartype = options.cartype
		this.cityId = options.cityId
		this.orderId = options.orderId
		this.from = options.from
		this.carTypeYearProductId = options.carTypeYearProductId
		this.selectFinanceCityAndPlateMoney(options.id, options.cityId)
	},
	
	onShow() {
		
	},
	
	methods: {
		selectFinanceCityAndPlateMoney(id, cityId) {
				this.$getRequest(this.$url.selectFinanceCityAndPlateMoney, 'GET', {
					id
				}).then(res => {
					if (res.code === 0 && res.data && res.data.length) {
						const city = res.data.find(item => item.cityId == cityId)
						if (city) {
							this.selCity = city
						}
					}
				})
		},
		
		changePlate(curPlate) {
			this.curPlate = curPlate
			let plateCityId = this.selCity.cityId
			let plateCityName = this.selCity.cityName
			
			if (curPlate === 0) {
				plateCityId = this.selCity.freeCityId
				plateCityName = this.selCity.freeCityName
			}
			
			const params = {
				cityId: this.selCity.cityId,
				id: this.orderId,
				plateCityId,
				plateCityName,
			}
			
			if (this.orderId) {
				this.$getRequest(this.$url.updatePlateScheme, 'POST', params).then((res) => {
					if(res.code == 0) {
						this.goOrderDetailPage(plateCityId, plateCityName)
					}
				})
			} else {
				this.goOrderDetailPage(plateCityId, plateCityName)
			}	
		},
		
		// 0.使用自备牌照 1.使用第三方牌照
		goOrderDetailPage(plateCityId, plateCityName) {
			const url = `/pagesOrder/order-detail/order-detail?id=${this.id}&cityId=${this.cityId}&carTypeYearProductId=${this.carTypeYearProductId}&plateCityId=${plateCityId}&plateCityName=${plateCityName}&curPlate=1&cartype=${this.cartype}&orderId=${this.orderId ? this.orderId : ''}&index=3`
			if (this.from === 'cardetailpage') {
				uni.navigateTo({
					url,
				})
			} else {
				uni.reLaunch({
					url,
				})
			}
		},
	}
}
</script>

<style lang="scss" scoped>
.page {
	padding: 40px 48rpx;
	.header {
		display: flex;
		justify-content: space-between;
		line-height: 56rpx;
		font-size: 20px;
		color: #0A0F2D;
		font-weight: 500;
	}
	.sub-title {
		margin-top: 8px;
		margin-bottom: 60px;
		height: 44rpx;
		font-size: 14px;
		line-height: 44rpx;
		color: rgba(10, 15, 45, 0.5);
	}
}

.tab-btn {
	margin-top: 20px;
	width: 100%;
	height: 158rpx;
	border-radius: 16rpx;
	background: rgba(10, 15, 45, 0.04);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	font-size: 17px;
	color: #FFFFFF;
	.btn-title {
		height: 48rpx;
		line-height: 48rpx;
		font-size: 17px;
		color: #0A0F2D;
	}
	
	.btn-text {
		margin-top: 4px;
		height: 34rpx;
		line-height: 34rpx;
		font-size: 12px;
		color: rgba(10, 15, 45, 0.6);
	}
}

button::after {
	border: none;
}

.tab-btn[aria-disabled="true"] {
	background: rgba(10, 15, 45, 0.04);
	.btn-title, .btn-text {
		color: rgba(10, 15, 45, 0.2);
	}
}

.active-btn {
	background: #6CF3B1;
}

.next-btn {
	width: 100%;
	height: 116rpx;
	border-radius: 16rpx;
	background: #0A0F2D;
	color: #FFFFFF;
	font-size: 17px;
	display: flex;
	justify-content: center;
	align-items: center;
}

.next-btn[aria-disabled="true"] {
	background: rgba(10, 15, 45, 0.3);
}
</style>
