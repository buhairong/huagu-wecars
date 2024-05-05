<template>
	<view>
	<view v-if="config">
		<view 
			class="header"
			:style="{
				backgroundColor: config.globalConfig.globalStyle.backgroundColor
			}"
		>
			<view
			    class="status-bar"
			    :style="{ height: custom.top + 'px' }"
			/>
			<view class="nav" 
				:style="{
					color: config.globalConfig.navStyle.color,
					fontSize: config.globalConfig.navStyle.fontSize,
					fontWeight: config.globalConfig.navStyle.fontWeight,
					textAlign: config.globalConfig.navStyle.textAlign,
				}"
			>
				<view class="back-btn" @click="back">
					<u-icon name="arrow-left" :color="config.globalConfig.navStyle.color" size="48"></u-icon>
				</view>
				{{config.globalConfig.title}}
			</view>
		</view>
		
		
		<view 
			class="page-body"
			:style="{
				paddingTop: (custom.top + 44) + 'px'
			}"
		>
		<scroll-view
			v-if="curTab === 1"
			scroll-y="true" 
			:style="{
				height: (deviceInfo.screenHeight - custom.top - 44 - 60) + 'px',
			}"
		>
		<view
			class="diy-body" 
			:style="{
				backgroundColor: config.globalConfig.globalStyle.backgroundColor
			}"
		>
			<view
				v-for="item in config.widgetList"
				:key="item.id"
				class="widget-item"
				:class="[
					{hasBorder: !noBorderWidgetList.includes(item.widget)},
				]"
			>
				<!-- 图文标题 -->
				<view 
					v-if="item.widget === 'imgTitle'"
					class="img-title-wrap" 
					@click="goCarsList(item.config)"
				>
					<view class="left">
						<view class="img-box">
							<view class="has-img" v-if="item.config.isAddImg && item.config.imgSrc">
								<image
									class="img"
									:src="item.config.imgSrc"
								/>
							</view>
							<view class="has-not-img" v-else>
								<image
									class="img"
									src="https://image.51cheyaoshi.com/xcx/app/static/img/no-img.png"
									width="44rpx"
									mode="widthFix"
								/>
							</view>
						</view>
						<view class="content">
							<view class="title">{{item.config.title}}</view>
							<view class="subTitle">{{item.config.subTitle}}</view>
						</view>
					</view>
					<view class="right">
							<view class="text">更多</view>
							<u-icon name="arrow-right" color="rgba(0, 0, 0, 0.9)" size="24"></u-icon>
					</view>
				</view>
				
				<!-- 店铺公告 -->
				<view 
					v-if="item.widget === 'notice'"
					class="notice-wrap" 
					@click="goCarsList(item.config)"
				>
					<view class="img-box">
						<image 
							:style="{
								width: item.config.selectStyle == 1 ? '124rpx' : '58rpx'
							}"
							:src="item.config.styleList[item.config.selectStyle].logoUrl"
							mode="widthFix"
						>
					</view>
					<view class="split-line"></view>
					<view class="notice">
						<u-notice-bar 
							v-if="item.showMarquee"
							:volume-icon="false"
							bg-color="transparent"
							color="#1D2129"
							:list="[item.config.notice]"
						></u-notice-bar>
						<view class="notice-content" v-else>{{item.config.notice}}</view>
					</view>
				</view>
				
				<!-- 图文导航 -->
				<view class="graphic-navigation-wrap" v-if="item.widget === 'graphicNavigation'">
					<view 
						class="link"
						v-for="(goods, index) in item.config.goodsList"
						:key="goods.id"
						@click="getCurCarsList(goods, item.widget, index)"
					>
						<view class="img-box">
							<image 
								v-if="goods.imgSrc"
								style="width:100%;height:100%;"
								:src="goods.imgSrc"
							>
							<view class="no-img" v-else>
								<image
									class="img"
									src="https://image.51cheyaoshi.com/xcx/app/static/img/no-img.png"
									width="44rpx"
									mode="widthFix"
								/>
							</view>
						</view>
						<view class="title">{{goods.title}}</view>
					</view>
				</view>
				
				<!-- 图片广告 -->
				<view 
					v-if="item.widget === 'imgAdvert'"
					:style="{
						marginLeft: item.config.style.marginLeft,
						marginRight: item.config.style.marginRight,
					}"
				>
					<u-swiper
						:list="item.config.goodsList.filter(img => img.image)"
						img-mode="widthFix"
						:effect3d="false"
						autoplay
						interval="3000"
						:circular="true"
						duration="500"
						:height="getSwiperHeight(item)"
						:border-radius="parseInt(item.config.style.borderRadius)*2"
						:mode="item.config.styleObj.indicatorList[item.config.styleObj.selectIndicator].indicator"
						@click="(e) => hanlerClickSwiper(e, item)"
					/>
				</view>
				
				<!-- 多图魔方 -->
				<view 
					v-if="item.widget === 'imgsCube'"
					class="imgs-cube-wrap" 
					@click="goCarsList(item.config)"
				>
					<view class="cube cube1" v-if="item.config.selectStyle == 1">
						<view class="left">
							<view class="img-box">
								<view class="has-img" v-if="item.config.styleList[1].imgList[0]">
									<img
											class="img"
											:src="item.config.styleList[1].imgList[0]"
									/>
								</view>
								<view class="has-not-img" v-else>
									<image 
										style="width: 66rpx;height: 48rpx;"
										src="https://image.51cheyaoshi.com/xcx/app/static/img/no-img.png"
									/>
								</view>
							</view>
						</view>
						<view class="right">
							<view class="img-box">
								<view class="has-img" v-if="item.config.styleList[1].imgList[1]">
									<image
										class="img"
										:src="item.config.styleList[1].imgList[1]"
									/>
								</view>
								<view class="has-not-img" v-else>
									<image
										style="width: 66rpx;height: 48rpx;"
										src="https://image.51cheyaoshi.com/xcx/app/static/img/no-img.png"
									/>
								</view>
							</view>
						</view>
					</view>

					<view class="cube cube2" v-else-if="item.config.selectStyle == 2">
						<view class="left">
								<view class="img-box">
										<view class="has-img" v-if="item.config.styleList[2].imgList[0]">
												<image
														class="img"
														:src="item.config.styleList[2].imgList[0]"
												/>
										</view>
										<view class="has-not-img" v-else>
												<image
													style="width: 66rpx;height: 48rpx;"
													src="https://image.51cheyaoshi.com/xcx/app/static/img/no-img.png"
												/>
										</view>
								</view>
						</view>
						<view class="right multiple">
								<view class="img-box">
										<view class="has-img" v-if="item.config.styleList[2].imgList[1]">
												<image
														class="img"
														:src="item.config.styleList[2].imgList[1]"
												/>
										</view>
										<view class="has-not-img" v-else>
												<image
													style="width: 44rpx;height: 32rpx;"
													src="https://image.51cheyaoshi.com/xcx/app/static/img/no-img.png"
												/>
										</view>
								</view>
								<view class="img-box">
										<view class="has-img" v-if="item.config.styleList[2].imgList[2]">
												<image
														class="img"
														:src="item.config.styleList[2].imgList[2]"
												/>
										</view>
										<view class="has-not-img" v-else>
												<image
													style="width: 44rpx;height: 32rpx;"
													src="https://image.51cheyaoshi.com/xcx/app/static/img/no-img.png"
												/>
										</view>
								</view>
						</view>
				</view>

				<view class="cube cube3" v-else-if="item.config.selectStyle == 3">
						<view class="left multiple">
								<view class="img-box">
										<view class="has-img" v-if="item.config.styleList[3].imgList[0]">
												<image
														class="img"
														:src="item.config.styleList[3].imgList[0]"
												/>
										</view>
										<view class="has-not-img" v-else>
												<image
													style="width: 44rpx;height: 32rpx;"
													src="https://image.51cheyaoshi.com/xcx/app/static/img/no-img.png"
												/>
										</view>
								</view>
								<view class="img-box">
										<view class="has-img" v-if="item.config.styleList[3].imgList[1]">
												<image
														class="img"
														:src="item.config.styleList[3].imgList[1]"
												/>
										</view>
										<view class="has-not-img" v-else>
												<image
													style="width: 44rpx;height: 32rpx;"
													src="https://image.51cheyaoshi.com/xcx/app/static/img/no-img.png"
												/>
										</view>
								</view>
						</view>
						<view class="right multiple">
								<view class="img-box">
										<view class="has-img" v-if="item.config.styleList[3].imgList[2]">
												<image
														class="img"
														:src="item.config.styleList[3].imgList[2]"
												/>
										</view>
										<view class="has-not-img" v-else>
												<image
													style="width: 44rpx;height: 32rpx;"
													src="https://image.51cheyaoshi.com/xcx/app/static/img/no-img.png"
												/>
										</view>
								</view>
								<view class="img-box">
										<view class="has-img" v-if="item.config.styleList[3].imgList[3]">
												<image
														class="img"
														:src="item.config.styleList[3].imgList[3]"
												/>
										</view>
										<view class="has-not-img" v-else>
												<image
													style="width: 44rpx;height: 32rpx;"
													src="https://image.51cheyaoshi.com/xcx/app/static/img/no-img.png"
												/>
										</view>
								</view>
						</view>
					</view>

					<view class="title" v-if="item.config.title">
							{{item.config.title}}
					</view>
				</view>
				
				<!-- 空白分割 -->
				<view 
					v-if="item.widget === 'spaceSplit'"
					:style="{
						backgroundColor: '#fff',
						height: item.config.height + 'px',
					}"
				/>
				
				<!-- 画线分割 -->
				<view 
					v-if="item.widget === 'lineSplit'"
					class="line-split-wrap"
					:style="{
							height: item.config.style.height + 'px',
							paddingLeft: item.config.style.padding + 'px',
							paddingRight: item.config.style.padding + 'px',
					}"
				>
					<view 
						class="line"
						:style="{
								borderTopStyle: item.config.style.borderStyle
						}"
					></view>
				</view>
				
				<!-- 文本分割 -->
				<view 
					v-if="item.widget === 'textSplit'"
					class="text-split-wrap"
				>
					<view class="split-content">
							<view 
									class="line"
									:style="{
											borderTopStyle: item.config.style.borderStyle,
											width: item.config.style.lineWidth + 'px',
									}"
							></view>
							<view class="text">{{item.config.title}}</view>
							<view 
									class="line"
									:style="{
											borderTopStyle: item.config.style.borderStyle,
											width: item.config.style.lineWidth + 'px',
									}"
							></view>
					</view>
				</view>
				
				<!-- 门店信息 -->
				<view 
					v-if="item.widget === 'shopInfo'"
					class="shop-info-wrap"
					@click="goShopInfoPage"
				>
					<view class="left">
							<image class="logo" :src="item.config.info.logoImageUrl" lazy>
							<view class="info">
									<view class="shop-name">{{item.config.info.shopName}}</view>
									<view class="introduce">{{item.config.info.introduce}}</view>
							</view>
					</view>
					<view class="right">
							<u-icon name="arrow-right" color="#3446AA" size="32"></u-icon>
					</view>
				</view>
				
				<!-- 商品列表 -->
				<view 
					v-if="item.widget === 'goodsList'"
					class="goods-list-wrap"
				>
					<view class="car-style1-wrap" v-if="item.config.selectStyle == 1">
						<view
								class="car-info"
								v-for="(carItem, index) in item.config.goodsList"
								:key="carItem.id"
								@click="goDetailPage(carItem, item.config.filter.type)"
						>
								<view v-if="index < item.config.styleList[item.config.selectStyle].limit">
										<view 
												class="img-box"
										>
												<image class="img" :src="carItem.imageUrl" v-if="carItem.imageUrl" />
												<view class="has-not-img" v-else>
														<image
															src="https://image.51cheyaoshi.com/xcx/app/static/img/no-img.png"
															width="66rpx"
															mode="widthFix"
														/>
												</view>
												<view class="car-detail" v-if="item.config.filter.type == 2">
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
					</view>
			
					<view class="car-style2-wrap" v-else-if="item.config.selectStyle == 2">
						<view
								v-for="(carItem, index) in item.config.goodsList"
								:key="carItem.id"
								@click="goDetailPage(carItem, item.config.filter.type)"
						>
								<view 
										v-if="index < item.config.styleList[item.config.selectStyle].limit"
										class="car-info" 
										:class="{'new-car-info': item.config.filter.type == 1}"
								>
										<view 
												class="img-box"
										>
												<image class="img" :src="carItem.imageUrl" lazy v-if="carItem.imageUrl" />
												<view class="has-not-img" v-else>
														<image
															src="https://image.51cheyaoshi.com/xcx/app/static/img/no-img.png"
															width="66rpx"
															mode="widthFix"
														/>
												</view>
										</view>
										<view class="car-info-detail">
												<view>
														<view class="brand">{{carItem.carBrand}} {{carItem.carType}}</view>
														<view class="typeyear">
																{{carItem.carTypeYear}} ｜ {{carItem.carTypeYearProduct}}
														</view>
												</view>
												<view>
														<view class="car-detail" v-if="item.config.filter.type == 2">
																{{carItem.mileage ? `${carItem.mileage}公里 /` : ''}} {{carItem.regDateStr ? `${carItem.regDateStr} /` : ''}} {{formatTenThousandNumber(carItem.guidancePrice)}}
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
					</view>
					<view class="car-style3-wrap" v-else-if="item.config.selectStyle == 3">
							<view 
									class="car-info" 
									:class="{'new-car-info': item.config.filter.type == 1}"
									v-for="(carItem, index) in item.config.goodsList"
									:key="carItem.id"
									@click="goDetailPage(carItem, item.config.filter.type)"
							>
									<view v-if="index < item.config.styleList[item.config.selectStyle].limit">
											<view 
													class="img-box"
											>
													<image class="img" :src="carItem.imageUrl" v-if="carItem.imageUrl" />
													<view class="has-not-img" v-else>
															<image
																src="https://image.51cheyaoshi.com/xcx/app/static/img/no-img.png"
																width="66rpx"
																mode="widthFix"
															/>
													</view>
											</view>
											<view class="car-info-detail">
													<view class="brand">{{carItem.carBrand}} {{carItem.carType}}</view>
													<view class="typeyear">
															{{carItem.carTypeYear}} ｜ {{carItem.carTypeYearProduct}}
													</view>
													<view class="car-detail" v-if="item.config.filter.type == 2">
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
					<view 
						v-if="item.config.filter.total > item.config.styleList[item.config.selectStyle].limit"
						class="more" 
						@click="goCarsList(item.config)"
					>查看更多</view>
				</view>
				
				<!-- 分类导航 -->
				<view
					v-if="item.widget === 'classifiedNavigation'"
					class="classified-navigation-wrap"
				>
					<view class="tab-wrap">
						<view 
								v-for="tab in item.config.goodsList"
								:key="tab.id"
								class="tab"
								:class="{active: tab.id === item.config.activeTab.id}"
								@click="changeTab(tab.id, item)"
						>
								<view class="tab-text">
										{{tab.title}}
								</view>
						</view>
					</view>

					<view class="goods-list-wrap">
							<view class="car-style-wrap">
									<view 
											class="car-info"
											v-for="(tabItem, index) in item.config.activeTab.goods"
											:key="tabItem.id"
											@click="goDetailPage(tabItem, item.config.filter.type)"
									>
											<view v-if="index < item.config.limit">
													<view 
															class="img-box"
													>
															<image class="img" :src="tabItem.imageUrl" lazy v-if="tabItem.imageUrl" />
															<view class="has-not-img" v-else>
																	<image
																		src="https://image.51cheyaoshi.com/xcx/app/static/img/no-img.png"
																		width="66rpx"
																		mode="widthFix"
																	/>
															</view>
															<view class="car-detail" v-if="item.config.activeTab.filter.type == 2">
																	{{tabItem.mileage ? `${tabItem.mileage}公里 /` : ''}} {{tabItem.regDateStr ? `${tabItem.regDateStr} /` : ''}} {{formatTenThousandNumber(tabItem.guidancePrice)}}
															</view>
													</view>
													<view class="brand-wrap">
															<view class="brand">{{tabItem.carBrand}} {{tabItem.carType}}</view>
															<view class="price-wrap">
																	{{tabItem.isSubscribe == 0 ? '首付金额' : '提车仅需'}}
																	<span class="price">{{getFirstPrice(tabItem)}}</span>
																	<span class="unit">元</span>
															</view>
													</view>
													<view class="typeyear">
															{{tabItem.carTypeYear}} ｜ {{tabItem.carTypeYearProduct}}
													</view>
													<view class="service-wrap">
															<view class="services">
																	<view 
																			class="service"
																			v-for="(service, index) in tabItem.carSubscribeFreeServiceToWeb"
																			:key="index"
																	>
																			{{service}}
																	</view>
															</view>
															<view class="plan-btn">查看方案</view>
													</view>
											</view>
									</view>
							</view>
							<view 
								class="more" 
								v-if="item.config.activeTab.filter.total > item.config.limit"
								@click="getCurTabCarsList(item.config.activeTab, item.widget)"
							>查看更多</view>
					</view>
				</view>
			
				<!-- body end -->
				</view>
			</view>
			</scroll-view>
			
			<scroll-view
				v-if="curTab === 2"
				scroll-y="true" 
				:style="{
					height: (deviceInfo.screenHeight - custom.top - 44 - 60) + 'px',
				}"
			>
			<view 
				class="car-list-tab"
			>
				<view 
					class="car-tabs"
					:style="{
						top: (custom.top + 32) + 'px'
					}"
				>
					<view 
						v-for="tab in curCarTabList"
						:key="tab.id"
						class="car-tab"
						:class="{'tab-active': tab.id === curCarTab}"
						@click="changeCarTab(tab)"
					>
						{{tab.name}}
					</view>
				</view>
				
				<view
					class="goods-list-wrap car-tab-list"
				>
					<view class="car-style3-wrap">
							<view 
									class="car-info" 
									:class="{'new-car-info': curCarTab == 1}"
									v-for="(carItem, index) in list"
									:key="carItem.id"
									@click="goDetailPage(carItem, curCarTab)"
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
										<view class="car-detail" v-if="curCarTab == 2">
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
				<view class="loadmore">
					<u-loadmore
						v-if="status == 'nomore'"
						:status="status"
						:load-text="loadText"
					/>
				</view>
				<u-empty v-if="carErrMsg" :text="carErrMsg" mode="list" margin-top="400"></u-empty>
			</view>
			</scroll-view>
			
			</view>
			
			<view class="tabs">
				<view class="tab" @click="changeBottomTab(1)">
					<image :src="logoImageUrl" style="width:40px;height:40px;"></image>
				</view>
				<view class="tab" @click="changeBottomTab(2)">
					<view class="tab-item">
						<image src="https://image.51cheyaoshi.com/xcx/app/static/tabBar/goods.png" style="width:24px;height:24px;"></image>
						全部商品
					</view>
				</view>
				<view class="tab">
					<view class="tab-item">
						<image src="https://image.51cheyaoshi.com/xcx/app/static/tabBar/customer_service.png" style="width:24px;height:24px;"></image>
						联系客服
					</view>
				</view>
			</view>
			
		</view>
		
		<u-empty v-if="errMsg" :text="errMsg" mode="list" margin-top="400"></u-empty>
	</view>
</template>

<script>
import { formatTenThousandNumber, formatThousandNumber, getImageInfo } from '@/utils/index.js'
const app = getApp()

export default {
	data() {
		return {
			config: null,
			custom: app.globalData.custom,
			deviceInfo: app.globalData.deviceInfo,
			companyId: null,
			pageNum: 1,
			noBorderWidgetList: ['spaceSplit', 'lineSplit', 'textSplit', 'imgAdvert'],
			activeTab: null,
			errMsg: '',
			showMarquee: false,
			logoImageUrl: '',
			curTab: 1, // 1.DIY 2.全部商品 3.客服
			curCarTab: 1, // 1.新车 2.二手车
			curCarTabList: [
				{id: 1, name: '全新车'},
				{id: 2, name: '二手车'},
			],
			page: 1,
			limit: 10,
			totalPage: 0,
			list: [],
			errMsg: '',
			status: 'loadmore',
			loadText: {
				loadmore: '轻轻上拉',
				loading: '努力加载中',
				nomore: '实在没有了'
			},
			carErrMsg: '',
		}
	},
	
	onLoad(options) {
		this.companyId = options.companyId
	},
	
	onShow() {
		this.getDIYConfig()
		this.getNewCarList()
	},
	
	onReady() {
		wx.setNavigationBarColor({
			frontColor: '#ffffff',
			backgroundColor: 'transparent'
		})
	},
	
	onReachBottom() {
		if (this.curTab === 2) {
			if(this.page >= this.totalPages) {
					this.status = 'nomore'
					return
			}
			this.status = 'loading';
			this.page = ++this.page;
			
			if (this.curCarTab == 1) {
				this.getNewCarList(this.page)
			} else {
				this.getSecondCarList(this.page)
			}
		}
	},
	
	methods: {
		async getDIYConfig() {
			uni.showLoading({
				title: '加载中'
			})
			
			const res = await this.$getRequest(this.$url.getDIYConfig, "GET", {
			    companyId: this.companyId,
			    pageNum: this.pageNum,
			})
			
			if (res.code == 0 && res.data && res.data.config) {
				this.logoImageUrl = res.data.logoImageUrl
				this.config = JSON.parse(res.data.config)
				wx.setNavigationBarColor({
					frontColor: this.config.globalConfig.navStyle.color,
					backgroundColor: this.config.globalConfig.globalStyle.backgroundColor
				})
				console.log('this.config', this.config)
			} else {
				this.errMsg = '暂无数据'
			}
			
			uni.hideLoading()
		},
		
		goCarsList(item) {
			if (item.filter.selectLink == 1) {
				this.goDetailPage(item.goodsList[0], item.filter.type)
			} else {
				this.goListPage(item)
			}
		},
		
		goDetailPage(item, type) {
			// pages/home/profile/index  id=15540&proId=18950&cityId=310100&qt=1
			// pages/home/certcar/detail id=151&cityId=310100&supportSubscription=0
			if (type == 1) {
				this.$u.route(`/pages/home/profile/index?id=${item.carTypeYearProductId}&proId=${item.id}&cityId=${item.cityId}&qt=1&companyId=${this.companyId}`)
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
		
		goListPage(config) {
			console.log('goListPage', config)
			const params = {
				...config.filter,
				companyId: this.companyId,
			}
			
			if (config.count) {
				params.limit = config.count
				params.getMore = 2
			}
			
			if (config.selectStyle == 1) {
				params.selectStyle = 1
			}
			
			try {
				uni.setStorageSync('diy_cars_list_filter', JSON.stringify(params))
				this.$u.route('/pages/diy/carslist')
			} catch (e) {
				// error
			}
		},
		
		getCurCarsList(item, widget, index) {
			const curItem = {
				widget,
				filter: item.filter,
				goodsList: item.goods
			}
			
			this.goCarsList(curItem)
		},
		
		getCurTabCarsList(item, widget) {
			console.log('getCurTabCarsList', item, widget)
			const curItem = {
				widget,
				count: item.count,
				filter: item.filter,
				goodsList: item
			}
			
			this.goCarsList(curItem)
		},
		
		hanlerClickSwiper(index, curSwiper, widget) {
			console.log('hanlerClickSwiper', index, curSwiper)
			const item = {
				widget,
				filter: curSwiper.config.goodsList[index].filter,
				goodsList: curSwiper.config.goodsList[index].goods,
			}
			
			this.goCarsList(item)
		},
		
		getSwiperHeight(item) {
			let width = app.globalData.deviceInfo.screenWidth
			if (item.config.style.marginLeft) {
				width = width - (parseInt(item.config.style.marginLeft)*2)
			}
			
			return width * 0.56 * 2
		},
		
		goShopInfoPage() {
			this.$u.route(`/pages/shopinfo/shopinfo?companyId=${this.companyId}&pageNum=${this.pageNum}`)
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
		
		changeTab(id, tabs) {
			tabs.config.activeTab = tabs.config.goodsList.find(item => item.id === id)
		},
		
		back() {
			uni.navigateBack({
				delta: 1
			})
		},
		
		changeBottomTab(id) {
			this.curTab = id
		},
		
		changeCarTab(tab) {
			this.curCarTab = tab.id
			this.page = 1
			this.totalPages = 0
			this.list = []
			if (tab.id === 1) {
				this.getNewCarList()
			} else if (tab.id === 2) {
				this.getSecondCarList()
			}
		},
		
		// 新车查询
		async getNewCarList(page = 1) {
			uni.showLoading({
				title: '加载中'
			})
			
			const res = await this.$getRequest(this.$url.getNewCarList, "POST", {
				companyId: this.companyId,
				limit: this.limit,
				page,
			})
			
			if (res.code == 0 && res.data) {
				if (res.data.records && res.data.records.length) {
					this.list = [...this.list, ...res.data.records]
				}
				if (res.data.pages) {
					this.totalPages = res.data.pages
				} else {
					this.carErrMsg = '暂无车源'
				}
			} else {
				this.carErrMsg = '暂无车源'
			}
			
			uni.hideLoading()
		},
		
		// 二手车车查询
		async getSecondCarList(page = 1) {
			uni.showLoading({
				title: '加载中'
			})
			
			const res = await this.$getRequest(this.$url.getSecondCarList, "POST", {
				companyId: this.companyId,
				limit: this.limit,
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
					this.carErrMsg = '暂无车源'
				}
			} else {
				this.carErrMsg = '暂无车源'
			}
			
			uni.hideLoading()
		},
	}
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.header {
	width: 100vw;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 100;
	.nav {
		width: 100vw;
		line-height: 32px;
		position: relative;
		padding: 0 32px 12px;
		.back-btn {
			position: absolute;
			top: 0;
			left: 0;
			width: 32px;
			height: 32px;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
}

.diy-body {
	padding-bottom: 100px;
	.hasBorder {
		border-bottom: 1px solid #DCDCDC;
		&:last-child {
			border-bottom: none;
		}
	}
	
	// 图文标题
	.img-title-wrap{
		width: 100%;
		padding: 20px 24px 20px 20px;
		background: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		.left {
			flex: 1;
			display: flex;
			align-items: center;
			.img-box {
				margin-right: 16px;
				width: 54px;
				height: 54px;
				border-radius: 8px;
				overflow: hidden;
				.has-img {
					width: 100%;
					height: 100%;
					.img {
						width: 100%;
						height: 100%;
					}
				}
				.has-not-img {
					width: 100%;
					height: 100%;
					background: #F2F3F5;
					display: flex;
					justify-content: center;
					align-items: center;
					.img {
						width: 22px;
					}
				}
			}
			.content {
				padding: 0;
				width: 100px;
				flex: 1;
				margin-right: 16px;
				.title {
					font-size: 16px;
					font-weight: 500;
					line-height: 24px;
					color: #1D2129;
					@include text-overflow;
				}
				.subTitle {
					margin-top: 8px;
					font-size: 14px;
					line-height: 22px;
					color: #86909C;
					@include text-overflow;
				}
			}
		}
		.right {
			display: flex;
			align-items: center;
			.text {
				height: 20px;
				font-size: 12px;
				line-height: 20px;
				color: #3446AA;
				margin-right: 4px;
			}
		}
	}
	
	// 店铺公告
	.notice-wrap {
		background: #fff;
		padding: 10px 16px;
		display: flex;
		align-items: center;
		::v-deep .u-notice-bar {
			padding: 0 !important;
			.u-notice-box {
				margin-left: 0;
			}
		}
		.img-box {
			display: flex;
			align-items: center;
		}
		.split-line {
			margin: 0 8px;
			width: 1px;
			height: 12px;
			background: #D8D8D8;
		}
		.notice {
			font-size: 13px;
			color: #1D2129;
			line-height: 18px;
		}
	}
	
	//图文导航
	.graphic-navigation-wrap {
		padding: 0 16px;
		height: 110px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #fff;
		.link {
			flex: 1;
			width: 0;
			display:flex;
			flex-direction: column;
			align-items: center;
			.img-box {
				width: 60px;
				height: 60px;
				border-radius: 8px;
				overflow: hidden;
				.img {
					width: 100%;
					height: 100%;
				}
				.no-img {
					width: 100%;
					height: 100%;
					background: #F2F3F5;
					display: flex;
					justify-content: center;
					align-items: center;
					.img {
						width: 22px;
					}
				}
			}
			.title {
				margin-top: 4px;
				padding: 0 5px;
				box-sizing: border-box;
				width: 100%;
				height: 22px;
				font-size: 14px;
				line-height: 22px;
				color: #1D2129;
				text-align: center;
				@include text-overflow;
			}
		}
	}
	
	// 多图魔方
	.imgs-cube-wrap {
		background: #fff;
		.title {
				padding: 16px;
				line-height: 24px;
		}

		.cube {
				display: flex;
				justify-content: space-between;
				.left {
						width: 187px;
						height: 210px;
				}

				.right {
						width: 188px;
						height: 210px;
				}

				.img-box {
						width: 100%;
						height: 210px;
						overflow: hidden;
						.has-img {
								width: 100%;
								height: 100%;
								.img {
										width: 100%;
								}
						}
						.has-not-img {
								width: 100%;
								height: 100%;
								background: #F2F3F5;
								display: flex;
								justify-content: center;
								align-items: center;
								.img {
										width: 22px;
								}
						}
				}

				.multiple {
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						.img-box {
								height: 105px;
						}
				}
		}
	}
	
	// 画线分割
	.line-split-wrap {
		background: #fff;
		width: 100%;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		.line {
			width: 100%;
			border-top: 2px solid #E5E6EB;
		}
	}
	
	// 文本分割
	.text-split-wrap {
		background: #fff;
		height: 46px;
		display: flex;
		justify-content: center;
		align-items: center;
		.split-content {
				display: flex;
				align-items: center;
				.line {
						border-top: 1px solid #E5E6EB;
				}
				.text {
						height: 18px;
						font-size: 12px;
						line-height: 18px;
						color: #4E5969;
						padding: 0 8px;
				}
		}
	}
	
	// 门店信息
	.shop-info-wrap {
		background: #fff;
		padding: 16px 20px;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.left {
				margin-right: 18px;
				flex: 1;
				display: flex;
				align-items: center;
				.logo {
						width: 50px;
						height: 50px;
						margin-right: 12px;
				}
				.info {
						flex: 1;
						width: 0;
						.shop-name {
								height: 22px;
								font-size: 14px;
								font-weight: 500;
								line-height: 22px;
								color: #1D2129;
								@include text-overflow;
						}
						.introduce {
								margin-top: 8px;
								height: 18px;
								font-size: 12px;
								line-height: 18px;
								color: #4E5969;
								@include text-overflow;
						}
				}
		}
	}
	
	// 分类导航
	.classified-navigation-wrap {
		background: #fff;
	    .tab-wrap {
	        height: 64px;
	        padding-top: 16px;
	        padding-bottom: 24px;
	        box-sizing: border-box;
	        display: flex;
	        border-bottom: 1px solid #dcdcdc;
	    }
	    
	    .tab {
	        flex: 1;
	        display: flex;
	        justify-content: center;
	        align-items: center;
	        .tab-text {
	            height: 24px;
	            font-size: 16px;
	            line-height: 24px;
	            color: #86909C;
	            position: relative;
	            cursor: default;
	        }
	    }
	    .active {
	        .tab-text {
	            font-weight: 500;
	            color: #3446AA;
	        }
	        .tab-text:after {
	            content: '';
	            display: block;
	            position: absolute;
	            left: 50%;
	            bottom: -4px;
	            transform: translateX(-50%);
	            width: 16px;
	            height: 2px;
	            border-radius: 2px;
	            background: #3446AA;
	        }
	    }
	
	    .goods-list-wrap {
	        .more {
	            margin-bottom: 20px;
	            text-align: center;
	            height: 22px;
	            line-height: 22px;
	            color: #3446AA;
	            font-size: 14px;
	        }
	
	        .car-style-wrap {
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
	                        display: flex;
	                        .service {
	                            height: 18px;
	                            line-height: 18px;
	                            padding: 0 2px;
	                            border-radius: 2px;
	                            background: #F5F6F7;
	                            font-size: 10px;
	                            color: rgba(10, 15, 45, 0.8);
	                            margin-right: 4px;
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
	    }
	}
	
	// body end
}

//商品列表
.goods-list-wrap {
	background: #fff;
	overflow: hidden;
	.more {
			text-align: center;
			height: 22px;
			line-height: 22px;
			color: #3446AA;
			font-size: 14px;
			margin-bottom: 20px;
	}
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
			margin: 0 20px;
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

.page-body {
	padding-bottom: 60px;
	width: 100vw;
	background: #fff;
}

.car-list-tab {
	padding: 20px 0;
	background: #fff;
	.car-tabs {
		padding: 20px;
		display: flex;
		align-items: center;
		position: fixed;
		left: 0;
		width: 100%;
		z-index: 100;
		background: #fff;
		.car-tab {
			margin-right: 16px;
			margin-left: 32rpx;
			font-size: 28rpx;
			color: #666666;
			&.tab-active {
				font-size: 34rpx;
				font-weight: 600;
				color: #333333;
				position: relative;
				&::before {
					content: '';
					position: absolute;
					top: 22rpx;
					left: -26rpx;
					transform: rotate(112deg) skew(20deg);
					background: #31C37B;
					width: 32rpx;
					height: 8rpx;
				}
			}
		}
	}
}

.car-tab-list {
	padding-top: 50px;
}

.tabs {
	position: fixed;
	left: 0;
	bottom: 0;
	z-index: 100;
	background: #fff;
	width: 100vw;
	height: 60px;
	display: flex;
	border-top: 1px solid #DCDCDC;
	.tab {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		.tab-item {
			height: 40px;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			font-size: 10px;
			color: #1D2129;
		}
	}
}

.loadmore {
	padding: 20px 0;
}
</style>
