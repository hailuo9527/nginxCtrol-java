import axios from '@/libs/api.request'


/* 图表数据接口 */
/*
*
* */
export const getChartData = ( url,{ code, time, startTime, endTime, label }) => {
    return axios.request({
        url: url,
        method: 'get',
        params: {
            code, time, startTime, endTime, label
        }
    })
}

export const getSupData = ( url, {code}) => {
    return axios.request({
        url: url,
        method: 'get',
        params: {
            code
        }
    })
}
