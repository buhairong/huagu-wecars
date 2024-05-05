<template>
	<view class="content">
		<view class="priceView">
			<view class='title'>转账金额</view>
			<view class="payPrice">
				<text>￥</text>
				<u-input
					placeholder="请输入支付价格"
					v-model="value"
					@input="change()"
					type="digit"
					fontSize='32px'
					color='#0A0F2D'
				></u-input>
				<img src="https://image.51cheyaoshi.com/xcx/app/static/home/pencil.png" alt="">
			</view>
			<view class="leftover-price" v-if="value!=price">
				剩余￥{{leftoverPrice.toFixed(2)}}待支付
			</view>
			<view class="text">
				使用银行转账成功后请务必保存并上传转账凭证。
			</view>
		</view>		
		<view class="btnText" @click="handlePay">使用银行转账</view>
	</view>
</template>

<script>
	export default {
	  data() {
		return {
		  value: '',//输入的价格
		  price:'',//总价格
		  leftoverPrice:0,//剩余价格
		  
		}
	  },
	  onLoad(option){
		let weChat=	uni.getStorageSync("weChat")
	  	this.price=option.price
		this.value=option.price
		this.businessId=weChat.businessId // 订单ID
		this.businessType=weChat.businessType  // 支付类型
		this.userId=weChat.userId 
	  },
	  methods: {
		  async handlePay() {//银行卡支付
			  if(this.price*1-this.value*1<0){
				uni.showToast({
					title: '支付金额不能大于实际金额',
					duration: 2000,
					icon: 'none'
				});
				return
			  }
			const orderInfo = await this.$getRequest(this.$url.createBankAccount, 'POST', {
			   	businessId: this.businessId, // 订单ID
			   	businessType:this.businessType, // 支付类型
			   	payType:6, // 业务类型
			   	// total: 0.01, // TODO 0.01
				total: this.value, // TODO 0.01
			   	userId: this.userId,
			})
			console.log(orderInfo,'orderInfo');
			if(orderInfo.code==0){
				this.$u.route(`/pages/home/profile/bankImg?id=${orderInfo.data}&price=${this.value}`);
			}
		  	uni.hideLoading()
		  },
		change() {
			if(this.price*1-this.value*1<0){
				uni.showToast({
				    title: '支付金额不能大于实际金额',
				    duration: 2000,
				    icon: 'none'
				});
			}else{
				this.leftoverPrice=this.price*1-this.value*1
			}
		},
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
				.u-input{
					width: 20px;
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
				text-align: left;
				margin-top: 6px;
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