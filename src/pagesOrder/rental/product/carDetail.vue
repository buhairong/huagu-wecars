<template>
	<view class="wrap" v-if="detail">
		123
	</view>
</template>

<script>

export default {
	components: {
	  
	},
	
	data() {
		return {
			id: '',
			detail: null,
		}
	},
	
	onLoad(option) {
		this.id = option.id
	},
	
	onShow() {
		this.getDetail()
	},
	
	methods: {
		getDetail() {
			uni.showLoading({
			  title: '加载中'
			});
			this.$getRequest(this.$url.getMemberCarRentalDetail, "GET", {
			  id: this.id,
			}).then(res => {
				uni.hideLoading()
				this.detail = res.data
			}).catch(() => {
				uni.hideLoading()
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	
}
</style>