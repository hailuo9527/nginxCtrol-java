 const configList = [
    {
        title: 'CPU 使用率%',
        color: ['#333333','#5BA9FF','#F967B0'],
        url: '/selSysCpuUsage',
        chartData: {
            rows: []
        },
        chartSettings: {
            metrics: ['cpu_system', 'cpu_stolen', 'cpu_user'],
            dimension: ['ctime'],
            labelMap: {
                'cpu_system': 'cpu.system',
                'cpu_stolen': 'cpu.stolen',
                'cpu_user': 'cpu.user',
            },
           /* dataType: function (v) {
                return v + ' %'
              }*/
        },
        loading: false
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
        loading: false
    },
    {
        title: '内存',
        color: ['#272020','#000ADD'],
        url: '/selSysMemory',
        chartData: {
            rows: []
        },
        chartSettings: {
            metrics: ['mem_total', 'men_used'],
            dimension: ['ctime'],
            labelMap: {
                'mem_total': '总量',
                'men_used': '已使用'
            },
        },
        loading: false
    },
    {
        title: '网络流量',
        color: ['#272020','#000ADD'],
        url: '/selSysNetTraffic',
        chartData: {
            rows: []
        },
        chartSettings: {
            metrics: ['mem_total', 'men_used'],
            dimension: ['ctime'],
            labelMap: {
                'mem_total': '总量',
                'men_used': '已使用'
            },
        },
        loading: false
    },
     {
         title: '磁盘使用',
         color: ['#fb9fcc','#a2e7e5'],
         url: '/selSysDiskUsage',
         chartData: {
             rows: []
         },
         chartSettings: {
             metrics: ['disk_total', 'disk_used'],
             dimension: ['ctime'],
             labelMap: {
                 'mem_total': '总量',
                 'men_used': '已使用'
             },
         },
         loading: false
     },
     {
         title: '磁盘读写   ',
         color: ['#6ab1fe','#69d9d5'],
         url: '/selSysDiskIO',
         chartData: {
             rows: []
         },
         chartSettings: {
             metrics: ['disk_total', 'disk_used'],
             dimension: ['ctime'],
             labelMap: {
                 'mem_total': '总量',
                 'men_used': '已使用'
             },
         },
         loading: false
     },
     {
         title: '磁盘延迟',
         color: ['#69d9d5','#6ab1fe'],
         url: '/selSysDiskLatency',
         chartData: {
             rows: []
         },
         chartSettings: {
             metrics: ['disk_total', 'disk_used'],
             dimension: ['ctime'],
             labelMap: {
                 'mem_total': '总量',
                 'men_used': '已使用'
             },
         },
         loading: false
     },
     {
         title: 'CPU Usage, I/O%',
         color: ['#ff8484'],
         url: '/selSysCpuUsageIO',
         chartData: {
             rows: []
         },
         chartSettings: {
             metrics: ['disk_total', 'disk_used'],
             dimension: ['ctime'],
             labelMap: {
                 'mem_total': '总量',
                 'men_used': '已使用'
             },
         },
         loading: false
     },
     {
         title: '磁盘性能指标',
         color: ['#eccc25','#ff7c7c'],
         url: '/selSysDiskIOPS',
         chartData: {
             rows: []
         },
         chartSettings: {
             metrics: ['disk_total', 'disk_used'],
             dimension: ['ctime'],
             labelMap: {
                 'mem_total': '总量',
                 'men_used': '已使用'
             },
         },
         loading: false
     },
     {
         title: '交换分区',
         color: ['#dea4fd','#292ddf'],
         url: '/selSysSwap',
         chartData: {
             rows: []
         },
         chartSettings: {
             metrics: ['disk_total', 'disk_used'],
             dimension: ['ctime'],
             labelMap: {
                 'mem_total': '总量',
                 'men_used': '已使用'
             },
         },
         loading: false
     },

]
 export default configList
