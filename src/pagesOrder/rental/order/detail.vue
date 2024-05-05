<template>
	<view class="wrap" v-if="detail">
		<view class="header">
			<CarInfoHeader :carInfo="detail.carTypeYearProductVo" />
			<view class="status-wrap" :class="{'red-status': detail.status === 120}">
				<view class="status">{{CAR_RENTAL_ORDER_STATUS[detail.status]}}</view>
				<view class="time" v-if="detail.status === 40 && signToCancelTimeStr">{{signToCancelTimeStr}}</view>
			</view>
		</view>
		
		<view class="container">
			<view class="card">
				<view class="card-title-wrap">
					<u-section
						title="用车信息" 
						line-color="#0AEB7D"
						font-size="34"
						color="#0A0F2D"
						:right="false"
					></u-section>
					<!-- <view class="continue">续租</view> -->
				</view>
				
				<view class="card-item-wrap">
					<view class="period-wrap">
						<view class="period-tip">取车时间</view>
						<view class="period-box">
							<view class="line"></view>
							<view class="period">{{ detail.status >= 110 && detail.status != 120 ? '已结束' : `${detail.lastDays}天` }}</view>
							<view class="line"></view>
						</view>
						<view class="period-tip">还车时间</view>
					</view>
					
					<view class="pick-time-wrap">
						<view class="pick-time">
							{{formatDate(detail.startTime)}}
						</view>
						<view class="pick-time">
							{{formatDate(detail.endTime)}}
						</view>
					</view>
				</view>
				
				<view class="contract-link" @click="goElectronicContractPage" v-if="detail.status > 30 && detail.status !== 50">查看电子合同</view>
			</view>
			
			<view class="card">
				<view class="card-title-wrap">
					<u-section
						title="用车人" 
						line-color="#0AEB7D"
						font-size="34"
						color="#0A0F2D"
						:right="false"
					></u-section>
				</view>
				
				<view class="card-item-wrap">
					<view class="card-item">
						<view class="label">姓名</view>
						<view class="center">（接车时务必携带本人驾照）</view>
						<view class="right">{{detail.userName}}</view>
					</view>
					
					<view class="card-item">
						<view class="label">联系方式</view>
						<view class="right">{{detail.mobile}}</view>
					</view>
					
					<view class="card-item">
						<view class="label">取车地址</view>
						<view class="right addr-content">
							<template v-if="isModifyPickAddr">
								<input class="input" placeholder="请输入取车地址" v-model="pickCarAddr" />
								<view class="modify-btn-group">
									<view class="modify" @click="modifyAddr(1)">确定</view>
									<view class="modify cancel" @click="cancelModifyAddr">取消</view>
								</view>
							</template>
							<template v-else>
								<view class="addr">{{detail.pickUpAddress}}</view>
								<view class="modify" @click="updateAddr(1)" v-if="detail.status === 10 || detail.status === 30">修改</view>
							</template>
						</view>
					</view>
					
					<view class="card-item">
						<view class="label">还车地址</view>
						<view class="right addr-content">
							<template v-if="isModifyReturnAddr">
								<input class="input" placeholder="请输入还车地址" v-model="returnCarAddr" />
								<view class="modify-btn-group">
									<view class="modify" @click="modifyAddr(2)">确定</view>
									<view class="modify cancel" @click="cancelModifyAddr">取消</view>
								</view>
							</template>
							<template v-else>
								<view class="addr">{{detail.returnAddress}}</view>
								<view class="modify" @click="updateAddr(2)" v-if="detail.status === 10 || detail.status === 30">修改</view>
							</template>
						</view>
					</view>
				</view>
			</view>
			
			<view class="card" v-if="detail.status >= 70">
				<view class="card-title-wrap">
					<u-section
						title="车辆信息" 
						line-color="#0AEB7D"
						font-size="34"
						color="#0A0F2D"
						:right="false"
					></u-section>
					<view class="car-plate">{{detail.plateNum}}</view>
				</view>
				
				<view class="card-item-wrap">
					<view class="card-item">
						<view class="label">车型</view>
						<view class="right">{{detail.carTypeYearProductVo.carBrand}} {{detail.carTypeYearProductVo.carType}}</view>
					</view>
					
					<view class="card-item">
						<view class="label">款型</view>
						<view class="right">{{detail.carTypeYearProductVo.carTypeYear}} {{detail.carTypeYearProductVo.carTypeYearProduct}}</view>
					</view>
					
					<view class="card-item">
						<view class="label">外观颜色</view>
						<view class="right">{{detail.carColor}}</view>
					</view>
					
					<view class="card-item">
						<view class="label">验车信息</view>
						<view class="right" @click="confirmCarPhotos('preview')">
							查看详情
							<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
						</view>
					</view>
				</view>
			</view>
			
			<view class="card">
				<view class="card-title-wrap">
					<u-section
						title="费用明细" 
						line-color="#0AEB7D"
						font-size="34"
						color="#0A0F2D"
						:right="false"
					></u-section>
					<view class="total-pay">总计：¥{{(totalMonthPayment + detail.deposit + (detail.addDeposit || 0)) | $numFormat}}</view>
				</view>
				
				<view class="card-item-wrap">
					<view class="card-item">
						<view class="label">租车费用</view>
						<view class="center" v-if="detail.businessType === 1">（ {{detail.currentMonth}}/{{detail.monthTotal}}期 ）</view>
						<view class="right" @click="goSubOrderListPage">
							¥{{totalMonthPayment | $numFormat}}
							<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
						</view>
					</view>
					
					<view class="card-item">
						<view class="label">租车押金</view>
						<view class="right">¥{{detail.deposit | $numFormat}}</view>
					</view>
					
					<view class="card-item" v-if="detail.addDeposit">
						<view class="label">加收押金</view>
						<view class="right">¥{{detail.addDeposit | $numFormat}}</view>
					</view>
					
					<view class="card-item">
						<view class="label">取送车服务费</view>
						<view class="right">¥{{0 | $numFormat}}</view>
					</view>
					
					<view class="card-split-line"></view>
					
					<view class="card-item">
						<view class="label">付款方式</view>
						<view class="right">{{detail.businessType === 1 ? '月付' : '一次性付'}}</view>
					</view>
					
					<view class="card-item" v-if="detail.nextPayTime && detail.businessType === 1">
						<view class="label">下次付款日期</view>
						<view class="right">{{detail.nextPayTime}}</view>
					</view>
				</view>
			</view>
			
			<view v-if="detail.status >= 130 && detail.detailRespVo && showAccount">
				<view class="card" v-if="detail.contractDamages">
					<view class="card-title-wrap">
						<u-section
							title="车损账单" 
							line-color="#0AEB7D"
							font-size="34"
							color="#0A0F2D"
							:right="false"
						></u-section>
					</view>
					
					<view class="card-item-wrap">
						<view v-for="(item, index) in vehicleDamageList" :key="index">
							<view class="card-item">
								<view class="label">{{item.remark}}</view>
								<view class="right">-¥{{item.deposit | $numFormat}}</view>
							</view>
							<view class="img-list">
								<image
									v-for="(img, index1) in item.imageList"
									:key="index1"
									class="img"
									mode="aspectFill"
									:src="img"
									@click="preview(index1, item.imageList)"
								/>
							</view>
						</view>
						
						<view class="card-item" v-if="detail.contractDamages">
							<view class="label">车辆租金逾期</view>
							<view class="right">-¥{{detail.detailRespVo.overDueMoney | $numFormat}}</view>
						</view>
					</view>
				</view>
				
				<!-- <view class="card">
					<view class="card-title-wrap">
						<u-section
							title="违章账单" 
							line-color="#0AEB7D"
							font-size="34"
							color="#0A0F2D"
							:right="false"
						></u-section>
					</view>
					
					<view class="card-item-wrap">
						<view class="card-item">
							<view class="label">超速</view>
							<view class="right">-¥{{2000 | $numFormat}}</view>
						</view>
						
						<view class="card-item">
							<view class="label">违停</view>
							<view class="right">-¥{{300 | $numFormat}}</view>
						</view>
					</view>
				</view> -->
				
				<view class="card">
					<view class="card-item-wrap">
						<view class="card-item">
							<view class="label">已缴押金</view>
							<view class="right">¥{{detail.detailRespVo.deposit | $numFormat}}</view>
						</view>
						
						<view class="card-item">
							<view class="label">共计扣除</view>
							<view class="right">-¥{{detail.detailRespVo.deductDeposit | $numFormat}}</view>
						</view>
						
						<view class="card-item" v-if="detail.detailRespVo.returnedDeposit">
							<view class="label">返还押金</view>
							<view class="right" style="color: #1A1A1A;font-weight: 400;">¥{{detail.detailRespVo.returnedDeposit | $numFormat}}</view>
						</view>
						
						<view class="card-item" v-else-if="detail.detailRespVo.supplementaryDeposit">
							<view class="label">补缴押金</view>
							<view class="right" style="color: #EA0000;font-weight: 400;">¥{{detail.detailRespVo.supplementaryDeposit | $numFormat}}</view>
						</view>
					</view>
				</view>
				
				<view class="page-tip">
					<view v-if="detail.status === 130">
						在您确认账单后的5个工作日内，我们将按照账单金额原路退回您的租车押金。
					</view>
					<view v-else-if="detail.status === 140">
						车损和违章的费用超过了您支付的租车押金，请您尽快确认账单并补缴相关费用。
					</view>
				</view>
			</view>
			
			<view
			  v-if="detail.status === 10 || detail.status === 30"
			  class="cancel-btn"
			  @click="handleCancel"
			>
			  取消订单
			</view>
		</view>
		
		<view class="footer-btn">
			<view class="bottom-btn" @click="contractFn" v-if="detail.status === 30">
				线上签约
			</view>
			<view class="bottom-btn" @click="reviewBankBill(9, monthPayment, detail.accountDetailId)" v-else-if="detail.isPayRent">
				{{detail.isPayRent === 1 ? '重新上传银行转账凭证' : '查看支付明细'}}
			</view>
			<view class="bottom-btn pay-btn" v-else-if="detail.status === 40 || (detail.status === 100 && detail.currentMonth < detail.monthTotal) || detail.status === 120">
				<view class="left">
					<view class="price-wrap">
						<view class="pay-label">
							<view class="lable">租车费用</view>
							<view class="lable" v-if="detail.businessType === 1">（{{detail.currentMonth}}/{{detail.monthTotal}}）</view>
						</view>
						<view class="pay" >
							<view class="unit">¥</view>
							<view class="price">{{monthPayment | $numFormat}}</view>
						</view>
					</view>
				</view>
				<view class="right" @click.stop="handlePay(9, monthPayment)">
					<view class="btn-text">支付</view>
					<image
						class="detail-arrow"
						src="https://image.51cheyaoshi.com/xcx/app/static/right_green.png"
					/>
				</view>
			</view>
			<view class="bottom-btn pay-btn" v-else-if="detail.status >= 70 && detail.status <= 90 && !detail.isPayDeposit">
				<view class="left">
					<view class="price-wrap">
						<view class="pay-label">
							<view class="lable">租车押金</view>
						</view>
						<view class="pay">
							<view class="unit">¥</view>
							<view class="price">{{totalDeposit | $numFormat}}</view>
						</view>
					</view>
				</view>
				<view class="right" @click.stop="handlePay(10, totalDeposit)">
					<view class="btn-text">支付</view>
					<image
						class="detail-arrow"
						src="https://image.51cheyaoshi.com/xcx/app/static/right_green.png"
					/>
				</view>
			</view>
			<view class="bottom-btn" @click="reviewBankBill(10, totalDeposit, detail.depositDetailId)" v-else-if="(detail.status >= 70 && detail.status <= 90 || detail.status === 140) && detail.isPayDeposit !== 1">
				{{detail.isPayDeposit === 2 ? '重新上传银行转账凭证' : '查看支付明细'}}
			</view>
			<view class="bottom-btn" @click="confirmCarPhotos('edit')" v-else-if="detail.status === 90 && detail.isPayDeposit === 1">
				查看验车信息
			</view>
			<!-- <view class="bottom-btn" v-else-if="detail.status === 100">
				续租用车
			</view> -->
			<view class="bottom-btn" @click="comfirmAccount" v-else-if="detail.status === 130 && showAccount">
				确认账单
			</view>
			<view class="bottom-btn pay-btn" v-else-if="detail.status === 140">
				<view class="left">
					<view class="price-wrap">
						<view class="pay">
							<view class="unit">¥</view>
							<view class="price">{{detail.detailRespVo.supplementaryDeposit | $numFormat}}</view>
						</view>
					</view>
				</view>
				<view class="right" @click.stop="handlePay(10, detail.detailRespVo.supplementaryDeposit)">
					<view class="btn-text">补缴押金</view>
					<image
						class="detail-arrow"
						src="https://image.51cheyaoshi.com/xcx/app/static/right_green.png"
					/>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { CAR_RENTAL_ORDER_STATUS } from "@/constants"
import { formatDate, formatTimeStamp, countdown } from '@/utils'
import CarInfoHeader from '../../components/CarInfoHeader.vue'

export default {
	components: {
	  CarInfoHeader,
	},
	
	data() {
		return {
			CAR_RENTAL_ORDER_STATUS,
			orderId: null,
			detail: null,
			isModifyPickAddr: false,
			isModifyReturnAddr: false,
			pickCarAddr: '',
			returnCarAddr: '',
			signToCancelTimeStr: '',
			signToCancelTime: 0,
			signToCancelTimer: null,
			userInfo: {},
			monthPayment: 0,
			totalDeposit: 0,
			vehicleDamage: false,
			vehicleDamageList: [],
			totalMonthPayment: 0,
		}
	},
	
	computed: {
		showAccount() {
			let res = false
			
			if (!this.vehicleDamage) {
				res = true
			}
			
			if (this.vehicleDamage && this.vehicleDamageList.length) {
				res = true
			}
			
			return res
		},
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
	
	onHide() {
		this.clearTimer()
	},
	
	onUnload() {
		this.clearTimer()
	},
	
	methods: {
		clearTimer() {
			clearInterval(this.signToCancelTimer)
			this.signToCancelTimer = null
			this.signToCancelTimeStr = ''
		},
		
		async getCarRentalOrderDetail() {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				id: this.orderId,
			}
			
			const res = await this.$getRequest(this.$url.getCarRentalOrderDetail, 'GET', params)
			
			uni.hideLoading()
			
			if (res.code === 0) {
				this.detail = res.data
				this.totalDeposit = this.detail.deposit + (this.detail.addDeposit || 0)
				
				if (this.detail.businessType === 1) {
					const monthRent = this.detail.totalPayment / this.detail.monthTotal
					this.monthPayment = monthRent + (this.detail.plateNumFee || 0)
					this.totalMonthPayment = this.monthPayment * this.detail.monthTotal
				} else {
					this.totalMonthPayment = this.detail.totalPayment
					this.monthPayment = this.detail.totalPayment
				}
				
				
				if (res.data.isAddDepositNotice === 0) {
					uni.showModal({
						title: '提示',
						content: `金融方基于风险评估，需加收${res.data.addDeposit}元车辆押金，该车辆押金在租车结束车辆无损退回时原路退回给您`,
						confirmText: '同意',
						cancelText: '拒绝',
						success: (res) => {
							if (res.confirm) {
								this.addDepositApprove(1)
							} else if (res.cancel) {
								this.addDepositApprove(2)
							}
						},
						fail: (err) => {
							console.log('fail', err)
						}
					})
				}
				
				this.signToCancelTime = res.data.signToCancelTime
				if (res.data.status === 40 && this.signToCancelTime) {
					if (this.signToCancelTime > 0) {
						this.signToCancelTimeStr = countdown(this.signToCancelTime)
						this.signToCancelTimer = setInterval(() => {
							this.signToCancelTime = this.signToCancelTime - 60000
							if (this.signToCancelTime > 0) {
								this.signToCancelTimeStr = countdown(this.signToCancelTime)
							} else {
								this.clearTimer()
							}
						}, 60000)
					}
				}
				
				let deliveryCarPicsMap = []
				if (res.data.deliveryCarPics && res.data.deliveryCarPics.length) {
					deliveryCarPicsMap = res.data.deliveryCarPics
				}
				uni.setStorageSync('deliveryCarPicsMap', deliveryCarPicsMap)
				
				const deliveryCheckInfo = res.data.deliveryCheckInfo || ''
				uni.setStorageSync('deliveryCheckInfo', deliveryCheckInfo)
				
				const returnedDeliveryCheckInfo = res.data.returnedDeliveryCheckInfo || ''
				uni.setStorageSync('returnedDeliveryCheckInfo', returnedDeliveryCheckInfo)
				
				if (returnedDeliveryCheckInfo) {
					const json = JSON.parse(returnedDeliveryCheckInfo)
					for(const item of json) {
						if (item.type === 'type' || item.type === 'appearance' || item.type === 'interior') {
							if (item.children) {
								const pos = item.children
								for(const item1 of pos) {
									if (item1.children) {
										const part = item1.children
										for(const item2 of part) {
											if (item2.exceptionDesc) {
												this.vehicleDamage = true
												break
											}
										}
									} else if (item1.exceptionDesc) {
										this.vehicleDamage = true
										break
									}
								}
							}
						}
					}
				}
				
				if (res.data.detailRespVo && res.data.detailRespVo.carRentalVehicleDamageEntityList && res.data.detailRespVo.carRentalVehicleDamageEntityList.length) {
					this.vehicleDamageList = res.data.detailRespVo.carRentalVehicleDamageEntityList
				}
				
			}
		},
		
		async addDepositApprove(isAgree) {
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				id: this.orderId,
				isAgree,
			}
			
			const res = await this.$getRequest(this.$url.addDepositApprove, 'GET', params)
			
			uni.hideLoading()
		},
		
		// 1.取车地址  2.还车地址
		updateAddr(type) {
			if (type === 1) {
				this.isModifyPickAddr = true
			} else {
				this.isModifyReturnAddr = true
			}
		},
		
		async modifyAddr(type) {
			if (type === 1) {
				if (!this.pickCarAddr) {
					uni.showToast({
						title: '请输入取车地址',
						duration: 2000,
						icon: 'none'
					})
					return 
				}
			} else {
				if (!this.returnCarAddr) {
					uni.showToast({
						title: '请输入还车地址',
						duration: 2000,
						icon: 'none'
					})
					return 
				}
			}
			
			uni.showLoading({
				title: '加载中'
			})
			
			const params = {
				id: this.orderId,
				type,
				address: type === 1 ? this.pickCarAddr : this.returnCarAddr
			}
			
			const res = await this.$getRequest(this.$url.updateRentalAddress, 'GET', params)
			
			uni.hideLoading()
			this.getCarRentalOrderDetail()
			this.cancelModifyAddr()
		},
		
		cancelModifyAddr() {
			this.isModifyPickAddr = false
			this.isModifyReturnAddr = false
			this.pickCarAddr = ''
			this.returnCarAddr = ''
		},
		
		handleCancel() {
			uni.showModal({
				title: '提示',
				content: '是否确定取消订单',
				success: async (res) => {
					if (res.confirm) {
						uni.showLoading({
							title: '加载中'
						})
						
						const params = {
							id: this.orderId,
						}
						
						const res = await this.$getRequest(this.$url.cancelRentalOrder, 'GET', params)
						
						uni.hideLoading()
						
						if(res.code === 0) {
							uni.showToast({
								title: '订单已取消',
								duration: 2000
							})
							
							setTimeout(() => {
								uni.reLaunch({
									url: '/pages/home/choose-index'
								})
							}, 500)
						}
					}
				}
			})
		},
		
		handlePay(payType, price) {
			// businessType 0租车、1长租产品、2新车订阅、3购买二手车、4团购、5会员、6、购买服务
			// payType 0余额、1押金、2订金、3尾款、4长租费用（包月或季）、6二手车、7支付年费、8订阅费用、9租车租金、10租车押金
			uni.navigateTo({
				url: `/pagesOrder/rental/pay/chooseRentalPay?orderId=${this.orderId}&price=${price}&openid=${this.userInfo.xcxOpenid}&userId=${this.userInfo.id}&businessType=0&payType=${payType}`
			})
		},
		
		reviewBankBill(payType, price, billId) {
			uni.navigateTo({
				url: `/pagesOrder/rental/pay/bankPayInfo?orderId=${this.orderId}&price=${price}&payType=${payType}&openid=${this.userInfo.xcxOpenid}&userId=${this.userInfo.id}&businessType=0&billId=${billId}`
			})
		},
		
		preview(current, urls) {
			uni.previewImage({
				current,
				urls,
			})
		},
		
		goElectronicContractPage() {
			uni.setStorageSync('ElectronicContract', this.detail.contractInfoRespVos)
			uni.navigateTo({
				url: '/pagesOrder/order-detail/electronicContract'
			})
		},
		
		goSubOrderListPage() {
			uni.navigateTo({
				url: `/pagesOrder/rental/order/subOrderList?orderId=${this.orderId}`
			})
		},
		
		formatDate(time) {
			const date = formatDate(time)
			return `${date.month}月${date.date}日 ${date.hour}:${date.minute}`
		},
		
		async contractFn(){
			uni.showModal({
				title: '提示',
				content: '在进行线上签约之前，请您先完成订单信息确认操作。',
				confirmText: '我知道了',
				showCancel: false,
				success: (res) => {
					if (res.confirm) {
						const esignInfo = {
							orderId: this.orderId,
						}
						uni.setStorageSync('esignInfo', esignInfo)
						
						uni.navigateTo({
							url: `/pagesOrder/identity/face-identity-tip?from=rentalOrderSign&idNum=${this.userInfo.userInfoEntity.idcard}&username=${this.userInfo.name}`
						})
					}
				},
				fail: (err) => {
					console.log('fail', err)
				}
			})
		},
		
		confirmCarPhotos(operator = 'edit') {
			uni.navigateTo({
				url: `/pagesOrder/rental/order/comfirmCarCheck?orderId=${this.orderId}&idNum=${this.userInfo.userInfoEntity.idcard}&username=${this.userInfo.name}&operator=${operator}`
			})
		},
		
		comfirmAccount() {
			uni.showModal({
				title: '提示',
				content: '是否确认账单？',
				success: async (res) => {
					if (res.confirm) {
						uni.showLoading({
							title: '加载中'
						})
						
						const params = {
							id: this.orderId,
						}
						
						const res = await this.$getRequest(this.$url.confirmRentalOrderAccount, 'GET', params)
						
						uni.hideLoading()
						this.getCarRentalOrderDetail()
					}
				}
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
		.status-wrap {
			margin-left: 24rpx;
			width: 120rpx;
			height: 108rpx;
			border-radius: 16rpx;
			border: 2rpx solid #5F19F5;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.status {
				height: 44rpx;
				font-size: 30rpx;
				line-height: 44rpx;
				color: #5F19F5;
				font-weight: 500;
			}
			.time {
				height: 40rpx;
				font-size: 24rpx;
				line-height: 40rpx;
				color: #5F19F5;
			}
		}
		.red-status {
			border-color: #EA0000;
			.status {
				color: #EA0000;
			}
		}
	}
	
	.container {
		padding: 0 32rpx 40rpx;
		.card {
			.card-title-wrap {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
			.continue {
				padding-left: 24rpx;
				height: 48rpx;
				font-size: 24rpx;
				line-height: 48rpx;
				color: #3446AA;
			}
			.car-plate {
				color: rgba(10, 15, 45, 0.8);
				font-size: 28rpx;
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
					.addr-content {
						width: 0;
						flex: 1;
						.addr {
							flex: 1;
							text-align: right;
							@include text-overflow;
						}
						.modify {
							padding-left: 8rpx;
							height: 48rpx;
							font-size: 24rpx;
							line-height: 48rpx;
							color: #3446AA;
						}
					}
					.input {
						flex: 1;
						text-align: right;
						padding: 0;
						background: transparent;
					}
					.modify-btn-group {
						display: flex;
						.cancel {
							color: rgba(10, 15, 45, 0.5);
						}
					}
				}
			}
			.period-wrap {
				margin-top: 32rpx;
				margin-bottom: 24rpx;
				height: 44rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.period-tip {
					font-size: 28rpx;
					color: #767676;
				}
				.period-box {
					display: flex;
					align-items: center;
					.line {
						width: 46rpx;
						height: 4rpx;
						border-radius: 2rpx;
						background: #D8D8D8;
					}
					.period {
						padding: 0 16rpx;
						font-size: 32rpx;
						color: #3D3D3D;
					}
				}
			}
			.pick-time-wrap {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.pick-time {
					font-size: 32rpx;
					color: #0A0F2D;
				}
			}
			.contract-link {
				margin-top: 32rpx;
				height: 44rpx;
				font-size: 28rpx;
				line-height: 44rpx;
				text-decoration: underline;
				color: #3446AA;
				text-align: center;
			}
		}
	}
}

.img-list {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	.img {
		margin-top: 16rpx;
		width: 160rpx;
		height: 88rpx;
	}
}

.page-tip {
	font-size: 28rpx;
	line-height: 44rpx;
	color: rgba(61, 61, 61, 0.7);
}

.cancel-btn {
	margin-top: 40rpx;
	background: rgba(10, 15, 45, 0.04);
	width: 100%;
	height: 116rpx;
	border-radius: 16rpx;
	font-weight: 500;
	font-size: 32rpx;
	display: flex;
	justify-content: center;
	align-items: center;
}

.footer-btn {
	width: 100%;
	padding: 0 32rpx;
	position: fixed;
	bottom: 40px;
	left: 0;
	z-index: 100;
	.bottom-btn {
		width: 100%;
		height: 116rpx;
		border-radius: 16rpx;
		background: #0A0F2D;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 32rpx;
		color: #fff;
		padding: 0 32rpx;
	}
	.pay-btn {
		justify-content: space-between;
		.left {
			.price-wrap {
				height: 40rpx;
				display: flex;
				align-items: center;
				.pay-label {
					padding-right: 8rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					font-size: 24rpx;
					line-height: 44rpx;
					color: #FFFFFF;
				}
				.pay-type {
					font-size: 12px;
				}
				.pay {
					display: flex;
					align-items: flex-end;
					.unit {
						font-size: 12px;
						transform: translateY(-6rpx);
					}
					.price {
						font-size: 20px;
					}
				}
			}
			.tip {
				margin-top: 4px;
				height: 32rpx;
				font-size: 10px;
				line-height: 32rpx;
				color: rgba(255, 255, 255, 0.8);
			}
		}
		.right {
			display: flex;
			align-items: center;
			.detail-arrow {
				margin-left: 12rpx;
				width: 24rpx;
				height: 24rpx;
			}
		}
	}
}
</style>