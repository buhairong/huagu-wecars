<template>
	<view class="page-wrap1" v-if="detail">
		订单详情
	</view>
</template>

<script>
	import { formatTenThousandNumber, formatThousandNumber } from '@/utils/index.js'
	
	export default {
		data() {
			return {
				id: '',
				userId: '',
				detail: null,
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
				this.$getRequest(this.$url.getMemberUserRentalOrderDetail, "GET", {
				  id: this.id,
				}).then(res => {
					uni.hideLoading()
					this.detail = res.data
				}).catch(() => {
					uni.hideLoading()
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
@import "~@/styles/common.scss";

</style>
