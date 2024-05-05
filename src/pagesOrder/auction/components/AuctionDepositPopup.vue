<template>
	<u-popup
		v-model="showPopup" 
		mode="bottom"
		border-radius="12"
		closeable="true"
		close-icon-color="#0A0F2D"
		@close="close"
	>
		<view class="popup-wrap">
			<view class="title">保证金</view>
			<view class="container">
				参与出价前须缴纳保证金，交易完成后可申请退还保证金。若在竞价成功后发生交易纠纷，将根据实际情况追究违约责任，并采取保证金作为违约金赔偿的方式。
			</view>
		</view>
	</u-popup>
</template>

<script>
export default {
	props: {
		showPopup: {
			type: Boolean,
			default: false,
		},
	},
	
	data(){
		return {
			
		}
	},
	
	mounted() {
		
	},
	
	methods: {
		close() {
			this.$emit('update:showPopup', false)
		},
	}
}
</script>

<style lang="scss" scoped>
.popup-wrap {
	padding: 64rpx 64rpx 120rpx;
	.title {
		height: 60rpx;
		font-size: 20px;
		line-height: 60rpx;
		color: #141414;
		text-align: center;
		margin-bottom: 32px;
	}
}
</style>