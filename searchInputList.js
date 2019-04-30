// 基于 input 的 search，输入内容后根据你的参数显示候选列表
// input 建议放在父元素，比如 <p class="control"></p> 里面
// 点击候选列表后 input.value = 点击的 li.textContent
// 点击的 li 的自定义属性 dataset 会拷贝到 input 上
class InputSearch {
    // 参数示意
    // let option = {
    //     inputEle: _e('#id-search-name-input'),
    //     // 需要做搜索的 input element，要求：是一个 element, oninput 时候 dataset 会被清空
    //     searchOps: {
    //             baseUrl: '/user/customer',
    //             // 搜索的 url 前缀
    //             what: 'name',
    //             // 以什么字段来搜索: name, id
    //             how: 'contain',
    //             // 以什么方式来搜索：contain, exact, startswith
    //             count: 15,
    //             // 搜索候选列表数量
    //         },
    //     templateOps: item => {
    //         let s = JSON.stringify(item)
    //         `<li data-id="${item.id}" data-item='${s}'>${item.name}</li>`
    //     },
    //     // 候选列表 template 函数, 格式就是要用 li，li.dataset.item 用来传递数据
    //     callback: (data) => {},
    //     // 点击候选列表后执行的回调, 此处的 data 就是选中的 li 的 JSON.parse(li.dataset.item)
    //     }
    constructor(option) {
        this.input = option.inputEle
        this.searchOps = option.searchOps
        this.filter = option.filter // 可省略的参数, 有这个参数的话，path 就由 searchOps.baseUrl 和 filter 拼接得到
        this.templateOps = option.templateOps
        this.callback = option.callback
        this.ulClass = 'search-ops'
        this.bindEvent()
    }

    // 直接 InputSearch.render(option) 执行
    static render(...arg) {
        let cls = new this(...arg)
        return cls
    }

    // 判断是否存在候选列表
    isSearchUl(ul) {
        let c = this.ulClass
        return (ul !== null && isTypeOf(ul) === JSType.element.ul && ul.className === c)
    }

    // 移除候选列表
    removeUl(input) {
        let ul = input.nextElementSibling
        if (this.isSearchUl(ul)) {
            ul.remove()
        }
    }

    // 清空 ul，加载 li，绑定每个 li 的点击执行动作
    setUl(ul, ops, input) {
        ul.innerHTML = ''
        appendHtml(ul, ops)
        let list = findAll(ul, 'li')
        list.forEach(l => {
            l.addEventListener('click', e => {
                let s = e.target
                let v = s.textContent
                input.value = v
                copyDataset(s, input)
                this.removeUl(input)
                    let d = s.dataset.item
                    if (d !== undefined) {
                        let data = JSON.parse(d)
                        if (isTypeOf(this.callback) === JSType.function) {
                            this.callback(data)
                        }
                    }
            })
        })
        ul.style.display = 'block'
    }

    // reset ul 候选列表的样式
    resetUlPosition() {
        let input = this.input
        let ul = input.nextElementSibling
        if (this.isSearchUl(ul)) {

            let r = input.getBoundingClientRect()
            let w = r.width
            let h = r.height
            let top = r.bottom
            let mHeight = document.documentElement.clientHeight - top
            ul.style.width = `${w}px`
            ul.style.maxHeight= `${mHeight}px`
            let alertContent = ul.closest('.alert-content')
            if (alertContent === null) {
                // 此处判断是否身处于 .alert-content class 的元素中
                // 避免 ul 的 fixed top、left 和 .alert-content 的 transform 属性冲突
                ul.style.top = `${r.top + h}px`
                ul.style.left = r.left
            }
        }
    }

    // 判断 ul 是否存在再创建
    createUl(input) {
        let c = this.ulClass
        let ul = input.nextElementSibling
        if (this.isSearchUl(ul) === false) {
            let ulHtml = `<ul class=${c}></ul>`
            input.insertAdjacentHTML('afterend', ulHtml)
            ul = input.nextElementSibling
        }
        this.resetUlPosition()
        return ul
    }

    // 根据搜索信息拼接 url
    joinPath(inputV) {
        let searchOps = this.searchOps
        let path = `${searchOps.baseUrl}?page_size=${searchOps.count}&query=[{"${searchOps.what}":{"match":"${searchOps.how}","value":"${encodeSymbol(inputV)}"}}]`
        log('path is', path)
        let filter = this.filter
        if (filter !== undefined) {
            let arg = {}
            arg[searchOps.what] = {
                match: searchOps.how,
                value: inputV,
            }
            // Array.from 新建了数组 避免访问同一块内存
            let qList = Array.from(filter.query)
            qList.push(arg)
            let q = pathFromQuery(qList)
            let obList = Array.from(filter.orderBy)
            let ob = pathFromOrderBy(obList)
            path = `${searchOps.baseUrl}?page_size=${searchOps.count}${encodeSymbol(q)}${encodeSymbol(ob)}`
        }
        return path
    }

    // 绑定 input 相关
    bindInput() {
        this.input.addEventListener('input', _.debounce(e => {
            let s = e.target
            emptyDataset(s)
            let inputV = s.value.trim()
            if (inputV === '') {
                this.removeUl(s)
                return
            }
            let path = this.joinPath(inputV)
            ajaxTokenGet(path, dataList => {
                let ul = this.createUl(s)
                let ops = ''
                if (dataList.length === 0) {
                    this.removeUl(s)
                    return
                }
                dataList.forEach(d => ops += this.templateOps(d))
                this.setUl(ul, ops, s)
            })
        }, 300))
        // 焦点离开 input 删除候选
        this.input.addEventListener('blur', _.debounce(e => {
            let s = e.target
            this.removeUl(s)
        }, 200))
    }

    // 窗口大小重置时，reset 候选列表的样式
    resizeWindow() {
        window.onresize = () => this.resetUlPosition()
        window.onscroll = () => this.resetUlPosition()
    }

    // 绑定事件
    bindEvent() {
        this.bindInput()
        this.resizeWindow()
    }
}


// 举例
// let o = {
// inputEle: _e('.search-input'),
//     searchOps: {
//     baseUrl: '/user/customer',
//         what: 'name',
//         how: 'contain',
//         count: 999
// },
// filter: {
//             query: [
//                 {
//                     "name": {
//                         "match": "exact/contain/like/in/startswith",
//                         "value": "测试"/[a, b, c]
//                     }
//                 },
//                 {
//                     "address": {
//                         "match": "exact",
//                         "value": "杭州软件有限公司"
//                     }
//                 }
//             ],
//             orderBy: [
//                 {
//                     'phone': 'asc'
//                 },
//                 {
//                     'created_time': 'desc'
//                 }
//             ],
//         },
// templateOps: item => {
//     let s = JSON.stringify(item)
//     return `<li data-id="${item.id}" data-item='${s}'>${item.name}</li>`
// },
//     callback: () => {},
// }
//
// InputSearch.render(o)
