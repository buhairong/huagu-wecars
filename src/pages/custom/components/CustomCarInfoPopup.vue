<template>
	<u-popup border-radius="14" closeable=true mode="bottom" v-model="show" @close="close">
		<view class="popupTitle">{{brandName ? brandName : '品牌'}}</view>
		<view class="popupInfo">
			<view class="item">
				<view class="item-title">品牌</view>
				<view class="item-content">
					<u-input 
						v-model="carBrandName"
						placeholder="请输入您要订阅的品牌名称"
						cursor-spacing="180"
					/>
				</view>
			</view>
			
			<view class="item">
				<view class="item-title">车型</view>
				<view class="item-content">
					<u-input 
						v-model="carProduct"
						placeholder="请输入您要订阅的车型名称"
						cursor-spacing="124"
					/>
				</view>
			</view>
			
			<view class="btn-group">
				<view class="btn" @click="close">取消</view>
				<view class="btn save-btn" @click="handleSubmit">确定</view>
			</view>
		</view>
	</u-popup>
</template>

<script>
export default {
	props: {
		show: {
			type: Boolean,
			required: true,
		},
		
		brandName: {
			type: String,
			default: '',
		},
		
		showBrandName: {
			type: Boolean,
			default: true,
		},
		
		delta: {
			type: Number,
			default: 1,
		},
		
		customCarInfoPopupType: { //1.品牌 2.车型 
			type: Number,
			default: 1, 
		},
	},
	
	data() {
		return {
			carBrandName: '',
			carProduct: ''
		}
	},
	
	mounted() {
		this.carBrandName = this.brandName
	},
	
	methods: {
		handleSubmit() {
			if(!this.carBrandName) {
				uni.showToast({
					title: '请输入您要订阅的品牌名称',
					duration: 2000,
					icon: 'none',
				})
				return
			}
			
			if(!this.carProduct) {
				uni.showToast({
					title: '请输入您要订阅的车型名称',
					duration: 2000,
					icon: 'none',
				})
				return
			}
			
			uni.setStorageSync('customCarInfo', {
			    carBrand: this.carBrandName,
			    carProduct: this.carProduct,
					carType: '',
			})
			
			uni.navigateBack({
				delta: this.delta
			})
		},
		
		close() {
			this.$emit('update:show', false)
		},
	},
}
</script>

<style lang="scss" scoped>
.popupTitle {
	font-style: 15px;
	text-align: center;
	padding: 20px 0 0px 0;
}

.popupInfo {
	padding: 30px 24px;
	.item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 56px;
		box-shadow: inset 0px -1px 0px 0px rgba(10, 15, 45, 0.04);
		.item-title {
			font-size: 15px;
			color: #0A0F2D;
		}
		.item-content {
			padding-left: 20rpx;
			width: 0;
			flex: 1;
			::v-deep input {
				text-align: right;
			}
		}
	}
	
	.btn-group {
		margin-top: 60px;
		display: flex;
		justify-content: center;
		.btn {
			width: 216rpx;
			height: 80rpx;
			border-radius: 8rpx;
			background: rgba(10, 15, 45, 0.04);
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 17px;
			color: rgba(10, 15, 45, 0.8);
		}
		.save-btn {
			margin-left: 32rpx;
			background: #0A0F2D;
			color: #FFFFFF;
		}
	}
}
</style>