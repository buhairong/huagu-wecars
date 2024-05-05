<template>
	<view class="wrap">
		<view class="header">
			<view class="tabs">
				<view 
					v-for="tab in partnerRankingTabList"
					:key="tab.value"
					class="tab"
					:class="{'tab-active': tab.value == activeTab}"
					@click="change(tab)"
				>
					<view class="line" v-if="tab.value == activeTab"></view>
					{{tab.label}}
				</view>
			</view>
			<view class="rank-rule" v-if="activeTab == 2">
				{{rankMethodObj[rankMethod] || ''}}
			</view>
		</view>
		
		<view class="container">
			<scroll-view
				v-if="activeTab == 1"
				scroll-y="true" 
				class="scroll-Y"
			>
				<view>
					<view class="card" v-for="(item, index) in orderList" :key="index">
						<view class="tag" v-if="!item.markUpRatio">待加成</view>
						<view class="tag rank1tag" v-else-if="item.markUpRatio == 100">佣金翻倍</view>
						<view class="tag tag2" v-else>
							<image
								style="width: 32rpx;margin-right:8rpx;"
								src="https://image.51cheyaoshi.com/xcx/app/static/partner/red-arrow.png"
								mode="widthFix"
							/>
							{{item.markUpRatio}}%
						</view>
						<view class="card-container">
							<view class="left">
								<view class="brand">{{item.carBrand}} {{item.carType}}</view>
								<view class="product">{{item.carTypeYear}} {{item.carTypeYearProduct}}</view>
								<view class="customer">
									<view class="label">客户姓名</view>
									{{item.name}}
								</view>
							</view>
							<view class="right">
								<view class="commission-wrap">
									<view class="commission">
										<view class="unit">¥</view>
										{{(item.personCommissionAmount || item.commissionAmount) + (item.markUpMoney || 0) | $numFormat}}
									</view>
									<view class="commission-btn" v-if="item.markUpRatio">已加成</view>
									<view class="commission-btn commission-btn1" @click="handleAddition(item)" v-else>佣金加成</view>
								</view>
							</view>
						</view>
					</view>
					<u-empty v-if="orderListErrMsg" :text="orderListErrMsg" mode="list" margin-top="40"></u-empty>
				</view>
			</scroll-view>
			
			<scroll-view
				v-else
				scroll-y="true" 
				class="scroll-Y"
			>
				<view>
					<view class="card" v-for="(item, index) in rankList" :key="index">
						<view 
							class="tag"
							:class="{
								'rank1tag': index === 0,
								'rank2tag': index === 1,
								'rank3tag': index === 2,
							}"
						>
							TOP {{index+1}}
						</view>
						<view class="userinfo">
							<image
								class="avatar"
								shape="circle"
								:src="item.avatar || 'https://image.51cheyaoshi.com/xcx/app/static/carlife/worker_icon.png'"
							/>
							<view class="username">{{item.userName}}</view>
						</view>
						<view class="commission-wrap">
							<view class="label">累计加成</view>
							<view class="commission">
								<view class="unit">¥</view>
								{{item.additionMoney | $numFormat}}
							</view>
						</view>
					</view>
					<u-empty v-if="rankListErrMsg" :text="rankListErrMsg" mode="list" margin-top="40"></u-empty>
				</view>
			</scroll-view>
		</view>
		
		
		<u-popup border-radius="24" mode="center" v-model="showAdditionPopup" @close="close">
			<view class="popup-wrap">
				<view class="popup-container" v-if="currentMarkUpIndex === -1">
					<view class="popup-title">佣金加成</view>
					<view class="ratio-list" v-if="isMoveRate">
						<view 
							class="ratio-img close-ratio-list" 
							v-for="(item, index) in markUpRatioList" 
							:key="index"
							:style="[
								index === 0 ? closeRatioObj0 : '',
								index === 1 ? closeRatioObj1 : '',
								index === 2 ? closeRatioObj2 : '',
							]"
						></view>
					</view>
					<view class="ratio-list" v-else>
						<view class="ratio-img" v-for="(item, index) in markUpRatioList" :key="index" @click.stop="chooseMarkUpRatio(index)"></view>
					</view>
					<view class="popup-tip">每10单必出一次佣金翻倍奖励</view>
				</view>
				<view class="popup-container after-choose" :animation="animationData">
					<view class="popup-title">恭喜您</view>
					<view class="ratio-list">
						<view class="ratio-img ratio-img1" v-for="(item, index) in markUpRatioList" :key="index" :style="{transform: index === currentMarkUpIndex ? 'transLateY(-40rpx)' : ''}">
							<view class="rate-title" v-if="index === currentMarkUpIndex">恭喜您</view>
							<view class="rate" :class="{'active-rate': index === currentMarkUpIndex}">加成{{item}}%</view>
						</view>
					</view>
					<view class="popup-tip">本单佣金加成{{currentMarkUpRatio}}%</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import { partnerRankingTabList } from '@/constants'

export default {
	data() {
		return {
			partnerRankingTabList,
			userId: null,
			userInfo: null,
			activeTab: 1,
			rankMethod: '',
			rankMethodObj: {
				1: '榜单每周一0时更新',
				2: '榜单每月一日0时更新',
				3: '榜单每季度更新',
			},
			rankList: [],
			rankListErrMsg: '',
			orderListErrMsg: '',
			orderList: [],
			additionItem: {},
			showAdditionPopup: false,
			markUpRatioList: [],
			currentMarkUpRatio: 0,
			currentMarkUpIndex: -1,
			animation: null,
			animationData: {},
			isMoveRate: false,
			closeRatioObj0: {},
			closeRatioObj1: {},
			closeRatioObj2: {},
			timer: null,
		}
	},
	
	onLoad(options) {
		this.activeTab = options.activeTab || 1
		this.userId = options.userId
		this.rankMethod = options.rankMethod
		this.getAdditionOrderList()
		this.getAdditionRankList()
		this.getMarkUpRatioList()
	},
	
	onShow() {
		const isLogin = uni.getStorageSync('isLogin')
		if (isLogin) {
			getApp().globalData.getUserInfo((data) => {
				this.userInfo = data
			})
		}
	},
	
	onReady() {
		const animation = uni.createAnimation({
				// 动画时间
				duration: 500,
				// 动画速度
				timingFunction: 'linear',
		})
		// 存在return字段中
		this.animation = animation
	},
	
	methods: {
		clearTimer() {
			this.isMoveRate = false
			this.closeRatioObj0= {
				transform: `transLateX(0px)`,
			}
			this.closeRatioObj1= {
				transform: `transLateX(0px)`,
			}
			this.closeRatioObj2= {
				transform: `transLateX(0px)`,
			}
			this.currentMarkUpIndex = -1
			clearTimeout(this.timer)
			this.timer = null
			this.getMarkUpRatioList()
		},
		
		change(tab) {
			this.activeTab = tab.value
		},
		
		getMarkUpRatioList() {
			this.markUpRatioList = []
			for(let i = 0; i < 3; i++) {
				const num = Math.floor(Math.random() * 25) + 1
				this.markUpRatioList.push(num)
			}
			console.log('getMarkUpRatioList', this.markUpRatioList)
		},
		
		getAdditionOrderList() {
			const data = {
				userId: this.userId,
			}
			
			this.$getRequest(this.$url.getAdditionOrderList, "POST", data).then(res => {
				if (res.code === 0) {
					
					if (res.data && res.data.length) {
						this.orderList = res.data
					} else {
						this.orderListErrMsg = '暂无数据'
					}
				} else {
					this.orderListErrMsg = '暂无数据'
				}
			})
		}, 
		
		getAdditionRankList() {
			const data = {}
			
			this.$getRequest(this.$url.getAdditionRankList, "GET", data).then(res => {
				if (res.code === 0) {
					if (res.data && res.data.length) {
						this.rankList = res.data
					} else {
						this.rankListErrMsg = '暂无排行'
					}
				} else {
					this.rankListErrMsg = '暂无排行'
				}
			})
		}, 
		
		close() {
			this.showAdditionPopup = false
			this.clearTimer()
		},
		
		handleAddition(item) {
			this.isMoveRate = true
			this.additionItem = item
			this.showAdditionPopup = true
			this.$nextTick(() => {
				let leftList = []
				let disList = []
				const moveDis = [0, 0, 0]
				let count = 0
				const kinds = [
					1,  // 1 -> 2, 2 -> 3, 3 -> 1
					1,  // 1 -> 3, 2 -> 1, 3 -> 2
				]
				this.timer = setInterval(() => {
					count++
					const kind = Math.floor(Math.random()*kinds.length)
					if (count > 4) {
						this.clearTimer()
					}
					uni.createSelectorQuery().selectAll('.close-ratio-list').boundingClientRect().exec(res => {
						if (disList.length === 0) {
							disList = [res[0][2].left-res[0][1].left, res[0][2].left-res[0][0].left]
							leftList = [Math.ceil(res[0][0].left)+50, Math.floor(res[0][2].left)-50]
						}
						
						for(let i = 0; i < 3; i++) {
							if (kind === 0) {
								if (res[0][i].left < leftList[0]) {
									moveDis[i] = moveDis[i] + disList[0]
									this['closeRatioObj'+i]= {
										transform: `transLateX(${moveDis[i]}px)`,
									}
								} else if (res[0][i].left > leftList[1]) {
									moveDis[i] = moveDis[i] - disList[1]
									this['closeRatioObj'+i]= {
										transform: `transLateX(${moveDis[i]}px)`,
									}
								} else {
									moveDis[i] = moveDis[i] + disList[0]
									this['closeRatioObj'+i]= {
										transform: `transLateX(${moveDis[i]}px)`,
									}
								}
							} else if (kind === 1) {
								if (res[0][i].left < leftList[0]) {
									moveDis[i] = moveDis[i] + disList[1]
									this['closeRatioObj'+i]= {
										transform: `transLateX(${moveDis[i]}px)`,
									}
								} else if (res[0][i].left > leftList[1]) {
									moveDis[i] = moveDis[i] - disList[0]
									this['closeRatioObj'+i]= {
										transform: `transLateX(${moveDis[i]}px)`,
									}
								} else {
									moveDis[i] = moveDis[i] - disList[0]
									this['closeRatioObj'+i]= {
										transform: `transLateX(${moveDis[i]}px)`,
									}
								}
							}
						}
					})
				}, 300)
				
				
				
				// uni.createSelectorQuery().selectAll('.close-ratio-list').boundingClientRect().exec(res => {
				// 	const curLeft = [res[0][0].left, res[0][1].left, res[0][2].left]
				// 	const disList = [curLeft[2]-curLeft[1], curLeft[2]-curLeft[0]]
				// 	const leftList = [Math.ceil(curLeft[0])+50, Math.floor(curLeft[2])-50]
				// 	let count = 0
				// 	this.timer = setInterval(() => {
				// 		count++
				// 		const kind = Math.floor(Math.random()*kinds.length)
				// 		if (count > 4) {
				// 			this.clearTimer()
				// 		}
						
				// 		for(let i = 0; i < 3; i++) {
				// 			if (kind === 0) {
				// 				if (curLeft[i] < leftList[0]) {
				// 					moveDis[i] = moveDis[i] + disList[0]
				// 					this['closeRatioObj'+i] = {
				// 						transform: `transLateX(${moveDis[i]}px)`,
				// 					}
				// 					curLeft[i] = curLeft[i] + disList[0]
				// 				} else if (curLeft[i] > leftList[1]) {
				// 					moveDis[i] = moveDis[i] - disList[1]
				// 					this['closeRatioObj'+i] = {
				// 						transform: `transLateX(${moveDis[i]}px)`,
				// 					}
				// 					curLeft[i] = curLeft[i] - disList[1]
				// 				} else {
				// 					moveDis[i] = moveDis[i] + disList[0]
				// 					this['closeRatioObj'+i] = {
				// 						transform: `transLateX(${moveDis[i]}px)`,
				// 					}
				// 					curLeft[i] = curLeft[i] + disList[0]
				// 				}
				// 			} else if (kind === 1) {
				// 				if (curLeft[i] < leftList[0]) {
				// 					moveDis[i] = moveDis[i] + disList[1]
				// 					this['closeRatioObj'+i] = {
				// 						transform: `transLateX(${moveDis[i]}px)`,
				// 					}
				// 					curLeft[i] = curLeft[i] + disList[1]
				// 				} else if (curLeft[i] > leftList[1]) {
				// 					moveDis[i] = moveDis[i] - disList[0]
				// 					this['closeRatioObj'+i] = {
				// 						transform: `transLateX(${moveDis[i]}px)`,
				// 					}
				// 					curLeft[i] = curLeft[i] - disList[0]
				// 				} else {
				// 					moveDis[i] = moveDis[i] - disList[0]
				// 					this['closeRatioObj'+i] = {
				// 						transform: `transLateX(${moveDis[i]}px)`,
				// 					}
				// 					curLeft[i] = curLeft[i] - disList[0]
				// 				}
				// 			}
				// 		}
				// 	}, 300)
				// })
			})
		},
		
		chooseMarkUpRatio(index) {
			console.log('chooseMarkUpRatio', index, this.markUpRatioList)
			const data = {
				userId: this.userInfo.id,
			}
			
			this.$getRequest(this.$url.getAdditionOrderRatio, "GET", data).then(res => {
				if (res.code === 0) {
					this.currentMarkUpIndex = index
					this.currentMarkUpRatio = res.data
					this.markUpRatioList[index] = res.data
					this.animation.opacity(1).step()
					this.animationData = this.animation.export()
					const params = {
						id: this.additionItem.id,
						markUpRatio: this.currentMarkUpRatio,
					}
					
					this.$getRequest(this.$url.updateAdditionOrder, "GET", params).then(res1 => {
						if (res1.code === 0) {
							this.getAdditionOrderList()
							//this.getMarkUpRatioList()
						}
					})
				}
			})
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.wrap {
	padding: 40rpx 40rpx 80rpx;
	height: 100vh;
	display: flex;
	flex-direction: column;
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.tabs {
		display: flex;
		align-items: center;
		.tab {
			margin-right: 32rpx;
			display: flex;
			align-items: center;
			font-size: 28rpx;
			color: rgba(10, 15, 45, 0.8);
			height: 50rpx;
			line-height: 50rpx;
			&.tab-active {
				font-size: 34rpx;
				font-weight: 600;
				color: #0A0F2D;
			}
			.line {
				transform: translateY(-2rpx) rotate(114deg) skew(20deg);
				background: #F9714D;
				width: 32rpx;
				height: 8rpx;
			}
		}
	}
	.rank-rule {
		font-size: 24rpx;
		color: #F9B93A;
		font-weight: 500;
		display: flex;
	}
	.container {
		height: 0;
		flex: 1;
		padding-top: 40rpx;
		.scroll-Y {
			height: 100%;
			.card {
				position: relative;
				.tag {
					position: absolute;
					top: 0;
					right: 0;
					z-index: 100;
					width: 160rpx;
					height: 48rpx;
					border-radius: 0px 24rpx 0px 24rpx;
					background: #FCE3C8;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 28rpx;
					font-weight: 500;
					color: #A16F40;
				}
				.tag2 {
					color: #FF0000;
					font-size: 32rpx;
				}
				.rank1tag {
					background: #EE3833;
					color: #FFFFFF;
				}
				.rank2tag {
					background: #1496D8;
					color: #FFFFFF;
				}
				.rank3tag {
					background: #FFB94A;
					color: #FFFFFF;
				}
				.card-container {
					display: flex;
					.left {
						width: 0;
						flex: 1;
						.brand {
							height: 44rpx;
							font-size: 28rpx;
							line-height: 44rpx;
							color: #371A01;
							@include text-overflow;
						}
						.product {
							height: 34rpx;
							font-size: 24rpx;
							line-height: 34rpx;
							color: #999999;
							@include text-overflow;
						}
						.customer {
							margin-top: 16rpx;
							height: 56rpx;
							display: flex;
							align-items: center;
							color: #999999;
							font-size: 24rpx;
							.label {
								padding-right: 24rpx;
								color: #371A01;
							}
						}
					}
					.right {
						display: flex;
						align-items: flex-end;
					}
				}
				
				.userinfo {
					display: flex;
					align-items: center;
					.avatar {
						width: 70rpx;
						height: 70rpx;
						border-radius: 50%;
						margin-right: 16rpx;
					}
					.username {
						height: 34rpx;
						font-size: 28rpx;
						line-height: 34rpx;
						color: #371A01;
					}
				}
				.commission-wrap {
					display: flex;
					justify-content: flex-end;
					align-items: center;
					.label {
						padding-right: 16rpx;
						color: #371A01;
						font-size: 24rpx;
					}
					.commission {
						font-weight: 500;
						color: #EE3833;
						font-size: 36rpx;
						display: flex;
						align-items: baseline;
						.unit {
							font-size: 28rpx;
						}
					}
					.commission-btn {
						margin-left: 16rpx;
						width: 140rpx;
						height: 56rpx;
						border-radius: 70rpx;
						background: #E4E4E4;
						display: flex;
						justify-content: center;
						align-items: center;
						color: #B8B8B8;
						font-weight: 500;
						font-size: 24rpx;
					}
					.commission-btn1 {
						background: #FFAC1C;
						color: #FFFFFF;
					}
				}
			}
		}
	}
}
.popup-wrap {
	width: 686rpx;
	height: 540rpx;
	position: relative;
	background: #FFF6DF;
	padding: 0;
	.popup-container {
		width: 100%;
		height: 100%;
		padding: 40rpx;
		background: #FFF6DF;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 200;
		.popup-title {
			font-size: 50rpx;
			color: #A16F40;
			font-weight: 500;
		}
		.popup-tip {
			font-weight: 500;
			color: #A16F40;
			font-size: 28rpx;
		}
		.ratio-list {
			height: 0;
			flex: 1;
			width: 100%;
			padding-top: 60rpx;
			display: flex;
			justify-content: space-between;
			.ratio-img {
				width: 184rpx;
				height: 226rpx;
				background-image: url('https://image.51cheyaoshi.com/xcx/app/static/partner/prize-close.png');
				background-size: 100%;
			}
			.ratio-img1 {
				background-image: url('https://image.51cheyaoshi.com/xcx/app/static/partner/prize-open.png');
				position: relative;
				transition: transform .5s;
				.rate-title {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					text-align: center;
					color: #FF2B3F;
					font-size: 24rpx;
					font-weight: 500;
					margin-top: 16rpx;
				}
				.rate {
					margin-top: 60rpx;
					font-weight: 500;
					color: #979797;
					font-size: 24rpx;
					text-align: center;
				}
				.active-rate {
					color: #FF2B3F;
					font-size: 28rpx;
				}
			}
		}
		.close-ratio-list {
			perspective: 500px;
			transform-style: preserve-3d;
			transition: transform .1s;
		}
	}
	.after-choose {
		z-index: 100;
		opacity: 0;
	}
}
</style>