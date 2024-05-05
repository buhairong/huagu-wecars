<template>
  <view class="profile" >
    <view
      v-if="carDetailData"
      class="detail"
    >
      <!-- 上 -->
			<!-- <view v-if="carTypeYearProductEntity.guidancePrice" class=""> -->
      <detail-head
				@viewSet="setView"
        ref="detailHead"
        :banner-list="carTypeYearProductImageList"
        :car-detail-data="carTypeYearProductEntity"
        :car-info="carDetailData"
        :month-payment="monthPayment"
        :show-month-payment="(queryType == 3 || queryType == 5) ? false : true"
        @clickInit="init()"
      />
			<!-- </view> -->
      <!-- 下 -->
      <view class="car-body">
        <!-- <view class="tabs u-margin-left-32">
          <u-tabs
            ref="tabs"
            :list="queryTypeData"
            :duration="0.2"
            :bar-style="barStyleCustom"
            active-color="#0A0F2D"
            inactive-color="#5e5e61"
            :active-item-style="styleCustom"
            :bold="true"
            :is-scroll="true"
            :current="curQueryType"
            @change="changeQueryType"
          />
        </view> -->
				
				<view class="tabs">
					<view 
						v-for="(tab, index) in queryTypeData"
						:key="index"
						class="tab"
						:class="{'tab-active': tab.id == queryType}"
						@click="changeQueryType(tab.id, index)"
					>
						<view class="line" v-if="tab.id == queryType"></view>
						{{tab.name}}
					</view>
				</view>
        
        <view class="car-mode">
          <!-- 新车订阅 carSubscribeRespVO -->
          <template v-if="queryType == 1">
            <view class="model-box">
              <scroll-view scroll-x class="model-scroll" :scroll-into-view="'toView_' + carTypeYearProductId" :scroll-left="scrollLeft">
                <view
									:ref="'toView_' + item.id"
                  :id="'toView_' + item.id"
                  v-for="(item, index) in allCars"
                  :key="index"
                  class="item"
                  :class="carTypeYearProductId == item.id ? 'active' : ''"
                  @click="changeCarTypeYearProductId(item.id)"
                >
                  {{ item.carTypeYear + ' ' + item.carTypeYearProduct }}
                </view>
              </scroll-view>
            </view>
			<!-- <firstItem
			  :min-product-entity="carDetailData.carSubscribeRespVO"
			  :car-detail-data="carDetailData"
			  :user-info="userInfo"
			  @click="handlePayBookCar(2)"
			  @changeProductId="changeProdId"
			  @changePayment="changePayment"
			  :city-id="cityId"
			/> -->
			<!-- @click="preChooseCarPlatePage(item)" -->
			<!-- @click="gotoDetail(item.templateId,item.templateName,item.monthTotal, item)" -->
			<view>
				<!-- <view 
					v-for="(item,index) in carDetailData.templateRespVO" 
					:key="index" class="card"
				> -->
					<TemplateItem 
						v-if="carDetailData && carDetailData.carSubscribeList && carDetailData.carSubscribeList.length && partnerInfo"
						:templateRespVO="carDetailData.carSubscribeList"
						:newType="1"
						:cityId="cityId"
						:userInfo="userInfo"
						:thirdAppSubscribeId="thirdAppSubscribeId"
						:carProductEntity="carTypeYearProductEntity"
						:partnerInfo="partnerInfo"
						@change="changeCurTemplate"
					/>
					 
			<!-- 	</view> -->
			</view>
			
			<view class="car-address-wrap" v-if="carAddress.length">
				<view class="title">
					<view class="line"></view>
					<view class="title-text">
						提车地址
					</view>
				</view>
				<view class="card">
					<view 
						class="address-card"
						v-for="(item, index) in carAddress"
						:key="item.id"
					>
						<view class="address-wrap" v-if="index < 2 || expand">
							<view class="img-box">
								<image
									class="item-img"
									mode="aspectFill"
									:src="item.deliveryPictureUrl"
								/>
							</view>
							<view class="address-info">
								<view class="top-line">
									<view class="address-name">{{item.deliveryName}}</view>
									<view class="distance" v-if="item.distance">
										{{item.distance}}{{item.unit === 1 ? 'm' : 'km'}}
									</view>
								</view>
								<view class="address-detail">
									<view class="address-icon-wrap">
										<u-icon name="map" color="rgba(10, 15, 45, 0.5)" size="28"></u-icon>
									</view>
									<view class="address">{{item.deliveryAddress}}</view>
								</view>
							</view>
						</view>
					</view>
					<view class="expand-btn" @click="changeExpand" v-if="carAddress.length > 2">
						<u-icon :name="expand ? 'arrow-up' : 'arrow-down'" color="rgba(10, 15, 45, 0.8)" size="28"></u-icon>
						<view class="expand-text">
							{{ expand ? '收起' : '更多提车地址' }}
						</view>
					</view>
				</view>
			</view>
			
			<view  class="card cardBom">
			  <view class="process">
			    <view class="process-t">
			        「新车订阅」流程
			    </view>
			    <view class="process-list">
			        <view class="process-list-t">
			            <text />1.订阅产品
			        </view>
			        <text class="process-list-text">
			            选择适合您的订阅方案及商户，在线支付订金。您还可以为爱车个性化定制颜色和增配项；
			        </text>
			    </view>
			    <view class="process-list">
			        <view class="process-list-t">
			            <text />2.资质认证
			        </view>
			        <text class="process-list-text">
			            资金方将对您的身份进行认证，审核通过即可在线签约；
			        </text>
			    </view>
			    <view class="process-list">
			        <view class="process-list-t">
			            <text />3.签约付款
			        </view>
			        <text class="process-list-text">
			           您在线签订订阅合约，并支付订阅费用后，我们将通知商户为您准备车辆；
			        </text>
			    </view>
			    <view class="process-list">
			        <view class="process-list-t">
			            <text />4.喜提爱车
			        </view>
			        <text class="process-list-text">
					商户完成车辆采购、落地上牌流程后，我们会与您预约具体交车时间，原则上车辆准备周期不超过30天，特殊车型或其他情况除外；
			        </text>
			    </view>
				<view class="process-list">
				    <view class="process-list-t">
				        <text />5.期末选择
				    </view>
				    <text class="process-list-text">
				       订阅期结束前30天，您可以选择订阅结束后全款或分期购买车辆，也可将车辆无损退回。
				    </text>
				</view>
			  </view>
			</view>
			<u-popup class='popupClass'  border-radius="14" closeable=true mode="bottom" v-model="isShowTrue">
				<view class="popupClassTop"> 
					<text v-if="popupIndex === 1">汽车订阅</text>
					<text v-else-if="popupIndex === 2">车辆押金</text>
				</view>
				<view class="popupClassBom">
					<view v-if="popupIndex === 1">
						汽车订阅是一种让您可以「后悔」的全新汽车消费模式。您仅需一次性支付当期订阅费用，即可开走车辆。 订阅期结束30天前，您再决定是否买断车辆，届时您可以选择全款或金融方案支付尾款购买车辆，也可选择继续订阅或退回车辆结束订阅。
					</view>
					<view v-else-if="popupIndex === 2">
						车辆押金可在期末选择买断车辆时抵扣尾款，也可在期末确认无损退车后原路退还到您的账户。
					</view>
				</view>
			</u-popup>
		
		  </template>
          
          <!-- 会员租车 -->
          <template v-if="queryType == 3 && carDetailData.carTypeYearProductShowTabRespVO.showProduct > 0">
            <view class="model-box">
              <scroll-view scroll-x class="model-scroll" :scroll-into-view="'toView_' + carTypeYearProductId">
                <view
                  :id="'toView_' + item.id"
                  v-for="(item, index) in allCars"
                  :key="index"
                  class="item"
                  :class="carTypeYearProductId == item.id ? 'active' : ''"
                  @click="changeCarTypeYearProductId(item.id)"
                >
                  {{ item.carTypeYear + ' ' + item.carTypeYearProduct }}
                </view>
              </scroll-view>
            </view>
            <u-empty v-if="queryTypeData.length==0" text="暂无车源" mode="list" margin-top="40"></u-empty>
            <rentalItem
              v-if="carDetailData.rentalPriceEntity && carDetailData.monthProductList[0].id"
              :month-product-list="carDetailData.monthProductList"
              :car-detail-data="carDetailData"
              :user-info="userInfo"
              @click="handleSave"
            />
            <view class="m-vip-view u-flex u-row-between">
              <view>
                <view>
                  <text class="color">会员充值最高立返</text>
                  <text class="color-red">30%</text>
                </view>
                <view class="m-tg" @click="go2VipCard"><text>查看详情</text></view>
              </view>
              <view>
                <u-image
				
                  src="https://image.51cheyaoshi.com/xcx/app/static/vip/cart.png"
                  width="280rpx"
                  height="140rpx"
                />
              </view>
            </view>
            <u-gap
              height="190"
              margin-top="50"
              bg-color="#FFFFFF"
            />
          </template>
          <!-- 无忧新能源 -->
          <template v-else-if="queryType == 5 && carDetailData.carTypeYearProductShowTabRespVO.showSecondHandCars > 0">
            <u-empty v-if="queryTypeData.length==0" text="暂无车源" mode="list" margin-top="40"></u-empty>
            <!-- <secondHandCar
              :list="carDetailData.secondHandCarsEntityIPage.records"
              @click="handleRecord(2)"
              @onClickLine="handleRecord(2)"
            /> -->
            <u-gap height="200" />
          </template>
          <u-loadmore
            v-show="page > 1"
            :status="status"
            :load-text="loadText"
          />
        </view>
				
				<view class="order-btn-wrap">
					<view class="order-btn" @click="goChooseCarPlatePage(curTemplate)">
						立即订车
					</view>
				</view>
      </view>
    </view>
		<scope 
			v-if="showScope"
			:partnerId="partnerId"
			@handlerClick="handlerClickScope"
		/>
		
		<DetailPopup
			v-if="show"
			:show.sync="show"
			:currentItem="currentItem"
			:needPurchaseTaxRatio="needPurchaseTaxRatio"
			@openIdentityDialog="openIdentityDialog"
		/>
		
		<IdentityDialog
			v-if="showIdentityDialog"
			:show.sync="showIdentityDialog"
			:identityDialogParams="identityDialogParams"
		/>
		
		<u-popup class="popup" border-radius="14" mode="center" v-model="showBuyoutsFeePopup">
			<view class="wrap">
				<view class="popup-title">买断车辆</view>
				<view class="container">
					<view class="item">
						<view class="item-title">
							买断金额：
						</view>
						<view class="item-content">
							¥{{curItem.buyoutsFee | $numFormat}}
						</view>
					</view>
					
					<view class="item">
						<view class="item-title">
							支付方式：
						</view>
						<view class="item-content">
							全款买断、金融分期
						</view>
					</view>
				</view>
				<view class="bottom">
					<view class="btn" @click="colseBuyoutsFeePopup">我知道了</view>
				</view>
			</view>
		</u-popup>
		
		<u-popup class="popup" border-radius="14" mode="center" v-model="showApportionPopup">
			<view class="wrap">
				<view class="table">
					<view class="row table-header">
						<view class="col">订阅周期</view>
						<view class="col">订阅费用</view>
						<view class="col">买断价格</view>
					</view>
					
					<view class="row" v-for="(item, index) in curItem.apportionRateCalculateResultList" :key="index">
						<view class="col">{{`${item.period-curItem.monthTotal+1}-${item.period}个月`}}</view>
						<template v-if="!userInfo && (index+1) > curItem.mid">
							<view class="col">...</view>
							<view class="col">...</view>
						</template>
						<template v-else>
							<view class="col">¥{{item.mouthPayment | $numFormat}}/月</view>
							<view class="col">¥{{item.buyoutsFee | $numFormat}}</view>
						</template>
					</view>
				</view>
				
				<view class="tip">
					期末续订车辆更划算<text v-if="!userInfo">,登录查看全部订阅周期</text>
				</view>
				
				<view class="bottom" v-if="!userInfo">
					<u-button
							class="wx-btn"
					    :ripple="true"
					    open-type="getPhoneNumber"
					    @getphonenumber="handleLogin"
					>
						<image
							style="width:48rpx;height:40rpx;margin-right:16rpx;"
							src="https://image.51cheyaoshi.com/xcx/app/static/ordered/wx-icon.png"
						/>
						一键授权登录
					</u-button>
				</view>
			</view>
		</u-popup>
		
  </view> 
</template>

<script>
import firstItem from "./component/first-item";
// import stagesItem from "./component/stages-item";
import rentalItem from "./component/rental-item";
import detailHead from "@/pages/home/common/detail-head";
// import newDiscount from "./component/new-discount";
import secondHandCar from './component/second-handcar';
import scope from '../common/scope.vue'
import DetailPopup from './component/DetailPopup'
import IdentityDialog from '../../mine/components/IdentityDialog.vue'
import TemplateItem from '../components/TemplateItem.vue'
import QQMapWX from '@/qqmap-wx-jssdk.min.js'
import { errMsgObj } from "@/constants"
import { addUserCarIntention } from '@/utils/index'

export default {
  onShareAppMessage(res) {
		return {
      title: '车要试 让有车生活·更简单',
      desc: this.shareDesc,
      path: this.shareUrl,
      imageUrl: this.shareImg,
    }
  },
  onShareTimeline(res) {
    
  },
  name: "ProfileIndex",
  components: {
    firstItem,
    // stagesItem,
    rentalItem,
    detailHead,
    // newDiscount,
    secondHandCar,
		scope,
		DetailPopup,
		IdentityDialog,
		TemplateItem,
  },
  data() {
    return {
			isShowTrue:false,
      userInfo: null,
      carTypeYearProductId: '',
      cityId : '',
      prodId: '',
      monthPayment: '-',
      carDetailData: {
        carSubscribeRespVO: { },
        carTypeYearProductImageList: [],
        carTypeYearProductEntity: {},

        allCarTypeYearProductEntity: [],

        minProductEntity: { totalServiceFee: 0, deposit: 0 },
        carHirePurchaseVO: {},
        rentalPriceEntity: { price: 0 },
        monthProductList: []
      },
			carTypeYearProductEntity:{},
      curQueryType: 0,
      queryType: 1,
      queryTypeData: [
        // { name: "新车订阅", id: 1 },
        // { name: "会员租车", id: 3 },
        // { name: "认证好车", id: 5 },
        // { name: "先用后买", id: 1 },
        // { name: "一成首付", id: 2 },
        // { name: "会员租车", id: 3 },
        // { name: "折扣新车", id: 4 },
        // { name: "认证好车", id: 5 },
      ],
      styleCustom: {
        "font-weight": 'bold'
      },
      barStyleCustom: {
        'position': 'absolute',
        'top': '36rpx',
        'transform': 'rotate(114deg) skew(20deg)',
        'background': '#0AEB7D',
        'width': '32rpx',
        'height': '8rpx',
        'border-radius': 0
      },
      list4sData: [],
      lat: null,
      lng: null,
      certifiedCarData: [],

      status: 'loadmore', // 加载更多 状态
      page: 0, // 第N页
      totalPages: 0, // 总页数
      loadText: {
        loadmore: '轻轻上拉',
        loading: '努力加载中',
        nomore: '实在没有了'
      },
			shareUrl: '', // 分享后跳转的地址
			shareDesc: '',
			shareImg: '',
			partnerId: '',
			showScope: false,
			companyId: null,
			carPlanListData: [],
			show: false,
			currentItem:{},
			showIdentityDialog: false,
			riskAuditStatus: null,
			identityDialogParams: {},
			latitude: '',
			longitude: '',
			carBrandId: '',
			carAddress: [],
			popupIndex: null, // 1. 订阅费用 2.保证金
			expand: false,
			scrollLeft: 0,
			needPurchaseTaxRatio: 1,
			showBuyoutsFeePopup: false,
			showApportionPopup: false,
			curItem: {},
			curTemplate: {},
			selCityId: null,
			thirdAppSubscribeId: '',
			partnerInfo: null,
    }
  },
  computed: {
    carTypeYearProductImageList () {
      if(this.carDetailData.carTypeYearProductImageList.length > 0){
        return this.carDetailData.carTypeYearProductImageList.map(item => {
          return {
            ...item,
            image: item.imageUrl
          }
        });
      } else {
				return [this.carDetailData.imageUrl]
			}
    },
    // carTypeYearProductEntity () {
    //   return this.carDetailData.carTypeYearProductEntity;
    // },
    allCars () {
      const list = this.carDetailData.allCarTypeYearProductEntity;
      // const index = list.findIndex(item => item.id === this.carTypeYearProductId);
      // list.splice(0, 0, list.splice(index, 1)[0]);
      return list;
    }
  },
  onLoad(option) {
		let cityId = uni.getStorageSync("cityId")
    this.carTypeYearProductId = option.id
		this.cityId = option.cityId
		this.selCityId = option.cityId
		this.queryType = option.qt || 1 // 1,3,5
		let partnerId = option.partnerId || ''
		this.companyId = option.companyId
		this.latitude = option.latitude
		this.longitude = option.longitude
		this.carBrandId = option.carBrandId
		//310100&801&190&29&227
		//id=19301&proId=19240&cityId=310100&qt=1&carBrandId=29
		//option.scene = '310100&19481&53&31&&19521'
		if(option.scene){
		  const scene = decodeURIComponent(option.scene)
			//const scene = option.scene
			const sceneParams = scene.split("&")
			
			this.cityId = sceneParams[0]
		  this.carTypeYearProductId = sceneParams[1]
			this.thirdAppSubscribeId = sceneParams[5]
			
			partnerId = sceneParams[2]
			const merchantId = sceneParams[4]
			
			if (merchantId) {
				this.carBrandId = sceneParams[3]
				this.partnerId = partnerId
				const merchantMiniAPPParams = {
					merchantId,
					salesmanId: partnerId,
				}
				
				uni.setStorageSync('MerchantMiniAPP', merchantMiniAPPParams)
			}
	  }
		
		if (partnerId) {
			this.partnerId = partnerId
			const PartnerMiniAPPParams = {
				partnerId: this.partnerId,
				carTypeYearProductId: this.carTypeYearProductId
			}
			
			uni.setStorageSync('PartnerMiniAPP', PartnerMiniAPPParams)
		}
		
		uni.login({
			provider: 'weixin',
			onlyAuthorize: true,
			success: (loginRes) => {
				console.log('loginRes', loginRes)
				this.$getRequest(this.$url.getOpenId, 'POST', {
						code: loginRes.code,
				}).then( async (res) => {
					const openId = res.data.openid
					this.bindPartnerUser(openId, this.partnerId)
				})
			}
		})
		
		//this.thirdAppSubscribeId = '19286'
		
		//this.cityId = 110100
		
    this.init(option.qt)
		
		const routes = getCurrentPages(); // 获取当前打开过的页面路由数组
		const curRoute = routes[routes.length - 1] // 获取当前页面路由，也就是最后一个打开的页面路由
		let path = curRoute.route
		const curRouteOption = curRoute.options
		const keys = Object.keys(curRouteOption)
		keys.forEach((key, index) => {
			if (index === 0) {
				path += `?${key}=${curRouteOption[key]}`
			} else {
				path += `&${key}=${curRouteOption[key]}`
			}
		})
		this.shareUrl = path
		
		const isLogin = uni.getStorageSync('isLogin')
		
  },
	
  onShow() {
    const isLogin = uni.getStorageSync('isLogin')
		
		if (isLogin) {
			getApp().globalData.getUserInfo((data) => {
				this.userInfo = data
				this.shareUrl += `&partnerId=${data.id}`
			})
		}
		uni.login({
			provider: 'weixin',
			onlyAuthorize: true,
			success: (loginRes) => {
				this.$getRequest(this.$url.getOpenId, 'POST', {
					code: loginRes.code,
				}).then( async (res) => {
					const openId = res.data.openid
					const data = {
						openId,
						appUserEntity: {},
						partnerId: ""
					}
					this.$getRequest(this.$url.wechatLoginByOpenId, 'POST', data).then((result) => {
						this.partnerInfo = result.data || {}
						// this.partnerInfo.hasDepositFree = 3
					})
				})
			}
		})
		// if (this.partnerId) {
		// 	this.showScope = true
		// }
  },
	
  methods: {
		addUserCarIntention() {
			const data = {
				carTypeYearProductId: this.carTypeYearProductId,
				carTypeId: this.carDetailData.carTypeYearProductEntity.carTypeId,
				userId: this.userInfo.id,
			}
			this.$getRequest(this.$url.addUserCarIntention, 'POST', data).then((result) => {
				if (result.code === 0) {
					//
				}
			})
		},
		
		bindPartnerUser(openId, userId, isBindChange = 0) {
			const data = {
				openId,
				userId,
				fromCode: 2,
				isBindChange,
			}
			this.$getRequest(this.$url.bindPartnerUser, 'POST', data).then((result) => {
				if (result.code === 500006) {
					let content = errMsgObj[result.code] && errMsgObj[result.code].msg
					if (!content) {
						content = '系统繁忙，请稍后再试'
					}
					uni.showModal({
						title: '提示',
						content,
						confirmText: '确认',
						success: (res) => {
							if (res.confirm) {
								this.bindPartnerUser(openId, userId, 1)
							}
						},
						fail: (err) => {
							console.log('fail', err)
						}
					})
				}
			})
		},
		
		// 1. 订阅费用 2.保证金
	  showTrue(index){
			this.popupIndex = index
			this.isShowTrue=true
	  },
		
	  gotoDetail(id,title, monthTotal, item) {
			if (item.subscribeList.length === 1) {
				this.currentItem = item.subscribeList[0]
				this.show = true
			} else {
				var carTypeYearId = this.carDetailData.carTypeYearProductEntity.id
				let url = './detail?templateId='+id+'&cityId='+this.cityId+'&carTypeYearProductId='+carTypeYearId + '&title='+title + '&monthTotal='+monthTotal + '&needPurchaseTaxRatio='+this.needPurchaseTaxRatio
				if(this.companyId) {
					url += `&companyId=${this.companyId}`
				}
				uni.navigateTo({
					url
				})
				let option=`?templateId=${id}&cityId=${this.cityId}&carTypeYearProductId=${carTypeYearId}&title=${title}&monthTotal=${monthTotal}&needPurchaseTaxRatio=${this.needPurchaseTaxRatio}`
				uni.setStorageSync("option",option)
			}
	  },
		
    changeProdId(id) {
      this.prodId = id
    },
    changePayment(py) {
      this.monthPayment = py
    },
    init(qt) {
      this.getProductDetailData(qt)
			this.$refs.detailHead.init()
			
			try {
				const value = uni.getStorageSync('isAgreeFirstPagePrivacy');
				if (value) {
					this.getLocation()
				} else {
					this.selectCarDeliveryAddress()
				}
			} catch (e) {
				// error
			}
    },
    // 先用后面支付
    async handlePayBookCar(businessType) {
		var carData = this.carDetailData
		// console.log("1243",carData)
		// var carYearAndProduct = carData.carTypeYear+ ' '+carData.carTypeYearProduct
		var carYearAndProduct = JSON.stringify(carData)
		uni.navigateTo({
			// url:'./test-drive?carTypeYearProductId=' + carData.carTypeYearProduct + '&carBrand='+carData.carBrand +'&carType='+ carData.carType+ '&carTypeid='+carData.id+'&carYearAndProduct='+carYearAndProduct
			url:`./test-drive?carYearAndProduct=${carYearAndProduct}`
		})
		return//之前是支付 现在是预约试驾了，所以这里跳转其他页面了，就return 下面的不用执行
		
		
      // 验证身份认证
      uni.vibrateShort({})
      if(!getApp().globalData.userInfo) {
          this.$u.route("/pages/sign/sign")
          return false
      }
      
      if(getApp().globalData.userInfo.riskAuditStatus != 1 && getApp().globalData.userInfo.riskAuditStatus != 5) {
          uni.showModal({
              title: '提示',
              content: '身份认证后可用车',
              showCancel: false,
              confirmText: '去认证',
              success: (res) => {
                  if(res.confirm) {
                      this.$u.route('/pages/mine/identity/identity')
                  }
              }
          });
          return false
      }
      
      // 1. 订阅订单创建
      // uni.vibrateShort({})
      uni.showLoading({
          title: '订单创建中'
      });
      const result = await this.$getRequest(this.$url.createSubscribeOrder, 'POST', {
          "carSubscribeId": this.prodId,//this.carDetailData.carSubscribeRespVO.id
          "userId": this.userInfo.id
      })
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
      this.$u.route(`/pages/ordered/sub-order-info?id=${result.data.id}`)
      
      // // 2.创建微信订单
      // this.$requestPayment({
      //   businessId: result.data.id, // 订单ID
      //   businessType: 2, // 会员租车
      //   openid: this.userInfo.xcxOpenid,
      //   payType: '2', 
      //   total: 0.01, // TODO this.carDetailData.carSubscribeRespVO.reserveFee
      //   userId: this.userInfo.id,
      // }, (res) => {
      //   if(res == 'success') {
      //     // 支付成功 跳转订单详情 order-info
      //     this.$u.route(`/pages/ordered/order-info?id=${result.data.id}`)  
      //   }
      // })
    },
    // 一层首付支付
    handlePayFirst() {
      this.$requestPayment({
        businessId: this.carDetailData.id,
        openid: this.userInfo.xcxOpenid,
        payType: '4',
        total: this.carDetailData.deposit,
        userId: this.userInfo.id,
      }, (res) => {
        if(res == 'success') {
          //支付成功
        }
      })
    },
		
    getProductDetailData (qt = 1) {
      const pageThis = this
      uni.showLoading({
        title: '加载中'
      });
      const carDetailData = this.$getRequest(this.$url.productDetail, "POST", {
        carTypeYearProductId: this.carTypeYearProductId,
        cityId: this.cityId,
        queryType: this.queryType,
				companyId: this.companyId,
      }).then(carDetailData => {
        uni.hideLoading()
				
				if (!carDetailData.data || carDetailData.code !=0) {
					this.$u.route("/pages/error/nodata")
				}
				
				carDetailData.data.carSubscribeList.forEach(city => {
					city.respVOS.forEach(item => {
						const tempArr = []
						if (item.carSubscribeFreeServiceToWeb && item.carSubscribeFreeServiceToWeb.length) {
							item.carSubscribeFreeServiceToWeb.forEach(service => {
								tempArr.push(`${service.serviceName}`)
							})
							item.serviceStr = tempArr.join('、')
						}
					})
					
					
					// item.mid = 1
					// if (item.apportionRateCalculateResultList && item.apportionRateCalculateResultList.length) {
					// 	item.mid = Math.floor(item.apportionRateCalculateResultList.length/2)
					// }
					
				})
				
				this.carDetailData = JSON.parse(JSON.stringify(carDetailData.data));
				const allCarTypeYearProductEntity = this.carDetailData.allCarTypeYearProductEntity
				if (allCarTypeYearProductEntity && allCarTypeYearProductEntity.length) {
					const hasProduct = allCarTypeYearProductEntity.some(item => item.id == this.carTypeYearProductId)
					if (!hasProduct) {
						//this.carTypeYearProductId = allCarTypeYearProductEntity[0].id
					}
				}
				
				
				
				
				let carDetail = carDetailData.data;
				this.carTypeYearProductEntity = this.carDetailData.carTypeYearProductEntity
				if(carDetail.carSubscribeRespVO) {
          this.prodId = carDetail.carSubscribeRespVO.id
          this.monthPayment = carDetail.carSubscribeRespVO.monthPayment
        } else {
					this.carDetailData.carSubscribeRespVO = {
						monthPayment: 0
					}
				}
        
        // 判断tab隐藏
        this.queryTypeData = []
        this.queryTypeData.push({ id: 1, name: "新车订阅"})
        // if(carDetail.carTypeYearProductShowTabRespVO.showProduct > 0 && carDetail.monthProductList && carDetail.monthProductList.length) {
        //   this.queryTypeData.push({ id: 3, name: "会员租车"})
        // }
        // if(carDetail.carTypeYearProductShowTabRespVO.showSecondHandCars > 0) {
        //   this.queryTypeData.push({ id: 5, name: "二手好车"})
        // }
				
				this.shareImg = this.carDetailData.imageUrl
				const carBrand = this.carTypeYearProductEntity.carBrand || ''
				const carType = this.carTypeYearProductEntity.carType || ''
				const carTypeYear = this.carTypeYearProductEntity.carTypeYear || ''
				const carTypeYearProduct = this.carTypeYearProductEntity.carTypeYearProduct || ''
				this.shareDesc = `【全新车】${carBrand} ${carType} ${carTypeYear} ${carTypeYearProduct}`
        //this.$refs.tabs.init()
				
				this.needPurchaseTaxRatio = this.carDetailData.needPurchaseTaxRatio
			
				this.$nextTick(() => {
					uni.createSelectorQuery().select('.active').boundingClientRect(res=>{
						let left = res.left
						if (left > 100) {
							this.scrollLeft = res.left - 50
						}
					}).exec()
				})
				if (this.userInfo) {
					addUserCarIntention(1, this.carDetailData.carTypeYearProductEntity.carTypeId, this.userInfo.id)
				}
				
      })
      
    },
		
    // 切换车型
    changeCarTypeYearProductId (id) {
      if (this.carTypeYearProductId !== id) {
        this.carTypeYearProductId = id;
        //this.queryType = 1
        this.getProductDetailData();
      }
    },
    // 切换购买方式
    changeQueryType(tab,index) {
      this.queryType = tab
      
			this.getProductDetailData()
      
      // 切换tab时清空列表数据
      this.page = 0
      this.totalPages = 0
      // if (index === 2) {
      //   this.getLocation()
      //   this.certifiedCarData = []
      //   this.fetchCertifiedCar()
      // }
    },
    go2VipCard() {
      // 跳转到会员卡
      this.$u.route("/pages/mine/vipcard");
    },
    // 4S店接口
    async get4sList (page = 1) {
      const list4s = await this.$getRequest(this.$url.get4sList, "POST", {
        carTypeYearProductId: this.carTypeYearProductId,
        // carTypeYearProductId: 4599,
        lat: this.lat,
        lng: this.lng,
        page,
      });
      this.list4sData = this.list4sData.concat(list4s.data.records)
      this.totalPages = list4s.data.pages
      this.page = list4s.data.current
      this.status = 'loadmore'
    },
    // 二手车接口
    async fetchCertifiedCar(page = 1) {
      const certifiedCar = await this.$getRequest(
        this.$url.getCertifiedCar,
        "POST",
        {
          cityId: this.cityId,
          page,
        }
      );
      this.certifiedCarData = this.certifiedCarData.concat(certifiedCar.data.records)
      this.totalPages = certifiedCar.data.pages
      this.page = certifiedCar.data.current
      this.status = 'loadmore'
    },
    getLocation() {
			uni.getLocation({
        type: 'wgs84',
        success: async (res) => {
					this.lat = res.latitude
          this.lng = res.longitude
					this.selectCarDeliveryAddress()
        },
        fail: async (err) =>{
					console.log('fail', err)
					this.selectCarDeliveryAddress()
          // this.get4sList()
        }
      });
    },
    async handleRecord(index) {
      uni.vibrateShort();
      const res = await this.$getRequest(this.$url.createUserIntention, 'POST', {
          businessId: this.carTypeYearProductId,
          businessType: index,
          userId: this.userInfo.id,
      })
      uni.showToast({
          title: res.msg,
          duration: 2000,
          icon: 'none'
      });
    },
		
		handlerClickScope() {
			this.showScope = false
		},
		
		openIdentityDialog(identityDialogParams) {
			this.show = false
			this.identityDialogParams = identityDialogParams
			this.showIdentityDialog = true
		},
		
		selectCarDeliveryAddress (lat, longitude) {
			const carDetailData = this.$getRequest(this.$url.selectCarDeliveryAddress, "POST", {
		    brandId: this.carBrandId,
		    cityId: this.selCityId,
		    lat: this.lat,
				longitude: this.lng,
		  }).then(res => {
		    if (res.code === 0) {
					this.carAddress = res.data
				}
		  })
		},
		
		changeExpand() {
			this.expand = !this.expand
		},
		
		changeCurTemplate(data) {
			this.curTemplate = data.item
			this.selCityId = data.selCityId
			this.selectCarDeliveryAddress()
		},
		
		preChooseCarPlatePage(item) {
			this.goChooseCarPlatePage(item)
		},
		
		async goNextPage(item) {
			let url = ''
			if (this.userInfo) {
				// uni.showLoading({
				// 	title: '加载中'
				// })
				
				// const res = await this.$getRequest(this.$url.selectFinanceCityAndPlateMoney, 'GET', {
				// 	id: item.id
				// })
				
				// if (res.code === 0 && res.data && res.data.length) {
				// 	const city = res.data.find(item => item.cityId == this.selCityId)
				// 	if (city) {
				// 		if (city.isPlate === 0) {
							url = `/pagesOrder/order-detail/order-detail?id=${item.id}&carTypeYearProductId=${this.carTypeYearProductId}&cityId=${this.selCityId}&curPlate=1&cartype=1&orderId=&index=3`
						// } else {
						// 	url = `/pagesOrder/chooseCarPlate/restrictedCityCarPlate?id=${item.id}&cityId=${this.selCityId}&carTypeYearProductId=${this.carTypeYearProductId}&index=3&cartype=1&from=cardetailpage`
						// }
						
						uni.navigateTo({
							url,
						})
				//	}
				//}
				
				uni.hideLoading()
				
				
			} else {
				const routes = getCurrentPages() // 获取当前打开过的页面路由数组
				const curRoute = routes[routes.length - 1] // 获取当前页面路由，也就是最后一个打开的页面路由
				let path = curRoute.route
				const option = curRoute.options
				const keys = Object.keys(option)
				keys.forEach((key, index) => {
					if (index === 0) {
						path += `?${key}=${option[key]}`
					} else {
						path += `&${key}=${option[key]}`
					}
				})
				uni.setStorageSync("redirectUrl", url)
				this.$u.route("/pages/sign/sign?redirectUrl=1")
			}
		},
		
		getLocation1(item) {
			uni.getLocation({
		    type: 'wgs84',
		    success: async (res) => {
					this.lat = res.latitude
		      this.lng = res.longitude
					
					// 逆地理
					let qqmapsdk = new QQMapWX({
					    key: 'ONYBZ-WH6KF-BAIJO-NWS5O-KM4LS-BSFY4'
					});
					qqmapsdk.reverseGeocoder({
					    location: {
					        latitude: this.lat,
					        longitude: this.lng,
					    },
					    get_poi: 1,
					    coord_type: 1,
					    poi_options: 'policy=3;page_size=20',
					    success: (res) => {
								if(res.status == 0) {
									uni.setStorageSync("locationAddress", res.result)
									this.cityId = res.result.ad_info.adcode.slice(0,4) + '00'
									this.goNextPage(item)
								}
					    },
					    fail: function (res) {
								console.log('reverseGeocoder fail', res)
					    },
					})
		    },
		    fail: async (err) =>{
					console.log('fail', err)
		      // this.get4sList()
		    }
		  })
		},
		
		goChooseCarPlatePage(item) {
			try {
				const value = uni.getStorageSync('isAgreeFirstPagePrivacy')
				if (value) {
					this.goNextPage(item)
				} else {
					this.getLocation1(item)
				}
			} catch (e) {
				// error
			}
		},
		
		selectFinanceCityAndPlateMoney(item) {
				this.$getRequest(this.$url.selectFinanceCityAndPlateMoney, 'GET', {
					id: item.id
				}).then(res => {
					if (res.code === 0 && res.data && res.data.length) {
						const city = res.data.find(city => city.cityId == this.cityId)
						if (city) {
							if (city.isPlate === 0) {
								uni.navigateTo({
									url: `/pagesOrder/order-detail/order-detail?id=${item.id}&cityId=${this.cityId}&curPlate=1&cartype=1&index=3`
								})
							} else {
								uni.navigateTo({
									url: `/pagesOrder/chooseCarPlate/restrictedCityCarPlate?id=${item.id}&cityId=${this.cityId}&index=3&cartype=1&from=cardetailpage`
								})
							}
						}
					}
				})
		},
		
		openBuyoutsFeePopup(item) {
			this.curItem = item
			this.showBuyoutsFeePopup = true
		},
		
		colseBuyoutsFeePopup() {
			this.showBuyoutsFeePopup = false
		},
		
		openApportionPopup(item) {
			this.curItem = item
			this.showApportionPopup = true
		},
		
		colseApportionPopup() {
			this.showApportionPopup = false
		},
		
		handleLogin(e) {
			const {errMsg, encryptedData, iv} = e.detail
			if (errMsg === 'getPhoneNumber:ok') {
				uni.login({
					provider: 'weixin',
					onlyAuthorize: true,
					success: (loginRes) => {
							this.$getRequest(this.$url.getOpenId, 'POST', {
									code: loginRes.code,
							}).then( async (res) => {
									uni.setStorageSync('openId', res.data.openid)
									const data = await this.$getRequest(this.$url.decryptData, 'POST', {
									    encryptedData,
									    iv,
									    sessionKey: res.data.session_key
									})
									
									getApp().globalData.getMemberInfo(data.data.phoneNumber, '', '', (userinfo) => {
											uni.setStorageSync('isLogin', true)
											this.userInfo = userinfo
											getApp().globalData.userInfo = userinfo
											uni.setStorageSync('userInfo', {
													phoneNumber: data.data.phoneNumber,
									        name: userinfo.name,
									        avatarUrl: userinfo.imageUrl,
													partnerId: this.partnerId
									    })
									})
							})
					}
				})
			}
			
			this.$emit('handlerClick')
		}
  },
  onReachBottom() {
    if(this.page >= this.totalPages) {
      this.status = 'nomore';
      return;
    }
    this.status = 'loading';
    this.page = ++ this.page;
    if (this.curQueryType === 2) {
      // this.fetchCertifiedCar(this.page)
    }
    if(this.page >= this.totalPages) {
      this.status = 'nomore';
    }
  },
};
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
	
.profile {
    overflow-x: hidden;
    width: 100%;
    padding: 0;
    .m-active-tab {
      font-weight: bold !important;
      color: #0A0F2D !important;
    }
    .detail {
        .model-box {
            padding: 0 32rpx;
            // margin-top: 10rpx;
            margin-left: -4rpx;
            margin-right: -4rpx;
            .model-scroll {
                width: 100%;
                overflow: hidden;
                white-space: nowrap;
                .item {
					font-size: 24rpx;
                    background: rgba(10, 15, 45, 0.04);
                    border-radius: 8px;
                    padding: 12rpx 24rpx;
                    display: inline-block;
                    margin: 0 8rpx;
                    color: rgba(10, 15, 45, 0.8);
                }
                .active {
                    background: rgba(10, 235, 125, 0.6);
                    color: #0a0f2d;
                    font-weight: 500;
                }
            }
        }

        .car-body {
            margin-top: 50rpx;
            // margin-bottom: 108rpx;
            .car-mode {
                // margin-bottom: 88rpx;
            }
        }
    }
    .m-vip-view {
      margin: 0 32rpx;
      background: #ffffff;
      box-shadow: 0px -2px 32px rgba(10, 15, 45, 0.02),
          0px 8px 24px rgba(10, 15, 45, 0.06);
      border-radius: 24rpx;
      padding-left: 40rpx;
      padding-top: 24rpx;
      padding-bottom: 24rpx;
      font-weight: 700;
      font-size: 34rpx;
      color: #0A0F2D;
      
      .m-tg {
        width: 150rpx;
        margin-top: 16rpx;
        border: 1px solid rgba(10, 15, 45, 0.08);
        border-radius: 40rpx;
        padding: 4rpx 24rpx;
        font-weight: 500;
        font-size: 24rpx;
        color: rgba(10, 15, 45, 0.8);
        opacity: 0.8;
      }
    }
}
.f-center {
	display: flex;
	align-items: center;
}
.hiddenmore .more-item {
  display: none;
}
.popupClass{
	.popupClassTop{
		width: 100%;
		text-align: center;
		margin: 24px 0;
		height: 21px;
		font-family: PingFangSC-Medium;
		font-size: 15px;
		font-weight: 500;
		line-height: 21px;
		letter-spacing: 0px;
		color: rgba(0, 0, 0, 0.9);
		
	}
	.popupClassBom{
		margin:  28px;
		height: 104px;
		font-family: PingFangSC-Regular;
		font-size: 14px;
		font-weight: normal;
		line-height: 22px;
		letter-spacing: 0px;
		color: rgba(10, 15, 45, 0.8);
		margin-bottom: 90px;
	}
}
.more{
	margin-top:32rpx;
	text-align: center;
	position: relative;
	.more-text{
		font-size: 28rpx;
	}
	.more-show-text:before{
		position: absolute;
		content: "";
		width: 0;
		height: 0;
		top: 6px;
		right: 126px;
		border-right: solid 10rpx transparent;
		border-left: solid 10rpx transparent;
		border-top: solid 16rpx black;
	}
	.more-hide-text:before{
		position: absolute;
		content: "";
		width: 0;
		height: 0;
		top: 6px;
		right: 152px;
		border-right: solid 10rpx transparent;
		border-left: solid 10rpx transparent;
		border-bottom: solid 16rpx black;
	}
}
.m-col{
	margin-top: 10rpx;
}
.card {
    font-family: PingFang SC;
    margin: 0 32rpx;
    margin-top: 24rpx;
    background: #ffffff;
    box-shadow: 0px -2px 32px rgba(10, 15, 45, 0.02),
        0px 8px 24px rgba(10, 15, 45, 0.06);
    border-radius: 24rpx;
    padding: 20px 32rpx;
    .m-info-row {
		.m-col-title{
			position: relative;
			top: -18rpx;
			right: -4px;
			font-size: 12px;
		}
      .m-col-title-txt {
        font-weight: normal;
        font-size: 14px;
        line-height: 22px;
        color: #64696F;
		margin-left:6rpx;
      }
      .m-col-val-txt {
        font-weight: normal;
        font-size: 14px;
        line-height: 22px;
        color: #0A0F2D;
		
      }
	  .m-col-val-img{
		  width: 48rpx;
		  height: 48rpx;
	  }
	  .m-col-title-title{
		  font-size: 32rpx;
		  font-weight: 600;
	  }
	  .m-col-left-head{
		  width: 44rpx;
		  height: 44rpx;
		  margin-right: 6rpx;
	  }
	  .m-col-val-news-img{
		  width: 33rpx;
		  height: 33rpx;
		  margin-right: 3rpx;
	  }
		.payOff{
			color: #000;
			opacity: 0.5;
			font-size: 12px;
			margin-left:4px;
		}
    }
    .car-mode-info {
        position: relative;
        margin-bottom: 32rpx;
        padding-bottom: 32rpx;
        .car-brand-logo {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 1;
            width: 88rpx;
            height: 88rpx;
            display: inline-block;
        }
        .mode-info-head {
            margin-left: 112rpx;
            .mode-info-brand {
                font-size: 30rpx;
                font-weight: 500;
            }
            .mode-info-p {
                margin-top: 40rpx;
                .divider-x {
                    &:after {
                        right: 60rpx;
                    }
                }
            }
        }
    }
    .car-des {
        color: rgba(10, 15, 45, 0.5);
        &-t {
            margin: 12rpx 40rpx 12rpx 0;
            line-height: 40rpx;
            font-size: 24rpx;
            display: flex;
            flex-direction: row;
            // align-items: center;
            &-label {
                width: 146rpx;
            }
            &-content {
                flex: 1;
            }
        }
        &-end {
            &-label {
                margin: 12rpx 0;
                line-height: 40rpx;
                font-size: 24rpx;
            }
            .col {
                &-content {
                    margin: 6rpx 0rpx;
                    box-sizing: border-box;
                    background: #FFFFFF;
                    border: 2rpx solid rgba(10, 15, 45, 0.04);
                    border-radius: 24rpx;
                    box-shadow: 0rpx -4rpx 64rpx rgba(10, 15, 45, 0.02), 0px 8px 24px rgba(10, 15, 45, 0.04);
                    line-height: 48rpx;
                }
            }
        }
    }
}
.endItem{
	display: flex;
	align-items: center;
	.endItemImg{
		width: 18px;
		height: 18px;
		background: #FDF7DF;
		border-radius: 50%;
		.itemImg{
			width: 10px;
			height: 10px;
			margin-bottom: 2rpx;
			margin-left: 7rpx;
		}
	}
	.itemImg{
		width: 20px;
		height: 20px;
	}
	.itemText{
		margin-left: 5px;
		font-size: 14px;
		color: #0A0F2D;
		opacity: 0.8;
		white-space: nowrap;
		// position: relative;
		// top: 1px;
	}
	.btnText{
		font-size: 12px;
		font-weight: 500;
		color: #0A0F2D;
		margin-right: 5px;
	}
		
}
						
.info-circle{
	width: 28rpx;
	height: 28rpx;
	margin-left: 12rpx;
	color: rgba(10, 15, 45, 0.5);
}
.process {
    .process-t {
        font-size: 30rpx;
        color: #0a0f2d;
        margin-top: 10rpx;
        text-align: center;
        font-weight: 500;
    }
    .process-list {
        margin-top: 40rpx;
        .process-list-t {
            font-size: 28rpx;
            margin-bottom: 8rpx;
            font-weight: 500;
            text {
                width: 24rpx;
                height: 23rpx;
                background: url("https://image.51cheyaoshi.com/xcx/app/static/icon4.png") no-repeat;
                background-size: 100%;
                display: inline-block;
                margin-right: 8rpx;
            }
        }
        .process-list-text {
            color: #666666;
            font-size: 24rpx;
            display: inline-block;
            margin-left: 40rpx;
            line-height: 40rpx;
        }
    }
}
.cardBom{
	margin-bottom: 300rpx;
	
}

.car-address-wrap {
	.title {
		margin-top: 24px;
		margin-bottom: 12px;
		padding-left: 40rpx;
		display: flex;
		align-items: center;
		.title-text {
			height: 24px;
			font-size: 15px;
			line-height: 24px;
			color: #0A0F2D;
			font-weight: bold;
		}
		.line {
			transform: translate(2rpx) rotate(114deg) skew(20deg);
			background: #0AEB7D;
			width: 32rpx;
			height: 8rpx;
		}
	}
	.card {
		padding: 20px 32rpx;
		.address-card {
			margin-bottom: 20px;
			&:last-child {
				margin-bottom: 0;
			}
		}
		.address-wrap {
			display: flex;
			.img-box {
				width: 204rpx;
				height: 130rpx;
				border-radius: 16rpx;
				overflow: hidden;
				.item-img {
					width: 100%;
					height: 100%;
				}
			}
			.address-info {
				padding-left: 24rpx;
				flex: 1;
				width: 0;
				.top-line {
					display: flex;
					justify-content: space-between;
				}
				.address-name {
					flex: 1;
					height: 44rpx;
					font-family: PingFangSC-Medium;
					font-size: 15px;
					line-height: 44rpx;
					color: rgba(10, 15, 45, 0.8);
					@include text-overflow;
				}
				.distance {
					padding-left: 20rpx;
					font-size: 12px;
					color: rgba(10, 15, 45, 0.8);
				}
				.address-detail {
					margin-top: 12px;
					display: flex;
					.address-icon-wrap {
						height: 40rpx;
						line-height: 40rpx;
					}
					.address {
						margin-left: 2px;
						font-size: 12px;
						line-height: 40rpx;
						color: rgba(10, 15, 45, 0.5);
					}
				}
			}
		}
		.expand-btn {
			margin-top: 20px;
			display: flex;
			justify-content: center;
			align-items: center;
			.expand-text {
				padding-left: 8rpx;
				height: 36rpx;
				font-family: PingFangSC-Regular;
				font-size: 12px;
				line-height: 36rpx;
				color: rgba(10, 15, 45, 0.8);
			}
		}
	}
}

.plan-item {
	margin-top: 12px;
	display: flex;
	.item-title {
		margin-right: 24rpx;
		height: 44rpx;
		font-size: 14px;
		line-height: 44rpx;
		color: #64696F;
	}
	.item-content {
		flex: 1;
		font-size: 14px;
		line-height: 44rpx;
		color: #0A0F2D;
	}
	.item-sub {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.left {
			flex: 1;
			font-size: 14px;
			line-height: 44rpx;
			color: #0A0F2D;
			display: flex;
			align-items: center;
		}
		.right {
			margin-left: 20rpx;
			width: 44rpx;
			height: 44rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
	
	.item-sub {
		margin-top: 12px;
		&:first-child {
			margin-top: 0;
		}
	}
}

.order-btn-wrap {
	width: 100vw;
	position: fixed;
	bottom: 40px;
	left: 0;
	z-index: 100;
	padding: 0 40rpx;
	.order-btn {
		width: 100%;
		height: 116rpx;
		border-radius: 16rpx;
		background: #0A0F2D;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 17px;
		color: #FFFFFF;
	}
}

.popup {
	::v-deep .u-drawer-content{
		padding: 0 80rpx;
		.u-mode-center-box {
			width: 100% !important;
		}
		.wrap {
			width: 100%;
			padding: 32px 32rpx;
			.popup-title {
				margin-bottom: 23px;
				height: 60rpx;
				font-size: 20px;
				line-height: 60rpx;
				color: #141414;
				text-align: center;
			}
			.container {
				.item {
					margin-bottom: 12px;
					display: flex;
					justify-content: space-between;
					align-items: center;
					height: 44rpx;
					font-size: 14px;
					line-height: 44rpx;
					color: #64696F;
				}
			}
			.table {
				.row {
					margin-bottom: 16px;
					display: flex;
					justify-content: space-between;
					align-items: center;
					height: 44rpx;
					font-size: 14px;
					line-height: 44rpx;
					color: rgba(10, 15, 45, 0.8);
				}
				.col {
					flex: 1;
					text-align: center;
				}
				.table-header {
					color: rgba(10, 15, 45, 0.5);
				}
			}
			.bottom {
				width: 100%;
				display: flex;
				justify-content: center;
				.btn {
					margin-top: 36px;
					width: 346rpx;
					height: 76rpx;
					border-radius: 8rpx;
					background: #0A0F2D;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 17px;
					color: #FFFFFF;
				}
			}
			
			.tip {
				margin-top: 18px;
				text-align: center;
				height: 36rpx;
				font-size: 12px;
				line-height: 36rpx;
				color: rgba(10, 15, 45, 0.5);
			}
		}
	}
}

.wx-btn {
	margin-top: 24px;
	width: 346rpx;
	::v-deep button {
		width: 100%;
		height: 40px;
		border-radius: 4px;
		background: #0A0F2D;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 17px;
		font-weight: 500;
		color: #FFFFFF;
	}
}

.tabs {
	margin-bottom: 16px;
	padding: 0 32rpx;
	display: flex;
	align-items: center;
	.tab {
		margin-right: 32rpx;
		display: flex;
		align-items: center;
		font-size: 14px;
		color: rgba(10, 15, 45, 0.8);
		height: 50rpx;
		line-height: 50rpx;
		&.tab-active {
			font-weight: 600;
			color: #0A0F2D;
		}
		.line {
			transform: translateY(-2rpx) rotate(114deg) skew(20deg);
			background: #0AEB7D;
			width: 32rpx;
			height: 8rpx;
		}
	}
}
</style>
