/*
 * @Author: lufeng
 * @Date: 2021-11-01 16:27:58
 * @LastEditTime: 2022-01-24 12:27:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /super-butler/src/util.js
 */

//https://uat-api.51cheyaoshi.com/  //uat环境
//https://api.51cheyaoshi.com/  //正式环境
// http://api-test.51cheyaoshi.com:6999/ //测试环境
// 开发
const serverUrl =
    process.env.NODE_ENV === "development"
        ? "https://api.51cheyaoshi.com/"
        : "https://api.51cheyaoshi.com/";
const fileUrl = 
    process.env.NODE_ENV === "development"
        ? "https://api.51cheyaoshi.com/"
        : "https://api.51cheyaoshi.com/";
const url = {
    // cityList: "app/home/openCityList", // 城市列表
    // banner: "app/home/bannerList", // banner 列表
    // getCarTypeCondition: "app/car/getCarTypeCondition", // 筛选列表
    // searchCarTypeYearProductByName: "/app/home/searchCarTypeYearProductByName", //search
    
    // getCarSubscribe: "app/product/getCarSubscribeList", // 新车订阅列表
    // getCreditBuy: "app/product/yearProduct", // 先用后买 列表
    // getOnePercentPay: "app/product/buyCarProduct", // 一成首付 列表
    // getParityRent: 'app/product/daysProduct', // 会员租车 列表
    // getDiscountCar: 'app/product/newCarProduct', // 折扣新车 列表
    // getCertifiedCar: 'app/product/secondHandCarProduct', // 认证好车 列表
    // getCertifiedCarDetail: 'app/product/secondHandCarDetail', // 认证好车 列表

    // productDetail: "app/product/productDetail", // 车型详情
    // mathLoanInfo: "app/product/mathLoanInfo", // 计算贷款计划
    // activityList: "app/product/findActivity", // 团购列表
    // activityDetail: "app/product/findActivityById", // 团购详情

    // getOpenId: 'app/xcx/getOpenId', // 获取openid
    // getIdentifyingCode: 'app/xcx/getIdentifyingCode', //获取验证码
    // decryptData: 'app/xcx/wechat/decryptData', //获取手机号
    // wechatLoginByOpenId: 'app/xcx/wechatLoginByOpenId', //登录
    // businessMessageListByPage: 'app/user/message/businessMessageListByPage', //业务消息列表
    // marketingMessageListByPage: 'app/user/message/marketingMessageListByPage', //营销消息列表
    // daysProduct: 'app/product/daysProduct', //选车列表
    // createSubscribeOrder: 'app/userCarSubscribe/createUserCarSubscribe', //创建订阅订单
    // cancelSubscribeOrder: 'app/userCarSubscribe/cancel', //取消订阅订单
    // createOrder: 'app/order/createOrder', //创建订单
    // myInfo: 'app/my/index', //我的 基础信息
    // getAccountList: 'app/my/accountDetail', // 余额 列表明细
    // getDepositList: 'app/my/depositDetail', // 押金 列表明细
    // getCouponList: 'app/my/couponList', // 优惠券列表
    // getOrderList: 'app/my/orderList', // 用车 订单列表
    // getSubscribeOrderList: 'app/userCarSubscribe/getUserCarSubscribeList', // 订阅订单列表
    // getSubscribeInfo: 'app/userCarSubscribe/getUserCarSubscribeInfo', // 订阅订单详情
    // getOrderInfo: 'app/order/getOrderInfo', //订单详情
    // paymentOrder: 'app/order/paymentOrder', //支付
    // cancelOrder: 'app/order/cancelOrder', //取消订单
    // updateOrder: 'app/order/updateOrder', // 修改订单
    // feedback: 'app/feedback/create', //提交反馈
    // searchCarTypeYearProduct: 'app/product/searchCarTypeYearProduct', //搜索
    // brandList: 'app/home/brandList', //首页品牌列表
    // upload: 'sysFiles/upload', //上传
    // ocrIdcard: 'app/audit/user/ocrIdcard', // 解析OCR
    // userAuditSubmit: 'app/audit/userAuditSubmit', //提交认证
    // userInfo: 'app/my/userInfo', // 用户信息
    // likeProduct: 'app/product/likeProduct', //收藏
    // payOrder: 'wx/pay/createOrder', //支付
    // get4sList: 'app/product/get4SList', // 4S店接口
    // createUserIntention: 'app/product/createUserIntention', //创建意向
    // addCar: 'app/mycar/addCar', //添加爱车
    // getMyCars: 'app/mycar/getMyCars',  //获取车辆接口
    // getMyCarInfo: 'app/mycar/getMyCarInfo', //获取车辆详情接口
    // getUserCarReport: 'app/mycar/getUserCarReport', //体验报告
    // updateCarMileage: 'app/mycar/updateCarMileage', //修改里程数
    // updateTyre: 'app/mycar/updateTyre', //更新轮胎
    // updateInsurance: 'app/mycar/updateInsurance', //更新保险
    // getMaintainItem: 'app/mycar/getMaintainItem', //保养列表
    // updateMaintain: 'app/mycar/updateMaintain', //更新保养
    // createUserCarDrivingLicense: 'app/mycar/createUserCarDrivingLicense', //添加行驶证
    // // createUserCarDrivingLicense: 'app/mycar/createUserCarDrivingLicense', //创建车辆
    // getCarCosmetology: 'app/carlife/carCosmetology', //获取汽车美容店列表
    // getCarMaintain: 'app/carlife/carMaintain', //获取汽车保养店列表
    // getCarRepair: 'app/carlife/carRepair', //获取汽车维修店列表
    // getCarWash: 'app/carlife/carWash', //获取洗车店列表
    // getChargingPile: 'app/carlife/chargingPile', //获取充电桩列表
    // getGasStation: 'app/carlife/gasStation', //获取加油站列表
    
    // getRechargeList: 'app/recharge/getRechargeList', //获取充值列表
    // getVipProductList: 'app/product/memberProductList', //会员产品列表
	
	
	cityList: "app/app/home/openCityList", // 城市列表
	banner: "app/app/home/bannerList", // banner 列表
	getCarTypeCondition: "app/app/car/getCarTypeCondition", // 筛选列表
	searchCarTypeYearProductByName: "app/app/home/searchCarTypeYearProductByName", //search
	
	getCarSubscribe: "app/app/product/getCarSubscribeList", // 新车订阅列表
	getCreditBuy: "app/app/product/yearProduct", // 先用后买 列表
	getOnePercentPay: "app/app/product/buyCarProduct", // 一成首付 列表
	getParityRent: 'app/app/product/daysProduct', // 会员租车 列表
	getDiscountCar: 'app/app/product/newCarProduct', // 折扣新车 列表
	getCertifiedCar: 'app/app/secondCarApp/secondCarList', // 认证好车 列表
	getCertifiedCarDetail: 'app/app/secondCarApp/secondCarDetail', // 认证好车 详情
	
	productDetail: "app/app/product/productDetail", // 车型详情
	mathLoanInfo: "app/app/product/mathLoanInfo", // 计算贷款计划
	activityList: "app/app/product/findActivity", // 团购列表
	activityDetail: "app/app/product/findActivityById", // 团购详情
	
	getOpenId: 'app/app/xcx/getOpenId', // 获取openid
	getIdentifyingCode: 'app/app/xcx/getIdentifyingCode', //获取验证码
	decryptData: 'app/app/xcx/wechat/decryptData', //获取手机号
	wechatLoginByOpenId: 'app/app/xcx/wechatLoginByOpenId', //登录
	businessMessageListByPage: 'app/app/user/message/businessMessageListByPage', //业务消息列表
	marketingMessageListByPage: 'app/app/user/message/marketingMessageListByPage', //营销消息列表
	daysProduct: 'app/app/product/daysProduct', //选车列表
	createSubscribeOrder: 'app/app/userCarSubscribe/createUserCarSubscribe', //创建订阅订单
	cancelSubscribeOrder: 'app/app/userCarSubscribe/cancel', //取消订阅订单
	createOrder: 'app/app/order/createOrder', //创建订单
	myInfo: 'app/app/my/index', //我的 基础信息
	getAccountList: 'app/app/my/accountDetail', // 余额 列表明细
	getDepositList: 'app/app/my/depositDetail', // 押金 列表明细
	getCouponList: 'app/app/my/couponList', // 优惠券列表
	getOrderList: 'app/app/my/orderList', // 用车 订单列表
	getSubscribeOrderList: 'app/app/userCarSubscribe/getUserCarSubscribeList', // 订阅订单列表
	getSubscribeInfo: 'app/app/userCarSubscribe/getUserCarSubscribeInfo', // 订阅订单详情
	getOrderInfo: 'app/app/order/getOrderInfo', //订单详情
	paymentOrder: 'app/app/order/paymentOrder', //支付
	cancelOrder: 'app/app/order/cancelOrder', //取消订单
	updateOrder: 'app/app/order/updateOrder', // 修改订单
	feedback: 'app/app/feedback/create', //提交反馈
	searchCarTypeYearProduct: 'app/app/product/searchCarTypeYearProduct', //搜索
	brandList: 'app/app/home/brandList', //首页品牌列表
	upload: 'app/sysFiles/upload', //上传
	ocrIdcard: 'app/app/audit/user/ocrIdcard', // 解析OCR
	userInfo: 'app/app/my/userInfo', // 用户信息
	likeProduct: 'app/app/product/likeProduct', //收藏
	payOrder: 'wechat/wx/pay/createOrder', //支付
	get4sList: 'app/app/product/get4SList', // 4S店接口
	createUserIntention: 'app/app/product/createUserIntention', //创建意向
	addCar: 'app/app/mycar/addCar', //添加爱车
	getMyCars: 'app/app/mycar/getMyCars',  //获取车辆接口
	getMyCarInfo: 'app/app/mycar/getMyCarInfo', //获取车辆详情接口
	getUserCarReport: 'app/app/mycar/getUserCarReport', //体验报告
	updateCarMileage: 'app/app/mycar/updateCarMileage', //修改里程数
	updateTyre: 'app/app/mycar/updateTyre', //更新轮胎
	updateInsurance: 'app/app/mycar/updateInsurance', //更新保险
	getMaintainItem: 'app/app/mycar/getMaintainItem', //保养列表
	updateMaintain: 'app/app/mycar/updateMaintain', //更新保养
	createUserCarDrivingLicense: 'app/app/mycar/createUserCarDrivingLicense', //添加行驶证
	// createUserCarDrivingLicense: 'app/mycar/createUserCarDrivingLicense', //创建车辆
	getCarCosmetology: 'app/app/carlife/carCosmetology', //获取汽车美容店列表
	getCarMaintain: 'app/app/carlife/carMaintain', //获取汽车保养店列表
	getCarRepair: 'app/app/carlife/carRepair', //获取汽车维修店列表
	getCarWash: 'app/app/carlife/carWash', //获取洗车店列表
	getChargingPile: 'app/app/carlife/chargingPile', //获取充电桩列表
	getGasStation: 'app/app/carlife/gasStation', //获取加油站列表
	
	getRechargeList: 'app/app/recharge/getRechargeList', //获取充值列表
	getVipProductList: 'app/app/product/memberProductList', //会员产品列表
	
	getCarInfoImg: 'app/common/carTypeYearProduct/selectCarTypeYearProductEntityById', //车信息和图片
	getCarPlanList: 'app/app/product/getSubscribeListByCarAndSubscribeType' ,//车型方案列表
	getOrderDetail: 'app/app/product/getSubscribeDetailById', //订单详情
	getConfigColor: 'app/app/product/getSubscribeOtherConfigAndColorsById' ,//个人订制  增配项及颜色配置
	getTestDrive: 'merchant/testDrive/add', //预约试驾
	getSuccessInfo: 'app/app/userCarSubscribe/getSubscribeSuccessInfo',  //用户订阅成功信息查询
	getTradition:'app/app/product/getSubscribeEndPriceBySchemeId',//查询当前订阅方案全款买单金额
	BySubscribeId:'app/app/product/getTraditionFinancialSchemeListBySubscribeId',//查询当前订阅方案全款买单金额
	getBuyoutFinalInstallmentPrice:'app/app/product/getBuyoutFinalInstallmentPrice',//查询当前订阅方案全款买单金额
	createUserCar:'app/app/userCarSubscribe/createUserCarSubscribeOtherConfig',//查询当前订阅方案全款买单金额
	getFullPaymentPrice:'app/app/product/getTraditionFinancialSchemeFullPaymentPriceBySubscribeId',//查询当前订阅方案全款买单金额
	updateUserCarSubscribeFinalBuyout:'app/app/userCarSubscribe/updateUserCarSubscribeFinalBuyout',//创建期末选择
	
	getPayment: 'app/appuser/createdRechargeCompleteUserAccountDetailToLock', //创建充值余额流水为冻结（订金时使用）
	getToPayment: 'app/userCarSubscribe/updateUserCarSubscribeToPayment',
	createCarPurchaseOrder: 'app/app/userCarSubscribe/createUserCarPurchaseInInstallmentOrder', // 分期方案订单创建
	getPurchaseOrders: 'app/app/secondHandCar/appPurchaseInInstallmentOrders', // 分期方案订单查询
	cancelPurchaseOrder: 'app/app/secondHandCar/updateStatusToCancel' ,// 分期方案 取消订金
	
	addDeposit:'app/userCarSubscribe/addDeposit',// 确认或拒绝 加收保证金
	addCertification:'app/userCarSubscribe/addCertification',// 确认或拒绝 提交补充材料
	updatePlateScheme:'/app/app/userCarSubscribe/updatePlateScheme',//是否使用商家牌照
	
	
	
	
	selectReceiptBankAccountInfo:'app/combinationPayment/selectReceiptBankAccountInfo',//银行卡转账的公司详情
	
	ocrDrivingLicense:'app/app/audit/user/ocrDrivingLicense',//解析驾驶证
	getDIYConfig:'app/diyConfigRecord/selectDiyConfigByCompanyIdAndPageNum',// 获取 diy 配置
	//esign:'/app/app/esign/sign',//易签宝在线签约
	esign:'/app/app/esign/updateContractSignStatus',//易签宝在线签约
	esign1: 'app/app/esign/signSubscribeConfirm',//易签宝在线签约
	createOrgCreator:'/app/app/esign/createOrgCreator',//创建经办人
	
	
	getDIYConfig: 'app/diyConfigRecord/selectDiyConfigByCompanyIdAndPageNum', // 获取 diy 配置
	getNewCarList: 'app/diyConfigRecord/getNewCarInfoList', // DIY页面跳转 新车列表查询
	getSecondCarList: 'app/diyConfigRecord/getSecondCarInfoList', // DIY页面跳转 二手车列表查询
	
	getCarTypesList: 'app/app/product/getCarSubscribeCarTypeLabel', // 查询车辆类型
	
	// 认证
	updateUserMobile: 'app/app/xcx/updateUserMobile', // 填写手机验证码之后 修改电话号码
	userAuditSubmit: 'app/app/audit/userAuditSubmit', // 个人认证
	faceAudit: 'app/app/audit/user/faceAudit', // 人脸识别
	ocrBusinessLicense: 'app/app/audit/ocrBusinessLicense', // 营业执照识别
	
	uploadCertification: 'app/userCarSubscribe/uploadCertification', // 提交补充材料
	
	selectCarDeliveryAddress: 'app/app/product/selectCarDeliveryAddress', // 查询提车点
	
	// 订制方案
	selectPeriodList: 'app/app/product/selectPeriodList', // 周期筛选查询
	getCarType: 'app/common/carTypeYearProduct/getCarType', // 查询车系
	getCarTypeYear: 'app/common/carTypeYearProduct/getCarTypeYear', // 查询年款
	listByCarTypeYearId: 'app/common/carTypeYearProduct/listByCarTypeYearId', // 查询车型
	createUserRequirement: 'app/app/product/createUserRequirement', // 提交用户订制方案
	
	// 订单
	selectFinanceCityAndPlateMoney: 'app/app/userCarSubscribe/selectFinanceCityAndPlateMoney', // 查询金融方案对应城市以及城市牌照价格
	updateOrderType: 'app/app/userCarSubscribe/updateOrderType', // 设置订单为企业签约
	selectDepositAboutNoPay: 'app/combinationPayment/selectDepositAboutNoPay', // 组合支付—押金未支付金额
	selectSubscribeFreeAboutNoPay:'app/combinationPayment/selectSubscribeFreeAboutNoPay', // 组合支付—一次性支付订阅费用未支付金额
	selectPaymentDetailList:'app/combinationPayment/selectPaymentDetailList',//组合支付—查询支付列表
	createBankAccount:'app/combinationPayment/createBankAccount',//银行卡支付
	createBankBill:'app/combinationPayment/createBankBill',//添加银行卡支付照片
	selectPaymentDetail:'app/combinationPayment/selectPaymentDetail',//查询支付列表详情
	deleteBankBill:'app/combinationPayment/deleteBankBill',//银行转账—删除银行流水
	selectCarPicsList:'app/app/userCarSubscribe/selectCarPicsList',// 验车信息
	updateUserSubscribeStatus:'app/app/userCarSubscribe/updateUserSubscribeStatus',//更改订单状态
	selectReceiptBankAccountInfo:'app/combinationPayment/selectReceiptBankAccountInfo',// 银行转账—查询需要转账账户信息
	updateUserSubscribeEmergencyContact:'app/app/userCarSubscribe/updateUserSubscribeEmergencyContact',// 订单添加紧急联系人（确认验车）
	updateUserSubscribeConfigSkipStatus:'app/app/userCarSubscribe/updateUserSubscribeConfigSkipStatus',// 跳过个性化定制
	updateDeliveryTime: 'app/app/userCarSubscribe/updateDeliveryTime', // 更新提车时间
	selectHasModifyOtherConfig: 'app/app/selectHasModifyOtherConfig', // 查询增配项是否修改过
	saveOtherConfig: 'app/app/saveOtherConfig', // 修改增配项
	deleteDecorate: 'app/app/deleteDecorate', // 删除装潢
	updateConfirm: 'app/app/updateConfirm', // 更新确认状态
	addGuarantor: 'app/app/depositFreeApply/addGuarantor', // 添加担保人
	
	// 个人中心
	saveNickNameOrImg: 'app/app/xcx/saveNickNameOrImg', // 修改昵称或头像
	
	// 合伙人
	becomePartner: 'app/app/xcx/becomePartner', // 成为合伙人
	partnerApply: 'app/partner/partnerApply', // 申请成为合伙人（无订单）
	showDistributionBrokerageFree: 'app/app/xcx/showDistributionBrokerageFree', // 详情页是否显示佣金
	createQrCode: 'app/app/xcx/createUnlimitedQrCode', // 生成小程序码
	getPartnerCustomerList: 'app/partner/getUserList', // 获取客户列表
	getPartnerOrderList: 'app/partner/app/order/list', // 订单列表
	getCommissionTotal: 'app/partner/commissionTotal', // 佣金余额
	getCashList: 'app/partner/listByPage', // 提现记录
	getBindInfo: 'app/partner/userInfo', // 提现绑定信息
	identityPartner: 'app/partner/personRegister', // 身份认证
	bindBankCard: 'app/partner/bindBankCard', // 银行卡绑定
	ocrBankCard: 'app/partner/ocrBankCard', // 解析银行卡
	bindPartnerUser: 'app/partner/bindPartnerUser', // 绑定合伙人
	unboundBankCard: 'app/partner/unboundBankCard', // 绑定合伙人与用户
	addCash: 'app/partner/add', // 申请提现
	cancelPartnerApplyNotice: 'app/partner/partnerApplyNotice', // 取消提示
	getMyPartnerList: 'app/partner/app/myPartnerList', // 我的合伙人
	getPartnerCompanyUserList: 'app/partner/partnerCompanyUser/listByPage', // 企业合伙人员工列表
	addPartnerCompanyUser: 'app/partner/partnerCompanyUser/add', // 添加企业合伙人员工
	updatePartnerCompanyUser: 'app/partner/partnerCompanyUser/update', // 编辑企业合伙人员工
	deletePartnerCompanyUser: 'app/partner/partnerCompanyUser/delete', // 删除企业合伙人员工
	getPartnerCompanyDetail: 'app/partner/partnerCompany/companyDetail', // 企业合伙人公司详情
	updateCommissionRatio: 'app/partner/partnerCompany/commissionRatioUpdate', // 修改企业合伙人公司佣金比例
	invitePartnerCompanyUser: 'app/partner/updateCompanyUser', // 公司合伙人邀请员工
	
	// 合伙人活动
	activityCommissionDouble: 'app/app/xcx/activityCommissionDouble', // 领取首单任务刮刮乐
	partnerActivityDetail: 'app/partner/partnerActivityDetail', // 合伙人活动详情页
	getActivityCarSubscribeCriteria: 'app/app/product/activityCarSubscribeCriteria', // 合伙人活动车型列表查询条件
	getActivityCarSubscribeList: 'app/app/product/activityCarSubscribeList', // 合伙人活动车型列表查询
	activityShare: 'app/app/xcx/activityShare', // 完成分享产品
	getPartnerActivityTaskList: 'app/activity/activityTask/list', // 任务列表
	getAdditionRankList: 'app/activity/partner/order/additionRankList', // 排行榜
	getAdditionOrderList: 'app/activity/activityTask/additionOrder', // 加成订单列表
	getAdditionOrderRatio: 'app/activity/activityTask/additionRatio', // 订单加成比例
	updateAdditionOrder: 'app/activity/partner/order/updateAdditionOrder', // 修改订单加成比例
	receiveReward: 'app/activity/partner/order/receiveReward', // 领取奖励
	completeFirstTask: 'app/activity/activityTask/isCompleteFirstTask', // 完成首单
	
	// 免押金申请
	cancelNotice: 'app/app/depositFreeApply/notice', // 取消提示
	cancelDepositFree: 'app/app/depositFreeApply/refuse', // 取消免押申请
	applyDepositFree: 'app/app/depositFreeApply/apply', // 免押申请
	
	// 租车
	getCarRentalList: 'app/app/carRental/list', // 租车产品列表
	getCarRentalDetail: 'app/app/carRental/detail', // 租车产品详情
	createUserCarRentalSubscribe: 'app/app/createUserCarRentalSubscribe', // 创建租车产品订单
	carRentalApply: 'app/app/depositFreeApply/carRentalApply', // 租车认证
	updateUserCarRentalSubscribeStatus: 'app/app/updateUserCarRentalSubscribeStatus', // 更改租车订单状态
	getCarRentalOrderList: 'app/app/userCarRentalSubscribe/productList', // 租车订单列表
	getCarRentalOrderDetail: 'app/app/userCarRentalSubscribe/productDetail', // 租车订单详情
	addDepositApprove: 'app/app/addDepositApprove', // 租车订单 - 同意或拒绝加收押金
	cancelRentalOrder: 'app/app/userCarRentalSubscribe/orderCancel', // 取消租车订单
	updateRentalAddress: 'app/app/userCarRentalSubscribe/updateAddress', // 租车订单修改地址
	getRentalSubOrderList: 'app/app/userCarRentalSubscribe/userDepositDetail', // 租车订单子订单列表
	confirmRentalOrderAccount: 'app/app/userCarRentalSubscribe/confirmPay', // 确认账单
	signCarRentalConfirm: 'app/app/esign/signCarRentalConfirm', // 易签宝租车协议签约
	createCustomerRental: 'app/app/carFinanceLease/add', // 添加融资租赁方案
	getCustomerRentalOrderList: '/app/app/userCarFinanceLeaseSubscribe/list', // 融资租赁订单列表
	getCustomerRentalOrderDetail: '/app/app/userCarFinanceLeaseSubscribe/detail', // 融资租赁订单详情
	getcarRentalSubscribeList: 'app/app/carRental/subscribeList', // 租车方案列表
	
	// 竞拍
	getAuctionList: 'app/app/secondAuction/listByPage', // 竞拍列表
	getAuctionDetail: 'app/app/secondAuction/detail', // 竞拍详情
	addAuctionOffer: 'app/app/secondAuction/add', // 出价
	getMyAuctionList: 'app/app/secondAuction/listMySelf', // 我的竞价列表
	createBiddingDisputes: 'app/app/secondAuction/biddingDisputes', // 发起纠纷
	confirmAuction: 'app/app/secondAuction/confirm', // 确认竞价交易
	getTurnoverRecord: 'app/app/turnoverRecord/listByPage', // 交易流水
	getBankAndBalance: 'app/app/turnoverRecord/bankAndBalance', // 银行卡信息和余额
	bindBank: 'app/app/turnoverRecord/bindBank', // 绑定银行卡
	ocrBankCard: 'merchantapp/userBrokerageRecord/ocrBankCard', // 解析银行卡
	getTurnoverRecordDetail: 'app/app/turnoverRecord/detail', // 流水详情
	withdrawal: 'app/app/turnoverRecord/Withdrawal', // 提现
	
	// 埋点
	addUserCarIntention: 'app/userCarIntention/add', // 埋点
}

const QQMapWXKey = 'ONYBZ-WH6KF-BAIJO-NWS5O-KM4LS-BSFY4'; // 腾讯地图key

/**
 * @description: 请求
 * @param {url, method, data}
 * @return:
 */
const getRequest = (url, method, data) => {
	
    return new Promise((resolve, reject) => {
        uni.request({
						url: serverUrl + url,
						//url: 'https://uat-api.51cheyaoshi.com/' + url,
						// url: 'http://api-test.51cheyaoshi.com:6999/' + url,
            method: method,
            data: data,
            headers: {
                "content-type": "multipart/form-data",
            },
            success: (res) => {
                console.log(url, res.data);
                if (res.data.code != 0 ) {
					
                    // uni.showToast({
                    //     title: res.data.msg,
                    //     duration: 2000,
                    //     icon: 'none'
                    // });
                }
                resolve(res.data);
            },
            fail(err) {
                console.log(err);
            },
        });
    });
};

// loginRoute 登录后跳转的路由
const getUserProfile  = (loginRoute, cb, partnerId="") => {
    uni.showToast({
        title: '',
        duration: 1000,
        icon: 'loading'
    });
		uni.getUserProfile({
        desc: "获取头像用于展示",
        success: (result) => {
						uni.setStorageSync('userInfo', {
                nickname: result.userInfo.nickName,
                avatarUrl: result.userInfo.avatarUrl
            });
						getApp().globalData.userInfo = result.userInfo
            getApp().globalData.route = loginRoute
            cb && cb()
        },
        complete: () =>{
            uni.hideToast()
        }

    })

}

/**
 * @description: 上传OSS  callback
 * @param {tempFilePaths, 上传callback}
 * @return:
 */
/**
 * @description: 请求
 * @param {url, method, data}
 * @return:
 */
 const getFileUpload = (url, tempFilePaths) => {

    return new Promise((resolve, reject) => {
        uni.uploadFile({
						url: serverUrl +url,
						//url: 'http://uat-api.51cheyaoshi.com/' + url,
            filePath: tempFilePaths[0],
            name: 'file',
            formData: {
                'file': tempFilePaths[0]
            },
            success: (uploadFileRes) => {
                const result = JSON.parse(uploadFileRes.data);
                if (result.code != 0 ) {
                    uni.showToast({
                        title: result.msg,
                        duration: 2000,
                        icon: 'none'
                    });
                }
                resolve(result);
            },
            fail: (err) => {
                console.log(err);
            }

        });
    });
};

const requestPayment = async (data, cb ) => {
	
    // const res = await getRequest(url.payOrder, 'POST', data)
	uni.request({
		// url:'https://uat-api.51cheyaoshi.com/wechat/wx/pay/createOrder',
		url:'https://wechat.51cheyaoshi.com/wx/pay/createOrder',
		method:'POST',
		data,
		success:(res) => {
			// if(res.code != 0) {
			//     return false;
			// 	console.log("util======>>>",res)
			// }
			uni.requestPayment({
			    provider: 'wxpay',
			    timeStamp: res.data.data.timeStamp,
			    nonceStr: res.data.data.nonceStr,
			    package: res.data.data.packageValue,
			    signType: res.data.data.signType,
			    paySign: res.data.data.paySign,
			    success: async (res) => {
			        if(res.errMsg == 'requestPayment:ok') {
								// code 支付成功
								uni.showToast({
										title: '支付成功',
										duration: 2500
								});
					
								return cb && cb('success')
			        } else {
								console.log('订单已取消');
								return cb && cb('fail')
			        }
			    },
			    fail: async (err) => {
					
						console.log("err.errCode",err)
			        // uni.showToast({
			        //     title: '取消支付',
			        //     duration: 2500
			        // });
						return cb && cb('fail')
			    }
			})
		}
		
	})
   

}

const goHtml = function(url, title) {
  const length = url.length
  const newString = url.substring(length-4, length)
  const newString2 = newString.toLowerCase()
  if (newString2 == '.pdf') {
    uni.downloadFile({
      url: url,
      success: function(res) {
        const filepath = res.tempFilePath
        uni.openDocument({
          filePath: filepath,
        })
      }
    })
  } else {
    uni.navigateTo({
      url: '/pages/html/html?h5url=' + url + '&title=' + title
    })
  }
};

export { url, getRequest, getUserProfile, getFileUpload, requestPayment, goHtml};
