<template>
	<view class="custom-order-btn-wrap" @click="goCustomOrderPage">
		<view class="custom-order-btn" :animation="animationData">
			<image
				style="width:100%;height:100%;"
				:src="showTopCustomBtn ? 'https://image.51cheyaoshi.com/xcx/app/static/home/custom-order-top-bg.png' : 'https://image.51cheyaoshi.com/xcx/app/static/home/custom-order-bg.png'"
			/>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		showTopCustomBtn: {
			type: Boolean,
			required: false,
		},
	},
	
	data() {
		return {
			animation: null,
			animationData: {},
			styleObj: {
				height: '198rpx',
			},
			topStyleObj: {
				height: '104rpx',
			},
		}
	},
	
	watch: {
		showTopCustomBtn: {
			handler(val) {
				if (this.animation) {
					this.handleChange()
				}
			},
			immediate: true
		}
	},
	
	mounted() {
		const animation = uni.createAnimation({
				// 动画时间
				duration: 150,
				// 动画速度
				timingFunction: 'linear',
		})
		// 存在return字段中
		this.animation = animation
		this.handleChange()
	},
	
	methods: {
		goCustomOrderPage() {
			this.$u.route('/pages/custom/custom-order')
		},
		
		handleChange() {
			if (this.showTopCustomBtn) {
				this.animation.height('104rpx').step()
				this.animationData = this.animation.export()
			} else {
				// 定义动画内容
				this.animation.height('198rpx').step()
				// 导出动画数据传递给data层
				this.animationData = this.animation.export()
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.custom-order-btn-wrap {
	margin: 16px 0;
}

.detail-arrow {
	width: 16rpx;
	height: 16rpx;
}

.custom-order-btn {
	width: 100%;
	height: 198rpx;
	border-radius: 24rpx;
	background: linear-gradient(91deg, rgba(10,15,45,0.87) -24%, rgba(14,19,49,0.90) 98%);
	display: flex;
	justify-content: space-between;
	align-items: center;
	.left {
		.text1 {
			height: 50rpx;
			font-size: 17px;
			line-height: 50rpx;
			color: #FFFFFF;
			font-weight: 600;
		}
		.text2 {
			margin-top: 4px;
			height: 36rpx;
			font-size: 12px;
			line-height: 36rpx;
			color: rgba(255, 255, 255, 0.5);
		}
	}
	.right {
		display: flex;
		align-items: center;
		.text {
			height: 20px;
			font-size: 16px;
			line-height: 20px;
			color: #FFFFFF;
			margin-right: 4px;
		}
	}
}

.custom-order-top-btn {
	width: 100%;
	height: 104rpx;
}
</style>