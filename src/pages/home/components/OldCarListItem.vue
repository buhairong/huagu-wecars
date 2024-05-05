<template>
	<view class="wrap" @click="go2CertCarDetail">
		<view class="car-img">
			<image 
				class="default_img"
				src="/static/img_bg.png"
			/>
			<image
				class="item-img"
				mode="aspectFill"
				:src="item.imageUrl"
			/>
		</view>
		
		<view class="car-info">
			<view>
				<view class="brand">
				    {{ item.carBrand }} {{ item.carType }} {{ item.carTypeYear }} | {{ item.carTypeYearProduct }}
				</view>
				<view class="box-info-text">
					{{ item.regCity }} / {{ item.regDateStr }} / {{ item.mileage }}公里
				</view>
			</view>
			
			<view class="business">
				<view class="tip">订阅仅需</view>
				<view class="business-price">
				  {{ formatThousandNumber(item.mouthPayment) }} 
				</view>
				<view class="price-text">元/月</view>
			</view>
			
		</view>
	</view>
</template>

<script>
import { formatTenThousandNumber, formatThousandNumber } from '@/utils/index.js'

export default {
	props: {
		item: {
			type: Object,
			required: true,
		},
		
		cityId: {
			type: Number | String,
			required: true,
		},
		
		supportSubscription: {
			type: Number | String,
			required: true,
		},
	},
	
	data() {
		return {
			
		}
	},
	
	methods: {
		go2CertCarDetail() {
			uni.navigateTo({
				url: `/pages/home/certcar/detail?id=${this.item.id}&cityId=${this.cityId}&subscribeId=${this.item.subscribeId}&supportSubscription=${this.supportSubscription}`
			})
		},
		
		getPrice(price) {
			let res = ''
			if(price || price == 0) {
				if (price < 10000) {
					res = `${formatThousandNumber(price)}元`
				} else {
					res = formatTenThousandNumber(price)
				}
				
			} 
			return res
		},
		
		formatThousandNumber(price) {
			return formatThousandNumber(price)
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.wrap {
	display: flex;
	.car-img {
		width: 220rpx;
		height: 180rpx;
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
		height: 180rpx;
		.brand {
				font-size: 28rpx;
				color: rgba(10, 15, 45, 0.8);
				line-height: 44rpx;
				font-weight: 500;
				@include text-overflow();
		}
		.box-info-text {
				font-size: 24rpx;
				line-height: 36rpx;
				color: rgba(10, 15, 45, 0.8);
		}
		.business {
			display: flex;
			padding-top: 5px;
			align-items: baseline;
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
				font-size: 17px;
				font-weight: 500;
			}
		}
	}
}
</style>