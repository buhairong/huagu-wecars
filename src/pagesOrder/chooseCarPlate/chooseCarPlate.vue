<template>
	<view class="page">
		<view>
			<view class="header">
				<view class="left">当前所选用车城市：{{selCity.cityName}}</view>
				<view class="right" @click="changeCity">切换城市</view>
			</view>
			
			<view class="sub-title">
				<text v-if="selCity.isPlate == 1">{{selCity.cityName}}为限牌城市，</text>您的上牌计划是？
			</view>
			
			<template v-if="selCity.isPlate === 1">
				<button
					class="tab-btn"
					:class="{'active-btn': curPlate === 0}"
					@click="changePlate(0)"
				>
					<view class="btn-title">我有牌照</view>
				</button>
				
				<button
					class="tab-btn"
					:class="{'active-btn': curPlate === 1}"
					@click="changePlate(1)"
				>
					<view class="btn-title">我没有牌照</view>
				</button>
			</template>
			
			<button
				v-else
				class="tab-btn"
				:class="{'active-btn': curPlate === 2}"
				@click="changePlate(2)"
			>
				<view class="btn-title">我需要使用「{{selCity.cityName}}」牌照</view>
				<view class="btn-text">使用{{selCity.cityName}}牌照，无额外牌照费用</view>
			</button>
			
			<u-select
				v-model="showCityList" 
				:list="cityList"
				@confirm="confirmCity"
			></u-select>
			
			<u-modal
				v-model="showThirdPopup"
				title="使用第三方牌照"
				:show-cancel-button="true"
				confirm-text="确定"
				cancel-text="取消"
				@confirm="confirmModal"
				@cancel="cancelModal"
			>
				<view class="slot-content">
					<view class="model-content">
						<view class="modal-title">租赁第三方牌照费用将合并至订阅费用一同支付</view>
						<view class="modal-item">
							<view class="left">
								租赁周期
							</view>
							<view class="right">
								{{selCity.period}}个月
							</view>
						</view>
						
						<view class="modal-item" style="margin-bottom:30px;">
							<view class="left">
								牌照费用
							</view>
							<view class="right">
								<template v-if="selCity.plateMonthPrice">
									￥{{selCity.plateMonthPrice | $numFormat}}/月
								</template>
								<template v-else>￥0</template>
							</view>
						</view>
					</view>
				</view>
			</u-modal>
			
			<u-modal
				v-model="showComfirmCityModal"
				title="更换用车城市"
				:show-cancel-button="true"
				confirm-text="确定"
				cancel-text="取消"
				@confirm="confirmCityModal"
				@cancel="cancelCityModal"
			>
				<view class="slot-content">
					<view class="model-content">
						<view class="modal-text">您确认将用车城市切换到 {{modalCity.cityName}}？</view>
					</view>
				</view>
			</u-modal>
		</view>
		
		<!-- <button class="next-btn" :disabled="!(curPlate === 0 || curPlate === 1)" @click="goNextPage">下一步</button> -->
		
		
		<!-- <view class="plate-card" @click="openThirdPopup()">
			<template v-if="selCity.isPlate == 1">
				<view class="card-title" >暂无用车城市牌照</view>
				<view class="card-text">租赁第三方牌照，车辆落户第三方名下</view>
			</template>
			<template v-else>
				<view class="card-text" style="font-size:17px;margin-top:0;height:unset;">使用第三方牌照，车辆落户第三方名下</view>
			</template>
			
		</view> -->
		
		
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
			cityList: [],
			selCity: {},
			showThirdPopup: false,
			showCityList: false,
			orderId: null,
			from: '',
			showComfirmCityModal: false,
			modalCity: {},
			btnCards: [
				{id: 0, title: '我有牌照', text: '使用自有牌照，无需租赁牌照'},
				{id: 1, title: '我没有牌照', text: '租赁第三方牌照，车辆落户第三方名下'},
			],
			curPlate: null,
		}
	},
	
	onLoad(options) {
		this.id = options.id
		this.index = options.index
		this.cartype = options.cartype
		this.cityId = options.cityId
		this.orderId = options.orderId
		this.from = options.from
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
						this.cityList = res.data
						this.cityList.forEach(item => {
							item.text = item.cityName
							item.value = item.cityId
							item.label = item.cityName
						})
						
						const index = res.data.findIndex(item => item.cityId == cityId)
						if (index === -1) {
							cityId = 310100
							this.cityId = 310100
						}
						
						const city = res.data.find(item => item.cityId == cityId)
						if (city) {
							this.selCity = city
							if (city.isPlate === 0 && this.from === 'cardetailpage') {
								// if (this.selCity.isPlate == 1) {
								// 	this.changePlate(1)
								// }
							}
							
							if (this.from === 'changeCity') {
								this.showCityList = true
							}
						}
					}
				})
		},
		
		changePlate(curPlate) {
			this.curPlate = curPlate
			if (curPlate === 2) {
				curPlate = 0
			}
			
			if (curPlate === 1) {
				uni.navigateTo({
					url: `/pagesOrder/chooseCarPlate/restrictedCityCarPlate?id=${this.id}&cityId=${this.cityId}&cityName=${this.selCity.cityName}&plateMonthPrice=${this.selCity.plateMonthPrice}&index=3&cartype=1&from=cardetailpage`
				})
			} else {
				this.changePlate1(curPlate)
			}
		},
		
		changePlate1(curPlate) {
			if (this.orderId) {
				this.$getRequest(this.$url.updatePlateScheme, 'GET', {
					userPlate: curPlate,
					id: this.orderId,
					cityId: this.selCity.cityId,
				}).then((res) => {
					if(res.code == 0) {
						this.goOrderDetailPage(curPlate)
					}
				})
			} else {
				this.goOrderDetailPage(curPlate)
			}	
		},
		
		// 0.使用自备牌照 1.使用第三方牌照
		goOrderDetailPage(curPlate) {
			const url = `/pagesOrder/order-detail/order-detail?id=${this.id}&cityId=${this.cityId}&curPlate=${curPlate}&cartype=${this.cartype}&orderId=${this.orderId ? this.orderId : ''}&index=3`
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
		
		changeCity() {
			this.showCityList = true
		},
		
		openThirdPopup() {
			this.showThirdPopup = true
		},
		
		confirmModal() {
			this.changePlate1(1)
		},
		
		cancelModal() {
			this.showThirdPopup = false
		},
		
		confirmCity(e) {
			this.cityId = e[0].value
			const city = this.cityList.find(item => item.cityId == this.cityId)
			if (city) {
				this.selCity = city
				// if (city.isPlate === 0) {
				// 	this.modalCity = city
				// 	this.showComfirmCityModal = true
				// } else {
				// 	this.selCity = city
				// }
			}
		},
		
		confirmCityModal() {
			this.selCity = this.modalCity
			this.curPlate = null
			this.showComfirmCityModal = false
		},
		
		cancelCityModal() {
			this.showComfirmCityModal = false
		},
		
		goNextPage() {
			if (this.curPlate == 1) {
				this.openThirdPopup()
			} else {
				this.changePlate1(0)
			}
		},
	}
}
</script>

<style lang="scss" scoped>
.page {
	padding: 40px 48rpx;
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	.header {
		display: flex;
		justify-content: space-between;
		.left {
			line-height: 56rpx;
			font-size: 20px;
			color: #0A0F2D;
			font-weight: 500;
		}
		.right {
			padding-left: 24rpx;
			height: 56rpx;
			line-height: 56rpx;
			font-size: 14px;
			color: rgba(10, 15, 45, 0.5);
		}
	}
	.sub-title {
		margin-top: 8px;
		margin-bottom: 60px;
		height: 44rpx;
		font-size: 14px;
		line-height: 44rpx;
		color: rgba(10, 15, 45, 0.5);
	}
	
	.plate-card {
		padding: 0;
		width: 100%;
		height: 158rpx;
		border-radius: 16rpx;
		background: #F5F6F7;
		margin-bottom: 20px;
		border: none;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.card-title {
			height: 48rpx;
			font-size: 17px;
			color: #0A0F2D;
			font-weight: 500;
		}
		.card-text {
			margin-top: 4px;
			height: 34rpx;
			font-size: 12px;
			color: rgba(10, 15, 45, 0.6);
		}
	}
	.model-content {
		padding: 0 64rpx;
	}
	.modal-title {
		margin-top: 10px;
		margin-bottom: 30px;
		height: 36rpx;
		font-size: 12px;
		line-height: 36rpx;
		color: rgba(10, 15, 45, 0.5);
		font-weight: 500;
	}
	.modal-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8px;
		height: 44rpx;
		font-size: 14px;
		.left {
			color: #64696F;
		}
		.right {
			color: #141414;
		}
	}
}

.modal-text {
	height: 44rpx;
	font-size: 16px;
	line-height: 44rpx;
	color: #434343;
	text-align: center;
	padding-top: 50px;
	padding-bottom: 60px;
}

::v-deep .u-mode-center-box {
	width: 320px !important;
}

// ::v-deep .u-drawer__scroll-view {
// 	height: 300px !important;
// }

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
