<template>
	<view class="pay-mode">
		<view class="top-title">
			<view class="first-title">期末买断金额为￥{{payInfo.buyoutsFee}}</view>
			<view class="first-title">您可能会选择的支付方式为？</view>
			<view class="second-title">订阅期结束30天前，您可以随时变更方案</view>
		</view>
		
		<view class="btn-title">
			<view class="pay-all" @click="payAll"><view class="title">支付全款</view><view class="text">仅需再支付{{payInfo.fullPayment}}即可</view></view>
			<view class="by-stages" @click="payStages"><view class="title">金融分期</view><view class="text">月供仅需￥{{payInfo.minMonthPayment}}起</view></view>
		</view>
		<view class="popup-box">
			<u-popup
			    v-model="showPoup"
			    :safe-area-inset-bottom="true"
			    mode="center"
			    border-radius="14">
			    <view class="u-padding-48">
			        <view class="popups">
			        	<view class="title">支付全款</view>
			        	<view class="text">订阅期结束30天前，您可以随时变更方案</view>
			        </view>
			        <view class="rows" style="">
			        	<text span="5">买断金额:</text>
			        	<text span="7">{{allInfo.buyoutsFee}}元</text>
			        </view>
			        <view class="rows" style="margin-top:16rpx;margin-bottom:32rpx;">
			        	<text span="5">保证抵扣金:</text>
			        	<text span="7">{{allInfo.deposit}}元</text>
			        </view>
					<u-line></u-line>
			        <view class="rows" style="margin-top:32rpx">
			        	<text span="5">仅需支付:</text>
			        	<text span="7">{{allInfo.fullPayment}}元</text>
			        </view>
					
			        <view class="completeT" @click="completeBtn">完成</view>
			    </view>
			</u-popup>
		</view>
		
		<view>
			<u-modal @confirm="confirm" v-model="showModal" title=" ">
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
				showPoup: false,
				showModal:false,
				src:"https://image.51cheyaoshi.com/xcx/app/static/complete.png",
				id:'',
				payInfo:{},
				planId:'',
				configId:'',
				allInfo:{},
				cartype: null, // 1.新车 2.二手车
			}
		},
		onLoad(option){
			this.id = option.id
			this.planId = option.planId
			this.configId = option.configId
			this.cartype = option.cartype // 1.新车 2.二手车
			this.getTradition()
		},
		methods: {
			// 支付全款
			payAll() {
				this.$getRequest(this.$url.getFullPaymentPrice, 'GET', {
					id: this.planId,
					newOrOld: this.cartype
				}).then((data) => {
					if(data.code == 0){
						this.allInfo = data.data?data.data:{},
						this.showPoup= true
					}
				})
			},
			confirm(){
				uni.navigateTo({
					url: '/pages/home/profile/order-detail?orderId=' + this.id + '&cartype='+this.cartype
				})
			},
			completeBtn() {
				let params = {
					buyoutsFee: this.allInfo.buyoutsFee,
					deposit: this.allInfo.deposit,
					finalSelect: 1,
					id: this.configId,
					fullPayment:this.allInfo.fullPayment,
					newOrOld: 1
				}
				this.$getRequest(this.$url.updateUserCarSubscribeFinalBuyout,
					'POST', params).then(result => {
						if (result.code == 0) {
							this.showPoup = false
							this.showModal = true
							console.log(this.showModal)
						}
				})
				
			},
			payStages(){
				console.log('payStages')
				uni.navigateTo({
					url: '/pages/home/profile/scheme-trial?id='+this.id+'&planId='+this.planId+'&config='+this.configId+'&buyoutsFee='+this.payInfo.buyoutsFee+'&cartype='+this.cartype
				})
			},
			getTradition() {
				this.$getRequest(this.$url.getTradition, 'GET', {id:this.planId}).then((data) => {
					if(data.code == 0){
						this.payInfo = data.data?data.data:{}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pay-mode{
		padding: 0;
		margin: 36rpx 32rpx;
		.top-title {
			margin-top:80rpx;
			margin-bottom:66rpx;
			.first-title{
				font-size: 40rpx;
				font-weight: 500;
				color: #0A0F2D;
			}
			.second-title{
				font-size: 28rpx;
				font-weight: normal;
				line-height: 44rpx;
				color: rgba(10, 15, 45, 0.5);
				margino-top:16rpx;
			}
		}
		.btn-title{
			width: 100%;
			.pay-all{
				width: 90%;
				height: 158rpx;
				border-radius: 16rpx;
				margin: 40rpx auto 0 auto;
				background: #F5F6F7;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				.title{
					font-size: 34rpx;
					font-weight: 500;
					color: #0A0F2D;
				}
				.text{
					font-size: 24rpx;
					font-weight: normal;
					color: rgba(10, 15, 45, 0.6);
				}
			}
			.by-stages{
				width: 90%;
				height: 158rpx;
				border-radius: 16rpx;
				margin-top:40rpx;
				margin: 40rpx auto 0 auto;
				background: #F5F6F7;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				.title{
					font-size: 34rpx;
					font-weight: 500;
					color: #0A0F2D;
				}
				.text{
					font-size: 24rpx;
					font-weight: normal;
					color: rgba(10, 15, 45, 0.6);
				}
			}
		}
		.popup-box{
			.popups{
				.title{
					text-align: center;
					margin-top: 10rpx;
					font-size: 40rpx;
					font-weight: 500;
					color: #141414;
				}
				.text{
					margin: 10rpx 0 66rpx 0;
					text-align: center;
					font-size: 24rpx;
					font-weight: normal;
					color: rgba(10, 15, 45, 0.5);
				}
				
			}
			.rows{
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
			.completeT{
				margin: 60rpx auto 0 auto;
				width: 346rpx;
				height: 76rpx;
				border-radius: 8rpx;
				background: #0A0F2D;
				text-align: center;
				line-height: 76rpx;
				font-size: 34rpx;
				color: #FFFFFF;
			}
		}
	}
</style>