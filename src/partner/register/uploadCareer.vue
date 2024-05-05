<template>
	<view class="wrap">
		<StepList :currentStep="currentStep" class="step" />
		
		<view class="category-wrap">
			<view class="left">
				<scroll-view
					scroll-y="true" 
					class="scroll"
				>
					<view 
						v-for="(item, index) in CAREER_LIST" 
						:key="index" 
						class="category" 
						:class="{'active-name': index === nameIndex}"
						@click="changeName(item, index)"
					>
						<view class="category-name">{{item.label}}</view>
						<view class="line" v-if="index === nameIndex"></view>
					</view>
				</scroll-view>
			</view>
			<view class="right">
				<scroll-view
					scroll-y="true" 
					class="scroll"
				>
					<view class="list">
						<view 
							v-for="tag in category"
							:key="tag.value"
							class="tag"
							:class="{active: tag.value === activeTag.value}"
							@click="handleChange(tag)"
						>
							{{ tag.label }}
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		
		<view class="fixed-buttom-disabled-btn">
			<button :disabled="disabled" @click="next">下一步</button>
		</view>
	</view>
</template>

<script>
import { CAREER_LIST, applyPartnerStepList } from '@/constants'
import StepList from './components/StepList.vue'

export default {
	components: {
		StepList,
	},
	
	data() {
		return {
			CAREER_LIST,
			userId: null,
			upUserId: '',
			activeTag: {},
			category: [],
			nameIndex: 0,
			applyPartnerStepList,
			currentStep: 0,
		}
	},
	
	computed: {
		disabled() {
			let res = true
			
			if (this.activeTag.value) {
				res = false
			}
			
			return res
		},
	},
	
	onLoad(options) {
		this.userId = options.userId
		this.upUserId = options.upUserId || ''
		this.category = CAREER_LIST[0].category
	},
	
	onUnload() {
		
	},
	
	onReady() {
		
	},
	
	methods: {
		changeName(item, index) {
			this.nameIndex = index
			this.category = item.category
		},
		
		handleChange(tag) {
			this.activeTag = tag
		},
		
		next() {
			uni.navigateTo({
				url: `/partner/register/uploadCompanyInfo?userId=${this.userId}&upUserId=${this.upUserId}&career=${this.activeTag.label}`
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	width: 100vw;
	height: 100vh;
	padding: 40rpx 0 80rpx;
	display: flex;
	flex-direction: column;
	.step {
		margin: 0 32rpx;
	}
	.category-wrap {
		width: 100%;
		height: 0;
		flex: 1;
		display: flex;
		.left {
			padding-top: 40rpx;
			width: 200rpx;
			height: 100%;
			border-right: 1rpx solid rgba(216, 216, 216, 0.4);
		}
		.right {
			width: 0;
			flex: 1;
			height: 100%;
		}
		.scroll {
			width: 100%;
			height: 100%;
		}
	}
	.category-name {
		margin-bottom: 60rpx;
		padding-left: 56rpx;
		color: #3D3D3D;
		font-size: 28rpx;
		height: 44rpx;
		line-height: 44rpx;
	}
	.active-name {
		position: relative;
		.category-name {
			color: #00E878;
		}
		.line {
			position: absolute;
			left: 0rpx;
			top: 50%;
			z-index: 100;
			width: 4rpx;
			height: 24rpx;
			border-radius: 4rpx;
			background: #00E878;
			transform: translateY(-50%);
		}
	}
	.list {
		width: 100%;
		padding: 40rpx 40rpx 0;
		.tag {
			margin-bottom: 24rpx;
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 72rpx;
			color: rgba(10, 15, 45, 0.8);
			font-size: 24rpx;
			background: rgba(10, 15, 45, 0.04);
			border-radius: 8rpx;
			font-weight: 500;
		}
		.active {
			border: 2rpx solid #22EC82;
			background: #DAFFEC;
		}
	}
	.fixed-buttom-disabled-btn {
		margin-top: 40rpx;
		width: 100%;
		position: unset;
	}
}
</style>