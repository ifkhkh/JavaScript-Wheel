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


//封装 ajax 以及 类
const ajax = function(method, path, data, callback) {
    let r = new XMLHttpRequest()
    r.open(method, path, true)
    r.setRequestHeader('Content-Type', 'application/json')
    r.onreadystatechange = function() {
        if(r.readyState == 4) {
            callback(r.response)
        }
    }
    r.send(data)
}

class ajaxApi {
    constructor() {
        this.baseUrl = 'http://test.hs-print.cn/api'
    }

    get(path, callback) {
        var url = this.baseUrl + path
        ajax('GET', url, '', function(r){
            var data = JSON.parse(r)
            callback(data)
        })
    }

    post(path, data, callback) {
        var url = this.baseUrl + path
        data = JSON.stringify(data)
        ajax('POST', url, data, function(r){
            var data = JSON.parse(r)
            callback(data)
        })
    }
}
