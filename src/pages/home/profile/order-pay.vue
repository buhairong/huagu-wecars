<template>
	<view class="order-pay">
		<view class="order-pay-img">
			<image src="https://image.51cheyaoshi.com/xcx/app/static/img/done.png"></image>
			<text>预定成功</text>
			<text class="tip" v-if="index == 4">请耐心等待金融方审核</text>
		</view>
		
		<view class="order-content" v-if="index == 3">
			<view class="o-c-t"><view class="o-content-title">合约详情</view></view>
			<view class="order-self">
				<u-row class="o-content-row">
					<u-col span="6" class="o-content-title">订阅方案</u-col>
					<u-col span="6"><text style="white-space: nowrap;" class="f-right">
						{{orderInfo.carSubscribeName}}</text></u-col>
				</u-row>
				<u-row class="o-content-row">
					<u-col span="9" class="o-content-title">支付订金</u-col>
					<u-col span="3"><text class="f-right">¥{{orderInfo.reserveFee}}</text></u-col>
				</u-row>
				<u-row class="o-content-row">
					<u-col span="3" class="o-content-title">订单编号</u-col>
					<u-col span="9">
						<view class="f-right">
							<text>{{orderInfo.orderNum}}</text>
							<text @click="copyOrder(orderInfo.orderNum)" style="text-align: center;padding: 0px 4px;border-radius: 4px;background: #F5F6F7;">复制</text>
						</view>
					</u-col>
				</u-row>
			</view>
		</view>
		
		<view class="card" v-else-if="index == 4">
			<view class="card-title">
				<view class="title">
					<view class="left-border"></view>
					<view class="text">
						分期方案
					</view>
				</view>
			</view>
			
			<view class="card-content-space-between">
				<view class="item-wrap">
					<view class="item-title">
						车辆价格
					</view>
					<view class="item-content">
						{{stagingItem.dealerReferencePrice ? `￥${formatThousandNumber(stagingItem.dealerReferencePrice)}` : '-'}}
					</view>
				</view>
				
				<view class="item-wrap">
					<view class="item-title">
						分期期数
					</view>
					<view class="item-content">
						{{stagingItem.period ? `${stagingItem.period}期` : '-'}}
					</view>
				</view>
				
				<view class="item-wrap">
					<view class="item-title">
						首付金额
					</view>
					<view class="item-content">
						{{stagingItem.firstPayment ? `￥${formatThousandNumber(stagingItem.firstPayment)}` : '-'}}
					</view>
				</view>
				
				<view class="item-wrap">
					<view class="item-title">
						月供金额
					</view>
					<view class="item-content">
						{{stagingItem.monthPayment ? `￥${formatThousandNumber(stagingItem.monthPayment)}` : '-'}}
					</view>
				</view>
			</view>
		</view>
	
		<view class="btnClass">
			<view
			    class="foot-but "
			    @click="goOrderPage"
					v-if="index == 4"
			>
			    <view class="foot-but-r">
						查看订单
			    </view>
			</view>
			
			<view
			    class="foot-but "
			    @click="handleBookCar"
					v-else
			>
			    <view class="foot-but-r">
					个人定制
			    </view>
			</view>
		</view>
	</view>
</template>

<script>
import { formatThousandNumber } from '@/utils/index.js'
	
export default {
	data() {
		return {
			id: '', // 订单
			orderInfo: '',
			planId:'', // 分期方案ID
			stagingId: '', // 分期方案ID
			index: null, // 3.订阅方案 4.分期方案
			stagingItem: {}, // 分期方案展示内容
			cartype: null, // 1.新车 2.二手车
		}
	},
	methods: {
		getSuccessInfoData() {
			var params = {
				id: this.id
			}
			this.$getRequest(this.$url.getSuccessInfo, 'GET', params).then((data) => {
				if(data.code == 0){
					this.orderInfo = data.data
				}
			})
		},
		
		handleBookCar() {
			console.log(this.orderInfo,111)
			uni.navigateTo({
				url: './customized?id='+this.id + '&planId='+this.planId + '&cartype='+this.cartype
			})
		},
		// 复制订单号
		copyOrder(orderNum) {
			uni.setClipboardData({
				data: orderNum,
			})
		},
		
		formatThousandNumber(num) {
			return formatThousandNumber(num)
		},
		
		goOrderPage() {
			this.$u.route({
				type: 'navigateBack',
				delta: 1
			})
		}
	},
	onShow() {
		if(this.index == 3) {
			this.getSuccessInfoData()
		}
		
	},
	onLoad(option) {
		this.id = option.id // 订单ID
		this.planId = option.planId // 订阅方案ID
		this.stagingId = option.stagingId // 分期方案ID
		this.index = option.index // 3.订阅方案 4.分期方案
		this.cartype = option.cartype // 1.新车 2.二手车
		
		try {
			const value = uni.getStorageSync('certcarDetailInfo')
			if (value) {
				const info = JSON.parse(value)
				this.stagingItem = info.stagingItem
			}
		} catch (e) {
			// error
		}
	}
}
</script>

<style lang="scss" scoped>
	.f-right {
		float: right;
	}
	.btnClass{
		margin-top: 0px;
		text-align: center;
		margin-top: 112rpx;
		.foot-but-r{
			width: 100%;
			text-align: center;
		}
		.foot-but{
			margin: 0rpx;
		}
	}
	.order-pay {
		padding: 0;
		margin: 36rpx 32rpx;
		.order-pay-img {
			margin: 86rpx 0rpx;
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: 34rpx;
			image {
				width: 66.67px;
				height: 66.67px;
				margin-bottom: 18rpx;
			}
			.tip {
				font-size: 28rpx;
				color: rgba(10, 15, 45, 0.5);
				line-height: 44rpx;
				padding-top: 8rpx;
			}
		}
		.order-content {
			padding: 40rpx 12rpx 40rpx 16rpx;
			margin-top: 26rpx;
			border-radius: 24rpx;
			box-shadow: 0px -2px 32px rgba(10, 15, 45, 0.02),
			    0px 8px 24px rgba(10, 15, 45, 0.06);
			.o-c-t{
				.o-content-title {
					font-size: 34rpx;
					position: relative;
					padding-left: 20rpx;
				}
				.o-content-title:before {
					content: "";
					position: absolute;
					width: 4rpx;
					height: 28rpx;
					border-radius: 4rpx;
					background-color: #0AEB7D;
					top: 10rpx;
					left: 4rpx;
				}
			}
			.order-self {
				margin-top: 16rpx;
				padding-left: 16rpx;
				.o-content-row{
					line-height: 2.2;
				}
			}
		}
		
	}

</style>