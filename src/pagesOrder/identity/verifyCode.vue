<template>
  <view class="wrap">
		<view class="title">输入验证码</view>
		<view class="sub-title">验证码已发送至 {{ mobile }}</view>
    <view class="mobile-box u-flex u-row-between">
      <view class="mobile-box-warp">
        <u-message-input
          class="mobile-box-item"
          mode="box"
          width="130"
          :focus="true"
          @finish="finishCode"
        />
        <!-- :breathe="true" -->
      </view>
    </view>
    <view class="sub-title sub-title1">
      <view
        v-if="isSms"
        class="send-code"
        @click="handleSend"
      >
        重新获取
      </view>
      <view v-else>
				重新获取 {{sms}}s
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "VerifyCode",
  data() {
    return {
			type: null, // 5.个人 6.企业
      mobile: '',
      isSms: true,
      sms: 60,
			codeMobile:'',
			openid:"",
			token:""
    }
  },
  onLoad(option) {
		console.log("options",option)
		this.mobile = option.mobile
		this.type = option.type
		let title = '身份认证'
		
		if (option.type == 6) {
			title = '企业实际用车人'
		}
		
		uni.setNavigationBarTitle({
		  title
		})
		
		this.getOpenId()
		this.handleSend()
  },
	
	
	
  methods: {
		getOpenId() {
			uni.login({
			    provider: 'weixin',
			    success: (loginRes) => {
			      console.log('loginRes', loginRes)
			        this.$getRequest(this.$url.getOpenId, 'POST', {
			            code: loginRes.code,
			        }).then((res) => {
			            this.openid = res.data.openid
									this.token = res.data.session_key
			        })
			    }
			})
		},
    finishCode(e) {
			const params = {
				mobile: this.mobile,
				openId: this.openid,
				identifyingCode: e,
			}
			this.$getRequest(this.$url.updateUserMobile, 'POST', params ).then((data) => {
				if(data.code == 0) {
					uni.reLaunch({
						url: `./identity?type=${this.type}`
					})
				}else{
					this.isSms = true;
					this.sms = 60;
					clearInterval(this.timer);
					uni.showToast({
						title: data.msg,
						duration: 2000,
						icon: 'none'
					})
				}
			})
    },
		
    async handleSend() {
			this.isSms=false
			this.timer = setInterval(() => {
			  if (--this.sms <= 0) {
				this.sms = 60
				this.isSms = true
				clearInterval(this.timer);
			  }
			}, 1000);
      uni.vibrateShort({})
      uni.showLoading({
          title: '正在发送'
      })
			
      const data = await this.$getRequest(this.$url.getIdentifyingCode, 'POST', {
        mobile: this.mobile
      })
      uni.hideLoading()
      
      if(data.code != 0) {
        uni.showToast({
          title: '验证码获取失败，请重试',
					icon:"none",
          duration: 1500
        })
      } else {
        uni.showToast({
          title: '验证码已发送',
					icon:"none",
          duration: 1500
        })
      }
    },
  },
};
</script>

<style lang="scss">
  .vcodePage {
    .u-char-flex {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      position: relative;
      justify-content: space-between !important;
    }
  }
</style>
<style lang="scss" scoped>
.mobile-box {
	margin-top: 50rpx;
	
	.send-code {
		color: rgba(10, 15, 45, 0.3);
		font-size: 28rpx;
	}
	.mobile-box-value {
		color: #0A0F2D;
	}
}
.mobile-box-warp {
	width: 100%;
}
.mobile-box ::v-deep .u-char-box {
		width: 100%;
}
.mobile-box ::v-deep .u-box {
	width: 100%;
	background: rgba(10, 15, 45, 0.04);
	border: none;
	border-radius: 16rpx;
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
	.sub-title1 {
		margin-top: 40px;
	}
} 
</style>
