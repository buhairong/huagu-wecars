<template>
	<view class="content">
		<!--微信 price  银行 dataPrice-->
		<view :class="type==1?'price':'dataPrice' ">￥
			<text>{{price}}</text>  
		</view>
		<view class="dataView" v-if="type==2">
			{{createTime}}
		</view>
		<view class="price-mess"  v-if="type==1">
			<view class="mess">
				<text class="messTitle">支付时间：</text>
				<text class="messList">{{createTime}}</text>
			</view>
			<view class="mess">
				<text class="messTitle">交易单号：</text>
				<text class="messList">{{wxOrderNum}}</text>
			</view>
			<view class="mess" style="margin: 0;">
				<text class="messTitle">商户单号：</text>
				<text class="messList">{{orderNum}}</text>
			</view>
		</view>
	
		<view class="bankMess"  v-if="type==2">
			<view class="bank-title" >转账凭证</view>
			<view class="bank-img" v-if="bankBills.length==0" @click="imgAddFn()">
				<img src="https://image.51cheyaoshi.com/xcx/app/static/ordered/camera.png" alt="">
				<text>上传转账凭证</text>
			</view>
			
			<img mode="widthFix"  v-for="(v,i) in bankBills" :key="i" v-if="bankBills.length!=0" :src="v" alt="">
			<view class="btnText"  v-if="type==2">
				<view class="" @click="delFn()">删除转账记录</view>
			</view>
		</view>
		
	<!-- 	<view class="btnText"  v-if="type==2">
			<view class="" @click="delFn()">删除转账记录</view>
		</view> -->
		
	
	</view>
</template>

<script>
	
	export default {
	  data() {
		return {
		  id: '',//金额
		  type:'',//  1微信详情   2银行详情
		  leftoverPrice:0,//剩余价格
		  price:'',
		  bankBills:[],
		  createTime:'',
		  orderNum:'',
		  wxOrderNum:'',
		  userId:'',//用户id
		  imgArr:[],//图片合集
		}
	  },
	  onLoad(option){
		let weChat=uni.getStorageSync("weChat")
	  	this.type=option.type
		this.id=option.id
		this.selectPaymentDetail()
		this.userId=weChat.userId
	  },
	  methods: {
		  async uploadImhg(v){//上传凭证
		  	const createBankBill = await this.$getRequest(this.$url.createBankBill,'POST', {
		  		bankBills:v,
		  		id: this.id,
		  		userId: this.userId
		  	})
		  	if(createBankBill.code==0){
				uni.hideLoading()
				uni.showToast({
					title: '上传成功',
					duration: 2000,
					icon: 'none'
				});
		  		setTimeout(()=>{
					this.$u.route(`/pages/home/profile/addPay`);
				},500)
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
		  	  
		async selectPaymentDetail(v){
			const createBankBill = await this.$getRequest(this.$url.selectPaymentDetail,'GET', {
				id: this.id,
			})
			if(createBankBill.code==0){
				this.price=createBankBill.data.total
				this.bankBills=createBankBill.data.bankBills
				this.createTime=createBankBill.data.createTime
				this.orderNum=createBankBill.data.orderNum
				this.wxOrderNum=createBankBill.data.wxOrderNum
			}
		},
		async deleteBankBill(v){//上传凭证
			uni.showLoading({
				title: '上传中'
			});
			const createBankBill = await this.$getRequest(this.$url.deleteBankBill,'GET', {
				id: this.id,
			})
			console.log(createBankBill,'createBankBill');
			if(createBankBill.code==0){
				uni.hideLoading()
				// setTimeout(()=>{
					this.$u.route(`/pages/home/profile/addPay`);
				// },500)
			}
		},
		delFn(){
			uni.showModal({
			    title: '删除转账记录',
			    content:`银行转账记录删除后不可恢复，为保障您的权益请谨慎删除！`,
			   	confirmText: "确认删除",//这块是确定按钮的文字
				cancelText:"取消",//这块是取消的文字
				success: (res)=> {
			        if (res.confirm) {
			            console.log('用户点击确定');
						this.deleteBankBill()
						
			        } else if (res.cancel) {
						
			        }
			    }
			});
		}
	  }
	}
</script>
<style lang="scss" scoped>
	// page{
	// 	height: 100% !important;
	// }
	.content{
		width: 100%;
		height: 100%;
		padding: 0 16px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		padding-bottom: 30px;
		// position: relative;
		.dataPrice{
			font-size: 18px;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 32px;
			width: 100%;
			font-family: DIN-Medium;
			font-weight: normal;
			line-height: 48px;
			letter-spacing: 0px;
			color: #0A0F2D;
			// margin-bottom: 4px;
			text{
				font-size: 32px;
				margin-right: 3px;
			}
		}
		.dataView{
			text-align: center;
			height: 22px;
			font-family: PingFangSC-Regular;
			font-size: 14px;
			font-weight: normal;
			line-height: 22px;
			letter-spacing: 0px;
			color: rgba(10, 15, 45, 0.5);
			margin-bottom: 32px;
		}
		.bankMess{
			padding-bottom: 100px;
			position: relative;
			.bank-title{
				height: 24px;
				font-family: PingFangSC-Medium;
				font-size: 17px;
				font-weight: 500;
				line-height: 24px;
				letter-spacing: 0px;
				color: #0A0F2D;
				margin-bottom: 16px;
			}
			.bank-img{
				width: 88px;
				height: 88px;
				border-radius: 4px;
				background: rgba(10, 15, 45, 0.04);
				box-sizing: border-box;
				border: 0.5px dashed rgba(10, 15, 45, 0.1);
				display: flex;
				flex-direction: column;
				align-items: center;
				margin-bottom: 250px;
				img{
					width: 32px;
					height: 32px;
					border-radius: 2px;
				}
				text{
					margin-top: 4px;
					width: 72px;
					height: 17px;
					font-family: SourceHanSansCN-Regular;
					font-size: 12px;
					font-weight: normal;
					line-height: 17px;
					letter-spacing: 0em;
					color: rgba(10, 15, 45, 0.5);
				}
			}
			img{
				margin-top: 16px;
				width: 100%;
				// height: auto;
			}
		}
		.btnText{
			// margin-bottom: 41px;
			margin-top: 20px;
			width: 100%;
			height: 48px;
			border-radius: 8px;
			font-family: PingFangSC-Medium;
			font-size: 15px;
			font-weight: 500;
			line-height: 48px;
			text-align: center;
			letter-spacing: 0px;
			color: #0A0F2D;
			// padding-right:32px;
			box-sizing: border-box;
			position: absolute;
			bottom: 40px;
			// background-color: pink;
			view{
				border-radius: 8px;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 100%;
				width: 100%;
				background: rgba(10, 15, 45, 0.04);
				// background-color: palegreen;
			}
		}
		.price{
			font-size: 18px;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 32px 0;
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
		.price-mess{
			padding: 20px 16px;
			box-sizing: border-box;
			width: 100%;
			border-radius: 12px;
			background: #FFFFFF;
			box-shadow: 0px -2px 32px 0px rgba(10, 15, 45, 0.02),0px 8px 24px 0px rgba(10, 15, 45, 0.04);
			.mess{
				display: flex;
				margin-bottom: 8px;
				.messTitle{
					height: 22px;
					font-family: PingFangSC-Regular;
					font-size: 14px;
					font-weight: normal;
					line-height: 22px;
					letter-spacing: 0px;
					color: #64696F;
					margin-right: 12px;
					white-space: nowrap;
				}
				.messList{
					// word-wrap: break-word;
					word-break: break-all;
					// display: flex;
					// white-space: wrap;
					font-family: PingFangSC-Regular;
					font-size: 14px;
					font-weight: normal;
					line-height: 22px;
					letter-spacing: 0px;
					color: #0A0F2D;
				}
			}
		}
	}
	
</style>