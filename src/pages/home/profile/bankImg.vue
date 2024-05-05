<template>
	<view class="content">
		<view class="messView">
			<view class="messList">
				<text class='priceText'>收款金额：</text>
				<text class="mess-title">{{price}}元</text>
			</view>
			<view class="messList">
				<text class='priceText'>收款单位：</text>
				<text class="mess-title">{{companyName}}</text>
			</view>
			<view class="messList">
				<text class='priceText'>收款银行：</text>
				<text class="mess-title">{{bankName}}</text>
			</view>
			<view class="messList" style="margin: 0;">
				<text class='priceText'>收款账号：</text>
				<text class="mess-title">{{bankAccountId}}</text>
				<text class="text-view" @click="copyNumHandle()">复制</text>
			</view>
		</view>
		<view class="btnText" @click="imgAddFn">上传转账凭证</view>
	</view>
</template>

<script>
	export default {
	  data() {
		return {
		  value: '',//输入的价格
		  price:'',//总价格
		  leftoverPrice:0,//剩余价格
		  id:'',//流水id
		  userId:'',//	用户id
		  bankAccountId:'',//	收款银行账号	string	
		  bankName:'',//	收款银行名称	string	
		  companyName:'',//	公司名称
		  imgArr:[],//图片集合
		}
	  },
	  onLoad(option){
		let weChat=	uni.getStorageSync("weChat")
		this.id=option.id
		this.userId=weChat.userId 
		this.price=option.price
		this.selectReceiptBankAccountInfo()
	  },
	  methods: {
		  copyNumHandle(){
		  	uni.setClipboardData({
		  		data: this.bankAccountId, // data的值为你要复制的内容
		  		success: res => {
		  			console.log(res);
		  		}
		  	});
		  },
		async selectReceiptBankAccountInfo(v){
			const createBankBill = await this.$getRequest(this.$url.selectReceiptBankAccountInfo,'POST', {
				businessId: this.id,
				businessType: 2
			})
			console.log(createBankBill);
			if(createBankBill.code==0){
				this.bankAccountId=createBankBill.data.bankAccountId    //	收款银行账号	string
				this.bankName=createBankBill.data.bankName  //	收款银行名称	string	
				this.companyName=createBankBill.data.companyName   
			}
		},  
		async uploadImhg(v){
			let arr=[v]
			const createBankBill = await this.$getRequest(this.$url.createBankBill,'POST', {
				bankBills:arr,
				id: this.id,
				userId: this.userId
			})
			if(createBankBill.code==0){
				this.$u.route(`/pages/home/profile/addPay`);
			}
		},
		async imgArrFn(v){//上传图片
			const upload = await this.$getFileUpload(this.$url.upload, [v])
			if(upload.code == 0){
				this.imgArr.push(upload.data.src)
			}
			if(upload.code != 0) {
				uni.hideLoading()
			  uni.showToast({
				title: '上传失败',
				duration: 2000,
				icon: 'none'
			  });
			  return false;
			}
		},
		  imgAddFn(){
		  	let that = this
		  	uni.chooseImage({
		  	  success: async (chooseImageRes) => {
		  		uni.showLoading({
		  		  title: '上传中'
		  		});
		  		const tempFilePaths = chooseImageRes.tempFilePaths;
				console.log(tempFilePaths,'tempFilePathstempFilePaths');
				tempFilePaths.forEach((v)=>{
					this.imgArrFn(v)
				})
				
				setTimeout(()=>{
					uni.hideLoading()
					this.uploadImhg(this.imgArr)
				},2000)
		  	  }
		  	});
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
		.messView{
			padding: 20px 16px;
			box-sizing: border-box;
			margin-top: 12px;
			width: 100%;
			// height: 152px;
			border-radius: 12px;
			background: #FFFFFF;
			box-shadow: 0px -2px 32px 0px rgba(10, 15, 45, 0.02),0px 8px 24px 0px rgba(10, 15, 45, 0.04);
			.messList{
				display: flex;
				align-items: center;
				margin-bottom: 8px;
				.priceText{
					padding: 0;
					height: 22px;
					font-family: PingFangSC-Regular;
					font-size: 14px;
					font-weight: normal;
					line-height: 22px;
					letter-spacing: 0px;
					color: #64696F;
					margin-right: 19px;
				}
				.mess-title{
					height: 22px;
					font-family: PingFangSC-Regular;
					font-size: 14px;
					font-weight: normal;
					line-height: 22px;
					letter-spacing: 0px;
					color: #0A0F2D;
					margin-right: 17px;
				}
				.text-view{
					width: 32px;
					height: 20px;
					display: flex;
					justify-content: center;
					align-items: center;
					padding: 0px 4px;
					border-radius: 4px;
					background: rgba(10, 15, 45, 0.04);
					font-family: PingFangSC-Regular;
					font-size: 12px;
					font-weight: normal;
					line-height: 20px;
					letter-spacing: 0px;
					color: rgba(10, 15, 45, 0.8);
					z-index: 0
				}
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