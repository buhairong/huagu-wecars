<template>
	<view class="detail">
		<view class="car-head">
			<view class="car-head-name">
				<view>
					<text class="m-r-12">{{carInfoImgData.carBrand || ''}}</text>
					<text class="m-r-12">{{carInfoImgData.carType || ''}} </text>
				</view>
				<view class="head-type">
					<text class="m-r-12"> {{carInfoImgData.carTypeYear || ''}}</text>
					<text class="m-r-12"> | </text>
					<text> {{carInfoImgData.carTypeYearProduct || ''}}</text>
				</view>
				<view class="brand-price">
				    <text class="name">
				        指导价
				    </text>
				    <text class="price" v-if="carInfoImgData.guidancePrice">
				        {{ formatNum() }}
				    </text>
				    <text class="price" v-if="!carInfoImgData.guidancePrice">-</text>
				</view>
			</view>
			<view class="car-head-img">
				<image mode="aspectFill" :src="carInfoImgData.imageUrl"></image>
			</view>
			<!-- <view class="scroll-car-box">
				<scroll-view scroll-x class="scroll-car-model">
					<view 
						v-for="(item, index) in newCarModel" 
						:key="index"
						class="toggle-car"
						:class="{'active':activeCar == index}"
						@click="toggleCar(index)">
						{{item.name}}
					</view>
				</scroll-view>
			</view> -->
		</view>
		<view class="topTabs">
			<!-- <view class="tabs u-margin-left-32">
				<u-tabs ref="tabs" :list="queryTypeData" :duration="0.2" :bar-style="barStyleCustom" active-color="#0A0F2D"
					inactive-color="#5e5e61" :active-item-style="styleCustom" :bold="true" :is-scroll="true"
					:current="curQueryType" @change="changeQueryType" />
					
			</view> -->
			<view class="rightSelect">
				
				<!-- <view>保证金</view>
				<view class="selectText">
					<view v-for="(item,index) in newCarItem" :key="index">
							{{item.label}}
					</view>
				</view> -->
				
			<!-- 	<u-dropdown :title-size="24">
					<u-dropdown-item :height="200" @change="toggleDown" v-model="priceMinCondition" :title="newCarName" :options="newCarItem"></u-dropdown-item>
				</u-dropdown> -->
			</view>
		</view>
		<!-- <view class="toggle-car-item">
			<scroll-view scroll-x class="scroll-car-item">
				<view v-for="(carItem, carIndex) in newCarItem" :key="carIndex" class="toggle-car-down"
					:class="{'active':activeDown == carIndex}" @click="toggleDown(carIndex)">
					{{carItem.name}}
				</view>
			</scroll-view>
		</view> -->
		<view class="car-content">
			<view class="car-content-self">
				<view class="pttj" style="display:flex;">
					<view v-if="!companyId">共有<text class="pttj_num"> {{carPlanListData.length}} </text>个</view>商户可提供方案
					<view class="empty"></view>
				</view>
			</view>
			
			<view @click="toggleList(cIndex,cItem)"  v-for="(cItem,cIndex) in carPlanListData" :key="cIndex" class="itemInfo">
				<view class="itemTopInfo">
					<view class="topLeft" @click.stop="goDIYPage(cItem.companyId)">
						<!-- <image class="topImg" src="https://image.51cheyaoshi.com/xcx/app/static/brand.png"></image> -->
						<image class="topImg" :src="cItem.logoImageUrl"></image>
						<text class="carName">{{cItem.merchantName}} </text>
					</view>
					<view class="topRight">
						<text class="rightText">订阅费用</text>
						<text v-if="cItem.paymentType==0" class="rightText1">￥{{cItem.payOffPrice | $numFormat}}</text>
						<text v-else class="rightText1">￥{{cItem.monthPayment | $numFormat}}/月</text>
					</view>
				</view>
				<view v-if="cItem.paymentType==0" class="itemTopInfo">
					<view class=""></view>
					<view class="mothPrice">(合{{cItem.monthPayment | $numFormat}}元/月)</view>
				</view>
				<view class="serviceInfo"><text>限{{cItem.limitMileage}}公里</text><text v-for="item1,index1 in cItem.carSubscribeFreeServiceToWeb" :key="index1">{{item1}}</text></view>
				<view class="endInfo">
					<view class="endTop">期末方案</view>
					<view class="endDesc">
						<view class="endItem">
							<view class="endItemImg">
								<image class="itemImg" src="https://image.51cheyaoshi.com/xcx/app/static/maiduan.png" mode=""></image>
							</view>
							
							<text class="itemText">买断价￥{{cItem.buyoutsFee | $numFormat}}</text>
						</view>
						<view class="endItem">
							<image class="itemImg" src="https://image.51cheyaoshi.com/xcx/app/static/wusun.png" mode=""></image>
							<text class="itemText">无损退车</text>
						</view>
						<view class="endItem1" >
							<text class="btnText" >详情</text>
							<image class="itemImg" src="https://image.51cheyaoshi.com/xcx/app/static/right_green.png" mode=""></image>
						</view>
					</view>
				</view>
			</view>
			<u-empty v-if="!carPlanListData.length" text="暂无信息～" mode="list" margin-top="40"></u-empty>
		
		
		</view>
		
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
		
		<u-modal 
			v-model="isDetail" 
			:title="title" 
			:content='content' 
			:mask-close-able="true"
			:confirm-text='confirmText'
			@confirm='confirm'
		></u-modal>
	</view>
	<!-- test -->
</template>

<script>
	import DetailPopup from './component/DetailPopup'
	import IdentityDialog from '../../mine/components/IdentityDialog.vue'
	
	export default {
		components: {
			DetailPopup,
			IdentityDialog,
		},
		data() {
			return {
				isDetail:false,//认证弹窗
				content:'身份认证后可用车',
				title:'提示',
				closeOnClickOverlay:false,
				confirmText:'去认证',
				src: 'https://image.51cheyaoshi.com/xcx/app/static/img/logo_2.png',
				// activeCar: '0',
				// newCarModel: [
				// 	{name:'2017款技术型'},
				// 	{name:'2018款技术型'},
				// 	{name:'2019款技术型'},
				// 	{name:'2021款技术型'},
				// 	{name:'2022款技术型'}
				// ],
				curQueryType: 0,
				queryType:6,
				queryTypeData: [{
						name: "订阅6个月",
						id: 6
					},
					{
						name: "订阅12个月",
						id: 12
					},
				],
				barStyleCustom: {
					'position': 'absolute',
					'top': '36rpx',
					'transform': 'translate(0px) rotate(114deg) skew(20deg)',
					'background': '#0AEB7D',
					'width': '32rpx',
					'height': '8rpx',
					'border-radius': 0
				},
				styleCustom: {
					"font-weight": 'bold'
				},
				activeDown: '0',
				carInfoImgData: {},
				newCarName:'保证金最低',
				newCarItem: [{
						label: '保证金最低',
						value:1
					},
					{
						label: '月租最低',
						value:2
					},
					{
						label: '总价最低',
						value:3
					}
				],
				showNote: true,
				// 城市id
				cityId: '',
				// 车型年款ID
				carTypeYearProductId: '',
				// 保证金1 月租2 总价3 默认1
				priceMinCondition: '1',
				// 模版id
				templateId: '',
				// 车型列表
				carPlanListData: [],
				// 列表默认
				toggleIndex: '0',
				// 订金
				reserveFee: '',

				carPlanId: '',
				show: false,
				currentItem:{},
				companyId: null,
				showIdentityDialog: false,
				riskAuditStatus: null,
				identityDialogParams: {},
				needPurchaseTaxRatio: 1,
			}
		},
		methods: {
			// toggleCar(index) {
			// 	this.activeCar = index
			// },
			// 切换最低价
			toggleDown(index) {
				// console.log(index)
				// this.activeDown = index
				this.priceMinCondition = index
				// 切换最低价时再把选中的列表数据选中第一条
				// index = 0
				// this.toggleIndex = index
				this.newCarItem.map(item => {
					if(item.value == index){
						this.newCarName = item.label
					}
				})
				this.getCarPlanListData()
			},
			// 车信息和图片
			getCarInfoImgData() {
				var that = this;
				var params = {
					id: that.carTypeYearProductId,
					companyId: this.companyId,
				}
				that.$getRequest(that.$url.getCarInfoImg, "GET", params).then((data) => {
					if (data.code == 0) {
						this.carInfoImgData = data.data
					}
				})
			},
			// 列表内容
			getCarPlanListData() {
				var that = this;
				uni.showLoading({
					title: '加载中'
				});
				var params = {
					carTypeYearProductId: that.carTypeYearProductId,
					cityId: that.cityId,
					priceMinCondition: that.priceMinCondition,
					templateId: that.templateId,
					queryType: '1',
					//totalMouth:this.queryType,
					companyId: this.companyId,

					// carTypeYearProductId:  '13340',
					// cityId: '310100',
				}
				that.$getRequest(that.$url.getCarPlanList, 'POST', params).then((data) => {
					if (data.code == 0) {
						uni.hideLoading()
						that.carPlanListData = data.data
						for (var i = 0; i < that.carPlanListData.length; i++) {
							that.reserveFee = that.carPlanListData[0].reserveFee
							that.carPlanId = that.carPlanListData[0].id
						}
					}
				})
			},
			// 选择列表
			toggleList(index, item) {
				this.carPlanId=item.id
				this.currentItem = item
				this.show = true
			},
			confirm(){//去认证
				uni.setStorageSync("confirmRouter",'/pages/home/profile/detail')
				this.$u.route("/pages/mine/identity/identity")
			},
			
			// 切换购买方式
			changeQueryType(index) {
				// this.curQueryType = index + 1;
				this.curQueryType = index;
				this.queryType = this.queryTypeData[index].id
				// this.barStyleCustom.transform =
				// 	`translate(${this.$refs.tabs.tabQueryInfo[0].width * index}px) rotate(114deg) skew(20deg)`
					this.getCarPlanListData()
			},
			formatNum(){
				let num = this.carInfoImgData.guidancePrice
				if (num != undefined) {
				    // const numStr = (num / 10000).toFixed(2);
				    let tnumStr = (num / 10000).toFixed(3);
				    const numStr = tnumStr.substring(0, tnumStr.length - 1)
				    return `${numStr}万`;
				}
				
			},
			
			goDIYPage(companyId) {
				//this.$u.route(`/pages/diy/diy?companyId=${companyId}`)
			},
			
			openIdentityDialog(identityDialogParams) {
				this.show = false
				this.identityDialogParams = identityDialogParams
				this.showIdentityDialog = true
			},
		},
		onLoad(option) {
			console.log("option=========================", option)
			let cityId = uni.getStorageSync("cityId")
			// uni.setStorageSync("option",option)
			if (option) {
				this.cityId = cityId || option.cityId
				this.carTypeYearProductId = option.carTypeYearProductId
				this.templateId = option.templateId
				this.queryType = option.monthTotal
				this.curQueryType = this.queryTypeData.findIndex(type => type.id == this.queryType)
				this.companyId = option.companyId
				this.needPurchaseTaxRatio = option.needPurchaseTaxRatio
			}
			// // 页面顶部栏标题  动态获取展示
			uni.setNavigationBarTitle({
				title: option.title
			})
			//this.$refs.tabs.init()
		},
		onShow() {
			this.getCarInfoImgData()
			this.formatNum()
		},
		onReady() {
			setTimeout(() => {
				this.changeQueryType(this.curQueryType)
			}, 500)
		},
		computed:{
			
		}
	}
</script>

<style lang="scss" scoped>
	.u-dropdown {
		text-align: right;
}
	.title-size{
		background: rgba(0, 0, 0, 0);
	}
	.u-dropdown__content{
		height: auto;
	}
	.u-dropdown__content__mask{
		background: rgba(0, 0, 0, 0) !important;
	}
	.u-dropdown__content__mask.data-v-01c0c507 {
		background: rgba(0, 0, 0, 0) !important;
}
	.topTabs{
		display: flex;
		align-items: center;
		// position: relative;
		justify-content: space-between;
		.rightSelect{
			width: 150rpx;
			height: 100%;
			padding-bottom: 7rpx;
			box-sizing: border-box;
			margin-right: 80rpx;	
			position: relative;
			.selectText{
				position: absolute;
				
		
			}
		}
		
	}
	.popupInfo {
		padding: 30px 24px;
		font-size: 28rpx;
		color: #64696F;
		.car-content-title{
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 10px;
		}

		.leftInfo {
			display: flex;
			align-items: center;
			text{
				color: #0A0F2D;
			}

		}

		.rightInfo {
			// display: flex;
			// align-items: center;
			text-align: right;
			font-size: 12px;
		}

		.icon_img {
			display: inline-block;
			vertical-align: middle;
			width: 44rpx;
			height: 44rpx;
			margin-right: 6rpx;
		}
		text{
			vertical-align: middle;
		}
		.car-content-row{
			margin-top: 20rpx;
			display: flex;
			align-items: flex-start;
			line-height: 44rpx;
			.leftTitle{
				width: 160rpx;
			}
			.rightNum{
				flex:1;
				color: #0A0F2D;
			}
		}
		.space_row{
			height: 20px;
		}
		.buttomBtn{
			    background: #0A0F2D;
			    border-radius: 16rpx;
					text-align: center;
			    margin-top: 25px;
			    padding: 30rpx 32rpx;
					color: #fff;
		}
	}

	.popupTitle {
		font-style: 15px;
		text-align: center;
		padding: 20px 0 0px 0;
	}

	.pttj {
		margin: -20rpx -10rpx 0 10rpx;
		font-size: 32rpx;
		padding-left: 32rpx;
		box-sizing: border-box;
		font-weight: 600;
		color: #75452D;
		height: 110rpx;
		line-height: 100rpx;
	}

	.brand-price {
		background: url("https://image.51cheyaoshi.com/xcx/app/static/icon3.png") no-repeat;
		background-size: contain;
		display: inline-block;
		padding: 0 10rpx;
		height: 50rpx;
		line-height: 45rpx;
		font-size: 24rpx;
		position: relative;
		vertical-align: top;
		margin-top: 10rpx;
		// margin-left: 16rpx;
		width: 215rpx;
		white-space: pre;
		.name {
			color: #ffffff;
			padding-right: 18rpx;
			width: 36px;
			height: 20px;
			font-family: PingFangSC-Regular;
			font-size: 12px;
			font-weight: normal;
			line-height: 20px;
			letter-spacing: 0px;
			font-weight: 400;
			color: #FFFFFF;
		}
		.price {
			padding: 0 10rpx;
			color: rgba(10, 15, 45, 0.8);
			position: absolute;
			left: 100rpx;
			top: -1rpx;
			z-index: 1;
		}
	}
	.pttj_num {
		color: #F5194B;
		font-size: 40rpx;
		margin: 0 10rpx;
	}

	// .empty {
	// 	width: 16px;
	// 	height: 41px;
	// 	background: white;
	// 	margin-top: 8rpx;
	// 	transform: rotate(25deg);
	// 	opacity: 0.4;
	// 	margin: 0 auto;
	// }

	.f-center {
		display: flex;
		align-items: center;
	}

	.m-r-12 {
		margin-right: 12rpx;
	}

	.detail {
		padding: 0;

		.car-head {
			// border-radius: 24rpx;
			// background: #64696F;
			background: linear-gradient(#D8D9DD, #FFFFFF);

			// box-shadow: 0px -2px 32px rgba(10, 15, 45, 0.02),
			//     0px 8px 24px rgba(10, 15, 45, 0.06);
			.car-head-name {
				padding: 36rpx 32rpx 0rpx;
				box-sizing: border-box;
				font-size: 28rpx;
				font-weight: 600;
				color: #0A0F2D;
				// padding: 20rpx 0 0 20rpx;
				.head-type{
					margin-top: 5rpx;
					height: 18px;
					font-family: PingFangSC-Regular;
					font-size: 12px;
					font-weight: normal;
					line-height: 18px;
					letter-spacing: 0px;
					color: #0A0F2D;
				}
			}

			.car-head-img {
				/* 侧面 */
				width: 375px;
				height: 151px;
				margin: 12rpx auto;
				
				image {
					width: 100%;
					height: 100%;
				}
			}

			.scroll-car-box {
				.scroll-car-model {
					white-space: nowrap;

					.toggle-car {
						display: inline-block;
						padding: 12rpx 24rpx;
						border-radius: 16rpx;
						background: rgba(10, 15, 45, 0.04);
						color: rgba(10, 15, 45, 0.8);
						font-size: 24rpx;
						margin: 0 0 20rpx 16rpx;
					}

					.toggle-car.active {
						background: rgba(10, 235, 125, 0.6);
					}
				}
			}
		}

		.toggle-car-item {
			margin: 0 32rpx 20rpx 32rpx;
			.scroll-car-item {
				white-space: nowrap;
				.toggle-car-down {
					display: inline-block;
					padding: 6rpx 20rpx;
					border-radius: 50rpx;
					border: 2rpx solid rgba(10, 15, 45, 0.3);
					color: rgba(10, 15, 45, 0.8);
					font-size: 24rpx;
					margin-left: 20rpx;
				}
				.toggle-car-down.active {
					border: 4rpx solid #0A0F2D;
				}
			}
		}
		.car-content {
			margin-top: 0;
			background-image:url('https://image.51cheyaoshi.com/xcx/app/static/text_back.png');
			background-repeat:no-repeat;
			background-size: 100% auto;
			.car-content-self {
				border: 1px solid #fff;
				padding: 20rpx 0 0rpx 16rpx;
				.car-content-row {
					line-height: 2;
					.car-content-title {
						font-size: 28rpx;
						color: #64696F;
						.m-col-left-head {
							width: 44rpx;
							height: 44rpx;
							margin-right: 6rpx;
						}
						.m-col-title-txt {
							font-weight: normal;
							font-size: 28rpx;
							line-height: 22px;
							color: #64696F;
							margin-left: 6rpx;
						}
					}
					.car-content-text {
						font-size: 28rpx;
						color: #0A0F2D;
					}
				}
			}
			.itemInfo {
				margin: 36rpx 32rpx;
				padding:  16px;
				margin-top: 0px;
				box-shadow: 0px -2px 32px 0px rgba(10, 15, 45, 0.02),0px 8px 24px 0px rgba(10, 15, 45, 0.04);
				border-radius: 12px;
				&:first-child{
					margin-top: 0;
				}
				.itemTopInfo{
					display: flex;
					justify-content: space-between;
					align-items: center;
					.topLeft{
						display: flex;
						align-items: center;
						width: 50%;
						.topImg{
							width: 24px;
							height: 24px;
							margin-right: 5px;
						}
						.carName{
							overflow:hidden;
							white-space: nowrap;
							text-overflow: ellipsis;
							height: 22px;
							font-family: PingFangSC-Regular;
							font-size: 12px;
							font-weight: normal;
							line-height: 22px;
							letter-spacing: 0px;
							color: rgba(10, 15, 45, 0.8);
						}
					}
					.topRight{
						display: flex;
						align-items: center;
						.rightText{
							color: #000000;
							font-size: 12px;
							margin-right: 5px;
							
						}
						.rightText1{
							color: #F5194B;
							font-size: 16px;
							font-weight: 500;
						}
					}
					.mothPrice{
						color: #000000;
						font-size: 11px;
						opacity: 0.5;
					}
				}
				.serviceInfo{
					line-height: 2;
					font-size: 10px;
					color: #0A0F2D;
					opacity: 0.8;
					text{
						margin-right: 5px;
						padding: 2px 4px;
						border-radius: 2px;
						background: #F5F6F7;
					}
				}
				.endInfo{
					margin-top: 15px;
					.endTop{
						color: #0A0F2D;
						font-size: 14px;
						font-weight: 500;
					}
					.endDesc{
						margin-top: 4px;
						display: flex;
						align-items: center;
						justify-content: space-between;
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
								margin-left: 8px;
								font-size: 14px;
								color: #0A0F2D;
								opacity: 0.8;
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
						.endItem1{
							display: flex;
							align-items: center;
							padding: 4px 10px;
							border-radius: 4px;
							
							/* Color/背景色/浅灰 */
							background: rgba(10, 15, 45, 0.04);
							.itemImg{
								width: 9px;
								height: 9px;
								
								
							}
							.itemText{
								margin-left: 8px;
								font-size: 12px;
								color: #0A0F2D;
								opacity: 0.8;
							}
							.btnText{
								font-size:  12px;
								font-weight: 500;
								color: #0A0F2D;
								margin-right: 5px;
							}
						}
					}
				}
			}

			.car-content-self.active {
				border: 1px solid #75452D;
			}
		}
	}
	.payOff{
		color: #000;
		opacity: 0.5;
		font-size: 12px;
		margin-left: 2px;
	}
</style>
