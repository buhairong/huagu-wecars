<!--
 * @LastEditors: luchun
-->
<template>
    <view class="about-page">
        <img
            class="logo"
            src="https://image.51cheyaoshi.com/xcx/app/static/logo.png"
            alt=""
        >
        <!-- <view class="slogan">
            让有车生活·更简单
        </view> -->
        <view class="text">
            上海画毂汽车科技有限公司成立于2019年9月，总部位于上海。旗下「车要试」品牌（英文名WECARS®）致力于为用户打造出「更经济、更灵活、更便捷」的全新汽车消费体验，以“让有车生活·更简单”为使命，以“成为中国领先的一站式汽车消费平台”为愿景。
        </view>
        <view class="text">
            在全新的经济环境下，我们专注于打造人、车、生活为一体的汽车新消费解决方案，倡导“汽车订阅”的新消费理念，是汽车消费习惯由“所有权”向“使用权”转变的践行者和引领者。
        </view>
        <view class="text">
            依托于「车要试」强大的产品创新能力、高效的互联网技术能力以及高价值的资源整合能力，在为消费者带来全新消费体验的同时，也希望能为汽车产业相关合作伙伴减本增效的同时，技术赋能、资源赋能，大家共同迎接汽车消费领域全新的市场机遇。
        </view>
    </view>
</template>
<script>
export default {
    name: 'AboutWECARS',
    data() {
        return {
        }
    }
}
</script>
<style lang="scss" scoped>
.about-page {
    position: absolute;
    top: 10%;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    padding: 0 100rpx;
    text-align: center;
    .logo {
        width: 360rpx;
        height: 120rpx;
    }
    .slogan {
        margin-top: 40rpx;
        font-size: 30rpx;
        line-height: 48rpx;
        letter-spacing: 16rpx;
        color: rgba(10, 15, 45, 0.5);
    }
    .text {
      text-indent: 24px;
        margin-top: 52rpx;
        font-size: 28rpx;
        line-height: 44rpx;
        color: rgba(10, 15, 45, 0.8);
        text-align: left;
    }
}
</style>
