/* app板块接口 */

import axios from '@/libs/api.request'

/*
*   添加 app
*
* */
export const addAppInfo = (applicationInfo) => {
    return axios.request({
        url: '/addAppInfo',
        method: 'post',
        data: applicationInfo
    })
}
/*
*   修改 app
*
* */
export const updAppInfo = (applicationInfo) => {
    return axios.request({
        url: '/updAppInfo',
        method: 'post',
        data: applicationInfo
    })
}

/*
*   删除 app
*
* */
export const delAppInfo = ({app_server_id, is_init_conf }) => {
    return axios.request({
        url: '/delAppInfo',
        method: 'post',
        params: {
            app_server_id, is_init_conf
        }
    })
}

/*
*   app 发布
*
* */
export const pushAppDefault = (applicationInfo) => {
    return axios.request({
        url: '/pushAPP/default',
        method: 'post',
        data: applicationInfo
    })
}
/*
*   app 一键发布
*
* */
export const pushApp = (applicationInfo) => {
    return axios.request({
        url: '/pushAPP',
        method: 'post',
        data: applicationInfo
    })
}

/*
*   查询所有应用列表
*
* */
export const selAppInfoList = () => {
    return axios.request({
        url: '/selAppInfoList',
        method: 'post',
    })
}


/*
*   查询所有应用列表
*
* */
export const selAppDetails = ({app_server_id}) => {
    return axios.request({
        url: '/selAppDetails',
        method: 'post',
        params: {
            app_server_id
        }
    })
}

/* 获取流量数据， 绘制关系图 */

export const appViewData = ({app_service_id}) => {
    return axios.request({
        url: '/appViewData',
        method: 'get',
        params: {
            app_service_id
        }
    })
}


/** 根据app主键查询流量调度明细 */

export const selAppDispatch = ({app_server_id}) => {
    return axios.request({
        url: '/selAppDispatch',
        method: 'post',
        params: {app_server_id}
    })
}

/** 修改应用权重 */

export const updAppWeight = (data) => {
    return axios.request({
        url: '/updAppWeight',
        method: 'post',
        data: data
    })
}

/** 展示指定应用HA部署现状
 *  */

export const selAppHAInfo = ({app_server_id}) => {
    return axios.request({
        url: '/selAppHAInfo',
        method: 'post',
        params: {
            app_server_id
        }
    })
}

/*
*  高级流量调度
* */
export const ngxDispatch = (data, {app_service_id}) => {
    return axios.request({
        url: '/ngxDispatch',
        method: 'post',
        data: data,
        params: {
            app_service_id
        }
    })
}

/*
*  高级流量调度
* */
export const selNgxDispatch = ({app_service_id}) => {
    return axios.request({
        url: '/selNgxDispatch',
        method: 'post',
        params: {
            app_service_id
        }
    })
}

/*
* 获取可监听端口
* */
export const getListenPart = ({app_service_id}) => {
    return axios.request({
        url: '/getListenPart',
        method: 'post',
        params: {
            app_service_id
        }
    })
}

/**  APP未同步时差异对比 */

export const compareAppInfo = ({app_service_id}) => {
    return axios.request({
        url: '/compareAppInfo',
        method: 'post',
        params: { app_service_id }
    })
}


/** APP默认配置回滚 */
export const appDefInfoRollBACK = ({app_service_id}) => {
    return axios.request({
        url: '/appDefInfoRollBACK',
        method: 'post',
        params: {app_service_id}
    })
}


/** 导入生产应用 */
export const impApp = (data) => {
    return axios.request({
        url: '/impApp',
        method: 'post',
        data: data
    })
}