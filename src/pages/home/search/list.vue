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
		<view class="content" style="padding: 0; padding-bottom: 100rpx;">
			<view
				v-if="checkList && checkList.length&&checkListIsTrue==false&&brandName==''"
				class="scroll-box">
				<scroll-view  class="tag-box"  scroll-x>
					<template v-for="(item) in checkList">
						<u-tag
							v-if="item.check"
							:key="item"
							:text="item.tagName"
							class="item"
							mode="dark"
							bg-color="#fff"
							closeable
							color="#0A0F2D"
							@close="tagClick(item)"
						/>
					</template>
				</scroll-view>
			</view>
			
			<view v-if="checkList && checkList.length&&checkListIsTrue==true&&brandName==''&&search.brandName==''" class="wuClass">
				<view class="nothing">
					<img src="https://image.51cheyaoshi.com/xcx/app/static/home/wu.png" alt="">
					<text>暂无车辆信息</text>
				</view>
				<view class="btnText" @click="handleSearch('', 'brand')">
					条件选车
				</view>
			</view>
			
        <view class="index" style="padding: 0 32rpx;" v-if="!(checkList && checkList.length&&checkListIsTrue==true&&brandName==''&&search.brandName=='')">
            <view class="choose-home">
                <!-- tabs -->
                <view class="tabs-swiper  u-margin-bottom-60">
										<view class="header">
											<view class="tabs">
												<view class="tab">
													<view v-for="(v,i) in listTabs" :key="i" :class='current==i?"li":""' @click='change(i)'>
														<text v-if="current==i" class="checkClass"></text> {{v.name}}({{v.num}})
													</view>
												</view>
												<view class="textImg" style="display: flex;" @click="handleSearch('', 'brand')">
													<text >条件筛选</text>
													<img src="https://image.51cheyaoshi.com/xcx/app/static/home/rou.png" alt="" style='width: 20rpx; height: 20rpx;' >
												</view>
											</view>
										</view>
								
                    <!-- 全新车 -->
                    <view
                      v-if="current == 0"
                      class="custom-margin-t"
                    >
											<view class="list-header">
												<view class="series-type-tags" v-if="carTypesList.length">
													<view
														class="tag"
														:class="{'active-tag': newCarSeriesType === ''}"
														@click="changeTag(1, '')"
													>
														全部
													</view>
													<view 
														v-for="item in carTypesList"
														:key="item"
														class="tag"
														:class="{'active-tag': newCarSeriesType === item}"
														@click="changeTag(1, item)"
													>
														{{CAR_TYPES[item]}}
													</view>
												</view>
												<CustomOrderBtn v-if="carSubscribeData.length > 0" :showTopCustomBtn="showTopCustomBtn" />
											</view>
											
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
                      </view>
											<view class="nothing" v-if="errMsg.newCarList">
												<img src="https://image.51cheyaoshi.com/xcx/app/static/home/wu.png" alt="">
												<text>{{errMsg.newCarList}}</text>
												<view class="custom-order-btn" @click="goCustomOrderPage">
													订制专属订阅方案
												</view>
											</view>
                    </view>
                    <!-- 二手车 -->
                    <view
                        v-if="current == 1"
                        class="custom-margin-t"
                    >
											<view class="series-type-tags" v-if="carTypesList.length">
												<view
													class="tag"
													:class="{'active-tag': oldCarSeriesType === ''}"
													@click="changeTag(2, '')"
												>
													全部
												</view>
												<view 
													v-for="item in carTypesList"
													:key="item"
													class="tag"
													:class="{'active-tag': oldCarSeriesType === item}"
													@click="changeTag(2, item)"
												>
													{{CAR_TYPES[item]}}
												</view>
											</view>
											<!-- 排序条件 -->
											<view class="filter-tabs">
												<view class="tags" v-if="listTabs[1].num!=0">
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
												<!-- <view
													class="subscription"
													v-if="listTabs[1].num!=0"
												>
													<u-checkbox 
														v-model="checked" 
														size="28" 
														label-size="28"
														@change="changeCheckedSupportSubscription"
													>可订阅</u-checkbox>
												</view> -->
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
						
                      <!-- </view> -->
					<view class="loading-wrap" v-if="loadingCertifiedCarData">
							<u-loading class="loading"></u-loading>
						</view>
						<view class="nothing" v-if="certifiedCarData.length === 0 && errMsg.certifiedCarList">
							<img src="https://image.51cheyaoshi.com/xcx/app/static/home/wu.png" alt="">
							<text>暂无车辆信息</text>
						</view>
                    </view>

                    <u-loadmore
												v-if="totalPages"
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
  </view>
</template>

<script>
// import collageItem from "./collage/collage-item.vue";
import QQMapWX from '@/qqmap-wx-jssdk.min.js';
import { orderByType, CAR_TYPES } from "@/constants"
import { formatTenThousandNumber, formatThousandNumber } from '@/utils/index.js'
import CustomOrderBtn from '../components/CustomOrderBtn.vue'
import NewCarListItem from '../components/NewCarListItem.vue'
import OldCarListItem from '../components/OldCarListItem.vue'

const app = getApp()
export default {
		onShareAppMessage(res) {
			return {
				title: '车要试 让有车生活 · 更简单',
				desc: '',
				path: '/pages/home/choose-index',
				imageUrl: '', // ./../..https://image.51cheyaoshi.com/xcx/app/static/logo.png
			}
		},
		onShareTimeline(res) {
			
		},
		onPageScroll(e) {
			if (e.scrollTop > 0) {
				this.showTopCustomBtn = true
			} else {
				this.showTopCustomBtn = false
			}
		},
    // name: "",
    components: {
        CustomOrderBtn,
				NewCarListItem,
				OldCarListItem,
    },
    data() {
        return {
					search: {
						dischargeRange: '',//排量区间：格式为1.0-2.0，字符串形式
						drive: '',//驱动方式：1前驱、2后驱、3全时四驱、4适时四驱、5分时四驱、6电动四驱
						guidancePriceRange: '',//价格区间：格式为100-200，字符串形式   新车
						dealerReferencePriceRange:'',//价格区间：格式为100-200，字符串形式   二手车
						horsepowerRange: '',//	马力区间：格式为150-200，字符串形式
						limit: 20,
						mold: '',//车辆类型：1轿车、2SUV、3MPV、4跑车、5超豪华
						powerMode: '',//动力方式：1汽油、2柴油、3纯电、4油电混合、5插电混合、6增程式混合
						structure: '',//车身结构
						carBrandId: '',//品牌ID
						cityId: '',//城市ID
						title:'',
						logoUrl:'',
						brandName:'',
						seriesType: [],
					},
					newCarSeriesType: '',
					oldCarSeriesType: '',
					checkList: [],
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
							"fontWeight": 'bold'
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
						{ name: "全新车",num:0 },
						{ name: "二手车",num:0 },
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
					checkListIsTrue:false,
					status: 'loadmore', // 加载更多 状态
					page: 1, // 第N页
					totalPages: 0, // 总页数
					loadText: {
							loadmore: '轻轻上拉',
							loading: '努力加载中',
							nomore: '实在没有了'
					},
					errMsg: {
						newCarList: '',
						certifiedCarList: ''
					},
					loadingCertifiedCarData: false,
					brandName:'',
					CAR_TYPES,
					carTypesList: [],
					showTopCustomBtn: false,
					from: '',
        }
    },
		onLoad(option) {
			this.cityId = option.cityId || uni.getStorageSync('cityId')//城市id
			this.search.cityId = option.cityId || uni.getStorageSync('cityId')
			this.from = option.from
			if(option.brandName!=''){
				uni.setNavigationBarTitle({
						title: option.brandName
				})
				this.logoUrl = option.logoUrl
				if (option.id) {
					this.search.carBrandId = option.id
				}
				this.brandName = option.brandName
			}
			this.checkList = uni.getStorageSync('searchData');
			if(option.brandName == undefined && this.checkList && this.checkList.length) {
					this.checkList.map((item) => {
						this.search[item.type] = item.tagValue
					})
				this.search.dealerReferencePriceRange=this.search.guidancePriceRange
			}
			if(option.brandName==undefined&&this.checkList && this.checkList.length&&this.checkList[0].type=='carBrandId'){
				//this.search.carBrandId=this.checkList[0].id
				this.search.brandName=this.checkList[0].brandName
				uni.setNavigationBarTitle({
						title: this.checkList[0].brandName
				})
				
				this.checkList.shift()
			}
			this.getCarTypesList()
			this.fetchCarSubscribe()//全新车列表
			this.fetchCertifiedCar()//二手车列表
    },
    onReady() {
    },
    methods: {
			changeTag(type, value) {
				if (type === 1) {
					this.newCarSeriesType = value
					
					// if (value || value === 0) {
					// 	const index = this.newCarSeriesType.indexOf(value)
					// 	if (index !== - 1) {
					// 		this.newCarSeriesType.splice(index, 1)
					// 	} else {
					// 		this.newCarSeriesType.push(value)
					// 	}
					// } else if(this.newCarSeriesType.length){
					// 	this.newCarSeriesType = []
					// }
					
					this.page = 1
					this.carSubscribeData = []
					this.fetchCarSubscribe()
				} else {
					this.oldCarSeriesType = value
					
					// if (value || value === 0) {
					// 	const index = this.oldCarSeriesType.indexOf(value)
					// 	if (index !== - 1) {
					// 		this.oldCarSeriesType.splice(index, 1)
					// 	} else {
					// 		this.oldCarSeriesType.push(value)
					// 	}
					// } else if(this.oldCarSeriesType.length){
					// 	this.oldCarSeriesType = []
					// }
					
					this.page = 1
					this.certifiedCarData = []
					this.fetchCertifiedCar()
				}
			},
		tagClick(row, index) {
		  let brandName=this.search.brandName
			const carBrandId = this.search.carBrandId
			this.search= {
					dischargeRange: '',//排量区间：格式为1.0-2.0，字符串形式
					drive: '',//驱动方式：1前驱、2后驱、3全时四驱、4适时四驱、5分时四驱、6电动四驱
					guidancePriceRange: '',//价格区间：格式为100-200，字符串形式   新车
					dealerReferencePriceRange:'',//价格区间：格式为100-200，字符串形式   二手车
					horsepowerRange: '',//	马力区间：格式为150-200，字符串形式
					limit: 20,
					mold: '',//车辆类型：1轿车、2SUV、3MPV、4跑车、5超豪华
					powerMode: '',//动力方式：1汽油、2柴油、3纯电、4油电混合、5插电混合、6增程式混合
					structure: '',//车身结构
					carBrandId: '',//品牌ID
					cityId: '',//城市ID
					title:'',
					logoUrl:'',
					brandName:'',
					carBrandId,
				}
			this.checkList.forEach((v)=>{
				if(v.tagName == row.tagName) {
					v.check = false
				}
			})
			this.checkList=this.checkList
			this.checkListIsTrue= this.checkList.every(function (v) {
			    return v.check == false;//数组中的每个元素的值都要大于2000的情况,最后才返回true
			})
			
			
			if(this.checkList && this.checkList.length) {//查询条件
			    this.checkList.map((item) => {
					if(item.check){
						this.search[item.type] = item.tagValue
					}
			    })
				this.search.dealerReferencePriceRange=this.search.guidancePriceRange
			}
			this.search.cityId = uni.getStorageSync('cityId')
			this.search.brandName=brandName
			if(this.current == 0){//全新车
				this.fetchCarSubscribe()//全新车列表
			}else{
				this.fetchCertifiedCar()//二手车
			}
			
		},
	  searList(v){
		 this.$u.route('/pages/home/search/list?brandName='+v.brandName+'&logoUrl='+v.logoUrl+"&id="+v.id+'&cityId='+this.cityId)
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
				
				
				async getCarTypesList() {
						const data = {
							...this.search,
							newOrOld: this.current+1,
						}
				    const res = await this.$getRequest(
				        this.$url.getCarTypesList,
				        "POST",
								data
				    )
						if (res.code == 0) {
							this.carTypesList = res.data
						}
				},
				
        async fetchCarSubscribe(page = 1) {//全新车
						if (this.newCarSeriesType === '') {
							this.search.seriesType = []
						} else {
							this.search.seriesType = [this.newCarSeriesType]
						}
						
            const carSubscribe = await this.$getRequest(
                this.$url.getCarSubscribe,
                "POST",{ ...this.search}
            )
						
						if (carSubscribe.data && carSubscribe.data.total) {
							this.errMsg.newCarList = ''
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
							this.carSubscribeData = this.carSubscribeData.concat(carSubscribe.data.records)
							// this.newCarLength=this.carSubscribeData.length
							this.listTabs[0].num=this.carSubscribeData.length
							this.totalPages = carSubscribe.data.pages
							this.page = carSubscribe.data.current
							setTimeout(() => {
								if (this.page < this.totalPages) {
									this.status = 'loadmore'
								} else {
									this.status = 'nomore'
								}
							}, 500)
						} else {
							this.errMsg.newCarList = '暂无车辆信息'
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
            if (this.page < this.totalPages) {
            	this.status = 'loadmore'
            } else {
            	this.status = 'nomore'
            }
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
            const pageThis = this
            const parRentalCar = await this.$getRequest(
                this.$url.getParityRent,
                "POST",
                {
                    cityId: pageThis.cityId,
                    page,
                }
            );
            this.parRentalCarData = this.parRentalCarData.concat(parRentalCar.data.records)
            this.totalPages = parRentalCar.data.pages
            this.page = parRentalCar.data.current
            this.status = 'loadmore'
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
        async fetchCertifiedCar(page = 0) {//二手车
						if (this.oldCarSeriesType === '') {
							this.search.seriesType = []
						} else {
							this.search.seriesType = [this.oldCarSeriesType]
						}
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
									...this.search
                },
            );
						if(certifiedCar.data.records.length!=0){
							this.certifiedCarData = this.certifiedCarData.concat(certifiedCar.data.records)
						}
						this.listTabs[1].num=this.certifiedCarData.length
									this.totalPages = certifiedCar.data.pages
									this.page = certifiedCar.data.current
									this.status = 'loadmore'
						if (this.certifiedCarData.length === 0 && this.page === 1) {
							this.errMsg.certifiedCarList = '暂无车辆信息'
						}
						this.loadingCertifiedCarData = false
						setTimeout(() => {
							if (this.page < this.totalPages) {
								this.status = 'loadmore'
							} else {
								this.status = 'nomore'
							}
						}, 500)
        },
        handleSearch(item, type) {
					if (this.from === 'home') {
						this.$u.route(`/pages/home/search/slip-condition?cityId=${this.cityId}&carBrandId=${this.search.carBrandId}`)
					} else {
						uni.navigateBack({
							delta: 1
						})
					}
					
					
        //     if(type == 'brand') {
        //         //this.$u.route(`/pages/home/search/slip-condition`)
								// uni.navigateBack({
								// 	delta: 1
								// })
        //         return false
        //     }
        //     if(item.type) {
        //         const search = {
        //             [item.type]: item.tagValue
        //         }
        //         this.$u.route(`/pages/home/search/slip-condition?cityId=${this.cityId}`, search);
        //         return false;
        //     }
        //     this.$u.route(`/pages/home/search/slip-condition?cityId=${this.cityId}`);
        },
        change(index) {
            this.current = index;
						this.getCarTypesList()
            // const query = uni.createSelectorQuery().in(this).select(`#u-tab-item-1`);
            // let upx2px = uni.upx2px(index * )
            // uni.upx2px(num)
            // this.barStyleCustom.transform = `translate(${this.$refs.tabs.tabQueryInfo[0].width * index}px) rotate(112deg) skew(20deg)`
            switch (index) {
            case 0:
                // 订阅新车
                this.carSubscribeData = []
                this.fetchCarSubscribe();
                // this.creditBuyData = []
                // this.fetchCreditBuy();
                break;
            // case 1:
            //     this.parRentalCarData = []
            //     this.fetchParityRent();
            //     // this.onePercentPayData = []
            //     // this.fetchOnePercentPay();
            //     break;
            case 1:
								this.checked=false
								//this.supportSubscription = 0
								this.tagId = 0
                this.certifiedCarData = []
                this.fetchCertifiedCar();
                // this.parRentalCarData = []
                // this.fetchParityRent();
                break;
            // case 3:
            //   this.discountCarData = []
            //   this.fetchDiscountCar();
            //   break;
            // case 4:
            //   this.certifiedCarData = []
            //   this.fetchCertifiedCar();
            //   break;
            }
        },
        go2detail(id,qt,proId=false,carBrandId="") {
            if(proId){
              this.$u.route(`/pages/home/profile/index?id=${id}&proId=${proId}&cityId=${this.cityId}&qt=${qt}&carBrandId=${carBrandId}`);
            } else {
              this.$u.route(`/pages/home/profile/index?id=${id}&cityId=${this.cityId}&qt=${qt}&carBrandId=${carBrandId}`);
            }
        },
        go2CertCarDetail(id) {
					  uni.showLoading({
					  	title: '加载中'
					  })
            this.$u.route(`/pages/home/certcar/detail?id=${id}&cityId=${this.cityId}&supportSubscription=${this.supportSubscription}`);
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
			goCustomOrderPage() {
				this.$u.route('/pages/custom/custom-order')
			},
    },
    onReachBottom() {
        if(this.page >= this.totalPages) {
            this.status = 'nomore';
            return;
        }
        this.status = 'loading';
        this.page = ++ this.page;
        switch (this.current) {
        case 0:
            this.fetchCarSubscribe(this.page);
            // this.fetchCreditBuy(this.page);
            break;
        case 1:
            this.fetchParityRent(this.page);
            break;
        // this.fetchOnePercentPay(this.page);
        // break;
        case 2:
            this.fetchCertifiedCar(this.page);
            break;
        // this.fetchParityRent(this.page);
        // break;
        // case 3:
        //     this.fetchDiscountCar(this.page);
        //     break;
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
.nothing{
	margin-top: 59px;
	display: flex;
	align-items: center;
	flex-direction: column;
	img{
		width: 152px;
		height: 132px;
	}
	text{;
		font-family: PingFangSC-Semibold;
		font-size: 32rpx;
		font-weight: normal;
		line-height: 34rpx;
		letter-spacing: 0em;
		
		/* Color/品牌色/黑蓝 */
		color: #0A0F2D;
	}
}
.btnText{
	margin-top: 57px;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 430rpx;
	height: 116rpx;
	border-radius: 16rpx;
	background: #0A0F2D;
	font-family: PingFangSC-Medium;
	font-size: 34rpx;
	font-weight: normal;
	line-height: 48rpx;
	text-align: center;
	letter-spacing: 0px;
	
	/* Color/辅助色/白色 */
	color: #FFFFFF;
}
.wuClass{
	display: flex;
	flex-direction: column;
	align-items: center;
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
  .tabs	{
	  display: flex;
	  align-items: center;
	  justify-content: space-between;
	  .tab{
	  	// width: 100%;
	  	height: 100%;
	  	display: flex;
	  	view{
	  		display: flex;
	  		align-items: center;
	  		font-family: PingFangSC-Semibold;
	  		line-height: 25px;
	  		text-align: center;
	  		letter-spacing: 0px;
	  		z-index: 0;
	  		margin-right:16px;
	  		font-family: PingFangSC-Regular;
	  		font-size: 28rpx;
	  		line-height: 44px;
	  		text-align: center;
	  		letter-spacing: 0px;
	  		/* 文字/中灰 */
	  		color: #666666;
	  		z-index: 2
	  	}
	  	.li{
	  		font-family: PingFangSC-Semibold;
	  		font-size: 34rpx;
	  		font-weight: normal;
	  		line-height: 50px;
	  		text-align: center;
	  		letter-spacing: 0px;
	  		color: #333333;
	  		z-index: 0
	  	}
		.checkClass{
			transform: rotate(114deg) skew(20deg);
			background: #0AEB7D;
			width: 32rpx;
			height: 8rpx;
			border-radius: 0;
			margin-right:0;
		}
	  }
	  .textImg{
		display: flex;
		align-items: center;
	  }
	  text{
		height: 40rpx;
		font-family: PingFangSC-Regular;
		font-size: 28rpx;
		font-weight: normal;
		line-height: 40rpx;
		letter-spacing: 0px;
		color: #393D3F;
		margin-right: 8rpx;
	  }
	
  }
.content {
	.scroll-box {
	    position: relative;
	    padding: 24rpx 32rpx;
	    padding-right: 100rpx;
	    background: rgba(10, 15, 45, 0.04);
	
	    .tag-box {
	        width: 100%;
	        overflow: hidden;
	        white-space: nowrap;
	        .item {
	            margin: 0 6rpx;
	        }
	    }
	    .reset {
	        position: absolute;
	        right: 20rpx;
	        top: 30rpx;
	        z-index: 2;
	        font-size: 24rpx;
	        color: rgba(10, 15, 45, 0.8);
	    }
	}
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

.series-type-tags {
	margin-top: 12px;
	display: flex;
	flex-wrap: wrap;
	.tag {
		width: 148rpx;
		height: 60rpx;
		border-radius: 8rpx;
		background: rgba(10, 15, 45, 0.04);
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 12px;
		color: rgba(10, 15, 45, 0.8);
		margin-right: 16rpx;
		margin-bottom: 16rpx;
		&.active-tag {
			background: rgba(10, 235, 125, 0.6);
			color: rgba(10, 15, 45, 1);
		}
	}
}

.custom-order-btn {
	margin-top: 50px;
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

.header, .list-header {
	position: sticky;
	top: 0;
	left: 0;
	width: 100%;
	background-color: #fff;
	z-index: 100;
}

.list-header {
	top: 100rpx;
}
</style>
