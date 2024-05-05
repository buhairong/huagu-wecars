<template>
	<view class="wrap">
		<u-picker mode="multiSelector" v-model="show" :range="pickCarDateList" @cancel="close" @confirm="confirmPickCarDate"></u-picker>
	</view>
</template>

<script>
import { formatDate, formatTimeStamp } from '@/utils'
import { dayList, hourList, minList, dayTimer, CAR_RENTAL_PERIOD_STATUS } from '@/constants'

const days = 60
const monthLastDay = {
	1: 31,
	2: 28,
	3: 31,
	4: 30,
	5: 31,
	6: 30,
	7: 31,
	8: 31,
	9: 30,
	10: 31,
	11: 30,
	12: 31,
}
	
export default {
	props: {
		ableStartDate: {
			type: String,
			required: true,
		},
		
		days: {
			type: Number,
			default: days,
		},
	},
	
	data() {
		return {
			show: false,
			pickCarDateList: [],
			pickCarDateParamsList: [],
			pickTimeStart: {},
		}
	},
	
	mounted() {
		this.show = true
		this.getRange()
	},
	
	watch: {
		show: {
			handler(val) {
				if (!val) {
					this.close()
				}
			}
		}
	},
	
	methods: {
		close() {
			this.$emit('close')
		},
		
		getRange() {
			this.startTimeStamp = new Date(this.ableStartDate).getTime()
			this.pickTimeStart = formatDate(this.ableStartDate)
			this.pickTimeStart.minute = '00'
			const dateList = []
			this.pickCarDateList = []
			this.pickCarDateParamsList = []
			for(let i = 0; i < this.days; i++) {
				const date = new Date(this.startTimeStamp + dayTimer*i)
				const year = date.getFullYear()
				const month = (date.getMonth()+1+'').padStart(2, '0')
				const day = (date.getDate()+'').padStart(2, '0')
				const weekDay = `周${dayList[date.getDay()]}`
				const dayStr = `${month}月${day}日 ${weekDay}`
				dateList.push(dayStr)
				this.pickCarDateParamsList.push({
					year,
					month,
					day,
					weekDay,
				})
			}
			this.pickCarDateList = [
				dateList,
				hourList,
				minList,
			]
		},
		
		confirmPickCarDate(e) {
			const key1 = e[0] || 0
			const key2 = e[1] || 0
			const key3 = e[2] || 0
			
			const year = this.pickCarDateParamsList[key1].year
			const month = this.pickCarDateParamsList[key1].month
			const date = this.pickCarDateParamsList[key1].day
			const weekDay = this.pickCarDateParamsList[key1].weekDay
			const hour = hourList[key2].slice(0,2)
			const minute = minList[key3].slice(0,2)
			const timer = `${year}-${month}-${date} ${hour}:${minute}`
			const timeStamp = new Date(timer).getTime()
			
			const pickTime = {
				year,
				month,
				date,
				weekDay,
				hour,
				minute,
				timer,
				timeStamp,
			}
			
			this.$emit('comfirm', pickTime)
		},
	},
}
</script>

<style lang="scss" scoped>

</style>