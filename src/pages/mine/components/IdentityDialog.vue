<template>
	<u-popup border-radius="14" mode="center" v-model="show" @close="close">
		<view class="wrap">
			<view class="title">签约方式</view>
			<view class="item" @click="goIdentityPage(5)">
				<view class="left">
					<view class="img">
						<image style="width:100%;height:100%;" src="https://image.51cheyaoshi.com/xcx/app/static/carlife/person_icon.png"></image>
					</view>
					<view class="text">个人用户签约</view>
				</view>
				<u-icon name="arrow-right" color="rgba(0, 0, 0, 0.9)" size="28"></u-icon>
			</view>
			
			<view class="item" @click="goIdentityPage(6)">
				<view class="left">
					<view class="img">
						<image style="width:100%;height:100%;" src="https://image.51cheyaoshi.com/xcx/app/static/carlife/company_icon.png"></image>
					</view>
					<view class="text">企业用户签约</view>
				</view>
				<u-icon name="arrow-right" color="rgba(0, 0, 0, 0.9)" size="28"></u-icon>
			</view>
		</view>
	</u-popup>
</template>

<script>
export default {
	props: {
		show: {
			type: Boolean,
			required: true,
		},
		
		identityDialogParams: {
			type: Object,
			required: true,
		},
	},
	
	methods: {
		close() {
			this.$emit('update:show', false)
		},
		
		// index 5.个人 6.企业
		// riskAuditStatus 5. 个人已签约 6.企业已签约
		goIdentityPage(index) {
			if (index === 5) {
				if (this.identityDialogParams.riskAuditStatus == 5 || this.identityDialogParams.riskAuditStatus == 6) {
					this.$emit('identity', index)
				} else {
					uni.navigateTo({
						url: '/pagesOrder/identity/person-identity?type=5'
					})
				}
			} else {
				if (this.identityDialogParams.riskAuditStatus == 6) {
					this.$emit('identity', index)
				} else {
					uni.navigateTo({
						url: '/pagesOrder/identity/company-identity'
					})
				}
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	padding: 32px 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	.title {
		margin-bottom: 24px;
		height: 24px;
		font-size: 17px;
		line-height: 24px;
		color: rgba(0, 0, 0, 0.9);
	}
	.item {
		margin-bottom: 20px;
		padding: 20px 32rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 540rpx;
		border-radius: 8rpx;
		background: rgba(10, 15, 45, 0.02);
		.left {
			display: flex;
			align-items: center;
			.img {
				width: 110rpx;
				height: 110rpx;
				border-radius: 50%;
				overflow: hidden;
			}
			.text {
				padding-left: 20rpx;
				font-size: 16px;
				color: #333333;
			}
		}
	}
}
</style>