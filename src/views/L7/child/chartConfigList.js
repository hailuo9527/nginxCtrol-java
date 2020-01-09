 const configList = [
    {
        title: 'CPU 使用率%',
        color: ['#333333','#5BA9FF','#F967B0'],
        url: '/selL4Cpu',
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
            dataType: function (v) {
                return v + ' %'
              }
        },
        loading: false
    },
    {
        title: 'Load Average',
        color: ['#f96cb3', '#030ddd'],
        url: '/selL4load',
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
        url: '/selL4Mem',
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
        title: 'Network Traffic',
        color: ['#272020','#000ADD'],
        url: '/selL4Mem',
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

]
 export default configList
