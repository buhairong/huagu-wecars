<template>
	<view class="content">
		<view class="priceView">
			<view class="title">支付金额</view>
			<view class="payPrice">
				<text>￥</text>
				<u-input
					class='input'
					placeholder="请输入支付价格"
					v-model="total"
					@input="change()"
					color='#0A0F2D'
				></u-input>
				<img src="https://image.51cheyaoshi.com/xcx/app/static/home/pencil.png" alt="">
			</view>
			<view class="leftover-price" v-if="total!=price">
				剩余￥{{leftoverPrice.toFixed(2)}}待支付
			</view>
			<view class="text">
				若您支付金额超出最大额度，请分笔支付或更换其他支付方式。
			</view>
		</view>
		<view class="btnText" @click="handlePay()">
			立即支付
		</view>
		<!-- <view class="text" @click="bankFn()">
			各银行交易限额表
		</view> -->
	</view>
</template>

<script>
	export default {
	  data() {
		return {
		  total: '',//输入的价格
		  price:'',//总价格
		  leftoverPrice:0,//剩余价格
		  businessId:'',
		  businessType: '',
		  openid: "",
		  payType: '',
		  userId: '',
		}
	  },
	  onLoad(option){
		let weChat=	uni.getStorageSync("weChat")
		this.businessId=weChat. businessId
		this.businessType=weChat. businessType
		this.openid=weChat.openid
		this.payType=weChat. payType
		this.price=option.price
		this.userId=weChat.userId 
		this.total=option.price
	  },
	  methods: {
		change() {
			if(this.price*1-this.total*1<0){
				uni.showToast({
				    title: '支付金额不能大于实际金额',
				    duration: 2000,
				    icon: 'none'
				});
			}else{
				this.leftoverPrice=this.price*1-this.total*1
			}
		},
		async handlePay() {//去支付
			if(this.price*1-this.total*1<0){
				uni.showToast({
					title: '支付金额不能大于实际金额',
					duration: 2000,
					icon: 'none'
				});
				return
			}
			// 1.拉起微信支付
			uni.showToast({
				title: '微信支付中',
				duration: 2000,
				icon: 'loading'
			})
			// 2.创建微信订单
			this.$requestPayment({
				businessId: this.businessId, // 订单ID
				businessType:this.businessType, // 支付类型
				openid: this.openid,
				payType:this.payType, // 业务类型
				total: this.total, // TODO 0.01
				// total: 0.01, // TODO 0.01
				userId: this.userId,
			}, (res) => {
				console.log(res);
				if(res == 'success') {
					uni.navigateTo({url: `/pages/home/profile/addPay`})
				}
			})
			uni.hideLoading()
		},
		bankFn(){
			uni.navigateTo({url: `/pages/home/profile/bank`})
		}
	  }
	}
</script>

<style lang="scss" scoped>
	.content{
		padding: 0 16px;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		flex-direction: column;
		.priceView{
			padding: 20px 16px;
			margin-top: 12px;
			width: 100%;
			border-radius: 12px;
			background: #FFFFFF;
			box-shadow: 0px -2px 32px 0px rgba(10, 15, 45, 0.02),0px 8px 24px 0px rgba(10, 15, 45, 0.06);
			.title{
				font-family: PingFangSC-Medium;
				font-size: 14px;
				font-weight: 500;
				line-height: 24px;
				letter-spacing: 0px;
				color: #0A0F2D;
				margin-bottom: 12px;
			}
			.payPrice{
				display: flex;
				align-items: center;
				text{
					text-align: left;
					font-family: PingFangSC-Medium;
					font-size: 18px;
					font-weight: 500;
					line-height: 24px;
					letter-spacing: 0px;
					color: #0A0F2D;
				}
				.u-input__input{
					width: 20px;
					height: 48px;
					font-family: PingFangSC-Medium;
					font-size: 32px;
					font-weight: 500;
					line-height: 48px;
					letter-spacing: 0px;
					color: #0A0F2D;
				}
				img{
					width: 15px;
					height: 15px;
				}
			}
			.leftover-price{
				display: flex;
				align-items: center;
				padding: 8px;
				box-sizing: border-box;
				width: 100%;
				height: 34px;
				border-radius: 4px;
				background: rgba(10, 15, 45, 0.04);
				font-family: PingFangSC-Regular;
				font-size: 12px;
				font-weight: normal;
				line-height: 18px;
				letter-spacing: 0px;
				color: rgba(10, 15, 45, 0.5);
				margin-bottom: 12px;
			}
			.text{
				width: 100%;
				font-family: PingFangSC-Regular;
				font-size: 12px;
				font-weight: normal;
				line-height: 18px;
				letter-spacing: 0px;
				color: rgba(10, 15, 45, 0.8);
			}
		
		}
		
		.btnText{
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 32px;
			width: 100%;
			height: 58px;
			border-radius: 8px;
			background: #0A0F2D;
			font-family: PingFangSC-Medium;
			font-size: 17px;
			font-weight: 500;
			line-height: 24px;
			text-align: center;
			letter-spacing: 0px;
			color: #FFFFFF;
			margin-bottom: 16px;
		}
		.text{
			width: 100%;
			text-align: center;
			font-family: PingFangSC-Regular;
			font-size: 12px;
			font-weight: normal;
			line-height: 18px;
			letter-spacing: 0px;
			color: #197EF5;
		}
	}
</style>