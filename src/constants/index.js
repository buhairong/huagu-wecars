/*
 * @LastEditors: Please set LastEditors
 */
import { orderStatus, orderStatusOptions,subOrderStatusOptions } from './order';

const statusName = {
  '0': '待审核',
  '1': '初审通过',
  '2': '初审拒绝',
  '3': '等待人工审核',
  '4': '复审拒绝',
  '5': '认证通过',
	'6': '认证通过',
}

/** 认证好车筛选类型 **/
const orderByType = [
  { key: '0', name: '最新上架' },
  { key: '1', name: '车龄' },
  { key: '2', name: '里程' },
  { key: '3', name: '价格' },
]
/** 支付方式 **/
const paymentTypeAll = ['月付','季付','年付','全款']
const paymentTypeAll1 = ['一次性买断','月付','季付','年付','全款']
const paymentTypeAll2 = ['一次性付','月付','季付','年付','分两次付']

/** 账户余额状态 **/
const accountStatusAll = [
  { value: 0, name: '待支付' },
  { value: 1, name: '已支付' },
  { value: 2, name: '已取消' },
  { value: 3, name: '冻结中' },
]

/** 账户余额支付方式 **/
const accountPayTypeAll = [
  { value: 0, name: '账户充值' },
  { value: 1, name: '订单扣费' },
  { value: 2, name: '订单退款' },
  { value: 3, name: '订金支付' },
  { value: 4, name: '尾款支付' },
  { value: 5, name: '购买产品' },
]

/** 业务分类 **/
const businessTypeTypeAll = [
  { value: 0, name: '充值' },
  { value: 1, name: '长租产品' },
  { value: 2, name: '新车订阅' },
  { value: 3, name: '购买二手车' },
  { value: 4, name: '团购' },
  { value: 5, name: '会员' },
]

/** powerpode **/
const powerModeAll = [
  { value: 1, name: '汽油' },
  { value: 2, name: '柴油' },
  { value: 3, name: '纯电' },
  { value: 4, name: '油电混合' },
  { value: 5, name: '插电混合' },
  { value: 6, name: '增程式混合' },
]

const powerMode = {
	1: '汽油',
	2: '柴油',
	3: '纯电',
	4: '油电混合',
	5: '插电混合',
	6: '增程式混合',
}

const powerModeAllTag = [
	{ value: '', name: '全部' },
  { value: 1, name: '汽油' },
  { value: 3, name: '纯电' },
  { value: 4, name: '油电混合' },
  { value: 5, name: '插电混合' },
  { value: 6, name: '增程式混合' },
	{ value: 2, name: '柴油' },
]

// 车要试用车服务协议
const contractUrl = 'https://www.51cheyaoshi.com/applet/protocol/carlongcontract.html'

// https://smlh5.esign.cn/mesign/guide?context=9nntlh9xELYC&flowId=558f82dcc23641ebbe016a1be8668af7&organ=false&appId=7438935080&linkSource=1&bizType=1&tsign_source_type=SIGN_LINK_XUANYUAN&tsign_source_detail=16R2mv%2F27h2Y5CkM9bwhboBR%2B780DUDR3cviaMJlB8YzJL2x0BSn9g1Xkg8sb79Fz2WVcP4D8RybKHCOFyLzr6Psp5uGN3scARes8UxN%2BaD9bkOcHfTkhByNCg9DHQ8PaPujWRmJ0aM2qNe311lP7VKn6lQnOlh8EDIMtjYxmCfWXE7WxdtjC3FFdzXHq37WhKEhJeNuiMXlUo39jP2TrjTUEbkffvFrlNDsiQIQMzdKn%2BXMBxNygJkFd7MOZKF8t

// 期末选择 0买断车辆，1退回车辆
const finalSelect = ['可买断车辆', '可退回车辆']

// 分期订单状态 0待支付订金、1待签约、2待支付押金、3采购中、4待支付合约、5待交车、6用车中、7合约结束、8已取消、10待审核、11已审核、12 审核拒绝
const purchaseOrderStatus = {
	'0': '待支付订金', // 订金
	'1': '待签约',
	'2': '待支付',
	'3': '备车中',
	'4': '待支付',
	'5': '待验车',
	'6': '订阅中',
	'7': '合约结束',
	'8': '已取消',
	'10': '待审核',
	'11': '已审核',
	'12': '审核拒绝',
	'13': '上牌中',
	'14': '待审核',
	'15': '待提车',
	'16': '待接单',
	'17': '商户拒绝接单',
}

// 车系类型
const CAR_TYPES = {
	'0': '新能源车',
	'1': '进口车',
	'2': '国产车',
}

// 车要试出行用户协议
const userProtocolUrl = 'https://www.51cheyaoshi.com/applet/protocol/privacy.pdf'

const serviceTel = '021-60718488'

const violationDeposit = 10000

const partnerVipPay = 299

// 免押金认证职业
const OCCUPATION_LIST = [
	{ value: 1, label: '公务人员' },
	{ value: 2, label: '教师' },
	{ value: 3, label: '医生' },
	{ value: 4, label: '世界500强' },
	{ value: 5, label: '国内500强' },
	{ value: 6, label: '事业单位正式编' },
	{ value: 7, label: '其他' },
]

const drive = {
	1: '前驱',
	2: '前驱',
	3: '全时四驱',
	4: '适时四驱',
	5: '分时四驱',
	6: '电动四驱',
}

const dayList = ['日', '一', '二', '三', '四', '五', '六']
const hourList = ['08点', '09点', '10点', '11点', '12点', '13点', '14点', '15点', '16点', '17点', '18点', '19点', '20点']
const minList = ['00分', '10分', '20分', '30分', '40分', '50分']
const dayTimer = 24 * 60 * 60 * 1000

// 租车订单状态
const CAR_RENTAL_ORDER_STATUS = {
	'10': '待审核',    // 风控审核
	'20': '审核拒绝',  // 风控审核拒绝
	'30': '待签约',
	'40': '待支付',
	'50': '已取消',   // 24小时未支付租金，订单自动取消
	'60': '待审核',   // 租金 银行转账 财务审核
	'70': '备车中',
	'80': '待取车',
	'85': '送车中',
	'90': '待验车',
	'100': '用车中',
	'110': '待还车',
	'115': '接车中',
	'120': '已逾期',
	'130': '结算中',
	'140': '需补缴',
	'150': '已完成',
}

// 租车周期
const CAR_RENTAL_PERIOD_STATUS = {
    180: {label: '半年套餐', days: 182},
    360: {label: '一年套餐', days: 365},
    720: {label: '两年套餐', days: 365*2},
}

// 租车业务
const CAR_RENTAL_BUSINESS_TYPE_LIST = [
    { value: 2, label: '随用随还' },
    { value: 1, label: '折扣长租' },
]

const CAR_RENTAL_BUSINESS_TYPE_STATUS = {
    1: '随用随还',
    2: '折扣长租',
}

const SUBSCRIBE_PERIOD_STATUS = {
    1: '半年',
    2: '一年',
    3: '一年半',
    4: '二年',
    5: '二年半',
    6: '三年',
}

const IMG_ACCEPT = ['jpg', 'jpeg', 'png', 'gif', '.bmp', 'webp']

// 竞拍车辆状态
const auctionCarStatus = {
	0: '审核中',
	1: '待开始',
	2: '审核拒绝',
	3: '已取消',
	4: '进行中',
	5: '已结束',
	6: '交易完成',
}

// 纠纷
const disputesList = [
	{ value: 1, label: '对最终出价不满意' },
	{ value: 2, label: '车辆出现问题（ 车辆出现损坏等问题 ）' },
	{ value: 3, label: '卖家长时间不联系我' },
	{ value: 4, label: '其他卖家的原因' },
	{ value: 5, label: '其他我的原因' },
]

const disputesObj = {
	1: '对最终出价不满意',
	2: '车辆出现问题（ 车辆出现损坏等问题 ）',
	3: '卖家长时间不联系我',
	4: '其他卖家的原因',
	5: '其他我的原因',
}

const disputeResultStatus = {
	1: '商家赔付',
	2: '用户赔付',
}

const cashRecordObj = {
	1: { text: '充值', title: '充值', label: ['支付方式', '支付金额', '支付时间'], },
	2: { text: '上架冻结', title: '上架冻结', label: ['支付方式', '支付金额', '支付时间'] },
	3: { text: '加收保证金', title: '加收保证金', label: ['支付方式', '支付金额', '支付时间'] },
	4: { text: '违约补偿', title: '违约补偿', label: ['补偿方式', '补偿金额', '补偿时间'], label1Content: '补偿至账户余额', },
	5: { text: '退还保证金', title: '退还保证金', label: ['退还方式', '退还金额', '退还时间'], label1Content: '退还至账户余额', },
	11: { text: '违约赔付', title: '违约赔付', label: ['赔付方式', '赔付金额', '赔付时间'], label1Content: '账户余额', },
	12: { text: '提现', title: '提现', label: ['提现方式', '提现金额', '支付时间'], label1Content: '银行转账', },
	13: { text: '佣金支付', title: '佣金支付', label: ['支付方式', '支付金额', '支付时间'], label1Content: '账户余额', },
}

const errMsgObj = {
	500006: { msg: '您已绑定过合伙人，是否要更换合伙人？' },
	500007: { msg: '您已是合伙人，无法成为其他合伙人的用户！' },
}

// 职业
const CAREER_LIST = [
	{
		id: 10,
		label: '汽车类',
		category: [
			{ value: 10, label: '4S店' },
			{ value: 20, label: '综合展厅' },
			{ value: 30, label: '二手车销售' },
			{ value: 40, label: '汽车金融' },
			{ value: 50, label: '汽车保险' },
			{ value: 60, label: '后市场服务' },
			{ value: 70, label: '其他' },
		]
	}, 
	{
		id: 20,
		label: '房产类',
		category: [
			{ value: 110, label: '新房销售' },
			{ value: 120, label: '房屋中介' },
			{ value: 130, label: '开发商' },
			{ value: 140, label: '办公室租赁' },
			{ value: 150, label: '物业管理' },
			{ value: 160, label: '其他' },
		]
	},
	{
		id: 30,
		label: '互联网',
		category: [
			{ value: 210, label: '电商' },
			{ value: 220, label: '自媒体' },
			{ value: 230, label: '管理类' },
			{ value: 240, label: '技术类' },
			{ value: 250, label: '运营类' },
			{ value: 260, label: '其他' },
		]
	},
	{
		id: 40,
		label: '金融类',
		category: [
			{ value: 310, label: '金融机构' },
			{ value: 320, label: '投资顾问' },
			{ value: 330, label: '保险经济人' },
		]
	},
	{
		id: 50,
		label: '服务类',
		category: [
			{ value: 410, label: '企业服务' },
			{ value: 420, label: '人力资源服务' },
			{ value: 430, label: '法律服务' },
			{ value: 440, label: '教培服务' },
			{ value: 450, label: '医美服务' },
			{ value: 460, label: '会籍顾问' },
			{ value: 470, label: '娱乐服务' },
			{ value: 480, label: '其他' },
		]
	},
	{
		id: 60,
		label: '其他',
		category: [
			{ value: 510, label: '其他' },
		]
	},
]

// 企业合伙人角色
const partnerCompanyRoleList = [
	{ value: 1, label: '超级管理员', isChecked: false },
	{ value: 20, label: '管理员', isChecked: false },
	{ value: 30, label: '员工', isChecked: false },
]

const partnerCompanyRoleStatus = {
	1: '超级管理员',
	20: '管理员',
	30: '员工',
}

// 合伙人排行榜tabs
const partnerRankingTabList = [
	{ value: 1, label: '加成订单' },
	{ value: 2, label: '佣金排行榜' },
]

// 合伙人价格筛选
const partnerPriceTypeStatus = {
	1: '2000元以内',
	2: '2000-5000元',
	3: '5000-10000元',
	4: '10000元以上',
}

// 申请合伙人步骤
const applyPartnerStepList = [
	{ name: '职业信息' },
	{ name: '工作信息' },
	{ name: '个人信息' },
]

// 会员租车订单状态
const MEMBER_CAR_RENTAL_ORDER_STATUS = {
	0: '待支付',    
	1: '审核中', 
	2: '支付完成',
	3: '已取消',
}

const EDUCATION_STATUS = {
  1: "博士",
  2: "研究生",
  3: "本科",
  4: "专科",
  5: "高中",
  6: "初中",
};

const PAY_WAY_STATUS = {
  0: "微信支付",
  1: "银行转账",
  2: "余额支付",
  3: "先租后付",
};

const BUSINESS_ACTIVITY_LIST = [
	{ value: '1', label: '高尔夫' },
	{ value: '2', label: '餐饮' },
	{ value: '3', label: '会议' },
	{ value: '4', label: '娱乐' },
]


const BUSINESS_ACTIVITY_STATUS = {
  '1': "高尔夫",
  '2': "餐饮",
  '3': "会议",
  '4': "娱乐",
};

export {
    orderStatus,
    orderStatusOptions,
    statusName,
    orderByType,
    paymentTypeAll,
		paymentTypeAll1,
		paymentTypeAll2,
    accountStatusAll,
    accountPayTypeAll,
    businessTypeTypeAll,
    powerModeAll,
		powerMode,
		contractUrl,
		finalSelect,
		purchaseOrderStatus,
		CAR_TYPES,
		userProtocolUrl,
		serviceTel,
		violationDeposit,
		OCCUPATION_LIST,
		drive,
		dayList,
		hourList,
		minList,
		dayTimer,
		CAR_RENTAL_ORDER_STATUS,
		CAR_RENTAL_PERIOD_STATUS,
		SUBSCRIBE_PERIOD_STATUS,
		powerModeAllTag,
		IMG_ACCEPT,
		auctionCarStatus,
		disputesList,
		disputesObj,
		disputeResultStatus,
		cashRecordObj,
		CAR_RENTAL_BUSINESS_TYPE_LIST,
		CAR_RENTAL_BUSINESS_TYPE_STATUS,
		errMsgObj,
		CAREER_LIST,
		partnerCompanyRoleList,
		partnerCompanyRoleStatus,
		partnerVipPay,
		partnerRankingTabList,
		partnerPriceTypeStatus,
		applyPartnerStepList,
		MEMBER_CAR_RENTAL_ORDER_STATUS,
		EDUCATION_STATUS,
		BUSINESS_ACTIVITY_STATUS,
		PAY_WAY_STATUS,
		BUSINESS_ACTIVITY_LIST
}
