<template>
	<view class="wrap">
		<view class="header">
			<view class="input-wrap">
				<view class="input-title">备用联系人关系</view>
				<view class="right" @click="openRelationList">
					<view v-if="emergencyContactRelation">{{emergencyContactRelation}}</view>
					<view class="placeholder" v-else>请选择备用联系人关系</view>
					<u-icon
						name="arrow-right" 
						color="rgba(10, 15, 45, 0.3)" 
						size="28"
					></u-icon>
				</view>
			</view>
			
			<view class="input-wrap">
				<view class="input-title">备用联系人姓名</view>
				<u-input 
					v-model="emergencyContactName"
					placeholder="请输入备用联系人姓名"
					input-align="right"
				/>
			</view>
			
			<view class="input-wrap">
				<view class="input-title">备用联系人联系方式</view>
				<u-input 
					type="number"
					v-model="emergencyContactPhone"
					placeholder="请输入备用联系人联系方式"
					input-align="right"
				/>
			</view>
		</view>
		
		<view class="footer">
			 <button :disabled="disabled" @click="handleSubmit">添加备用联系人</button>
		</view>
		
		<u-action-sheet :list="relationList" v-model="showRelationList" :cancel-btn="true" @click="confirmRelation"></u-action-sheet>
		
	</view>
</template>

<script>
export default {
	data() {
		return {
			emergencyContactRelation: '',
			emergencyContactName: '',
			emergencyContactPhone: '',
			orderId: null,
			showRelationList: false,
			// 父母、配偶、子女、兄弟姐妹、同事、朋友
			relationList: [
				{value: 0, text: '父母'},
				{value: 1, text: '配偶'},
				{value: 2, text: '子女'},
				{value: 3, text: '兄弟姐妹'},
				{value: 4, text: '同事'},
				{value: 5, text: '朋友'},
			],
		}
	},
	
	onLoad(options) {
		this.orderId = options.orderId
	},
	
	computed: {
		disabled() {
			if (this.emergencyContactRelation && this.emergencyContactName && this.emergencyContactPhone) {
				return false
			}
			
			return true
		}
	},
	
	methods: {
		openRelationList() {
			this.showRelationList = true
		},
		
		confirmRelation(index) {
			this.emergencyContactRelation = this.relationList[index].text
		},
		
		async handleSubmit() {
			const params = {
				id: this.orderId,
				emergencyContactRelation: this.emergencyContactRelation,
				emergencyContactName: this.emergencyContactName,
				emergencyContactPhone: this.emergencyContactPhone,
			}
			
			const contactResult = await this.$getRequest(this.$url.updateUserSubscribeEmergencyContact, 'GET', params)
			if(contactResult.code == 0){
				uni.reLaunch({
					url: `/pagesOrder/order-detail/order-detail?orderId=${this.orderId}`
				})
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.wrap {
	padding: 40px 40rpx;
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	
	.input-wrap {
		height: 108rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.input-title {
			padding-right: 20rpx;
			font-size: 15px;
			color: #0A0F2D;
		}
		u-input {
			flex: 1;
		}
	}
	
	
	button {
		margin-top: 12px;
		width: 100%;
		height: 118rpx;
		border-radius: 16rpx;
		background: #0A0F2D;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 17px;
		color: #FFFFFF;
	}
	
	button::after {
		border: none;
	}
	
	button[aria-disabled="true"] {
		background: rgba(10, 15, 45, 0.3);
	}
}

.right {
		display: flex;
		align-items: center;
		font-size: 30rpx;
		color: #0A0F2D;
	}
	
	.arrow {
		margin-left: 8rpx;
		width: 14rpx;
	}
	
	.placeholder {
		color: rgba(10, 15, 45, 0.3);
	}
</style>