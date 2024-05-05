<template>
	<u-popup
		v-model="showPopuInfo" 
		mode="bottom"
		border-radius="12"
		closeable="true"
		close-icon-color="#0A0F2D"
		@close="close"
	>
		<view class="popup-wrap">
			<view class="title">
				方案信息
			</view>
			<view class="merchant-wrap">
				<view class="merchant" @click="goDIYPage">
					<u-image
						:src="detailInfo.logoImageUrl"
						shape="circle"
						width="48rpx"
						height="48rpx"
					/>
					<text class="merchant-name">{{detailInfo.merchantName}}</text>
				</view>
				<view class="chat">
					<u-image
						src="https://image.51cheyaoshi.com/xcx/app/static/img/path-1.png"
						width="28rpx"
						mode="widthFix"
						class="chat-img"
					/>
					<view class="chat-text">
						在线咨询
					</view>
				</view>
			</view>
			<view class="popup-content">
				<view v-if="popupIndex === 3">
					<view class="item-wrap">
						<view class="item-title">
							订阅周期：
						</view>
						<view class="item-content">
							{{subscribeItem.monthTotal ? `${subscribeItem.monthTotal}个月` : '-'}}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							订阅费用：
						</view>
						<view class="item-content">
							{{getSubscribePrice()}}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							车辆押金：
						</view>
						<view class="item-content">
							{{getDeposit(subscribeItem.deposit)}}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							限定里程：
						</view>
						<view class="item-content">
							{{subscribeItem.limitMileage ? `${formatThousandNumber(subscribeItem.limitMileage)}公里` : '-'}}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							超出里程：
						</view>
						<view class="item-content">
							{{subscribeItem.overMileageFee ? `￥${subscribeItem.overMileageFee}/公里` : '-'}}
						</view>
					</view>
					
					<view class="item-wrap" v-if="subscribeItem.safeguardService && subscribeItem.safeguardService.length">
						<view class="item-title">
							精选服务：
						</view>
						<view class="item-content">
							{{subscribeItem.safeguardService && subscribeItem.safeguardService.length ? subscribeItem.safeguardService.join('、') : '-' }}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							增 配 项：
						</view>
						<view class="item-content">
							{{subscribeItem.carOtherConfig && subscribeItem.carOtherConfig.length ? subscribeItem.carOtherConfig.join('、') : '-' }}
						</view>
					</view>
					
					<view class="split-line"></view>
					
					<view class="item-wrap">
						<view class="item-title">
							期末买断：
						</view>
						<view class="item-content">
							{{subscribeItem.buyoutsFee ? `￥${formatThousandNumber(subscribeItem.buyoutsFee)}` : '-' }}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							购车总价：
						</view>
						<view class="item-content">
							{{subscribeItem.totalPrice ? `￥${formatThousandNumber(subscribeItem.totalPrice)}` : '-' }}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							期末选择：
						</view>
						<view class="item-content">
							{{subscribeItem.finalSelect ? subscribeItem.finalSelect.join('、') : '-' }}
						</view>
					</view>
					
				</view>
				<view v-else-if="popupIndex === 4">
					<view class="item-wrap">
						<view class="item-title">
							车辆价格：
						</view>
						<view class="item-content">
							{{stagingItem.dealerReferencePrice ? `￥${formatThousandNumber(stagingItem.dealerReferencePrice)}` : '-'}}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							分期期数：
						</view>
						<view class="item-content">
							{{stagingItem.period ? `${stagingItem.period}期` : '-'}}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							首付金额：
						</view>
						<view class="item-content">
							{{stagingItem.firstPayment ? `￥${formatThousandNumber(stagingItem.firstPayment)}` : '-'}}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							月供金额：
						</view>
						<view class="item-content">
							{{stagingItem.monthPayment ? `￥${formatThousandNumber(stagingItem.monthPayment)}` : '-'}}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							{{stagingItem.companyName ? `${stagingItem.companyName}` : '-'}}
						</view>
					</view>
				</view>
			</view>
			<view 
				class="order-btn" @click="goOrderDeatilPage"
				:style="{marginTop: popupIndex === 3 ? '34rpx' : '124rpx'}"
			>
				立即订车
			</view>
		</view>
		<u-modal
			v-model="isDetail" 
			:title="title" 
			:content='content' 
			:mask-close-able="true"
			:confirm-text='confirmText'
			@confirm='confirm'
		></u-modal>
	</u-popup>

</template>

<script>
	import { formatTenThousandNumber, formatThousandNumber } from '@/utils/index.js'
	
	export default {

		props: {
			showPopuInfo: {
				type: Boolean,
				default: false
			},
			popupIndex: {
				type: Number,  // 3.订阅方案 4.分期方案
				required: true
			},
			detailInfo: { // 二手车车辆详情信息
				type: Object,
				required: true
			},
			subscribeItem: { // 订阅方案
				type: Object,
				default: () => ({})
			},
			stagingItem: { // 分期方案
				type: Object,
				default: () => ({})
			},
		},
		data(){
			return {
				showa:true,
				isDetail:false,//认证弹窗
				content:'身份认证后可用车',
				title:'提示',
				closeOnClickOverlay:false,
				confirmText:'去认证',
			}
		},
		methods: {
			formatThousandNumber(num) {
				return formatThousandNumber(num)
			},
			close() {
				this.$emit('update:showPopuInfo', false)
			},
			getDeposit(num) {
				if (!num) {
					if (num === 0) {
						return '减免车辆押金'
					} else {
						return '-'
					}
				} else {
					return `￥${formatThousandNumber(num)}`
				}
			},
			confirm(){//去认证
				uni.setStorageSync("confirmRouter",'/pages/home/certcar/all-plans')
				this.$u.route("/pages/mine/identity/identity")
			},
			goOrderDeatilPage() {
				uni.showLoading({
					title: '加载中'
				})
				
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
				
				const isLogin = uni.getStorageSync('isLogin')
				if (isLogin) {
					getApp().globalData.getUserInfo((data) => {
						if (data) {
							const subscribeId = this.subscribeItem.subscribeId || ''
								
							const certcarInfo = {
								detailInfo: this.detailInfo,
								subscribeItem: this.subscribeItem,
								stagingItem: this.stagingItem
							}
							
							try {
								
								//data.riskAuditStatus = null
								
								const orderDetailPath = `/pages/home/profile/order-detail?id=${subscribeId}&index=${this.popupIndex}&cartype=2`
								uni.setStorageSync('certcarDetailInfo', JSON.stringify(certcarInfo))
								uni.setStorageSync("confirmRouter", orderDetailPath)
								
								const params = {
									riskAuditStatus: data.riskAuditStatus,
									username: data.name,
									imageUrl: data.imageUrl,
									idNum: data.userInfoEntity && data.userInfoEntity.idcard,
									companyName: data.userCompanyEntity && data.userCompanyEntity.companyName,
								}
								this.$emit('openIdentityDialog', params)
							} catch (e) {
								// error
							}
							
							
							
							// if (data.riskAuditStatus == 0 || data.riskAuditStatus == 2 || data.riskAuditStatus == 4) {
							// 	// this.isDetail=true
								
							// 	uni.showModal({
							// 	    title: '提示',
							// 	    content: '身份认证后可用车',
							// 			cancelText:"取消",
							// 	    confirmText: '去认证',
							// 	    success: (res) => {
							// 	        if(res.confirm) {
							// 						uni.setStorageSync("confirmRouter",'/pages/home/certcar/all-plans')
							// 						this.$emit('openIdentityDialog')
							// 						//this.$u.route("/pages/mine/identity/identity")
							// 	        }
							// 	    }
							// 	});
							// } else {
							// 	const subscribeId = this.subscribeItem.subscribeId || ''
									
							// 	const certcarInfo = {
							// 		detailInfo: this.detailInfo,
							// 		subscribeItem: this.subscribeItem,
							// 		stagingItem: this.stagingItem
							// 	}
								
							// 	try {
							// 		uni.setStorageSync('certcarDetailInfo', JSON.stringify(certcarInfo));
							// 	} catch (e) {
							// 		// error
							// 	}
								
							// 	//this.$u.route(`/pages/home/profile/order-detail?id=${subscribeId}&index=${this.popupIndex}&cartype=2`)
							// }
						} else {
							this.$u.route("/pages/sign/sign")
						}
					})
				} else {
					this.$u.route("/pages/sign/sign")
				}
				
				
				
				uni.hideLoading()
			},
			
			// 计算订阅费用
			getSubscribePrice() {
				if(this.subscribeItem.paymentType == 0) {
					return `￥${formatThousandNumber(this.subscribeItem.payOffPrice)}`
				} else if(this.subscribeItem.paymentType == 1) {
					return `￥${formatThousandNumber(this.subscribeItem.mouthPayment)}/月`
				}
				return '-'
			},
			
			goDIYPage() {
				//this.$u.route(`/pages/diy/diy?companyId=${this.detailInfo.companyId}`)
			},
		}
	}
</script>

<style lang="scss" scoped>
		.warp {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100%;
		}
	
		.rect {
			width: 120px;
			height: 120px;
			background-color: #fff;
		}
	.popup-wrap {
		padding: 28rpx 48rpx;
		.title {
			font-size: 30rpx;
			font-weight: 500;
			color: rgba(0, 0, 0, 0.9);
			text-align: center;
		}
		.merchant-wrap {
			margin-top: 60rpx;
			margin-bottom: 32rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.merchant {
				display: flex;
				align-items: center;
				.merchant-name {
					font-size: 28rpx;
					color: rgba(10, 15, 45, 0.8);
					padding-left: 16rpx;
				}
			}
			.chat {
				display: flex;
				align-items: center;
				.chat-img {
					transform: translateY(4rpx);
				}
				.chat-text {
					font-size: 24rpx;
					color: rgba(10, 15, 45, 0.8);
					padding-left: 8rpx;
				}
			}
		}
		.popup-content {
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
			.split-line {
				height: 0px;
				border-top: 2rpx solid #EEEEEE;
				margin: 32rpx 0;
			}
		}
		.order-btn {
			height: 80rpx;
			border-radius: 16rpx;
			background: #0A0F2D;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 30rpx;
			color: #FFFFFF;
			margin: 40rpx 0;
		}
	}
</style>