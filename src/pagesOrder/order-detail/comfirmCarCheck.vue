<template>
	<view class="page">
		<view>
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
			
			<view class="vaild-json-wrap">
				<view class="first-menu" v-for="(firstMenu, index1) in validJSON" :key="index1">
						<view class="title-wrap">
							<view class="left">{{firstMenu.name}}</view>
							<view class="right" @click="toggleExpand(index1)">
								<view >查看</view>
								<view class="icon-wrap">
									<u-icon :name="firstMenu.isExpand ? 'arrow-up' : 'arrow-down' " color="rgba(0, 0, 0, 0.9)" size="32"></u-icon>
								</view>
							</view>
						</view>
						<view class="container-wrap">
							<view class="container" v-if="firstMenu.isExpand">
								<view v-if="firstMenu.children">
									<view class="second-menu" v-for="(secondMenu, index2) in firstMenu.children" :key="index2">
											<view class="second-title-wrap">
												<view class="left">{{secondMenu.name}}</view>
												<view class="right" :style="{color: secondMenu.status === 2 ? '#FF0000' : 'rgba(10, 15, 45, 0.8)'}">
													{{ firstMenu.type === 'parts' ? secondMenu.status === 1 ? '有' : '无' :  secondMenu.status === 1 ? '正常' : '异常'}}
													<!-- <view class="icon-wrap" v-if="firstMenu.type === 'tyre' || secondMenu.status === 2">
														<u-icon :name="secondMenu.isExpand ? 'arrow-up' : 'arrow-down' " color="rgba(0, 0, 0, 0.9)" size="32" v-if="firstMenu.type !== 'parts'"></u-icon>
													</view> -->
												</view>
											</view>
											<view class="second-container">
												<view class="tyre" v-if="secondMenu.type === 'tyre'">
													<view class="left">轮胎信息</view>
													<view class="right">
														<view class="brand">{{secondMenu.brand}} {{secondMenu.size}}</view>
													</view>
												</view>
												
												<view class="check-car-exception">
													<view class="exception" v-if="secondMenu.status === 2">
														<template v-if="secondMenu.children">
															<view v-for="(level3, index3) in secondMenu.children.filter(item => item.exceptionDesc)" :key="index3">
																<view class="subtitle">{{level3.name}}异常</view>
																<view class="img-container">
																	<view class="img-wrap" v-for="(item, index5) in level3.imgList" :key="index5">
																		<image
																			style="width:100%;height:100%;"
																			:src="item"
																			mode="aspectFill"
																			@click.stop="() => preview(index5, level3.imgList)"
																		/>
																	</view>
																</view>
																<view class="exception-desc">
																	<view class="desc-title">异常处说明</view>
																	{{level3.exceptionDesc}}
																</view>
															</view>
														</template>
														<template v-else>
															<view class="img-container">
																<view class="img-wrap" v-for="(item, index5) in secondMenu.imgList" :key="index5">
																	<image
																		style="width:100%;height:100%;"
																		:src="item"
																		mode="aspectFill"
																		@click.stop="() => preview(index5, secondMenu.imgList)"
																	/>
																</view>
															</view>
															<view class="exception-desc">
																<view class="desc-title">异常处说明</view>
																{{secondMenu.exceptionDesc}}
															</view>
														</template>
													</view>
												</view>
											</view>
									</view>
								</view>
								<view v-else>
									<view v-if="firstMenu.imageType === 1" style="width: 100%;">
										<view class="img-box" style="width: 100%;" v-if="firstMenu.url">
											<image
												style="width:100%;"
												:src="firstMenu.url"
												mode="widthFix"
												@click.stop="preview(0, [firstMenu.url])"
											/>
										</view>
									</view>
									<!-- <view class="img-container" v-else>
										<view class="img-wrap" v-for="(item, index3) in firstMenu.imgList" :key="index3">
											<image
												style="width:100%;height:100%;"
												:src="item"
												@click.stop="preview(index3, firstMenu.imgList)"
											/>
										</view>
									</view> -->
								</view>
							</view>
						</view>
					
					
				</view>
			</view>
		</view>
		
		<view class="bottom" v-if="operator === 'edit'">
			<button @click="handlerSubmit">签署用车规则确认书</button>
		</view>
		
		<u-popup 
			class="popup"
			v-model="showPopup"
			border-radius="24" 
			mode="bottom" 
			height="924rpx" 
			:close-icon-size="40"
			:safe-area-inset-bottom="true"
			:closeable="true"
			close-icon-color="rgba(10, 15, 45, 0.8)"
		>
			<view class="popup-wrap">
				<view class="title">用车规则确认书（电子交接单）</view>
				<view class="sub-title">请仔细阅读以下协议：</view>
				<view class="container"></view>
				<view class="btn"></view>
			</view>
		</u-popup>
		
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderId: '',
			checked: false,
			showPopup: false,
			picList: [],
			validJSON: [],
			reviewType: ['vin', 'parts', 'pickup'],
			idNum: '',
			username: '',
			operator: '',
		}
	},
	
	onLoad(options) {
		this.orderId = options.orderId
		this.idNum = options.idNum
		this.username = options.username
		this.operator = options.operator
		
		this.selectCarPicsList()
	},
	
	methods: {
		async selectCarPicsList(){
			const params = {
				 id: this.orderId,
			}
			const result = await this.$getRequest(this.$url.selectCarPicsList, 'GET', params)
			if(result.code == 0){
				this.picList = result.data.deliveryCarPicList.map(item => {
					return item.carPics[0].url
				})
				this.validJSON = JSON.parse(result.data.checkInfo)
				this.closeAll()
			}
		},
		
		closeAll() {
			this.validJSON.map(first => {
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
		
		toggleExpand(index) {
			this.validJSON[index].isExpand = !this.validJSON[index].isExpand
		},
		
		toggleSecondExpand(index1, index2) {
			this.validJSON[index1].children[index2].isExpand = !this.validJSON[index1].children[index2].isExpand
		},
		
		preview(current, urls) {
			uni.previewImage({
				current,
				urls,
			})
		},
		
		async handlerSubmit() {
			const contactInfo = {
				 id: this.orderId,
			}
			
			uni.setStorageSync('contactInfo', contactInfo)
			uni.navigateTo({
				url: `/pagesOrder/identity/face-identity-tip?from=contact&idNum=${this.idNum}&username=${this.username}`
			})
			
			//this.esign()
			
		},
		
		async esign(){
			let params={
					redirectUrl: `/pagesOrder/order-detail/contact?orderId==${this.orderId}`,
					orderId: this.orderId,
			}
			const result = await this.$getRequest(this.$url.esign1, 'POST', params)
			if(result.code == 0){
				uni.setStorageSync('url', result.data.contractUrl || result.data)
				uni.navigateTo({
					url: `/pages/home/profile/wxbview?from=contact&orderId=${this.orderId}`
				})
			}
		},
		
		openPopup() {
			//this.showPopup = true
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
	
	.vaild-json-wrap {
		padding-top: 16px;
		.first-menu {
			padding-top: 8px;
			.subtitle {
				font-size: 16px;
				color: #FF0000;
				margin: 24rpx 0;
			}
			.title-wrap {
				padding: 0 40rpx;
				width: 100%;
				height: 76rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.left {
					font-size: 16px;
					color: #1D2129;
				}
				.right {
					display: flex;
					align-items: center;
					font-size: 15px;
					color: rgba(10, 15, 45, 0.8);
				}
			}
			
			.container-wrap {
				margin: 0 40rpx;
				padding-bottom: 8px;
				border-bottom: 2rpx solid #F2F3F5; 
			}
			.container {
				margin-top: 10px;
			}
			.img-container {
				display: flex;
				flex-wrap: wrap;
			}
			.img-box {
				width: 48%;
				height: 240rpx;
				border-radius: 8rpx;
			}
			.img-wrap {
				margin-right: 2%;
				margin-bottom: 16px;
				width: 32%;
				height: 150rpx;
				border-radius: 8rpx;
				position: relative;
			}
			.img-wrap:nth-child(3n) {
				margin-right: 0;
			}
		}
		
		.icon-wrap {
			height: 100%;
			display: flex;
			align-items: center;
			margin-left: 8rpx;
		}
		
		.second-menu {
			margin-top: 20px;
			.second-title-wrap {
				padding-left: 24rpx;
				height: 44rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.left {
					font-size: 15px;
					color: #0A0F2D;
				}
				.right {
					display: flex;
					align-items: center;
					font-size: 15px;
					color: #1D2129;
				}
			}
			.tyre {
				margin-top: 16px;
				height: 72rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 2rpx solid #F2F3F5;
				.left {
					font-size: 15px;
					color: rgba(10, 15, 45, 0.8);
				}
				.right {
					height: 100%;
					display: flex;
					align-items: center;
					.brand {
						font-size: 15px;
						color: rgba(10, 15, 45, 0.8);
					}
					.placeholder {
						font-size: 15px;
						color: #A4AEBB;
					}
				}
			}
			
			.parts {
				margin-top: 16px;
			}
			
			.check-car-exception {
				margin-top: 16px;
				.exception {
					margin-top: 16px;
					.exception-desc {
						padding: 16px 40rpx;
						width: 100%;
						border-radius: 8rpx;
						background: #F7F8FA;
						.desc-title {
							margin-bottom: 12px;
							height: 44rpx;
							font-size: 15px;
							line-height: 44rpx;
							color: rgba(10, 15, 45, 0.8);
						}
					}
				}
			}
		}
		
		.second-menu:first-child {
			margin-top: 0;
		}
		
		.second-container {
			padding-left: 48rpx;
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
			