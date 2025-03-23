<template>
	<view  class="page-wrap1">
		<view class="rental-custom-order-btn" @click="goBusinessPage">
			<view class="left">
					预定商务活动
			</view>
			<image
					class="detail-arrow"
					src="https://image.51cheyaoshi.com/xcx/app/static/right_green.png"
				/>
		</view>
		
		<view v-if="parRentalCarData.length > 0">
									<view class="rental-list">
										<view
											v-for="(item, index) in parRentalCarData"
											:key="item.id"
											class="rental-wrap"
											@click="goRentalDetailPage(item)"
										>
											<view class="car-img">
												<image 
													class="default_img"
													src="/static/img_bg.png"
												/>
												<image
													class="item-img"
													mode="aspectFill"
													:src="item.carTypeYearProductEntity.imageUrl"
												/>
											</view>
											
											<view class="car-info">
												<view class="brand">
													{{ item.carTypeYearProductEntity.carBrand }} {{ item.carTypeYearProductEntity.carType }} {{ item.carTypeYearProductEntity.carTypeYear }} | {{ item.carTypeYearProductEntity.carTypeYearProduct }}
												</view>
												
												<view>
													<view class="business">
														<view class="tip">租金</view>
														<view class="business-price">
														  ¥ 
															<view class="price">{{ formatThousandNumber(item.citySubscribeReq[0].money) }} </view>
															/天
														</view>
													</view>
												</view>
												
											</view>
										</view>
									</view>
		  </view>
		  <u-empty v-if="parRentalCarData.length == 0" text="暂无车源" mode="list" margin-top="40"></u-empty>
		
	</view>
</template>

<script>
	import { formatTenThousandNumber, formatThousandNumber } from '@/utils/index.js'
	
	export default {
		data() {
			return {
				parRentalCarData: [],
			}
		},
		
		onShow() {
			this.fetchParityRent()
		},
		
		methods: {
			formatThousandNumber(price) {
				return formatThousandNumber(price)
			},
			
			async fetchParityRent() {
			    const parRentalCar = await this.$getRequest(this.$url.getMemberCarRentalList, "POST", {period: 1})
			    this.parRentalCarData = parRentalCar.data.records
			},
			
			goRentalDetailPage(item) {
				uni.navigateTo({
					url: `/pagesOrder/rental/product/carDetail?id=${item.id}&carTypeYearProductId=${item.carTypeYearProductEntity.id}`
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
.page-wrap1 {
	.rental-custom-order-btn {
		margin-bottom: 32rpx;
		width: 100%;
		height: 104rpx;
		padding: 0 40rpx;
		border-radius: 24rpx;
		background: linear-gradient(91deg, rgba(10,15,45,0.87) -24%, rgba(14,19,49,0.90) 98%);
		display: flex;
		justify-content: space-between;
		align-items: center;
		.left {
				
				font-size: 34rpx;
				color: #FFFFFF;
				font-weight: 500;
			
		}
		.detail-arrow {
			width: 32rpx;
			height: 32rpx;
		}
	}
	
	.rental-wrap {
		margin-bottom: 20px;
		display: flex;
		align-items: center;
		.car-img {
			width: 290rpx;
			height: 200rpx;
			position: relative;
			.default_img {
				border-radius: 16rpx;
				width: 100%;
				height: 100%;
			}
			.item-img {
				position: absolute;
				top: 0;
				left: 0;
				border-radius: 16rpx;
				width: 100%;
				height: 100%;
			}
		}
		.car-info {
			padding-left: 12rpx;
			flex: 1;
			width: 0;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			min-height: 180rpx;
			.brand {
					font-size: 28rpx;
					color: rgba(10, 15, 45, 0.8);
					line-height: 44rpx;
					font-weight: 500;
			}
			.box-info-text {
					font-size: 24rpx;
					line-height: 36rpx;
					color: rgba(10, 15, 45, 0.8);
			}
			.business {
				display: flex;
				margin: 10rpx 0;
				align-items: baseline;
				font-size: 24rpx;
				.tip {
					font-size: 24rpx;
					color: rgba(10, 15, 45, 0.8);
					padding-right: 8rpx;
				}
				.price-text {
					color: #f51a4e;
					font-size: 22rpx;
					padding-left: 4rpx;
					transform: translateY(-2rpx);
				}
				.business-price {
					color: #F5194B;
					display: flex;
					align-items: baseline;
					.price {
						font-size: 30rpx;
						color: #F5194B;
						font-weight: 500;
					}
				}
			}
		}
	}
}

</style>
