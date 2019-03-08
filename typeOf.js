/**
 * judge type of js object
 * @param {Object} o
 * @returns {string} for:Funtion, Array, Object, String, Number, RegExp...
 */
const isTypeOf = (o) => {
    let key = Object.prototype.toString.call(o)
    let r = key.split(' ')[1].split(']')[0]
    return r
}

// compare with result of isTypeOf func
class JSType {
    // 用来跟 isTypeOf 的结果比对
    static function = 'Function'

    static array = 'Array'

    static string = 'String'

    static regexp = 'Regexp'

    static number = 'Number'

    static object = 'Object'

    static element = {
        input: 'HTMLInputElement',
        li: 'HTMLLIElement',
        div: 'HTMLDivElement',
    }
}
