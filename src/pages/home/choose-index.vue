<!--
 * @Author: your name
 * @Date: 2021-11-01 17:52:29
 * @LastEditTime: 2022-02-27 17:17:05
 * @LastEditors: luchun
 * @Description: In User Settings Edit
 * @FilePath: /butler-super/src/pages/index/index.vue
-->
<template>
  <view>
  <view>
      <u-sticky>
          <header-top
              :show-loc="true"
              :loc-city="locCity"
              :city="city"
              @changeCity="changeCity"
          />
      </u-sticky>
  </view>
		<view class="content">
        <view class="index">
            

            <view class="choose-home">
                <!-- banner -->
                <view class="banner">
                    <u-swiper
                        :list="list"
                        border-radius="24"
                        @click="handleBanner"
                    />
                </view>

                <!-- 车品牌 -->
                <!-- <view class="brand-list u-flex">
                    <view
                        v-for="(item, index) in brand"
                        :key="index"
                        class="u-flex-1"
                        @click="handleSearch(item, 'brand')"
                    >
                        <u-image
                            class="brand-img"
                            :src="item.logoUrl"
                            width="72rpx"
                            height="72rpx"
                        />
                        <view class="brand">
                            {{ item.brandName }}
                        </view>
                    </view>
                </view> -->
                <view class="u-margin-top-40">
                  <scroll-view scroll-x :class="brandLength<=9?'m-brand-scroll':'m-brand'" show-scrollbar="false">
					<!-- @click="handleSearch(item, 'brand')" -->
					<view
                      v-for="(item, index) in brand"
                      :key="index"
                      class="m-item"
					  @click="searList(item)"
                    >
                      <view class="m-item-view u-flex u-row-center">
							<image
								class="m-item-img"
								style="width:72rpx;height:72rpx;"
								:src="item.logoUrl"
							/>
                      </view>
                      <view class="brand u-text-center">
                        {{ item.brandName }}
                      </view>
                    </view>          
				  </scroll-view>
                </view>
				<view class="more" @click="handleSearch('', 'brand')">
					<text>更多品牌</text>
					<u-icon size="15" name="play-right-fill"></u-icon>
				</view>
                <!-- 筛选类型 -->
             <!--   <view class="type-list">
                    <u-row gutter="16">
                        <u-col
                            v-for="(item, index) in type"
                            :key="index"
                            span="3"
                            @click="handleSearch(item)"
                        >
                            <view class="item">
                                {{ item.name }}
                            </view>
                        </u-col>
                    </u-row>
                </view> -->
                <!-- <view class="u-font-30" @click="generLink">点击测试链接</view> -->
                <!-- 拼团 -->
                <view
                    v-if="firstActivityData.id"
                    class="collage"
                >
                    <u-section
                        title="WE拼团"
                        :show-line="false"
                        :font-size="24"
                        sub-title="更多"
                        class="more-section"
                        @click="goCollageListPage"
                    />
                    <view class="collage-list">
                        <collage-item  :collage-detail-data="firstActivityData" />
                    </view>
                </view>

                <!-- tabs -->
                <view class="tabs-swiper  u-margin-bottom-60">
                    <view class="tabs-wrap" :style="{ top: 44 + custom.top - 16 + 'px' }">
                        <!-- <u-tabs
                            ref="tabs"
                            :duration="0.2"
                            :active-item-style="styleCustom"
                            :bar-style="barStyleCustom"
                            active-color="#0A0F2D"
                            inactive-color="#5e5e61"
                            :list="listTabs"
                            font-size="28"
                            :gutter="24"
                            :is-scroll="true"
                            :current="current"
                            @change="change"
                        /> -->
												
												<view class="tabs">
													<view 
														v-for="(tab, index) in listTabs"
														:key="index"
														class="tab"
														:class="{'tab-active': index == current}"
														@click="change(index)"
													>
														<view class="line" v-if="index == current"></view>
														{{tab.name}}
													</view>
												</view>
												
												<CustomOrderBtn :showTopCustomBtn="showTopCustomBtn" v-if="current == 0" />
                    </view>

                    <!-- 新车订阅 -->
                    <view
                      v-if="current == 0"
                      class="custom-margin-t"
                    >
                      <view v-if="carSubscribeData.length > 0">
                        <view
													v-for="(item, index) in carSubscribeData"
													:key="index"
													:class="index === carSubscribeData.length - 1 ? 'first-box' : 'first-box u-border-bottom'"
                        >
													<NewCarListItem 
														:item="item"
														:cityId="cityId"
													/>
                        </view>
												<view class="slide-up-wrap">
													<!-- <image
														style="width:48rpx;height:48rpx;"
														mode="aspectFill"
														src="https://image.51cheyaoshi.com/xcx/app/static/right_green.png"
													/> -->
													<u-icon name="arrow-right-double" color="#737373" size="32" style="transform: rotate(-90deg);"></u-icon>
													上滑查看更多订阅方案
												</view>
                      </view>
                      <u-empty v-if="carSubscribeData.length == 0" text="暂无车源" mode="list" margin-top="40"></u-empty>
                    </view>
										
                    <!-- 会员租车 -->
                    <view v-if="current == 1">
                      <view v-if="parRentalCarData.length > 0">
												<view class="rental-list">
													<view
														v-for="(item, index) in parRentalCarData"
														:key="index"
														class="rental"
													>
														<RentalCarListItem 
															:item="item"
															:cityId="cityId"
														/>
													</view>
												</view>
                      </view>
                      <u-empty v-if="parRentalCarData.length == 0" text="暂无车源" mode="list" margin-top="40"></u-empty>
                    </view>

                    <!-- 二手好车 -->
                    <view
                        v-if="current == 2"
                        class="custom-margin-t"
                    >
                      <!-- <view v-if="certifiedCarData.length > 0"> -->
                        <!-- 排序条件 -->
                       
											<view class="filter-tabs">
												<view class="tags">
													<view 
														v-for="item in orderByTypeAll"
														:key="item.key"
														class="tag"
														:class="{'tag-active': item.key == tagId}"
														@click="clickCertTag(item.key)"
													>
														{{item.name}}
														<view class="soft-group" v-if="item.key != 0">
															<u-icon 
																name="arrow-up-fill" 
																:color="`${item.key == tagId && sort === 1 ? '#0A0F2D' : 'rgba(10, 15, 45, 0.5)'}`" 
																size="12"
															></u-icon>
															<u-icon 
																name="arrow-down-fill" 
																:color="`${item.key == tagId && sort === 2 ? '#0A0F2D' : 'rgba(10, 15, 45, 0.5)'}`" 
																size="12"
															></u-icon>
														</view>
													</view>
												</view>
											</view>

											<view
													v-for="(item, index) in certifiedCarData"
													:key="index"
													class="certified-car u-margin-top-40"
											>
													<OldCarListItem
														:item="item"
														:cityId="cityId"
														:supportSubscription="supportSubscription"
													/>
											</view>
												
                    
									
											<view class="loading-wrap" v-if="loadingCertifiedCarData">
												<u-loading class="loading"></u-loading>
											</view>
											<u-empty v-if="certifiedCarData.length === 0 && errMsg.certifiedCarList" :text="errMsg.certifiedCarList" mode="list" margin-top="40"></u-empty>
                    </view>
												<!-- <view
												    v-if="current == 3"
												    class="custom-margin-t"
												>
													<view class="building-wrap">
														<image
															class="building-img"
															src="https://image.51cheyaoshi.com/xcx/app/static/home/building-function.png"
														/>
														<view class="building-title">敬请期待</view>
														<view class="building-sub-title">功能正在建设中...</view>
													</view>
												</view> -->
										
										<view
											v-if="current == 3"
											class="custom-margin-t"
										>
											<!-- <view class="building-wrap">
												<image
													class="building-img"
													src="https://image.51cheyaoshi.com/xcx/app/static/home/building-function.png"
												/>
												<view class="building-title">敬请期待</view>
												<view class="building-sub-title">功能正在建设中...</view>
											</view> -->
											<view
												v-for="(item, index) in auctionCarData"
												:key="index"
												class="certified-car u-margin-top-40"
											>
												<AuctionCarListItem
													:item="item"
												/>
											</view>
											
											<u-empty v-if="auctionCarData.length === 0 && errMsg.auctionCarData" :text="errMsg.auctionCarData" mode="list" margin-top="40"></u-empty>
											
										</view>
										
                    <u-loadmore
												v-show="totalPages >= 1 && status"
                        :status="status"
                        :load-text="loadText"
                    />
                </view>
            </view>
        </view>

        <u-picker
            v-model="showCityPicker"
            mode="selector"
            :default-selector="[cityIndex]"
            range-key="city"
            :range="openCityList"
            @confirm="confirmCity"
        />
    </view>
		
		<AgreeMentPopup :show.sync="showFirstPageAgreeMentPopup" @agree="handleAgree"/>
		
		<u-modal 
			v-model="showConfigModal" 
			:title="tipModel.title" 
			:content="tipModel.content"
			:confirm-text="tipModel.btnText"
			confirm-color="#576B95"
			:show-cancel-button="false"
			@confirm="confirmConfigModal"
		></u-modal>
		
		<u-modal
			v-model="showTipModal" 
			:title="tipModel.title" 
			:content="tipModel.content"
			:confirm-text="tipModel.btnText"
			confirm-color="#576B95"
			:show-cancel-button="false"
		></u-modal>
		
  </view>
</template>

<script>
import collageItem from "./collage/collage-item.vue";
import QQMapWX from '@/qqmap-wx-jssdk.min.js';
import { orderByType, errMsgObj } from "@/constants"
import { formatTenThousandNumber, formatThousandNumber } from '@/utils/index.js'
import CustomOrderBtn from './components/CustomOrderBtn.vue'
import AgreeMentPopup from '@/pages/agreement/components/AgreeMentPopup.vue'
import NewCarListItem from './components/NewCarListItem.vue'
import OldCarListItem from './components/OldCarListItem.vue'
import AuctionCarListItem from './components/AuctionCarListItem.vue'
import RentalCarListItem from './components/RentalCarListItem.vue'

const app = getApp()
export default {
  onShareAppMessage(res) {
    return {
      title: '车要试 让有车生活 · 更简单',
      desc: '',
      path: this.shareUrl,
      imageUrl: '', // ./../..https://image.51cheyaoshi.com/xcx/app/static/logo.png
    }
  },
  onShareTimeline(res) {
    
  },
    name: "ChooseIndex",
    components: {
        collageItem,
				CustomOrderBtn,
				AgreeMentPopup,
				NewCarListItem,
				OldCarListItem,
				RentalCarListItem,
				AuctionCarListItem,
    },
    data() {
        return {
						shareUrl: '/pages/home/choose-index',
						showFirstPageAgreeMentPopup: false,
            isAgree: '',
						supportSubscription: 1,
            checked: false,
            tagId: 0,
            sort: 0, // 0 未排序 1 升序 2 降序
						brandLength:0,//品牌长度
			
            orderByTypeAll: orderByType,
            showCityPicker: false,
            openCityList: [],
            locCity: { city: '上海', id: 310100 },
            city: '上海',
            cityIndex: 0,
            cityId: 310100,
            styleCustom: {
                fontWeight: 'bold',
								fontSize: '34rpx'
            },
            firstActivityData: {
                joinUser: []
            },

            current: 0,
            barStyleCustom: {
                'position': 'absolute',
                'top': '36rpx',
                'transform': 'rotate(112deg) skew(20deg)',
                'background': '#0AEB7D',
                'width': '32rpx',
                "left": '-6rpx',
                'height': '8rpx',
                'border-radius': 0
            },
            listTabs: [
              { name: "新车订阅" },
              // { name: "先用后买" },
              // { name: "一成首付" },
              { name: "会员租车" },
              // { name: "折扣新车" },
              { name: "二手好车" },
							{ name: "好车易拍" },
              // { name: "无忧新能源" },
            ],
            custom: app.globalData.custom,
            title: "Hello",
            list: [],
            brand: [],
            type: [
                { name: "轿车", tagValue: '1', type: 'mold', },
                { name: "SUV", tagValue: '2', type: 'mold' },
                { name: "MPV", tagValue: '3', type: 'mold' },
                { name: "跑车", tagValue: '4', type: 'mold' },
                { name: "30万以内", tagValue: '0-300000', type: 'guidancePriceRange' },
                { name: "30-100万", tagValue: '300000-1000000', type: 'guidancePriceRange' },
                { name: "100-300万", tagValue: '1000000-3000000', type: 'guidancePriceRange' },
                { name: "更多条件" },
            ],
            carSubscribeData: [],
            creditBuyData: [],
            onePercentPayData: [],
            parRentalCarData: [],
            discountCarData: [],
            certifiedCarData: [],
						auctionCarData: [],

            status: 'loadmore', // 加载更多 状态
            page: 0, // 第N页
            totalPages: 0, // 总页数
            loadText: {
                loadmore: '轻轻上拉',
                loading: '努力加载中',
                nomore: '实在没有了'
            },
						errMsg: {
							certifiedCarList: '',
							auctionCarData: '',
						},
						loadingCertifiedCarData: false,
						latitude: '',
						longitude: '',
						tabsScrollTop: 0,
						showTopCustomBtn: false,
						isLoad: true,
						userInfo: {},
						showConfigModal: false,
						showTipModal: false,
						tipModel: {
							title: '',
							content: '',
							btnText: '',
						},
        };
    },
		
    async onLoad(option) {
			// option.scene = '68'
			
			// 66 oMHQK5fOGrPgRrnTnrb1nMxSVmP4
			let partnerId = option.partnerId || ''
			if(option.scene || partnerId){
				let scene = ''
				
				if (option.scene) {
					scene = decodeURIComponent(option.scene)
				}
			  
				const userId = scene || partnerId
				uni.login({
					provider: 'weixin',
					onlyAuthorize: true,
					success: (loginRes) => {
						this.$getRequest(this.$url.getOpenId, 'POST', {
								code: loginRes.code,
						}).then( async (res) => {
							let openId = res.data.openid
							//openId = ''
							this.bindPartnerUser(openId, userId)
						})
					}
				})
			}
			this.init()
			wx.getPrivacySetting({
				success: async res => {
					console.log('getPrivacySetting', res)
					// 返回结果为: res = { needAuthorization: true/false, privacyContractName: '《xxx隐私保护指引》' }
					if (res.needAuthorization) {
						// 需要弹出隐私协议
						this.showFirstPageAgreeMentPopup = true
					} else {
						// 用户已经同意过隐私协议，所以不需要再弹出隐私协议，也能调用已声明过的隐私接口
						await this.getLocation()
						this.getUserInfo()
					}
				},
				fail: () => {},
				complete: () => {}
			})
			
    },
		
		onShow() {
			if (!this.isLoad) {
				this.getUserInfo()
			}
			uni.removeStorageSync('rentalForm')
			
			const isLogin = uni.getStorageSync('isLogin')
			
			if (isLogin) {
				getApp().globalData.getUserInfo((data) => {
					this.shareUrl += `?partnerId=${data.id}`
				})
			}
		},
		
    onReady() {
			this.isLoad = false
    },
		
    methods: {
			bindPartnerUser(openId, userId, isBindChange = 0) {
				const data = {
					openId,
					userId,
					fromCode: 1,
					isBindChange,
				}
				this.$getRequest(this.$url.bindPartnerUser, 'POST', data).then((result) => {
					if (result.code === 500006) {
						let content = errMsgObj[result.code] && errMsgObj[result.code].msg
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
					} else if (result.code === 500007) {
						let title = errMsgObj[result.code] && errMsgObj[result.code].msg
						uni.showToast({
							title,
							duration: 2000,
							icon: 'none'
						})
					}
				})
			},
			
			cancelNotice(type, userId) {
				const params = {
					userId,
					type,
				}
				
				this.$getRequest(this.$url.cancelNotice, "GET", params).then(res => {
					if (res.code === 0) {
						if (type === 2) {
							uni.navigateTo({
								url: `/pagesOrder/depositFree/guarantorRefuse?userId=${userId}`
							})
						}
					}
				})
			},
			
			cancelPartnerNotice(userId) {
				const params = {
					userId,
				}
				
				this.$getRequest(this.$url.cancelPartnerApplyNotice, "GET", params)
			},
			
			async partnerCompanyInvite(userId, partnerCompanyId, status, partnerCompany) {
				const params = {
					userId,
					partnerCompanyId,
					status,
				}
				
				const res = await this.$getRequest(this.$url.invitePartnerCompanyUser, "GET", params)
				
				if (res.code === 0) {
					const title = `您已 ${status == 1 ? '同意' : '拒绝'} ${partnerCompany} 的邀请`
					uni.showToast({
						title,
						duration: 2000,
						icon: 'none',
					})
				}
			},
			
			getUserInfo() {
				const isLogin = uni.getStorageSync('isLogin')
				if (isLogin) {
					getApp().globalData.getUserInfo(async (data) => {
						this.userInfo = data
						let userId = data.id
						
						const params = {
							userId
						}
						const res = await this.$getRequest(this.$url.selectHasModifyOtherConfig, "GET", params)
						if (res.code === 0 && res.data) {
							if (res.data.hasNewOrder) {
								this.tipModel.title = '新增订单'
								this.tipModel.content = '您收到了一个全新车订阅订单，请及时查看。'
								this.tipModel.btnText = '查看订单'
								this.showConfigModal = true
							} else if (res.data.hasNewConfig) {
								this.tipModel.title = '增配项信息'
								this.tipModel.content = '您订阅的车辆增配项信息已更新，请前往查看并确认。'
								this.tipModel.btnText = '查看增配项'
								this.showConfigModal = true
							} else if (res.data.isPassPartner === 1) {
								uni.showModal({
									title: '恭喜您',
									content: '您的全民合伙人申请已通过。',
									confirmText: '我知道了',
									showCancel: false,
									success: (res) => {
										if (res.confirm) {
											this.cancelPartnerNotice(userId)
										}
									},
									fail: (err) => {
										console.log('fail', err)
									}
								})
							} else if (res.data.isPassPartner === 2) {
								uni.showModal({
									title: '抱歉',
									content: '您的全民合伙人申请未通过。',
									confirmText: '我知道了',
									showCancel: false,
									success: (res) => {
										if (res.confirm) {
											this.cancelPartnerNotice(userId)
										}
									},
									fail: (err) => {
										console.log('fail', err)
									}
								})
							} else if (res.data.partnerCompanyId) {
								const content = `${res.data.partnerCompany} 邀请你加入全民合伙人`
								uni.showModal({
									title: '全民合伙人邀请',
									content,
									confirmText: '同意',
									cancelText: '拒绝',
									success: (res1) => {
										if (res1.confirm) {
											this.partnerCompanyInvite(userId, res.data.partnerCompanyId, 1, res.data.partnerCompany)
										} else {
											this.partnerCompanyInvite(userId, res.data.partnerCompanyId, 2, res.data.partnerCompany)
										}
									},
									fail: (err) => {
										console.log('fail', err)
									}
								})
							}  
							// else if (res.data.hasGuarantorNotice === 2) {
							// 	uni.showModal({
							// 		title: '提示',
							// 		content: '很抱歉，您所添加的担保人已拒绝为您提供担保。您可以重新添加其他担保人。',
							// 		confirmText: '查看',
							// 		showCancel: false,
							// 		success: (res) => {
							// 			if (res.confirm) {
							// 				this.cancelNotice(2, userId)
							// 			}
							// 		},
							// 		fail: (err) => {
							// 			console.log('fail', err)
							// 		}
							// 	})
							// } 
							// else if (res.data.hasDepositFreeApplyNotice === 1) {
							// 	uni.showModal({
							// 		title: '恭喜您',
							// 		content: `您申请的车辆免押金已获批准。车辆免押金截止日期为 ${res.data.validDate}。`,
							// 		confirmText: '我知道了',
							// 		showCancel: false,
							// 		success: (res) => {
							// 			if (res.confirm) {
							// 				this.cancelNotice(1, userId)
							// 			}
							// 		},
							// 		fail: (err) => {
							// 			console.log('fail', err)
							// 		}
							// 	})
							// } 
							// else if (res.data.hasDepositFreeApplyNotice === 2) {
							// 	uni.showModal({
							// 		title: '抱歉',
							// 		content: '您的车辆免押金未通过。',
							// 		confirmText: '我知道了',
							// 		showCancel: false,
							// 		success: (res) => {
							// 			if (res.confirm) {
							// 				this.cancelNotice(1, userId)
							// 			}
							// 		},
							// 		fail: (err) => {
							// 			console.log('fail', err)
							// 		}
							// 	})
							// }
						}
					})
				}
			},
			
			confirmConfigModal() {
				uni.navigateTo({
					url: `/pages/mine/order-list`
				})
				this.showConfigModal= false
			},
			
			async handleAgree() {
				await this.getLocation()
				this.getUserInfo()
			},
			searList(v){
				this.$u.route('/pages/home/search/list?brandName='+v.brandName+'&logoUrl='+v.logoUrl+"&id="+v.id+'&cityId='+this.cityId+'&from=home')
			},
      handleBanner(index) {
        if (this.list[index] && this.list[index].linkType == 2) {
          this.$u.route(this.list[index].linkUrl);
        }
        if (this.list[index] && this.list[index].linkType == 1) {
          this.$goHtml(this.list[index].linkUrl, '')
        }
      },
      // 正式发布版才能跳小程序ID
      // generLink() {
      //   uni.request({
      //       url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx059c31aa403b1703&secret=cd22df361021f9505d54cec2b234fbd5',
      //       method: 'GET',
      //       success: (res) => {
      //           console.log(res.data.access_token);
      //           let token = res.data.access_token
      //           uni.request({
      //             url: 'https://api.weixin.qq.com/wxa/generate_urllink?access_token=' + token,
      //             method: 'POST',
      //             data: {},
      //             success: (res2) => {
      //                 console.log(res2);
      //             },
      //             fail(err) {
      //                 console.log(err);
      //             },
      //           });
      //       },
      //       fail(err) {
      //           console.log(err);
      //       },
      //   });
      // },
        // 点击切换城市
        async changeCity() {
            const pageThis = this
            const res = await this.$getRequest(this.$url.cityList, "POST",{});
            this.openCityList = res.data
            // 查找cityIndex
            this.openCityList.forEach(function(item, index) {
                if(pageThis.city.indexOf(item.city) >= 0) {
                    pageThis.cityIndex = index
                    pageThis.cityId = item.id
                }
            })
            this.showCityPicker = true
        },
        // 获取定位城市编码
        getLocation() {
					const pageThis = this
					// 北京 110100
					this.city = '上海'
					this.cityCode = '310100'
					
					let city = '上海'
					let cityCode = '310100'
					let latitude = ''
					let longitude = ''
					
					return new Promise(resolve => {
						uni.getLocation({
						    type: 'gcj02', //返回可以用于uni.openLocation的经纬度
						    success: function (res) {
										latitude = res.latitude;
						        longitude = res.longitude;
										pageThis.latitude = latitude
										pageThis.longitude = longitude
						        // 逆地理
						        let qqmapsdk = new QQMapWX({
						            key: 'ONYBZ-WH6KF-BAIJO-NWS5O-KM4LS-BSFY4'
						        });
						        qqmapsdk.reverseGeocoder({
						            location: {
						                latitude: latitude,
						                longitude: longitude
						            },
						            get_poi: 1,
						            coord_type: 1,
						            poi_options: 'policy=3;page_size=20',
						            success: function (res) {
														if(res.status == 0) {
																uni.setStorageSync("locationAddress", res.result)
															
						                    // 156310000 截取中间4位
						                    cityCode = res.result.ad_info.city_code
						                    city = res.result.ad_info.city
						                    pageThis.city = city
																
																if (res.result.ad_info.adcode != 330782) {
																	pageThis.cityId = res.result.ad_info.adcode.slice(0,4) + '00'
																}
						                    
						                    pageThis.locCity = { city: city, id: cityCode.slice(3,9), provinde: res.result.ad_info.province }
																
																const frontCityCode = pageThis.cityId.slice(0,3)
																if (frontCityCode == '110') {
																	pageThis.cityId = '110100'
																}
																
																if (frontCityCode == '310') {
																	pageThis.cityId = '310100'
																}
																
																if (frontCityCode == '120') {
																	pageThis.cityId = '120100'
																}
																
																if (frontCityCode == '500') {
																	pageThis.cityId = '500100'
																}
						                    
						                    uni.setStorageSync("city",city)
						                    uni.setStorageSync("cityId",pageThis.cityId)
						                    
						                } else {
						                  uni.setStorageSync("city",pageThis.city)
						                  uni.setStorageSync("cityId",pageThis.cityCode)
						                }
						            },
						            fail: function (res) {
														console.log('reverseGeocoder fail', res)
						                // console.log("qqmapsdk.reverseGeocoder fail", res)
						                // console.log(res)
						                // 默认北京
						                uni.setStorageSync("city",pageThis.city)
						                uni.setStorageSync("cityId",pageThis.cityCode)
						            },
						            complete: function (res) {
													//pageThis.init()
												}
						        });
						    },
								fail: function (res) {
									console.log('getLocation fail', res)
									pageThis.init()
								},
								complete: () => {
									resolve()
								}
						})
					})
        },
        // 初始化数据
        async init() {
						const pageThis = this
            this.getActivityList();
            const data = await this.$getRequest(this.$url.banner, "POST", {
                cityId: pageThis.cityId,
            });
            this.list = data.data.map((item) => {
                item.image = item.bannerUrl;
                return item;
            });
            const brand = await this.$getRequest(this.$url.brandList, 'POST', {});
            this.brand = brand.data.slice(0,10);
						this.brandLength=this.brand.length
            this.fetchCarSubscribe();
            // this.fetchCreditBuy();
						
						this.$nextTick(() => {
							uni.createSelectorQuery().select('.tabs').boundingClientRect(res=>{
								this.tabsScrollTop = res.top
							}).exec()
						})
        },
        // 确认切换城市
        confirmCity(index) {
            this.locCity = { city: this.openCityList[index].city, id: this.openCityList[index].id }
            this.cityIndex = index
            this.cityId = this.openCityList[index].id
            this.city = this.openCityList[index].city
            uni.setStorageSync("city",this.openCityList[index].city)
            uni.setStorageSync("cityId",this.openCityList[index].id)
            // 初始化数据
            this.firstActivityData = { joinUser: [] }
            this.carSubscribeData = []
            this.creditBuyData = []
            this.certifiedCarData = []
            this.current = 0
            this.barStyleCustom.transform = `translate(0px) rotate(112deg) skew(20deg)`
            this.init()
        },
		changeCheckedSupportSubscription(e) {
			if (e.value) {
				this.supportSubscription = 1
			} else {
				this.supportSubscription = 0
			}
			this.certifiedCarData = []
			this.fetchCertifiedCar()
		},
        clickCertTag(e) {
			if (this.tagId != e) {
				this.sort = 0
			}
			if (e === -1) {
				this.supportSubscription === 0 ? this.supportSubscription = 1 : this.supportSubscription = 0
			} else {
				this.tagId = e
				if (this.tagId >=1 && this.tagId <=3) {
					if (this.sort === 0 || this.sort === 2) {
						this.sort = 1
					} else if (this.sort === 1){
						this.sort = 2
					}
				} else {
					this.sort = 0
				}
			}
          
          this.certifiedCarData = []
          this.fetchCertifiedCar()
        },
        // 团购列表
        async getActivityList() {
            const pageThis = this
            const activityList = await this.$getRequest(
                this.$url.activityList,
                "POST",
                { cityId: pageThis.cityId }
            );
            if(activityList.code == 0) {
              if(activityList.data.records && activityList.data.records.length > 0) {
                this.firstActivityData = activityList.data.records[0];
              }
            }
        },
        // handleCollage() {
        //     this.$u.route('/pages/home/collage/collage-detail', {
        //         id: this.firstActivityData.id
        //     })
        // },
        async fetchCarSubscribe(page = 1) {
						const pageThis = this
            const carSubscribe = await this.$getRequest(
                this.$url.getCarSubscribe,
                "POST",
                {
										businessType: 3,
                    cityId: pageThis.cityId,
                    page
                }
            )
						
						carSubscribe.data.records.forEach(item => {
							item.finalSelectStr = ''
							const tempArr = []
							if (item.finalSelect) {
								let finalSelect = JSON.parse(item.finalSelect)
								finalSelect.forEach(item => {
									if (item == 0) {
										tempArr.push('买断')
									} else if (item == 1) {
										tempArr.push('退回')
									} else if (item == -1) {
										tempArr.push('续订')
									}
								})
								item.finalSelectStr = tempArr.join('、')
							}
						})
						
            this.carSubscribeData = carSubscribe.data.records
						if (this.carSubscribeData.length) {
							this.status = ''
						}
        },
        async fetchCreditBuy(page = 1) {
            const creditBuy = await this.$getRequest(
                this.$url.getCreditBuy,
                "POST",
                {
                    page
                }
            );
            this.creditBuyData = this.creditBuyData.concat(creditBuy.data.records)
            this.totalPages = creditBuy.data.pages
            this.page = creditBuy.data.current
            this.status = 'loadmore'
        },
        async fetchOnePercentPay(page = 1) {
            const onePercentPay = await this.$getRequest(
                this.$url.getOnePercentPay,
                "POST",
                {
                    page,
                }
            );
            this.onePercentPayData = this.onePercentPayData.concat(onePercentPay.data.records)
            this.totalPages = onePercentPay.data.pages
            this.page = onePercentPay.data.current
            this.status = 'loadmore'
        },
				
        async fetchParityRent(page = 1) {
            const parRentalCar = await this.$getRequest(this.$url.getCarRentalList, "GET", {businessType: 1})
            this.parRentalCarData = parRentalCar.data
						if (this.parRentalCarData.length) {
							this.page = 2
							this.status = 'nomore'
						}
        },
        async fetchDiscountCar(page = 1) {
            const discountCar = await this.$getRequest(
                this.$url.getDiscountCar,
                "POST",
                {
                    page,
                }
            );
            this.discountCarData = this.discountCarData.concat(discountCar.data.records)
            this.totalPages = discountCar.data.pages
            this.page = discountCar.data.current
            this.status = 'loadmore'
        },
				
        async fetchCertifiedCar(page = 1) {
					const pageThis = this
					this.loadingCertifiedCarData = true
					/*
						排序类型：
						最新上架0（默认），
						车龄(降序)1，车龄(升序)2，
						里程(降序)3，里程(升序)4， 
						价格(降序)5，价格(升序)6	
					*/
				 
					let orderByType = this.tagId
					if (orderByType == 1) {
						if (this.sort === 1) {
							orderByType = 2
						} else if (this.sort === 2) {
							orderByType = 1
						}
					} else if (orderByType == 2) {
						if (this.sort === 1) {
							orderByType = 4
						} else if (this.sort === 2) {
							orderByType = 3
						}
					} else if (orderByType == 3) {
						if (this.sort === 1) {
							orderByType = 6
						} else if (this.sort === 2) {
							orderByType = 5
						}
					}
					const certifiedCar = await this.$getRequest(
							this.$url.getCertifiedCar,
							"POST",
							{
								orderByType,
								supportSubscription: this.supportSubscription,
								cityId: pageThis.cityId,
								page,
							},
					);
					this.certifiedCarData = this.certifiedCarData.concat(certifiedCar.data.records)
					this.totalPages = certifiedCar.data.pages
					this.page = certifiedCar.data.current
					this.status = 'loadmore'
					if (this.certifiedCarData.length === 0 && this.page === 1) {
						this.errMsg.certifiedCarList = '暂无车源'
					}
					this.loadingCertifiedCarData = false
        },
				
				async fetchAuctionCar(page = 1) {
					const certifiedCar = await this.$getRequest(
							this.$url.getAuctionList,
							"POST",
							{
								page,
							},
					);
					this.auctionCarData = this.auctionCarData.concat(certifiedCar.data.records)
					this.totalPages = certifiedCar.data.pages
					this.page = certifiedCar.data.current
					this.status = 'loadmore'
					if (this.auctionCarData.length === 0 && this.page === 1) {
						this.errMsg.auctionCarData = '暂无车源'
					}
					if (this.page >= this.totalPages) {
						this.status = 'nomore'
					}
				},
				
        handleSearch(item, type) {
            if(type == 'brand') {
                // this.$u.route(`/pages/home/search/slip-condition?cityId=${this.cityId}`, {
                //     carBrandId: item.id
                // });
				this.$u.route(`/pages/home/search/slip-condition?cityId=${this.cityId}`);
                return false;
            }
            if(item.type) {
                const search = {
                    [item.type]: item.tagValue
                }
                this.$u.route(`/pages/home/search/slip-condition?cityId=${this.cityId}`, search);
                return false;
            }
            this.$u.route(`/pages/home/search/slip-condition?cityId=${this.cityId}`);
        },
        change(index) {
            this.current = index;
            // const query = uni.createSelectorQuery().in(this).select(`#u-tab-item-1`);
            // let upx2px = uni.upx2px(index * )
            // uni.upx2px(num)
            //this.barStyleCustom.transform = `translate(${this.$refs.tabs.tabQueryInfo[0].width * index}px) rotate(112deg) skew(20deg)`
            switch (index) {
            case 0:
                // 订阅新车
                this.carSubscribeData = []
                this.fetchCarSubscribe();
                // this.creditBuyData = []
                // this.fetchCreditBuy();
                break;
            case 1:
                this.parRentalCarData = []
                this.fetchParityRent();
                // this.onePercentPayData = []
                // this.fetchOnePercentPay();
                break;
            case 2:
								this.checked=false
								this.supportSubscription = 0
								this.tagId = 0
                this.certifiedCarData = []
                this.fetchCertifiedCar();
                // this.parRentalCarData = []
                // this.fetchParityRent();
                break;
            case 3:
              this.auctionCarData = []
              this.fetchAuctionCar();
              break;
            // case 4:
            //   this.certifiedCarData = []
            //   this.fetchCertifiedCar();
            //   break;
            }
        },
        go2detail(id,qt='',proId=false, carBrandId = '') {
            if(proId){
							this.$u.route(`/pages/home/profile/index?id=${id}&proId=${proId}&cityId=${this.cityId}&qt=${qt}&latitude=${this.latitude}&longitude=${this.longitude}&carBrandId=${carBrandId}`)
							let option=`?id=${id}&proId=${proId}&cityId=${this.cityId}&qt=${qt}&latitude=${this.latitude}&longitude=${this.longitude}&carBrandId=${carBrandId}`
							uni.setStorageSync("option",option)
            } else {
              this.$u.route(`/pages/home/profile/index?id=${id}&cityId=${this.cityId}&qt=${qt}&latitude=${this.latitude}&longitude=${this.longitude}&carBrandId=${carBrandId}`)
							let option=`?id=${id}&cityId=${this.cityId}&qt=${qt}&latitude=${this.latitude}&longitude=${this.longitude}&carBrandId=${carBrandId}`
							uni.setStorageSync("option",option)
            }
        },
        go2CertCarDetail(id) {
					uni.showLoading({
						title: '加载中'
					})
					this.$u.route(`/pages/home/certcar/detail?id=${id}&cityId=${this.cityId}&supportSubscription=${this.supportSubscription}`);
					let option=`?id=${id}&cityId=${this.cityId}&supportSubscription=${this.supportSubscription}`
					uni.setStorageSync("option",option)
				},
        go2CertCarList() {
            this.$u.route(`/pages/home/certcar/index?cityId=${this.cityId}`);
        },
        // 跳转拼团列表页
        goCollageListPage () {
            this.$u.route(`/pages/home/collage/collage-list?cityId=${this.cityId}`);
        },
				
			getPrice(price) {
				let res = ''
				if(price || price == 0) {
					if (price < 10000) {
						res = `${formatThousandNumber(price)}元`
					} else {
						res = formatTenThousandNumber(price)
					}
					
				} 
				return res
			},
		
			formatThousandNumber(price) {
				return formatThousandNumber(price)
			},
			
			goAgreeMentPage() {
				uni.navigateTo({
					url: `/pages/agreement/privacyAgreement`
				})
			},
			
			agreeMentPopup() {
				console.log('isAgree', this.isAgree)
				
				if (!this.isAgree) {
					uni.showToast({
						title: '请先勾选同意《WECARS隐私政策》',
						duration: 2000,
						icon: 'none'
					})
					
					return
				}
				
				try {
					uni.setStorageSync('isAgreeFirstPagePrivacy', true)
					this.closeAgreeMentPopup()
					this.getLocation()
				} catch (e) {
					this.closeAgreeMentPopup()
				}
			},
			
			closeAgreeMentPopup() {
				this.showFirstPageAgreeMentPopup = false
			},
    },
		
		onPageScroll(e) {
			if (e.scrollTop > this.tabsScrollTop - 30) {
				this.showTopCustomBtn = true
			} else {
				this.showTopCustomBtn = false
			}
		},
		
    onReachBottom() {
			if (this.current === 0) {
				uni.navigateTo({
					url: `/pagesOrder/subscribe/list?cityId=${this.cityId}`
				})
				return
			}
			if(this.page >= this.totalPages) {
					this.status = 'nomore';
					return;
			}
			console.log('onReachBottom2')
			this.status = 'loading';
			this.page = ++this.page;
			switch (this.current) {
        case 0:
            //this.fetchCarSubscribe(this.page);
            // this.fetchCreditBuy(this.page);
            break;
        case 1:
						this.status = 'nomore'
            //this.fetchParityRent(this.page);
            break;
        // this.fetchOnePercentPay(this.page);
        // break;
        case 2:
            this.fetchCertifiedCar(this.page);
            break;
        // this.fetchParityRent(this.page);
        // break;
        case 3:
            this.fetchAuctionCar(this.page);
            break;
        // case 4:
        //     this.fetchCertifiedCar(this.page);
        //     break;
			}
			if(this.page >= this.totalPages) {
					this.status = 'nomore';
			}
    },
};
</script>
<style lang="scss">
	@import "~@/styles/mixin.scss";

  .content {
		padding-bottom: 40rpx;
    // 组件样式调整
    .u-drawer-content, .u-datetime-picker,.u-picker-header {
      border-top-left-radius: 8px !important;
      border-top-right-radius: 8px !important;
    }
    .u-btn-picker--primary {
      color: #0A0F2D !important;
    }
		.loading-wrap {
			width: 100vw;
			display: flex;
			justify-content: center;
			.loading {
				margin-top: 40px;
			}
		}
		
		.filter-tabs {
			margin-top: 16px;
			padding-left: 12px;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.tags {
				display: flex;
				align-items: center;
				.tag {
					margin-right: 40rpx;
					height: 22px;
					font-size: 28rpx;
					line-height: 22px;
					color: rgba(10, 15, 45, 0.8);
					display: flex;
					align-items: center;
					&:last-child {
						margin-right: 0;
					}
					&.tag-active {
						font-weight: 500;
						color: #0A0F2D;
					}
					.soft-group {
						margin-left: 8rpx;
						display: flex;
						flex-direction: column;
						align-items: center;
					}
				}
			}
			.subscription {
				display: flex;
				align-items: center;
				height: 22px;
				font-size: 14px;
				line-height: 22px;
				color: #0A0F2D;
				.u-checkbox__icon-wrap {
					border-radius: 5px;
					border: 1px solid #0A0F2D;
				}
			}
		}
		
    .m-tag-inactive {
      .u-tag {
        height: 56rpx;
        background: #FFFFFF;
        font-weight: normal;
        font-size: 24rpx;
        color: rgba(10, 15, 45, 0.8);
        border: 2rpx solid rgba(10, 15, 45, 0.3);
				display: flex;
				justify-content: center;
				align-items: center;
      }
    }
    .m-tag-active {
      .u-tag {
        height: 56rpx;
        font-weight: 600;
        font-size: 24rpx;
        color: #0A0F2D;
        border: 2rpx solid #0A0F2D;
				background: #FFFFFF;
				display: flex;
				justify-content: center;
				align-items: center;
      }
    }
    .par-rental-car {
        .car-img {
            .u-image image {
              margin-top: -15px !important;
            }
        }
    }
    
  }
  ::-webkit-scrollbar {
    display: none;
    width: 0 !important;
    height: 0 !important;
    -webkit-appearance: none;
    background: transparent;
    color: transparent;
    background-color: transparent;
  }
</style>
<style lang="scss" scoped>
.tabs-swiper{
	margin-top: 20rpx;
}
.more{
	width: 100%;
	text-align: center;
	margin-top: 16px;
	display: flex;
	align-items: center;
	justify-content: center;
	text{
		width: 48px;
		height: 17px;
		font-family: PingFangSC-Regular;
		font-size: 12px;
		font-weight: normal;
		letter-spacing: 0em;
		color: rgba(10, 15, 45, 0.8);
		margin-right: 4px;
	}
}
  
.content {
  .m-more-car{
    color: rgba(10, 15, 45, 0.8);
    line-height: 28px;
  }
    // padding: 0;
    .dele-text {
        text-decoration: line-through;
    }
    .mt10 {
        margin-top: 10rpx;
    }
    .mt30 {
        margin-top: 30rpx;
    }
		
    .choose-home {
        // padding: 0 32rpx;
    }
    .m-brand-scroll {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      .m-item {
        width: 20.22%;
        display: inline-block;
        align-items: center;
      }
    }
	.m-brand {
	  width: 100%;
	  // height: 130px;
	  // overflow: hidden;
	  // white-space: nowrap;
	  .m-item {
	    width: 20%;
	    display: inline-block;
	    align-items: center;
		margin-bottom: 10px;
	  }
	}
	
    .index {

        .banner {
            // margin-top: 30rpx;
        }
        .brand-list {
            text-align: center;
            margin-top: 40rpx;

            .brand-img {
                display: inline-block;
            }
            .brand {
                color: rgba(10, 15, 45, 0.8);
                font-size: 24rpx;
                margin-top: 4rpx;
            }
        }
        .type-list {
            margin-top: 16rpx;
            margin-left: -2rpx;
            margin-right: -2rpx;
            .item {
                width: 74rpx * $double;
                height: 60rpx;
                line-height: 60rpx;
                text-align: center;
                // margin: 0 8rpx;
                background: rgba(10, 15, 45, 0.04);
                margin-top: 24rpx;
                border-radius: 8rpx;
            }
        }
        .collage {
            margin-top: 64rpx;
            &-list {
                margin-top: 40rpx;
            }
        }
    }

    .first-box {
        padding: 30rpx 8rpx;
        .first-box-info {
            position: relative;
            margin-top: 28rpx;
            .box-info-text {
                color: #64696f;
                font-size: 24rpx;
                margin: 8rpx 0;
            }
            .car-img {
                position: absolute;
                right: -30rpx;
                bottom: -30rpx;
                width: 175rpx * $double;
                height: 160rpx;
				.default_img {
					border-radius: 16rpx;
					width: 100%;
					height: 100%;
				}
				.item-img {
					position: absolute;
					top: 0;
					left: 0;
					border-radius: 16rpx;
					width: 100%;
					height: 100%;
					background: #fff;
				}
            }
        }
      
		.brand {
            font-size: 28rpx;
            color: rgba(10, 15, 45, 0.8);
            font-weight: 500;
        }
        .price {
			display: flex;
			// line-height: 24rpx;
            color: #f51a4e;
            font-size: 24rpx;
            font-weight: 500;
            text {
                font-size: 34rpx;
            }
			view{
				position: relative;
				top: 10rpx;
			}
        }
    }
    .first-pay {
        padding: 30rpx 8rpx;
        position: relative;
        .first-pay-info {
            margin-bottom: 18rpx;
        }
        .car-img {
            // position: absolute;
            // top: 0;
            margin-bottom: -14rpx;
            width: 110rpx * $double;
            height: 76rpx * $double;
        }
        .car-info {
            margin-left: 24rpx;
            // position: absolute;
            // right: 0;
            // top: 0;
            .brand {
                // margin-top: 40rpx;
                font-size: 28rpx;
                color: rgba(10, 15, 45, 0.8);
                line-height: 44rpx;
                font-weight: 500;
            }
            .box-info-text {
                color: #64696f;
                font-size: 24rpx;
                margin: 8rpx 0;
                line-height: 40rpx;
            }
            .box-info-price {
                margin-top: -10rpx;
            }
            .price {
                color: #f51a4e;
                font-size: 24rpx;
                font-weight: 500;
                text {
                    font-size: 34rpx;
                }
            }
        }
    }
    .par-rental-car {
        padding: 16rpx 8rpx;
        // position: relative;
        .car-img {
            background: rgba(10, 15, 45, 0.04);
            border-radius: 8px;
            width: 162rpx * $double;
            height: 110rpx * $double;
            .u-image .u-image_image {
              margin-top: -10px !important;
            }
        }
        .brand {
            margin-top: 12rpx;
            font-size: 28rpx;
            color: rgba(10, 15, 45, 0.8);
            line-height: 44rpx;
            font-weight: 500;
        }
        .tag {
            margin-top: 4rpx;
            .tag-item {
                margin-right: 12rpx;
                &:last-child {
                    margin-right: 0;
                }
            }
        }
        .price-info {
            margin-top: 10rpx;
            color: #f51a4e;
            font-size: 24rpx;
            .price {
                font-size: 34rpx;
                display: inline-block;
                padding-right: 5rpx;
                font-weight: 500;
            }
        }
    }
    .onsale-car {
        padding: 30rpx 8rpx;
        .car-img {
            width: 162rpx * $double;
            height: 110rpx * $double;
        }
        .brand {
            margin-top: 40rpx;
            font-size: 28rpx;
            color: rgba(10, 15, 45, 0.8);
            line-height: 44rpx;
            font-weight: 500;
            white-space: nowrap;
            overflow:hidden;
            text-overflow: ellipsis;
        }
        .text-value {
            font-size: 24rpx;
            line-height: 40rpx;
            color: #64696f;
            .money-text {
                line-height: 32rpx;
                color: #f51a4e;
                font-size: 28rpx;
                font-weight: 500;
            }
        }
    }
    .certified-car {
        padding: 0 8rpx;
        margin-bottom: 26rpx;
        &:last-child {
            margin-bottom: 0;
        }
        &:first-child {
            margin-top: 40rpx;
        }
        .car-img {
            width: 220rpx;
            height: 180rpx;
			position: relative;
			.default_img {
				border-radius: 16rpx;
				width: 100%;
				height: 100%;
			}
			.item-img {
				position: absolute;
				top: 0;
				left: 0;
				border-radius: 16rpx;
				width: 100%;
				height: 100%;
			}
        }
        .car-info {
            padding: 0 12rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						height: 180rpx;
            .brand {
                font-size: 28rpx;
                color: rgba(10, 15, 45, 0.8);
                line-height: 44rpx;
                font-weight: 500;
            }
            .box-info-text {
                font-size: 24rpx;
                line-height: 36rpx;
                color: rgba(10, 15, 45, 0.8);
            }
						.sub-plans {
							display: flex;
							padding-top: 4px;
							&-item {
								padding: 2px;
								border-radius: 2px;
								background: #F5F6F7;
								margin-right: 6px;
								color: rgba(10, 15, 45, 0.8);
								font-size: 10px;
							}
						}
        }
    }
    .styleCustom:before {
        position: absolute;
        width: 2rpx;
        height: 32rpx;
        transform: skew(-20deg);
        background: red,
        // padding: '0 2rpx'
    }
    .custom-margin-t {
        margin-top: -20rpx;
		margin-bottom: 40rpx;
    }
}
.textPrice{
	height: 18px;
	font-family: PingFangSC-Regular;
	font-size: 12px;
	font-weight: normal;
	line-height: 18px;
	letter-spacing: 0px;
	color: #0A0F2D;
	margin-right: 4px;
}
.business {
	display: flex;
	padding-top: 5px;
	align-items: baseline;
	.tip {
		font-size: 24rpx;
		color: rgba(10, 15, 45, 0.8);
		padding-right: 8rpx;
	}
	.price-text {
		color: #f51a4e;
		font-size: 22rpx;
		padding-left: 4rpx;
		transform: translateY(-2rpx);
	}
	.business-price {
		color: #F5194B;
		font-size: 17px;
		font-weight: 500;
	}
}
.detail-btn {
	height: 24px;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 4rpx 8rpx;
	border-radius: 4rpx;
	border: 1px solid rgba(10, 15, 45, 0.08);
	.detail-arrow {
		margin-left: 8rpx;
		width: 16rpx;
		height: 16rpx;
	}
}

.tabs-wrap {
	position: sticky;
	left: 0;
	width: 100%;
	background-color: #fff;
	z-index: 100;
}

.tabs {
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
			font-size: 17px;
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

.building-wrap {
	padding: 77px 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	.building-img {
		width: 304rpx;
		height: 272rpx;
	}
	.building-title {
		margin-top: 8px;
		height: 48rpx;
		font-size: 16px;
		line-height: 48rpx;
		color: #0A0F2D;
	}
	.building-sub-title {
		margin-top: 4px;
		height: 44rpx;
		font-size: 14px;
		line-height: 44rpx;
		color: rgba(10, 15, 45, 0.5);
	}
}

.agreement-popup {
	.wrap {
		width: 590rpx;
		padding: 35px 40rpx;
		.log-wrap {
			display: flex;
			justify-content: center;
			.logo {
				width: 160rpx;
			}
		}
		.title {
			margin-top: 40px;
			margin-bottom: 15px;
			height: 44rpx;
			line-height: 44rpx;
			text-align: center;
			font-size: 17px;
			color: #3D3D3D;
			font-weight: 500;
		}
		.container {
			line-height: 50rpx;
			font-size: 14px;
			color: #5D5D5D;
		}
		.operator {
			margin-top: 60px;
			margin-bottom: 25px;
			color: #5D5D5D;
			font-size: 12px;
			height: 44rpx;
			line-height: 44rpx;
		}
		::v-deep .u-checkbox__label {
			font-size: 12px;
			margin-right: 0;
		}
		.btn {
			width: 100%;
			height: 74rpx;
			border-radius: 4rpx;
			background: #0A0F2D;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #FFFFFF;
			font-size: 12px;
		}
		.refuse {
			margin-top: 12px;
			background-color: #fff;
			color: #5D5D5D;
			border: 2rpx solid #5D5D5D;
		}
	}
}

.rental-list {
	padding-top: 30rpx;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	.rental {
		margin-bottom: 40rpx;
		width: 324rpx;
	}
}

.slide-up-wrap {
	margin: 40rpx 0;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #737373;
	font-size: 28rpx;
}
</style>
