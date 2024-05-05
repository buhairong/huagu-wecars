<template>
  <view class="detail-head">
		<view class="header">
			<view class="brand">
				{{carInfo.carTypeYearProductEntity.carBrand}} {{carInfo.carTypeYearProductEntity.carType}}
			</view>
			
			<view class="icons">
				<view @click="handleLike">
					<u-icon
						v-if="carInfo.isLike === 1"
						name="heart-fill"
						color="#0a0f2d"
						size="40"
						class="fw"
					/>
					<u-icon
						v-else
						name="heart"
						color="#0a0f2d"
						size="40"
						class="fw"
					/>
				</view>
				
				<button
					open-type="share"
					class="u-reset-button btu-share"
				>
					<u-icon
						name="zhuanfa"
						color="#0a0f2d"
						size="40"
						class="fw"
					/>
				</button>
			</view>
		</view>
		
		<view class="brand-price">
			<text class="name">指导价</text>
			<text class="price">
				{{ formatTenThousandNumber(carInfo.carTypeYearProductEntity.guidancePrice) }}
			</text>
		</view>
		
		<view class="banner">
		  <u-swiper
		    class="banner-swiper"
		    :list="bannerList" 
		    :title="false"
		    height="300"
		    mode="number"
		    indicator-pos="bottomRight"
		    :effect3d="false"
		    autoplay
		    interval="3000"
		    :circular="true"
		    duration="500" 
		    bg-color=""
		  />
		</view>
		
		<view class="configure">
			<view class="item divider-x">
				<view class="title">
					{{ carInfo.carTypeYearProductEntity.mold ? powerMode[carInfo.carTypeYearProductEntity.mold] : '-' }}
				</view>
				<view class="name">燃料形式</view>
			</view>
			
			<view class="item divider-x">
				<view class="title">
					{{ carInfo.carTypeYearProductEntity.discharge ? `${carInfo.carTypeYearProductEntity.discharge}T` : '-' }}
				</view>
				<view class="name">排量(L)</view>
			</view>
			
			<view class="item divider-x">
				<view class="title">
					{{ carInfo.carTypeYearProductEntity.drive ? drive[carInfo.carTypeYearProductEntity.drive] : '-' }}
				</view>
				<view class="name">驱动方式</view>
			</view>
			
			<view class="item">
				<view class="title">
					{{ carInfo.carTypeYearProductEntity.horsepower || '-' }}
				</view>
				<view class="name">马力(Ps)</view>
			</view>
		</view>
	</view>
</template>

<script>
import { formatTenThousandNumber } from '@/utils'
import { powerMode, drive } from '@/constants'

export default {
	name: "ProductDetailHeader",
	
	components: {},
	
	props: {
		carInfo: {
			type: Object,
			required: true,
		},
		
		bannerList: {
			type: Array,
			required: true,
		},
		
		userInfo: {
			type: Object | null,
			required: true,
		},
	},
	
	data() {
		return {
			powerMode,
			drive,
			isLike: 0,
		}
	},
    
	mounted() {
		
	},
	
	methods: {
		formatTenThousandNumber(num) {
			return formatTenThousandNumber(num)
		},
		
		async handleLike() {
			if (this.userInfo) {
				const res = await this.$getRequest(this.$url.likeProduct, 'POST', {
				    carTypeYearProductId: this.carInfo.carTypeYearProductEntity.id,
				    userId: this.userInfo.id,
						type: 1,
				})
				
				if(res.code === 0) {
					this.$emit('changeLike', res.data.likeStatus)
					uni.showToast({
						title: res.data.likeStatus === 1 ? '已收藏' : '已取消',
						duration: 2000
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
.detail-head {
	padding: 32rpx;
	width: 100vw;
	height: 660rpx;
	background: linear-gradient(180deg, rgba(10,15,45,0.16) 36%, rgba(255,255,255,0.16) 100%);
	.header {
		display: flex;
		justify-content: space-between;
		.brand {
			font-size: 44rpx;
			line-height: 64rpx;
			color: #0A0F2D;
			font-weight: 500;
		}
		.icons {
			height: 64rpx;
			display: flex;
			align-items: center;
			.fw {
				margin-left: 32rpx;
			}
		}
	}
	.brand-price {
		background: url("https://image.51cheyaoshi.com/xcx/app/static/icon3.png") no-repeat;
		background-size: contain;
		display: inline-block;
		padding: 0 10rpx;
		height: 50rpx;
		line-height: 45rpx;
		font-size: 24rpx;
		position: relative;
		vertical-align: top;
		width: 215rpx;
		white-space: pre;
		.name {
			color: #ffffff;
			padding-right: 18rpx;
		}
		.price {
			padding: 0 10rpx;
			color: rgba(10, 15, 45, 0.8);
			position: absolute;
			left: 100rpx;
			top: 0rpx;
			z-index: 1;
		}
	}
	.banner {
		padding: 40rpx 0;
	}
	.configure {
		display: flex;
		background: #ffffff;
		box-shadow: 0px -4px 32px rgba(10, 15, 45, 0.02), 0px 4px 24px rgba(10, 15, 45, 0.04);
		border-radius: 24rpx;
		padding: 16rpx 0;
		text-align: center;
		color: rgba(10, 15, 45, 0.8);
		.item {
			flex: 1;
			.title {
				font-size: 24rpx;
				margin-bottom: 4rpx;
				font-weight: 500;
			}
			.name {
				font-size: 24rpx;
				color: rgba(10, 15, 45, 0.5);
			}
		}
	}
}
</style>