/**
 * 判断是否空对象
 * @param data
 * @returns {boolean}
 */
export function isEmptyObject (data) {
    if (typeof data === 'number') // 数字都不为空
    {
        return false
    }
    if (data === undefined || data === null || data === '') {
        return true
    }
    // 如果是数组
    if (data.__proto__.constructor === Array){
        return data.length === 0
    }
    if (typeof data === 'object') { // 如果是json对象
        for (let i in data) {
            return !1
        }
        return !0
    }
    return false
}

/**
 * json转formdata
 * @param json
 * @returns {string}
 */
export function jsonToFormData (json) {
    let str = ''
    for (let key in json) {
        let value = json[key]
        if (value != null && typeof value !== 'undefined') {
            if (value.__proto__.constructor === Array) {
                for (let index in value) {
                    if (typeof value[index] !== 'function') {
                        str += '&' + key + '=' + value[index]
                    }
                }
                continue
            }
            str += '&' + key + '=' + value
        }
    }
    return str === '' ? str : str.substr(1)
}

/**
 *
 * @param json
 */
export function escapeEmptyValue (json) {
    let data = {}
    for (let key in json) {
        let value = json[key]
        if (value != null && typeof value !== 'undefined') {
            data[key] = value
        }
    }
    return data
}

/**
 * 重置json
 * @param json
 */
export function resetToNullValue (json) {
    for (let key in json) {
        json[key] = null
    }
}

export function copyJson (json) {
    return JSON.parse(JSON.stringify(json))
}

export function getLocationPathQuery () {
    let query = window.location.search
    let json = {}
    if (query) {
        query = query.substr(1)
        let arr = query.split('&')
        for (let index in arr) {
            let str = arr[index]
            json[str.split('=')[0]] = str.split('=')[1]
        }
    }
    return json
}

/* 字符串去空格 */

/* 遍历对象 */
export function objToArray (obj) {
    let arr = []
    Object.keys(obj).forEach(key => {
        arr[key] = obj[key]
    })
    return arr
}
/* 请求成功判断 */
export function asyncOk(res) {
    return res.data.code === 'success'
}

/**
 * 日期格式化
 * @param value
 * @param type
 * @returns {*}
 */
export function formatTime(value, type) {
    if (value == null||value==='') {
        return null;
    }

    let dataTime = '';
    let data = new Date();
    data.setTime(value);
    let year = data.getFullYear();
    let month = data.getMonth() + 1;
    let day = data.getDate();
    let hour = data.getHours();
    let minute = data.getMinutes();
    let second = data.getSeconds();

    if (hour < 10) {
        hour = '0' + hour;
    }

    if (minute < 10) {
        minute = '0' + minute;
    }

    if (second < 10) {
        second = '0' + second;
    }

    if (type === 'YMD') {
        dataTime = year + '-' + month + '-' + day;
    } else if (type === 'YMDHMS') {
        dataTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    } else if (type === 'HMS') {
        dataTime = hour + ':' + minute + ':' + second;
    } else if (type === 'YM') {
        dataTime = year + '-' + month;
    }
    else if (type === 'MD') {
        dataTime = month + '.' + day;
    }
    return dataTime;
}
