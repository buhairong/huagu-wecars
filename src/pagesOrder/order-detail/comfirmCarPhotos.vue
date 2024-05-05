<template>
	<view class="page">
		<view class="photo_wrap">
			<view class="left">
				<view
					v-for="item in photoType"
					:key="item.id"
					class="photo-type"
					:class="{'active-photo-type': item.id === selectPhotoType}"
					@click="changePhotoType(item.id)"
				>
					{{item.text}}
				</view>
			</view>
			<view class="right">
				<view class="imgs" v-if="imgList[selectPhotoType] && imgList[selectPhotoType].carPics">
					<view
						class="img-wrap"
						v-for="(item, index) in imgList[selectPhotoType].carPics"
						:key="item.id"
					>
						<view class="img-box">
							<image
								class="car-img"
								:src="item.url"
								mode="widthFix"
								@click="preview(item)"
							/>
						</view>
						<view class="remark-wrap">
							<view class="remark">
								{{item.remark}}
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="bottom">
			<u-checkbox v-model="checked" :label-size="24" :size="28">勾选代表您已阅读并同意<text style="color:#197EF5;" @click.stop="openPopup">《用车规则确认书（电子交接单）》</text></u-checkbox>
			<button :disabled="!checked" @click="handlerSubmit">确认</button>
		</view>
		
		<u-popup 
			class="popup"
			v-model="showPopup"
			border-radius="24" 
			mode="bottom" 
			height="924rpx" 
			:close-icon-size="40"
			:safe-area-inset-bottom="true"
			:closeable="true"
			close-icon-color="rgba(10, 15, 45, 0.8)"
		>
			<view class="popup-wrap">
				<view class="title">用车规则确认书（电子交接单）</view>
				<view class="sub-title">请仔细阅读以下协议：</view>
				<view class="container"></view>
				<view class="btn"></view>
			</view>
		</u-popup>
		
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderId: '',
			// 0 左前45度，1 车辆正前，2 右前45度，3 车辆正侧，4 左后45度，5 车辆正后，6 右后45度，7 车辆内饰，8 其他细节
			photoType: [
				{id: 0, text: '左前45度'},
				{id: 1, text: '车辆正前'},
				{id: 2, text: '右前45度'},
				{id: 3, text: '车辆正侧'},
				{id: 4, text: '左后45度'},
				{id: 5, text: '车辆正后'},
				{id: 6, text: '右后45度'},
				{id: 7, text: '车辆内饰'},
				{id: 8, text: '其他细节'},
			],
			selectPhotoType: 0,
			imgList: [],
			checked: false,
			showPopup: false,
		}
	},
	
	onLoad(options) {
		this.orderId = options.orderId
		
		this.selectCarPicsList()
	},
	
	methods: {
		async selectCarPicsList(){
			const params = {
				 id: this.orderId,
			}
			const result = await this.$getRequest(this.$url.selectCarPicsList, 'GET', params)
			if(result.code == 0){
				this.imgList = result.data
			}
		},
		
		changePhotoType(index) {
			this.selectPhotoType = index
		},
		
		preview(item) {
			const title = this.photoType.find(photo => photo.id == this.selectPhotoType).text
			uni.navigateTo({
				url: `/pagesOrder/order-detail/carPhotoDetail?url=${item.url}&remark=${item.remark}&title=${title}`
			})
		},
		
		async handlerSubmit() {
			// const params = {
			// 	 id: this.orderId,
			// 	 status: 6,
			// }
			// const result = await this.$getRequest(this.$url.updateUserSubscribeStatus, 'GET', params)
			// if(result.code == 0){
			// 	uni.reLaunch({
			// 		url: `/pagesOrder/order-detail/order-detail?orderId=${this.orderId}`
			// 	})
			// }
			
			uni.reLaunch({
				url: `/pagesOrder/order-detail/contact?orderId=${this.orderId}`
			})
		},
		
		openPopup() {
			//this.showPopup = true
		},
	},
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";	

::v-deep .u-checkbox .u-checkbox__label {
	margin-right: 0;
}

.page {
	width: 100vw;
	padding: 16px 0 40px;
	
	.photo_wrap {
		width: 100vw;
		display: flex;
		.left {
			width: 200rpx;
			background: #F7F8FA;
			padding-bottom: 42px;
			.photo-type {
				width: 100%;
				height: 120rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 14px;
				color: #86909C;
				&.active-photo-type {
					background: #fff;
					font-weight: 500;
					color: #1D2129;
					position: relative;
					&:before {
						content: '';
						position: absolute;
						top: 0;
						left: 0;
						width: 8rpx;
						height: 100%;
						background: #0AEB7D;
						border-radius: 0 8rpx 8rpx 0;
					}
				}
			}
		}
		.right {
			flex: 1;
			.imgs {
				flex: 1;
				padding: 28px 32rpx 0;
				display: flex;
				flex-wrap: wrap;
			}
			.img-wrap {
				width: 232rpx;
				height: 226rpx;
				margin-right: 20rpx;
				margin-bottom: 24px;
				overflow: hidden;
				&:nth-of-type(2n) {
					margin-right: 0;
				}
				.img-box {
					width: 100%;
					height: 174rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					overflow: hidden;
					border-radius: 8rpx;
					position: relative;
					.car-img {
						width: 100%;
					}
				}
			}
			
			.remark-wrap {
				width: 100%;
				margin-top: 8px;
				.remark {
					width: 100%;
					height: 36rpx;
					font-size: 12px;
					line-height: 36rpx;
					color: rgba(10, 15, 45, 0.8);
					@include text-overflow;
				}
			}
		}
	}
	
	.bottom {
		margin-top: 8px;
		padding: 0 32rpx;
		width: 100vw;
		button {
			margin-top: 8px;
			width: 100%;
			height: 116rpx;
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
}

.popup {
	::v-deep .u-close {
		margin-top: 8px;
	}
}

.popup-wrap {
	padding: 22px 40rpx 20px;
	position: relative;
	.sub-title {
		margin-top: 20px;
		height: 42rpx;
		font-size: 14px;
		line-height: 42rpx;
		color: rgba(0, 0, 0, 0.9);
	}
	.container {
		font-size: 14px;
		line-height: 34rpx;
		color: rgba(10, 15, 45, 0.8);
	}
}
</style>