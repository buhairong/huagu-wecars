<template>
	<view class="wrap">
		<view>
			<view class="filter-wrap">
				<view class="label">佣金</view>
				<scroll-view class="filter-scroll" scroll-x>
					<view class="filter-list">
						<view
							v-for="(item, index) in priceTypeList"
							:key="index"
							class="tag"
							:class="{'active-tag': item === priceType}"
							@click="changePrice(item)"
						>
							{{ partnerPriceTypeStatus[item] || '平台推荐' }}
						</view>
					</view>
				</scroll-view>
			</view>
			
			<view class="filter-wrap">
				<view class="label">品牌</view>
				<scroll-view class="filter-scroll" scroll-x>
					<view class="filter-list">
						<view
							v-for="(item, index) in carBrandList"
							:key="index"
							class="tag"
							:class="{'active-tag': item.id === carBrandId}"
							@click="changeBrand(item)"
						>
							{{ item.brandName }}
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		
		<view class="product-list-wrap">
			<swiper 
				class="swiper" 
				circular 
				indicator-dots 
				:duration="500" 
				indicator-color="#EEEEEE"
				indicator-active-color="#767676"
				previous-margin="50rpx"
				next-margin='50rpx'
				:current="currentSwipeIndex"
				@change="swiperChange"
			>
				<swiper-item 
					v-for="(item, index) in productList"
					:key="item.id"
					class="swiper-item"
					:class="{'current-swiper-item': index === currentSwipeIndex}"
				>
					<view class="product-wrap" :class="{'current-product': index === currentSwipeIndex}">
						<view class="product-header">
							<view class="header-top">
								<view class="brand-price">
									<view class="name">
										指导价
									</view>
									<view class="price">
										{{ formatTenThousandNumber(item.guidancePrice) }}
									</view>
								</view>
								<view class="share-btn-wrap" @click="makePoster(item)">
									<image
										style="width:40rpx;"
										mode="widthFix"
										src="https://image.51cheyaoshi.com/xcx/app/static/img/Launch.png"
									/>
								</view>
							</view>
							
							<view class="car-img">
								<image
									style="width:100%;280rpx"
									mode="aspectFill"
									:src="item.imageUrl"
								/>
							</view>
							
							<view class="text-wrap">
								<view class="brand-info">{{item.carBrand}} {{item.carType}} {{item.carTypeYear}} | {{item.carTypeYearProduct}}</view>
								<view class="plan-price">订阅仅需 {{item.monthPayment | $numFormat}} 元/月</view>
							</view>
						</view>
						
						<view class="swiper-container">
							<image
								v-if="item.qrCode"
								style="width:200rpx;"
								mode="widthFix"
								:src="item.qrCode"
							/>
							
							<view class="date">{{expirationDate}}</view>
							
							<view class="brokerage-wrap">
								分销佣金 
								<view class="brokerage-price">
									{{item.distributionBrokerageFree | $numFormat}}
									<view class="unit">元</view>
								</view>
								<view class="double" v-if="isDouble == 1">x2倍</view>
							</view>
							
							<view class="share-btn" @click="openSharePopup(item)">分享产品</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
		
		<view
			class="poster-mask" 
			:style="{left: showPoster ? '0' : '-1000px'}"
			@click="closePoster"
		>
			<view class="poster">
				<wxml-to-canvas width="300" height="500" class="widget"></wxml-to-canvas>
			</view>
			<view class="save-btn">
				<view class="tip">保存海报，发送至朋友圈</view>
				<view class="btn-wrap" @click.stop="savePoster">
					<view class="btn">
						<u-icon name="download" color="#fff" size="48"></u-icon>
					</view>
					<view class="text">
						保存海报
					</view>
				</view>
			</view>
		</view>
		
		<u-popup class='popupClass' border-radius="14" closeable=true mode="bottom" v-model="showSharePopup">
			<view class="popupClassTop">分享产品</view>
			<view class="popup-btn-group">
				<button open-type="share" class="share-img-wrap" @click="handlerComplateShare">
					<view class="img-wrap">
						<image
							class="share-img"
							mode="widthFix"
							src="https://image.51cheyaoshi.com/xcx/app/static/partner/wx-share1.png"
						/>
					</view>
					<view class="text">分享给朋友</view>
				</button>
				<view class="share-img-wrap" @click="makePoster(curItem)">
					<view class="img-wrap">
						<image
							class="share-img"
							mode="widthFix"
							src="https://image.51cheyaoshi.com/xcx/app/static/partner/wx-share2.png"
						/>
					</view>
					<view class="text">分享到朋友圈</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import { partnerPriceTypeStatus } from '@/constants'
import { formatTenThousandNumber, formatThousandNumber, formatExpirationDate } from '@/utils/index.js'

const defaultPriceType = ''
const defaultCarBrand = {id: '', brandName: '全部品牌'}

export default {
	onShareAppMessage(res) {
		return {
	    title: '车要试 让有车生活·更简单',
	    desc: this.shareDesc,
	    path: this.shareUrl,
	    imageUrl: this.shareImg,
	  }
	},
	
	data() {
		return {
			shareDesc: '',
			shareUrl: '/pages/home/profile/index',
			shareImg: '',
			partnerPriceTypeStatus,
			userInfo: null,
			userId: null,
			priceType: '',
			carBrandId: '',
			priceTypeList: [],
			carBrandList: [],
			productList: [],
			isDouble: '',
			currentSwipeIndex: 0,
			showSharePopup: false,
			// 海报
			curItem: {},
			showPoster: false,
			posterSrc: '',
			posterWidth: '',
			posterHeight: '',
			widget: null,
			isCompletePoster: false,
			cityId: '',
			expirationDate: '',
		}
	},
	
	onLoad(options) {
		this.userId = options.userId
		this.isDouble = options.isDouble || ''
		this.cityId = uni.getStorageSync("cityId") || '310100'
		const date = formatExpirationDate(30)
		this.expirationDate = `有效期至 ${date.year}.${date.month}.${date.date} ${date.hour}:00`
	},
	
	onShow() {
		getApp().globalData.getUserInfo((data) => {
			this.userInfo = data
		})
		this.getActivityCarSubscribeCriteria()
	},
	
	methods: {
		changePrice(item) {
			this.priceType = item
			this.getActivityCarSubscribeCriteria({priceType: item})
		},
		
		changeBrand(item) {
			this.carBrandId = item.id
			this.getActivityCarSubscribeCriteria({carBrandId: item.id})
		},
		
		getActivityCarSubscribeCriteria({priceType='', carBrandId=''}={}) {
			uni.showLoading({
				title: '加载中'
			})
			const data = {
				priceType,
				carBrandId,
			}
			this.$getRequest(this.$url.getActivityCarSubscribeCriteria, "POST", data).then(res => {
				if (res.code === 0) {
					this.priceTypeList = [defaultPriceType, ...res.data.priceCriteria]
					this.carBrandList = [defaultCarBrand, ...res.data.carBrandEntityList]
					this.getActivityCarSubscribeList()
				}
			})
		},
		
		getActivityCarSubscribeList() {
			const data = {
				priceType: this.priceType,
				carBrandId: this.carBrandId,
				cityId: this.cityId,
				userId: this.userId,
			}
			this.$getRequest(this.$url.getActivityCarSubscribeList, "POST", data).then(res => {
				if (res.code === 0) {
					this.productList = res.data
					// this.currentSwipeIndex = 0
					
					this.handleShare(this.productList[0])
					uni.hideLoading()
					
					for(let i = 1; i < this.productList.length; i++) {
						this.getWecarsQrCode(this.productList[i])
					}
				}
			})
		},
		
		swiperChange(event) {
			this.currentSwipeIndex = event.detail.current
			// if (this.productList[this.currentSwipeIndex].qrCode) {
			// 	this.handleShare()
			// } else {
			// 	this.getWecarsQrCode()
			// }
		},
		
		// 获取小程序码
		async getWecarsQrCode(item) {
			//const item = this.productList[this.currentSwipeIndex]
			const page = 'pages/home/profile/index'
			const scene = `${this.cityId}&${item.carTypeYearProductId}&${this.userId}&${item.carBrandId}`
			
			const res = await this.$getRequest(this.$url.createQrCode, 'POST', {
			  envVersion: 1,
				page,
				scene,
			})
			if (res.code == 0) {
				item.qrCode = res.data
				this.handleShare(item)
			}
		},
		
		handleShare(item) {
			// const item = this.productList[this.currentSwipeIndex]
			this.shareDesc = item.fullName
			this.shareImg = item.imageUrl
			this.shareUrl += `?partnerId=${this.userId}&id=${item.carTypeYearProductId}&cityId=${this.cityId}&qt=1&carBrandId=${item.carBrandId}`
			// id=18663&proId=19484&cityId=310100&qt=1&carBrandId=2
		},
		
		formatTenThousandNumber(num) {
			return formatTenThousandNumber(num, '万', '元')
		},
		
		formatThousandNumber(num) {
			return formatThousandNumber(num)
		},
		
		openSharePopup(item) {
			this.showSharePopup = true
			this.curItem = item
		},
		
		openPoster(item) {
			this.showSharePopup = false
			this.showPoster = true
			uni.hideLoading()
		},
		
		closePoster(item) {
			this.showPoster = false
		},
		
		makePoster(item) {
			uni.showLoading({
				title: '海报生成中...'
			})
			this.curItem = item
			//setTimeout(() => {
				this.getCanvasHtml(item)
			//}, 1000)
		},
		
		// 绘制海报结构
		getCanvasHtml(carDetailData) {
			this.widget = this.selectComponent('.widget')
			let wxml = `
				<view class="container">
					<view class="wrap">
						<view class="item1">
							<view class="item1left">
								<view class="item1tag">
									<text class="item1tagtext">全新车</text>
								</view>
								<text class="brandtext">${carDetailData.carBrand} ${carDetailData.carType}</text>
							</view>
							<view class="item1pricewrap">
								<text class="item1price">${formatThousandNumber(carDetailData.monthPayment)}</text>
								<text class="item1unit">元/月</text>
							</view>
						</view>
						<view class="item2">
							<text class="typetext">${carDetailData.carTypeYear} | ${carDetailData.carTypeYearProduct}</text>
						</view>
						<view class="item3">
							<image class="item3imgbg" src="https://image.51cheyaoshi.com/xcx/partner/static/product/Group_571.png"></image>
							<view class="item3text">
								<text class="item3text1">指导价</text>
								<text class="item3text2">${formatTenThousandNumber(carDetailData.guidancePrice, '万', '元')}</text>
							</view>
						</view>
						<view class="item4">
							<image class="item4imgbg" src="https://image.51cheyaoshi.com/xcx/partner/static/order/Rectangle_995.png"></image>
							<image class="item4img" src="${carDetailData.imageUrl}?x-oss-process=image/resize,l_320,m_lfit"></image>
						</view>`
						
			wxml +=	`
						<view class="item7wrap">
							<image class="item7img" src="${carDetailData.qrCode}"></image>
							<text class="item8text">${this.expirationDate}</text>
						</view>
					</view>
					<view class="item9wrap">
						<image class="item9img" src="https://image.51cheyaoshi.com/xcx/partner/static/WECARS_logo.png"></image>
						<text class="item10text">让有车生活 · 更简单</text>
					</view>
				</view>
			`
			const style = {
			  container: {
			  	width: 300,
			  	height: 500,
			  	paddingTop: 20,
			  	paddingBottom: 12,
			  	paddingLeft: 10,
			  	paddingRight: 10,
			  	backgroundColor: '#31C37B',
			  },
			  wrap: {
			  	width: '100%',
					paddingTop: 0,
			  	paddingBottom: 8,
			  	paddingLeft: 20,
			  	paddingRight: 20,
			  	backgroundColor: '#fff',
					borderRadius: 6,
			  },
			  item1: {
			  	width: '100%',
					height: 26,
			  	flexDirection: 'row',
			  	justifyContent: 'space-between',
			  	alignItems: 'center',
			  },
			  item1left: {
					width: 133,
			  	flexDirection: 'row',
			  	justifyContent: 'flex-start',
			  	alignItems: 'center',
			  },
			  brandtext: {
					width: 153,
					fontSize: 15,
			  	fontWeight: 600,
			  	color: '#333333',
			  },
			  item1tag: {
					marginTop: 22,
					marginRight: 2,
			  	width: 40,
			  	height: 17,
			  	borderRadius: 4,
			  	backgroundColor: '#31C37B',
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',
			  },
			  item1tagtext: {
					width: 40,
					fontSize: 10,
			  	color: '#FFFFFF',
					textAlign: 'center',
					marginBottom: 14,
			  },
				item1pricewrap: {
					display: 'flex',
					flexDirection: 'row',
				},
			  item1price: {
					width: 75,
			  	fontSize: 17,
			  	color: '#EE3833',
			  	textAlign: 'right',
					position: 'relative',
					top: -3,
					right: 0,
			  },
				item1unit: {
					width: 33,
					fontSize: 12,
					color: '#EE3833',
					textAlign: 'right',
					position: 'relative',
					top: 1,
					right: 0,
				},
			  item2: {
			  	marginTop: 12,
			  	width: '100%',
					height: 19,
			  	display: 'flex',
			  	justifyContent: 'space-between',
					flexDirection: 'row',
			  	alignItems: 'flex-start',
			  },
			  typetext: {
			  	width: 150,
			  	fontSize: 11,
			  	color: '#666666',
			  },
			  item2righttext: {
					width: 80,
			  	fontSize: 11,
			  	color: '#333333',
			  	textAlign: 'right',
			  },
				item3: {
					marginTop: 4,
					width: '100%',
					flexDirection: 'row',
					position: 'relative',
				},
				item3imgbg: {
					width: 84,
					height: 17,
				},
				item3text: {
					flexDirection: 'row',
					alignItems: 'center',
					position: 'absolute',
					left: 5,
					top: 2,
				},
			  item3text1: {
					width: 37,
					fontSize: 9,
					color: '#fff',
			  },
				item3text2: {
					width: 60,
					fontSize: 9,
					color: '#333333',
				},
			  item4: {
			  	marginTop: 20,
			  	width: '100%',
			  	height: 195,
			  	borderRadius: 4,
			  	display: 'flex',
					flexDirection: 'row',
			  	justifyContent: 'center',
			  	alignItems: 'center',
					position: 'relative',
			  },
			  item4imgbg: {
			  	width: 240,
					height: 195,
					borderRadius: 4,
			  },
				item4img: {
					position: 'absolute',
					left: -15,
					bottom: -20,
					width: 280,
					height: 210,
				},
			  item5: {
			  	marginTop: 8,
			  	width: '100%',
					flexDirection: 'row',
					justifyContent: 'flex-start',
					alignItems: 'center',
			  },
			  item5content: {
			  	width: 160,
			  	height: 24,
			  	borderRadius: 2,
			  	backgroundColor: '#F3F4F9',
			  	flexDirection: 'row',
			  	justifyContent: 'flex-start',
			  	alignItems: 'center',
			  },
			  item5imgwrap: {
			  	marginLeft: 8,
			  	marginRight: 5,
			  	width: 14,
			  	height: 14,
			  	border: '1px dashed #D8D8D8',
			  	flexDirection: 'row',
			  	justifyContent: 'center',
			  	alignItems: 'center',
			  },
			  item5img: {
			  	width: 14,
					height: 12,
			  },
			  item5text: {
					width: 120,
					height: 20,
			  	fontSize: 12,
			  	color: '#333333',
			  },
			  item6: {
			  	marginTop: 16,
			  	width: '100%',
			  	height: 1,
			  	backgroundColor: '#F0F0F0',
			  },
				item7wrap: {
					width: '100%',
					flexDirection: 'column',
					alignItems: 'center',
				},
			  item7img: {
			  	marginTop: 16,
			  	width: 65,
					height: 65,
			  },
			  item8text: {
					marginTop: 8,
					width: 200,
					height: 22,
					textAlign: 'center',
			  	fontSize: 10,
			  	color: '#999999',
			  },
				item9wrap: {
					width: '100%',
					flexDirection: 'column',
					alignItems: 'center',
				},
			  item9img: {
			  	marginTop: 10,
			  	width: 75,
			  	height: 16,
			  },
			  item10text: {
			  	marginTop: 4,
					width: 200,
					height: 18,
			  	fontSize: 10,
			  	fontWeight: 500,
			  	color: '#FFFFFF',
					textAlign: 'center',
			  },
				item11: {
					marginTop: 22,
					width: '100%',
					display: 'flex',
					justifyContent: 'space-between',
					flexDirection: 'row',
					alignItems: 'center',
				},
				item11text: {
					display: 'flex',
					justifyContent: 'space-between',
					flexDirection: 'row',
					alignItems: 'center',
				},
				item11text1: {
					width: 45,
					height: 20,
					fontSize: 9,
					color: '#999999',
				},
				item11text2: {
					width: 45,
					height: 20,
					fontSize: 11,
					color: '#333333',
					position: 'relative',
					top: -3,
					left: 0,
				},
				item11text22: {
					width: 90,
					height: 20,
					fontSize: 11,
					color: '#333333',
					position: 'relative',
					top: -3,
					left: 0,
				},
			}
			
			//setTimeout(() => {
				this.renderToCanvas(wxml, style)
			//}, 1000)
		},
		
		// 绘制海报
		renderToCanvas(wxml, style) {
			if (this.widget) {
				const p1 = this.widget.renderToCanvas({ wxml, style })
				p1.then((res) => {
					this.posterWidth = res.layoutBox.width
					this.posterHeight = res.layoutBox.height
					this.openPoster()
					const p2 = this.widget.canvasToTempFilePath()
						p2.then(file => {
							this.posterSrc = file.tempFilePath
							this.openPoster()
						})
				})
			}
		},
		
		// 保存海报
		savePoster() {
			uni.saveImageToPhotosAlbum({
				filePath: this.posterSrc,
				success: () => {
					this.showPoster = false
					uni.showToast({
						title: '海报保存成功',
						duration: 2000,
						icon: 'none'
					})
					this.handlerComplateShare()
				}
			})
		},
		
		handlerComplateShare() {
			// const data = {
			// 	userId: this.userId,
			// }
			// this.$getRequest(this.$url.activityShare, "GET", data).then(res => {
			// 	if (res.code === 0) {
					// uni.navigateTo({
					// 	url: `/partner/task/home?userId=${this.userId}`
					// })
			// 	}
			// })
			setTimeout(() => {
				uni.navigateTo({
					url: `/partner/task/home?userId=${this.userId}`
				})
				
			}, 1000)
		},
	},
}
</script>

<style lang="scss" scoped>
uni-swiper-item {
	overflow: inherit;
}	
	
.wrap {
	padding: 40rpx 0 80rpx;
	width: 100vw;
	.filter-wrap {
		margin-bottom: 24rpx;
		padding-left: 32rpx;
		display: flex;
		align-items: center;
		.label {
			padding-right: 24rpx;
			color: #3D3D3D;
			font-weight: 500;
			font-size: 24rpx;
		}
		.filter-scroll {
			width: 0;
			flex: 1;
			white-space: nowrap;
			.filter-list {
				padding-right: 32rpx;
				display: flex;
			}
			.tag {
				margin-right: 16rpx;
				padding: 0 24rpx;
				height: 64rpx;
				border-radius: 16rpx;
				background: rgba(10, 15, 45, 0.04);
				color: rgba(10, 15, 45, 0.8);
				font-size: 24rpx;
				display: flex;
				align-items: center;
			}
			.active-tag {
				background: #31C37B;
				color: #FFFFFF;
				font-weight: 500;
			}
		}
	}
	.product-list-wrap {
		.swiper {
			height: 1160rpx;
			.swiper-item {
				padding: 40rpx;
				box-sizing: border-box;
				overflow: visible;
				.product-wrap {
					width: 100%;
					border-radius: 6px;
					padding-bottom: 40rpx;
					box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
					.product-header {
						width: 100%;
						height: 500rpx;
						background: linear-gradient(180deg, rgba(10, 15, 45, 0.16) 36%, rgba(255, 255, 255, 0.16) 100%);
						.header-top {
							padding: 48rpx 0 0 32rpx;
							display: flex;
							justify-content: space-between;
							align-items: center;
							position: relative;
							.brand-price {
								background: url("https://image.51cheyaoshi.com/xcx/app/static/icon3.png") no-repeat;
								background-size: 215rpx 50rpx;
								display: flex;
								padding: 0 10rpx;
								height: 50rpx;
								align-items: center;
								font-size: 24rpx;
								width: 215rpx;
								white-space: pre;
								.name {
									color: #ffffff;
									padding-right: 18rpx;
								}
								.price {
									padding: 0 10rpx;
									color: rgba(10, 15, 45, 0.8);
								}
							}
							.share-btn-wrap {
								width: 104rpx;
								height: 104rpx;
								display: flex;
								justify-content: center;
								align-items: center;
								position: absolute;
								top: 16rpx;
								right: 0;
								z-index: 100;
							}
						}
						.car-img {
							margin-top: -90rpx;
						}
						.text-wrap {
							margin-top: -80rpx;
							display: flex;
							flex-direction: column;
							align-items: center;
						}
						.brand-info {
							font-size: 28rpx;
							line-height: 44rpx;
							color: rgba(10, 15, 45, 0.8);
						}
						.plan-price {
							margin-top: 40rpx;
							height: 36px;
							font-size: 24rpx;
							line-height: 36rpx;
							color: #0A0F2D;
						}
					}
					.swiper-container {
						margin-top: 50rpx;
						display: flex;
						flex-direction: column;
						align-items: center;
						.brokerage-wrap {
							margin-top: 40rpx;
							display: flex;
							align-items: center;
							color: #0A0F2D;
							font-size: 24rpx;
							.brokerage-price {
								padding-left: 8rpx;
								color: #F51A4E;
								font-weight: 500;
								font-size: 34rpx;
								display: flex;
								align-items: flex-end;
								.unit {
									font-size: 24rpx;
									transform: translateY(-2rpx);
								}
							}
							.double {
								padding-left: 8rpx;
								color: #F51A4E;
								font-weight: 500;
								font-size: 40rpx;
							}
						}
						.share-btn {
							margin-top: 32rpx;
							width: 550rpx;
							height: 104rpx;
							border-radius: 16rpx;
							background: #31C37B;
							display: flex;
							justify-content: center;
							align-items: center;
							color: #FFFFFF;
							font-weight: 500;
							font-size: 32rpx;
						}
					}
				}
			}
			.current-swiper-item {
				transition: all .5s;
				padding: 0;
				left: -16rpx;
				box-shadow: none;
			}
			.current-product {
				transition: all .5s;
				transform: scale(1.05);
				// transform-origin: left top;
				position: absolute;
				top: 0;
				left: 0;
			}
		}
	}
}

.date {
	margin-top: 12rpx;
	height: 48rpx;
	font-size: 24rpx;
	line-height: 48rpx;
	color: #999999;
}

.poster-mask {
	width: 100vw;
	height: 100vh;
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	bottom: constant(safe-area-inset-bottom);
	bottom: env(safe-area-inset-bottom);
	z-index: 100;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	.poster {
		position: absolute;
		top: 100rpx;
		top: calc(100rpx + constant(safe-area-inset-top));
		top: calc(100rpx + env(safe-area-inset-top));
		left: 50%;
		transform: translateX(-50%);
	}
	.save-btn {
		padding-top: 20rpx;
		padding-bottom: 60rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100vw;
		background: #010101;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		.tip {
			height: 64rpx;
			font-size: 28rpx;
			line-height: 64rpx;
			color: #FFFFFF;
			text-align: center;
		}
		.btn-wrap {
			margin-top: 10rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			.btn {
				width: 100rpx;
				height: 100rpx;
				background: #333333;
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.text {
				font-size: 24rpx;
				height: 34rpx;
				line-height: 34rpx;
				color: rgba(255, 255, 255, 0.8);
				padding-top: 8rpx;
			}
		}
	}
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
	.popup-btn-group{
		padding-left: 40rpx;
		padding-bottom: 100rpx;
		display: flex;
		.share-img-wrap {
			margin: 0;
			padding: 0;
			background: transparent;
			border: none;
			margin-right: 32rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			.img-wrap {
				width: 120rpx;
				height: 120rpx;
				border-radius: 28rpx;
				background: #FFFFFF;
				box-shadow: 0px 4.8px 12px 0px rgba(0, 0, 0, 0.1);
				display: flex;
				justify-content: center;
				align-items: center;
				.share-img {
					width: 60rpx;
				}
			}
			.text {
				margin-top: 24rpx;
				font-size: 28rpx;
				color: #0A0F2D;
				height: 44rpx;
				line-height: 44rpx;
			}
		}
		button::after {
			border: none;
		}
	}
}
</style>