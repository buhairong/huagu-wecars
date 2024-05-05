<template>
	<view class="wrap">
		<view class="item" v-for="(item, index) in list" :key="index" @click="goWebview(item)">
			<view>{{item.contractName}}</view>
			<u-icon
				name="arrow-right" 
				color="rgba(0, 0, 0, 0.9)" 
				size="32"
			></u-icon>
		</view>
		
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: [],
		}
	},
	
	onLoad(options) {
		const value = uni.getStorageSync('ElectronicContract')
		if (value) {
			this.list = value
		}
	},
	
	methods: {
		goWebview(item) {
			uni.setStorageSync('url', item.contractUrl)
			uni.navigateTo({
				url: `/pages/home/profile/wxbview`
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	padding: 40px 40rpx;
	.item {
		height: 108rpx;
		box-shadow: inset 0px -1px 0px 0px rgba(10, 15, 45, 0.04);
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 15px;
		color: #0A0F2D;
	}
}
</style>