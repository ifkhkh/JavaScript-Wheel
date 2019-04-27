// 限制正负数 绑定在 input 上面
const fixNumberInputFormat = (input) => {
    let s = '1234567890-'
    let v = input.value
    let r = ''
    for (let i = 0; i < v.length; i++) {
        let c = v[i]
        let judge = c === '-' && i > 0
        if (s.indexOf(c) === -1 || judge) {
            c = ''
        }
        r += c
    }
    input.value = r
}

// 格式化输入内容为 数字 input，参数为对应的 element
// 一般绑定在 input 事件
const numberInputFormat = (input) => {
    let string = input.value
    let str = ''
    let number = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    for (let i = 0; i < string.length; i++) {
        str += number.indexOf(string[i]) === -1 ? '' : string[i]
    }
    input.value = str
}
// 数量限制输入
const quantityInputFormat = (input) => {
    if (input.value === '') {
        input.value = 0
    }
    numberInputFormat(input)
    input.value = Number(input.value)
}

// 限制正负数 绑定在 input 上面
const fixNumberInputFormat = (input) => {
    let s = '1234567890-'
    let v = input.value
    let r = ''
    for (let i = 0; i < v.length; i++) {
        let c = v[i]
        let judge = c === '-' && i > 0
        if (s.indexOf(c) === -1 || judge) {
            c = ''
        }
        r += c
    }
    input.value = r
}
