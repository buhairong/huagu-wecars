<!--
import { async } from 'q';
 * @Author: your name
 * @Date: 2021-11-18 19:38:11
 * @LastEditTime: 2022-01-14 14:01:53
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /new-superev-wechat/src/pages/mine/identity/list.vue
-->

<template>
  <view class="wrap">
      <view class="title">{{subTitle}}</view>
      <view class="sub-title">车要试出行会严格保障您的信息安全</view>
      <view class="section-title">
          <u-section
              title="请上传清晰、无反光、无遮挡的证件照片"
              :right="false"
              line-color="#0A0F2D"
          />
      </view>
      <view class="u-flex">
          <view
              class="identity-card u-flex-1 u-margin-right-20"
              @click="handleUploadFace(0)"
          >
              <template v-if="tempFilePathsFace">
                  <u-image
                      width="100%"
                      height="100%"
                      :src="tempFilePathsFace"
                  />
              </template>
              <template v-else>
                  <u-image
                      width="100%"
                      height="100%"
                      src="https://image.51cheyaoshi.com/xcx/app/static/home/717.png"
                  />
              </template>
          </view>
          <view
              class="identity-card  u-flex-1 u-margin-left-20"
              @click="handleUploadFace(1)"
          >
              <template v-if="tempFilePathsBack">
                  <u-image
                      width="100%"
                      height="100%"
                      :src="tempFilePathsBack"
                  />
              </template>
              <template v-else>
                  <u-image
                      width="100%"
                      height="100%"
                      src="https://image.51cheyaoshi.com/xcx/app/static/home/718.png"
                  />
              </template>
          </view>
      </view>
      <view class="section-title">
          <u-section
              title="请确认身份信息"
              :right="false"
              line-color="#0A0F2D"
          />
      </view>
      <view>
          <view class="identity-box  u-flex u-row-between u-padding-left-30 u-padding-right-30 u-padding-top-20 u-padding-bottom-20 ">
              <view>姓名</view>
              <view class="u-text-right">
                  <u-input
                      v-model="form.name"
                      type="text"
                      :custom-style="{
                          textAlign: 'right'
                      }"
                      placeholder="请输入姓名"
                      :disabled="readOnly"
                  />
              </view>
          </view>
          <view class="identity-box  u-flex u-row-between u-padding-left-30 u-padding-right-30 u-padding-top-20 u-padding-bottom-20 ">
              <view>身份证号</view>
              <view class="u-text-right">
                  <u-input
                      v-model="form.card"
                      type="idcard"
                      :custom-style="{
                          textAlign: 'right'
                      }"
                      placeholder="请输入身份证号"
                      :disabled="readOnly"
                  />
              </view>
          </view>
          <view class="identity-box  u-flex u-row-between u-padding-left-30 u-padding-right-30 u-padding-top-25 u-padding-bottom-25 ">
              <view>有效期</view>
              <u-checkbox
                  :key="index"
                  v-model="isForever"
                  :disabled="readOnly"
                  @change="checkboxChange"
              >
                  永久有效
              </u-checkbox>
              <view
                  v-if="!isForever"
                  class="u-text-right"
                  @click="popPicker"
              >
                  <!-- <u-input
                      v-model="form.endTime"
                      type="text"
                      :custom-style="{
                          textAlign: 'right'
                      }"
                      placeholder="请选择有效期"
                  /> -->
                  <u-picker
                      v-model="showDatePicker"
                      confirm-color="#0A0F2D"
                      mode="time"
                      :disabled="readOnly"
                      :default-selector="defaultSelector"
                      @confirm="handleTime"
                  />
                  <text :class="form.endTime ? '' : 'placeholderSty'">
                      {{ form.endTime || '请选择有效期' }}
                  </text>
              </view>
          </view>
      </view>

   <!--   <view v-if="!readOnly">
          <view class="u-flex">
            <view>
              <u-checkbox
                  v-model="checked"
                  size="28"
                  label-size="28"
                  icon-size="22"
              >
                <view class="placeOrderInfo-address-text">我已阅读并同意</view>
              </u-checkbox>
            </view>
            <view @click="showUserProtocol" class="aPro">《用户隐私保密协议》</view>
          </view>
      </view> -->
      <u-gap
          height="260"
          bg-color="#FFFFFF"
      />
	  <!-- v-if="!readOnly" -->
      <view class="foot-but u-flex-1 but but-bg ">
          <view
              class="foot-but-r u-text-center"
              @click="handleSubmit"
          >
              <!-- 立即认证 -->
			  下一步
          </view>
      </view>
      <!-- modal -->
<!--      <u-modal v-model="tipShow"  @confirm="confirmModal" ref="uModal" :title-style="{color: 'transparent'}" title=" " confirm-color="#576B95">
        <view class="slot-content" style="height: 150px;">
          <view class="u-text-center u-padding-top-50">
            <view class="u-text-center"><icon :type="tipType" size="50"/></view>
            <view class="u-text-center u-padding-top-40"><text class="m-tip-txt">请重新上传身份证</text></view>
          </view>
        </view>
      </u-modal> -->
	  
	  <u-modal
	  	v-model="tipShow" 
	  	:title="title" 
	  	:content='content' 
	  	:mask-close-able="true"
	  	:confirm-text='confirmText'
	  	@confirm='confirmModal'
	  ></u-modal>
  </view>
</template>
<script>
// saveIDCardLicenseFile
import dayjs from 'dayjs';
import { statusName } from '@/constants'
export default {
    name: 'IdentityCard',
    data() {
			return {
				type: null, // 5.个人 6.企业
				subTitle: '',
				isDetail:false,//认证弹窗
				content:'请重新上传身份证',
				title:'',
				closeOnClickOverlay:false,
				confirmText:'确定',
				tipShow: false,
				tipType: '',
				tipDesc: '',
				auditStatus: '',
				userInfo: {},
				tempFilePathsFace: '',
				tempFilePathsBack: '',
				saveFaceInfo: null,
				saveBackInfo: null,
				checked: false,
				isForever: false,
				showDatePicker: false,
				defaultSelector: [0],
				params: {
						year: true,
						month: true,
						day: true,
						hour: false,
						minute: false,
						second: false
				},
				form: {
						name: '',
						card: '',
						endTime: '',
						start_date: '',
						sex: '',
						birth: '',
				},
				readOnly: false

			}
    },
    onLoad(option) {
        this.type = option.type
        let title = '身份认证'
				this.subTitle = '上传身份证'
        
        if (option.type == 6) {
        	title = '企业实际用车人'
					this.subTitle = '上传实际用车人身份证'
        }
        
        uni.setNavigationBarTitle({
          title
        })
				
				getApp().globalData.getUserInfo((data) => {
				    console.log('userInfo', data)
				    this.userInfo = data
				    this.getUserInfo(data.id)
				})
    },
    onShow() {
        
    },
    methods: {
      showUserProtocol () {
        this.$goHtml(this.userProtocolUrl, '')
      },
        
			handleSubmit() {
				const pageThis = this
				if(this.tempFilePathsFace=='') {
						uni.showToast({
								title: '请上传身份证正面',
								duration: 2000,
								icon: 'none'
						});
						return 
				}
				
				if(!this.tempFilePathsBack) {
						uni.showToast({
								title: '请上传身份证反面',
								duration: 2000,
								icon: 'none'
						});
						return 
				}
				
				if(!this.form.name) {
						uni.showToast({
								title: '请输入身份证姓名',
								duration: 2000,
								icon: 'none'
						});
						return 
				}
				
				if(!this.form.card) {
						uni.showToast({
								title: '请输入身份证号',
								duration: 2000,
								icon: 'none'
						});
						return 
				}
				
				if(!this.form.endTime) {
						if(!this.isForever) {
								uni.showToast({
										title: '请选择身份证有效期',
										duration: 2000,
										icon: 'none'
								});
								return 
						}
				}
			
				if(this.readOnly != true){
					if(this.saveBackInfo==null||this.saveFaceInfo==null){
						uni.showToast({
								title: '请重新上传身份证',
								duration: 2000,
								icon: 'none'
						});
						return
					}
					let userMess={
						name: this.form.name,
						userId: this.userInfo.id,
						idcard: this.form.card,
						idcardUrl: this.tempFilePathsFace,
						idcardBackUrl: this.tempFilePathsBack,
						idcardValidityTimeStart: this.form.start_date,
						idcardValidityTimeEnd: this.form.endTime,
						idcardBackOcrLogId: this.saveBackInfo.id,
						idcardOcrLogId: this.saveFaceInfo.id,
						sex: this.form.sex,
						birth: this.form.birth,
					}
					
					uni.setStorageSync("userMess",userMess)
				}
				this.$u.route(`/pages/mine/identity/driver?type=${this.type}`)
			},
       
			confirmModal() {
				this.tipShow = false
				return false
				// if(this.auditStatus == 1 || this.auditStatus == 3 || this.auditStatus == 5) {
				// 	this.$u.route({
				// 			type: 'navigateBack',
				// 			delta: 1,
				// 	})
				// } else {
				// 	return false
				// }
			},
			
			async handleSaveId() {
				if(!this.saveFaceInfo) {
						uni.showToast({
								title: '请上传身份证正面',
								duration: 2000,
								icon: 'none'
						});

						return false;
				}
				
				if(!this.saveBackInfo) {
						uni.showToast({
								title: '请上传身份证反面',
								duration: 2000,
								icon: 'none'
						});

						return false;
				}
			},

        // type   0： 前   1： 后
			handleUploadFace(type) {
				uni.vibrateShort();

				const self = this;
				uni.chooseImage({
				success: async (chooseImageRes) => {
						uni.showLoading({
								title: '上传中'
						});
						const tempFilePaths = chooseImageRes.tempFilePaths;
						const upload = await this.$getFileUpload(this.$url.upload, tempFilePaths)
						if(upload.code != 0) {
							this.tipShow=true
							this.content=uploadInfo.msg
							return false;
						}
						uni.hideLoading()

						if(type == 0) {
								this.tempFilePathsFace = upload.data.src;
								this.OCRCardImg({
										idcardImageUrl: upload.data.src
								}, 0);
						} else {
								this.tempFilePathsBack = upload.data.src;
								this.OCRCardImg({
										idcardBackImageUrl: upload.data.src
								}, 1);
						}

					}
				});
			},
			
			async OCRCardImg(params, type) {
				const uploadInfo =  await this.$getRequest(this.$url.ocrIdcard, 'POST', params)
			
				if(uploadInfo.code != 0) {
					this.tipShow=true
					this.content=uploadInfo.msg
					return false;
				}
            
				if (type === 0) {
					this.form.name = uploadInfo.data.resultJSON.name
					this.form.card = uploadInfo.data.resultJSON.num
					this.saveFaceInfo = uploadInfo.data
					this.form.sex = uploadInfo.data.resultJSON.sex
					this.form.birth = uploadInfo.data.resultJSON.birth
				} else {
					this.form.endTime = uploadInfo.data.resultJSON.end_date
					this.form.start_date = uploadInfo.data.resultJSON.start_date
					this.isForever = uploadInfo.data.resultJSON.is_fake
					this.saveBackInfo = uploadInfo.data
				}
			},
			
			handleTime(obj) {
					const {year, month, day} = obj
					this.form.endTime = `${year}-${month}-${day}`
			},
			
			popPicker() {
					if (!this.readOnly) {
							this.showDatePicker = true
					}
			},
			
			checkboxChange() {
					this.isForever = !this.isForever
					if(this.isForever) {
							this.form.endTime = ''
					}
			},
			
        // 获取用户身份证信息
			async getUserInfo(userId) {
				try {
					const userInfo = uni.getStorageSync('userMess')
					console.log('userInfo', userInfo)
					if (userInfo) {
						this.tempFilePathsFace = userInfo.idcardUrl
						this.tempFilePathsBack = userInfo.idcardBackUrl
						this.form.name = userInfo.name
						this.form.card = userInfo.idcard
						this.form.endTime = userInfo.idcardValidityTimeEnd
						this.form.sex = userInfo.sex
						this.form.birth = userInfo.birth
					}
				} catch (e) {
					// error
				}
				
			}
    }
}
</script>

<style lang="scss" scoped>
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
	height: 200rpx;
	line-height: 200rpx;
	text-align: center;
	margin-top: 27rpx;
}
.m-tip-txt {
	font-size: 34rpx;
	font-weight: 500;
}
.aPro {
	color: #2589FD;
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

.placeholderSty {
	color: #c0c4cc;
}


.wrap {
	padding: 40px 40rpx;
	.title {
		height: 36px;
		font-size: 28px;
		line-height: 36px;
		color: #0A0F2D;
	}
	.sub-title {
		margin-top: 4px;
		margin-bottom: 40px;
		height: 22px;
		font-size: 14px;
		line-height: 22px;
		color: rgba(10, 15, 45, 0.5);
	}
	.section-title {
		margin-top: 40px;
		margin-bottom: 12px;
	}
} 
</style>
