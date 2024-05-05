<template>
	<view class="wrap" v-if="detail">
		<view class="card">
			<view class="card-item">
				<view class="label">起拍价格</view>
				<view class="card-content">￥{{detail.secondAuctionEntity.startingPrice | $numFormat}}</view>
			</view>
			
			<view class="card-item">
				<view class="label">加价幅度</view>
				<view class="card-content">￥{{detail.secondAuctionEntity.advance | $numFormat}}</view>
			</view>
			
			<view class="card-item">
				<view class="label" @click="openPopup">
					保 证 金
					<u-icon
						style="margin-left:16rpx;"
						name="info-circle" 
						color="rgba(10, 15, 45, 0.8)" 
						size="32"
					></u-icon>
				</view>
				<view class="card-content">￥{{detail.secondAuctionEntity.deposit | $numFormat}}</view>
			</view>
			
			<view class="card-item">
				<view class="label">当前出价</view>
				<view class="card-content">￥{{detail.currentPrice | $numFormat}}</view>
			</view>
			
			<view class="card-item">
				<view class="label">结束时间</view>
				<view class="card-content">{{detail.secondAuctionEntity.endTime}}</view>
			</view>
			
			<view class="line"></view>
			
			<view class="card-item">
				<view class="label">您的出价</view>
				<view class="card-content">
					<view class="price-wrap">
						<view class="icon-wrap" @click="minus">
							<u-icon
								name="minus-square-fill" 
								size="40"
							></u-icon>
						</view>
						<view class="price">
							{{price | $numFormat}}
						</view>
						<view class="icon-wrap plus" @click="plus">
							<u-icon
								name="plus-square-fill" 
								size="40"
							></u-icon>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="card">
			<view class="card-title">历史出价</view>
			<AuctionRecordList :list="list" :userInfo="userInfo" :startPrice="detail.secondAuctionEntity.startingPrice" isMe />
		</view>
		
		<view class="fixed-bottom-btn" v-if="detail.secondAuctionEntity.status === 4">
			<view class="bottom-btn" @click="reviewBankBill" v-if="detail.isPayDeposit === 2 || detail.isPayDeposit === 3">
				{{detail.isPayDeposit === 2 ? '重新上传银行转账凭证' : '查看支付明细'}}
			</view>
			<view class="bottom-btn" @click="offer" v-else>
				{{ list.length ? '继续出价' : '确认出价' }}
			</view>
		</view>
		
		<AuctionDepositPopup :showPopup.sync="showPopup" />
	</view>
</template>

<script>
import dayjs from 'dayjs'
import AuctionRecordList from './components/AuctionRecordList.vue'
import AuctionDepositPopup from './components/AuctionDepositPopup.vue'

export default {
	components: {
	  AuctionRecordList,
		AuctionDepositPopup,
	},
	
	data() {
		return {
			id: null,
			detail: null,
			userInfo: null,
			list: [],
			showPopup: false,
			price: 0,
		}
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
		}
	},
	
	methods: {
		async getProductDetailData () {
		  uni.showLoading({
		    title: '加载中'
		  })
			
		  const carDetailData = await this.$getRequest(this.$url.getAuctionDetail, "GET", {
		      id: this.id,
					userId: this.userInfo.id,
		  });
			
			if (carDetailData.data) {
				this.list = carDetailData.data.recordEntityList.filter(item => this.userInfo.id === item.userId).reverse()
				this.detail = carDetailData.data
				this.detail.secondAuctionEntity.endTime = dayjs(carDetailData.data.secondAuctionEntity.endTime).format('YYYY年MM月DD日 HH:mm')
				this.price = this.detail.currentPrice + this.detail.secondAuctionEntity.advance
			}
		  
		  uni.hideLoading()
		},
		
		openPopup() {
			this.showPopup = true
		},
		
		minus() {
			if (this.price <= this.detail.currentPrice + this.detail.secondAuctionEntity.advance) {
				uni.showToast({
					title: '出价不能低于当前价格',
					duration: 2000,
					icon: "none"
				})
				return false
			}
			this.price = this.price - this.detail.secondAuctionEntity.advance
		},
		
		plus() {
			this.price = this.price + this.detail.secondAuctionEntity.advance
		},
		
		offer() {
			if (this.list.length) {
				this.addAuctionOffer()
			} else {
				this.handlePay()
			}
		},
		
		async addAuctionOffer() {
			const params = {
				secondAuctionId: this.id,
				secondCarId: this.detail.secondAuctionEntity.secondCarId,
				price: this.price,
			  userId: this.userInfo.id,
			  valid: 1,
			}
			const result = await this.$getRequest(this.$url.addAuctionOffer, 'POST', params)
			if(result.code === 0){
				this.goDetailPage()
			}
		},
		
		goDetailPage() {
			let url = `/pagesOrder/auction/detail?id=${this.id}`
			uni.reLaunch({
				url
			})
		},
		
		handlePay() {
			// businessType 0租车、1长租产品、2新车订阅、3购买二手车、4团购、5会员、6.购买服务 7.竞拍
			// payType 0余额、1押金、2订金、3尾款、4长租费用（包月或季）、6二手车、7支付年费、8订阅费用、9租车租金、10租车押金
			uni.navigateTo({
				url: `/pagesOrder/rental/pay/chooseRentalPay?orderId=${this.id}&carId=${this.detail.secondAuctionEntity.secondCarId}&price=${this.detail.secondAuctionEntity.deposit}&offer=${this.price}&openid=${this.userInfo.xcxOpenid}&userId=${this.userInfo.id}&businessType=7&payType=10`
			})
		},
		
		reviewBankBill() {
			uni.navigateTo({
				url: `/pagesOrder/rental/pay/bankPayInfo?orderId=${this.id}&price=${this.detail.secondAuctionEntity.deposit}&payType=10&openid=${this.userInfo.xcxOpenid}&userId=${this.userInfo.id}&businessType=7&billId=${this.detail.billId}`
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	padding: 40rpx 40rpx 240rpx;
	.card {
		.card-title {
			margin-bottom: 24rpx;
			height: 44rpx;
			font-size: 28rpx;
			line-height: 44rpx;
			color: rgba(10, 15, 45, 0.8);
		}
		.card-item {
			margin-bottom: 24rpx;
			height: 44rpx;
			font-size: 28rpx;
			color: rgba(10, 15, 45, 0.8);
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		.line {
			margin: 40rpx 0;
			width: 311px;
			height: 2rpx;
			background: rgba(10, 15, 45, 0.2);
		}
		.price-wrap {
			display: flex;
			align-items: center;
			.icon-wrap {
				display: flex;
				align-items: center;
				padding: 0 32rpx;
			}
			.plus {
				padding-right: 0;
			}
			.price {
				color: #1A1A1A;
				font-size: 40rpx;
			}
		}
	}
}
</style>