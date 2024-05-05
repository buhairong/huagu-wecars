<template>
	<view class="page-wrap">
		<view class="section" v-if="carDetailData.subscribeList && carDetailData.subscribeList.length">
			<view class="section-title">
				<view class="text">
					订阅方案
				</view>
			</view>
			<view 
				class="card subscribe-item"
				v-for="(item, index) in carDetailData.subscribeList"
				:key="index"
				@click="showPop(3, item)"
			>
				<view class="subscribe-title">
					<view class="subscribe-name">
						{{item.monthTotal}}个月方案
					</view>
					<view class="subscribe-price-wrap">
						<view class="text">
							订阅费用
						</view>
						<view class="subscribe-price">
							￥{{formatThousandNumber(item.mouthPayment)}}
						</view>
					</view>
				</view>
				
				<view class="service">
					<view 
						class="service-tag"
						v-for="(tag, index) in item.safeguardService"
						:key="index"
					>
						{{tag}}
					</view>
				</view>
				
				<view class="end-title">
					期末方案
				</view>
				<view class="end-wrap">
					<view class="plans">
						<view class="purchase">
							<view class="purchase-img-wrap">
								<image class="purchase-img" src="https://image.51cheyaoshi.com/xcx/app/static/maiduan.png" mode=""></image>
							</view>
							买断价￥{{formatThousandNumber(item.buyoutsFee)}}
						</view>
						<view class="purchase">
							<view class="purchase-img-wrap return-car-wrap">
								<image class="return-car-img" src="https://image.51cheyaoshi.com/xcx/app/static/wusun.png" mode=""></image>
							</view>
							无损退车
						</view>
					</view>
					<view class="detail-btn">
						详情
						<u-icon class="detail-arrow" name="arrow-right" color="#0AEB7D" size="20"></u-icon>
					</view>
				</view>
				
			</view>
		</view>
		
		<view class="section" v-if="carDetailData.stagingList && carDetailData.stagingList.length">
			<view class="section-title">
				<view class="text">
					分期方案
				</view>
			</view>
			<view 
				class="card staging-item"
				v-for="(item, index) in carDetailData.stagingList"
				:key="index"
				@click="showPop(4, item)"
			>
				<view class="plans">
					<view class="period">
						{{item.period}}期方案
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							首付金额：
						</view>
						<view class="item-content">
							{{item.firstPayment ? `${formatThousandNumber(item.firstPayment)}元` : '-'}}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							月供金额：
						</view>
						<view class="item-content">
							{{item.monthPayment ? `${formatThousandNumber(item.monthPayment)}元` : '-'}}
						</view>
					</view>
					
					<view class="item-wrap bottom-item">
						<view class="item-title">
							{{item.companyName ? `${item.companyName}` : '-'}}
						</view>
						<view class="detail-btn">
							详情
							<u-icon class="detail-arrow" name="arrow-right" color="#0AEB7D" size="20"></u-icon>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<PopupInfo
			:showPopuInfo.sync="showPopuInfo"
			:popupIndex="popupIndex"
			:detailInfo="carDetailData"
			:subscribeItem="subscribeItem"
			:stagingItem="stagingItem"
		/>
	</view>
</template>

<script>
	import { formatTenThousandNumber, formatThousandNumber } from '@/utils/index.js'
	import PopupInfo from './components/PopupInfo.vue'
	
	export default {
		data() {
			return {
				cityId:'',
				carDetailData: {},
				showPopuInfo: false,
				popupIndex: 1,
				subscribeItem: {},  // 当前弹框显示的订阅方案
				stagingItem: {}, // 当前弹框显示的分期方案
			}
		},
		components: {
		  PopupInfo
		},
		onLoad(options) {
			this.cityId=options.cityId
			try {
				const value = uni.getStorageSync('certcarAllPlansInfo')
				if (value) {
					this.carDetailData = JSON.parse(value)
				}
			} catch (e) {
				// error
			}
		},
		methods: {
			// 1.订阅流程 2.分期流程 3.订阅方案 4.分期方案
			showPop(index, item={}) {
				this.showPopuInfo = true
				this.popupIndex = index
				if (index === 3) {
					this.subscribeItem = item
				} else if (index === 4) {
					this.stagingItem = item
				}
			},
			formatTenThousandNumber(number, unit1, unit2) {
				return formatTenThousandNumber(number, unit1, unit2)
			},
			formatThousandNumber(num) {
				return formatThousandNumber(num)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page-wrap {
		padding: 24rpx 32rpx;
		.card {
			background: #FFFFFF;
			box-shadow: 0px -2px 32px rgba(10, 15, 45, 0.02), 0px 4px 24px rgba(10, 15, 45, 0.04);
			border-radius: 24rpx;
			padding: 40rpx 32rpx;
			margin-top: 24rpx;
		}
		.section {
			margin-bottom: 48rpx;
		}
		.section-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.text {
				font-size: 34rpx;
				font-weight: 500;
				color: #0A0F2D;
			}
			.btn-wrap {
				display: flex;
				font-size: 28rpx;
				color: rgba(10, 15, 45, 0.5);
				.title-link-btn-text {
					padding-left: 8rpx;
				}
			}
		}
		
		.subscribe-item {
			margin-top: 24rpx;
			.subscribe-title {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.subscribe-name {
					font-size: 32rpx;
					font-weight: 500;
					color: #0A0F2D;
				}
				.subscribe-price-wrap {
					display: flex;
					align-items: center;
					.text {
						font-size: 24rpx;
						color: #0A0F2D;
						padding-right: 8rpx;
					}
					.subscribe-price {
						font-size: 32rpx;
						font-weight: 500;
						color: #F5194B;
					}
				}
			}
			.service {
				display: flex;
				padding-top: 18rpx;
				flex-wrap: wrap;
				.service-tag {
					padding: 2rpx 4rpx;
					border-radius: 4rpx;
					background: #F5F6F7;
					font-size: 20rpx;
					color: rgba(10, 15, 45, 0.8);
					margin-right: 8rpx;
					margin-bottom: 12rpx;
				}
			}
			
			.end-title {
				font-size: 28rpx;
				font-weight: 500;
				color: #0A0F2D;
				padding-top: 22rpx;
			}
			
			.end-wrap {
				padding-top: 18rpx;
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				.plans {
					flex: 1;
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 28rpx;
					color: rgba(10, 15, 45, 0.8);
					.purchase, .return-car {
						display: flex;
						align-items: center;
						.purchase-img-wrap {
							width: 40rpx;
							height: 40rpx;
							border-radius: 50%;
							background-color: #FDF7DF;
							display: flex;
							justify-content: center;
							align-items: center;
							margin-right: 10rpx;
							.purchase-img {
								width: 22rpx;
								height: 22rpx;
							}
						}
					}
					.return-car-wrap {
						background: rgba(25, 126, 245, 0.1);
						.return-car-img {
							width: 36rpx;
							height: 36rpx;
						}
					}
				}
				.detail-btn {
					margin-left: 20rpx;
					padding: 8rpx 20rpx;
					border-radius: 8rpx;
					background: rgba(10, 15, 45, 0.04);
					font-size: 24rpx;
					font-weight: 500;
					color: #0A0F2D;
					.detail-arrow {
						padding-left: 12rpx;
					}
				}
			}
		}
		
		.staging-item {
			padding: 20rpx 22rpx;
			border-radius: 8rpx;
			box-sizing: border-box;
			border: 2rpx solid rgba(10, 15, 45, 0.1);
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 24rpx;
			&:first-child {
				margin-top: 0;
			}
			.plans {
				width: 100%;
				.period {
					font-size: 32rpx;
					font-weight: 600;
					color: #0A0F2D;
					padding-bottom: 32rpx;
				}
				.item-wrap {
					margin-bottom: 16rpx;
					display: flex;
					align-items: flex-start;
					.item-title {
						padding-right: 24rpx;
						font-size: 28rpx;
						color: #64696F;
						flex-wrap: nowrap;
						line-height: 44rpx;
					}
					.item-content {
						flex: 1;
						font-size: 28rpx;
						color: #0A0F2D;
						flex-wrap: wrap;
						line-height: 44rpx;
					}
				}
				
				.bottom-item {
					width: 100%;
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					.detail-btn {
						margin-left: 20rpx;
						padding: 8rpx 20rpx;
						border-radius: 8rpx;
						background: rgba(10, 15, 45, 0.04);
						font-size: 24rpx;
						font-weight: 500;
						color: #0A0F2D;
						.detail-arrow {
							padding-left: 12rpx;
						}
					}
				}
			}
		}
	}
</style>
