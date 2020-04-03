import numerify from 'numerify'
import { formatTime, formatFileSize, formatByteSize, formatBpsSize, formatBps } from '../../../libs/vue-expand.js'
const configList = [
    {
        title: 'NGINX 每秒连接数',
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

    },
    {
        title: 'NGINX 每秒请求数',
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
    },
    {
        title: 'NGINX 当前连接数',
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
    },
    {
        title: 'NGINX 当前请求数',
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
    },
    {
        title: 'NGINX 进程',
        color: ['#333333','#5BA9FF','#F967B0'],
        url: '/selNginxWorkers',
        chartData: {
            rows: []
        },
        chartSettings: {
            metrics: ['workers_count',],
            dimension: ['ctime'],
            labelMap: {
                'workers_count': '进程',
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
                str.push(data.value[1] ? numerify(data.value[1], '0,0') : '无数据')
                str.push('<br />')
            })

            return str.join(' ')
        },
    },
    {
        title: 'NGINX 文件描述符个数',
        color: ['#ff8a8a'],
        url: '/selNginxFileDescriptors',
        chartData: {
            rows: []
        },
        chartSettings: {
            metrics: ['workers_fds_count',],
            dimension: ['ctime'],
            labelMap: {
                'workers_fds_count': '文件描述符',
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
                str.push(data.value[1] ? numerify(data.value[1], '0,0') : '无数据')
                str.push('<br />')
            })

            return str.join(' ')
        },
    },
    {
        title: 'NGINX CPU使用率%',
        color: ['#54ab38'],
        url: '/selNginxCPUUsage',
        chartData: {
            rows: []
        },
        chartSettings: {
            metrics: ['woerkers_cpu_user',],
            dimension: ['ctime'],
            labelMap: {
                'woerkers_cpu_user': 'user',
            },
        },
        loading: false,
        yFormatter: function (value, index) {

            return  numerify(value,'0%' )
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
                str.push(data.value[1] ? numerify(data.value[1], '0%') : '无数据')
                str.push('<br />')
            })

            return str.join(' ')
        },
    },
    {
        title: 'NGINX 内存使用',
        color: ['#f979b9'],
        url: '/selNginxMemoryUsage',
        chartData: {
            rows: []
        },
        chartSettings: {
            metrics: ['worker_mem_rss',],
            dimension: ['ctime'],
            labelMap: {
                'worker_mem_rss': '内存使用',
            },
        },
        loading: false,
        yFormatter: function (value, index) {

            return  formatByteSize(value)
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
                str.push( data.value[1] ? formatFileSize(data.value[1]) : '无数据')
                str.push('<br />')
            })

            return str.join(' ')
        },
    },
    {
        title: 'NGINX 错误响应码',
        color: ['#f979b9', '#333333'],
        url: '/selNginxHttpErrors',
        chartData: {
            rows: []
        },
        chartSettings: {
            metrics: ['http_status_4xx', 'http_status_5xx'],
            dimension: ['ctime'],
            labelMap: {
                'http_status_4xx': '4XX',
                'http_status_5xx': '5XX',
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
                str.push( data.value[1] ? data.value[1] : '无数据')
                str.push('<br />')
            })

            return str.join(' ')
        },
    },
    {
        title: 'NGINX HTTP 版本',
        color: ['#f979b9', '#333333', '#5BA9FF'],
        url: '/selNginxHttpVersion',
        chartData: {
            rows: []
        },
        chartSettings: {
            metrics: ['http_status_1_0', 'http_status_1_1', 'http_status_2_0'],
            dimension: ['ctime'],
            labelMap: {
                'http_status_1_0': 'HTTP1.0',
                'http_status_1_1': 'HTTP1.1',
                'http_status_2_0': 'HTTP2.0',
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
                str.push( data.value[1] ? data.value[1] : '无数据')
                str.push('<br />')
            })

            return str.join(' ')
        },
    },
    {
        title: 'NGINX 负载均衡错误响应',
        color: ['#5BA9FF','#333333'],
        url: '/selNginxUpstreamErrors',
        chartData: {
            rows: []
        },
        chartSettings: {
            metrics: ['upstream_request_failed', 'upstream_response_failed'],
            dimension: ['ctime'],
            labelMap: {
                'upstream_request_failed': '请求',
                'upstream_response_failed': '响应'
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
                str.push( data.value[1] ? value[1] : '无数据')
                str.push('<br />')
            })

            return str.join(' ')
        },
    },
]
 export default configList
