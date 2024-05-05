<template>
	<view class="wrap" v-if="detail">
		<CarInfoHeader :carInfo="detail[0].carTypeYearProductEntity" />
		
		<view class="list-wrap">
			<view class="card" v-for="(item, index) in detail" :key="index">
				<view class="card-title-wrap">
					<u-section
						:title="`${formatDate(`${item.startTime}`)} - ${formatDate(`${item.endTime}`)}`" 
						line-color="#0AEB7D"
						font-size="28"
						color="#0A0F2D"
						:right="false"
					></u-section>
					<view class="sub-order-status">{{CAR_RENTAL_ORDER_STATUS[item.status]}}</view>
				</view>
				
				<view class="period-wrap" v-if="item.open">
					<view class="row header-row">
						<view class="col">租赁周期</view>
						<view class="col">租车费用</view>
						<view class="col">付款方式</view>
					</view>
					
					<view class="row" v-for="(period, index1) in item.reqVo" :key="index1">
						<view class="col">
							{{index1+1}}/{{item.reqVo.length}}
							<view class="tag" v-if="item.currentOrderSize === index1+1">本期</view>
						</view>
						<view class="col">¥{{period.moneyEveryMonth | $numFormat}}/月</view>
						<view class="col" :class="{'underline': period.payWay === 1 || period.payWay === 2}" @click="reviewAccount(period)">{{payWayList[period.payWay]}}</view>
					</view>
				</view>
				
				<view class="expand-btn" @click="toggleExpand(item)">
					<view v-if="item.open">收起</view>
					<view v-else>
						<u-icon name="arrow-down" color="#969799" size="28"></u-icon>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { formatDate, formatTimeStamp } from '@/utils'
import { CAR_RENTAL_ORDER_STATUS } from "@/constants"
import CarInfoHeader from '../../components/CarInfoHeader.vue'

export default {
	components: {
	  CarInfoHeader,
	},
	
	data() {
		return {
			CAR_RENTAL_ORDER_STATUS,
			orderId: null,
			detail: null,
			payWayList: {
				1: '线上支付',
				2: '银行转账',
				3: '待支付',
			}
		}
	},
	
	onLoad(options) {
		this.orderId = options.orderId
		this.getDetail()
	},
	
	onShow() {
		
	},
	
	methods: {
		async getDetail() {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				id: this.orderId,
			}
			
			const res = await this.$getRequest(this.$url.getRentalSubOrderList, 'GET', params)
			
			uni.hideLoading()
			if (res.code === 0) {
				this.detail = res.data.map((item, index) => {
					let temp = {}
					if (index === 0) {
						temp = {
							...item,
							open: true
						}
					} else {
						temp = {
							...item,
							open: false
						}
					}
					
					return temp
				})
			}
		},
		
		formatDate(time) {
			const date = formatDate(time)
			return `${date.month}月${date.date}日 ${date.hour}:${date.minute}`
		},
		
		toggleExpand(item) {
			item.open = !item.open
		},
		
		reviewAccount(item) {
			uni.setStorageSync("rentalDepositDetailReqVo", item.depositDetailReqVo)
			if (item.payWay === 1) {
				uni.navigateTo({
					url: `/pagesOrder/rental/pay/wxAccount`
				})
			} else if (item.payWay === 2) {
				uni.navigateTo({
					url: `/pagesOrder/rental/pay/bankAccount`
				})
			}
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";	

.wrap {
	padding: 32rpx 0 200rpx;
	.list-wrap {
		padding: 40rpx 32rpx 0;
		.card {
			.card-title-wrap {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.sub-order-status {
					color: #767676;
					font-size: 28rpx;
				}
			}
			.period-wrap {
				margin-top: 40rpx;
				border-radius: 8rpx 8rpx 0px 0px;
				color: rgba(10, 15, 45, 0.6);
				font-size: 24rpx;
				.row {
					height: 90rpx;
					display: flex;
					border-top: 2rpx solid rgba(10, 15, 45, 0.2);
					.col {
						flex: 1;
						display: flex;
						justify-content: center;
						align-items: center;
						border-right: 2rpx solid rgba(10, 15, 45, 0.2);
						position: relative;
						&:last-child {
							border-right: none;
						}
						.tag {
							position: absolute;
							top: 50%;
							left: 0;
							transform: translateY(-50%);
							z-index: 100;
							width: 66rpx;
							height: 28rpx;
							border-radius: 0px 8rpx 8rpx 0px;
							display: flex;
							justify-content: center;
							align-items: center;
							background: #0AEB7D;
							color: #FFFFFF;
							font-size: 20rpx;
						}
					}
					.underline {
						text-decoration: underline;
					}
				}
				.header-row {
					height: 64rpx;
					border-top: none;
					background: #F2F3F5;
				}
			}
			.expand-btn {
				margin-top: 40rpx;
				display: flex;
				justify-content: center;
				color: #B9B9B9;
				font-size: 24rpx;
			}
		}
	}
}
</style>