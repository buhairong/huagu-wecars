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
		stepList: {
			type: Array,
			required: true,
		},
		
		currentStep: {
			type: Number,
			required: true,
		},
	},
	
	data(){
		return {
			
		}
	},
	
	methods: {
		
	}
}
</script>

<style lang="scss" scoped>
.step-wrap {
	padding-bottom: 40rpx;
	border-bottom: 2rpx solid rgba(216, 216, 216, 0.4);
}
</style>