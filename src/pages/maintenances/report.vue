<template>
    <view class="report">
        <view>当前里程</view>
        <view class="mileage-str">
            {{ carInfo.mileageStr || '' }}
            <view
                class="mileage-icon"
                @click="isUpdateMileage = true"
            >
                <u-image
                    width="100%"
                    height="100%"
                    src="https://image.51cheyaoshi.com/xcx/app/static/update_icon.png"
                >
                    <u-loading slot="loading" />
                </u-image>
            </view>
        </view>
        <view
            v-if="report.urgentList.length >= 1"
            class="card"
        >
            <view class="report-t report-t-red">
                <text>{{ report.urgentList.length }}</text>项急需处理
            </view>
            <view
                v-for="(item, index) in report.urgentList"
                :key="index"
                class="u-padding-bottom-24"
            >
                <view class="u-padding-left-30 u-padding-right-30">
                    <view class="report-index">
                        {{ index + 1 }}.{{ item.title }}<text class="report-index-content">
                            ({{ item.content }})
                        </text>
                    </view>
                    <view class="u-flex">
                        <text class="color-rgba">
                            更换
                        </text><view class="u-flex-1 u-padding-left-20 u-padding-right-20">
                            <u-line-progress
                                :percent="item.rate * 100"
                                :active-color="item.color"
                            >
                                <text class="u-percentage-slot">
                                    {{ item.rate * 100 }}%
                                </text>
                            </u-line-progress>
                        </view>
                        <text class="color-rgba">
                            健康
                        </text>
                    </view>
                </view>
            </view>
        </view>
        <view
            v-if="report.carefulList.length >= 1"
            class="card"
        >
            <view class="report-t">
                <text>{{ report.carefulList.length }}</text>项需观察
            </view>
            <view
                v-for="(item, index) in report.carefulList"
                :key="index"
                class="u-padding-bottom-24"
            >
                <view class="u-padding-left-30 u-padding-right-30">
                    <view class="report-index">
                        {{ index + 1 }}.{{ item.title }}<text class="report-index-content">
                            ({{ item.content }})
                        </text>
                    </view>
                    <view class="u-flex">
                        <text class="color-rgba">
                            更换
                        </text><view class="u-flex-1 u-padding-left-20 u-padding-right-20">
                            <u-line-progress
                                :percent="item.rate * 100"
                                :active-color="item.color"
                            >
                                <text class="u-percentage-slot">
                                    {{ item.rate * 100 }}%
                                </text>
                            </u-line-progress>
                        </view>
                        <text class="color-rgba">
                            健康
                        </text>
                    </view>
                </view>
            </view>
        </view>
        <view
            v-if="report.normalList.length >= 1"
            class="card"
        >
            <view class="report-t">
                <text>{{ report.normalList.length }}</text>项无需处理
            </view>
            <view
                v-for="(item, index) in report.normalList"
                :key="index"
                class="u-padding-bottom-24"
            >
                <view class="u-padding-left-30 u-padding-right-30">
                    <view class="report-index">
                        {{ index + 1 }}.{{ item.title }}<text class="report-index-content">
                            ({{ item.content }})
                        </text>
                    </view>
                    <view class="u-flex">
                        <text class="color-rgba">
                            更换
                        </text><view class="u-flex-1 u-padding-left-20 u-padding-right-20">
                            <view class="u-rela">
                                <u-line-progress
                                    :percent="item.rate * 100"
                                    :active-color="item.color"
                                >
                                    <!-- <text class="u-percentage-slot" />
                                    <view
                                        class="u-percentage-toast"
                                        :style="{background: item.color}"
                                    >
                                        {{ item.content }}
                                    </view> -->
                                </u-line-progress>
                            </view>
                        </view>
                        <text class="color-rgba">
                            健康
                        </text>
                    </view>
                </view>
            </view>
        </view>
        <!-- <u-popup
            v-model="isUpdateMileage"
            mode="center"
            border-radius="14"
        >
            <view>
                请输入里程数
            </view>
        </u-popup> -->
        <u-modal
            v-model="isUpdateMileage"
            title="请输入里程数"
            :show-cancel-button="true"
            confirm-color="#08BD64"
            @confirm="handleUpdateMileage"
        >
            <view class="slot-content u-padding-30">
                <u-input
                    v-model="mileage"
                    :type="number"
                    placeholder="请输入里程数"
                    :border="true"
                />
            </view>
        </u-modal>
    </view>
</template>
<script>
export default {
    data() {
        return {
            id: 1,
            carInfo: null,
            report: null,
            isUpdateMileage: false,
            mileage: ''
        }
    },
    onLoad() {
        this.init();
    },
    methods: {
        async init() {
            const [carInfo, report] = await Promise.all([await this.$getRequest(this.$url.getMyCarInfo, 'POST', {
                userCarId: this.id
            }), await this.$getRequest(this.$url.getUserCarReport, 'POST', {
                userCarId: this.id
            })])

            
            this.carInfo = carInfo.data;
            this.report = report.data;
        },
        async handleUpdateMileage() {
            if(this.mileage == '') {
                uni.showToast({
                    title: '请输入里程数',
                    duration: 2000
                });
                return false;
            }
            uni.showLoading({
                title: '加载中'
            });
            const res =  await this.$getRequest(this.$url.updateCarMileage, 'POST', {
                mileage: this.mileage,
                userCarId: this.id
            })
            uni.hideLoading();
            
            if(res.code != 0) {
                return false;
            }
            uni.showToast({
                title: '里程数已更改',
                duration: 2000,
                icon: 'success'
            });
            this.init();
            uni.vibrateShort({})
        }
    }
}
</script>
<style lang="scss" scoped>
    .report {
        padding: 0 32rpx;
        padding-top: 60rpx;
        .card {
            background: #FFFFFF;
            box-shadow: 0px -2px 32px rgba(10, 15, 45, 0.02), 0px 8px 24px rgba(10, 15, 45, 0.06);
            border-radius: 24rpx;
            margin-top: 24rpx;
            padding: 32rpx;
        }
        .report-t {
            font-weight: 500;
            font-size: 34rpx;
            padding-bottom: 20rpx;
            text {
                font-size: 72rpx;
                display: inline-block;
                padding-right: 10rpx;
            }
        }
        .report-t-red {
            text {
                color: #F5194B;
            }
        }
        .report-index {
            font-weight: 500;
            font-size: 28rpx;
            padding-bottom: 24rpx;
        }
        .u-percentage-toast {
            position: absolute;
            top: -40rpx;
            padding: 6rpx 10rpx;
        }
        .report-index-content {
            color: rgba(10, 15, 45, 0.5);
            font-size: 24rpx;
            display: inline-block;
            padding-left: 10rpx;
        }
        .mileage-str {
            font-size: 56rpx;
        }
        .mileage-icon {
            width: 50rpx;
            height: 50rpx;
            display: inline-block;
            vertical-align: middle;
            margin-top: -28rpx;
            margin-left: 10rpx;
        }
      
    }

</style>