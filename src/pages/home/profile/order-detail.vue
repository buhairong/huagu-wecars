<template>
	<view class="order-detail">
		<view class="o-head">
			<view class="o-head-info">
				<image :src="detailInfo.logoImageUrl"></image>
				<text>{{detailInfo.merchantName}}</text>
			</view>
			<view class="o-head-car">
				<view class="car-info">
					<image mode="widthFix" :src="detailInfo.imageUrl"></image>
					<view class="o-head-car-text">
						<view class="title">
							<text>{{detailInfo.carBrand || ''}} {{detailInfo.carType || ''}}</text>
						</view>
						<view class="subtitle">
							<text>{{detailInfo.carTypeYear || ''}} {{detailInfo.carTypeYearProduct || ''}}</text>
						</view>
					</view>
				</view>
				<view class="order-status" v-if="paymentStatus && paymentStatus!=0">
					{{orderPayStatusName}}
				</view>
			</view>
		</view>
		
		<!-- 分期方案 -->
		<view class="purchase-content" v-if="index == 4">
			<view class="card">
				<view class="card-title">
					<view class="title">
						<view class="left-border"></view>
						<view class="text">
							分期方案
						</view>
					</view>
				</view>
				<view class="card-content-space-between">
					<view class="item-wrap">
						<view class="item-title">
							车辆价格
						</view>
						<view class="item-content">
							{{stagingItem.dealerReferencePrice ? `￥${formatThousandNumber(stagingItem.dealerReferencePrice)}` : '-'}}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							分期期数
						</view>
						<view class="item-content">
							{{stagingItem.period ? `${stagingItem.period}期` : '-'}}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							首付金额
						</view>
						<view class="item-content">
							{{stagingItem.firstPayment ? `￥${formatThousandNumber(stagingItem.firstPayment)}` : '-'}}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							月供金额
						</view>
						<view class="item-content">
							{{stagingItem.monthPayment ? `￥${formatThousandNumber(stagingItem.monthPayment)}` : '-'}}
						</view>
					</view>
				</view>
			</view>
			
			<view class="card">
				<view class="card-title">
					<view class="title">
						<view class="left-border"></view>
						<view class="text">
							车辆信息
						</view>
					</view>
				</view>
				<view class="card-content-space-between">
					<view class="item-wrap">
						<view class="item-title">
							所在城市
						</view>
						<view class="item-content">
							{{ detailInfo.regCity || '-' }}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							首次上牌
						</view>
						<view class="item-content">
							{{ detailInfo.regDate || '-' }}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							实表里程数
						</view>
						<view class="item-content">
							{{ detailInfo.mileage ? `${formatThousandNumber(detailInfo.mileage)}公里` : '-'}}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							车 架  号
						</view>
						<view class="item-content">
							{{ detailInfo.carVin || '-' }}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">
							外观颜色
						</view>
						<view class="item-content">
							{{ detailInfo.outColor || '-' }}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">内饰颜色</view>
						<view class="item-content">
							{{ detailInfo.inColor || '-' }}
						</view>
					</view>
					
					<view class="item-wrap">
						<view class="item-title">增  配 项
						</view>
						<view class="item-content">
							{{stagingItem.carOtherConfig && stagingItem.carOtherConfig.length ? stagingItem.carOtherConfig.join('、') : '-' }}
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 订阅方案 -->
		<view v-else>
			<view class="o-content">
				<view class="o-c-t">
					<view class="o-content-title">合约详情</view>
					<view @click="contractFn()" v-if="orderPayStatusName=='待签约'">电子合约 <u-icon name="play-right-fill"></u-icon></view>
				</view>
				<view class="o-content-self">
				<!-- 	<u-row class="o-content-row">
						<u-col span="4" class="o-content-title">订阅方案</u-col>
						<u-col span="8"><text class="f-right">{{orderDetailData.productSchemeName}}</text></u-col>
					</u-row> -->
					<!-- <u-row class="o-content-row">
						<u-col span="4" class="o-content-title" style="word-spacing: 22px;">车 况</u-col>
						<u-col span="8"><text class="f-right">{{orderDetailData.newType}}</text></u-col>
					</u-row> -->
					<u-row class="o-content-row">
						<u-col span="4" class="o-content-title">合约周期</u-col>
						<u-col span="8"><text class="f-right">{{userCarSubscribeEntity.monthTotal}}个月</text></u-col>
					</u-row>
					
					<u-row class="o-content-row">
						<u-col span="4" class="o-content-title">订阅费用</u-col>
						<u-col span="8"><text class="f-right">{{getSubscriptionPrice()}}</text></u-col>
					</u-row>
					
					<u-row class="o-content-row">
						<u-col span="4" class="o-content-title">支付方式</u-col>
						<u-col span="8"><text class="f-right">{{userCarSubscribeEntity.paymentType==0?'一次性付':'月付'}}</text></u-col>
					</u-row>
					
					<u-row class="o-content-row">
						<u-col span="4" class="o-content-title" style="word-spacing: 3px;">保 证 金</u-col>
						<u-col span="8"><text class="f-right">{{getDeposit()}}</text></u-col>
					</u-row>
					<u-row class="o-content-row"  v-if="addedDeposit!=null&&isShowPopUp==0">
						<u-col span="4" class="o-content-title" style="word-spacing: 3px;" @click="addedDepositFn()">
							<text style="margin-right: 6px;">加收保证金</text>
							<u-icon name="info-circle"  color="rgba(10, 15, 45, 0.5)" size="28" ></u-icon>
						</u-col>
						<u-col span="8"><text class="f-right" style="color: #F5194B;">+ ¥ {{addedDeposit}}</text></u-col>
					</u-row>
					<u-row class="o-content-row">
						<u-col span="4" class="o-content-title">限定里程</u-col>
						<u-col span="8"><text class="f-right">{{userCarSubscribeEntity.limitMileage ? `${formatThousandNumber(userCarSubscribeEntity.limitMileage)}公里` : '-'}}
						</text></u-col>
					</u-row>
					<u-row class="o-content-row">
						<u-col span="4" class="o-content-title">超出里程</u-col>
						<u-col span="8"><text class="f-right">{{userCarSubscribeEntity.overMileageFee ? `￥${formatThousandNumber(userCarSubscribeEntity.overMileageFee)}/公里` : '-'}}
						</text></u-col>
					</u-row>
					<!-- <u-row class="o-content-row">
						<u-col span="9" class="o-content-title" style="word-spacing: 22px;">尾 款</u-col>
						<u-col span="3"><text class="f-right">¥153940</text></u-col>
					</u-row> -->
					<u-row class="o-content-row">
						<u-col span="4" class="o-content-title" style="word-spacing: 22px;">总 价</u-col>
						<u-col span="8"><text class="f-right">{{userCarSubscribeEntity.totalPrice ? `￥${formatThousandNumber(userCarSubscribeEntity.totalPrice)}` : '-'}}</text></u-col>
					</u-row>
					<u-row class="o-content-row">
						<u-col span="4" class="o-content-title">精选服务</u-col>
						<u-col span="8"><text class="f-right">{{orderDetailData.carSubscribeFreeServiceToWeb && orderDetailData.carSubscribeFreeServiceToWeb.length ? orderDetailData.carSubscribeFreeServiceToWeb.join('、') : '-'}}</text></u-col>
					</u-row>
					<u-row class="o-content-row" v-if="cartype == 1">
						<u-col span="4" class="o-content-title">增配项</u-col>
						<u-col span="8"><text class="f-right">
							{{orderDetailData.otherConfigOfSecondCar ? orderDetailData.otherConfigOfSecondCar : '-' }}
						</text></u-col>
					</u-row>
				</view>
			</view>
			
			<view class="o-content">
				<view class="o-c-t">
					<view class="o-content-title">车辆上牌</view>
					<view class="plate" @click="backPlatePage">
						修改
						<view class="arrow">
							<u-icon
								name="arrow-up-fill" 
								color="rgba(10, 15, 45, 0.8)" 
								size="16"
							></u-icon>
						</view>
					</view>
				</view>
				<view class="o-content-self">
					<view class="plate-content self-plate" v-if="curPlate == 1">
						<view class="o-content-title">
							{{plateList[curPlate].contentText}}
							<view class="price">
								￥{{`${formatThousandNumber(plateMonthPrice)}`}} x {{period}}个月
							</view>
						</view>
						<view class="plate-total-price">
							{{`￥${formatThousandNumber(plateTotalPrice*period)}`}}
						</view>
					</view>
					
					<view class="plate-content third-plate" v-else-if="curPlate == 0">
						<view class="o-content-title" @click="showPop(2)">
							{{plateList[curPlate].contentText}}
							<u-icon class="icon" name="info-circle" v-if="carPlate.certificationName.length!=0"></u-icon>
						</view>
						<view class="plate-total-price">
							￥0
						</view>
					</view>
				</view>
			</view>
			
			<view class="o-content" v-if="carPlate==null">
				<view class="o-c-t">
					<view class="o-content-title">牌照选择</view>
				</view>
				<view class="o-content-self">
					<view class="plate-content self-plate">
						<view class="o-content-title">
							自备牌照
						</view>
						<view class="plate-total-price">
							¥0
						</view>
					</view>
				</view>
			</view>
			
			
			<view class="o-content">
				<view class="o-c-t"><view class="o-content-title">期末选择</view></view>
				<view class="o-content-self">
					<u-row class="o-content-row">
						<u-col span="4" class="o-content-title">期末买断</u-col>
						<u-col span="8"><text class="f-right">{{userCarSubscribeEntity.buyoutsFee ? `￥${formatThousandNumber(userCarSubscribeEntity.buyoutsFee)}` : '-'}}
						</text></u-col>
					</u-row>
					<u-row class="o-content-row">
						<u-col span="4" class="o-content-title">购车总价</u-col>
						<u-col span="8"><text class="f-right">{{userCarSubscribeEntity.totalPrice ? `￥${formatThousandNumber(orderDetailData.totalPrice)}` : '-'}}
						</text></u-col>
					</u-row>
					<u-row class="o-content-row">
						<u-col span="4" class="o-content-title">期末选择</u-col>
						<u-col span="8"><text v-for="item,index in orderDetailData.finalSelectToWeb" :key="index" class="f-right">{{item==0?'可买断车辆':item==1?'可退回车辆':''}}{{index==0?'':'、'}}</text></u-col>
					</u-row>
					<u-row class="o-content-row">
						<u-col span="4" class="o-content-title">订单编号</u-col>
						<u-col span="8"><text class="f-right">{{userCarSubscribeEntity.orderNum}}
						</text></u-col>
					</u-row>
					
					
				</view>
			</view>
		</view>
		
		<view
		  v-if="paymentStatus == 0"
		  class="btu"
		  @click="handleCancel"
		>
		  取消订单
		</view>
		
		<view class="o-footer">
			<view>签订合约即代表您已阅读并认同<text @click="showProtocol">《车要试用车服务协议》</text></view>
		</view>
		<u-gap
		    height="190"
		    margin-top="50"
		    bg-color="#FFFFFF"
		/>
		<view
		    v-if="showNote"
		    class="foot-but foot-sticky u-flex u-row-between"
		>
		    <view class="foot-but-l">
		      {{paymentStatus == 2?'订阅费用':'订金'}}  ：￥
				<text class="price u-font-34" v-if="index == 4">
					<text >{{stagingItem.reserveFee |$numFormat}}</text>
				</text>
		        <text class="price u-font-34" v-else>
					<!-- {{orderDetailData.reserveFee}} -->
					<text v-if="paymentStatus != 2"> {{reserveFee |$numFormat}}</text>
					<!-- 订阅费用+保证金+牌照 -->
		           <!-- <text v-if="paymentStatus == 2&&curPlate==1&&carPlate!=null&&carPlate.plateTotalPrice!=''&&carPlate.plateTotalPrice!=null">{{(subPrice*1+addedDeposit*1+carPlate.plateTotalPrice*1) |$numFormat}}</text> -->
					<!-- 订阅费用+保证金 -->
				    <!-- <text v-if="paymentStatus == 2&&curPlate==1&&carPlate==null">{{(subPrice*1+addedDeposit*1) |$numFormat}}</text> -->
				   <!-- <text v-if="paymentStatus == 2&&curPlate!=1">{{(subPrice*1+addedDeposit*1) |$numFormat}}</text> -->
					<!--  -->
					<text v-if="paymentStatus == 2">{{priceSub}}</text>
		        </text>
				<view class="icon-wrap" @click="showPop(1)">
					<u-icon name="info-circle" color="#fff" size="28"></u-icon>
				</view>
		    </view>
		    <view class="foot-but-r" @click="addPay">
				{{paymentStatus == 2?'去支付':'支付订金'}} 
		        <text class="icon-r" />
		    </view>

		</view>
		<view
			@click="addPay"
		    v-if="paymentStatus == 2&&priceSub==0"
		    class="foot-but foot-sticky u-flex u-row-between"
		>
			<view class="btnTextPrice foot-but-r" >
				查看详情
			</view>
		</view>
		<u-popup 
			v-model="isAddedDeposit" 
			mode="bottom"
			border-radius="12"
			closeable="true"
			close-icon-color="#0A0F2D">
			<view class="addedDeposit-popup">
				<view class="title-added">加收保证金</view>
				<view class="added-text">
					金融方基于风险评估，需加收{{addedDeposit}}元保证金，该保证金可在期末买断车辆时抵扣尾款，也可在车辆退回时原路退回给您
				</view>
			</view>
		</u-popup>
		
		
		<u-popup
			v-model="showPopup" 
			mode="bottom"
			border-radius="12"
			closeable="true"
			close-icon-color="#0A0F2D"
		>
			<view class="popup-wrap">
				<view class="reserve-rule" v-if="popupIndex === 1">
					<view class="title">
						订金退回规则
					</view>
					<view class="content">
						支付订金是您分期购车的必要步骤，您所支付的订金，会在您签约完成并支付首付，或当信用审核不通过订单关闭后原路退回。
					</view>
				</view>
				<view class="plate" v-if="popupIndex === 2&&carPlate.certificationName.length!=0">
					<view class="title">
						自备牌照
					</view>
					<view class="plate-content">
						<view class="content-title">
							您需在签订协议时准备以下材料
						</view>
						<view class="certification-list">
							<view 
								class="certification" 
								v-for="(item, index) in carPlate.certificationName"
								:key="index"
							>
								{{index+1}}.{{item}}
							</view>
						</view>
					</view>
				</view>
			
			</view>
		</u-popup>
	
		<!-- 弹窗 -->
		<view>
			<u-popup v-model="show" @close="close" @open="open" mode="center" :round="24">
				<view class="popupView">
					<text class="popup-title">费用明细</text>
					<view class="popup-list">
						<view>
							<text class="list-title">订阅费用</text>
							<text class="list-price">{{getSubscriptionPrice()}}</text>
						</view>
						<view v-if="addedDeposit!=null">
							<text class="list-title">加收保证金</text>
							<text class="list-price">￥{{addedDeposit}}</text>
						</view>
						<view>
							<text class="list-title">牌照费用</text>
							<text class="list-price">￥{{curPlate == 0?0:carPlate.plateTotalPrice*1}}</text>
						</view>
					</view>
					<view class="popup-list" style="border: none;">
						<view>
							<text class="list-title">总计</text>
							<text class="list-price" v-if="addedDeposit!=null&&curPlate != 0">￥{{subPrice+addedDeposit+carPlate.plateTotalPrice*1}}</text>
							<text class="list-price" v-if="addedDeposit!=null&&curPlate == 0">￥{{subPrice+addedDeposit}}</text>
							<text class="list-price" v-if="addedDeposit==null&&curPlate == 0">￥{{subPrice}}</text>
						</view>
					</view>
				</view>
			</u-popup>
		</view>
		
		<u-modal 
			v-model="showAddedDepositModal"
			title="加收保证金"
			:show-cancel-button="true"
			confirm-text="同意"
			cancel-text="拒绝"
			@confirm="confirmAddedDepositModal"
			@cancel="cancelAddedDepositModal"
		>
			<view class="slot-content">
				<view class="model-content">
					金融方基于风险评估，需加收{{addedDeposit}}元保证金,该保证金可在期末买断车辆时抵扣尾款，也可在车辆退回时原路退回给您，请在24小时内选择是否同意。
				</view>
			</view>
		</u-modal>
		
		<u-modal
			v-model="showCertificationModal"
			title="补充材料"
			:show-cancel-button="true"
			confirm-text="同意"
			cancel-text="拒绝"
			@confirm="confirmCertificationModal"
			@cancel="cancelCertificationModal"
		>
			<view class="slot-content">
				<view class="model-content">
					<view>金融方基于风险评估，需要您补充以下材料：</view>
					<view v-for="(item, index) in certificationList" :key="item.id">
						{{index+1}}.{{item.certificationName}}
					</view>
				</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
import { contractUrl, paymentTypeAll1, finalSelect, purchaseOrderStatus } from "@/constants"
import { formatTenThousandNumber, formatThousandNumber, getDeposit } from '@/utils/index.js'
	
export default {
	data() {
		return {
			show: false,//费用明细弹窗
			isAddedDeposit:false,
			orderDetailData: {},
			carPlanId:'',
			userInfo: null,
			userCarSubscribeIds: '',
			orderSuccessInfo: '',
			index: null, // 3.订阅方案 4.分期方案
			detailInfo: {},
			subscribeItem: {},
			stagingItem: {},
			subscribeId: '', // 订阅方案ID
			showPopup: false,
			popupIndex: 1, // 1.订单提示
			paymentTypeAll: paymentTypeAll1, // 支付方式
			cartype: null, // 1.新车 2.二手车
			nowPaymentDeposit: true,
			userCouponIds: [],
			paymentStatus: null,
			orderId: null,
			orderPayStatusName: '',
			carPlate: null, //车牌信息
			plateList: {
				"1": {
					titleText: '使用自备牌照',
					contentText: '第三方牌照',
				},
				"0": {
					titleText: '使用第三方牌照',
					contentText: '自备牌照',
				},
				
			},
			curPlate: 0, // 0.使用自备牌照 1.使用第三方牌照
			addedDeposit:'',
			isShowPopUp:'',
			isShowPopUpTrue:false,
			subPrice:0,
			reserveFee:'',//订金
			userCarSubscribeEntity:{},//订单数据
			priceSub: null,//订阅费用
			orderType: null,
			showAddedDepositModal: false,
			isShowAddedDepositPopUp: null,
			addDepositOrderType: null,
			showCertificationModal: false,
			isShowCertificationPopUp: null,
			isShowContinueUpload: null,
			certificationList: [],
			applyService: 1, // 1.省心订阅 2.轻松订阅this.period = options.period
			period: null,
			plateMonthPrice: null,
			cityId: null,
		}
	},
	onShow() {
		getApp().globalData.userInfo = null;
		getApp().globalData.getUserInfo((data) => {
			this.userInfo = data
			if (this.index == 4) {
				if (this.orderId) {
					this.getPurchaseOrders()
				} else {
					this.createCarPurchaseOrder()
				}
			} else {
				if (this.orderId) {
					this.getSubscribeInfo()
				} else {
					this.createSubscribeOrder()
				}
			}
		})
		this.selectSubscribeFreeAboutNoPayFn()//订阅总费用
	},
	onLoad(options) {
		if (options) {
			this.carPlanId = options.id
			this.index = options.index
			this.cartype = options.cartype
			this.curPlate = options.curPlate
			uni.setStorageSync('orderId',options.orderId)
			this.orderId = options.orderId
			this.orderType = options.orderType
			this.cityId = options.cityId
			
			if (options.curPlate == 1) {
				this.period = options.period
				this.plateMonthPrice = options.plateMonthPrice
			}
		}
		
		try {
			if(this.index == 4) {
				const value = uni.getStorageSync('certcarDetailInfo')
				if (value) {
					const info = JSON.parse(value)
					this.detailInfo = info.detailInfo
					this.stagingItem = info.stagingItem
				}
			}
		} catch (e) {
			// error
		}
		this.getSubscriptionPrice()
	},
	computed: {
		showNote() {
			let res = false
			if (this.paymentStatus == 0 || this.paymentStatus == 2) {
				res = true
			}
			return res
		},
	},
	methods: {
		// selectSubscribeFreeAboutNoPay
		async selectSubscribeFreeAboutNoPayFn(){
			let params={
				 businessId:this.orderId
			}
			const result = await this.$getRequest(this.$url.selectSubscribeFreeAboutNoPay, 'GET', params)
			if(result.code==0){
				this.priceSub=result.data
			}
		},
		async contractFn(){
			let params={
				 idNumber: "350781196403077525",
				 idType: "CRED_PSN_CH_IDCARD",
				 name: "上海画毂",
				 userPhone: "13999999999"

			}
			const result = await this.$getRequest(this.$url.createOrgCreator, 'POST', params)
			if(result.code==0){
				this.esign(result.data)
			}
		},
		async esign(v){
			let orderDetail=uni.getStorageSync('orderDetail')
			let params={
				  companyId: "2",
				  companyName: "上海画毂汽车有限公司",
				  creator: v,
				  idNumber: "310101199007070577",
				  idType: "CRED_PSN_CH_IDCARD",
				  idTypeByOrg: "CRED_ORG_USCC",
				  name: "哈哈",   
				  redirectUrl: `${orderDetail}`,
				  // redirectUrl: `http://events.jianshu.io/p/bf31fa3285dd`,
				  userCarSubscribeId: this.orderId,
				  userPhone: "13781300517"
			}
			const result = await this.$getRequest(this.$url.esign, 'POST', params)
			if(result.code==0){
				uni.setStorageSync('url',result.data)
				this.$u.route(`/pages/home/profile/wxbview`);
			}
		},
		addedDepositFn(){
			this.isAddedDeposit=true
		},
		
		// 分期方案创建订单
		async createCarPurchaseOrder() {
			// 1. 订阅订单创建
			uni.showLoading({
			    title: '订单创建中'
			});
			
			const params = {
				carId: this.detailInfo.id,
				carPrice: this.stagingItem.dealerReferencePrice,
				firstPayment: this.stagingItem.firstPayment,
				monthPayment: this.stagingItem.monthPayment,
				period: this.stagingItem.period,
				reserveFee: this.stagingItem.reserveFee,
				traditionFinancialSchemeId: this.stagingItem.stagingId,
				userId: this.userInfo.id 
			}
			
			const result = await this.$getRequest(this.$url.createCarPurchaseOrder, 'POST', params)
			if(result.code != '0') {
			    uni.showToast({
			        title: result.msg,
			        duration: 2000,
			        icon: 'none'
			    });
			    return false;
			}
			uni.hideLoading()
			uni.showToast({
			    title: '订单创建成功',
			    duration: 2000
			});
			this.orderId = result.data.id
			
			// 2. 订单查询
			this.getPurchaseOrders()
		},
		
		// 分期方案查询订单
		async getPurchaseOrders() {
			uni.showLoading({
			    title: '加载中'
			});
			const orderInfo = await this.$getRequest(this.$url.getPurchaseOrders, 'POST', {
			    orderId: this.orderId
			})
			this.isShowPopUp=orderInfo.data.isShowPopUp
			this.addedDeposit=orderInfo.data.addedDeposit
			if(orderInfo.data.isShowPopUp==1){
				this.baozhengjin(1)
			}
			this.paymentStatus = orderInfo.data.status
			this.orderPayStatusName = purchaseOrderStatus[orderInfo.data.status]
			uni.hideLoading()
		},
		
		async createSubscribeOrder() {	// 订阅方案创建订单
			uni.showLoading({// 1. 订阅订单创建
			    title: '订单创建中'
			})
			const params = {
				carSubscribeId: this.carPlanId,
				userId: this.userInfo.id,
				orderType: this.orderType,
			}
			const result = await this.$getRequest(this.$url.createSubscribeOrder, 'POST', params)
			if(result.code != '0') {
			    uni.showToast({
			        title: result.msg,
			        duration: 2000,
			        icon: 'none'
			    });
			    return false;
			}
			uni.hideLoading()
			uni.showToast({
			    title: '订单创建成功',
			    duration: 2000
			});
			this.orderId = result.data.id
			this.getSubscribeInfo()// 2. 订单查询
		},
		async getSubscribeInfo() {// 订阅方案 查询订单
			uni.showLoading({
			    title: '加载中'
			});
			const orderInfo = await this.$getRequest(this.$url.getSubscribeInfo, 'POST', {
			    id: this.orderId,
				// id: this.carPlanId,
			    nowPaymentDeposit: this.nowPaymentDeposit ? 0 : 1,
			    usedUserProductId: '', //天次id
			    userCouponIds: this.userCouponIds,//优惠券id
					userId: this.userInfo.id  
			})
			
			this.isShowAddedDepositPopUp = orderInfo.data.isShowPopUp
			this.addedDeposit = orderInfo.data.addedDeposit
			this.detailInfo.logoImageUrl = orderInfo.data.productDetail.logoImageUrl
			this.detailInfo.merchantName = orderInfo.data.productDetail.merchantName
			this.detailInfo.imageUrl = orderInfo.data.productDetail.carTypeDetailVO.photoUrl
			this.detailInfo.carBrand = orderInfo.data.productDetail.carTypeDetailVO.carBrand
			this.detailInfo.carType = orderInfo.data.productDetail.carTypeDetailVO.carType
			this.detailInfo.carTypeYear = orderInfo.data.productDetail.carTypeDetailVO.carTypeYear
			this.detailInfo.carTypeYearProduct = orderInfo.data.productDetail.carTypeDetailVO.carTypeYearProduct
			this.carPlate = orderInfo.data.carPlatePriceRespVo
			
			this.userCarSubscribeEntity=orderInfo.data.userCarSubscribeEntity//订单详情
			
			
			if(orderInfo.data.userCarSubscribeEntity.usePlate || orderInfo.data.userCarSubscribeEntity.usePlate == 0) {
				this.curPlate = orderInfo.data.userCarSubscribeEntity.usePlate
			}
			
			this.orderDetailData = orderInfo.data.productDetail
			this.paymentStatus = orderInfo.data.userCarSubscribeEntity.status
			this.orderPayStatusName = orderInfo.data.userCarSubscribeEntity.statusStr
			this.reserveFee=orderInfo.data.userCarSubscribeEntity.reserveFee
			
			this.cartype = orderInfo.data.userCarSubscribeEntity.newType
			
			this.isShowCertificationPopUp = orderInfo.data.certificationRespVo.isShowConfirm
			this.isShowContinueUpload = orderInfo.data.certificationRespVo.isShowContinueUpload
			this.certificationList = orderInfo.data.certificationRespVo.certificationRespVos
			
			uni.setStorageSync("addCertificationInfo", this.certificationList)
			
			if (orderInfo.data.userConfirmStatus !== 2) {
				if (orderInfo.data.isShowPopUp === 1) {
					this.baozhengjin(0)
				} else if (this.isShowCertificationPopUp === 1) {
					this.showCertificationPopUp()
				} else if (this.isShowContinueUpload === 1) {
					uni.showModal({
							title: '提示',
							content:`是否继续提交补充材料`,
							confirmText: "确定",//这块是确定按钮的文字
							cancelText:"取消",//这块是取消的文字
							success: (res)=> {
										if (res.confirm) {
											this.goAddCertificationPage()
										}
								}
					})
				}
			}
			
			uni.hideLoading()
		},
		handleCancel() {// 取消订单
			uni.showModal({
				title: '提示',
				content: '是否确定取消订单',
				success: async (res) => {
					if (res.confirm) {
						uni.showLoading({
							title: '请求中'
						});
						
						let url = ''
						let params = {}
						let method = 'POST'
						if (this.index == 4) {
							url = this.$url.cancelPurchaseOrder
							params = {
								id: this.orderId,
								userId: this.userInfo.id
							}
							method = 'PUT'
						} else {
							url = this.$url.cancelSubscribeOrder
							params = {
								id: this.orderId,
								updateBy: this.userInfo.updatedBy
							}
						}
						
						const result = await this.$getRequest(url, method, params)

						if(result.code == 0) {
							uni.hideLoading()
							uni.showToast({
								title: '订单已取消',
								duration: 2000
							});
							setTimeout(() => {
								this.$u.route({
									type: 'navigateBack',
									delta: 1
								})
							}, 500)
						}
					} else if (res.cancel) {
							console.log('用户点击取消');
					}
				}
			})
		},
		addPay(){//判断是跳转页面还是微信支付
			let price
			if (this.orderDetailData.paymentType == 0) {
				price = this.orderDetailData.payOffPrice
			} else if (this.orderDetailData.paymentType == 1) {
				price = this.orderDetailData.monthPayment
			}
			let addPrice
			if(this.curPlate==1&&this.carPlate!=null&& this.carPlate.plateTotalPrice!=''&&this.carPlate.plateTotalPrice!=null){
				addPrice=this.subPrice*1+this.addedDeposit*1+this.carPlate.plateTotalPrice*1
			}else{
				addPrice=this.subPrice*1+this.addedDeposit*1
			}
			let plateTotalPrice=0
			if(this.carPlate!=null&&this.curPlate == 1){
				if(this.carPlate.plateTotalPrice!=null){
					plateTotalPrice=this.carPlate.plateTotalPrice
				}
			}
			
			if(this.paymentStatus == 2){		
				let data={
					price:addPrice,
					userId:this.userInfo.id,
					businessId:this.orderId,
					businessType:2,
					openid:this.userInfo.xcxOpenid,
					payType:8,
					addedDeposit:this.addedDeposit,//加收保证金
					payOffPrice:price,//订阅费用
					plateTotalPrice:plateTotalPrice,//牌照价格
				}
				uni.setStorageSync("weChat",data)
				
				this.$u.route(`/pages/home/profile/addPay?cartype=${this.cartype}`);
			}else{
				this.handlePay()
			}
		},
		async handlePay() {//去支付
			// 1.拉起微信支付
			uni.showToast({
				title: '微信支付中',
				duration: 2000,
				icon: 'loading'
			})
			
			let businessType // 0.充值 1.押金 2.订金 3.尾款
			let payType // 0.租车 1.长租产品 2.新车订阅 3.购买二手车 4.团购
			
			if (this.index == 4) {
				payType = '3'
			} else {
				payType = '2'
			}
			
			if (this.paymentStatus == 0) {
				businessType = 2
			}
			
			// 2.创建微信订单
			this.$requestPayment({
				businessId: this.orderId, // 订单ID
				businessType, // 支付类型
				openid: this.userInfo.xcxOpenid,
				payType, // 业务类型
				total: this.reserveFee, // TODO 0.01
				userId: this.userInfo.id,
			}, (res) => {
				if(res == 'success') {
					uni.navigateTo({
						url: `/pages/home/profile/order-pay?id=${this.orderId}&planId=${this.carPlanId}&stagingId=${this.stagingItem.stagingId}&index=${this.index}&cartype=${this.cartype}`
					})
					// 支付成功 刷新数据
					if (this.index == 4) {
						this.this.getPurchaseOrders()
					} else {
						this.this.getSubscribeInfo()
					}
				}
			})
			
			
			uni.hideLoading()
		},
		async handleBookCar() {
			uni.vibrateShort({})
			if(!getApp().globalData.userInfo) {
				this.$u.route("/pages/sign/sign")
				return false
			}
			
			// if(getApp().globalData.userInfo.riskAuditStatus != 1 && getApp().globalData.userInfo.riskAuditStatus != 5) {
			//     uni.showModal({
			//         title: '提示',
			//         content: '身份认证后可用车',
			//         // showCancel: false,
			// 		showCancel: '取消',
			//         confirmText: '去认证',
			//         success: (res) => {
			//             if(res.confirm) {
			//                 this.$u.route('/pages/mine/identity/identity')
			//             }
			//         }
			//     });
			//     return false;
			// }
			
			// 1. 订阅订单创建
			// uni.vibrateShort({})
			uni.showLoading({
			    title: '订单创建中'
			});
			
			 var params = {
				carSubscribeId: this.orderDetailData.id,
				userId: this.userInfo.id,
				orderType: this.orderType,
			 }
			const result = await this.$getRequest(this.$url.createSubscribeOrder, 'POST', params)
			if(result.code != '0') {
			    uni.showToast({
			        title: result.msg,
			        duration: 2000,
			        icon: 'none'
			    });
			    return false;
			}
			uni.hideLoading()
			uni.showToast({
			    title: '订单创建成功',
			    duration: 2000
			});
			this.orderSuccessInfo = result.data.id
			
			uni.navigateTo({
				url: '../../ordered/sub-order-info?id='+result.data.id+'&userId='+result.data.userId
			})
			uni.setStorageSync('order-detail-id',result.data.id)
			
			
			
			// 仅为了测试支付用的
			// this.$u.route(`/pages/ordered/sub-order-info?id=${result.data.id}`)
			// uni.request({
			//     url: 'http://api-test.51cheyaoshi.com:6999/app/appuser/createdRechargeCompleteUserAccountDetailToLock',
			//     method: 'POST',
			// 	data: {
			// 	   businessId: result.data.id,
			// 	   businessType: '2',
			// 	   orderNum: '123456',
			// 	   wxOrderNum: '654321',
			// 	   userId: result.data.userId,
			// 	   total: result.data.reserveFee,
			// 	   payType: '3'
			//     },
			//     header: {
			// 	    'authorization': '25a32705-b678-4d33-84a1-bbf5b2402b5e' //自定义请求头信息
			//     },
			//     success: (res) => {
			// 	  this.userCarSubscribeIds = res.data.data.businessId
			// 	  this.getqwer()
			//     },
			// 	fail:(err) => {
			// 		uni.showToast({
			// 			title:err.msg,
			// 			icon:"none"
			// 		})
			// 	}
			// });
			// uni.navigateTo({
			// 	url: './order-pay'
			// })
		},
		// getqwer() {
		// 	uni.request({
		// 	    url: 'http://api-test.51cheyaoshi.com:6999/app/userCarSubscribe/updateUserCarSubscribeToPayment', 
		// 	    method: 'GET',
		// 		data: {
		// 			userCarSubscribeId: this.userCarSubscribeIds
		// 	    },
		// 	    header: {
		// 	        'authorization': '6w772l609Je6p590Qc3EpBs1gMQN7Y60#1' //自定义请求头信息
		// 	    },
		// 	    success: (res) => {
		// 			uni.showToast({
		// 				title: '支付成功'
		// 			})
		// 			uni.navigateTo({
		// 				url: './order-pay?orderSuccessInfo=' + this.orderSuccessInfo
		// 			})
		// 	    },
		// 		fail: (err) => {
		// 			uni.showToast({
		// 				title: err.msg,
		// 				icon: 'error'
		// 			})
		// 		}
		// 	});
		// },
		getOrderDetailData() {
			var that = this;
			uni.showLoading({
				title: '加载中'
			})
			var params = {
				id: that.carPlanId,
				userId:this.userInfo.id
			}
			that.$getRequest(that.$url.getOrderDetail, 'GET', params).then((data) => {
				uni.hideLoading()
				if(data.code == 0) {
					this.orderDetailData = data.data
				}
			})
		},
		showPop(index) {// 1.订金提示
			this.popupIndex = index
			if(index==1&&this.paymentStatus == 2){
				this.show = true
			}else{
				if(this.popupIndex == 2&&this.carPlate.certificationName.length==0){
					this.showPopup = false
				}else{
					this.showPopup = true
				}
			}
		},
		formatTenThousandNumber(number, unit1, unit2) {
			return formatTenThousandNumber(number, unit1, unit2)
		},
		formatThousandNumber(num) {
			return formatThousandNumber(num)
		},
		getSubscriptionPrice() {// 计算订阅费用
			let price
			if (this.orderDetailData.paymentType == 0) {
				price = this.orderDetailData.payOffPrice
			} else if (this.orderDetailData.paymentType == 1) {
				price = this.orderDetailData.monthPayment
			}
			this.subPrice=price
			if (price || price == 0) {
				this.subPrice=price
				return `￥${formatThousandNumber(price)}`
			}
			return '-'
		},
		getDeposit() {// 保证金
			return getDeposit(this.orderDetailData.deposit)
		},
		showProtocol() {// 跳转协议页面
		  this.$goHtml(contractUrl, '')
		},
		goPlatePage() {
			this.$u.route(`/pagesOrder/chooseCarPlate/chooseCarPlate?id=${this.carPlanId}&cityId=${this.cityId}&index=3&cartype=1`)
		},
		changePlate() {// 牌照切换
			if(this.priceSub==0){//支付完订阅费用就不支持修改
				return
			}
			uni.showLoading({
				title: '加载中'
			})
			// if (this.curPlate == 1) {
			// 	this.showPop(2)
			// 	this.curPlate = 0
			// } else {
			// 	this.curPlate = 1
			// }
			// 存入切换牌照选择
			this.$getRequest(this.$url.updatePlateScheme, 'GET', {userPlate:this.curPlate,id:this.orderId}).then((res) => {
				uni.hideLoading()
				if(res.code == 0) {
					this.selectSubscribeFreeAboutNoPayFn()//订阅总费用
				}
			})
		},
		
		// 确认或拒绝 加收保证金
		async addDepositFn(accessOrReject,orderType) {
			uni.showLoading({
				title: '加载中'
			})
			
			let params={
				accessOrReject:accessOrReject,
				orderId:this.orderId,
				orderType:orderType
			}
			
			await this.$getRequest(this.$url.addDeposit, 'GET', params).then((data) => {
				if(data.code == 0) {
					if (this.isShowCertificationPopUp && accessOrReject === 1) {
						this.showCertificationPopUp()
					} else {
						this.getSubscribeInfo()
					}
				}
			})
			
			uni.hideLoading()
		},
		
		// 确认或拒绝 提交补充材料 1接受，0拒绝
		async addCertificationFn(accessOrReject) {
			uni.showLoading({
				title: '加载中'
			})
			
			let params = {
				accessOrReject,
				orderId: this.orderId,
			}
			
			await this.$getRequest(this.$url.addCertification, 'GET', params).then((data) => {
				if(data.code == 0) {
					if (accessOrReject === 1) {
						this.goAddCertificationPage()
					} else {
						this.getSubscribeInfo()
					}
				}
			})
			
			uni.hideLoading()
		},
		
		confirmCertificationModal() {
			this.addCertificationFn(1)
		},
		
		cancelCertificationModal() {
			uni.showModal({
					title: '拒绝订单将被关闭',
					content:`订金会在5个工作日原路返回`,
					confirmText: "取消",//这块是确定按钮的文字
					cancelText:"拒绝",//这块是取消的文字
					success: (res)=> {
								if (res.confirm) {
									this.showCertificationPopUp()
								} else if (res.cancel) {
									this.addCertificationFn(0)
								}
						}
			})
		},
		
		showCertificationPopUp() {
			this.showCertificationModal = true
		},
		
		confirmAddedDepositModal() {
			this.addDepositFn(1, this.addDepositOrderType)
		},
		
		cancelAddedDepositModal() {
			uni.showModal({
					title: '拒绝订单将被关闭',
					content:`订金会在5个工作日原路返回`,
					confirmText: "取消",//这块是确定按钮的文字
					cancelText:"拒绝",//这块是取消的文字
					success: (res)=> {
								if (res.confirm) {
									this.baozhengjin(this.addDepositOrderType)
								} else if (res.cancel) {
									this.addDepositFn(2, this.addDepositOrderType)
								}
						}
			})
		},
		
		baozhengjin(v){//加收保证金弹窗
			const that=this
			this.addDepositOrderType = v
			if(this.addedDeposit!=null){
				this.showAddedDepositModal = true
				// uni.showModal({
				//     title: '加收保证金',
				//     content:`金融方基于风险评估，需加收${this.addedDeposit}元保证金,该保证金可在期末买断车辆时抵扣尾款，也可在车辆退回时原路退回给您，请在24小时内选择是否同意`,
				//    	confirmText: "同意",//这块是确定按钮的文字
				// 		cancelText:"拒绝",//这块是取消的文字
				// 		success: (res)=> {
				//         if (res.confirm) {
				//             that.addDepositFn(0,v)
				// 						// uni.showLoading({
				// 						// 	title: '加载中'
				// 						// })
				// 						// setTimeout(()=>{
				// 						// 	this.getSubscribeInfo()
				// 						// 	uni.hideLoading()
				// 						// },1500)
				// 						that.isShowPopUpTrue=true
				//         } else if (res.cancel) {
				// 					uni.showModal({
				// 							title: '拒绝订单将被关闭',
				// 							content:`订金会在5个工作日原路返回`,
				// 							confirmText: "取消",//这块是确定按钮的文字
				// 							cancelText:"拒绝",//这块是取消的文字
				// 							success: (res)=> {
				// 										if (res.confirm) {
				// 											that.baozhengjin(v)
				// 										} else if (res.cancel) {
				// 											that.addDepositFn(1,v)				
				// 											that.isShowPopUpTrue=false
				// 											uni.showLoading({
				// 												title: '加载中'
				// 											})
				// 											setTimeout(()=>{
				// 												this.getSubscribeInfo()
				// 												uni.hideLoading()
				// 											},1500)
				// 										}
				// 								}
				// 					})
				//         }
				//     }
				// })
			}
		},
		
		goAddCertificationPage() {
			this.$u.route(`/pages/home/profile/add-certification?orderId=${this.orderId}&userId=${this.userInfo.id}`)
		},
	}
}
</script>

<style lang="scss" scoped>
	.addedDeposit-popup{
		width: 100%;
		height: 200px;
		border-radius: 12px 12px 0px 0px;
		background: #FFFFFF;
		.title-added{
			width: 100%;
			height: 64px;
			border-radius: 12px 12px 0px 0px;
			background: #FFFFFF;
			font-family: PingFangSC-Medium;
			font-size: 15px;
			font-weight: 500;
			line-height: 64px;
			text-align: center;
			letter-spacing: 0px;
			color: rgba(0, 0, 0, 0.9);
		}
		.added-text{
			margin-top: 12px;
			padding: 0 24px;
			box-sizing: border-box;
			width: 100%;
			height: 66px;
			font-family: PingFangSC-Regular;
			font-size: 14px;
			font-weight: normal;
			line-height: 22px;
			letter-spacing: 0px;
			color: rgba(10, 15, 45, 0.8);
		}
	}
	.f-right {
		float: right;
		text-align: right;
	}
	.order-detail {
		padding: 0;
		margin: 36rpx 32rpx;
		.o-head {
			.o-head-info {
				display: flex;
				align-items: center;
				image {
					width: 24rpx;
					height: 24rpx;
				}
				text {
					font-size: 24rpx;
					margin-left: 8rpx;
				}
			}
			.o-head-car {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 20rpx;
				.car-info {
					flex: 1;
					display: flex;
					align-items: center;
				}
				image {
					width: 234rpx;
				}
				.o-head-car-text {
					flex: 1;
					margin-left: 10rpx;
					.title {
						font-size: 30rpx;
						font-weight: 500;
						line-height: 44rpx;
						color: rgba(10, 15, 45, 0.8);
					}
					.subtitle {
						font-size: 24rpx;
						line-height: 40rpx;
						color: rgba(10, 15, 45, 0.8);
					}
				}
				
				.order-status {
					margin-left: 20rpx;
					width: 120rpx;
					padding: 32rpx 12rpx;
					border-radius: 16rpx;
					border: 2rpx solid #5F19F5;
					font-size: 30rpx;
					font-weight: 500;
					color: #5F19F5;
					line-height: 44rpx;;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
		}
		.o-content {
			padding: 40rpx 12rpx 40rpx 16rpx;
			margin-top: 26rpx;
			border-radius: 24rpx;
			box-shadow: 0px -2px 32px rgba(10, 15, 45, 0.02),
			    0px 8px 24px rgba(10, 15, 45, 0.06);
			.o-c-t{
				display:flex;
				justify-content: space-between;
				align-items: center;
				.o-content-title {
					font-size: 34rpx;
					position: relative;
					padding-left: 20rpx;
				}
				.plate {
					margin-right: 3px;
					height: 22px;
					font-size: 14px;
					line-height: 22px;
					color: rgba(10, 15, 45, 0.8);
					display: flex;
					align-items: center;
					.arrow {
						margin-left: 8rpx;
						transform: rotate(90deg);
					}
				}
				
				.o-content-self {
					padding: 0 5px;
					display:flex;
					justify-content: space-between;
					align-items: center;
				}
				
				.o-content-title:before {
					content: "";
					position: absolute;
					width: 4rpx;
					height: 28rpx;
					border-radius: 4rpx;
					background-color: #0AEB7D;
					top: 10rpx;
					left: 4rpx;
				}
			}
			.plate-content {
				display:flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 5px;
				.o-content-title {
					display:flex;
					align-items: center;
					.icon {
						margin-left: 8rpx;
					}
					.price {
						margin-left: 16rpx;
						font-size: 14px;
						color: #BFBFBF;
					}
				}
			}
			.o-content-self {
				margin-bottom: 20rpx;
				padding: 20rpx 0 0rpx 16rpx;
				.o-content-row {
					line-height: 2.2;
					.o-content-title{
						font-size: 28rpx;
						color: rgba(10, 15, 45, 0.8);
					}
					.o-content-text{
						font-size: 28rpx;
						color: #0A0F2D;
					}
				}
			}
		}
		
		.purchase-content {
			margin-top: 40rpx;
		}
		
		.o-footer {
			font-size: 24rpx;
			margin-top:38rpx;
			text {
				color: #197EF5;
			}
		}
		
		.foot-but-l {
			display: flex;
			align-items: center;
			.icon-wrap {
				padding-left: 12rpx;
				width: 100rpx;
				height: 100%;
				display: flex;
				align-items: center;
			}
		}
	}
	.btnTextPrice{
		width: 100%;
		height: 100%;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.popup-wrap {
		.reserve-rule {
			.content {
				font-size: 28rpx;
				line-height: 44rpx;
				color: rgba(10, 15, 45, 0.8);
				padding-top: 66rpx;
				padding-bottom: 80rpx;
			}
		}
		.plate {
			.plate-content {
				margin-top: 33px;
				.content-title {
					height: 22px;
					font-size: 14px;
					font-weight: 500;
					line-height: 22px;
					color: #0A0F2D;
				}
				.certification-list {
					margin-top: 16px;
					margin-bottom: 40px;
					.certification {
						margin-bottom: 8px;
						height: 22px;
						font-size: 14px;
						line-height: 22px;
						color: #3D3D3D;
					}
				}
			}
		}
	}
	
	.btu {
		background: rgba(10, 15, 45, 0.04);
		border-radius: 16rpx;
		text-align: center;
		color: #0A0F2D;
		font-weight: 500;
		font-size: 30rpx;
		padding: 26rpx 0;
		margin: 30rpx 0;
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
	
	.model-content {
		padding: 16px 40rpx;
		line-height: 44rpx;
		font-size: 14px;
		color: rgba(10, 15, 45, 0.8);
	}
</style>