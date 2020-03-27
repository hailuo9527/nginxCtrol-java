import numerify from 'numerify'
import numerifyBytes from 'numerify/lib/plugins/bytes.umd.js'
numerify.register('bytes', numerifyBytes)

import { formatTime } from '../../../libs/vue-expand.js'
const configList = [
    {
        title: 'NGINX Connections/s',
        color: ['#333333','#5BA9FF','#F967B0'],
        url: '/selNginxConnections_s',
        chartData: {
            rows: []
        },
        chartSettings: {
            metrics: ['http_conn_accepted', 'http_conn_dropped'],
            dimension: ['ctime'],
            labelMap: {
                'http_conn_accepted': '连接/S',
                'http_conn_dropped': '关闭/S',

            },
        },
        loading: false,
        yFormatter: function (value, index) {

            return  value
        },
        tooltipFormatter: (item) =>{
            //console.log(item)
            let str = []
            let value = formatTime(item[0].axisValue,'YMDHMS')
            str.push(value)
            str.push('<br />')
            item.map(data => {
                str.push(data.marker)
                str.push(data.seriesName)
                str.push(data.value[1])
                str.push('<br />')
            })

            return str.join(' ')
        },
    },
    {
        title: 'NGINX Requests/s',
        color: ['#333333','#5BA9FF','#F967B0'],
        url: '/selNginxRequests_s',
        chartData: {
            rows: []
        },
        chartSettings: {
            metrics: ['http_request_count'],
            dimension: ['ctime'],
            labelMap: {
                'http_request_count': '请求/S',


            },
        },
        loading: false,
        yFormatter: function (value, index) {

            return  value
        },
        tooltipFormatter: (item) =>{
            //console.log(item)
            let str = []
            let value = formatTime(item[0].axisValue,'YMDHMS')
            str.push(value)
            str.push('<br />')
            item.map(data => {
                str.push(data.marker)
                str.push(data.seriesName)
                str.push(data.value[1])
                str.push('<br />')
            })

            return str.join(' ')
        },
    },
    {
        title: 'NGINX Current Connections',
        color: ['#333333','#5BA9FF','#F967B0'],
        url: '/selNginxCurrentConnections',
        chartData: {
            rows: []
        },
        chartSettings: {
            metrics: ['http_conn_current', 'http_conn_active', 'http_conn_waiting'],
            dimension: ['ctime'],
            labelMap: {
                'http_conn_current': '全部',
                'http_conn_active': '活跃',
                'http_conn_waiting': '空闲'

            },
        },
        loading: false,
        yFormatter: function (value, index) {

            return  value
        },
        tooltipFormatter: (item) =>{
            //console.log(item)
            let str = []
            let value = formatTime(item[0].axisValue,'YMDHMS')
            str.push(value)
            str.push('<br />')
            item.map(data => {
                str.push(data.marker)
                str.push(data.seriesName)
                str.push(data.value[1])
                str.push('<br />')
            })

            return str.join(' ')
        },
    },
    {
        title: 'NGINX Current Requests',
        color: ['#333333','#5BA9FF','#F967B0'],
        url: '/selNginxCurrentRequests',
        chartData: {
            rows: []
        },
        chartSettings: {
            metrics: ['http_request_current', 'http_request_reading', 'http_request_writing'],
            dimension: ['ctime'],
            labelMap: {
                'http_request_current': '全部',
                'http_request_reading': '请求',
                'http_request_writing': '响应'

            },
        },
        loading: false,
        yFormatter: function (value, index) {

            return  value
        },
        tooltipFormatter: (item) =>{
            //console.log(item)
            let str = []
            let value = formatTime(item[0].axisValue,'YMDHMS')
            str.push(value)
            str.push('<br />')
            item.map(data => {
                str.push(data.marker)
                str.push(data.seriesName)
                str.push(data.value[1])
                str.push('<br />')
            })

            return str.join(' ')
        },
    },

]
 export default configList
