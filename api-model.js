import React from "react";
import {Modal} from 'antd'
import _storage from '../utils/storage'
import {log, timeFormat} from '../utils/utils'
import {apiUrl, emptyImg} from "./someUrl";



const fetchRequest = (
    {
        url,
        method,
        tokenKey,
        data,
    }
) => {
    let header = {
        'Content-Type': 'application/json',
        'Auth-Token': tokenKey,
    }

    let o = {
        method: method,
        headers: header
    }
    if (data !== '' && data !== undefined) {
        o.body = JSON.stringify(data)
    }

    return new Promise((resolve, reject) => {
        fetch(url, o).then((response) => {
            if (response.ok) {
                return response.json()
            } else {
                // 抛出 404 500 等错误
                const err = {
                    type: 'http',
                    title: 'http请求状态错误，请截图联系客服',
                    body: (
                        <div>
                            <div>err: {response.status}</div>
                            <div>time: {timeFormat(Date.now())}</div>
                            <div>url: {window.location.href}</div>
                        </div>
                    ),
                }
                throw err
            }
        }).then((r) => {
            const {
                errcode,
                message,
                zh_CN,
            } = r
            if (errcode === 0) {
                resolve(r)
            } else {
                // 抛出服务器错误
                const err = {
                    type: 'api',
                    title: '服务器响应出错了，请截图联系客服',
                    body: (
                        <div>
                            <div>errcode: {errcode}</div>
                            <div>time: {timeFormat(Date.now())}</div>
                            <div>url: {window.location.href}</div>
                            <div>message: {message}</div>
                            <div>zh_CN: {zh_CN}</div>
                        </div>
                    ),
                    ...r,
                }
                throw err
            }
        }).catch((err) => {
            // 统一处理抛出的错误
            log(err.type, err, '-----err :::  is here-----')
            if (reject && err.type === 'api') {
                // 如果接口使用时附带了 catch 处理优先处理
                reject(err)
            } else {
                // 接口使用事没有处理异常错误函数, 默认这么处理
                Modal.error({
                    title: err.title || null,
                    content: err.body,
                })
            }
        })
    })
}

class FetchApi {
    constructor() {
        this.baseUrl = apiUrl
        this.emptyImg = emptyImg
        this.tokenKey = 'kurapika'
        this.userTokenKey = _storage.getValue('userInfo', '')
    }

    judgeTokenKey(useUser) {
        const that = this
        return useUser ? that.userTokenKey : that.tokenKey
    }

    get(path, useUserToken = false) {
        const that = this
        const k = that.judgeTokenKey(useUserToken)
        const url = `${this.baseUrl}${path}`
        return fetchRequest({
            url,
            method: 'GET',
            tokenKey: k,
            data: '',
        })
    }

    fetchGet(
        {
            path,
            useUserToken = false,
        }
    ) {
        const that = this
        const k = that.judgeTokenKey(useUserToken)
        const url = `${this.baseUrl}${path}`
        return fetchRequest({
            url,
            method: 'GET',
            tokenKey: k,
            data: '',
        })
    }

    fetchDelete(
        {
            path,
            useUserToken = false,
        }
    ) {
        const that = this
        const k = that.judgeTokenKey(useUserToken)
        const url = `${this.baseUrl}${path}`
        return fetchRequest({
            url,
            method: 'DELETE',
            tokenKey: k,
            data: '',
        })
    }

    fetchPost(
        {
            path,
            data,
            useUserToken = false,
        }
    ) {
        const that = this
        const k = that.judgeTokenKey(useUserToken)
        const url = `${this.baseUrl}${path}`
        return fetchRequest({
            url,
            method: 'Post',
            tokenKey: k,
            data,
        })
    }
}

export default FetchApi
