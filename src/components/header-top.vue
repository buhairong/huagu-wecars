<!--
 * @Author: your name
 * @Date: 2021-11-19 21:43:03
 * @LastEditTime: 2022-01-09 20:50:37
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /fe-wecars/src/components/header.vue
-->
<template>
    <view
        class="header"
        :class="type == 1 ? 'trans-header': ''"
    > 
        <view
            class="status-bar"
            :style="{ height: custom.top + 'px' }"
        />
        <view class="nav-custom">
            <u-row
                align="center"
                justify="space-between"
            >
               <!-- <u-col span="4" v-if="showLoc">
                    <view
                        class="m-left-head-view"
                        @click="showPicker"
                    >
                        <text class="m-top-txt">
                            {{ locCity.city + ' ' }}
                        </text>
                        <u-icon name="arrow-down" />
                    </view>
                </u-col> -->
                <u-col span="8">
                    <view class="m-logo-view">
                        <image
                            v-if="type == 0"
                            class="logo"
                            src="https://image.51cheyaoshi.com/xcx/app/static/logo.svg"
                        />
                        <image
                            v-else
                            class="logo"
                            src="https://image.51cheyaoshi.com/xcx/WECARS_logo.png"
                        />
                    </view>
                </u-col>
            </u-row>
        </view>
    <!-- <u-picker mode="selector" v-model="showCityPicker"  :default-selector="[0]" :range="openCityList"/> -->
    </view>
</template>
<script>
const app = getApp();
export default {
    name: 'HeaderTop',
    props: {
        type: {
            type: Number,
            default: 0
        },
        showLoc: {
            type: Boolean,
            default: false
        },
        locCity: {
            type: Object,
            default: () => {
                return {}
            }
        },
    },
    data() {
        return {
            custom: app.globalData.custom,
        }
    },
    onLoad() {
    },
    methods:{
        showPicker() {
            this.$emit('changeCity')
        }
    }
}
</script>
<style lang="scss" scoped>
    .header {
        background: #fff;
        // margin-left: -32rpx;
        // margin-right: -32rpx;
        // padding-left: 32rpx;
        // padding-right: 32rpx;
        padding-bottom: 30rpx;
    }
    .trans-header {
        background: none;
    }
    .nav-custom {
			height: 88rpx;
			padding-top: 30rpx;
    }
    .logo {
        width: 86rpx * $double;
        height: 18rpx * $double;
        margin-left: 0rpx;
        margin-top: -15rpx;
    }
    .m-top-txt {
      font-weight: 500;
      font-size: 34rpx;
      line-height: 48rpx;
      color: #000000;
    }
    .m-logo-view {
      position: absolute;
      left: 37%;
    }
    .m-left-head-view {
      margin-top: -15rpx;
      padding-left: 32rpx;
    }
</style>