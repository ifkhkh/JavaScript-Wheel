// 取 lowerValue - upperValue 间的随机值。
var randomNum = (lowerValue, upperValue) => {
    var choices = upperValue - lowerValue + 1
    var result = Math.floor(Math.random() * choices + lowerValue)
    return result
}

//根据给定过期时间判断用户登录信息是否过期
const compareExpires = (expires) => {
    let oldUnix = Date.parse(expires)
    var nowUnix = Date.now()
    var isExpired = nowUnix > oldUnix
    return isExpired
}
