import numerify from 'numerify'

import { formatTime, formatFileSize, formatByteSize, formatBpsSize, formatBps } from '../../../libs/vue-expand.js'
const configList = [
    {
        title: 'CPU 使用率%',
        color: ['#333333','#01c864','#F967B0'],
        url: '/selSysCpuUsage',
        chartData: {
            rows: []
        },
        chartSettings: {
            digit: 3,
            metrics: ['cpu_system', 'cpu_stolen', 'cpu_user'],
            dimension: ['ctime'],
            labelMap: {
                'cpu_system': 'cpu.system',
                'cpu_stolen': 'cpu.idle',
                'cpu_user': 'cpu.user',
            },
            yAxisType: ['0,0a']
        },
        loading: false,
        yFormatter: function (value, index) {
            return  value + '%'
        },
        tooltipFormatter: (item) =>{
            let str = []
            let value = formatTime(item[0].axisValue,'YMDHMS')
            str.push(value)
            str.push('<br />')
            item.map(data => {
                str.push(data.marker)
                str.push(data.seriesName)
                str.push(data.value[1] ? data.value[1] + '%': '无数据' )
                str.push('<br />')
            })

            return str.join(' ')
        },
    },
    {
        title: '服务器平均负荷',
        color: ['#f96cb3', '#030ddd'],
        url: '/selSysLoadAverage',
        chartData: {
            rows: []
        },
        chartSettings: {
            metrics: ['load_5', 'load_15'],
            dimension: ['ctime'],
            labelMap: {
                'load_5': 'load.5',
                'load_15': 'load.15'
            },
        },
        loading: false,
    },
    {
        title: '内存',
        color: ['#4447e3','#01c864'],
        url: '/selSysMemory',
        chartData: {
            rows: []
        },
        chartSettings: {
            metrics: ['mem_total', 'mem_available'],
            dimension: ['ctime'],
            labelMap: {
                'mem_total': '总量',
                'mem_available': '可用'
            }
        },
        loading: false,
        yFormatter: function (value, index) {

            return formatByteSize(value)

        },
        tooltipFormatter: (item) =>{

            let str = []
            let value = formatTime(item[0].axisValue,'YMDHMS')
            str.push(value)
            str.push('<br />')
            item.map(data => {
                str.push(data.marker)
                str.push(data.seriesName)
                str.push( data.value[1]? formatFileSize(data.value[1]) : '无数据')
                str.push('<br />')
            })

            return str.join('  ')
        }
    },
    {
        title: '网络流量',
        color: ['#ff7575','#2d31e0'],
        url: '/selSysNetTraffic',
        supUrl:'/selSysNetTrafficDiffType',
        chartData: {
            rows: []
        },
        chartSettings: {
            metrics: ['transmitBytes', 'receiveBytes'],
            dimension: ['ctime'],
            labelMap: {
                'transmitBytes': '发送',
                'receiveBytes': '接收'
            },
        },
        loading: false,
        yFormatter: function (value, index) {
            return formatBpsSize(value)

        },
        tooltipFormatter: (item) =>{

            let str = []
            let value = formatTime(item[0].axisValue,'YMDHMS')
            str.push(value)
            str.push('<br />')
            item.map(data => {
                str.push(data.marker)
                str.push(data.seriesName)
                str.push(data.value[1] ? formatBps(data.value[1]): '无数据')
                str.push('<br />')
            })

            return str.join('  ')
        }
    },
     {
         title: '磁盘使用',
         color: ['#4447e3','#01c864'],
         url: '/selSysDiskUsage',
         supUrl:'/selSysDiskUseDataType',
         chartData: {
             rows: []
         },
         chartSettings: {
             metrics: ['disk_total', 'disk_usedavail'],
             dimension: ['ctime'],
             labelMap: {
                 'disk_total': '总量',
                 'disk_usedavail': '可用'
             },
         },
         loading: false,
         yFormatter: function (value, index) {
            return formatByteSize(value)

         },
         tooltipFormatter: (item) =>{

             let str = []
             let value = formatTime(item[0].axisValue,'YMDHMS')
             str.push(value)
             str.push('<br />')
             item.map(data => {
                 str.push(data.marker)
                 str.push(data.seriesName)
                 str.push(data.value[1] ? formatFileSize(data.value[1]) : '无数据')
                 str.push('<br />')
             })

             return str.join('  ')
         }
     },
     {
         title: '磁盘读写',
         color: ['#4447e3','#ff7575'],
         url: '/selSysDiskIO',
         supUrl: '/selSysDiskIODataType',
         chartData: {
             rows: []
         },
         chartSettings: {
             metrics: ['io_kbs_r', 'io_kbs_w'],
             dimension: ['ctime'],
             labelMap: {
                 'io_kbs_r': '读',
                 'io_kbs_w': '写'
             },
         },
         loading: false,
         yFormatter: function (value, index) {
            return formatByteSize(value) + '/s'

         },
         tooltipFormatter: (item) =>{

             let str = []
             let value = formatTime(item[0].axisValue,'YMDHMS')
             str.push(value)
             str.push('<br />')
             item.map(data => {
                 str.push(data.marker)
                 str.push(data.seriesName)
                 str.push( data.value[1] ? formatFileSize(data.value[1]) + '/s' : '无数据')
                 str.push('<br />')
             })

             return str.join('  ')
         }
     },
     {
         title: '磁盘延迟',
         color: ['#4447e3','#ff7575'],
         url: '/selSysDiskLatency',
         supUrl: '/selSysDiskIODataType',
         chartData: {
             rows: []
         },
         chartSettings: {
             metrics: ['io_wait_r', 'io_wait_w'],
             dimension: ['ctime'],
             labelMap: {
                 'io_wait_r': '读',
                 'io_wait_w': '写',
             },
         },
         loading: false,
         yFormatter: function (value, index) {
             return numerify(value, '0,0')+ 'ms'

         },
         tooltipFormatter: (item) =>{

             let str = []
             let value = formatTime(item[0].axisValue,'YMDHMS')
             str.push(value)
             str.push('<br />')
             item.map(data => {
                 str.push(data.marker)
                 str.push(data.seriesName)
                 str.push(data.value[1] ? numerify(data.value[1], '0,0') + 'ms' : '无数据')
                 str.push('<br />')
             })

             return str.join('  ')
         }
     },
     {
         title: 'CPU Usage, I/O%',
         color: ['#4447e3'],
         url: '/selSysCpuUsageIO',
         chartData: {
             rows: []
         },
         chartSettings: {
             metrics: ['cpu_iowait'],
             dimension: ['ctime'],
             labelMap: {
                 'cpu_iowait': '总量'
             },
         },
         loading: false,
         yFormatter: function (value, index) {

             return  value + '%'
         },
         tooltipFormatter: (item) =>{
             let str = []
             let value = formatTime(item[0].axisValue,'YMDHMS')
             str.push(value)
             str.push('<br />')
             item.map(data => {
                 str.push(data.marker)
                 str.push(data.seriesName)
                 str.push(data.value[1] ? data.value[1] + '%': '无数据' )
                 str.push('<br />')
             })

             return str.join(' ')
         },
     },
     {
         title: '磁盘性能指标(IOPS)',
         color: ['#4447e3','#ff7575'],
         url: '/selSysDiskIOPS',
         supUrl: '/selSysDiskIODataType',
         chartData: {
             rows: []
         },
         chartSettings: {
             metrics: ['io_iops_r', 'io_iops_w'],
             dimension: ['ctime'],
             labelMap: {
                 'io_iops_r': '读',
                 'io_iops_w': '写'
             },
         },
         loading: false
     },
     {
         title: '交换分区',
         color: ['#4447e3','#01c864'],
         url: '/selSysSwap',
         chartData: {
             rows: []
         },
         chartSettings: {
             metrics: ['swap_total', 'swap_usedavail'],
             dimension: ['ctime'],
             labelMap: {
                 'swap_total': '总量',
                 'swap_usedavail': '可用'
             },
         },
         loading: false,
         yFormatter: function (value, index) {

             return  formatByteSize(value)
         },
         tooltipFormatter: (item) =>{

             let str = []
             let value = formatTime(item[0].axisValue,'YMDHMS')
             str.push(value)
             str.push('<br />')
             item.map(data => {
                 str.push(data.marker)
                 str.push(data.seriesName)
                 str.push(data.value[1] ? formatFileSize(data.value[1]) : '无数据')
                 str.push('<br />')
             })

             return str.join('  ')
         }
     },

]
 export default configList
