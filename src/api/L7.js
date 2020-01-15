import axios from '@/libs/api.request'


/* 获取默认配置 */
export const getChartData = (  ) => {
    return axios.request({
        url: url,
        method: 'get',
        params: {

        }
    })
}
