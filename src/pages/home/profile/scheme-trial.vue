<template>
	<view class="scheme-trial">
		<!-- <view class="top-scheme">
			<view class="title">金融方</view>
			<view class="text-box">
				<view v-for="(item,index) in jrf" :key="index" class="text" :class="{'active': jrfActive == index}"
					@click="toggleJrf(index)">
					<view style="padding:16rpx 0;text-align:center;">{{item.schemeName}}</view>
				</view>
			</view>
		</view>
 -->
		<view class="by-starge">
			<view class="title">分期期数</view>
			<view class="text-box">
				<view v-for="(items,indexs) in currentJrf.interestRareList" :key="indexs" class="text"
					:class="{'active': byStagesActive == indexs}" @click="toggleByStarge(indexs)">
					<view style="padding:16rpx 0;text-align:center;">{{items.supportPeriod}}期</view>
				</view>
			</view>
		</view>

		<view class="down-payment">
			<view class="title">首付比例</view>
			<view class="slider-wrap">
				<view class="slider">
					<u-slider v-model="stepValue" :min="currentJrf.minFirstPayRatio"
						:max="100" block-width="20" active-color="#ebecee" inactive-color="#ebecee"
						:use-slot="true" @end="ratioChange">
						<view class="badge-button" />
					</u-slider>
				</view>
				<view class="percent">
					{{ stepValue }}%
				</view>
			</view>
			
		</view>

<!-- 		<view class="tail-payment">
			<view class="title">尾款比例</view>
			<view class="slider"> -->
				<!-- 滑动条 -->
			<!-- 	<u-slider v-model="tailValue" :step="stepUnit1" :min="currentJrf.minBalancePaymentRatio"
					:max="currentJrf.maxBalancePaymentRatio" block-width="20" active-color="#ebecee"
					inactive-color="#ebecee" :use-slot="true" @end="ratioChange">
					<view class="badge-button" />
				</u-slider> -->
				<!-- 比例范围 -->
	<!-- 			<view class="percent u-flex u-row-between">
					<text v-for="(item, index) in 10 + 1" :key="item" class="item"> -->
						<!-- 首付比例下面的百分之  数 -->
						<!-- {{ index * 10 + carHirePurchaseVO.minFirstPaymentRate }}% -->
				<!-- 		{{ index * 10}}%
					</text>
				</view>
			</view>
		</view> -->

		<view class="scheme-trial">
			<view class="title">方案试算</view>
			<view class="content-box">
				<u-row style="line-height: 2;">
					<u-col span="4" style="font-size: 28rpx;color: #64696F;">首付金额：</u-col>
					<u-col span="8" style="color: #0A0F2D;">{{fangAnInfo.firstPayment}}元</u-col>
				</u-row>
				<u-row style="line-height: 2;">
					<u-col span="4" style="font-size: 28rpx;color: #64696F;">分期金额：</u-col>
					<u-col span="8" style="color: #0A0F2D;">{{fangAnInfo.installmentPayment}}元</u-col>
				</u-row>
				<u-row style="line-height: 2;">
					<u-col span="4" style="font-size: 28rpx;color: #64696F;">分期期数：</u-col>
					<u-col span="8" style="color: #0A0F2D;">{{fangAnInfo.period}}期</u-col>
				</u-row>
				<u-row style="line-height: 2;">
					<u-col span="4" style="font-size: 28rpx;color: #64696F;">金融利率：</u-col>
					<u-col span="8" style="color: #0A0F2D;">{{currentRate}}%</u-col>
				</u-row>
				<u-row style="line-height: 2;">
					<u-col span="4" style="font-size: 28rpx;color: #64696F;">月供金额：</u-col>
					<u-col span="8" style="color: #0A0F2D;">{{fangAnInfo.monthPayment}}元</u-col>
				</u-row>
			</view>
		</view>
		<u-gap height="190" margin-top="50" bg-color="#FFFFFF" />
		<view class="foot-but foot-sticky u-flex u-row-between" @click="save">
			<view class="foot-but-r" style="margin: 0 auto">
				保存
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 金融方
				jrfActive: 0,
				currentJrf: {},
				currentRate: '',
				jrfId: '',
				jrf: [

				],
				// 分期期数
				byStagesActive: 0,
				byStagesNum: [{
						name: '6期',
						value: 6
					},
					{
						name: '12期',
						value: 6
					},
					{
						name: '24期',
						value: 6
					},
					{
						name: '36期',
						value: 6
					}
				],
				// 滑动条 首付
				stepValue: '',
				// 滑动条 尾款
				tailValue: '',
				id: '',
				planId: '',
				configId: '',
				buyoutsFee: '',
				fangAnInfo: {},
				cartype: null, // 1.新车 2.二手车
			}
		},
		onLoad(option) {
			console.log(option)
			this.id = option.id
			this.planId = option.planId
			this.configId = option.config
			this.buyoutsFee = option.buyoutsFee
			this.cartype = option.cartype // 1.新车 2.二手车
			this.BySubscribeId()
		},
		computed: {
			rateSeveral() {
				if (this.currentJrf) {
					return (this.currentJrf.maxFirstPaymentRate - this.currentJrf.minFirstPaymentRate) / 10;
				} else {
					return 10;
				}
			},
			rateSeveral1() {
				if (this.currentJrf) {
					return (this.currentJrf.maxBalancePaymentRatio - this.currentJrf.minBalancePaymentRatio) / 10;
				} else {
					return 10;
				}
			},
			stepUnit() {
				return 10;
			},
			stepUnit1() {
				return 10;
			}
		},
		watch: {
			jrfActive: 'getBuyoutFinalInstallmentPrice',
			byStagesActive: 'getBuyoutFinalInstallmentPrice',
			// stepValue:'getBuyoutFinalInstallmentPrice',
			// tailValue:'getBuyoutFinalInstallmentPrice'
		},
		methods: {
			// 金融方
			toggleJrf(index) {

				this.currentJrf = this.jrf[index]
				this.upData()
				this.jrfId = this.jrf[index].id
				this.jrfActive = index
			},
			upData() {
				console.log(this.currentJrf)
				if (this.currentJrf.whetherUnifyDepositRate) {
					this.currentRate = this.currentJrf.unifyDepostRate
					this.stepValue = this.currentJrf.minFirstPayRatio

				} else {
					this.currentRate = this.currentJrf.interestRareList[0].interestRare
					this.stepValue = this.currentJrf.minFirstPayRatio
				}
				this.tailValue = this.currentJrf.minBalancePaymentRatio
				console.log(this.stepValue, this.tailValue)
			},
			ratioChange() {
				this.getBuyoutFinalInstallmentPrice()
			},
			// 分期期数
			toggleByStarge(index) {
				this.byStagesActive = index
			},
			toggleByStarge1() {
				this.getBuyoutFinalInstallmentPrice()
			},
			// this.planId
			async BySubscribeId() {
				let result = await this.$getRequest(this.$url.BySubscribeId, 'GET', {
					id: this.planId,
				})
				this.jrf = result.data
				this.jrfId = result.data.id
				this.currentJrf = result.data
				if (this.currentJrf.whetherUnifyDepositRate) {
					this.currentRate = this.currentJrf.unifyDepostRate
					this.stepValue = this.currentJrf.minFirstPayRatio
				} else {
					this.currentRate = this.currentJrf.interestRareList[0].interestRare
					this.stepValue = this.currentJrf.minFirstPayRatio
				}
				this.tailValue = this.currentJrf.minBalancePaymentRatio
				this.getBuyoutFinalInstallmentPrice()
			},
			async getBuyoutFinalInstallmentPrice() {
				let params = {
					traditionFinancialSchemeId: this.jrfId,
					period: this.currentJrf.interestRareList[this.byStagesActive].supportPeriod,
					firstPaymentRatio: this.stepValue,
					balancePaymentRatio: this.tailValue || 0,
					buyoutsFee: this.buyoutsFee
				}
				let result = await this.$getRequest(this.$url.getBuyoutFinalInstallmentPrice, 'POST', params)
				this.fangAnInfo = result.data != null ? result.data : {}
			},
			async save() {
				this.$getRequest(this.$url.getFullPaymentPrice, 'GET', {
					id: this.planId
				}).then((data) => {
					if (data.code == 0) {
						let params = {
							userCarSubscribeId: this.id,
							newOrOld: this.cartype, // 新车or二手车标识：1 新车，2 二手车
							buyoutsFee: this.buyoutsFee,
							deposit: data.deposit,
							finalSelect: 2,
							firstPayment: this.fangAnInfo.firstPayment,
							id: this.configId,
							installmentPayment: this.fangAnInfo.installmentPayment,
							interestRate: this.currentRate,
							monthPayment: this.fangAnInfo.monthPayment,
							period: this.fangAnInfo.period,
						}
						this.$getRequest(this.$url.updateUserCarSubscribeFinalBuyout,
							'POST', params).then(result => {
								if (result.code == 0) {
									uni.navigateTo({
										url: '../../ordered/sub-order-info?id=' + this.id+'&cartype='+this.cartype
									})
								}
							})
						
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.scheme-trial {
		padding: 0;
		margin: 0rpx 32rpx 36rpx 32rpx;
		.top-scheme {
			.title {
				font-weight: 600;

			}

			.text-box {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				flex-wrap: wrap;
				margin-top: 32rpx;

				.text {
					width: 46%;
					border-radius: 8rpx;
					opacity: 0.6;
					font-size: 28rpx;
					font-weight: 500;
					color: #0A0F2D;
					background: #F5F6F7;
				}

				.text.active {
					background: #0AEB7D;
				}
			}
		}

		.by-starge {
			.title {
				font-weight: 600;
				margin-top: 48rpx;
			}

			.text-box {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				flex-wrap: wrap;
				margin-top: 32rpx;

				.text {
					width: 23%;
					border-radius: 8rpx;
					opacity: 0.6;
					font-size: 28rpx;
					font-weight: 500;
					color: #0A0F2D;
					background: #F5F6F7;
				}

				.text.active {
					background: #0AEB7D;
				}
			}
		}

		.down-payment {
			.title {
				margin-top: 48rpx;
				font-weight: 600;
				
			}

			.text-box {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				flex-wrap: wrap;
				margin-top: 32rpx;

				.text {
					width: 23%;
					border-radius: 8rpx;
					opacity: 0.6;
					font-size: 28rpx;
					font-weight: 500;
					color: #0A0F2D;
					background: #F5F6F7;
				}

				.text.active {
					background: #0AEB7D;
				}
			}

			.step-box {
				margin-top: 32rpx;
			}
			
			.slider-wrap {
				display: flex;
				align-items: center;
			}

			.slider {
				flex: 1;
				padding: 0 34rpx;
				padding-top: 30rpx;
				padding-bottom: 30rpx;

				.percent {
					font-size: 30rpx;
					color: rgba(10, 15, 45, 0.5);
				}

				.badge-button {
					width: 40rpx;
					height: 40rpx;
					background: url('https://image.51cheyaoshi.com/xcx/app/static/slider.png') no-repeat;
					background-size: 100%;
					display: inline-block;
					position: relative;
					z-index: 1;
				}
			}
		}

		.tail-payment {
			.title {
				margin-top: 48rpx;
				font-weight: 600;
				margin-bottom: 14px;
			}

			.step-box {
				margin-top: 32rpx;
			}

			.slider {
				padding: 0 34rpx;
				padding-top: 30rpx;
				padding-bottom: 30rpx;

				.percent {
					margin: 25rpx -16rpx 0rpx;

					.item {
						// width: 60rpx;
						font-size: 20rpx;
						color: rgba(10, 15, 45, 0.5);
					}
				}

				.badge-button {
					width: 40rpx;
					height: 40rpx;
					background: url('https://image.51cheyaoshi.com/xcx/app/static/slider.png') no-repeat;
					background-size: 100%;
					display: inline-block;
					position: relative;
					z-index: 1;
				}
			}
		}

		.scheme-trial {
			.title {
				margin-top: 48rpx;
				font-weight: 600;
				margin-bottom: 16px;
			}

			.content-box {
				border-radius: 24rpx;
				background: #FFFFFF;
				box-shadow: 0px -2px 32px 0px rgba(10, 15, 45, 0.02), 0px 8px 24px 0px rgba(10, 15, 45, 0.04);
				padding: 40rpx 0 40rpx 34rpx;
			}
		}
	}
</style>
