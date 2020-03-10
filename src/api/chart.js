import axios from '@/libs/api.request'


/* 图表数据接口 */
/*
*
* */
export const getChartData = ( url,{ code, time, startTime, endTime }) => {
    return axios.request({
        url: url,
        method: 'get',
        params: {
            code, time, startTime, endTime
        }
    })
}

