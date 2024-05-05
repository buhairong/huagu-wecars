<template>
	<view class="page">
		<image
			style="width:100%;height:566rpx;"
			:src="url"
			mode="aspectFill"
			@click="previewImage"
		/>
		
		<view class="remark">{{remark}}</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			url: '',
			remark: '',
		}
	},
	
	onLoad(options) {
		this.url = options.url
		this.remark = options.remark
		
		uni.setNavigationBarTitle({
			title: options.title
		})
	},
	
	methods: {
		previewImage() {
			const imgList = [this.url]
			
			uni.previewImage({
				urls: imgList,
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.page {
	width: 100vw;
	min-height: 100vh;
	background-color: #000;
	padding-top: 175px;
	padding-bottom: 40px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	.remark {
		padding: 0 40rpx;
		font-size: 12px;
		line-height: 36rpx;
		color: #F2F3F5;
	}
}
</style>