<template>
	<view class="wrap">
		<IdCardIdentity
			:type="5"
			:userId="userId"
			@nextIdentityStep="nextIdentityStep"
		/>
	</view>
</template>

<script>
import IdCardIdentity from './components/IdCardIdentity.vue'

export default {
	components: {
		IdCardIdentity,
	},
	
	data() {
		return {
			userId: '',
			idNum: '',
			username: '',
		}
	},
	
	onLoad(options) {
		this.userId = options.userId
	},
	
	methods: {
		nextIdentityStep(data) {
			uni.navigateTo({
				url: `/partner/register/uploadCompanyInfo?idNum=${data.idNum}&username=${data.username}`
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	padding: 80rpx 40rpx 200rpx;
}
</style>