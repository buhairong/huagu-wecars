<template>
    <view
        v-if="carInfo"
        class="detail-head"
    >
        <!-- 顶部bar 电量、wifi等的地方 -->
        <!-- <view
            class="status-bar"
            :style="{ height: custom.top + 'px' }"
        /> -->

        <!-- logo -->
        <!-- <view class="nav-custom u-flex">
            <image
                class="logo"
                src="https://image.51cheyaoshi.com/xcx/app/static/logo.svg"
            />
        </view> -->

        <!-- 标题 -->
        <view class="car-info u-flex u-row-between">
            <!-- 左 -->
            <view class="brand">
                <text class="brand-t">
                    {{ carDetailData.carBrand || '' }} {{ carDetailData.carType || '' }}
                </text>
                <view v-if="showMonthPayment && (monthPayment > 0 || carInfo.carSubscribeRespVO.monthPayment > 0)" class="u-margin-top-16">
                    <text class="m-serfee-title-txt u-font-30">
                        月租金：
                    </text>
                    <text class="m-serfee-val-txt u-font-30">
                        {{ monthPayment | $numFormat }}/月
                    </text>
                </view>
            </view>
            
            <!-- 右 分享、喜欢图标 -->
            <view class="car-info-icon">
                <!-- <u-image
                    class="icon"
                    width="32rpx"
                    height="28rpx"
                    src="https://image.51cheyaoshi.com/xcx/app/static/icon1.png"
                /> -->
                <u-icon
                    v-if="showLike && carInfo.isLike == 1"
                    name="heart-fill"
                    color="#0a0f2d"
                    size="40"
                    class="fw u-padding-right-30"
                    @click="handleLike"
                />
                <u-icon
                    v-if="showLike && carInfo.isLike == 0"
                    name="heart"
                    color="#0a0f2d"
                    size="40"
                    class="fw u-padding-right-30"
                    @click="handleLike"
                />


                <button
                    open-type="share"
                    class="u-reset-button btu-share"
                >
                    <u-icon
                        name="zhuanfa"
                        color="#0a0f2d"
                        size="40"
                        class="fw u-padding-right-20"
                        @click="handleLike"
                    />
                </button>
                
                <!-- heart -->
                
                <!-- <u-image
                    class="icon"
                    width="28rpx"
                    height="28rpx"
                    src="https://image.51cheyaoshi.com/xcx/app/static/icon2.png"
                /> -->
            </view>
       
		</view>
		<view class="brand-price">
		    <text class="name">
		        指导价
		    </text>
		    <text class="price" v-if="carDetailData.guidancePrice">
		        {{ formatNum }}
		    </text>
		    <text class="price" v-if="!carDetailData.guidancePrice">-</text>
		</view>
        <!-- banner -->
        <view class="banner">
            <u-swiper
                class="banner-swiper"
                :list="bannerList" 
                :title="false"
                height="300"
                mode="round"
                indicator-pos="bottomCenter"
                :effect3d="false"
                autoplay
                interval="3000"
                :circular="true"
                duration="500" 
                bg-color=""
            />
        </view>

        <!-- 指标 -->
        <view class="configure u-flex">
            <view
                v-for="(item, index) in infoList"
                :key="index"
                class="u-flex-1 item divider-x"
            >
                <view class="title">
                    {{ item.value || '-' }}
                </view>
                <view class="name">
                    {{ item.name }}
                </view>
            </view>
        </view>
    </view>
</template>

<script>
const app = getApp();

import { getUserProfile } from '../../../util'
export default {
    name: "DetailHead",
    components: {},
    props: {
        carInfo: {
            type: Object,
            default() {
                return { carSubscribeRespVO : {monthPayment: 0}};
            },
        },
        bannerList: {
            type: Array,
            default () {
                return [];
            }
        },
        carDetailData: {
            type: Object,
            default () {
                return {};
            }
        },
        showMonthPayment: {
          type: Boolean,
          default: true
        },
        showLike: {
          type: Boolean,
          default: true
        },
        monthPayment: {
            type: Number,
            default () {
                return 0;
            }
        }
    },
		watch:{
			// carDetailData:'getName'
		},
		computed:{
			formatNum :function (){
				let num = this.carDetailData.guidancePrice
				if (num != undefined) {
				    // const numStr = (num / 10000).toFixed(2);
				    let tnumStr = (num / 10000).toFixed(3);
				    const numStr = tnumStr.substring(0, tnumStr.length - 1)
				    return `${numStr}万`;
				}
				
			},
			getValName:function() {
				return (val, field, unit) => {
					
				
					if (field === "horsepower") {
					    return val;
					} else if (field === "discharge") {
					  return val ? val + unit : val
					    // const list = this.conditionData[field] || this.conditionData[`${field}Range`] || [];
					    // return (list.find(item => {
					    //     const valArr = item.tagValue.split("-");
					    //     if (parseInt(valArr[0]) <= val && val < parseInt(valArr[1])) {
					    //         return true;
					    //     }
					    // }) || {}).tagName;
					} else {
					    const list = this.conditionData[field] || [];
							
					    return (list.find(item => String(item.tagValue) === String(val)) || {}).tagName;
					}
					}
				
			    
			},
			
		},
    data() {
        return {
            userInfo: null,
            custom: app.globalData.custom,
						// L, T, Kw
            infoList: [
                { name: "燃料形式", val: "-", field: "powerMode",value:'-' },
                { name: "", val: "-", field: "discharge",value:'-', unit:'' },
                { name: "驱动方式", val: "-", field: "drive",value:'-' },
                { name: "马力(Ps)", val: "-", field: "horsepower",value:'-' },
            ],
            conditionData: {
                powerMode: [],
                discharge: [],
                drive: [],
            },
            
        };
    },
    onLoad() {
      uni.showLoading({
        title: '加载中'
      });
      
    },
    created() {
			this.init();
    },
    mounted() {
        uni.showLoading({
          title: '加载中'
        });
        getApp().globalData.getUserInfo((data) => {
            this.userInfo = data;
            uni.hideLoading()
        })
        
    },
    methods: {
        init() {
          this.getCarTypeConditionData();
        },
        async handleLike() {
            uni.vibrateShort({})
            if(!this.userInfo) {
                getUserProfile(`/pages/home/profile/index?id=${this.carDetailData.id}`, () => {
                    this.$u.route("/pages/sign/sign");
                });
            } else {
                const res = await this.$getRequest(this.$url.likeProduct, 'POST', {
                    carTypeYearProductId: this.carDetailData.id,
                    userId: this.userInfo.id,
                })
                if(res.code != 0) {
                    return false;
                } else {
                  this.carInfo.isLike = res.data.likeStatus 
                }
                uni.showToast({
                    title: res.data.likeStatus == 1 ? '已收藏' : '已取消',
                    duration: 2000
                });

                setTimeout(() => {
                    this.$emit('clickInit')
                }, 1000)
                
            }

        },
        async getCarTypeConditionData () {
            uni.showLoading({
              title: '加载中'
            });
            const conditionData = await this.$getRequest(this.$url.getCarTypeCondition, "POST", {});
            this.conditionData = conditionData.data;
      //       let newList = this.infoList.map(item => {
						// 	item.value = ''
						// })
						
						// this.infoList = newList
						setTimeout(() => {
							let newList = this.infoList.map(item => {
								let unit = ''
								if (item.field === 'discharge') {
									if (this.carDetailData.powerMode == 3) {
										unit = 'Kw'
										item.name = 'Kw'
									} else {
										item.name = '排量'
									}
								}
								
								item.value = this.getValName(this.carDetailData[item.field], item.field, unit)
								return item
							})
							this.infoList = newList
						},200)
            uni.hideLoading()
        },
    }
};
</script>

<style lang="scss">
    .detail-head {
        .banner-swiper {
            .u-indicator-item-round {
                width: 32rpx!important;
                height: 8rpx;
            }
        }
    }
</style>
<style lang="scss" scoped>
    .detail-head {
        // background: linear-gradient(
        //     180deg,
        //     rgba(75, 100, 241, 0.16) 36.24%,
        //     rgba(255, 255, 255, 0.16) 100%
        // );
        background: linear-gradient(180deg, rgba(10, 15, 45, 0.16) 36.24%, rgba(255, 255, 255, 0.16) 100%);
        padding-top: 16rpx;
        // .logo {
        //     width: 84rpx * $double;
        //     height: 16rpx * $double;
        //     margin-left: 40rpx;
        //     margin-top: 26rpx;
        // }
        .m-serfee-title-txt {
          font-weight: normal;
          line-height: 22px;
          color: #000000;
        }
        .m-serfee-val-txt {
          font-weight: 600;
          line-height: 22px;
          color: #F5194B;

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
		margin-left: 46rpx;
		width: 215rpx;
		white-space: pre;
		.name {
			color: #ffffff;
			padding-right: 18rpx;
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
        .car-info {
            padding: 0 46rpx;
            padding-bottom: 10rpx;
            .brand {
                .brand-t {
                    font-size: 44rpx;
                    color: #0a0f2d;
                    font-weight: 600;
                }
              
            }
            .car-info-icon {
                margin-right: -30rpx;
				display: flex;
                .btu-share {
                    display: inline-block;
                    line-height: 40rpx;
                    height: 35rpx;
                }
                .icon {
                    display: inline-block;
                    vertical-align: middle;
                    margin: 0 20rpx;
                }
            }
        }

        .configure {
            background: #ffffff;
            box-shadow: 0px -4px 32px rgba(10, 15, 45, 0.02),
                0px 4px 24px rgba(10, 15, 45, 0.04);
            border-radius: 24rpx;
            margin: 0 32rpx;
            padding: 16rpx 0;
            text-align: center;
            color: rgba(10, 15, 45, 0.8);
            margin-top: 30rpx;
            .item {
                .title {
                    font-size: 24rpx;
                    margin-bottom: 4rpx;
                    font-weight: 500;
                }
                .name {
                    font-size: 24rpx;
                    color: rgba(10, 15, 45, 0.5);
                }
            }
        }
    }
</style>