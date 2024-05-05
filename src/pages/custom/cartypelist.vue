<template>
	<view class="wrap">
		<view class="select-wrap">
			<view class="left-scroll-wrap" style="width:334rpx">
				<scroll-view
					scroll-y="true" 
					class="car-type-list-scroll"
					:scroll-with-animation="true"
					style="width:334rpx"
				>
					<view class="car-type-list">
						<view 
							class="car-type"
							v-for="item in carType"
							:key="item.id"
							:class="{'active-car-type': item.id === selectCarType.id}"
							@click="changeSelectCarType(item)"
						>
							{{item.carType}}
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="right">
				<scroll-view
					scroll-x="true" 
					class="car-type-year-list-scroll"
					:scroll-with-animation="true"
				>
					<view class="car-type-year-list">
						<view 
							class="car-type-year"
							v-for="item in carTypeYearList"
							:key="item.id"
							:class="{'active-car-type-year': item.id === selectCarTypeYear.id}"
							@click="changeSelectCarTypeYear(item)"
						>
							<view class="line" v-if="item.id === selectCarTypeYear.id"></view>
							{{item.year}}
						</view>
					</view>
				</scroll-view>
				<scroll-view
					scroll-y="true" 
					class="car-type-year-product-list-scroll"
					:scroll-with-animation="true"
				>
					<view class="car-type-year-product-list">
						<view 
							class="car-type-year-product"
							v-for="item in carTypeYearProductList"
							:key="item.id"
							@click="changeSelectCarTypeYearProduct(item)"
						>
							<view class="product-wrap">
								<view class="product">
									{{item.carTypeYearProduct}}
									<view class="price">指导价：{{formatTenThousandNumber(item.guidancePrice)}}</view>
								</view>
								<view style="width:32rpx;height:32rpx;">
									<image
										v-if="item.id === selectCarTypeYearProduct.id"
										style="width:32rpx;height:32rpx;"
										class="check-icon"
										src="https://image.51cheyaoshi.com/xcx/app/static/home/done.png"
									/>
								</view>
							</view>
						</view>
						
						<view class="tip-btn" @click="openPopUp">
							没有您想要的的车型？
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="btn-group">
			<view class="btn" @click="back">上一步</view>
			<view class="btn save-btn" @click="goCustomPage">确定</view>
		</view>
		
		<CustomCarInfoPopup
			v-if="show"
			:show.sync="show"
			:brandName="brandName"
			:showBrandName="false"
			:delta="2"
		/>
	</view>
</template>

<script>
import CustomCarInfoPopup from './components/CustomCarInfoPopup.vue'
	import { formatTenThousandNumber } from '@/utils/index.js'
		
export default {
	components: {
		CustomCarInfoPopup
	},
	
	data() {
		return {
			brandId: '',
			brandName: '',
			carType: [],
			selectCarType: {},
			carTypeYearList: [],
			selectCarTypeYear: {},
			carTypeYearProductList: [],
			selectCarTypeYearProduct: {},
			show: false,
		}
	},
	
	onLoad(options) {
		this.brandId = options.brandId
		this.brandName = options.brandName
		uni.setNavigationBarTitle({
			title: options.brandName
		})
		this.getCarType()
	},
	
	
	methods: {
		getCarType() {
			this.$getRequest(this.$url.getCarType, "POST", {
				carBrandId: this.brandId
			}).then(res => {
				if (res.code === 0) {
					this.carType = res.data
					this.selectCarType = this.carType[0]
					this.getCarTypeYear()
				}
			})
		},
		
		changeSelectCarType(carType) {
			this.selectCarType = carType
			this.selectCarTypeYear = {}
			this.carTypeYearList = []
			this.selectCarTypeYearProduct = {}
			this.carTypeYearProductList = []
			this.getCarTypeYear()
		},
		
		getCarTypeYear() {
			this.$getRequest(this.$url.getCarTypeYear, "POST", {
				carTypeId: this.selectCarType.id,
			}).then(res => {
				if (res.code === 0) {
					this.carTypeYearList = res.data.filter((item, index) => index < 3)
					this.selectCarTypeYear = this.carTypeYearList[0]
					this.listByCarTypeYearId()
				}
			})
		},
		
		changeSelectCarTypeYear(item) {
			this.selectCarTypeYear = item
			this.selectCarTypeYearProduct = {}
			this.carTypeYearProductList = []
			this.listByCarTypeYearId()
		},
		
		listByCarTypeYearId() {
			this.$getRequest(this.$url.listByCarTypeYearId, "PUT", {
				carTypeYearId: this.selectCarTypeYear.id
			}).then(res => {
				if (res.code === 0) {
					this.carTypeYearProductList = res.data
					this.selectCarTypeYearProduct = this.carTypeYearProductList[0]
				}
			})
		},
		
		changeSelectCarTypeYearProduct(item) {
			this.selectCarTypeYearProduct = item
		},
		
		goCarTypePage(brandId, brandName) {
			this.$u.route(`/pages/custom/cartypelist?brandId=${brandId}&brandName=${brandName}`)
		},
		
		openPopUp() {
			this.show = true
		},
		
		back() {
			uni.navigateBack({
				delta: 1
			})
		},
		
		goCustomPage() {
			uni.setStorageSync('customCarInfo', {
			    carBrand: this.brandName,
					carType: this.selectCarTypeYearProduct.carType,
					carYear: this.selectCarTypeYearProduct.carTypeYear,
			    carProduct: this.selectCarTypeYearProduct.carTypeYearProduct,
					carTypeYearProductId: this.selectCarTypeYearProduct.id,
			})
			
			uni.navigateBack({
				delta: 2
			})
		},
		
		formatTenThousandNumber(num) {
			return formatTenThousandNumber(num)
		},
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: column;
}

.select-wrap {
	margin-top: 12px;
	height: 0;
	flex: 1;
	display: flex;
	.left-scroll-wrap {
		height: 100%;
		position: relative;
	}
	.car-type-list-scroll {
		width: 334rpx;
		height: 100%;
		background: #F7F8FA;
		.car-type-list {
			padding: 20px 0 20px 32rpx;
			.car-type {
				font-size: 12px;
				font-weight: 500;
				line-height: 18px;
				color: rgba(10, 15, 45, 0.5);
				margin-bottom: 20px;
				&.active-car-type {
					color: #0A0F2D;
				}
			}
		}
	}
	.right {
		height: 100%;
		flex: 1;
		width: 0;
		display: flex;
		flex-direction: column;
		.car-type-year-list-scroll {
			width: 100%;
			height: 22px;
			white-space: nowrap;
			.car-type-year-list {
				padding: 0 32rpx;
				display: flex;
				width: auto;
				.car-type-year {
					padding-right: 32rpx;
					font-size: 14px;
					height: 50rpx;
					line-height: 50rpx;
					color: #86909C;
					display: flex;
					align-items: center;
					&.active-car-type-year {
						font-size: 17px;
						font-weight: 500;
						color: #1D2129;
						.line {
							width: 32rpx;
							height: 8rpx;
							background: #0AEB7D;
							transform: translateY(-2rpx) rotate(114deg) skew(20deg);
							margin-right: 4rpx;
						}
					}
				}
			}
		}
		.car-type-year-product-list-scroll {
			height: 0;
			flex: 1;
			width: 100%;
			.car-type-year-product-list {
				padding: 0 32rpx;
			}
			.car-type-year-product {
				padding: 16px 0;
				border-bottom: 1px solid #F0F0F0;
				.product-wrap {
					display: flex;
					justify-content: space-between;
				}
				.product {
					flex: 1;
					padding-right: 16rpx;
					font-size: 12px;
					line-height: 18px;
					color: #1D2129;
					.price {
						margin-top: 4px;
						font-size: 12px;
						line-height: 36rpx;
						color: #86909C;
					}
				}
			}
		}
	}
}

.btn-group {
	margin: 32px 0;
	display: flex;
	justify-content: center;
	.btn {
		width: 296rpx;
		height: 116rpx;
		border-radius: 16rpx;
		background: rgba(10, 15, 45, 0.04);
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 17px;
		color: #0A0F2D;
	}
	.save-btn {
		margin-left: 16px;
		background: #0A0F2D;
		color: #FFFFFF;
	}
}

.tip-btn {
	margin-top: 16px;
	height: 34rpx;
	font-size: 12px;
	line-height: 34rpx;
	text-decoration: underline;
	color: rgba(10, 15, 45, 0.5);
}
</style>