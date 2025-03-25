<template>
	<view class="page-wrap1">
		<u-sticky>
		  <view style="width: 100%;">
		  	<u-tabs ref="tabs"  active-color="#0A0F2D" inactive-color="rgba(10, 15, 45, 0.8)" font-size="32" :list="tabList" :is-scroll="false" :current="current" @change="change"></u-tabs>
		  </view>
		</u-sticky>
		
		<view v-if="current == 0">
		    <view v-if="list.length == 0">
				  <u-gap
					  height="200"
					  bg-color="#FFFFFF"
				  />
				  <u-empty
					  text="暂无兑换码"
					  mode="list"
				  />
		    </view>
			
			<view class="list-wrap">
				<view
						v-for="(item, index) in list"
						:key="index"
						class="card"
				>
					<view class="left">
						<view class="card-item">
							<view class="card-label">兑换码：</view>
							<view class="card-item-content">
								{{item.code}}
								<button
								    open-type="share"
								    class="text-btn"
									@click="shareCode(item.code)"
								>
								   分享兑换码
								</button>
							</view>
						</view>
						<view class="card-item">
							<view class="card-label">兑换金额：</view>
							<view class="card-item-content">
								<view>{{formatThousandNumber(item.money)}}元</view>
							</view>
						</view>
					</view>
					<view class="status-wrap">生效中</view>
				</view>
			</view>
	    </view>
		
		<view v-else-if="current == 1">
		    <view v-if="invaildList.length == 0">
				  <u-gap
					  height="200"
					  bg-color="#FFFFFF"
				  />
				  <u-empty
					  text="暂无兑换码"
					  mode="list"
				  />
		    </view>
			
			<view class="list-wrap">
				<view
						v-for="(item, index) in invaildList"
						:key="index"
						class="card"
				>
					<view class="left">
						<view class="card-item">
							<view class="card-label">兑换码：</view>
							<view class="card-item-content">{{item.code}}</view>
						</view>
						<view class="card-item">
							<view class="card-label">兑换金额：</view>
							<view class="card-item-content">{{formatThousandNumber(item.money)}}元</view>
						</view>
					</view>
					<view class="status-wrap">已失效</view>
				</view>
			</view>
		</view>
		
		<!-- <view class="order-btn-wrap">
			<view class="order-btn" @click="handleExchange">
				生成兑换码
			</view>
		</view> -->
		
		<u-popup border-radius="14" mode="center" v-model="showPopup" @close="close">
			<view class="popup-wrap">
				<view class="item">
					<view class="item-title">兑换码：</view>
					<view class="item-content">{{code}}</view>
				</view>
				
				<view class="item">
					<view class="item-title">金额：</view>
					<view class="item-content">
						<input
							class="input"
							v-model="money"
							placeholder="请输入兑换码金额"
							type="number"
						/>
					</view>
				</view>
				
				<view class="btn-wrap">
					<view class="btn" @click="handleComfirm">
						确定
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { formatTenThousandNumber, formatThousandNumber } from '@/utils/index.js'
	
	const app = getApp()
	
	export default {
		onShareAppMessage(res) {
		  return {
		    title: 'WECARS给您送红包啦！赶快领取！',
		    desc: '',
		    path: this.shareUrl,
		    imageUrl: 'https://image.51cheyaoshi.com//2025/03/25/574e4aae606c4927bae86b6b3b9d0567.jpg',
		  }
		},
		
		data() {
			return {
				userId: '',
				list: [],
				invaildList: [],
				tabList: [
					{
						name: '生效中'
					}, 
					{
						name: '已失效'
					},
				],
				current: 0,
				code: '',
				money: undefined,
				showPopup: false,
				shareUrl: '',
			}
		},
		
		onLoad(option) {
			this.userId = option.userId
			this.search()
		},
		
		methods: {
			formatThousandNumber(price) {
				return formatThousandNumber(price)
			},
			
			change(index) {
				this.current = index;
			},
			
			search() {
				this.getList()
				this.getInvaildList()
			},
			
			getList() {
				uni.showLoading({
				  title: '加载中'
				});
				this.$getRequest(this.$url.getExchangeList, "POST", {
				  userId: this.userId,
				  state: 0,
				  page: 1,
				  limit: 1000,
				}).then(res => {
					uni.hideLoading()
					this.list = res.data.records
				}).catch(() => {
					uni.hideLoading()
				})
			},
			
			getInvaildList() {
				uni.showLoading({
				  title: '加载中'
				});
				this.$getRequest(this.$url.getExchangeList, "POST", {
				  userId: this.userId,
				  state: 1,
				  page: 1,
				  limit: 1000,
				}).then(res => {
					uni.hideLoading()
					this.invaildList = res.data.records
				}).catch(() => {
					uni.hideLoading()
				})
			},
			
			handleExchange() {
				uni.showLoading({
					title: '加载中'
				})
				
				this.$getRequest(this.$url.createExchangeCode, "GET", {
				  userId: this.userId,
				}).then(res => {
					uni.hideLoading()
					if (res.code == 0) {
						console.log('code', res.data)
						this.code = res.data
						this.showPopup = true
					} else {
						uni.showToast({
							title: res.msg || '生成兑换码失败',
							duration: 2000,
							icon: "none"
						})
					}
				}).catch(() => {
					uni.hideLoading()
				})
			},
			
			handleComfirm() {
				if(!this.money) {
					uni.showToast({
						title: '请输入兑换码金额',
						duration: 2000,
						icon: 'none'
					})
					return false;
				}
				
				uni.showLoading({
					title: '加载中'
				})
				
				this.$getRequest(this.$url.setExchangeCodeMoney, "POST", {
					userId: this.userId,
					code: this.code,
					money: this.money,
				}).then(res => {
					uni.hideLoading()
					if (res.code == 0) {
						this.search()
						this.showPopup = false
					} else {
						uni.showToast({
							title: res.msg || '设置失败',
							duration: 2000,
							icon: "none"
						})
					}
				}).catch(() => {
					uni.hideLoading()
				})
			},
			
			setMoney(code) {
				this.code = code
				this.showPopup = true
			},
			
			copy(code) {
				uni.setClipboardData({
					data: code,
				})
			},
			
			close() {
				this.showPopup = false
			},
			
			shareCode(code) {
				this.shareUrl = `/pages/sign/sign?type=couponCode&userId=${this.userId}&couponCode=${code}`
				console.log('this.shareUrl',this.shareUrl)
			},
		}
	}
</script>

<style lang="scss" scoped>
.page-wrap1 {
	padding-top: 0;
	padding-bottom: 240rpx;
	.list-wrap {
		margin-top: 32rpx;
		.card {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.left {
				padding-right: 24rpx;
				.card-item {
					margin-top: 16rpx;
					line-height: 44rpx;
					font-size: 24rpx;
					color: #64696F;
					display: flex;
					&:first-child {
						margin-top: 0;
					}
					.card-label {
						width: 140rpx;
						text-align: right;
					}
					.card-item-content {
						display: flex;
						.text-btn {
							margin:0;
							padding:0;
							margin-left: 32rpx;
							font-size: 28rpx;
							color: #4170EE;
							text-decoration: underline;
							background-color: transparent;
							border: none;
							height: unset;
							line-height: unset;
							&:after {
								border: none;
							}
						}
					}
				}
			}
			.status-wrap {
				padding: 0 16rpx;
				height: 64rpx;
				border-radius: 16rpx;
				border: 1rpx solid #5F19F5;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 30rpx;
				color: #5F19F5;
				font-weight: 500;
			}
		}
	}
}

.popup-wrap {
	padding: 48rpx;
	width: 560rpx;
	.item {
		margin-bottom: 32rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
		font-size: 14px;
		.item-title {
			color: #64696F;
			width: 120rpx;
			text-align: right;
		}
		.item-content {
			color: #141414;
		}
	}
	.btn-wrap {
		margin-top: 80rpx;
		.btn {
			width: 100%;
			height: 80rpx;
			border-radius: 16rpx;
			background: #0A0F2D;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 32rpx;
			color: #FFFFFF;
		}
	}
}
</style>
