<template>
	<view class="wrap">
		<view>
			<view class="title-wrap">
				<u-section
					:title="`修改增配项（共计: ${formatThousandNumber(totalConfigMoney)}元）`" 
					line-color="#1D2129"
					font-size="34"
					color="#0A0F2D"
					:right="false"
				></u-section>
				<view class="icon-box" @click="delAllConfig">
					<image
						class="img"
						src="https://image.51cheyaoshi.com/xcx/app/static/home/delete-icon.png"
						mode="widthFix"
					/>
					全部删除
				</view>
			</view>
			
			<view class="list">
				<view class="list-item" v-for="(item, index) in configList" :key="index">
					<view class="label">{{item.detailName}}</view>
					<view class="right">
						<view class="price">{{item.money | $numFormat}} 元</view>
						<!-- <u-switch
							v-model="item.hasCheck"
							active-color="rgba(10, 235, 125, 0.6)" 
							inactive-color="#B6B6B6"
							:active-value="1" 
							:inactive-value="0"
							size="24"
							@change="change"
						></u-switch> -->
						<switch 
							:checked="item.hasCheck === 1" 
							color="rgba(10, 235, 125, 0.6)" 
							style="transform:scale(0.5);origin:left top;" 
							@change="(e) => change(index, e)"
						/>
					</view>
				</view>
			</view>	
		</view>
		
		<view class="btn" @click="save">保存</view>
	</view>
</template>

<script>
import { formatThousandNumber } from '@/utils/index.js'

export default {
	data() {
		return {
			orderId: '',
			configList: [],
		}
	},
	
	computed: {
		totalConfigMoney() {
			let res = 0
			
			if (this.configList.length) {
				res = this.configList.filter(item => item.hasCheck === 1).reduce((sum, cur) => {
					return sum + cur.money
				}, 0)
			}
			
			return res
		},
	},
	
	onLoad(options) {
		this.orderId = options.orderId
		this.configList = JSON.parse(options.configList) 
		
	},
	
	methods: {
		change(index, e) {
			this.configList[index].hasCheck = e.detail.value ? 1 : 0
		},
		
		formatThousandNumber(num) {
			if (num) {
				return formatThousandNumber(num)
			}
			return 0
		},
		
		delAllConfig() {
			uni.showModal({
				title: '提示',
				content: '确定要删除所有增配项吗？',
				success: (res) => {
					if (res.confirm) {
						this.configList = []
					}
				}
			})
		},
		
		save() {
			uni.showLoading({
				title: '保存中',
				icon: 'none'
			})
			
			const params = {
				userCarSubscribeId: this.orderId,
				otherConfigVo: [
					{
						details: this.configList,
						function: ''
					}
				],
			}
			
			this.$getRequest(this.$url.saveOtherConfig, 'POST', params).then(res => {
				if (res.code === 0) {
					uni.navigateBack({
						delta: 1
					})
				}
			}).finally(() => {
				uni.hideLoading()
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	width: 100vw;
	height: 100vh;
	padding: 40rpx 40rpx 80rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	.title-wrap {
		display: flex;
		align-items: center;
		justify-content: space-between;
		.icon-box {
			display: flex;
			align-items: center;
			.img {
				width: 32rpx;
				margin-right: 8rpx;
			}
		}
	}
	
	.list {
		padding-top: 32rpx;
		.list-item {
			margin-bottom: 12px;
			font-size: 28rpx;
			line-height: 40rpx;
			color: #000000;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.right {
				display: flex;
				align-items: center;
				.price {
					padding-left: 24rpx;
				}
			}
		}
	}
	
	.btn {
		width: 100%;
		height: 116rpx;
		border-radius: 16rpx;
		background: #0A0F2D;
		color: #FFFFFF;
		font-size: 34rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
</style>