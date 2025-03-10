<template>
	<view class="page-wrap1">
		<!-- <view class="tip">四大主题为您定制高端商务活动</view> -->
		
		<view class="list">
			<view v-for="item in BUSINESS_ACTIVITY_LIST" :key="item.id" class="card" @click="handleChange(item)">
			</view>
		</view>
		
		<u-empty v-if="list.length == 0" text="暂无企业" mode="list" margin-top="40"></u-empty>
	</view>
</template>

<script>
	import { BUSINESS_ACTIVITY_LIST } from "@/constants"
	
	export default {
		data() {
			return {
				BUSINESS_ACTIVITY_LIST,
				list: [],
			}
		},
		
		onShow() {
			this.getList()
		},
		
		methods: {
			getList() {
				uni.showLoading({
				  title: '加载中'
				});
				this.$getRequest(this.$url.getCompanyList, "GET", {
				  userId: this.userId,
				  page: 1,
				  limit: 100,
				}).then(res => {
					uni.hideLoading()
					this.list = res.data
				}).catch(() => {
					uni.hideLoading()
				})
			},
			
			handleChange(item) {
				// uni.navigateTo({
				// 	url: `/pagesOrder/rental/order/rentalOrderDetail?id=${orderRes.data.id}&userId=${this.userId}`
				// })
			},
		}
	}
</script>

<style lang="scss" scoped>
.page-wrap1 {
	.tip {
		font-size: 28rpx;
		line-height: 44rpx;
		color: rgba(78, 89, 105, 0.6);
	}
	.list {
		margin-top: 32rpx;
	}
}
</style>
