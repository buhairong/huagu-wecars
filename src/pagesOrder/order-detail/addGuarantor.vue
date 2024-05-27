<template>
	<view class="page">
		<AddGuarantor
			@save="save"
		/>
	</view>
</template>

<script>
import AddGuarantor from '../depositFree/components/AddGuarantor.vue'

export default {
	components: {
		AddGuarantor,
	},
	
	
	data() {
		return {
			userId: '',
			orderId: '',
		}
	},
	
	onLoad(options) {
		this.userId = options.userId
		this.orderId = options.orderId
	},
	
	onShow() {
		
	},
	
	methods: {
		save(data) {
			const params = {
				userId: this.userId,
				mobile: data.guarantorMobile,
				name: data.guarantorName,
				orderId: this.orderId
			}
			
			this.$getRequest(this.$url.addGuarantor, 'GET', params).then(res => {
				uni.hideLoading()
				if (res.code === 0) {
					uni.showToast({
						title: '保存成功',
						duration: 2000,
						icon: 'none'
					})
					
					uni.navigateBack({
						delta: 1
					})
				} else {
					uni.showToast({
						title: '保存失败',
						duration: 2000,
						icon: 'none'
					})
				}
			}).catch(err => {
				uni.hideLoading()
				uni.showToast({
					title: '保存失败',
					duration: 2000,
					icon: 'none'
				})
			})
			
			
		}
	}
}
</script>

<style lang="scss" scoped>
.page {
	padding: 40rpx 32rpx 0;
}
</style>
