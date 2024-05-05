<template>
	<view class="endEriodOption">
		<view class="top-title">
			<view class="first">订阅期结束后，您会计划？</view>
			<view class="second">订阅期结束30天前，您可以随时变更方案</view>
		</view>
		
		<view class="btn-title" v-for='(item,index) in btnTitle' :key="index">
			<view class="buy-out" :class="{'active': btnActive == index}" @click="toggleBtn(index)">{{item.name}}</view>
		</view>
		
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
			}
		},
		onLoad(option){
			this.id = option.id
			this.planId = option.planId
			this.configId = option.configId
			this.cartype = option.cartype // 1.新车 2.二手车
		},
		methods:{
			toggleBtn(index) {
				this.btnActive = index
				if(index == 0){
					uni.navigateTo({
						url:'./pay-mode?id='+this.id+'&planId='+this.planId+'&configId='+this.configId + '&cartype='+this.cartype
					})
				}else if(index==1){
					this.showModal=true
				}else {
					uni.navigateTo({
						url: '/pages/home/profile/order-detail?orderId=' + this.id
					})
				}
			},
			// 弹框确认按钮
			gotoDetail(){
				uni.navigateTo({
					url: '/pages/home/profile/order-detail?orderId=' + this.id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.endEriodOption{
		padding: 0;
		margin: 36rpx 32rpx;
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
				width: 90%;
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
</style>