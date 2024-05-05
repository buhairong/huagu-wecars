<!--
 * @Author: lufeng
 * @Date: 2021-11-01 17:52:29
 * @LastEditTime: 2022-01-09 21:02:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /butler-super/src/pages/index/index.vue
-->
<template>
    <view class="mine">
        <view>
            <header-top :type="1" />
        </view>
        <view
            v-if="userInfo"
            class="head u-flex u-row-between u-margin-bottom-40"
        >
            <view class="u-flex">
                <view class="head-img">
                    <image
											style="width:100%;height:100%;"
											shape="circle"
											:src="userInfo.imageUrl || 'https://image.51cheyaoshi.com/xcx/app/static/carlife/worker_icon.png'"
                    />
                </view>
                <view class="sign">
                    <view style="display:flex;align-items: center;" @click="openSetNickPopup">
                        <text class="username">
													{{ userInfo.nickname || '请设置昵称' }}
                        </text>
												<u-icon
													v-if="!userInfo.nickname"
													name="edit-pen"
													color="#0A0F2D"
													size="32"
												/>
                    </view>
                    <view class="slogan">
                        让有车生活 · 更简单
                    </view>
                </view>
            </view>
						<view class="u-flex" style="align-items: center;">
							<image
								v-if="userInfo.isPartner === 1 && userInfo.isFreezed === 0"
								style="width: 40rpx;margin-left:24rpx;"
							  src="https://image.51cheyaoshi.com/xcx/app/static/home/qrcode_icon.png"
								mode="widthFix"
								@click="goQrCodePage"
							/>
							<view
							    class="u-margin-left-16 u-margin-right-10"
							    @click="handleSetup"
							>
							    <u-icon
							        name="setting"
							        color="#0A0F2D"
							        size="48"
							    />
							</view>
						</view>
        </view>
				<view
					v-else
					class="head u-flex u-row-between u-margin-bottom-40"
				>
					<view class="u-flex">
							<view class="head-img">
									<image
										style="width:100%;height:100%;"
										src="https://image.51cheyaoshi.com/xcx/app/static/carlife/worker_icon.png"
									/>
							</view>
							<view class="sign">
									<view @click="handleSign">
											<text class="username">
													立即登录
											</text>
											<u-icon name="arrow-right" />
									</view>
									<view class="slogan">
											让有车生活 · 更简单
									</view>
							</view>
					</view>
					<view
							class="u-margin-right-10"
							@click="handleSetup"
					>
						<u-icon
							name="setting"
							color="#0A0F2D"
							size="48"
						/>
					</view>
        </view>
				
        <!-- <view class="member u-flex">
            <view
                class="u-flex-1"
                @click="handleBalance"
            >
                <view class="money">
                    {{ userAccountEntity ? userAccountEntity.balance : '--' }}
                </view>
                <view class="unit">
                    余额/元
                </view>
            </view>
            <view
                class="u-flex-1"
                @click="handleDeposit"
            >
                <view class="money">
                    {{ userDepositEntity ? userDepositEntity.balance : '--' }}
                </view>
                <view class="unit">
                    押金/元
                </view>
            </view>
            <view
                class="u-flex-1"
                @click="handleCoupon"
            >
                <view class="money">
                    {{ userCouponEntityList ? userCouponEntityList.length : '--' }}
                </view>
                <view class="unit">
                    优惠券/张
                </view>
            </view>
        </view> -->
				
				
        <view class="card">
            <u-cell-group :border="false">
							<view class="menu-wrap" @click="myAccount">
								<view class="title">
									<image
										style="width: 36rpx;"
									  src="https://image.51cheyaoshi.com/xcx/app/static/home/deposit-icon.png"
										mode="widthFix"
										class="stages-img"
									/>
									<text class="text">我的账户</text>
								</view>
								<view class="menu-right">
									<!-- <view class="balance">{{ userDepositEntity && userDepositEntity.balance || 0 }}元</view> -->
									<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
								</view>
							</view>
                <u-cell-item
                    title="用车订单"
                    arrow-direction="right"
                    :title-style="titleStyle"
                    @click="handleOrderList"
                >
                    <u-icon
                        slot="icon"
                        size="32"
                        name="list-dot"
                    />
                </u-cell-item>
								<view class="menu-wrap" @click="goAuctionListPage">
									<view class="title">
										<image
											style="width: 36rpx;"
										  src="https://image.51cheyaoshi.com/xcx/app/static/home/auction_icon.png"
											mode="widthFix"
											class="stages-img"
										/>
										<text class="text">我的竞价</text>
									</view>
									<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
								</view>
								<view class="menu-wrap" @click="goStagePage">
									<view class="title">
										<image
											style="width: 36rpx;"
										  src="https://image.51cheyaoshi.com/xcx/app/static/img/card.png"
											mode="widthFix"
											class="stages-img"
										/>
										<text class="text">我要分期</text>
									</view>
									<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
								</view>
                <u-cell-item
                    title="门店订单"
                    arrow-direction="right"
                    :title-style="titleStyle"
                    @click="handleTip"
                >
                    <u-icon
                        slot="icon"
                        size="32"
                        name="file-text"
                    />
                </u-cell-item>
                <u-cell-item
                    title="购物订单"
                    arrow-direction="right"
                    :title-style="titleStyle"
                    @click="handleTip"
                >
                    <u-icon
                        slot="icon"
                        size="32"
                        name="integral"
                    />
                </u-cell-item>
            </u-cell-group>
        </view>
				
				<view class="card">
					<view class="menu-wrap" @click="goPartner">
						<view class="title">
							<image
								style="width: 32rpx;"
							  src="https://image.51cheyaoshi.com/xcx/app/static/home/handshake_icon.png"
								mode="widthFix"
								class="stages-img"
							/>
							<text class="text">
								{{userInfo && userInfo.isPartner === 1 ? '进入' : '成为'  }}全民合伙人
							</text>
						</view>
						<view class="menu-right">
							<view class="point" v-if="userInfo && userInfo.hasNewCustomerOrOrder === 1"></view>
							<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
						</view>
					</view>
					
					<view class="menu-wrap" @click="goPartnerFaqPage">
						<view class="title">
							<image
								style="width: 32rpx;"
							  src="https://image.51cheyaoshi.com/xcx/app/static/home/faq_icon.png"
								mode="widthFix"
								class="stages-img"
							/>
							<text class="text">全民合伙人FAQ</text>
						</view>
						<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
					</view>
					
					<view class="menu-wrap" @click="goPartnerAboutPage">
						<view class="title">
							<image
								style="width: 32rpx;"
							  src="https://image.51cheyaoshi.com/xcx/app/static/home/about_icon.png"
								mode="widthFix"
								class="stages-img"
							/>
							<text class="text">关于全民合伙人</text>
						</view>
						<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
						
					</view>
					
					<view class="menu-wrap" @click="goPartner" v-if="userInfo && userInfo.isPartner === 1">
						<view class="title">
							<image
								style="width: 36rpx;"
							  src="https://image.51cheyaoshi.com/xcx/app/static/home/eye_fill.png"
								mode="widthFix"
								class="stages-img"
							/>
							<text class="text">详情页显示佣金</text>
						</view>
						<view @click.stop>
							<u-switch
								v-model="showDistributionBrokerageFree" 
								active-color="#31C37B" 
								inactive-color="rgba(114, 114, 114, 0.6)"
								:active-value="1" 
								:inactive-value="0"
								size="24"
								@change="toggleShowDistributionBrokerageFree"
							></u-switch>
						</view>
					</view>
					
				</view>
				
        <!-- <view class="card">
            <u-cell-group :border="false">
                <u-cell-item
                    title="添加爱车"
                    arrow-direction="right"
                    :title-style="titleStyle"
                    @click="handleAddCar"
                >
                    <u-icon
                        slot="icon"
                        size="32"
                        name="plus-circle"
                    />
                </u-cell-item>
                <u-cell-item
                    title="成为车主"
                    arrow-direction="right"
                    :title-style="titleStyle"
                    @click="handleTip"
                >
                    <u-icon
                        slot="icon"
                        size="32"
                        name="account"
                    />
                </u-cell-item>
                <u-cell-item
                    title="爱车估值"
                    arrow-direction="right"
                    :title-style="titleStyle"
                    @click="handleTip"
                >
                    <u-icon
                        slot="icon"
                        size="32"
                        name="rmb"
                    />
                </u-cell-item>
            </u-cell-group>
        </view> -->
				
				
        <view class="card">
            <u-cell-group
                :border="false"
            >
                <u-cell-item
                    title="收藏关注"
                    arrow-direction="right"
                    :title-style="titleStyle"
                    @click="handleTip"
                >
                    <u-icon
                        slot="icon"
                        size="32"
                        name="heart"
                    />
                </u-cell-item>
								
                <u-cell-item
                    title="建议反馈"
                    arrow-direction="right"
                    :title-style="titleStyle"
                    index="2"
                    @click="handleRelevant"
                >
                    <u-icon
                        slot="icon"
                        size="32"
                        name="edit-pen"
                    />
                </u-cell-item>
								
                <!-- <u-cell-item
                    title="联系客服"
                    arrow-direction="right"
                    :title-style="titleStyle"
                    :value-style="{
                        fontSize: '30rpx'
                    }"
                    index="3"
                    @click="handleRelevant"
                >
                    <u-icon
                        slot="icon"
                        size="32"
                        name="server-fill"
                    />
                    <text>
                        400-000-1234
                    </text>
                </u-cell-item>
                <u-cell-item
                    title="24h道路救援"
                    arrow-direction="right"
                    index="4"
                    :title-style="titleStyle"
                    :value-style="{
                        fontSize: '30rpx'
                    }"
                    @click="handleRelevant"
                >
                    <u-icon
                        slot="icon"
                        size="32"
                        name="phone"
                    />
                    <text @click="callPhone('400-000-1234')">
                        400-000-1234
                    </text>
                </u-cell-item> -->
								
                <u-cell-item
                    title="关于车要试"
                    arrow-direction="right"
                    :title-style="titleStyle"
                    index="1"
                    @click="handleRelevant"
                >
                    <u-icon
                        slot="icon"
                        size="32"
                        name="info-circle"
                    />
                </u-cell-item>
								<u-cell-item
								    title="协议政策"
								    arrow-direction="right"
								    :title-style="titleStyle"
								    index="1"
								    @click="goAgreeMentPage"
								>
								    <u-icon
								        slot="icon"
								        size="32"
								        name="file-text"
								    />
								</u-cell-item>
            </u-cell-group>
        </view>
				
				<SetNickPopup 
					:show.sync="showSetNickPopup"
					:userId="userInfo.id"
					@save="saveNickName"
				/>
				
				<u-popup border-radius="14" mode="center" v-model="showFreezedTipPopup" @close="close">
					<view class="popup-wrap">
						<view class="title">{{tipModel.title}}</view>
						<view class="content">{{tipModel.content}}</view>
						<view class="btn" @click="close">{{tipModel.btnText}}</view>
					</view>
				</u-popup>
    </view>
</template>

<script>
import SetNickPopup from './components/SetNickPopup.vue'
	
export default {
    name: "MineHome",
		
		components: {
			SetNickPopup
		},
		
    data() {
        return {
            titleStyle: {
                fontSize: '30rpx',
                lineHeight: '44rpx',
                color: '#0A0F2D',
                marginLeft: '18rpx'
            },
            title: "login",
            form: {
                name: "",
            },
            userInfo: null,
            myBasicInfo: null,
            userAccountEntity: null, // 余额账户
            userDepositEntity: null, // 押金账户
            userCouponEntityList: null, // 优惠券
						showSetNickPopup: false,
						showDistributionBrokerageFree: 0,
						showFreezedTipPopup: false,
						tipModel: {
							title: '',
							content: '',
							btnText: '',
						},
        };
    },
		
    onLoad() {
			
    },
		
    onShow() {
			const isLogin = uni.getStorageSync('isLogin')
			if (isLogin) {
				getApp().globalData.getUserInfo((data) => {
					//data.isPartner = 0
					// data.isHasOrder = 0
					this.userInfo = data
					if(data) {
						this.showDistributionBrokerageFree = data.showDistributionBrokerageFree || 0
						this.getMyBasicInfo(data.id)
					}
				})
			}
    },
		
    methods: {
			saveNickName(nickName) {
				this.userInfo.nickname = nickName
			},
			
			openSetNickPopup() {
				if (!this.userInfo.nickname) {
					this.showSetNickPopup = true
				}
			},
			
			goStagePage() {
				this.$u.route("/pages/stage/stage")
			},
			
			goAuctionListPage() {
				this.isLogin()
				uni.navigateTo({
					url: `/pagesOrder/auction/auctionList?userId=${this.userInfo.id}`
				})
			},
			
        handleSign() {
          this.$u.route("/pages/sign/sign")
        },
				
        isLogin() {
					if(!this.userInfo) {
						this.$u.route("/pages/sign/sign")
					}
        },
				
        handleRelevant(index) {
					if(index == 1) {
						this.$u.route('/pages/mine/about')
					} else if(index == 2) {
						this.isLogin();
						this.$u.route('/pages/mine/feedback')
					} else if(index == 3) {
						uni.makePhoneCall({
								phoneNumber: '4000001234',
						})
					} else {
						uni.makePhoneCall({
								phoneNumber: '4000001234',
						})
					}
        },
				goAgreeMentPage() {
					uni.navigateTo({
						url: `/pages/agreement/privacyAgreement`
					})
				},
        handleBalance() {
            this.isLogin();
            this.$u.route('/pages/mine/balance')
        },
				
				myAccount() {
					this.isLogin()
					uni.navigateTo({
						url: `/pagesOrder/auction/cashHome?userId=${this.userInfo.id}`
					})
				},
				
        handleDeposit() {
            this.isLogin();
            this.$u.route('/pages/mine/deposit')
        },
        handleSetup() {
            this.isLogin();
            this.$u.route('/pages/mine/setup')
        },
        handleCoupon() {
            this.isLogin();
            this.$u.route('/pages/mine/coupon/list')
        },
        handleOrderList() {
					if(!this.userInfo) {
						this.isLogin()
					}else {
						this.$u.route('/pages/mine/order-list')
					}
        },
        async getMyBasicInfo(id) {
            const res = await this.$getRequest(this.$url.myInfo, 'POST', {id})
            this.myBasicInfo = res.data
            this.userAccountEntity = res.data.userAccountEntity
            this.userDepositEntity = res.data.userDepositEntity
            this.userCouponEntityList = res.data.userCouponEntityList
        },
        handleAddCar(){
          this.$u.route('/pages/maintenances/add-car')
        },
        handleTip() {
            uni.showToast({
                title: '功能建设中，敬请期待',
                duration: 2000,
                icon: 'none'
            });
        },
				
				goPartner() {
					// uni.navigateToMiniProgram({
					// 	appId: 'wxd561b5dc0088ee14',
					// 	path: `pages/product/product`,
					// })
					this.isLogin()
					//this.userInfo.isPartner = 0
					if (this.userInfo.isPartner === 1) {
						if (this.userInfo.isFreezed === 1) {
							this.tipModel.title = '抱歉'
							this.tipModel.content = '您的全民合伙人权限已被冻结！'
							this.tipModel.btnText = '我知道了'
							this.showFreezedTipPopup = true
						} else {
							// this.userInfo.isFirstLoginPartner = 1
							if (this.userInfo.isFirstLoginPartner == 1) {
								uni.navigateTo({
									url: `/partner/partner/home?userId=${this.userInfo.id}&partnerType=${this.userInfo.partnerType}&partnerCompany=${this.userInfo.partnerCompany}&roleId=${this.userInfo.roleId}`
								})
							} else {
								uni.navigateTo({
									url: `/partner/task/home?userId=${this.userInfo.id}&isFirstLoginPartner=${this.userInfo.isFirstLoginPartner}`
								})
							}
						}
					} else if (this.userInfo.isPassPartner === 0) {
						this.tipModel.title = '提示'
						this.tipModel.content = '您已经申请全民合伙人，请耐心等待审核。'
						this.tipModel.btnText = '我知道了'
						this.showFreezedTipPopup = true
					} else if (this.userInfo.isPassPartner === 2) {
						this.tipModel.title = '抱歉'
						this.tipModel.content = '您的全民合伙人申请未通过。'
						this.tipModel.btnText = '我知道了'
						this.showFreezedTipPopup = true
					} else {
						uni.navigateTo({
							url: `/partner/register/register?userId=${this.userInfo.id}&isHasOrder=${this.userInfo.isHasOrder}`
						})
					}
				},
				
				close() {
					this.showFreezedTipPopup = false
				},
				
				goPartnerAboutPage() {
					uni.navigateTo({
						url: '/partner/agreement/about'
					})
				},
				
				goPartnerFaqPage() {
					uni.setStorageSync('url', 'https://h5.51cheyaoshi.com/partner-FAQ/index.html')
					uni.navigateTo({
						url: `/pages/home/profile/wxbview`
					})
				},
				
				toggleShowDistributionBrokerageFree(e) {
					const data = {
						userId: this.userInfo.id,
						showDistributionBrokerageFree: e
					}
					
					this.$getRequest(this.$url.showDistributionBrokerageFree, "GET", data).then(res => {
						if (res.code === 0) {
							uni.showToast({
								title: '保存成功',
								duration: 2000,
								icon: 'none',
							})
							getApp().globalData.userInfo.showDistributionBrokerageFree = e
						} else {
							uni.showToast({
								title: '保存失败',
								duration: 2000,
								icon: 'none',
							})
						}
					}).catch(err => {
						uni.showToast({
							title: '保存失败',
							duration: 2000,
							icon: 'none',
						})
					})
				},
				
				goQrCodePage() {
					uni.navigateTo({
						url: `/partner/qrcode/qrcode?page=1&userId=${this.userInfo.id}`
					})
				},

    },
};
</script>

<style lang="scss" scoped>
    .card ::v-deep .u-cell {
        padding: 30rpx 0;
    }
    .mine {
        background: linear-gradient(180deg, #0AEB7D 0%, rgba(196, 196, 196, 0) 100%);
        padding: 0 32rpx;
        padding-bottom: 40rpx;
        .head {
            .head-img {
                width: 116rpx;
                height: 116rpx;
                border-radius: 50%;
                overflow: hidden;
            }
            .sign {
                margin-left: 18rpx;
                .username {
                    font-size: 34rpx;
                    line-height: 48rpx;
                    margin-right: 18rpx;
                    font-weight: 500;
                }
                .slogan {
                    font-size: 24rpx;
                    line-height: 40rpx;
                    color: rgba(10, 15, 45, 0.8);
                }
            }
        }
        .member {
            text-align: center;
            margin-top: 18rpx;
            padding: 40rpx 0rpx;
            background: #fff;
            box-shadow: 0px -2px 32px rgba(10, 15, 45, 0.02), 0px 8px 24px rgba(10, 15, 45, 0.04);
            border-radius: 24rpx;
            .money {
                font-weight: 500;
                font-size: 40rpx;
                line-height: 60rpx;
                color: #0A0F2D;
            }
            .unit {
                font-size: 24rpx;
                line-height: 40rpx;
                color: rgba(10, 15, 45, 0.5);
            }
        }
        .card {
            background: #FFFFFF;
            box-shadow: 0px -2px 32px rgba(10, 15, 45, 0.02), 0px 8px 24px rgba(10, 15, 45, 0.04);
            border-radius: 24rpx;
            padding: 0 44rpx;
            margin-top: 24rpx;
        }
    }
		
		.menu-wrap {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 108rpx;
			box-shadow: inset 0px -1px 0px 0px rgba(10, 15, 45, 0.04);
			.title {
				display: flex;
				align-items: center;
			}
			.stages-img {
				
			}
			.text {
				font-size: 30rpx;
				color: #0A0F2D;
				padding-left: 14rpx;
			}
		}

.menu-right {
	display: flex;
	align-items: center;
	.balance {
		padding-right: 16rpx;
		font-size: 14px;
		color: #6E6F77;
	}
	.point {
		margin-right: 16rpx;
		width: 16rpx;
		height: 16rpx;
		background: #EE2223;
		border-radius: 50%;
	}
}

.popup-wrap {
	padding: 80rpx 64rpx;
	.title {
		height: 56rpx;
		font-size: 40rpx;
		line-height: 56rpx;
		color: #333333;
	}
	.content {
		padding-top: 40rpx;
		height: 34rpx;
		font-size: 28rpx;
		line-height: 34rpx;
		color: #505050;
	}
	.btn {
		margin-top: 200rpx;
		width: 100%;
		height: 100rpx;
		border-radius: 16rpx;
		background: #31C37B;
		font-size: 32rpx;
		color: #FFFFFF;
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
</style>
