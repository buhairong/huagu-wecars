<template>
  <view>
	  <web-view :src="url" @message="handleGetMessage"></web-view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
				url:'',
				orderId: '',
				from: '',
      }
    },
		
		onLoad(options) {
			this.orderId = options.orderId
			uni.setStorageSync('orderId', this.orderId)
			this.from = options.from
			uni.setStorageSync('signfrom', this.from)
			let url = uni.getStorageSync('url')
			if (url) {
				this.url = url
			}
		},
		
		methods:{
			async handleGetMessage(e){
				console.log('handleGetMessage',e)
				if (e.detail.data[0].result === 'success') {
					if(this.from === 'sign'){
						uni.reLaunch({
							url: `/pagesOrder/order-detail/contact?orderId=${this.orderId}`,
						})
					} else if(this.from === 'contact'){
						uni.reLaunch({
							url: `/pagesOrder/order-detail/order-detail?orderId=${this.orderId}`,
						})
					} else if(this.from === 'rentalOrderSign'){
						uni.reLaunch({
							url: `/pagesOrder/rental/order/detail?orderId=${this.orderId}`,
						})
					} else if(this.from === 'rentalOrderContact'){
						uni.reLaunch({
							url: `/pagesOrder/rental/order/detail?orderId=${this.orderId}`,
						})
					}
				}
			},
		},
  }
</script>

<style lang="scss" scoped>
</style>
