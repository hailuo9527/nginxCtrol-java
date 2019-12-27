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
        },
        loading: false
    },
    {
        title: '网络流量',
        color: ['#f96cb3', '#030ddd'],
        url: '/selL4Netflow',
        chartData: {
            rows: []
        },
        chartSettings: {
            metrics: ['temp'],
            dimension: ['data'],
            labelMap: {
                'temp': '流量',
            },
        },
        loading: false
    },
    {
        title: '应用总连接数量',
        color: ['#ff7b7b','#ff7070'],
        url: '/selL4CurrentTotalConnect',
        chartData: {
            rows: []
        },
        chartSettings: {
            metrics: ['temp'],
            dimension: ['data'],
            labelMap: {
                'temp': '总连接数',
            },
        },
        loading: false
    },
    {
        title: '当前每秒应用总连接数',
        color: ['#fc9487','#59d5d0'],
        url: '/selL4CurrentTotalConnects',
        chartData: {
            rows: []
        },
        chartSettings: {
            metrics: ['temp'],
            dimension: ['data'],
            labelMap: {
                'temp': '每秒连接数',
            },
        },
        loading: false
    },
     {
         title: '当前每秒应用总连接数',
         color: ['#fc9487','#59d5d0'],
         url: '/selL4CurrentTotalConnects',
         chartData: {
             rows: []
         },
         chartSettings: {
             metrics: ['temp'],
             dimension: ['data'],
             labelMap: {
                 'temp': '每秒连接数',
             },
         },
         loading: false
     },

]
 export default configList
