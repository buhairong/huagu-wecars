<template>
	<u-popup border-radius="14" closeable=true mode="bottom" v-model="show" @close="close">
		<u-row>
			<u-col span="12">
				<view class="popupTitle">方案信息</view>
			</u-col>
		</u-row>
		<view class="popupInfo">
			<!-- <view class="car-content-title">
				<view>
					<view class="leftInfo" @click.stop="goDIYPage(currentItem.companyId)">
						<image class="icon_img" :src="currentItem.logoImageUrl"></image>
						<text>{{currentItem.merchantName}}</text>
					</view>
				</view>
				<view>
					<view class="rightInfo">
						<image class="icon_img" src="https://image.51cheyaoshi.com/xcx/app/static/img/在线咨询.png"></image>
						<text>在线咨询</text>
					</view>
				</view>
			</view> -->
			<view class="car-content-row">
				<view class="leftTitle">订阅周期：</view>
				<view class="rightNum">{{currentItem.monthTotal}}个月</view>
			</view>
			<view class="car-content-row">
				<view class="leftTitle">订阅费用：</view>
				<view v-if="currentItem.paymentType==0" class="rightNum">￥{{currentItem.payOffPrice | $numFormat}}</view>
				<view v-else class="rightNum">￥{{currentItem.monthPayment | $numFormat}}/月</view>
			</view>
			<view class="car-content-row">
				<view class="leftTitle">车辆押金：</view>
				<view v-if="currentItem.paymentType==0" class="rightNum">减免车辆押金</view>
				<view v-else class="rightNum">￥{{currentItem.deposit | $numFormat}}</view>
			</view>
			<view class="car-content-row">
				<view class="leftTitle">限定里程：</view>
				<view class="rightNum">{{currentItem.limitMileage}}公里</view>
			</view>
			<view class="car-content-row">
				<view class="leftTitle">超出里程：</view>
				<view class="rightNum">￥{{currentItem.overMileageFee}}/公里</view>
			</view>
			<view class="car-content-row" v-if="currentItem.score">
				<view class="leftTitle">返还积分：</view>
				<view class="rightNum">{{currentItem.score}}分</view>
			</view>
			<view class="car-content-row" v-if="currentItem.carSubscribeFreeServiceToWeb && currentItem.carSubscribeFreeServiceToWeb.length">
				<view class="leftTitle">精选服务：</view>
				<view class="rightNum"><text v-for="item,index in currentItem.carSubscribeFreeServiceToWeb" :key="index">{{index==0?'':'、'}}{{item}}</text></view>
			</view>
			<view class="space_row"></view>
			<view class="car-content-row">
				<view class="leftTitle">期末买断：</view>
				<view class="rightNum">￥{{currentItem.buyoutsFee | $numFormat}}</view>
			</view>
			<view class="car-content-row">
				<view class="leftTitle">购车总价：</view>
				<view class="rightNum">
					￥{{currentItem.totalPrice | $numFormat}}
				<text class="payOff" v-if="needPurchaseTaxRatio == 1">(已含购置税)</text>
				</view>
			</view>
			<view class="car-content-row">
				<view class="leftTitle">期末选择：</view>
				<view class="rightNum"><text v-for="(item,index) in currentItem.finalSelectToWeb" :key="index">{{index==0?'':'、'}}{{item==0?'买断车辆':item==1?'退回车辆':''}}</text></view>
			</view>
			<view class="buttomBtn" @click="handleBookCar">立即订车</view>
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
		
		currentItem: {
			type: Object,
			required: true,
		},
		
		needPurchaseTaxRatio: {
			type: Number | String,
			default: 1,
		},
	},
	methods: {
		close() {
			this.$emit('update:show', false)
		},
		
		goDIYPage(companyId) {
			//this.$u.route(`/pages/diy/diy?companyId=${companyId}`)
		},
		
		handleBookCar() {// 立即订车
			uni.showLoading({
				title: '加载中'
			})
			
			const routes = getCurrentPages(); // 获取当前打开过的页面路由数组
			const curRoute = routes[routes.length - 1] // 获取当前页面路由，也就是最后一个打开的页面路由
			let path = curRoute.route
			const option = curRoute.options
			const keys = Object.keys(option)
			keys.forEach((key, index) => {
				if (index === 0) {
					path += `?${key}=${option[key]}`
				} else {
					path += `&${key}=${option[key]}`
				}
			})
			
			const isLogin = uni.getStorageSync('isLogin')
			
			if (isLogin) {
				getApp().globalData.getUserInfo((data) => {
					if (data) {
						
						//data.riskAuditStatus = null
						
						const orderDetailPath = `/pages/home/profile/order-detail?id=${this.currentItem.id}&index=3&cartype=1`
						uni.setStorageSync("confirmRouter", orderDetailPath)
						const params = {
							riskAuditStatus: data.riskAuditStatus,
							username: data.name,
							imageUrl: data.imageUrl,
							idNum: data.userInfoEntity && data.userInfoEntity.idcard,
							companyName: data.userCompanyEntity && data.userCompanyEntity.companyName,
						}
						this.$emit('openIdentityDialog', params)
						
					// 	if (data.riskAuditStatus == 0 || data.riskAuditStatus == 2 || data.riskAuditStatus == 4) {
					
					// 		uni.showModal({
					// 			title: '提示',
					// 			content: '身份认证后可用车',
					// 			cancelText:'取消',
					// 			confirmText: '去认证',
					// 			success: (res) => {
					// 				if(res.confirm) {
					// 					uni.setStorageSync("confirmRouter", path)
					// 					this.$emit('openIdentityDialog')
					// 					//this.$u.route("/pages/mine/identity/identity")
					// 				}
					// 			}
					// 		})
					// 	} else {
					// 		//this.$u.route(`/pages/home/profile/order-detail?id=${this.currentItem.id}&index=3&cartype=1`)
					// 	}
					} else {
						this.$u.route("/pages/sign/sign")
					}
				})
			} else {
				this.$u.route("/pages/sign/sign")
			}
			
			uni.hideLoading()
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
	font-size: 28rpx;
	color: #64696F;
	.car-content-title{
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 10px;
	}

	.leftInfo {
		display: flex;
		align-items: center;
		text{
			color: #0A0F2D;
		}

	}

	.rightInfo {
		// display: flex;
		// align-items: center;
		text-align: right;
		font-size: 12px;
	}

	.icon_img {
		display: inline-block;
		vertical-align: middle;
		width: 44rpx;
		height: 44rpx;
		margin-right: 6rpx;
	}
	text{
		vertical-align: middle;
	}
	.car-content-row{
		margin-top: 20rpx;
		display: flex;
		align-items: flex-start;
		line-height: 44rpx;
		.leftTitle{
			width: 160rpx;
		}
		.rightNum{
			flex:1;
			color: #0A0F2D;
		}
	}
	.space_row{
		height: 20px;
	}
	.buttomBtn{
				background: #0A0F2D;
				border-radius: 16rpx;
				text-align: center;
				margin-top: 25px;
				padding: 30rpx 32rpx;
				color: #fff;
	}
}	
</style>