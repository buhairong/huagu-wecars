import Vue from "vue"

export const oneDay = 24 * 60 * 60 * 1000
export const oneHour = 60 * 60 * 1000
export const oneMin = 60 * 1000

export const formatTenThousandNumber= (num, unit1='万', unit2='') => {
	let res = ''
	
	if (num || num == 0) {
		if (num < 10000) {
			res = num + unit2
		} else {
			if (num % 10000 === 0) {
				res = num / 10000 + unit1
			} else {
				if (num % 1000 === 0) {
					res = (num/10000).toFixed(1) + unit1
				} else {
					res = (num/10000).toFixed(2) + unit1
				}
			}
		}
	}
	
	return res
}

/**
 * 千分位格式化
 * @param n number
 */
export function formatThousandNumber(n) {
    n = Math.floor(n) // 只考虑整数
 
    const s = n.toString()
    const arr = s.split('').reverse()
    return arr.reduce((prev, val, index) => {
        if (index % 3 === 0) {
            if (prev) {
                return val + ',' + prev
            } else {
                return val
            }
        } else {
            return val + prev
        }
    }, '')
}

// 保证金
export function getDeposit(num) {
	if (!num) {
		if (num === 0) {
			return '减免保证金'
		} else {
			return '-'
		}
	} else {
		return `￥${formatThousandNumber(num)}`
	}
}

export function getImageInfo(src, ratio = 0.75) {
	return new Promise((resolve) => {
		uni.getImageInfo({
			src,
			success: (image) => {
				console.log('getImageInfo', image)
				let res = src
				if (image.height > image.width) {
					const w = image.width
					const h = Math.floor(image.width * ratio)
					const x = 0
					const y = Math.floor((image.height - h) / 2)
					res = `${src}?x-oss-process=image/crop,x_${x},y_${y},w_${w},h_${h}`
				}
				console.log('getImageInfo', res)
				resolve(res)
			},
			fail: (err) => {
				console.log(err)
				resolve('')
			}
		})
	})
}

/**
 * 数字转成汉字
 * @params num === 要转换的数字
 * @return 汉字
 * */
export const toChinesNum = (num) => {
  let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  let unit = ['', '十', '百', '千', '万']
  num = parseInt(num)
  let getWan = (temp) => {
    let strArr = temp.toString().split('').reverse()
    let newNum = ''
    let newArr = []
    strArr.forEach((item, index) => {
      newArr.unshift(item === '0' ? changeNum[item] : changeNum[item] + unit[index])
    })
    let numArr = []
    newArr.forEach((m, n) => {
      if (m !== '零') numArr.push(n)
    })
    if (newArr.length > 1) {
      newArr.forEach((m, n) => {
        if (newArr[newArr.length - 1] === '零') {
          if (n <= numArr[numArr.length - 1]) {
            newNum += m
          }
        } else {
          newNum += m
        }
      })
    } else {
      newNum = newArr[0]
    }

    return newNum
  }
  let overWan = Math.floor(num / 10000)
  let noWan = num % 10000
  if (noWan.toString().length < 4) {
    noWan = '0' + noWan
  }
  return overWan ? getWan(overWan) + '万' + getWan(noWan) : getWan(num)
}

export const formatDate = (time) => {
	// 2023-11-16 15:03:31
	let year = time.slice(0, 4)
	let month = time.slice(5, 7)
	let date = time.slice(8, 10)
	let hour = ''
	let minute = ''
	let second = ''
	
	if(time.length > 10) {
		hour = time.slice(11, 13)
		minute = time.slice(14, 16)
		second = time.slice(17, 19)
	}
	
	return {
		year,
		month,
		date,
		hour,
		minute,
		second,
	}
}

export const formatTimeStamp = (timeStamp) => {
	const dateObj = new Date(timeStamp)
	const year = dateObj.getFullYear()
	const month = ((dateObj.getMonth() + 1)+'').padStart(2, '0')
	const date = ((dateObj.getDate() + 1)+'').padStart(2, '0')
	const hour = ((dateObj.getHours() + 1)+'').padStart(2, '0')
	const minute = ((dateObj.getMinutes() + 1)+'').padStart(2, '0')
	const second = ((dateObj.getSeconds() + 1)+'').padStart(2, '0')
	
	return {
		year,
		month,
		date,
		hour,
		minute,
		second,
	}
}

export const countdown = (timeStamp) => {
	let signToCancelTimeStr = ''
	if (timeStamp > 0) {
		const oneH = 60 * 60 * 1000
		const h = Math.floor(timeStamp / oneH) + ''
		const m = Math.floor((timeStamp % oneH) / (60 * 1000)) + ''
		signToCancelTimeStr = h.padStart(2, '0') + ':' + m.padStart(2, '0')
	} else {
		signToCancelTimeStr = ''
	}
	
	return signToCancelTimeStr
}

export const formatCountdown = (timeStamp) => {
	const day = Math.floor(timeStamp / oneDay)
	
	let remind = timeStamp % oneDay
	
	const hour = Math.floor(remind / oneHour)
	remind = remind % oneHour
	
	const minute = Math.floor(remind / oneMin)
	const second = Math.floor(remind % oneMin / 1000)
	
	return {
		day,
		hour,
		minute,
		second,
	}
}

export const throttle = (fn, delay = 200) => {
	let timer = 0

	return function () {
		if (timer) return

		timer = setTimeout(() => {
			console.log('setTimeout')
			fn.apply(this, arguments)
			timer = 0
		}, delay)
	}
}

// type: 1.新车订阅  2.二手车订阅  3.租车 4.竞价 5.融资租赁
export const addUserCarIntention = (type, carTypeId, userId) => {
	const data = {
		type,
		carTypeId,
		userId,
	}
	Vue.prototype.$getRequest(Vue.prototype.$url.addUserCarIntention, 'POST', data).then((result) => {
		if (result.code === 0) {
			//
		}
	})
}

// 到期时间
export const formatExpirationDate = (days) => {
	const curTimer = new Date().getTime()
	const timeStamp = curTimer + days*oneDay
	const dateObj = new Date(timeStamp)
	const year = dateObj.getFullYear()
	const month = ((dateObj.getMonth() + 1)+'').padStart(2, '0')
	const date = ((dateObj.getDate() + 1)+'').padStart(2, '0')
	const hour = ((dateObj.getHours() + 1)+'').padStart(2, '0')
	const minute = ((dateObj.getMinutes() + 1)+'').padStart(2, '0')
	const second = ((dateObj.getSeconds() + 1)+'').padStart(2, '0')
	
	return {
		year,
		month,
		date,
		hour,
		minute,
		second,
	}
}
