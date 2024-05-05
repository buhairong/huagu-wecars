<template>
	<u-popup
		v-model="show"
		mode="bottom"
		border-radius="12"
	>
		<view class="wrap">
			<u-image
				src="https://image.51cheyaoshi.com/xcx/app/static/home/logo_3.png"
				width="282rpx"
				mode="widthFix"
			>
				<u-loading slot="loading" />
			</u-image>
			<u-button
					class="btn"
			    :ripple="true"
			    open-type="getPhoneNumber"
			    @getphonenumber="handleLogin"
			>
				微信一键授权
			</u-button>
		</view>
	</u-popup>
</template>

<script>
export default {
	props: {
		partnerId: {
			type: String,
			required: true
		}
	},
	data () {
		return {
			show: true
		}
	},
	methods: {
		handleLogin(e) {
			const {errMsg, encryptedData, iv} = e.detail
			if (errMsg === 'getPhoneNumber:ok') {
				uni.login({
					provider: 'weixin',
					onlyAuthorize: true,
					success: (loginRes) => {
							console.log(loginRes)
							this.$getRequest(this.$url.getOpenId, 'POST', {
									code: loginRes.code,
							}).then( async (res) => {
									uni.setStorageSync('openId', res.data.openid);
									const data = await this.$getRequest(this.$url.decryptData, 'POST', {
									    encryptedData,
									    iv,
									    sessionKey: res.data.session_key
									})
									
									getApp().globalData.getMemberInfo(data.data.phoneNumber, '', '', (userinfo) => {
											uni.setStorageSync('userInfo', {
													phoneNumber: data.data.phoneNumber,
									        name: userinfo.name,
									        avatarUrl: userinfo.imageUrl,
													partnerId: this.partnerId
									    })
									}, this.partnerId)
							})
					}
				})
			}
			
			this.$emit('handlerClick')
		}
	}
}
</script>

<style lang="scss" scoped>
.wrap {
	padding: 35px 80rpx 70px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	.btn {
		margin-top: 35px;
		width: 100%;
		::v-deep button {
			width: 100%;
			height: 40px;
			border-radius: 4px;
			background: #0A0F2D;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 17px;
			font-weight: 500;
			color: #FFFFFF;
		}
	}
}
</style>