<template>
	<view class="wrap" v-if="account">
		<view class="header">
			<view class="left">
				<view class="title">可用余额</view>
				<view class="price-wrap">
					<view class="price">{{account.balance | $numFormat}}</view>
				</view>
			</view>
			<view class="right">
				<view @click="goRechargePage">
					充值
					<u-icon name="arrow-right" color="#ffffff" size="28" ></u-icon>
				</view>
				<!-- <view style="margin-top:16rpx;" @click="cardInfo" v-if="account.bankCardNo">
				 	银行卡
					<u-icon name="arrow-right" color="#ffffff" size="28" ></u-icon>
				</view> -->
			</view>
		</view>
		
		<scroll-view 
			:scroll-top="detail.scrollTop" 
			scroll-y="true" 
			class="scroll-Y" 
			@scrolltolower="handleListBottom"
			@scroll="handleScroll"
		>
			<CashFlowItem
				v-for="item in detail.list"
				:key="item.id"
				:item="item"
			/>				
			
			<u-empty v-if="detail.errMsg" :text="detail.errMsg" mode="list"></u-empty>
			<view class="loadmore">
				<u-loadmore
					v-if="detail.list.length"
					:status="status"
					:load-text="loadText"
				/>
			</view>
		</scroll-view>
		
		<!-- <view class="buttom-disabled-btn" @click="cash">
		  <button>提现</button>
		</view> -->
	</view>
</template>

<script>
import CashFlowItem from './CashFlowItem.vue'

export default {
	components: {
		CashFlowItem,
	},
	
	props: {
		detail: {
			type: Object,
			required: true,
		},
		
		account: {
			type: Object,
			required: true,
		},
	},
	
	data() {
		return {
			status: 'loading',
			loadText: {
				loadmore: '轻轻上拉',
				loading: '努力加载中',
				nomore: '实在没有了'
			},
			page: 1,
			totalPages: 0,
		}
	},
	
	watch: {
		detail: {
			handler(val) {
				this.totalPages = val.totalPages
				if(this.page >= val.totalPages) {
					this.status = 'nomore'
				}
			},
			deep: true,
			immediate: true,
		}
	},
	
	mounted() {
		this.status = this.detail.status
	},
	
	methods: {
		handleListBottom() {
			if(this.page >= this.totalPages) {
				this.status = 'nomore'
				return
			}
			this.status = 'loading'
			++this.page
			
			this.$emit('search', this.page)
		},
		
		handleScroll(e) {
			//this.$emit('scroll', e.detail.scrollTop)
		},
		
		bindBankCard() {
			uni.navigateTo({
			 	url: `/pagesOrder/pay/bindcard?type=2`
			})
		},
		
		goRechargePage() {
			//if (this.account.bankCardNo) {
				uni.navigateTo({
					url: `/pagesOrder/pay/recharge?type=1`
				})
			// } else {
			// 	this.bindBankCard()
			// }
		},
		
		cash() {
			if (this.account.bankCardNo) {
				uni.navigateTo({
					url: `/pagesOrder/pay/cashMoney?type=2&totalMoney=${this.account.balance}`
				})
			} else {
				this.bindBankCard()
			}
		},
		
		cardInfo() {
			uni.navigateTo({
				url: `/pagesOrder/pay/cardinfo?bankAccountId=${this.account.bankCardNo}&bankName=${this.account.bankName}&type=2`,
			})
		},
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";
@import "~@/styles/mixin.scss";

.wrap {
	height: 100%;
	display: flex;
	flex-direction: column;
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 40rpx;
		padding: 0 32rpx;
		width: 100%;
		height: 200rpx;
		background: #31C37B;
		color: #FFFFFF;
		.title {
			height: 48rpx;
			font-size: 28rpx;
			line-height: 48rpx;
			color: #FFFFFF;
		}
		.price-wrap {
			height: 72rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #FFFFFF;
			.price {
				font-size: 52rpx;
			}
			.right {
				font-size: 28rpx;
			}
		}
	}
	.scroll-Y {
		height: 0;
		flex: 1;
	}
}
</style>