<template>
	<view>
		<view class="title">选择你的职业</view>
		
		<view class="list">
			<view 
				v-for="item in OCCUPATION_LIST"
				:key="item.value"
				class="list-item"
				:class="{active: item.value === selectItem.value}"
				@click="changeOccupation(item)"
			>
				<view class="label">{{item.label}}</view>
				<image
					v-if="item.value === selectItem.value"
					class="checked-icon"
					src="https://image.51cheyaoshi.com/xcx/merchant/static/home/success-icon.png"
				/>
			</view>
		</view>
		
		<view class="fixed-buttom-disabled-btn">
			<button @click="next">下一步</button>
		</view>
	</view>
</template>

<script>
import { OCCUPATION_LIST } from "@/constants"

export default {
	data(){
		return {
			OCCUPATION_LIST,
			selectItem: {},
		}
	},
	
	methods: {
		changeOccupation(item) {
			this.selectItem = item
		},
		
		next() {
			if (!this.selectItem.value) {
				uni.showToast({
						title: '请选择你的职业',
						duration: 2000,
						icon: 'none'
				});
				return 
			}
			this.$emit('nextOccupationStep', this.selectItem)
		},
	}
}
</script>

<style lang="scss" scoped>
.title {
	height: 72rpx;
	font-size: 56rpx;
	font-weight: 500;
	line-height: 72rpx;
	color: #0A0F2D;
}

.list {
	padding: 24rpx 44rpx 80rpx;
	.list-item {
		height: 136rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 2rpx solid rgba(216, 216, 216, 0.3);
		color: rgba(10, 15, 45, 0.7);
		font-size: 32rpx;
		&:last-child {
			border-bottom: none;
		}
		.checked-icon {
			width: 40rpx;
			height: 40rpx;
		}
	}
}

.fixed-buttom-disabled-btn {
	button {
		background: #0A0F2D;
	}
}
</style>