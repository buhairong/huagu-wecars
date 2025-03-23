<template>
	<view class="wrap" v-if="detailInfo">
		<view class="header banner-header">
			<view class="banner">
			    <u-swiper
			        class="banner-swiper"
			        :list="detailInfo.imageList" 
			        :title="false"
			        height="300"
			        mode="round"
			        indicator-pos="bottomCenter"
			        :effect3d="false"
			        autoplay
			        interval="3000"
			        :circular="true"
			        duration="500" 
			        bg-color=""
			    />
			</view>
		</view>
		
		<view class="container">
			<view class="card">
				<view class="item">
					<view class="item-title">活动名称</view>
					<view class="item-content">
						{{detailInfo.siteName}}
					</view>
				</view>
				
				<view class="item">
					<view class="item-title">活动类型</view>
					<view class="item-content">
						{{ BUSINESS_ACTIVITY_STATUS[detailInfo.businessActivityType] }}
					</view>
				</view>
				
				<view class="item">
					<view class="item-title">活动价格</view>
					<view class="item-content">
						{{ formatThousandNumber(detailInfo.money) }}元
					</view>
				</view>
				
				<view class="item">
					<view class="item-title">活动地址</view>
					<view class="item-content">
						{{ detailInfo.address }}
					</view>
				</view>
			</view>
			
			<view class="card introduction" v-if="detailInfo.introduction">
					{{ detailInfo.introduction }}
			</view>
		</view>
		
		
		<!-- <view class="card photo-wrap"  v-if="detailInfo.imageList">
			<view
				class="img-wrap"
				v-for="(item, index) in detailInfo.imageList"
				:key="index"
			>
				<image
					class="car-img"
					:src="item"
					mode="widthFix"
					@click="preview(index)"
				/>
			</view>
		</view> -->
		
		<!-- <view class="order-btn-wrap">
			<view class="order-btn" @click="handleCall">
				联系管家
			</view>
		</view> -->
	</view>
</template>

<script>
	import { BUSINESS_ACTIVITY_STATUS,butlerOfBusinessTel } from "@/constants"
	import { formatTenThousandNumber, formatThousandNumber } from '@/utils/index.js'
	
	export default {
		data() {
			return {
				BUSINESS_ACTIVITY_STATUS,
				id: '',
				detailInfo: null,
			}
		},
		
		onLoad(option) {
			this.id = option.id
			this.getDetail()
		},
		
		onShow() {
			
		},
		
		methods: {
			formatThousandNumber(price) {
				return formatThousandNumber(price)
			},
			
			getDetail() {
				uni.showLoading({
				  title: '加载中'
				});
				this.$getRequest(this.$url.getMemberBusinessActivityDetail, "GET", {
				  id: this.id,
				}).then(res => {
					uni.hideLoading()
					this.detailInfo = res.data
				}).catch(() => {
					uni.hideLoading()
				})
			},
			
			handleOrder() {
				uni.navigateTo({
					url: `/pagesOrder/butler/butler?type=2&cityId=${this.detailInfo.cityId}`
				})
			},
			
			handleCall() {
				uni.makePhoneCall({
					phoneNumber: butlerOfBusinessTel
				})
			},
			
			preview(index) {
				uni.previewImage({
					urls: this.detailInfo.imageList,
					current: index,
					loop: true
				});
			},
		}
	}
</script>

<style lang="scss">
.banner-header {
	.banner-swiper {
		.u-indicator-item-round {
			width: 32rpx!important;
			height: 8rpx;
		}
	}
}
</style>
<style lang="scss" scoped>
.wrap {
	.header {
		background: linear-gradient(180deg, rgba(10, 15, 45, 0.16) 36.24%, rgba(255, 255, 255, 0.16) 100%);
	}
	.container {
		padding: 32rpx 32rpx 240rpx;
	}
	.card {
		margin-top: 32rpx;
		.item {
			margin-top: 12px;
			display: flex;
			justify-content: space-between;
			font-size: 14px;
			color: rgba(10, 15, 45, 0.8);
			&:first-child {
				margin-top: 0;
			}
			.item-title {
				display: flex;
				height: 44rpx;
				line-height: 44rpx;
			}
			.item-content {
				line-height: 44rpx;
				flex:1;
				width:0;
				padding-left: 24rpx;
				text-align: right;
			}
		}
	}
	
	.introduction {
		text-indent: 2em;
		line-height: 56rpx;
	}
	
	.photo-wrap {
		.img-wrap {
			margin-bottom: 32rpx;
			width: 100%;
			overflow: hidden;
			border-radius: 8rpx;
			.car-img {
				width: 100%;
			}
		}
	}
}
</style>
