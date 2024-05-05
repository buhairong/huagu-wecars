<template>
  <view class="certCarDetailPage" v-if="carDetailData">
    <view
      class="detail"
    >
      <view class="banner u-margin-bottom-28">
        <u-swiper
          class="banner-swiper"
          :list="carDetailData.imageUrlList" 
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
			
      <view class="car-brand">
				<view class="brand">
					{{ carDetailData.carTypeYearProductEntity.carBrand || '' }} {{ carDetailData.carTypeYearProductEntity.carType || '' }}
				</view>
        <view class="btns">
        	<view class="btn" @click="handleLike">
        		<u-icon
        			v-if="carDetailData.isLike === 1"
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
        	<button class="btn share" open-type="share">
        		<u-icon
        			name="zhuanfa"
        			color="#0a0f2d"
        			size="40"
        			class="fw"
        		/>
        	</button>
        </view>
      </view>
			<view class="car-type">
			  {{ carDetailData.carTypeYearProductEntity.carTypeYear || '' }} {{ carDetailData.carTypeYearProductEntity.carTypeYearProduct || '' }}
			</view>
			
			<view class="auction-info">
				当前价
				<view class="price-wrap">
					¥ 
					<view class="price">
						{{formatPrice(carDetailData.currentPrice)}}
					</view>
				</view>
				（参与竞价 {{carDetailData.number}} 人）
			</view>
			
      <view class="card">
				<view class="u-flex u-row-between car-flex-info">
					<view class="u-flex-1 u-text-center">
						<view class="u-font-28 u-font-weight">{{ carDetailData.secondHandCarsEntity.regDateStr ? `${carDetailData.secondHandCarsEntity.regDateStr}` : '-'}}</view>
						<view class="color-rgba u-font-24 u-padding-top-4">车龄</view>
					</view>
					<view class="u-text-center m-h-line">|</view>
					<view class="u-flex-1 u-text-center">
						<view class="u-font-28 u-font-weight">{{ carDetailData.secondHandCarsEntity.mileage ? formatTenThousandNumber(carDetailData.secondHandCarsEntity.mileage, 'W', '公里') : '-'}}</view>
						<view class="color-rgba u-font-24 u-padding-top-4">里程</view>
					</view>
					<view class="u-text-center m-h-line">|</view>
					<view class="u-flex-1 u-text-center">
						<view class="u-font-28 u-font-weight">{{ carDetailData.carTypeYearProductEntity.environmentalStandards || '-'  }}</view>
						<view class="color-rgba u-font-24 u-padding-top-4">排放标准</view>
					</view>
					<view class="u-text-center m-h-line">|</view>
					<view class="u-flex-1 u-text-center">
						<view class="u-font-28 u-font-weight">{{ getTranscationNum(carDetailData.secondHandCarsEntity.transcationNum) }}</view>
						<view class="color-rgba u-font-24 u-padding-top-4">过户次数</view>
					</view>
				</view>
        <view class="car-info">
        	<view class="car-info-line">
        		<view class="left">
        			<view class="label">首次上牌</view>
							<view class="card-content">{{carDetailData.secondHandCarsEntity.regDate}}</view>
        		</view>
						<view class="right">
							<view class="label">所在城市</view>
							<view class="card-content">{{ carDetailData.secondHandCarsEntity.regCity || '-'  }}</view>
						</view>
        	</view>
					<view class="car-info-line">
						<view class="left">
							<view class="label">车架号</view>
							<view class="card-content">{{ carDetailData.secondHandCarsEntity.carVin || '-'  }}</view>
						</view>
						<view class="right">
							<view class="label">能源方式</view>
							<view class="card-content">{{ getPowerModeName(carDetailData.carTypeYearProductEntity.powerMode) }}</view>
						</view>
					</view>
        </view>
			</view>
			
			<template v-if="isWinner">
				<view class="card">
					<view class="success-tip">恭喜您竞价成功</view>
					<view class="final-price">您的最终竟价为 {{carDetailData.currentPrice | $numFormat}} 元</view>
				</view>
				
				<view class="card">
					<template v-if="carDetailData.isFullyPaid === 1">
						<view class="card-item">
							<view class="label">卖家信息</view>
							<view class="card-content company-name">{{carDetailData.companyName}}</view>
						</view>
						
						<view class="card-item">
							<view class="label">联系方式</view>
							<view class="card-content">{{carDetailData.companyMobile}}</view>
						</view>
					</template>
					
					<view class="card-item" @click="goCashHome">
						<view class="label" @click.stop="openPopup">
							保 证 金
							<u-icon
								style="margin-left:16rpx;"
								name="info-circle" 
								color="rgba(10, 15, 45, 0.8)" 
								size="32"
							></u-icon>
						</view>
						<view class="middle" v-if="canRefund">（申请退还）</view>
						<view class="card-content">
							￥{{carDetailData.secondAuctionEntity.deposit | $numFormat}}
							<u-icon name="arrow-right" color="#cccccc" size="32" style="margin-left:8rpx;" v-if="canRefund"></u-icon>
						</view>
					</view>
				</view>
			</template>
			
			
			<view class="card">
				<view class="" v-if="carDetailData.secondAuctionEntity.status === 1">开始时间：{{formatDate1()}}</view>
				<AuctionCountdown :status.sync="carDetailData.secondAuctionEntity.status" :timeStamp="carDetailData.endToCancelTime" showAll v-else />
				<AuctionRecordList :list="carDetailData.recordEntityList" :userInfo="userInfo" :startPrice="carDetailData.secondAuctionEntity.startingPrice" />
			</view>
				
		</view>
		
		<view class="bottom foot-sticky" v-if="carDetailData.secondAuctionEntity.status === 1 || carDetailData.secondAuctionEntity.status === 4">
			<button class="order-btn" :disabled="carDetailData.secondAuctionEntity.status === 1" @click="goOfferPage">
				{{ isNextAuction ? '继续出价' : '参与竞价' }}
			</button>
		</view>
		
		<view class="fixed-buttom-disabled-btn-group" v-if="isWinner && carDetailData.secondAuctionEntity.status !== 6">
			<button @click="goDisputesPage" v-if="carDetailData.secondAuctionEntity.status !== 6 || carDetailData.biddingDisputesEntityList.length">
				{{ isBiddingDisputes ? '纠纷处理中' : '交易纠纷' }}
			</button>
			<button 
				v-if="carDetailData.secondAuctionEntity.status === 5 && carDetailData.secondAuctionEntity.wecarsConfirm !== 1"
				class="save-btn" 
				:disabled="isDisabled" 
				@click="confirmAuction"
			>
				完成交易
			</button>
		</view>
		
		<AuctionDepositPopup :showPopup.sync="showPopup" />
  </view>
</template>

<script>
import dayjs from 'dayjs'
import { powerModeAll } from "@/constants"
import { formatTenThousandNumber, formatThousandNumber } from '@/utils/index.js'
import AuctionCountdown from '@/common/AuctionCountdown.vue'
import AuctionRecordList from './components/AuctionRecordList.vue'
import AuctionDepositPopup from './components/AuctionDepositPopup.vue'
import { addUserCarIntention } from '@/utils/index'

export default {
		components: {
      AuctionCountdown,
			AuctionRecordList,
			AuctionDepositPopup,
    },
		
    filters: {
      powerModeName(value) {
        return powerModeAll.find(item => item.value === value).name
      },
      formatDate(value) {
        return dayjs(value).format('YYYY年MM月DD日')
      }
    },
		
    data() {
      return {
        userInfo: null,
				id: null,
				carDetailData: null,
				showPopup: false,
      }
    },
		
    computed: {
			isBiddingDisputes() {
				let res = false
				
				if (this.carDetailData && this.carDetailData.biddingDisputesEntityList.length) {
					const result = this.carDetailData.biddingDisputesEntityList.some(item => item.status === 1)
					
					if (result) {
						res = true
					}
				}
				
				return res
			},
			
      isNextAuction() {
				let res = false
				
				if (this.userInfo && this.carDetailData) {
					const index = this.carDetailData.recordEntityList.findIndex(item => item.userId === this.userInfo.id)
					if (index !== -1) {
						res = true
					}
				}
				
				return res
			},
			
			isWinner() {
				let res = false
				
				if (this.userInfo && this.carDetailData && (this.carDetailData.secondAuctionEntity.status > 4 || this.carDetailData.secondAuctionEntity.status === 3) && this.carDetailData.recordEntityList && this.carDetailData.recordEntityList.length) {
					if (this.carDetailData.recordEntityList[0].userId === this.userInfo.id) {
						res = true
					}
				}
				
				return res
			},
			
			isDisabled() {
				let res = false
				
				if (this.isBiddingDisputes) {
					res = true
				}
				
				if (this.carDetailData && this.carDetailData.isFullyPaid !== 1) {
					res = true
				}
				
				return res
			},
			
			canRefund() {
				let res = false
				
				if (this.carDetailData && this.carDetailData.secondAuctionEntity.status === 6) {
					res = true
				}
				
				if (this.carDetailData && this.carDetailData.secondAuctionEntity.status === 3) {
					const result = this.carDetailData.biddingDisputesEntityList.some(item => item.result === 1)
					
					if (result) {
						res = true
					}
				}
				
				return res
			},
    },
		
    onLoad(option) {
			this.id = option.id
    },
		
    onShow() {
			const isLogin = uni.getStorageSync('isLogin')
			
			if (isLogin) {
				getApp().globalData.getUserInfo((data) => {
					this.userInfo = data
					this.getProductDetailData()
				})
			} else {
				this.getProductDetailData()
			}
    },
		
    methods: {
      async getProductDetailData () {
        uni.showLoading({
          title: '加载中'
        })
				
				const params = {
					id: this.id,
				}
				
				if (this.userInfo && this.userInfo.id) {
					params.userId = this.userInfo.id
				}
				
        const carDetailData = await this.$getRequest(this.$url.getAuctionDetail, "GET", params)
				
				if (carDetailData.data) {
					this.carDetailData = carDetailData.data;
					this.carDetailData.secondHandCarsEntity.regDate = dayjs(carDetailData.data.secondHandCarsEntity.regDate).format('YYYY年MM月DD日')
					if (this.userInfo) {
						addUserCarIntention(4, this.carDetailData.carTypeYearProductEntity.carTypeId, this.userInfo.id)
					}
				} else {
					this.$u.route("/pages/error/nodata")
				}
        
        uni.hideLoading();
				
				
      },
      
      async handleLike() {
      	if (this.userInfo) {
      		const res = await this.$getRequest(this.$url.likeProduct, 'POST', {
      		    carTypeYearProductId: this.carDetailData.carTypeYearProductEntity.id,
      		    userId: this.userInfo.id,
      				type: 2,
      		})
      		
      		if(res.code === 0) {
      			this.getProductDetailData()
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
			
			formatTenThousandNumber(number, unit1, unit2) {
				return formatTenThousandNumber(number, unit1, unit2)
			},
			
			formatThousandNumber(price) {
				return formatThousandNumber(price)
			},
			
			formatPrice(price) {
				let res = ''
				if(price || price == 0) {
					if (price > 10000) {
						res = formatTenThousandNumber(price)
					} else {
						res = `${formatThousandNumber(price)}元`
					}
				}
				
				return res
			},
				
			getTranscationNum(transcationNum) {
				let res = ''
				if (!transcationNum && transcationNum !== 0) {
					res = '-'
				} else {
					if (transcationNum === 0) {
						res = '首次'
					} else {
						res = `${transcationNum}次`
					}
				}
				
				return res
			},
				
			getPowerModeName(index) {
				const mode = powerModeAll.find(item => item.value === index)
				if (mode) {
					return mode.name
				}
				
				return '-'
			},
			
			goOfferPage() {
				if (this.userInfo) {
					if (this.userInfo.riskAuditStatus >= 4) {
						uni.navigateTo({
							url: `/pagesOrder/auction/auctionOffer?id=${this.id}`
						})
					} else {
						uni.navigateTo({
							url: `/pagesOrder/identity/identity?from=auction`
						})
					}
				} else {
					uni.navigateTo({
						url: `/pages/sign/sign`
					})
				}
			},
			
			openPopup() {
				this.showPopup = true
			},
			
			goDisputesPage() {
				if (this.isBiddingDisputes) {
					const result = this.carDetailData.biddingDisputesEntityList.some(item => item.fromSys === 2 && item.status === 1)
					
					if (!result) {
						this.navigateDisputesPage()
					}
				} else {
					this.navigateDisputesPage()
				}
			},
			
			navigateDisputesPage() {
				uni.navigateTo({
					url: `/pagesOrder/auction/disputes?id=${this.id}`
				})
			},
			
			confirmAuction() {
				uni.showModal({
					title: '提示',
					content: `确认已与商家完成交易？`,
					confirmText: "确认",
					success: async (res)=> {
						if (res.confirm) {
							const res = await this.$getRequest(this.$url.confirmAuction, 'GET', {
							    id: this.id,
							    fromSys: 1,
							})
							
							if(res.code === 0) {
								this.getProductDetailData()
								uni.showToast({
									title: '您已确认交易',
									duration: 2000
								})
							}
						}
					}
				})
			},
			
			goCashHome() {
				if(this.canRefund) {
					uni.navigateTo({
						url: `/pagesOrder/auction/cashHome?userId=${this.userInfo.id}`
					})
				}
			},
			
			formatDate1() {
				return dayjs(this.carDetailData.secondAuctionEntity.startTime).format('YYYY年MM月DD日 HH时')
			}
				
    },
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.icons {
	height: 64rpx;
	display: flex;
	align-items: center;
	.fw {
		margin-left: 32rpx;
	}
}
		
.certCarDetailPage {
  margin: 20px;
  padding: 0;
	padding-bottom: 200rpx;
  
  .m-carinfo-title {
    font-weight: normal;
    font-size: 22px;
    line-height: 30px;
    color: #0A0F2D;
  }
  .m-price-txt {
    font-weight: 600;
    font-size: 34rpx;
    color: #F5194B;
  }
  .m-title-price {
    font-weight: 400;
    font-size: 12px;
    color: rgba(10, 15, 45, 0.5);
  }
	.info-bottom-right {
		background: #0A0F2D;
		border-radius: 8rpx;
		color: #fff;
		padding: 12rpx 24rpx;
    font-weight: 500;
    font-size: 12px;
	}
  .m-icon-right {
    width: 16rpx !important;
    height: 16rpx !important;
  }
  .m-h-line {
    color: rgba(10, 15, 45, 0.04);
  }
  .m-long-view-1 {
    width: 60%;
  }
  .m-long-view-2 {
    width: 55%;
  }
	
	.card {
		background: #FFFFFF;
		box-shadow: 0px -2px 32px rgba(10, 15, 45, 0.02), 0px 4px 24px rgba(10, 15, 45, 0.04);
		border-radius: 24rpx;
		padding: 40rpx 32rpx;
	}
	.color-grey {
		color: #64696F;
	}
	.color-black {
		color: #0A0F2D;
	}
	.adopt-icon {
		width: 36rpx;
		height: 36rpx;
		display: inline-block;
		vertical-align: middle;
		margin-right: 8rpx;
	}
	.car-image {
		background: rgba(10, 15, 45, 0.04);	
		border-radius: 16rpx;
	}
	.phone-service {
		background: rgba(10, 15, 45, 0.04);
		border-radius: 16px;
		padding: 36rpx 36rpx;
		text-align: center;
		font-weight: 500;
		font-size: 30rpx;
		margin-left: 16rpx;
	}
	.notice {
		background: #0A0F2D;
		border-radius: 16px;
		padding: 18rpx 36rpx;
		text-align: center;
		font-weight: 500;
		font-size: 30rpx;
		color: #fff;
		margin-left: 24rpx;
		.notice-date {
			color: rgba(255, 255, 255, .8);
		}
		
	}
	.s-icon {
		width: 32rpx;
		height: 28rpx;
		margin: 0 auto;
		margin-bottom: 15rpx;
		
	}
	.banner {
		background: rgba(10, 15, 45, 0.04);
    	border-radius: 16rpx;
	}
	
	.bottom {
		background: #fff;
		padding: 0 32rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.btns {
			display: flex;
			align-items: center;
			.btn {
				margin-right: 32rpx;
				height: 90rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-between;
				font-size: 24rpx;
				color: rgba(10, 15, 45, 0.8);
			}
			.share {
				background: #fff;
				border: none;
				padding: 0;
				line-height: unset;
				&:after {
					border: none;
				}
			}
		}
		.order-btn {
			flex: 1;
			height: 116rpx;
			border-radius: 16rpx;
			background: #0A0F2D;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 34rpx;
			font-weight: 500;
			color: #FFFFFF;
		}
		button[aria-disabled="true"] {
			background: rgba(10, 15, 45, 0.5);
		}
	}
}

.car-brand {
	display: flex;
	justify-content: space-between;
	.brand {
		font-family: PingFangSC-Medium;
		font-size: 20px;
		line-height: 60rpx;
		color: #333333;
	}
	.btns {
		display: flex;
		align-items: center;
		.btn {
			margin-left: 32rpx;
		}
		.share {
			background: #fff;
			border: none;
			padding: 0;
			line-height: unset;
			&:after {
				border: none;
			}
		}
	}
}
.car-type {
	font-family: PingFang SC;
	font-size: 14px;
	line-height: 60rpx;
	color: #767676;
}

.car-info {
	padding-top: 32rpx;
	.car-info-line {
		margin-top: 16rpx;
		height: 40rpx;
		line-height: 40rpx;
		display: flex;
		.left {
			display: flex;
			width: 360rpx;
			margin-right: 40rpx;
		}
		.right {
			display: flex;
			width: 0;
			flex: 1;
		}
		.label {
			color: #666666;
			font-size: 24rpx;
			width: 100rpx;
			margin-right: 16rpx;
			text-align: justify;
			text-align-last: justify;
		}
		.card-content {
			width: 0;
			flex: 1;
			color: #333333;
			font-size: 24rpx;
			@include text-overflow;
		}
	}
	.car-info-line:first-child {
		margin-top: 0;
	}
}

.auction-info {
	margin-top: 32rpx;
	margin-bottom: 16rpx;
	height: 36rpx;
	display: flex;
	align-items: center;
	color: #3D3D3D;
	font-size: 24rpx;
	.price-wrap {
		padding-left: 8rpx;
		display: flex;
		align-items: baseline;
		font-size: 24rpx;
		color: #FF0000;
		.price {
			font-size: 30rpx;
		}
	}
}

.success-tip {
	height: 44rpx;
	line-height: 44rpx;
	font-size: 32rpx;
	color: #0AEB7D;
	text-align: center;
}

.final-price {
	margin-top: 32rpx;
	height: 44rpx;
	line-height: 44rpx;
	font-size: 28rpx;
	color: rgba(10, 15, 45, 0.8);
	text-align: center;
}

.card-item {
	margin-bottom: 24rpx;
	line-height: 44rpx;
	font-size: 28rpx;
	color: rgba(10, 15, 45, 0.8);
	display: flex;
	justify-content: space-between;
	align-items: center;
	.label {
		margin-right: 24rpx;
	}
	.middle {
		color: #767676;
	}
	.company-name {
		width: 0;
		flex: 1;
		text-align: right;
	}
}
</style>
