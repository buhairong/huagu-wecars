/*
 * @LastEditors: luchun
 */
const orderStatus = {
    PENDING: 0,
    OPERATING: 1,
    DELIVERING: 2,
    USING: 3,
    RETURNING: 4,
    COMPLETED: 5,
    CANCELED: 6,
    TIMEOUT: 7,
    SYSTEMCANCELED: 8,
  }

  const orderStatusOptions = [{
    value: orderStatus.PENDING,
    text: '待支付'
  }, {
    value: orderStatus.OPERATING,
    text: '待执行'
  }, {
    value: orderStatus.DELIVERING,
    text: '送车中'
  }, {
    value: orderStatus.USING,
    text: '用车中'
  }, {
    value: orderStatus.RETURNING,
    text: '取车中'
  }, {
    value: orderStatus.COMPLETED,
    text: '已完成'
  }, {
    value: orderStatus.CANCELED,
    text: '已取消'
  }, {
    value: orderStatus.TIMEOUT,
    text: '支付超时取消'
  }, {
    value: orderStatus.SYSTEMCANCELED,
    text: '管家取消'
  }]
  
  // 0待支付订金、1待签约、2待支付押金、3采购中、4待支付合约、5待交车、6用车中、7合约结束
    const subOrderStatusOptions = [{
      value: 0,
      name: '待下单'
    }, {
      value: 1,
      name: '待签约'
    }, {
      value: 2,
      name: '已签约，待支付'
    }, {
      value: 3,
      name: '备车中'
    }, {
      value: 4,
      name: '待支付订阅费用'
    }, {
      value: 5,
      name: '待验车'
    }, {
      value: 6,
      name: '订阅中'
    },{
      value: 7,
      name: '已完成'
    },{
      value: 8,
      name: '已取消'
    },{
      value: 9,
      name: '违约'
    },{
      value: 10,
      name: '待审核'
    },{
      value: 11,
      name: '审核通过'
    },
		{
      value: 12,
      name: '审核拒绝'
    },
		{
		  value: 13,
		  name: '上牌中'
		},
		{
		  value: 14,
		  name: '待审核'
		},
		{
		  value: 15,
		  name: '待交车'
		},
		{
		  value: 16,
		  name: '审核通过，等待合同生成'
		},
		{
		  value: 17,
		  name: '审核通过，等待合同生成'
		},
	]

  export { orderStatus, orderStatusOptions,subOrderStatusOptions }
