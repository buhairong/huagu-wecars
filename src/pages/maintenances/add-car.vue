<!--
import { async } from 'q';
 * @Author: your name
 * @Date: 2021-11-18 19:38:11
 * @LastEditTime: 2022-01-24 12:24:46
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /new-superev-wechat/src/pages/mine/identity/list.vue
-->

<template>
  <view class="identity">
    <view class="u-padding-top-36">
      <u-section
        title="请上传行驶证正本照片，系统将为您自动识别"
        :right="false"
        line-color="#0A0F2D"
      />
    </view>
    <view class="u-flex">
      <view class="identity-card u-flex-1" @click="handleUploadFace">
        <template v-if="form.imageUrl">
          <u-image
            width="100%"
            height="100%"
            :src="form.imageUrl"
          />
        </template>
        <template v-else>
          <u-image
            width="100%"
            height="100%"
            src="https://image.51cheyaoshi.com/xcx/app/static/add_car_1.jpeg"
          />
        </template>
      </view>
    </view>
    <view class="u-padding-top-56">
      <u-section
        title="请确认行驶证信息（可手动修改）"
        :right="false"
        line-color="#0A0F2D"
      />
    </view>
      <view class="u-padding-top-12">
        <view class="identity-box  u-flex u-row-between u-padding-left-30 u-padding-right-30 u-padding-top-20 u-padding-bottom-20 ">
          <view>车品牌</view>
          <view class="u-text-right">
            <u-input
              v-model="form.carType"
              @click="showSearch"
              type="text"
              :custom-style="{
                  textAlign: 'right'
              }"
              disabled
              placeholder="请选择车型"
            />
          </view>
        </view>
        <view
            class="identity-box u-flex u-row-between u-padding-left-30 u-padding-right-30 u-padding-top-20 u-padding-bottom-20 "
            @click="isCarKey = true"
        >
          <view>车牌号</view>
          <view
              class="u-text-right"
              @click="isCarKey = true"
          >
            <u-input
              v-model="form.carPlateNum"
              :disabled="true"
              type="idcard"
              :custom-style="{
                  textAlign: 'right'
              }"
              placeholder="请输入车牌号"
              @click="isCarKey = true"
            />
          </view>
        </view>
        <view class="identity-box  u-flex u-row-between u-padding-left-30 u-padding-right-30 u-padding-top-20 u-padding-bottom-20 ">
          <view>车架号</view>
          <view class="u-text-right">
            <u-input
              v-model="form.carVin"
              :custom-style="{
                  textAlign: 'right'
              }"
              placeholder="请输入车架号"
            />
          </view>
        </view>
        <view class="identity-box  u-flex u-row-between u-padding-left-30 u-padding-right-30 u-padding-top-20 u-padding-bottom-20 ">
          <view>发动机号</view>
          <view class="u-text-right">
            <u-input
                v-model="form.carEngineNum"
                type="text"
                :custom-style="{
                    textAlign: 'right'
                }"
                placeholder="请输入发动机号"
            />
          </view>
        </view>
        <view class="identity-box  u-flex u-row-between u-padding-left-30 u-padding-right-30 u-padding-top-20 u-padding-bottom-20 ">
          <view>行驶里程</view>
          <view class="u-text-right">
            <u-input
              v-model="form.mileage"
              type="idcard"
              :custom-style="{
                  textAlign: 'right'
              }"
              placeholder="请输入行驶里程"
            />
          </view>
        </view>
        <view class="identity-box  u-flex u-row-between u-padding-left-30 u-padding-right-30 u-padding-top-20 u-padding-bottom-20 ">
          <view>行驶证注册时间</view>
          <view class="u-text-right">
            <u-calendar v-model="showCalendar" mode="date" btn-type="success" active-bg-color="#19be6b" @change="changeDate"></u-calendar>
            <u-input
              v-model="form.registerDate"
              @click="showCalendarDate"
              type="text"
              :custom-style="{
                  textAlign: 'right'
              }"
              disabled
              placeholder="请选择行驶证注册时间"
            />
          </view>
        </view>
        <view class="u-font-24 color-rgba">
          车要试出行不会通过任何渠道泄露您的个人信息，所有信息仅作为车辆管理使用，请放心上传。
        </view>
      </view>
      <u-gap
        height="260"
        bg-color="#FFFFFF"
      />
      <view class="foot-but u-flex-1 but but-bg ">
        <view
          class="foot-but-r u-text-center"
          @click="handleSubmit"
        >
          提交信息
        </view>
      </view>
      <u-keyboard
        ref="uKeyboard"
        v-model="isCarKey"
        :tooltip="false"
        mode="car"
        :safe-area-inset-bottom="true"
        @change="valChangeCar"
        @backspace="backspace"
      />
      
      <!-- 车辆选择框 -->
      <u-popup v-model="showSelectCar" mode="right" width="80%">
        <view class="u-margin-30">
          <u-search :show-action="true" placeholder="输入品牌或车型快速检索" v-model="keyword" @search="searchCarType" @custom="searchCarType"></u-search>
          <view class="u-margin-20 card">
            <view
                v-for="(item, index) in searchList"
                :key="index"
                class="u-flex-1"
            >
              <view class="m-search-item u-font-14"  @click="clickSearchItem(item)">
                {{ item.carBrand }}{{ item.carType }}{{ item.carTypeYear }}{{ item.carTypeYearProduct }}
              </view>
            </view>
          </view>
        </view>
      </u-popup>
  </view>
</template>
<script>
// saveIDCardLicenseFile
import dayjs from 'dayjs';
import { statusName } from '@/constants'
export default {
    name: 'AddCar',
    data() {
      return {
        userInfo: {},
        tempFilePathsFace: '',
        saveFaceInfo: null,
        isCarKey: false,
        form: {
          carTypeYearProductId: '',
          registerDate: '',
          carType: '',
          carPlateNum: '',
          carVin: '',
          carEngineNum: '',
          mileage: '',
          imageUrl: '',
        },
        current: 0, // 预设当前项的值
        menuHeight: 0, // 左边菜单的高度
        menuItemHeight: 0, // 左边菜单item的高度
        leftList: [{ name: "品牌", id: 0, foods: [], k: 'brandList', param: 'brandList' }],
        carList: [],
        search: {
          limit: 9999,
          page: 1,
          carBrandId: '',
          cityId: ''
        },
        checkList: [],
        showSelectCar: false,
        keyword: '',
        searchList: [],
        showCalendar: false
      }
    },
    onLoad() {
    },
    onShow() {
        getApp().globalData.getUserInfo((data) => {
            console.log(data);
            this.userInfo = data;
        })
    },
    methods: {
      handleConfirmDay(day) {
        this.defaultSelector = day;
      },
      showSearch() {
        this.showSelectCar = true
      },
      async searchCarType() {
        console.log('searchCarType', this.keyword)
        if(this.keyword != '') {
          const result = await this.$getRequest(this.$url.searchCarTypeYearProductByName, 'POST', { searchStr: this.keyword })
          console.log(result)
          this.searchList = result.data
        }
      },
      clickSearchItem(item) {
        this.form.carTypeYearProductId = item.id
        this.form.carType = item.carBrand + item.carType + item.carTypeYear + item.carTypeYearProduct
        this.showSelectCar = false
      },
      changeDate(date) {
        this.form.registerDate = date.result + ' 00:00:00'
      },
      showCalendarDate() {
        this.showCalendar = true
      },
      // 车牌号
      valChangeCar(val) {
        uni.vibrateShort({})
        this.form.carPlateNum +=  val;
        uni.showToast({
            title: this.form.carPlateNum,
            duration: 1000,
            icon: 'none'
        });
      },
      // 退格键被点击
      backspace() {
        // 删除value的最后一个字符
        if(this.form.carPlateNum.length) this.form.carPlateNum = this.form.carPlateNum.substr(0, this.form.carPlateNum.length - 1);
      },
      toastMsg(msg) {
        uni.showToast({
            title: msg,
            duration: 2000,
            icon: 'none'
        });
      },
      async handleSubmit() {
        if(!this.form.imageUrl) {
          this.toastMsg('请上传行驶证')
          return false;
        }
        for (let i in this.form) {
          if(!this.form[i]) {
              this.toastMsg('请输入内容')
              return false;
          }
        }
        this.form.userId = this.userInfo.id
        uni.showLoading({
            title: '加载中'
        });
        const result = await this.$getRequest(this.$url.addCar, 'POST', this.form)
        
        if(result.code != 0) {
            return false;
        }
        uni.hideLoading()
        this.toastMsg('车辆创建成功')
        this.$u.route({
            type: 'navigateBack',
            delta: 1
        })
      },
      handleUploadFace() {
        uni.vibrateShort();
        const self = this;
        uni.chooseImage({
          success: async (chooseImageRes) => {
            uni.showLoading({
              title: '上传中'
            });
            const tempFilePaths = chooseImageRes.tempFilePaths;
            const upload = await this.$getFileUpload(this.$url.upload, tempFilePaths)

            console.log(upload)

            if(upload.code != 0) {
              uni.showToast({
                title: '识别失败，请重新上传',
                duration: 2000,
                icon: 'none'
              });
              return false;
            }
            this.form.imageUrl = upload.data.src;
            uni.hideLoading()
          }
        });
      },
      async OCRCardImg(params, type) {
        uni.showLoading({
          title: '上传成功，解析中'
        });
        const uploadInfo =  await this.$getRequest(this.$url.ocrIdcard, 'POST', params)
        uni.hideLoading()
      },

      handleTime(obj) {
        const {year, month, day} = obj
        this.form.endTime = `${year}-${month}-${day}`
      },
      // 获取用户身份证信息
      async getUserInfo(userId) {
        const userInfo =  await this.$getRequest(this.$url.userInfo, 'POST', {userId})
        console.log(userInfo, 'userInfo')
        if (userInfo.data) {
          this.tempFilePathsFace = userInfo.data.idcardUrl
          this.tempFilePathsBack = userInfo.data.idcardBackUrl
          this.form.name = userInfo.data.name
          this.form.card = userInfo.data.idcard
          this.form.endTime = dayjs(userInfo.data.idcardValidityTimeEnd).format('YYYYMMDD')
        }
      },
    }
}
</script>
<style lang="scss" scoped>
  .m-search-item {
    min-height: 60rpx;
    line-height: 60rpx;
    border-bottom: 1px solid lightgray;
  }
  .u-menu-wrap {
      position: relative;
      flex: 1;
      display: flex;
      overflow: hidden;
      height: 100vh;
      .right {
          width: 100%;
          .right-box {
              width: 100%;
              overflow: hidden;
              white-space: nowrap;
              height: 100%;
              position: absolute;
              left: 160rpx;
              top: 0;
              .page-view {
                  &:last-child {
                      padding-bottom: 700rpx;
                  }
              }
          }
      }
  }
  .class-item {
      margin-bottom: 30rpx;
      background-color: #fff;
      padding: 16rpx;
      border-radius: 8rpx;
  }
  .brand-list {
      width: 100%;
  }
  .brand-list-letter {
      font-size: 32rpx;
      color: rgba(10, 15, 45, 0.5);
      margin-top: 22rpx;
      margin-left: 35rpx;
      font-weight: 500;
      color: #0AEB7D;
  }
  .brand-list-name {
      font-size: 30rpx;
      color: rgba(10, 15, 45, 0.8);
      padding: 20rpx 0;
      margin-left: 10rpx;
      text {
          padding: 6rpx 20rpx;
          border: 2px solid #fff;
      }
  }
  .brand-active {
      text {
          border: 2px solid #0A0F2D;
          border-radius: 8rpx;
          
      }
  }
    .identity {
        padding: 0 40rpx;
        .identity-box {
            background: rgba(10, 15, 45, 0.04);
            border-radius: 16rpx;
            margin: 16rpx 0;
        }
        .identity-foot {
            margin-top: 130rpx;
            text-align: center;
            .but {
                margin-top: 44rpx;
            }
        }
 
        .identity-card {
            background: #FAFAFB;
            border-radius: 16rpx;
            height: 410rpx;
            line-height: 410rpx;
            text-align: center;
            margin-top: 27rpx;
        }
    }
    .foot-but {
        position: fixed;
        left: 40rpx;
        right: 40rpx;
        z-index: 1;
        margin: 0 auto;
        z-index: 111;
        bottom: 60rpx;
    }

</style>
