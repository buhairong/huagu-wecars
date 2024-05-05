<template>
  <view class="certCarDetailPage" v-if="carDetailData">
    <view
      v-if="carDetailData"
      class="detail"
    >
      <!-- banner -->
      <view class="banner u-margin-bottom-28">
        <u-swiper
          class="banner-swiper"
          :list="carDetailData.imageUrlList" 
          :title="false"
          height="300"
          mode="number"
          indicator-pos="bottomRight"
          :effect3d="false"
          autoplay
          interval="3000"
          :circular="true"
          duration="500" 
          bg-color=""
        />
      </view>
			
      <view class="car-brand">
				<view class="brand">
					{{ carDetailData.carTypeYearProductEntity.carBrand || '' }} {{ carDetailData.carTypeYearProductEntity.carType || '' }}
				</view>
        <view class="btns">
        	<view class="btn">
        		<image
        			style="width:40rpx;height:40rpx;"
        			mode="aspectFit"
        			src="https://image.51cheyaoshi.com/xcx/app/static/img/Path.png"
        		/>
        	</view>
        	<button class="btn share" open-type="share">
        		<image
        			style="width:40rpx;height:40rpx;"
        			mode="aspectFit"
        			src="https://image.51cheyaoshi.com/xcx/app/static/img/Launch.png"
        		/>
        	</button>
        </view>
      </view>
			<view class="car-type">
			  {{ carDetailData.carTypeYearProductEntity.carTypeYear || '' }} {{ carDetailData.carTypeYearProductEntity.carTypeYearProduct || '' }}
			</view>
			
      <view class="section-title">
      	<view class="text">
      		车辆档案
      	</view>
      </view>
      <view class="card">
          <view class="u-flex u-row-between car-flex-info">
            <view class="u-flex-1 u-text-center">
              <view class="u-font-28 u-font-weight">{{ carDetailData.templateRespVO[0].regDateStr ? `${carDetailData.templateRespVO[0].regDateStr}` : '-'}}</view>
              <view class="color-rgba u-font-24 u-padding-top-4">车龄</view>
            </view>
            <view class="u-text-center m-h-line">|</view>
            <view class="u-flex-1 u-text-center">
              <view class="u-font-28 u-font-weight">{{ carDetailData.templateRespVO[0].mileage ? formatTenThousandNumber(carDetailData.templateRespVO[0].mileage, 'W', '公里') : '-'}}</view>
              <view class="color-rgba u-font-24 u-padding-top-4">里程</view>
            </view>
            <view class="u-text-center m-h-line">|</view>
            <view class="u-flex-1 u-text-center">
              <view class="u-font-28 u-font-weight">{{ carDetailData.templateRespVO[0].city || '-'  }}</view>
              <view class="color-rgba u-font-24 u-padding-top-4">所在城市</view>
            </view>
            <view class="u-text-center m-h-line">|</view>
            <view class="u-flex-1 u-text-center">
              <view class="u-font-28 u-font-weight">{{ getPowerModeName(carDetailData.carTypeYearProductEntity.powerMode) }}</view>
              <view class="color-rgba u-font-24 u-padding-top-4">能源方式</view>
            </view>
          </view>
          <view class="u-row-left u-padding-top-34">
            <view class="u-padding-top-40">
						  <view class="u-flex car-flex-info">
						    <view class="u-flex-1 u-text-center">
						      <view class="u-font-28 u-font-weight">事故检测</view>
						      <view class="color-rgba u-font-24 u-padding-top-10">
						        <view class="adopt-icon">
											<image
												style="width:100%;height:100%;"
												src="https://image.51cheyaoshi.com/xcx/app/static/adopt_icon.png"
											/>
						        </view>通过
						      </view>
						    </view>
						    <view class="u-flex-1 u-text-center">
						      <view class="u-font-28 u-font-weight">非火烧车</view>
						      <view class="color-rgba u-font-24 u-padding-top-10">
						        <view class="adopt-icon">
						          <image
						          	style="width:100%;height:100%;"
						          	src="https://image.51cheyaoshi.com/xcx/app/static/adopt_icon.png"
						          />
						        </view>通过
						      </view>
						    </view>
						    <view class="u-flex-1 u-text-center">
						      <view class="u-font-28 u-font-weight">非泡水车</view>
						      <view class="color-rgba u-font-24 u-padding-top-10">
						        <view class="adopt-icon">
						          <image
						          	style="width:100%;height:100%;"
						          	src="https://image.51cheyaoshi.com/xcx/app/static/adopt_icon.png"
						          />
						        </view>通过
						      </view>
						    </view>
						  </view>
						</view>
          </view>
        </view>
			</view>
			
			<view>
				<view 
					v-for="(item,index) in carDetailData.templateRespVO" 
					:key="index" class="card"
				>
					<TemplateItem 
						v-if="carDetailData && carDetailData.templateRespVO && carDetailData.templateRespVO.length"
						:templateRespVO="carDetailData.templateRespVO"
						:item="item"
						:newType="2"
						:cityId="cityId"
						:userInfo="userInfo"
					/>
					 
				</view>
			</view>
			
			
			
			<view class="bottom foot-sticky" v-if="carDetailData.templateRespVO.length === 1">
				<view class="order-btn" @click="goChooseCarPlatePage(carDetailData.templateRespVO[0])">
					立即订车
				</view>
			</view>
			
			<u-popup 
				v-model="showPopup" 
				mode="bottom"
				border-radius="12"
				closeable="true"
				close-icon-color="#0A0F2D"
			>
				<view class="popup-wrap">
					<view class="subscription" v-if="popupIndex === 1">
						<view class="title">
							「二手车订阅」流程
						</view>
						<view class="popup-content">
							<view class="item">
								<view class="title-wrap">
									<u-image
									  class="title-icon"
									  src="https://image.51cheyaoshi.com/xcx/app/static/right_green.png"
									  width="24rpx"
									  mode="widthFix"
									/>
									1.订阅产品
								</view>
								<view class="text">
									选择适合您的订阅方案及商户，在线支付订金。
								</view>
							</view>
							<view class="item">
								<view class="title-wrap">
									<u-image
									  class="title-icon"
									  src="https://image.51cheyaoshi.com/xcx/app/static/right_green.png"
									  width="24rpx"
									  mode="widthFix"
									/>
									2.资质认证
								</view>
								<view class="text">
									客户经理协助您上传签约用户身份信息，认证通过即可签约。
								</view>
							</view>
							<view class="item">
								<view class="title-wrap">
									<u-image
									  class="title-icon"
									  src="https://image.51cheyaoshi.com/xcx/app/static/right_green.png"
									  width="24rpx"
									  mode="widthFix"
									/>
									3.签约付款
								</view>
								<view class="text">
									您签订合约并按照合同约定的付款方式及金额支付相关费用。
								</view>
							</view>
							<view class="item">
								<view class="title-wrap">
									<u-image
									  class="title-icon"
									  src="https://image.51cheyaoshi.com/xcx/app/static/right_green.png"
									  width="24rpx"
									  mode="widthFix"
									/>
									4.交付车辆
								</view>
								<view class="text">
									销售人员与您预约验车、交车时间，完成车辆交付。
								</view>
							</view>
						</view>
					</view>
					<view class="subscription" v-else-if="popupIndex === 2">
						<view class="title">
							「分期购车」流程
						</view>
						<view class="popup-content">
							<view class="item">
								<view class="title-wrap">
									<u-image
									  class="title-icon"
									  src="https://image.51cheyaoshi.com/xcx/app/static/right_green.png"
									  width="24rpx"
									  mode="widthFix"
									/>
									1.选择产品
								</view>
								<view class="text">
									选择适合您的分期方案，在线支付订金。
								</view>
							</view>
							<view class="item">
								<view class="title-wrap">
									<u-image
									  class="title-icon"
									  src="https://image.51cheyaoshi.com/xcx/app/static/right_green.png"
									  width="24rpx"
									  mode="widthFix"
									/>
									2.资质认证
								</view>
								<view class="text">
									客户经理协助您上传签约用户身份信息，认证通过即可签约。
								</view>
							</view>
							<view class="item">
								<view class="title-wrap">
									<u-image
									  class="title-icon"
									  src="https://image.51cheyaoshi.com/xcx/app/static/right_green.png"
									  width="24rpx"
									  mode="widthFix"
									/>
									3.签约付款
								</view>
								<view class="text">
									您签订合约并按照合同约定的付款方式及金额支付相关费用。
								</view>
							</view>
							<view class="item">
								<view class="title-wrap">
									<u-image
									  class="title-icon"
									  src="https://image.51cheyaoshi.com/xcx/app/static/right_green.png"
									  width="24rpx"
									  mode="widthFix"
									/>
									4.交付车辆
								</view>
								<view class="text">
									销售人员与您预约验车、交车时间，完成车辆交付。
								</view>
							</view>
						</view>
					</view>
				</view>
			</u-popup>
			<PopupInfo
				:showPopuInfo.sync="showPopuInfo"
				:popupIndex="popupIndex"
				:detailInfo="carDetailData"
				:subscribeItem="subscribeItem"
				:stagingItem="stagingItem"
				@openIdentityDialog="openIdentityDialog"
			/>
			<scope
				v-if="showScope"
				:partnerId="partnerId"
				@handlerClick="handlerClickScope"
			/>
			
			<IdentityDialog
				v-if="showIdentityDialog"
				:show.sync="showIdentityDialog"
				:identityDialogParams="identityDialogParams"
			/>
  </view>
</template>

<script>
import stagesItem from "@/pages/home/profile/component/stages-item";
// import detailHead from "@/pages/home/common/detail-head";
import dayjs from 'dayjs';
import { powerModeAll } from "@/constants"
import { formatTenThousandNumber, formatThousandNumber } from '@/utils/index.js'
import PopupInfo from './components/PopupInfo.vue'
import scope from '../common/scope.vue'
import IdentityDialog from '../../mine/components/IdentityDialog.vue'
import TemplateItem from './components/TemplateItem.vue'
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
      stagesItem,
			PopupInfo,
			scope,
			IdentityDialog,
			TemplateItem,
    },
		
    filters: {
      powerModeName(value) {
        return powerModeAll.find(item => item.value === value).name
      },
      formatDate(value) {
        return dayjs(value).format('YYYY年MM月DD日')
      }
    },
		
    data() {
      return {
        showSlider: true,
        userInfo: null,
        carTypeYearProductId: '',
				carId: null,
        cityId : '',
        carDetailData: null,
        certifiedCarData: [],
        status: 'loadmore', // 加载更多 状态
        page: 0, // 第N页
        totalPages: 0, // 总页数
        loadText: {
          loadmore: '轻轻上拉',
          loading: '努力加载中',
          nomore: '实在没有了'
        },
        curQueryType: 5,
        list4sData: [],
        lat: 0,
        lng: 0,
				showPopup: false,
				showPopuInfo: false,
				popupIndex: 1,
				subscribeItem: {},  // 当前弹框显示的订阅方案
				stagingItem: {}, // 当前弹框显示的分期方案
				supportSubscription: null, // 是否支持订阅 0支持，1不支持
				partnerId: '', // 分享人 userId
				shareUrl: '',
				shareDesc: '',
				shareImg: '',
				showScope: false,
				showIdentityDialog: false,
				riskAuditStatus: null,
				identityDialogParams: {},
				subscribeId: null,
      };
    },
		
    computed: {
      carTypeYearProductImageList () {
				if (this.carDetailData) {
					if(this.carDetailData.carTypeYearProductImageList) {
					  return this.carDetailData.carTypeYearProductImageList.map(item => {
					      return {
					        ...item,
					        image: item.imageUrl
					      }
					  });
					} else {
					  return [{ image: this.carDetailData.imageUrl }]
					}
				}
				
				return []
      },
    },
		
    onLoad(option) {
			let cityId = uni.getStorageSync("cityId")
			if(option) {
        this.carId = option.id
        this.cityId = cityId || option.cityId || option.city
				this.subscribeId = option.subscribeId
				this.supportSubscription = option.supportSubscription || option.sub
				this.partnerId = option.id2
      }
			if(option.scene){
			  const scene = decodeURIComponent(option.scene)
				const sceneParams = scene.split("&")
				this.carId = sceneParams[0]
			  this.cityId = sceneParams[1]
			  this.supportSubscription = sceneParams[2]
				
				
				const sceneUserId = sceneParams[3]
				const merchantId = sceneParams[4]
				
				if (merchantId) {
					this.partnerId = sceneUserId
					const merchantMiniAPPParams = {
						merchantId: merchantId,
						salesmanId: sceneUserId,
					}
					uni.setStorageSync('MerchantMiniAPP', merchantMiniAPPParams)
				}
			}
      this.init()
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
    },
		
    onShow() {
			// if (this.partnerId && !getApp().globalData.userInfo) {
			// 	this.showScope = true
			// } else {
			// 	getApp().globalData.userInfo = null
			// 	getApp().globalData.getUserInfo((data) => {
			// 			this.userInfo = data
			// 	})
			// }
			
			const isLogin = uni.getStorageSync('isLogin')
			
			if (isLogin) {
				getApp().globalData.getUserInfo((data) => {
					this.userInfo = data
					this.init()
				})
			}
    },
		
    methods: {
      init() {
        this.getProductDetailData()
      },
			// 查询二手车详情页
      async getProductDetailData () {
        uni.showLoading({
          title: '加载中'
        });
        const carDetailData = await this.$getRequest(this.$url.getCertifiedCarDetail, "POST", {
            carId: this.carId,
						supportSubscription: this.supportSubscription,
						merchantId: this.subscribeId,
        });
				
				if (carDetailData.data) {
					this.carDetailData = carDetailData.data;
					const regDate = dayjs(carDetailData.data.regDate).format('YYYY年MM月')
					this.carDetailData.regDate = dayjs(carDetailData.data.regDate).format('YYYY年MM月DD日')
					if (this.carDetailData.imageUrlList.length === 0 && this.carDetailData.imageUrl) {
						this.carDetailData.imageUrlList.push(this.carDetailData.imageUrl)
					}
					
					this.shareImg = this.carDetailData.imageUrl
					const carBrand = this.carDetailData.carBrand || ''
					const carType = this.carDetailData.carType || ''
					const carTypeYear = this.carDetailData.carTypeYear || ''
					const carTypeYearProduct = this.carDetailData.carTypeYearProduct || ''
					const mileage = this.carDetailData.mileage ? formatTenThousandNumber(this.carDetailData.mileage, '万', '') : ''
					
					this.shareDesc = `${carBrand} ${carType} ${carTypeYear} ${carTypeYearProduct}（${mileage}公里，${regDate}上牌）`
					
					this.carDetailData.templateRespVO.forEach(item => {
						item.finalSelect = JSON.parse(item.finalSelect)
						const tempArr = []
						if (item.carSubscribeFreeServiceToWeb && item.carSubscribeFreeServiceToWeb.length) {
							item.carSubscribeFreeServiceToWeb.forEach(service => {
								tempArr.push(`${service.serviceName}x${service.size}`)
							})
							item.serviceStr = tempArr.join('、')
						}
						
					})
					
					if (this.userInfo) {
						addUserCarIntention(2, this.carDetailData.carTypeYearProductEntity.carTypeId, this.userInfo.id)
					}
				} else {
					this.$u.route("/pages/error/nodata")
				}
        
        uni.hideLoading();
				
				
      },
      
      go2CertCarDetail(id) {
        this.$u.route(`/pages/home/certcar/detail?id=${id}&cityId=${this.cityId}`);
      },
			goAllPlansPage() {
				if(this.carDetailData.subscribeList && this.carDetailData.subscribeList.length) {
					this.showPop(3, this.carDetailData.subscribeList[0])
				}
				
				// uni.showLoading({
				// 	title: '加载中'
				// })
				// try {
				// 	uni.setStorageSync('certcarAllPlansInfo', JSON.stringify(this.carDetailData));
				// } catch (e) {
				// 	// error
				// }
				// this.$u.route(`/pages/home/certcar/all-plans?cityId=${this.cityId}`);
			},
        // 先用后面支付
        handlePayBookCar() {
            this.$requestPayment({
                businessId: this.carDetailData.id,
                openid: this.userInfo.xcxOpenid,
                payType: '3',
                total: this.carDetailData.minProductEntity.deposit,
                userId: this.userInfo.id,
            }, (res) => {
                console.log(res);
                if(res == 'success') {
                    //支付成功
                }
            })
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
                console.log(res);
                if(res == 'success') {
                    //支付成功
                }
            })
        },
        
        // 切换车型
        changeCarTypeYearProductId (id) {
            if (this.carTypeYearProductId !== id) {
                this.carTypeYearProductId = id;
                this.curQueryType = 1;
                this.getProductDetailData();
            }
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
        getLocation() {
            uni.getLocation({
                type: 'wgs84',
                success: async (res) => {
                    this.lat = res.latitude
                    this.lng = res.longitude
                    // console.log('当前位置的经度：' + res.longitude);
                    // console.log('当前位置的纬度：' + res.latitude);
                    // this.get4sList()
                },
                fail: async (err) =>{
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
        async handleLike() {
            uni.vibrateShort({})
            if(!this.userInfo) {
                getUserProfile(`/pages/home/certcar/detail?id=${this.carTypeYearProductId}`, () => {
                    this.$u.route("/pages/sign/sign");
                });
            } else {
                const res = await this.$getRequest(this.$url.likeProduct, 'POST', {
                    carTypeYearProductId: this.carTypeYearProductId,
                    userId: this.userInfo.id,
                })
                if(res.code != 0) {
                    return false;
                }
                uni.showToast({
                    title: '已收藏',
                    duration: 2000
                });

                setTimeout(() => {
                    this.$emit('clickInit')
                }, 1000)

            }

        },
				formatTenThousandNumber(number, unit1, unit2) {
					return formatTenThousandNumber(number, unit1, unit2)
				},
				formatThousandNumber(price) {
					return formatThousandNumber(price)
				},
				formatPrice(price) {
					let res = ''
					if(price || price == 0) {
						if (price > 10000) {
							res = formatTenThousandNumber(price)
						} else {
							res = `${formatThousandNumber(price)}元`
						}
					}
					
					return res
				},
				getTranscationNum(transcationNum) {
					let res = ''
					if (!transcationNum && transcationNum !== 0) {
						res = '-'
					} else {
						if (transcationNum === 0) {
							res = '首次'
						} else {
							res = `${transcationNum}次`
						}
					}
					
					return res
				},
				getPowerModeName(index) {
					const mode = powerModeAll.find(item => item.value === index)
					if (mode) {
						return mode.name
					}
					
					return '-'
				},
				// 1.订阅流程 2.分期流程 3.订阅方案 4.分期方案
				showPop(index, item={}) {
					this.popupIndex = index
					if (index < 3) {
						this.showPopup = true
					} else if (index === 3) {
						this.showPopuInfo = true
						this.subscribeItem = item
					} else if (index === 4) {
						this.showPopuInfo = true
						this.stagingItem = item
					}
				},
				handlerClickScope() {
					this.showScope = false
				},
				
				goDIYPage() {
					//this.$u.route(`/pages/diy/diy?companyId=${this.carDetailData.companyId}`)
				},
				
				goIMPage() {
					let userId = 'custom'
					const chat_info = {
						userInfo: {},
						shopInfo: {},
					}
					if (this.userInfo) {
						userId = this.userInfo.id
						chat_info.userInfo = this.userInfo
					}
					//this.$u.route(`/IMPackage/im/im?userId=${userId}`)
				},
				
				openIdentityDialog(identityDialogParams) {
					console.log('openIdentityDialog', identityDialogParams)
					this.show = false
					this.identityDialogParams = identityDialogParams
					this.showIdentityDialog = true
				},
				
				goChooseCarPlatePage(item) {
					if (this.userInfo) {
						let url = `/pagesOrder/chooseCarPlate/chooseCarPlate?id=${item.id}&cityId=${this.cityId}&index=3&cartype=2&from=cardetailpage`
						uni.navigateTo({
							url
						})
					} else {
						const routes = getCurrentPages(); // 获取当前打开过的页面路由数组
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
						this.$u.route("/pages/sign/sign")
					}
				},
    },
    
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.certCarDetailPage {
  margin: 20px;
  padding: 0;
	padding-bottom: 200rpx;
  
  .m-carinfo-title {
    font-weight: normal;
    font-size: 22px;
    line-height: 30px;
    color: #0A0F2D;
  }
  .m-price-txt {
    font-weight: 600;
    font-size: 34rpx;
    color: #F5194B;
  }
  .m-title-price {
    font-weight: 400;
    font-size: 12px;
    color: rgba(10, 15, 45, 0.5);
  }
	.info-bottom-right {
		background: #0A0F2D;
		border-radius: 8rpx;
		color: #fff;
		padding: 12rpx 24rpx;
    font-weight: 500;
    font-size: 12px;
	}
  .m-icon-right {
    width: 16rpx !important;
    height: 16rpx !important;
  }
  .m-h-line {
    color: rgba(10, 15, 45, 0.04);
  }
  .m-long-view-1 {
    width: 60%;
  }
  .m-long-view-2 {
    width: 55%;
  }
	
	.price-wrap {
		padding-right: 20rpx;
		.dealer-price {
			font-size: 34rpx;
			font-weight: 600;
			color: #F5194B;
		}
		.guidance-price {
			font-size: 24rpx;
			color: rgba(10, 15, 45, 0.5);
			padding-left: 8rpx;
		}
	}
	.price-info {
		justify-content: space-between;
		.supplier-info {
			width: 300rpx;
			display: flex;
			align-items: center;
			.supplier-name {
				padding-left: 8rpx;
				font-size: 28rpx;
				color: rgba(10, 15, 45, 0.8);
				@include text-overflow;
			}
		}
	}
	
	
	
	.card {
		background: #FFFFFF;
		box-shadow: 0px -2px 32px rgba(10, 15, 45, 0.02), 0px 4px 24px rgba(10, 15, 45, 0.04);
		border-radius: 24rpx;
		padding: 40rpx 32rpx;
	}
	.car-flex-info {

	}
	.color-grey {
		color: #64696F;
	}
	.color-black {
		color: #0A0F2D;
	}
	.adopt-icon {
		width: 36rpx;
		height: 36rpx;
		display: inline-block;
		vertical-align: middle;
		margin-right: 8rpx;
	}
	.car-image {
		background: rgba(10, 15, 45, 0.04);	
		border-radius: 16rpx;
	}
	.phone-service {
		background: rgba(10, 15, 45, 0.04);
		border-radius: 16px;
		padding: 36rpx 36rpx;
		text-align: center;
		font-weight: 500;
		font-size: 30rpx;
		margin-left: 16rpx;
	}
	.notice {
		background: #0A0F2D;
		border-radius: 16px;
		padding: 18rpx 36rpx;
		text-align: center;
		font-weight: 500;
		font-size: 30rpx;
		color: #fff;
		margin-left: 24rpx;
		.notice-date {
			color: rgba(255, 255, 255, .8);
		}
		
	}
	.s-icon {
		width: 32rpx;
		height: 28rpx;
		margin: 0 auto;
		margin-bottom: 15rpx;
		
	}
	.banner {
		background: rgba(10, 15, 45, 0.04);
    	border-radius: 16rpx;
	}
	
	.section-title {
		margin-top: 40rpx;
		padding-bottom: 24rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.text {
			font-size: 34rpx;
			font-weight: 500;
			color: #0A0F2D;
		}
		.btn-wrap {
			display: flex;
			font-size: 28rpx;
			color: rgba(10, 15, 45, 0.5);
			.title-link-btn-text {
				padding-left: 8rpx;
			}
		}
	}
	
	.subscribe-item {
		.subscribe-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.subscribe-name {
				font-size: 32rpx;
				font-weight: 500;
				color: #0A0F2D;
			}
			.subscribe-price-wrap {
				display: flex;
				align-items: center;
				.text {
					font-size: 24rpx;
					color: #0A0F2D;
					padding-right: 8rpx;
				}
				.subscribe-price {
					font-size: 32rpx;
					font-weight: 500;
					color: #F5194B;
				}
			}
		}
		.service {
			display: flex;
			padding-top: 18rpx;
			flex-wrap: wrap;
			.service-tag {
				padding: 2rpx 4rpx;
				border-radius: 4rpx;
				background: #F5F6F7;
				font-size: 20rpx;
				color: rgba(10, 15, 45, 0.8);
				margin-right: 8rpx;
				margin-bottom: 12rpx;
			}
		}
		
		.end-title {
			font-size: 28rpx;
			font-weight: 500;
			color: #0A0F2D;
			padding-top: 22rpx;
		}
		
		.end-wrap {
			padding-top: 18rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 28rpx;
			color: rgba(10, 15, 45, 0.8);
			.purchase, .return-car {
				display: flex;
				align-items: center;
				.purchase-img-wrap {
					width: 40rpx;
					height: 40rpx;
					border-radius: 50%;
					background-color: #FDF7DF;
					display: flex;
					justify-content: center;
					align-items: center;
					margin-right: 10rpx;
					.purchase-img {
						width: 22rpx;
						height: 22rpx;
					}
				}
			}
			#return-car-wrap {
				background: rgba(25, 126, 245, 0.1);
				.return-car-img {
					width: 36rpx;
					height: 36rpx;
					transform: translateX(2rpx);
				}
			}
			.detail-btn {
				margin-left: 20rpx;
				padding: 8rpx 20rpx;
				border-radius: 8rpx;
				background: rgba(10, 15, 45, 0.04);
				font-size: 24rpx;
				font-weight: 500;
				color: #0A0F2D;
				display: flex;
				align-items: center;
				.detail-arrow {
					margin-left: 12rpx;
					width: 16rpx;
					height: 16rpx;
				}
			}
		}
	}
	
	.staging-item {
		padding: 20rpx 20rpx;
		border-radius: 8rpx;
		box-sizing: border-box;
		border: 2rpx solid rgba(10, 15, 45, 0.1);
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 24rpx;
		&:first-child {
			margin-top: 0;
		}
		.plans {
			display: flex;
			align-items: center;
			padding-right: 20rpx;
			.period {
				width: 80rpx;
				text-align: center;
				font-size: 32rpx;
				font-weight: 500;
				color: #0A0F2D;
			}
			.split-line {
				width: 0;
				height: 40rpx;
				border-right: 2rpx solid #EEEEEE;
				margin: 0 20rpx;
			}
			.first-payment, .month-payment {
				font-size: 28rpx;
				color: rgba(10, 15, 45, 0.8);
			}
			.first-payment {
				padding-right: 24rpx;
			}
			.month-price {
				color: #0A0F2D;
			}
		}
	}
	
	.bottom {
		background: #fff;
		padding: 0 32rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.btns {
			display: flex;
			align-items: center;
			.btn {
				margin-right: 32rpx;
				height: 90rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-between;
				font-size: 24rpx;
				color: rgba(10, 15, 45, 0.8);
			}
			.share {
				background: #fff;
				border: none;
				padding: 0;
				line-height: unset;
				&:after {
					border: none;
				}
			}
		}
		.order-btn {
			margin-left: 20rpx;
			flex: 1;
			height: 116rpx;
			border-radius: 16rpx;
			background: #0A0F2D;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 30rpx;
			font-weight: 500;
			color: #FFFFFF;
		}
	}
	.popup-wrap {
		padding: 28rpx 48rpx;
		.subscription {
			.title {
				font-size: 30rpx;
				font-weight: 500;
				color: rgba(0, 0, 0, 0.9);
				text-align: center;
			}
			.popup-content {
				padding-top: 68rpx;
				padding-bottom: 100rpx;
				.item {
					padding-bottom: 48rpx;
					.title-wrap {
						font-size: 28rpx;
						font-weight: 500;
						color: #0A0F2D;
						display: flex;
						align-items: flex-start;
						.title-icon {
							margin-right: 8rpx;
						}
					}
					.text {
						font-size: 24rpx;
						color: #666666;
						padding: 12rpx 52rpx 0;
						line-height: 34rpx;
					}
				}
			}
		}
	}
}

.car-brand {
	display: flex;
	justify-content: space-between;
	.brand {
		font-family: PingFangSC-Medium;
		font-size: 20px;
		line-height: 60rpx;
		color: #333333;
	}
	.btns {
		display: flex;
		align-items: center;
		.btn {
			margin-left: 32rpx;
		}
		.share {
			background: #fff;
			border: none;
			padding: 0;
			line-height: unset;
			&:after {
				border: none;
			}
		}
	}
}
.car-type {
	font-family: PingFang SC;
	font-size: 14px;
	line-height: 60rpx;
	color: #767676;
}
</style>
