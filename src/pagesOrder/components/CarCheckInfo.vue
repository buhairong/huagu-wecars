<template>
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
								<view class="img-box1" v-if="firstMenu.url">
									<image
										:src="firstMenu.url"
										mode="widthFix"
										@click.stop="preview(0, [firstMenu.url])"
									/>
								</view>
							</view>
						</view>
					</view>
				</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		validJSON1: {
			type: Array,
			default: () => []
		},
	},
	
	data(){
		return {
			validJSON: [],
		}
	},
	
	mounted() {
		this.validJSON = this.validJSON1
	},
	
	methods: {
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
	}
}
</script>

<style lang="scss" scoped>
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
		.img-box1 {
			width: 100%;
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
</style>