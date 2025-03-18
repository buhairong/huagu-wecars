<template>
	<view class="page-wrap1" v-if="detailInfo">
		<view class="card">
			<view class="item">
				<view class="item-title">订单编号</view>
				<view class="item-content">
					{{detailInfo.orderNum}}
				</view>
			</view>
			
			<view class="item">
				<view class="item-title">活动名称</view>
				<view class="item-content">
					{{detailInfo.memberBusinessActivityEntity.siteName}}
				</view>
			</view>
			
			<view class="item">
				<view class="item-title">活动类型</view>
				<view class="item-content">
					{{ BUSINESS_ACTIVITY_STATUS[detailInfo.memberBusinessActivityEntity.businessActivityType] }}
				</view>
			</view>
			
			<view class="item">
				<view class="item-title">活动地点</view>
				<view class="item-content">
					{{detailInfo.memberBusinessActivityEntity.address}}
				</view>
			</view>
			
			<view class="item">
				<view class="item-title">活动时间</view>
				<view class="item-content">
					{{detailInfo.startDate}} 至 {{detailInfo.endDate}}
				</view>
			</view>
			
			<view class="item">
				<view class="item-title">订单总额</view>
				<view class="item-content">
					{{formatThousandNumber(detailInfo.money)}}元
				</view>
			</view>
			
			<view class="item">
				<view class="item-title">支付方式</view>
				<view class="item-content">
					{{ BUSINESS_ORDER_PAY_WAY_STATUS[detailInfo.payWay] }}
				</view>
			</view>
			
			<view class="item">
				<view class="item-title">我的管家</view>
				<view class="item-content">
					{{detailInfo.memberButlerEntity.name}}
				</view>
			</view>
			
			<view class="item">
				<view class="item-title">联系管家</view>
				<view class="item-content">
					{{detailInfo.memberButlerEntity.mobile}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { formatTenThousandNumber, formatThousandNumber } from '@/utils/index.js'
	import { MEMBER_CAR_RENTAL_ORDER_STATUS,PAY_WAY_STATUS,BUSINESS_ACTIVITY_STATUS,BUSINESS_ORDER_PAY_WAY_STATUS } from "@/constants"
	
	
	export default {
		data() {
			return {
				id: '',
				userId: '',
				detailInfo: null,
				BUSINESS_ACTIVITY_STATUS,
				BUSINESS_ORDER_PAY_WAY_STATUS
			}
		},
		
		onLoad(option) {
			this.id = option.id
			this.userId = option.userId
		},
		
		onShow() {
			this.getDetail()
		},
		
		methods: {
			formatThousandNumber(price) {
				return formatThousandNumber(price)
			},
			
			getDetail() {
				uni.showLoading({
				  title: '加载中'
				});
				this.$getRequest(this.$url.getMemberBusinessActivityOrderDetail, "GET", {
				  id: this.id,
				}).then(res => {
					uni.hideLoading()
					this.detailInfo = res.data
				}).catch(() => {
					uni.hideLoading()
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

.card {
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

.order-btn-wrap {
	display: flex;
	gap:24rpx;
}

.cancel-btn {
	width: 0;
	flex: 1;
	background: rgba(10, 15, 45, 0.04);
	border-radius: 16rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #0A0F2D;
	font-weight: 500;
	height: 116rpx;
	font-size: 34rpx;
}

.order-btn {
	width: 0;
	flex: 1;
}
</style>
