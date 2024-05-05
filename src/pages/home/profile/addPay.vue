<template>
	<view class="content">
		<view class="title" v-if="(price-totalPayment)!=0">支持微信支付及银行转账混合分笔支付</view>
		<view class="price" v-if="(price-totalPayment)!=0">￥
			<text v-if="priceList.length==0">{{price.toFixed(2)}}</text>  
			<text v-if="priceList.length!=0">{{setPrice()}}</text>
			<view @click="isShow()">
				<u-icon name="info-circle"></u-icon>
			</view>
		</view>
		<view class="payment" v-if="(price-totalPayment)==0">
			<img src="https://image.51cheyaoshi.com/xcx/app/static/ordered/complete.png" alt="">
			<view class="">支付成功</view>
			<text>请耐心等待金融方审核</text>
		</view>
		
		
		<view class="priceList" v-if="priceList.length!=0">
			<view class="list" v-for="(v,i) in priceList" :key="i" @click="messListFn(v.payWay,v.id)">
				<view class="list-left">
					<view class="list-text">
						<view>第{{i+1}}笔账单 <text class="isImg" v-if="v.payWay!=1&&v.hasBills==0">待上传凭证</text></view>
						<view>-￥{{v.total}}</view>
					</view>
					<view class="list-data">
						<text >{{v.createTime}}</text>
						<text>{{v.payWay==1?'微信支付':'银行转账'}}</text>
					</view>
				</view>
				<u-icon name="arrow-right"></u-icon>
			</view>
		</view>
		<view v-if="priceList.length!=0&&(price-totalPayment)!=0" class="leftover-price" >剩余￥{{setPrice()}}待支付</view>
		
		<view :class="index==0 ?'btnText':'falText'" @click="rou(1)" style="margin-top: 32px;"  v-if="(price-totalPayment)!=0">
			<view>微信支付</view>
		</view>
		<view  :class="index==1 ?'btnText':'falText'" @click="rou(2)"  v-if="(price-totalPayment)!=0">
			<view>银行转账</view>
		</view>
		<view  class="btnText" @click="rou(3)"  v-if="(price-totalPayment)==0" style="margin-top: 32px;">
			<view>查看订单</view>
		</view>
		
		<!-- 弹窗 -->
		<view>
			<u-popup v-model="show" @close="close" @open="open" mode="center" :round="24">
				<view class="popupView">
					<text class="popup-title">费用明细</text>
					<view class="popup-list">
						<view>
							<text class="list-title">订阅费用</text>
							<text class="list-price">￥{{payOffPrice}}</text>
						</view>
						<view v-if="addedDeposit!=null">
							<text class="list-title">加收保证金</text>
							<text class="list-price">￥{{addedDeposit}}</text>
						</view>
						<view>
							<text class="list-title">牌照费用</text>
							<text class="list-price">￥{{plateTotalPrice}}</text>
						</view>
					</view>
					<view class="popup-list" style="border: none;">
						<view>
							<text class="list-title">总计</text>
							<text class="list-price">￥{{price}}</text>
						</view>
					</view>
				</view>
			</u-popup>
		</view>
	
	</view>
</template>

<script>
	export default {
		data(){
			return{
				price:0,
				index:0,
				show: false,
				customStyle:{
					width: '300px'
				},
				businessId:'',
				businessType:'',
				priceList:[],
				totalPayment:0,//支付过的总金额
				addedDeposit:'', //加收保证金
				payOffPrice:'',//订阅费用
				plateTotalPrice:'',  //牌照价格
			}
		},
		onLoad(option){
			let weChat=	uni.getStorageSync("weChat")
			this.price=weChat.price
			this.businessId=weChat.businessId
			this.businessType=weChat.businessType
			this.selectPaymentDetailList()
			this.addedDeposit=weChat.addedDeposit  
			this.payOffPrice=weChat.payOffPrice      
			this.plateTotalPrice= weChat.plateTotalPrice   
			
			 
		},
		onShow(){
			this.selectPaymentDetailList()
		},
		methods:{
			setPrice(){//剩余金额
				return (this.price - this.totalPayment).toFixed(2)
			},
			async selectPaymentDetailList() {// 查询支付列表
				uni.showLoading({
				    title: '加载中'
				});
				const orderInfo = await this.$getRequest(this.$url.selectPaymentDetailList, 'POST', {
				    businessId: this.businessId,
					businessType: this.businessType,
					payType:6,//0账户充值、1订单扣费、2订单退款、3订金支付、4尾款支付、5购买产品、6订阅费用、7二手车分期首付
				})
				if(orderInfo.code==0){
					this.priceList=orderInfo.data.details
					this.totalPayment=orderInfo.data.totalPayment
				}
				uni.hideLoading()
			},
			rou(v){
				if(this.priceList.length==0){
					if(v==1){
						this.$u.route(`/pages/home/profile/wxPrice?price=${this.price*1}`);
					}else if(v==2){
						this.$u.route(`/pages/home/profile/bankPrice?price=${this.price*1}`);
					}
				}else{
					const orderId = uni.getStorageSync('orderId')
					if(v==1){
						this.$u.route(`/pages/home/profile/wxPrice?price=${this.price*1-this.totalPayment}`);
					}else if(v==2){
						this.$u.route(`/pages/home/profile/bankPrice?price=${this.price*1-this.totalPayment}`);
					}else if(v==3){
						this.$u.route(`/pages/home/profile/order-detail?orderId=${orderId}`);
					}
				}

			},
			open() {
			          // console.log('open');
			},
			close() {
			  this.show = false
			  // console.log('close');
			},
			isShow(){	
				console.log('show-------');
				this.show = true
			},
			messListFn(v,i){
				// if(v==1){
					this.$u.route(`/pages/home/profile/wxMinute?type=${v}&id=${i}`);
				// }else{
				// 	this.$u.route(`/pages/home/profile/wxMinute?type=${v}`);
				// }
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		width: 100%;
		padding-bottom: 200px;
		.title{
			margin-top: 32rpx;
			width: 100%;
			text-align: center;
			font-family: PingFangSC-Medium;
			font-size: 16px;
			font-weight: 500;
			line-height: 24px;
			letter-spacing: 0px;
			color: #0A0F2D;
		}
		.price{
			font-size: 18px;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 12px;
			margin-bottom: 32px;
			width: 100%;
			height: 48px;
			font-family: DIN-Medium;
			font-weight: normal;
			line-height: 48px;
			letter-spacing: 0px;
			color: #0A0F2D;
			text{
				font-size: 32px;
				margin-right: 3px;
			}
		}
		
		.payment{
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			margin-bottom: 32px;
			img{
				width: 66.67px;
				height: 66.67px;
				margin-bottom: 18px;
				margin-top: 22px;
			}
			view{
				font-family: PingFangSC-Medium;
				font-size: 18px;
				font-weight: 500;
				line-height: 28px;
				text-align: center;
				letter-spacing: 0px;
				color: #000000;
				margin-bottom: 4px;
			}
			text{
				font-family: PingFangSC-Regular;
				font-size: 14px;
				font-weight: normal;
				line-height: 22px;
				letter-spacing: 0px;
				color: rgba(10, 15, 45, 0.5);
			}
		}
		.priceList{
			.list{
				margin-bottom: 12px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 16px;
				box-sizing: border-box;
				width: 100%;
				height: 76px;
				border-radius: 12px;
				background: #FFFFFF;
				box-shadow: 0px -2px 32px 0px rgba(10, 15, 45, 0.02),0px 8px 24px 0px rgba(10, 15, 45, 0.04);
				.list-left{
					flex:1;
					.list-text{
						width: 100%;
						display: flex;
						justify-content: space-between;
						padding-right: 9px;
						view{
							font-family: PingFangSC-Regular;
							font-size: 17px;
							font-weight: normal;
							line-height: 24px;
							letter-spacing: 0px;
							color: #0A0F2D;
							.isImg{
								padding: 0 8px;
								margin-left: 8px;
								height: 22px;
								border-radius: 27px;
								background: #F5AA19;
								font-family: PingFangSC-Medium;
								font-size: 12px;
								font-weight: 500;
								line-height: 22px;
								text-align: center;
								letter-spacing: 0px;
								color: #FFFFFF;
							}
						}
						
					}
					.list-data{
						width: 100%;
						display: flex;
						justify-content: space-between;
						padding-right: 9px;
						font-family: PingFangSC-Regular;
						font-size: 12px;
						font-weight: normal;
						line-height: 20px;
						letter-spacing: 0px;
						color: rgba(10, 15, 45, 0.5);
					}
				}
			}
		}
		.leftover-price{
			margin-left: 16px;
			font-family: PingFangSC-Regular;
			font-size: 12px;
			font-weight: normal;
			line-height: 18px;
			letter-spacing: 0px;
			color: rgba(10, 15, 45, 0.5);
			margin-bottom: 32px;
		}
		.btnText{
			view{
				width: 100%;
				height: 58px;
				border-radius: 8px;
				background: #0A0F2D;
				font-family: PingFangSC-Medium;
				font-size: 17px;
				font-weight: 500;
				line-height: 58px;
				text-align: center;
				letter-spacing: 0px;
				color: #FFFFFF;
				margin-bottom: 20px;
			}
		}
		.falText{
			width: 100%;
			view{
				width: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				height: 58px;
				border-radius: 8px;
				background: rgba(10, 15, 45, 0.04);
				font-family: PingFangSC-Medium;
				font-size: 17px;
				font-weight: 500;
				line-height: 26px;
				text-align: center;
				letter-spacing: 0px;
				color: #0A0F2D;
			}
			
		}
		.popupView{
			width: 297px;
			height: 258px;
			border-radius: 12px;
			background: #FFFFFF;
			padding: 32px 25px;
			box-sizing: border-box;
			.popup-title{
				display: flex;
				justify-content: center;
				width: 100%;
				margin-bottom: 32px;
				font-family: PingFangSC-Medium;
				font-size: 20px;
				font-weight: 500;
				line-height: 30px;
				letter-spacing: 0px;
				color: #141414;
			}
			.popup-list{
				width: 100%;
				margin-bottom: 8px;
				border-bottom: 1px solid #EEEEEE;
				view{
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 8px;
				}
			}
			.list-title{
				font-family: PingFangSC-Regular;
				font-size: 14px;
				font-weight: normal;
				line-height: 22px;
				letter-spacing: 0px;
				color: #64696F;
			}
			.list-price{
				font-family: PingFangSC-Regular;
				font-size: 14px;
				font-weight: normal;
				line-height: 22px;
				letter-spacing: 0px;
				color: #141414;
			}
		}
	
	}
</style>