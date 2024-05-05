<template>
	<view class="endEriodOption">
		<view class="top-title">
			<view class="first">订阅期结束后，您会计划？</view>
			<view class="second">订阅期结束30天前，您可以随时变更方案</view>
		</view>
		
		<view v-if="finalInfo">
			<view class="btn-card" @click="toggleBtn(3)">
				<view class="title">继续订阅</view>
				<view class="item">
					<view class="item-title">订阅周期：</view>
					<view class="item-content">
						6期
						<view class="small-text">（{{allInfo.month}}）</view>
					</view>
				</view>
				<view class="item">
					<view class="item-title">订阅费用：</view>
					<view class="item-content">
						¥{{allInfo.mouthPayment | $numFormat}}/月
						<view class="small-text">（一次性支付 ¥{{allInfo.mouthPayment*6 | $numFormat}}）</view>
					</view>
				</view>
				<view class="item" v-if="limitMileage">
					<view class="item-title">限定里程：</view>
					<view class="item-content">
						{{(limitMileage-0) | $numFormat}}公里/6期
					</view>
				</view>
				<view class="item" v-if="overMileageFee">
					<view class="item-title">超出里程：</view>
					<view class="item-content">
						￥{{overMileageFee}}/公里
					</view>
				</view>
			</view>
			
			<view class="btn-card" @click="toggleBtn(1)">
				<view class="title">留购车辆</view>
				<view class="item">
					<view class="item-title">买断金额：</view>
					<view class="item-content">
						¥{{finalInfo.apportionRateCalculateResultList[1].buyoutsFee | $numFormat}}
					</view>
				</view>
				<view class="item">
					<view class="item-title">支付方式：</view>
					<view class="item-content">全款买断、金融分期</view>
				</view>
			</view>
			
			<view class="btn-card" @click="toggleBtn(0)">
				<view class="title">退回车辆</view>
				<view class="item">
					<view class="item-title">期末无损退回车辆</view>
				</view>
				<view class="item" v-if="limitMileage">
					<view class="item-title">限定里程：</view>
					<view class="item-content">
						{{(limitMileage-0)*(allInfo.period/6) | $numFormat}}公里/{{allInfo.period}}期
					</view>
				</view>
				<view class="item" v-if="overMileageFee">
					<view class="item-title">超出里程：</view>
					<view class="item-content">
						￥{{overMileageFee}}/公里
					</view>
				</view>
			</view>
			
		</view>
		
		<view class="bottom-link" @click="gotoDetail">我还没想好</view>
		
		<view>
			<u-modal v-model="showModal" title=" " @confirm="gotoDetail">
				<image style="width:128rpx;height:128rpx;margin:0 auto;display:block;" :src="src"></image>
				<view style="font-size: 34rpx;color: #000000;text-align: center;">期末方案预设成功</view>
				<view style="font-size:24rpx;color: rgba(10, 15, 45, 0.5);text-align: center;margin:16rpx 0 40rpx 0;">后续您可在订单详情页中随时修改期末方案</view>
			</u-modal>
		</view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				showModal:false,
				btnActive: 0,
				btnTitle:[
					{name: '过户买断'},
					{name: '退回车辆'},
					{name: '我再想想'}
				],
				src:"https://image.51cheyaoshi.com/xcx/app/static/complete.png",
				id:'',
				planId:'',
				configId:'',
				cartype: null, // 1.新车 2.二手车
				finalInfo: null,
				step: 0,
				allInfo: {},
				limitMileage: '',
				overMileageFee: '',
			}
		},
		onLoad(option){
			this.id = option.id
			this.planId = option.planId
			this.configId = option.configId
			this.cartype = option.cartype // 1.新车 2.二手车
			this.limitMileage = option.limitMileage
			this.overMileageFee = option.overMileageFee
			this.finalInfo = uni.getStorageSync("apportionRateCalculateResultList")
			this.step = 36 / this.finalInfo.apportionRateCalculateResultList.length
			this.payAll()
		},
		methods:{
			payAll() {
				uni.showLoading({
					title: '加载中'
				})
				
				this.$getRequest(this.$url.getFullPaymentPrice, 'GET', {
					id: this.planId,
					newOrOld: this.cartype
				}).then((data) => {
					if(data.code == 0){
						this.allInfo = data.data
					}
				}).finally(() => {
					uni.hideLoading()
				})
			},
			
			toggleBtn(index) {
				this.btnActive = index
				
				let params = {
					// buyoutsFee: this.allInfo.buyoutsFee,
					// deposit: this.allInfo.deposit,
					// fullPayment: this.allInfo.fullPayment,
					finalSelect: index,
					id: this.configId,
					newOrOld: 1,
					nextSubscribePeriod: this.allInfo.period,
					nextSubscribeMouthPayment: this.allInfo.mouthPayment,
					nextSubscribePeriodName: this.allInfo.month,
					userCarSubscribeId: this.id,
				}
				
				uni.showLoading({
					title: '保存中'
				})
				
				this.$getRequest(this.$url.updateUserCarSubscribeFinalBuyout, 'POST', params).then(result => {
						if (result.code == 0) {
							this.showModal = true
						}
				}).finally(() => {
					uni.hideLoading()
				})
				
				// if(index == 0){
				// 	uni.navigateTo({
				// 		url:'/pages/home/profile/pay-mode?id='+this.id+'&planId='+this.planId+'&configId='+this.configId + '&cartype='+this.cartype
				// 	})
				// }else if(index==1){
				// 	this.showModal=true
				// }else {
				// 	uni.navigateTo({
				// 		url: '/pages/home/profile/order-detail?orderId=' + this.id
				// 	})
				// }
			},
			
			// 弹框确认按钮
			gotoDetail(){
				uni.navigateTo({
					url: '/pagesOrder/order-detail/order-detail?orderId=' + this.id
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.endEriodOption{
		padding: 20px 32rpx 40px;
		.top-title {
			margin-top:80rpx;
			margin-bottom: 60rpx;
			.first{
				font-size: 40rpx;
				font-weight: 500;
				color: #0A0F2D;
			}
			.second{
				font-size: 28rpx;
				line-height: 44rpx;
				color: rgba(10, 15, 45, 0.5);
				margin-top:16rpx;
			}
		}
		.btn-title {
			width: 100%;
			.buy-out{
				width: 100%;
				height: 116rpx;
				border-radius: 8rpx;
				text-align: center;
				line-height: 116rpx;
				font-size: 34rpx;
				font-weight: 500;
				margin: 0 auto 20rpx auto;
				color: rgba(10, 15, 45, 0.6);
				background: rgba(10, 15, 45, 0.04);
			}
			.buy-out.active{
				background: #6CF3B1;
				font-weight: normal;
				color: #0A0F2D;
				font-weight: 500;
			}
		}
	}
	
.btn-card {
	margin-bottom: 16px;
	width: 100%;
	border-radius: 24rpx;
	background: rgba(10, 15, 45, 0.04);
	padding: 20px 32rpx;
	.title {
		margin-bottom: 16px;
		height: 44rpx;
		font-size: 16px;
		line-height: 44rpx;
		color: #0A0F2D;
	}
	.item {
		margin-top: 8px;
		display: flex;
		align-items: center;
		.item-title {
			font-size: 14px;
			color: #64696F;
			padding-right: 52rpx;
			line-height: 40rpx;
		}
		.item-content {
			height: 40rpx;
			display: flex;
			align-items: flex-end;
			font-size: 14px;
			color: #0A0F2D;
			.small-text {
				font-size: 12px;
				color: rgba(10, 15, 45, 0.5);
				transform: translateY(-2rpx);
			}
		}
	}
	.item:first-child {
		margin-top: 0;
	}
}

.bottom-link {
	margin-top: 12px;
	height: 80rpx;
	line-height: 80rpx;
	font-size: 14px;
	color: rgba(10, 15, 45, 0.5);
	text-align: center;
}
</style>