<template>
	<view class="page">
		<view>
			<view class="tabs">
				<view 
					v-for="tab in listTabs"
					:key="tab.id"
					class="tab"
					:class="{'tab-active': tab.id === current}"
					@click="change(tab.id)"
				>
					<view class="line" v-if="tab.id === current"></view>
					{{tab.name}}
				</view>
			</view>
			
			<view class="pic-list">
				<view class="pic-wrap" v-for="(item, index) in picList" :key="index">
					<image
						class="img"
						:src="item"
						mode="aspectFill"
						@click="preview(index, picList)"
					/>
				</view>
			</view>
			
			<CarCheckInfo :validJSON1="validJSON" v-if="current === 1" />
			<CarCheckInfo :validJSON1="validJSON1" v-else />
			
			
		</view>
		
		<view class="bottom" v-if="operator === 'edit'">
			<button @click="handlerSubmit">签署用车规则确认书</button>
		</view>
		
		
	</view>
</template>

<script>
import CarCheckInfo from '../../components/CarCheckInfo.vue'

export default {
	components: {
		CarCheckInfo,
	},
	
	data() {
		return {
			orderId: '',
			picList: [],
			validJSON: [],
			validJSON1: [],
			idNum: '',
			username: '',
			operator: '',
			listTabs: [
				{ id: 1, name: '取车', },
				{ id: 2, name: '还车', },
			],
			current: 1,
		}
	},
	
	onLoad(options) {
		this.orderId = options.orderId
		this.idNum = options.idNum
		this.username = options.username
		this.operator = options.operator
		
		this.init()
	},
	
	methods: {
		async init(){
			this.picList = uni.getStorageSync('deliveryCarPicsMap')
			const deliveryCheckInfo = uni.getStorageSync('deliveryCheckInfo')
			this.validJSON = JSON.parse(deliveryCheckInfo)
			this.closeAll('validJSON')
			
			const returnedDeliveryCheckInfo = uni.getStorageSync('returnedDeliveryCheckInfo')
			this.validJSON1 = JSON.parse(returnedDeliveryCheckInfo)
			this.closeAll('validJSON1')
		},
		
		closeAll(validJSON) {
			this[validJSON].map(first => {
				first.isExpand = false
				if (first.children) {
					first.children.map(second => {
						second.isExpand = false
						
						return second
					})
				}
				
				return first
			})
		},
		
		change(id) {
			this.current = id
		},
		
		async handlerSubmit() {
			const contactInfo = {
				 id: this.orderId,
			}
			
			uni.setStorageSync('contactInfo', contactInfo)
			uni.navigateTo({
				url: `/pagesOrder/identity/face-identity-tip?from=rentalOrderContact&idNum=${this.idNum}&username=${this.username}`
			})
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";	

::v-deep .u-checkbox .u-checkbox__label {
	margin-right: 0;
}

.page {
	width: 100vw;
	min-height: 100vh;
	padding: 16px 32rpx 40px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	
	.tabs {
		margin-bottom: 40rpx;
		display: flex;
		align-items: center;
		.tab {
			margin-right: 32rpx;
			display: flex;
			align-items: center;
			font-size: 14px;
			color: rgba(10, 15, 45, 0.8);
			height: 50rpx;
			line-height: 50rpx;
			&.tab-active {
				font-size: 17px;
				font-weight: 600;
				color: #0A0F2D;
			}
			.line {
				transform: translateY(-2rpx) rotate(114deg) skew(20deg);
				background: #0AEB7D;
				width: 32rpx;
				height: 8rpx;
			}
		}
	}
	
	.pic-list {
		width: 100%;
		display: flex;
		justify-content: space-between;
		.pic-wrap {
			width: 23%;
			.img {
				width: 100%;
				height: 120rpx;
			}
		}
	}
	
	.bottom {
		margin-top: 20px;
		width: 100%;
		button {
			margin-top: 8px;
			width: 100%;
			height: 116rpx;
			border-radius: 16rpx;
			background: #0A0F2D;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 17px;
			color: #FFFFFF;
		}
		
		button::after {
			border: none;
		}
		
		button[aria-disabled="true"] {
			background: rgba(10, 15, 45, 0.3);
		}
	}
}

.popup {
	::v-deep .u-close {
		margin-top: 8px;
	}
}

.popup-wrap {
	padding: 22px 40rpx 20px;
	position: relative;
	.sub-title {
		margin-top: 20px;
		height: 42rpx;
		font-size: 14px;
		line-height: 42rpx;
		color: rgba(0, 0, 0, 0.9);
	}
	.container {
		font-size: 14px;
		line-height: 34rpx;
		color: rgba(10, 15, 45, 0.8);
	}
}
</style>

<!-- {"exceptionDesc":"aaaa",
			"level":2,
			"requireImg":true,
			"type":"appearance",
			"isHas":1,
			"rightText":"",
			"isExpand":false,
			"statusList":[{"id":1,"label":"核验通过"},{"id":2,"label":"存在问题"}],
			"name":"引擎盖","id":11,"imageType":2,"status":2,"imgList":["https://image.51cheyaoshi.com//2023/06/02/f021e200761048249facc7c0a64449f2.jpg","https://image.51cheyaoshi.com//2023/06/02/fb6a79a05c6c40c099af35ad7b9ae6ce.jpg","https://image.51cheyaoshi.com//2023/06/02/e5a29ba3202f41c78e49a20a82e646b5.jpg","https://image.51cheyaoshi.com//2023/06/02/daf5091f1e6f4dd88d8bb04626613585.jpg"],
			"isComplete":false} -->
			