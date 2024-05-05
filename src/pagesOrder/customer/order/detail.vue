<template>
	<view class="wrap" v-if="detail">
		<view class="header">
			<CarInfoHeader :carInfo="detail.carTypeYearProduct" />
		</view>
		
		<view class="container">
			<view class="card">
				<view class="card-title-wrap">
					<u-section
						title="承租人" 
						line-color="#0AEB7D"
						font-size="34"
						color="#0A0F2D"
						:right="false"
					></u-section>
					<view class="link-text" @click="openContract">查看合同</view>
				</view>
				
				<view class="card-item-wrap">
					<view class="card-item" v-if="detail.userCarFinanceLeaseSubscribe.orderType === 2">
						<view class="label">公司名称</view>
						<view class="right">{{detail.userCompanyEntity.companyName}}</view>
					</view>
					
					<view class="card-item">
						<view class="label">姓名</view>
						<view class="right">{{detail.userEntity.name}}</view>
					</view>
					
					<view class="card-item">
						<view class="label">身份证件号</view>
						<view class="right">{{detail.userInfoEntity.idcard}}</view>
					</view>
				</view>
			</view>
			
			<view class="card">
				<view class="card-title-wrap">
					<u-section
						title="方案信息" 
						line-color="#0AEB7D"
						font-size="34"
						color="#0A0F2D"
						:right="false"
					></u-section>
				</view>
				
				<view class="card-item-wrap">
					<view class="card-item">
						<view class="label">设备金额</view>
						<view class="right" @click="toggleDeviceBlock">
							{{detail.userCarFinanceLeaseSubscribe.equipmentAmount | $numFormat}}元
							<u-icon
								style="padding-left: 8rpx;"
								:name="showDeviceBlock ? 'arrow-down' : 'arrow-up'" 
								color="rgba(10, 15, 45, 0.8)" 
								size="28"
							></u-icon>
						</view>
					</view>
					
					<view class="block-item-wrap" v-if="showDeviceBlock">
						<view class="item">
							<view class="item-title">车辆价格</view>
							<view class="item-content">{{detail.userCarFinanceLeaseSubscribe.companyQuotation | $numFormat}}元</view>
						</view>
						<view class="item">
							<view class="item-title">购 置 税</view>
							<view class="item-content">{{detail.userCarFinanceLeaseSubscribe.tax | $numFormat}}元</view>
						</view>
						<view class="item">
							<view class="item-title">装潢费用</view>
							<view class="item-content">{{detail.userCarFinanceLeaseSubscribe.decorationExpenses | $numFormat}}元</view>
						</view>
						<view class="item">
							<view class="item-title">保险费用</view>
							<view class="item-content">{{detail.userCarFinanceLeaseSubscribe.insuranceExpenses | $numFormat}}元</view>
						</view>
					</view>
					
					<view class="card-item">
						<view class="label">融资年限</view>
						<view class="right">{{SUBSCRIBE_PERIOD_STATUS[detail.userCarFinanceLeaseSubscribe.insureYear]}}</view>
					</view>
					
					<view class="card-item">
						<view class="label">车辆押金</view>
						<view class="center">（{{(detail.userCarFinanceLeaseSubscribe.deposit/detail.userCarFinanceLeaseSubscribe.equipmentAmount*100).toFixed(2)}}%）</view>
						<view class="right">{{detail.userCarFinanceLeaseSubscribe.deposit | $numFormat}}元</view>
					</view>
					
					<view class="card-item">
						<view class="label">首付金额</view>
						<view class="right">{{detail.userCarFinanceLeaseSubscribe.downPayment | $numFormat}}元</view>
					</view>
					
					<view class="card-item">
						<view class="label">月供金额</view>
						<view class="right">{{detail.userCarFinanceLeaseSubscribe.firstMonthMoney | $numFormat}}元</view>
					</view>
					
					<view class="card-item">
						<view class="label">留购费用</view>
						<view class="right">{{detail.userCarFinanceLeaseSubscribe.hirePurchaseMoney | $numFormat}}元</view>
					</view>
					
					<view class="card-item">
						<view class="label">手续费</view>
						<view class="right">{{detail.userCarFinanceLeaseSubscribe.commission | $numFormat}}元</view>
					</view>
				</view>
			</view>
			
			<view class="card">
				<view class="card-title-wrap">
					<u-section
						title="车辆信息" 
						line-color="#0AEB7D"
						font-size="34"
						color="#0A0F2D"
						:right="false"
					></u-section>
				</view>
				
				<view class="card-item-wrap">
					<view class="card-item">
						<view class="label">车辆牌照</view>
						<view class="right">{{detail.userCarFinanceLeaseSubscribe.plateNum}}</view>
					</view>
					
					<view class="card-item">
						<view class="label">车 架 号</view>
						<view class="right">{{detail.userCarFinanceLeaseSubscribe.vimNum}}</view>
					</view>
					
					<view class="card-item">
						<view class="label">外观颜色</view>
						<view class="right">{{detail.userCarFinanceLeaseSubscribe.outColor}}</view>
					</view>
					
					<view class="card-item">
						<view class="label">内饰颜色</view>
						<view class="right">{{detail.userCarFinanceLeaseSubscribe.inColor}}</view>
					</view>
					
					<view class="card-item">
						<view class="label">交强险到期日</view>
						<view class="right">{{detail.userCarFinanceLeaseSubscribe.compulsoryInsuranceEndDate.slice(0, 10)}}</view>
					</view>
					
					<view class="card-item">
						<view class="label">商业险到期日</view>
						<view class="right">{{detail.userCarFinanceLeaseSubscribe.commercialInsuranceEndDate.slice(0, 10)}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { SUBSCRIBE_PERIOD_STATUS, IMG_ACCEPT } from "@/constants"
import CarInfoHeader from '../../components/CarInfoHeader.vue'

export default {
	components: {
	  CarInfoHeader,
	},
	
	data() {
		return {
			SUBSCRIBE_PERIOD_STATUS,
			orderId: null,
			detail: null,
			userInfo: null,
			showDeviceBlock: true,
		}
	},
	
	computed: {
		
	},
	
	onLoad(options) {
		this.orderId = options.orderId
	},
	
	onShow() {
		this.getCarRentalOrderDetail()
		getApp().globalData.getUserInfo((data) => {
			this.userInfo = data
		})
	},
	
	methods: {
		toggleDeviceBlock() {
			this.showDeviceBlock = !this.showDeviceBlock
		},
		
		async getCarRentalOrderDetail() {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				id: this.orderId,
			}
			
			const res = await this.$getRequest(this.$url.getCustomerRentalOrderDetail, 'GET', params)
			
			uni.hideLoading()
			
			if (res.code === 0) {
				this.detail = res.data
			}
		},
		
		openContract() {
			const file = this.detail.userCarFinanceLeaseSubscribe.contractUrlList[0]
			console.log('file', file)
			const arr = file.split('.')
			const ext = arr[arr.length-1].toLowerCase()
			console.log('ext', ext)
			if (IMG_ACCEPT.includes(ext)) {
				this.preview(0, this.detail.userCarFinanceLeaseSubscribe.contractUrlList)
			} else {
				//this.openFile(file)
				uni.setStorageSync('url', file)
				uni.navigateTo({
					url: `/pages/home/profile/wxbview`
				})
			}
		},
		
		openFile(url) {
			console.log('filePath', url)
			uni.showLoading({
				title: '加载中'
			})
			uni.downloadFile({
			  url,
			  success: (res) => {
			    const filePath = res.tempFilePath
			    uni.openDocument({
			      filePath,
			      success: (res) => {
			        console.log('打开文档成功')
			      },
						fail: (err) => {
							console.log('openDocument', err)
						},
						complete: () => {
							uni.hideLoading()
						}
			    })
			  },
				fail: (err) => {
					console.log('downloadFile', err)
				},
				complete: () => {
					uni.hideLoading()
				}
			})
		},
		
		preview(current, urls) {
			uni.previewImage({
				current,
				urls,
			})
		},
		
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";	

.wrap {
	padding: 32rpx 0 200rpx;
	.header {
		margin-bottom: 60rpx;
		padding-right: 32rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.container {
		padding: 0 32rpx 40rpx;
		.card {
			.card-title-wrap {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
			.link-text {
				padding-left: 24rpx;
				height: 48rpx;
				font-size: 24rpx;
				line-height: 48rpx;
				color: #3446AA;
				text-decoration: underline;
			}
			.card-item-wrap {
				padding-left: 24rpx;
				.card-split-line {
					margin-top: 24rpx;
					width: 100%;
					height: 2rpx;
					background: #E1E1E1;
				}
				.card-item {
					margin-top: 24rpx;
					display: flex;
					justify-content: space-between;
					.label {
						height: 44rpx;
						font-size: 28rpx;
						line-height: 44rpx;
						color: rgba(10, 15, 45, 0.8);
					}
					.center {
						height: 44rpx;
						font-size: 28rpx;
						line-height: 44rpx;
						color: #BFBFBF;
					}
					.right {
						padding-left: 24rpx;
						font-size: 28rpx;
						line-height: 44rpx;
						color: rgba(10, 15, 45, 0.5);
						display: flex;
						align-items: center;
					}
				}
			}
		}
	}
}

.block-item-wrap {
	margin-top: 16rpx;
	padding: 24rpx 24rpx 0;
	border-radius: 8rpx;
	background: #F5F6F7;
	.item {
		margin-top: 0;
		padding-bottom: 24rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
}
</style>