import axios from '@/libs/api.request'


/* 图表数据接口 */
/*
*  cpu负载
* */
export const getChartData = ( url,{ l4_code, time }) => {
    return axios.request({
        url: url,
        method: 'get',
        params: {
            l4_code, time
        }
    })
}

