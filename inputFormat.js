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
