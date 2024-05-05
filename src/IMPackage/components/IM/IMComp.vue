<template>
	<view class="">
	</view>
</template>

<script>
import TIM from 'tim-wx-sdk'
import TIMUploadPlugin from 'tim-upload-plugin'
import COS from 'cos-wx-sdk-v5'
import { genTestUserSig } from '@/debug/GenerateTestUserSig'

const app = getApp()

export default {
	props: {
		userId: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			conversationList: [],
		}
	},
	
	onReady() {
		this.init()
	},
	
	methods: {
		init() {
			const userID = this.userId
			//const userID = 'service'
			const SDKAppID = genTestUserSig(userID).sdkAppID
			uni.setStorageSync(`TIM_${SDKAppID}_isTUIKit`, true)
			uni.$TUIKit = TIM.create({
				SDKAppID,
			})
			uni.$TUIKit.registerPlugin({
				'cos-wx-sdk': COS,
				'tim-upload-plugin': TIMUploadPlugin,
			})
			wx.$TIM = uni.$TUIKit
			uni.$TUIKitTIM = TIM
			uni.$TUIKitEvent = TIM.EVENT
			uni.$TUIKitVersion = TIM.VERSION
			uni.$TUIKitTypes = TIM.TYPES // 监听系统级事件
			uni.$resetLoginData = this.resetLoginData()
			uni.$TUIKit.on(uni.$TUIKitEvent.SDK_READY, this.onSDKReady)
			uni.$TUIKit.on(uni.$TUIKitEvent.SDK_NOT_READY, this.onSdkNotReady)
			uni.$TUIKit.on(uni.$TUIKitEvent.KICKED_OUT, this.onKickedOut)
			uni.$TUIKit.on(uni.$TUIKitEvent.ERROR, this.onTIMError)
			uni.$TUIKit.on(uni.$TUIKitEvent.NET_STATE_CHANGE, this.onNetStateChange)
			uni.$TUIKit.on(uni.$TUIKitEvent.SDK_RELOAD, this.onSDKReload)
			
			const userSig = genTestUserSig(userID).userSig
			
			if (app.globalData.userInfo) {
				app.globalData.userInfo.userSig = userSig
				app.globalData.userInfo.userID = userID
			}
			
			uni.$TUIKit.login({
				userID: userID,
				userSig: userSig
			}).then(res => {
				console.log('tim success', res)
			}).catch((error) => {
				console.log('tim fail', err)
			})
		},
		
		getConversationList() {
			uni.$TUIKit.getConversationList().then(imResponse => {
				console.log('getConversationList1234567:', imResponse)
				this.conversationList = imResponse.data.conversationList
				this.handleRoute('service')
			})
		},
		
		handleRoute(id) {
			const url = `/IMPackage/TUI-Chat/chat?conversationID=C2C${id}`;
			//const url = '/IMPackage/TUI-Conversation/conversation/conversation'
			uni.navigateTo({
				url
			});
		},
		
		resetLoginData() {
			app.globalData.expiresIn = ''
			app.globalData.sessionID = ''
			app.globalData.userProfile = null
			if (app.globalData.userInfo) {
				app.globalData.userInfo.userSig = ''
				app.globalData.userInfo.token = ''
			}
		},
		onTIMError() {},
		onSDKReady({name}) {
			  const isSDKReady = name === uni.$TUIKitEvent.SDK_READY ? true : false
				uni.$emit('isSDKReady', {
					isSDKReady: true
				})
				// this.handleRoute('44')
				this.handleRoute('service')
				//this.getConversationList()
		},
		onNetStateChange() {},
		onSDKReload() {},
		onSdkNotReady() {},
		onKickedOut() {
			uni.showToast({
				title: '您被踢下线',
				icon: 'error'
			})
			
			this.$u.route({
				type: 'navigateBack',
				delta: 1
			})
			
			// uni.navigateTo({
			// 	url: './pages/TUI-Login/login'
			// })
		}
	}
}
</script>

<style lang="scss" scoped>

</style>