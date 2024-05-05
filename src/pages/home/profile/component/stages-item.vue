<!--
 * @Author: your name
 * @Date: 2021-11-12 23:21:25
 * @LastEditTime: 2022-01-12 15:54:07
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /fe-wc/src/pages/profile/index.vue
-->

<template>
    <view>
        <view class="card">
            <view class="car-mode-info u-border-bottom">
                <u-image
                    class="car-brand-logo"
                    width="88rpx"
                    height="88rpx"
                    src="https://image.51cheyaoshi.com/xcx/app/static/brand.png"
                />
                <view class="mode-info-head">
                    <view class="u-flex u-row-between">
                        <view class="mode-info-brand u-flex-2">
                            {{ `${carDetailData.carBrand} ${carDetailData.carType} ${carDetailData.carTypeYearProduct}` }}
                        </view>
                        <view class="u-flex-2 price-base u-text-right">
                            <text>{{ loanInfoVO.monthPayment | $numToSeparator("") }}</text>
                            /月
                        </view>
                    </view>
                    <view class="mode-info-p u-flex">
                        <view class="u-flex-1 ">
                            <view>{{ carDetailData.guidancePrice | $transformNum }}</view>
                            <view>指导价</view>
                        </view>
                        <view class="u-flex-1 ">
                            <view>{{ carDetailData.purchaseTax | $transformNum }}</view>
                            <view>购置税</view>
                        </view>
                        <view class="u-flex-1 " />
                    </view>
                </view>
            </view>

            <!-- 贷款比例 -->
            <u-section
                title="设置首付比例"
                :right="false"
                line-color="#0AEB7D"
            />
            <view class="stages-p">
                贷款金额：{{ loanInfoVO.loan | $transformNum }}
            </view>
            <view class="slider">
                <!-- 滑动条 -->
                <u-slider
                    v-model="curStep"
                    :step="stepUnit"
                    min="0"
                    max="100"
                    block-width="20"
                    active-color="#ebecee"
                    inactive-color="#ebecee"
                    :use-slot="true"
                >
                    <view class="badge-slider">
                        <view class="badge-price">
                            {{ loanInfoVO.loan | $numToSeparator("") }}
                        </view>
                        <view class="badge-button" />
                    </view>
                </u-slider>
                <!-- 比例范围 -->
                <view class="percent u-flex u-row-between">
                    <text
                        v-for="(item, index) in rateSeveral + 1"
                        :key="item"
                        class="item"
                    >
                        {{ index * 10 + carHirePurchaseVO.minFirstPaymentRate }}%
                    </text>
                </view>
            </view>
           
            <!-- 分期期数 -->
            <view class="stages">
                <u-section
                    title="分期期数"
                    :right="false"
                    line-color="#0AEB7D"
                />
                <view
                    class="stages-p"
                >
                    车辆押金：{{ carHirePurchaseVO.deposit | $numToSeparator("元") }}
                </view>
                <view class="stages-number">
                    <u-row gutter="16">
                        <u-col
                            v-for="(item, index) in loanInfoVO.monthPaymentArray"
                            :key="index"
                            span="4"
                        >
                            <view
                                class="item"
                                :class="loanInfoVO.month == item.month ? 'active' : ''"
                                @click="changeMonth(item, index)"
                            >
                                <view class="icon">
                                    <u-icon
                                        name="checkbox-mark"
                                        color="#fff"
                                        size="16"
                                    />
                                </view>
                                <view class="item-num">
                                    {{ item.month }}期
                                </view>
                                <view class="item-m">
                                    月供{{ item.monthPayment | $numToSeparator("元") }}
                                </view>
                            </view>
                        </u-col>
                    </u-row>
                </view>
            </view>
        </view>
        <view class="card">
            <view class="process">
                <view class="process-t">
                    「一成首付」产品流程
                </view>
                <view class="process-list">
                    <view class="process-list-t">
                        <text />1.定制产品
                    </view>
                    <text class="process-list-text">
                        在线支付合约订金，24小时内专属客户经理为您提供1对1订车服务
                    </text>
                </view>
                <view class="process-list">
                    <view class="process-list-t">
                        <text />2.认证资质
                    </view>
                    <text class="process-list-text">
                        客户经理协助您上传签约用户身份信息，认证通过即可签约
                    </text>
                </view>
                <view class="process-list">
                    <view class="process-list-t">
                        <text />3.签约付款
                    </view>
                    <text class="process-list-text">
                        您签订合约并按照合同约定的付款方式及金额支付相关费用后，我们按所签合约为您定制采购车辆
                    </text>
                </view>
                <view class="process-list">
                    <view class="process-list-t">
                        <text />4.交付车辆
                    </view>
                    <text class="process-list-text">
                        30天内我们完成车辆采购、落地（购置税、上牌、保险）流程，与您预约交车时间，完成车辆交付（准新车可直接提车）
                    </text>
                </view>
            </view>
        </view>
        <u-gap
            height="190"
            margin-top="50"
            bg-color="#FFFFFF"
        />
        <view
            class="foot-but foot-sticky u-flex u-row-between"
            @click="handlePay"
        >
            <view class="foot-but-l">
                订金：￥<text class="price">
                    {{ carDetailData.deposit }}
                </text>
            </view>
            <view class="foot-but-r">
                立即下单
                <text class="icon-r" />
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: "StagesItem",
    props: {
        carHirePurchaseVO: {
            type: Object,
            default: () => {
                return {
                    deposit: '',
                };
            }
        },
        carDetailData: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    data() {
        return {
            curStep: 0,
            loanInfoVO: {
                firstPaymentRate: 0,
                firstPayment: 0,
                loan: 0,
                monthPayment: 0,
                monthPaymentArray: [],
                periodRate: 0,
                total: 0,
                supportMonth: ""
            }
        };
    },
    computed: {
        rateSeveral() {
            if (this.carHirePurchaseVO) {
                return (this.carHirePurchaseVO.maxFirstPaymentRate - this.carHirePurchaseVO.minFirstPaymentRate) / 10;
            } else {
                return 10;
            }
        },
        stepUnit () {
            return 100 / this.rateSeveral;
        }
    },
    onLoad() {},
    watch: {
        carHirePurchaseVO () {
            this.loanInfoVO = this.carHirePurchaseVO.loanInfoVO;
        },
        curStep (newVal, oldVal) {
            this.changeFirstPaymentRate(newVal);
        }
    },
    methods: {
        handlePay() {
            this.$emit('click')
        },
        // 切换首付比
        changeFirstPaymentRate (step) {
            this.loanInfoVO.firstPaymentRate = step / this.stepUnit * 10 + this.carHirePurchaseVO.minFirstPaymentRate;
            this.getMonthLoanInfo();
        },
        // 切换分期数
        changeMonth(item, index) {
            this.loanInfoVO.month = item.month;
            this.loanInfoVO.monthPayment = item.monthPayment;
        },
        // 计算月供
        async getMonthLoanInfo () {
            const loanInfoVO = await this.$getRequest(this.$url.mathLoanInfo, "POST", {
                firstPaymentRate: this.loanInfoVO.firstPaymentRate,
                periodRate: this.loanInfoVO.periodRate,
                total: this.loanInfoVO.total,
                supportMonth: this.loanInfoVO.supportMonth,
                month: this.loanInfoVO.month
            });

            this.loanInfoVO = loanInfoVO.data;
        }
    }
};
</script>

<style lang="scss" scoped>
.card {
    margin: 0 32rpx;
    margin-top: 24rpx;
    background: #ffffff;
    box-shadow: 0px -2px 32px rgba(10, 15, 45, 0.02),
        0px 8px 24px rgba(10, 15, 45, 0.06);
    border-radius: 24rpx;
    padding: 36rpx 32rpx;
    .car-mode-info {
        position: relative;
        margin-bottom: 32rpx;
        padding-bottom: 32rpx;
        .car-brand-logo {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 1;
            width: 88rpx;
            height: 88rpx;
            display: inline-block;
        }
        .mode-info-head {
            margin-left: 112rpx;
            .mode-info-brand {
                font-size: 30rpx;
                font-weight: 500;
            }
            .mode-info-p {
                margin-top: 40rpx;
                .divider-x {
                    &:after {
                        right: 60rpx;
                    }
                }
            }
        }
    }
    .car-des {
        .car-des-t {
            position: relative;
            color: rgba(10, 15, 45, 0.5);
            font-size: 24rpx;
            margin: 8rpx 0;
            text {
                position: absolute;
                left: 145rpx;
                top: 0;
                z-index: 1;
            }
        }
    }
    .stages-p {
            font-size: 24rpx;
            color: rgba(10, 15, 45, 0.5);
            margin: 10rpx 0;
            padding-left: 20rpx;
        }
    .stages {
        
        .stages-number {
            margin: 10rpx 0;
            .item {
                background: #FFFFFF;
                border: 1px solid rgba(10, 15, 45, 0.3);
                box-sizing: border-box;
                border-radius: 8rpx;
                text-align: center;
                margin: 12rpx 0;
                padding: 10rpx 0;
                position: relative;
                .item-num {
                    font-size: 28rpx;
                    color: rgba(10, 15, 45, 0.8);
                    font-weight: 500;
                }
                .item-m {
                    font-size: 24rpx;
                    color: rgba(10, 15, 45, 0.5);
                }
                .icon {
                    background: #0A0F2D;
                    border-radius: 0px 4rpx;
                    width: 20rpx;
                    height: 20rpx;
                    line-height: 12rpx;
                    position: absolute;
                    top: 0;
                    right: 0;
                    z-index: 1;
                    text-align: center;
                    display: none;
                }
            }
            .active {
                box-sizing: border-box;
                border: 1px solid #0A0F2D;
                .icon {
                    display: block;
                }
            }
        }
    }
    .slider {
        padding: 0 34rpx;
        padding-top: 120rpx;
        padding-bottom: 60rpx;
        .percent {
            margin: 25rpx -16rpx 0rpx;
            .item {
                // width: 60rpx;
                font-size: 20rpx;
                color: rgba(10, 15, 45, 0.5);
            }
        }

        .badge-slider {
            position: relative;
            margin-top: -60rpx;
            margin-right: -44rpx;
            .badge-price {
                width: 140rpx;
                height: 66rpx;
                line-height: 60rpx;
                background: url('https://image.51cheyaoshi.com/xcx/app/static/slider1.png') no-repeat;
                background-size: 100%;
                font-weight: 500;
                font-size: 28rpx;
                color: #fff;
                text-align: center;
                margin-bottom: 6rpx;
                margin-left: -48rpx;
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
.process {
    .process-t {
        font-size: 30rpx;
        color: #0a0f2d;
        font-weight: 500;
        margin-top: 10rpx;
        text-align: center;
    }
    .process-list {
        margin-top: 40rpx;
        .process-list-t {
            font-size: 28rpx;
            margin-bottom: 8rpx;
            text {
                width: 24rpx;
                height: 23rpx;
                background: url("https://image.51cheyaoshi.com/xcx/app/static/icon4.png") no-repeat;
                background-size: 100%;
                display: inline-block;
                margin-right: 8rpx;
            }
        }
        .process-list-text {
            color: #666666;
            font-size: 24rpx;
            display: inline-block;
            margin-left: 40rpx;
            line-height: 40rpx;
        }
    }
    
}
</style>
