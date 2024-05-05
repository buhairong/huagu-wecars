<template>
	<view class="step-wrap">
		<u-steps 
			:list="stepList" 
			:current="currentStep"
			un-active-color="#86909C"
			active-color="#1D2129"
		></u-steps>
	</view>
</template>

<script>
export default {
	props: {
		currentStep: {
			type: Number,
			required: true,
		},
	},
	
	data(){
		return {
			stepList: [
				{ name: '职业信息' },
				{ name: '工作信息' },
				{ name: '个人信息' },
			],
		}
	},
	
	methods: {
		
	}
}
</script>

<style lang="scss" scoped>
.step-wrap {
	padding-bottom: 40rpx;
	border-bottom: 1rpx solid rgba(216, 216, 216, 0.4);
}
</style>