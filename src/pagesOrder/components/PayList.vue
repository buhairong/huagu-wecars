<template>
	<view class="list-wrap">
		<view 
			class="list-item"
			v-for="(item, index) in list"
			:key="item.id"
			@click="goDetailPage(item)"
		>
			<view class="left">
				<view class="line1">
					第{{toChinesNum(index+1)}}笔账单
					<view class="tag" v-if="item.payWay === 2 && item.confirmed === 2">审核未通过</view>
				</view>
				<view class="line2">{{item.createTime}}</view>
			</view>
			<view class="right">
				<view>
					<view class="line1">-￥{{item.total | $numFormat}}</view>
					<view class="line2" style="text-align:right;">{{item.payWay === 1 ? '微信支付' : '银行转账'}}</view>
				</view>
				<image
					style="width:48rpx;height:48rpx;margin-left:4rpx;"
					src="https://image.51cheyaoshi.com/xcx/app/static/ordered/arrow-right.png"
				/>
			</view>
		</view>
	</view>
</template>

<script>
import {toChinesNum} from '@/utils'

export default {
	props: {
		orderId: {
			type: Number | String,
			required: true,
		},
		
		openid: {
			type: Number | String,
			required: true,
		},
		
		businessType: {
			type: Number | String,
			required: true,
		},
		
		// 2.押金 4.订阅费用
		paymentStatus: {
			type: Number | String,
			required: true,
		},
		
		userId: {
			type: Number | String,
			required: true,
		},
		
		list: {
			type: Array,
			default: () => [],
		},
		
	},
	
	data(){
		return {
			
		}
	},
	
	methods: {
		toChinesNum(num) {
			let str = toChinesNum(num)
			if (num >= 10 && num <= 19) {
				const arr = str.split('')
				arr.splice(0, 1)
				str = arr.join('')
			}
			return str
		},
		
		goDetailPage(item) {
			if(item.payWay === 2 && item.confirmed === 2) {
				this.goBillInfoPage(item)
				return
			}
			
			
			let payType = 0
			if (this.paymentStatus == 2) {
				payType = 8
			} else if (this.paymentStatus == 4 || this.paymentStatus == 14) {
				payType = 6
			}
			
			if (item.payWay == 1) {
				uni.navigateTo({
					url: `/pagesOrder/pay/wxPayDetail?orderId=${this.orderId}&id=${item.id}&payType=${payType}`
				})
			} else if (item.payWay == 2) {
				uni.navigateTo({
					url: `/pagesOrder/pay/bankBillList?orderId=${this.orderId}&id=${item.id}&payType=${payType}&userId=${this.userId}`
				})
			}
		},
		
		goBillInfoPage(item) {
			uni.navigateTo({
				url: `/pagesOrder/pay/bankPayInfo?orderId=${this.orderId}&price=${item.total}&paymentStatus=${this.paymentStatus}&openid=${this.openid}&userId=${this.userId}&businessType=${this.businessType}&billId=${item.id}`
			})
		},
	}
}
</script>

<style lang="scss" scoped>
.list-wrap {
	width: 100%;
}

.list-item {
	margin-bottom: 12px;
	width: 100%;
	padding: 16px 32rpx;
	border-radius: 24rpx;
	box-shadow: 0px -2px 32px 0px rgba(10, 15, 45, 0.02),0px 8px 24px 0px rgba(10, 15, 45, 0.04);
	display: flex;
	justify-content: space-between;
	align-items: center;
	.line1 {
		height: 48rpx;
		font-size: 17px;
		line-height: 48rpx;
		color: #0A0F2D;
		display:flex;
		align-items:center;
		.tag {
			margin-left: 16rpx;
			width: 152rpx;
			height: 44rpx;
			border-radius: 22rpx;
			background: #FA5151;
			font-size: 12px;
			color: #fff;
			display:flex;
			justify-content: center;
			align-items:center;
		}
	}
	.line2 {
		height: 40rpx;
		font-size: 12px;
		line-height: 40rpx;
		color: rgba(10, 15, 45, 0.5);
	}
	.right {
		display: flex;
		align-items: center;
	}
}
</style>