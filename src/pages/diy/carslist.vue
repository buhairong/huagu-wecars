<template>
	<view>
		<view
			class="goods-list-wrap"
		>
			<view class="car-style1-wrap" v-if="filter.selectStyle == 1">
				<view
						class="car-info"
						v-for="(carItem, index) in list"
						:key="carItem.id"
						@click="goDetailPage(carItem, filter.type)"
				>
					<view 
							class="img-box"
					>
							<image class="img" :src="carItem.imageUrl" v-if="carItem.imageUrl" />
							<view class="has-not-img" v-else>
									<img class="no-img" src="https://image.51cheyaoshi.com/xcx/app/static/img/no-img.png" alt="">
							</view>
							<view class="car-detail" v-if="filter.type == 2">
									{{carItem.mileage ? `${carItem.mileage}公里 /` : ''}} {{carItem.regDateStr ? `${carItem.regDateStr} /` : ''}} {{formatTenThousandNumber(carItem.guidancePrice)}}
							</view>
					</view>
					<view class="brand-wrap">
							<view class="brand">{{carItem.carBrand}} {{carItem.carType}}</view>
							<view class="price-wrap">
									{{carItem.isSubscribe == 0 ? '首付金额' : '提车仅需'}}
									<span class="price">{{getFirstPrice(carItem)}}</span>
									<span class="unit">元</span>
							</view>
					</view>
					<view class="typeyear">
							{{carItem.carTypeYear}} ｜ {{carItem.carTypeYearProduct}}
					</view>
					<view class="service-wrap">
							<view class="services">
									<view 
											class="service"
											v-for="(service, index) in carItem.carSubscribeFreeServiceToWeb"
											:key="index"
									>
											{{service}}
									</view>
							</view>
							<view class="plan-btn">查看方案</view>
					</view>
				</view>
			</view>
			<view class="car-style3-wrap" v-else-if="filter.selectStyle == 3">
					<view 
							class="car-info" 
							:class="{'new-car-info': filter.type == 1}"
							v-for="(carItem, index) in list"
							:key="carItem.id"
							@click="goDetailPage(carItem, filter.type)"
					>	
						<view 
								class="img-box"
						>
								<image class="img" :src="carItem.imageUrl" v-if="carItem.imageUrl" />
								<view class="has-not-img" v-else>
										<img class="no-img" src="https://image.51cheyaoshi.com/xcx/app/static/img/no-img.png" alt="">
								</view>
						</view>
						<view class="car-info-detail">
								<view class="brand">{{carItem.carBrand}} {{carItem.carType}}</view>
								<view class="typeyear">
										{{carItem.carTypeYear}} ｜ {{carItem.carTypeYearProduct}}
								</view>
								<view class="car-detail" v-if="filter.type == 2">
										{{carItem.mileage ? `${carItem.mileage}公里/` : ''}}{{carItem.regDateStr ? `${carItem.regDateStr}/` : ''}}{{formatTenThousandNumber(carItem.guidancePrice)}}
								</view>
								<view class="price-wrap">
										{{carItem.isSubscribe == 0 ? '首付金额' : '提车仅需'}} 
										<span class="price">{{getFirstPrice(carItem)}}</span>
										<span class="unit">元</span>
								</view>
						</view>
					</view>
			</view>
		</view>
		<u-empty v-if="errMsg" :text="errMsg" mode="list" margin-top="400"></u-empty>
		<view class="loadmore">
			<u-loadmore
				v-if="status == 'nomore'"
				:status="status"
				:load-text="loadText"
			/>
		</view>
		
	</view>
</template>

<script>
import { formatTenThousandNumber, formatThousandNumber, getImageInfo } from '@/utils/index.js'

export default {
	data() {
		return {
			filter: {
				companyId: null,
				selectStyle: 3,
				limit: 10,
				getMore: 1, // 1.查询下一页，2.没有下一页
				type: 1, // 1.全新车 2.二手车
				brandIds: [], // 品牌
				typeIds: [], // 车系
				typeYearIds: [], // 年款
				priceSequence: 0, // 价格顺序 0. 正序 从低到高，1. 倒序 从高到低
				minCarPrice: null, // 价格筛选最小价格
				maxCarPrice: null, // 价格筛选最大价格
			},
			page: 1,
			total: 0,
			totalPage: 0,
			list: [],
			errMsg: '',
			status: 'loadmore',
			loadText: {
				loadmore: '轻轻上拉',
				loading: '努力加载中',
				nomore: '实在没有了'
			},
		}
	},
	
	onLoad(options) {
		
	},
	
	onShow() {
		try {
			const value = uni.getStorageSync('diy_cars_list_filter');
			if (value) {
				const params = JSON.parse(value)
				this.filter = {
					...this.filter,
					...params,
				}
				if (this.filter.type == 1) {
					this.getNewCarList()
				} else {
					this.getSecondCarList()
				}
			}
		} catch (e) {
			// error
		}
		
	},
	
	onReachBottom() {
		if(this.page >= this.totalPages || this.filter.getMore == 2) {
				this.status = 'nomore'
				return
		}
		this.status = 'loading';
		this.page = ++this.page;
		
		if (this.filter.type == 1) {
			this.getNewCarList(this.page)
		} else {
			this.getSecondCarList(this.page)
		}
	},
	
	methods: {
		// 新车查询
		async getNewCarList(page = 1) {
			uni.showLoading({
				title: '加载中'
			})
			
			const res = await this.$getRequest(this.$url.getNewCarList, "POST", {
				...this.filter,
				page,
			})
			
			if (res.code == 0 && res.data) {
				if (res.data.records && res.data.records.length) {
					this.list = [...this.list, ...res.data.records]
				}
				if (res.data.pages) {
					this.totalPages = res.data.pages
				} else {
					this.errMsg = '暂无车源'
				}
			} else {
				this.errMsg = '暂无车源'
			}
			
			uni.hideLoading()
		},
		
		// 二手车车查询
		async getSecondCarList(page = 1) {
			uni.showLoading({
				title: '加载中'
			})
			
			const res = await this.$getRequest(this.$url.getSecondCarList, "POST", {
				...this.filter,
				page,
			})
			
			if (res.code == 0 && res.data) {
				if (res.data.records && res.data.records.length) {
					res.data.records.forEach(async item => {
							let imageUrl = item.imageUrl
							if (imageUrl) {
									imageUrl = await getImageInfo(imageUrl)
							}
					
							item.imageUrl = imageUrl
					})
					this.list = [...this.list, ...res.data.records]
				}
				if (res.data.pages) {
					this.totalPages = res.data.pages
				} else {
					this.errMsg = '暂无车源'
				}
			} else {
				this.errMsg = '暂无车源'
			}
			
			uni.hideLoading()
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
		
		getFirstPrice(item) {
				let price = 0
				if (item.isSubscribe == 0) { //分期
						price = item.firstPayment || 0
				} else { // 订阅
						if (item.paymentType == 0) { // 一次性全付
								price = item.payOffPrice || 0
						} else { // 月付
								price = item.monthPayment || 0
						}
				}
		
				return this.formatThousandNumber(price)
		},
		
		goDetailPage(item, type) {
			// pages/home/profile/index  id=15540&proId=18950&cityId=310100&qt=1
			// pages/home/certcar/detail id=151&cityId=310100&supportSubscription=0
			// templateId=2&cityId=310100&carTypeYearProductId=15540&title=先用后买&monthTotal=12
			if (type == 1) {
				this.$u.route(`/pages/home/profile/index?id=${item.carTypeYearProductId}&proId=${item.id}&cityId=${item.cityId}&qt=1&companyId=${this.filter.companyId}`)
			} else {
				this.$u.route(`/pages/home/certcar/detail?id=${item.id}&cityId=${item.cityId}&supportSubscription=${item.isSubscribe}`)
			}
		},
		
		goPlanPage(item, type) {
			// templateId=2&cityId=310100&carTypeYearProductId=13402&title=先用后买&monthTotal=6
			if (type == 1) {
				this.$u.route(`/pages/home/profile/detail?templateId=2&carTypeYearProductId=${item.carTypeYearProductId}&cityId=${item.cityId}&monthTotal=${item.monthTotal}`)
			} else {
				this.$u.route(`/pages/home/certcar/detail?id=${item.id}&cityId=${item.cityId}&supportSubscription=${item.isSubscribe}`)
			}
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.goods-list-wrap {
	.car-style1-wrap {
			.car-info {
					margin: 12px 20px 13px;
					.img-box {
							width: 100%;
							height: 228px;
							position: relative;
							.car-detail {
									position: absolute;
									left: 12px;
									bottom: 10px;
									z-index: 100;
									height: 18px;
									font-size: 14px;
									line-height: 18px;
									color: #FFFFFF;
							}
							.img {
									width: 100%;
									height: 100%;
									border-radius: 8px;
							}

							.has-not-img {
									width: 100%;
									height: 100%;
									background: #F2F3F5;
									border-radius: 8px;
									display: flex;
									justify-content: center;
									align-items: center;
									.no-img {
											width: 33px;
									}
							}
					}
					.brand-wrap {
							margin-top: 4px;
							height: 24px;
							display: flex;
							justify-content: space-between;
							align-items: center;
							.brand {
									font-size: 16px;
									font-weight: 500;
									color: #0A0F2D;
							}
							.price-wrap {
									display: flex;
									align-items: flex-end;
									font-size: 12px;
									color: #0A0F2D;
									.price {
											padding: 0 4px;
											font-size: 17px;
											font-weight: 500;
											color: #F51A4E;
									}
									.unit {
											color: #F51A4E;
									}
							}
					}
					.typeyear {
							height: 22px;
							font-size: 12px;
							line-height: 22px;
							color: rgba(10, 15, 45, 0.5);
					}
					.service-wrap {
							display: flex;
							justify-content: space-between;
							align-items: flex-end;
							.services {
									flex: 1;
									display: flex;
									flex-wrap: wrap;
									.service {
											height: 18px;
											line-height: 18px;
											padding: 0 2px;
											border-radius: 2px;
											background: #F5F6F7;
											font-size: 10px;
											color: rgba(10, 15, 45, 0.8);
											margin-right: 4px;
											margin-bottom: 4px;
									}
							}
							.plan-btn {
									width: 72px;
									height: 28px;
									display: flex;
									justify-content: center;
									align-items: center;
									border-radius: 14px;
									background: #FFFFFF;
									border: 1px solid rgba(10, 15, 45, 0.3);
									font-size: 12px;
									color: rgba(10, 15, 45, 0.8);
							}
					}
			}
	}

	.car-style2-wrap {
			.car-info {
					margin: 16px 20px;
					display: flex;
					align-items: center;
					.img-box {
							position: relative;
							.img {
									width: 132px;
									height: 90px;
									border-radius: 8px;
							}

							.has-not-img {
									width: 132px;
									height: 90px;
									background: #F2F3F5;
									border-radius: 8px;
									display: flex;
									justify-content: center;
									align-items: center;
									.no-img {
											width: 33px;
									}
							}
					}
					.car-info-detail {
							flex: 1;
							width: 0;
							margin-left: 16px;
							height: 90px;
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							.brand {
									height: 22px;
									font-size: 14px;
									font-weight: 500;
									line-height: 22px;
									color: #0A0F2D;
									@include text-overflow;
							}
							.typeyear {
									height: 22px;
									font-size: 12px;
									line-height: 22px;
									color: rgba(10, 15, 45, 0.5);
									@include text-overflow;
							}
							.service-wrap {
									display: flex;
									flex-wrap: wrap;
									.service {
											height: 18px;
											line-height: 18px;
											padding: 0 2px;
											border-radius: 2px;
											background: #F5F6F7;
											font-size: 10px;
											color: rgba(10, 15, 45, 0.8);
											margin-right: 4px;
											margin-bottom: 4px;
									}
							}
							.car-detail {
									height: 22px;
									font-size: 12px;
									line-height: 22px;
									color: #4E5969;
							}
							.price-wrap {
									display: flex;
									align-items: flex-end;
									font-size: 12px;
									color: #0A0F2D;
									.price {
											padding: 0 4px;
											font-size: 17px;
											font-weight: 500;
											color: #F51A4E;
									}
									.unit {
											color: #F51A4E;
									}
							}
					}
			}
			.new-car-info {
					.img-box {
							.img {
									transform: scale(1.4);
							}
					}
			}
	}

	.car-style3-wrap {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			margin: 0 16px;
			.car-info {
					margin: 15px 0;
					width: 165px;
					.img-box {
							position: relative;
							.img {
									width: 165px;
									height: 110px;
									border-radius: 8px;
							}

							.has-not-img {
									width: 165px;
									height: 110px;
									background: #F2F3F5;
									border-radius: 8px;
									display: flex;
									justify-content: center;
									align-items: center;
									.no-img {
											width: 33px;
									}
							}
					}
					.car-info-detail {
							.brand {
									margin-top: 4px;
									height: 22px;
									font-size: 14px;
									font-weight: 500;
									line-height: 22px;
									color: #0A0F2D;
									@include text-overflow;
							}
							.typeyear {
									height: 22px;
									font-size: 12px;
									line-height: 22px;
									color: rgba(10, 15, 45, 0.5);
									@include text-overflow;
							}
							.service-wrap {
									display: flex;
									flex-wrap: wrap;
									.service {
											height: 18px;
											line-height: 18px;
											padding: 0 2px;
											border-radius: 2px;
											background: #F5F6F7;
											font-size: 10px;
											color: rgba(10, 15, 45, 0.8);
											margin-right: 4px;
											margin-bottom: 4px;
									}
							}
							.car-detail {
									height: 22px;
									font-size: 12px;
									line-height: 22px;
									color: #4E5969;
							}
							.price-wrap {
									display: flex;
									align-items: flex-end;
									font-size: 12px;
									color: #0A0F2D;
									.price {
											padding: 0 4px;
											font-size: 17px;
											font-weight: 500;
											color: #F51A4E;
									}
									.unit {
											color: #F51A4E;
									}
							}
					}
			}

			.new-car-info {
					.img-box {
							.img {
									transform: scale(1.2);
							}
					}
			}
	}
}

.loadmore {
	padding: 20px 0;
}
</style>
