import Cookies from 'js-cookie'
export const Util = {
    title:  function (title) {
        title = title ? title : 'NgController';
        window.document.title = title;
    },
};

const TOKEN_KEY = 'token'
export const setToken = (token) => {
    // Cookies.set(TOKEN_KEY, token, { expires: cookieExpires || 1 })
    Cookies.set(TOKEN_KEY, token)
};

export const getToken = () => {
    const token = Cookies.get(TOKEN_KEY)
    if (token) return token
    else return false
};

export const removeToken = () => {
    Cookies.remove(TOKEN_KEY)
};

/*  表单验证 */
export const ipaddressRules = (rule, value, callback) => {
    if (!value) callback(new Error('内容不能为空！'))
    let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    if (!reg.test(value)) {
        callback(new Error('请检查IP地址格式！'))
    }
    callback()
}
export const dnsserRules = (rule, value, callback) => {
    if (!value) callback(new Error('内容不能为空！'))
    let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    if (!reg.test(value)) {
        callback(new Error('请检查DNS地址格式！'))
    }
    callback()
}
export const ipsubnetRules = (rule, value, callback) => {
    if (!value) callback(new Error('内容不能为空！'))
    let reg = /^(254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)$/
    if (!reg.test(value)) {
        callback(new Error('请检查子网掩码格式！'))
    }
    callback()
}
export const gatewayRules = (rule, value, callback) => {
    if (!value) callback(new Error('内容不能为空！'))
    let reg = /^192\.168(\.(\d|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5]))){2}$/
    if (!reg.test(value)) {
        callback(new Error('请检查网关格式！'))
    }
    callback()
}
