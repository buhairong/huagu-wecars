<template>
	<view class="page-wrap1" v-if="detailInfo">
			<view class="card photo-wrap">
				<view
					class="img-wrap"
				>
					<image
						class="car-img"
						:src="detailInfo.imageUrl"
						mode="widthFix"
						@click="preview"
					/>
				</view>
			</view>
			
			<view class="card">
				<view class="item">
					<view class="item-title">姓名</view>
					<view class="item-content">
						{{detailInfo.name}}
					</view>
				</view>
				
				<view class="item">
					<view class="item-title">性别</view>
					<view class="item-content">
						{{ detailInfo.sex == 1 ? '男' : '女' }}
					</view>
				</view>
				
				<view class="item">
					<view class="item-title">学历</view>
					<view class="item-content">
						{{ EDUCATION_STATUS[detailInfo.education] }}
					</view>
				</view>
				
				<view class="item">
					<view class="item-title">手机</view>
					<view class="item-content">
						{{ detailInfo.mobile }}
					</view>
				</view>
			</view>
			
			<view class="card introduction" v-if="detailInfo.introduce">
					{{ detailInfo.introduce }}
			</view>
		
		<view class="order-btn-wrap" v-if="type == 1">
			<view class="order-btn" @click="handleOrder">
				选择这个管家
			</view>
		</view>
	</view>
</template>

<script>
	import { BUSINESS_ACTIVITY_STATUS,EDUCATION_STATUS } from "@/constants"
	import { formatTenThousandNumber, formatThousandNumber } from '@/utils/index.js'
	
	export default {
		data() {
			return {
				BUSINESS_ACTIVITY_STATUS,
				EDUCATION_STATUS,
				type: '', // 1.租车订单  2.商务活动
				id: '',
				userId: '',
				detailInfo: null,
				orderParams: {
					cityId: '', // 城市ID
					cityName: '', // 城市名称
					carTypeYearProductId: '',
					startDate: '', // 租车开始日期
					endDate: '', // 租车结束日期
					mobile: '', // 手机号
					address: '', // 预约地址
					memberButlerId: '', // 管家ID
					companyId: '', // 公司ID
					userId: '', // 用户ID
					orderType: '', // 订单类型  1.个人 2.企业
					payWay: '', // 支付方式：0微信支付 1银行转账",
					totalDay: 1, // 总天数
					status: 0, // 状态 0创建订单 1支付中 2支付完成 3取消订单  默认0
					totalPayment: '', // 支付总金额
					riskAuditStatus: '',
				},
			}
		},
		
		onLoad(option) {
			this.id = option.id
			this.type = option.type
		},
		
		onShow() {
			const butlerDetailInfo = uni.getStorageSync('ButlerDetailInfo')
			if (butlerDetailInfo) {
				this.detailInfo = butlerDetailInfo
			}
			if (this.type == 1) {
				const params = uni.getStorageSync('rentalOrderParams')
				if (params) {
					this.orderParams = params
				}
			}
		},
		
		methods: {
			formatThousandNumber(price) {
				return formatThousandNumber(price)
			},
			
			handleOrder() {
				if(this.type == 1) {
					uni.setStorageSync('rentalOrderParams', this.orderParams)
					
					uni.navigateTo({
						url: `/pagesOrder/rentalIdentity/rentalIdentity?type=${this.type}&userId=${this.orderParams.userId}`
					})
				}
				
			},
			
			preview() {
				const urls = [this.detailInfo.imageUrl]
				uni.previewImage({
					urls
				});
			},
		}
	}
</script>


<style lang="scss" scoped>
@import "~@/styles/common.scss";

.page-wrap1 {
	padding-bottom: 240rpx;
	.card {
		.item {
			margin-top: 24rpx;
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
