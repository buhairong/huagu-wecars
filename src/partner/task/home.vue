<template>
	<view class="wrap" v-if="detail">
		<view
			class="status-bar"
			:style="{ height: custom.top + 'px' }"
		/>
		
		<view class="header">
			<view class="back-btn" @click="back">
				<u-icon name="arrow-left" color="#fff" size="48"></u-icon>
			</view>
			<view class="title">做任务领福利</view>
		</view>
		
		<view class="container">
			<view class="step-wrap">
				<view class="step-card-header">
					<view class="tab">
						<view class="line"></view>
						{{ detail.isCompleteFirstTask ? '爆单加成' : '首单任务' }}
					</view>
					<view class="ranking" @click="goRankingPage(2)">佣金排行榜</view>
				</view>
				
				<view class="score-wrap" v-if="detail.isCompleteFirstTask">
					<view class="score">
						<view class="score-item">
							<view class="num">{{detail.orderNum}}</view>
							<view class="label">累计爆单/次</view>
						</view>
						<view class="line"></view>
						<view class="score-item">
							<view class="num">{{detail.totalMoney | $numFormat}}</view>
							<view class="label">累计加成/元</view>
						</view>
					</view>
					<view class="icon-wrap" @click="goRankingPage(1)">
						<u-icon name="arrow-right" color="#A16F40" size="48"></u-icon>
					</view>
				</view>
				<view class="steps" @click="goFirstTaskPage" v-else>
					<view class="step-img-wrap">
						<image
							style="width:480rpx;"
							:src="`https://image.51cheyaoshi.com/xcx/app/static/partner/task-step${partnerTaskStep}.png`"
							mode="widthFix"
						/>
					</view>
					<view class="step-list">
						<view class="step" :class="{'active-step': detail.customerNum}">
							<view class="label">注册客户</view>
							<view class="num">{{detail.customerNum || 0}}人</view>
						</view>
						<view class="step" :class="{'active-step': detail.customerNum}">
							<view class="label">客户签约</view>
							<view class="num">{{detail.signCustomerNum || 0}}人</view>
						</view>
						<view class="step">
							<view class="label label1">
								佣金x2倍
							</view>
							<view class="time">{{countDownTime}}</view>
						</view>
					</view>
				</view>
				
				<view class="share-btn" @click="goRankingPage(1)" v-if="detail.newOrderNum || (detail.isCompleteFirstTask == 0 && partnerTaskStep == 3)">
					佣金加成
					<view class="badge">+{{detail.newOrderNum || 1}}</view>
				</view>
				<view class="share-btn" @click="goProductPage" v-else>
					分享产品
				</view>
			</view>
			
			<view class="notice-wrap" v-if="detail.noticeList.length">
				<image
					style="width:36rpx;"
					src="https://image.51cheyaoshi.com/xcx/app/static/partner/horn.png"
					mode="widthFix"
				/>
				<u-notice-bar 
					mode="horizontal" 
					color="#ffffff"
					bg-color="transparent"
					border-radius="24"
					padding="0rpx 0rpx"
					:speed="120"
					:volume-icon="false"
					:list="detail.noticeList"
				></u-notice-bar>
			</view>
			
			<view class="task-list">
				<view class="task-card" v-if="detail.claimAmount">
					<view class="task-content">
						<view class="label">
							您有
							<view class="money">{{detail.claimAmount}}元</view>
							任务奖励待领取
						</view>
						<view class="task-btn" @click="receiveClaimAmount('')">领取奖励</view>
					</view>
				</view>
				
				<view class="task-card task-card1" v-for="(item, index) in taskList" :key="index">
					<view class="tag" v-if="item.taskType <= 2">每日</view>
					
					<view class="task-content task-content1">
						<view class="left">
							<view class="amount">
								<view class="unit">¥</view>
								{{item.taskMoney}}
							</view>
							<view class="task-detail">
								<view class="task-title" v-if="item.taskType <= 2">邀请{{item.taskCount}}名客户使用WECARS</view>
								<view class="task-title" v-else-if="item.taskType == 3">邀请朋友加入全民合伙人</view>
								<u-line-progress
									v-if="item.taskType <= 2"
									:percent="detail.customerNumEveryDay/item.taskCount*100" 
									:show-percent="false"
									active-color="#FCB740"
									inactive-color="rgba(216, 216, 216, 0.8)"
								>
									<view class="progress-text">{{detail.customerNumEveryDay}}/{{item.taskCount}}</view>
								</u-line-progress>
							</view>
						</view>
						
						<view class="task-btn task-btn2" v-if="item.isReceive">已完成</view>
						<view class="task-btn" @click="receiveClaimAmount(item.taskType)" v-else-if="item.taskType == 3 && item.newPartnerNum">
							领取奖励
							<view class="badge" v-if="item.newPartnerNum">+{{item.newPartnerNum}}</view>
						</view>
						<view class="task-btn" @click="receiveClaimAmount(item.taskType)" v-else-if="item.taskType < 3 && item.isReceive == 0">
							领取奖励
						</view>
						<view class="task-btn task-btn1" @click="goQrCodePage(item.taskType)" v-else>去完成</view>
					</view>
					
					<view class="task-desc-wrap">
						<view class="task-desc" v-if="item.open">
							<view class="task-desc-title">任务指南</view>
							<template v-if="item.taskType <= 2">
								<view class="task-desc-item">· 每日带来{{item.taskCount}}个有效客户，即可获得{{item.taskMoney}}元奖励。</view>
								<view class="task-desc-item">· 每个客户只能作为一名有效线索，重复邀请同一客户无效。</view>
								<view class="task-desc-item">· 任务每日0点刷新，昨日邀请客户累计清空。</view>
							</template>
							<template v-else-if="item.taskType == 3">
								<view class="task-desc-item">· 成功邀请{{item.taskCount}}名合伙人，即可获得{{item.taskMoney}}元奖励。</view>
								<view class="task-desc-item">· 每个合伙人只能被邀请一次，重复邀请无效。</view>
								<view class="task-desc-item">· 自邀请第{{item.specialTaskPartnerCount}}名合伙人时，受邀合伙人需带来{{item.specialTaskCustomerCount}}个有效客户。</view>
							</template>
						</view>
						<view class="arrow-wrap" @click="toggleTaskDesc(index)">
							<u-icon :name="item.open ? 'arrow-up' : 'arrow-down'" color="#0A0F2D" size="28"></u-icon>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<u-popup border-radius="24" mode="center" v-model="showFirstPopup">
			<view class="popup-wrap">
				<view class="bar"></view>
				<view class="canvas-wrap">
					<canvas 
						canvas-id="canvas" 
						id="canvas" 
						class="canvas"
						:style="{
							backgroundImage: `url(${canvasBackgroundImage})`,
						}" 
						@touchstart.stop="handleCanvasTouchStart"
						@touchmove.stop="handleCanvasTouchMove"
						@touchend.stop="handleCanvasTouchEnd"
					></canvas>
				</view>
				
				<view class="btn-wrap" v-if="showPopupBtn">
					<view class="countdown">福利时间剩余：{{countDownTime}}</view>
					<view class="popup-btn" @click="getPrize">立即使用</view>
				</view>
			</view>
		</u-popup>
		
	</view>
</template>

<script>
import { throttle, formatCountdown, oneDay, oneMin } from '@/utils'	
	
const app = getApp()
export default {
	data() {
		return {
			custom: app.globalData.custom,
			userInfo: null,
			isFirstLoginPartner: 1,
			detail: null,
			taskList: [],
			partnerTaskStep: 1,
			showFirstPopup: false,
			prizeList: ['https://image.51cheyaoshi.com/xcx/app/static/partner/prize1.png'],
			ctx: null,
			canvasBackgroundImage: '',
			status: false,
			canvasW: 0, 
			canvasH: 0,
			canvasTop: 0, 
			canvasLeft: 0, 
			r: 30,
			intervalTime: null,
			countDownTimer: null,
			showPopupBtn: false,
			countDownTime: '',
		}
	},
	
	onLoad(options) {
		this.userId = options.userId
		this.isFirstLoginPartner = options.isFirstLoginPartner || 1
	},
	
	onShow() {
		this.getDetail()
		this.getPartnerActivityTaskList()
		const isLogin = uni.getStorageSync('isLogin')
		if (isLogin) {
			getApp().globalData.getUserInfo((data) => {
				this.userInfo = data
				
				if (data.isShareProduct == 0 && this.isFirstLoginPartner == 1) {
					uni.showModal({
						title: '提示',
						content: '您是否已经分享产品？',
						confirmText: '已分享',
						cancelText: '重新分享',
						success: (res) => {
							if (res.confirm) {
								this.handlerComplateShare()
							} else {
								this.goProductPage()
							}
						},
						fail: (err) => {
							console.log('fail', err)
						}
					})
				}
			})
		}
	},
	
	onReady() {
		if (this.isFirstLoginPartner == 0) {
			this.showFirstPopup = true
			setTimeout(() => {
				this.initCanvas()
			}, 1000)
		}
	},
	
	onHide() {
		this.clearTimer()
	},
	
	onUnload() {
		this.clearTimer()
		this.clearCountDownTimer()
	},
	
	methods: {
		clearTimer() {
			clearTimeout(this.intervalTime)
			this.intervalTime = null
		},
		
		clearCountDownTimer() {
			clearInterval(this.countDownTimer)
			this.countDownTimer = null
		},
		
		getPartnerActivityTaskList() {
			const data = {
				userId: this.userId,
			}
			
			this.$getRequest(this.$url.getPartnerActivityTaskList, "GET", data).then(res => {
				if (res.code === 0) {
					this.taskList = res.data.map(item => {
						return {
							...item,
							open: false,
						}
					})
				}
			})
		}, 
		
		getDetail() {
			const data = {
				userId: this.userId,
			}
			
			this.$getRequest(this.$url.partnerActivityDetail, "GET", data).then(res => {
				if (res.code === 0) {
					
					this.detail = res.data
					if (!this.detail.customerNum) {
						this.partnerTaskStep = 1
					} else if (!this.detail.signCustomerNum) {
						this.partnerTaskStep = 2
					} else {
						this.partnerTaskStep = 3
					}
					this.getCountDown()
				}
			})
		}, 
		
		getCountDown() {
			if (!this.detail.firstLoginPartnerTime) return
			
			const currentTimer = new Date().getTime()
			const periodTimer = new Date(this.detail.firstLoginPartnerTime).getTime() + 30*oneDay
			let timer = periodTimer - currentTimer
			
			if (timer < 60000) return
			
			let min = ''
			const curTimer = formatCountdown(timer)
			this.countDownTime = `${curTimer.day}天${curTimer.hour}时${curTimer.minute}分`
			this.countDownTimer = setInterval(() => {
				timer -= 1000
				const curTimer = formatCountdown(timer)
				if (min != curTimer.minute) {
					min = curTimer.minute
					this.countDownTime = `${curTimer.day}天${curTimer.hour}时${min}分`
				}
				
				if (timer <= 0) {
					this.clearCountDownTimer()
				}
			}, 1000)
		},
		
		initCanvas() {
			this.ctx = uni.createCanvasContext('canvas')
			setTimeout(() => {
				uni.createSelectorQuery().select('#canvas').boundingClientRect().exec(res => {
					this.canvasW = res[0].width
					this.canvasH = res[0].height
					this.canvasTop = res[0].top
					this.canvasLeft = res[0].left
					uni.downloadFile({
						url: 'https://image.51cheyaoshi.com/xcx/app/static/partner/prize-mask.png',
						success: (imgRes) => {
							this.ctx.drawImage(imgRes.tempFilePath, 0, 0, this.canvasW, this.canvasH)
							this.ctx.draw()
							this.canvasBackgroundImage = 'https://image.51cheyaoshi.com/xcx/app/static/partner/prize1.png'
						},
					})
				})
			})
		},
		
		handleCanvasTouchStart(e) {
			this.status = true
		},
		
		handleCanvasTouchMove(e) {
			if (this.status) {
				const x = e.changedTouches[0].pageX - this.canvasLeft
				const y = e.changedTouches[0].pageY - this.canvasTop
				this.ctx.clearRect(x-this.r/2, y-this.r/2, this.r, this.r)
				this.ctx.draw(true, () => {
					if (!this.intervalTime) {
						this.intervalTime = setInterval(() => {
							this.getFilledPercentage()
							this.clearTimer()
						}, 200)
					}
				})
			}
		},
		
		handleCanvasTouchEnd(e) {
			this.status = false
		},
		
		getFilledPercentage() {
			if (this.status) {
				uni.canvasGetImageData({
				  canvasId: 'canvas',
				  x: 0,
				  y: 0,
				  width: this.canvasW,
				  height: this.canvasH,
				  success: (imgData) => {
				    // imgData.data是个数组，存储着指定区域每个像素点的信息，数组中4个元素表示一个像素点的rgba值
						const pixels = imgData.data
						
						const transPixels = []
						for (let i = 0; i < pixels.length; i += 4) {
							// 严格上来说，判断像素点是否透明需要判断该像素点的a值是否等于0，
							// 为了提高计算效率，这儿设置当a值小于128，也就是半透明状态时就可以了
							if (pixels[i + 3] < 128) {
								transPixels.push(pixels[i + 3])
							}
						}
						const rate = (transPixels.length / (pixels.length / 4) * 100).toFixed(2)
						if (rate > 60) {
							this.ctx.clearRect(0, 0, this.canvasW, this.canvasH)
							this.clearTimer()
							let timer = 30 * oneDay
							timer -= 1000
							const curTimer = formatCountdown(timer)
							this.countDownTime = `${curTimer.day}天${curTimer.hour}时${curTimer.minute}分`
							this.countDownTimer = setInterval(() => {
								timer -= 1000
								const curTimer = formatCountdown(timer)
								this.countDownTime = `${curTimer.day}天${curTimer.hour}时${curTimer.minute}分`
								if (timer <= 0) {
									this.clearCountDownTimer()
								}
							}, 1000)
							this.showPopupBtn = true
						}
				  }
				})
			}
		},
		
		back() {
			// uni.navigateBack({
			// 	delta: 1
			// })
			uni.navigateTo({
				url: `/partner/partner/home?userId=${this.userId}&partnerType=${this.userInfo.partnerType}&partnerCompany=${this.userInfo.partnerCompany}&roleId=${this.userInfo.roleId}`
			})
		},
		
		goRankingPage(tab) {
			if (this.detail.isCompleteFirstTask == 0 && this.partnerTaskStep == 3) {
				const data = {
					userId: this.userId,
				}
				
				this.$getRequest(this.$url.completeFirstTask, "GET", data).then(res => {
					if (res.code === 0) {
						uni.navigateTo({
							url: `/partner/task/ranking?activeTab=${tab}&userId=${this.userId}&rankMethod=${this.detail.rankMethod}`
						})
					}
				})
			} else {
				uni.navigateTo({
					url: `/partner/task/ranking?activeTab=${tab}&userId=${this.userId}&rankMethod=${this.detail.rankMethod}`
				})
			}
		},
		
		goFirstTaskPage() {
			uni.navigateTo({
				url: `/partner/task/firstTask?userId=${this.userId}`
			})
		},
		
		goProductPage() {
			uni.navigateTo({
				url: `/partner/task/product?userId=${this.userId}`
			})
		},
		
		getPrize() {
			const data = {
				userId: this.userId,
			}
			
			this.$getRequest(this.$url.activityCommissionDouble, "GET", data).then(res => {
				if (res.code === 0) {
					uni.showToast({
						title: '领取成功',
						duration: 2000,
						icon: 'none',
					})
					this.goFirstTaskPage()
					this.showFirstPopup = false
				} else {
					uni.showToast({
						title: '领取失败',
						duration: 2000,
						icon: 'none',
					})
				}
			}).catch(err => {
				uni.showToast({
					title: '领取失败',
					duration: 2000,
					icon: 'none',
				})
			})
		},
		
		handlerComplateShare() {
			const data = {
				userId: this.userId,
			}
			this.$getRequest(this.$url.activityShare, "GET", data).then(res => {
				if (res.code === 0) {
					//
				}
			})
		},
		
		receiveClaimAmount(taskType) {
			const data = {
				userId: this.userId,
				taskType,
			}
			
			this.$getRequest(this.$url.receiveReward, "GET", data).then(res => {
				if (res.code === 0) {
					uni.showToast({
						title: '领取成功',
						duration: 2000,
						icon: 'none',
					})
					this.getDetail()
					this.getPartnerActivityTaskList()
				} else {
					uni.showToast({
						title: '领取失败',
						duration: 2000,
						icon: 'none',
					})
				}
			}).catch(err => {
				uni.showToast({
					title: '领取失败',
					duration: 2000,
					icon: 'none',
				})
			})
		},
		
		goQrCodePage(type) {
			if (type == 3) {
				uni.navigateTo({
					url: `/partner/qrcode/invitePartnerQrcode?userId=${this.userId}`
				})
			} else {
				uni.navigateTo({
					url: `/partner/qrcode/qrcode?page=1&userId=${this.userId}`
				})
			}
		},
		
		toggleTaskDesc(index) {
			this.taskList[index].open = !this.taskList[index].open
		},
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	width: 100vw;
	min-height: 100vh;
	background-image: url('https://image.51cheyaoshi.com/xcx/app/static/partner/task-bg.png');
	background-size: 100%;
	.badge {
		position: absolute;
		top: 0;
		right: 0;
		z-index: 200;
		min-width: 40rpx;
		height: 40rpx;
		line-height: 40rpx;
		background: #FF0007;
		box-shadow: 0px 4px 5px -1px rgba(0, 0, 0, 0.15);
		border-radius: 50%;
		padding: 0 6rpx;
		color: #FFFFFF;
		font-weight: 500;
		font-size: 24rpx;
		transform: translate(30%, -50%);
	}
	.header {
		height: 64rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		.back-btn {
			width: 112rpx;
			height: 64rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			position: absolute;
			left: 0;
			top: 0;
			z-index: 100;
		}
		.title {
			color: #fff;
			font-size: 34rpx;
			font-weight: 500;
		}
	}
	.container {
		padding: 32rpx 32rpx 64rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		.step-wrap {
			padding: 24rpx 24rpx 48rpx;
			margin-bottom: 100rpx;
			width: 668rpx;
			border-radius: 10rpx;
			background: #FFF6DF;
			border: 2rpx solid #FFAC1C;
			position: relative;
			.step-card-header {
				height: 60rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.tab {
					display: flex;
					align-items: center;
					font-size: 32rpx;
					color: #A16F40;
					font-weight: 600;
					height: 48rpx;
					line-height: 48rpx;
					.line {
						transform: translateY(0rpx) rotate(114deg) skew(20deg);
						background: #F9714D;
						width: 32rpx;
						height: 8rpx;
					}
				}
				.ranking {
					height: 36rpx;
					font-size: 28rpx;
					line-height: 36rpx;
					color: #A16F40;
					font-weight: 600;
					font-style: italic;
					border-bottom: 2rpx solid #A16F40;
				}
			}
			.steps {
				margin-top: 32rpx;
				padding: 32rpx;
				border-radius: 4rpx;
				background: #F9F9F9;
				.step-img-wrap {
					display: flex;
					justify-content: center;
				}
				.step-list {
					margin-top: 24rpx;
					display: flex;
					justify-content: space-between;
					.step {
						display: flex;
						flex-direction: column;
						align-items: center;
						.label {
							height: 64rpx;
							font-size: 28rpx;
							font-weight: 500;
							line-height: 64rpx;
							color: #969696;
						}
						.label1 {
							color: #FF0000;
						}
						.num {
							font-size: 24rpx;
							color: #979797;
							font-weight: 500;
						}
						.time {
							font-size: 24rpx;
							color: #FF0000;
						}
					}
					.active-step {
						.label {
							color: #A16F40;
						}
						.num {
							color: #A16F40;
						}
					}
				}
			}
			.score-wrap {
				padding: 40rpx 0 40rpx 76rpx;
				display: flex;
				align-items: center;
				.score {
					flex: 1;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.score-item {
						display: flex;
						flex-direction: column;
						align-items: center;
						.num {
							height: 60rpx;
							font-size: 40rpx;
							line-height: 60rpx;
							color: #A16F40;
							font-weight: 500;
						}
						.label {
							margin-top: 8rpx;
							height: 40rpx;
							font-size: 24rpx;
							line-height: 40rpx;
							color: rgba(10, 15, 45, 0.5);
						}
					}
					.line {
						width: 2rpx;
						height: 60rpx;
						background: #7E0101;
					}
				}
				.icon-wrap {
					width: 88rpx;
					height: 100%;
					display: flex;
					justify-content: flex-end;
					align-items: center;
				}
			}
			.share-btn {
				position: absolute;
				left: 50%;
				bottom: 0;
				z-index: 100;
				width: 320rpx;
				height: 96rpx;
				border-radius: 24rpx;
				background: #FFAC1C;
				border: 10rpx solid rgba(255, 172, 28, 0.5);
				display: flex;
				justify-content: center;
				align-items: center;
				color: #FFFFFF;
				font-weight: 500;
				font-size: 32rpx;
				transform: translate(-50%, 50%);
			}
		}
		.notice-wrap {
			width: 560rpx;
			padding-left: 2rpx;
			background: rgba(56, 56, 56, 0.2);
			// border: 1px solid rgba(56, 56, 56, 0.2);
			border-radius: 24rpx;
			display: flex;
			align-items: center;
			u-notice-bar {
				width: 0;
				flex: 1;
			}
		}
		.task-list {
			margin-top: 32rpx;
			width: 100%;
			.task-card {
				margin-bottom: 24rpx;
				padding: 0 24rpx;
				width: 100%;
				border-radius: 20rpx;
				background: #FFFFFF;
				box-sizing: border-box;
				border: 2rpx solid #D8D8D8;
				.task-content {
					display: flex;
					justify-content: space-between;
					align-items: center;
					min-height: 100rpx;
				}
				.task-content1 {
					margin-top: 44rpx;
				}
				.label {
					display: flex;
					font-size: 28rpx;
					font-weight: 500;
					color: #371A01;
					.money {
						color: #FF3036;
					}
				}
				.task-btn {
					width: 140rpx;
					height: 56rpx;
					border-radius: 70rpx;
					background: #FFAC1C;
					font-size: 24rpx;
					font-weight: 500;
					color: #FFFFFF;
					display: flex;
					justify-content: center;
					align-items: center;
					position: relative;
				}
				.task-btn1 {
					background: #FAD6AD;
					color: #A16F40;
				}
				.task-btn2 {
					background: #E0E0E0;
					color: #909090;
				}
			}
			.task-card1 {
				position: relative;
				.tag {
					position: absolute;
					top: 0;
					left: 0;
					width: 80rpx;
					height: 40rpx;
					border-radius: 20rpx 0px 20rpx 0px;
					background: #FE7708;
					border: 2rpx solid #FFFFFF;
					display: flex;
					justify-content: center;
					align-items: center;
					color: #FFFFFF;
					font-size: 24rpx;
					font-weight: 500;
				}
				.left {
					display: flex;
					align-items: center;
					.amount {
						margin-right: 24rpx;
						display: flex;
						align-items: baseline;
						font-weight: 500;
						color: #FF3036;
						font-size: 48rpx;
						.unit {
							padding-right: 4rpx;
							font-size: 24rpx;
						}
					}
					.task-detail {
						.task-title {
							height: 48rpx;
							font-size: 28rpx;
							font-weight: 500;
							line-height: 48rpx;
							color: #371A01;
						}
						::v-deep .u-progress {
							margin-top: 24rpx;
							width: 240rpx;
							position: relative;
							.progress-text {
								color: #FFFFFF;
								font-weight: 500;
								font-size: 24rpx;
								position: absolute;
								left: 50%;
								top: 50%;
								z-index: 100;
								transform: translate(-50%, -50%);
							}
						}
					}
				}
				.task-desc-wrap {
					.task-desc {
						margin-top: 44rpx;
						border-top: 2rpx solid #D8D8D8;
						.task-desc-title {
							margin: 16rpx 0;
							font-size: 24rpx;
							font-weight: 500;
							color: #3D3D3D;
						}
						.task-desc-item {
							font-size: 24rpx;
							line-height: 36rpx;
							color: rgba(10, 15, 45, 0.8);
							margin-top: 8rpx;
						}
					}
					.arrow-wrap {
						padding: 24rpx 0;
						display: flex;
						justify-content: center;
					}
				}
			}
		}
	}
}

.popup-wrap {
	padding: 228rpx 24rpx 48rpx;
	width: 686rpx;
	background-image: url('https://image.51cheyaoshi.com/xcx/app/static/partner/prize-bg.png');
	background-size: 100% 1020rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	.bar {
		width: 100%;
		height: 48rpx;
		border-radius: 24rpx;
		background: #BB2928;
		box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.4);
	}
	.canvas-wrap {
		margin-top: -24rpx;
		width: 572rpx;
		height: 504rpx;
		border-radius: 0px 0px 10rpx 10rpx;
		background: linear-gradient(180deg, #FFF6E8 2%, #FFF6E8 29%);
		display: flex;
		justify-content: center;
		align-items: center;
		#canvas {
			width: 544rpx;
			height: 460rpx;
			border-radius: 4rpx;
			background-size: 100%;
		}
	}
	.btn-wrap {
		margin-top: 16rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		.countdown {
			height: 48rpx;
			font-size: 28rpx;
			line-height: 48rpx;
			color: #fff;
		}
		.popup-btn {
			margin-top: 16rpx;
			width: 394rpx;
			height: 90rpx;
			border-radius: 45rpx;
			// background-image: url('https://image.51cheyaoshi.com/xcx/app/static/partner/prize-btn.png');
			// background-size: 100%;
			background: #FCE093;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #B60000;
			font-weight: 500;
			font-size: 50rpx;
		}
	}
}
</style>