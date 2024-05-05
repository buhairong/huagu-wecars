
 <!--
 import { async } from 'q';
  * @Author: your name
  * @Date: 2021-11-18 19:38:11
  * @LastEditTime: 2022-01-14 14:01:53
  * @LastEditors: Please set LastEditors
  * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
  * @FilePath: /new-superev-wechat/src/pages/mine/identity/list.vue
 -->
 
 <template>
   <view class="wrap">
       <view class="title">{{subTitle}}</view>
       <view class="sub-title">车要试出行会严格保障您的信息安全</view>
       <view class="section-title">
           <u-section
               title="请上传清晰、无反光、无遮挡的证件照片"
               :right="false"
               line-color="#0A0F2D"
           />
       </view>
       <view class="u-flex">
           <view
               class="identity-card u-flex-1 u-margin-right-20"
               @click="handleUploadFace(0)"
           >
               <template v-if="driverLicenseUrl">
                   <u-image
                       width="100%"
                       height="100%"
                       :src="driverLicenseUrl"
                   />
               </template>
               <template v-else>
                   <u-image
                       width="100%"
                       height="100%"
                       src="https://image.51cheyaoshi.com/xcx/app/static/home/719.png"
                   />
               </template>
           </view>
           <view
               class="identity-card  u-flex-1 u-margin-left-20"
               @click="handleUploadFace(1)"
           >
               <template v-if="driverLicenseSecondSheetUrl">
                   <u-image
                       width="100%"
                       height="100%"
                       :src="driverLicenseSecondSheetUrl"
                   />
               </template>
               <template v-else>
                   <u-image
                       width="100%"
                       height="100%"
                       src="https://image.51cheyaoshi.com/xcx/app/static/home/720.png"
                   />
               </template>
           </view>
       </view>
       <view class="section-title">
           <u-section
               title="请确认驾驶证信息"
               :right="false"
               line-color="#0A0F2D"
           />
       </view>
       <view>
           <view class="identity-box  u-flex u-row-between u-padding-left-30 u-padding-right-30 u-padding-top-20 u-padding-bottom-20 ">
               <view>姓名</view>
               <view class="u-text-right">
                   <u-input
                       v-model="form.driverLicenseName"
                       type="text"
                       :custom-style="{
                           textAlign: 'right'
                       }"
                       placeholder="请输入姓名"
                       :disabled="readOnly"
                   />
               </view>
           </view>
           <view class="identity-box  u-flex u-row-between u-padding-left-30 u-padding-right-30 u-padding-top-20 u-padding-bottom-20 ">
               <view>证号</view>
               <view class="u-text-right">
                   <u-input
                       v-model="form.driverLicenseCardId"
                       type="idcard"
                       :custom-style="{
                           textAlign: 'right'
                       }"
                       placeholder="请输入证号"
                       :disabled="readOnly"
                   />
               </view>
           </view>
		   <view class="identity-box  u-flex u-row-between u-padding-left-30 u-padding-right-30 u-padding-top-20 u-padding-bottom-20 ">
		       <view>准驾车型</view>
		       <view class="u-text-right" style="flex:1;" @click="openCarTypeList">
						  <view class="" v-if="form.carType">
						  	{{form.carType}}
						  </view>
							<view class="placeholderSty" v-else>
								请选择准驾车型
							</view>
		       </view>
					 <u-select
					 	v-model="showCarTypeList" 
					 	:list="carTypeList"
						@confirm="confirmCarTypeList"
					 ></u-select>
		   </view>
		   <view class="identity-box  u-flex u-row-between u-padding-left-30 u-padding-right-30 u-padding-top-20 u-padding-bottom-20 ">
		       <view>档案编号</view>
		       <view class="u-text-right">
		           <u-input
		               v-model="form.recordNum"
		               type="idcard"
		               :custom-style="{
		                   textAlign: 'right'
		               }"
		               placeholder="请输入档案编号"
		               :disabled="readOnly"
		           />
		       </view>
		   </view>
           <view class="identity-box  u-flex u-row-between u-padding-left-30 u-padding-right-30 u-padding-top-25 u-padding-bottom-25 ">
               <view>有效期</view>
               <u-checkbox
                   :key="index"
                   v-model="isForever"
                   :disabled="readOnly"
                   @change="checkboxChange"
               >
                   长期有效
               </u-checkbox>
               <view
                   v-if="!isForever"
                   class="u-text-right"
                   @click="popPicker"
               >
                   <!-- <u-input
                       v-model="form.driverLicenseTimeEnd"
                       type="text"
                       :custom-style="{
                           textAlign: 'right'
                       }"
                       placeholder="请选择有效期"
                   /> -->
                   <u-picker
                       v-model="showDatePicker"
                       confirm-color="#0A0F2D"
                       mode="time"
                       :disabled="readOnly"
                       :default-selector="defaultSelector"
                       @confirm="handleTime"
                   />
                   <text :class="form.driverLicenseTimeEnd ? '' : 'placeholderSty'">
                       {{ form.driverLicenseTimeEnd || '请选择有效期' }}
                   </text>
               </view>
           </view>
       </view>
 
      <view v-if="!readOnly">
           <view class="u-flex">
             <view>
               <u-checkbox
                   v-model="checked"
                   size="28"
                   label-size="28"
                   icon-size="22"
               >
                 <view class="placeOrderInfo-address-text">我已阅读并同意</view>
               </u-checkbox>
             </view>
             <view @click="showUserProtocol" class="aPro">《用户隐私保密协议》</view>
           </view>
       </view>
       <u-gap
           height="260"
           bg-color="#FFFFFF"
       />
	   <!--  -->
       <view class="foot-but u-flex-1 but but-bg " v-if="!readOnly">
           <view
               class="foot-but-r u-text-center"
               @click="handleSubmit"
           >
               立即认证
           </view>
       </view>
       <!-- modal -->
       <u-modal v-model="tipShow"  @confirm="confirmModal" :confirm-text='confirmText' ref="uModal" :title-style="{color: 'transparent'}" title=" " confirm-color="#576B95">
         <view class="slot-content" style="height: 150px;">
           <view class="u-text-center u-padding-top-50">
             <view class="u-text-center"><icon :type="tipType" size="50"/></view>
             <view class="u-text-center u-padding-top-40"><text class="m-tip-txt">{{tipDesc}}</text></view>
           </view>
         </view>
       </u-modal>
	   <u-modal
			v-model="driverShow" 
			:title="title" 
			:content='content' 
			:mask-close-able="true"
			:confirm-text='confirmText'
			@confirm='confirmTextFn'
	   ></u-modal>
   </view>
 </template>
 <script>
 // saveIDCardLicenseFile
 // uni.setStorageSync("cityId",driverMess)
 import dayjs from 'dayjs';
 import { statusName } from '@/constants'
 export default {
		 name: 'DriverCard',
		 data() {
			return {
				 type: null, // 5.个人 6.企业
				 subTitle: '',
				 content:'请重新上传驾驶证',
				 title:'',
				 closeOnClickOverlay:false,
				 confirmText:'确定',
				 driverShow:false,
				 userProtocolUrl: 'https://www.51cheyaoshi.com/applet/protocol/privacy.pdf',
				 tipShow: false,
				 tipType: '',
				 tipDesc: '',
				 auditStatus: '',
				 userInfo: {},
				 driverLicenseUrl: '',//	驾照照片URL
				 driverLicenseSecondSheetUrl: '',//	驾驶证副页URL
				 saveFaceInfo: null,
				 saveBackInfo: null,
				 checked: false,
				 isForever: false,
				 showDatePicker: false,
				 defaultSelector: [0],
				 params: {
					 year: true,
					 month: true,
					 day: true,
					 hour: false,
					 minute: false,
					 second: false
				 },
				 form: {
					 driverLicenseName: '',//姓名
					 driverLicenseTimeEnd: '',//有效期
					 driverLicenseTimeStart: '',//驾照有效期开始日期
					 carType:'',//准驾车型
					 driverLicenseCardId:'',//驾驶证编号
					 recordNum:'',//驾驶证档案编号
					 saveFaceInfo:'',
					 driverLicenseUrl:'',
					 driverLicenseSecondSheetUrl:''
				 },
				 readOnly: false,
				 showCarTypeList: false,
				 carTypeList: [
						{
							value: 'A1',
							label: 'A1'
						},
						{
							value: 'A2',
							label: 'A2'
						},
						{
							value: 'A3',
							label: 'A3'
						},
						{
							value: 'B1',
							label: 'B1'
						},
						{
							value: 'B2',
							label: 'B2'
						},
						{
							value: 'C1',
							label: 'C1'
						},
						{
							value: 'C2',
							label: 'C2'
						},
				 ],
				 idNum: '',
				 username: '',
			}
		},
		onLoad(option) {
			this.type = option.type
			let title = '身份认证'
			this.subTitle = '上传驾驶证'
				 
			if (option.type == 6) {
				title = '企业实际用车人'
				this.subTitle = '上传实际用车人驾驶证'
			}
				 
			uni.setNavigationBarTitle({
				title
			})
     },
		 
		onShow() {
			getApp().globalData.getUserInfo((data) => {
				console.log('userInfo', data)
				this.userInfo = data
				this.getUserDriverInfo(data.id)
			})
		},
		
		methods: {
			showUserProtocol () {
				this.$goHtml(this.userProtocolUrl, '')
			},
			
			async handleSubmit() {
				const pageThis = this
				if(!this.driverLicenseUrl) {
					uni.showToast({
						title: '请上传驾驶证正面',
						duration: 2000,
						icon: 'none'
					})
					return false
				}
				
				if(!this.driverLicenseSecondSheetUrl) {
					uni.showToast({
						title: '请上传驾驶证反面',
						duration: 2000,
						icon: 'none'
					})
					return false
				}
				
				if(!this.form.driverLicenseName) {
					uni.showToast({
						title: '请输入驾驶证姓名',
						duration: 2000,
						icon: 'none'
					})
					return false
				}
				
				if(!this.form.driverLicenseCardId) {
					uni.showToast({
						title: '请输入证号',
						duration: 2000,
						icon: 'none'
					})
					return false
				}
				
				if(!this.form.carType) {
					uni.showToast({
						title: '请输入准架车型',
						duration: 2000,
						icon: 'none'
					})
					return false
				}
				
				if(!this.form.recordNum) {
					uni.showToast({
						title: '请输入档案编号',
						duration: 2000,
						icon: 'none'
					})
					return false;
				}
				
				if(!this.form.driverLicenseTimeEnd) {
					if(!this.isForever) {
						uni.showToast({
							title: '请选择驾驶证证有效期',
							duration: 2000,
							icon: 'none'
						})
					 return false
					}
				}
				
				if(!this.checked){
					uni.showToast({
						title: '请选择同意用户隐私保密协议',
						duration: 2000,
						icon: 'none'
					})
					return false;
				}
					 
				uni.showLoading({
					title: '认证中'
				})
					 
				let userMess=uni.getStorageSync("userMess")
				console.log('userMess', userMess)
				
				this.idNum = userMess.idcard
				this.username = userMess.name
				let mess={
							type: this.type,
							sex: userMess.sex,
							birthday: userMess.birth,
							userInfoEntity: {
								carType:this.form.carType ,//准驾车型
								// createIds: [],
								createdBy:"" ,//创建人
								createdTime:"" ,//	创建时间
								driverLicenseCardId:this.form.driverLicenseCardId ,//驾驶证编号
								driverLicenseName:this.form.driverLicenseName ,//驾驶证姓名
								driverLicenseSecondSheetUrl:this.driverLicenseSecondSheetUrl ,//驾驶证副页URL
								driverLicenseTimeEnd:this.form.driverLicenseTimeEnd ,//驾照有效期结束日期
								driverLicenseTimeStart:this.form.driverLicenseTimeStart ,//驾照有效期开始日期
								driverLicenseUrl:this.driverLicenseUrl ,//驾照照片URL
								// id: 0,
								idcard:userMess.idcard,//身份证号
								idcardBackOcrLogId: userMess.idcardBackOcrLogId,//身份证反面解析日志ID
								idcardBackUrl:userMess.idcardBackUrl,//身份证反面URL
								idcardOcrLogId: userMess.idcardOcrLogId,//	身份证正面解析日志ID
								idcardUrl:userMess.idcardUrl,//	身份证正面URL
								idcardValidityTimeEnd:userMess.idcardValidityTimeEnd,//身份证有效期结束日期
								idcardValidityTimeStart:userMess.idcardValidityTimeStart,//身份证有效期开始日期
								// limit: 0,
								name:userMess.name,//	姓名
								// operator:"" ,
								// page: 0,
								permanent: 0,//身份证是否永久有效，0不是，1是，当为永久有效时，不验证结束时间
								recordNum:this.form.recordNum ,//驾驶证档案编号
								updatedBy:"" ,//更新人
								updatedTime:"" ,//更新时间
								userId: userMess.userId,//用户ID
							}
				}
				
				
				
				if (this.type == 6) {
					const companyMess = uni.getStorageSync("companyMess")
					if (companyMess) {
						mess = {
							...mess,
							...companyMess,
						}
					}
					uni.setStorageSync("userinfoMess",mess)
					this.$u.route(`/pages/mine/identity/company-user-sign?type=${this.type}&idNum=${this.idNum}&username=${this.username}`)
				} else {
					const result = await this.$getRequest(this.$url.userAuditSubmit, 'POST', mess)
							 
					if(result.code!=0){
						uni.hideLoading()
						uni.showToast({
							title: result.msg,
							duration: 2000,
							icon: 'none'
						})
					}
					
					let auditStatus = result.data.auditStatus
					this.auditStatus = result.data.auditStatus
					getApp().globalData.userInfo.riskAuditStatus = this.auditStatus
						 
					uni.hideLoading()
						 
					if(auditStatus == 5) {
							 this.tipType = 'success'
					}
					this.tipDesc = statusName[result.data.auditStatus]
					this.tipShow = true
				}
		},
		
		confirmTextFn(){
			this.driverShow=false
		},
		
		confirmModal() {
			this.tipShow = false
			// let confirmRouter=uni.getStorageSync("confirmRouter")
					
			// let option=uni.getStorageSync("option",option)
			// if(confirmRouter=='/pages/ordered/place-order'){
			// 	uni.switchTab({
			// 		url: '/pages/ordered/place-order'
			// 	})
			// }else{
			// 	this.$u.route(`${confirmRouter}${option}`)
			// }  
			uni.reLaunch({
				url: `/pages/mine/identity/face-identity-tip?type=${this.type}&idNum=${this.idNum}&username=${this.username}`
			})
			
		},
         
		// type   0： 前   1： 后
		handleUploadFace(type) {
			if (this.readOnly) return;
				uni.vibrateShort()
 
				const self = this
				uni.chooseImage({
					success: async (chooseImageRes) => {
						uni.showLoading({
							 title: '上传中'
						})
						
						const tempFilePaths = chooseImageRes.tempFilePaths;
						const upload = await this.$getFileUpload(this.$url.upload, tempFilePaths)
						if(upload.code != 0) {
							this.driverShow=true
							this.content=uploadInfo.msg
                        
							return false
						}
						
						uni.hideLoading() 
						
						if(type == 0) {
							this.driverLicenseUrl = upload.data.src
							this.form.driverLicenseUrl = upload.data.src
							this.OCRCardImg({
								drivingLicenseUrl: upload.data.src,
								faceOrBack:1
							}, 0);
						} else {
							this.driverLicenseSecondSheetUrl = upload.data.src
							this.form.driverLicenseSecondSheetUrl = upload.data.src
							this.OCRCardImg({
								drivingLicenseUrl: upload.data.src,
								faceOrBack:2
							}, 1)
					 }
				}
			})
		},
		
		async OCRCardImg(params, type) {
			const uploadInfo =  await this.$getRequest(this.$url.ocrDrivingLicense, 'POST', params)
			if(uploadInfo.code != 0) {
				this.driverShow=true
				this.content=uploadInfo.msg
				return false
			}
			
			if (type === 0) {
				this.form.driverLicenseName = uploadInfo.data.resultJSON.name
				this.saveFaceInfo = uploadInfo.data;
				this.form.saveFaceInfo = uploadInfo.data;
				this.form.carType=uploadInfo.data.resultJSON.vehicle_type
				this.form.driverLicenseTimeEnd=uploadInfo.data.resultJSON.end_date
				this.form.driverLicenseCardId=uploadInfo.data.resultJSON.num
				this.form.driverLicenseTimeStart=uploadInfo.data.resultJSON.issue_date 
			} else {
				this.form.recordNum=uploadInfo.data.resultJSON.archive_no
			}
			 uni.setStorageSync("formDriver",this.form)
		},
		
		handleTime(obj) {
			const {year, month, day} = obj
			this.form.driverLicenseTimeEnd = `${year}-${month}-${day}`
		},
		
		popPicker() {
			if (!this.readOnly) {
				this.showDatePicker = true
			}
		},
		
		checkboxChange() {
			this.isForever = !this.isForever
			if(this.isForever) {
				this.form.driverLicenseTimeEnd = ''
			}
		},
		
		// 获取用户驾驶证证信息
		async getUserDriverInfo(userId) {
			try {
				const driverInfo = uni.getStorageSync('formDriver')
				
				if (driverInfo) {
					this.form.driverLicenseName=driverInfo.driverLicenseName
					this.saveFaceInfo=driverInfo.saveFaceInfo       
					this.form.carType=driverInfo.carType       
					this.form.driverLicenseTimeEnd=driverInfo.driverLicenseTimeEnd       
					this.form.driverLicenseCardId=driverInfo.driverLicenseCardId       
					this.form.driverLicenseTimeStart=driverInfo.driverLicenseTimeStart       
					this.form.recordNum=driverInfo.recordNum
				}
			} catch (e) {
				// error
			}
		},
		
		openCarTypeList() {
			this.showCarTypeList = true
		},
		
		confirmCarTypeList(e) {
			this.form.carType = e[0].value
		},
	}
}
 </script>
 
 <style lang="scss" scoped>
.identity-box {
	 background: rgba(10, 15, 45, 0.04);
	 border-radius: 16rpx;
	 margin: 16rpx 0;
}
.identity-foot {
	 margin-top: 130rpx;
	 text-align: center;
	 .but {
			 margin-top: 44rpx;
	 }
}

.identity-card {
	background: #FAFAFB;
	border-radius: 16rpx;
	height: 200rpx;
	line-height: 200rpx;
	text-align: center;
	margin-top: 27rpx;
}
.m-tip-txt {
	font-size: 34rpx;
	font-weight: 500;
}
.aPro {
	color: #2589FD;
}
.foot-but {
	position: fixed;
	left: 40rpx;
	right: 40rpx;
	z-index: 1;
	margin: 0 auto;
	z-index: 111;
	bottom: 60rpx;
}
     
.placeholderSty {
	color: #c0c4cc;
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
	.section-title {
		margin-top: 40px;
		margin-bottom: 12px;
	}
} 
</style>
 